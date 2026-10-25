# R3 — Prevent overlapping class meetings in the same room

**Status:** Planned  
**Owner:** Assign before implementation  
**Dependencies:** [R1](issue-r1-classroom-inventory.md), [R2](issue-r2-available-room-search.md).

## User path

An administrator assigns a room while creating or editing a class meeting. If another class already uses that room at an overlapping time, StudentHub explains the conflict and leaves the saved schedule unchanged.

## Scope

- Extend existing scheduling checks with room conflicts across all majors and applicable overlapping semester dates.
- Apply checks to both new meetings and edits, excluding the meeting being edited.
- Use a database transaction and appropriate locking so simultaneous writes cannot both claim the same room/time.
- Preserve existing major/professor constraints and student timetable behaviour.

## Definition of Done

- [ ] Conflicting creates and edits are rejected with a clear message and no partial database changes.
- [ ] Different majors cannot use the same room at an overlapping time.
- [ ] Adjacent time boundaries, non-overlapping semester dates, and valid edits remain allowed.
- [ ] A simultaneous-write test verifies that only one conflicting operation can succeed.
- [ ] Existing timetable and access-control tests still pass.
- [ ] Link the commit, conflict/recovery test results, and safe proof below.

## Evidence

Add links after implementation. No completion or passed-test claim yet.

## Out of scope

Reservations, automatic rescheduling, and silently moving existing classes.
