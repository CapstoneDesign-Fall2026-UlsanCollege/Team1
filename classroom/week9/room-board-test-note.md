# Room allocation board — local test note

**Date:** 2026-11-03
**Project:** Team 1 / StudentHub
**Tester:** coding assistant, fictional local records; not an independent teammate test.

## Approved scope

The school administration manages a five-floor building with eight rooms per floor. Rooms 107/108, 207/208, 307/308, 407/408 and 507/508 are special rooms. The other 30 are usual classrooms. Default special-room names are examples and can be edited; repeated schema initialization preserves edits.

- Drag a class card onto a regular room, or select the class and click a room. Confirm its usual classroom for that academic year. One class has one usual room; one usual room has one class per year. Moving a class releases its old room atomically. Another academic year can reuse the same room.
- Drop onto a special room to open the subject, supervising teacher, dates, day and start/end-time form. Choose one-time or weekly booking. Times are Nepal local time; dates use Gregorian ISO format.
- A linked class subject/term and active teacher are required. Bookings must fit the academic year and subject term. Overlapping room, class or teacher bookings are rejected; a teacher’s recorded lessons for another class are also checked. Adjacent periods are allowed. Cancellation retains the booking record.
- This room board reserves space separately from the academic subject timetable. It does not automatically move a lesson or rewrite existing free-text timetable locations. It does not infer occupancy, school holidays or a capacity limit.
- Teacher changes or later edits to the academic timetable require a review of existing room bookings; this slice validates reservations when created, not every later academic edit.

## Repeatable browser check and actual results

1. Open the local review preview and sign in as its fictional admin. Open Rooms. Expected: 40 room cards, 07/08 special on every floor. Actual: correct five-by-eight board and two fictional classes.
2. Drag a class onto a regular classroom. Expected: confirmation form before writing. Actual: Grade 2 Class B → Room 302 form; saving showed the assignment on both room and class cards.
3. Select Grade 2 Class A and click Physics lab 107 (the click/tap alternative to dropping). Expected: subject/day/time booking form. Actual: Mathematics, Teacher Kim, Sunday, 10–11, weekly dates populated from the linked term.
4. Save the weekly booking. Expected: record persists and the room count increases. Actual: success and one active booking for Physics lab.
5. Submit the same booking again. Expected: no duplicate, clear conflict. Actual: rejected with the conflicting room and class; saved booking remained unchanged.
6. Check a 390 px phone viewport. Expected: the page fits, the building scrolls inside its own container and the form fits the screen. Actual: page width 375 px; modal width 337 px within the 390 px viewport.

## Evidence

- [Building chart](evidence/room-board-desktop.png)
- [Special-room form](evidence/room-booking-form.png)
- [Rejected duplicate booking](evidence/room-booking-conflict.png)
- [Phone booking form](evidence/room-booking-mobile.png)
- [Focused MySQL run](evidence/s1-mysql-2026-11-03.txt): 17 passed. Includes layout/idempotence, yearly assignments, moves, recurrence date intersections, one-time/weekly conflicts, boundaries, teacher lesson conflicts, stale concurrent saves, cancellation and role restrictions.
- [Standard backend run](evidence/backend-2026-11-03.txt): 38 passed, 2 opt-in suites skipped. The school database suite was run separately above.
- Existing frontend checks: 7 passed. Backend and frontend production builds passed.

## Delivery boundary

Implemented in the isolated local school-foundation checkout. Review helper data is disposable and separate from the real application database. Migration 010 and startup initialization add the room tables and fixed layout without rewriting academic rows. No Railway deployment, production migration or independent human-test claim. Historical cancelled Issues #57–59 describe the old general finder/meeting-room mapping scope and are not marked complete by this feature.
