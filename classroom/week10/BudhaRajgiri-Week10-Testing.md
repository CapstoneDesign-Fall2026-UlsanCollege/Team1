# Week 10 — Individual Testing Evidence

**Name:** Buddha Raj Giri  
**GitHub ID:** BudhaRajgiri  
**Team:** Team 1  
**Project:** Student Life Hub  
**Week:** 10  
**Date:** 2026-11-10  
**Assigned feature:** #68 — Student My Class View

## 1. Testing Objective

Verify that students can view their own school year, grade, homeroom class, classroom, assigned teacher, and weekly timetable correctly.

## 2. Test Results

| No. | Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| 1 | Home page | Home page and feature tabs load | Home page loaded successfully | Passed |
| 2 | My Class | Correct school year and grade appear | My Class page displayed the student's information | Passed |
| 3 | Own class | Correct homeroom and classroom appear | Class A and its classroom information displayed correctly | Passed |
| 4 | Teacher | Correct assigned teacher appears | Demo Teacher Kim appeared as the assigned teacher | Passed |
| 5 | Missing teacher | No teacher is invented if unassigned | Class B, Classroom 102 displayed; teacher correctly shown as unassigned | Passed |
| 6 | Privacy | Cannot access another student's class information | Interface displayed only the logged-in student's class information | Passed — UI check |
| 7 | Timetable | Weekly routines and days appear correctly | Science appeared Sunday, 10:00–11:00, Classroom 102 | Passed |
| 8 | Home navigation | Home and feature tabs work correctly | Home and My Class navigation worked successfully | Passed |

## 3. Evidence

Screenshots are available in `classroom/week10/evidence/`:

1. `student-home-desktop.jpg`
2. `student-home-mobile.jpg`
3. `class-workspace-desktop.jpg`
4. `class-workspace-mobile.jpg`
5. `compact-class-teachers.jpg`
6. `student-grouped-timetable.jpg`

These are the existing screenshots relevant to the student home, class workspace, teacher information, and timetable.

## 4. Problems Found

- The disposable review database was removed when the review server stopped. Test data had to be recreated after restarting the server.
- The classroom and missing-teacher test records needed to be prepared manually in the disposable review database.
- Privacy was checked through the visible student interface. Backend authorization against a direct unauthorized request still needs separate verification.

## 5. Next Actions

- Keep the relevant screenshots in the evidence folder.
- Verify that this Markdown evidence file and screenshots are committed to GitHub.
- Report any additional bugs found during team review.
- Continue checking the backend privacy restrictions.

## 6. Testing Summary

**Result:** 8 of 8 planned tests completed successfully.

The student-facing My Class view displayed the correct class information, classroom, assigned or unassigned teacher state, and timetable for the tested accounts.

**Testing note:** The privacy result confirms the visible interface behavior only; it does not claim an independent backend authorization test.

**Evidence owner:** BudhaRajgiri
