# Create accounts from their lists

**Owner:** Galan Bishal · **Date:** November 14, 2026 · **Issue:** [#96](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/96)

## Result

- Accounts has Student list, Canteen staff, Teacher list and Teacher access. The separate Create student tab is removed.
- Student list's Create student account button opens a modal. Overview and class-enrollment shortcuts open the same form; the latter preselects the class. Save & add another keeps the form open. Normal creation returns to the list, refreshes it and shows a temporary confirmation. Close, Escape and bottom Cancel dismiss the form; reopening starts a fresh form.
- Canteen staff has Create canteen staff beside Refresh accounts. Creation errors stay in the popup, successful saves append to the list and close the popup, and closing clears the password.
- Create teacher includes a required catalog Teaching subject dropdown. A new `school_teacher_subjects` relationship stores the selection independently of timetable assignments. The directory and Subject filter include it immediately. Existing teachers and lessons are retained; this field does not invent lesson or homeroom assignments.
- CSV school-data packages include the new relationship after teachers and courses so references can be mapped. Older packages without this file still work. Activity Log tracks the new relationship.

## Actual validation

Assistant-run, with fictional records in an isolated disposable database. That database was removed after review; no real school accounts were created.

| Check | Actual result |
|---|---|
| Create a teacher with English, refresh the directory and select the English filter | Mina Example / REVIEW-T03 remained visible with English and no homeroom; no timetable was required |
| New backend subject-persistence check | Separate directory read returns the stored subject; invalid catalog ID returns 400 and inserts no teacher |
| Student list popup | Opened, selected Grade 6 / Class A, closed with Escape and reopened; form resets |
| Overview and class-enrollment shortcuts | Both opened the student popup; class shortcut selected Grade 6 / Class A |
| Canteen popup cancellation | Typed a fictional login draft, pressed Escape, reopened; login was empty |
| Three dialogs at 320, 390 and 1280px | Nine measurements: no dialog/content horizontal overflow; ordinary fields 44px high with 1px borders; Close targets at least 44px |
| Full backend suite with DB checks enabled | 86 passed, zero failures/skips |
| Frontend tests and production build | 21 tests passed; build passed |

Student/canteen credential provisioning is covered by the backend suite. Browser review did not submit new credentials for either role. Their modal success handling and Save & add another event flow were source-reviewed; those particular browser submissions and independent human/physical-phone testing are not claimed. A fixture-count test initially failed after adding an extra teacher; the new check now cleans up its fixture before subsequent count assertions, and the full suite passed again.

## Proof

- [Backend test output](evidence/account-create-tests.txt)
- [Nine popup layout measurements](evidence/account-create-layouts.json)
- [Teacher subject popup](evidence/create-teacher-subject-mobile.png)
- [Student popup](evidence/create-student-popup-mobile.png)
- [Canteen popup](evidence/create-canteen-popup-mobile.png)

Deployment confirmation is recorded in [#96](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/96) after the source commit reaches Railway.
