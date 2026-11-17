# Week 11 — Individual Evidence: Student My Class Verification

**Name:** Buddha Raj Giri  
**GitHub ID:** BudhaRajgiri  
**Team:** Team 1  
**Project:** Student Life Hub  
**Week:** 11  
**Feature area:** #68 — Student My Class View  
**Evidence status:** Source review completed; personal live checks are pending confirmation  
**Live application:** https://team1-production.up.railway.app/

## 1. Objective

Independently check the deployed StudentHub student experience on a laptop and an Android phone. The focus is whether a signed-in student can view only their own class information, assigned homeroom teacher (or a clear unassigned state), classroom and timetable, and whether the page remains usable after refresh and on a narrow screen.

This file is an evidence record template. A check is marked **Pending** until I personally perform it and record the actual result. Existing automated tests and another teammate's results are not counted as my personal test.

## 2. Test environment

| Item | Actual value |
|---|---|
| Website | https://team1-production.up.railway.app/ |
| Laptop model / OS | To be recorded |
| Laptop browser and version | To be recorded |
| Android phone model | To be recorded |
| Android browser and version | To be recorded |
| Test date and local time (Korea) | To be recorded |
| Student test account | Use an approved demo/test account; do not record password or token |
| Deployed commit/version, if visible | To be recorded |

## 3. Laptop test checklist

| No. | Test | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| L1 | Open the deployed website | Website loads without an error | Pending | Pending |
| L2 | Sign in using an approved student test account | Student account signs in successfully | Pending | Pending |
| L3 | Open Home and select **My Class** | Student Home and My Class view load | Pending | Pending |
| L4 | Check school year, grade and homeroom | Values match the signed-in demo student's assigned records | Pending | Pending |
| L5 | Check classroom | Correct classroom is shown, or a clear empty state appears | Pending | Pending |
| L6 | Check homeroom teacher | Correct assigned teacher appears, or the UI clearly says unassigned | Pending | Pending |
| L7 | Check weekly timetable | Correct days, subjects, times and room details appear | Pending | Pending |
| L8 | Refresh the page and revisit My Class | The page reloads and the same authorized data remains available | Pending | Pending |
| L9 | Navigate to another feature and return | Navigation works and My Class still displays correctly | Pending | Pending |

## 4. Android phone test checklist

| No. | Test | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| M1 | Open the deployed website on Android | Website loads successfully | Pending | Pending |
| M2 | Sign in using the approved student test account | Student account signs in successfully | Pending | Pending |
| M3 | Open Home and My Class | Both views are readable and usable | Pending | Pending |
| M4 | Review class, classroom and teacher information | Information is readable without clipping or overlap | Pending | Pending |
| M5 | Review the timetable | Timetable content is readable; horizontal overflow does not hide essential information | Pending | Pending |
| M6 | Refresh and revisit My Class | Student's authorized information remains visible | Pending | Pending |
| M7 | Navigate between Home and My Class | Navigation controls are usable by touch | Pending | Pending |

## 5. Privacy and missing-data checks

These checks require an approved demo/test account or a test record prepared by the project administrator. Do not change real student records.

| No. | Test | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| P1 | View My Class while signed in as the demo student | Only that student's own class information is shown | Pending | Pending |
| P2 | Check a demo class/student with no assigned homeroom teacher, if available | The page clearly shows no teacher is assigned; it does not invent a teacher | Pending | Pending |
| P3 | Check backend authorization for another student's record | A direct unauthorized request is rejected by the server; UI hiding alone is not proof | Not run — endpoint and safe test procedure must be confirmed first | Pending |

## 6. Screenshot evidence to add

Save screenshots in this folder: `classroom/week11/evidence/`.

Use these filenames after taking the screenshots:

- `BudhaRajgiri-week11-laptop-home.png`
- `BudhaRajgiri-week11-laptop-my-class.png`
- `BudhaRajgiri-week11-laptop-timetable.png`
- `BudhaRajgiri-week11-android-home.png`
- `BudhaRajgiri-week11-android-my-class.png`
- `BudhaRajgiri-week11-android-timetable.png`

Before committing screenshots, hide or crop student names, IDs, phone numbers, email addresses, passwords, QR codes and any other private information. Use only approved demo data.

## 7. Related project evidence

- [Student My Class issue #68](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68)
- [Student dashboard implementation and earlier checks](../../week10/student-dashboard-check.md)
- [Week 11 automated testing evidence](../testing-evidence.md)
- [Current project roadmap](../../../roadmap.md)

The Week 11 automated record reports frontend 17 passing tests, backend 41 passing tests and 3 skipped database suites, plus a successful frontend build and CI run. Those are team/project-level automated results; they are not my laptop, Android or live acceptance results.

My Week 10 evidence recorded eight student-interface checks. Its privacy result was a UI-only check, and it explicitly left direct backend authorization verification outstanding. Week 11 testing must not claim that this server-side privacy check passed unless it is actually performed.

## 8. Issues found

Record only issues personally observed during this week's checks.

| Device / test ID | Steps to reproduce | Expected result | Actual result | Screenshot / notes |
|---|---|---|---|---|
| Not recorded yet | — | — | — | — |

## 9. Automated CI check observed on November 17, 2026

A GitHub Actions run was triggered by the commit that added this evidence file. I inspected the actual workflow job and its log.

- [GitHub Actions — StudentHub automated checks, run #64](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/44058674240)
- [Frontend deployment workflow run #290](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/44058674222)

| Automated check | Actual result | Status |
|---|---:|---|
| Backend TypeScript build | Successful | Passed |
| Backend tests | 44 passed, 0 failed, 3 skipped (47 total) | Passed with skips |
| Frontend tests | 25 passed, 0 failed | Passed |
| Frontend production build | Successful; Vite built 164 modules | Passed |
| GitHub Actions overall job | Completed successfully | Passed |

The backend tests include a server-side profile-scope test that verifies the profile route reads only the signed-in student and rejects admin/anonymous access. This is automated API test evidence, not a direct test of another student's record in the live deployed database.

**Important scope:** these are automated tests run by GitHub Actions on an Ubuntu runner. They do not verify the signed-in student experience in a real browser, a physical Android phone, or the current live school's records. Three backend database-fixture tests were skipped.

## 10. Live website access and screenshot limitation

I attempted to open the public deployment from the available web inspection environment, but the website could not be accessed there. This does not prove the website is down for users; it means I could not inspect its rendered pages or capture genuine Home/My Class screenshots from this environment.

No placeholder, generated, or misleading application screenshots have been added. The actual laptop and Android screenshots listed in Section 6 remain pending. The GitHub Actions run linked above is the available automated-test evidence.

## 11. Repository source review — November 17, 2026

I reviewed the committed frontend, backend and test source for the #68 Student My Class flow. This is a code review of the repository, not a live website test.

| Area | Verified in source | Review result |
|---|---|---|
| Student Home | [StudentHome.vue](../../../frontend/src/components/StudentHome.vue) | Loads the school context and provides a retry state if the request fails. The visible feature tabs depend on the pages supplied by the parent dashboard. |
| My Class display | [StudentSchool.vue](../../../frontend/src/components/StudentSchool.vue) | Displays class/year, room and teacher information, has refresh/retry controls, and distinguishes no class, no room and no teacher states. |
| Timetable display | [StudentTimetable.vue](../../../frontend/src/components/StudentTimetable.vue) | Loads the student's semesters and weekly schedule, shows loading/error/empty states, and labels school-mode time as Nepal time. |
| My Class API authorization | [school-planning.ts](../../../backend/src/school-planning.ts) and [app.ts](../../../backend/src/app.ts) | The endpoint requires the student role and scopes membership using the authenticated session's user ID. The app also applies role boundaries to the student workspace. |
| Timetable data scope | [school-planning.ts](../../../backend/src/school-planning.ts) and [schedules.ts](../../../backend/src/schedules.ts) | School-mode schedule queries use the authenticated student's effective membership and linked class offerings; the legacy schedule query also filters by the authenticated student ID. |
| Relevant automated test source | [school-planning.test.mjs](../../../backend/tests/school-planning.test.mjs) | Contains My Class scope tests for two students, forged query IDs, unassigned students, room/teacher data, inactive teachers and role rejection. |

### Code-review observation to confirm

The current My Class API derives the homeroom teacher from a linked subject/teacher assignment that has a Sunday lesson starting at 10:00. The UI then displays that result as the homeroom teacher. This is a specific timetable convention, not an independent homeroom-teacher field. The team should confirm that every school using this feature will follow this convention, or consider storing a direct homeroom-teacher assignment. Until confirmed against actual school data, the live teacher result remains pending.

### Automated-test limitation

The repository contains an isolated MySQL test named **“student dashboard scopes homeroom, room and daily lessons to effective membership and active term”** in the school-planning test suite. The test is configured to skip unless `RUN_SCHOOL_DB_TESTS=1`. The November 17 CI result recorded three skipped database-fixture tests, so the existence of this test is not evidence that this MySQL scenario ran in that CI job. The separate backend profile-scope test did run, but it tests the profile endpoint rather than the full My Class endpoint.

**Code-review conclusion:** the inspected route and query structure is designed to scope My Class and timetable data to the signed-in student. This review does not prove the deployed database has correct class/teacher/room assignments, that the live UI works, or that the skipped MySQL test passes in the current environment.

## 12. Final result

**GitHub Actions automated checks:** Passed — backend 44 passed / 3 skipped; frontend 25 passed; frontend build passed.  
**Laptop live UI checks:** Pending — not personally observed.  
**Android live UI checks:** Pending — physical device not accessible to this test run.  
**Live student data / timetable / teacher verification:** Pending.  
**Live backend privacy verification:** Pending; automated profile-scope coverage is recorded above.  
**Overall Week 11 personal live verification:** Not yet completed.

I will add actual device details, live test results and genuine screenshots after those checks are performed. I will not report a pass based only on CI, prior-week screenshots or another teammate's work.

**Evidence owner:** BudhaRajgiri


## 13. Student Home screenshot review — evidence received November 17, 2026

A screenshot of the signed-in StudentHub Home page was supplied in this conversation (1127 × 790 image). The following items are directly visible:

- School heading: **Mahendra School**.
- Main feature cards: **My Class**, **Timetable**, **Homework**, **Subjects**, **School Canteen**, and **Student Profile**.
- The My Class card is visible with the description “Class, room & homeroom teacher”.
- The Timetable card is visible with the description “Your weekly routine”.
- Bottom navigation shows **Home**, **Timetable**, **Canteen**, and **Profile**.
- The page has a vertical scrollbar and another card is partially visible below the displayed area.

**What this screenshot verifies:** the Home page rendered and displayed the listed student feature entry points in the supplied screenshot.

**What it does not verify:** opening My Class or Timetable, whether the student's class/room/teacher values are correct, whether timetable records load, whether refresh works, whether mobile layout works on a physical phone, or whether API privacy controls work. Those checks remain pending until their screens or test results are supplied.

**Evidence handling:** this screenshot was provided in the conversation. It has not been uploaded as an image file into this GitHub repository, so this report records the observed result without claiming that a repository-hosted screenshot attachment exists.



## 14. My Class screenshot review — evidence received November 17, 2026

A screenshot of the signed-in student account's **My Class** page was supplied in this conversation (1117 × 781 image).

### Observed result

- Page title: **My Class**.
- School shown: **Mahendra School**.
- The page displays: **“No class is assigned to you for 2026-11-17. Ask your school administrator to check your enrollment.”**
- A **Refresh** control is visible.
- **Weekly timetable** and **Subjects** navigation controls are visible.
- Bottom navigation shows Home, Timetable, Canteen and Profile.

### Test outcome

**Observed:** My Class page loaded and displayed the no-class/unassigned state for the date shown.

**Not verified:** class name, room, homeroom teacher, or assigned-class timetable, because this account currently has no class assignment in the displayed result. The screenshot does not establish whether the account is intentionally unassigned or whether its enrollment needs correction. The school administrator should confirm the student's enrollment and, if this is meant to be a populated demo account, assign the correct school year/class before the assigned-class checks are repeated.

**Privacy limitation:** this screenshot does not test whether another student's records are inaccessible; no attempt was made to access another student's private data.

**Evidence handling:** the screenshot was supplied in the conversation and has not been uploaded as a repository-hosted image attachment. This report records only the visible result.



## 15. My Class assigned-state screenshot review — evidence received November 17, 2026

A second screenshot of the signed-in student account's **My Class** page was supplied in this conversation (1112 × 783 image).

### Observed result

- School: **Mahendra School**.
- Academic year: **2026–2027**.
- Assigned class: **Grade 10 · Class A**.
- Homeroom teacher displayed: **Bikash Thapa**.
- Classroom displayed: **Room 203** (labelled “Classroom 203”).
- **Refresh**, **Weekly timetable** and **Subjects** controls are visible.
- Bottom navigation shows Home, Timetable, Canteen and Profile.

### Test outcome

**Observed:** the My Class page rendered the assigned-class state and displayed class, academic year, homeroom teacher and room details in the supplied screenshot. This provides screenshot evidence for the populated My Class UI state, in contrast to the earlier screenshot on this date that showed no class assigned.

**Not independently verified:** whether the displayed assignment matches the authoritative school record; whether the Weekly timetable and Subjects controls open and show correct records; whether Refresh fetches updated data; or whether a second student is prevented from reading this student's records. Those checks remain pending.

**Evidence handling:** the screenshot was supplied in the conversation and has not been uploaded as a repository-hosted image attachment. This report records only the visible result.

