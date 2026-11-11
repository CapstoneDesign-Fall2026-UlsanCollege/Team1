# Individual student login access — November 11, 2026

Owner: Galan Bishal (@bishal482), implemented with coding assistance. [Issue #82](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/82).

## Administrator path

Accounts → Student list → **Create student account** opens the existing class-first account/profile/enrollment form. The existing Create student tab remains available. Student profiles already belong to accounts; do not create a second profile to change a login.

For an existing student, select a grade, choose Edit, then **Change login ID**. Confirm admission date, recorded class/section and student number. The automatic prefix is YY + two-digit grade + section A–I mapped to 1–9, followed by a three-digit number. Example: 2026 / Grade 6 / A / 061 → 26061061. Earliest saved membership is only a suggestion; confirm admission details. No membership means assign the student first.

Saving changes only users.login_id. The integer user ID, password, active status, profile and linked records remain unchanged. Existing sessions are revoked; sign in again with the new ID and original password. No bulk rename or working-account change was run.

## Actual assistant-run checks

- Backend and frontend production builds passed.
- [Isolated MySQL/API output: 30 passed, zero failed/skipped](evidence/student-login-id-tests-2026-11-11.txt). Covers format validation, administrator-only access, foreign memberships, invalid/future dates, duplicate rollback, stale saves, unchanged profile/membership/password, old-session rejection, old-login rejection and new login with the original password.
- Browser: fictional review_admin opened Accounts → Create student account and reached the enrollment form. Selected Grade 6 → Edit Aarav Example → Change login ID; loaded recorded membership and automatic prefix 26061. Stopped before entering/submitting a new login credential; save behavior was exercised by isolated API tests.
- [Create account form screenshot](evidence/create-student-account.jpg).
- [Existing account editor screenshot](evidence/student-login-id-editor.jpg).
- Working localhost server rebuilt/restarted; existing IDs/passwords untouched. No new table needed.

## Source and remaining checks

[Admin API](../../backend/src/student-identities.ts), [ID editor](../../frontend/src/components/StudentLoginId.vue), [directory/Create action](../../frontend/src/components/StudentManager.vue), [test](../../backend/tests/school-planning.test.mjs).

These are assistant-run local checks, not independent teammate or hosted verification. Issue #82 remains open for those separate checks.
