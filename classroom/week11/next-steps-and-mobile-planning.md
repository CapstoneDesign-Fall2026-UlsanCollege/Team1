# Next-step guide and mobile planning — #105

November 17, 2026 · Galan Bishal, with assistant implementation/testing support.

## Next-step guide

**Overview → Your next step** checks saved records and highlights the first unfinished task, with a direct button to its existing screen. **See all setup steps** expands the full checklist; later tasks remain available.

The 12 initial tasks cover school name, academic year, term, classes, rooms/classroom assignments, grade subject libraries, teachers, class subject/teacher assignments, initial timetables, teacher login access, student enrollment and canteen staff. Parent setup remains optional. After the basic setup wizard finishes, **See my next step** returns to this guide.

The administrator-only `/api/admin/school/next-steps` endpoint returns counts, year label and school date without personal/contact/credential values. It uses the current academic year, falling back to the latest configured year, matching the planning workspace. Inactive classes/accounts are excluded from relevant checks. Zero classes cannot incorrectly complete later class tasks. Every active class must have a usual room, grade library, initial assigned subject/lesson and active student before its corresponding task is recorded.

The guide reloads on return to Overview; **Refresh overview** checks changes from other devices. An unavailable guide shows a retry message rather than a completed state. These checks establish initial records, not full curriculum coverage, a complete timetable or final acceptance.

## iPhone planning changes

Galan reported iPhone Chrome could not drag subjects into classes/timetables or assign rooms. The previous pointer-drag handlers explicitly accepted mouse input only.

- Library subjects, class subjects, scheduled lessons and class-to-room cards now have **↕ drag handles** on phone/coarse-pointer layouts. Those handles accept touch pointer input and use `touch-action: none`; the ordinary card surfaces retain normal scrolling/tapping.
- Edge scrolling now supports the timetable, building board and subject/class lists. Pointer cancellation, lost capture and window blur stop relevant drag state/scrolling.
- Subject/library names still open the assignment/day-time forms directly, so dragging is optional.
- Room assignment has a tap-only path: **tap a class → Destination room → Review assignment / booking → confirm**. The full board remains available, and tapping a room itself still edits its name.
- Planner/room dialogs use dynamic viewport height to better fit changing phone browser controls.

## Actual results

- Backend TypeScript and frontend production builds passed; `git diff --check` passed.
- [Backend results](evidence/next-steps-mobile-backend-tests.txt): **96 passed**, zero failed/skipped. The new endpoint check covers admin/guest/other-role boundaries, current-year counts, inactive-class exclusion, missing-record counts and no-store responses without personal fields.
- [Frontend results](evidence/next-steps-mobile-frontend-tests.txt): **25 passed**, zero failed/skipped. Guide tests cover empty data, each next-task transition, removal of required records, valid navigation and optional parent scope; existing drag-scroll regressions pass.
- Assistant browser used an isolated fictional database at a simulated **390×844** viewport. The guide showed two classes needing classrooms; its button opened Rooms. Tapping Class A, choosing room 101 and confirming saved the room. Returning to Overview updated the count from two to one.
- Added English to the grade library, tapped it to select Bikash Example, confirmed the class subject, tapped English to open the lesson form, and saved Sunday 12:00–13:00. After refreshing, English, its saved lesson and Room 101 remained.
- Measured the subject popup at 339px client width and 339px scroll width, with no horizontal dialog overflow. Handles computed to `touch-action: none`; the page had no horizontal overflow at the simulated width.

Safe fictional screenshots: [guide](evidence/next-step-guide-mobile.jpg), [tap-only room assignment](evidence/mobile-room-tap-assignment.jpg), [subject popup](evidence/mobile-subject-tap-popup.jpg).

## Remaining acceptance

**This is not a physical-iPhone pass.** Simulated-width clicks verified the tap-only paths and save/reload. A real touch-drag gesture in iPhone Chrome has not been independently verified. Galan should refresh the deployed site and repeat both tap and handle-drag paths on the phone. Keep the earlier [Ansh persistence failure](ansh-iphone-subject-persistence.md) and #83 acceptance open until an actual iPhone retest is recorded. No user school records or Railway data were modified by these fictional tests.
