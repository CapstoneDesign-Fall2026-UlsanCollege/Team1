# Student My Class workspace

The school-mode home page and bottom navigation open **My Class**. Separate Timetable and Subjects home tiles have been merged into it.

- **Class overview** shows the assigned class, usual room and homeroom teacher.
- **Timetable** offers All days and individual weekday filters, plus an English date picker and Today shortcut. Choosing a date loads only the signed-in student’s effective class membership on that date and selects its weekday and active term. Dates without membership or an active term show an empty state.
- **Subjects** shows the current class subjects and their linked teachers.

Timetable days with matching subjects, times, teachers and rooms share one routine, such as Sunday–Friday. An unspecified room uses the saved usual classroom when available. Real room, teacher or time differences stay separate. No saved lessons or room records are modified by grouping. The view describes the recurring weekly routine; it is not a holiday calendar.

University-mode navigation remains available for installations without school mode.

Validation: frontend/backend builds, 36 frontend tests, 47 isolated MySQL checks, and assistant browser checks with fictional fixtures. Browser checks cover merged navigation, one Sunday–Friday group, Saturday with no lessons, subjects and 390-pixel subtabs. MySQL checks verify historical transfer dates do not expose another student’s class and invalid dates are rejected. No production school records were changed during verification.
