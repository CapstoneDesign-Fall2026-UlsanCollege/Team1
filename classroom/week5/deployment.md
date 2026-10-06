# StudentHub Deployment Guide

**Team:** Team 1  
**Last updated:** 2026-10-07  

## Overview

StudentHub uses three deployed services:

| Component | Technology | Hosting |
|---|---|---|
| Frontend | Vue, TypeScript, Vite | GitHub Pages |
| Backend API | Express, TypeScript, Node.js | Railway |
| Database | MySQL | Railway |

```text
Student browser
      |
      v
GitHub Pages frontend
      |
      v
Railway backend API
      |
      v
Railway MySQL database
```

## Public Addresses

**Frontend:**

https://capstonedesign-fall2026-ulsancollege.github.io/Team1/

**Backend:**

https://team1-production.up.railway.app

The backend serves API endpoints. Opening its root address may return `Cannot GET /` because no webpage is configured there.

## Prerequisites

- Access to the Team1 GitHub repository.
- Permission to configure GitHub Pages.
- Railway access to the repository through the approved GitHub App.
- An existing Railway project containing the backend and MySQL services.
- A local database backup for the initial migration.

## Frontend Deployment

### GitHub Pages Settings

In the repository:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.

### Vite Base Path

The frontend is hosted under the repository name. Configure:

```ts
base: '/Team1/'
```

in:

```text
frontend/vite.config.ts
```

### Deployment Workflow

The workflow is located at:

```text
.github/workflows/deploy-frontend.yml
```

It performs these steps:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs frontend dependencies with `npm ci`.
4. Runs `npm run build`.
5. Uploads `frontend/dist`.
6. Deploys the generated files to GitHub Pages.

The workflow runs on pushes to `main` and supports manual execution.

### Frontend API Configuration

The workflow supplies this build-time variable:

```text
VITE_API_ORIGIN=https://team1-production.up.railway.app
```

The shared helper in `frontend/src/api.ts` uses this address for API requests and includes session cookies.

If this variable changes, rebuild and redeploy the frontend.

Never place database passwords or private API keys in `VITE_` variables. These values are included in the public frontend build.

## Backend Deployment

### Railway Service Settings

| Setting | Value |
|---|---|
| Repository | `CapstoneDesign-Fall2026-UlsanCollege/Team1` |
| Branch | `main` |
| Root directory | `/backend` |
| Build command | `npm run build` |
| Start command | `npm start` |

The build compiles TypeScript. The start command runs:

```text
node dist/server.js
```

### Listening Address and Port

The server configuration uses:

```ts
const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, '0.0.0.0');
```

- Railway provides the `PORT` environment variable.
- Local development falls back to port `3000`.
- `0.0.0.0` allows Railway to reach the running server.

### Public Networking

In **Railway → Team1 → Settings → Networking**:

1. Generate a public domain.
2. Set its target port to the port shown in deployment logs.

At the time of setup, the server used port `8080`.

If the assigned port changes, update the domain target accordingly.

### Backend Environment Variables

Configure these in the **Team1 backend service**:

| Variable | Value |
|---|---|
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_USER` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `DB_NAME` | `${{MySQL.MYSQLDATABASE}}` |
| `FRONTEND_ORIGIN` | `https://capstonedesign-fall2026-ulsancollege.github.io` |

These database references assume the Railway database service is named `MySQL`.

`FRONTEND_ORIGIN` contains only the website origin. Do not append `/Team1/` or a trailing slash.

Save variable changes and deploy them when Railway prompts.

## Database Migration

### Export the Local Database

In MySQL Workbench:

1. Connect to the local StudentHub database.
2. Open **Server → Data Export**.
3. Select the database and its tables.
4. Export structure and data to a self-contained SQL file.

Keep the backup outside the public repository.

### Connect Workbench to Railway

Use the connection information from:

**Railway → MySQL → Database → Connect → Public Network**

Create a separate Workbench connection named `StudentHub Cloud`.

Use the current Railway hostname, port, username, and password. Keep the existing local connection unchanged.

The external connection is for desktop tools. The backend uses Railway's private connection variables.

### Import the Backup

In the cloud Workbench connection:

1. Open **Server → Data Import**.
2. Select the self-contained SQL backup.
3. Choose `railway` as the default target schema.
4. Start the import.
5. Review the import output for errors.

If the backup contains its own `CREATE DATABASE` or `USE` statements, those statements can override the target schema selection. Verify the actual destination before proceeding.

### Verify the Tables

Run:

```sql
SHOW TABLES FROM railway;
```

Confirm that application tables such as `users`, `student_profiles`, `courses`, and `semesters` exist.

The completed migration imported the existing tables and data. Future deployments do not automatically apply database migrations; review and apply required migration files separately.

## Login Between the Two Sites

The frontend and backend use different origins.

The implementation therefore:

- Sends requests with `credentials: 'include'`.
- Allows the configured frontend origin through CORS.
- Uses `HttpOnly`, `Secure`, and `SameSite=None` session cookies when a separate frontend origin is configured.
- Requires the `X-StudentHub` header for data-changing requests.

Browser privacy settings may affect cross-site cookies. Verify login and session restoration on the browsers used for the demonstration.

Sessions currently reside in backend memory. Restarting or redeploying the service clears them, and users must log in again.

## Verification After Deployment

- [ ] GitHub Actions finishes successfully.
- [ ] Railway reports an active backend deployment.
- [ ] The public frontend loads.
- [ ] Admin and student accounts can log in.
- [ ] Sessions behave correctly after refresh.
- [ ] Student profile changes persist.
- [ ] Course assignments reload correctly.
- [ ] Timetable operations enforce permissions.
- [ ] Student courses and schedules match their major and semester.
- [ ] The interface works on a small screen.

See `testing.md` for the detailed test record.

## Troubleshooting

### Railway Cannot Build the Repository

Check that the root directory is `/backend`. The repository root contains multiple project folders.

### Application Failed to Respond

Check:

- The server listens on `0.0.0.0`.
- The service is running.
- The public domain targets the port shown in startup logs.

### Cannot GET /

The backend root has no webpage. This response shows that the server is reachable, but it does not verify database access.

### Service Unavailable

Review Railway logs and confirm:

- Database variables reference the correct MySQL service.
- The configured schema contains the required tables.
- Required migrations have been applied.

### Administrators Only

Confirm the current session belongs to an admin account. Logging in as a student in another tab can change the shared session.

The reported timetable rejection remains under investigation.

### Frontend Cannot Reach Backend

Check:

- `VITE_API_ORIGIN` in the frontend deployment workflow.
- `FRONTEND_ORIGIN` in Railway.
- Backend deployment and public networking.
- Browser request errors.

### Git Push Rejected

The remote branch may contain newer changes. Save or commit local work, synchronize the branch, resolve any conflicts, then push.

Do not force-push shared work to bypass this error.

## Credential Handling

- Keep local `.env` files out of GitHub.
- Store cloud credentials in Railway environment variables.
- Keep SQL backups containing account and student data private.
- Exclude passwords and session cookies from screenshots and logs shared as evidence.
- Keep external API secrets in the backend environment.

## Current Status

- Frontend published on GitHub Pages.
- Backend deployed and publicly reachable.
- Database imported into Railway MySQL.
- Frontend/backend connection changes pushed.
- Full deployed workflow verification remains in progress.
- Saramin job finder integration is not completed.
  
