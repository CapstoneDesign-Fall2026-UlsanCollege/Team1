# Week 8 — Campus Eat and Room Finder slices

**Team:** Team 1 — StudentHub  
**Planning date:** October 25, 2026  
**Status:** Planned; implementation has not started.

These are Markdown issue plans stored in the Week 8 folder. They are not separate GitHub Issues. This is the next-phase backlog, not a promise to finish every slice in Week 8.

## Implementation order

| Slice | User-visible outcome | Depends on |
|---|---|---|
| [C1 — Daily canteen menu](issue-c1-daily-canteen-menu.md) | Administrator publishes a dated menu; students see today's menu and prices. | Existing login and roles |
| [C2 — Canteen hours and location](issue-c2-canteen-information.md) | Administrator updates canteen information; students see it with the menu. | C1 |
| [C3 — Item availability](issue-c3-menu-availability.md) | Administrator marks an item sold out; students see its current status. | C1 |
| [R1 — Classroom inventory](issue-r1-classroom-inventory.md) | Administrator manages rooms and links existing class meetings to them. | Existing timetable |
| [R2 — Available-room search](issue-r2-available-room-search.md) | Administrator finds rooms without recorded class conflicts for a selected time. | R1 |
| [R3 — Prevent room conflicts](issue-r3-room-conflict-prevention.md) | Administrator cannot schedule overlapping classes in the same room across majors. | R1, R2 |
| [V1 — Verification and release](issue-v1-verification-and-release.md) | A non-author repeats both workflows; the team links evidence and verifies deployment. | C1–C3, R1–R3 |

Start with C1. Complete and check each slice before moving to the next. Each slice requires its own tests and evidence; V1 adds the combined independent check.

## Agreed scope

- Campus Eat covers the **campus canteen only**, using administrator-entered information. No external restaurant catalogue, ordering, delivery, or payments.
- Room Finder serves **administrators finding available classrooms**. No housing, room reservations, automatic allocation, or live occupancy detection.
- Use clearly labelled fictional records until the team confirms real canteen information and classroom records.
- Implementation ownership and independent testers must be confirmed before starting; these plans do not claim contributions for any member.

## Existing planning

- [#11 — Original Campus Eat investigation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/11). The canteen-only scope above replaces its broader food-directory proposal.
- [#51 — Administrator classroom availability](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51).
- [#40 — Existing timetable](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/40).
