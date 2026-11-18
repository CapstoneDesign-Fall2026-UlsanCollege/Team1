# Week 11 — Team 1 Work Checklist
**Project:** StudentHub  
**Team:** 1  
**Class:** November 12, 2026  
**Homework deadline:** November 18, 2026

This is the shared team checklist, based on the official [Week 11 course checklist](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/week-11/work-checklist.md). It records team-level completion and gaps; individual results remain in each member's own evidence file.

## 1. Set the verification target

- [x] Review the current [Final Demo Roadmap](../../roadmap.md).
- [x] Keep the existing school-administration MVP promise; do not widen scope.
- [x] Identify observable admin, room-booking, teacher, student and canteen steps.
- [x] Prepare the shared [MVP Verification Checklist](mvp-verification.md).
- [x] Record the team's freeze decision and next route in the [Week 11 one-pager](one-pager.md).

## 2. Check the promised path

- [x] Run the cross-role daily workflow integration suite: 94 passed, 0 failed, 0 skipped. [Output](evidence/daily-workflow-full-suite.txt)
- [x] Record valid room booking save/read-back, overlap rejection and adjacent-slot acceptance in automated fixture evidence.
- [x] Record deployed iPhone special-room booking save/refresh/overlap result from Ansh. [Evidence](ansh-room-booking-iphone-test.md)
- [x] Record Ansh's failed deployed iPhone subject-assignment persistence test instead of hiding the failure. [Evidence](ansh-iphone-subject-persistence.md)
- [x] Link Buddha's individual laptop and iPhone test records. [Laptop](evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) · [iPhone](evidence/BudhaRajgiri/BudhaRajgiri-Week11-iPhone-Test-Evidence.md)
- [ ] Complete the full independent admin → teacher → student → canteen workflow on one recorded deployed revision.
- [ ] Complete the canteen-head draft/publish/withdraw manual test and attach actual results. [Bal Raju assignment](coderraaju-individual-assignment.md)
- [ ] Re-test subject assignment on a physical iPhone after the persistence fix; keep #83 open until passed.

## 3. Independent check and handoff

- [x] Record Ansh's independent physical-iPhone room-booking result.
- [x] Record Ansh's independent physical-iPhone subject-persistence failure.
- [ ] Assign and record a non-author tester for the remaining affected admin/teacher/canteen areas.
- [ ] Record exact tester, date, deployed commit, device/browser, expected/actual result and safe proof for each independent check.
- [ ] Have a teammate reproduce the clean-clone setup from an empty database under #77.

## 4. Bugs, risks and priorities

- [x] Record the #83 subject-assignment persistence failure as an actual observed failure.
- [x] Keep bug severity distinct from P0–P3 work priority.
- [x] Keep #77, #60 and #65 release/setup gates visible.
- [ ] Complete canteen publication/privacy acceptance for #54–56.
- [ ] Confirm current issue owners and next-check dates in GitHub for all remaining P1 work.

## 5. Freeze scope and choose the route

- [x] Freeze feature scope for the whole team.
- [x] Choose the recovery/acceptance route because a required mobile persistence behavior failed and required independent/setup/live steps remain unverified.
- [x] Keep parent dashboard as stretch work.
- [x] Keep high-school job search optional and outside the main school-administration promise.
- [ ] Reassess the release route only after the P1 checks above pass with evidence.

## 6. Close the Sprint 2 evidence loop

- [x] Create a shared MVP verification record, actual-evidence worked example and team one-pager.
- [x] Create this shared team work checklist and the Week 11 ClassDecks reference file.
- [x] Link existing individual receipts and evidence without copying another member's work into a different person's contribution.
- [x] Update the shared roadmap with the Week 11 freeze decision and current release gaps; owners/checkpoints are summarized in the shared report.
- [x] Update the shared area-map audit with Week 11 contribution evidence and clearly retain unconfirmed support roles as pending member confirmations.
- [x] Create one shared Week 11 Weekly Report with repository-supported contribution rows and each member's evidence/confirmation limits.
- [x] Align the Week 11 README and roadmap with the documented freeze decision; feature issues remain open where acceptance criteria are still unmet.

## 7. Course materials and class deck

- [x] Review the official [Week 11 one-pager](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/week-11/one-pager.md).
- [x] Review the official [Week 11 README](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/week-11/README.md).
- [x] Review the official [Week 11 worked example](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/week-11/mvp-verification-worked-example.md); its fictional results were not copied as Team 1 evidence.
- [x] Review the official [ClassDecks.md index](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/ClassDecks.md).
- [x] Record that the official ClassDecks.md index lists Weeks 1, 2, 3 and 5 only; a separate Week 11 slide URL is not present and must be requested from the instructor if required.

## Team exit statement

The team has frozen feature scope and documented a recovery/acceptance route. Automated daily-workflow evidence is green, but the full MVP is **not yet declared stable** because the deployed iPhone subject-assignment persistence test failed and independent canteen, clean-setup and full live role checks remain open.
