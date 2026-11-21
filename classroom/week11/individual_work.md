# Individual Evidence Receipt — Galan Bishal

**Student:** Galan Bishal (@bishal482)<br>
**Team:** Team 1 — StudentHub<br>
**Week:** 11 · November 12-19, 2026<br>
**Updated:** November 21, 2026 — retrospective supplement; original receipt prepared November 18

Supporting evidence for my work in the Week 11 contribution report. The original selection below focuses on November 16–18. The November 21 review identified additional November 12–16 work and corrected the original table’s UTC dates from Git author metadata. All implementation and assistant-run checks retain their original dates; this is a retrospective documentation update, not new Week 11 execution.

**Full supplement:** [Week 11 omissions review and Week 12 continuation](../week12/galan-week11-contribution-review.md), with original commits, evidence, limits and a machine-readable commit inventory. Coding assistance is disclosed there. This does not change another member’s credit or guarantee a grade.

## November 16–18, 2026 — Commit evidence

### 1. Guided first-school setup

- **What I did:** Implemented guided setup that opens at the unfinished step: school profile, academic year, term, then first class.
- **Evidence:** [Commit `8e6df2f`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/8e6df2ffe81dcf868cff091683b29715c52c6ef7)
- **Changed:** Added saved-step routing, setup progress, ordered overview actions and completion handling.
- **Limits:** Verified locally with fictional data; independent and hosted acceptance remain pending.

### 2. Subject-name scheduling

- **What I did:** Made the assigned subject name open the lesson popup directly and removed the redundant **Add lesson** button.
- **Evidence:** [Commit `4407aee`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/4407aeea4d08e25b7cc0fd7a21673fd059f0277e), [#104](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/104)
- **Changed:** Simplified timetable access while preserving explicit Save/Cancel behavior.
- **Limits:** Pointer-drag and physical-phone acceptance remain separate from the local browser check.

### 3. Quick floor and room creation

- **What I did:** Added atomic floor-plus-room creation, room-number preview, duplicate detection and tap-to-name room dialogs.
- **Evidence:** [Commit `0a6f7d6`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/0a6f7d65cc004917d6903c7e16b20a0ea04fc110), [quick-room-creation.md](quick-room-creation.md)
- **Checked:** Backend and frontend builds passed; local evidence recorded 95 backend and 22 frontend checks.
- **Limits:** Physical iPhone and hosted verification remain pending.

### 4. Guided setup navigation and school-name editing

- **What I did:** Continued setup improvements by routing unfinished work through **Year & class setup** and allowing existing schools to edit their name and level.
- **Evidence:** [Commit `9136309`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/9136309f024ee4b7a668b8aae3eca52554271d66)
- **Changed:** Updated navigation labels and corrected setup/workspace guidance.

### 5. Next-step guide and setup counts

- **What I did:** Added a data-driven next-step guide, privacy-safe readiness counts and navigation to the next unfinished school task.
- **Evidence:** [Commit `a4c5ac8`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/a4c5ac86b727ba90533c05ecd0fc44bf977a3c12), [next-steps-and-mobile-planning.md](next-steps-and-mobile-planning.md)
- **Checked:** Added guide unit coverage and backend endpoint authorization/count checks.
- **Limits:** Counts establish initial record readiness, not full curriculum or timetable acceptance.

### 6. Mobile subject and room planning

- **What I did:** Added coarse-pointer/touch drag handles, tap-only room assignment, edge scrolling support and dynamic dialog sizing.
- **Evidence:** [Commit `2dcc8df`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2dcc8dfb2c03d932df39041f874e40c66b9df4fb)
- **Changed:** Added mobile alternatives for subject and class drag operations while retaining mouse drag behavior.
- **Limits:** Simulated-browser checks are not a physical-iPhone pass.

### 7. Mobile subject hold behavior and compact teacher rows

- **What I did:** Changed touch dragging to 350 ms hold activation, removed arrow controls and kept subject, teacher and staff code in one table row.
- **Evidence:** [Commit `5548ded`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5548ded803de203b623497d0e1b9a3586696696b), [subject-hold-and-teacher-rows.md](subject-hold-and-teacher-rows.md)
- **Checked:** Production build and 25 frontend regressions passed; local mobile layout measured consistent teacher-row cells.
- **Limits:** Real iPhone touch gesture/save/reload verification remains pending.

### 8. Complete mobile layout audit

- **What I did:** Added shared responsive sizing, readable mobile records/cards and role-wide layout rules for canteen, class, directory and touch interfaces.
- **Evidence:** [Commit `57988fd`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/57988fdcb5382f330fd910933773c070700ec719), [mobile-layout-audit.md](mobile-layout-audit.md)
- **Checked:** Production build, frontend checks and simulated 390 px/844 px layout inspections.
- **Limits:** Chrome viewport evidence is not physical iPhone/WebKit verification.

### 9. Rooms hold-to-drag follow-up

- **What I did:** Extended the hold behavior to class names on the Rooms board and removed remaining room-board arrow controls and reserved arrow spacing.
- **Evidence:** [Commit `87255da`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/87255da469ecc0f174b6147cfc91ba7a244c2e99), [subject-hold-and-teacher-rows.md](subject-hold-and-teacher-rows.md)
- **Changed:** Holding a class name now starts dragging to a room and opens the destination form without saving automatically.
- **Limits:** Real iPhone dragging and save/reload acceptance remains pending.

### 10. Railway rollout verification

- **What I did:** Recorded deployed availability and authorization evidence for the next-step guide and mobile controls after deployment.
- **Evidence:** [Commit `15b0d25`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/15b0d25de2bf280d1367147377caf065c847b6f6), [next-steps-and-mobile-planning.md](next-steps-and-mobile-planning.md)
- **Changed:** Added a Railway rollout note covering HTTP 200 availability, approved-admin and guest authorization, and local workspace restart with existing data preserved.
- **Limits:** Live availability checks are not a physical-iPhone workflow pass.

### 11. Compact class subject cards

- **What I did:** Reduced class subject cards and removed repeated timetable instructions while preserving name-tap, drag and Add-to-timetable actions.
- **Evidence:** [Commit `5b3a2fa`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5b3a2fa6a5ebbb9c821adcc1e6109326f6dd434a)
- **Changed:** Compact cards show the subject name, teacher and compact class actions with less repeated copy.
- **Limits:** Additional independent visual and touch testing remains pending.

## November 21 retrospective supplement — omitted Week 11 deliveries

The original eleven sections above remain valid, but were not a complete account of Week 11. These additional groups were delivered November 12–16, with coding assistance. The [full comparison](../week12/galan-week11-contribution-review.md) lists each original commit, affected behavior and limits; the [metadata inventory](../week12/evidence/galan-week11-commit-inventory.json) preserves dates and authors.

| Original delivery date (Korea) | Previously omitted group | Evidence |
| --- | --- | --- |
| Nov 12 | Automated testing guide/CI, early phone tap/save checks, issue evidence index and roadmap revisions | [Testing guide](automated-testing-guide.md), [actual mobile/DB verification](issue-verification-2026-11-12.md), [issues](issues.md) |
| Nov 12 | Railway recovery and approved school-data migration with separate schema, backup/recovery and matching checks | [Deployment](railway-deployment-2026-11-12.md), [migration](railway-data-migration-2026-11-12.md) |
| Nov 13 | Configurable building/floors/room numbers, CSV/ZIP preview/apply import/export and local migration startup | [Building/data transfer](school-data-transfer.md) |
| Nov 14 | Teacher creation, consistent controls, main setup navigation, empty-grade subject recovery, repeated daily lessons, Copy routine and drag edge scrolling | [Teacher creation](admin-layout-teacher-creation.md), [navigation](year-class-navigation.md), [library recovery](new-grade-subject-library.md), [Sunday–Friday](sunday-friday-routine.md), [Copy routine](copy-routine.md), [scrolling](drag-edge-scrolling.md) |
| Nov 14 | Administration spacing/status-action cleanup and unified student/teacher/canteen creation popups, including persisted teacher subjects | [Spacing](admin-spacing-audit.md), [creation popups](account-create-popups.md) |
| Nov 15 | Profile QR card, scoped staff lookup/PNG download, and simplified on-demand identity/profile design | [QR](student-profile-qr.md), [profile simplification](profile-simplification.md) |
| Nov 16 | Verified parent accounts/child dashboard and form fixes, cross-role persisted workflow, separate empty-school workspace, teacher-core/parent-stretch planning decision | [Parents](parent-workspace.md), [workflow](daily-workflow.md), [empty workspace](empty-school-workspace.md), [scope/evidence comparison](../week12/galan-week11-contribution-review.md) |

Test totals in linked notes are snapshots of those runs, not added together. Automated/assistant-run checks, Galan's own feedback and independent teammates' checks remain distinct. The earlier record's implementation is supplemented here, not re-dated as Week 12 work. No grade outcome is claimed.

## Commit summary

| SHA | Date/time (UTC) | Commit |
|---|---|---|
| [`87255da`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/87255da469ecc0f174b6147cfc91ba7a244c2e99) | 2026-11-17 07:21 | Replace remaining room-board drag arrows with class-name holding |
| [`5548ded`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5548ded803de203b623497d0e1b9a3586696696b) | 2026-11-17 07:15 | Drag subjects by holding their names and keep class teachers in one row |
| [`57988fd`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/57988fdcb5382f330fd910933773c070700ec719) | 2026-11-17 07:04 | Improve mobile layouts across school workspaces and record role audit |
| [`15b0d25`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/15b0d25de2bf280d1367147377caf065c847b6f6) | 2026-11-16 16:18 | Record next-step guide and mobile controls Railway verification |
| [`2dcc8df`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2dcc8dfb2c03d932df39041f874e40c66b9df4fb) | 2026-11-16 16:17 | Support mobile planning with touch handles and tap-only room assignment |
| [`4407aee`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/4407aeea4d08e25b7cc0fd7a21673fd059f0277e) | 2026-11-16 01:16 | Open lesson popup from subject name and remove redundant add button |
| [`a4c5ac8`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/a4c5ac86b727ba90533c05ecd0fc44bf977a3c12) | 2026-11-16 16:17 | Add data-driven next-step guide for initial school setup |
| [`9136309`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/9136309f024ee4b7a668b8aae3eca52554271d66) | 2026-11-16 01:06 | Place year and class setup before renamed school management navigation |
| [`5b3a2fa`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5b3a2fa6a5ebbb9c821adcc1e6109326f6dd434a) | 2026-11-16 01:09 | Compact class subject cards and remove repeated timetable instructions |
| [`0a6f7d6`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/0a6f7d65cc004917d6903c7e16b20a0ea04fc110) | 2026-11-16 00:55 | Simplify room creation with atomic floor batches and tap-to-name dialogs |
| [`8e6df2f`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/8e6df2ffe81dcf868cff091683b29715c52c6ef7) | 2026-11-16 00:44 | Guide first-school setup through saved profile year term and class steps |
