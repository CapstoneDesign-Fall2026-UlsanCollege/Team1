# Week 12 — AI Use and Code Ownership Audit

**Team:** Team 1 — StudentHub  
**Week / sprint / date:** Week 12 · Sprint 3, QA and handoff · November 21, 2026  
**Source:** [Course audit template](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/templates/ai-use-and-code-ownership-audit.md)

Prepared at Galan Bishal's request with Codex assistance. This records permitted assistance and remaining understanding checks; it does not grant permission for AI use in a restricted task. The team owns its submitted code and must understand it.

## AI use notes

| PR / commit / file | AI used? | What AI helped with | What the team reviewed or changed | Review/test evidence |
| --- | --- | --- | --- | --- |
| [ec7392c targeted QA harness](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ec7392ca572aba1560d865bc4ed1c09232f37056) | Yes | Inspected production routes, adapted minimal fixture setup from existing school tests, wrote and ran isolated save/read-back checks | Galan requested Week 12 work. No personal code explanation or non-author harness review has been recorded | [Actual runner, source revision, command and limits](galan-qa-result.md); seven check groups passed; own random schema removed |
| [698292d QA disposition/report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/698292d), [a679f5a Final Demo Roadmap](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/a679f5a), [8e5e42b one-pager/checklist](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/8e5e42b) | Yes | Read course templates and repository evidence; drafted scope, priority, next action and handoff plan | Galan requested these documents; the reports preserve personal-confirmation gaps rather than assert team sign-off | [Shared report](weekly-report.md), [one-pager](one-pager.md), [Final Demo Roadmap](../final-demo-roadmap.md); local file-link/format checks passed |
| [fd9cf3b portrait subject-list toggle](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fd9cf3b) | Yes | Vue state/disclosure controls, portrait CSS, class/year reset; build/regression execution | Galan reported excessive phone scrolling and requested an explicit list button. He later reported good mobile results with no error | [Feedback](galan-iphone-feedback.md); build and 25 frontend tests passed; before-change screenshot is not an after-change test |
| [3792e1e feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/3792e1e), [65e8fe3 screenshot receipt](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/65e8fe3) | Yes | Organized Galan's direct statement and supplied screenshot, keeping evidence limits explicit | Galan supplied the feedback and image. No exact subject/teacher/reload sequence was inferred | [Personal feedback and original-list image](galan-iphone-feedback.md) |
| [Ansh's November 19 retest](ansh-subject-persistence-retest.md) | Yes, as disclosed in his receipt | Organized his written report/evidence links | His receipt attributes iPhone actions, screenshots and reported refresh result to Ansh; this audit does not claim a new test or new confirmation from him | Existing receipt: Discrete Mathematics / Farhan Khan in Grade 6 A persisted |
| This audit | Yes | Compared the course template with the current Week 12 evidence; drafted the update | Galan requested the missing Week 12 audit. Each person still confirms their own explanation, stewardship and AI use | Linked evidence below; documentation preparation is not a human understanding check |
| Other members' Week 12 work | Unconfirmed | No AI-use or no-use declaration is inferred | Bal Raju and Buddha add their own actual use and evidence | [Shared contribution entries](weekly-report.md#individual-entries--confirmation-status-explicit) |

## Codebase area map

The [Week 10 shared area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth) remains the single source of truth; [Week 11 review](../week11/ai-use-and-code-ownership-audit.md) supplies the previous checkpoint. We do not create a competing full map in this weekly file. Stewardship shares context and support; it does not reserve files exclusively.

**Week 12 review:** repository boundaries and accepted stewards/backups have not been shown to change. The relevant health check now includes fresh subject/teacher identifier read-back across sessions/restart, and portrait list show/hide usability. The API result and UI feedback below update the check evidence, not ownership. No backup or proposed co-steward is marked accepted without their confirmation.

## Individual slice and stewardship check

| Student | Roadmap slice: file/function + behavior | Primary area / boundary | Explain status | How checked and by whom | Evidence |
| --- | --- | --- | --- | --- | --- |
| Galan Bishal (@bishal482) | #83 subject persistence through `SchoolSubjectPlanner.vue` / `school-planning.ts`; narrow API harness. Portrait catalogue disclosure through `catalogListOpen` and class/year reset | Existing school/room API stewardship; current admin UI implementation context | Written trace exists. Personal explanation of transaction/read-back and touch/disclosure behavior not yet recorded | Codex ran isolated API checks and build/regressions. Galan reported successful mobile use and supplied the original-list screenshot | [QA result](galan-qa-result.md), [feedback](galan-iphone-feedback.md) |
| Ansh Sharma (@anshsharma123) | Grade 6 A subject/teacher refresh check crossing planner UI and school API | Administrator frontend co-steward remains proposed in shared map; testing is evidenced separately | Procedure/result written; code explanation and stewardship acceptance not established by the test receipt | Ansh's receipt records deployed iPhone Safari actions and screenshots, not this assistant's API execution | [Retest](ansh-subject-persistence-retest.md) |
| Bal Raju (@CoderRaaju) | Proposed canteen publication/availability verification across `canteen-menu.ts` and student menu read | Testing/integration proposal; no new Week 12 acceptance inferred | Own Week 12 slice/explanation/use declaration still needed | Existing Week 11 assistant-run tests and his recorded work remain historical context; no new Week 12 execution attributed | [Earlier assignment/results](../week11/coderraaju-individual-assignment.md) |
| Buddha Raj Giri (@BudhaRajgiri) | Proposed own-class/homeroom review in `StudentSchool.vue` | Student frontend proposal; personal confirmation still needed | Own Week 12 slice/explanation/use declaration still needed | Existing personal Week 11 student reports are linked as history; not relabelled Week 12 work | [Earlier student receipt](../week11/evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) |

## Code we need to rewrite or understand better

| Location / behavior not explained or verified | Owner | Next step and check | Due point |
| --- | --- | --- | --- |
| #83 original deployed combination vs later scoped passes | Galan coordinates | Link exact context/revision and refresh observations if available. Explain how class/term filtering differs from missing persistence. Preserve original failure; fix only a confirmed cause | Nov 25, end of day |
| QA harness and production transaction boundary | Galan; learning partner to confirm | Personally explain fresh revision, rollback, class/offering/teacher links, restart behavior and safe schema cleanup; reviewer repeats or asks a discriminating question | Week 12/13 handoff |
| Portrait subject-list disclosure | Galan; reviewer to confirm | Explain default-closed state, show/hide, aria-expanded/controls and reset on class/year change; check phone opening/closing and assignment still reachable | Next mobile review, before demo lock |
| Individual primary areas, backups and understanding | Each member | Add own slice, actual AI declaration and explain status; name/confirm a support partner rather than infer one from tests | Nov 25 report checkpoint |
| #77 clean setup and hosted teacher/canteen acceptance | Galan coordinates | Complete existing non-author setup and hosted core-role plans; avoid new scope before these release gaps | Week 13 handoff / Week 14 demo lock |

No rewrite is justified solely because a result remains unverified. Diagnose an actual failure before selecting a fix.

## Review notes

- **Expected:** assigned subject and teacher remain linked to the same class/term after read-back; duplicate/stale writes cannot lose or duplicate the relationship. The portrait extra-subject list opens only on demand.
- **Actual:** isolated API check passed seven groups; Ansh's different-combination iPhone retest passed its recorded scope; Galan reported no errors. The screenshot shows the pre-toggle layout, not a post-toggle persistence sequence.
- **Cross-area handoff:** planner submits stable IDs and planning revision → API validates and commits/rolls back → school GET returns subject/link/teacher IDs → frontend filters by selected class/term. Success text alone does not establish saved read-back.
- **Important limits:** no confirmed cause/fix for the original iPhone mismatch, no new exact-context screenshot sequence, no independent review of the new harness and no personally recorded code explanations/backups for this audit.
- **Roadmap/next action:** [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83), [Week 12 checkpoint](roadmap.md), [Final Demo Roadmap](../final-demo-roadmap.md). Keep teacher dashboard core, parents stretch and feature scope frozen.

**Prepared, not team-signed-off.** Each member confirms their own row; this file does not convert assistant execution or another person's evidence into their independent contribution.

## Retrospective receipt correction

At Galan's request, Codex compared his Week 11 receipt with published author metadata, commit diffs and existing test/feature notes. [Review](galan-week11-contribution-review.md) and [inventory](evidence/galan-week11-commit-inventory.json) identify missing original deliveries and correct UTC dates. This adds documentation in Week 12 about older implementation without transferring its date or classmates' authorship. [Current Week 12 individual receipt](individual_work.md) separates new QA/usability/documentation work from the historical supplement. No new runtime execution or grade claim is made by this review.

## Whole-package completion review

Codex also compared all four Week 12 course files and their linked QA, triage, peer, attribution and policy resources with this folder. The resulting [requirements coverage index](README.md#requirements-coverage), [structured bug report](bug-report-83.md), [peer notes](peer-test-notes.md) and [change record](change-record.md) add no new runtime feature or human test. They reconcile Galan’s reported success across current documents, preserve historical evidence, and retain only real acceptance/understanding gaps. Documentation-only verification uses local file-link and formatting checks; no unrelated full-MVP rerun is claimed.

## User-requested empty-school walkthrough — November 21–22

Galan subsequently explicitly requested broader testing from a new empty database through school setup and individual-role actions, with screenshots uploaded under `bishal_check`. Codex used the existing structure-only launcher, created only fictional records through the website, ran the noted API/SQL checks and captured the [step-by-step report](bishal_check/report.md). The 59 main screenshots, two preliminary pictures, raw checks and runner corrections are linked there. This broader run was a separate user-requested task; it does not relabel the earlier bounded Week 12 QA as a full MVP pass. Parent first-password transition was API-tested. Personal explanation, non-author review, physical iPhone and fresh-clone handoff remain separate.
