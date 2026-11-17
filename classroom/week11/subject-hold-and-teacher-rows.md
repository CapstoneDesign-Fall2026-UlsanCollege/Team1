# Subject hold-to-drag and compact teacher rows

November 17 — Galan Bishal with coding assistance. Follow-up to [#106](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/106).

## Behavior

- Tap a library subject to choose its teacher; tap an assigned subject or lesson to open its scheduling form.
- On touch screens, hold the subject/lesson for 350 ms, then move it to its destination. The arrow buttons are removed from the subject planner. Mouse dragging still starts after movement.
- Moving before the hold completes cancels the gesture. Releasing, cancelling, changing class/term or leaving the component clears the timer and scrolling. A completed drag suppresses the following tap so it cannot reopen the original form.
- Subject-name surfaces reserve touch movement for dragging and disable text selection/callouts. Scroll from the surrounding space. Edge scrolling remains available during dragging.
- In the class Teachers tab, Subject, Teacher and Staff code stay together in one table row. Narrow screens can scroll the table sideways. Other directory layouts are unchanged.

## Definition of Done and verification

- [x] Remove separate arrow controls from library, class subjects and scheduled lessons.
- [x] Implement hold activation, cancellation, click suppression and existing edge-scrolling integration.
- [x] Keep subject-teacher details in a single row.
- [x] Production TypeScript/Vite build and 25 frontend regressions pass.
- [x] Assistant browser check: clicking Schedule Mathematics opens Add lesson with teacher/day/time fields.
- [x] Assistant browser check at 844×390: all three teacher cells are table cells with the same top coordinate (493.59375 px), rather than stacked card fields.
- [ ] Physical iPhone Chrome: quick tap opens the form; holding starts a drag; drop opens the destination form; save/reload persists; cancelling does not save. Repeat with a scheduled lesson and edge scrolling.

Browser checks used only the disposable fictional review fixture. No school records were changed. The physical touch sequence is not claimed as tested by the desktop checks or the existing regression suite.
