# Railway school-data migration — November 12, 2026

**Owner:** Galan Bishal, with coding assistance. Galan explicitly chose the current laptop school data for Railway.

## What changed

The deployed code was current, but the app used an older Railway database: 12 student profiles, one school class and no teacher records. Code deployment does not copy local database rows.

Created full private backups of local `studenthub` and Railway `railway`, including table definitions, records, triggers, routines and events. The local backup was restored and checked in an isolated temporary database first. Backup files and credentials were kept outside the repository; no data dump, password or session cookie was published.

Restored the approved laptop snapshot into a separate schema on the existing Railway MySQL service: `studenthub_release_20261112`. Removed source-specific SQL trigger definers for portability. All **31 table row counts and SHA-256 row checksums matched** the restored local snapshot; **81 triggers** were preserved. This comparison includes account identities and password hashes. Existing Railway `railway` data remained intact, including its 13 user accounts.

Changed only Team1's `DB_NAME` from `${{MySQL.MYSQLDATABASE}}` (resolved as `railway`) to `studenthub_release_20261112`, then deployed the staged change. Database host, port, user and password were unchanged. Deployment `21bdb754-026d-4528-b208-d2431088a4ff` became Active / Deployment successful.

## Verified live results

Signed into the public app using an existing local administrator account. No password was reset. Read-only authenticated API checks returned:

| Data | Live result |
|---|---:|
| School | Mahendra School |
| Student profiles | 36 |
| Teacher records | 20 |
| School classes | 10 |
| Subject catalog | 22 |
| Class subject offerings | 106 |
| Timetable entries, including retained legacy entries | 304 |
| Rooms | 40 |
| Special-room bookings | 8 |

The browser's live school overview independently displayed 36 active students, 10 classes and 4 students needing a class, matching the local snapshot. The same admin session was denied the teacher-only endpoint with HTTP 403. A private screenshot and the full verification manifests are retained with the private backups; they are not public student-data evidence.

These are assistant-run migration and read-back checks, not independent teammate acceptance. No new account, homework, attendance or booking was created merely for live proof. Broader canteen/role-write/room-conflict and non-author release checks remain separate in #65/#60.

## Operation and recovery

- Log into the live site using the same account details as the approved laptop snapshot. Existing sessions may require signing in again after deployment.
- The live app uses `studenthub_release_20261112`. Railway's database browser may still default to the old `railway` schema because the database service's own default variable was intentionally left unchanged.
- Local and live databases are separate copies. Future local edits do not automatically sync to Railway when code is pushed.
- To roll back, first back up any post-switch live writes, then restore Team1's previous `DB_NAME` reference and deploy. The original database was not dropped or overwritten.
- Temporary connection credential files were removed after verification. Private SQL backups/manifests remain under Galan's private backup directory, outside GitHub.
