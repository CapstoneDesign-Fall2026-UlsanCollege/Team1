# Week 10 Final Demo Roadmap — current checkpoint

> Historical checkpoint. See the [current Week 11 roadmap](../week11/roadmap.md), updated November 12, 2026; teacher dashboard is stretch scope.
**Team:** Team 1 — StudentHub<br>
**Updated:** November 9, 2026<br>
**Checkpoint:** November 11, end of day

This continues the [Week 9 roadmap](../week9/roadmap.md), preserving it as history. Nepal school administration is the primary direction. The revised #72 allocation board differs from cancelled historical classroom-search issues. School canteen and optional high-school jobs retain their separate unfinished boundaries.

## Next milestone — repeatable school-administration core path

> From an administrator session, identify a class, review its timetable, save a valid same-day special-room booking and reject an overlap; another teammate locates the API/data boundary and repeats the check. Separately verify the signed-in student’s own-class/homeroom view, now implemented and checked locally in #76, with an independent reviewer.

| Step | Issue / owner | Evidence through November 9 | Remaining acceptance / next check |
|---|---|---|---|
| Explicit school/class membership and own-class academic scope | #66, Galan | Published implementation 43a82ae; [17-check output](evidence/school-mysql-2026-11-05.txt) | Current human end-to-end and legacy mapping review |
| Focused booking save/reject slice and API stewardship | [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72), Galan | [Explanation and actual cases](code-ownership-galan.md); valid, conflict and boundary assertions passed | Confirm backup; get meaningful independent result by November 11 |
| Subject planner, teacher routine and homeroom rule | #62–64/#67, Galan's existing implementation | [Source/check note](school-release-check.md); one-subject demo and five daily lessons plus tiffin | [Current compact teacher UI proof](school-workspace-usability.md) recorded; independent review, teacher edit/deactivation/history and break-policy checks remain separate |
| Student My Class and Home | #76 implemented by Galan with coding assistance; #68 records Buddha’s proposed follow-up, confirmation pending | [Scoped homeroom/room API, grouped timetable, feature-tab Home and local proof](student-dashboard-check.md) | Independently repeat own-class, missing-teacher and publication-privacy checks; do not attribute Galan’s implementation to another member |
| Shared code navigation and contribution evidence | Each member; Galan coordinates | [Audit](ai-use-and-code-ownership-audit.md), [shared report](weekly-report.md) | Each person confirms one slice/area/support and adds own explanation/check |
| Live deployment gate | #65, Galan | Source is pushed; local output is linked | Hosting decision planned November 10; deployed commit/role/persistence proof still pending |

## Current result and fallback

Historical November 5 baseline: [43a82ae](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae). Standard backend: 38 passed/2 optional skipped; school MySQL: 17 passed; frontend: 10 passed; frontend build passed. [Actual output and limits](school-release-check.md).

If hosting or teammate verification remains unavailable, show the reproducible isolated check and clearly mark the missing human/live gate, owner and next action. Do not claim final release readiness. Do not add more features merely to replace missing proof.

Latest local regression recorded in [student checks](student-dashboard-check.md): 67 backend passes, zero failures/skips, and 15 frontend passes after timetable grouping. Later UI-only refinements have their own build/browser evidence in [school workspace checks](school-workspace-usability.md). These are recorded results, not new runs for this documentation update.

Bal Raju independently checked the separate C0 local account fixture on November 9: [tester-owned result and exact commit](../week8/c0-independent-test.md#tester-owned-result-record). This is genuine testing credit; current #72 verification and live hosting remain separate.

After this milestone: complete independent student/teacher checks, fresh-clone setup (#77), localization and high-school jobs gating (#69) against the agreed scope. No mark/attendance/parent portal is added by this roadmap.

## Owner-requested canteen extension — November 5

C2/C3 (#55–56) now have local menu availability, canteen hours/location and dated notices, Nepal dates/new NPR prices with old KRW preserved. [Actual regression and browser results](canteen-owner-check.md). Galan owns the implementation; real school details, independent checks and deployment still need verification. This extension does not replace the existing #72 handoff milestone.

## Owner-requested teacher workspace — November 10–11

Teacher access, current schedule/class rosters, scoped homework and homeroom attendance are implemented locally in #78–80. [Actual results and screenshots](teacher-workspace-check.md): 74 backend checks passed with no skips, 17 frontend checks and builds passed. This extension does not close #72’s independent-human gate or the separate live deployment gate.
