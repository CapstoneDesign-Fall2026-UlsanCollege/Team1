# Week 11 Weekly Report — Team 1 StudentHub

**Sprint 2 · November 12–18, 2026**

## Goal and outcome

Verify the existing final-demo path and freeze feature scope. Ansh's iPhone booking check passed, but the deployed subject assignment disappeared after refresh. Local automated evidence covers parts of the cross-role flow. The team has a recovery checkpoint for subject persistence and open checks for the remaining hosted steps.

[MVP verification and recovery](mvp-verification-checklist.md) · [Issue priorities](issues.md#week-11-freeze-gate) · [Sprint 2 checks](../sprint-quality-quick-checks.md#sprint-2---mvp-and-freeze-week-11) · [Week 11 AI use and ownership audit](ai-use-and-code-ownership-audit.md)

## Individual contributions

The entries summarize linked records. Each teammate should confirm or add their own contribution, lesson and next action.

| Teammate | Contribution and evidence | Follow-up |
| --- | --- | --- |
| Galan Bishal (@bishal482) | Documented guided school setup, mobile planning changes and local verification. [Individual receipt](individual_work.md) · [Cross-role workflow](daily-workflow.md) | Own the subject-persistence recovery and collect a second-person retest. |
| Ansh Sharma (@anshsharma123) | Independently checked deployed iPhone subject persistence and special-room booking. [Individual receipt](ansh-individual-evidence-receipt.md) · [Subject failure](ansh-iphone-subject-persistence.md) · [Booking pass](ansh-room-booking-iphone-test.md) | Record a new result after the persistence fix if available. |
| Bal Raju (@CoderRaaju) | [Independent canteen verification plan](coderraaju-individual-assignment.md). The actual result is pending. | Run the planned check and add personally recorded results and safe evidence. |
| Buddha Raj Giri (@BudhaRajgiri) | Awaiting personal contribution and evidence. | Add a contribution, lesson and next action. |

## Lesson and next checkpoint

A booking pass only verifies that booking flow. The phone subject test found a separate save/reload problem that earlier local checks missed. Reproduce and retest [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83), then revisit the [roadmap checkpoint](../../roadmap.md#week-11-freeze-checkpoint).
