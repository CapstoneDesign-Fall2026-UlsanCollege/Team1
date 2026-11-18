# Week 11 MVP Verification Checklist — StudentHub

The [Final Demo Roadmap](../../roadmap.md#final-core-demo-path) defines the verification target. The notes below use recorded results. Capture the deployed revision, date, device and safe proof for each new check.

| Roadmap step | Expected | Recorded result and evidence | Gate status |
| --- | --- | --- | --- |
| Admin reviews a grade/class | The roster, assigned teachers and weekly timetable match saved records. | Ansh added a subject with a teacher on deployed iPhone Safari. It appeared after confirmation and disappeared after refresh. The full admin review still needs a current hosted run. [Test note](ansh-iphone-subject-persistence.md) | Failed on subject persistence |
| Book a special room | A valid booking survives reload and an overlapping booking is rejected. | Ansh observed both results on deployed iPhone Safari on November 17. [Test note](ansh-room-booking-iphone-test.md) | Passed for the recorded run |
| Teacher reviews schedule and roster, assigns homework, saves attendance and checks monthly totals | The correct roster is shown and homework, attendance and totals match the saved records. | Isolated HTTP tests cover roster, homework and attendance. Current hosted schedule and monthly totals need verification. [Workflow](daily-workflow.md) · [Monthly attendance checks](../week10/monthly-attendance-check.md) | Partial |
| Student reviews their school information | Their own class, homeroom teacher, timetable, homework and published menu are shown. | Isolated workflow tests cover class, homeroom, homework and menu visibility. A current hosted walkthrough is pending. [Workflow](daily-workflow.md) | Partial |
| Canteen head changes approved fictional menu availability | Student refresh shows the saved availability while keeping the item and price correct. | Automated evidence covers draft, publication and withdrawal in the cross-role flow. Bal Raju's independent publication check is pending, and the hosted availability toggle still needs evidence. [Workflow](daily-workflow.md) · [Independent test plan](coderraaju-individual-assignment.md) | Hosted check pending |
| Show test and live evidence | Each demo claim has proof covering the environment and behavior claimed. | Existing automated/CI evidence and two phone notes are linked above. Full signed-in live read-back is pending. [CI record](testing-evidence.md) | Partial |

## Freeze decision and recovery

Keep the final-demo scope at the [roadmap’s current core path](../../roadmap.md#final-core-demo-path). The parent dashboard remains optional. Use the recovery route because a required save/reload check failed and other hosted checks are open.

1. Galan Bishal owns [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83). Reproduce the subject assignment on the deployed revision with approved test data, diagnose and fix the first failing step, then have a teammate repeat the iPhone Safari save/refresh check. Done when the saved subject and teacher appear after reload and the retest records the revision, expected and actual results, and safe proof.
2. Recheck the remaining required steps on the same deployed revision. Use the [issue and risk list](issues.md#week-11-freeze-gate) and the [roadmap checkpoint](../../roadmap.md#week-11-freeze-checkpoint) to track the evidence.
3. Use the [code-area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth) for review and support.
