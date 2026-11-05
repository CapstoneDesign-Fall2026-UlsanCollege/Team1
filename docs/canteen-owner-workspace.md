# School canteen-head workspace

**Updated:** November 5, 2026 · **Owner:** Galan Bishal, with coding assistance.<br>
Extends [C1 #54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54), [C2 #55](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/55), [C3 #56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56).

## Use the workspace

Sign in with a canteen-head account created by an administrator. This is a separate workspace; academic administrators cannot edit canteen content. Directory teacher/student logins do not grant these permissions.

### Daily menu

1. Choose the Nepal service date. Add up to 40 items with names and whole-number prices. New dates use Nepalese rupees (NPR, shown as Rs.).
2. Set each item to Available, Sold out or Not confirmed. Sold-out names/prices remain visible. New items start as Not confirmed rather than copying yesterday's stock.
3. Save as a draft or check Publish and save. Students see only today's published menu, after refresh. Availability edits are saved with the menu, not silently applied on selection.
4. Refresh/reload to confirm saved values. Stale versions receive a conflict; review/reload before retrying. Refresh/date changes ask before discarding changed fields. Switching workspace tabs preserves the mounted draft; leaving/reloading the application can lose unsaved work.

Existing won-priced dates retain KRW labels and amounts. No currency conversion or relabelling is performed. Existing service-date values stay unchanged; the current-day choice now uses Asia/Kathmandu.

### Hours & location

1. Enter the school canteen's name and school-facing location.
2. Set each weekday to known hours, Closed or Unknown. Known hours must start before closing on the same day. The Sun–Fri 10–16 shortcut fills a draft only; confirm real school hours before publishing.
3. Optionally enter a notice and one applicable date. Mark Closed on this date only when it is a closure. A future/past notice is not returned to students for today.
4. Save the details as a draft or publish them. Menu publication and information publication are independent. Missing information is explicitly unconfirmed, not an invented closure.

## Storage and request contract

- Existing canteen_menus: service_date, JSON item IDs/names/prices/statuses, published, version and update time; additive currency metadata preserves old KRW records. New menu inserts explicitly choose NPR.
- New single-installation canteen_info: name, location, JSON seven-day hours, dated notice/closure, published, version and update time.
- [Migration 011](../database/migrations/011_canteen_information_currency.sql); normal server startup ensures the information table and missing currency column. Existing menu records/accounts are not reseeded on normal startup.
- GET/PUT /api/canteen/info: canteen-head only, version checked in a transaction.
- GET/PUT /api/canteen/menu (date query / dated write): canteen-head only; stable item IDs and version protect edits.
- GET /api/student/canteen and /api/student/canteen/info: signed-in student only; published information only.

Writes validate roles, strings, dates, hours, status, price and saved version on the server. Stale saves return 409 and preserve the saved version. The client retains a failed save's form for review. No ordering, payments, automatic stock count or external restaurants were added.

## Run and check

Use the existing local configuration and Node dependencies; keep credentials and backups outside Git. Normal combined server startup and the persistent local-school launcher ensure the new additive schema. Existing MySQL base tables and a canteen-head account are prerequisites. No real school name/location/hours were supplied; fictional local examples are left unpublished.

PowerShell from repository root, with a private backend/.env configured for local MySQL and permission to create/drop disposable test schemas:

```powershell
npm --prefix backend run build
$env:RUN_MENU_DB_TESTS='1'
node --env-file=backend/.env --test backend/tests/canteen-menu.test.mjs
Remove-Item Env:RUN_MENU_DB_TESTS
```

The fixture uses a random studenthub_menu_test_* schema and removes it after testing. It does not seed or overwrite the configured application database. See [actual checks and safe browser proof](../classroom/week10/canteen-owner-check.md). Independent non-author review and live deployment remain pending.
