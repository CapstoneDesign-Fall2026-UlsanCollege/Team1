# Ansh Sharma — iPhone subject-assignment persistence check

**Date:** 2026-11-15
**Tester:** Ansh Sharma
**Environment:** Deployed StudentHub at `team1-production.up.railway.app`; iPhone Safari; existing administrator session.
**Scope:** Grade 6 / Class A, Subjects & timetable — add a library subject with a teacher and verify that the assignment remains after a browser refresh.

## Expected result

An administrator can add an unused subject, choose a teacher, and the subject/teacher assignment remains visible after refreshing the page.

## Actual result

**Failed — assignment did not persist after refresh.**

Ansh selected **Moral Education** and assigned **Hari Adhikari**. It appeared in the class-subject list immediately after confirmation. After refreshing Safari and scrolling the complete list, the list showed six saved subjects—Art and Music, Computer Studies, English, Health Education, Mathematics, and Science—but did not show Moral Education.

## Evidence

| Step | Observation | Evidence |
| --- | --- | --- |
| Before the action | The Grade 6 subject library was visible on the deployed iPhone page. | [01-library-before.jpg](evidence/ansh-iphone-subject-persistence/01-library-before.jpg) |
| Immediately after confirmation | Moral Education appeared in Class subjects with Hari Adhikari. | [02-moral-education-visible-before-refresh.jpg](evidence/ansh-iphone-subject-persistence/02-moral-education-visible-before-refresh.jpg) |
| After refresh | The top of the class-subject list shows the six saved-subject count and the first entries. | [03-after-refresh-top.jpg](evidence/ansh-iphone-subject-persistence/03-after-refresh-top.jpg) |
| After refresh | The top portion of the full list shows Art and Music, Computer Studies, and English. | [04-after-refresh-top.jpg](evidence/ansh-iphone-subject-persistence/04-after-refresh-top.jpg) |
| After refresh | The lower portion shows Health Education, Mathematics, and Science; Moral Education is absent. | [05-after-refresh-bottom.jpg](evidence/ansh-iphone-subject-persistence/05-after-refresh-bottom.jpg) |

## Follow-up

- Do not mark the physical-phone subject-assignment check complete until this persistence failure is reproduced, diagnosed, and fixed.
- Re-test this exact path on an iPhone after a fix: add a previously unused subject, assign a teacher, refresh, and confirm that the saved assignment remains.
- This report records a manual deployed-site observation only. It does not claim a backend diagnosis or a successful retest.