# Weekly Report

**Team:** Team 1 — StudentHub

**Week:** 6

**Date:** October 14, 2026

This is the single shared team report. Each student must confirm their own contribution row and attach evidence.

## This week's goal

> Reduce friction in StudentHub's job search, improve the mobile layout, and prepare clear setup and verification documentation.

## What we committed to do

- [x] Compact the availability filters and select the timetable semester automatically.
- [x] Move Search beside its input and reduce the mobile From/Until input size.
- [ ] Complete independent administrator navigation verification and record the actual result in Issue #44.

## Evidence links

| Evidence | Link |
|---|---|
| Issue(s) | [#44 — Week 6 administrator navigation verification](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44). Add the job-search issue link when confirmed; #44 covers administrator navigation only. |
| PR(s) / commits | [Compact availability filters and automatic semester](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2a90851), [Search button placement](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/848f12c), [Smaller mobile time inputs](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ef89214). Changes were pushed directly to main; no PR is claimed. |
| Screenshot / demo | [Live StudentHub](https://team1-production.up.railway.app/) — log in as a student and open Student Job. |
| Test/check note | Frontend build passed on October 14. Browser checks with a test API confirmed editable compact time inputs and no horizontal overflow at 320, 390, and 430 pixels. See [setup guide check record](setup-guide.md#how-to-testcheck-the-project) and the linked mobile change above. Independent admin verification is still pending in the [Tested-By note](test-by-note.md). |
| Document update | [Setup Guide](setup-guide.md), [Week 6 Tested-By note](test-by-note.md), and this shared report. The setup guide/report are local drafts until committed and pushed. |

## Individual contribution entries — one row per student

Draft entries below must be confirmed by their named student. Commit authorship is evidence of the change, not proof of independent testing.

| Student | What they did | Evidence link |
|---|---|---|
| Galan Bishal — bishal482 | Improved job-search filter layout, moved Search beside the input, and reduced the mobile time-input size. | [Filters](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2a90851), [Search](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/848f12c), [Mobile sizing](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ef89214) |
| anshsharma123 — add student name | Created Week 6 sprint-report and work-checklist files; their content still needs completion. | [Sprint-report file](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/aae2a7c), [Checklist file](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5bf7f30) |
| Junior Coder — add student name / GitHub login | Added the Week 6 administrator navigation Tested-By note; the test result and proof still need to be entered. | [Tested-By document commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/a35b1f3) |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Administrator verification lacks tester name, actual result, and proof. | Team 1 — assign an independent tester | Follow the Tested-By steps, enter the observed result, and update Issue #44. |
| Job schedule data can be missing or unclear; matching excludes travel time. | Galan / Team 1 | Keep unknown schedules clearly labeled and confirm details with the employer. |
| Live favourite persistence across devices has not been verified. | Team 1 — assign a student-workflow tester | Save a job, reload, and sign in on another device; attach evidence. |
| Setup guide and shared report have not been published yet. | Team 1 | Review the drafts, confirm contribution entries, then commit and push. |

## Decision record

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Select the timetable semester automatically and use a compact availability row. | Reduce the choices and space needed to filter jobs. | Galan / Team 1 | [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2a90851) |
| Place Search to the right of its input. | Keep the search action beside the field and remove an extra row. | Galan / Team 1 | [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/848f12c) |
| Reduce phone time-input dimensions while keeping a 44-pixel touch height. | Save space while preserving usable controls. | Galan / Team 1 | [Implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ef89214) |
| Keep independent admin verification pending until actual results are recorded. | Builds and earlier local checks do not prove this week's live workflow passed. | Team 1 | [Issue #44](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44), [Tested-By note](test-by-note.md) |

## Next week's bridge task

- Complete independent administrator navigation checks and record evidence in Issue #44.
- Verify favourites and timetable matching with a real student account on the deployed site, including another device.
- Confirm each student's contribution entry and publish the shared documentation.
