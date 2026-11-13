# Copy routine beside the timetable controls

**Owner:** Galan Bishal, with coding assistance

**Date:** November 14, 2026

**Issue:** [#92 — Definition of Done](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/92)

## How it works

Select **Copy routine**, next to **Include Saturday** above the weekly timetable. Choose the source weekday, review its saved lessons, select destination days, and choose **Copy selected routine**. Sunday to Monday–Friday is the initial choice when Sunday has lessons.

- Copies all source lessons at their saved times within the selected class and term, retaining their subject/teacher assignments.
- Keeps existing destination lessons. Identical copies are skipped; conflicting lessons are never overwritten.
- A conflict on any destination rolls back the whole operation. Errors identify the day.
- Saturday is copied to only when selected. Room bookings are not copied.
- Shared offerings are rejected to avoid silently changing another class's timetable.
- Empty sources, invalid targets, stale revisions and non-administrator requests are rejected.

## Actual checks

- [Full backend test log](evidence/copy-routine-tests-2026-11-14.txt): 85 passed, no skips/failures. Tests cover multi-lesson copying, duplicate skips, Saturday preservation, a Friday class conflict and a Thursday teacher conflict with full rollback, invalid targets, stale revisions, permissions and shared offerings.
- Backend TypeScript and frontend production builds passed; all 17 existing frontend tests passed.
- Assistant browser check used a disposable fictional Grade 5 Class A with two Sunday lessons and empty weekdays. Copying to Monday–Friday produced 12 lesson cards in total. Repeating added zero lessons and skipped ten identical lessons; the total remained 12.
- At 390 px viewport width, the form was 341 px wide and remained within the screen.
- [Copy form](evidence/copy-routine-form.png), [read-back after repeat copy](evidence/copy-routine-result.png), [mobile form](evidence/copy-routine-mobile.png).

No production timetable was copied by these checks. No independent teammate test is claimed. Hosted availability is recorded in the issue after deployment.

## Hosted verification

[CI passed for 7ed974b](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/43493876531). On Railway, Copy routine appeared beside Include Saturday and opened the source/destination form. The form was cancelled without copying production data. [Hosted screenshot](evidence/copy-routine-live.png). An authenticated empty request to the new endpoint returned HTTP 400 before any write. The persistent local preview was restarted with the new backend.
