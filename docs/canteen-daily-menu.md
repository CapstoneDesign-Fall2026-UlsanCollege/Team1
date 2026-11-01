# C1 — Daily campus canteen menu

Implementation for [#54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54), building on [C0 #61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61).

## Behaviour

- The canteen head chooses a date and saves 1–40 item names and whole-won prices.
- Drafts stay hidden. Publishing shows a menu only on its service date in Asia/Seoul.
- Unpublishing hides it immediately on the student's next refresh.
- Students have a Campus Eat tile. Academic administrators cannot read or edit the staff menu endpoint, and students cannot write menus.
- Changes persist in MySQL. Concurrent/stale edits return a conflict instead of silently overwriting another version.
- The page shows loading, retry, empty states and last-updated Korea time. A failed date load clears old items and prevents saving them under another date.

No ordering, payment, delivery, external restaurants, hours/location editing or availability controls are included in C1. Those latter canteen controls remain C2/C3. Existing availability fields are retained when editing item names/prices.

## Database and running locally

The normal backend startup applies the additive [migration 007](../database/migrations/007_canteen_menus.sql) with `CREATE TABLE IF NOT EXISTS`. It does not restore missing base tables or seed user accounts. Existing C0 accounts and a working local MySQL connection are prerequisites.

From PowerShell at the Team1 repository root:

```powershell
npm run dev --prefix backend
```

In a second PowerShell window at the same root:

```powershell
npm run dev --prefix frontend
```

Keep real `.env` values and database backups private. Do not change production DB settings to run checks.

## Repeatable manual check

Use fictional approved accounts and food information. Do not publish real credentials in evidence.

1. Sign in as a canteen head. Choose today's Korea date, add `Demo rice bowl` at ₩5000 and save with Publish unchecked.
2. Sign in as a student in a separate browser profile. Open Campus Eat: expect no published menu.
3. Publish the menu from the canteen-head session. Refresh the student page: expect the same item, ₩5000, today's date and an update timestamp.
4. Edit the name and price, save, and reload both pages: expect the updated values.
5. Unpublish, refresh the student page: expect the no-menu message.
6. Choose a different date: expect its own menu or an empty editor. Yesterday's menu must not appear as today's.
7. In two canteen-head windows, load the same version. Save in the first, then save the second: expect a conflict and an explicit reload action.

Record tester, date, commit, actual result, first failure and safe proof before calling this an independent test. This procedure alone is not a passed manual test.

## Assistant verification — 2026-11-01

The focused MySQL test uses a random `studenthub_menu_test_*` database, creates only the menu table, and deletes that disposable database afterward. Accounts are fictional in memory. It never connects to the configured application's `DB_NAME` or modifies its tables.

```powershell
npm test --prefix backend
$env:RUN_MENU_DB_TESTS = '1'
node --test backend/tests/canteen-menu.test.mjs
Remove-Item Env:RUN_MENU_DB_TESTS
npm run build --prefix frontend
```

Release snapshot checks (excluding unfinished teacher/room drafts): backend 35 passed / 1 opt-in database test skipped in the standard run; focused C1 MySQL run 8 passed, none skipped; frontend production build passed. Dependencies were reused from the installed local packages, so this is not a clean-install claim. The [focused test output](evidence/c1-mysql-2026-11-01.txt) records role boundaries, draft/publish/edit/unpublish, persistence through server restart, campus date rollover, invalid-write rollback and simultaneous/stale writes. These are assistant-run checks, not an independent teammate test.

Live deployment, a non-author test and browser screenshots are still pending. Railway purchase is deferred by the owner until November 10; no hosting purchase or live restoration is claimed.
