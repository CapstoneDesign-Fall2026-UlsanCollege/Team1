# Team 1 — Week 11 MVP Verification Checklist
**Project:** StudentHub  
**Team:** 1  
**Week:** 11 — MVP Verification and Freeze Gate  
**Roadmap:** [Current roadmap](../../roadmap.md)

## MVP proof

StudentHub's frozen main-release promise is a working school-administration path: administrators manage school structure, student membership, teachers, subjects, timetables and rooms; teachers manage their own schedule, class roster, homework and homeroom attendance; students see their own class, timetable and homework; canteen staff publish menu information that is visible only after publication. The team must demonstrate the path with saved read-back, role boundaries and honest limitations.

Parent dashboard is stretch work. High-school job search remains optional and outside the main school-administration promise.

## Verification checklist

| Check | Expected result | Actual result recorded in Week 11 | Proof | Status |
|---|---|---|---|---|
| Automated cross-role daily workflow | Admin enrollment, student scope, teacher homework/attendance, parent read-back, canteen publication privacy and audit behavior pass | 94 backend checks passed, 0 failed, 0 skipped using isolated MySQL fixtures on Nov 16 | [Full suite](evidence/daily-workflow-full-suite.txt) · [Workflow](daily-workflow.md) | Pass — automated integration |
| Room booking valid save/read-back | Valid same-day booking returns success and a separate GET returns the saved record | Automated fixture: HTTP 201; saved fields matched separate GET; SQL row count increased by one | [Daily workflow full suite](evidence/daily-workflow-full-suite.txt) | Pass — automated fixture |
| Room booking overlap rejection | Same room/date/time overlap is rejected and no second row is created | Automated fixture: HTTP 409; SQL count and original row/revision unchanged | [Daily workflow full suite](evidence/daily-workflow-full-suite.txt) | Pass — automated fixture |
| Room booking adjacent boundary | Booking starting exactly at the prior booking end is allowed | Automated fixture: adjacent 15:00–16:00 returned HTTP 201 and survived separate GET | [Daily workflow full suite](evidence/daily-workflow-full-suite.txt) | Pass — automated fixture |
| Physical iPhone room booking | Valid booking persists after refresh; overlap is rejected | Ansh's deployed iPhone 16 Pro/Safari test passed both save/read-back and overlap rejection | [Ansh room booking test](ansh-room-booking-iphone-test.md) | Pass — independent manual test |
| Physical iPhone subject assignment | Added subject and teacher remain after refresh | Ansh observed Moral Education with Hari Adhikari immediately after save, but it disappeared after Safari refresh | [Ansh persistence failure](ansh-iphone-subject-persistence.md) · [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83) | Fail — recovery required |
| Student-facing laptop checks | Home/My Class/timetable navigation and displayed class information behave as tested | Buddha reports L1–L9 completed and links screenshot evidence | [Buddha laptop report](evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) | Pass — individual user-confirmed |
| Student-facing iPhone checks | Home/My Class/timetable and navigation checks work on iPhone | Buddha reports I1–I10 completed and links four iPhone screenshots | [Buddha iPhone report](evidence/BudhaRajgiri/BudhaRajgiri-Week11-iPhone-Test-Evidence.md) | Pass — individual user-confirmed |
| Privacy checks P1–P3 | Own-record scope and authorization boundaries behave as expected | Buddha reports P1–P3 completed in his personal report; supporting evidence remains in that report/folder | [Buddha laptop report](evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) | Pass — individual user-confirmed; not independent team security audit |
| Canteen automated lifecycle | Draft privacy, publish/withdraw and availability persist with unchanged name and price | Codex ran 14 isolated MySQL tests, all passed | [Regression output](evidence/canteen-regression-2026-11-18.txt) | Pass — automated fixture |
| Hosted role access | Student, teacher and canteen head can sign in and load their role-specific API views | Codex verified the demo logins and API reads; the current service date had no published menu | [Hosted precheck](coderraaju-individual-assignment.md#hosted-role-precheck--november-18) | Pass — hosted read-only precheck |
| Canteen draft/publish/withdraw human test | Draft hidden; published menu visible; withdrawn menu hidden to student | Bal Raju's assignment still has all actual-result rows marked pending/not tested | [Assignment](coderraaju-individual-assignment.md) | Gap — manual acceptance not recorded |
| Full authenticated live admin/teacher/student/canteen path | Each role completes promised workflow with saved read-back on the same deployed revision | Automated integration and partial live checks exist; full role-by-role independent live demo is not recorded | [Daily workflow](daily-workflow.md) · [deployment](railway-deployment-2026-11-12.md) · [migration](railway-data-migration-2026-11-12.md) | Gap — independent live acceptance |
| Fresh-clone / empty-database setup | A teammate can clone, configure privately, bootstrap and run the project from a clean database | Still tracked as open #77; no completed clean-clone proof is linked in Week 11 | [#77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77) | Gap — setup proof needed |
| High-school job audience restriction | High-school users cannot access restricted job-search behavior | Roadmap identifies this as unfinished optional/audience-policy work | [#69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/69) | Out of frozen core; do not claim complete |

## Known bugs and risks

| Item | Severity (bugs only) | P-level | Evidence-based reason | Next action |
|---|---|---|---|---|
| #83 subject assignment disappears after deployed iPhone refresh | Major — required admin workflow persistence fails on tested device | P1 | Ansh's physical iPhone test records successful immediate display but missing assignment after refresh | Diagnose/fix, then Ansh repeats exact save/refresh/read-back path |
| #54–56 canteen publication human acceptance not recorded | Not a confirmed bug; verification gap | P1 | CoderRaaju assignment's actual results are pending | Complete draft/hidden/publish/visible/withdraw/hidden on deployed site |
| #77 clean-clone / empty-DB setup not verified | Not a confirmed bug; release risk | P1 | Issue remains open; no Week 11 clean-clone proof linked | Another teammate follows setup from a fresh clone and isolated empty DB |
| #60/#65 full release and live role workflow not fully independently accepted | Not a confirmed bug; release risk | P1 | Deployment and migration records show availability and selected read-only checks, not full human end-to-end acceptance | Run full admin/teacher/student/canteen flow against one recorded deployment |
| Proposed area owners/backups and member explanations not fully confirmed | Not a software bug; handoff risk | P2 | Week 10 area audit explicitly marks several proposed roles and backups unconfirmed | Each member confirms area, support partner and code explanation in shared audit |
| Parent dashboard further acceptance | Not a confirmed bug; stretch scope | P3 | Roadmap marks parent dashboard stretch and further acceptance checks remain | Keep out of core release until P1 checks complete |

## Feature-freeze decision

- [ ] The promised core path works reliably and is independently verified.
- [x] Keep feature scope frozen. The deployed iPhone subject-assignment persistence failure and required independent/canteen/setup/live checks mean the full core path is not yet accepted. Complete the smallest recovery and verification steps before adding anything else.

## Issues and roadmap to update

- [#83 — phone subject assignment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83): keep open until physical-phone save/refresh/reload passes.
- [#54–56 — canteen](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54): add Bal Raju's actual human results; keep acceptance gate open until recorded.
- [#77 — fresh clone](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77): keep open until independent clean setup proof exists.
- [#60/#65 — final release/deployment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/60): keep open until full role workflow is independently demonstrated on the deployed revision.
- [#69 — high-school job restrictions](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/69): retain as outside frozen core; do not represent as delivered.

## Area and handoff check

- **Relevant areas:** school/room API and admin UI; teacher workspace; student frontend; canteen publication; deployment/setup; integration tests.
- **Area map:** [Week 10 AI Use and Code Ownership Audit](../week10/ai-use-and-code-ownership-audit.md).
- **Independent manual checks recorded:** Ansh Sharma (physical iPhone room booking passed; subject persistence failed); Buddha Raj Giri (personal student UI and privacy checks user-confirmed).
- **Pending human checks:** Bal Raju's canteen publication test; non-author full role workflow; clean-clone setup reproduction.
- **Support path:** area steward can explain the path, but another teammate should reproduce the check where practical. Record tester, date, revision, environment, expected/actual result and safe proof.
