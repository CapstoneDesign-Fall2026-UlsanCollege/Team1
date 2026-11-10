# Fresh C0 check — November 10, 2026

**Requested by:** Galan Bishal (@bishal482)
**Performed by:** Coding assistant, not Bal Raju
**Scope:** Local fictional-account C0 fixture; no MySQL connection, no production accounts
**Frozen browser/test source:** [aea1636f5183ddb77736dbe725ab6615cbeceb0d](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/aea1636f5183ddb77736dbe725ab6615cbeceb0d)

## Why this is a separate record

Galan clarified that he, rather than Bal Raju, was requesting the November 10 documentation updates. This fresh evidence does not replace the missing screenshots from Bal Raju’s reported November 9 run and is not an independent teammate test.

## Start and expected behavior

Used a new detached checkout of the frozen C0 commit with clean tracked files. Installed backend/frontend dependencies, built both, set VITE_BASE_PATH=/ and VITE_API_ORIGIN empty, and started the unchanged c0-review.mjs on 127.0.0.1:3018. All accounts are fictional and disappear on server restart.

Expected before checking: canteen-head login opens its own workspace; reload keeps the session; logout returns to login. Administrator can disable the fictional canteen account and see Disabled. Automated tests separately check role restrictions, provisioning/duplicates, session revocation/re-enable and other account behavior.

## Actual browser observations

1. Signed in as review_canteen. Actual: CANTEEN HEAD WORKSPACE and the frozen C0-only “Canteen management is coming next” screen appeared.
2. Reloaded. Actual: Welcome, review_canteen remained. [Workspace after reload](evidence/c0-assistant-workspace-2026-11-10.jpg).
3. Logged out. Actual: Log in to StudentHub returned.
4. Signed in as review_admin and opened Accounts → Canteen staff. Actual: the fictional account appeared Active.
5. Chose Disable account, reviewed the named confirmation and selected Confirm disable. Actual: Disabled · Canteen head and “Account disabled. Existing sessions were signed out.” appeared. [Disabled-account proof](evidence/c0-assistant-disabled-2026-11-10.jpg).

This is a partial browser walkthrough. It does not claim the browser repeated duplicate creation, old-session rejection, re-enable or every role case. Those branches have separate automated evidence. The Student list initially displayed Endpoint not found, expected for a focused fixture without the student-admin store; it is not evidence that the school’s persistent student directory failed.

## Automated evidence

[Captured test output](evidence/c0-assistant-tests-2026-11-10.txt), run from the frozen checkout:

```powershell
node --test backend/tests/canteen-accounts.test.mjs backend/tests/auth.test.mjs
```

Actual: **10 passed, 0 failed, 0 skipped**. Read the linked output for individual checks. The fixture uses in-memory/mock stores; this does not prove real MySQL writes.

## Current-build compatibility observation

Before using the frozen checkout, the assistant compiled current source at 27fe297 and ran the same two test files: 10 passed, zero failed/skipped. Starting the old c0-review.mjs with the current full-canteen frontend then stopped at its explicit C0-only marker guard. The guard was not bypassed or removed. The frozen checkout resolved that version mismatch without changing application source or the working database.

## Evidence index

- [Fresh workspace screenshot](evidence/c0-assistant-workspace-2026-11-10.jpg)
- [Fresh disabled-account screenshot](evidence/c0-assistant-disabled-2026-11-10.jpg)
- [Frozen-version automated output](evidence/c0-assistant-tests-2026-11-10.txt)
- [Bal Raju’s proposed receipt — personal confirmation pending](individual-evidence-receipt-bal-raju.md)
- [Separate pending #72 human check](raju-room-booking-test.md)
- [Original tester-owned November 9 record](../week8/c0-independent-test.md#tester-owned-result-record)

**Still pending:** Bal Raju’s own proof/confirmation and current #72 valid/conflict result. Hosting and live verification remain separate under #65. No earlier screenshot or new assistant run is relabelled as Bal Raju’s independent result.
