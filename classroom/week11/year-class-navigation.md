# Year & class setup in main navigation

**Owner:** Galan Bishal, with coding assistance

**Date:** November 14, 2026

**Issue:** [#89 — Definition of Done](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/89)

## Changes

- Added **Year & class setup** to the main administrator navigation.
- Added a dedicated **Year & class setup** card to the main overview. School profile, academic-year and grade/class setup-guide links also open this destination.
- Removed the setup button from the School classes submenu.
- Reused the existing setup forms and one shared school state. Academic-year/class selection and the previously selected class-workspace tab survive switching between the two main destinations.

## Checks

- Frontend production type check/build passed; 17 existing frontend tests passed.
- Assistant browser check: main navigation opened Create academic year and the existing class/term setup forms. The class submenu was hidden while viewing setup.
- Assistant browser check: School classes → Subjects & timetable → main Year & class setup → School classes restored Subjects & timetable as the active class tab.
- The class submenu contained zero Year & class setup buttons.
- The overview setup card opened the same setup forms.
- [Local navigation screenshot](evidence/year-class-main-navigation.png).

These checks only navigated existing data. No school records were created or changed, and no independent teammate test is claimed. Hosted verification is recorded in the issue after deployment.

## Hosted verification

Railway deployment 4fd106f7-a465-45a7-9ad0-8f98487f471b became Active/Deployment successful for commit ba5fa63. On the live site, both the main navigation button and overview card opened Create academic year and the existing setup forms. [Hosted screenshot](evidence/year-class-main-navigation-live.png). No data was changed. [CI passed](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/43489441800).
