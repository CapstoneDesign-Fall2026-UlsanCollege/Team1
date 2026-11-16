# Click a subject name to schedule — #104

November 16, 2026 · Galan Bishal, with assistant support.

The separate **Add lesson** button was removed from class-subject cards. Clicking or keyboard-activating the subject-name button opens the existing day/time popup directly, including the assigned teacher. Drag suppression and the library's teacher-selection flow remain in place. Instructions now describe subject-name clicking or dragging into a timetable slot.

The popup still requires an explicit **Save lesson**; opening or cancelling it does not save a meeting. Timetable conflict/date validation is unchanged.

Actual checks: production frontend build/type check and `git diff --check` passed. Assistant browser verification used an isolated fictional teacher-review database: clicking Mathematics opened the correct popup with Asha Example; cancellation kept six recorded meetings; explicit save added a Sunday 12:00–13:00 meeting, increasing the count to seven; after page refresh and reopening the timetable, seven meetings remained. No separate Add lesson buttons remained. [Safe popup screenshot](evidence/subject-name-lesson-popup.jpg).

No user school data was changed. This is local assistant browser evidence, not independent human/physical-phone acceptance. The pointer-drag gesture was not newly repeated for this change.
