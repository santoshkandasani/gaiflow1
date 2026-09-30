import { Router, Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from './database.ts';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', async (_req: Request, res: Response) => {
  try {
    const row = await dbGet<{ ok: number }>('SELECT 1 as ok');
    res.json({ status: 'ok', db: row?.ok === 1 ? 'connected' : 'unknown', timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// GET /api/events
apiRouter.get('/events', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && typeof search === 'string' && search.trim()) {
      query += ' AND (title LIKE ? OR short_desc LIKE ? OR venue LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY is_featured DESC, title ASC';
    const events = await dbAll(query, params);

    // Parse JSON rules for each event
    const parsed = events.map(e => ({
      ...e,
      rules: (() => {
        try {
          return JSON.parse(e.rules);
        } catch {
          return [e.rules];
        }
      })()
    }));

    res.json(parsed);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/events/:id
apiRouter.get('/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await dbGet('SELECT * FROM events WHERE id = ?', [id]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const parsed = {
      ...event,
      rules: (() => {
        try {
          return JSON.parse(event.rules);
        } catch {
          return [event.rules];
        }
      })()
    };
    res.json(parsed);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/register
apiRouter.post('/register', async (req: Request, res: Response) => {
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

    // Basic Validations
    if (!student_type || !['internal', 'external'].includes(student_type)) {
      return res.status(400).json({ error: 'Invalid participant type. Must be Internal or External.' });
    }
    if (!student_name || !student_name.trim()) {
      return res.status(400).json({ error: 'Student Name is required.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid Email address is required.' });
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ error: 'Valid Phone Number is required.' });
    }
    if (!event_id) {
      return res.status(400).json({ error: 'Please select an event.' });
    }

    // Specific rules for Internal
    if (student_type === 'internal') {
      if (!roll_number || !roll_number.trim()) {
        return res.status(400).json({ error: 'Roll Number is required for internal students.' });
      }
    }

    // Specific rules for External
    if (student_type === 'external') {
      if (!college_name || !college_name.trim()) {
        return res.status(400).json({ error: 'College Name is required for external participants.' });
      }
      if (bus_required && (!bus_time || !bus_time.trim())) {
        return res.status(400).json({ error: 'Please select a bus timing preference.' });
      }
    }

    // Check duplicate registration for same event
    const duplicate = await dbGet(
      'SELECT id, registration_id FROM registrations WHERE email = ? AND event_id = ?',
      [email.trim().toLowerCase(), event_id]
    );

    if (duplicate) {
      return res.status(409).json({
        error: `You have already registered for this event with ID: ${duplicate.registration_id}`
      });
    }

    // Generate unique Registration ID
    const totalCount = await dbGet<{ total: number }>('SELECT count(*) as total FROM registrations');
    const nextSeq = (totalCount?.total || 0) + 1;
    const registration_id = `CLR26-${String(nextSeq).padStart(4, '0')}`;

    // Resolve event title if missing
    let resolvedEventName = event_name;
    if (!resolvedEventName) {
      const ev = await dbGet<{ title: string }>('SELECT title FROM events WHERE id = ?', [event_id]);
      resolvedEventName = ev?.title || event_id;
    }

    const finalCollegeName =
      student_type === 'internal'
        ? 'R.V.R. & J.C. College of Engineering (Autonomous)'
        : (college_name || '').trim();

    const finalBusRequired = student_type === 'external' && bus_required ? 1 : 0;
    const finalBusTime = student_type === 'external' && finalBusRequired ? bus_time : null;

    const createdAt = new Date().toISOString();

    await dbRun(
      `INSERT INTO registrations (
        registration_id, student_type, student_name, roll_number, college_name,
        department, year, section, email, phone, event_id, event_name,
        participation_type, team_name, team_size, emergency_contact,
        bus_required, bus_time, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registration_id,
        student_type,
        student_name.trim(),
        student_type === 'internal' ? (roll_number || '').trim().toUpperCase() : null,
        finalCollegeName,
        department || '',
        year || '',
        student_type === 'internal' ? (section || '').trim().toUpperCase() : null,
        email.trim().toLowerCase(),
        phone.trim(),
        event_id,
        resolvedEventName,
        participation_type || 'Individual',
        team_name ? team_name.trim() : null,
        team_size ? Number(team_size) : 1,
        emergency_contact ? emergency_contact.trim() : null,
        finalBusRequired,
        finalBusTime,
        createdAt
      ]
    );

    const savedRecord = await dbGet('SELECT * FROM registrations WHERE registration_id = ?', [registration_id]);

    res.status(201).json({
      success: true,
      message: 'Registration Successful!',
      registration: savedRecord
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Server error occurred while saving registration.' });
  }
});

// GET /api/announcements
apiRouter.get('/announcements', async (_req: Request, res: Response) => {
  try {
    const list = await dbAll('SELECT * FROM announcements ORDER BY id DESC');
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/results
apiRouter.get('/results', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM results WHERE 1=1';
    const params: any[] = [];
    if (category && typeof category === 'string' && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY id ASC';
    const results = await dbAll(query, params);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/gallery
apiRouter.get('/gallery', (_req: Request, res: Response) => {
  const gallery = [
    {
      id: 1,
      title: 'Grand Campus & Academic Pavilions',
      category: 'Campus',
      image: '/campus.jpg',
      caption: 'The majestic R.V.R. & J.C. College of Engineering campus set to host COLORIDO 2K26.'
    },
    {
      id: 2,
      title: 'COLORIDO 2K26 Official Festival Poster',
      category: 'Performances',
      image: '/colorido-poster.png',
      caption: 'Official artwork and theme banner for the National Cultural & Sports Fest.'
    },
    {
      id: 3,
      title: 'Opening Ceremony & Torch Lighting',
      category: 'Opening Ceremony',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      caption: 'Inaugural lamp lighting and ceremonial procession with academic dignitaries.'
    },
    {
      id: 4,
      title: 'Battle of the Bands - Live Electric',
      category: 'Cultural Events',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      caption: 'Electrifying riffs and vocal battles under the Open Air Theatre spotlight.'
    },
    {
      id: 5,
      title: 'Basketball Championship Final',
      category: 'Sports Events',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      caption: 'Fast-paced baseline drives and defensive showdowns on the floodlit court.'
    },
    {
      id: 6,
      title: 'Classical & Thematic Choreoday Showcase',
      category: 'Performances',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      caption: 'Expressive rhythm and visual synchronization by collegiate dance crews.'
    },
    {
      id: 7,
      title: 'Volleyball Championship Spike',
      category: 'Sports Events',
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
      caption: 'High-flying spikes and diving digs at the SAC Volleyball Grounds.'
    },
    {
      id: 8,
      title: 'Fine Arts & Rangoli Expressions',
      category: 'Cultural Events',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      caption: 'Intricate patterns and vivid color palettes painted by young visionaries.'
    },
    {
      id: 9,
      title: 'Grand Valedictory & Prize Distribution',
      category: 'Prize Distribution',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      caption: 'Celebrating champions, trophy handovers, and mementos of excellence.'
    }
  ];
  res.json(gallery);
});

// POST /api/contact
apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    await dbRun(
      'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), phone || null, subject || null, message.trim(), new Date().toISOString()]
    );

    res.status(201).json({ success: true, message: 'Your message has been sent to the organizing committee.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === 'admin' && (password === 'colorido2026' || password === 'admin123')) {
    // Return demo auth token
    return res.json({
      success: true,
      token: 'admin-auth-token-colorido-2026',
      user: { name: 'Faculty Coordinator', role: 'Super Admin' }
    });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// Admin stats
apiRouter.get('/admin/stats', async (_req: Request, res: Response) => {
  try {
    const totalReg = await dbGet<{ count: number }>('SELECT count(*) as count FROM registrations');
    const internalReg = await dbGet<{ count: number }>("SELECT count(*) as count FROM registrations WHERE student_type = 'internal'");
    const externalReg = await dbGet<{ count: number }>("SELECT count(*) as count FROM registrations WHERE student_type = 'external'");
    const busCount = await dbGet<{ count: number }>('SELECT count(*) as count FROM registrations WHERE bus_required = 1');
    const eventsCount = await dbGet<{ count: number }>('SELECT count(*) as count FROM events');
    const msgCount = await dbGet<{ count: number }>('SELECT count(*) as count FROM contact_messages');

    res.json({
      totalRegistrations: totalReg?.count || 0,
      internalRegistrations: internalReg?.count || 0,
      externalRegistrations: externalReg?.count || 0,
      busRequirements: busCount?.count || 0,
      totalEvents: eventsCount?.count || 0,
      totalMessages: msgCount?.count || 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin get registrations with filters
apiRouter.get('/admin/registrations', async (req: Request, res: Response) => {
  try {
    const { student_type, event_id, bus_required, search } = req.query;
    let query = 'SELECT * FROM registrations WHERE 1=1';
    const params: any[] = [];

    if (student_type && student_type !== 'all') {
      query += ' AND student_type = ?';
      params.push(student_type);
    }

    if (event_id && event_id !== 'all') {
      query += ' AND event_id = ?';
      params.push(event_id);
    }

    if (bus_required === '1' || bus_required === 'true') {
      query += ' AND bus_required = 1';
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ' AND (student_name LIKE ? OR registration_id LIKE ? OR email LIKE ? OR roll_number LIKE ? OR college_name LIKE ?)';
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY id DESC';
    const list = await dbAll(query, params);
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Student lookup (My Profile / Track Registrations for Internal & External students)
apiRouter.get('/student/lookup', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Please provide roll number, email, or registration ID' });
    }

    const term = query.trim();
    const registrations = await dbAll(
      `SELECT * FROM registrations 
       WHERE LOWER(roll_number) = LOWER(?) 
          OR LOWER(email) = LOWER(?) 
          OR LOWER(registration_id) = LOWER(?) 
          OR phone = ?
       ORDER BY id DESC`,
      [term, term, term, term]
    );

    if (registrations.length === 0) {
      return res.status(404).json({ error: 'No registrations found matching "' + term + '"' });
    }

    // Attach event venue and schedule details
    const enriched = await Promise.all(
      registrations.map(async (reg) => {
        const ev = await dbGet('SELECT venue, date, time, category FROM events WHERE id = ?', [reg.event_id]);
        return {
          ...reg,
          event_venue: ev?.venue || 'Campus Venue',
          event_date: ev?.date || 'October 9, 2026',
          event_time: ev?.time || '10:00 AM – 5:00 PM',
          event_category: ev?.category || 'General'
        };
      })
    );

    const latest = registrations[0];
    const studentProfile = {
      student_name: latest.student_name,
      student_type: latest.student_type,
      roll_number: latest.roll_number,
      college_name: latest.college_name,
      department: latest.department,
      year: latest.year,
      section: latest.section,
      email: latest.email,
      phone: latest.phone,
      bus_required: latest.bus_required,
      bus_time: latest.bus_time,
      registrations: enriched
    };

    res.json(studentProfile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Student cancel registration
apiRouter.delete('/student/registrations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM registrations WHERE id = ? OR registration_id = ?', [id, id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ success: true, message: 'Registration cancelled successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin event analytics breakdown for charts
apiRouter.get('/admin/event-analytics', async (_req: Request, res: Response) => {
  try {
    const events = await dbAll('SELECT id, title, category FROM events ORDER BY title ASC');
    const registrations = await dbAll('SELECT event_id, student_type FROM registrations');

    const breakdown = events.map(e => {
      const match = registrations.filter(r => r.event_id === e.id);
      const internalCount = match.filter(r => r.student_type === 'internal').length;
      const externalCount = match.filter(r => r.student_type === 'external').length;
      return {
        event_id: e.id,
        event_name: e.title,
        category: e.category,
        total: match.length,
        internal: internalCount,
        external: externalCount
      };
    });

    res.json(breakdown);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin delete registration
apiRouter.delete('/admin/registrations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await dbRun('DELETE FROM registrations WHERE id = ? OR registration_id = ?', [id, id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Registration record not found' });
    }
    res.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin get contact messages
apiRouter.get('/admin/messages', async (_req: Request, res: Response) => {
  try {
    const messages = await dbAll('SELECT * FROM contact_messages ORDER BY id DESC');
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
