# Mobile subject assignment and compact fonts

**Date:** November 12, 2026. **Owner:** Galan Bishal with coding assistance. [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83).

User reported subject assignment failing on phones and large mobile fonts. Subject cards now open the teacher form when tapped; class subjects have Add lesson, opening day/time controls without dragging. Custom drag captures only mouse input; cards allow normal vertical touch scrolling, including on hybrid touch laptops. Room cards use the same pointer restriction while retaining select-class/tap-room interaction. Desktop mouse drag remains available.

Mobile admin text is compact (13–14px body/labels, smaller headings); form inputs remain 16px to avoid iPhone focus zoom, with 44px tap targets. No backend/database change.

## Actual verification and limitations

- [Frontend helper checks](evidence/frontend-tests-2026-11-12.txt): 17 passed; these do not mount Vue or prove the new popup interaction.
- [Frontend build](evidence/frontend-build-2026-11-12.txt): passed.
- Earlier 390px inspection reached class planner and saved an English subject to the fictional grade library. That was preparation, not a completed teacher-assignment/save/reload result.
- Final browser verification on November 12 was blocked: browser creation timed out, then inventory returned a browser-service initialization error. No new screenshot or successful full mobile path is claimed.
- Repeat on a physical phone: choose class → library subject → teacher → Confirm subject → reload/read back; Add lesson → choose day/time → save/reload; check conflict case and normal scrolling. Keep #83 open until actual results are recorded.
