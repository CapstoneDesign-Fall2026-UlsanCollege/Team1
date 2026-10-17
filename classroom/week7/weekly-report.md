# Weekly Report

**Team:** Team 1 — StudentHub

**Week:** 7

**Date:** October 17, 2026

## This week's goal

> Prepare the midterm demonstration, improve semester management, record completed testing, and clarify the next development phase.

## What we committed to do

- [x] Add clickable semester details with links to students, courses, and timetables.
- [x] Prepare the midterm demonstration and record the reported passed preparation checks.
- [x] Update the Week 7 design and link implemented features to issues.
- [x] Change Room Finder to administrator classroom availability.
- [x] Record the passed semester-deletion and cross-device favourite checks reported by Galan.
- [x] Link the backend test screenshot showing 24 passed and 0 failed.
- [ ] Each member confirms their own contribution and evidence row.

## Evidence links

| Evidence | Link |
|---|---|
| Issue(s) | [#46 — Preparation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/46), [#50 — Semester details](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/50), [#51 — Classroom Room Finder](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51), [#52 — Passed midterm preparation record](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/52), [#53 — Passed live workflow record](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/53) |
| PR(s) / commits | [Semester details](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/292d96b), [Week 7 design location](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/cd3561e), [Administrator Room Finder scope](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5ce7de4) |
| Screenshot / demo | [Backend screenshot — 24 passed, 0 failed](../testing/test_result.png), [test report with embedded image](../testing/test-report.md), [live StudentHub](https://team1-production.up.railway.app/) |
| Test/check note | [Week 7 Test Report](../testing/test-report.md): automated results shown in the screenshot; midterm preparation, live semester deletion, and cross-device favourites reported passed by Galan on October 17. |
| Document update | [Design Doc](design-doc-v1.md), [Demo Script](midterm-demo-script.md), [Test Report](../testing/test-report.md), and this shared Weekly Report. |

## Individual contribution entries — one row per student

Each student must confirm their own sentence and evidence before submission.

| Student | What they did | Evidence link |
|---|---|---|
| Galan Bishal — bishal482 | Added semester details and management links with coding assistance, updated design scope, ran the backend test command shown in the screenshot, and reported the preparation/live checks passed. | [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/292d96b), [Design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5ce7de4), [Test report](../testing/test-report.md) |
| Bal Raju | Add and confirm actual Week 7 contribution. | Add own evidence link. |
| Ansh Sharma | Add and confirm actual Week 7 contribution. | Add own evidence link. |
| Buddha Raj Giri | Add and confirm actual Week 7 contribution. | Add own evidence link. |

## Blockers or risks

Completed testing is recorded above, not retained as a blocker.

| Blocker/risk | Owner | Next action |
|---|---|---|
| Classroom inventory and consistent room identifiers are not yet confirmed. | Team 1 — confirm Room Finder lead | Obtain a room list and map scheduled class locations to identifiers in #51. |
| Campus Eat data source and update process are not yet confirmed. | Bal Raju — proposed feature lead | Confirm permitted sources and the smallest list-and-details scope in #11. |

## Decision record

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Open students and courses from semester details. | Reduce searching and explain linked-record restrictions. | Galan Bishal | [#50](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/50) |
| Keep the updated design in Week 7 and preserve Week 2 history. | Record current scope in the correct week. | Galan Bishal | [Correction](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/cd3561e) |
| Treat the Seoul job API as an implemented core feature. | Integration already exists; provider limits are separate concerns. | Galan Bishal | [#47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/47) |
| Replace accommodation search with administrator classroom availability. | Connect Room Finder to administration and class scheduling. | Galan Bishal; team to confirm lead | [#51](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51) |
| Move passed preparation and live checks out of risks into evidence. | Galan confirmed that these checks passed; the report must reflect the current result. | Galan Bishal | [#52](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/52), [#53](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/53), [Test Report](../testing/test-report.md) |

## Next week's bridge task

- Confirm all four members' contribution entries and evidence links.
- Prepare Campus Eat's data source and small implementation plan.
- Define Room Finder's room inventory, semester/day/time rules, and cross-major conflict checks.
- Update the presentation's next-step wording to administrator classroom availability.
