# #72 room-booking test record — prepared for Bal Raju

**Issue:** [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72)  
**Updated:** November 10, 2026  
**Actual executor of the results below:** Coding assistant, at Galan Bishal’s request  
**Proposed independent tester:** Bal Raju (@CoderRaaju), confirmation and execution pending  
**Current result:** Automated valid/conflict/adjacent checks passed. Independent human walkthrough and live verification remain incomplete.

## Executed check — actual results

This table records the fresh check that actually ran. It is not a Bal Raju-performed test.

| Field | Actual result |
|---|---|
| Exact commit / source status | [87b2991](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/87b2991): test assertions were committed before execution; linked output was generated during the run. |
| Date / environment / fixture | November 10, 2026; Windows, PowerShell, Node.js v24.19.0; disposable local MySQL schema created and cleaned up by the school test suite. |
| Executor / non-author confirmation | Coding assistant. This is not independent human confirmation by Bal Raju. |
| Class / room / subject / teacher | Fictional class ID 2 (Grade 2, Class B), special room 207, offering ID 2, teacher ID 2 (PLANNER-02). IDs refer only to the disposable fixture. |
| Booking date and time | Sunday November 15, 2026, 14:00–15:00; same start/end date; repeats_weekly=false. |
| Valid save and read-back | **Passed:** HTTP 201; SQL row count increased by one; a separate GET returned matching class, room, offering, teacher, date/time and active/non-recurring fields. |
| Overlap rejection / saved-row count | **Passed:** same-room request 14:30–15:30 returned HTTP 409; SQL count, original GET record and planning revision stayed unchanged. |
| Adjacent boundary | **Passed:** 15:00–16:00 returned HTTP 201; separate GET returned the adjacent booking and SQL count increased by one more. |
| First failing step / error | None in this executed check. The separate “Fixture membership failure” log message is deliberate rollback-test error injection; that test passed. |
| Direct safe proof | [Raw school test output](evidence/room-booking-assistant-tests-2026-11-10.txt), [detailed check note](room-booking-assistant-check-2026-11-10.md), [test source](../../backend/tests/school-planning.test.mjs). |
| Total check results | **20 school checks passed, 0 failed, 0 skipped.** Separately, all **3 frontend availability checks passed**. |
| Overlap explanation | The server looks for an existing start earlier than the proposed end AND an existing end later than the proposed start, with matching applicable dates/resources. Equal end/start boundaries are adjacent. [school-rooms.ts](../../backend/src/school-rooms.ts). This explanation is AI-prepared, not an observed answer from Bal Raju. |
| Working-data impact | No working studenthub records changed; fictional records stayed in the disposable schema. No browser or hosted test is claimed for this run. |

## Proof links

- [Bal Raju individual evidence receipt — draft awaiting his confirmation](individual-evidence-receipt-bal-raju.md)
- [#72 exact source, expected/actual cases and data boundaries](room-booking-assistant-check-2026-11-10.md)
- [#72 raw test output](evidence/room-booking-assistant-tests-2026-11-10.txt)
- [Test-assertion commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/87b2991)
- [Galan’s repeatable setup/check commands](code-ownership-galan.md#5-how-a-backup-can-repeat-the-check)

The C0 account screenshots are separate evidence, not proof of room booking:
[November 10 C0 check](c0-fresh-assistant-check-2026-11-10.md) · [workspace](evidence/c0-assistant-workspace-2026-11-10.jpg) · [disabled account](evidence/c0-assistant-disabled-2026-11-10.jpg).

## Remaining independent check — Bal Raju or another non-author teammate

- [ ] Personally run the valid booking and overlapping-conflict path against a recorded commit.
- [ ] Record tester identity, date, environment and actual first failure (if any).
- [ ] Link safe proof captured during that human run.
- [ ] Explain the overlap rule and have a teammate record the actual question/answer.
- [ ] Keep hosted verification separate under #65.

**Next action / review point:** proposed tester Bal Raju confirms and runs this by November 11, end of day. If unavailable, Galan coordinates another non-author teammate. Until then, the issue’s independent-review criterion remains unchecked.

## Expected behavior for that walkthrough

A valid same-day special-room booking saves and appears after refresh. An overlapping booking is rejected without another saved row. An adjacent slot may succeed if teacher/class/term checks also allow it. Use a documented fictional fixture; if clean setup fails, record the exact blocker under [#77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77).

## Repeatable manual path

1. Record commit, clean/dirty status, test date, browser and local fixture. Sign in as a fictional administrator.
2. Open Rooms and select an active class, special room, linked subject and available supervising teacher. Choose a date inside the subject’s term and a free same-day slot. Record the chosen IDs/date/times without credentials.
3. Save. Expected: success, one saved booking and matching data after refresh. Capture safe proof.
4. Reload current data/revision. Try a second booking overlapping the same special room. Where possible, use another eligible class and free teacher so the room conflict is the reason for rejection.
5. Expected: conflict rejection and no second saved booking after refresh. Record the exact message and first failing step if different.
6. Optional: try a conflict-free booking beginning exactly at the first booking’s end. Expected: adjacency alone does not cause overlap. This does not waive teacher/class/term constraints.
7. Record actual results, proof links and the version; update #72 only to the extent supported by the result.


**AI disclosure:** AI executed the automated check and prepared this record. The prior requester identity was corrected to Galan; neither the connected GitHub account nor these automated results establish a test performed by Bal Raju.
