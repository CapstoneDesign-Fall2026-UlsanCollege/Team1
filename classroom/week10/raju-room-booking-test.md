# Bal Raju — #72 independent booking test record

**Proposed tester:** Bal Raju (@CoderRaaju), personal confirmation pending
**Prepared:** November 10, 2026, by AI at Galan’s request; requester identity clarified after the initial publication
**Issue:** [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72)
**Status:** Prepared only — not executed. This is separate from the C0 local pass.

## Start point

Use a clean checkout of the published version, with the documented local setup and fictional test data. Record the exact commit and environment before testing. Avoid real student records or the live database. If a clean setup cannot run, record the first blocker under [#77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77); do not bypass a fixture guard.

Galan’s [existing handoff and commands](code-ownership-galan.md#5-how-a-backup-can-repeat-the-check) describe prerequisites. Written instructions are preparation; the actual actions and observations must come from the non-author tester. Do not copy assistant-run output into the actual-result cells.

## Expected result before execution

A valid same-day special-room booking saves and appears after reload. A second booking overlapping the same room is rejected and creates no additional booking. A conflict-free adjacent slot is a separate boundary check.

## Repeatable manual path

1. Record commit, clean/dirty status, test date, browser and local fixture. Sign in as a fictional administrator.
2. Open Rooms and select an active class, special room, linked subject and available supervising teacher. Choose a date inside the subject’s term and a free same-day slot. Record the chosen IDs/date/times without credentials.
3. Save. Expected: success, one saved booking and matching data after refresh. Capture safe proof.
4. Reload current data/revision. Try a second booking overlapping the same special room. Where possible, use another eligible class and free teacher so the room conflict is the reason for rejection.
5. Expected: conflict rejection and no second saved booking after refresh. Record the exact message and first failing step if different.
6. Optional: try a conflict-free booking beginning exactly at the first booking’s end. Expected: adjacency alone does not cause overlap. This does not waive teacher/class/term constraints.
7. Record actual results, proof links and the version; update #72 only to the extent supported by the result.

## Tester-owned result — fill after actual execution

| Field | Actual result |
|---|---|
| Exact commit / clean status | Pending |
| Date / environment / fixture | Pending |
| Non-author confirmation | Pending for this #72 check |
| Class, room, subject, teacher and date/time | Pending |
| Valid save and reload | Not run |
| Overlap rejection and saved-row count/read-back | Not run |
| Adjacent boundary, if attempted | Not run |
| First failing step / error | Unknown until run |
| Direct safe proof links | Pending |
| Tester explanation of overlap predicate | Pending |
| Next action | Bal Raju runs the check by November 11; if blocked, records the exact blocker and recovery owner |

No human pass, assistant-run substitute or live result is claimed by this prepared document.

## Direct evidence links — November 10 follow-up

- [Bal Raju individual evidence receipt (draft pending personal confirmation)](individual-evidence-receipt-bal-raju.md)
- [Fresh assistant-run C0 check and exact source](c0-fresh-assistant-check-2026-11-10.md)
- [C0 workspace screenshot](evidence/c0-assistant-workspace-2026-11-10.jpg)
- [Disabled-account screenshot](evidence/c0-assistant-disabled-2026-11-10.jpg)
- [Automated test output](evidence/c0-assistant-tests-2026-11-10.txt)

These new links prove the dated assistant check only. They do not prove a Bal Raju-run test or a #72 room-booking pass.
