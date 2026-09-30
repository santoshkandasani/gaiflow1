# COLORIDO 2K26 - National Cultural & Sports Fest

**Hosted by:**  
**R.V.R. & J.C. COLLEGE OF ENGINEERING (AUTONOMOUS)**  
*Sponsored by Nagarjuna Education Society | Affiliated to Acharya Nagarjuna University*  
*Chowdavaram, Guntur, Andhra Pradesh - 522019*  
*Accredited by NAAC with 'A+' Grade • NBA Accredited Programmes*

---

## 🌟 Overview

**COLORIDO 2K26** is a national-level cultural and sports celebration bringing together students from across India to showcase creativity, talent, teamwork, and sporting spirit. This full-stack web application provides a responsive event platform for students, faculty, and festival convenors.

---

## 🚀 Key Features

1. **Full-Screen Campus Hero Carousel**:
   - 3-slide slider featuring RVR&JC Campus (`campus.jpg`) and festival artwork (`colorido-poster.png`).
   - Autoplay (5–6s), pause/play toggle, next/prev arrow buttons, and indicator dots.
   - Immediate CTAs: *Explore Events* and *Register Now*.

2. **Featured Events (Immediate below Hero)**:
   - Modern large event cards: *Music & Band*, *Dance*, *Basketball*, *Volleyball*, *Fine Arts*, *Table Tennis*.
   - Free entry badges, event details, venue, time, and instant registration triggers.

3. **Complete Cultural & Sports Events Catalogs**:
   - **Cultural Disciplines:** *Fine Arts*, *Music & Band (Solo/Group)*, *Dance (Solo/Group)*, *Choreoday (Theme Based)*, *Dramatics*, *Fashion Show*, *Tekraft Events*, *Literary*.
   - **Sports Arena (Boys & Girls Divisions):**
     - **Boys Division:** *Basketball (Boys)*, *Volleyball (Boys)*, *Table Tennis (Boys)*.
     - **Girls Division:** *Throwball (Girls)*, *TenniKoit (Girls)*, *Table Tennis (Girls)*.
   - Interactive division tabs, official match rules, court venues (*Floodlit Courts, SAC Ground, Indoor Pavilion*), and free registration triggers.

4. **Student Profile & Registration Tracking (Internal & External)**:
   - Dedicated portal for both **Internal (RVR&JC)** and **External** students to track their registrations.
   - Look up registrations by Roll Number (e.g. `Y21CS124`), Email, or Registration ID (e.g. `CLR26-0002`).
   - Displays all registered events, scheduled times, venues, and transit status.
   - One-click print/download for official delegate ID passes with barcodes.
   - Option to cancel registration or register for additional events.

5. **Sign In & Registration Portal (Strict UX Separation)**:
   - Participant Type Choice Screen:
     - `[ Internal Student ]` (RVR&JC College of Engineering)
     - `[ External Student ]` (Visiting Colleges & Universities)
   - Forms never appear simultaneously.
   - **Internal Form:** Student Name, Roll Number, Department, Year, Section, Email, Phone, Event, Mode, Emergency Contact. *(No bus options).*
   - **External Form:** Student Name, College Name, Course, Year, Email, Phone, Event, Mode, Emergency Contact.
   - **External Bus Transportation:** Dedicated bus facility with timing selection (*7:00 AM, 9:00 AM, 5:00 PM, 7:00 PM*).
   - **100% Free Registration:** Zero payment gateways.
   - **Unique Registration ID:** Auto-generated sequence (e.g., `CLR26-0001`).
   - **Printable Delegate Pass:** Printable digital confirmation card.

6. **SQLite Database (`backend/data/colorido.db`)**:
   - Auto-created with zero configuration (no PostgreSQL/pgAdmin required).
   - Parameterized SQL queries for `events`, `registrations`, `announcements`, `results`, and `contact_messages`.

7. **Dedicated Admin Dashboard & CSV Extraction**:
   - Access directly via the **Admin** button in the Navbar or `#admin` URL route.
   - Protected login (`admin` / `colorido2026`).
   - Real-time stat metrics: Total Registrations, Internal vs External breakdown, Bus Transit Requirements, and Total Events.
   - Visual Participation Analytics graphs and event breakdown.
   - Full Registration Details table with live search (Name, Reg ID, Roll Number, College), Type filters, and Bus filter.
   - View complete delegate modal profiles & delete registrations from SQLite.
   - **Extract CSV File:** One-click instant extraction and download of `COLORIDO_2K26_Registrations.csv` containing all registration fields.

8. **Live Announcements & Results**:
   - Real-time bulletin board and podium results cards.

9. **Interactive Photo Gallery**:
   - Filterable categories with full-screen lightbox modal.

10. **Working Contact Form**:
    - Stores messages directly in the SQLite database.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** SQLite (`sqlite3` engine) storing data in `backend/data/colorido.db`.

---

## 💻 Running the Application

### 1. Unified Full-Stack (Dev Server)
```bash
npm install
npm run dev
```
Starts the full-stack server on `http://localhost:3000` with both Express API routes (`/api/*`) and Vite frontend live-reloading.

### 2. Standalone Backend
```bash
cd backend
npm install
npm run dev
```
Runs standalone backend on `http://localhost:4000` connected to `backend/data/colorido.db`.

---

## 📁 File Structure

```
├── backend/
│   ├── data/
│   │   └── colorido.db          # SQLite Database file
│   ├── src/
│   │   ├── database.js          # SQLite connection and helpers
│   │   └── server.js            # Standalone Express API server (Port 4000)
│   ├── package.json
│   └── .env.example
├── public/
│   ├── campus.jpg               # Campus hero photography
│   ├── college-logo.png         # R.V.R. & J.C. College seal
│   └── colorido-poster.png      # COLORIDO 2K26 festival poster
├── src/
│   ├── components/
│   │   ├── AboutSection.tsx
│   │   ├── AdminModal.tsx
│   │   ├── AnnouncementsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── CulturalEvents.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventModal.tsx
│   │   ├── FeaturedEvents.tsx
│   │   ├── Footer.tsx
│   │   ├── GallerySection.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── Navbar.tsx
│   │   ├── PortalModal.tsx
│   │   ├── ResultsSection.tsx
│   │   ├── ScheduleSection.tsx
│   │   ├── SportsEvents.tsx
│   │   └── StatsBanner.tsx
│   ├── server/
│   │   ├── api.ts               # Express API routes
│   │   └── database.ts          # SQLite schema & seed manager
│   ├── types/
│   │   └── index.ts             # TypeScript models
│   ├── App.tsx                  # Main application orchestrator
│   ├── index.css                # Tailwind styling
│   └── main.tsx                 # Client entry point
├── index.html
├── metadata.json
├── package.json
├── server.ts                    # Root full-stack server (Port 3000)
└── tsconfig.json
```

---

## 📝 Credentials for Evaluation

- **Admin Dashboard:**
  - Click the **Shield icon** in the navbar or the link in the footer.
  - **Username:** `admin`
  - **Password:** `colorido2026`
