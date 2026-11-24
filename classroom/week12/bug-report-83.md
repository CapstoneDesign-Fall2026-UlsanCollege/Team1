# Bug report — #83 subject assignment missing after refresh

**Updated:** November 21, 2026 · **Issue:** [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83)  
Structured from the [course Bug Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/templates/bug-report.md), using existing observations rather than a new invented reproduction.

## Summary

On November 15, Ansh reported Moral Education / Hari Adhikari appearing after assignment to Grade 6 A on the deployed iPhone Safari site, then disappearing after refresh. The original root cause remains unestablished; later evidence includes scoped passes.

## Priority — work order

**P2 — Important**, for the current discriminating reliability/closure check. Ansh's November 19 different-combination retest passed and the November 21 local API boundary passed. There is no new reproduced failure that establishes a current blocked core path. This follows the [priority guide](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/issue-priority-guide.md); it does not reduce historical severity or establish a universal fix. Inherited P1 setup/live acceptance gaps remain ahead of polish.

## Affected area and support

`frontend/src/components/SchoolSubjectPlanner.vue` → subject POST / school GET in `backend/src/school-planning.ts` → MySQL class/offering/teacher links. These are affected boundaries to inspect, not a diagnosed faulty file.

**Owner:** Galan. **Peer evidence:** Ansh; additional participation must be confirmed by him. [Shared area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth), [Week 12 audit](ai-use-and-code-ownership-audit.md).

## Severity

**Major — historical observed impact.** A required saved-looking assignment disappeared from the refreshed list. No fresh failure was reproduced in the Week 12 scopes below.

## Original reproduction steps and result

1. On deployed iPhone Safari, open Grade 6 A, Subjects & timetable.
2. Select Moral Education and Hari Adhikari, and confirm assignment.
3. Observe it in Class subjects; refresh Safari and inspect the complete list.

**Expected:** the same assignment remains. **Reported actual:** Moral Education was absent; six other saved subjects remained. [Original note and five screenshots](../week11/ansh-iphone-subject-persistence.md). Do not assume the same revision/database/context from a later run.

## November 25 follow-up

[Live deployment and original named-context receipt](nov25-feedback-follow-up.md): Railway source 07b4926 confirmed from provider Details. Existing Moral Education / Hari Adhikari in Grade 6 A remained after full reload; no new assignment or physical-phone repeat was performed. #83's stale phone checklist was reconciled with Ansh's completed scoped pass. The remaining acceptance concerns the original creation sequence on physical iPhone, using an agreed safe fixture.

## Current proof and disposition

| Evidence | Actual result | Limit |
| --- | --- | --- |
| [Ansh November 19 note](ansh-subject-persistence-retest.md) | Discrete Mathematics / Farhan Khan in Grade 6 A persisted after refresh | Different subject/teacher; deployed revision not supplied |
| [November 21 isolated API result](galan-qa-result.md) | Seven groups passed, including new session/restart, conflict rollback and SQL read-back | Codex-run fictional fixture; no Safari/UI or production-record proof |
| [Galan's direct feedback](galan-iphone-feedback.md) | Reports good mobile result, no error and reduced lists | No exact combination or explicit refresh sequence supplied; linked image shows pre-toggle list |

**Disposition:** no new demonstrated runtime cause to fix; scoped passes and personal positive feedback coexist with unresolved exact-context closure evidence. Keep the original failure visible and #83 open pending acceptance review. Do not file a duplicate bug or manufacture a fix.

## Owner / next action and Definition of Done

Galan coordinates the next disposition by November 25 end of day:

- [x] Original steps, expected/actual and proof preserved.
- [x] Current peer/API/personal results linked with distinct scopes.
- [x] Owner, affected boundary, historical severity and current P-level explained separately.
- [ ] Supply any existing exact-context receipt with revision, selected class/term and subject/teacher, and refresh/read-back result; if unavailable, arrange the smallest safe check and record its actual outcome.
- [ ] Review #83's acceptance against that outcome. If failure repeats, record it and fix/retest the demonstrated cause; if it passes, state the tested scope before closure.

No unobserved setup blocker, non-author retest or fix is claimed. Prepared with AI assistance from the linked evidence; no new personal execution is attributed to a teammate.
