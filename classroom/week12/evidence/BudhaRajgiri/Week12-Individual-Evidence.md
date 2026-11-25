# Week 12 Individual Evidence — Buddha Raj Giri

**GitHub:** [@BudhaRajgiri](https://github.com/BudhaRajgiri)  
**Project:** StudentHub · **Week:** 12 · **Evidence updated:** November 25, 2026  
**Personal review area:** Student My Class / homeroom display

> **Evidence status:** The PNG files listed below are linked from this receipt. During the user's review, clicking the in-app refresh control was observed to navigate back to the homepage instead of keeping the user on the current page. This is recorded as a reproducible issue to investigate, not as a successful refresh. Other test-result claims remain conservative: screenshots alone do not establish every step, environment, account scope, or privacy guarantee.

## 1. My Week 12 work

- Reviewed the existing Week 12 project records and identified a focused personal review area: the signed-in student's own-class and homeroom experience.
- Mapped the review to the My Class UI in `frontend/src/components/StudentSchool.vue` and the Student My Class API boundary in `backend/src/school-planning.ts`.
- Prepared a scoped test plan covering assigned-class display, refresh/retry, timetable consistency, empty and missing-teacher states, privacy boundaries, and responsive layout.
- Collected and organized the PNG evidence files listed below.
- Identified a refresh-navigation issue: clicking the in-app refresh control returns the user to the homepage rather than retaining the current page; recorded the observed behavior for follow-up.
- Prepared this evidence record and related documentation with ChatGPT assistance.

**Code changes:** No Week 12 code change is claimed here.  
**Runtime test attribution:** The screenshots are linked as submitted evidence. Personal test details and the observed outcomes still need the user's confirmation in the table below.  
**Ownership boundary:** This personal review is separate from Galan's #83 subject-persistence implementation and tests. Their work is not claimed as mine.

## 2. Screenshot evidence

All files are stored in this folder: [BudhaRajgiri Week 12 evidence folder](./).

### My Class / student card
- [Student card](student%20card.png)
- [Student card download capture](downloading%20%20the%20%20student%20card.png)
- [My Class after five refreshes](my%20class%20after%205%20refresh.png)
- [Interface before refresh](interface%20before%20refresh%20.png)

### Timetable
- [Weekly timetable](weekly-timetable.png)
- [Timetable after five refreshes](timetable%20after%205%20refreshes.png)

### Subject and homework refresh comparisons
- [Subject before refresh](subject%20before%20refresh.png)
- [Subject after refresh](subject%20after%20refresh.png)
- [Homework before refresh](homework%20before%20refreshes.png)
- [Homework after refresh](homework%20after%20refreshes.png)

### Privacy-related capture
- [Student privacy screenshot](student_privacy.png)

These are linked as supporting images only. The subject/homework comparisons are not treated as proof of the separate My Class privacy boundary.

## 3. Empty-state checks previously performed

The user confirms these two My Class states were checked earlier and the application displayed the following messages:

- **No-class state:** “You are not assigned to any class.” This is the expected guidance when the student has no class assignment.
- **Missing-homeroom-teacher state:** “You are not assigned a homeroom teacher.” This is the expected guidance when the student has no homeroom teacher assignment.

**Evidence status:** Marked as previously observed and confirmed by the user. No new screenshot or independent retest is claimed in this update; attach the original screenshots or repeat the checks if the instructor requires visual proof.

## 3. Observed issue: refresh control returns to homepage

**Observed environment:** Laptop (desktop browser; exact browser/version not recorded).

**Observed behavior:** When I click the in-app refresh control on my laptop while viewing a page, the application takes me back to the homepage instead of refreshing the current page and keeping me on that page.

**Expected behavior:** The refresh action should reload or update the current page's data while keeping the user on the same page (for example, My Class or the timetable), unless the product intentionally specifies a different navigation behavior.

**Impact:** This interrupts the user's workflow and makes it difficult to verify refresh/persistence on the page being tested. It may also make the existing before/after refresh evidence ambiguous if the page changed during the action.

**Reproduction steps:**
1. On the laptop, sign in using the authorized student test account.
2. Navigate to My Class or another page being checked.
3. Click the in-app refresh control.
4. Observe that the application navigates to the homepage.

**Status:** Observed by the user on a laptop; needs developer investigation and retest after a fix. The exact browser/version and test date have not yet been recorded. No code fix is claimed in this individual evidence file.

## 4. Test plan and results to confirm

| Check | Evidence | Actual result / status |
| --- | --- | --- |
| Assigned-class / student-card display | [Student card](student%20card.png), [download capture](downloading%20%20the%20%20student%20card.png) | **Screenshot supplied; user confirmation of account/class details pending** |
| My Class refresh | [Before refresh](interface%20before%20refresh%20.png), [after five refreshes](my%20class%20after%205%20refresh.png) | **Issue observed: clicking the in-app refresh control navigates to the homepage instead of retaining the current page. Refresh/persistence on the same page is therefore not passed; investigate and retest.** |
| Timetable consistency / refresh | [Weekly timetable](weekly-timetable.png), [after five refreshes](timetable%20after%205%20refreshes.png) | **Screenshots supplied; confirm timetable belongs to the same signed-in student and remained consistent** |
| Subject persistence | [Before](subject%20before%20refresh.png), [after](subject%20after%20refresh.png) | **Supporting before/after screenshots supplied; confirm exact steps and context** |
| Homework persistence | [Before](homework%20before%20refreshes.png), [after](homework%20after%20refreshes.png) | **Supporting before/after screenshots supplied; confirm exact steps and context** |
| Privacy boundary | [Student privacy screenshot](student_privacy.png) | **Screenshot supplied; does not alone prove another student's data is inaccessible. Authorized privacy test pending** |
| No-class state | No matching screenshot identified | **Not evidenced / pending suitable test account** |
| Missing-teacher state | No matching screenshot identified | **Not evidenced / pending suitable fixture** |
| Responsive layout | No clearly labelled phone/laptop pair identified | **Pending confirmation** |

For each check you personally performed, add the date, browser/device, local or deployed environment, app revision if known, account role (never the password), exact steps, expected result, actual result, and pass/fail status. Track the refresh-navigation behavior above as an issue until a developer investigates it and the same-page refresh is retested. If a check cannot be run safely, mark it **Not tested** and explain why.

## 5. AI-use disclosure and explanation

ChatGPT helped review existing repository records, organize the supplied screenshot filenames into this evidence receipt, and draft the documentation at my request. I must review the content, correct anything that does not match my actual work, personally confirm the test steps and outcomes I claim, and be able to explain the relevant UI/API boundary.

I should be able to explain:
1. How the signed-in student's identity scopes the My Class request.
2. How the interface distinguishes a student with no assigned class from a class with no assigned homeroom teacher.
3. What an authorized test would demonstrate that one student cannot read another student's class data.
4. Which before/after screenshots correspond to the exact refresh sequence I performed.

## 6. Prior work

My [Week 11 individual evidence](../../../week11/evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) is historical context only. It is not presented as a Week 12 test result.

## 7. Personal confirmation

- [ ] I reviewed this file and confirm it accurately describes my Week 12 work.
- [ ] I confirm the account, class, device, date and refresh steps represented by the screenshots.
- [ ] I completed and recorded the checks that I claim as passed.
- [x] The supplied PNG files are linked in this evidence receipt.
- [ ] I can explain the UI/API boundary and the limits of my tests.

**Personal confirmation date:** Pending  
**Peer reviewer:** Pending personal agreement; no reviewer is assigned on my behalf.
