# AI Use and Code Ownership Audit

**Team:** Team 1 — StudentHub<br>
**Week / sprint / date:** Week 10 · Sprint 2 · updated November 9, 2026<br>
**Review point:** November 11, end of day; revisit at the Week 11 sprint checkpoint or whenever boundaries/roles change.

This is the single current code-area map. Reports and the Working Agreement link here rather than duplicating it. Stewardship is shared context, not exclusive control or a permission gate. Other students may edit any area through the team's review process.

Prepared with coding assistance using the [course audit template](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/templates/ai-use-and-code-ownership-audit.md). This records assistance, not permission to use AI in a restricted task. No teammate acceptance, oral explanation, independent review or test is invented.

## AI use notes

| Change record | AI used? | Assistance | What was reviewed or changed | Evidence / limits |
|---|---|---|---|---|
| [43a82ae: school implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae) | Yes | Application/SQL/test drafts, UI iterations, backup/seed tools and automated checks | Galan supplied and revised school/room workflows, reported visible errors, chose daily specialist routines and tiffin. Assistant inspected code and ran checks. | [Actual results](school-release-check.md); no independent human code-review claim |
| [316771a: Week 10 evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/316771a) and [7186d79: focused handoff](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/7186d79) | Yes | Evidence organization, ownership explanation, links and repeatable commands | Source/test assertions were compared to claims; unfinished gates remained unchecked. | [Galan receipt](individual-evidence-receipt-galan-bishal.md), [code explanation](code-ownership-galan.md) |
| This audit, roadmap and checklist | Yes | Drafted against course requirements and actual repository paths | Assistant verified file links; Galan requested the work. Members must confirm their own proposed roles and explanations. | Documentation-only change; no new runtime pass claimed |
| C2/C3 canteen workspace (canteen-info.ts, canteen-menu.ts, CanteenDetails.vue, DailyMenu.vue) | Yes | Database/API/UI drafts, migration, test extensions and local browser checks | Galan requested owner operations; assistant verified draft/publish, role checks, availability, Nepal localization and preserved old prices. | [62-pass regression and local browser evidence](canteen-owner-check.md); independent/live checks pending |
| A1 Activity Log #73, November 8 | Yes | Audit schema/triggers, authenticated pool context, admin UI and test/document drafts | Galan requested accountability and shorter save notices; assistant checked rollback, privacy, attribution and local UI | [Actual checks](activity-log-check.md); independent/live review pending |
| UX1/UX2 #74/#75, November 8-9 | Yes | School enrollment transaction, class roster API, contextual UI, tests and evidence | Galan requested the review and approved the slices; assistant checked roles, rollback, audit attribution and browser flow | [Actual checks](school-workspace-usability.md); independent/live review pending |
| Student dashboard #76, November 9 | Yes | Scoped API, home/class/canteen/timetable UI, tests and check note | Galan reported missing teacher/menu visibility and requested simpler home; assistant verified teacher scope, publication privacy and browser fit | [Actual checks](student-dashboard-check.md); independent/live gates pending |
| Other members' future changes | Unconfirmed | Each author records their actual use or no-use | Not inferred from their role or earlier documents | Await each member's own entry |

## Codebase area map — current source of truth

Galan's API stewardship is recorded from the approved ownership note. Other role suggestions use the strengths in the [Working Agreement](../week1/WORK%20AGREEMENT.md) and existing [team slice record](slice.md), but remain proposals until accepted.

| Area | Real boundary / responsibility | Steward status | Backup / learning partner | Health / review check | Evidence |
|---|---|---|---|---|---|
| School/room API | [school-rooms.ts](../../backend/src/school-rooms.ts), [school-planning.ts](../../backend/src/school-planning.ts) | Galan: primary room API steward; school API shared | Unconfirmed; Galan coordinates. Ansh may volunteer as cross-area reviewer, not assigned here. | Invalid/conflicting/stale writes fail before persistence; inspect mutate rollback and room save together | [17-check school result](evidence/school-mysql-2026-11-05.txt), [handoff](code-ownership-galan.md) |
| Administrator UI | [SchoolRoomBoard.vue](../../frontend/src/components/SchoolRoomBoard.vue), [SchoolSubjectPlanner.vue](../../frontend/src/components/SchoolSubjectPlanner.vue), [SchoolManager.vue](../../frontend/src/components/SchoolManager.vue) | Galan implemented current version; Ansh proposed frontend co-steward, acceptance pending | Unconfirmed | Cancel popup creates no unconfirmed lesson; server failure remains visible; frontend build passes | [Current compact workspace/teacher visual checks](school-workspace-usability.md); independent review pending |
| Student frontend | [StudentHome.vue](../../frontend/src/components/StudentHome.vue), [StudentSchool.vue](../../frontend/src/components/StudentSchool.vue), [StudentTimetable.vue](../../frontend/src/components/StudentTimetable.vue) | Galan implemented #76; Buddha linked to #68 in team record and must confirm primary area personally | Unconfirmed | Own membership only; correct missing-teacher/empty states; no other student's roster | [#76 implemented locally by Galan with assistance](student-dashboard-check.md); #68 follow-up ownership still requires Buddha’s confirmation |
| School data / transactions | [school-schema.ts](../../backend/src/school-schema.ts), [migrations 008–010](../../database/migrations/010_room_board.sql), planning mutate helper | Cross-cutting, Galan maintains current migration context; separate persistence reviewer unconfirmed | Unconfirmed | Additive schema, explicit mapping, no secrets/dumps in Git, failed write rollback | [Current data-work limits](school-release-check.md#local-data-work-performed-november-4) |
| Testing / integration | [school-planning.test.mjs](../../backend/tests/school-planning.test.mjs), [room-availability.test.mjs](../../frontend/tests/room-availability.test.mjs) | Bal Raju independently tested C0 locally; proposed wider testing stewardship still requires acceptance | Galan can explain fixture; independent reviewer unconfirmed | Run isolated fixture, explain success and failure, record exact version/output | [Commands](code-ownership-galan.md#5-how-a-backup-can-repeat-the-check), [school results](school-release-check.md#actual-current-checks), [Bal Raju’s C0 result](../week8/c0-independent-test.md#tester-owned-result-record) |
| School canteen (C2/C3 extension) | [canteen-info.ts](../../backend/src/canteen-info.ts), [DailyMenu.vue](../../frontend/src/components/DailyMenu.vue), [CanteenDetails.vue](../../frontend/src/components/CanteenDetails.vue), [tests](../../backend/tests/canteen-menu.test.mjs) | Galan implements/maintains this requested extension; primary Week 10 slice remains #72 | Unconfirmed | Canteen-head-only writes, published student read-back, notice-date and currency isolation | [Current canteen checks](canteen-owner-check.md) |
| Deployment / runtime | [server.ts](../../backend/src/server.ts), [database-app.ts](../../backend/src/database-app.ts), [local launcher](../../backend/scripts/local-school-server.mjs) | Galan coordinates hosting; no new paid action authorized by this audit | Unconfirmed | Verify deployed commit, role/login, saved read-back and safe failure states; HTTP 200 alone insufficient | [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65), live verification pending |

## Individual slice and stewardship check

| Student | One bounded slice and Issue | Primary area | Support / explanation status | Actual check and by whom | Evidence |
|---|---|---|---|---|---|
| Galan Bishal (@bishal482) | Save a valid special-room booking or reject a recorded conflict; school-rooms.ts booking route, [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72) | School/room API | Written explanation prepared; oral explanation and backup acceptance not yet observed | Coding assistant ran isolated school checks on Galan's behalf; not independent | [Input/result/dependencies](code-ownership-galan.md), [17-pass output](evidence/school-mysql-2026-11-05.txt) |
| Bal Raju (@CoderRaaju) | Proposed: independently reproduce one valid booking and one overlapping-room rejection in #72, recording the first failure | Proposed testing/integration | Must confirm or choose another bounded Issue by November 11; backup unconfirmed; explanation not observed | Independent local C0 account test recorded November 9 by CoderRaaju; this is not a #72 booking result | [C0 tester-owned result](../week8/c0-independent-test.md#tester-owned-result-record), [Suggested handoff](code-ownership-galan.md#5-how-a-backup-can-repeat-the-check) |
| Ansh Sharma (@anshsharma123) | Proposed: verify the subject-to-slot popup cancel/save behaviour in [#64](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/64), SchoolSubjectPlanner.vue | Proposed administrator frontend | Must confirm or choose another slice/area by November 11; backup unconfirmed; explanation not observed | No Week 10 result claimed | [Earlier popup evidence](../week9/school-planner-test-note.md); not Ansh's independent result |
| Buddha Raj Giri (@budhaRajgiri) | Team record names [#68 Student My Class](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68); bound next delivery to own-class/homeroom-teacher empty/display states | Student frontend, pending personal confirmation | Must explain input/session membership, response and dependency; backup unconfirmed | Galan’s #76 implementation/local checks are linked; no independent result by Buddha claimed | [Existing ownership record](slice.md), [StudentSchool.vue](../../frontend/src/components/StudentSchool.vue) |

## Cross-area handoff

SchoolRoomBoard.submit sends stable IDs, one date, times and revision → school-rooms validates membership/room/subject/teacher → school-planning.mutate locks revision and commits/rolls back → room GET read-back refreshes UI. Client availability is advisory; backend checks again. A reviewer must trace both the API callback and transaction helper, rather than relying only on the form or INSERT.

## Code or evidence we need to understand or verify better

| Location / gap | Owner | Next action and check | Due point |
|---|---|---|---|
| Unconfirmed primary areas, backups and member explanations | Each member for their own row; Galan coordinates | Confirm/revise proposal, name support and answer one specific code question; record personally | November 11, end of day |
| Independent booking boundary check | Galan coordinates; tester unconfirmed | Another student runs valid/overlap/adjacent case and explains why end==start is allowed | November 11, end of day |
| Independent Student My Class review (#68/#76) | Galan implemented #76; Buddha’s proposed follow-up requires confirmation | Repeat scoped teacher/room and absent-teacher checks against [delivered local evidence](student-dashboard-check.md); record actual tester and commit | November 11 checkpoint |
| Tiffin guidance vs API enforcement | Galan | Decide whether 1–2 PM must reject all custom lessons/bookings; test decision before any policy claim | November 11 checkpoint |
| Current UI independent review | Galan coordinates; reviewer unconfirmed | Existing [local visual evidence](school-workspace-usability.md) and [student proof](student-dashboard-check.md) are recorded; obtain a real non-author result | November 11 checkpoint |
| C0 direct screenshot evidence | Bal Raju authored the test record; Galan coordinates follow-up | Add a clickable safe screenshot/recording URL to the existing November 9 result; captured-proof description alone is not a link | November 11 checkpoint |
| Fresh-clone setup #77 | Galan | Complete base-schema/first-admin bootstrap instructions and record a clean-start check | November 11 checkpoint |
| Production/runtime verification (#65) | Galan | Revisit hosting decision November 10; if restored, verify published commit and persistence; otherwise retain exact gap/recovery | Decision November 10; checkpoint November 11 |
| Additional 10 demo teachers added locally November 5 | Galan | Distinguish unassigned staff records from subject qualifications; local totals are not production seed evidence | November 11 checkpoint |

## Review notes

- **Expected:** valid booking returns 201/ID; recorded overlap returns 409; adjacent boundary succeeds.
- **Actual:** those assertions passed in the assistant-run November 5 school suite. [Source and case table](code-ownership-galan.md#4-expected-versus-actually-recorded-results).
- **Question to a teammate, prepared but not yet asked/answered:** Why does an overlapping booking fail, while one starting exactly when another ends succeeds? Trace the time predicate and transaction boundary.
- **Not established:** a real teammate can independently navigate/explain/repeat it; independent current school/booking review; live release. Current local compact UI browser checks are linked above.
- **Next action:** Galan coordinates backup acceptance and attaches the real result to #72. Current status is documented source/check evidence, not a completed team audit gate.
