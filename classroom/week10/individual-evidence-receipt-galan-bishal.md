# Individual Evidence Receipt — Galan Bishal

**Student:** Galan Bishal (@bishal482)<br>
**Team:** Team 1 — StudentHub<br>
**Week:** 10 · November 5–11, 2026<br>
**Updated:** November 5, 2026

Supporting evidence for my row in the [one shared Week 10 report](weekly-report.md). This publication carries forward work developed locally November 2–4; it does not relabel those dates as new Week 10 coding. Prepared with coding assistance from my requirements, iterations and linked implementation. Assistant-run checks are identified explicitly; other members' work is not claimed.

**Implementation:** [43a82ae](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae) · **Check details and limits:** [current release check](school-release-check.md).

## Receipt 1 — School administration foundation

- **What I did:** Defined the Nepal school workflow and implemented academic years, grades/classes, dated student assignment/transfer and explicit legacy mapping with coding assistance.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/school-planning.ts).
- **How it was checked:** 17 isolated MySQL checks cover school scope, permissions, membership history and transactions. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** Kept original student/academic data separate from fictional demo records.

## Receipt 2 — Dashboard and compact student membership

- **What I did:** Simplified navigation and task shortcuts; requested compact membership rows, 10-per-page navigation, class/unassigned filtering, grouped controls and temporary success messages.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #70](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/70), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/SchoolManager.vue).
- **How it was checked:** Frontend build passed; historical dashboard desktop/mobile proof is in Week 9. Latest compact list visual retest is pending. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** The membership search retains a 100-account retrieval cap; page controls do not claim unlimited server pagination.

## Receipt 3 — Subject planner and confirmation popups

- **What I did:** Implemented the grade subject library, stable teacher links, drag/drop plus click alternatives, subject/teacher confirmation and timetable lesson forms. Fixed direct-library-drop popup opening.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #64](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/64), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/SchoolSubjectPlanner.vue).
- **How it was checked:** School MySQL tests cover duplicate, stale and overlapping writes; historical fictional-data popup checks are linked in the release note. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** Only explicit confirmation saves; cancelling a second step keeps an already-confirmed subject but adds no lesson.

## Receipt 4 — Specialist teachers, routine and homeroom rule

- **What I did:** Chose one subject per demo teacher and a repeated daily routine. Specified Sunday 10 AM as homeroom teacher, then requested compact class cells, subject above the row, and 1–2 PM tiffin.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #63](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/63), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/TeacherDirectory.vue).
- **How it was checked:** Assistant SQL verification found 300 weekly demo lessons with five per class/day, no tiffin lessons; specialist migration checked no teacher overlaps. Frontend build passed. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** Ten specialist teachers move between classes. This demo mapping does not enforce subject qualifications on every future assignment.

## Receipt 5 — Room board and special-room booking

- **What I did:** Specified five floors, eight rooms/floor and 07/08 special rooms; implemented drag/drop assignment with popup forms, room labels, moves/releases, one-date bookings and conflict handling.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/components/SchoolRoomBoard.vue).
- **How it was checked:** 17 school database checks include room layout, isolation and conflict-safe booking. Existing two manual bookings were preserved during demo routine changes. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** Usual classroom assignment differs from a time-based special-room booking; cancelled records remain saved.

## Receipt 6 — Teacher availability and automatic booking details

- **What I did:** Requested subject/date-based time and teacher fill, multiple scheduled lesson choices, and an available-only supervising-teacher filter.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #64](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/64), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/frontend/src/room-availability.ts).
- **How it was checked:** Three new room-availability tests passed inside the 10-test frontend run: other-class clashes, own-class supervision, room bookings, cancelled bookings and missing times. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** Availability reflects recorded lessons/bookings only; the backend validates again on save.

## Receipt 7 — Persistent local database and data preservation

- **What I did:** Requested missing school tables and clearly labelled dummy data; restored persistent local preview access while preserving the six original student profiles.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/scripts/setup-local-school.mjs).
- **How it was checked:** Assistant verified private backup restoration, initial original-row preservation, seed rerun/idempotence and demo migration preservation checks. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** Private backups stay outside Git. Normal startup does not seed demonstration data or delete the persistent database.

## Receipt 8 — Source publication, evidence and issue maintenance

- **What I did:** Published the school implementation and this Week 10 contribution/evidence update; linked actual automated results to related issues, retaining incomplete acceptance work.
- **Evidence links:** [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Issue #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72), [source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week10/school-release-check.md).
- **How it was checked:** November 5 rerun: backend 38 passed/2 skipped, school MySQL 17 passed, frontend 10 passed; production frontend build passed. [Actual test outputs](school-release-check.md#actual-current-checks).
- **What I learned or changed:** No independent teammate test, latest visual browser pass or Railway deployment is claimed.
