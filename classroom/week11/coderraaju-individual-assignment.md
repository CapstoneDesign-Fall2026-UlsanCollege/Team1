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
| 5. Withdraw/unpublish menu | Menu becomes non-public |
| 6. Student refreshes again | Withdrawn menu is no longer visible |

## Actual result

> This section must be completed only after I personally run the test.

| Step | Actual result | Status |
|---|---|---|
| Draft save | PENDING | NOT TESTED |
| Student draft privacy | PENDING | NOT TESTED |
| Publish | PENDING | NOT TESTED |
| Student published read-back | PENDING | NOT TESTED |
| Withdraw / unpublish | PENDING | NOT TESTED |
| Student post-withdraw read-back | PENDING | NOT TESTED |

## Overall result

**Current status:** NOT YET TESTED

## First failing step

PENDING

## Evidence to attach

Use only safe screenshots. Do not include passwords, cookies, tokens, private contact information or real student data.

- Screenshot 1 — Canteen-head draft state: PENDING
- Screenshot 2 — Student view while draft is hidden: PENDING
- Screenshot 3 — Student view after publication: PENDING
- Screenshot 4 — Student view after withdrawal: PENDING

## Repeatable test steps

1. Sign in using the approved canteen-head test account.
2. Choose the applicable canteen date.
3. Create a harmless fictional test menu item.
4. Save the menu as a draft only.
5. Sign in separately as the approved student test account.
6. Open **School Canteen** and refresh.
7. Confirm that the draft is not visible.
8. Return to the canteen-head account and publish the same menu.
9. Refresh the student page and confirm that the published menu matches the canteen-head item and price.
10. Return to the canteen-head account and withdraw/unpublish the menu.
11. Refresh the student page again.
12. Confirm that the withdrawn menu is no longer visible.
13. Record the actual result, first failure if any, tested revision and safe screenshots.

## What this assignment proves

If all steps pass, this provides a real non-author human verification of the canteen owner-to-student publication/privacy path on the tested deployed revision.

## What this assignment does not prove

- It does not verify every canteen validation or retry state.
- It does not verify the optional parent dashboard.
- It does not replace automated tests.
- It does not prove behavior on a later deployment revision unless the test is repeated.

## Week 11 contribution summary

My Week 11 contribution is independent verification of one frozen final-demo behavior rather than implementation of a new feature. I will record the exact environment, expected result, actual result, tested revision and safe proof after running the deployed test.

## Next action

- **If PASS:** update this file with the actual results and link it from Issues #54/#56 and the Week 11 shared report.
- **If FAIL:** record the first failing step, keep the affected issue open, and assign the smallest fix/retest action without widening feature scope.
