# Week 5 Work Checklist

**Week:** 5  
**Date:** 2026-10-07  
**Team:** Team 1  

> The core work is the floor, not the finish line. Complete the core items, link the proof in GitHub, then choose several stretch items that make the project clearer, stronger, or easier to build.

## Core work

- [x] Publish the StudentHub frontend through GitHub Pages.
- [x] Deploy the backend API to Railway.
- [x] Import the local database into Railway MySQL.
- [x] Configure the frontend API address and backend database variables.
- [x] Run the frontend build and existing backend tests.
- [ ] Verify all main workflows on the deployed application.

## Evidence to link

- [x] [Frontend deployment workflow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml)
- [x] [Frontend and backend integration commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d)
- [x] [Published StudentHub website](https://capstonedesign-fall2026-ulsancollege.github.io/Team1/)
- [ ] Attach deployment and test-result screenshots to the shared Weekly Report.
- [ ] Link the GitHub issues after creating them.
- [ ] Record the remaining timetable permission problem.

## Stretch menu

Choose a few after the core work is complete. Prefer stretch work that improves the product, reduces a real risk, or makes the evidence easier for another person to understand.

### Product and user value

- [ ] Integrate Saramin job listings after API access is approved.
- [ ] Verify that students see courses and meetings matching their major and semester.

### Design and experience

- [ ] Test the published student dashboard on a phone-sized screen.
- [ ] Improve session-expiry feedback so users understand when they need to log in again.

### Technical readiness

- [ ] Investigate the “Administrators only” timetable error.
- [ ] Verify that student edits and timetable changes persist in Railway MySQL.
- [ ] Add an API health check for easier deployment troubleshooting.

### Evidence and team practice

- [ ] Complete the AI Use and Code Ownership Audit with personally confirmed entries.
- [ ] Record deployed workflow results in GitHub issues and the shared Weekly Report.

## Our stretch target

Which stretch items will your team complete, and why do they matter?

> Prioritize timetable permissions, cloud data persistence, and mobile usability. These checks confirm that the published application supports its main users reliably. Start Saramin integration once API access is available.

## Risks or exceptions

If a core item is incomplete, name the owner, the reason, and the next action.

| Item | Owner | Next action | Review point |
|---|---|---|---|
| Deployed workflow verification is incomplete | Bishal Galan | Test login, profile editing, course planning, and timetable changes | Before closing deployment issues |
| Timetable request displays “Administrators only” | Bishal Galan | Sign in as admin, reproduce the request, and check the current session role | Next troubleshooting session |
| Published mobile behavior needs verification | Bishal Galan | Test navigation, scrolling, forms, and large-view controls | Before the midterm demonstration |
| Saramin integration depends on API approval | Bishal Galan | Confirm approval and review the API documentation | Before starting job finder integration |
