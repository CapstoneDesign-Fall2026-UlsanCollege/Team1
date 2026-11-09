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

## School identity update - Mahendra School

Owner requested Mahendra School consistently across code, documents and the local database. Replaced the previous institution text in the student form default, authentication fixtures and four text documents. Set the configured school name and all 36 matching student school labels to Mahendra School (37 database updates).

Full vendor backup was restore-verified, including table-row and trigger counts, before one transactional update. Credentials, IDs, memberships, lessons and historical audit records were preserved. Scanned every database text/JSON column afterward: zero previous-name values remained. Repository text search returned no previous-name matches. Frontend build and four focused authentication/profile checks passed; browser confirmed Mahendra School on Home. [Current proof](evidence/mahendra-school-home.jpg).

GitHub organization/repository URLs retain their actual addresses. Private backups, Git history and historical image evidence are not rewritten. The local label tool now supports --rename-school; SCHOOL_PREVIOUS_NAME supplies an optional legacy alias without hard-coding it into source.
