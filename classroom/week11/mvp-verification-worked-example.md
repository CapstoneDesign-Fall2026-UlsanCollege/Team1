# Week 11 Worked Example — Team 1 StudentHub MVP Verification

> **Actual Team 1 record, not a fictional example.** Results below are taken from the linked repository evidence. Automated fixture tests, assistant-run checks and independent human tests are labeled separately.

## The roadmap promise sets the boundary

StudentHub's frozen main-release promise is the school administration path for Mahendra School: admin manages school structure, student membership, teachers, subjects, timetables and rooms; teachers manage their own schedule, class roster, homework and homeroom attendance; students see their own class, timetable and homework; canteen staff publish menus that appear to students/parents only after publication.

Parent dashboard is stretch scope. High-school job search remains optional. Neither expands the main-release promise during the Week 11 freeze gate.

## Team test record

| Required behavior | Expected result | Actual result in current evidence | Status and proof |
|---|---|---|---|
| Cross-role daily workflow | Authenticated roles respect scope; enrollment, homework, attendance and canteen publication read back correctly | Isolated MySQL production-route suite: 94 passed, 0 failed, 0 skipped | Pass — automated integration; [full output](evidence/daily-workflow-full-suite.txt) |
| Special-room booking | Valid booking saves/read-backs; overlapping booking is rejected; adjacent slot is allowed | Automated fixture: HTTP 201/read-back, HTTP 409/no extra row, adjacent HTTP 201. Ansh also independently passed valid save/refresh and overlap rejection on deployed iPhone | Pass — automated plus bounded independent human test; [workflow output](evidence/daily-workflow-full-suite.txt), [Ansh phone record](ansh-room-booking-iphone-test.md) |
| Phone subject assignment | Selected subject and teacher remain after refresh | Ansh's deployed iPhone test showed the item immediately after save, but it disappeared after Safari refresh | Fail — [failure record](ansh-iphone-subject-persistence.md), [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83) |
| Student-facing pages | Home, My Class and timetable render and navigation works on tested devices | Buddha reports laptop L1–L9 and iPhone I1–I10 complete, with screenshots linked in personal evidence | Pass — user-confirmed individual checks; [laptop](evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md), [iPhone](evidence/BudhaRajgiri/BudhaRajgiri-Week11-iPhone-Test-Evidence.md) |
| Student privacy checks | Own-record and authorization boundaries behave as expected | Buddha reports P1–P3 complete in his individual report | Pass — user-confirmed individual checks; not an independent team security audit |
| Canteen draft/publication/withdrawal | Draft hidden; published menu visible; withdrawn menu hidden | Bal Raju's assignment contains a repeatable procedure, but actual result rows remain pending | Gap — [assignment](coderraaju-individual-assignment.md) |
| Complete live workflow | Admin, teacher, student and canteen roles complete the promised path on one deployed revision | Deployment and migration checks exist, but full independent role-by-role live acceptance is not recorded | Gap — [deployment](railway-deployment-2026-11-12.md), [migration](railway-data-migration-2026-11-12.md) |
| Fresh clone and empty database | Another teammate can set up from a clean clone without relying on the implementer's machine | No completed clean-clone evidence is linked; #77 remains open | Gap — [Issue #77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77) |

## Decision

**Feature scope stays frozen. Choose recovery and acceptance, not new feature development.**

The 94-pass automated workflow is strong evidence, and some bounded live/manual checks have passed. However, the real iPhone subject-persistence failure plus outstanding canteen, clean-setup and independent live role checks mean the complete MVP cannot yet be called stable.

## Next actions

1. Fix #83 and have Ansh repeat subject assignment, teacher selection, save and refresh on a physical iPhone.
2. Have Bal Raju complete the canteen draft → hidden → publish → visible → withdraw → hidden test and commit his actual results.
3. Have a teammate reproduce #77 from a clean clone and empty database.
4. Have a non-author teammate repeat the full authenticated role workflow on one recorded deployed revision.
5. Keep the shared report, roadmap, issue statuses and area map synchronized with the actual evidence.

## Evidence index

- [Shared Week 11 weekly report](weekly-report.md)
- [MVP verification checklist](mvp-verification.md)
- [Week 11 work checklist](work-checklist.md)
- [Current roadmap](../../roadmap.md)
- [Week 11 technical index](README.md)

**Do not copy the fictional camera example's invented results or placeholder links into Team 1 evidence.** This record uses only the actual StudentHub records linked above.
