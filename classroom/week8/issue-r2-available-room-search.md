# R2 — Find classrooms without recorded class conflicts

**Status:** Planned  
**Owner:** Assign before implementation  
**Related planning:** [#51](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51)  
**Dependency:** [R1](issue-r1-classroom-inventory.md).

## User path

An administrator selects a semester, a date, and start/end times. Room Finder shows active classrooms without overlapping recorded classes and lets the administrator open room details.

## Scope

- Use the selected date to determine the weekday in Asia/Seoul.
- Restrict dates to the semester and require start time before end time on the same day.
- Check all majors sharing the room, not only the currently selected major.
- Treat adjacent meetings as non-overlapping: a class ending at 10:00 does not block a search starting at 10:00.
- Label results as availability according to recorded schedules. Warn when room mappings are incomplete; do not claim confirmed availability from incomplete records.
- Show room building/name, matching time range, loading, no-results, and retry states.

## Definition of Done

- [ ] Administrator can search and open room details; students and anonymous users cannot access this administrator feature.
- [ ] Any recorded overlap across majors excludes the room from available results.
- [ ] Inactive rooms are excluded and incomplete mappings produce an explicit warning or unknown status.
- [ ] Tests cover overlaps, contained time ranges, exact boundaries, dates outside the semester, invalid times, and access control.
- [ ] Link implementation, test results, and a safe search screenshot below.

## Evidence

Add links after implementation. No completion or passed-test claim yet.

## Out of scope

Room booking, allocation, occupancy sensing, overnight searches, and claims about unrecorded events or holidays.
