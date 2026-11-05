# Individual Evidence Receipt — Galan Bishal

**Student:** Galan Bishal (`bishal482`)  
**Team:** Team 1 — StudentHub  
**Week:** 9 · October 29–November 4, 2026  
**Updated:** November 4, 2026

Supporting evidence for my row in the [single shared Week 9 report draft, PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/pull/71). This is not another weekly report. Prepared with coding assistance from linked repository work and actual checks; other students' work is not claimed here.

## Receipt 1 — C1 daily canteen menu

- **What I did:** Implemented the dated canteen-head menu editor and student view with coding assistance: draft, publish, edit, unpublish, persistence and protected role access.
- **Evidence:** [Implementation 5b2fe5a](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5b2fe5a), [published setup note](../../docs/canteen-daily-menu.md), [exact November 4 result](evidence/c1-local-2026-11-04.txt), [environment and limits](galan-c1-local-check.md).
- **How it was checked:** The coding assistant reran the published C1 suite on my behalf in disposable local MySQL: **8 passed, 0 failed, 0 skipped**. This was an assistant-run automated check, not my personal independent test or a teammate result.
- **What I learned:** A local pass does not prove deployment. C1 still uses its original Asia/Seoul service date and KRW prices; Nepal localization and live verification are not established by this run.

## Receipt 2 — School scope and migration planning

- **What I did:** Revised the project toward middle/high-school administration, academic years, grades and explicit class membership, preserving college data for review.
- **Evidence:** [Planning commit f889b9f](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f889b9f), [Week 9 design](design-doc-v2.md), [S1 #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66), [my selected slice and migration/check plan](galan-school-slice.md).
- **How I checked it:** Reviewed the design against the instructor's [Team 1 feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/grades-and-feedback/blob/main/Week%209/feedback.md#team-1) and current local work. The November 1 design remains a historical planning snapshot, not a shipped-feature claim.
- **What I changed:** Chose one administrator-to-student class-membership journey as my first proof target. A college major must never be automatically converted into a grade.

## Receipt 3 — Week 9 feedback response and next delivery

- **What I did:** Linked the exact C1 result, recorded hosting separately, and wrote an owner, observable acceptance check and fallback for S1. Updated only my contribution row in the existing shared-report draft.
- **Evidence:** [C1 check](galan-c1-local-check.md), [S1 acceptance plan](galan-school-slice.md), [shared-report PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/pull/71).
- **How it was checked:** Matched these files to the feedback's `bishal482` next step: link commits and actual local results, then record the chosen school slice and acceptance check. Documentation links were checked before publication.
- **What remains:** Subsequent school UI/code exists in an uncommitted local checkout. This documentation-only update does not publish that application source or close its acceptance gate. My next action is to freeze/publish S1 and obtain a real non-author result against that version. No successful Railway deployment or independent school/C1 test is asserted. The current plan is to revisit Railway on November 10.
