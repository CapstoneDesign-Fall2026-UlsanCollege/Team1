# R1 — Manage classrooms and link class meetings to rooms

**Status:** Planned  
**Owner:** Assign before implementation  
**Related planning:** [#51](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51)  
**Dependency:** Existing timetable and class meetings.

## User path

An administrator adds a classroom with a stable identifier, building, and room name, then assigns that room to an existing class meeting.

## Scope

- Add an administrator-only classroom directory and room selector for class meetings.
- Persist rooms and meeting-to-room links using an additive database migration.
- Preserve existing free-text class locations during migration; flag unmapped meetings for review.
- Prevent duplicate room identifiers and unsafe deletion of rooms with linked meetings.
- Identify buildings with unresolved mappings so later availability results can warn about incomplete coverage.

## Definition of Done

- [ ] Administrator can create, edit, list, and deactivate rooms; records survive reload.
- [ ] Meetings can reference a stable room ID while existing student timetable locations remain readable.
- [ ] Existing meetings and location text remain intact; unmapped locations are visible for review.
- [ ] Duplicate identifiers and deletion of linked rooms are rejected.
- [ ] Student and anonymous inventory writes are rejected server-side.
- [ ] Migration, room validation, and meeting-link tests pass; link the commit and screenshots below.

## Evidence

Add links after implementation. No completion or passed-test claim yet.

## Out of scope

Housing, room booking, automatic location matching, and live occupancy.
