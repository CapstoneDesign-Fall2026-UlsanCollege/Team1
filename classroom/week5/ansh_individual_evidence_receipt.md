# Individual Evidence Receipt

**Student:** Ansh Sharma  
**Team:** Team 1  
**Week:** Week 05  
**Date:** 2026-10-07  

This document records my contributions across the development sessions for this reporting week. It is kept separate from the other team member's evidence record to avoid overlap in the Week 5 submission.

## Receipt 1

- **What I did:** Implemented Slice 1 — Student Accounts and Profile Management, including backend support for creating student accounts, bcrypt password hashing, session-based login/logout, and student profile retrieval and updates.
- **Evidence link:** [Slice 1 — Student Accounts and Profile Management](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/37)
- **How I checked it:** Verified the backend APIs for account creation, login, logout, profile reads, and contact updates. Confirmed the frontend saved profile data to MySQL and that access rules matched the intended student/admin roles.
- **What I learned or changed:** Role validation must be enforced on the backend, not only hidden in the UI. Students should only be allowed to edit their own permitted profile fields, and the server must reject unauthorized updates.

## Receipt 2

- **What I did:** Implemented Slice 2 — Administrator Student Directory and Editing, including search by name or login ID, profile viewing, semester assignment updates, and secure admin-only editing workflows.
- **Evidence link:** [Slice 2 — Administrator Student Directory and Editing](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/38)
- **How I checked it:** Tested the admin directory UI with search and editing flows, then validated backend endpoints for retrieving and updating student records. Confirmed that related changes were applied consistently across profile and semester data.
- **What I learned or changed:** Related updates must be saved atomically so a partial failure does not leave the database in an inconsistent state. Transactions are essential when editing multiple connected fields at once.

## Receipt 3

- **What I did:** Implemented Slice 3 — Course Planning by Semester and Major, allowing administrators to assign courses to a semester and major, update professors, and remove course assignments while maintaining a clear catalog view.
- **Evidence link:** [Slice 3 — Course Planning by Semester and Major](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/39)
- **How I checked it:** Built the assignment board interface and tested backend endpoints for loading the course catalog, creating course offerings, updating professor assignments, and deleting existing records. Verified that changes remained visible after refresh.
- **What I learned or changed:** The database must remain the source of truth for course assignments. Since each major can require a different set of courses for the same semester, both semester and major need to be considered together in planning logic.

## Receipt 4

- **What I did:** Contributed to the Sprint 1 report by documenting the deployment milestone, project purpose, target users, scope boundaries, risks, and the project status as of Week 5.
- **Evidence link:** [Sprint 1 Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week5/sprint-1-report.md)
- **How I checked it:** Reviewed the final report structure, confirmed that all evidence links resolved correctly, and verified that the deployment and project-snapshot content matched the current StudentHub status.
- **What I learned or changed:** A strong sprint report needs clear positioning, honest risk tracking, and concise ownership details. This makes progress visible to the team and supports planning for the next sprint.

## Summary of Week 5 Evidence Links

| Item | Link |
|---|---|
| Slice 1: Student Accounts and Profile Management | [Issue #37](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/37) |
| Slice 2: Administrator Student Directory and Editing | [Issue #38](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/38) |
| Slice 3: Course Planning by Semester and Major | [Issue #39](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/39) |
| Sprint 1 Report | [Sprint 1 Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week5/sprint-1-report.md) |
