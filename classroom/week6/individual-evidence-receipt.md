# Individual Evidence Receipt

**Student:** Galan Bishal — `bishal482`  
**Team:** Team 1 — StudentHub  
**Week:** 6  
**Date:** October 14, 2026  

This supports the team’s shared Weekly Report. Checks performed with coding assistance are identified below; independent teammate verification remains pending.

## Receipt 1 — Administrator navigation and action icons

- **What I did:** Improved administrator navigation and added icons to make sections and actions easier to find.
- **Evidence link:** [Implementation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c7ad189), [Issue #43](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/43).
- **How I checked it:** With coding assistance, ran the frontend build and local browser checks with a test API. Navigation, form retention, and desktop/mobile overflow checks passed. Independent Week 6 testing is pending in [Issue #44](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44).
- **What I learned or changed:** Clear navigation reduces unnecessary scrolling. Local interface checks still need a separate live workflow check.

## Receipt 2 — Job availability filters

- **What I did:** Added filters for available weekdays and working hours, including overnight availability.
- **Evidence link:** [Availability filter commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/3df2d83).
- **How I checked it:** With coding assistance, checked schedule parsing and filtering, including overnight shifts and unknown hours. The frontend build passed.
- **What I learned or changed:** Employer descriptions are sometimes incomplete, so unknown schedules must remain clearly identified.

## Receipt 3 — Favourites and more useful job search

- **What I did:** Added heart buttons, a Favourites section, remembered filters, catalogue keyword search, timetable comparison, and employer contact/application details.
- **Evidence link:** [Job convenience commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/cba8f7b), [Job Finder documentation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/docs/job-finder.md).
- **How I checked it:** With coding assistance, ran 23 backend tests, three schedule/filter tests, and the frontend build. Browser checks with a test API covered saving/removing favourites, remembered filters, timetable conflicts, search, phone links, and mobile layout. Live favourite persistence across devices remains unverified.
- **What I learned or changed:** Saved jobs are snapshots and may become outdated. Filters can remember preferences on one browser, while favourites are designed to belong to the signed-in account.

## Receipt 4 — Railway deployment recovery

- **What I did:** Resolved a deployment failure caused by Docker Hub returning `429 Too Many Requests`.
- **Evidence link:** [Deployment fix commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/bedc46d).
- **How I checked it:** With coding assistance, verified the same Node image was available from Amazon’s public registry, updated both Dockerfile stages, and pushed the fix. The live website then served the new job-search interface.
- **What I learned or changed:** A deployment can fail before application code builds because an external image registry limits downloads.

## Receipt 5 — Timetable loading bug

- **What I did:** Corrected the Job Finder’s timetable request from `student/schedules` to the existing `student/schedule` route.
- **Evidence link:** [Timetable route fix](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/37e4c79).
- **How I checked it:** With coding assistance, compared the frontend request with the backend route, built the frontend, and confirmed the deployed JavaScript contained the corrected address.
- **What I learned or changed:** A successful build does not detect every incorrect API address; frontend requests must match backend routes.

## Receipt 6 — Compact availability controls

- **What I did:** Replaced the large availability section with a days dropdown, From/Until controls, and Fits my timetable. Removed the semester selector and selected the comparison semester automatically.
- **Evidence link:** [Compact filters commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2a90851).
- **How I checked it:** With coding assistance, checked the dropdown and automatic timetable selection using a test API, inspected the desktop layout, and checked mobile overflow. The frontend build passed and the new interface went live.
- **What I learned or changed:** Reducing choices and moving explanations into expandable help saves space without removing useful filters.

## Receipt 7 — Search button placement

- **What I did:** Moved Search to the right of its input instead of placing it on another row.
- **Evidence link:** [Search layout commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/848f12c).
- **How I checked it:** With coding assistance, verified button alignment on desktop and a 390-pixel phone layout, checked for overflow, and ran the frontend build. The deployed stylesheet contained the change.
- **What I learned or changed:** Placing an action beside its field makes the connection clearer and reduces vertical space.

## Receipt 8 — Smaller mobile time inputs

- **What I did:** Reduced the width and padding of From/Until inputs on phones while keeping a 44-pixel touch height.
- **Evidence link:** [Mobile sizing commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ef89214).
- **How I checked it:** With coding assistance, checked editable time inputs and horizontal overflow at 320, 390, and 430 pixels. The frontend build passed, and the smaller inputs were confirmed in the deployed stylesheet.
- **What I learned or changed:** Mobile controls can occupy less space while remaining easy to tap.

## Receipt 9 — Documentation preparation

- **What I did:** Prepared a setup guide and shared Week 6 report, and drafted checklist and test-record content with implementation links and pending checks.
- **Evidence link:** [Shared Week 6 report location](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/weekly-report.md), [Existing Tested-By Note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/test-by-note.md). **The prepared guide/report updates are not pushed yet; these links do not prove the unpublished drafts.**
- **How I checked it:** Reviewed repository files and commit history, distinguished completed technical checks from pending teammate tests, and avoided claiming unobserved results.
- **What I learned or changed:** Evidence must support the exact claim. Draft documents and automated checks cannot replace a teammate’s recorded test result.

## Remaining verification

- Complete the independent administrator navigation test in [Issue #44](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44).
- Attach screenshots showing the actual results without exposing private data.
- Check favourites after reloading and signing in on another device.
- Publish the reviewed documentation and link this receipt from the shared Weekly Report.

**Demo:** [StudentHub on Railway](https://team1-production.up.railway.app/).
