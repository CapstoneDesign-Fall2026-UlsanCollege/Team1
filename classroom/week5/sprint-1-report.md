# Sprint 1 Report — Launch and Scope

**Team:** 1  
**Sprint:** Sprint 1 — Launch and Scope  
**Date:** 2026-10-07  
**Status:** [ ] Ready to close [ ] Ready with an explicitly owned exception

## Sprint 1 outcome

Our team defined the initial Student Hub MVP direction and, by Week 5, moved the project from local development to a public deployment. The application now includes a live StudentHub frontend, a Railway-hosted backend API, and a migrated MySQL database, proving the product can run in a cloud-based environment outside a developer machine.

For Uni Stay, we identified the main user journey for finding rooms and roommates and defined a room-search vertical slice that is now demonstrable on the published site. The team also completed the required deployment setup and verified that the frontend build and existing backend tests pass.

## Project snapshot

| Field | Current answer | Evidence link |
|---|---|---|
| Project purpose | Student Hub is a PWA and MVP platform that provides useful student services, including student life information, campus food, part-time work, and housing. | [Published StudentHub site](https://capstonedesign-fall2026-ulsancollege.github.io/Team1/) |
| Target user | University students who need access to StudentHub services such as accommodation info, food options, course planning, and part-time work opportunities. | [StudentHub website](https://capstonedesign-fall2026-ulsancollege.github.io/Team1/) |
| In-scope boundary | Student Life Hub, Campus Eats, Student Part-Time Work, and Uni Stay. Uni Stay includes room searching, roommate searching, filtering, listings, and useful details. | [Uni Stay issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/21) |
| Out-of-scope boundary | Advanced payment systems, contract management, background verification, advanced matching algorithms, and other features not required for the initial MVP. | [MVP scope issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues) |
| Possible midterm demo sentence | Our midterm demo will show students accessing StudentHub, selecting Uni Stay, searching for rooms, applying basic filters, and viewing room details on the live deployed application. | [Frontend and backend integration commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d) |
| Deployment status | Frontend served via GitHub Pages, backend to Railway, database migrated to Railway MySQL. | [Frontend workflow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml) |

## Sprint 0 exit evidence

| Requirement | Evidence link | Status or short note |
|---|---|---|
| Team repository and Project board work | [Repository](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1) and [Issues / project board](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues) | Complete |
| Team Working Agreement is linked and current | [Working Agreement](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week1/WORK%20AGREEMENT.md) | Current |
| Six to ten next-work Issues exist | [Issue list](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues) | 6+ issues identified |
| Important Issues have first owners | [Issue list with owners](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues) | Owners assigned |
| At least three Issues have a checkable Definition of Done | [Issue #13](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/13), [Issue #15](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/15), [Issue #16](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/16) | DoD included |
| Tech stack comparison is recorded | [Tech stack comparison](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week3/tech-stack-comparison.md) | Recorded |
| Rough wireframe placeholders are linked | [Wireframe notes](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week3/wireframe-notes.md) | Student Hub and Uni Stay flow available |
| Rough architecture placeholder is linked | [Architecture sketch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week3/architecture-sketch.md) | Recorded |
| Candidate vertical slice is linked | [Uni Stay Sprint 0 issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/21) | Room-search vertical slice defined |
| Sprint 0 Quality Quick Checks are complete | [Checklist](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week3/checklist.md) | Complete |
| Week 3 Weekly Report is complete | [Weekly Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week3/weekly-report.md) | Complete |
| Public deployment is complete | [GitHub Pages workflow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml) | Frontend published |
| Backend API deployed | [Server and database configuration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/server.ts) | Railway backend active |
| Database migration completed | [Project README](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/README.md) | MySQL moved to Railway |
| Build and test verification | [Weekly Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week5/weekly-report.md) | Frontend build and 16 backend tests passed |
| Week 5 Weekly Report is complete | [Weekly Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week5/weekly-report.md) | Complete |

## Candidate vertical slice

- **User or actor:**  
  A student looking for accommodation.

- **Start state:**  
  The student is logged in and has opened StudentHub on the public website.

- **Smallest end-to-end path:**

  ```text
  Login / Sign up
        ↓
  Student Hub
        ↓
  Housing / Uni Stay
        ↓
  Find a Room
        ↓
  Search and Apply Filters
        ↓
  View Search Results
        ↓
  View Room Details
  ```

- **What the demo should prove:**  
  A student can access Uni Stay, search or browse room listings, apply basic filters, and view useful room information.

- **What is deliberately out of scope:**  
  Online rent payment, contract management, background verification, advanced roommate matching, real-time chat, and a complete booking system.

- **Evidence link:**  
  [Published StudentHub](https://capstonedesign-fall2026-ulsancollege.github.io/Team1/) | [Uni Stay candidate vertical slice issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/21) | [Integration commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d)

## Risks and owned exceptions

| Risk or exception | Owner | Next action | Due or review point |
|---|---|---|---|
| The team still needs to confirm the final MVP feature priorities. | Team 1 | Review the proposed MVP scope and agree on the first vertical slice. | Week 6 |
| Room and roommate data requirements may change during implementation. | Uni Stay owner | Identify the minimum required fields for rooms and roommate profiles. | Week 6 |
| Some team-wide Sprint 0 evidence links may still need verification. | Assigned team member | Add or check repository, Project board, architecture, and Working Agreement links. | Before closing Week 5 work |
| Deployed workflow verification is incomplete | Bishal Galan | Test login, profile editing, course planning, and timetable changes on the live site | Before closing deployment issues |
| Timetable request displays “Administrators only” | Bishal Galan | Sign in as admin, reproduce the request, and check the current session role | Next troubleshooting session |
| Published mobile behavior has not yet been fully validated | Bishal Galan | Test navigation, scrolling, forms, and timetable controls on a small screen | Before the midterm demonstration |
| Full cloud data persistence has not been confirmed | Bishal Galan | Test student edits, course assignment, and timetable changes, then reload saved data | Before final deployment sign-off |
| Saramin integration depends on API approval | Bishal Galan | Confirm approval and review the API documentation | Before starting job finder integration |

## Bridge into Week 6 and Sprint 1

- **Week 5 deployment milestone:**  
  We successfully moved StudentHub from local development to a public deployment using GitHub Pages and Railway.

- **This week’s goal:**  
  Move StudentHub from local development to deployment and begin verifying the live workflows on the public site.

- **Key blockers or questions for Week 6:**  
  - What is the root cause of the timetable error that says “Administrators only”?  
  - Does edited data persist correctly in Railway MySQL after refresh?  
  - Is the published site usable on mobile?  
  - Is Saramin API access approved for the next phase of job integration?

- **First action after the Week 5 milestone:**  
  Complete deployed workflow verification, resolve timetable permissions, and test persistence and mobile usability before expanding features.

## Final check

- [ ] Every evidence link resolves for a reader with team-repository access.
- [ ] The team can explain the project purpose, target user, scope boundary, and candidate slice.
- [ ] The next work is represented by small Issues with owners and checkable completion criteria.
- [ ] The team has not posted personal data, secrets, or unapproved real-user data.
- [ ] This report is linked from the team's Week 5 evidence or Weekly Report.
- [ ] The public deployment and cloud configuration are documented and reviewed.
- [ ] Remaining workflow verification items are assigned and tracked.

## Week 5 evidence summary

The team completed the following in Week 5:

- [x] Published the StudentHub frontend through GitHub Pages.
- [x] Deployed the backend API to Railway.
- [x] Imported the local database into Railway MySQL.
- [x] Configured the frontend API address and backend database variables.
- [x] Ran the frontend build and existing backend tests.
- [ ] Verify all main workflows on the deployed application.

## Week 5 team working notes

> The core work is the floor, not the finish line. Complete the core items, link the proof in GitHub, then choose several stretch items that make the project clearer, stronger, or easier to build.

The project is now deployed and functional in a public environment. The remaining priority is not feature expansion but verification: confirming that the live application works for the main workflows, especially login, profile editing, course planning, timetable actions, and mobile usability.
