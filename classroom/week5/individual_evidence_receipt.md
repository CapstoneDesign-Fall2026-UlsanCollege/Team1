# Individual Evidence Receipt

**Student:** Bishal Galan  
**Team:** Team 1  
**Week:** Week 05  
**Date:** 2026-10-07  

This document records my contributions across the development sessions. Include only the receipts relevant to the reporting week.

## Receipt 1

- **What I did:** Implemented administrator-created student accounts and login with administrator and student roles. Passwords are stored as bcrypt hashes.
- **Evidence link:** [Authentication implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/app.ts)
- **How I checked it:** Ran backend tests covering login, logout, disabled accounts, session restoration, and role restrictions.
- **What I learned or changed:** Account roles must be checked by the backend. Hiding administrator controls in the interface alone does not prevent unauthorized access.

## Receipt 2

- **What I did:** Connected the student profile interface to MySQL and allowed students to update email, phone number, and address.
- **Evidence link:** [Student profile backend](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/students.ts)
- **How I checked it:** Viewed saved profile information through the student interface and checked profile access restrictions using backend tests.
- **What I learned or changed:** Profile requests should identify students through their authenticated session. Students should only update the fields they are permitted to manage.

## Receipt 3

- **What I did:** Built the administrator student directory with searching, editing, account status management, and semester assignment changes.
- **Evidence link:** [Student directory interface](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/StudentManager.vue)
- **How I checked it:** Ran tests covering administrator access, editable-field validation, and database transaction behavior.
- **What I learned or changed:** Related profile and semester changes should be saved together so a failed update does not leave incomplete data.

## Receipt 4

- **What I did:** Added semester assignment during student creation and replaced manual semester ID entry with readable semester options.
- **Evidence link:** [Student creation interface](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/CreateStudent.vue)
- **How I checked it:** Checked semester selection in the administrator form and ran tests for account, profile, and semester creation in one transaction.
- **What I learned or changed:** Login IDs are suitable for identifying students in the interface, while internal user IDs maintain database relationships.

## Receipt 5

- **What I did:** Built a database-backed course catalog and interactive course assignment board with assignment removal, professor editing, refresh, and large-view controls.
- **Evidence link:** [Course planning interface](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/CourseBoard.vue)
- **How I checked it:** Checked saved assignments after refresh and ran tests covering assignment retrieval, removal, and administrator permissions.
- **What I learned or changed:** The database must be the source of saved course assignments so refreshing the page preserves the board.

## Receipt 6

- **What I did:** Changed course planning to group offerings by both semester and major, including Computer IT & Security and Global Business.
- **Evidence link:** [Major-based course planning](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/major-planning.ts)
- **How I checked it:** Ran tests confirming student course and timetable queries match both semester membership and major.
- **What I learned or changed:** Semester membership alone is insufficient because students from different majors study different courses.

## Receipt 7

- **What I did:** Implemented weekly timetable creation, editing, removal, and overlap detection for each semester and major.
- **Evidence link:** [Timetable backend](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/schedules.ts)
- **How I checked it:** Ran tests for meeting validation, permissions, conflict handling, and transaction rollback. Deployed administrator-session verification remains open.
- **What I learned or changed:** Conflict checks must also run in the backend. Different majors can have classes at the same time, while overlapping classes within the same major and semester should be prevented.

## Receipt 8

- **What I did:** Built the student dashboard from the wireframe and adjusted navigation and layouts for smaller screens.
- **Evidence link:** [Student dashboard implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/StudentLife.vue)
- **How I checked it:** Reviewed the student interface and passed the frontend production build. Further testing on the published mobile interface remains necessary.
- **What I learned or changed:** Bottom navigation should remain accessible while scrolling, and page content needs enough space to avoid being covered by navigation.

## Receipt 9

- **What I did:** Added project documentation describing StudentHub features, setup, structure, and deployment considerations.
- **Evidence link:** [Project README](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/README.md)
- **How I checked it:** Reviewed the documentation against the project structure and checked that private environment files were excluded from the commit.
- **What I learned or changed:** A public repository needs clear setup instructions and must keep credentials outside committed files.

## Receipt 10

- **What I did:** Published the Vue frontend on GitHub Pages using an automated build and deployment workflow.
- **Evidence link:** [GitHub Pages workflow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml)
- **How I checked it:** Passed the production build and opened the [published StudentHub interface](https://capstonedesign-fall2026-ulsancollege.github.io/Team1/).
- **What I learned or changed:** Vite needs the `/Team1/` base path for repository hosting. GitHub Pages hosts the frontend, while the backend requires separate hosting.

## Receipt 11

- **What I did:** Deployed the Express backend to Railway and corrected its root directory, listening address, and public target port.
- **Evidence link:** [Backend server configuration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/server.ts)
- **How I checked it:** Confirmed Railway reported an active deployment, checked startup logs showing port 8080, and confirmed the public server responded.
- **What I learned or changed:** Railway assigns the server port through `PORT`. The server must listen on `0.0.0.0`, and the public domain must target the matching port.

## Receipt 12

- **What I did:** Exported the local StudentHub database and imported its structure and data into Railway MySQL. Configured backend database variables using Railway references.
- **Evidence link:** [Backend database connection configuration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/server.ts)
- **How I checked it:** Completed the Workbench import and ran `SHOW TABLES FROM railway;` to confirm application tables existed. Full deployed read-and-write verification remains pending.
- **What I learned or changed:** Local and cloud databases require separate connections. Database credentials belong in hosting environment variables, and backups containing account data should stay protected.

## Receipt 13

- **What I did:** Connected frontend requests to the Railway API and configured credentialed requests, an allowed frontend origin, and secure session cookies.
- **Evidence link:** [Integration commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d)
- **How I checked it:** Passed the frontend build and all 16 existing backend tests. The published administrator interface opened, but timetable permission behavior still requires investigation.
- **What I learned or changed:** Separate frontend and backend domains require explicit browser access and cookie configuration. Passing local tests does not replace checking the deployed workflow end-to-end.
