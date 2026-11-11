# Teacher workspace

Administrators create teacher access under **Accounts → Teacher access**, linking one login to one existing active teacher record. The teacher’s subjects and timetable must already be configured in School classes. Share the initial credentials privately. Disabling the account ends its sessions; enabling requires a fresh login.

Teachers sign in through the normal login page and receive a separate workspace:

- **My schedule:** choose a day to see lessons in currently active terms.
- **Class students:** choose an assigned class; search by name/login ID and browse ten students per page. Contact details are not included.
- **Homework:** select your class subject, title, instructions and due date. Edit to correct or hide your own assignment. Students read it through Home → Homework.
- **Homeroom attendance:** choose the class/date, explicitly mark each student and save. The homeroom is derived from Sunday’s 10 AM teacher. Partial marking is allowed; blanks are not present. Use Reload saved attendance if someone else changed the sheet before your save.

Attendance supports Present, Absent, Late and Excused, one status per day. It does not infer closures, reconstruct historical timetable revisions or accept future attendance. A teacher may teach a class without being allowed to take its homeroom attendance.

Startup runs the additive teacher schema migration. Existing users and teacher records remain unchanged; logins are never matched by name or created automatically. See [migration 013](../database/migrations/013_teacher_workspace.sql) and [actual checks and remaining limits](../classroom/week10/teacher-workspace-check.md).

For a temporary browser review (not the working school database), use PowerShell from the repository root with dependencies, builds and private backend/.env configured:

```powershell
node --env-file=backend/.env backend/scripts/teacher-review.mjs
```

Open the printed localhost URL. The terminal gives temporary fictional login credentials; never publish them. Enter stop to close the review server and remove its disposable schema. The helper requires MySQL permission to create/drop a fixture schema.
