# Weekly Report

**Team:** Team 1 — StudentHub<br>
**Week:** 10<br>
**Date:** November 5–11, 2026; initial update November 5

## This week's goal

> Publish the locally developed school administration slice with honest evidence, then verify the administrator-to-student workflow before a live release.

## What we committed to do

- [x] Publish school planning, teacher routine and room-board source with linked automated checks.
- [x] Record Galan's requirements, implementation iterations and evidence in this shared report and one supporting receipt.
- [ ] Complete current browser/mobile and real non-author checks; keep release gaps visible.

## Evidence links

| Evidence | Link |
|---|---|
| Issues | [#66 school](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66), [#62–64 teachers](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/63), [#70 dashboard](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/70), [#72 room board](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72) |
| Implementation | [43a82ae](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae) |
| Historical safe screenshots | [Week 9 planner note](../week9/school-planner-test-note.md), [room note](../week9/room-board-test-note.md) — earlier layouts |
| Current test/check note | [November 5 actual results and limits](school-release-check.md) |
| Team ownership audit | [Current area map, member status and AI notes](ai-use-and-code-ownership-audit.md) |
| Roadmap / checklist | [November 11 milestone](roadmap.md), [honest checklist](work-checklist.md) |
| Ownership / handoff | [Galan’s focused booking slice and real area map](code-ownership-galan.md); backup unconfirmed |
| Canteen shortcut update | [November 6: weekday/new-menu/suggestions, 63 backend + 12 frontend passes](canteen-menu-shortcuts-check.md) |
| Canteen workspace extension | [C2/C3 actual results and safe proof](canteen-owner-check.md) — owner-requested November 5 extension |
| Document update | [Galan's detailed receipt](individual-evidence-receipt-galan-bishal.md) |

## Individual contribution entries — one row per student

Prepared with coding assistance; each member must review/write their own entry. Blank entries are not completed contributions.

| Student | What they did | Evidence link |
|---|---|---|
| Galan Bishal (@bishal482) | Defined and implemented school administration with coding assistance: class membership, compact dashboard/list, subject drag/drop popups, specialist teacher routines with tiffin, room allocation/booking and recorded teacher availability; published source and actual checks. | [Commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Detailed receipts](individual-evidence-receipt-galan-bishal.md), [check note](school-release-check.md) |
| Bal Raju | Pending own entry. | Pending. |
| Ansh Sharma | Pending own entry. | Pending. |
| Buddha Raj Giri | Pending own entry. | Pending. |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Hosting is not a verified live release | Galan Bishal | Revisit Railway November 10, then verify deployment/data before claims. |
| Latest compact layout and full end-to-end workflow need current visual/non-author proof | Galan Bishal; non-author tester not confirmed | Record exact version, steps, expected/actual and safe proof. |
| Remaining homeroom/student view and break-policy consistency | Galan Bishal | Keep unfinished criteria in #62/#67/#68; compare all timetable/booking paths. |

## Decision record

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Publish current receipts/results in Week 10; retain earlier Week 9 proof as history | Owner clarified folder on November 5 | Galan Bishal | [Week 10 index](README.md) |
| One demo subject per teacher; same daily five-period routine plus 1–2 PM tiffin | Make the administration demonstration predictable and easier to review | Galan Bishal | [Current implementation/check](school-release-check.md) |
| Special rooms use a single booking date in the current UI | Avoid accidentally booking months when reserving one lesson | Galan Bishal | [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72) |

## Next week's bridge task

- Obtain a real non-author result against the published source and fix the first failure.
- After the hosting decision, verify the same workflow on the deployed build without publishing credentials or student data.
