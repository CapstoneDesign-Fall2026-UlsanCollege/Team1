# School implementation publication — current check

**Recorded:** November 5, 2026 · **Owner:** Galan Bishal (@bishal482), with coding assistance.

## Published source

[Application implementation 43a82ae](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae) includes additive school tables/migrations 008–010, shared production/local route wiring, administrator school planning, own-class student views, teacher directory/routine, and the room board. No production database or private backup is included.

## Actual current checks

| Check | Expected | Actual | Proof |
|---|---|---|---|
| Standard backend suite | Existing behaviours pass | 38 passed, 0 failed, 2 optional suites skipped | [Output](evidence/backend-2026-11-05.txt) |
| Opt-in school MySQL suite | Isolated schema checks pass and schema is removed | 17 passed, 0 failed, 0 skipped | [Output](evidence/school-mysql-2026-11-05.txt) |
| Frontend tests | Schedule/search and room-teacher checks pass | 10 passed, 0 failed | [Output](evidence/frontend-2026-11-05.txt) |
| Frontend production build | Vue/TypeScript and bundling succeed | Passed | [Output](evidence/frontend-build-2026-11-05.txt) |

The coding assistant ran these checks on Galan's behalf with existing installed dependencies. They are not cold-install, independent teammate, latest-layout browser or live-host results. School tests use a random disposable schema, not the persistent studenthub database.

## Current behaviour

- Year/grade/class membership, dated transfers and explicit legacy mappings. The membership list is compact, 10 rows per page, with class/unassigned filters and grouped controls. That membership search still loads at most 100 accounts; narrow search when needed. The Accounts grade directory separately filters before its limit.
- Drag/select subjects into class and timetable; popup confirmation before saving; class-room labels; normal school hours 10 AM–4 PM, Sunday–Friday, Nepal time.
- Demo data now assigns each of 10 teachers one subject across classes. Each class has five repeated daily lessons and 1–2 PM tiffin. Other catalog subjects remain available. This is a local demonstration routine, not an approved Nepal curriculum or enforced teacher-qualification rule.
- Teacher cards place the subject at the top and show one compact daily class row when days match. Different recorded routines remain separate rows; class labels use G9-C_A style. Sunday 10 AM determines the displayed homeroom teacher.
- Five-floor/40-room allocation board: 30 usual classrooms, 10 special rooms. New special bookings use one date with same-day start/end times. Subject/date fills the scheduled lesson and teacher, with multiple lesson selection when needed. No scheduled lesson leaves times blank for review.
- Available-only supervising-teacher list checks recorded other-class lessons and room bookings. Busy choices are explained/disabled; backend checks again on save. Own-class lessons are allowed for supervision. Unrecorded duties/leave cannot be assessed.
- Four-second success notices in School classes. Database-backed local launcher retains saved data across server restarts.

## Local data work performed November 4

Before seeding, the assistant created a private SQL backup and restored it into a temporary schema to verify it. All original accounts/profiles/academic rows were preserved during initial seeding. Six original student profiles remain; later student memberships reflect the administrator's own edits. Demo-only routine migrations replaced demo lessons, preserved original legacy lessons, and preserved the two manually added special-room bookings. Final SQL check found 10 classes × 6 days × 5 lessons = 300 weekly demo lessons and no lesson during tiffin. No private SQL dump, credential, profile screenshot or personal student row is published as proof.

Scripts: [local setup](../../backend/scripts/setup-local-school.mjs), [specialist demo migration](../../backend/scripts/simplify-demo-routine.mjs), [tiffin migration](../../backend/scripts/add-demo-tiffin.mjs), [persistent launcher](../../backend/scripts/local-school-server.mjs). These are explicit local-only operator tools, never automatic production seeds. Run setup only with the required confirmation, local MySQL configuration and private backup directory. Never commit .env or database dumps. Specialist/tiffin scripts require a verified backup first and refuse unexpected data.

## Historical visual evidence

[School planner note](../week9/school-planner-test-note.md) and [room board note](../week9/room-board-test-note.md) link fictional-data desktop/mobile checks from November 2–3. These support earlier layouts, not the final compact November 4 teacher row. Latest browser/mobile visual retest remains pending.

## Remaining boundaries

- Railway deployment deferred to the owner's planned November 10 decision; no live-release claim.
- Real non-author verification pending. Do not close acceptance items requiring it.
- Teacher editing/deactivation, separate homeroom history and full student homeroom-teacher view are not all implemented; retain #62/#67/#68 follow-up work.
- Tiffin is marked in the demo/planner and removed from demo lessons; a configurable break policy and server-side prohibition of every custom lesson/room booking during tiffin are not implemented.
- Check consistency across student timetable, special-room bookings, and latest mobile layout before final release. Legacy recurring bookings remain supported by the backend.
- School audience gating for jobs (#69) and Nepal canteen localization remain separate work.
