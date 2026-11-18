# AI Use and Code Ownership Audit

**Team:** Team 1 — StudentHub  
**Week / sprint / date:** Week 11 · Sprint 2 MVP and Freeze · November 18, 2026

Record AI use under the course rules. Each member confirms their own slice, explanation and support arrangement. The [team’s existing area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth) remains the shared reference. The table below records Week 11 review and handoff updates for those areas.

## AI use notes

| PR / commit / file | AI used? | What AI helped with | What the team reviewed or changed | Review/test evidence |
| --- | --- | --- | --- | --- |
| [Week 11 freeze documentation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/44605899d71c3738993acd497141f5c91e06dbfd) | Yes | Compared course requirements with repository evidence and drafted the roadmap checkpoint, report and checklist. | The update kept the existing demo scope and recorded the phone persistence gap. Team sign-off is pending. | [MVP checklist](mvp-verification.md) · [Sprint 2 checks](../sprint-quality-quick-checks.md#sprint-2---mvp-and-freeze-week-11) |
| [Canteen regression](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f9d86ea6bc51706d53f113ed7ab626b73bd6e768) | Yes | Built the backend, ran the existing test suite against temporary MySQL and saved output. | The test used fictional accounts and data. Member review of the output is pending. | [14 passed, zero skipped](evidence/canteen-regression-2026-11-18.txt) |
| [Deployed role precheck](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/1fe1c663550de664086a4d4a766217ee9812b605) | Yes | Used authorized demo accounts to check student, teacher and canteen-head API reads, then disabled the logins. | The user authorized demo test access. The shared production menu was left as found. | [Hosted role precheck](coderraaju-individual-assignment.md#hosted-role-precheck--november-18) |
| [Galan’s implementation receipt](individual_work.md) | Yes | Coding assistance is recorded for Week 11 implementation and verification work. | Galan’s receipt describes school setup, mobile planning changes and the recorded checks. | [Implementation commits and limits](individual_work.md) |
| This audit | Yes | Drafted the Week 11 update from the area map, issue records and actual results. | Each member still needs to confirm their own explanation, stewardship and backup. | [Week 11 report](weekly-report.md) |

## Codebase area map

| Area in this project | Repository boundary / responsibility | Steward(s) matched to current strengths | Backup / learning partner | Health, documentation, or review check | Evidence link |
| --- | --- | --- | --- | --- | --- |
| School planning and room API | [school-planning.ts](../../backend/src/school-planning.ts), [school-rooms.ts](../../backend/src/school-rooms.ts) | Galan, room API steward and #83 recovery owner | Ansh provided phone evidence; backup acceptance pending | Save/reload one valid booking and reject overlap. Trace the subject-save failure through the planner and API. | [Booking pass](ansh-room-booking-iphone-test.md) · [Subject failure](ansh-iphone-subject-persistence.md) |
| Admin frontend | [SchoolSubjectPlanner.vue](../../frontend/src/components/SchoolSubjectPlanner.vue), [SchoolRoomBoard.vue](../../frontend/src/components/SchoolRoomBoard.vue) | Galan, current implementation; Ansh, proposed frontend co-steward | Unconfirmed | Repeat assignment and refresh on deployed iPhone Safari. | [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83) |
| Student frontend | [StudentHome.vue](../../frontend/src/components/StudentHome.vue), [StudentSchool.vue](../../frontend/src/components/StudentSchool.vue) | Galan, current implementation; Buddha, proposed My Class follow-up | Unconfirmed | Confirm own class and homeroom display, including missing assignments. | [Student dashboard evidence](../week10/student-dashboard-check.md) |
| Teacher workspace | [teacher-workspace.ts](../../backend/src/teacher-workspace.ts), [TeacherWorkspace.vue](../../frontend/src/components/TeacherWorkspace.vue) | Galan, current implementation | Unconfirmed | Verify hosted roster, homework, attendance and monthly totals across role boundaries. | [Daily workflow](daily-workflow.md) · [Teacher checks](../week10/teacher-workspace-check.md) |
| Canteen and integration testing | [canteen-menu.ts](../../backend/src/canteen-menu.ts), [DailyMenu.vue](../../frontend/src/components/DailyMenu.vue), [canteen-menu.test.mjs](../../backend/tests/canteen-menu.test.mjs) | Galan, implementation; Bal Raju, proposed integration verification | Galan can explain the isolated fixture; backup acceptance pending | Check draft privacy, publication, availability and withdrawal through the student read. | [Regression output](evidence/canteen-regression-2026-11-18.txt) · [Bal Raju’s test plan](coderraaju-individual-assignment.md) |
| Data and deployment | [school-schema.ts](../../backend/src/school-schema.ts), [migrations](../../database/migrations), [server.ts](../../backend/src/server.ts) | Galan, migration and hosting coordination | Unconfirmed | Reproduce fresh bootstrap and record deployed revision for retests. | [#77 setup](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77) · [Railway evidence](railway-deployment-2026-11-12.md) |

## Individual slice and stewardship check

| Student | Roadmap slice: file/function + behavior | Primary area stewarded / repo boundary | Explain status | How slice/area was checked and by whom | Evidence link |
| --- | --- | --- | --- | --- | --- |
| Galan Bishal (@bishal482) | Verify mobile subject/teacher save and read-back in `SchoolSubjectPlanner.vue` and `school-planning.ts`. | School planning and room API | Written implementation and handoff evidence exists; live explanation pending. | Galan documented implementation. Ansh’s deployed iPhone check found the assignment missing after refresh. | [Galan receipt](individual_work.md) · [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83) |
| Ansh Sharma (@anshsharma123) | Verify valid booking, reload and overlap rejection across `SchoolRoomBoard.vue` and `school-rooms.ts`. | Admin frontend, proposed | Test procedure documented; code explanation and stewardship confirmation pending. | Ansh personally tested deployed iPhone Safari. Valid booking survived refresh and overlap was rejected. | [iPhone booking result](ansh-room-booking-iphone-test.md) |
| Bal Raju (@CoderRaaju) | Verify student visibility after canteen publication, availability change and withdrawal in `canteen-menu.ts` and the student view. | Testing and integration, proposed | Procedure written; personal explanation and test result pending. | Codex ran 14 local tests and checked live role access. The browser write/read-back sequence is pending. | [Individual assignment](coderraaju-individual-assignment.md) |
| Buddha Raj Giri (@BudhaRajgiri) | Proposed #68 slice in `StudentSchool.vue`. Check own class, homeroom teacher and empty states. | Student frontend, proposed | Personal explanation and scope confirmation pending. | Galan’s earlier local evidence is available. Buddha reported laptop, iPhone and privacy checks. See the [shared report](weekly-report.md#individual-contribution-rows). | [#68](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68) · [Student dashboard check](../week10/student-dashboard-check.md) |

## Code we need to rewrite or understand better

| Location / behavior we cannot explain or verify | Owner | Next step and check | Due point |
| --- | --- | --- | --- |
| #83 subject assignment disappears after Safari refresh | Galan | Trace the save response and subsequent fetch, fix the first confirmed failure and have a teammate repeat the save/reload case. | Next recovery checkpoint |
| #54/#56 live canteen publication and availability | Galan coordinates; Bal Raju’s independent run is planned | Use an isolated fixture or agreed production window. Record expected/actual for draft, publish, sold out, restore and withdrawal. | Before claiming hosted canteen completion |
| Teacher attendance/monthly totals and student own-class read-back | Galan coordinates; reviewers to confirm | Repeat with approved accounts on an identified deployed revision and compare saved values after refresh. | Before final demo sign-off |
| #77 clean database bootstrap | Galan | Follow the documented procedure from a fresh clone with an empty isolated database and verify the first admin sign-in. | Before handoff |
| Member explanations and backups | Each member | Confirm the area and support partner. Explain one failure path and point to a repeatable check. | Next team review |

## Review notes

- **Expected result.** A student sees only the published menu for the service date. Availability changes preserve the item and price. A saved subject/teacher assignment survives refresh.
- **Actual result.** The isolated canteen suite passed 14 checks. The live role-login and API-read checks returned HTTP 200. Ansh’s room booking passed on deployed iPhone Safari, and his subject assignment disappeared after refresh.
- **Cross-area dependency or handoff.** The canteen-head editor sends publication and availability changes to the API, MySQL stores the dated menu, and the student endpoint filters by date and publication state. The production menu is shared for the date, so a demo login alone cannot isolate changes.
- **Important limit or failure case still open.** The hosted menu write/read-back sequence, deployed revision confirmation and independent member code explanations are pending.
- **Roadmap issue and next action.** Start with [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83) and follow the [Week 11 freeze checkpoint](../../roadmap.md#week-11-mvp-verification-and-freeze-gate--november-18-2026). Capture the canteen follow-up for #54/#56 after an agreed test setup is available.
