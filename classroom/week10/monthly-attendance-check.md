# Monthly homeroom attendance — actual checks

**Owner:** Galan Bishal (@bishal482), implementation with coding assistance  
**Date:** November 11, 2026  
**Issue:** [T4 #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/81), extending #80

## Delivered

Teachers choose a month and homeroom to view a spreadsheet-style register: students down the left, dates across the top, daily symbols and saved totals on the right. Student names/header stay visible while scrolling. Search filters rows.

- **O** = present, **X** = absent, **-** = late, **E** = excused, **·** = eligible but unmarked.
- Monthly totals keep O/X/late/E and marked-day counts separate.
- **Late → X = floor(late count / 3)**. **Adjusted X = raw X + Late → X**. Remainder late marks are shown; conversion resets for each selected month and never rewrites the original marks.
- Future dates, dates outside effective enrollment, or dates outside the teacher’s homeroom scope are unavailable; they are not inferred absences. Saturdays are shaded as guidance, not automatically treated as closures.
- Click an available date heading to edit that day’s O/X/-/E marks. Save selected day uses the existing attendance endpoint and sheet revision. Saved monthly totals update after save/read-back.
- Unsaved marks lock date/class/month and parent navigation until saved or discarded. Discard & reload explicitly retrieves the saved register again.
- No database migration or rewrite of existing attendance was needed.

A month read authorizes the teacher separately for each elapsed date and filters each student's marks by effective membership. The read takes a planning transaction lock for a consistent view. The prior limitation remains: authorization uses the saved weekly timetable for the applicable term, not reconstructed historical timetable revisions.

## Actual automated results

Assistant-run, not independent teammate verification:

- Backend TypeScript and frontend TypeScript/production builds passed.
- [School/teacher output](evidence/monthly-attendance-tests-2026-11-11.txt): **28 passed, 0 failed, 0 skipped**.
- New total tests check 0–7 late marks, raw mark preservation, excused/unmarked handling and monthly three-late boundaries.
- New isolated API test checks the full November date count, future-day protection, transfer-date eligibility, cross-teacher denial, invalid months, private fields, and persisted three-late/one-absence totals.
- All **17 existing frontend checks passed**. These are existing helper checks, not a separate automated DOM suite for the new grid.
- The school suite’s “Fixture membership failure” message is deliberate rollback-test injection; its assertion passed.

## Actual browser verification

Used the disposable teacher review helper with TEACHER_REVIEW_ATTENDANCE=1. Its opt-in fictional marks give one pupil three late marks and one absence; another pupil has four presents. No working-school homework, account or attendance records were edited.

1. Opened Homeroom attendance as review_teacher. Actual: the November register displayed 30 dates and only Grade 6A pupils.
2. Actual saved totals for Aarav Example were O=0, X=1, late=3, E=0, marked=4, Late→X=1, Adjusted X=2. [Totals proof](evidence/monthly-attendance-totals.jpg).
3. Selected November 11 and set Aarav to O and Bina to X. Actual: Save enabled and other date headings were disabled while dirty.
4. Saved, then refreshed. Actual totals were Aarav O=1, X=1, late=3, marked=5, Adjusted X=2; Bina O=4, X=1, marked=5, Adjusted X=1. Original three late cells remained '-'.
5. Selected an earlier date heading and captured the [register](evidence/monthly-attendance-register.jpg).
6. Checked a 390×844 viewport: document and scroll widths both 375px, excluding scrollbar. The register scrolls inside its own region; no document-wide overflow. [Mobile proof](evidence/monthly-attendance-mobile.jpg). Temporary viewport override reset.

## Administrator Schedule checkbox

Galan also requested a checkbox instead of the directory dropdown. Teacher list now has a checkbox beside Schedule. Default unchecked state renders zero routine tables; checked state renders 20 routines for the 20 local teachers; unchecking restores the compact directory. [Checkbox proof](evidence/admin-schedule-checkbox.jpg). The backend/data behavior is unchanged.

## Source and remaining checks

[Monthly register UI](../../frontend/src/components/MonthlyAttendance.vue) · [scoped read and totals](../../backend/src/teacher-workspace.ts) · [tests](../../backend/tests/school-planning.test.mjs) · [review fixture](../../backend/scripts/teacher-review.mjs).

Independent human and hosted verification remain pending. No percentages, absence thresholds, grading decisions or carry-over of late marks between months are inferred. For setup and teacher account provisioning, see the [teacher guide](../../docs/teacher-workspace.md).
