# #72 booking check — assistant-run, November 10, 2026

**Requester:** Galan Bishal (@bishal482)
**Executor:** Coding assistant
**Exact tested commit:** [87b2991](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/87b2991)
**Environment:** Windows / PowerShell / Node.js v24.19.0; isolated local MySQL fixture
**Status:** Automated checks passed. Bal Raju’s independent human test remains pending.

## Expected and observed

Fictional class ID 2, offering ID 2, teacher ID 2, special room 207; Sunday November 15, 2026, Nepal school time. These IDs belong only to the disposable fixture.

| Check | Expected | Actual |
|---|---|---|
| Same-day booking, 14:00–15:00 | HTTP 201; one added row; separate GET matches date, IDs and times | Passed; SQL count increased by one; all saved fields matched |
| Overlap, same room, 14:30–15:30 | HTTP 409; no added row or changed original booking | Passed; SQL count, original GET record and planning revision unchanged |
| Adjacent slot, 15:00–16:00 | HTTP 201 when all other constraints are satisfied | Passed; count increased by one more and separate GET returned the adjacent slot |

**First failure:** None in this run. The log’s “Fixture membership failure” message is deliberate error injection in a separate rollback test; that assertion passed.

## Direct proof and source

- [Captured school output — 20 passed, 0 failed, 0 skipped](evidence/room-booking-assistant-tests-2026-11-10.txt).
- [Test implementation](../../backend/tests/school-planning.test.mjs): named subtest “#72 same-day save survives read-back, overlap leaves no row, adjacent slot succeeds”.
- [Booking validation and overlap query](../../backend/src/school-rooms.ts).
- [Planning transaction / revision wrapper](../../backend/src/school-planning.ts).
- [Separate pending human record](raju-room-booking-test.md).
- [Bal Raju proposed receipt / attribution limits](individual-evidence-receipt-bal-raju.md).

Also ran frontend/tests/room-availability.test.mjs: **3 passed, 0 failed, 0 skipped**. This covers recorded teacher conflicts and advisory availability, not independent human testing.

## Repeatability and data boundaries

From PowerShell at the repository root, first build the backend. Set RUN_SCHOOL_DB_TESTS=1 and run the school test with private database credentials, as described in [the handoff](code-ownership-galan.md#5-how-a-backup-can-repeat-the-check). The suite creates a random studenthub_school_test_* schema and drops that schema in cleanup; it does not seed or alter the working studenthub database. No credentials or cookies are in the linked output.

The new subtest adds explicit SQL row-count and GET persistence assertions for the same-day path. It changes test coverage, not application behavior. This run exercised HTTP API and database behavior, not browser drag/drop. No live deployment or Bal Raju-performed test is claimed.

## Remaining human action

A teammate who did not implement #72 must independently repeat the valid/conflict path, record the exact version and proof, and explain why adjacent times are not overlapping. Keep that criterion incomplete until their actual result is attached.
