# Setup guide

Reviewed November 28, 2026. PowerShell commands start at your cloned Team1 root. Install Git, Node.js 24/npm and local MySQL first. Use your actual database port (this laptop uses 3307). Keep credentials private in `backend/.env`.

## Install and configure

```powershell
git clone https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1.git
cd Team1
npm.cmd ci --prefix backend
npm.cmd ci --prefix frontend
node --version
npm.cmd run build --prefix backend
Copy-Item backend/.env.example backend/.env
```

Expected: Node v24, packages install and TypeScript compiles. Edit private DB_HOST/DB_PORT/DB_USER/DB_PASSWORD. Do not use production credentials for the fixture. Optional Seoul API key is for jobs, not the school demonstration. DB_SSL/DB_SSL_CA configure remote persistent TLS.

## Safe disposable demonstration

Requires local CREATE/DROP DATABASE and table/trigger privileges. This existing harness creates fictional school/classes/teachers/students, homework, linked parent and menu in its own random schema. It is not a permanent installation. Temporary passwords print locally; never publish them.

```powershell
$env:VITE_BASE_PATH='/'
npm.cmd run build --prefix frontend
Remove-Item Env:VITE_BASE_PATH
cd backend
$env:UI_REVIEW='1'
$env:PARENT_REVIEW='1'
$env:TEACHER_REVIEW_ATTENDANCE='1'
node --env-file=.env scripts/teacher-review.mjs
```

Expected: terminal prints `http://127.0.0.1:3019/` and temporary credentials. Open that URL. Accounts: `review_admin`, `review_teacher`, `review_pupil_01`, `review_canteen`, `Preview_parent`, with your run's temporary password.

Teacher: assign fictional homework. Student and parent: find that saved homework. Canteen: edit/save a published item. Student: see saved item. [Expected/actual receipt](../classroom/week13/verification.md).

Type `stop` in the running fixture terminal. Expected: server exits and its random `studenthub_teacher_review_...` schema is removed. Keep terminal open through cleanup. After interruption, verify the exact fixture schema before manual cleanup; never remove `studenthub` or production data.

## Normal development: provisioned database only

Normal startup extends existing base tables. Migrations start at 002; this checkout lacks a canonical permanent baseline/first-admin route. Do not claim an empty permanent install or use private dumps for handoff. Configure DB_NAME for your authorized existing local database and use administrator-issued accounts.

Open two PowerShell terminals from repository root:

```powershell
# Terminal 1
cd backend
npm.cmd run dev
```

```powershell
# Terminal 2
cd frontend
npm.cmd run dev
```

Expected: API announces port 3000; Vite prints its development address. Open `/Team1/` with default Vite base. API calls proxy to 3000. Backend dev compiles once: restart after backend edits.

## Tests

```powershell
npm.cmd test --prefix frontend
npm.cmd test --prefix backend
```

Database tests are opt-in; skipped tests are not a database pass. From `backend` with local `.env` and schema creation privileges:

```powershell
$env:RUN_SCHOOL_DB_TESTS='1'
node --env-file=.env --test tests/school-planning.test.mjs
Remove-Item Env:RUN_SCHOOL_DB_TESTS
```

Expected: zero failures/skips and removal of the random `studenthub_school_test_...` schema. [Actual outputs](../classroom/week13/verification.md).

| Observation | First check |
| --- | --- |
| MySQL connection refused | Service running, correct port and private credentials |
| Missing database/users table | Persistent route needs provisioned schema; use disposable demo |
| Port occupied | Stop your own earlier server, then restart |
| Assets 404 | Fixture/production base `/`; default development base `/Team1/` |
| Test creation denied | Local operator supplies test schema privileges |
| Saved record absent | Selected class/term/date, role scope and publication |

[Architecture](architecture.md) | [Deployment/recovery](deployment.md) | [Independent trial](../classroom/week13/peer-test-notes.md)
