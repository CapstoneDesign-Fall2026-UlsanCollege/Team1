# Week 12 Individual Evidence — Buddha Raj Giri

**GitHub:** [@BudhaRajgiri](https://github.com/BudhaRajgiri)  
**Project:** StudentHub · **Week:** 12 · **Prepared:** November 25, 2026  
**Personal review area:** Student My Class / homeroom display

> **Evidence status:** This file records the work prepared for Week 12 and the checks still to be completed. It does not claim that runtime tests or code changes have already been made. Add genuine screenshots and actual observations after performing the checks.

## 1. My Week 12 work

- Reviewed the existing Week 12 project records and identified a focused personal review area: the signed-in student's own-class and homeroom experience.
- Mapped the review to the My Class UI in `frontend/src/components/StudentSchool.vue` and the Student My Class API boundary in `backend/src/school-planning.ts`.
- Prepared a scoped test plan covering assigned-class display, refresh/retry, timetable consistency, empty and missing-teacher states, privacy boundaries, and responsive layout.
- Prepared this evidence record and related documentation with ChatGPT assistance.

**Code changes:** No Week 12 code change is claimed here.  
**Runtime tests:** No Week 12 runtime test is claimed here.  
**Ownership boundary:** This personal review is separate from Galan's #83 subject-persistence implementation and tests. Their work is not claimed as mine.

## 2. Test plan and results to fill in

| Check | Procedure | Expected result | Actual result / status |
| --- | --- | --- | --- |
| Assigned-class display | Sign in using an authorized student demo account and open My Class | Only that student's assigned school/year/class/room/teacher context appears | **Pending personal test** |
| Refresh / retry | Refresh the page and use the refresh control if available | The same authorized class context reloads correctly | **Pending personal test** |
| Timetable consistency | Open the timetable in the same signed-in session | Timetable matches the student's effective class context | **Pending personal test** |
| No-class state | Use an intentionally unassigned test account supplied by the team | A clear no-class state appears; no unrelated data is shown | **Pending suitable test account** |
| Missing-teacher state | Use an approved test class with no active homeroom teacher | A clear missing-teacher state appears; no stale/unrelated teacher is shown | **Pending suitable fixture** |
| Privacy boundary | Follow a safe test procedure approved by the project owner; do not probe real student records | A student cannot retrieve another student's class data by changing a client-side identifier | **Pending authorized verification** |
| Responsive layout | Review My Class at phone and laptop widths | Text and controls remain readable and usable | **Pending personal test** |

For each completed check, record the date, browser/device, local or deployed environment, app revision if known, account role (never the password), steps, expected result, actual result, and pass/fail status. If a check cannot be run safely, mark it **Not tested** and explain why.

## 3. Screenshots / proof to add

- [ ] Assigned-class My Class screen.
- [ ] My Class screen after a full refresh.
- [ ] Timetable showing the same student's class context.
- [ ] No-class screen, only if an approved test account is provided.
- [ ] Missing-teacher screen, only if an approved fixture is provided.
- [ ] Phone and laptop responsive views, if checked.

Place the genuine image files in this folder and replace this checklist item with links to the uploaded images. Hide passwords and any private student information.

## 4. AI-use disclosure and explanation

ChatGPT helped review existing repository records and draft this evidence plan and related documentation at my request. I must review the content, correct anything that does not match my actual work, personally perform or confirm any test I claim, and be able to explain the relevant UI/API boundary.

I should be able to explain:
1. How the signed-in student's identity scopes the My Class request.
2. How the interface distinguishes a student with no assigned class from a class with no assigned homeroom teacher.
3. What an authorized test would demonstrate that one student cannot read another student's class data.

## 5. Prior work

My [Week 11 individual evidence](../../../week11/evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) is historical context only. It is not presented as a Week 12 test result.

## 6. Personal confirmation

- [ ] I reviewed this file and confirm it accurately describes my Week 12 work.
- [ ] I completed and recorded the checks that I claim as passed.
- [ ] I added genuine screenshots or clearly marked unavailable checks as not tested.
- [ ] I can explain the UI/API boundary and the limits of my tests.

**Personal confirmation date:** Pending  
**Peer reviewer:** Pending personal agreement; no reviewer is assigned on my behalf.
