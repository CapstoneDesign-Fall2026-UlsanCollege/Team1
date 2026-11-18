# Week 11 — Shared Team Weekly Report

**Team:** Team 1 — StudentHub  
**Week:** 11  
**Period:** November 12–18, 2026  
**Course gate:** Sprint 2 — MVP Verification and Freeze  
**Project roadmap:** [Current roadmap](../../roadmap.md)

## This week's goal

Verify the existing StudentHub final-demo promise, record actual results across implementation, automated tests, deployed checks and independent human checks, freeze feature scope, and choose a recovery/acceptance route based on evidence.

## Team result

**Feature scope is frozen. The team has strong automated integration evidence and a live deployment, but the complete MVP is not yet declared stable.** A deployed iPhone subject-assignment persistence failure and outstanding canteen, clean-setup and full independent live acceptance checks remain.

## Work completed and evidence

| Area | Team result | Evidence and limits |
|---|---|---|
| Automated daily workflow | 94 backend checks passed, 0 failed, 0 skipped with isolated MySQL fixtures. Covers role/session boundaries, student enrollment/scope, teacher homework and attendance, parent-linked read-back, canteen draft/publish/withdraw and audit behavior. | [Full suite](evidence/daily-workflow-full-suite.txt) · [Daily workflow note](daily-workflow.md). Automated fixture evidence, not a human live-demo pass. |
| Canteen regression and hosted role access | Codex ran 14 isolated MySQL checks with zero failures or skips. Student, teacher and canteen-head hosted logins and API reads succeeded using temporary demo accounts. | [Regression output](evidence/canteen-regression-2026-11-18.txt) · [Hosted precheck](coderraaju-individual-assignment.md#hosted-role-precheck--november-18). Hosted menu changes and independent browser acceptance remain pending. |
| Room booking | Automated valid save/read-back, overlap rejection and adjacent-time boundary passed. Ansh independently repeated valid booking persistence and overlap rejection on deployed iPhone. | [Automated evidence](evidence/daily-workflow-full-suite.txt) · [Ansh iPhone result](ansh-room-booking-iphone-test.md). |
| Subject assignment on phone | Ansh independently tested deployed iPhone subject assignment. The assignment appeared immediately but disappeared after Safari refresh. | [Failure report](ansh-iphone-subject-persistence.md) · [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83). This is a real failed check, not a pass. |
| Deployment and school data | Railway deployment active; public app availability checked. Approved school snapshot migrated to a separate Railway schema; 31 table row counts/checksums matched, 81 triggers preserved; read-only authenticated data checks and an admin-to-teacher 403 boundary recorded. | [Deployment](railway-deployment-2026-11-12.md) · [Migration](railway-data-migration-2026-11-12.md). Assistant-run, not independent team acceptance. |
| Guided setup and admin workflow | Galan's Week 11 commit record covers guided setup, next-step guide, quick floor/room creation, subject-name scheduling, touch planning, mobile layout audit and compact class subject cards. | [Galan individual work](individual_work.md) and linked feature notes/commits. Local checks and coding assistance are disclosed there. |
| Student-facing individual tests | Buddha reports laptop L1–L9, iPhone I1–I10 and P1–P3 completed; laptop and iPhone screenshots are linked in his own folder. | [Laptop evidence](evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) · [iPhone evidence](evidence/BudhaRajgiri/BudhaRajgiri-Week11-iPhone-Test-Evidence.md). User-confirmed individual record, not a substitute for team-wide security review. |

## Individual contribution rows

Each row is limited to what is recorded in the repository. Members should correct or add their own details if anything is missing.

| Member | Contribution recorded | Evidence / next action |
|---|---|---|
| Galan Bishal (@bishal482) | Implementation and coordination: guided setup, next-step guide, floor/room creation, subject-name scheduling, mobile planning/layout, compact class cards, deployment/data migration and automated daily-workflow evidence. | [Individual work and commit evidence](individual_work.md). Independent acceptance of his areas remains separate. |
| Ansh Sharma (@anshsharma123) | Independent deployed iPhone test: special-room booking save/refresh and overlap rejection passed; subject assignment did not persist after refresh and was documented as failed. | [Individual receipt](ansh-individual-evidence-receipt.md) · [booking test](ansh-room-booking-iphone-test.md) · [subject failure](ansh-iphone-subject-persistence.md). Retest after #83 fix. |
| Bal Raju (@CoderRaaju) | Assigned the independent canteen draft/publish/withdraw privacy test; repeatable procedure exists. | [Assignment](coderraaju-individual-assignment.md). Actual test environment, results and proof are still pending; not counted complete. |
| Buddha Raj Giri (@BudhaRajgiri) | Reports completed laptop L1–L9, iPhone I1–I10 and privacy P1–P3 checks, with screenshot evidence linked in his personal folder. | [Laptop report](evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) · [iPhone report](evidence/BudhaRajgiri/BudhaRajgiri-Week11-iPhone-Test-Evidence.md). User-confirmed individual evidence. |

## Risks, blockers and work priority

| Issue / risk | Severity (only if a confirmed bug) | Priority | Owner / next check |
|---|---|---|---|
| #83 iPhone subject assignment disappears after refresh | Major | P1 | Implementation owner diagnoses/fixes; Ansh repeats save/refresh/read-back on physical iPhone |
| #54–56 canteen publication human acceptance | Not a confirmed bug; verification gap | P1 | Bal Raju records draft hidden, publish visible, withdraw hidden, with device/revision/screenshots |
| #77 clean clone and empty DB setup | Not a confirmed bug; release risk | P1 | Galan coordinates; another teammate follows setup from a fresh clone |
| #60/#65 full authenticated live release path | Not a confirmed bug; release risk | P1 | Galan coordinates; non-author teammate repeats admin/teacher/student/canteen path on one deployment |
| Area map, backup roles and support confirmations | Not a confirmed bug; handoff risk | P2 | Each member confirms area and support path; update the shared audit |
| Parent dashboard further acceptance | Not a confirmed bug; stretch | P3 | Keep outside frozen core until P1 work is complete |

P-level is work priority, not bug severity.

## Freeze decision and next route

- Feature scope remains frozen for the whole team.
- The next route is recovery and acceptance, not new feature development.
- Fix and re-test #83 first; complete Bal Raju's canteen test; reproduce #77 clean setup; complete the independent authenticated live role workflow for #60/#65.
- Parent dashboard remains stretch. High-school job search remains optional and outside the core school-administration promise.
- Do not close issues or claim final-demo readiness until their own acceptance criteria have actual evidence.

## Team evidence index

- [Team Week 11 MVP verification](mvp-verification.md)
- [Team 1 worked example using actual project evidence](mvp-verification-worked-example.md)
- [ClassDecks reference and official Week 11 course links](ClassDecks.md)
- [Team Week 11 one-pager response](one-pager.md)
- [Team Week 11 work checklist](work-checklist.md)
- [Current roadmap](../../roadmap.md)
- [Week 11 technical index](README.md)
- [Week 11 AI use and code ownership audit](ai-use-and-code-ownership-audit.md)
- [Shared codebase area map](../week10/ai-use-and-code-ownership-audit.md)

**Prepared as a shared evidence summary.** Each member is responsible for confirming the accuracy of their own contribution row. This report does not turn assistant-run tests into independent human results.
