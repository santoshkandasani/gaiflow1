import express from 'express';
import cors from 'cors';
import { dbAll, dbGet, dbRun, DB_PATH } from './database.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', async (_req, res) => {
  try {
    const row = await dbGet('SELECT 1 as ok');
    res.json({ status: 'ok', db: row?.ok === 1 ? 'connected' : 'error', file: DB_PATH });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search && search.trim()) {
      query += ' AND (title LIKE ? OR short_desc LIKE ? OR venue LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }
    query += ' ORDER BY is_featured DESC, title ASC';
    const events = await dbAll(query, params);
    const parsed = events.map(e => ({
      ...e,
      rules: (() => {
        try { return JSON.parse(e.rules); } catch { return [e.rules]; }
      })()
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Event
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await dbGet('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({
      ...event,
      rules: (() => {
        try { return JSON.parse(event.rules); } catch { return [event.rules]; }
      })()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const {
      student_type,
      student_name,
      roll_number,
      college_name,
      department,
      year,
      section,
      email,
      phone,
      event_id,
      event_name,
      participation_type,
      team_name,
      team_size,
      emergency_contact,
      bus_required,
      bus_time
    } = req.body;

    if (!student_type || !['internal', 'external'].includes(student_type)) {
      return res.status(400).json({ error: 'Invalid participant type.' });
    }
    if (!student_name || !student_name.trim()) {
      return res.status(400).json({ error: 'Student Name is required.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid Email is required.' });
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ error: 'Valid Phone Number is required.' });
    }
    if (!event_id) {
      return res.status(400).json({ error: 'Please select an event.' });
    }
    if (student_type === 'internal' && (!roll_number || !roll_number.trim())) {
      return res.status(400).json({ error: 'Roll number is required for internal students.' });
    }
    if (student_type === 'external' && (!college_name || !college_name.trim())) {
      return res.status(400).json({ error: 'College name is required for external students.' });
    }

    const duplicate = await dbGet(
      'SELECT id, registration_id FROM registrations WHERE email = ? AND event_id = ?',
      [email.trim().toLowerCase(), event_id]
    );
    if (duplicate) {
      return res.status(409).json({
        error: `You have already registered for this event with ID: ${duplicate.registration_id}`
      });
    }

    const countRow = await dbGet('SELECT count(*) as total FROM registrations');
    const seq = (countRow?.total || 0) + 1;
    const registration_id = `CLR26-${String(seq).padStart(4, '0')}`;

    let resolvedEvent = event_name;
    if (!resolvedEvent) {
      const ev = await dbGet('SELECT title FROM events WHERE id = ?', [event_id]);
      resolvedEvent = ev?.title || event_id;
    }

    const finalCollege = student_type === 'internal'
      ? 'R.V.R. & J.C. College of Engineering (Autonomous)'
      : (college_name || '').trim();

    const isBus = student_type === 'external' && bus_required ? 1 : 0;
    const bTime = isBus ? bus_time : null;

    await dbRun(
      `INSERT INTO registrations (
        registration_id, student_type, student_name, roll_number, college_name,
        department, year, section, email, phone, event_id, event_name,
        participation_type, team_name, team_size, emergency_contact,
        bus_required, bus_time, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registration_id, student_type, student_name.trim(),
        student_type === 'internal' ? (roll_number || '').trim().toUpperCase() : null,
        finalCollege, department || '', year || '',
        student_type === 'internal' ? (section || '').trim().toUpperCase() : null,
        email.trim().toLowerCase(), phone.trim(),
        event_id, resolvedEvent, participation_type || 'Individual',
        team_name ? team_name.trim() : null, team_size ? Number(team_size) : 1,
        emergency_contact ? emergency_contact.trim() : null,
        isBus, bTime, new Date().toISOString()
      ]
    );

    const record = await dbGet('SELECT * FROM registrations WHERE registration_id = ?', [registration_id]);
    res.status(201).json({ success: true, message: 'Registration Successful', registration: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Announcements
app.get('/api/announcements', async (_req, res) => {
  try {
    const list = await dbAll('SELECT * FROM announcements ORDER BY id DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Results
app.get('/api/results', async (_req, res) => {
  try {
    const results = await dbAll('SELECT * FROM results ORDER BY id ASC');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin stats
app.get('/api/admin/stats', async (_req, res) => {
  try {
    const totalReg = await dbGet('SELECT count(*) as count FROM registrations');
    const internalReg = await dbGet("SELECT count(*) as count FROM registrations WHERE student_type = 'internal'");
    const externalReg = await dbGet("SELECT count(*) as count FROM registrations WHERE student_type = 'external'");
    const busCount = await dbGet('SELECT count(*) as count FROM registrations WHERE bus_required = 1');
    const eventsCount = await dbGet('SELECT count(*) as count FROM events');

    res.json({
      totalRegistrations: totalReg?.count || 0,
      internalRegistrations: internalReg?.count || 0,
      externalRegistrations: externalReg?.count || 0,
      busRequirements: busCount?.count || 0,
      totalEvents: eventsCount?.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin registrations list
app.get('/api/admin/registrations', async (req, res) => {
  try {
    const { student_type, search } = req.query;
    let sql = 'SELECT * FROM registrations WHERE 1=1';
    const params = [];
    if (student_type && student_type !== 'all') {
      sql += ' AND student_type = ?';
      params.push(student_type);
    }
    if (search && search.trim()) {
      sql += ' AND (student_name LIKE ? OR registration_id LIKE ? OR roll_number LIKE ?)';
      const t = `%${search.trim()}%`;
      params.push(t, t, t);
    }
    sql += ' ORDER BY id DESC';
    const list = await dbAll(sql, params);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start backend
app.listen(PORT, () => {
  console.log(`COLORIDO 2K26 standalone backend listening on port ${PORT}`);
});
