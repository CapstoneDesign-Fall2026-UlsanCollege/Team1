# C1 — Publish and view the daily campus canteen menu

**Status:** Planned  
**Owner:** Assign before implementation  
**Related planning:** [#11](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/11)  
**Dependency:** Existing student/admin login and MySQL.

## User path

An administrator opens Campus Eat, chooses a service date, and saves menu items with names and prices. A student opens Campus Eat and sees today's published menu.

## Scope

- Add Campus Eat navigation for administrators and students.
- Store dated menu items and prices in Korean won in MySQL.
- Let administrators create, edit, publish, and unpublish a daily menu. Keep drafts hidden from students.
- Use the campus date in Asia/Seoul. A previous day's menu must not appear as today's menu.
- Show loading, retry, and no-menu-published states.
- Keep this limited to the campus canteen, with manual administrator input.

## Definition of Done

- [ ] An administrator can publish a dated menu and edit its item names and prices; changes survive reload.
- [ ] A student sees only the published menu for the current campus date, with prices and an update timestamp.
- [ ] Invalid dates, blank names, and invalid or negative prices are rejected by the backend.
- [ ] Anonymous users cannot access protected data; students cannot change menus through the API.
- [ ] Tests cover create/edit/publish, persistence, permissions, empty states, and campus-date rollover.
- [ ] Link the implementation commit, test result, and safe administrator/student screenshots below.

## Evidence

Add links after implementation. No completion or passed-test claim yet.

## Out of scope

External restaurants, API integration, orders, delivery, payments, and food photography.
