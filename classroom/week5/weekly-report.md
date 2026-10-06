# Weekly Report

**Team:** Team 1  
**Week:** 5  
**Date:** 2026-10-07  

## This week's goal

What did your team try to improve this week?

> Move StudentHub from local development to a public deployment by publishing the frontend, deploying the backend, and migrating the database to Railway MySQL. Begin checking whether the main features work together online.

## What we committed to do

- [x] Publish the Vue frontend through GitHub Pages.
- [x] Deploy the Express backend to Railway.
- [x] Import the existing database into Railway MySQL.
- [x] Configure frontend API requests and backend database connections.
- [x] Run the frontend build and existing backend tests.
- [ ] Complete deployed workflow verification.

## Evidence links

If it is not linked, it does not count.

| Evidence | Link |
|---|---|
| Issue(s) | [Add the URLs of the deployment and verification issues] |
| Frontend/backend integration commit | [Connect published frontend to Railway API](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d) |
| Deployment workflow | [GitHub Pages workflow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml) |
| Public frontend demo | [StudentHub website](https://capstonedesign-fall2026-ulsancollege.github.io/Team1/) |
| Backend configuration | [Server and database connection](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/server.ts) |
| Test/check note | Frontend build and all 16 existing backend tests passed; [attach the result output or screenshot] |
| Database migration evidence | Import completed and `SHOW TABLES FROM railway;` returned application tables; [attach a screenshot without credentials] |
| Document update | [Project README](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/README.md) |

## Individual contribution entries — one row per student

Each student must complete their own row before submission.

| Student | What they did | Evidence link |
|---|---|---|
| Bishal Galan | Configured GitHub Pages and Railway, migrated the local database, tested deployment connections, and worked with AI assistance to connect the published frontend to the backend. | [Integration commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d) |
| [Team member name] | [Student adds their own contribution] | [Evidence link] |
| [Team member name] | [Student adds their own contribution] | [Evidence link] |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Timetable management displayed “Administrators only”; the cause is not yet confirmed | Bishal Galan | Sign in again as admin, reproduce the request, and inspect the current session role |
| Full cloud data persistence has not been verified | Bishal Galan | Test student editing, course assignment, and meeting changes, then reload the saved data |
| Published mobile layout needs further testing | Bishal Galan | Check navigation, scrolling, forms, and timetable controls on a small screen |
| Saramin API approval status needs confirmation | Bishal Galan | Confirm access and review the API documentation before integration |

## Decision record

Record only decisions that change scope, approach, ownership, or the next plan.

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Host the frontend on GitHub Pages | Provides a public interface and automated deployment from GitHub | Team 1 | [Deployment workflow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml) |
| Host the backend and MySQL database on Railway | Allows the public application to run without depending on a developer's computer | Team 1 | [Backend configuration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/server.ts) |
| Connect the frontend through a shared API helper | Keeps the API address and credential settings consistent across features | Team 1 | [API helper](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/api.ts) |
| Verify deployed workflows before closing integration work | Successful builds alone do not confirm permissions and database updates work online | Team 1 | [Add verification issue URL] |

## Next week's bridge task

- Resolve the timetable permission report and verify login, student editing, courses, and schedules on the deployed application.
- Confirm Saramin API approval and begin job finder integration.
- Complete published mobile checks and add test evidence to GitHub.
