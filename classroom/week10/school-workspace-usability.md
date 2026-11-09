# School enrollment and class workspace

**Owner:** Galan Bishal (@bishal482), with coding assistance.  
**Implementation:** November 8, 2026. **Final browser verification/documentation:** November 9, 2026.  
**Issues:** [UX1 #74](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/74), [UX2 #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/75). Continues #66/#63/#64/#72.

## Changed behaviour

In school mode, student creation uses the configured school, academic year, grade, active class and enrollment date. University/Major/Year of study/Semester fields are hidden. Contact fields are optional and collapsed initially. The school identity and student role come from the server; college field injection is ignored. Account, profile and class membership commit together under the school revision lock. Old college creation and existing records remain intact; no migration or reseed is needed.

School classes opens a compact class workspace with Overview, Students, Subjects & timetable, Teachers and Rooms. Setup and transfers remain accessible. Overview shows the date-scoped enrollment total, usual room, selected-term homeroom teacher (Sunday 10 AM rule) and subject count. Clickable class choices are available under Browse classes. Student rosters use real database pagination, ten per page. Teacher rows show linked subject/staff assignments; Rooms shows the usual classroom and bookings on the selected date. Contextual enrollment/room actions carry the chosen class. Year/class selection is preserved while navigating within the mounted administration workspace; URL persistence across reload is not implemented by this slice.

## Actual checks

Assistant-run checks, not independent human testing:

- Backend build passed. Full backend run with school/menu/activity database suites enabled: **66 passed, 0 failed, 0 skipped**.
- Frontend production build passed after final layout changes. Existing frontend suite: **12 passed**.
- New isolated school integration case verified account/profile/membership creation, password hashing, forced student role/configured school, no legacy semester insertion, immediate student own-class/subject access and three correctly attributed audit entries.
- Duplicate IDs, stale revisions, inactive/missing classes and invalid dates rejected without adding accounts. A deliberately failing membership insert returned a sanitized service error and rolled back the login/profile. The fixture is isolated and deleted afterward.
- A roster with over 100 fictional students returned ten records per page, correct totals and distinct later pages. Invalid date/page and anonymous/student/canteen access were rejected. Profile contacts/passwords were absent from roster payloads.

Test source: [school-planning.test.mjs](../../backend/tests/school-planning.test.mjs).

## Browser steps and observed results

1. Open local StudentHub with the fictional administrator; choose School classes.
2. Open Grade 10 Class A. Actual: correct enrolled count, Room 203, Demo Bikash Thapa as selected-term homeroom teacher and six linked subjects appeared.
3. Open Teachers and Rooms. Actual: linked teacher/staff rows and date-specific special-room booking information appeared. The room-board shortcut selected Grade 10 Class A.
4. Choose Enroll new student. Actual: year/Grade 10/Class A preselected, configured school read-only, college-only fields absent, optional contact details collapsed.
5. Return to School classes. Actual: class selection retained.
6. Test 390px mobile viewport. Actual: document/scroll widths both 390px; compact horizontal tabs and two-column summary fit. Restore default viewport afterward.

No new account was created in the persistent local database during browser verification. Actual enrollment writes were exercised in the isolated automated suite.

[Class desktop](evidence/class-workspace-desktop.jpg) | [Class mobile](evidence/class-workspace-mobile.jpg) | [Enrollment desktop](evidence/school-enrollment-desktop.jpg) | [Enrollment mobile](evidence/school-enrollment-mobile.jpg)

## Limits and next action

These two usability slices are implemented and locally checked. Independent non-author review and hosted verification remain pending. No Railway deployment was performed. The remaining review recommendations (persistent URLs, broader teacher specialty management, student home redesign, session persistence and complete visual standardization) are separate future work; this document does not claim them complete.

## Teacher directory: subject filter

Owner requested a Subject dropdown beside year, term and teacher search. Options come from actual assignments in the selected term, keyed by subject code. All subjects and No subject assigned remain explicit options. Subject and name/staff-code search combine, with matching/total counts and a clear zero-results message. Changing term clears a subject that is no longer available; refreshing retains a valid choice. Teacher routines remain complete rather than hiding other assignments from a matched teacher.

Frontend production build passed. Assistant browser verified Mathematics showed Chandra Rai only, an unmatched search showed 0/20, and No subject assigned showed 10/20. No data/API/permissions were changed. [Safe proof](evidence/teacher-subject-filter.jpg).
