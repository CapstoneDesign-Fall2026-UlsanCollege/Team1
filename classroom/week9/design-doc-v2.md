# Design Doc v2 — Middle and high school pivot

**Team:** Team 1 · **Project:** StudentHub · **Updated:** November 1, 2026

**Status:** Revised plan, not a claim that school/homeroom features are implemented.

This document supersedes the current direction in [Week 7 Design v1](../week7/design-doc-v1.md). Earlier weekly reports remain historical evidence. See the [updated roadmap](roadmap.md).

## 1. Purpose and users

StudentHub is being adapted into a school-life platform for **middle and high schools**. School administrators organise academic years, grades, homeroom classes, student membership, teachers, subjects and timetables. Students see their own class, homeroom teacher, subjects, timetable and school canteen information.

The canteen head manages food information in a separate workspace. Administrators manage canteen-head account access, not daily food content. Teachers are managed directory records in this MVP; teacher login accounts are not yet in scope. The first version serves one school installation, rather than providing a multi-school shared service.

## 2. Confirmed changes

| Decision | Result |
|---|---|
| Target middle/high schools | New structure uses school level, academic year, term, grade and homeroom class. |
| Cancel classroom finding | Close planning #51 and room slices #57–59 as not planned. No room inventory/search/assignment-conflict extension in this roadmap. |
| Add homeroom-teacher management | Link a stable teacher to a homeroom class for an academic year; preserve reassignment history. |
| Retain job search as optional for high school | Keep existing code and saved data. School-level access and UI gating are still to implement; do not claim they exist. |
| Return to Railway when the owner is ready | Revisit the purchase on November 10; develop locally meanwhile. Do not remove Render/Aiven or discard backups before verifying recovery. |

A **homeroom class** is a group of students, such as Grade 2 Class A. It is not a physical classroom. Cancelling classroom search does not remove class groups or existing timetable location text.

## 3. Existing work we can reuse

- Account login, role boundaries, profile management, terms, subjects/course offerings and weekly timetables.
- Administrator-reviewed password-reset requests with private manual password delivery.
- C0 canteen-head provisioning and separate workspace.
- C1 dated daily menus and prices: draft/save/publish/unpublish and student display implemented in [5b2fe5a](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5b2fe5a), with [local automated checks](../../docs/canteen-daily-menu.md). Browser and live verification remain pending.
- Existing Seoul job search, filters, timetable comparison and favourites as the optional high-school extension.

The current academic model is college-oriented (major + semester). Reusing the screens is not sufficient: school/class membership and query permissions need an explicit migration. Existing records are legacy data, not school features already completed.

## 4. Smallest useful school version

An administrator creates an academic year, a grade/class group and an approved student membership, then assigns the class an active homeroom teacher. The student signs in, opens **My Class**, and sees only their own grade/class, homeroom teacher, subjects and timetable. The canteen head publishes today's menu; students can view it without ordering or paying through StudentHub.

## 5. New academic model

| Record | Purpose |
|---|---|
| Academic year and term | Keep year/semester dates explicit; retain prior years. |
| Grade and homeroom class | Stable identity with year, school level, grade and label; identical labels in different years/grades remain distinct. |
| Student class membership | Explicit current class for a student in an academic year, with transfer/history handling. |
| Teacher | Stable ID and staff code, name, department and active status; repeated names never identify a person. |
| Homeroom assignment | Teacher + homeroom class + academic year + effective dates; separate from subject teaching. |
| Subject assignment and meeting | Teacher, class and term with recorded weekly teaching times. Existing location text remains displayable. |

First-version assumption to validate with school users: one active homeroom teacher per class and one active homeroom class per teacher per academic year. Co-teachers or multiple concurrent homerooms would require an explicit scope change. Student membership similarly has one active homeroom class per year, with transfers retaining history.

Homeroom responsibility alone does not reserve a teaching period. Teacher conflict checks use recorded subject meetings. An empty timetable is not proof of personal availability.

## 6. Implementation slices and order

| Order | Slice | Planned outcome | Owner | Issue |
|---|---|---|---|---|
| 1 | S1 — School structure | Years, grades, classes, student membership and reviewed mapping from legacy data | Galan Bishal | [#66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66) |
| 2 | T1 — Teachers | Stable directory, active status and legacy teacher-name mapping | Galan Bishal | [#62](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/62) |
| 3 | H1 — Homeroom management | Assign/reassign teachers by year/class, with reciprocal detail links and history | Galan Bishal | [#67](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/67) |
| 4 | H2 — My Class | Student's own grade/class, homeroom teacher and academic links | Galan Bishal | [#68](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68) |
| 5 | T2/T3 — Subject timetable | Teacher details, class-linked subjects, weekly meetings and cross-class overlap prevention | Galan Bishal | [#63](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/63), [#64](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/64) |
| 6 | C2/C3 — Complete canteen | School canteen hours/location and item availability; C0/C1 reused | Galan Bishal, pending Issue ownership confirmation | [#55](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/55), [#56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56) |
| Optional | High-school jobs | Retain search/favourites; explicitly gate the audience after school-level records exist | Galan Bishal | Existing [#47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/47), [#48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/48); audience gating [#69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/69) |
| Release | V1 | Repeatable role workflows, safe independent proof and verified deployment | Galan coordinates; actual tester must confirm | [#60](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/60), [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65) |

Ownership above is planning coordination with coding assistance, not a claim that a person independently implemented or tested a feature. Do not assign completed contributions to other members without their evidence.

## 7. Permissions and migration

- Administrators manage academic records and homeroom assignments. Student APIs derive scope from the authenticated student's membership, not a supplied class/student ID.
- Students see their own class information, not other students' rosters or private staff contacts. Do not publish real school/student records in screenshots or test fixtures.
- Canteen heads edit food information only; academic administrators and students cannot edit menus.
- Add tables/links through additive migrations; retain user IDs, bcrypt password hashes, existing terms, courses, timetables and favourites. Do not convert a college major into a grade automatically.
- Provide an explicit administrator mapping/review path for legacy records; distinguish unresolved mappings from valid new school assignments.
- Preserve unfinished source drafts for review, but do not ship cancelled room routes or mix room functionality into the teacher slice.

## 8. Out of scope

Classroom finding/inventory/booking, student housing, multi-school tenancy, teacher/parent login portals, attendance, marks/report cards, counselling records, payroll, automatic timetabling, external-restaurant food, ordering/delivery/payments and automatic job applications.

These are scope boundaries for the current MVP, not permanent product restrictions. Existing timetable location text and optional high-school jobs remain preserved.

## 9. Final demo target and evidence

> An administrator assigns a student to a grade/class and assigns its homeroom teacher. The student sees the correct My Class page, subjects, timetable and today's school canteen menu. Reassignments retain history, role boundaries hold, and recorded teacher subject conflicts are rejected with linked test evidence.

High-school job search is an optional extra demo path. It must not block the core middle-school workflow.

Evidence required per slice: linked implementation commit, actual automated output, expected/actual manual record, safe screenshots, tester identity/date and live deployed revision where applicable. Planned tests, authored scripts and historical college screenshots do not prove the new school flow works.

## 10. Risks and next action

| Risk | Next action |
|---|---|
| College model does not represent school classes | Implement #66 before adding homeroom assignment screens. |
| School assignment policies are not yet user-validated | Validate the single-homeroom assumptions before treating them as school policy. |
| Legacy and new records could leak across classes | Test membership-derived queries, transfers, unresolved mappings and forged IDs. |
| Original Railway records may differ from the local/Aiven backup | Verify the original volume and inventory before restoration/import; retain private backups. |
| Hosting recovery is deferred | Continue local checks; revisit owner purchase November 10 without claiming a successful release. |
| Optional jobs are still visible under the old UI | Implement #69; do not advertise middle/high-school gating until tested. |

**Next implementation:** #66, school years/grades/classes and student class membership. This document changes the plan only; it does not migrate the application data.
