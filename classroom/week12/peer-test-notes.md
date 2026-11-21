# Week 12 — Peer test notes and handoff status

**Project:** StudentHub · **Source test:** Ansh Sharma, November 19, 2026  
**This summary:** November 21, 2026, prepared with AI assistance from [Ansh's own receipt](ansh-subject-persistence-retest.md). It records an existing test, not a second execution or new statement by Ansh.

## What was tried

1. On deployed iPhone 16 Pro / reported iOS 27.0.1 / Safari, open Grade 6 A (Room 101).
2. Assign Discrete Mathematics to Farhan Khan (T06), confirm it appears.
3. Refresh Safari and check the class-subject list.

**Expected:** same subject/teacher remains. **Recorded actual:** scoped pass; it remained. [Before confirmation](evidence/ansh-subject-persistence-retest/01-assignment-form.jpg), [after save](evidence/ansh-subject-persistence-retest/02-saved-before-refresh.jpg), [after reported refresh](evidence/ansh-subject-persistence-retest/03-present-after-refresh.jpg).

## Area map and handoff

- Followed boundary: administrator planner UI, school API and saved subject/teacher relationships.
- [Shared map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth); [current understanding review](ai-use-and-code-ownership-audit.md).
- Ansh supplied non-author physical-phone evidence. His receipt does not state whether he found the check unaided, received coaching or used a clean setup. Those conditions remain unknown.
- Dependency: a useful comparison needs the same class/term and stable subject/teacher identities. The tested combination differs from the original Moral Education / Hari Adhikari failure.

## What worked and what remains unclear

The recorded assignment was visible after refresh. The original failure was not reproduced in this scope. The earlier evidence remains linked; no code-level explanation, deployed revision or exact original-combination pass is established by these screenshots.

No new bug is attributed to Ansh here. Historical Major severity and current P2 follow-up are explained in the [bug report](bug-report-83.md). Galan's subsequent [no-error feedback](galan-iphone-feedback.md) is separate personal evidence, not a non-author execution of this test.

**Useful next check:** preserve class/term and subject/teacher identifiers around refresh and record the deployed revision. This distinguishes a context/filter change from an actually missing persisted relationship.

## Tested-by summary

The claimed working behavior is limited to Ansh's recorded combination and device. For local API persistence, the runner was Codex, not Ansh. [Exact API runner/proof](galan-qa-result.md). This section supplies the course Tested-By fields without inventing a new test note signed by another person.

## Week 13 handoff trial — not yet run

Galan prepares the documented access/setup path; non-author tester must confirm participation. Planned check: fresh clone at an identified commit, private configuration, isolated empty DB and first-admin login, then one written task without coaching. Record first failure or success and missing instructions in planned `classroom/week13/handoff-trial.md`. [#77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77), [Final Demo Roadmap](../final-demo-roadmap.md). Existing iPhone use does not substitute for that trial.
