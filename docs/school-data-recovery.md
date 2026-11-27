# School data recovery

Administrator: open **School data** → **School data & recovery**.

## Save a package

Download a recovery package and keep it privately. It contains editable CSV files, a manifest with the school name/export time, and instructions. Included records cover school setup, years, classes, students, teachers, staff links, subjects, timetables, memberships, building floors/rooms, room bookings, canteen information, homework, homework progress, attendance and notices.

Packages are limited to 6 MB compressed, 20 MB expanded and 20,000 records. Larger installations need a private database backup; export refuses to create a package outside those restore limits.

## Recover or import values

1. Choose a previous package, or one whose CSVs you edited. Keep headers, IDs and referenced records. Older StudentHub CSV packages remain supported; files omitted from a package leave their existing records untouched.
2. Review new/updated/unchanged counts and unlisted records retained. Expand before-and-after values to inspect updates. Details show at most 100 changed records; counts cover the full import.
3. Fix any errors shown by file, CSV row and field. Up to 20 field errors are displayed together. Relationship or timetable conflicts also block the import.
4. Download **Before-import copy**. It contains current values, not the values you are about to import. The server verifies the preview still matches current data.
5. Confirm that you saved the copy and reviewed the changes, then apply. This confirmation is required even after the download request succeeds; the application cannot verify where the browser saved the file.

Preview runs inside a rolled-back transaction. It saves no school records. Applying checks that the preview belongs to the signed-in administrator, has not expired, has a recovery download, and still matches the current data. The import commits together or rolls back. Previews expire after 10 minutes and are invalidated by restarting the server or creating a newer preview for that administrator.

## What recovery means

Imports **add and update** and always retain unlisted records. Uploading an older package restores earlier values for matching records and can recreate missing records, but does not delete records created afterward. It is not an exact whole-database rollback.

Existing passwords and account access stay unchanged. Newly imported accounts are disabled with an unknown random password until an administrator provisions access. Administrator and parent accounts, verified parent-child access links, credentials, sessions, QR references, password requests, audit history and job favourites are excluded. These require the system’s normal account procedures or a private complete database backup.

School notices are attributed to the importing administrator. Record-author accounts excluded or unavailable in a package fall back to the importing administrator; existing local administrator author references are retained. Student marks and content remain the imported values.

## Definition of done / validation

- [x] Homework, progress, attendance and notices are included with their references.
- [x] Add/update preview shows retained records and before/after field values.
- [x] CSV field errors report file, row and field, with a maximum of 20 errors.
- [x] A matching before-import package download and explicit review confirmation are required to apply.
- [x] Permissions, stale preview rejection, transactional rollback and credential exclusions are retained.
- [x] Isolated MySQL tests restore an accidental homework edit and a missing progress record, retain a newer floor, and preserve account password/access values.
- [x] Isolated MySQL tests also verify admin-authored attendance and membership history after academic year rollover can round-trip.
- [x] Assistant browser checks with fictional local data cover preview, before/after details, disabled confirmation before download, and successful reviewed import.

No production school recovery was executed during testing. A complete server/database disaster restore remains outside this application-level package feature.
