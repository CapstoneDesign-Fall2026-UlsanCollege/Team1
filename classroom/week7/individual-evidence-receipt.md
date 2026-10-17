# Individual Evidence Receipt

**Student:** Galan Bishal — bishal482  
**Team:** Team 1 — StudentHub  
**Week:** 7  
**Date:** October 17, 2026  

This receipt supports the team’s [shared Week 7 Weekly Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week7/weekly-report.md).

## Receipt 1 — Semester details and navigation

- **What I did:** Added clickable semester details showing assigned students and course offerings, with shortcuts to student management, courses, and the matching timetable. Completed the implementation with coding assistance.
- **Evidence link:** [Implementation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/292d96b), [Issue #50](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/50).
- **How I checked it:** Frontend build and browser checks covered the semester list, linked records, management shortcuts, and mobile layout. Backend tests covered permissions, validation, and deletion guards.
- **What I learned or changed:** Showing connected records makes administration easier and explains why a semester cannot be deleted.

## Receipt 2 — Backend test run and screenshot evidence

- **What I did:** Ran the backend test command and uploaded its terminal result as evidence.
- **Evidence link:** [Test screenshot](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/testing/test_result.png), [Test Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/testing/test-report.md).
- **How I checked it:** Ran `npm.cmd test --prefix backend` from the Team1 repository root. The output showed **24 tests, 24 passed, and 0 failed**.
- **What I learned or changed:** Linked terminal output provides direct evidence of the automated test result. It is separate from proof of live browser workflows.

## Receipt 3 — Live semester deletion and favourites checks

- **What I did:** Tested semester deletion and favourites persistence across devices and reported that both passed.
- **Evidence link:** [Completed verification record #53](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/53), [Test Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/testing/test-report.md).
- **How I checked it:** Checked the live semester-deletion workflow and whether a saved favourite remained available when accessing the account from another device.
- **What I learned or changed:** Updated the report so these passed checks appear under evidence instead of remaining listed as blockers. The live results are recorded as my reported observations; the terminal screenshot proves the automated suite.

## Receipt 4 — Midterm demonstration preparation

- **What I did:** Prepared the midterm demo script, organised its timing for four speakers, and reported the preparation checks passed.
- **Evidence link:** [Midterm Demo Script](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week7/midterm-demo-script.md), [Preparation Issue #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/46), [Verification record #52](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/52).
- **How I checked it:** Reviewed the script against the presentation structure: user problem, scope, one demo path, evidence and limits, every member’s contribution, and the next step.
- **What I learned or changed:** Focused the demonstration on one connected journey: timetable → job search → Favourites, rather than trying to demonstrate every feature.

## Receipt 5 — Updated design and Room Finder scope

- **What I did:** Updated the Week 7 design document and changed Room Finder from student accommodation search to finding available classrooms for administrators.
- **Evidence link:** [Week 7 Design Doc](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week7/design-doc-v1.md), [Scope-change commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5ce7de4), [Planning Issue #51](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51).
- **How I checked it:** Reviewed the purpose, target users, planned features, final-demo sentence, and risks to ensure they consistently describe classroom availability.
- **What I learned or changed:** Classroom availability needs consistent room identifiers and conflict checks across majors. This is a planned feature, not completed functionality.

## Receipt 6 — Feature tracking and shared documentation

- **What I did:** Connected design features to existing Issues, created missing tracking Issues with coding assistance, and updated the shared report and test evidence links.
- **Evidence link:** [Job API #47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/47), [Favourites #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/48), [Password requests #49](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/49), [Semester details #50](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/50), [Documentation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/78a495b).
- **How I checked it:** Reviewed existing repository Issues to avoid unnecessary duplicates and linked the test report and screenshot from the Week 7 documents.
- **What I learned or changed:** Kept implemented features, passed checks, and future plans distinct. Listed the Seoul job API as an implemented core feature and preserved Week 2’s historical design.
