# Mobile layout audit — November 17

Galan Bishal, with assistant-run implementation and local checks. Tracks [#106](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/106).

## Changes

Shared control sizing prevents date, time and month fields from forcing their containers wider. Phone and touch layouts stack filters, wrap actions and keep dialogs inside the viewport. Class context now separates the date and term instead of allowing overlap. Class and teacher directories use labelled cards on mobile. Canteen opening hours use day cards. Timetables and attendance retain horizontal scrolling because their columns carry meaning.

Desktop retains the two-column class context and normal directory tables. No school data or account permissions were changed.

## Checks actually run

Disposable fictional data only, using `teacher-review.mjs` with `UI_REVIEW=1`, `PARENT_REVIEW=1` and `TEACHER_REVIEW_ATTENDANCE=1`. The optional UI fixture adds a canteen account, a long term name and an assigned room. No real school records were copied.

Chrome viewport checks found no document horizontal overflow or visible input/select/textarea escaping its label/cell on these representative screens:

| Area | Screens checked | Sizes |
| --- | --- | --- |
| Login and administration | Overview; class room context; student, teacher, parent and canteen staff lists/create dialogs; teacher access; year/class setup; Activity Log; school data; notices; requests | 390×844; class context also 320×700, 844×390 and 1280×850; teacher access also 844×390 |
| Canteen | Menu and opening hours/settings | 390×844; menu also 844×390 |
| Teacher | Schedule, class students, homework, monthly homeroom attendance | 390×844; attendance also 320×700 and 844×390 |
| Parent | Overview, attendance, homework, timetable, notices, canteen, account | 390×844; account also 844×390 |
| Student | Home, class, timetable, homework, subjects, canteen, profile, jobs and contact editing | 390×844; contact editing also 844×390 |

[Student measurements](evidence/mobile-student-layout.json) retain the final student audit output. Earlier role results are summarized above from the observed checks; they are not a saved raw browser trace.

- Frontend production build: passed (TypeScript and Vite).
- Frontend regression tests: 25 passed, zero failed.
- `git diff --check`: passed.

## Visual evidence and remaining check

- [Corrected class date/term layout](evidence/mobile-class-context-fixed.jpg).
- [Canteen settings mobile layout](evidence/mobile-canteen-hours-cards.jpg) shows the identity section and start of weekly hours, not every day card.

These are assistant-run Chrome viewport checks, not physical iPhone or WebKit verification. They verify layout and navigation, not every save operation. On iPhone Chrome, recheck date/term alignment in both orientations, subject assignment/save/reload and room assignment/save/reload after the release. The earlier failed persistence receipt remains separate until that flow is actually repeated successfully.
