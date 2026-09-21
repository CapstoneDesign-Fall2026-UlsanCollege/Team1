# Sprint 0 Report — Launch and Scope

**Team:** 1  
**Sprint:** Sprint 0 — Launch and Scope  
**Date:** 2026-09-21  
**Status:** [ ] Ready to close [ ] Ready with an explicitly owned exception

## Sprint 0 outcome

Our team has defined the initial direction of the Student Hub MVP, which will include Student Life Hub, Campus Eats, Student Part-Time Work, and Uni Stay.

For Uni Stay, we have identified the main user journey for finding rooms and roommates and proposed a room-search vertical slice for the initial implementation.

## Project snapshot

| Field | Current answer | Evidence link |
|---|---|---|
| Project purpose | Student Hub is a PWA and MVP platform that provides useful student services, including student life information, campus food, part-time work, and housing. | Student Hub project documentation |
| Target user | University students who need access to student services, accommodation information, food options, and part-time work opportunities. | Project scope documentation |
| In-scope boundary | Student Life Hub, Campus Eats, Student Part-Time Work, and Uni Stay. Uni Stay includes room searching, roommate searching, filtering, listings, and useful details. | Student Hub user-flow diagram |
| Out-of-scope boundary | Advanced payment systems, contract management, background verification, advanced matching algorithms, and other features not required for the initial MVP. | MVP scope issue |
| Possible midterm demo sentence | Our midterm demo will show students accessing Student Hub, selecting Uni Stay, searching for rooms, applying basic filters, and viewing room details. | Candidate vertical slice documentation |

## Sprint 0 exit evidence

| Requirement | Evidence link | Status or short note |
|---|---|---|
| Team repository and Project board work | [Add repository and Project board link] | Confirm with team |
| Team Working Agreement is linked and current | [Add Working Agreement link] | Confirm with team |
| Six to ten next-work Issues exist | [Add Issues link] | Confirm issue count |
| Important Issues have first owners | [Add Project board link] | Confirm owners |
| At least three Issues have a checkable Definition of Done | [Add issue links] | Confirm with team |
| Tech stack comparison is recorded | [Add tech stack comparison link] | Confirm with team |
| Rough wireframe placeholders are linked | [Add wireframe link] | Student Hub and Uni Stay flow available |
| Rough architecture placeholder is linked | [Add architecture link] | Confirm with team |
| Candidate vertical slice is linked | [Add vertical slice issue link] | Uni Stay room search proposed |
| Sprint 0 Quality Quick Checks are complete | [Add quality checklist link] | Confirm with team |
| Week 3 Weekly Report is complete | [Add Weekly Report link] | Confirm with team |

## Candidate vertical slice

- **User or actor:**  
  A student looking for accommodation.

- **Start state:**  
  The student is logged in and has opened Student Hub.

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
  [Add Uni Stay user-flow diagram and vertical slice issue link]

## Risks and owned exceptions

| Risk or exception | Owner | Next action | Due or review point |
|---|---|---|---|
| The team still needs to confirm the final MVP feature priorities. | Team 1 | Review the proposed MVP scope and agree on the first vertical slice. | Week 4 |
| Room and roommate data requirements may change during implementation. | Uni Stay owner | Identify the minimum required fields for rooms and roommate profiles. | Week 4 |
| Some team-wide Sprint 0 evidence links may be missing. | Assigned team member | Add repository, Project board, architecture, and Working Agreement links. | Before Sprint 0 closure |

## Bridge into Week 4 and Sprint 1

- **Week 4 Chuseok Checkpoint Issue:**  
  [Add Week 4 Chuseok Checkpoint Issue link]

- **Rough sketch or photo link:**  
  [Add Uni Stay user-flow diagram link]

- **One blocker or question for Week 5:**  
  What minimum room and roommate information should be included in the MVP, and how will the team store and display the listings?

- **First action after the break:**  
  Review the Uni Stay MVP scope with the team, confirm the room-search vertical slice, and begin creating the basic room listing and search interface.

## Final check

- [ ] Every evidence link resolves for a reader with team-repository access.
- [ ] The team can explain the project purpose, target user, scope boundary, and candidate slice.
- [ ] The next work is represented by small Issues with owners and checkable completion criteria.
- [ ] The team has not posted personal data, secrets, or unapproved real-user data.
- [ ] This report is linked from the team's Week 3 evidence or Weekly Report.
