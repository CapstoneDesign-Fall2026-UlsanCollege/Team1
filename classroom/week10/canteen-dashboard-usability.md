# Canteen dashboard usability — November 6, 2026

**Owner:** Galan Bishal (@bishal482), with coding assistance.<br>
**Related:** [C3 #56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56), [C2 #55](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/55).

Owner reported that the dashboard was inconvenient. This revision changes the owner UI, not the menu API, database schema, student canteen UI or existing saved stock/copy rules.

## Changed

- Smaller heading and horizontal Daily menu / Hours & location tabs instead of the space-consuming sidebar.
- One-click weekday strip with exact date labels, Today, previous/next week, date picker and refresh. New menu remains available alongside the compact summary.
- Small publication/item-count line instead of four large statistic cards. Publication badge reflects the saved server state; unsaved edits are labelled separately.
- Quick-add chips for up to six saved rupee foods not already in the form. Click fills name/price with stock unconfirmed and focuses the new item. Typed suggestions, manual new food and editable prices remain supported.
- Compact food rows and small remove controls; Add food at the top and Add another food below.
- Sticky action bar: Copy to days, Save draft, Publish menu. When already published, controls explicitly say Unpublish & save draft / Save changes.
- Tighter settings spacing; settings save control remains reachable. Switching tabs retains mounted forms.

## Actual validation

- Frontend production build passed after the final spacing/control changes.
- Existing frontend suite passed **12 tests** during this UI revision; those helper/search/schedule checks preceded the last spacing adjustment. They are not component or independent human tests. Final browser checks and build cover the later layout version.
- Assistant browser check at desktop and 390 px phone sizes used fictional canteen records. Quick-added milk tea: expected price 20 and focus on the new name field; observed both. Removed the unsaved extra item and preserved the existing menu.
- Thursday/Friday strip switched saved dates correctly. Next week from November 6 selected November 13; previous week returned November 6. Today returned the current Nepal date.
- Added an unsaved quick item, switched to Hours & location and back: entered price 35 remained. Removed that unsaved row afterward.
- Created a fictional future November 16 draft with demo milk tea, saved, published, then immediately unpublished through the new controls. Final menu was a saved unpublished draft. This did not replace the user's existing November 6 menu.
- Copy to days still opened its selection dialog and Cancel made no copies.
- At 390 px viewport, document client/content widths were both **375 px**. Save bar was 81.5 px high and within the viewport. Temporary viewport override reset after checking.

[Compact desktop](evidence/canteen-dashboard-compact-desktop-2026-11-06.jpg) · [Compact phone](evidence/canteen-dashboard-compact-mobile-2026-11-06.jpg).

All checks were performed by the coding assistant on Galan's behalf, not by an independent teammate. The owner still needs to try the layout and supply real canteen information. Existing published-data boundaries, multi-day skip logic and database version protection remain unchanged. No Railway deployment is claimed.
