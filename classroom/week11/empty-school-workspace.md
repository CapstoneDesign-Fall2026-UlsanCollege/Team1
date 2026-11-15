# Separate empty-school workspace

Created November 16, 2026 for Galan's new-school setup walkthrough.

- Local URL: **http://127.0.0.1:3021/**.
- Separate persistent database: `studenthub_fresh_20261116`.
- Login ID: `admin`. The user-supplied password was hashed in the new database; it is not stored in this document or source code.
- Existing `studenthub` records and Railway school data were not deleted or copied. The setup reads the local template's table definitions only; it copies no people, school records or audit entries.
- No sample rooms are seeded. Administrative migration metadata is retained so restarts do not recreate the five-floor demo layout.

## Verified starting state

SQL counts: one user (admin); zero students, teachers, parent profiles/links, years, classes, floors, rooms, courses and canteen menus. The only user role is administrator, so no canteen-staff accounts exist.

Admin sign-in succeeded (HTTP 200). The school-planning, overview, parent list, teacher-access list and canteen-account list endpoints returned 200. The verification session was logged out. Script syntax and `git diff --check` passed. These checks are assistant-run local setup checks, not independent human or production acceptance.

## Begin setup

1. Sign in at port 3021.
2. Open **Year & class setup** and enter the school profile, academic year, grades/classes and term.
3. Open **Rooms** and create the floors and room numbers you need.
4. Add subject-library entries and teachers; assign subjects/teachers to classes, then build the timetable.
5. Create students in the appropriate classes and configure verified parent links if desired.
6. Create canteen staff and publish a menu.
7. Follow the [daily workflow checklist](daily-workflow.md).

## Restart without losing progress

The laptop has a private `Start-Empty-School.ps1` launcher beside the existing Team1 folder. It selects the new database and reads the existing private database connection configuration, without saving the admin password.

For another environment, build the backend/frontend first, configure the local MySQL connection, set `FRESH_DB_NAME` to the existing `studenthub_fresh_...` database and run `backend/scripts/fresh-school-server.mjs`. Default port is 3021; it binds only to localhost. The server's `stop` command stops serving and preserves all data.

Creation requires `FRESH_CREATE=1` and a privately supplied `FRESH_ADMIN_PASSWORD`; it refuses an existing destination. Never set the create flag for a normal restart. This launcher is local-only and never resets or deletes a database.
