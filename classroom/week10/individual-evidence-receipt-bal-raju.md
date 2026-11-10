# Individual Evidence Receipt — Bal Raju

**Student:** Bal Raju (@CoderRaaju)  
**Team:** Team 1 — StudentHub  
**Week:** 10 (November 5–11, 2026)  
**Updated:** November 10, 2026

Supporting evidence for the [one shared report](weekly-report.md), not a separate weekly report. This follow-up was requested by Bal Raju in chat and published using his CoderRaaju GitHub connection with AI documentation assistance. It preserves Galan’s implementation credit and does not invent new independent tests.

## My Week 10 slice and area

- **Bounded slice:** complete and maintain the evidence for C0 canteen-account independent verification, [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61): exact tested version, expected/actual results, safe proof and unresolved live boundary.
- **Primary area:** testing/integration, especially account roles and session lifecycle. Responsibility covers the test procedure, readable results and reproducibility, not exclusive control of application source.
- **Next cross-area task:** independently repeat one valid special-room booking and one conflict case for [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72). [Prepared test record](raju-room-booking-test.md). Execution is pending.
- **Support:** Galan’s published [handoff](code-ownership-galan.md) supplies implementation context. A mutually accepted backup has not been recorded; no teammate acceptance is asserted.
- **Review point:** November 11, end of day. If proof or a reviewer is unavailable, keep the criterion incomplete and record the exact next action.

## Receipt 1 — Independent C0 account test

- **What I did:** The existing tester-owned record reports that I independently tested the local C0 review fixture on November 9.
- **Evidence:** [Original result](../week8/c0-independent-test.md#tester-owned-result-record), [my evidence commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/6d8c538), [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61).
- **Exact tested commit:** [aea1636f5183ddb77736dbe725ab6615cbeceb0d](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/aea1636f5183ddb77736dbe725ab6615cbeceb0d).
- **How checked:** My recorded Windows 11 / PowerShell result covers the canteen workspace, session reload/logout, duplicate-account rejection, disable/re-enable behavior and role boundaries.
- **Recorded outcome:** Passed locally for that fixture; no first failing step reported. This does not establish live deployment, the full menu feature or the newer school booking path.
- **Evidence gap:** The record describes captured screenshots but contains no direct image link. Repository inspection found only older assistant screenshots, so they have not been substituted as proof of my November 9 test.
- **Next action:** Supply the original safe screenshot path/URL and add the link to the original test result. Keep passwords, cookies and personal data out of proof.

## Receipt 2 — Week 10 feedback and ownership follow-up

- **What I did:** Requested this update through my connected CoderRaaju account; selected the C0 evidence follow-up/testing-integration scope and linked my existing result into the shared report and audit.
- **Evidence:** [Shared report](weekly-report.md#individual-contribution-entries--one-row-per-student), [team area map](ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth).
- **How checked:** AI assistance compared the current main-branch documents with the recorded test. The existing Galan and Ansh entries were preserved.
- **What changed:** The contribution now distinguishes the recorded C0 local pass from missing screenshot proof, unexecuted #72 testing and unverified live hosting.
- **Limit:** This is a documentation contribution, not another runtime test or proof of an oral code explanation.

## Code explanation prepared for review

This explanation was drafted with AI from current source. It must not be treated as an observed independent explanation by me.

| Item | Explanation / source |
|---|---|
| Purpose | Administrators provision canteen-head accounts and can revoke access; canteen heads use a separate workspace. |
| One input | PUT /api/admin/canteen-accounts/:id/status with is_active=false, from an authenticated administrator. |
| Change / return | The route validates the account and status, saves the disabled flag and calls the session invalidation callback. Invalid input or non-admin access is rejected. [canteen-accounts.ts](../../backend/src/canteen-accounts.ts) |
| Dependency | [app.ts](../../backend/src/app.ts) owns sessions, rejects inactive accounts and supplies the invalidation callback. Re-enabling does not recreate removed session tokens; a fresh login is required. |
| Test boundary | [c0-review.mjs](../../backend/scripts/c0-review.mjs) supplies a focused fictional-account review fixture; its result is not production persistence proof. |
| Question for a teammate | Why should re-enabling an account permit a fresh login but not revive its old session? Trace the status route and invalidation callback. |
| Actual answer/checker | Pending: no oral question/answer or new peer review was observed for this update. |

Current-source links explain navigation; the November 9 result is tied only to its exact recorded commit.

## Remaining actions

- [ ] Link the original November 9 safe screenshot.
- [ ] Record a mutually accepted backup/support person.
- [ ] Review/explain the code above and record a real question, answer and checker.
- [ ] Execute #72 valid/conflict checks against a recorded commit; attach actual result and proof.
- [ ] Keep any hosted check separate under [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65), coordinated by Galan.

**AI disclosure:** AI helped inspect source/evidence and draft these documents. No new test was run on my behalf and labelled as my independent result.
