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

1. Opened Grade 10 · Class A in Subjects & timetable on the deployed site.
2. Selected the unused subject Discrete Mathematics.
3. Selected Deepa Karki (T04) as the subject teacher and confirmed the assignment.
4. Confirmed that Discrete Mathematics with Deepa Karki appeared under Class subjects.
5. Refreshed Safari, then checked the Class subjects list again.

## Actual result

**Scoped retest passed.** Discrete Mathematics with Deepa Karki remained in the Grade 10 · Class A Class subjects list after the reported Safari refresh.

## Severity and priority assessment

**Severity:** Major

The Week 11 failure affected the core administrator subject-assignment workflow on iPhone Safari. A subject and teacher appeared saved but disappeared after refresh.

**Priority:** P1 — At risk

The Week 12 Grade 10 · Class A retest passed, but the original Grade 6 · Class A failure path has not yet been retested. The core workflow is therefore at risk rather than proven fully resolved. It is not classified as P0 because the application is not shown to be completely blocked, and it is not P2 because a confirmed earlier failure still needs follow-through.

## Screenshot evidence

| Step | Observation | Evidence |
| --- | --- | --- |
| Before confirmation | The assignment form shows Discrete Mathematics and Deepa Karki (T04), ready to confirm. | [01-assignment-form.jpg](evidence/ansh-subject-persistence-retest/01-assignment-form.jpg) |
| After confirmation | Discrete Mathematics appears under Class subjects with Deepa Karki. | [02-saved-before-refresh.jpg](evidence/ansh-subject-persistence-retest/02-saved-before-refresh.jpg) |
| After refresh | The same subject and teacher remain visible in Class subjects. | [03-present-after-refresh.jpg](evidence/ansh-subject-persistence-retest/03-present-after-refresh.jpg) |

## Comparison with Week 11

The Week 11 iPhone test found that Moral Education with Hari Adhikari disappeared after refresh in Grade 6 · Class A. This Week 12 retest used a different class, subject, and teacher, and the assignment remained after refresh.

This result shows that the persistence failure was **not reproduced in this tested Grade 10 · Class A scope**. It does not erase the Week 11 failure or prove every class/subject combination is fixed. The issue owner should review the deployed fix and decide whether the original Grade 6 · Class A path also needs a targeted retest before closing #83.

## Next action

- Keep the Week 11 failure evidence linked from Issue #83.
- Attach this scoped passing retest as current peer evidence.
- The code owner should verify the deployed fix and choose whether to retest the original Grade 6 · Class A scenario or close the issue with this scope limitation recorded.

## AI-use note

AI assistance was used to organize this written report and evidence links. The iPhone actions, screenshots, refresh observation, and reported result were performed or confirmed by Ansh Sharma.