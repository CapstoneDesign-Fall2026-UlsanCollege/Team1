# Week 10 — Galan: Own a Slice, Steward an Area

**Student:** Galan Bishal (@bishal482)<br>
**Team:** Team 1 — StudentHub<br>
**Recorded:** November 5, 2026<br>
**Slice:** [#72 — Special-room booking](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72)<br>
**Implementation:** [43a82ae](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae)

This applies the [course worked example](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/week-10/code-ownership-worked-example.md) to our real files and recorded results. It is a focused proof target within the larger room board, not a claim that every feature or acceptance item is complete.

## 1. One small behaviour I own

> An administrator submits a valid single-date special-room booking and receives its saved ID. If the proposed room, class or supervising teacher already has a recorded conflict, reject the request without creating that booking.

**Slice owner:** Galan Bishal, with coding assistance.<br>
**Area steward:** Galan maintains the school room-booking API's file map, request contract and checks. Stewardship means helping others navigate and change it, not exclusive permission to edit it.<br>
**Backup / learning partner:** Unconfirmed. Galan coordinates a volunteer; no teammate has been recorded as accepting this handoff.<br>
**Independent verifier:** Unconfirmed. Assistant-run checks below do not count as another student's test.

## 2. Real codebase area map

| Area | Actual repository boundary | Stewardship check | Backup / handoff |
|---|---|---|---|
| Booking form | [SchoolRoomBoard.vue](../../frontend/src/components/SchoolRoomBoard.vue) | One date, ordered times, subject/teacher selection, confirmation and visible save error | Form contributor explains how submit sends IDs, times and revision; backup unconfirmed |
| Advisory teacher availability | [room-availability.ts](../../frontend/src/room-availability.ts), [tests](../../frontend/tests/room-availability.test.mjs) | Other-class lessons and active room bookings block overlapping teacher choices | Backup runs frontend checks; client availability never replaces server validation |
| Room API — my stewarded area | [school-rooms.ts](../../backend/src/school-rooms.ts) | Validate input, linked class/subject/term, active teacher and recorded conflicts before INSERT | Galan keeps this contract/check map current; any teammate may propose changes |
| Transaction handoff | [school-planning.ts](../../backend/src/school-planning.ts), function mutate | Lock planning revision, reject stale writes, commit or roll back the callback | Persistence reviewer unconfirmed; inspect both callback and transaction wrapper |
| Data / read-back | [school-schema.ts](../../backend/src/school-schema.ts), [migration 010](../../database/migrations/010_room_board.sql) | Booking foreign keys, retained cancellation and GET room-booking read-back | No actual dump/credentials in shared evidence; backup uses disposable fixture |
| Reproducible integration check | [school-planning.test.mjs](../../backend/tests/school-planning.test.mjs), room-layout/booking subtest | Success, conflict, same-day validation, adjacent boundary, stale concurrent writes and permissions | [Recorded 17-pass run](evidence/school-mysql-2026-11-05.txt); non-author rerun pending |

## 3. Explain the code in plain English

The form's submit function sends POST /api/admin/school/room-bookings with room_id, class_id, offering_id, teacher_id, starts_on, ends_on, day_of_week, start_time, end_time, repeats_weekly and revision. The current UI sends the same date twice and repeats_weekly=false.

1. The authenticated administrator route checks IDs, real dates, weekday and ordered same-day times. Invalid input receives HTTP 400.
2. The room route calls change, which is supplied by school-planning.ts's mutate helper. That helper opens a database transaction and locks school_planning_lock. A stale revision receives HTTP 409.
3. Inside that transaction, the room route checks that the class is active, the room is special, the subject belongs to that class/year, the date fits its term and the teacher is active.
4. It looks for overlapping active room/class/teacher bookings, then checks the teacher's lessons in other classes. bookingDatesMeet checks real weekday/date overlap. Adjacent lessons ending exactly when the booking starts do not overlap.
5. A conflict throws before the INSERT. The wrapper rolls back and the API reports HTTP 409. A successful INSERT returns an ID; after the transaction commits, the API returns HTTP 201 and the ID. The form reloads saved records.

The save helper is a cross-area dependency. Reading only the UI or only the SQL INSERT cannot establish the whole flow. Also, a teacher already teaching the selected class can supervise that same class; their other-class meetings still block them.

## 4. Expected versus actually recorded results

These are observations from the assistant-run isolated MySQL test, not invented manual or teammate outcomes. The fixture's initial room-107 booking repeats weekly to retain backend recurrence coverage; the competing once request has a single date. The current UI creates only same-day bookings.

| Case / fixture input | Expected result | Actual result and proof |
|---|---|---|
| Valid linked class/subject/teacher, room 107, Sunday 10–11 in valid term | HTTP 201 and saved ID; booking is available on read-back | Passed; test stores the ID and later reads the saved record. [Test source](../../backend/tests/school-planning.test.mjs), [output](evidence/school-mysql-2026-11-05.txt) |
| Competing class in room 107, November 8, 10:30–11:30 | HTTP 409 room conflict | Passed in the same room-booking subtest |
| Change room but keep a teacher/class already booked at that time | HTTP 409 | Passed for class and teacher conflict cases |
| Single-date competing booking in a different room with a different class/teacher | HTTP 201 | Passed |
| Room 107, November 8, 11–12 after the first booking ends | HTTP 201: adjacent times are permitted | Passed |
| repeats_weekly=false but different start/end dates | HTTP 400 | Passed |
| Teacher teaches another class Tuesday 11–12; propose November 3, 11–12 | HTTP 409 | Passed |
| Two requests carrying the same revision compete concurrently | Exactly one HTTP 201 and one HTTP 409 | Passed; test asserts sorted statuses [201,409] |
| Student/canteen/anonymous calls | HTTP 403 for wrong role; HTTP 401 without a session | Passed |

The overall school suite passed 17 checks on November 5. The raw output reports a combined room subtest, not one output line per assertion. The SQL/code path establishes rollback intent; this note does not claim an independent row-count audit for every rejected request. Add that explicit assertion if needed for stronger persistence evidence.

## 5. How a backup can repeat the check

**Prerequisites:** Node/npm and dependencies matching this repository, running local MySQL, and a private backend/.env with DB_HOST, DB_PORT, DB_USER and DB_PASSWORD. The account needs permission to create/drop a disposable schema. Never run the demo-seeding scripts for this test. Never paste a password into an issue.

**Terminal:** PowerShell, from the Team1 repository root (the folder containing backend and frontend):

```powershell
npm --prefix backend run build
$env:RUN_SCHOOL_DB_TESTS='1'
node --env-file=backend/.env --test backend/tests/school-planning.test.mjs
Remove-Item Env:RUN_SCHOOL_DB_TESTS
node --test frontend/tests/room-availability.test.mjs
```

The school test creates a random studenthub_school_test_* schema, uses fictional users and deletes that fixture schema in cleanup. It does not use the application DB_NAME for its fixture. Expected current result: 17 school checks pass without skips; 3 focused frontend availability tests pass. A setup error is a failed handoff until its cause is recorded, not a pass.

The backup should then explain why HTTP 409 can come from either a stale revision or a recorded booking/teacher conflict, and trace a successful insert into the GET read-back. Record their actual name/login, date, tested commit, command output, first failure (if any), and explanation in #72. Do not fill that record until it happens.

## 6. AI use and human decisions

Galan supplied and revised the product requirements: drag/drop with confirmation, same-date booking rather than month ranges, subject-based time/teacher fill, available-teacher filter, specialist demo routines and tiffin timing. The coding assistant drafted/edited the implementation, SQL scripts, tests and documentation and ran the linked automated checks. Galan reviewed visible behaviour through the chat and reported problems that drove changes. This is not evidence that Galan personally executed every command, that a teammate independently verified it, or that AI permission has been granted by this example; follow the course's applicable AI rules.

## 7. Gaps, owners and decisions

| Gap / decision | Owner | Next action / review point |
|---|---|---|
| No confirmed backup or independent result | Galan coordinates; verifier unconfirmed | Ask one available teammate to accept this focused handoff and reproduce it before closing #72 |
| Latest compact teacher/form layouts lack current browser/mobile proof | Galan | Capture safe current screenshots and record expected/actual before the final demo; older Week 9 proof remains historical |
| Tiffin is demo/planner guidance, not a server-enforced global policy | Galan | Decide whether to prohibit room bookings/custom lessons during 1–2 PM before claiming that policy |
| Availability omits unmapped/unrecorded duties | Galan | Keep the limitation visible; do not advertise confirmed personal availability |
| Live release pending | Galan | Revisit Railway on the planned November 10 date, then verify the published commit and read-back |

Track these in [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72). Current status: source and assistant-run automated evidence published; backup acceptance, cross-area human review, latest visual test and live verification pending. More code or a larger feature does not substitute for these checks.
