# Week 6 Work Checklist — Test the Vertical Slice

**Date:** Thu 2026-10-08 to Wed 2026-10-14<br>
**Team:** Team 1 — StudentHub

**Selected behavior:** Administrator navigation from Dashboard → Students → Semesters → Courses.

**Current status:** Steps and expected results are prepared. Independent teammate testing is still pending.

## Core work — complete all

### Run one real test

- [x] Choose one small user-visible behavior: administrator navigation.
- [x] Write repeatable steps from the Dashboard in the [Tested-By Note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/test-by-note.md).
- [x] State the expected result: each selected section opens and its navigation item is clearly identified.
- [ ] Ask a teammate other than the author to follow the steps without coaching.
- [ ] Record the actual result, including confusing or missing behavior.
- [ ] If the test fails, record the first failing step and keep the verification Issue incomplete.

### Connect the test to the work

- [ ] Complete the Tested-By Note with the tester, date, actual result, proof, problems, and next action.
- [ ] Update [Issue #44](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44) to match the actual result.
- [x] Identify the [implementation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c7ad189) and [live demo](https://team1-production.up.railway.app/).
- [ ] Record any blocker in GitHub with one owner and a next action.

### Record team and individual evidence

- [ ] Review and publish the single shared Week 6 Weekly Report.
- [ ] Each student confirms their contribution sentence and evidence link.
- [ ] Each student completes and links a Week 6 Individual Evidence Receipt.
- [ ] Check shared evidence for personal data and secrets before publishing.

## Evidence to link

- [x] [Implementation Issue #43](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/43) and [verification Issue #44](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44). Current verification status still needs updating.
- [x] [Administrator navigation commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c7ad189).
- [ ] Completed Tested-By Note with actual results and proof.
- [x] Screenshot or short video supporting the teammate’s test result, with private information hidden: [Admin dashboard evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/admin%20dashboard/good.png).
- [ ] Published shared Weekly Report with confirmed entries from every member.
- [ ] Individual Evidence Receipt from each student.
- [ ] Any bug or blocker Issue with an owner and next action.

## Stretch menu — optional after the core work

### Stronger user test

- [ ] Ask a teammate outside the implementation discussion to test from a clean start.
- [ ] Check one empty, error, loading, or recovery state.
- [x] Define the success signal: Students, Semesters, and Courses each display their matching section and selected navigation state. The teammate must still observe and record this.

### Better technical evidence

- [ ] Add a repeatable smoke test for the selected behavior.
- [ ] Publish the prepared setup guide so another teammate can run the slice.
- [ ] If testing finds a bug, fix it and repeat the same test.

### Better midterm path

- [x] Prepare the first demo steps:
  1. Open StudentHub.
  2. Sign in as an administrator.
  3. Open Students.
  4. Open Semesters.
  5. Open Courses.
- [x] Identify a supported claim: earlier local browser checks covered administrator navigation. An independent Week 6 teammate test is not yet proven.
- [ ] Assign the Week 7 improvement in GitHub: complete a clean-start rehearsal with recorded evidence.

## Risks and exceptions

Proposed owners below must be confirmed and recorded in GitHub.

| Item | Owner | Next action | Review point |
|---|---|---|---|
| Independent test is unfinished | Bal — assign by Galan | Follow the written steps and record actual results | Before closing Issue #44 |
| Test proof is missing | Giri | Attach a screenshot or short video with private information hidden | After the test |
| Contribution entries and receipts need confirmation | Each student | Confirm their row and link their Week 6 receipt | Before report submission |
| GitHub verification status needs review | Galan Bishal | Update Issue #44 according to the recorded result | Before marking the slice complete |

## Final check

- [x] Another teammate has repeated the test using the written steps.
- [x] Evidence supports the claim and the Issue status matches the result.
- [x] The next midterm-demo improvement has an owner and is visible in GitHub.
