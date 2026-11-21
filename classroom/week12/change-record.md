# Week 12 — Change record, AI use and attribution

November 21, 2026. Uses the fields from the [course PR with AI Use Note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/templates/pr-with-ai-use-note.md) for already committed work. It is not a claim that a new fix PR was opened.

## What changed and why

- [ec7392c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ec7392c): targeted fictional API persistence harness and output, to isolate the boundary behind #83. No runtime fix.
- [fd9cf3b](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fd9cf3b): collapsed extra subject catalogue on portrait phones behind explicit show/hide controls, at Galan's request. Usability within existing behavior, not new school functionality.
- Week 12 report, one-pager, audit, final-demo roadmap and evidence records connect the course deliverable to actual observations, separate runners/scopes and record remaining work.

## How it was checked

Expected: saved subject/teacher IDs survive new reads/login/restart; duplicate/stale requests preserve one relationship. Actual: seven groups passed in an isolated schema, with cleanup. [Protocol](qa-checklist.md), [raw output](evidence/subject-persistence-2026-11-21.txt), [result and exact backend revision](galan-qa-result.md).

List toggle: production build and 25 frontend regressions passed; released asset contained the control. Galan subsequently reported good mobile use, no error. His image records the original long list, not a post-change test sequence. [Feedback](galan-iphone-feedback.md). No additional runtime test was performed merely to create this document. Documentation links and formatting are checked separately.

## AI use note

- [x] AI helped generate or edit code/text.
- **Assistance:** inspected existing source, drafted the harness, Vue/CSS refinement and documents, ran the recorded automated checks and organized supplied human evidence.
- **What Galan reviewed/changed:** requested the school/mobile workflow changes and Week 12 records, marked the phone comparison complete, supplied positive feedback and the before-change image. This is product feedback, not a claimed line-by-line code review.
- **After feedback:** extra lists became explicitly expandable; the evidence record was corrected to label the supplied image before-change and preserve missing exact-context details.
- **Who can explain:** Galan is delivery coordinator and implementation-context owner. Personal code explanation and backup/reviewer acceptance have not been recorded; use the questions in the [audit](ai-use-and-code-ownership-audit.md). Do not mark these understood on another person's behalf.

## Outside-material attribution

| Source / creator | Permission or relevance | How used |
| --- | --- | --- |
| [Course Week 12 materials](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/tree/main/week-12), Capstone Design course staff | Course-provided assignment guidance and templates; no broader licence inferred | Adapted document fields and QA process to this repository; fictional example results were not copied as evidence |
| [Existing school tests](../../backend/tests/school-planning.test.mjs), Team1 repository | Existing project fixture definitions/helpers, not imported outside code | Minimal baseline tables/schema helpers used for the narrow harness; attribution recorded in [QA result](galan-qa-result.md) |
| Galan's supplied screenshot and direct statement | Supplied by requester for this project record | [Before-change image and exact feedback](galan-iphone-feedback.md), with capture/context limits |
| Ansh's own retest receipt/screenshots | Existing teammate-authored repository evidence | Linked and summarized with attribution; no new actions or approval asserted |

No external production code, stock media or new dependency was added for the Week 12 QA package. This does not assert a repository-wide licence audit.

## Privacy and posting check

Follow the [project work policy](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/project-work-policy.md). The targeted harness generates its own password and schema, does not print credentials/cookies and does not select application DB_NAME. Published output contains pass/cleanup statements, not dumps. Commands use a placeholder private env path. Current documents link existing receipts rather than copying private configurations or real school data. Screenshots must be reviewed for sensitive values before any new upload.

This review covers the Week 12 changes, not Git history or the entire repository. Do not publish real student IDs, contact details, grades, messages or credentials; use approved fictional/anonymized data.

## Evidence and disposition

[Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83), [bug report](bug-report-83.md), [peer summary](peer-test-notes.md), [shared report](weekly-report.md), [AI audit](ai-use-and-code-ownership-audit.md). The supported API/peer scopes passed; original-condition closure and personal confirmations remain bounded follow-ups. No fix PR, new bug or blocker was created to fill a quota.
