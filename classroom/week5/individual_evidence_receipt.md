# Individual Evidence Receipt

**Student:** Ansh Sharma  
**Team:** Team 1  
**Week:** Week 05  
**Date:** 2026-10-07  

This document records my contributions across the development sessions. Include only the receipts relevant to the reporting week.

## Receipt 1

- **What I did:** Implemented Slice 1 — Student Accounts and Profile Management, allowing administrators to create student accounts with bcrypt password hashing and enabling students to log in and update their profile information.
- **Evidence link:** [Slice 1 — Student Accounts and Profile Management](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/37)
- **How I checked it:** Implemented backend endpoints for account creation, login/logout, and profile management. Connected the frontend to save and retrieve profile data from MySQL. Tested account creation with password hashing, login validation, and profile update restrictions.
- **What I learned or changed:** Account role validation must be enforced by the backend, not just hidden in the interface. Students should only be able to update contact fields (email, phone, address), not their role or academic details.

## Receipt 2

- **What I did:** Implemented Slice 2 — Administrator Student Directory and Editing, allowing administrators to search for students by name or login ID, view their information, and edit student profiles and semester assignments.
- **Evidence link:** [Slice 2 — Administrator Student Directory and Editing](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/38)
- **How I checked it:** Built the directory interface with search functionality. Implemented backend endpoints to retrieve and update student records with semester assignments. Tested that related profile and semester changes are saved together in a single database transaction.
- **What I learned or changed:** Multiple related updates should be saved atomically so a failed update does not leave the database in an inconsistent state. Database transactions are essential for maintaining data integrity when several tables are involved.

## Receipt 3

- **What I did:** Implemented Slice 3 — Course Planning by Semester and Major, allowing administrators to assign courses to semesters and majors, with support for professor assignment and removal of offerings.
- **Evidence link:** [Slice 3 — Course Planning by Semester and Major](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/39)
- **How I checked it:** Built the course assignment board interface. Implemented backend endpoints to load the course catalog, create course offerings, update professors, and remove assignments. Created database migration to support major-based course organization. Tested that students receive courses matching both their semester and major.
- **What I learned or changed:** The database must be the source of truth for course assignments. Different majors need different courses for the same semester, so both semester and major must be part of the assignment grouping key.

## Receipt 4

- **What I did:** Contributed to the Sprint 1 report documenting the project's launch and deployment milestone, including project purpose, target users, in-scope and out-of-scope features, and the candidate vertical slice for Uni Stay.
- **Evidence link:** [Sprint 1 Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week5/sprint-1-report.md)
- **How I checked it:** Verified that all evidence links in the Sprint 1 report resolve correctly. Confirmed that the project snapshot includes accurate information about the deployed StudentHub frontend, Railway backend, and Railway MySQL database. Validated that the candidate vertical slice and risk table are complete.
- **What I learned or changed:** Comprehensive reporting of deployment status, risks, and blockers is essential for tracking the project's progress and planning the next sprint. Clear ownership of exceptions and next actions helps the team stay aligned.

## Summary of Week 5 Evidence Links

| Item | Link |
|---|---|
| Slice 1: Student Accounts and Profile Management | [Issue #37](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/37) |
| Slice 2: Administrator Student Directory and Editing | [Issue #38](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/38) |
| Slice 3: Course Planning by Semester and Major | [Issue #39](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/39) |
| Sprint 1 Report | [Sprint 1 Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week5/sprint-1-report.md) |
