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

## Receipt 9 — Focused ownership and reproducible handoff

- **What I did:** Applied the Week 10 ownership example to one real booking behaviour and the school room API, separating the slice owner, area steward, persistence handoff and unconfirmed backup.
- **Evidence:** [Ownership map and code explanation](code-ownership-galan.md), [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72), [recorded school checks](evidence/school-mysql-2026-11-05.txt).
- **How it was checked:** Matched the documented request flow to the actual form, route, transaction helper, schema and existing test assertions. This documentation update did not rerun or invent a teammate test.
- **What I learned or changed:** More features are not stronger ownership evidence. A second person still needs to accept the handoff and explain/repeat the linked checks.

## Receipt 10 — Canteen owner operations

- **What I did:** Requested and implemented, with coding assistance, a dedicated school canteen-head workspace for menu prices/availability, saved hours/location and dated closure notices, keeping academic administrators outside content editing.
- **Evidence:** [Canteen check and screenshots](canteen-owner-check.md), [operator/setup guide](../../docs/canteen-owner-workspace.md), [C2 #55](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/55), [C3 #56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56).
- **How it was checked:** Coding assistant ran 12 focused canteen checks and a 62-pass full backend run with both isolated database suites, built the frontend and checked the owner-to-student publish/unpublish flow at desktop/mobile sizes using labelled fictional records.
- **What I changed or learned:** New menus use Nepal dates and NPR while old currency data is preserved. Drafts and unknown hours/statuses prevent invented official service claims. Non-author review and live deployment remain pending.

## Receipt 11 — Canteen day selection and saved-meal shortcuts

- **What I did:** Requested and implemented, with coding assistance, weekday selection, a protected new-menu draft form, saved-name suggestions with editable automatic prices, and the रू price label. New custom names/prices remain supported.
- **Evidence:** [Actual implementation and checks](canteen-menu-shortcuts-check.md), [C3 #56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56).
- **How it was checked:** November 6 assistant-run regression: 63 backend and 12 frontend tests passed; compilation/build passed. Browser check saved a new fictional draft, verified price 80 autofill and manual price 35, blocked an existing date and reloaded via weekday selection.
- **What changed:** Rupee suggestions exclude old won prices. A matching suggestion fills the price but never copies yesterday’s availability; saved records remain date-scoped. Independent/live checks remain pending.

## Receipt 12 — Apply a menu to multiple selected days

- **What I did:** Requested and implemented, with coding assistance, a week/day checkbox form to copy current menu names/prices into independent dated drafts while protecting existing menus.
- **Evidence:** [Actual multi-day results and screenshots](canteen-menu-shortcuts-check.md#same-menu-multiple-days--subsequent-november-6-update), [64-pass regression](evidence/canteen-multi-day-backend-2026-11-06.txt).
- **How it was checked:** Assistant verified success, fresh IDs, availability reset, original preservation, all-or-nothing conflict rollback, bad input, roles and concurrent requests. Browser check created Monday/Wednesday/Friday demo drafts and reloaded one; mobile dialog fit.
- **What changed:** No silent replacement or copied stock claims; a conflict cancels the entire batch. Copies stay unpublished until reviewed, and this does not create a weekly recurring schedule.

## Receipt 13 — Skip existing dates during multi-day menu copy

- **What I did:** Requested and implemented, with coding assistance, a more convenient batch-copy policy: retain existing dates and create drafts for the rest, with an explicit created/skipped result.
- **Evidence:** [Revised behaviour and actual results](canteen-menu-shortcuts-check.md#revised-duplicate-handling--november-6-supersedes-the-earlier-all-or-nothing-date-conflict-rule), [14-pass focused check](evidence/canteen-skip-existing-2026-11-06.txt).
- **How it was checked:** Assistant-run MySQL cases verify mixed dates, all-existing retries, unchanged saved records and concurrent copies. Local API retry against two existing fictional dates returned zero created/two skipped with both read-backs unchanged; builds passed.
- **What changed:** Existing dates are normal skips rather than a batch failure. Unexpected database errors still roll back new inserts. Earlier all-or-nothing duplicate behaviour is superseded, not a current requirement.

## Receipt 14 — Simplify the canteen dashboard

- **What I did:** Reported usability friction and requested a simpler owner dashboard; implemented compact tabs, one-click week navigation, saved-food quick-add, smaller rows and a sticky explicit save/publish/copy bar with coding assistance.
- **Evidence:** [Changed behaviour, validation and screenshots](canteen-dashboard-usability.md), [C3 #56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56).
- **How it was checked:** Build passed; 12 existing frontend checks passed during the revision. Assistant browser checks verified quick-add price/focus, date/week navigation, tab-preserved drafts, future-menu save/publish/unpublish and phone fit.
- **What changed:** Common owner actions are grouped and require less scrolling; publication status distinguishes saved data from unsaved changes. Database/API rules and existing records were retained. Independent testing/live deployment remain pending.

## Receipt 15 - Track staff changes in an Activity Log

- **What I did:** Requested staff accountability and implemented, with coding assistance, automatic admin/canteen audit recording, a read-only admin history page, filters and pagination. Requested four-second save confirmations.
- **Evidence:** [A1 #73](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/73), [actual checks and screenshots](activity-log-check.md), [source/operation](../../docs/activity-log.md).
- **How it was checked:** Assistant ran 65 passing backend checks with all database suites enabled, extended audit integration, frontend compilation/build and 12 frontend checks; browser verified room change/restoration and phone fit. Private backup restoration passed first.
- **What I learned or changed:** Attribution uses authenticated staff and saves with the change. Distinct logins are required. Private values are hidden. Independent/live verification remains pending; no teammate review is claimed on their behalf.

## Receipt 16 - Simplify school enrollment and class administration

- **What I did:** Requested a full usability review and approved the first two improvements. With coding assistance, replaced college-only creation fields in school mode with direct class enrollment, and connected class students, timetable, teachers and rooms in one workspace.
- **Evidence:** [UX1 #74](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/74), [UX2 #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/75), [actual results and desktop/mobile screenshots](school-workspace-usability.md).
- **How it was checked:** Assistant-run 66-pass backend regression including atomic enrollment, rollback, roles, audit attribution and roster pagination beyond 100; frontend build and 12 frontend checks passed. Browser verified class-aware enrollment, linked rooms/teachers and 390px mobile fit.
- **What I learned or changed:** Enrollment must save with account creation to avoid unusable accounts. Shared class context reduces repeated selection, and optional fields should not dominate the form. Existing data and legacy behaviour are preserved. Independent human/live checks remain pending.

## Receipt 17 - Improve sample data presentation

- **What I did:** Requested removal of Demo display labels and more natural-looking sample names. With coding assistance, cleaned school/year/term, teacher/student names, subject/staff codes and related display values in the local database.
- **Evidence:** [Actual update, limits and screenshot](school-data-labels.md), [guarded maintenance script](../../backend/scripts/polish-local-school-labels.mjs).
- **How it was checked:** Full vendor backup restored successfully with table-row and trigger counts verified before updating 215 labels. Repeat preview found zero changes. Browser verified the new labels in the class planner.
- **What I learned or changed:** Presentation can look realistic while the records remain fictional. Existing real data, authentication credentials, record IDs, links and audit history were preserved. Only the local database was changed.

## Receipt 18 - Improve student home, homeroom and canteen visibility

- **What I did:** Reported missing student homeroom/menu information and requested a clearer dashboard. With coding assistance, added scoped teacher/room/today-lesson data, a useful student home, direct timetable/canteen navigation and consistent school labels.
- **Evidence:** [#76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/76), [actual checks and screenshots](student-dashboard-check.md).
- **How it was checked:** Assistant-run 67-pass full backend suite, frontend build and 12 frontend checks; browser verified Grade 6A teacher Deepa Karki, Room 101, daily lessons, published canteen information and 390px fit. Drafts remained private.
- **What I learned or changed:** Missing teacher data needed a scoped API change. A draft menu is not a published meal: the canteen head must publish the applicable Nepal date. I also requested a documentation review; the fresh-database setup gap is tracked in #77. Independent human/live checks are pending.

## Receipt 19 - Remove repeated student timetable cards

- **What I did:** Requested a shorter student timetable that lists identical days together and shows subjects once, while retaining different routines. Implemented with coding assistance.
- **Evidence:** [Grouping checks and screenshot](student-dashboard-check.md#follow-up-group-repeated-weekly-routines), [grouping tests](../../frontend/tests/weekly-routine.test.mjs).
- **How it was checked:** 15 frontend checks and production build passed; browser confirmed a single Sunday–Friday routine and mobile fit.
- **What I learned or changed:** Group by meaningful lesson details rather than database IDs. Teacher/room/time/subject differences remain visible. Saved timetable data and admin editing remain unchanged.

## Receipt 20 - Make student Home a feature launcher

- **What I did:** Clarified that Home should show feature tabs rather than long class/timetable/canteen panels. Implemented a compact one-tap feature grid with coding assistance; details remain on their own pages.
- **Evidence:** [Final design and browser check](student-dashboard-check.md#final-home-revision-feature-tabs-first).
- **How it was checked:** Frontend production build passed; all six features fit at 390x844, My Class opened the correct teacher/room, and Back returned to Home.
- **What changed:** Home now serves navigation. The old inline dashboard is superseded; academic data, grouped timetable and canteen publication rules are preserved.

## Create student usability follow-up — November 9

- **What I did:** Requested a class-first student creation form, automatic room/homeroom preview, password generation and Save & add another; implemented with coding assistance.
- **Evidence:** [Actual checks, source boundaries and safe screenshots](school-workspace-usability.md#create-student-class-first-enrollment--november-9), [CreateStudent.vue](../../frontend/src/components/CreateStudent.vue).
- **How checked:** Assistant-run frontend build and local browser inspection; no persistent account creation during the UI check.
- **Remaining:** Disposable-fixture save/repeat verification, independent teammate review and hosted verification. This does not change another member's contribution credit.

## Structured student IDs — November 9

- **What I did:** Defined admission year + grade/section + student number; requested automatic prefix generation without renaming existing accounts, implemented with coding assistance.
- **Evidence:** [Format, actual checks and screenshot](school-workspace-usability.md#structured-admission-ids--november-9), [format utility](../../frontend/src/student-id.ts), [checks](../../frontend/tests/student-id.test.mjs).
- **How checked:** Assistant ran the frontend build and 17 frontend checks; browser verified 6A/6B prefix changes with a padded student number. No persistent account was created for this check.
