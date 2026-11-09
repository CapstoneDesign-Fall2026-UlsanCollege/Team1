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

## Compact class-teacher panel

Owner requested reduced size. Replaced the repeated class/year heading and large filter block with one compact class/term/refresh toolbar. Removed the date control only from Teachers because teacher assignments are term-based; date-scoped student/room views retain their date controls. Shortened heading/help text and tightened table rows and padding. Homeroom, subject/teacher/staff-code information and management action remain available.

Production frontend build passed. Assistant browser verified all six Grade 10A subject-teacher rows appear in the compact panel, with the selected term and homeroom visible. [Safe screenshot](evidence/compact-class-teachers.jpg). No academic records or API rules changed.

## Create student: class-first enrollment — November 9

Galan requested a simpler school enrollment form with coding assistance, continuing UX1 (#74). Full name and academic year/grade/class now precede login details. The selected class shows its usual classroom and Sunday's 10 AM homeroom teacher from terms active on the enrollment date. Missing/inactive/conflicting teacher states remain explicit; unavailable room information offers Retry. These are read-only facts, not new teacher assignments.

Generate password uses browser cryptographic randomness for an 18-character initial password and reveals it for private delivery; Show/Hide remains. Student contact details stay optional/collapsed. Guardian fields are not added or mixed into student contact data.

Create student clears the class/grade after a successful save. Save & add another clears personal/login/contact fields while retaining year/grade/class/date, refreshes the planning revision and focuses Full name. The submit button determines the action, so a previous secondary click does not affect a later normal submit. Success messages expire after four seconds; errors remain visible. The existing atomic account/enrollment API is unchanged.

**Actual checks:** frontend TypeScript/production build passed with local base path. Assistant browser selected Grade 6A and observed Room 101 / Deepa Karki; Generate password switched to visible mode and was cleared before proof. Password content was redacted by browser tooling, so its length was not independently measured through the browser. A 390×844 viewport override showed document and scroll widths both 375px (scrollbar excluded), with no horizontal overflow. Override reset after checking.

[Desktop form](evidence/student-create-desktop.jpg) | [Mobile form](evidence/student-create-mobile.jpg)

**Limits:** no student account was submitted or changed in the persistent database for this UI check. Save-and-add-another reset/focus was source-reviewed, not end-to-end verified with a new account. A disposable-fixture save/repeat check and independent teammate review remain pending; this note does not claim a new backend regression run or deployment.

## Structured admission IDs — November 9

Galan specified an automatic five-digit admission prefix followed by an entered student number. Example: **26 + 06 + 1 + 061 = 26061061**. The year comes from the enrollment date (Gregorian, matching the existing date field); grade is two digits; section A–I maps to 1–9. Student numbers 1–999 are padded to three digits, with 000 rejected. Unsupported class labels are shown explicitly instead of being guessed into colliding codes.

The school Create student form displays the prefix read-only and previews the final login ID. Class/date changes recompute it before creation. Save & add another clears the entered student number while keeping the selected class/date. The ID is stored through the existing login-ID field and unique constraint; duplicate IDs remain rejected by the existing transactional endpoint. Transfers do not recalculate saved IDs. Existing accounts and passwords were not renamed. No schema migration is required. Legacy non-school creation retains manual login IDs.

**Actual checks:** frontend build passed; all 17 frontend checks passed, including format/padding and invalid-date/unsupported-section/sequence boundaries. Assistant browser verified Grade 6A plus 61 displayed 26061061, then switching to 6B displayed 26062061. No new persistent account was submitted. [Safe form proof](evidence/student-id-format.jpg).

**Limit:** this compact format supports grades 1–12, sections A–I and 999 admission numbers per prefix. It is a permanent admission reference, not a current-class label or a daily roll number. Independent review and an isolated account-save/login check remain pending; no new backend regression or deployment is claimed.
