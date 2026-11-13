# Configurable building and CSV school-data transfer

**Owner:** Galan Bishal (@bishal482), with coding assistance  
**Date:** November 13, 2026  
**Issues:** [Building configuration #86](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/86), [CSV transfer #87](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/87)

## How to use the building controls

1. Log in as an administrator and open **Rooms**.
2. Expand **Manage floors and room numbers**.
3. Enter a floor number and label, then **Save floor**. Ground floor is `0`; supported numbers are `0–99`.
4. Choose that floor, enter room numbers separated by commas, choose usual classroom or special room, and select **Add rooms**. Add up to 50 rooms per submission.
5. Select **Edit room** to change a room's number, purpose, floor or type. A room with assignment/booking history must keep its type.

Room numbers may contain letters or leading zeroes and must be unique. Internal IDs do not change when display numbers change; existing class assignments and bookings stay linked. The original building remains in place during the additive migration. A restart no longer recreates the original 40 rooms on every run. These controls do not delete rooms or their history.

## Export and import

1. Open **School data → Download CSV package**.
2. Extract the ZIP. Edit the UTF-8 CSVs; keep their column headers and the manifest.
3. ZIP the files themselves, rather than a containing folder.
4. Upload that ZIP under **Choose ZIP package**.
5. Review the counts for new, updated and unchanged records. Nothing is saved by this preview.
6. Select **Import reviewed changes** to save the validated package together in one transaction.

Unlisted records are retained. A preview lasts 10 minutes and belongs to the administrator who uploaded it. If school data changes before apply, preview again. A restart also discards pending previews. Cancelling a preview saves nothing.

### What is included

| Area | CSV records |
|---|---|
| School setup | Profile, academic years, terms, classes |
| People | Teacher directory, non-administrator login identities, student profiles, teacher login links, class memberships |
| Academics | Subject catalogue, grade subject library, class subject links, teacher assignments, lessons, student term/enrolment links |
| Building | Floors, room numbers/types/purposes, usual classroom assignments, special-room booking records |
| Canteen | Canteen details/hours/notices and daily menus/items/prices/statuses |

The package deliberately excludes administrator accounts, passwords/hashes, sessions, reset requests, audit history, homework/attendance and job favourites. It is **not a complete database backup**. Keep a private database backup for full recovery. Exports contain personal student information and should not be attached to public GitHub issues.

### Matching and references

- A package from the same installation uses stable source IDs where available, allowing profile/name/room-number updates.
- A package from another installation matches natural keys such as login ID, staff code, subject code, academic-year name, year/grade/class, or room number. References are remapped to the matched/new records.
- Keep parent records referenced by edited rows in the package. For example, a student profile needs its `users.csv` row; a class membership also needs its year and class rows. IDs are references, not room display numbers.
- New records require unique positive source IDs in their CSV. Use new IDs that do not duplicate another row in the package.
- Existing account passwords and enabled/disabled state stay unchanged. Existing login IDs and roles must be changed through Accounts, rather than through CSV.
- New imported accounts are disabled and receive an unknown random password. Set a password through the account controls and enable access before giving a student or staff member their login.
- Dates use `YYYY-MM-DD`; times use `HH:MM` or `HH:MM:SS`; flags use `0`/`1`. `\N` means null; an empty cell means empty text. Leading backslashes are escaped with another backslash on export. Menu items and opening hours use JSON within a quoted CSV cell.
- Formula-like text is escaped for spreadsheet safety. If opening CSVs in Excel, import identifiers, room numbers and phone numbers as **Text** so Excel does not strip leading zeroes.
- Limits: 6 MB ZIP / 20 MB expanded / 20,000 total records; at most 500 new login accounts per import. Duplicate/unsupported archive paths and invalid relationships are rejected. Class, teacher and room conflicts are checked before apply.

## Actual local verification

Assistant-run tests used randomly named disposable MySQL schemas, not the working or hosted database.

- [Backend log: 83 tests passed, no skips](evidence/school-transfer-backend-2026-11-13.txt).
- [Frontend log: 17 tests passed](evidence/school-transfer-frontend-2026-11-13.txt).
- Backend TypeScript and frontend production builds passed.
- [Database integration tests](../../backend/tests/school-planning.test.mjs) cover floor creation, duplicate batch rollback, stable room links, persistence, stale revisions, permissions, export round-trip, preview rollback, apply, replay/stale rejection, invalid relationships, cross-installation student ID remapping and disabled imported logins.
- [CSV/archive tests](../../backend/tests/school-transfer.test.mjs) cover Unicode, quotes/newlines, leading-zero text, null/backslash escaping, formula-like values, malformed CSV, unsafe ZIP paths and expanded-size limits.
- Local browser: created a sixth floor and three rooms; renamed `601` to `N-601`; exported a ZIP; previewed and applied a floor-only package; verified its new floor on the board. At 390 px, created another floor and room using the visible controls. The mobile page had no horizontal page overflow; the room board has its own horizontal scroll area.

### Safe screenshots — fictional fixture only

- [Desktop room controls](evidence/configurable-rooms-desktop.png)
- [CSV preview](evidence/school-transfer-preview-desktop.png)
- [Mobile room controls](evidence/configurable-rooms-mobile.png)
- [Mobile school-data screen](evidence/school-transfer-mobile.png)

These are assistant-run checks. No independent teammate pass or live import into production is claimed here. Hosted availability is recorded separately after deployment verification.
