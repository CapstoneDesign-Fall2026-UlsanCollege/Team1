# Week 10 Final Demo Roadmap — current checkpoint

**Team:** Team 1 — StudentHub<br>
**Updated:** November 5, 2026<br>
**Checkpoint:** November 11, end of day

This continues the [Week 9 roadmap](../week9/roadmap.md), preserving it as history. Nepal school administration is the primary direction. The revised #72 allocation board differs from cancelled historical classroom-search issues. School canteen and optional high-school jobs retain their separate unfinished boundaries.

## Next milestone — repeatable school-administration core path

> From an administrator session, identify a class, review its timetable, save a valid same-day special-room booking and reject an overlap; another teammate locates the API/data boundary and repeats the check. Separately verify the signed-in student's own-class view without claiming unfinished teacher display.

| Step | Issue / owner | November 5 evidence | Remaining acceptance / next check |
|---|---|---|---|
| Explicit school/class membership and own-class academic scope | #66, Galan | Published implementation 43a82ae; [17-check output](evidence/school-mysql-2026-11-05.txt) | Current human end-to-end and legacy mapping review |
| Focused booking save/reject slice and API stewardship | [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72), Galan | [Explanation and actual cases](code-ownership-galan.md); valid, conflict and boundary assertions passed | Confirm backup; get meaningful independent result by November 11 |
| Subject planner, teacher routine and homeroom rule | #62–64/#67, Galan's existing implementation | [Source/check note](school-release-check.md); one-subject demo and five daily lessons plus tiffin | Teacher edit/deactivation/history and latest visual/break-policy checks remain separate |
| Student My Class follow-up | #68, Buddha in team record, acceptance pending | Existing own-class foundation; [area audit](ai-use-and-code-ownership-audit.md) | Verify/complete homeroom teacher and empty states; name exact blocker if not complete |
| Shared code navigation and contribution evidence | Each member; Galan coordinates | [Audit](ai-use-and-code-ownership-audit.md), [shared report](weekly-report.md) | Each person confirms one slice/area/support and adds own explanation/check |
| Live deployment gate | #65, Galan | Source is pushed; local output is linked | Hosting decision planned November 10; deployed commit/role/persistence proof still pending |

## Current result and fallback

Published source: [43a82ae](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/43a82ae). Standard backend: 38 passed/2 optional skipped; school MySQL: 17 passed; frontend: 10 passed; frontend build passed. [Actual output and limits](school-release-check.md).

If hosting or teammate verification remains unavailable, show the reproducible isolated check and clearly mark the missing human/live gate, owner and next action. Do not claim final release readiness. Do not add more features merely to replace missing proof.

After this milestone: complete the unresolved student teacher-display/teacher management checks, localization and high-school jobs gating (#69) against the agreed scope. No mark/attendance/parent portal is added by this roadmap.
