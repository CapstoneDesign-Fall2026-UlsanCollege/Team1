# School class and subject planner — local check

Date: 2026-11-02. Related slices: #66 (school structure), #62 (teacher directory), #64 (teacher conflicts), #70 (dashboard usability).

Implemented locally: school years, homeroom classes, dated student memberships, explicit term/subject mappings, own-class student views, a clearer dashboard, and the grade subject planner. The preview now uses the same database-backed application factory as production, including password-request and job/favourite routes.

## Planner workflow

1. Open School classes, choose academic year and homeroom class, then Subjects and timetable.
2. The subject library is filtered by the class grade and academic year. Manage subject library can create a catalog subject or link an existing one to that grade.
3. Add teachers with unique staff codes. Choose a teacher and drag a library card into Class subjects, or select it and press Add selected to class.
4. Drag a class subject into a timetable cell to save a one-hour meeting. Drag a saved lesson to move it, preserving its duration. Selecting a card and clicking a slot is also supported for keyboard/phone use.
5. Default columns are Sunday–Friday, with Saturday optional. Default hours are 10:00–16:00, in Nepal time (Asia/Kathmandu). Existing lessons outside those hours remain saved and can be revealed with Show outside hours.
6. Class overlaps and stable-teacher overlaps across classes/overlapping terms are rejected transactionally. Stale revisions require reload. Duplicate subjects in a class term are rejected.

Teacher names on old unmapped offerings do not imply a stable teacher identity: explicitly assign the directory teacher before claiming their conflicts are checked. Shared offerings update all linked classes. Teacher logins and homeroom-teacher assignments are separate pending slices. Dates still use Gregorian ISO dates; a Bikram Sambat calendar conversion has not been added.

## Evidence and limits

- [Focused MySQL checks](evidence/s1-mysql-2026-11-02.txt): 14 passed, including Nepal midnight, grade library, role boundaries, teacher clashes, moves, duplicate assignments, rollback and stale writes. Uses an isolated random schema, removed afterward.
- [Standard backend checks](evidence/s1-backend-2026-11-02.txt): recorded run 36 passed, 2 opt-in database suites skipped; this standard run preceded the added Nepal-date unit test. Focused run above includes that test.
- Existing frontend checks: 7 passed. Backend and frontend production builds passed.
- Browser check by the coding assistant using fictional records: added English with Teacher Lee by click, placed Tuesday 10–11, moved it by drag to 11–12; dragged Computing from the grade library into class with Teacher Park, then into Wednesday 08–09 before the requested hour-range change. After changing the range, verified six rows 10–16, Sunday–Friday ordering, and saved Sunday English 12–13 correctly.
- Phone check at 390 px: selected Computing and placed Monday 10–11; page width 375 px within 390 px viewport. Timetable scrolling stays inside its container. Desktop check at 1280 px: page width 1265 px.
- [Desktop planner](evidence/subject-planner-desktop.png) / [Phone planner](evidence/subject-planner-mobile.png). Other S1 screenshots in this evidence directory show earlier local states; none prove a Railway deployment.
- Independent teammate testing, real-data migration review, live deployment and homeroom-teacher workflow are still pending. No production school profile has been enabled by this work.

## Local review

PowerShell, repository root: build backend and frontend first (set VITE_BASE_PATH=/ for the frontend build). The review helper requires local MySQL credentials supplied by the environment; never commit an .env file. Run backend/scripts/school-review.mjs with ALLOW_DISPOSABLE_SCHOOL_REVIEW=1, SCHOOL_REVIEW_SEED=1 and SCHOOL_REVIEW_PORT=3020. It prints temporary fictional credentials, uses a separate random review database, and removes that database when stopped with `stop` and Enter. Its seeded ten subjects and three teachers are demonstration data, not an approved Nepal curriculum. Its date is fixed to 2026-11-01 for repeatability; the normal server uses the actual Nepal date for school membership.

Normal startup ensures the additive school tables, including the grade library and stable teacher links; SQL migrations 008 and 009 also document those changes. The original academic rows remain for explicit review/mapping. Railway remains deferred until the user's planned November 10 purchase.

## Accounts update — 2026-11-02

Requested workflow: choose a grade before listing students; add teacher directory and derive homeroom responsibility from Sunday’s 10 AM subject teacher (confirmed by Galan in chat).

- Students: academic year defaults to current; choose grade, optional class, and membership date. Grade filtering happens in SQL before LIMIT 100. Unassigned students have an explicit option. Name search narrows the selected group. School-mode profile editing hides legacy major/year and semester assignment controls; class membership stays in School classes.
- Teachers: staff code/name search, academic year and term filters, assigned subjects and expandable weekly teaching timetable. Homeroom classes are calculated from stable teacher links on lessons starting Sunday 10:00; changing that lesson’s subject teacher changes the displayed homeroom teacher. No manual duplicate homeroom assignment is written. Missing Sunday first period/teacher is shown as no confirmed homeroom. Conflicting Sunday teacher data asks for review rather than choosing arbitrarily.
- Focused MySQL suite now: 15 passed, including filtered directory results with 101 earlier students in another grade, invalid class/date filters, historical membership, and admin-only teacher/student directory reads.
- Browser check with fictional accounts: Grade 2 showed only Fictional Student; Class B showed none; Unassigned showed only Fictional Unassigned Student. Teacher Kim initially showed Grade 2 Class A. Changed Mathematics teacher to Teacher Lee in School classes; returning to Teacher list showed Class A under Lee and no homeroom under Kim. Weekly teacher timetable showed Sunday and Monday 10–11 in Nepal time.
- Proof: [Students filtered by grade](evidence/accounts-grade-students.png), [Teacher homeroom and weekly lessons](evidence/accounts-teachers-homeroom.png).
- The review fixture was restarted to load the new backend routes; temporary credentials changed. No real accounts or production data were changed. Existing earlier planner screenshots predate this fresh fixture.
## Subject/timetable popup workflow — 2026-11-03

The school planner now uses confirmation dialogs rather than saving on drop:

- Library subject → class tray: opens a subject-teacher form; only Confirm subject writes the offering/link.
- Class subject → timetable slot: opens day, start/end time and optional location note; only Save lesson writes a meeting.
- Dragging a saved meeting opens the same form with its proposed destination and original duration. Clicking a saved meeting edits it. Change teacher opens a separate teacher form, avoiding a partial teacher-plus-meeting save.
- Cancel/Escape closes without saving. Failed writes leave the popup and entered values visible, with the backend error inside the form.

Browser checks by the coding assistant with fictional data: cancelled adding English and verified class count stayed at one; confirmed English with Teacher Lee; attempted Sunday 10–11, received a class-conflict error with form still open; corrected to Tuesday 11–12 and saved. Dragged the English class card onto Wednesday 10 AM, verified the prefilled popup, cancelled and verified the slot remained empty. At 390 px viewport, popup width was 337 px. Frontend production build and 7 existing frontend checks passed; backend write paths were unchanged.

Proof: [Lesson popup](evidence/lesson-popup.png), [phone popup](evidence/lesson-popup-mobile.png). These are local checks, not independent teammate or production-release evidence.

### Popup-opening correction — 2026-11-03

User reported that dropping did not open a popup. A confirmed missing path was dragging a catalog/library subject directly onto the timetable: it previously showed instruction text instead of opening a form. That path now opens teacher confirmation, then opens a lesson form prefilled from the dropped slot after the subject is explicitly confirmed. Cancelling the second step keeps the explicitly confirmed subject, but creates no lesson. Existing class-subject drops continue to open the lesson form directly.

Browser retest: dragged Computing class card to Wednesday 10 AM and saw Add lesson; cancelled. Dragged Art directly from the library to Wednesday 10 AM and saw Add class subject with the selected slot retained; cancelled. The teacher-confirmation-to-lesson transition was also checked with Computing. Native automatic dragging remains disabled on the source cards to avoid interrupting the pointer-driven drag; drop event handlers accept supported browser transfer data as a fallback. Duplicate modal opening is guarded. Frontend build passed.

Proof: [Library-to-grid drop popup](evidence/library-drop-popup-fixed.png). The user needs to reload an already-open page to load the rebuilt frontend.
