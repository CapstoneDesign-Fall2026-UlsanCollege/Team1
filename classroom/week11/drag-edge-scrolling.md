# Compact timetable controls and drag edge scrolling

**Owner:** Galan Bishal, with coding assistance

**Date:** November 14, 2026

**Issue:** [#93 — Definition of Done](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/93)

## Behaviour

Copy routine now uses a lighter, compact button aligned with Include Saturday: 34 px high with 12 px text on desktop; phone controls retain a 44 px minimum touch target.

While dragging a subject with a mouse, hold the cursor near the bottom of the screen to scroll down toward the timetable, or near the top to scroll up. Scrolling continues while the cursor stays at the edge, with speed increasing closer to it. The timetable also scrolls at its own top/bottom and left/right edges. Page scrolling takes vertical priority until the page reaches its limit.

Scrolling stops on release, pointer cancellation, Escape, lost pointer capture, focus loss, changing class/term, saving or unmount. The existing tap/select and Add lesson alternatives remain available. Touch dragging is unchanged; normal phone scrolling and tap controls are retained.

## Verification

- Frontend production build/type check passed. [All 21 frontend tests passed](evidence/drag-scroll-tests-2026-11-14.txt).
- [New scrolling tests](../../frontend/tests/drag-scroll.test.mjs) cover neutral/outside pointers, edge acceleration, a stationary cursor across successive frames, cancellation, single-loop restart, page priority, nested vertical scrolling and horizontal scrolling.
- Assistant browser check used a disposable fictional database at a 1000×600 viewport. A real mouse drag towards the bottom moved page scroll position from 616 to 670.5. After release, it remained 670.5 and the drag ghost disappeared.
- The desktop Copy routine button measured 34 px high with 12 px text and 6×11 px padding. At 390 px viewport width, it retained a 44 px touch target.
- [Compact toolbar](evidence/compact-copy-toolbar.png), [short-screen drag check](evidence/drag-scroll-short-screen.png).

No timetable records were saved by the drag check. Unit tests verify sustained stationary-cursor scrolling; the browser driver verified an actual drag and release, rather than a long physical hold. No independent human/physical-phone test is claimed. Hosted verification is recorded separately in the issue.

## Hosted verification

[CI passed for 9c54504](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/43496016062). The deployed frontend contains the edge-scrolling code and guidance. On the hosted timetable, Copy routine measured 34 px high with 12 px text at a 1000×600 viewport; its dialog was opened and cancelled without saving. [Live compact toolbar](evidence/compact-copy-toolbar-live.png). Actual drag movement was checked in the disposable local fixture, not against production data.
