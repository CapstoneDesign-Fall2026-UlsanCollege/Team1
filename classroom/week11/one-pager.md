# Week 11 — Team 1 MVP Verification and Freeze Gate

**Team:** Team 1 — StudentHub  
**Class:** Thursday, November 12, 2026  
**Sprint:** Sprint 2 — MVP and Freeze  
**Homework deadline:** Wednesday, November 18, 2026  
**Project roadmap:** [Current Team 1 roadmap](../../roadmap.md)

> Team-level response to the Week 11 class task. This is not an individual evidence receipt. It consolidates the work and evidence recorded by all Team 1 members during Week 11.

## 1. Our existing MVP promise

StudentHub's main-release promise is a school administration workflow for Mahendra School:

1. Admin sets up school years, grades/classes, student membership, teacher/subject assignments and the weekly timetable.
2. Admin assigns ordinary classrooms and creates special-room bookings; a valid booking saves and reads back, while an overlapping booking is rejected.
3. Teacher sees their own schedule and class roster, assigns homework, records homeroom attendance and reviews monthly attendance totals.
4. Student sees their own class, homeroom teacher, timetable, homework and published canteen information.
5. Canteen staff manage menus and publication; draft/withdrawn menus stay hidden from student and parent views.
6. The team demonstrates the promised workflow with test evidence, live/role checks and clear limitations.

The teacher dashboard is main-release work. Parent dashboard is stretch work. High-school job search remains optional and is not part of the core school-administration promise. Feature scope is frozen at this gate.

## 2. What the team verified

- The November 16 daily-workflow integration suite exercised production application routes against isolated MySQL fixtures: **94 backend checks passed, 0 failed, 0 skipped**. It covers login and role boundaries, student enrollment and scope, teacher roster/homework/attendance, canteen draft/publish/withdraw, parent-linked reads, audit log and room booking conflict behavior. [Full output](evidence/daily-workflow-full-suite.txt) · [Workflow explanation](daily-workflow.md)
- The same record includes a valid room booking with HTTP 201 and a separate read-back, an overlapping request rejected with HTTP 409 and unchanged database count, and an adjacent time slot accepted.
- The November 12 issue-verification run recorded 78 backend checks and 17 frontend checks passing, plus a production build. The later November 16 full workflow suite is the newer broader backend result. [Issue verification](issue-verification-2026-11-12.md)
- The public Railway deployment and migration records report a successful deployment, public site availability, approved-admin sign-in, read-only school-data checks and a role boundary returning HTTP 403. [Deployment](railway-deployment-2026-11-12.md) · [Data migration](railway-data-migration-2026-11-12.md)
- Ansh Sharma independently tested the deployed iPhone special-room workflow: valid booking survived refresh and a second overlapping booking was rejected. [Manual test](ansh-room-booking-iphone-test.md)
- Ansh Sharma also found a real deployed iPhone failure: adding Moral Education with a teacher appeared immediately but disappeared after refresh. This remains an open persistence defect under [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83). [Failure evidence](ansh-iphone-subject-persistence.md)
- Buddha Raj Giri recorded laptop L1–L9, iPhone I1–I10 and P1–P3 in his personal evidence reports. These are his individual, user-confirmed checks and do not substitute for the other members' role-based or independent release checks. [Laptop report](evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) · [iPhone report](evidence/BudhaRajgiri/BudhaRajgiri-Week11-iPhone-Test-Evidence.md)

## 3. What is still a gap

- The deployed iPhone subject-assignment persistence failure reported by Ansh must be diagnosed, fixed and repeated after refresh. Keep #83 open.
- Bal Raju's canteen-head → student draft/publish/withdraw assignment still contains a pending actual-results section. Do not count the assignment as a completed human test until he records his own run and proof. [Assignment](coderraaju-individual-assignment.md)
- The team still needs the required non-author / independent acceptance across the full admin, teacher, student and canteen path, not just automated integration tests or the individual checks listed above.
- Fresh-clone setup from an empty MySQL database remains open under [#77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1).
- The final release and full authenticated live workflow remain open under [#60](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/60) and [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).
- The high-school job audience restriction remains an unimplemented policy requirement under #69; it is outside the frozen main-school MVP but must not be described as complete.
- The November 12 issue-verification note's initial Railway 404 is historical and was superseded by the later deployment and migration records. Use the later records for current deployment status.

## 4. Freeze decision

**Decision: keep feature scope frozen and follow the recovery/acceptance route before declaring the full MVP ready.**

The automated daily workflow is green and important parts of the app are deployed, but the physical-iPhone persistence failure and remaining independent, clean-setup and role-by-role live checks mean the full promised core path is not yet demonstrated reliably by the whole team.

No new feature should be added to the final-demo promise during this gate. Fix the existing subject-persistence failure, complete canteen human acceptance, reproduce clean setup, and finish the independent authenticated release checks. Keep parent dashboard as stretch and job search optional.

## 5. Team ownership and contribution record

| Member | Week 11 contribution evidenced in repository | Current limit / next step |
|---|---|---|
| Galan Bishal (@bishal482) | Week 11 implementation and evidence record covers guided school setup, next-step guide, quick floor/room creation, direct subject-name scheduling, mobile planning and layout work, compact class cards, and Railway rollout checks. He also coordinated the daily workflow suite and deployment/data migration records. [Individual work](individual_work.md) | His recorded local/assistant-assisted checks are not a substitute for independent teammate acceptance. |
| Ansh Sharma (@anshsharma123) | Personally tested the deployed iPhone special-room save/refresh/overlap path (passed) and subject-assignment persistence (failed and documented). [Individual receipt](ansh-individual-evidence-receipt.md) | Repeat subject assignment after the fix; retain #83 open until it passes. |
| Bal Raju (@CoderRaaju) | A bounded canteen publication/privacy test was assigned and a repeatable procedure prepared. [Assignment](coderraaju-individual-assignment.md) | Actual device/browser/date/commit/results and screenshots are still pending in the assignment; do not claim completion. |
| Buddha Raj Giri (@BudhaRajgiri) | Personal laptop L1–L9, iPhone I1–I10 and P1–P3 reports and screenshots are linked in his personal folder. | These remain individual reported results; team-wide role acceptance and independent proof are tracked separately. |

Only list a contribution as complete when its author has confirmed it and the cited evidence exists. The table above reports repository evidence and its stated limits; it does not assign unconfirmed code ownership.

## 6. Priorities and next checkpoint

| Priority | Action | Owner / handoff | Done when |
|---|---|---|---|
| P1 | Diagnose and fix the iPhone subject assignment disappearing after refresh | Galan / relevant implementation owner; Ansh repeats on iPhone | Subject and teacher remain after refresh; safe before/after evidence and tested commit are linked to #83 |
| P1 | Complete canteen draft → hidden → publish → visible → withdraw → hidden test | Bal Raju, with canteen operator / Galan support | Personal actual-results table, device/browser, tested revision and safe screenshots are committed; update #54–56 |
| P1 | Complete independent full-path and role-boundary acceptance | Galan coordinates; tester must be a non-author for the affected area | Admin, teacher, student and canteen steps are repeated against one recorded deployed revision |
| P1 | Reproduce fresh-clone / empty-database setup | Galan coordinates; another teammate follows instructions | A clean teammate clone reaches a working first-admin setup without private credentials in Git |
| P2 | Rehearse the frozen demo and update the shared evidence index | Whole team; each member confirms their own row | One shared weekly report, MVP checklist, roadmap checkpoint and issue links agree |
| P3 | Optional polish outside required core path | Backlog only | Do not start while P1 release gaps remain |

## 7. Team evidence index

- [Current roadmap](../../roadmap.md)
- [Week 11 README and technical notes](README.md)
- [Daily cross-role workflow and 94-pass output](daily-workflow.md)
- [Issue verification](issue-verification-2026-11-12.md)
- [Deployment and data migration](railway-deployment-2026-11-12.md) · [migration details](railway-data-migration-2026-11-12.md)
- [Automated testing guide](automated-testing-guide.md) · [CI/testing evidence](testing-evidence.md)
- [Galan's individual work](individual_work.md)
- [Ansh's individual evidence](ansh-individual-evidence-receipt.md)
- [Bal Raju's pending canteen assignment](coderraaju-individual-assignment.md)
- [Buddha's laptop and iPhone evidence](evidence/BudhaRajgiri/)

**Evidence rule:** automated pass, local browser check, hosted check, and independent human check are different evidence types. Do not merge them into one unqualified “passed” claim.
