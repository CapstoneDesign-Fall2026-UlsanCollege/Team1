# CoderRaaju — Week 11 independent canteen publication/privacy check

**Student:** Bal Raju  
**GitHub login:** `CoderRaaju`  
**Team:** Team 1 — StudentHub  
**Week:** 11 — MVP Verification and Freeze Gate  
**Role:** Independent non-author tester  
**Related Issues:** #54, #55, #56, #60  
**Frozen demo step:** Canteen head changes school canteen information; student refreshes and sees only published information.

## Why I chose this check

The Week 11 feedback asks me to take one small check inside the frozen demo path and record the exact environment, commit, expected result, actual result, and evidence.

This canteen owner-to-student path is already implemented and has automated/assistant-run evidence, but Issues #54–#56 still require a real non-author human verification. Ansh's Week 11 work covers subject persistence and special-room booking, so this is a separate verification contribution.

## Test boundary

I am verifying only the publication/privacy behavior:

1. a canteen-head draft must stay hidden from the student;
2. after publication, the student must see the same item/name/price;
3. after withdraw/unpublish, the student must no longer see that menu.

This test does **not** claim that every canteen feature, every role permission, or every error/retry state is fully verified.

## Test setup

- **Tester:** `CoderRaaju`
- **Date/time:** PENDING
- **Environment:** Deployed StudentHub in browser
- **Device/browser:** PENDING
- **URL:** https://team1-production.up.railway.app/
- **Exact tested commit/revision:** PENDING
- **Canteen-head account:** approved test account; credentials not recorded
- **Student account:** approved test account; credentials not recorded
- **Real personal/student data used:** No

## Expected result before testing

| Step | Expected result |
|---|---|
| 1. Canteen head saves today's fictional menu as **draft** | Draft saves successfully but is not visible to a student |
| 2. Student opens/refreshes School Canteen | Student sees no unpublished draft menu |
| 3. Canteen head publishes the same menu | Publication succeeds and survives page refresh |
| 4. Student refreshes School Canteen | Same published item/name/price appears |
| 5. Canteen head withdraws/unpublishes the menu | Menu returns to non-public state |
| 6. Student refreshes again | Withdrawn menu is no longer visible |

## Actual result

> Fill this section only after I personally run the test.

| Step | Actual result | Status |
|---|---|---|
| Draft save | PENDING | NOT TESTED |
| Student draft privacy | PENDING | NOT TESTED |
| Publish | PENDING | NOT TESTED |
| Student published read-back | PENDING | NOT TESTED |
| Withdraw / unpublish | PENDING | NOT TESTED |
| Student post-withdraw read-back | PENDING | NOT TESTED |

## Overall result

**Status:** NOT YET TESTED

## First failing step

PENDING

## Evidence

Use only safe screenshots. Do not include passwords, cookies, tokens, private contacts, or real children's data.

- Screenshot 1 — canteen-head draft state: PENDING
- Screenshot 2 — student view while draft is hidden: PENDING
- Screenshot 3 — student view after publication: PENDING
- Screenshot 4 — student view after withdrawal: PENDING

## Teammate repeat

After my result is recorded, ask one teammate who did not perform this test to repeat the same bounded path without coaching.

- **Repeat tester:** PENDING
- **Repeat date/environment:** PENDING
- **Repeat actual result:** PENDING

## What this result will establish

If all six steps pass, this will provide a real non-author human result for the owner-to-student canteen publication/privacy path on the tested deployed revision.

## What this result will not establish

- It will not prove every canteen validation/error state.
- It will not prove parent-dashboard behavior.
- It will not replace automated regression tests.
- It will not prove later commits unless the test is repeated on that revision.

## Next action

- **If PASS:** link this note from Issues #54/#56 and the Week 11 shared report.
- **If FAIL:** keep the affected issue open, record the first failure exactly, assign the smallest fix/retest action, and do not widen feature scope.
