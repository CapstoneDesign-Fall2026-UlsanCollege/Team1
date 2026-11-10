# Week 10 — Individual Evidence Record

**Student:** Buddha Raj Giri  
**GitHub ID:** BudhaRajgiri  
**Team:** Team 1 — Student Life Hub  
**Week:** 10  
**Date of individual testing:** November 10, 2026  
**Evidence focus:** Student My Class view (#68)

## 1. My Individual Contribution

I carried out manual student-facing checks of the My Class experience in the disposable local school-review environment and prepared the Week 10 testing evidence and supporting links.

This record documents my testing and evidence-preparation contribution. It does not claim that I authored the underlying feature implementation.

## 2. Manual Test Results

| No. | Check | Observed result | Status |
|---|---|---|---|
| 1 | Home page | Home page loaded successfully | Passed |
| 2 | My Class page | Student's class information was displayed | Passed |
| 3 | Own class | Class A and classroom information appeared | Passed |
| 4 | Assigned teacher | Demo Teacher Kim appeared as the assigned teacher | Passed |
| 5 | Unassigned teacher | Class B, Classroom 102 showed the teacher as unassigned | Passed |
| 6 | Student privacy | Visible interface showed the logged-in student's class information only | Passed — UI check only |
| 7 | Weekly timetable | Science appeared Sunday, 10:00–11:00, Classroom 102 | Passed |
| 8 | Navigation | Home and My Class navigation worked | Passed |

**Manual result:** 8 of 8 planned interface checks completed successfully in the local disposable review environment.

**Privacy limitation:** This was a visible-interface check. It was not an independent direct-request/backend authorization test and does not establish that backend authorization was independently verified.

## 3. Main Individual Testing Report

- [Open my Week 10 testing report](evidence/BudhaRajgiri-Week10-Testing.md)

The report includes the detailed test table, screenshot evidence, supporting frontend/backend/database logs, and testing limitations.

## 4. Screenshot Evidence

The following screenshots are stored in the evidence folder:

- [Student Home — desktop](evidence/student-home-desktop.jpg)
- [Student Home — mobile](evidence/student-home-mobile.jpg)
- [Student Home — feature tabs](evidence/student-home-feature-tabs.jpg)
- [My Class workspace — desktop](evidence/class-workspace-desktop.jpg)
- [My Class workspace — mobile](evidence/class-workspace-mobile.jpg)
- [Class teacher information](evidence/compact-class-teachers.jpg)
- [Student grouped timetable](evidence/student-grouped-timetable.jpg)

## 5. Supporting Automated Test and Build Logs

These are project-level logs dated November 5, 2026. They are supporting evidence and are separate from my November 10 manual interface checks.

- [Frontend tests — 10 passed, 0 failed](evidence/frontend-2026-11-05.txt)
- [Frontend production build — successful](evidence/frontend-build-2026-11-05.txt)
- [Backend tests — 38 passed, 0 failed, 2 skipped](evidence/backend-2026-11-05.txt)
- [School MySQL integration tests — 17 passed, 0 failed](evidence/school-mysql-2026-11-05.txt)

## 6. Related Project Records

- [Feature issue #68 — Student My Class view](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68)
- [Week 10 shared team report](weekly-report.md)
- [School implementation publication and current verification limits](school-release-check.md)

## 7. Limitations and Next Actions

- The disposable review database is removed when the review server stops; the required review data had to be recreated after restarting it.
- The missing-teacher scenario was prepared with a test record in the disposable review database.
- A direct unauthorized backend request still needs a separate verification.
- A real non-author check against the published version and live-host verification remain separate team follow-up items.

## 8. Evidence Summary

My Week 10 individual contribution recorded here is the manual testing of the student-facing My Class workflow and preparation of linked evidence.

- Manual My Class interface checks: **8 passed out of 8**
- Frontend project log: **10 passed**
- Backend project log: **38 passed, 2 skipped**
- School MySQL project log: **17 passed**
- Frontend production build: **successful**

**Evidence owner:** BudhaRajgiri
