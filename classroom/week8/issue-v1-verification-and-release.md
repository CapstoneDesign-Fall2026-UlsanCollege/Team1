# V1 — Independently verify and release the new workflows

**Status:** Planned  
**Owner:** Assign a release coordinator before starting  
**Dependencies:** [C1](issue-c1-daily-canteen-menu.md), [C2](issue-c2-canteen-information.md), [C3](issue-c3-menu-availability.md), [R1](issue-r1-classroom-inventory.md), [R2](issue-r2-available-room-search.md), [R3](issue-r3-room-conflict-prevention.md).

## User paths to verify

1. Administrator publishes today's canteen menu and information; student views them; administrator marks an item sold out; student refreshes and sees the change.
2. Administrator searches for a classroom, schedules a valid meeting, and repeats the search; the room no longer appears available for that overlapping time. A conflicting meeting is rejected.

## Definition of Done

- [ ] A teammate who did not implement each behaviour follows written steps without coaching.
- [ ] Record tester, date, expected result, actual result, first failing step if any, and safe screenshot or recording links.
- [ ] Check desktop and mobile layouts, empty states, API errors/recovery, role restrictions, and reload persistence.
- [ ] Run the relevant backend/frontend tests and production build; link the actual output.
- [ ] Verify additive migrations preserve existing academic data and record the recovery plan before deployment.
- [ ] Verify the deployed Railway version and repeat both paths with approved test records.
- [ ] Update the shared weekly report, setup/design documentation, and each slice's actual status with evidence.
- [ ] Keep failed or untested criteria incomplete; record follow-up bugs with an owner and next action.

## Evidence

Add implementation commits, test records, deployment link, and shared report after the checks happen. No passed-test or deployment claim yet.

## Scope boundary

This issue verifies the new workflows. It does not turn proposed features or assigned supporting roles into completed contribution claims.
