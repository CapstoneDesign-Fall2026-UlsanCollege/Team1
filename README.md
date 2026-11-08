# StudentHub

StudentHub supports Nepal-style middle/high-school administration: class enrollment, subjects/teachers, weekly timetables, room allocations/bookings, student accounts and school canteen information.

**Current evidence:** [Week 10 index](classroom/week10/README.md), [class workspace and enrollment](classroom/week10/school-workspace-usability.md), [student dashboard](classroom/week10/student-dashboard-check.md), [Activity Log](docs/activity-log.md). Earlier Week 9 planning documents describe the pivot's history.

## Implemented and locally checked

- Administrators manage academic years, classes, student enrollment/transfers, specialist teacher assignments, subject/timetable planning, usual classrooms and special-room bookings.
- Student home shows their effective class, homeroom teacher, usual room, today's lessons and published menu preview; weekly timetable/profile/subjects remain available.
- Canteen heads manage dated menus, prices, availability, copy-to-days, publication, hours/location and notices. Students see only published information; an unpublished menu remains hidden.
- Account support includes administrator-reviewed password resets; private password delivery is manual.
- Admin-only Activity Log records authenticated staff changes with private-value redaction.
- Seoul job search and favourites remain available as an optional high-school direction; complete policy enforcement is separate work.

These are local/automated/browser results, not a claim of current hosted release verification. Existing college records are retained behind explicit school mapping.

## Setup status - read before following the older commands below

The setup section below is incomplete for a new empty database. Migrations currently begin at 002; the base tables and first-admin bootstrap need a canonical versioned procedure. Personal-machine paths below are historical examples. A successful build on the author's populated database does not prove a fresh clone can run.

[Setup repair and clean-database verification #77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77) tracks the missing baseline, complete migration order, configuration, first account and repeatable checks. Do not use a private production dump as a public setup fixture.

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

The repository is a development MVP. School features have local checks; independent human and live verification remain separate. Railway recovery is tracked in #65. The owner plans to revisit its purchase on November 10; keep fallback hosting and private backups until recovery is verified.
