# Ansh Sharma — iPhone special-room booking test

**Date:** 2026-11-17
**Tester:** Ansh Sharma
**Device:** iPhone 16 Pro, iOS 27.0.1, Safari
**Environment:** Deployed StudentHub at `team1-production.up.railway.app`; existing administrator session.
**Issue:** [#72 — School room board and same-day special-room bookings](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72)

## Purpose

Independently test the published special-room booking workflow on a physical iPhone:

1. Save one valid same-day booking and confirm it survives a page refresh.
2. Attempt another booking for the same special room and overlapping time, then confirm that it is rejected.

## Expected results

- A valid booking for an available special room saves and remains visible after Safari refresh.
- A second booking that uses the same room, date, and time is rejected. It must not replace or create another reservation.

## Test data used

- Class: Grade 6 · Class A
- Special room: 108 · Chemistry lab
- Subject: Art and Music
- Initial supervising teacher: Indira Lama
- Booking date: 2026-11-17
- Time: 15:00–16:00 Nepal time (NPT)

## Detailed test record

| Step | What Ansh did | Actual result | Evidence |
| --- | --- | --- | --- |
| 1. Prepare a valid booking | Selected Grade 6 · Class A, then Room 108 · Chemistry lab. The booking form populated Art and Music, Indira Lama, 2026-11-17, and 15:00–16:00. | The special-room form was available and ready to save. | [01-valid-booking-form.jpg](evidence/ansh-room-booking-iphone-test/01-valid-booking-form.jpg) |
| 2. Save and refresh | Saved the Room 108 booking, refreshed Safari, reopened Room 108, and reviewed its bookings. | **Passed:** the booking remained visible: Grade 6 · Class A · Art and Music, 2026-11-17, 15:00–16:00, Indira Lama. | [02-valid-booking-after-refresh.jpg](evidence/ansh-room-booking-iphone-test/02-valid-booking-after-refresh.jpg) |
| 3. Prepare an overlapping request | Selected the same class, Room 108, date, and 15:00–16:00 time again. The original teacher was marked unavailable because of the saved booking, so an available replacement teacher, Manoj Karki, was selected. | The form allowed the conflict request to be submitted for server-side checking. | [03-overlap-form.jpg](evidence/ansh-room-booking-iphone-test/03-overlap-form.jpg) |
| 4. Submit overlap | Submitted the second Room 108 request with the same date and time. | **Passed:** the app rejected it with: “Booking conflicts with Chemistry lab (108), Grade 6 Class A. Choose another time.” No second booking was saved. | [04-overlap-rejected.jpg](evidence/ansh-room-booking-iphone-test/04-overlap-rejected.jpg) |

## Result

**Passed.** On a physical iPhone, the deployed application saved a valid special-room booking, retained it after refresh, and rejected a second overlapping request for the same room and time.

## Scope and limits

- This is one independent manual iPhone/Safari walkthrough of the published site.
- It verifies the save/read-back and overlap-rejection path only; it does not replace automated tests, other roles' permission checks, or broader deployment verification.
- The valid Room 108 booking was intentionally left in place as the evidence needed for the overlap check. No cancellation or deletion was performed.