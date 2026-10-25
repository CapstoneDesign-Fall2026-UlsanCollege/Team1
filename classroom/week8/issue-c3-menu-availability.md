# C3 — Mark canteen menu items available or sold out

**Status:** Planned  
**Owner:** Assign before implementation  
**Dependency:** [C1](issue-c1-daily-canteen-menu.md).

## User path

An administrator marks a published menu item sold out. A student refreshes Campus Eat and sees the same item labelled Sold out. The administrator can restore availability.

## Scope

- Store availability separately for each dated menu item.
- Keep sold-out names and prices visible with a clear status.
- Provide a student Refresh action and an update timestamp.
- Require an explicit status for a new day's menu; do not silently reuse yesterday's availability.

## Definition of Done

- [ ] Administrator can switch an item between available and sold out without changing another date's menu.
- [ ] Status survives reload and appears in the student view after refresh.
- [ ] Sold-out items retain their names and prices and use a text label as well as colour.
- [ ] Students cannot change availability through the API.
- [ ] Tests cover status changes, date isolation, permission checks, and refresh failure/retry.
- [ ] Link the commit, expected/actual result, and before/after screenshots below.

## Evidence

Add links after implementation. No completion or passed-test claim yet.

## Out of scope

Automatic stock tracking, live push updates, reservations, ordering, and payments.
