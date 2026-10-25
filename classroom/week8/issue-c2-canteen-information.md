# C2 — Show campus canteen hours and location

**Status:** Planned  
**Owner:** Assign before implementation  
**Dependency:** [C1](issue-c1-daily-canteen-menu.md).

## User path

An administrator updates the canteen's name, campus location, weekday opening hours, and closure notice. A student sees this information beside the daily menu.

## Scope

- Persist the single campus canteen's information in MySQL.
- Support closed weekdays and a dated closure notice.
- Show the latest update time and distinguish missing information from confirmed closure.
- Confirm real hours and location before publishing them as official information.

## Definition of Done

- [ ] Administrator edits survive reload and appear to students.
- [ ] Each weekday can have a valid opening/closing range or be marked closed.
- [ ] A dated closure notice appears only on its applicable campus date.
- [ ] Missing hours show an explicit unknown state rather than an invented open/closed claim.
- [ ] Student writes are rejected server-side; tests cover validation and weekday/date selection.
- [ ] Link the commit, test result, and readable mobile screenshot below.

## Evidence

Add links after implementation. No completion or passed-test claim yet.

## Out of scope

External restaurant discovery, route planning, live occupancy, and automatic holiday feeds.
