# StudentHub Testing Record

**Team:** Team 1  
**Week:** 5  
**Date:** 2026-10-07  
**Prepared by:** Bishal Galan  

## Purpose

Record checks performed during development and deployment, along with the tests still needed before the public application is considered fully verified.

Only mark a test as passed after performing it and recording the result.

## Test Environments

| Environment | Frontend | Backend | Database |
|---|---|---|---|
| Local development | Vite development server | Express on port 3000 | Local MySQL |
| Public deployment | GitHub Pages | Railway | Railway MySQL |

**Public frontend:**  
https://capstonedesign-fall2026-ulsancollege.github.io/Team1/

**Public backend:**  
https://team1-production.up.railway.app

## Completed Build and Automated Checks

| Check | Result | Notes |
|---|---|---|
| Frontend production build | Passed | TypeScript checking and Vite build completed successfully |
| Backend build | Passed | TypeScript compilation completed successfully |
| Existing backend test suite | Passed | All 16 tests passed during frontend/backend integration |
| GitHub Pages publication | Passed | Published StudentHub interface opened |
| Railway backend availability | Passed | Server responded through its public domain |
| Cloud database import | Passed | Workbench import completed |
| Cloud table check | Passed | `SHOW TABLES FROM railway;` returned application tables |

### Commands

Run these from the respective project directories:

```powershell
# From Team1/frontend
npm.cmd run build
```

```powershell
# From Team1/backend
npm.cmd test
```

The backend test command also compiles the backend before running tests.

## Automated Test Coverage

The existing backend tests cover:

- Login, logout, session restoration, and disabled accounts.
- Administrator and student role restrictions.
- Student creation validation and duplicate login IDs.
- Password hashing and rollback after failed student creation.
- Student access to their own profile.
- Course assignment retrieval and removal.
- Course and timetable filtering by semester and major.
- Major-based course assignment validation.
- Meeting input validation and timetable permissions.
- Schedule conflict handling and transaction rollback.
- Administrator student editing and semester changes.

These tests do not replace manual verification of the deployed application.

## Public Application Test Checklist

### Authentication and Permissions

| ID | Steps | Expected Result | Status |
|---|---|---|---|
| AUTH-01 | Log in using a valid admin account | Admin dashboard opens | Pending formal verification |
| AUTH-02 | Log in using a valid student account | Student dashboard opens | Pending |
| AUTH-03 | Enter an incorrect password | Login is rejected with a clear message | Pending |
| AUTH-04 | Refresh after logging in | Session is restored | Pending |
| AUTH-05 | Log out and refresh | Protected information is no longer accessible | Pending |
| AUTH-06 | Attempt an admin operation using a student account | Backend rejects the request | Pending |
| AUTH-07 | Switch accounts in another browser tab | Session changes are handled clearly | Pending |

### Student Accounts and Profiles

| ID | Steps | Expected Result | Status |
|---|---|---|---|
| PROFILE-01 | Admin creates a student using valid details | Account and profile are saved | Pending |
| PROFILE-02 | Create another account using the same login ID | Duplicate is rejected | Pending |
| PROFILE-03 | Student opens their profile | Saved name and academic details appear | Pending |
| PROFILE-04 | Student changes phone number or address | Update succeeds | Pending |
| PROFILE-05 | Refresh after updating contact information | Saved changes remain visible | Pending |
| PROFILE-06 | Submit invalid profile input | Clear validation feedback appears | Pending |

### Student Administration and Semesters

| ID | Steps | Expected Result | Status |
|---|---|---|---|
| ADMIN-01 | Search by student name or login ID | Matching students appear | Pending |
| ADMIN-02 | Edit a student profile as admin | Changes save and appear after refresh | Pending |
| ADMIN-03 | Assign a semester during student creation | Semester relationship is saved | Pending |
| ADMIN-04 | Change semester assignments during editing | Updated assignments appear correctly | Pending |
| ADMIN-05 | Refresh semester options | Current database options load | Pending |

### Course Planning

| ID | Steps | Expected Result | Status |
|---|---|---|---|
| COURSE-01 | Open the course planning board | Catalog and saved offerings load from MySQL | Pending |
| COURSE-02 | Assign a course to a semester and major | Offering is saved in the correct group | Pending |
| COURSE-03 | Refresh the page | Saved assignment remains visible | Pending |
| COURSE-04 | Repeat the same assignment | Duplicate is rejected | Pending |
| COURSE-05 | Edit an offering's professor | Updated professor appears after refresh | Pending |
| COURSE-06 | Remove an offering | Assignment is removed, or linked-record restrictions are explained | Pending |
| COURSE-07 | Open the student course page | Courses match the student's major and assigned semester | Pending |

### Timetable Management

| ID | Steps | Expected Result | Status |
|---|---|---|---|
| TIME-01 | Admin adds a valid meeting | Meeting is saved | Needs investigation |
| TIME-02 | Admin edits an existing meeting | Updated details are saved | Pending |
| TIME-03 | Admin removes a meeting | Meeting disappears after refresh | Pending |
| TIME-04 | Add overlapping meetings for the same major and semester | Conflict is rejected | Pending |
| TIME-05 | Add simultaneous meetings for different majors | Meetings are allowed | Pending |
| TIME-06 | Enter an end time before the start time | Input is rejected | Pending |
| TIME-07 | Student opens Schedule | Matching meetings are displayed | Pending |

### Mobile and Interface Checks

| ID | Steps | Expected Result | Status |
|---|---|---|---|
| UI-01 | Open the public website on a phone | Content fits the screen | Pending |
| UI-02 | Scroll through student pages | Bottom navigation stays accessible | Pending |
| UI-03 | Use profile forms on a small screen | Inputs and buttons remain usable | Pending |
| UI-04 | Open and close large-view controls | View expands and closes correctly | Pending |
| UI-05 | Trigger a failed request | Understandable feedback appears | Pending |

## Known Issue

### Timetable Permission Rejection

**Observed result:**  
The timetable management section displayed:

```text
Administrators only.
```

**Expected result:**  
An authenticated administrator can manage class meetings.

**Current status:**  
The cause has not been confirmed.

**Next checks:**

- [ ] Log out and sign in with the admin account.
- [ ] Identify the exact request returning the error.
- [ ] Check the account role returned by `/api/auth/me`.
- [ ] Check whether another tab changed the shared session.
- [ ] Retest meeting creation after confirming the session.

Do not mark this issue resolved until the deployed operation succeeds and the cause is understood.

## Evidence Links

| Evidence | Link |
|---|---|
| Backend tests | [Test files](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/tree/main/backend/tests) |
| Frontend/backend integration | [Integration commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d) |
| GitHub Pages workflow | [Deployment workflow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml) |
| Manual test screenshots | [Admin dashboard screenshots folder](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/tree/main/classroom/admin%20dashboard) • [1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/1.png) • [2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/2.png) • [3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/3.png) • [4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/4.png) • [5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/5.png) • [7](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/7.png) • [8](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/8.png) • [9](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/9.png) |
| Timetable investigation issue | Add issue link after creating it |

## Recording New Results

For each manual test, record:

- Test ID.
- Date and tester.
- Browser or device.
- Actual result.
- Pass or fail.
- Screenshot or issue link.

Use test accounts. Exclude passwords, session cookies, database connection strings, and private student information from evidence.

## Remaining Work

- [ ] Complete deployed authentication and permission checks.
- [ ] Verify cloud data updates remain saved after refresh.
- [ ] Investigate the timetable permission rejection.
- [ ] Complete mobile checks.
- [ ] Attach evidence and update test statuses.
- [ ] Add Saramin job finder tests when that feature is implemented.
