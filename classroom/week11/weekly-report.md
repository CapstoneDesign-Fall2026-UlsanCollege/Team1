# Week 11 Weekly Report — StudentHub

**Team:** Team 1  
**Week:** 11 — MVP Verification and Freeze Gate  
**Homework deadline:** 2026-11-18, end of day Korea time  
**Status:** Shared draft; each member must confirm their own row

## Sprint 2 gate decision

Feature scope is frozen. The team should protect the final-demo path and prioritize current evidence, persistence, independent verification, setup, and live read-back instead of adding optional features.

## Frozen final-demo path

1. Administrator reviews class students, teacher assignments and timetable.
2. Administrator saves a valid special-room booking and demonstrates conflict rejection.
3. Teacher reviews their schedule/class roster, assigns homework, saves attendance and checks monthly totals.
4. Student sees only their own class information, timetable, homework and published school canteen information.
5. Canteen head changes approved canteen information and the student refreshes to verify the published result.
6. Team shows exact automated and human evidence and states remaining limits.

## Current Week 11 evidence

- Galan's engineering/testing records document many local and deployed checks, with assistant-run boundaries kept explicit.
- Ansh independently tested the deployed app on physical iPhone Safari:
  - subject-assignment persistence: **failed after refresh**;
  - valid special-room booking + overlap rejection: **passed**.
- The team still needs each enrolled member's own evidence row.
- Independent human canteen publication/privacy verification remains open in #54–#56.

## Known demo-relevant risk

The subject-persistence failure found by Ansh is a required-path persistence risk and must be fixed/retested before treating that step as stable.

## Individual contribution rows

| GitHub login | Week 11 contribution | Evidence | Result / next action |
|---|---|---|---|
| `bishal482` | Engineering, deployment, workflow and automated verification records across the current release. | [Week 11 evidence index](README.md), [daily workflow](daily-workflow.md), [roadmap](../../roadmap.md) | Keep optional expansion paused; repair/retest required persistence and close remaining human/live gates. |
| `anshsharma123` | Independent physical-iPhone verification of subject persistence and special-room booking/conflict behavior. | [Individual receipt](ansh-individual-evidence-receipt.md) | Subject persistence failed; room booking passed. Repeat subject check after fix. |
| `CoderRaaju` | Took ownership of the missing independent canteen owner→student publication/privacy check within the frozen demo path. | [CoderRaaju canteen verification note](coderraaju-canteen-publication-test.md) | Actual result pending personal run; record tested commit, device/browser, expected/actual result and safe screenshots. |
| `BudhaRajgiri` | **Pending personal Week 11 entry.** | Add own evidence link. | Select one bounded verification/handoff task and record actual result. |

## CoderRaaju acceptance target

The Week 11 contribution is complete only after `CoderRaaju` personally records whether:

- an unpublished canteen draft stays hidden from the student;
- the published menu appears with matching item/name/price after refresh;
- the withdrawn/unpublished menu disappears after the student refreshes.

A planned test is not a pass.

## Final check

- [x] Frozen demo path identified.
- [x] Current failure from Ansh kept visible.
- [x] `CoderRaaju` has a bounded non-duplicate verification target.
- [ ] `CoderRaaju` actual canteen result recorded.
- [ ] Teammate repeat recorded where practical.
- [ ] `BudhaRajgiri` adds personal evidence row.
- [ ] Team confirms final freeze/recovery decision from current evidence.
