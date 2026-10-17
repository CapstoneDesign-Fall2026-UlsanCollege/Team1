# Design Doc v1

**Team:** Team 1

**Project name:** StudentHub

**Last updated:** October 17, 2026

## 1. Project purpose

StudentHub brings academic information and job opportunities into one convenient platform for Ulsan College students. Administrators manage accounts, semester assignments, courses, and class meetings; students view their own information and find jobs that may fit their study time.

The next phase adds Campus Eat for students and Room Finder for administrators to find available classrooms using recorded class schedules. Room Finder replaces the earlier student-accommodation idea.

## 2. Target users

- **Primary user:** Ulsan College students.
- **Secondary user:** Administrators managing student accounts, academic information, and classroom availability.

## 3. Smallest useful version

An administrator creates a student account, assigns a semester, and organises course offerings and class meetings. The student signs in and views their profile, courses, and weekly timetable.

The current version also integrates the **Seoul Open Data recruitment API** through the backend. Students search real provider listings, filter by available days and hours, compare known work schedules with classes, and save favourites.

## 4. In scope

### Implemented core features

- Student/admin login with role-based access.
- Student profile management and semester assignments.
- Clickable semester details with linked students, courses, and timetable navigation.
- Course offerings by semester and major, professor assignment, and weekly scheduling.
- Administrator-reviewed password reset requests with private manual password delivery.
- **Seoul Open Data recruitment API integration:** backend-only key, recruitment listings, pagination, catalogue keyword search, caching, and error handling.
- Job availability filters, timetable comparison, favourites, and remembered browser filters.
- Responsive desktop/mobile interface and Railway deployment with MySQL.

### Planned after midterm

- **Campus Eat:** a small list-and-details view with food options, price range, location, and opening hours.
- **Room Finder (administration):** select a semester, date or weekday, and time range; see classrooms without conflicting recorded class meetings and open their room details.
- Maintain a room inventory and link class meetings to stable room identifiers. Check room conflicts across all majors, not just within one major.

Confirm the food data source, classroom inventory, and accuracy of room/schedule links before implementation. The first Room Finder version is read-only; it does not reserve rooms.

## 5. Out of scope

- Replacing the college's official academic-record system.
- Tuition or food-ordering payments.
- Automatic job applications or employment guarantees.
- Student accommodation search, rent/deposit information, rental contracts, or roommate matching.
- Classroom bookings, automatic allocation, or live occupancy detection in the first Room Finder version.
- Restaurant ordering or delivery.
- Guaranteed schedule compatibility or travel-time calculation.
- Native Android/iOS applications; the current delivery is a responsive website.
- Automated password-reset email delivery in the current MVP.

## 6. Midterm demo sentence

Our midterm demo will show:

> A student checking their weekly timetable, searching Seoul Open Data job listings, filtering by availability, and saving a listing to Favourites.

## 7. Final demo sentence

Our final demo will prove:

> Students can plan their week, save job opportunities, and explore campus food, while administrators can find classrooms without conflicting recorded classes for a selected time, supported by repeatable tests and linked evidence.

This is the final-demo target; Campus Eat and administrator classroom availability are planned extensions.

## 8. MVP features

Original food/job leads are retained from the earlier design. Room Finder has changed from housing to administrator classroom availability; confirm the lead for this new scope. Implementation evidence records actual work, including Galan's completed integration work. Leads and independent testers should confirm their assignments.

| Feature | Required for MVP? | Owner / lead | Issue link |
|---|---|---|---|
| Student/admin login and role-based access | Yes | Galan Bishal | [#37](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/37) |
| Student profiles and semester assignments | Yes | Galan Bishal | [#37](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/37), [#38](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/38), [#26](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/26) |
| Administrator navigation | Yes | Galan Bishal | [#43](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/43) |
| Semester details and guarded empty-semester deletion | Yes | Galan Bishal | [#50](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/50) |
| Course offerings and professors | Yes | Galan Bishal | [#39](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/39) |
| Weekly timetable and overlap checks | Yes | Galan Bishal | [#40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/40) |
| Administrator-reviewed password requests | Yes | Galan Bishal | [#49](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/49) |
| Seoul Open Data job API integration | Yes | Galan Bishal — implementation; Buddha Raj Giri — original job-feature lead | [#47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/47) |
| Job keyword search and day/time filters | Yes | Galan Bishal — implementation; Buddha Raj Giri — original job-feature lead | [#47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/47), [#29 — earlier investigation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/29) |
| Favourites and timetable matching | Yes | Galan Bishal | [#48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/48) |
| Mobile interface and deployment | Yes | Galan Bishal; team verification | [#41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/41), [#33](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/33), [#35](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/35) |
| Campus Eat | No — planned extension | Bal Raju — original feature lead | [#11 — planning](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/11) |
| Room Finder — available classrooms for administrators | No — planned extension | Team 1 — confirm lead for revised classroom scope | [#51 — classroom availability planning](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51) |
| Independent workflow verification | Yes | Non-author teammates; confirm named tester for each check | [#44](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44), [#36](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/36), [#48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/48), [#50](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/50) |

Earlier investigation #29 contains proposals beyond the current implementation, including applications and extra filters. Issues #47 and #48 describe the actual current job-search scope; proposal checklists are not proof those extra functions exist.

## 9. Risks and unknowns

The job API is an implemented core feature above. The following are specific operational limits and remaining work, not a claim that the integration is missing.

| Risk / unknown | Why it matters | Plan |
|---|---|---|
| Incomplete employer work schedules | A listing may not provide enough information for a confirmed timetable fit. | Label unknown schedules and ask students to confirm with the employer. |
| External service interruptions or slow searches | Provider data may be temporarily unavailable. | Use caching, clear retry states, and dated demo screenshot backups. |
| Provider HTTP transport | The upstream connection has a transport limitation. | Keep credentials server-side and investigate provider HTTPS support. |
| Linked academic records | Deletion can affect connected information. | Show dependencies and block linked-record deletion; never cascade student accounts from this view. |
| Remaining live verification | Automated and mocked checks do not prove every production write. | Attach tester, date, expected/actual results, and safe proof to the relevant issue. |
| Unconfirmed food source and classroom inventory | Campus Eat needs permitted food data; Room Finder needs a complete room list and stable room identifiers. | Confirm sources and map existing class locations to rooms before implementation. |
| Incomplete classroom schedules or inconsistent room names | A room could appear free when its usage is missing or recorded under another name. | Normalize room identifiers, check conflicts across majors, and label results as based on recorded schedules. |
| Date/weekday interpretation | Weekly classes, semester dates, and exceptions can affect availability. | Define campus-time and semester/date rules; do not claim live occupancy. |
| Outdated food information | Prices and opening hours may change. | Display source/update information. |
| Limited development time | Adding extensions could reduce core reliability. | Verify the core and build one small extension at a time. |

## 10. Evidence links

- Room Finder scope: [#51 — administrator classroom availability](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51). [#10](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/10) is the historical accommodation investigation and no longer defines this feature.
- Planning Issue: [Design planning #5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/5), [midterm preparation #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/46)
- Weekly Report: [Week 7 shared report](weekly-report.md).
- Demo/proof: [Live StudentHub](https://team1-production.up.railway.app/), [midterm demo script](../week7/midterm-demo-script.md)
- Job integration and checks: [Job Finder notes](../../docs/job-finder.md), [implementation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/cba8f7b)
- Semester details: [implementation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/292d96b)
- Verification records: [Week 6 Tested-By note](../week6/test-by-note.md); distinguish written results and proof from incomplete checklist claims.

- Current test evidence: [Test Report](../testing/test-report.md), [backend screenshot — 24 passed, 0 failed](../testing/test_result.png).
