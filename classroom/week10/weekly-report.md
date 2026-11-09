# Weekly Report

**Team:** Team 1 — StudentHub<br>
**Week:** 10<br>
**Date:** November 5–11, 2026; updated November 9

## This week's goal

> Publish the locally developed school administration slice with honest evidence, then verify the administrator-to-student workflow before a live release.

## What we committed to do

- [x] Publish school planning, teacher routine and room-board source with linked automated checks.
- [x] Record Galan's requirements, implementation iterations and evidence in this shared report and one supporting receipt.
- [x] Record current local browser/mobile checks and safe screenshots for the delivered changes.
- [ ] Complete independent school-slice checks and keep live-release gaps visible.

## Evidence links

| Evidence | Link |
|---|---|
| Issues | [#66 school](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66), [#62–64 teachers](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/63), [#70 dashboard](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/70), [#72 room board](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72) |
| Implementation | [43a82ae](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae) |
| Historical safe screenshots | [Week 9 planner note](../week9/school-planner-test-note.md), [room note](../week9/room-board-test-note.md) — earlier layouts |
| Independent C0 account test | [Bal Raju’s November 9 local result](../week8/c0-independent-test.md#tester-owned-result-record); exact tested commit recorded there; direct screenshot link still needed |
| Current test/check note | [November 5 actual results and limits](school-release-check.md) |
| Team ownership audit | [Current area map, member status and AI notes](ai-use-and-code-ownership-audit.md) |
| Roadmap / checklist | [November 11 milestone](roadmap.md), [honest checklist](work-checklist.md) |
| Ownership / handoff | [Galan’s focused booking slice and real area map](code-ownership-galan.md); backup unconfirmed |
| Canteen owner usability | [Compact week navigation, quick add and save/publish controls](canteen-dashboard-usability.md) |
| Canteen shortcut update | [November 6: weekday/new-menu/suggestions, 63 backend + 12 frontend passes](canteen-menu-shortcuts-check.md) |
| Canteen workspace extension | [C2/C3 actual results and safe proof](canteen-owner-check.md) — owner-requested November 5 extension |
| Activity Log | [A1 #73](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/73), [November 8 actual checks and proof](activity-log-check.md) |
| School usability | [UX1 #74](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/74), [UX2 #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/75), [actual checks and screenshots](school-workspace-usability.md) |
| Sample data polish | [November 9 labels, private backup verification and safe proof](school-data-labels.md) |
| Student dashboard | [#76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/76), [homeroom, lessons, canteen and actual proof](student-dashboard-check.md) |
| Document update | [Galan's detailed receipt](individual-evidence-receipt-galan-bishal.md) |

## Individual contribution entries — one row per student

Prepared with coding assistance; each member must review/write their own entry. Blank entries are not completed contributions.

| Student | What they did | Evidence link |
|---|---|---|
| Galan Bishal (@bishal482) | Defined and implemented school administration with coding assistance: class membership, compact dashboard/list, subject drag/drop popups, specialist teacher routines with tiffin, room allocation/booking and recorded teacher availability; published source and actual checks; added staff Activity Log, four-second save confirmations, atomic school enrollment and a connected class workspace. | [Commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [Detailed receipts](individual-evidence-receipt-galan-bishal.md), [check note](school-release-check.md) |
| Bal Raju (@CoderRaaju) | Independently tested the local C0 canteen-account fixture on November 9 and recorded login/session, duplicate-account and disable/re-enable results. This credits testing and documentation, not Galan’s implementation. Summary added from his tester-owned record; Bal Raju should review it and confirm his Week 10 slice/area/support. | [Tester-owned result](../week8/c0-independent-test.md#tester-owned-result-record), [his evidence commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/6d8c538) |
| Ansh Sharma | Pending own entry. | Pending. |
| Buddha Raj Giri | Pending own entry. | Pending. |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Hosting is not a verified live release | Galan Bishal | Revisit Railway November 10, then verify deployment/data before claims. |
| Independent current school/booking workflow check remains pending | Galan coordinates; non-author tester unconfirmed | Repeat #72 valid/overlap/adjacent cases; record tester, commit, expected/actual and proof by November 11. Current local visual proof is already linked above. |
| Fresh-clone setup and remaining policy review | Galan Bishal | Complete #77 setup/bootstrap; keep tiffin/custom-booking policy review distinct from the locally implemented student homeroom display in #76. |
| Team ownership confirmations and C0 screenshot links | Each member confirms their own role; Galan coordinates | Confirm slice/area/backup by November 11. Bal Raju should add a direct safe screenshot URL to his existing test record; do not invent proof. |

## Decision record

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Publish current receipts/results in Week 10; retain earlier Week 9 proof as history | Owner clarified folder on November 5 | Galan Bishal | [Week 10 index](README.md) |
| One demo subject per teacher; same daily five-period routine plus 1–2 PM tiffin | Make the administration demonstration predictable and easier to review | Galan Bishal | [Current implementation/check](school-release-check.md) |
| Special rooms use a single booking date in the current UI | Avoid accidentally booking months when reserving one lesson | Galan Bishal | [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72) |

## Next week's bridge task

- Obtain a real non-author result against the published source and fix the first failure.
- After the hosting decision, verify the same workflow on the deployed build without publishing credentials or student data.
