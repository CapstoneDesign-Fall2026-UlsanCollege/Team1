# Individual Evidence Receipt — Bal Raju

**Student:** Bal Raju (@CoderRaaju)
**Team:** Team 1 — StudentHub
**Week:** 10 (November 5–11, 2026)
**Updated:** November 10, 2026

Supporting evidence draft for the [one shared report](weekly-report.md), not a separate weekly report. **Correction, November 10:** the requester clarified that they are Galan Bishal, not Bal Raju. The earlier update used the connected CoderRaaju account based on that mistaken identity; the account used does not establish who performed a test or accepted a role. Treat the new role choices and explanation below as proposals pending Bal Raju’s personal review. The original November 9 tester-owned record is preserved, not independently corroborated by this chat.

## Proposed Week 10 slice and area — confirmation pending

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

## Draft receipt 2 — documentation prepared by AI at Galan’s request

- **What I did:** Galan requested an evidence update using the connected CoderRaaju account; AI prepared the proposed C0 evidence/testing-integration scope and links. This is not Bal Raju’s personal confirmation or new contribution claim.
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

**AI disclosure:** AI helped inspect source/evidence and draft these documents at Galan’s request. Bal Raju has not confirmed these new entries. New assistant checks must be recorded separately and cannot become his independent result.

## Direct evidence links — November 10 follow-up

- [Bal Raju individual evidence receipt (draft pending personal confirmation)](individual-evidence-receipt-bal-raju.md)
- [Fresh assistant-run C0 check and exact source](c0-fresh-assistant-check-2026-11-10.md)
- [C0 workspace screenshot](evidence/c0-assistant-workspace-2026-11-10.jpg)
- [Disabled-account screenshot](evidence/c0-assistant-disabled-2026-11-10.jpg)
- [Automated test output](evidence/c0-assistant-tests-2026-11-10.txt)

These new links prove the dated assistant check only. They do not prove a Bal Raju-run test or a #72 room-booking pass.

## #72 supporting evidence available for independent review

- [November 10 assistant check: exact commit, expected/actual and data boundaries](room-booking-assistant-check-2026-11-10.md)
- [Raw school test output: 20 passes, no failures/skips](evidence/room-booking-assistant-tests-2026-11-10.txt)

Galan requested this assistant check. It is supporting implementation evidence for Bal Raju to review, not a new contribution or personal test by him. His confirmation and independent walkthrough remain pending.
