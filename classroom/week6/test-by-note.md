
# Tested-By Note

## What we checked

- **Behavior / related Issue:** Dashboard → Students → Semesters → Courses / Week 6 Admin Navigation Verification
- **Tested by (a teammate other than the behavior's author):** CoderRaaju
- **Date:** 2026-10-14
- **Project:** StudentHub — Team 1

## Check steps

1. Start the StudentHub project and open the administrator login page.
2. Sign in using the team-approved administrator test account.
3. Confirm that the Dashboard loads successfully and the navigation menu is visible.
4. Click **Students** and check whether the Students section opens with the correct active navigation indicator.
5. Click **Semesters** and verify that the Semesters section appears and is highlighted as selected.
6. Click **Courses** and confirm that the Courses section opens correctly.
7. Navigate between Students, Semesters, and Courses again to check whether the navigation works consistently.

## Result

- **Expected result:** The administrator can successfully navigate between Dashboard, Students, Semesters, and Courses. Each section should display its corresponding page, and the selected navigation item should be clearly highlighted.

- **Actual result:** The test was successful. Dashboard and, after selecting the major five events, its basic details were displayed correctly.

- **Proof link / screenshot:** [Week 6 Admin Navigation Verification — Issue #44](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44)

- **Proof description:** Screenshots should show the administrator Dashboard and the Students, Semesters, and Courses sections with their corresponding navigation items highlighted. Attach the screenshots to Issue #44 to demonstrate the tested navigation behavior.

## Problems found

No problems were reported during the October 14 repeat test after testing each part separately.


Database operations, student information updates, and other administrator functions are outside the scope of this test.

## Repeat test

- **Tested by:** CoderRaaju
- **Date:** 2026/10/14
- **What I did:** Repeated the navigation steps by opening the administrator Dashboard and selecting Students, Semesters, and Courses without additional guidance.
- **Expected result:** All three sections should open correctly, and the active navigation indicator should update according to the selected section.
- **Actual result:** [Record the outcome of the independent repeat test.]
- **Proof link/screenshot:** [Add repeat-test evidence here.]

## Current data limitation

This test verifies only the administrator navigation between Dashboard, Students, Semesters, and Courses and whether the selected section is clearly identified.

It does not verify student data persistence, semester or course modifications, timetable permissions, mobile responsiveness, accessibility, or deployment reliability.

## Related Issue

- [Issue #44 — Week 6 Verification: Admin Navigation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44)
- [Issue #43 — Admin Navigation Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/43)

Issue #43 covers the earlier implementation work, while Issue #44 tracks independent navigation verification.

## Next action

- Complete the navigation test and record the actual results in Issue #44.
- Attach screenshots showing the Dashboard, Students, Semesters, and Courses navigation states.
- Have another teammate independently repeat the written test steps.
- Update Issue #44 and the Week 6 report with verified results and evidence.
- Keep database operations and other untested administrator functions listed as unverified.
