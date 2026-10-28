# C0 test note — Canteen-head workspace and account access

**Date:** October 25, 2026

**Related issue:** [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61)

**Checked by:** Coding assistant through automated tests and a local browser. This is not independent teammate testing.

## Expected behaviour

A canteen-head account signs in to its own workspace and restores that workspace after reload. It cannot access academic or student-only endpoints. An administrator can create and disable canteen-head accounts without gaining menu controls.

## Automated checks

- Backend tests cover all three workspace roles; anonymous denial; staff creation and login; invalid input and role injection; duplicate IDs; hashed credentials; status changes restricted to canteen staff; session invalidation, logout and expiry; and repeatable enum migration.
- MySQL migration and persistence were also checked against a connection-scoped temporary users table. Existing fixture administrator/student roles remained intact and the staff role persisted. The real users table was unchanged.
- Final checks: **30 backend tests passed, 0 failed**; **7 frontend tests passed, 0 failed**; frontend TypeScript/production build passed with the combined-deployment root path.

## Browser check

Environment: isolated local server with fictional in-memory accounts, no database connection.

1. Open the local app and sign in as the prepared fictional canteen-head account.
2. Check the workspace heading and available controls.
3. Reload and check session restoration.
4. Check the layout at a 390-pixel viewport.

**Actual result:** Separate canteen-head workspace appeared. Reload restored it. The page explicitly says menu controls come next. At 390 pixels, document width matched viewport width with no horizontal overflow.

**Proof:** [Fictional canteen-head workspace](evidence/c0-workspace-demo.png).

## Administrator account screen

Using the fictional administrator on the same local preview, opened **Accounts → Canteen staff**. The staff list and create-account form appeared. At 390 pixels the page had no horizontal overflow. Selected Disable account, checked the confirmation, and confirmed disabling the disposable in-memory canteen-head fixture. The list changed to Disabled and the success message reported session revocation.

This browser check did not create a real account. Provisioning, password hashing, duplicate IDs, and re-enabling/revocation are covered separately by the backend tests.

**Proof:** [Fictional staff account controls](evidence/c0-staff-access-demo.png).

## Limits and next action

No real production canteen-head account was created for these checks. Full Railway account provisioning and a non-author teammate walkthrough still need their own recorded result. Menu publication remains #54, not completed work in this slice.

After implementation commit `fa1be1a` was pushed, the public Railway URL returned HTTP 404 with `Application not found`. The private Railway project page required login, so deployment/startup could not be inspected. This does not identify a cause or prove the new code deployed. Next action: sign in to Railway, inspect service/domain and deployment status, then perform the live role check with an approved test account.

## Follow-up — October 28

The authenticated Railway page subsequently became accessible and showed **Trial expired**, **Limited Access**, **Service offline** and **no active deployment**. See the [recovery record](deployment-recovery.md), [dashboard observation](evidence/railway-dashboard-observation-2026-10-28.txt) and [screenshot](evidence/railway-trial-expired-2026-10-28.png). This updates the earlier unknown-cause state; it does not change the local test results into a live pass. `bishal482` owns the hosting decision and subsequent verification in #65.
