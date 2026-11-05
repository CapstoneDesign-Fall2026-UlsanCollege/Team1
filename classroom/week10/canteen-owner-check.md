# Canteen owner workspace — local implementation check

**Date:** November 5, 2026 · **Owner:** Galan Bishal (@bishal482), with coding assistance.<br>
**Issues:** [C2 #55](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/55), [C3 #56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56). [User/setup guide](../../docs/canteen-owner-workspace.md).

## Delivered

Separate canteen-head workspace with Daily Menu and Hours & Location sections; saved dated menus, stable item IDs, price/status editor and counts, draft/publish control, seven-day unknown/open/closed hours, canteen name/location and one-date closure notice. Student view shows published details and today's menu with Available/Sold out/Not confirmed text. Dates/update times use Nepal time; new menu prices use NPR; old won records are retained as KRW without conversion. Migration 011 and normal/persistent local startup ensure the new schema. Teacher/student/academic data is unaffected.

## Actual checks

| Check | Expected | Actual | Proof |
|---|---|---|---|
| Focused canteen API/MySQL suite | Permissions, validation, saved read-back, date isolation, stale writes, closure dates and legacy currency work | 12 passed, 0 failed, 0 skipped | [Output](evidence/canteen-db-2026-11-05.txt) |
| Full backend suite with menu and school database suites enabled | No regression across school/accounts/canteen/jobs | 62 passed, 0 failed, 0 skipped | [Output](evidence/canteen-full-regression-2026-11-05.txt) |
| Frontend production build | Type checking and bundle succeed | Passed | [Output](evidence/canteen-build-2026-11-05.txt) |
| Existing frontend tests | Existing schedule/search/availability checks still pass | 10 passed; output observed in terminal, not separately captured for this change | Tests in frontend/tests; not a new UI test suite |

Meaningful canteen cases: administrator/student editing denied; unpublished profile/menu hidden; status change preserves name/price and another date; stale menu/profile edits reject; invalid hours or missing notice date reject; closure notice disappears on a different date; saved records survive fixture server restart; old menu price stays 5000 KRW after adding currency metadata.

All automated results were run by the coding assistant on Galan's behalf using installed dependencies. Fixtures create/drop random isolated schemas. This is not an independent teammate run or a cold install.

## Browser check — fictional records only

The assistant used the real local app at 127.0.0.1:3020, signed in as demo_canteen, and saved three labelled demo items and draft canteen information. Menu items demonstrated all three availability states. Published both temporarily, switched to a fictional student and opened Campus Eat: expected the demo location/hours and Rs. 80 Available / Rs. 120 Sold out / Rs. 20 Not confirmed. Actual visible labels matched. Returned to the canteen-head session and saved both back as unpublished drafts. No real school details or credentials are in screenshots.

- [Menu desktop, 1280 px](evidence/canteen-head-menu-desktop.jpg)
- [Details desktop](evidence/canteen-head-details-desktop.jpg)
- [Menu mobile, 390 px](evidence/canteen-head-menu-mobile.jpg)
- [Details mobile, 390 px](evidence/canteen-head-details-mobile.jpg)
- [Published student view during the check](evidence/canteen-student-mobile.jpg)

At 390 px, page content width was 375 px and document width 375 px for menu and details; the hours table scrolls within its container. Student screenshot shows the internal scrolling view with fixed bottom navigation; it is not a screenshot of every menu item at once. Temporary viewport override was reset afterward. Canteen head remained signed in for local review. The local examples are not official school hours/prices and are now drafts.

## Data safety / remaining checks

A private verified backup was taken before applying the new local schema. No backup or .env is committed. Schema is additive; original student/teacher/class data is unchanged. Normal startup creates no sample menu/profile. Local draft examples were deliberately created during the browser check.

The owner still needs to confirm actual canteen details and prices before publishing. A real non-author repeat, keyboard/error/retry exploration beyond the recorded paths, and Railway deployment are pending. The role canteen_head is the canteen owner/operator workspace; this change does not create an additional owner role or grant administrators content-edit rights. No inventory, orders, online payment or delivery workflow is claimed.
