# Clean sample display labels

**Owner:** Galan Bishal (@bishal482), with coding assistance. **Date:** November 9, 2026.

Owner requested realistic-looking sample data without Demo labels. Updated 215 label values in the persistent local studenthub database:

- StudentHub Secondary School; academic year 2026–2027; School term 2026–2027.
- Removed Demo from 20 fictional teacher names and changed visible staff codes from DEMO-Txx to Txx.
- Replaced 30 generated student display names with fictional Nepali-style names.
- Updated matching school labels, linked offering teacher display names, subject codes (SCH- prefix) and matching canteen label.

These are still fictional sample records, not an actual school's verified roster. Existing real records were preserved. Login IDs/passwords, numeric IDs, memberships, timetables, room bookings and historic Activity Log rows were not rewritten. Existing demo_ login IDs remain valid intentionally.

## Verification

Vendor mysqldump backup included tables and triggers and was restored into a random isolated check database before any writes. Every table row count and trigger count matched. Temporary restore database was removed. Backup and before/after journal remain private outside Git; no credentials or real student details are published.

Updates ran in one transaction under the planning lock with before-value checks. Subsequent dry run reported zero remaining planned changes (idempotent). Browser confirmed the new school/year/term, teacher name and SCH- subject codes. [Safe screenshot](evidence/school-labels-cleaned.jpg).

This was a direct maintenance operation, outside request-attributed Activity Log coverage. It did not impersonate an administrator or rewrite earlier history. The private maintenance journal records the changed labels.

## Repeating safely

[Local-only guarded script](../../backend/scripts/polish-local-school-labels.mjs) previews by default; --apply requires a private backup directory, MySQL vendor tools and successful restoration verification. It refuses nonlocal targets and unexpected partial student fixture sets. Existing fixture scripts remain historical/synthetic; this script can polish their unchanged labels after a fresh setup.

No Railway database or deployment was changed.
