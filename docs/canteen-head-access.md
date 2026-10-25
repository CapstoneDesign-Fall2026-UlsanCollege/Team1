# Canteen-head accounts — C0

Related issue: [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61).

## What this slice provides

- A distinct `canteen_head` account role using the existing login and session cookie.
- A separate canteen-head workspace, restored after reload, with logout.
- Administrator **Accounts → Canteen staff** controls to create, disable, or enable accounts. Disabling requires confirmation and revokes sessions.
- Canteen staff never appear in the student directory and cannot read student profiles, academic administration, jobs or favourites.

Menus, prices, opening hours and sold-out controls come in #54–#56. The current workspace says those controls are coming next. Administrators manage account access only; future `/api/canteen/*` content routes already reject administrator and student accounts.

## Provisioning

An administrator chooses a unique login ID and an initial password of at least 12 characters and at most 72 UTF-8 bytes. Passwords use bcrypt with cost 12. API responses and account lists never return passwords or hashes. Share credentials privately. No public signup or arbitrary role assignment is available.

Do not create real accounts just to collect screenshots. Use approved test records and keep credentials out of evidence. Canteen-head password recovery is manual administrator support; the existing public reset request remains student-only.

## Routes and permissions

| Route | Allowed role | Behaviour |
|---|---|---|
| `GET /api/canteen/home` | Canteen head | Verify workspace access |
| `GET /api/admin/canteen-accounts` | Administrator | List staff login IDs and active status |
| `POST /api/admin/canteen-accounts` | Administrator | Create a fixed-role canteen-head account with `login_id` and `password` |
| `PUT /api/admin/canteen-accounts/:id/status` | Administrator | Set boolean `is_active` for a canteen-head account only |

Backend workspace boundaries apply before individual routers. A canteen head cannot grant roles or disable other users. Enabling an account does not restore revoked sessions. Sessions expire after eight hours; all sessions are memory-based and a backend restart signs everyone out.

## Migration and deployment

`database/migrations/006_canteen_head_role.sql` appends the new enum value without changing the positions of `admin` or `student`. Startup checks the current enum and runs this alteration only if needed; unexpected schemas stop startup for review rather than deleting unknown roles.

The database account needs ALTER permission. No account is created by the migration. A schema change may briefly require a metadata lock; deploy during a quiet period. Inspect startup logs if the service cannot start.

Recovery: retain the expanded enum when rolling back application code. Do not remove its value while canteen-head records exist. Existing academic records, passwords and account status are not migrated or rewritten.

## Checks

- `backend/tests/canteen-accounts.test.mjs`: role boundaries, provisioning validation, hashed credentials, duplicate login IDs, session restore/logout/expiry, disable/enable revocation, fixed-role MySQL statements and schema checks.
- Existing backend suite and frontend tests/build still apply.
- Local database verification used a connection-scoped temporary `users` table, checked repeatable migration and staff persistence, and preserved sample administrator/student rows. It did not modify the real users table.
- Browser checks used an isolated in-memory server and fictional accounts, not Railway accounts. See [C0 test note](../classroom/week8/c0-test-note.md).
