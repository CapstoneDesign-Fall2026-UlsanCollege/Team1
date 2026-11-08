# Activity Log - actual local checks

**Owner:** Galan Bishal (@bishal482), requirements and iteration with coding assistance.  
**Date:** November 8, 2026. **Issue:** [A1 #73](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/73).

## Completed locally

Automatic authenticated staff attribution, atomic InnoDB audit triggers, admin-only read-only filters, before/after details and 20-entry numeric-ID pagination. Private profile/account values are hidden in stored JSON and read-back; pooled actor state is cleared before reuse.

A private backup was restore-verified, then the additive schema/triggers were installed in persistent local studenthub. Original accounts and academic records were retained. The backup restoration check caught a JSON serialization bug; it was corrected and reverified before installation.

## Automated results

Assistant-run, not independent teammate testing:

- Backend TypeScript compilation passed.
- Full backend suite with school/menu/activity database suites enabled: **65 passed, 0 failed, 0 skipped**.
- Extended Activity Log integration check passed afterward, including canteen price history and rejected stale writes.
- Frontend build passed and **12 existing frontend checks passed**.

[Isolated audit integration test](../../backend/tests/activity-log.test.mjs) checks two concurrent admins, pooled connection reuse with one connection, exclusion of student/direct SQL changes, no-op edits, privacy, rollback, deliberately failed audit insertion blocking the underlying edit, create/update/delete, canteen attribution/prices, forged actors, authentication/roles, invalid filters, date exclusion, pagination and read-only methods. It creates/removes its own random database.

## Repeatable browser check

1. Open the local site; sign into the labelled fictional administrator.
2. Open Rooms. Rename room 501 from Classroom 501 to Classroom 501 - audit check, save, then restore the original name.
3. Open Activity Log and expand the newest entry.
4. Expected: demo_admin, Rooms/501, update time and before/after values; newest entry restores the original name.
5. Actual: two automatic update records appeared; the newest entry showed restoration. No historical entries were backfilled.
6. At 390px width, document and scroll width were both 390px; controls/details fit.

[Desktop proof](evidence/activity-log-desktop.jpg) | [Mobile proof](evidence/activity-log-mobile.jpg)

## Follow-up: four-second confirmations

Owner requested shorter success rows. Added a shared four-second timer to room board, student/staff editing and legacy academic save notices. Existing school/canteen notices already use four seconds. Errors remain visible and timers are cancelled on disposal. Latest frontend build passed; browser showed Room name saved immediately and absent on the subsequent check (about 9 seconds later). Timer duration is 4000ms in source. [Cleared notice proof](evidence/room-save-notice-cleared.jpg). Password-reset confirmations and temporary credential delivery retain their follow-up information.

## Release limits

Independent teammate testing and live deployment remain pending; #73 stays open for that gate. [Operation/coverage/backup limits](../../docs/activity-log.md).
