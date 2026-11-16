# Quick floor/room creation and school-name settings — #103

November 16, 2026 · Galan Bishal, with assistant implementation/testing support.

## New administrator flow

- Create the school name in **Year & class setup**. The same dashboard now offers **Edit school name & level** for an existing school, with Save/Cancel controls.
- In **Rooms**, choose **Add floor**. Enter the floor/name, room count and first number; preview the generated numbers, then create the floor and rooms together. Ground floor is 0. Default room type is usual classroom.
- Use **Add rooms** for an existing floor. The starting number is suggested after its existing numeric room numbers. Counts range from 1 to 50 per save. No comma-separated typing is required.
- Tap a room card to open its number/name/purpose/type popup, even with no academic year selected. A room number can be changed to include letters after creation. Tap the floor label to rename the floor.
- Use the separate **Assign / bookings** button, or drag a class onto a room, for academic allocation/reservations. Those operations still require an academic year and existing classes.

Creating a floor and its rooms uses one revision-protected database transaction. Duplicate room numbers, stale revisions, invalid values or an already-existing destination floor reject the operation. A failed room insert rolls back the new floor and all partial room inserts. Existing floors/rooms, assignments and bookings are preserved.

## Actual checks

- Backend TypeScript and frontend production builds passed.
- [Backend regression results](evidence/quick-room-creation-backend-tests.txt): **95 passed**, zero failed/skipped. Added explicit checks for successful floor+rooms save, existing-layout preservation, partial-insert rollback, duplicate floor/numbers, invalid labels/floors, stale revisions and non-admin rejection.
- [Frontend regression results](evidence/quick-room-creation-frontend-tests.txt): **22 passed**, zero failed/skipped.
- Assistant browser used a separate local fictional school database. School naming appeared under Year & class setup, and saved school-name editing worked there.
- Browser created Floor 1 with rooms 101–103 in one save. Tapping 101 opened its edit dialog without an academic year. Saving the name Physics lab and special-room type survived a page refresh. [Naming popup screenshot](evidence/room-name-popup-mobile.jpg).
- Add rooms suggested 104 next; entering 101 showed duplicate-number feedback and disabled Save. Adding 104–105 retained the original rooms. Floor-label renaming worked.
- [Mobile popup screenshot](evidence/quick-floor-popup-mobile.jpg): at a simulated 390px viewport, the dialog's client and scroll widths both measured 339px, with usable input widths and no horizontal dialog overflow.

These are assistant-run local checks, not independent human, physical-phone or full hosted acceptance. The existing booking/assignment backend regression checks passed; the pointer-drag gesture was not newly repeated in the browser for this change. No user school records or Railway data were edited by the fictional browser tests.
