# Daily school workflow — #101

Galan Bishal, with assistant-run test support. November 16, 2026 (Asia/Seoul).

## What was checked

The new integration check in `backend/tests/school-planning.test.mjs` exercises HTTP requests through the production application factory. It uses an isolated randomly named MySQL schema, fictional users and a fixed Nepal school date, November 1, 2026. It does not modify laptop or Railway school records.

| Action | Required result |
| --- | --- |
| Admin creates a student with class membership and links the existing verified fixture guardian | Student signs in; teacher roster and linked parent identify the same child/class |
| Student opens their school record | Current class and Sunday 10 AM homeroom teacher are present |
| Teacher assigns homework to that class | Student and linked parent receive the saved assignment ID; another class does not |
| Homeroom teacher saves today's attendance as present | Parent sees present for the same child and school date |
| Unrelated role requests the parent child route | HTTP 403 |
| Canteen staff saves a draft | Student and parent menu reads return no published menu |
| Canteen staff publishes the menu | Both readers see the same item and NPR 70 price |
| Parent attempts to modify the menu | HTTP 403 |
| Canteen staff withdraws the menu | Both readers stop receiving it |

[Targeted school suite](evidence/daily-workflow-tests.txt): 43 passed, zero failed/skipped. The cross-role workflow passed without an application-code fix. [Full regression output](evidence/daily-workflow-full-suite.txt): 94 passed, zero failed/skipped, with school, activity and menu database checks enabled.

## Repeatable manual demo

Use a designated test class and fictional student; record the tested commit, URL, date and device. Keep credentials and actual children's contact details out of screenshots.

1. Admin: create a student with the intended class. Verify and link their guardian using **Accounts → Parents**.
2. Student: sign in and check the class, homeroom teacher and timetable.
3. Teacher: confirm that student appears in the class roster. Save attendance for today and assign a short homework exercise.
4. Student: refresh Homework and confirm the assignment.
5. Parent: sign in, completing the initial password change if required. Select that child, refresh, and compare attendance/homework with the teacher's saved records.
6. Canteen head: save today's menu as a draft. Confirm it remains hidden from student and parent. Publish, refresh both dashboards and compare name/price. Withdraw the menu and confirm it disappears.
7. Admin: review Activity Log for the relevant actor and record changes. Restore the test data to its agreed final state.

## Limits

These are automated integration results, not a new human browser, physical-phone or full hosted workflow pass. Existing separate browser checks and Galan's reported parent checks remain in [parent-workspace.md](parent-workspace.md). This check uses the existing academic-year/class/teacher fixture; it does not claim to test initial school setup from an empty UI or every possible schedule.
