# Ansh Sharma — iPhone subject-assignment persistence retest

**Week:** 12 — QA follow-through
**Date:** 2026-11-19
**Tester:** Ansh Sharma
**Device:** iPhone 16 Pro, iOS 27.0.1, Safari
**Environment:** Deployed StudentHub at `team1-production.up.railway.app`; existing administrator session.
**Carried-forward issue:** [#83 — phone subject assignment and compact mobile administration text](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83)
**Week 11 starting evidence:** [subject-assignment persistence check — failed](../week11/ansh-iphone-subject-persistence.md)

## QA question

Does a newly assigned subject and teacher remain visible after Safari refresh on the deployed site?

## Expected result

An administrator can add an unused subject, choose a teacher, confirm the assignment, refresh Safari, and still see the same subject and teacher in Class subjects.

## Retest conditions and steps

1. Opened Grade 6 · Class A (Room 101) in Subjects & timetable on the deployed site.
2. Selected the unused subject Discrete Mathematics.
3. Selected Farhan Khan (T06) as the subject teacher and confirmed the assignment.
4. Confirmed that Discrete Mathematics with Farhan Khan appeared under Class subjects.
5. Refreshed Safari, then checked the Class subjects list again.

## Actual result

**Scoped retest passed.** Discrete Mathematics with Farhan Khan remained in the Grade 6 · Class A Class subjects list after the reported Safari refresh.

## Severity and priority assessment

**Severity:** Major (Week 11 observed failure)

The Week 11 failure affected the core administrator subject-assignment workflow on iPhone Safari. A subject and teacher appeared saved but disappeared after refresh.

**Priority:** P2 — Important

The Week 12 Grade 6 · Class A retest passed, so the current core path holds in this tested scope. The Week 11 failure remains valuable evidence, but it was not reproduced in the current retest. Follow-up is still important for reliability and issue review, but the evidence no longer supports a P1 claim that the promised workflow is currently at risk. It is not P0 because the application is not shown to be blocked.

## Screenshot evidence

| Step | Observation | Evidence |
| --- | --- | --- |
| Before confirmation | The Grade 6 · Class A assignment form shows Discrete Mathematics and Farhan Khan (T06), ready to confirm. | [01-assignment-form.jpg](evidence/ansh-subject-persistence-retest/01-assignment-form.jpg) |
| After confirmation | Discrete Mathematics appears under Class subjects with Farhan Khan. | [02-saved-before-refresh.jpg](evidence/ansh-subject-persistence-retest/02-saved-before-refresh.jpg) |
| After refresh | The same subject and teacher remain visible in Class subjects. | [03-present-after-refresh.jpg](evidence/ansh-subject-persistence-retest/03-present-after-refresh.jpg) |

## Comparison with Week 11

The Week 11 iPhone test found that Moral Education with Hari Adhikari disappeared after refresh in Grade 6 · Class A. This Week 12 retest returned to Grade 6 · Class A and found that Discrete Mathematics with Farhan Khan remained after refresh.

This result shows that the persistence failure was **not reproduced in the tested Grade 6 · Class A scope**. It does not erase the Week 11 failure or prove every subject/teacher combination is fixed, because this retest used Discrete Mathematics with Farhan Khan rather than the earlier Moral Education/Hari Adhikari combination.

## Next action

- Keep the Week 11 failure evidence linked from Issue #83.
- Attach this Grade 6 · Class A passing retest as current peer evidence.
- The code owner should verify the deployed fix and decide whether an additional exact Moral Education/Hari Adhikari retest is needed before closing #83.

## AI-use note

AI assistance was used to organize this written report and evidence links. The iPhone actions, screenshots, refresh observation, and reported result were performed or confirmed by Ansh Sharma.