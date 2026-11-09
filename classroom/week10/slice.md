# Week 10 – Team 1  Own a Slice, Steward an Area

**Team:** Team 1  
**Project:** Student Life Hub  
**Week:** 10  
**Date:** 2026-11-05


## 1. Team Responsibilities

Our team is developing Student Life Hub, a platform that provides useful academic and student services in one place.

Each team member contributes to a specific feature or project area while supporting shared development, documentation, and testing.

| Team member | Main responsibility | Area stewardship |
|---|---|---|
| Galan Bishal (@bishal482) | School/class foundation, dashboard and membership UX, subject planner/popups, specialist teacher routines, room allocation/bookings and teacher availability; existing C1 daily menu | Owns implementation/data-preservation and check evidence for these changes, with coding assistance; [Detailed receipts](individual-evidence-receipt-galan-bishal.md), [published source](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae), [actual checks](school-release-check.md). Student My Class follow-up ownership remains separate below. |
| Bal Raju | Confirm current GitHub issue assignment | Related feature documentation and testing |
| Ansh Sharma | Confirm current GitHub issue assignment | Related feature documentation and testing |
| Buddha Raj Giri (BudhaRajgiri) | [#68 – Student My Class View](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68) | Student frontend documentation and project evidence |

## 2. Roadmap Slices – Team Ownership

The team is tracking these additional project functions:

- [**#66 – School Years, Grades and Homeroom Class Membership**](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66): Manage school years, grades, and student class membership.
- [**#67 – Homeroom Teacher Management**](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/67): Assign and manage homeroom teachers.
- [**#68 – Student My Class View**](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68): Allow students to see their assigned class and homeroom teacher.
- [**#69 – Optional Job Search**](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/69): Keep Job Search optional for high-school users.
- [**#70 – School Administration Overview**](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/70): Provide administrators with an overview and useful task shortcuts.

Each issue should have a confirmed responsible owner, implementation evidence, and a teammate who can independently check the result.

**Roadmap clarification:** Available Classrooms (#57–59) has been removed. Issues [#66–#70](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66) are separately added functions; they are not direct replacements for #57–59.

## 3. Area Stewardship

Use the [current team audit](ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth) for real boundaries, stewards, support/backup status and area checks. It is the source of truth; role proposals there require personal confirmation and do not restrict who can change code. [Current roadmap milestone](roadmap.md).

## November 9 evidence reconciliation

This update preserves the original responsibility proposals below. Galan delivered the student homeroom/Home work in #76; this is not a contribution claim for Buddha. Bal Raju (@CoderRaaju) independently tested the local C0 account fixture and wrote the [November 9 result](../week8/c0-independent-test.md#tester-owned-result-record). His proposed testing stewardship/backup role still needs confirmation. See the [current audit](ai-use-and-code-ownership-audit.md) and [shared report](weekly-report.md) for role gaps.

## 4. Team Checks

Use these checks to verify project behavior. Record actual results before marking any check as passed.

| Feature | Expected result | Actual result / status |
|---|---|---|
| School years and grades | Correct school year and grade information is available | Locally checked; [school evidence](school-release-check.md). Independent current review pending. |
| Homeroom membership | Students are assigned to the correct class | Local transaction/roster checks recorded in [workspace evidence](school-workspace-usability.md); independent review pending. |
| Teacher management | Teachers can be assigned to the correct homeroom | Local Sunday 10 AM homeroom display and compact teacher checks recorded in [workspace evidence](school-workspace-usability.md); independent review pending. |
| [Student My Class (#68)](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68) | Students can see their class and assigned teacher | Implemented locally by Galan in #76; [student checks](student-dashboard-check.md). Independent review pending. |
| Optional Job Search | High-school users can access Job Search when enabled | Pending verification |
| School administration | Administrators can view useful school information and shortcuts | Local [workspace checks and proof](school-workspace-usability.md) recorded; independent review pending. |
| Campus Eat | Canteen menu information is displayed correctly | Local [menu lifecycle checks](canteen-owner-check.md) and [student publication-privacy checks](student-dashboard-check.md) recorded; independent full menu review pending. C0 account verification is a separate passed fixture. |
| Deployment | Live website loads and important features work | Pending verification |

## 5. Evidence Collection

The team will collect and organize:

- GitHub issue links for each feature, including [Issue #68](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68).
- Pull request and commit links.
- Screenshots of completed interfaces.
- Frontend and backend implementation evidence.
- Test cases with expected and actual results.
- Deployment and live-site verification evidence.
- Weekly progress reports.

Evidence must show what was actually implemented and tested. Add links and screenshots beside the relevant issue or report entry.

## 6. Backup and Teammate Handoff

Every major feature should have a backup teammate who can understand and repeat the verification.

The team will:

- Share relevant file locations.
- Provide GitHub issue and pull request links, including [Issue #68](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68) for Student My Class.
- Explain the expected feature behavior.
- Share testing instructions.
- Ask another teammate to reproduce important checks.
- Record unresolved issues and handoff notes.

A feature should not depend on only one person understanding its implementation.

## 7. Next Actions

| Responsibility | Next action |
|---|---|
| Galan Bishal | Continue school/homeroom and canteen work; record actual local checks and evidence |
| Bal Raju | Confirm assigned GitHub slice; review implementation and add evidence |
| Ansh Sharma | Confirm assigned GitHub slice; review implementation and add evidence |
| Buddha Raj Giri (BudhaRajgiri) | Review [Issue #68](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/68), identify related files, verify the My Class page, and record screenshots and results |
| Whole team | Review [Issues #66–#70](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66), coordinate testing, update weekly documentation, and prepare the final demonstration |

## 8. Open Questions and Limitations

- Are all five additional functions implemented?
- Can students see the correct homeroom information?
- Can teachers be assigned correctly?
- Does Job Search remain optional for high-school users?
- Can administrators access the school overview?
- Have important features been independently tested?
- Does the live website work correctly?

These questions remain open until the team collects actual evidence.

## 9. Week 10 Team Goal

Our goal is to make Student Life Hub more complete, reliable, and easy to demonstrate.

We will focus on clear individual ownership, shared area stewardship, independent testing, organized evidence, and coordination between team members.

### Definition of Done

- [ ] Each feature has a confirmed owner.
- [ ] Each project area has a documented steward and backup.
- [ ] Expected behavior is documented.
- [ ] Testing is completed and actual results are recorded.
- [ ] Screenshots and GitHub links are attached.
- [ ] Teammates can independently repeat important checks.
- [ ] Remaining problems have an owner and next action.

## Galan — focused ownership and handoff

My selected proof target is **save a valid special-room booking or reject a recorded conflict**, within [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72). My stewarded area is the school room-booking API. [Actual file map, code explanation, expected/observed cases, rerun commands and AI/handoff notes](code-ownership-galan.md). Backup and independent verifier remain unconfirmed; this does not assign new work to another student. The broader responsibilities above remain a team inventory, not one giant slice.
