
﻿# StudentHub

StudentHub is a college student-life platform for Ulsan College. It gives administrators a way to manage student accounts and academic planning, while students can view their own profile, semesters, courses, and weekly timetable.

The project is a capstone MVP built around two academic dimensions: a **semester period** such as Spring or Fall, and a **major** such as Computer IT & Security or Global Business. Courses and class meetings are assigned to a specific semester and major. A student sees an offering when both their semester assignment and major match it.

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

Student job search is planned for a later slice. Saramin API integration will require a public deployed website and separately hosted backend.

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
- Railway backend deployment requires an organization administrator to approve/install the Railway GitHub App for `CapstoneDesign-Fall2026-UlsanCollege/Team1` before the repository can be connected.

### Railway backend deployment unblock steps

1. Ask an organization administrator to approve the Railway GitHub App for the `CapstoneDesign-Fall2026-UlsanCollege` organization (or directly for the `Team1` repository).
2. In Railway, connect the `CapstoneDesign-Fall2026-UlsanCollege/Team1` repository to the backend service.
3. Configure backend environment variables in Railway (for example, database host/user/password/name and session-related settings).
4. Deploy from the connected repository and verify backend health/API endpoints.
5. Update the frontend runtime API base URL to the deployed backend URL and re-test login/data flows.

## Development workflow

1. Confirm the GitHub issue for the feature slice.
2. Build the backend endpoint and frontend control together.
3. Run the frontend build and backend tests.
4. Test the flow as administrator and student.
5. Commit with a clear message and push to the team repository.

The repository is currently a development MVP. Deployment, job listings, and production account management remain future work.
