# Week 9 Work Checklist

**Week:** October 29–November 4, 2026  
**Project:** Team 1 — StudentHub

## Scope and planning

- [x] Revise the product direction for middle and high schools.
- [x] Document the new academic model: school years, grades, homeroom classes, student membership, teachers, and subject assignments.
- [x] Record that a homeroom class is a student group, not a physical classroom.
- [x] Set the implementation order, starting with school structure and student class membership (S1, Issue #66).
- [x] Document migration safeguards: preserve existing records and require explicit mapping; do not infer a school grade from a college major.
- [x] Record classroom-finding and room-booking work as cancelled, not completed.
- [x] Keep job search optional for high-school users; audience gating remains planned.
- [x] Record the hosting decision: continue local development and revisit Railway on November 10.

**Evidence:** [Design Doc v2](design-doc-v2.md) · [Roadmap](roadmap.md)

## C1 daily canteen menu

- [x] Link the C1 implementation and setup documentation.
- [x] Run the local backend build.
- [x] Run the local automated C1 tests: **8 passed, 0 failed, 0 skipped**.
- [x] Record the test environment and note that the database was disposable and test accounts were fictional.
- [x] Record deployment status separately from local test results.
- [ ] Obtain independent/browser verification; the local automated result is not independent proof.
- [ ] Verify a live deployment and database recovery before claiming a release.

**Evidence:** [C1 local check and hosting status](galan-c1-local-check.md) · [Individual evidence receipt](individual-evidence-receipt-galan-bishal.md)

## S1 school-structure slice

- [x] Choose the administrator-to-student class-membership journey as the first school slice.
- [x] Write acceptance checks for class setup, explicit subject links, student membership, My Class isolation, transfers, and unmapped students.
- [x] Document migration examples and stop conditions for reviewing legacy records.
- [x] Identify the owner and evidence expected for the next milestone.
- [ ] Publish the S1 source commit and runnable setup steps.
- [ ] Run and record the actual acceptance checks against that exact version.
- [ ] Arrange a real non-author tester and link their expected/actual results and safe proof.
- [ ] Verify the release, or document and test the local fallback.

**Note:** The S1 acceptance check is planned, not passed. The school features are not claimed as implemented by these planning documents.

**Evidence:** [Chosen school slice and acceptance check](galan-school-slice.md) · [Issue #66](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/66)

## Reporting and evidence

- [x] Prepare an individual evidence receipt linking the work, results, and coding-assistance disclosure.
- [x] Update the contribution row in the existing shared Week 9 report draft (PR #71).
- [ ] Keep pending checks and unverified claims clearly marked as pending.

**Evidence:** [Week 9 README](README.md) · [Individual evidence receipt](individual-evidence-receipt-galan-bishal.md) · [Shared-report PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/pull/71)
