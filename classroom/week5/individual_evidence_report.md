# Individual Evidence Receipt

**Student:** Budha Rajgiri  
**Team:** Team 1  
**Week:** Week 05  
**Date:** 2026-10-07  

This document records my contributions across the development sessions. Include only the receipts relevant to the reporting week.

## Receipt 1

- **What I did:** Investigated and designed the Student Job Search feature by analyzing requirements and creating a detailed feature specification document that explores three implementation options: Basic Job List, Filtered Job Search, and Automatic Schedule Matching.
- **Evidence link:** [Slice 5 - Student Job Search Investigation Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/29)
- **How I checked it:** Reviewed the investigation document for completeness, verified it includes all required filter options (day, date, time, location, distance, pay, category), and confirmed the proposed flow connects Student Schedule with Job Search functionality.
- **What I learned or changed:** A filtered job search approach is more practical than automatic matching for the midterm, as it provides useful functionality without requiring complex backend logic. Sample job data in MySQL is sufficient for demonstrating the feature rather than implementing a full employment marketplace.

## Receipt 2

- **What I did:** Created a comprehensive GitHub issue for Slice 4 (Weekly Timetable by Semester and Major) documenting all technical requirements, database structure, API endpoints, acceptance criteria, and test tasks.
- **Evidence link:** [Slice 4 - Weekly Timetable by Semester and Major Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/40)
- **How I checked it:** Verified the issue includes complete technical specifications with database table relationships, all API endpoint definitions with methods and purposes, detailed acceptance criteria covering admin and student permissions, and comprehensive task checklist aligned with implementation progress.
- **What I learned or changed:** Clear issue tracking with explicit specifications helps team coordination. Documenting both what should work (acceptance criteria) and known limitations (admin-session verification pending) makes verification and debugging more efficient.

## Receipt 3

- **What I did:** Created a detailed GitHub issue for Slice 5 (Student Dashboard and Responsive Navigation) specifying dashboard sections, navigation requirements, responsive design considerations, and acceptance criteria for the student-facing interface.
- **Evidence link:** [Slice 5 - Student Dashboard and Responsive Navigation Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/41)
- **How I checked it:** Reviewed the issue for complete coverage of all dashboard sections (Profile, Semester, Course, Schedule, Student Job), verified responsive design requirements are explicit, confirmed acceptance criteria address mobile usability and session restoration, and checked that remaining work (mobile verification, job finder integration) is clearly identified.
- **What I learned or changed:** Documenting remaining work as open tasks helps prioritize follow-up testing and prevents incomplete features from appearing finished.

## Receipt 4

- **What I did:** Tested the deployed StudentHub website login page on the public application and verified administrator access by capturing multiple screenshots demonstrating successful authentication and dashboard display.
- **Evidence link:** [Admin Dashboard Screenshots](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/tree/main/classroom/admin%20dashboard)
- **How I checked it:** 
  - Opened the published StudentHub interface at https://capstonedesign-fall2026-ulsancollege.github.io/Team1/
  - Logged in with valid administrator credentials
  - Navigated through the admin dashboard interface
  - Captured screenshots at key screens: login success, dashboard overview, student management, course planning, and navigation elements
  - Verified the interface is responsive and navigation is accessible
- **What I learned or changed:** Screenshots provide concrete evidence that the deployed application functions in production. Testing on the published site reveals differences from local development that might not be caught by automated tests, such as asset loading under the `/Team1/` base path and cross-domain session behavior.

## Receipt 5

- **What I did:** Updated the testing record to document evidence links for all admin dashboard manual test screenshots, creating a centralized reference for deployed application verification.
- **Evidence link:** [Testing Record - Manual Test Screenshots Section](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week5/testing-record.md#evidence-links)
- **How I checked it:** Verified that all 8 admin dashboard screenshots (numbered 1, 2, 3, 4, 5, 7, 8, 9) are properly linked, confirmed links point to the correct repository paths, and validated that the evidence section is now complete with folder and individual image references.
- **What I learned or changed:** Organizing evidence links in the testing record makes manual verification results easier to review and provides auditable proof of deployed application behavior for future testing cycles.

## Summary

This week's work focused on feature investigation and issue specification for Slices 4 and 5, practical testing of the deployed application, and documentation to support ongoing verification. The admin dashboard screenshots provide concrete evidence that the authentication system and administrator interface are functioning in production, while the GitHub issues create a clear specification reference for implementation and acceptance testing.
