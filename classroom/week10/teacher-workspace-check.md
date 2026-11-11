# Teacher workspace — actual implementation and checks

**Owner:** Galan Bishal (@bishal482), with coding assistance
**Implemented:** November 10–11, 2026
**Slices:** [T1 #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/78), [T2 #79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/79), [T3 #80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/80)

## Delivered behavior

- Administrator: Accounts → Teacher access links a new login to a stable existing teacher ID. One teacher/one linked account; duplicate failures roll back the user insert. Administrator can disable/re-enable access. Disabling revokes existing sessions.
- Teacher: separate authenticated workspace for current-term schedule, assigned-class rosters, own homework and homeroom attendance. Name/ID roster search and ten-student pages; all four navigation buttons visible on mobile.
- Homework: choose an assigned class subject, title, instructions and due date within the active term; edit/archive own work using revision checks. Student Home → Homework shows only the effective class’s active assignments.
- Attendance: Sunday 10 AM teacher determines homeroom in the applicable active term. Conflicting/missing first-lesson assignments do not grant attendance rights. Status starts unmarked; choose Present, Absent, Late or Excused explicitly. Future dates and out-of-class students are rejected. Partial saves preserve unmarked records; previously saved statuses can be changed.
- Attendance revisions and the school planning lock prevent concurrent/stale writes and assignment races. New-table audit entries retain authenticated actor identity; homework instructions and attendance statuses are masked in Activity Log values. Administrator Activity Log correctly labels Teacher actors.
- Save notices expire after four seconds; errors remain visible. No account is silently created for every directory teacher.

## Data and source

[Migration 013](../../database/migrations/013_teacher_workspace.sql) appends the teacher role without changing existing enum positions and adds school_teacher_accounts, school_homework, school_attendance_sheets and school_attendance. Startup applies the guarded/idempotent equivalent through [teacher-workspace.ts](../../backend/src/teacher-workspace.ts). Production and local startup both call it before accepting requests.

[Teacher API](../../backend/src/teacher-workspace.ts) · [authenticated role boundaries](../../backend/src/app.ts) · [database registration](../../backend/src/database-app.ts) · [teacher UI](../../frontend/src/components/TeacherWorkspace.vue) · [admin access UI](../../frontend/src/components/TeacherAccounts.vue) · [student homework UI](../../frontend/src/components/StudentHomework.vue).

The November 11 local migration retained counts: 40 users, 36 student profiles, 20 teacher records, 34 memberships and 8 room bookings. No working accounts/passwords or academic assignments were renamed/replaced. [Count comparison](evidence/teacher-local-migration-2026-11-11.json). This checks row totals, not a byte-level backup/restore proof.

## Actual automated verification

Assistant-run, not independent teammate testing:

- Backend TypeScript compilation passed.
- [Latest full backend output — November 11](evidence/teacher-full-backend-2026-11-11.txt): **74 passed, 0 failed, 0 skipped**, with RUN_SCHOOL_DB_TESTS, RUN_ACTIVITY_DB_TESTS and RUN_MENU_DB_TESTS enabled.
- [Focused school/teacher run — November 10](evidence/teacher-workspace-tests-2026-11-10.txt): **26 passed**. New cases cover role isolation, duplicate-link rollback, roster privacy, forged IDs, expired terms, homework own-class visibility/archive/stale edits, future/foreign attendance, concurrent saves, inactive/ambiguous teachers, session revocation and teacher audit attribution.
- The attendance fixture contains over 100 students and a payload larger than 4 KB, verifying the explicit bounded teacher JSON allowance.
- Frontend TypeScript/production build passed after final UI refinements; **17 frontend checks passed**.
- An earlier broad run enabled the wrong menu flag and therefore had one skipped menu suite: [earlier output](evidence/teacher-full-backend-2026-11-10.txt). The [separate corrected menu run](evidence/teacher-menu-regression-2026-11-10.txt) passed 14 checks; the latest 74-pass run above supersedes the skipped run.
- “Fixture membership failure” in school output is deliberate rollback-test error injection, not an unhandled product failure.

Repeat from PowerShell in the Team1 root after dependencies/private backend/.env are configured:

```powershell
npm.cmd --prefix backend run build
$env:RUN_SCHOOL_DB_TESTS='1'
$env:RUN_ACTIVITY_DB_TESTS='1'
$env:RUN_MENU_DB_TESTS='1'
node --env-file=backend/.env --test backend/tests/*.test.mjs
Remove-Item Env:RUN_SCHOOL_DB_TESTS,Env:RUN_ACTIVITY_DB_TESTS,Env:RUN_MENU_DB_TESTS
$env:VITE_BASE_PATH='/'
$env:VITE_API_ORIGIN=''
npm.cmd --prefix frontend run build
node --test frontend/tests/*.test.mjs
```

The isolated database suites create and clean up disposable schemas, not the working studenthub data.

## Actual browser walkthrough — November 10–11

Used [teacher-review.mjs](../../backend/scripts/teacher-review.mjs), a separate temporary fictional database on port 3019. No school data was copied into it and no homework/attendance was added to the working database.

1. Teacher review login opened Asha Example’s schedule: Grade 6A Mathematics at 10:00 and Grade 6B Mathematics at 11:00. Homeroom was Grade 6A. [Schedule proof](evidence/teacher-schedule-desktop.jpg).
2. Class students showed only the selected assigned class, with names and login IDs. The final search returned 0 matches for an unmatched query and recovered after clearing. [Roster proof](evidence/teacher-class-roster.jpg). Ten-student pagination is implemented; this two-pupil browser fixture did not exercise a multi-page transition.
3. Created Fractions practice for Grade 6A Mathematics, due November 13. Actual: saved assignment appeared with class, subject, due date and instructions. [Teacher homework](evidence/teacher-homework-desktop.jpg).
4. Homeroom attendance initially showed 0/2 marked. Selected Present for Aarav Example and Late for Bina Example, saved, then reloaded. Actual: both statuses persisted. A 390×844 viewport override had document/scroll widths both 375px, excluding the scrollbar; all four navigation buttons fitted after a two-column mobile correction. [Mobile attendance](evidence/teacher-attendance-mobile.jpg). Viewport reset.
5. Student review login opened Home → Homework. Actual: the same Fractions practice task, due date and instructions appeared. [Student read-back](evidence/student-homework-readback.jpg). Cross-class denial is covered by the isolated API tests, not claimed from this screenshot.
6. Administrator Accounts → Teacher access showed both linked fictional teachers and status controls. [Access page](evidence/teacher-access-admin.jpg). Account creation/disable/re-enable branches were exercised by automated tests, not this browser walkthrough.

## Operator instructions

In the working local app, sign in as administrator → Accounts → Teacher access. Choose an active teacher, assign a login ID and initial password, and share it privately. Sign out and use that teacher login. Existing timetable/subject links determine what they see; directory records alone do not create login accounts.

## Limits and next actions

Independent human and hosted verification remain pending. Attendance is one daily status, not per-period attendance. Existing weekly assignments determine authorization on the selected date; historical timetable revisions and school closure calendars are not reconstructed. Partial marking is allowed; no automatic “all present”, attendance deletion, homework submission/marking or file attachments are included. Homework is text-only, up to 2,000 characters; current-term scope applies to writes. Grades/marks and parent accounts remain outside this slice.

The existing Activity Log triggers for older tables are retained; teacher writes use the newly registered teacher tables. No live deployment was performed. Galan coordinates a non-author walkthrough and the separate hosting decision.

## Administrator Teacher list follow-up — November 11

Galan requested a directory-first Accounts → Teacher list. The default view now renders one compact table with teacher/name status, staff code, subject and homeroom. No schedule grids are rendered until Schedule → Show teaching schedules is chosen. Academic year, term, subject and name/staff-code filters remain available. Returning to Hidden — teacher list restores the compact table without changing data or filters.

Actual assistant checks: frontend production build passed; local browser showed 20 teacher rows plus the header and zero routine tables by default. Show teaching schedules produced 20 routine tables; Mathematics narrowed to one teacher/routine. Returning to Hidden removed all routine tables while preserving that subject filter. Restored All subjects afterward. [Compact directory proof](evidence/admin-teacher-list-compact.jpg). No account, timetable or database records changed.
