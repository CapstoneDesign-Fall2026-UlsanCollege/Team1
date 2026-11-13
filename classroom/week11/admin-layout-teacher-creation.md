# Consistent controls and teacher creation

**Owner:** Galan Bishal (@bishal482), with coding assistance

**Completed:** November 14, 2026; local browser/database checks began November 13.

**Issue:** [#88 — Definition of Done and verification](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/88)

## Changes

- Activity Log dropdowns, date inputs and Apply/Reset buttons now use consistent 44 px heights, borders and spacing.
- Subject cards have equal heights, aligned teacher/actions, matching Add lesson buttons and reserved grid columns when only a few subjects exist. They no longer stretch across the entire tray for a small number of cards.
- **Accounts → Teacher list → Create teacher** opens a form for the teacher's full name and unique staff code.
- Saving uses the existing administrator-only, revision-checked teacher endpoint. Existing subject/homeroom assignments are unchanged.
- After saving, **Set up teacher login** opens Teacher access with the new teacher selected. Creating a directory record does not automatically issue a password or enable a login.

## Definition of Done and actual checks

| Criterion | Actual local result | Evidence |
|---|---|---|
| Consistent filter controls | All three dropdowns, both dates and both actions measured 44 px high at 1280 px viewport width. | [Activity Log screenshot](evidence/consistent-activity-filters.png) |
| Consistent subject cards | Two cards with different subjects measured 242 px high and 190.75 px wide; subject buttons were 96 px high and Add lesson buttons 44 px. | [Subject-card screenshot](evidence/consistent-subject-cards.png) |
| Visible teacher creation | Created fictional `TEST-T03` from Accounts and confirmed the saved teacher appeared in the list. | [Create teacher form](evidence/create-teacher-desktop.png) |
| Login handoff | Selected Set up teacher login; the Teacher dropdown selected the new teacher's ID and name. No login/password was created by this browser test. | Existing TeacherAccounts flow; assistant-observed DOM read-back |
| Mobile creation | At 390 px viewport width, the dialog was 341 px wide. Created fictional `TEST-T04` and confirmed its staff code appeared in the list. | [Mobile form](evidence/create-teacher-mobile.png) |
| Existing backend safeguards | 32 school integration tests passed, including teacher duplicate-code, stale revision and non-admin rejection paths. | [Database test log](evidence/teacher-create-check-2026-11-13.txt) |
| Frontend checks | Production type check/build passed; all 17 existing frontend tests passed. | Build/test command results recorded during implementation |

Browser writes used a disposable fictional database, not production. These are assistant-run checks, not an independent teammate pass. Hosted release verification is recorded separately in the issue after deployment.

## Published release verification — November 14

- Layout implementation: [2b63189](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2b63189).
- Teacher creation and login handoff: [03bf58d](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/03bf58d366d83249cb342d60c22316a363514570).
- [GitHub automated checks passed](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/43487573781).
- Railway deployment `e5f9e00a-8543-4e78-af19-b41aa9ff331e` showed Active and Deployment successful for the teacher-creation commit.
- On the hosted site, logged in as an administrator, opened Accounts → Teacher list → Create teacher and verified the name/staff-code form. [Hosted screenshot](evidence/create-teacher-live-2026-11-14.png).
- Hosted Activity Log measurements confirmed all three selects, both date inputs and both action buttons were 44 px high.
- No teachers or login accounts were created in production during this release check. Actual creation/read-back and login-selection checks used the isolated fictional fixture described above.
