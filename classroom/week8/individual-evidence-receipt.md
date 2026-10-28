# Individual Evidence Receipt — Week 8

**Student:** Galan Bishal — `bishal482`

**Team:** Team 1 — StudentHub

**Week:** 8 — October 22–28, 2026

**Date:** October 28, 2026

This supports the [single shared Weekly Report](weekly-report.md); it is not a separate weekly report. Prepared for Galan with coding assistance from the linked work and conversation. It does not attest to another member's contribution, an independent test, or Galan personally executing assistant-run commands. Galan should review his own wording before submission.

## Receipt 1 — Separate canteen-head role and workspace

- **What I did:** Directed the change from administrator-managed food information to a dedicated canteen-head account/workspace, and completed the C0 implementation with coding assistance. Administrators provision or disable the account; they do not manage daily menus.
- **Evidence link:** [C0 implementation `fa1be1a`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fa1be1a), [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61), [local test note](c0-test-note.md).
- **How I checked it:** The assistant ran 30 backend tests, 7 frontend tests, a production build, fictional-account browser checks and a temporary-table database check on October 25. These are bounded local checks, not an independent teammate result or live provisioning.
- **What I learned or changed:** Hiding a navigation option is insufficient. Backend role checks and session revocation are necessary to keep canteen staff out of academic/student information and keep menu controls out of administration.

## Receipt 2 — Traceable implementation slices

- **What I did:** Defined canteen, classroom and teacher slices with dependencies and completion checks in GitHub Issues, then kept implementation status separate from the plan.
- **Evidence link:** [Week 8 index](README.md), [canteen menu #54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54), [classrooms #57](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/57), [teachers #62](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/62), [planning index commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f9a0fb3).
- **How I checked it:** Reviewed the issue scopes and dependencies with the assistant. No published implementation or independent test is claimed for planned extension slices; unfinished local draft code is not release evidence.
- **What I learned or changed:** The post-midterm feedback calls for one realistic next milestone, so the larger backlog is held outside the current release claim.

## Receipt 3 — Week 8 feedback response and course lesson

- **What I did:** Requested and prepared the shared Week 8 feedback response with coding assistance: course/project lessons, MVP status, evidence links, canonical member inventory and a Week 9 owner/next action.
- **Evidence link:** [Instructor's Team 1 feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/grades-and-feedback/blob/main/Week%208/feedback.md#team-1--studenthub), [shared report](weekly-report.md), [response commit `7998565`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/7998565), [roadmap #65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).
- **How I checked it:** The assistant checked the published course guide/rubric, GitHub commit attribution and local Markdown links. Every enrolled login has an evidence-inventory row, with personal confirmations still marked pending.
- **What I learned or changed:** The [midterm rubric](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/midterm-presentation-rubric.md) values traceable current behaviour over promises. Our working MVP assessment is **still has a gap** until current deployed/repeatable verification is complete.

## Receipt 4 — Repeatable C0 review material

- **What I did:** Added a repeatable local fictional-account review fixture and a non-author test procedure with coding assistance, so another person can run C0 without production credentials.
- **Evidence link:** [Fixture and procedure commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/7998565), [test procedure and pending record](c0-independent-test.md), [19-check assistant rehearsal](evidence/c0-review-fixture-check-2026-10-28.txt).
- **How I checked it:** The assistant built published source snapshot `7387145` using existing installed dependencies and rehearsed 19 API checks. All passed. This was not a cold install, a real database test, an independent teammate check or a live deployment check.
- **What I learned or changed:** Instructions and assistant reruns help prepare a test; the tester's identity, actual results and proof still need to come from a real non-author. The pending fields remain incomplete.

## Receipt 5 — Deployment diagnosis and release gap

- **What I did:** Investigated the unavailable public site with coding assistance and recorded the hosting blocker and the recovery/verification steps instead of claiming a deployed release.
- **Evidence link:** [Public 404 response](evidence/railway-http-check-2026-10-28.txt), [Railway trial-expired screenshot](evidence/railway-trial-expired-2026-10-28.png), [recovery record](deployment-recovery.md), [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).
- **How I checked it:** The assistant observed the public 404 and then the authenticated Railway page showing Trial expired, Service offline, and no active deployment. No payment, upgrade, database change or account creation was performed for this diagnosis.
- **What I learned or changed:** Deployment availability is part of the release evidence. I own the hosting decision and subsequent release check; a successful local build does not resolve expired hosting.

## Remaining work

- Review and confirm this receipt and my own shared-report row.
- Make the hosting decision and verify the deployed commit and C0 path after service restoration.
- Obtain an actual non-author result rather than copying the assistant-run checks into that field.
