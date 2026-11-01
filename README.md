
﻿# StudentHub

StudentHub is being adapted into a **middle and high school** platform for academic planning, homeroom-teacher management and school canteen information.

**Current plan:** [Design Doc v2](classroom/week9/design-doc-v2.md) and [Mermaid roadmap](classroom/week9/roadmap.md). Classroom finding is cancelled. Job search remains an optional high-school feature; school-level audience gating is planned in [#69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/69).

The existing implementation is college-oriented: students currently see courses by semester and major. School years, grades, homeroom classes and homeroom-teacher assignments are **planned changes**, not features already shipped. Existing accounts, academic records and favourites must be retained and mapped explicitly. Historical weekly reports remain evidence of the earlier scope.

## Current features

### Administrator

- Create student accounts with an initial password and optional semester assignment.
- Search and edit student profiles, including semester membership.
- Enable or disable student accounts.
- Create semesters and browse the course catalog.
- Assign courses to a semester and major using drag-and-drop or touch controls.
- Assign and edit professors for course offerings.
- Add, edit, remove, and view weekly class meetings.
- Prevent overlapping class times within the same semester and major.
- Use large-screen planning views for courses and timetables.

### Student

- Log in using an administrator-created account.
- View profile information and edit contact details.
- View assigned semesters and major-specific courses.
- View a weekly timetable with course, professor, time, and location.
- Use the mobile-friendly bottom navigation.

Job search, filters and favourites are implemented using the Seoul Open Data recruitment API; the new high-school-only optional policy is not yet implemented. See [job notes](docs/job-finder.md).

C0 canteen-head access and C1 daily menu publishing/student display are implemented with local automated checks. Browser/live verification remains pending; see [C1 notes](docs/canteen-daily-menu.md). C2/C3 hours/location and availability controls remain planned.

## Project structure

```text
Team1/
├── backend/       Express + TypeScript API and MySQL access
│   ├── src/       API routes and database services
│   └── tests/     Backend tests
├── frontend/      Vue 3 + Vite interface
│   └── src/        Components and styles
├── database/      SQL migrations and seed files
├── classroom/     Reports, wireframes, and weekly evidence
└── README.md
```

## Requirements

- Node.js and npm
- MySQL or MariaDB
- A database named `studenthub`

The current local setup uses MySQL on port `3307`. Change the environment values if using another port.

## First-time setup

From the repository root:

```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
```

Open `backend/.env` and set the database password. Do not commit `.env` or put its password in documentation.

Apply the database migrations in order from your MySQL client:

```sql
SOURCE database/migrations/002_student_semesters.sql;
SOURCE database/migrations/003_major_course_offerings.sql;
```

Install frontend packages:

```powershell
cd ..\frontend
npm.cmd install
```

## Run locally

Use two VS Code terminals.

Backend:

```powershell
cd "C:\Users\galan\team1Studenthub\Team1\backend"
npm.cmd run dev
```

The API runs at `http://127.0.0.1:3000`.

Frontend:

```powershell
cd "C:\Users\galan\team1Studenthub\Team1\frontend"
npm.cmd run dev
```

Open the Vite address shown in the terminal, normally `http://localhost:5173`.

Both terminals must be running for login and database features to work.

## Verification

```powershell
cd frontend
npm.cmd run build

cd ..\backend
npm.cmd test
```

## Security and deployment notes

- Never commit `backend/.env`.
- Never place database passwords or API keys in frontend code.
- Student passwords are stored as bcrypt hashes.
- Students cannot create accounts or use administrator endpoints.
- GitHub Pages can host the built frontend, but it cannot run the Express backend or MySQL database. A public full application needs separate hosting for the API and database.

## Development workflow

1. Confirm the GitHub issue for the feature slice.
2. Build the backend endpoint and frontend control together.
3. Run the frontend build and backend tests.
4. Test the flow as administrator and student.
5. Commit with a clear message and push to the team repository.

The repository is a development MVP. The school pivot is planning work; local automated evidence does not establish live verification. Railway recovery is tracked in #65. The owner plans to revisit its purchase on November 10; keep fallback hosting and private backups until recovery is verified.
