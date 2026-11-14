# Administration spacing audit

**Owner:** Galan Bishal · **Date:** November 14, 2026 · **Issue:** [#95](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/95)

## What changed

The administration layout now has a shared stylesheet for ordinary forms: 44px controls, 1px borders, 8px corner radii, 12px grid gaps and 6px label-to-field spacing. Grid labels no longer inherit the large login-form margins. Top-level cards use 24px desktop padding and 14px phone padding; dialogs use 24px/16px. Grouped buttons have explicit gaps and no inherited form-button margins.

Teacher access separates status from actions by 12px, with 8px between confirmation buttons. Student password/show controls align. Popup Close buttons cannot shrink into broken words. Copy-routine day choices no longer gain extra mobile label margins. Year/class setup stacks fields on very narrow phones, fixing an observed 51px overflow at 320px.

These rules are scoped to administration. Timetable cells, drag behavior, room colors and other roles retain their component styles. Future admin forms should use the shared `fields`, `filters`, `form-grid`, `heading-actions` or `popup-actions` classes instead of adding independent margins.

## Actual checks

Assistant-run browser checks against the local school database; no records, passwords or access permissions were changed.

| Check | Actual result |
|---|---|
| Overview, School classes, Year & class setup, Rooms, School data, Activity Log, Requests, Accounts and all five account tabs at 320, 390, 768 and 1280px | 52 page/width observations; no positive document horizontal overflow after the narrow setup fix |
| Ordinary text/date/select field dimensions and borders | Every measured field was 44px high with a 1px border |
| Teacher creation popup at desktop/phone widths | Opened and closed; phone Close button remains beside the heading |
| Copy routine popup at 390px | Close remains one line/44px high; day-label margins and action-button margins are zero; cancelled without copying |
| Teacher access confirmation | Opened Disable then Cancel; status stayed Enabled; confirmation buttons 44px high, margins zero, action gap 8px |
| Class Students, Teachers and Subjects & timetable at 390px | No document horizontal overflow; measured ordinary fields 44px high |
| `npm.cmd --prefix frontend run build` | Passed after final CSS changes |
| `npm.cmd --prefix frontend test` | 21 passed, zero failures |

The document-width check permits intended scrolling inside the timetable, teacher tables and building canvas. It does not prove every possible data length or device layout. Browser emulation is not an independent human or physical-phone test. Backend tests were not rerun for this CSS-only change.

## Evidence

- [Page/width measurements (no field values)](evidence/admin-spacing-measurements.json)
- [Teacher access form on a phone](evidence/admin-spacing-access-mobile.png)
- [Teacher status and action spacing on a phone](evidence/admin-spacing-access-row-mobile.png)
- [Copy-routine popup on a phone](evidence/admin-spacing-routine-mobile.png)
- [Earlier desktop teacher-access row](evidence/teacher-access-row-spacing.png)

Hosted release verification is recorded in [#95](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/95) after deployment; these screenshots and measurements are local checks.
