# Canteen menu shortcuts — November 6, 2026

**Owner:** Galan Bishal (@bishal482), with coding assistance.<br>
**Related:** [C3 #56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56); existing [canteen workspace](canteen-owner-check.md).

## Requested and implemented

- Menu day dropdown selects that weekday in the current Sunday-start week; the service date stays visible and can select a different week/date.
- New Menu opens a date form and starts an unsaved empty draft. Existing dates are refused; no menu is deleted or overwritten. The server's normal version check still protects concurrent saves.
- Item-name dropdown suggestions come from saved NPR menus, latest updated records first. An exact case-insensitive/trimmed name match fills the saved price; the price remains editable. Type a new name and set a new price when no suggestion matches. Saving refreshes the suggestion list.
- Nepalese rupee label is now **रू**. Old KRW menus keep their denomination and numeric prices; the won glyph is removed from this page, not converted into a false rupee price.
- GET /api/canteen/menu/items is canteen-head-only. Suggestions deduplicate names across up to 90 recently updated NPR menus, returning at most 200 names. Old won menu prices do not leak into rupee suggestions. This is reuse of saved meals, not a separate inventory/stock catalog.

## Actual checks

| Check | Actual | Evidence |
|---|---|---|
| Full backend with both isolated database suites enabled | 63 passed, 0 failed, 0 skipped | [Raw result](evidence/canteen-shortcuts-backend-2026-11-06.txt) |
| Frontend test suite | 12 passed, 0 failed | [Raw result](evidence/canteen-shortcuts-frontend-2026-11-06.txt) |
| Production frontend build and backend compilation | Passed | Observed terminal output; no independent/cold-install claim |

New API checks cover latest saved price, new saved names, NPR-only suggestions, and rejected admin/student/anonymous access. Two new frontend checks cover Sunday-start weekday selection across month/year boundaries and exact-match price lookup including zero-price items and unknown names.

## Browser observations

Coding assistant signed in to the real local preview as the fictional canteen head. Selected Thursday and loaded the existing November 5 draft. Attempted New Menu on that existing date: a clear error appeared. Started November 6 instead, entered the saved Demo vegetable momo name, and observed price 80 automatically. Added a genuinely new name, Demo fresh fruit, with manual price 35, saved the draft, switched Thursday then Friday and observed both saved values. Availability remained Not confirmed; yesterday's stock was not copied. The examples remain unpublished drafts.

- [Desktop proof](evidence/canteen-menu-tools-desktop-2026-11-06.jpg)
- [390 px phone proof](evidence/canteen-menu-tools-mobile-2026-11-06.jpg)

At 390 px viewport, document client/content widths were both 375 px: no horizontal page overflow. Temporary viewport override was reset. The browser-native name suggestion list and its prices were present in the input's datalist; exact-name autofill was verified through visible form values. The screenshot shows saved values, not an open native suggestion popup.

These are assistant-run automated/browser checks, not independent teammate evidence or a Railway deployment. No database schema change was needed. New menus/items remain saved through the existing dated, versioned MySQL menu API. Existing menus were retained.
