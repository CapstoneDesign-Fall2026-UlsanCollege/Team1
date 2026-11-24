# Galan Bishal — Week 12 QA result

**Date:** November 21, 2026 · **Runner:** Codex, at Galan's request; not a human or non-author test.

**Follow-up updated November 25:** the original API result below remains unchanged. Galan has since completed a scoped physical-iPhone Safari check; its results and limits are separated below rather than attributed to the API runner.

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

**Owner:** Galan. **Support:** Ansh supplied existing peer evidence; further testing is proposed, not claimed agreed. The November 25 checks below now supply deployment proof, original named-context existing-record read-back and a personal new-assignment Safari result. Exact phone-run revision/record IDs and the original-combination creation sequence remain unestablished. Keep #83 open for that bounded acceptance review; do not alter real school assignments solely to manufacture evidence. No new runtime defect or fix is established.

## November 25 follow-up — actual checks

| Runner / environment | Context and actual result | Evidence / limit |
| --- | --- | --- |
| Codex / Railway dashboard | Active deployment `26931a93-35cb-4fd3-a940-5cafa1146f51`, source `07b49264829ee6878c6d32dd307c04d5c7e286d9`, verified from deployment Details commit link | [Provider proof and receipt](nov25-feedback-follow-up.md#verified-deployment); this is the observed revision at inspection, not an assertion about later deployments or the phone run |
| Codex / deployed desktop browser | Mahendra School, 2026–2027, Grade 6 A / Room 101, School term 2026–2027: existing Moral Education / Hari Adhikari remained after full reload and explicit class reselection | [Steps and after-refresh picture](nov25-feedback-follow-up.md#original-named-context--existing-record-check); no school records changed and no new-assignment save was performed |
| Galan / physical iPhone Safari | Existing Moral Education / Hari Adhikari remained after his guided refresh check | [Personal result and supplied picture](nov25-feedback-follow-up.md#galans-physical-iphone-follow-up); class context comes from the conversation, not the cropped picture |
| Galan / physical iPhone Safari | Created New01 (code New subject), selected Gita Gurung T07, changed teacher to displayed name ibib, placed Sunday 10–11 AM, then confirmed both class assignment and lesson remained after refresh | [Six ordered pictures and explanation](nov25-feedback-follow-up.md#galans-new-subject-sequence--iphone-safari); after-refresh class list is pictured, timetable persistence is explicitly reported without a separate after-refresh timetable picture |

Galan reported a scheduling collision made Gita Gurung unavailable; the pictures show teacher selection/change but not the conflict message. This is a changed subject/teacher combination from the original failure. The iOS version, exact phone-run deployment SHA and original record IDs are not established. Galan's personal execution is not an independent non-author retest, and no general fix or full live acceptance is claimed. The scoped new-assignment phone check is complete; the remaining issue acceptance is separate.

These follow-up results are also linked from [individual evidence](individual-evidence.md), the [shared report](weekly-report.md) and [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83).

## Repeat from PowerShell

Prerequisites: run from the repository root, Node/npm dependencies installed in `backend`, MySQL accessible with an account permitted to create/drop a disposable schema, and an existing private environment file. Replace the example private path; never commit it or its contents.

```powershell
npm run build --prefix backend
node --env-file="C:/private/studenthub.env" classroom/week12/subject-persistence-check.mjs
```

The script ignores application `DB_NAME`, generates and validates its own schema name, uses fictional credentials and removes its own schema in `finally`. It calls the production application factory. No Railway data was changed. This test does not cover browser touch events, frontend filters or the active deployed database.

## AI use and ownership

Codex inspected the existing production routes, reused the minimal fixture table definitions and schema helpers from the repository's school integration tests, wrote the narrow harness, built the backend and executed it. No outside code or course example was presented as project evidence. Galan requested this work; his personal explanation/review and any new non-author retest remain for the people involved to confirm.
