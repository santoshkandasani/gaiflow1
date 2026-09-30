============================================================
COLORIDO 2K26 — COMPLETE FULL-STACK WEBSITE MASTER PROMPT
============================================================

Build a complete, functional, production-style full-stack event
management website for:

                    COLORIDO 2K26

A NATIONAL LEVEL CULTURAL AND SPORTS EVENT

Hosted by:

R.V.R. & J.C. COLLEGE OF ENGINEERING
(AUTONOMOUS)

The application must be a REAL working full-stack website.

It must NOT be only a landing page.
It must NOT be only frontend UI.
It must NOT use fake registration submissions.

The final application must contain:

FRONTEND
+
BACKEND
+
DATABASE
+
AUTHENTICATION
+
STUDENT DASHBOARDS
+
EVENT REGISTRATION
+
ADMIN DASHBOARD

============================================================
1. TECHNOLOGY STACK
============================================================

FRONTEND:

- Vite
- JavaScript
- HTML
- Tailwind CSS
- Modern CSS
- Responsive design

BACKEND:

- Node.js
- Express.js

DATABASE:

- SQLite

IMPORTANT:

DO NOT USE POSTGRESQL.

DO NOT USE:

- PostgreSQL
- pgAdmin
- DATABASE_URL
- PostgreSQL passwords
- MySQL

Use SQLite.

Database file:

backend/data/colorido.db

Use a reliable SQLite package such as:

better-sqlite3

or

sqlite3

The database must automatically initialize when the backend starts.

============================================================
2. PROJECT STRUCTURE
============================================================

Create:

COLORIDO-2K26/

    frontend/

        public/

            campus.jpg
            college-logo.png
            colorido-poster.png

        src/

            main.js
            style.css

            components/
            pages/

        index.html
        package.json
        vite.config.js

    backend/

        src/

            server.js
            database.js
            middleware/
            routes/

                auth.js
                events.js
                registrations.js
                announcements.js
                results.js
                admin.js

        data/

            colorido.db

        package.json
        .env.example

    README.md


IMPORTANT:

JavaScript files MUST NOT be inside public.

Correct:

frontend/public/
    campus.jpg
    college-logo.png
    colorido-poster.png

frontend/src/
    main.js
    style.css

============================================================
3. BRANDING
============================================================

Main event name:

COLORIDO 2K26

Subtitle:

National Cultural & Sports Fest

College:

R.V.R. & J.C. COLLEGE OF ENGINEERING

Use the provided:

- College logo
- College campus image
- COLORIDO poster

Do not use VIT-AP branding.

The reference website is only a visual inspiration.

Do NOT copy its branding, text, logos, or identity.

Use R.V.R. & J.C. College branding and COLORIDO 2K26.

============================================================
4. HOMEPAGE DESIGN
============================================================

The homepage must follow the modern university-event design
shown in the provided reference screenshot.

Visual structure:

FULL SCREEN CAMPUS HERO
↓
TRANSPARENT NAVBAR
↓
CENTERED HERO CONTENT
↓
SLIDER CONTROLS
↓
FEATURED EVENTS
↓
ABOUT COLORIDO
↓
EVENT INFORMATION
↓
GALLERY
↓
ANNOUNCEMENTS
↓
RESULTS
↓
CONTACT
↓
FOOTER


============================================================
5. NAVBAR
============================================================

Create a transparent/glass navbar over the hero.

LEFT:

College logo

R.V.R. & J.C.
COLLEGE OF ENGINEERING

CENTER:

Home
Events
About
Schedule
Gallery
Contact

RIGHT:

Search icon

Sign In

The navbar should become a mobile menu on small screens.

The Sign In button must navigate to:

/signin

============================================================
6. HERO SECTION
============================================================

Full viewport/large hero.

Use:

campus.jpg

as the primary background.

Add dark gradient overlay.

Hero content:

Small badge:

NATIONAL CULTURAL & SPORTS FEST

Large title:

COLORIDO 2K26

Subtitle:

National Cultural & Sports Fest

Description:

Experience a celebration of creativity, talent, sportsmanship
and culture at R.V.R. & J.C. College of Engineering.

Buttons:

[ EXPLORE EVENTS ]

[ REGISTER / SIGN IN ]

IMPORTANT:

The Register / Sign In button must go to authentication.

It must NOT directly submit a registration.

============================================================
7. HERO CAROUSEL
============================================================

Create a functional carousel.

Slide 1:

COLORIDO 2K26
National Cultural & Sports Fest

Image:

campus.jpg


Slide 2:

Celebrate Your Talent
Cultural Events

Image:

colorido-poster.png


Slide 3:

Compete. Perform. Inspire.

Sports & Cultural Events

Image:

campus.jpg

Features:

- Previous arrow
- Next arrow
- Dots
- Active dot
- Automatic slide
- Pause/play
- Smooth transitions

============================================================
8. FEATURED EVENTS
============================================================

Immediately below hero:

DISCOVER COLORIDO 2K26

Featured Events

Use LARGE MODERN CARDS.

DO NOT create a huge table.

Each card:

- Image
- Category
- Event icon
- Event name
- Description
- Date
- Time
- Register button

Featured events:

1. Music & Band
2. Dance
3. Basketball
4. Volleyball
5. Fine Arts
6. Table Tennis

Date:

October 9, 2026

Time:

10:00 AM – 5:00 PM

Registration:

FREE

There is NO registration fee.

Do NOT show payment amounts.

Do NOT add payment gateways.

============================================================
9. ALL CULTURAL EVENTS
============================================================

Include:

FINE ARTS

MUSIC & BAND

- Solo
- Group

DANCE

- Solo
- Group

CHOREODAY

- Theme Based

DRAMATICS

FASHION SHOW

TEKRAFT EVENTS

LITERARY

Each event must be a card.

Each card should contain:

- Event image
- Event name
- Category
- Description
- Date
- Time
- Venue
- Rules
- Details
- Register button

============================================================
10. SPORTS EVENTS
============================================================

BOYS:

Basketball
Volleyball
Table Tennis

GIRLS:

Throwball
TenniKoit
Table Tennis

Date:

October 9, 2026

Time:

10:00 AM – 5:00 PM

Registration:

FREE

============================================================
11. EVENT DETAILS
============================================================

Each event must have a details page/modal.

Show:

Event Name
Category
Description
Eligibility
Rules
Instructions
Date
Time
Venue
Registration status

Button:

REGISTER

The Register button must take the user through authentication.

============================================================
12. VERY IMPORTANT AUTHENTICATION FLOW
============================================================

The application must have TWO COMPLETELY SEPARATE student portals:

1. INTERNAL STUDENT
2. EXTERNAL STUDENT


The user MUST LOGIN before registering for an event.

Do NOT combine login and registration into one form.

Do NOT force the user to register immediately after login.

Login and event registration are two separate actions.


Correct flow:

HOME
↓
SIGN IN
↓
SELECT PARTICIPANT TYPE
↓
INTERNAL OR EXTERNAL
↓
LOGIN
↓
THEIR OWN DASHBOARD
↓
BROWSE EVENTS
↓
CHOOSE EVENT
↓
REGISTER WHEN THEY WANT
↓
REGISTRATION SUCCESS


============================================================
13. PARTICIPANT TYPE SELECTION
============================================================

When the user clicks:

Sign In

or

Register Now

show:

--------------------------------
WELCOME TO COLORIDO 2K26
--------------------------------

Choose your participant type:

[ INTERNAL STUDENT ]

[ EXTERNAL STUDENT ]

Only one portal should be selected at a time.

Do NOT display internal and external login forms together.

============================================================
14. INTERNAL LOGIN
============================================================

When:

INTERNAL STUDENT

is selected:

Show ONLY internal login.

Fields:

Student ID / Roll Number
Password

Button:

LOGIN

Also:

New user?

CREATE INTERNAL ACCOUNT

============================================================
15. EXTERNAL LOGIN
============================================================

When:

EXTERNAL STUDENT

is selected:

Show ONLY external login.

Fields:

Email
Password

Button:

LOGIN

Also:

New user?

CREATE EXTERNAL ACCOUNT

============================================================
16. ACCOUNT CREATION
============================================================

Internal account fields:

Student Name
Roll Number
Department
Year
Section
Email
Phone
Password
Confirm Password


External account fields:

Student Name
College Name
Department / Course
Year
Email
Phone
Password
Confirm Password


Passwords MUST be securely hashed.

Use:

bcrypt

or

bcryptjs

NEVER store plain-text passwords.

Validate passwords.

Validate email.

Prevent duplicate accounts.

============================================================
17. INTERNAL STUDENT DASHBOARD
============================================================

After successful internal login:

Show:

Welcome, [Student Name]

Dashboard navigation:

- Dashboard
- Profile
- Cultural Events
- Sports Events
- My Registrations
- Announcements
- Logout

The student can browse all available events.

The student is NOT automatically registered for anything.

They choose an event and click:

REGISTER

============================================================
18. EXTERNAL STUDENT DASHBOARD
============================================================

After successful external login:

Show:

Welcome, [Student Name]

Dashboard navigation:

- Dashboard
- Profile
- Cultural Events
- Sports Events
- My Registrations
- Bus Information
- Announcements
- Logout

The external student can browse all events.

They choose an event and click:

REGISTER

============================================================
19. INTERNAL EVENT REGISTRATION
============================================================

When a logged-in internal student clicks REGISTER:

Show:

Event Name

Student Name
Roll Number
Department
Year
Section
Email
Phone

Participation Type:

Individual
Team

The user information should automatically come from
their logged-in account.

Do NOT ask them to log in again.

Do NOT show bus fields.

Button:

REGISTER FOR EVENT


============================================================
20. EXTERNAL EVENT REGISTRATION
============================================================

When a logged-in external student clicks REGISTER:

Show:

Event Name

Student Name
College Name
Department
Year
Email
Phone

Participation Type:

Individual
Team

Then:

Bus Required?

YES
NO

IMPORTANT:

Bus options MUST ONLY appear for external students.


If:

Bus Required = YES

show:

October 9, 2026

Morning:

7:00 AM
9:00 AM

Evening:

5:00 PM
7:00 PM


If:

Bus Required = NO

hide the bus timing selection.

Button:

REGISTER FOR EVENT


============================================================
21. REGISTRATION SUCCESS
============================================================

After successful registration:

Save to SQLite.

Generate unique registration ID.

Example:

CLR26-0001

Show:

--------------------------------
REGISTRATION SUCCESSFUL
--------------------------------

Registration ID:

CLR26-0001

Participant:

Student Name

Participant Type:

Internal Student / External Student

Event:

Basketball

Date:

October 9, 2026

Time:

10:00 AM – 5:00 PM

Registration Fee:

FREE


For external students:

Bus Required:
YES

Bus Time:
7:00 AM


Buttons:

[ VIEW MY REGISTRATIONS ]

[ PRINT / DOWNLOAD ]

============================================================
22. MY REGISTRATIONS
============================================================

Every logged-in student must have:

MY REGISTRATIONS

Show registration cards.

Each card:

Registration ID
Event
Category
Date
Time
Status

External students also see:

Bus Required
Bus Time

Example:

CLR26-0001

Basketball

Sports

October 9, 2026

10:00 AM – 5:00 PM

Status:
REGISTERED


============================================================
23. DATABASE DESIGN
============================================================

Use SQLite.

Tables:

internal_users

external_users

events

registrations

announcements

results

contact_messages

Suggested internal_users:

id
name
roll_number
department
year
section
email
phone
password_hash
created_at


Suggested external_users:

id
name
college_name
department
year
email
phone
password_hash
created_at


Events:

id
name
category
subcategory
gender
description
rules
date
start_time
end_time
venue
registration_open


Registrations:

id
registration_id
student_type
internal_user_id
external_user_id
event_id
participation_type
bus_required
bus_time
created_at


IMPORTANT:

A registration must belong to either:

internal_user_id

OR

external_user_id

Never both.


============================================================
24. DATABASE RULES
============================================================

Use parameterized queries.

Do not concatenate user input into SQL.

Prevent SQL injection.

Create tables automatically on backend startup.

Create indexes where appropriate.

Generate unique registration IDs.

Example:

CLR26-0001
CLR26-0002
CLR26-0003

Prevent duplicate registration for the same student and event
unless the event explicitly allows it.

============================================================
25. BACKEND API
============================================================

Create:

POST /api/auth/internal/register

POST /api/auth/internal/login

POST /api/auth/external/register

POST /api/auth/external/login

POST /api/auth/logout

GET /api/auth/me


Events:

GET /api/events

GET /api/events/:id


Registration:

POST /api/registrations

GET /api/registrations/my

GET /api/registrations/:id


Announcements:

GET /api/announcements


Results:

GET /api/results


Health:

GET /api/health


Admin:

GET /api/admin/registrations

GET /api/admin/stats

DELETE /api/admin/registrations/:id

============================================================
26. AUTHENTICATION
============================================================

Use secure authentication.

Recommended:

JWT stored in secure HTTP-only cookie

OR

server-side sessions.

Protect:

/api/registrations

/api/registrations/my

/api/auth/me

/admin routes

A user must be authenticated before registration.

============================================================
27. AUTHORIZATION
============================================================

Internal users:

Can only access their own:

Profile
Registrations

External users:

Can only access their own:

Profile
Registrations

An internal student MUST NOT be able to access external-only functionality.

An external student MUST NOT access internal-only functionality.

External bus information must be available only to external students.

============================================================
28. ADMIN DASHBOARD
============================================================

Create a separate admin dashboard.

Show:

Total Registrations

Internal Registrations

External Registrations

Total Events

Total Cultural Registrations

Total Sports Registrations

Bus Required

Recent Registrations

Admin registration table is allowed.

The public website should NOT use tables for event cards.

Admin can:

Search registrations

Filter by:

Internal
External
Event
Category
Date
Bus Required

View registration details.

Delete registration if necessary.

============================================================
29. ADMIN LOGIN
============================================================

Create a separate admin login.

Use secure password handling.

Do NOT expose admin credentials in the frontend.

Use environment variables for admin configuration.

============================================================
30. ANNOUNCEMENTS
============================================================

Create announcements.

Dummy announcements:

"COLORIDO 2K26 registration is now open."

"External student bus registration is available."

"Participants are requested to report before their event."

"Event schedules will be updated soon."

Display as clean cards.

============================================================
31. RESULTS
============================================================

Create Results page.

Use dummy results.

Cultural:

Dance
Music & Band
Fine Arts
Dramatics

Sports:

Basketball
Volleyball
Table Tennis
Throwball
TenniKoit

Show:

Winner
Runner Up

Use cards.

No large table on public page.

============================================================
32. GALLERY
============================================================

Create modern gallery.

Categories:

Opening Ceremony
Cultural Events
Sports Events
Performances
Campus
Prize Distribution

Use:

campus.jpg

colorido-poster.png

and dummy image placeholders where required.

Use responsive grid.

Add lightbox on click.

============================================================
33. ABOUT COLORIDO
============================================================

Create:

ABOUT COLORIDO 2K26

Text:

COLORIDO 2K26 is a national-level cultural and sports celebration
bringing together students from different institutions to showcase
creativity, talent, teamwork and sporting spirit.

Hosted by:

R.V.R. & J.C. College of Engineering

Mention:

Cultural Events
Sports Events
Inter-college Participation
Student Talent
Sportsmanship

============================================================
34. EVENT DATE AND TIME
============================================================

All events:

October 9, 2026

Common timing:

10:00 AM – 5:00 PM

Do NOT create different random event timings.

Do NOT create different event dates.

Bus timings are separate:

7:00 AM
9:00 AM
5:00 PM
7:00 PM

Bus availability applies ONLY to external students.

============================================================
35. REGISTRATION FEE
============================================================

EVERY EVENT IS FREE.

Registration fee:

₹0 / FREE

Do not create payment gateway.

Do not create:

Razorpay
Stripe
PayPal

There is no payment processing.

============================================================
36. CONTACT
============================================================

Create:

Contact Us

R.V.R. & J.C. College of Engineering

Andhra Pradesh, India

Email:

colorido@rvrjcce.ac.in

Phone:

+91 XXXXX XXXXX

Contact form:

Name
Email
Message

Save contact messages to SQLite if practical.

============================================================
37. FOOTER
============================================================

Footer:

College logo

COLORIDO 2K26

R.V.R. & J.C. College of Engineering

Quick Links:

Home
Events
About
Schedule
Gallery
Contact

Sign In

Social icons

Copyright:

© 2026 COLORIDO 2K26
All rights reserved.

============================================================
38. RESPONSIVE DESIGN
============================================================

Must work correctly on:

Desktop
Laptop
Tablet
Mobile

Mobile:

Hamburger menu

Cards:

1 column

Tablet:

2 columns

Desktop:

3 or 4 columns depending on section

Forms:

Mobile friendly

Hero:

Responsive text

============================================================
39. VISUAL DESIGN
============================================================

Design must be:

Modern
Premium
Professional
Minimal
Elegant
University-level

Use:

Large photography
Dark hero overlay
Glass navbar
Rounded cards
Soft shadows
Smooth animations
Hover effects
Modern typography
Clean whitespace

Do NOT overuse:

Gradients
Neon colors
Emojis
Heavy animations

The design should look like a professional national-level college event platform.

============================================================
40. ERROR HANDLING
============================================================

IMPORTANT:

The final project MUST NOT contain the following known problems:

- PostgreSQL dependency
- DATABASE_URL requirement
- pgAdmin requirement
- Missing SQLite initialization
- Register button doing nothing
- Login form not connected to backend
- Registration form not connected to backend
- Internal registration failing
- External registration failing
- Bus selection appearing for internal students
- Bus selection not appearing for external students
- Internal and external forms appearing simultaneously
- Registration working without login
- User being able to access another user's registrations
- Passwords stored as plain text
- Registration not being saved
- Registration ID not generated
- Broken API routes
- Broken imports
- JavaScript inside public folder
- Missing images causing broken layouts
- Hardcoded fake successful registration
- Frontend calling wrong API port
- CORS errors
- Unhandled backend errors

Handle errors gracefully.

Show user-friendly messages.

Example:

"Invalid email or password."

"Please complete all required fields."

"Registration successful."

"Unable to register. Please try again."

============================================================
41. FRONTEND/BACKEND CONNECTION
============================================================

Frontend development server:

http://localhost:5173

Backend:

http://localhost:4000

Use a centralized API configuration.

Do not hardcode multiple different backend URLs throughout
the application.

Example:

VITE_API_URL=http://localhost:4000/api

Use environment configuration.

============================================================
42. LOADING STATES
============================================================

Every API action should have a loading state.

Examples:

Logging in...

Creating account...

Registering...

Loading events...

Loading registrations...

Do not allow double-clicking Register to create duplicate records.

Disable submit button while request is processing.

============================================================
43. FORM VALIDATION
============================================================

Frontend validation:

Required fields
Email format
Phone format
Password length
Password confirmation

Backend validation must ALSO exist.

Never rely only on frontend validation.

============================================================
44. EVENT DATA
============================================================

Create all events in the database.

CULTURAL:

Fine Arts

Music & Band — Solo

Music & Band — Group

Dance — Solo

Dance — Group

Choreoday — Theme Based

Dramatics

Fashion Show

Tekraft Events

Literary


SPORTS BOYS:

Basketball

Volleyball

Table Tennis


SPORTS GIRLS:

Throwball

TenniKoit

Table Tennis

============================================================
45. EVENT CARD DESIGN
============================================================

Each public event card:

Image

Category badge

Event title

Short description

Date:

October 9, 2026

Time:

10:00 AM – 5:00 PM

Buttons:

VIEW DETAILS

REGISTER

REGISTER must check authentication.

If not logged in:

→ Send to Sign In

After login:

→ Return to the selected event

Then user can register.

IMPORTANT:

If a user clicks Register while logged out:

Store the intended event temporarily.

Send them to login.

After successful login:

Return them to that event's registration page.

Do NOT lose the selected event.

============================================================
46. AUTHENTICATION + EVENT REGISTRATION FLOW
============================================================

Example:

User clicks:

Basketball → REGISTER

User is NOT logged in.

System:

→ /signin

User selects:

External Student

↓

External Login

↓

Successful login

↓

Return to Basketball

↓

Basketball Registration

↓

Bus Required?

YES

↓

7:00 AM

↓

REGISTER

↓

SQLite

↓

CLR26-0001

This exact flow must work.

============================================================
47. LOGOUT
============================================================

Both portals must have:

Logout

After logout:

Clear session/token.

Redirect to homepage.

Protected pages must no longer be accessible.

============================================================
48. SEARCH
============================================================

Navbar search icon should open a search interface.

Allow searching:

Event names
Categories
Sports
Cultural events

Show matching event cards.

============================================================
49. ACCESSIBILITY
============================================================

Use:

Proper labels

Keyboard navigation

Alt text

Good contrast

Accessible buttons

Semantic HTML

Responsive forms

============================================================
50. README
============================================================

Create a detailed README containing:

Project description

Features

Technology stack

Folder structure

Installation

Backend setup

Frontend setup

Database setup

Environment variables

How to run

How authentication works

How registration works

How admin dashboard works

IMPORTANT:

There must be NO PostgreSQL setup instructions.

Only SQLite.

============================================================
51. RUN COMMANDS
============================================================

Backend:

cd backend

npm install

npm run dev


Frontend:

cd frontend

npm install

npm run dev


Frontend:

http://localhost:5173

Backend:

http://localhost:4000

Health:

http://localhost:4000/api/health


============================================================
52. FINAL TESTING — MANDATORY
============================================================

Before declaring the project complete, actually test the following.

TEST 1:

Open homepage.

Verify:

Campus hero
Logo
Navbar
Hero slider
Featured events
Event cards

TEST 2:

Click Sign In.

Verify:

Internal Student
External Student

are shown separately.

TEST 3:

Select Internal Student.

Verify only internal login appears.

Create internal account.

Login.

Verify internal dashboard.

TEST 4:

From internal dashboard:

Open Basketball.

Click Register.

Complete registration.

Submit.

Verify:

Registration ID generated.

Verify SQLite contains record.

Verify My Registrations contains record.

Verify NO bus field exists.

TEST 5:

Logout.

Select External Student.

Create external account.

Login.

Verify external dashboard.

TEST 6:

Open Basketball.

Click Register.

Verify external registration form.

Set:

Bus Required = YES.

Verify bus timings appear:

7:00 AM
9:00 AM
5:00 PM
7:00 PM

Choose:

7:00 AM.

Submit.

Verify:

Registration ID generated.

Verify SQLite contains record.

Verify My Registrations contains record.

TEST 7:

External registration:

Bus Required = NO.

Verify bus time disappears.

Registration must still work.

TEST 8:

Verify internal users cannot access external-only data.

Verify external users cannot access internal-only data.

TEST 9:

Logout.

Try accessing dashboard directly.

Verify user is redirected to login.

TEST 10:

Open admin dashboard.

Verify:

Internal registration

External registration

Bus requirement

Event

Registration IDs

appear correctly.

TEST 11:

Test mobile width.

TEST 12:

Test tablet width.

TEST 13:

Test desktop width.

============================================================
53. IMPORTANT FINAL INSTRUCTION
============================================================

Do NOT return only snippets.

Generate the COMPLETE RUNNABLE PROJECT.

Create all required files.

Create:

Frontend
Backend
SQLite database initialization
Authentication
Internal portal
External portal
Dashboards
Events
Registration
Admin
Announcements
Results
Gallery
Contact

Make sure all imports work.

Make sure all API routes work.

Make sure the frontend talks to the backend correctly.

Make sure SQLite automatically initializes.

Make sure authentication works.

Make sure registration works for BOTH internal and external students.

Make sure users LOGIN BEFORE registering.

Make sure registration is a separate action after login.

Make sure external bus selection works.

Make sure internal students never see bus selection.

Make sure there are no PostgreSQL dependencies.

Make sure there are no broken routes.

Make sure there are no console errors.

Make sure there are no missing modules.

Make sure there are no missing assets.

Make sure the final project can be run with:

npm install
npm run dev

for both frontend and backend.

The final result must be a complete, polished, working COLORIDO 2K26
event management platform suitable for demonstrating in a
national-level website design challenge.
