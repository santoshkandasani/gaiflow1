import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve(process.cwd(), 'backend', 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
const DB_PATH = path.join(DB_DIR, 'colorido.db');

export let db: Database;

export function persistDb() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

export function dbRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  try {
    db.run(sql, params);
    persistDb();
    const lastIDRes = db.exec('SELECT last_insert_rowid() as id');
    const lastID = (lastIDRes[0]?.values[0]?.[0] as number) || 0;
    return Promise.resolve({ lastID, changes: 1 });
  } catch (err: any) {
    return Promise.reject(err);
  }
}

export function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject() as T;
      stmt.free();
      return Promise.resolve(row);
    }
    stmt.free();
    return Promise.resolve(undefined);
  } catch (err: any) {
    return Promise.reject(err);
  }
}

export function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows: T[] = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject() as T);
    }
    stmt.free();
    return Promise.resolve(rows);
  } catch (err: any) {
    return Promise.reject(err);
  }
}

export async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log('Loaded existing SQLite database from', DB_PATH);
    } catch {
      db = new SQL.Database();
      console.log('Created fresh SQLite database at', DB_PATH);
    }
  } else {
    db = new SQL.Database();
    console.log('Initialized new SQLite database at', DB_PATH);
  }

  // Create tables if they do not exist
  await dbRun(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      gender TEXT DEFAULT 'All',
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL,
      date TEXT NOT NULL DEFAULT 'October 9, 2026',
      time TEXT NOT NULL DEFAULT '10:00 AM – 5:00 PM',
      venue TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      rules TEXT NOT NULL,
      instructions TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      image_url TEXT NOT NULL,
      icon_name TEXT NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id TEXT UNIQUE NOT NULL,
      student_type TEXT NOT NULL,
      student_name TEXT NOT NULL,
      roll_number TEXT,
      college_name TEXT NOT NULL,
      department TEXT NOT NULL,
      year TEXT NOT NULL,
      section TEXT,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      event_id TEXT NOT NULL,
      event_name TEXT NOT NULL,
      participation_type TEXT NOT NULL,
      team_name TEXT,
      team_size INTEGER DEFAULT 1,
      emergency_contact TEXT,
      bus_required INTEGER DEFAULT 0,
      bus_time TEXT,
      created_at TEXT NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT NOT NULL,
      category TEXT NOT NULL,
      winner TEXT NOT NULL,
      college_winner TEXT NOT NULL,
      runner_up TEXT NOT NULL,
      college_runner TEXT NOT NULL,
      score_detail TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Seed events if empty
  const count = await dbGet<{ count: number }>('SELECT count(*) as count FROM events');
  if (!count || count.count === 0) {
    console.log('Seeding COLORIDO 2K26 initial event data...');
    const seedEvents = [
      {
        id: 'cult-music-band',
        title: 'Music & Band',
        category: 'Cultural',
        subcategory: 'Solo & Group',
        gender: 'All',
        short_desc: 'Solo and group music performances, acoustic battles, and band showcase.',
        full_desc: 'Showcase your musical prowess at COLORIDO 2K26. Open to both solo vocalists/instrumentalists and college band crews. Unleash original or cover tracks across Indian classical, western, fusion, or rock genres with professional sound setups.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Open Air Theatre (OAT)',
        eligibility: 'Open to verified undergraduate and postgraduate engineering & college students.',
        rules: JSON.stringify([
          'Time limit: Solo 4+1 mins; Band/Group 10+2 mins (including stage setup).',
          'Standard 5-piece drum kit and standard PA system provided. Artists must bring their own guitars, keyboards, and auxiliary pedals.',
          'Obscenity, offensive lyrics, or hate speech will lead to immediate disqualification.',
          'Decisions made by the panel of certified music industry judges are final and binding.'
        ]),
        instructions: 'Report to backstage manager by 9:30 AM with college ID card and soundtrack USB drive if using backing tracks (solo only).',
        is_featured: 1,
        image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Music'
      },
      {
        id: 'cult-dance',
        title: 'Dance',
        category: 'Cultural',
        subcategory: 'Solo & Group',
        gender: 'All',
        short_desc: 'Solo and group dance performances across classical, folk, cinematic and hip-hop.',
        full_desc: 'Let the rhythm take over the grand stage. From the grace of classical Bharatanatyam and Kuchipudi to high-octane western hip-hop and cinematic fusion, COLORIDO 2K26 celebrates the spirit of movement.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Silver Jubilee Auditorium',
        eligibility: 'All collegiate participants with valid college ID cards.',
        rules: JSON.stringify([
          'Time limit: Solo 3+1 minutes; Group 6+2 minutes.',
          'Team size for group: 4 to 12 performers.',
          'Audio track must be submitted in MP3 format (min 320 kbps) at the registration desk before 9:00 AM.',
          'Props are allowed with prior notification. No fire, water, or hazardous liquids permitted on stage.'
        ]),
        instructions: 'Costume check and green room allocation begin at 9:00 AM. Green rooms located behind Main Auditorium.',
        is_featured: 1,
        image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Sparkles'
      },
      {
        id: 'sports-basketball-boys',
        title: 'Basketball',
        category: 'Sports',
        subcategory: 'Boys Tournament',
        gender: 'Boys',
        short_desc: 'High-octane inter-college basketball competition under floodlights.',
        full_desc: 'An intense knockout basketball tournament bringing together top college teams from across Andhra Pradesh and neighbouring states. Fast breaks, precision three-pointers, and elite court sportsmanship.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Outdoor Floodlit Basketball Complex',
        eligibility: 'College teams consisting of max 12 players (5 court + 7 bench). All players must carry official college IDs.',
        rules: JSON.stringify([
          'FIBA tournament rules apply with 10-minute quarters (running clock except last 2 minutes).',
          'Knockout format. Teams must be in matching jerseys with visible numbers.',
          'Any unsportsmanlike conduct or foul language will result in technical foul or team ejection.',
          'Referees appointed by AP State Basketball Association.'
        ]),
        instructions: 'Team captains must report for fixture draw at 9:15 AM sharp at the Sports Pavilion.',
        is_featured: 1,
        image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Trophy'
      },
      {
        id: 'sports-volleyball-boys',
        title: 'Volleyball',
        category: 'Sports',
        subcategory: 'Boys Tournament',
        gender: 'Boys',
        short_desc: 'Competitive inter-college volleyball tournament on standard clay/synthetic courts.',
        full_desc: 'Experience roaring spikes, lightning-fast digs, and electric team coordination in the COLORIDO 2K26 Volleyball championship.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'SAC Volleyball Grounds',
        eligibility: 'Men student teams (Max 12 players: 6 on court + 6 substitutes).',
        rules: JSON.stringify([
          'Best of 3 sets for knockout rounds (25 points each; deciding set 15 points).',
          'VFI (Volleyball Federation of India) rules strictly enforced.',
          'Rotation and uniform jersey regulations strictly followed.',
          'Official Cosco Super Volley balls provided.'
        ]),
        instructions: 'Warm-up courts open at 9:00 AM. Reporting time: 9:30 AM at Court 1 desk.',
        is_featured: 1,
        image_url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Activity'
      },
      {
        id: 'cult-fine-arts',
        title: 'Fine Arts',
        category: 'Cultural',
        subcategory: 'Creative Arts & Design',
        gender: 'All',
        short_desc: 'Showcase creativity and imagination through painting, sketching, and rangoli.',
        full_desc: 'Unleash your visual imagination. Compete in watercolor/oil painting, pencil shading, cartooning, and cultural rangoli design with themes declared on the spot.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Civil Engineering Drawing Halls (3rd Floor)',
        eligibility: 'Individual participants and pairs for Rangoli. Open to all students.',
        rules: JSON.stringify([
          'Drawing sheets/cartridge papers (A3 size) provided by organizers.',
          'Participants must bring their own paints, brushes, pencils, and colors.',
          'Duration: 2 hours from theme announcement.',
          'Judging criteria: Creativity, relevance to theme, neatness, and artistic technique.'
        ]),
        instructions: 'Themes revealed at 10:00 AM sharp. No smartphones or reference prints allowed inside hall.',
        is_featured: 1,
        image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Palette'
      },
      {
        id: 'sports-tt-boys',
        title: 'Table Tennis',
        category: 'Sports',
        subcategory: 'Boys & Girls Singles',
        gender: 'All',
        short_desc: 'Fast-paced competitive table tennis singles & doubles championship.',
        full_desc: 'Precision spins, ferocious smashes, and reflex battles in the state-of-the-art RVR&JC Indoor Sports Complex.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Indoor Sports Complex (Table 1 - 4)',
        eligibility: 'Singles and Doubles entries for both Men and Women.',
        rules: JSON.stringify([
          'ITTF standard rules apply. 11-point games, best of 5 sets in knockouts.',
          'Stag official tournament balls provided. Players must bring standard certified paddles.',
          'White shirts/jerseys prohibited as the match ball is white.'
        ]),
        instructions: 'Table assignments will be drawn at 9:30 AM at the Indoor Pavilion desk.',
        is_featured: 1,
        image_url: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Target'
      },
      // Additional Cultural Events
      {
        id: 'cult-choreoday',
        title: 'Choreoday',
        category: 'Cultural',
        subcategory: 'Theme Based Choreography',
        gender: 'All',
        short_desc: 'Mega thematic dance drama and cinematic synchronized choreography competition.',
        full_desc: 'Choreoday is the crown jewel of COLORIDO cultural competitions. College troupes craft compelling narratives, synchronization, visual formations, and theatrical dance routines.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Main Open Stage / OAT',
        eligibility: 'College groups of 8 to 16 participants.',
        rules: JSON.stringify([
          'Time limit: 8 minutes performance + 2 minutes setup/clearing.',
          'Every team must present a clear cohesive theme or story arc.',
          'Background audio track submitted via USB in advance.',
          'Costume, lighting sync, formations, and choreographic transitions carry key marks.'
        ]),
        instructions: 'Stage rehearsal slots allocated on first-come-first-serve basis between 8:30 AM and 9:45 AM.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Sparkles'
      },
      {
        id: 'cult-dramatics',
        title: 'Dramatics',
        category: 'Cultural',
        subcategory: 'Skit & Street Play',
        gender: 'All',
        short_desc: 'Skit, mime, and Street Play (Nukkad Natak) addressing vibrant social themes.',
        full_desc: 'Harness the dramatic power of voice modulation, emotional expression, and satirical street theater. Teams can perform stage skits or vibrant outdoor Nukkad Natak.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Open Air Amphitheatre',
        eligibility: 'Teams of 6 to 15 members.',
        rules: JSON.stringify([
          'Time limit: Max 10 minutes per play.',
          'Languages permitted: English, Telugu, Hindi.',
          'Live percussion (Dholak, Tambourine, Daflis) encouraged for Street Play.',
          'No defamation or targeted political/religious hate allowed.'
        ]),
        instructions: 'Props inspection at 9:45 AM at the Amphitheatre backstage desk.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Film'
      },
      {
        id: 'cult-fashion-show',
        title: 'Fashion Show',
        category: 'Cultural',
        subcategory: 'Ethno-Modern Fusion',
        gender: 'All',
        short_desc: 'Ramp walk spectacle highlighting traditional heritage fused with modern couture.',
        full_desc: 'The signature runway event of COLORIDO 2K26 celebrating sustainable handlooms, Andhra cultural motifs, and high-fashion avant-garde concepts.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Silver Jubilee Auditorium Stage',
        eligibility: 'College fashion society contingents (8-14 models + 2 designers/stylists).',
        rules: JSON.stringify([
          'Time limit: 10 minutes on stage.',
          'Garments must maintain decency and college decorum.',
          'Judging parameters: Theme innovation, poise, ramp walk, posture, and coordination.'
        ]),
        instructions: 'Audio tracks and light cue sheets must be handed to AV engineers by 11:00 AM.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Crown'
      },
      {
        id: 'cult-tekraft',
        title: 'Tekraft Events',
        category: 'Cultural',
        subcategory: 'Digital Arts & Short Film',
        gender: 'All',
        short_desc: 'Digital creativity competitions including short films, digital animation, and UI crafts.',
        full_desc: 'Where engineering meets artistic expression. Showcase college short films (max 7 mins), motion graphic reels, and 3D visual art.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'CSE Multimedia Seminar Hall',
        eligibility: 'Individual or teams of up to 4 members.',
        rules: JSON.stringify([
          'Short film duration: Under 7 minutes including titles and credits.',
          'Content must be 100% original work produced by college students.',
          'Deliverable: 1080p MP4 file submitted via pen drive.'
        ]),
        instructions: 'Screening commences at 10:30 AM with Q&A round before the jury.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Cpu'
      },
      {
        id: 'cult-literary',
        title: 'Literary',
        category: 'Cultural',
        subcategory: 'Debate, Elocution & Quiz',
        gender: 'All',
        short_desc: 'War of words, parliamentary debate, poetry slam, and general knowledge quiz.',
        full_desc: 'Challenge your eloquence, wit, and analytical acumen in COLORIDO 2K26 Literary Conclave.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Mechanical Seminar Hall 1',
        eligibility: 'Individual entries for Elocution/Poetry; 2-member teams for Quiz & Debate.',
        rules: JSON.stringify([
          'Oxford style debate with 3 mins speech + 1 min rebuttal.',
          'Medium of speech: English.',
          'Buzzer round quiz covers sports, pop culture, science, and history.'
        ]),
        instructions: 'Prelims quiz written test starts at 10:00 AM; top 6 teams qualify for on-stage finals.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
        icon_name: 'BookOpen'
      },
      // Additional Sports Events
      {
        id: 'sports-tb-girls',
        title: 'Throwball',
        category: 'Sports',
        subcategory: 'Girls Tournament',
        gender: 'Girls',
        short_desc: 'Exciting inter-college throwball tournament for women collegiate athletes.',
        full_desc: 'Precision catching, rapid releases, and tactical court positioning in this thrilling women throwball championship.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'SAC Throwball Arena',
        eligibility: 'Women student teams (Max 10 players: 7 on court + 3 reserves).',
        rules: JSON.stringify([
          'Match format: Best of 3 sets of 25 points each.',
          'Throwball Federation of India rules applicable.',
          'Ball must be caught with both hands and released with one hand within 3 seconds.'
        ]),
        instructions: 'Line-up sheets must be signed 15 minutes prior to match schedule.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Flame'
      },
      {
        id: 'sports-tennikoit-girls',
        title: 'TenniKoit',
        category: 'Sports',
        subcategory: 'Girls Tournament',
        gender: 'Girls',
        short_desc: 'Swift ring-catching and lobbing action in the TenniKoit girls competition.',
        full_desc: 'Demonstrate agile footwork and swift aerial ring dynamics in the COLORIDO 2K26 Tennikoit championship (Singles & Doubles).',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'SAC TenniKoit Courts',
        eligibility: 'Women college students. Singles & Doubles registrations available.',
        rules: JSON.stringify([
          'Standard Tennikoit ring used. Best of 3 sets of 21 points.',
          'Wobbling and shaking ring during delivery is a fault.',
          'Only one hand permitted to catch and release the ring.'
        ]),
        instructions: 'Court allocation begins at 10:00 AM after briefing by chief referee.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Shield'
      },
      {
        id: 'sports-tt-girls',
        title: 'Table Tennis (Girls)',
        category: 'Sports',
        subcategory: 'Girls Tournament',
        gender: 'Girls',
        short_desc: 'Competitive table tennis singles and doubles tournament for women collegiate players.',
        full_desc: 'Fast-paced, high-spin table tennis tournament for collegiate women. Compete on international standard Stag tables in the air-conditioned indoor pavilion.',
        date: 'October 9, 2026',
        time: '10:00 AM – 5:00 PM',
        venue: 'Indoor Sports Complex (Tables 5 - 8)',
        eligibility: 'Open to verified collegiate women students (Singles & Doubles).',
        rules: JSON.stringify([
          'ITTF standard 11-point games, best of 5 sets in knockouts.',
          'Tournament white balls provided. Players must bring standard certified paddles.',
          'White shirts/jerseys prohibited as the match ball is white.'
        ]),
        instructions: 'Reporting time 9:30 AM at the Indoor Pavilion desk for fixture draw.',
        is_featured: 0,
        image_url: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
        icon_name: 'Target'
      }
    ];

    for (const ev of seedEvents) {
      await dbRun(
        `INSERT OR REPLACE INTO events (id, title, category, subcategory, gender, short_desc, full_desc, date, time, venue, eligibility, rules, instructions, is_featured, image_url, icon_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ev.id, ev.title, ev.category, ev.subcategory, ev.gender, ev.short_desc, ev.full_desc, ev.date, ev.time, ev.venue, ev.eligibility, ev.rules, ev.instructions, ev.is_featured, ev.image_url, ev.icon_name]
      );
    }
  }

  // Ensure sports-tt-girls exists even if database was previously seeded
  const ttGirlsCheck = await dbGet('SELECT id FROM events WHERE id = ?', ['sports-tt-girls']);
  if (!ttGirlsCheck) {
    await dbRun(
      `INSERT INTO events (id, title, category, subcategory, gender, short_desc, full_desc, date, time, venue, eligibility, rules, instructions, is_featured, image_url, icon_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'sports-tt-girls',
        'Table Tennis (Girls)',
        'Sports',
        'Girls Tournament',
        'Girls',
        'Competitive table tennis singles and doubles tournament for women collegiate players.',
        'Fast-paced, high-spin table tennis tournament for collegiate women. Compete on international standard Stag tables in the air-conditioned indoor pavilion.',
        'October 9, 2026',
        '10:00 AM – 5:00 PM',
        'Indoor Sports Complex (Tables 5 - 8)',
        'Open to verified collegiate women students (Singles & Doubles).',
        JSON.stringify([
          'ITTF standard 11-point games, best of 5 sets in knockouts.',
          'Tournament white balls provided. Players must bring standard certified paddles.',
          'White shirts/jerseys prohibited as the match ball is white.'
        ]),
        'Reporting time 9:30 AM at the Indoor Pavilion desk for fixture draw.',
        0,
        'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
        'Target'
      ]
    );
  }

  // Ensure sports-tt-boys is labeled Table Tennis (Boys) and gender 'Boys'
  await dbRun("UPDATE events SET title = 'Table Tennis (Boys)', gender = 'Boys', subcategory = 'Boys Tournament' WHERE id = 'sports-tt-boys'");

  // Seed Announcements if empty
  const annCount = await dbGet<{ count: number }>('SELECT count(*) as count FROM announcements');
  if (!annCount || annCount.count === 0) {
    const seedAnnouncements = [
      {
        title: 'COLORIDO 2K26 registration is now open!',
        content: 'Official registration portal is live for all students of RVR&JC and external colleges across the nation. Participation is completely FREE for all events.',
        category: 'Urgent',
        date: 'October 1, 2026'
      },
      {
        title: 'External student bus registration is available',
        content: 'Dedicated college buses are arranged for participants travelling from Guntur and Vijayawada on October 9th with morning slots (7:00 AM, 9:00 AM) and evening return slots (5:00 PM, 7:00 PM).',
        category: 'Transport',
        date: 'October 2, 2026'
      },
      {
        title: 'Event schedules will be updated soon',
        content: 'Detailed stage-wise slot timings and round brackets will be published 24 hours prior to the festival on this portal.',
        category: 'Schedule',
        date: 'October 4, 2026'
      },
      {
        title: 'Participants are requested to report before their event',
        content: 'All participants must report at their respective venue desks with their college ID cards at least 30 minutes before the scheduled time.',
        category: 'General',
        date: 'October 5, 2026'
      }
    ];

    for (const ann of seedAnnouncements) {
      await dbRun(
        `INSERT INTO announcements (title, content, category, date, created_at) VALUES (?, ?, ?, ?, ?)`,
        [ann.title, ann.content, ann.category, ann.date, new Date().toISOString()]
      );
    }
  }

  // Seed Results if empty
  const resCount = await dbGet<{ count: number }>('SELECT count(*) as count FROM results');
  if (!resCount || resCount.count === 0) {
    const seedResults = [
      {
        event_name: 'Basketball (Boys)',
        category: 'Sports',
        winner: 'V.R. Siddhartha Engineering College',
        college_winner: 'VRSEC, Vijayawada',
        runner_up: 'R.V.R. & J.C. College of Engineering',
        college_runner: 'RVR&JCCE, Guntur',
        score_detail: 'Final: 68 - 62'
      },
      {
        event_name: 'Dance (Group & Solo)',
        category: 'Cultural',
        winner: 'KL University Dance Troupe (StepCraft)',
        college_winner: 'KLEF, Vaddeswaram',
        runner_up: 'RVR&JC Cult Crew (BeatDrop)',
        college_runner: 'RVR&JCCE, Guntur',
        score_detail: 'Jury Score: 98.5 / 100'
      },
      {
        event_name: 'Music & Band',
        category: 'Cultural',
        winner: 'The Resonance Band (Andhra University)',
        college_winner: 'AU College of Engineering, Vizag',
        runner_up: 'SoundSphere Collective',
        college_runner: 'Vasireddy Venkatadri Inst of Tech',
        score_detail: 'Crowd & Jury Choice Award'
      },
      {
        event_name: 'Volleyball (Boys)',
        category: 'Sports',
        winner: 'R.V.R. & J.C. College of Engineering',
        college_winner: 'RVR&JCCE, Guntur',
        runner_up: 'Bapatla Engineering College',
        college_runner: 'BEC, Bapatla',
        score_detail: 'Sets: 2 - 1 (25-23, 21-25, 15-11)'
      },
      {
        event_name: 'Table Tennis (Singles)',
        category: 'Sports',
        winner: 'K. Sai Praneeth',
        college_winner: 'JNTU Kakinada',
        runner_up: 'M. Harshavardhan',
        college_runner: 'RVR&JCCE, Guntur',
        score_detail: 'Games: 3 - 2'
      },
      {
        event_name: 'Fine Arts (Painting & Rangoli)',
        category: 'Cultural',
        winner: 'S. Ananya & Team',
        college_winner: 'GMR Institute of Technology',
        runner_up: 'P. Charitha',
        college_runner: 'RVR&JCCE, Guntur',
        score_detail: 'Theme: "Cyber-Vedic India"'
      }
    ];

    for (const res of seedResults) {
      await dbRun(
        `INSERT INTO results (event_name, category, winner, college_winner, runner_up, college_runner, score_detail) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [res.event_name, res.category, res.winner, res.college_winner, res.runner_up, res.college_runner, res.score_detail]
      );
    }
  }

  // Seed sample registrations if empty
  const regCount = await dbGet<{ count: number }>('SELECT count(*) as count FROM registrations');
  if (!regCount || regCount.count === 0) {
    const sampleRegs = [
      {
        registration_id: 'CLR26-0001',
        student_type: 'internal',
        student_name: 'Sravan Kumar Varma',
        roll_number: 'Y21CS124',
        college_name: 'R.V.R. & J.C. College of Engineering (Autonomous)',
        department: 'Computer Science and Engineering',
        year: '4th Year',
        section: 'CSE-B',
        email: 'sravan.v@rvrjcce.ac.in',
        phone: '+91 98480 12345',
        event_id: 'cult-music-band',
        event_name: 'Music & Band',
        participation_type: 'Team',
        team_name: 'Acoustic Waves',
        team_size: 4,
        emergency_contact: '+91 98480 54321',
        bus_required: 0,
        bus_time: null,
        created_at: '2026-10-02T10:14:00Z'
      },
      {
        registration_id: 'CLR26-0002',
        student_type: 'external',
        student_name: 'Deepika Reddy',
        roll_number: null,
        college_name: 'V.R. Siddhartha Engineering College, Vijayawada',
        department: 'Electronics & Communication',
        year: '3rd Year',
        section: null,
        email: 'deepika.reddy@vrsec.ac.in',
        phone: '+91 94401 67890',
        event_id: 'cult-dance',
        event_name: 'Dance',
        participation_type: 'Individual',
        team_name: null,
        team_size: 1,
        emergency_contact: '+91 94401 09876',
        bus_required: 1,
        bus_time: '7:00 AM',
        created_at: '2026-10-02T14:22:00Z'
      },
      {
        registration_id: 'CLR26-0003',
        student_type: 'internal',
        student_name: 'Nikhil Chowdary',
        roll_number: 'Y22ME089',
        college_name: 'R.V.R. & J.C. College of Engineering (Autonomous)',
        department: 'Mechanical Engineering',
        year: '3rd Year',
        section: 'ME-A',
        email: 'nikhil.c@rvrjcce.ac.in',
        phone: '+91 91234 56789',
        event_id: 'sports-basketball-boys',
        event_name: 'Basketball',
        participation_type: 'Team',
        team_name: 'RVR Slam Dunkers',
        team_size: 5,
        emergency_contact: '+91 91234 98765',
        bus_required: 0,
        bus_time: null,
        created_at: '2026-10-03T09:45:00Z'
      },
      {
        registration_id: 'CLR26-0004',
        student_type: 'external',
        student_name: 'Priyanka Senapati',
        roll_number: null,
        college_name: 'Bapatla Engineering College, Bapatla',
        department: 'Information Technology',
        year: '2nd Year',
        section: null,
        email: 'priyanka.s@becbapatla.ac.in',
        phone: '+91 93902 34567',
        event_id: 'cult-fine-arts',
        event_name: 'Fine Arts',
        participation_type: 'Individual',
        team_name: null,
        team_size: 1,
        emergency_contact: '+91 93902 76543',
        bus_required: 1,
        bus_time: '9:00 AM',
        created_at: '2026-10-03T16:30:00Z'
      }
    ];

    for (const r of sampleRegs) {
      await dbRun(
        `INSERT INTO registrations (
          registration_id, student_type, student_name, roll_number, college_name,
          department, year, section, email, phone, event_id, event_name,
          participation_type, team_name, team_size, emergency_contact,
          bus_required, bus_time, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.registration_id, r.student_type, r.student_name, r.roll_number, r.college_name,
          r.department, r.year, r.section, r.email, r.phone, r.event_id, r.event_name,
          r.participation_type, r.team_name, r.team_size, r.emergency_contact,
          r.bus_required, r.bus_time, r.created_at
        ]
      );
    }
  }

  persistDb();
  console.log('Database schema and seed verified successfully.');
}
