# Week 9 Weekly Report — StudentHub

**Team:** Team 1  
**Week:** 9 — October 29 to November 4, 2026  
**Status:** Shared draft for team confirmation

## This week's goal

Turn the current StudentHub evidence and Week 8 lessons into a credible route to the final demo.

The team has revised the project direction toward a middle/high-school StudentHub with school structure, homeroom classes, teacher records, My Class, timetable/conflict checks, and school canteen information.

## What we can prove now

- Existing account/login, academic, timetable and job-search work exists from earlier weeks.
- C0 canteen-head account/workspace behavior has implementation and local assistant-run checks.
- C1 dated daily menu publishing has implementation and local automated checks.
- The new school/homeroom direction is currently a roadmap and design decision, not implemented school functionality.
- Live Railway verification is not currently established; local evidence must not be described as live proof.

## Course lesson

**Lesson:** Planned work, local checks, and live verification are different kinds of evidence.

**What changes because of this:**  
The team will keep roadmap items marked as planned until implementation and actual checks exist. Important behavior will use a non-author test where possible, with the tested version, expected result, actual result and safe proof recorded.

## Project lesson

**Lesson:** The project became too broad when multiple extensions were treated as equally important.

**What changes because of this:**  
The final-demo path will prioritize one thin school journey before optional extensions:

Administrator creates/uses school structure  
→ student is assigned to a homeroom class  
→ homeroom teacher is assigned  
→ student opens My Class  
→ student sees class/teacher/subjects/timetable  
→ student can view the school canteen menu

Teacher conflict prevention and high-school job search remain later/optional until their dependencies are ready.

## Current MVP assessment

**The project still has a gap.**

The existing college-oriented application and canteen work provide reusable implementation, but the new middle/high-school flow is not yet implemented or independently verified.

The smallest credible route is:

1. implement and verify school/class membership;
2. implement and verify homeroom assignment;
3. show the signed-in student's own My Class view;
4. keep canteen behavior as a reusable supporting slice;
5. verify the final path from a repeatable setup.

## Near-term milestones

| Milestone | Owner | Observable check | Evidence to save | Fallback / risk |
|---|---|---|---|---|
| C0 independent verification | `CoderRaaju` | A non-author runs the published local C0 procedure and records expected vs actual behavior | Tested commit, result note, safe screenshots, Issue #61/#65 comment | If any step fails, record first failure and keep criterion incomplete |
| School structure #66 | `bishal482` | Admin can create a year/grade/class and assign a fictional student without auto-mapping college majors | Commit, automated result, safe admin/student proof | Keep legacy data labelled and use fictional school data |
| Homeroom teacher #67 | Team owner to confirm | Admin assigns/reassigns an active teacher with history retained | Issue/commit/test note | Do not begin before #66 and #62 dependencies are ready |
| My Class #68 | Team owner to confirm | Signed-in student sees only their own current class and homeroom teacher | Expected/actual test and screenshot | Keep student isolation as a release gate |

## Individual contribution rows

| GitHub login | Week 9 contribution | Evidence | Next action |
|---|---|---|---|
| `bishal482` (Galan Bishal) | Revised the school-administration scope and implemented C1 with coding assistance; documented the actual assistant-run local rerun and selected S1 class membership/student isolation as my next acceptance target. | [C1 implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5b2fe5a), [planning commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f889b9f), [exact C1 result: 8 passed, 0 failed/skipped](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week9/evidence/c1-local-2026-11-04.txt), [my receipt](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week9/individual-evidence-receipt-galan-bishal.md) | [Freeze/publish S1, review legacy mapping, and obtain a real non-author result](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week9/galan-school-slice.md); [hosting and C1 independent proof remain pending](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week9/galan-c1-local-check.md) |
| `CoderRaaju` | Reviewed Week 9 feedback/course requirements and took ownership of the missing non-author C0 verification result. Prepared this shared-report/roadmap evidence update. | Week 8 C0 procedure, Issues #61/#65, this Week 9 branch/PR | Run C0 independently and replace the pending result with tested commit, expected/actual behavior and safe proof |
| `anshsharma123` | **Pending personal entry.** | Add own evidence link | Add own Week 9 contribution/result |
| `BudhaRajgiri` | **Pending personal entry.** | Add own evidence link | Add own Week 9 contribution/result |

## CoderRaaju C0 result — pending actual run

**Tester:** `CoderRaaju`  
**Role:** Non-author tester  
**Procedure:** `classroom/week8/c0-independent-test.md`

- Exact tested commit: **PENDING**
- Environment: **PENDING**
- Expected result: Canteen-head role/workspace and permission boundaries behave as documented.
- Actual result: **NOT YET RECORDED**
- First failing step: **PENDING**
- Safe proof links: **PENDING**

A planned procedure is not a passed test. Update this section only from the actual run.

## Risks / blockers

| Risk | Owner | Next action |
|---|---|---|
| Live Railway path is not currently proven | `bishal482` | Keep local demo evidence separate; revisit deployment/recovery decision |
| New school model is still planned | `bishal482` / team | Complete #66 before downstream homeroom/My Class claims |
| Independent C0 result still missing | `CoderRaaju` | Run the published procedure and record the result |
| Two member rows still need personal evidence | Each member | Add own row before submission |

## Final-demo promise — working version

> StudentHub will show a school administrator managing a student's class and homeroom-teacher relationship, then the signed-in student viewing only their own class information, subjects, timetable and school canteen information. The demo will use safe fictional data and will not claim unverified live deployment, automatic timetabling, attendance, grades, parent/teacher portals, payments, or automatic job eligibility.

## Week 9 final check

- [x] Current state separated from planned school features.
- [x] Course lesson recorded.
- [x] Project lesson recorded.
- [x] MVP gap stated honestly.
- [x] Near-term milestones include owner/check/evidence/fallback.
- [ ] CoderRaaju actual C0 result attached.
- [ ] Ansh adds personal row.
- [ ] Budha adds personal row.
- [ ] Team confirms/revises the final-demo promise.
