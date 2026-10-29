# Weekly Report — Week 8 Midterm Gate reset

**Team:** Team 1 — StudentHub

**Week:** 8 — October 22–28, 2026

**Updated:** October 28, 2026 (Asia/Seoul)

**Preparation:** Prepared for `bishal482` with coding assistance. Evidence inventory is checked against GitHub; personal lessons/contribution confirmations must come from each member. This is the team's single shared Week 8 report.

## This week's goal

> Respond to the [October 26 instructor feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/grades-and-feedback/blob/main/Week%208/feedback.md#team-1--studenthub) with evidence-backed lessons, an honest MVP assessment, and one testable Week 9 milestone. A larger feature backlog is not the deliverable.

## What we committed to do

- [x] Read the Week 8 target and Team 1 follow-up; link the available course materials.
- [x] Record one course lesson and one project lesson with supporting sources.
- [x] Separate presentation material, locally verified C0 behaviour, and planned extensions.
- [x] Record an explicit MVP status and one next milestone with an owner in [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).
- [x] Prepare a repeatable non-author C0 test procedure and a truthful pending result record.
- [ ] Complete the non-author C0 test and attach the actual tester/result/proof.
- [ ] Restore and verify the live deployment and account-provisioning path.
- [ ] Every member personally enters or confirms their own contribution, lesson and next action in this shared report.

## One course lesson

**Lesson:** Feature volume and a polished presentation do not replace evidence of current behaviour. The [midterm rubric, demonstration/evidence/reflection criteria](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/midterm-presentation-rubric.md) rewards a coherent current path, honest boundaries, linked proof and a realistic next action. The [Week 8 student guide](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-week-one-pagers/week-08-2026-10-22-midterm-presentations.md) also asks teams to review feedback and prepare to cut scope.

**Evidence changing our direction:** Our [Week 8 slice index](README.md) is substantial, but the instructor explicitly says it does not establish that the Week 8 lesson/MVP homework or a deployed release is complete.

**Week 9 decision:** Prioritise one accessible, repeatable release check over adding more features. This is an evidence-based response prepared with coding assistance, not an invented quotation or personal reflection attributed to another member.

## One project lesson

**Lesson:** Separating roles is useful only when the backend enforces the boundary, and local passing checks do not establish a working deployment.

**Evidence:** [C0 implementation `fa1be1a`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fa1be1a), [role/session tests](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/fa1be1a/backend/tests/canteen-accounts.test.mjs), and the [October 25 C0 test note](c0-test-note.md) support assistant-run local checking: 30 backend tests, 7 frontend tests, a production build, fictional-account browser checks and a temporary MySQL table check. The note explicitly does not claim independent teammate execution or production account provisioning.

**Current check:** On October 28 the published Railway URL again returned **HTTP 404, `Application not found`**; see the [recorded HTTP response](evidence/railway-http-check-2026-10-28.txt). This confirms the URL is unavailable at this check; it does not identify the cause, establish a billing problem or prove which commit is deployed.

**Later confirmed diagnosis, October 28:** The authenticated Team1 Railway page showed **Trial expired**, **Limited Access**, **Service offline**, and **no active deployment**. See the [dashboard proof](evidence/railway-trial-expired-2026-10-28.png) and [recovery record](deployment-recovery.md). The initial public check alone did not determine this; the private dashboard subsequently established the hosting restriction. No plan change, payment or recovery deployment was made. Galan owns the hosting decision and follow-up verification.

**Procedure rehearsal:** The assistant built the published C0 source snapshot `7387145` with existing installed dependencies and rehearsed the new local review fixture. Its [19 API checks](evidence/c0-review-fixture-check-2026-10-28.txt) passed for login/session restoration, role denial, provisioning validation, disable/enable revocation and logout. This is not a clean-install claim, an independent teammate test, a new full-suite result or a live database/deployment result.

**Week 9 decision:** Diagnose the service/domain/deployment, verify an approved C0 account path, and obtain a non-author result before calling this a verified release.

## What was presented, what is verified, and what is planned

| Boundary | Evidence | What it does and does not prove |
|---|---|---|
| Presentation material | [Uploaded midterm deck](../StudentHub-Midterm-Roles.ppt), [upload commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2619daf) | Documents the prepared academic/job demo and proposed next phase. The file alone does not prove delivery, timing, attendance or a new live test. |
| Published C0 implementation and local checks | [Commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fa1be1a), [test note](c0-test-note.md), [workspace screenshot](evidence/c0-workspace-demo.png), [staff-account screenshot](evidence/c0-staff-access-demo.png) | Proves the scope recorded in the assistant-run checks. Fictional local fixtures are not real production accounts or independent teammate testing. |
| Original academic/job MVP | [Course/timetable issues #39–#40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/40), [jobs #47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/47), [favourites #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/48), [earlier test report](../testing/test-report.md) | Historical implementation and earlier checks exist. Earlier screenshots are not new October 28 verification. |
| Campus Eat menus/hours/availability, Room Finder and Teachers | [#54–#59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54), [#62–#64](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/62) | Extension backlog. Unpublished local draft work is not released functionality or current GitHub implementation evidence. |
| Monetization ideas | [BudhaRajgiri proposal](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f4f588d), [Ansh proposal](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/88feb3e) | Business proposals, not implemented payments, verified market prices or new MVP commitments. Housing/restaurant proposals do not change the agreed classroom/canteen scope. |

## Current MVP status

**Still has a gap.** This is the working assessment from visible evidence, prepared with coding assistance for team review. It is not a grade or a claim that all implemented features are missing.

The original student/admin academic and job workflows have implementation and historical evidence. However, the current public path is unavailable, C0's live provisioning remains unverified, and no non-author C0 result is linked. We cannot call the current release verified or the MVP exceeded. A complete deployed Campus Eat/Room Finder release is not supported by the published evidence.

**Most important gap:** one currently accessible, repeatable release path. The next milestone is in [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65); the larger extension list is on hold for release prioritisation.

## Evidence links

| Evidence | Link |
|---|---|
| Instructor feedback | [Week 8 target, Team 1 and Wednesday finish line](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/grades-and-feedback/blob/main/Week%208/feedback.md) |
| Roadmap / owner | [#65 — one verified release path](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65), owner `bishal482` |
| Implementation / status | [C0 #61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61), [implementation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fa1be1a), [deployment-blocker record](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/48b8720) |
| Reviewable proof | [C0 workspace](evidence/c0-workspace-demo.png), [staff access controls](evidence/c0-staff-access-demo.png), [midterm deck](../StudentHub-Midterm-Roles.ppt) |
| Checked results | [C0 assistant-run note](c0-test-note.md) |
| October 28 bounded checks | [Public HTTP result](evidence/railway-http-check-2026-10-28.txt), [assistant-run local fixture rehearsal](evidence/c0-review-fixture-check-2026-10-28.txt) |
| Confirmed hosting blocker | [Trial-expired dashboard](evidence/railway-trial-expired-2026-10-28.png), [deployment recovery record](deployment-recovery.md) |
| Galan's supporting receipt | [Week 8 Individual Evidence Receipt](INDIVIDUAL_EVIDENCE_RECEIPT.MD), prepared with coding assistance for personal review |
| Independent test | [Procedure and pending result](c0-independent-test.md) — not a passed result |
| Week 8 documentation | [Work checklist](work-checklist.md), [this shared report](weekly-report.md) |
| Live URL | [Railway](https://team1-production.up.railway.app/) — HTTP 404 at the October 28 check; use repository proof for review until restored |

## Individual contribution entries — one shared report

Canonical GitHub logins below match the instructor's roster. These rows are an evidence inventory prepared by the assistant, not four personally authored reflections. Each member must edit/confirm their own sentence, lesson and next action; no independent-test credit is inferred from a commit or presentation upload.

| Canonical login / display name | Current-week work supported by links | Evidence | Personal entry / next action |
|---|---|---|---|
| `bishal482` — Galan Bishal | Directed the C0 role/workspace implementation and planning with coding assistance; local checks and deployment limits were documented. Requested this feedback response. | [C0 implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fa1be1a), [local test note](c0-test-note.md), [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65) | Draft project lesson is above; Galan to confirm his own entry. Owns Railway diagnosis and coordination of the non-author check. |
| `anshsharma123` — Ansh Sharma | Authored October 28 monetization notes and a Week 8 receipt. This is planning/documentation evidence, not a deployed feature or C0 test. | [Commit `88feb3e`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/88feb3e), [self-authored Week 8 receipt](ansh%20individual-evidence-receipt.md), [receipt update](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/7387145) | Receipt contains his reflection on value/revenue proposals. He still needs to personally add/confirm a shared-report lesson and next action, keeping monetization outside the current release gate. |
| `CoderRaaju` — Bal Raju; commit display label `Junior Coder` | Personally confirmed the October 22 presentation cleanup/upload as his work and added a Week 8 evidence receipt. His presentation work supports communication evidence but does not by itself prove the current release. | [Presentation upload](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2619daf), [cleanup](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/16928d9), [Week 8 receipt](raju-individual-evidence-receipt.md) | Course lesson: presentation/feature descriptions must be separated from current verified behaviour. Project lesson: StudentHub still has a deployed/repeatable verification gap. Week 9 action: act as the non-author C0 tester and record the actual result from the published procedure; no PASS is claimed yet. |
| `BudhaRajgiri` — Buddha Raj Giri | Added an October 28 monetization proposal after the instructor's October 26 review. This is new documentation evidence, not C0 execution. | [Commit `f4f588d`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f4f588d), [proposal](../monetizing%20the%20idea/.md) | Personally add/confirm a course/project lesson and concrete Week 9 action. No independent test or implementation contribution is attributed without proof. |

The October 28 authored work above supplements the October 26 review; it does not rewrite what was visible when the instructor reviewed the team.

## Blockers or risks

| Blocker / risk | Owner | Next action / review |
|---|---|---|
| Railway trial expired; service offline and no active deployment. Public URL returns 404. | `bishal482` | Decide whether to restore the Railway plan or approve another host; then check service/database state and verify a published release. No payment or plan change made by the assistant. Review at the October 29 class. |
| No confirmed non-author C0 tester/result. | `bishal482` — coordination; tester not yet confirmed | Ask a non-author member to follow the linked procedure and enter actual results. Keep pending if nobody has run it. |
| Personal shared-report rows are not yet confirmed by all members. | Each canonical login above; `bishal482` coordinates | Each member edits their own row with a lesson, evidence and next action. This prepared inventory is not personal confirmation. |
| Additional feature volume can hide the release gap. | `bishal482` | Preserve unfinished extension work without counting it as a release. Hold the extension milestone until #65's checks pass. |

## Decision record

| Decision | Why | Owner | Evidence |
|---|---|---|---|
| Assess current MVP as having a verification/deployment gap. | Current URL and C0 note do not support a complete live release. | `bishal482`; working assessment for team review | [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65), [C0 note](c0-test-note.md) |
| Make one repeatable release path the Week 9 milestone. | Respond directly to the feedback rather than expanding the feature list. | `bishal482` | [Instructor feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/grades-and-feedback/blob/main/Week%208/feedback.md#team-1--studenthub) |
| Hold menus/rooms/teachers and monetization out of this release claim. | Planned or unpublished work is not verification evidence. Existing draft code is preserved. | `bishal482` | [Backlog index](README.md), [#60](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/60) |
| Use exact GitHub logins and explain display-name differences. | Match evidence to the roster without inventing contributions. | Each member confirms; `bishal482` maintains inventory | Commit links and metadata above |
| Treat expired hosting as the confirmed deployment blocker. | Authenticated dashboard shows Trial expired, Service offline and no active deployment. Code changes alone do not remove that restriction. | `bishal482` owns hosting decision | [Recovery record and screenshot](deployment-recovery.md) |

## Next week's bridge task — October 29 to November 4

- **Owner: `bishal482`.** Restore/identify the live release, verify its deployed commit and perform the approved C0 provisioning/permission path. Success requires linked actual results, not just a successful build.
- **Non-author tester: `CoderRaaju` (Bal Raju).** Follow the published C0 procedure independently and enter date, environment, exact commit, expected/actual result, first failure and safe proof. No PASS is claimed until the test is actually run. Reassess the MVP only after the evidence supports it.

## Feedback and useful-materials audit

| Source | Used for / result |
|---|---|
| [Week 8 feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/grades-and-feedback/blob/main/Week%208/feedback.md) | Target, Team 1 actions, roster and finish line; no invented spoken midterm feedback. |
| [Student guide](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-week-one-pagers/week-08-2026-10-22-midterm-presentations.md) | Current-state evidence and post-midterm scope review. |
| [Weekly Report template](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/templates/weekly-report.md) | One shared report; contribution rows remain inside it. |
| [Evidence Receipt template](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/templates/individual-evidence-receipt.md) | Supporting evidence only; do not substitute separate reports for the shared report. |
| [Midterm rubric](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/midterm-presentation-rubric.md) | Course lesson and honest working/verified/planned boundaries. No invented score. |
| Feedback's `week-08/one-pager.md` and `week-08/work-checklist.md` links | Both returned 404 from the course repository on October 28 and were absent from the inspected main-branch tree. This report uses the available student guide, rubric and instructor feedback instead; it does not claim those unavailable files were read. |

**Submission boundary:** The written reset and source/evidence links are prepared. Live verification, non-author testing and personal entries remain incomplete until real results or member confirmations are added.
