# Homework tracking, attendance summaries and academic year rollover

## Homework

Teacher: open **Homework & notices**, find an assignment, then choose **Track homework**. Find a student, select Pending, Submitted, Missing or Reviewed, and press **Save all changes**. All changed students are saved together, including rows hidden by filters; if a row is stale the whole batch is rejected. Summary counts and filters use saved statuses. Refresh reloads the stored marks; closing or refreshing warns about unsaved choices.

Only the assigning teacher with a current assignment to that class subject can change progress. Students and verified linked parents see their own saved status in Homework. Pending work past its due date is labelled Overdue; it is not automatically marked Missing. This tracks work received by the teacher; it does not upload student files or accept student self-reported submissions. Archived homework keeps its progress records.

## Attendance

The parent’s Attendance tab shows adjusted attendance, adjusted absences and recording completeness. In the teacher’s monthly register, enable **Attendance percentages** below the aligned controls to show the class summary and student percentage column. These start collapsed. Filters include All percentages, Below 90%, Below 75%, and No recorded days; these are viewing aids, not school policy. Hiding percentages clears the rate filter. The class summary always includes the whole class; the table follows the selected filters. Teachers can also filter students with adjusted absences or unmarked days.

- Adjusted absences = absent marks + floor(late marks / 3), per student per month.
- Adjusted attendance = (present + late + absent - adjusted absences) / (present + late + absent), as a percentage.
- Excused and unmarked days do not enter that percentage. With no counted records it shows a dash.
- Recording completeness = saved marks / eligible elapsed days. Incomplete records are labelled clearly.
- Class totals add each student’s converted absences; leftover late marks from different students are never combined.

The review message is a follow-up prompt, not a school disciplinary decision. Original attendance marks remain unchanged.

## Academic year rollover

Administrator: open **Year & class setup**, create the destination academic year and its active classes, then expand **Academic year rollover**.

1. Choose the source year and a later, non-overlapping destination year.
2. Map the source classes you want to move to destination classes. Leave others unchanged.
3. Preview enabled students enrolled on the source year’s final day.
4. Review individual selections. Existing destination enrollments and conflicting records cannot be selected.
5. Tick the review confirmation and confirm the selected students.

New enrollment begins on the destination year’s first date. The previous membership ends exclusively on the day after the old year’s last date, preserving the last day of that year. Only selected students move. An empty preview makes no changes. Concurrent edits require a fresh preview; repeating the operation does not create duplicate enrollment.

Login IDs, passwords, parent links, homework, attendance and notices are preserved. New subjects, timetables and room allocations must be configured separately. Rollover does not choose promotions automatically or execute on a schedule. The old years remain available for historical attendance review under existing role permissions.

## Definition of done and verification

- [x] Per-student homework progress persists with version protection and teacher ownership/class checks.
- [x] Students and linked parents receive scoped progress statuses.
- [x] Attendance calculations preserve raw marks, apply the three-late rule and disclose incomplete records.
- [x] Admin-only rollover supports a read-only preview, class mapping, individual selection, confirmation and transactional writes.
- [x] Existing enrollment, changed previews and stale revisions are rejected or clearly excluded.
- [x] Backend and frontend production builds pass.
- [x] All 33 frontend tests pass.
- [x] All 46 checks in the isolated MySQL school-planning suite pass, including real SQL progress persistence, parent/student read-back and rollover history preservation.
- [x] Additional mocked API tests cover homework permissions and stale writes, plus rollover mapping, duplicate runs and administrator scope.
- [x] Assistant browser checks on fictional local fixtures cover homework save/refresh, rollover selection/confirmation, summary labels and a 390-pixel layout.

These are assistant-run checks. No real school students were rolled over as part of testing. The MySQL suite uses a randomly named temporary database and removes that database afterward. Physical iPhone acceptance is still a human check.


### Homework register update
Each assignment keeps its own Track homework popup and Save all changes control. O means done, X means not done, and - means teacher-recorded late submission. Unmarked and reviewed records are preserved.

A separate Homework register navigation tab provides a class filter and a read-only overview. Students are rows; only actual homework creation dates are columns. Hovering, focusing or tapping a date shows homework names. Several assignments on one date use separate numbered marks in that date's column, following the displayed name order. Edit marks in the individual assignment popup, then refresh the register. The register uses the existing latest-100 teacher homework feed and authorized current rosters, not a lifetime archive.

Students can optionally open homework history at the right on desktop or below current work on narrow screens. Past-due and reviewed work moves there; unfinished overdue work still has a reminder. This is the current authorized homework feed, not a lifetime archive.

Timetable term choices are remembered per login in tab session storage. Refresh retains a valid explicit choice; defaults prefer an active term with actual lessons. Date changes replace a choice only when it no longer covers the selected date.
