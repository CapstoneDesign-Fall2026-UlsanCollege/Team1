# Teacher workspace

Administrators create teacher access under **Accounts → Teacher access**, linking one login to one existing active teacher record. The teacher’s subjects and timetable must already be configured in School classes. Share the initial credentials privately. Disabling the account ends its sessions; enabling requires a fresh login.

Teachers sign in through the normal login page and receive a separate workspace:

- **My schedule:** choose a day to see lessons in currently active terms.
- **Class students:** choose an assigned class; search by name/login ID and browse ten students per page. Contact details are not included.
- **Homework:** select your class subject, title, instructions and due date. Edit to correct or hide your own assignment. Students read it through Home → Homework.
- **Homeroom attendance:** choose the class/month, click a date heading in the register, explicitly choose O/X/-/E marks and Save selected day. The homeroom is derived from Sunday’s 10 AM teacher. Partial marking is allowed; blanks are not present. Use Reload saved attendance if someone else changed the sheet before your save.

Attendance supports Present, Absent, Late and Excused, one status per day. It does not infer closures, reconstruct historical timetable revisions or accept future attendance. A teacher may teach a class without being allowed to take its homeroom attendance.

Startup runs the additive teacher schema migration. Existing users and teacher records remain unchanged; logins are never matched by name or created automatically. See [migration 013](../database/migrations/013_teacher_workspace.sql) and [actual checks and remaining limits](../classroom/week10/teacher-workspace-check.md).

For a temporary browser review (not the working school database), use PowerShell from the repository root with dependencies, builds and private backend/.env configured:

```powershell
node --env-file=backend/.env backend/scripts/teacher-review.mjs
```

Open the printed localhost URL. The terminal gives temporary fictional login credentials; never publish them. Enter stop to close the review server and remove its disposable schema. The helper requires MySQL permission to create/drop a fixture schema.

**Administrator directory:** Accounts → Teacher list is a compact directory by default. Check the Schedule checkbox to reveal the full routines; subject/name filters work in either view. Teacher access remains the separate place to create or disable teacher logins.


## Monthly register

O means Present, X Absent, - Late, E Excused and · Unmarked. Grey unavailable cells are not absences. Totals reflect saved marks. Adjusted absences = raw absences + floor(late marks / 3), within the selected month. Originals and excused/unmarked marks remain unchanged.

Click a date heading to edit that day; Save selected day commits the marks. Save or use Discard & reload before switching dates/pages. Horizontal scrolling shows all dates and totals, with the student-name column fixed. [Actual checks and screenshots](../classroom/week10/monthly-attendance-check.md).
