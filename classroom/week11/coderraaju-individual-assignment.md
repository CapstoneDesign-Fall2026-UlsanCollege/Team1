# CoderRaaju — Week 11 Individual Assignment

**Student:** Bal Raju  
**GitHub login:** `CoderRaaju`  
**Team:** Team 1 — StudentHub  
**Week:** 11 — MVP Verification and Freeze Gate  
**Assignment type:** Independent verification inside the frozen final-demo path  
**Related Issues:** #54, #55, #56, #60

## My Week 11 task

My individual Week 11 task is to independently verify the **School Canteen publication and privacy flow** on the deployed StudentHub application.

This task was selected because:

- Week 11 requires each member to contribute one bounded verification inside the frozen demo path.
- Ansh Sharma already tested subject persistence and special-room booking on iPhone.
- Galan Bishal has already produced implementation, automated-test and deployment evidence.
- The canteen owner-to-student publication path still needs a real non-author human result in Issues #54–#56.
- This verification is part of the current final-demo roadmap and does not add a new feature.

## Frozen demo behavior being checked

The test covers this flow:

```text
Canteen Head
    ↓
Save menu as Draft
    ↓
Student refreshes
    ↓
Draft must stay hidden
    ↓
Canteen Head publishes menu
    ↓
Student refreshes
    ↓
Published menu must appear
    ↓
Canteen Head withdraws/unpublishes
    ↓
Student refreshes
    ↓
Menu must disappear again
```

## Test environment

- **Application:** StudentHub
- **Deployment:** https://team1-production.up.railway.app/
- **Device:** PENDING
- **Browser:** PENDING
- **Test date/time:** PENDING
- **Exact tested commit/revision:** PENDING
- **Canteen-head account:** approved test account; credentials must not be recorded
- **Student account:** approved test account; credentials must not be recorded

## Expected result before testing

| Step | Expected result |
|---|---|
| 1. Save a fictional menu as draft | Draft is saved successfully |
| 2. Student opens School Canteen | Draft menu is not visible |
| 3. Publish the same menu | Publication succeeds |
| 4. Student refreshes | Published item, name and price appear correctly |
| 4a. Mark the published item sold out, then restore availability | The student sees both changes after refresh, with the same item name and price |
| 5. Withdraw/unpublish menu | Menu becomes non-public |
| 6. Student refreshes again | Withdrawn menu is no longer visible |

## Automated precheck — November 18

Codex ran the backend build and canteen suite against a temporary local MySQL 8.4.13 container with fictional accounts and data. All 14 tests passed, with zero skipped. The suite covered student draft privacy, publication and withdrawal, sold-out/restored availability, unchanged name and price, and persistence across restart. [Test output and tested revision](evidence/canteen-regression-2026-11-18.txt)

## Hosted role precheck — November 18

Codex used temporary demo accounts on the deployed StudentHub. The admin, student, teacher and canteen-head logins succeeded. The canteen-head menu, student canteen, student homework and teacher dashboard API reads returned HTTP 200. On the November 18 Nepal service date, the canteen head saw no saved menu and the student saw no published menu.

The deployed menu is shared by service date. A demo login does not isolate the publication from other students, and the menu API has no delete operation to restore an unused date after creating a draft. No menu was written. The temporary logins were signed out and disabled. Demo student and teacher directory records remain for traceability. The deployed commit was not identified during this check.

## Additional Week 11 work and evidence

| Work | What was completed | Evidence |
|---|---|---|
| MVP freeze documentation | Added the shared verification checklist and weekly report. Linked the scope decision, the iPhone subject-persistence recovery, the issue priorities and the Sprint 2 checks. | [Documentation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/44605899d71c3738993acd497141f5c91e06dbfd) · [MVP checklist](mvp-verification-checklist.md) · [Weekly report](weekly-report.md) |
| Automated canteen regression | Built the backend and ran the isolated MySQL suite. All 14 tests passed, including draft privacy, publish and withdraw, availability changes and persistence. | [Test output](evidence/canteen-regression-2026-11-18.txt) |
| Deployed account provisioning and role checks | Provisioned temporary student, teacher and canteen-head accounts through admin. Verified each login and read the role-specific endpoints below. Signed out and disabled all three test logins afterward. | [Hosted check record](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/1fe1c663550de664086a4d4a766217ee9812b605) |
| Production test scope | Identified that the canteen menu is shared by service date. Documented the need for a staging instance or a designated production test window and recorded the remaining checks for [#54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54) and [#56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56). | [Week 11 issue index](issues.md#week-11-freeze-gate) |

Codex performed the documentation and test work above using the CoderRaaju GitHub connection. Bal Raju’s personal browser result is pending.

| Live role check | Observed result on November 18 |
|---|---|
| Admin sign-in and account directory access | Login and student, teacher and canteen account lists returned HTTP 200. |
| Student login and read-back | Login, `GET /api/student/homework` and `GET /api/student/canteen` returned HTTP 200. The current date had no visible menu. |
| Teacher login and dashboard | Login and `GET /api/teacher/dashboard` returned HTTP 200. |
| Canteen-head login and menu read | Login and `GET /api/canteen/menu` returned HTTP 200. The current date had no saved menu. |

## Personal browser test results

> This section must be completed only after I personally run the test.

| Step | Actual result | Status |
|---|---|---|
| Draft save | PENDING | NOT TESTED |
| Student draft privacy | PENDING | NOT TESTED |
| Publish | PENDING | NOT TESTED |
| Student published read-back | PENDING | NOT TESTED |
| Sold out and restored after student refresh | PENDING | NOT TESTED |
| Withdraw / unpublish | PENDING | NOT TESTED |
| Student post-withdraw read-back | PENDING | NOT TESTED |

## Overall result

**Current status:** Automated canteen regression passed (14/14). Hosted role logins and API reads passed. The independent browser test and hosted menu changes are pending.

## First failing step

None observed in the completed checks. Record the first failure, if any, when running the pending browser steps.

## Evidence to attach

Use only safe screenshots. Do not include passwords, cookies, tokens, private contact information or real student data.

- Screenshot 1 — Canteen-head draft state: PENDING
- Screenshot 2 — Student view while draft is hidden: PENDING
- Screenshot 3 — Student view after publication: PENDING
- Screenshot 4 — Student view after withdrawal: PENDING

## Repeatable test steps

1. Sign in using the approved canteen-head test account.
2. Use an approved demo school or a designated fixture for the current Nepal service date. Stop if the only available fixture is an active real menu.
3. Create a harmless fictional test menu item.
4. Save the menu as a draft only.
5. Sign in separately as the approved student test account.
6. Open **School Canteen** and refresh.
7. Confirm that the draft is not visible.
8. Return to the canteen-head account and publish the same menu.
9. Refresh the student page and confirm that the published menu matches the canteen-head item and price.
10. Mark the published test item **Sold out**. Refresh as the student and verify the label, name and price. Restore **Available** and repeat the student check. Capture the two states.
11. Return to the canteen-head account and withdraw/unpublish the menu.
12. Refresh the student page again and confirm the withdrawn menu is hidden.
13. Restore the fixture to its agreed pre-test state.
14. Record the actual result, first failure if any, tested revision and safe screenshots.

## What this assignment proves

If all steps pass, this provides a real non-author human verification of the canteen owner-to-student publication/privacy path on the tested deployed revision.

## What this assignment does not prove

- It does not verify every canteen validation or retry state.
- It does not verify the optional parent dashboard.
- It does not replace automated tests.
- It does not prove behavior on a later deployment revision unless the test is repeated.

## Week 11 contribution summary

This assignment now records the Week 11 freeze documentation, the isolated canteen regression, and the deployed role checks performed with Codex. My remaining independent contribution is to run the canteen browser sequence and record the environment, tested revision, observed results and safe evidence.

## Next action

- **If PASS:** update this file with the actual results and link it from Issues #54/#56 and the Week 11 shared report.
- **If FAIL:** record the first failing step, keep the affected issue open, and assign the smallest fix/retest action without widening feature scope.
