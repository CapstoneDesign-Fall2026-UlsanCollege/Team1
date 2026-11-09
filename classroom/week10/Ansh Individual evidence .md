# Week 10 Individual Evidence: Ansh

**Issue:** #64 Subject assignment and timetable conflicts
**Area:** SchoolSubjectPlanner.vue (independent browser testing)
**Commit tested:** e1a6ade
**Related files:** [Test report](ansh-subject-planner-test-report.md) | [Receipt](ansh-individual-receipt.md)

## Summary
I had not coded before this project, so my Week 10 contribution is independent
testing. I set up the project on my own computer, ran it as an administrator,
tested the Subject Planner popups, and recorded what happened with screenshots.
I did not change any code.

## 1. Setup I completed
| Item | Evidence |
|------|----------|
| Checked tools | Node v20.18.0, npm 10.8.2, Git 2.46.0.windows.1 |
| Downloaded a separate test copy | Cloned the Team1 repo into `StudentHub-Team1-Ansh-Test` |
| Recorded the tested commit | `git log -1 --format=%h` returned `e1a6ade` |
| Logged in | Review admin account, Grade 2, Class A, Fall term |

## 2. What I tested and what happened
| # | Test | Expected | What I saw | Screenshot |
|---|------|----------|-----------|------------|
| 1 | Cancel the first popup | English not added | Class subjects stayed at 1 (Mathematics only) | 06, 02, 07 |
| 2 | Confirm subject, cancel the lesson popup | English linked, no lesson | English linked with Demo Teacher Lee (2 subjects); Tuesday stayed empty | 04 |
| 3 | Save a valid lesson | Lesson saved | English saved on Tuesday 10:00-11:00 with Lee. Reload check not done yet | 03, 05 |
| 4 | Conflict check | Error, not saved | Not tested yet | none |


Test report: [Subject Planner test report](ansh-subject-planner-test-report.md)

## 3. What I observed about the app
- The planner uses two steps: confirm subject and teacher first, then review and
  save the lesson day and time.
- The "Confirm subject" button stays disabled until a teacher is chosen.
- A lesson only appears on the timetable after "Save lesson".

## 4. My own explanation
SchoolSubjectPlanner.vue lets an administrator link subjects and teachers to a
class and place lessons in a weekly timetable. Each step needs confirmation, so
cancelling a popup does not save changes by accident.

## 5. What I did not do or verify
- I did not write or change code, and I do not claim teammates' code.
- Reload check and conflict check are still pending.
- I tested locally only, not the live site (#65).
- No teammate has repeated my checks yet.

## 7. Next actions
1. Reload the page and confirm the Tuesday lesson persists (test 3).
2. Try a same-teacher conflict and record the result (test 4).
3. Ask one teammate to repeat tests 1-4 and record their own result.
4. Add my row to the shared Week 10 report.
