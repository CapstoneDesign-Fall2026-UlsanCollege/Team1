# Galan Bishal — Week 12 QA result

**Date:** November 21, 2026 · **Runner:** Codex, at Galan's request; not a human or non-author test.

## Exact scope and evidence

Production backend source was unchanged at `dc7d4e427a9a0ee69fdd68e17e07ef0ef07114bd`. The test harness, pre-run protocol and actual output are committed in [ec7392c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ec7392ca572aba1560d865bc4ed1c09232f37056). The starting worktree was clean before these Week 12 additions. No runtime fix was made or inferred.

- [Pre-run QA conditions](qa-checklist.md).
- [Executable targeted check](subject-persistence-check.mjs).
- [Raw actual output](evidence/subject-persistence-2026-11-21.txt).
- [Week 11 failure](../week11/ansh-iphone-subject-persistence.md).
- [Ansh's November 19 iPhone retest and screenshots](ansh-subject-persistence-retest.md).

## Actual result

Seven assertions/check groups passed: creation, fresh API read, duplicate rejection/read-back, stale-revision rejection/read-back, new administrator session, application restart/login and direct SQL relationship checks. Duplicate and stale requests returned HTTP 409. Exactly one offering/class link remained with the same teacher ID; duplicate insertion left no extra offering. Cleanup completed and the process exited successfully.

**Disposition: scoped API persistence all-clear.** This local fixture did not reproduce a persistence defect. It is not a fix verification for the original deployed Safari observation. The fixture uses the original subject name and a fictional teacher with the original teacher's name; those are not the original production IDs or data.

## Triage and next action

**Affected boundary:** `SchoolSubjectPlanner.vue` → subject POST and school GET in `school-planning.ts` → MySQL class/offering/teacher links. [Shared area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth).

**Historical severity:** Major, because a reported successful assignment vanished after refresh. **Current work priority:** P2 for the discriminating reliability check, consistent with Ansh's current scoped pass. No new reproduced defect supports raising it to P0/P1. The earlier failure remains unresolved evidence; P2 does not mean closed or universally fixed.

**Owner:** Galan. **Support:** Ansh supplied existing peer evidence; further testing is proposed, not claimed agreed. Before November 25 end of day, identify the deployed revision, school/year/class/term and exact subject/teacher IDs on both sides of refresh, and repeat the original combination if safely available. A mismatch should be repeated once and linked from #83; a changed context should be recorded rather than called data loss. If a test fixture is unavailable, record that real access/setup limit and its recovery owner. Do not alter real school assignments to manufacture evidence.

## Repeat from PowerShell

Prerequisites: run from the repository root, Node/npm dependencies installed in `backend`, MySQL accessible with an account permitted to create/drop a disposable schema, and an existing private environment file. Replace the example private path; never commit it or its contents.

```powershell
npm run build --prefix backend
node --env-file="C:/private/studenthub.env" classroom/week12/subject-persistence-check.mjs
```

The script ignores application `DB_NAME`, generates and validates its own schema name, uses fictional credentials and removes its own schema in `finally`. It calls the production application factory. No Railway data was changed. This test does not cover browser touch events, frontend filters or the active deployed database.

## AI use and ownership

Codex inspected the existing production routes, reused the minimal fixture table definitions and schema helpers from the repository's school integration tests, wrote the narrow harness, built the backend and executed it. No outside code or course example was presented as project evidence. Galan requested this work; his personal explanation/review and any new non-author retest remain for the people involved to confirm.
