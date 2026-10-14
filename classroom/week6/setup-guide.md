# Setup Guide

**Project:** StudentHub — Team 1, Ulsan College Capstone Design  
**Last updated:** October 14, 2026

## What this project does

StudentHub helps students view their profile, assigned semesters, courses, and weekly timetable in one place. Administrators manage accounts and academic information and review password reset reque[...]

## Requirements

- To use the deployed website: a browser, internet access, and a student or administrator account. Administrators create student accounts.
- For local development: Git, Node.js 24 with npm, and MySQL with the StudentHub database and its base tables.
- A Seoul Open Data authentication key is required for job listings. Store it as `SEOUL_API_KEY` in the backend environment, never in frontend code or GitHub.
- Railway and GitHub accounts are needed only to manage hosting and deployments.

## How to run or view the project

1. Open [StudentHub on Railway](https://team1-production.up.railway.app/). The deployed site works on laptops and phones without installing development tools.
2. Log in with the account provided by the administrator. Students open Student Life to view their profile, semesters, courses, timetable, or Student Job.
3. Administrators use the navigation tabs to manage students, semesters, courses, password requests, and timetables.

### Optional: run locally

Use PowerShell in the cloned Team1 repository root. On this development laptop, that directory is `C:\Users\galan\team1Studenthub\Team1`; other computers will have a different path.

1. Install dependencies:

   ```powershell
   npm.cmd ci --prefix backend
   npm.cmd ci --prefix frontend
   ```

2. If `backend/.env` does not exist, copy `backend/.env.example` to it. Set your database host, port, username, password, and database name. The example uses port 3307; use the port of your own MySQL [...]
3. Start the backend and frontend in separate PowerShell terminals, both from the repository root:

   ```powershell
   npm.cmd run dev --prefix backend
   ```

   ```powershell
   npm.cmd run dev --prefix frontend
   ```

   Keep both terminals running. Open the frontend address printed by Vite; the backend normally runs on port 3000.

## How to test/check the project

From the repository root in PowerShell:

```powershell
npm.cmd test --prefix backend
npm.cmd run build --prefix frontend
node --test frontend/tests/job-schedules.test.mjs
```

> We checked the backend using its automated tests. Expected result: all tests pass. Actual result: 23 tests passed on October 10. Proof: [backend test files](../backend/tests/) and [verification reco[...] 

> We checked the updated mobile time inputs by building the frontend and opening the interface at 320, 390, and 430 pixels wide with a test API. Expected result: smaller editable From/Until boxes with[...] 

For a live demonstration, log in as a student, open the timetable, search for a job, save it with the heart, and check Favourites after reloading. Administrator checks should include creating a clearl[...]

## Known problems

| Problem | Severity | Workaround or plan |
|---|---|---|
| Some job listings have missing or unclear workdays/hours. | Medium | Check the employer's details; turn off Include unknown schedules for stricter results. |
| Availability filters apply to the returned page; the first catalogue keyword search may take longer. | Low | Use keywords to narrow results and browse additional pages. |
| Timetable matching estimates class overlaps and does not include travel time. | Medium | Confirm the hours and location before applying. |
| Saved favourites are copies and may refer to changed or closed jobs. | Medium | Confirm availability with the employer. Live persistence across devices remains to be checked. |
| Password delivery is manual after an administrator approves a reset. | Low | The administrator verifies identity and privately emails the new password. |
| Provider job data uses an HTTP upstream endpoint. | Medium | Keep the API key on the backend and investigate HTTPS support with the provider. |
| The README contains older descriptions of deployment and job search. | Low | Use this guide and the current Job Finder documentation; update the README later. |

## Demo link or screenshots

- [Live StudentHub](https://team1-production.up.railway.app/)
- [Team1 GitHub repository](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1)
- Suggested screenshots: administrator dashboard, student timetable, compact job filters, and Favourites. Hide passwords, API keys, and personal student information.

The uploaded screenshot files are available in the repository. Use these links when preparing presentations or reports (do not include any sensitive data in the images):

- Administrator dashboard — overview: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/1.png
- Administrator dashboard — students list: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/2.png
- Student timetable: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/3.png
- Compact job filters: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/a.png
- Favourites (saved jobs): https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/b.png

Additional evidence images:

- Admin verification check: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/good.png
- Railway database verification: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/railwayshow.png

