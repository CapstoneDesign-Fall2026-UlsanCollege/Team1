# Individual Evidence Receipt — Galan Bishal

**Student:** Galan Bishal

**Canonical GitHub login:** [`bishal482`](https://github.com/bishal482)

**Team:** Team 1 — StudentHub

**Week:** 8 — October 22–28, 2026

**Date:** October 28, 2026

**Shared team report:** [Week 8 Weekly Report](weekly-report.md)

This is supporting evidence, not another weekly report. It records my product decisions, implementation direction, project coordination and documentation work with coding assistance. Tests and browser checks executed by the assistant are identified as such; I do not claim that I personally ran those commands or that they were independent teammate tests. This receipt does not claim another member's work.

## Summary of my work and effort

During Week 8, I continued StudentHub after the midterm by clarifying the next feature scope, separating canteen operations from academic administration, directing and delivering the C0 account/workspace slice with coding assistance, organising the implementation backlog, and responding to instructor feedback. I also requested investigation of the unavailable deployment and prepared a realistic release-recovery milestone rather than presenting local results as a completed live release.

My contribution includes defining behaviour, noticing friction, requesting corrections, connecting work to Issues, preserving evidence, and tracking what remains incomplete. The linked commits and records below distinguish published work from plans and unfinished local drafts.

## Receipt 1 — Kept Campus Eat focused on the campus canteen

- **What I did:** Changed Campus Eat's direction to the campus canteen only. I asked for a canteen-head workspace instead of putting daily menu management on the administrator dashboard. Students view food information; the canteen head manages it; administrators manage account access.
- **Evidence links:** [C0 role and workspace #61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61), [role-planning update `52c44d1`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/52c44d1), [Week 8 scope/index](README.md), [canteen access guide](../../docs/canteen-head-access.md).
- **How I checked it:** The scope was recorded in #61 and the related menu/hour/availability Issues. The published C0 code provides separate routing and backend role boundaries. It does not yet publish the complete food-management feature.
- **What I learned or changed:** A useful feature needs a clear operational owner. Giving daily canteen work to the canteen head reduces administrator clutter and gives the role only the access it needs. Ordering, delivery and payments remain outside the first version.

## Receipt 2 — Delivered canteen-head authentication and backend permissions

- **What I did:** Directed and completed the C0 implementation with coding assistance: added the `canteen_head` role, its workspace endpoint, staff-account provisioning, active-status controls and backend workspace restrictions.
- **Evidence links:** [Implementation commit `fa1be1a`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fa1be1a), [account routes/store](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/backend/src/canteen-accounts.ts), [authentication/workspace integration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/backend/src/app.ts), [C0 #61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61).
- **How I checked it:** Assistant-run backend checks covered role boundaries, duplicate login IDs, invalid input and role injection, password hashing, restricted status changes, session restoration, logout, expiry, and disable/enable revocation. API responses do not expose passwords or hashes.
- **What I learned or changed:** Hiding buttons does not secure a feature. A canteen-head account must also be rejected by academic/student endpoints. Disabling an account must revoke existing sessions, and enabling it must not restore revoked sessions.

## Receipt 3 — Added a separate workspace and small account-management controls

- **What I did:** Added the canteen-head landing workspace and the administrator's **Accounts → Canteen staff** controls with coding assistance. I kept daily menu editing out of the academic dashboard and used a shared login with role-specific landing pages.
- **Evidence links:** [Canteen workspace component](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/frontend/src/components/CanteenWorkspace.vue), [staff-account component](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/frontend/src/components/CanteenAccounts.vue), [app routing/navigation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/frontend/src/App.vue), [fictional workspace screenshot](evidence/c0-workspace-demo.png), [fictional staff-control screenshot](evidence/c0-staff-access-demo.png).
- **How I checked it:** The assistant used fictional in-memory accounts to check the landing page, reload/session restoration, logout, account controls and disable confirmation. At a 390-pixel viewport, the checked pages had no horizontal overflow. The screenshot account is a local fixture, not a real canteen head.
- **What I learned or changed:** Separate workspaces keep navigation focused. Account creation belongs in administration, while operational canteen controls belong to the canteen-head role. In C0, the page explicitly says menu controls come next.

## Receipt 4 — Preserved existing data while adding the role

- **What I did:** Added an append-only role migration and startup schema check with coding assistance instead of rebuilding user records or changing existing student/admin roles.
- **Evidence links:** [Migration 006](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/database/migrations/006_canteen_head_role.sql), [schema guard and persistence functions](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/backend/src/canteen-accounts.ts), [migration/deployment guide](../../docs/canteen-head-access.md), [C0 test note](c0-test-note.md).
- **How I checked it:** The assistant tested the migration twice against a connection-scoped temporary MySQL users table. Existing fixture student/admin rows stayed intact, the new role persisted and staff status writes did not modify the administrator. The real users table was unchanged by this verification.
- **What I learned or changed:** An additive migration can extend functionality while protecting existing records. Unknown schemas should be reviewed instead of silently rewritten. Rolling back application code does not justify deleting a role value that may already have linked accounts.

## Receipt 5 — Created traceable canteen and classroom slices in GitHub Issues

- **What I did:** Broke the next-phase work into small user-visible slices with dependencies, validation and evidence requirements. When the initial plans were placed in code files, I corrected the organisation so the plans lived in GitHub's Issues section and Week 8 kept an index.
- **Evidence links:** [Initial planning `526b793`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/526b793), [correction to Issues `271ae00`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/271ae00), [Week 8 index](README.md), and the individual Issues below.
- **How I checked it:** Each Issue names a user path, scope, Definition of Done and evidence boundary. Planned or unpublished work remains separate from the released C0 implementation.
- **What I learned or changed:** A backlog is useful when another person can tell what to build, what it depends on, and what proof is required. Creating an Issue is planning work, not proof that the feature is implemented.

| Slice | Direct Issue link | Evidence boundary |
|---|---|---|
| C0 — Canteen-head account, workspace and permissions | [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61) | Published implementation and local checks; live verification pending. |
| C1 — Daily canteen menu | [#54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54) | Extension plan; no completed-release claim. |
| C2 — Canteen hours and location | [#55](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/55) | Extension plan; no completed-release claim. |
| C3 — Menu-item availability | [#56](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56) | Extension plan; no completed-release claim. |
| R1 — Classroom inventory and meeting links | [#57](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/57) | Extension plan; no completed-release claim. |
| R2 — Available-classroom search | [#58](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/58) | Extension plan; no completed-release claim. |
| R3 — Room-conflict prevention | [#59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/59) | Extension plan; no completed-release claim. |
| V1 — Combined verification and release | [#60](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/60) | Independent/live release checks remain incomplete. |

## Receipt 6 — Defined teacher management around actual scheduling needs

- **What I did:** Identified the need for a teacher directory and each teacher's timetable so administrators could assign subjects with better information. Planned stable teacher identities, assigned-subject details and conflict checks across majors, linked to the existing course/timetable work.
- **Evidence links:** [T1 — Teacher directory #62](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/62), [T2 — Subjects and timetable #63](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/63), [T3 — Availability and assignment checks #64](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/64), [planning/index commit `f9a0fb3`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f9a0fb3).
- **How I checked it:** The assistant inspected the existing free-text professor fields and timetable checks before writing the plans. The Issues call for manual legacy-name mapping, stable IDs and server-side conflict enforcement. These are requirements, not evidence that the teacher feature has shipped.
- **What I learned or changed:** Two teachers can share a name, so a name alone is not a safe identity. A free timetable slot only means no recorded class conflict; it does not confirm a teacher's personal availability.

## Receipt 7 — Responded to Week 8 feedback and recorded an honest MVP assessment

- **What I did:** Requested and prepared the post-midterm reset with coding assistance: one shared report, a course lesson, a project lesson, current proof, an MVP assessment, canonical member evidence and a realistic Week 9 next action.
- **Evidence links:** [Instructor's Team 1 feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/grades-and-feedback/blob/main/Week%208/feedback.md#team-1--studenthub), [shared report](weekly-report.md), [work checklist](work-checklist.md), [response commit `7998565`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/7998565), [Week 9 milestone #65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).
- **How I checked it:** The assistant read the target, Team 1 feedback and available course guide/rubric/templates, checked commit attribution and checked local Markdown links. The report documents the unavailable course-material links rather than claiming they were read. It identifies `CoderRaaju` / `Junior Coder` using GitHub author metadata and keeps other members' personal confirmations pending.
- **What I learned or changed:** The [midterm rubric](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/midterm-presentation-rubric.md) rewards evidence of current behaviour, honest boundaries and feasible next steps. Our current working MVP status is **still has a gap** in deployed/repeatable verification; adding feature plans does not make it exceeded.

## Receipt 8 — Made C0 checking repeatable without production credentials

- **What I did:** Added a focused local review fixture and a written non-author test procedure with coding assistance, including expected results and fields for the real tester's actual result, date, commit, first failure and safe proof.
- **Evidence links:** [Review fixture](../../backend/scripts/c0-review.mjs), [independent-test procedure](c0-independent-test.md), [19-check assistant rehearsal](evidence/c0-review-fixture-check-2026-10-28.txt), [fixture/procedure commit `7998565`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/7998565), [original role tests](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/backend/tests/canteen-accounts.test.mjs).
- **How I checked it:** On October 28, the assistant built published C0 snapshot `7387145` using existing installed dependencies and rehearsed 19 API checks. They passed for login/session restoration, denied role access, provisioning validation, duplicate IDs, disabling/enabling, revoked sessions and logout. This was not a cold install, live database test or independent teammate run.
- **What I learned or changed:** A procedure and a local rehearsal reduce friction for a reviewer, but they cannot replace a real non-author's result. I kept that requirement unchecked rather than attributing the assistant's actions to a teammate.

## Receipt 9 — Investigated the unavailable website and documented the hosting blocker

- **What I did:** Requested investigation of the broken public site, followed up when the problem persisted, and documented the confirmed hosting restriction and recovery steps with coding assistance.
- **Evidence links:** [Public HTTP 404 response](evidence/railway-http-check-2026-10-28.txt), [authenticated Railway observation](evidence/railway-dashboard-observation-2026-10-28.txt), [trial-expired screenshot](evidence/railway-trial-expired-2026-10-28.png), [recovery record](deployment-recovery.md), [diagnosis/evidence commit `fb540ac`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fb540ac), [release milestone #65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).
- **How I checked it:** The assistant first observed `404 Application not found`, then read the authenticated Railway page showing **Trial expired**, **Limited Access**, **Service offline**, and **no active deployment**. The public response alone did not establish the cause; the dashboard supplied the later diagnosis.
- **What I learned or changed:** Hosting availability is part of a real release. I need to make the hosting decision before the deployed commit and account path can be verified. No payment, plan change, database recovery or successful redeployment is claimed in this receipt.

## Presentation and earlier-work context

- [Midterm presentation](../StudentHub-Midterm-Roles.ppt) provides context for the academic/job demo, contribution discussion and proposed next phase. I directed presentation content and role wording with coding assistance, but the [October 22 upload commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2619daf) belongs to `CoderRaaju`; I do not claim that upload as my commit. The file alone does not prove presentation timing, attendance or an independent test.
- Earlier academic/job implementation is context, not new Week 8 implementation credit: [semester details](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/292d96b), [job integration/search #47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/47), [favourites/timetable matching #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/48), and [job Refresh fix `7860f20`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/7860f20).

## Results and honest boundaries

| Evidence | Result supported | Boundary |
|---|---|---|
| October 25 C0 test note | 30 backend tests, 7 frontend tests and the production build passed; local fictional-account/browser and temporary-table checks passed. | Assistant-run local checks; not a live release or independent teammate execution. |
| October 28 review-fixture record | 19 API checks passed on the published C0 snapshot with fictional in-memory accounts. | Separate focused rehearsal; not a new full-suite result, cold install or production database check. |
| Authenticated Railway inspection | Trial expired; service offline; no active deployment. | Diagnosis recorded, not fixed hosting or verified database recovery. |
| Extension Issues | Requirements and dependencies are linked. | Unpublished menu/room/teacher draft code is not completed release evidence. |
| Independent test record | Repeatable instructions and pending fields are published. | No confirmed non-author test has been supplied. |

## My next action

I own [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65): make the hosting decision, restore and identify a published release, verify approved account and role behaviour, and coordinate a real non-author check. I will update the shared report from actual results and keep unfinished features or unsupported claims out of the MVP completion decision.
