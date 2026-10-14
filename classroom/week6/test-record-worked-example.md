# Week 6 Test Record — StudentHub

**Team:** Team 1  
**Related Issue:** [#44 — Administrator navigation verification](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44)  
**Implementation:** [Administrator navigation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c7ad189)

These checks are prepared for a teammate to run. **Actual results and proof are pending.**

## Check A — Open Students from Dashboard

**Tested by:** [Non-author teammate’s name / GitHub login]  
**Date:** [Actual test date]

### Check steps

1. Open [StudentHub](https://team1-production.up.railway.app/).
2. Sign in with a team-approved administrator test account.
3. Start on **Dashboard**.
4. Select **Students**.

**Expected result:** The student management section opens, and Students is clearly marked as selected.

**Actual result:** [Record what the teammate observes.]

**Proof:** [Link a screenshot or short recording. Hide student information.]

**Problems found:** [Record any problems; write “None observed” only after testing.]

**Next action:** Record the result, then perform Check B.

### Definition of Done

- [ ] A non-author teammate can open the deployed application and sign in.
- [ ] Students opens from Dashboard.
- [ ] Students is clearly marked as selected.
- [ ] The tester records the actual result and links proof.

**Verification status:** Pending. Do not mark these criteria complete before testing.

## Check B — Navigation follows the selected section

**Tested by:** [Non-author teammate’s name / GitHub login]  
**Date:** [Actual test date]

### Check steps

1. Sign in as an administrator and start on **Dashboard**.
2. Select **Students**.
3. Select **Semesters**.
4. Select **Courses**.
5. Return to **Dashboard**.

**Expected result:** Each destination displays its matching section. The selected navigation item updates at every step.

**Actual result:** [Record the observed result. If something fails, identify the first failing step.]

**Proof:** [Link a screenshot sequence or short recording.]

**Problems found:** [Describe any missing section, incorrect selection indicator, or confusing behavior.]

**Next action:** If the check fails, record the problem in Issue #44, assign an owner, and repeat these steps after the fix.

### Definition of Done

- [ ] The written steps can be followed without coaching.
- [ ] Students, Semesters, Courses, and Dashboard each open correctly.
- [ ] The selected navigation item matches the displayed section.
- [ ] A non-author teammate records the result and links proof.
- [ ] Any failed check passes a recorded retest before completion is claimed.

**Verification status:** Pending. These checks do not verify database updates or permissions.

## What to carry into the shared report

- Link Issue #44, the implementation commit, the completed test note, and proof.
- Each student confirms their own contribution and evidence row.
- Update the Issue’s actual status and Definition of Done to match the results.
- Keep passwords, API keys, and personal student data out of screenshots.
