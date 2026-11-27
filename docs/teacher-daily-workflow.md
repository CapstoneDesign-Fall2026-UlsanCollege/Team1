# Teacher daily workflow

The teacher workspace opens on Today. Its school date comes from the existing backend Nepal date. Lessons come from the teacher's current active-term schedule. The overview lists lessons, homework due today, five upcoming assignments, and assigned classes. It uses the existing latest-100 homework response; a past due date does not establish that a student has failed to submit work.

## Shortcuts and context

Each lesson/class links to students, assignment creation, notices and the homework register. Class-specific creation preselects the subject when the teacher has exactly one applicable subject. Homeroom attendance accepts the selected class when it is one of the teacher's authorized homerooms; otherwise it uses the first authorized homeroom. Workspace refresh retains a still-valid selected class and schedule weekday. Existing role and membership checks are unchanged.

## Homework

My assignments supports combined title/instructions search, class selection and due-today/upcoming/past-date/archived filters. Reuse copies text into a new unsaved assignment with a fresh due date; it does not copy student marks or save automatically. Edit and Reuse bring the form into view. Unfinished homework text and edited assignments prompt before workspace navigation, refresh or logout; browser closing/reloading also warns. Notice composition retains its existing close confirmation. These are in-memory drafts, not cross-device storage.

In the individual marking popup, Mark shown unmarked students done affects only filtered students whose draft status is pending. It preserves existing marks, offers Undo, and requires Save all changes. Existing version-checked API writes remain in use.

## Attendance

Mark shown unmarked students present affects only eligible students in the filtered table on the selected editable day. It preserves saved marks and existing drafts, offers Undo, and requires Save selected day. It never infers attendance from a timetable or automatically submits a sheet.

## Validation

Assistant-run local browser checks used fictional records, not production school data:

- Today lesson shortcut opened the correct class/subject homework form.
- Due-today marking opened the correct assignment.
- Homework bulk marking preserved an existing X, Undo restored pending, and Save persisted the chosen change.
- Reuse populated a new draft; cancelling the navigation confirmation retained it.
- Attendance bulk marking preserved an absence and Undo restored the blank mark.
- At 390px viewport, Today fit the page without horizontal overflow; action buttons measured at least 44px high.
- Frontend build and 44 unit tests passed, including combined search/date/archive filtering.

These checks are assistant-run local verification, not a claim of independent teacher or iPhone acceptance.
