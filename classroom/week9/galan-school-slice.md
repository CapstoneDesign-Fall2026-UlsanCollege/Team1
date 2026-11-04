# Galan Bishal — chosen school slice and acceptance check

**Owner:** Galan Bishal (`bishal482`) · **Updated:** 2026-11-04  
**Issue:** [S1 #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66)  
**Next review:** Week 10, November 5 · **Freeze gate:** Week 11, November 12.

## One journey to prove

> An administrator explicitly assigns a fictional student to a grade/class and links its term and subject. The signed-in student opens My Class and sees only that class's subjects and timetable after refresh.

This is the smallest S1 school/homeroom-group slice. StudentHub primarily supports school administration in Nepal; a homeroom class is a student group, with its physical classroom assigned separately.

**Current boundary:** [f889b9f](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f889b9f) published the plan. Subsequent school planner, grade-filtered directory, teacher and room work exists locally with coding assistance, but its application source remains uncommitted/unpublished as of this response. This documentation update does not ship it or close #66. Freeze/publish the source first, then attach its exact commit and run results. A local screen alone is not a reproducible repository release.

## Planned non-author acceptance check

Use an isolated database and approved fictional accounts. The tester must record their own source commit, environment and actual results. **No independent run is recorded here.**

1. Administrator creates/reviews year 2026–2027, Grade 2 Class A and Class B. A duplicate identity in the same year/grade must be rejected.
2. Explicitly link a reviewed term and Mathematics offering to A, and a different subject to B. Do not derive classes from majors.
3. Assign fictional Student A to A and Student B to B. Reload: memberships must persist.
4. Sign in as A. My Class must show A; its courses/timetable must exclude B-only records, rosters and private profiles.
5. Send a forged class/student ID as A. It must not reveal B's data. Student/canteen-head school-mapping writes must be denied.
6. Transfer A with an effective date. Check current membership and retained history. Two competing stale assignments must not create duplicate open memberships.
7. Check an unmapped student: show assignment-needed/empty academic state, with no legacy-major fallback. Restart the backend and repeat the membership read.

**Done when:** source commit, actual automated result, safe admin/student proof and a real non-author expected/actual note are linked in #66. A failed step stays unchecked and records the first failure.

**Result:** planned independent test, not passed. Galan owns source/setup and fixes; the S1 non-author tester is not confirmed. Another assistant run cannot satisfy that role.

## Migration example and stop conditions

| Existing record | Explicit action | Required check |
|---|---|---|
| Login/profile/password hash | Keep identity; add a class-membership link | IDs, account count and hashes unchanged |
| College major, e.g. Computer Science | Keep legacy reference; separately select Grade 2 Class A | No major-to-grade inference |
| Existing semester | Review dates and link the school year | Dates fit; original ID retained |
| Subject/offering | Review subject/term and link class | Unmapped offerings remain visible for review |
| Weekly meeting/location | Preserve original row and location; review intended wall time | Explicit Nepal time; no silent conversion of old Korea assumptions |
| Teacher display name | Review and map stable staff ID | Same-name teachers are not silently merged |

Before real activation: retain a private backup, dry-run the mapping/counts on an isolated copy, review unresolved rows and test student isolation. Enable school access only after explicit administrator confirmation. If review fails, stop before production activation and preserve original records. Shared proof must exclude database exports, personal data and secrets.

## Scope and fallback

- November 2 owner decision: the teacher of **Sunday's 10 AM lesson** is the homeroom teacher for the selected term. The local teacher directory derives this; separate manual assignment/history and student homeroom-teacher display are not proven. Reconcile [#67](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/67)/[#68](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68) before a broader claim.
- November 3 explicit owner decision: a five-floor/eight-room board with 30 usual classrooms and 10 special rooms ending 07/08, with lab bookings. This bounded allocation scope does not silently reopen the cancelled general finder #57–59 and is not an S1 acceptance dependency.
- C1 is supporting work with [8 passing local automated checks](galan-c1-local-check.md), not another required step in this S1 journey. Optional jobs, room/canteen extensions, teacher portals, attendance and marks stay outside this chosen demo promise.
- If S1 cannot be reproduced by November 12, freeze the smaller verified subset and state the gap. If hosting is unavailable, use a documented local setup and label it local. Railway purchase/recovery remains pending.

## My next actions

| Action | Owner | Observable finish / evidence |
|---|---|---|
| Freeze/publish S1 source and setup | `bishal482` | Commit and runnable start steps linked in #66 |
| Check that exact version | `bishal482`, assistance disclosed | Actual versioned result and safe proof |
| Arrange real non-author S1 check | `bishal482` coordinates; tester unconfirmed | Tester-authored expected/actual note and proof |
| Verify release or local fallback | `bishal482` | Separate deployment/local setup result; no purchase assumed |
