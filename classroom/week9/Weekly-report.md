# Weekly Report — Week 9: School Pivot and Evidence-Based Milestones

**Team:** Team 1 — StudentHub  
**Week:** 9 — October 29–November 4, 2026  
**Updated:** November 4, 2026  
**Preparation note:** This draft is based on linked repository evidence. The C1 automated check was run by a coding assistant on Galan’s behalf; it is not an independent test. Each member must personally confirm their own contribution, lesson, and next action before final submission.

## This week’s goal

> Respond to Week 9 feedback by choosing a focused middle/high-school project direction, stating what the current MVP can and cannot prove, linking actual check results, and assigning owners and observable checks for the next milestone.

## What we committed to do

- [x] Revise the product direction for middle and high schools.
- [x] Define school years, grades, homeroom classes, student membership, teachers, and subject assignments in the design.
- [x] Clarify that a homeroom class is a student group, not a physical classroom.
- [x] Mark classroom-finding and room-booking work as cancelled, not completed.
- [x] Set the first school implementation slice: school structure and student class membership (#66).
- [x] Record migration safeguards, including explicit mapping and no automatic conversion from college major to school grade.
- [x] Record the hosting decision: continue local development and revisit Railway on November 10.
- [x] Link the C1 local check result and clearly separate it from browser, independent, and live-deployment verification.
- [x] Record Galan Bishal’s Week 9 work and next S1 milestone in the shared-report draft.
- [ ] Obtain an independent/browser check of C1.
- [ ] Publish the S1 source commit and runnable setup steps, then run its acceptance checks against that exact version.
- [ ] Obtain a real non-author S1 test result.
- [ ] Verify a live release or document and test the local fallback.
- [ ] Have every member personally add or confirm their own Week 9 contribution row.

## One course lesson

**Lesson:** A roadmap and a local test result are useful evidence, but they do not prove that a new school workflow is implemented, independently tested, or working in a live deployment.

**How this affected our work:** We separated the school design and migration plan from implemented functionality. We also recorded the exact C1 local test result separately from its pending browser and live checks.

**Week 10 application:** Focus on one small school workflow with a named owner, runnable source, observable acceptance criteria, and saved results. Each member should add their own evidence and reflection rather than relying on a team-level summary.

## One project lesson

**Lesson:** Reusing existing college accounts and timetable features does not automatically make them safe for a school setting. Student class membership must be explicit, and student data access must be checked against the signed-in student’s own membership.

**Evidence:** The [Design Doc v2](design-doc-v2.md) describes additive migration safeguards and class-scoped permissions. Galan’s [S1 acceptance plan](galan-school-slice.md) includes class isolation, forged-ID, transfer-history, and unmapped-student checks.

**Current limitation:** The S1 acceptance plan is planned, not passed. The new school features are not claimed as implemented by the planning documents.

## What we changed, checked, and planned

| Area | Status this week | Evidence and limits |
|---|---|---|
| Product direction | Revised to middle/high-school administration with grades, homeroom groups, student membership, teachers, and subjects. | [Design Doc v2](design-doc-v2.md) and [roadmap](roadmap.md) document the direction; they are plans, not proof of completed school functionality. |
| Scope control | Classroom finding and room-booking work are marked cancelled, not completed. | [Week 9 README](README.md) and [Design Doc v2](design-doc-v2.md). |
| C1 daily canteen menu | Local backend build succeeded; **8 automated checks passed, 0 failed, 0 skipped**. | [Exact local check record](galan-c1-local-check.md) and [test output](evidence/c1-local-2026-11-04.txt). Assistant-run against disposable local MySQL with fictional accounts; not independent/browser or live proof. |
| Hosting | Live release remains unverified. Railway purchase/recovery was not performed this week; revisit on November 10. | [C1 hosting status](galan-c1-local-check.md) and [roadmap](roadmap.md). |
| S1 school structure | One administrator-to-student class-membership journey and acceptance checks were defined. | [S1 slice and acceptance plan](galan-school-slice.md), [Issue #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66). Plan only: source commit and actual acceptance run remain pending. |

## Current MVP status

**The MVP still has a verification and delivery gap.** The current evidence supports a C1 local automated check and a defined school-design direction. It does not establish a working live release, independent C1 verification, or a completed school/class-membership workflow.

The next school milestone is S1: an administrator explicitly assigns a fictional student to a grade and class, links the reviewed term and subject, and the student sees only their own class information in My Class. The [acceptance plan](galan-school-slice.md) defines the intended checks, but they remain pending until run against a published source version.

## Evidence links

| Evidence | Link |
|---|---|
| Week 9 folder and scope | [README](README.md) |
| Revised school design | [Design Doc v2](design-doc-v2.md) |
| Revised implementation order | [Roadmap](roadmap.md) |
| Week 9 work checklist | [Work checklist](work-checklist.md) |
| C1 local result and hosting status | [Galan’s C1 check record](galan-c1-local-check.md) |
| C1 automated test output | [8-check result](evidence/c1-local-2026-11-04.txt) |
| S1 chosen journey and acceptance plan | [Galan’s S1 slice](galan-school-slice.md) |
| S1 implementation issue | [Issue #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66) |
| Galan’s supporting contribution receipt | [Individual evidence receipt](individual-evidence-receipt-galan-bishal.md) |
| Shared-report draft | [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/pull/71) |

## Individual contribution entries — one shared report

The rows below are an evidence-based draft, not a substitute for each member’s own confirmation. Add or correct each row with the member’s actual work, evidence, lesson, and next action.

| Canonical login / name | Week 9 contribution supported by current evidence | Evidence | Personal confirmation / next action |
|---|---|---|---|
| `bishal482` — Galan Bishal | Implemented the C1 daily canteen menu work with coding assistance; recorded the assistant-run local result and hosting limits; revised the school direction and migration safeguards; selected the S1 class-membership journey and wrote its acceptance plan. | [C1 check](galan-c1-local-check.md), [individual receipt](individual-evidence-receipt-galan-bishal.md), [S1 plan](galan-school-slice.md), [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/pull/71) | Galan to confirm this entry and continue S1 source/setup, exact-version checks, and tester coordination. |
| `anshsharma123` — Ansh Sharma | Prepared the Week 9 work checklist, documented the school pivot and S1 milestone plan, and created the Week 9 report scaffolding. I recorded the project direction, migration safeguards, hosting decision, and remaining verification tasks for the team. | [Week 9 work checklist](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week9/work-checklist.md), [commit `cc0ca788ad131f2ea08dcb1b550bae90bd504eed`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/cc0ca788ad131f2ea08dcb1b550bae90bd504eed), [Week 9 report file](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week9/Weekly-report.md), [commit `3ffc038f7220af4fa00113090c6d8c44f3463fa9`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/3ffc038f7220af4fa00113090c6d8c44f3463fa9) | **Lesson:** A checklist and planning evidence are useful, but they do not replace independent verification of a feature or a live deployment. **Next action:** Own a non-author C1 browser check, record the exact version/setup and actual result, and link safe proof; keep it marked pending until completed. |
| `CoderRaaju` — Bal Raju | Current Week 9 evidence and a new Week 9 test result still need confirmation. The earlier C0 test plan is not a test result. | Add a link to personally completed Week 9 work or a tester-authored result. | Add your own contribution and lesson. If testing, record the exact version, setup, expected/actual results, and safe proof. |
| `BudhaRajgiri` — Buddha Raj Giri | No attributable Week 9 contribution row is confirmed in the current evidence. | Add a link to personally completed Week 9 work. | Add your own contribution, lesson, and next action—or state the task you will own and its planned check. |

## Blockers and risks

| Blocker / risk | Owner | Next action |
|---|---|---|
| S1 school features are planned but not yet shown as a published, tested workflow. | `bishal482` | Publish the S1 source commit and runnable setup steps, then run the acceptance checks against that exact version. |
| No independent S1 test result is recorded. | `bishal482` coordinates; tester not confirmed | Arrange a real non-author tester and link their expected/actual results and safe proof. |
| C1 has local automated checks but no independent/browser or live verification. | `bishal482`; tester to be confirmed | Run the documented browser procedure with approved fictional accounts and record the actual outcome. |
| Live deployment and database recovery are unverified. | `bishal482` | Continue local development; revisit Railway on November 10. Verify the original data and recovery path before any restoration or import. |
| Some members’ personal Week 9 entries are missing or unconfirmed. | Each member; `bishal482` coordinates | Each member edits and confirms their own row with a direct evidence link and next action. |
| Legacy college records could be mapped incorrectly or expose cross-class data. | `bishal482` for S1; team to review | Preserve existing records, use explicit mapping, and test student isolation; never infer a school grade from a college major. |

## Decisions

| Decision | Why | Evidence |
|---|---|---|
| Focus the product direction on middle/high-school administration. | Establish a bounded target and school academic model. | [Design Doc v2](design-doc-v2.md) |
| Start implementation with school structure and student class membership (S1). | This is the prerequisite for safe homeroom and My Class workflows. | [Issue #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66), [S1 acceptance plan](galan-school-slice.md) |
| Treat homeroom as a student group, not a physical room. | Avoid mixing school class membership with the cancelled room-finding scope. | [Design Doc v2](design-doc-v2.md), [roadmap](roadmap.md) |
| Keep classroom-finding and room-booking work cancelled, not completed. | The current product direction does not include that work. | [Week 9 README](README.md) |
| Continue local development and revisit Railway on November 10. | No live deployment or database recovery was verified this week. | [Roadmap](roadmap.md), [C1 hosting status](galan-c1-local-check.md) |
| Report the C1 result as a local assistant-run check only. | The test result does not establish independent, browser, or live behavior. | [C1 check record](galan-c1-local-check.md) |

## Next week’s bridge task — Week 10

- **Owner: `bishal482`.** Publish the S1 source and runnable setup steps for the administrator-to-student class-membership journey. Link the exact commit and setup in [Issue #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66).
- **Check:** Run the S1 acceptance steps against that exact commit, including class membership persistence, student class isolation, forged-ID denial, transfers/history, and the unmapped-student state. Record actual results; leave failed or unrun steps unchecked.
- **Independent verification:** Arrange a non-author tester. The tester should record their own setup, source version, expected/actual results, failures, and safe proof.
- **Fallback:** If the live host is unavailable, document and test a repeatable local setup, and label the result as local—not as a live release.
- **Team:** Each member adds or confirms their own Week 9 contribution row in the shared report.

**Submission boundary:** The design direction, C1 local result, and S1 acceptance plan are documented. Independent C1 verification, S1 implementation/acceptance results, live deployment verification, and unconfirmed personal entries remain pending.
