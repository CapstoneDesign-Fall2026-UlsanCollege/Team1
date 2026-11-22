# Bishal check — Empty-school setup and role walkthrough

[Role-specific documents](README.md#documents-by-role): [Admin](admin.md) · [Teacher](teacher.md) · [Student](student.md) · [Canteen head](canteen-head.md) · [Parent](parent.md).

**Dates:** November 21–22, 2026 (Asia/Seoul). Steps 1–6 began November 21; the preserved run resumed November 22.  
**Requested by:** Galan Bishal (@bishal482) · **Executed by:** Codex using browser interaction and the specifically noted API/SQL checks. This is assistant-run evidence, not a non-author human acceptance test.  
**Tested source:** `ca96fddc441bf6188802b560aff6dbae4979eb90`. Application source was unchanged during this run; the later evidence commit does not represent a runtime fix.

## Start, scope and result

Started a **new separate empty database** with one administrator, then used the website to create the school, academic year, term, classes, rooms, subject, teacher/login, student, canteen head and parent. Signed into the roles and exercised the connected workflows below. **59 numbered main screenshots** document this sequence; two separately labelled preliminary screenshots are included afterward.

The selected workflows passed their stated scope. No application error reproduced during these completed actions. The overlapping room request was stopped by the UI's no-available-supervisor guard; it was **not** submitted as a server-side conflict attempt in this browser run. This report does not claim every function, physical iPhone or full production release passed.

## Environment and starting proof

- Local URL: **http://127.0.0.1:3033/**; this is not Railway production.
- Preserved database: `studenthub_fresh_w12qa_20261121_1532`.
- The existing launcher copied table structure only, not school/person/room/menu records. [Initial counts](evidence/initial-counts.json) show one user and zero school profiles, years, classes, teachers, students, rooms, floors, courses, terms and menus.
- This used installed local dependencies and an existing schema template; it is not an independent fresh-clone/clean-install handoff trial.
- All people, school records, login numbers, guardian@example.test and prices shown are fictional test data. Existing laptop/Railway databases were not reset.
- Credentials and cookies are excluded. Role credentials remain in a private local file outside Git. No private configuration contents are included.
- Desktop browser checks were followed by 390×844 portrait checks at steps 55–57; the viewport override was reset. These are original full-page browser JPEGs, not mockups. [Image hashes, dimensions and file timestamps](screenshot-manifest.json).

## Role-by-role results

| Role / stage | Actions and expected outcome | Actually observed | Pictures |
| --- | --- | --- | --- |
| Admin — first setup | Sign in empty; save school, year, term and class in order | Fictional middle school, 2026–2027 QA, QA First Term and Grade 6 A saved; setup progressed through all four steps | 1–5 |
| Admin — rooms | Create a floor/rooms; make a lab; allocate usual classroom | Floor 1, rooms 101/102 saved; 102 became QA Science Lab; 101 assigned to Grade 6 A | 6–7 |
| Admin — subjects/teacher | Create Moral Education, specialist teacher/login; assign class subject and reload | QA-MORAL and QA Hari Adhikari / QA-T01 saved; qa_teacher linked; subject/teacher remained after actual page reload | 8–13 |
| Admin — routine/accounts | Save Sunday–Friday lesson; create student and canteen account | Six 10:00–11:00 lessons saved in Room 101; QA Aarav Example enrolled with generated test login 26061001; qa_canteen created | 14–16 |
| Admin — booking/audit | Save lab booking; refresh; check overlapping conditions and audit | November 22, 10:00–11:00 booking persisted after Refresh rooms. Second request had no available supervisor and Save disabled. Activity Log showed setup actions | 17–19 |
| Teacher | Sign in, read schedule/roster; assign homework and mark homeroom attendance | Correct class/room/student; homework QA Respect and responsibility due Nov 23 saved; O Present for Nov 22 saved and register refreshed | 20–23 |
| Student | Sign in; read own class, teacher, room, timetable, homework and menu | Correct linked data; teacher homework appeared; no menu before publication | 24–28 |
| Canteen head and student | Save hours/location, draft, publish, sold-out and restore; read each state as student | Draft stayed hidden; publication showed QA Vegetable Momo at NPR 80; Sold out preserved name/price; restoring availability was reflected | 29–38 |
| Admin and parent | Create verified fictional guardian-child link; first login gate; child views | Parent created as P26061001; required password-change screen appeared. API child read was 403 before the recorded API transition; later browser login showed linked child's class, O Present, homework, timetable and published menu | 39–45 |
| Canteen/student/parent | Withdraw publication; readers refresh | Menu became draft and disappeared from both student and parent views | 46–48 |
| Parent/admin | Own account; admin publishes notice; parent reads notice | Own-account screen displayed; QA school meeting notice appeared to parent during its date | 49–51 |
| Student | Open Profile and own QR | Fictional identity and QR dialog displayed. Camera scanning/download were not tested here | 52–53 |
| Admin/mobile | Add another class/catalogue subject; Show/Hide extra list | Grade 7 B and QA Science added; Grade 6 extra list default hidden at 390px, Show revealed it, Hide closed it | 54–57 |
| Admin/restart | Review final overview, stop/restart server, sign in again | Saved school overview returned; separate role read checks and SQL counts passed after restart | 58–59 |

## API, build and persistence proof

| Check | Actual result | Raw proof |
| --- | --- | --- |
| Frontend regressions | 25 passed, zero failed/skipped | [Output](prechecks/frontend-tests.txt) |
| Targeted subject API persistence | Seven groups passed; own random fixture schema removed. Separate narrow fixture from the preserved walkthrough | [Output](prechecks/api-persistence.txt), [harness](../subject-persistence-check.mjs) |
| Production builds | Backend and frontend passed | [Backend](evidence/backend-build.txt), [frontend](evidence/frontend-build.txt) |
| Parent first-login transition | Browser gate captured; child API 403 before required change, valid transition 200; then parent browser login/reads worked | [API output](evidence/parent-initial-password-api.txt) |
| Selected role boundaries | Anonymous admin read 401. Teacher/student/canteen/parent login and own reads 200; admin reads 403; non-teachers denied teacher dashboard 403 | [Output](evidence/role-read-checks.txt), [read-only checker](verify-role-reads.mjs) |
| Same reads after actual stop/restart | Passed again | [Post-restart output](evidence/post-restart-role-reads.txt) |
| Portrait list disclosure | Default hidden; Show visible; Hide hidden | [Visibility checks](evidence/mobile-list-checks.json), pictures 55–57 |
| Direct SQL saved state | Five roles/users, one student, two classes, one teacher, two rooms, one floor, two courses, one term, six timetable entries, one homework, one attendance mark, one parent-child link, one menu, one notice | [Final read-back](evidence/final-readback.json) |

**Final state:** attendance is Present on November 22. Menu is intentionally **unpublished** after withdrawal; hours/location and notice remain published. Grade 7 B was created for the cross-grade catalogue test and deliberately left without room/teacher assignments. The readiness guide correctly reports unfinished tasks for this extra class; this is not a claim that every class is fully configured.

## Limits and runner corrections

- No new product failure was demonstrated. Two test locators needed correction: Create student account is the actual creation button name, and some saved text is a strong/list node rather than the initially expected heading/exact text. State was inspected before continuing; no duplicate save was submitted. A preliminary SQL helper was rerun from backend so installed mysql2 could resolve. These were runner/setup corrections, not claimed application bugs.
- Parent password change was tested through the API, not the browser password form. The before-gate and after-dashboard screenshots are not claimed as a browser-form transition pass.
- Physical iPhone gestures, camera QR scanning, card downloading, multi-child/student-to-student isolation, password resets, three-late conversion boundaries, CSV, full concurrency/error/retry and every individual function were not tested in this walkthrough.
- This local fictional Moral Education / QA Hari Adhikari reload pass does not reproduce the original production identities/revision or diagnose #83's cause. Keep the [original failure](../../week11/ansh-iphone-subject-persistence.md) and [Ansh's physical-phone retest](../ansh-subject-persistence-retest.md) visible.
- #77 still needs a real non-author fresh-clone/empty-DB handoff trial. Railway production acceptance is separate from this local run.
- All JPEGs were decoded for file integrity; representative account, parent and mobile images were visually reviewed. The report does not claim a pixel-by-pixel review of every screenshot.

## Reopen and repeat

The local test database is preserved. Restart with the existing `backend/scripts/fresh-school-server.mjs`, private MySQL configuration, `FRESH_DB_NAME=studenthub_fresh_w12qa_20261121_1532`, `FRESH_PORT=3033`, and **without FRESH_CREATE**. Do not reset an existing database merely to repeat a screenshot. Admin credentials were supplied privately; private test-role credentials are kept outside Git.

The read-only checker needs `QA_CREDENTIALS_FILE` pointing to the private role JSON. It is restricted to this local URL and logs statuses only. The next human check can repeat this bounded sequence, state device/revision and record the first failure or actual pass.

**AI use:** Galan requested the empty-start/role/screenshot scope. Codex created the separate school using the existing structure-only launcher, performed browser interactions, ran the stated API/SQL checks and wrote this report. No teammate execution is claimed. [Individual evidence](../individual-evidence.md), [AI audit](../ai-use-and-code-ownership-audit.md), [shared report](../weekly-report.md).

## Every screenshot — direct links

The table below includes every main picture in order. Capture descriptions for resumed steps are retained in the [capture records](evidence/capture-manifest-resumed.json); original file metadata is in the [image manifest](screenshot-manifest.json). File timestamps are supporting metadata, not independent proof of actions.


| Step | Picture / action shown | Link |
| --- | --- | --- |
| 1 | Admin empty start | [Picture 01](evidence/01-admin-empty-start.jpg) |
| 2 | School saved | [Picture 02](evidence/02-school-saved.jpg) |
| 3 | Academic year saved | [Picture 03](evidence/03-academic-year-saved.jpg) |
| 4 | Term saved | [Picture 04](evidence/04-term-saved.jpg) |
| 5 | Class created | [Picture 05](evidence/05-class-created.jpg) |
| 6 | Floor and rooms | [Picture 06](evidence/06-floor-and-rooms.jpg) |
| 7 | Grade 6 A assigned to usual room 101 with separate science lab | [Picture 07](evidence/07-classroom-assigned.jpg) |
| 8 | Moral Education created in Grade 6 subject library | [Picture 08](evidence/08-subject-library-created.jpg) |
| 9 | Teacher with specific teaching subject saved | [Picture 09](evidence/09-teacher-record-created.jpg) |
| 10 | Teacher login linked to the teacher record; form cleared | [Picture 10](evidence/10-teacher-login-created.jpg) |
| 11 | Moral Education with fictional teacher ready to confirm | [Picture 11](evidence/11-subject-assignment-form.jpg) |
| 12 | Class subject and teacher saved | [Picture 12](evidence/12-subject-saved.jpg) |
| 13 | Moral Education assignment still present after actual page reload | [Picture 13](evidence/13-subject-after-reload.jpg) |
| 14 | Sunday-Friday 10-11 routine saved | [Picture 14](evidence/14-weekly-routine-saved.jpg) |
| 15 | Fictional student enrolled with generated login 26061001 | [Picture 15](evidence/15-student-created.jpg) |
| 16 | Canteen head account created by admin | [Picture 16](evidence/16-canteen-account-created.jpg) |
| 17 | Saved same-day lab booking visible after refreshed room data | [Picture 17](evidence/17-booking-readback.jpg) |
| 18 | Second request at saved time has no available supervisor and save disabled | [Picture 18](evidence/18-overlap-prevented.jpg) |
| 19 | Audit lists actions performed in the new fictional school | [Picture 19](evidence/19-admin-activity-log.jpg) |
| 20 | Teacher first login shows Sunday-Friday class schedule | [Picture 20](evidence/20-teacher-schedule.jpg) |
| 21 | Teacher sees enrolled student in the assigned class | [Picture 21](evidence/21-teacher-roster.jpg) |
| 22 | Teacher homework saved for Grade 6 A | [Picture 22](evidence/22-homework-assigned.jpg) |
| 23 | Teacher saved O present for November 22 and refreshed register | [Picture 23](evidence/23-attendance-saved.jpg) |
| 24 | New student signs in to own school dashboard | [Picture 24](evidence/24-student-home.jpg) |
| 25 | Student sees own homeroom teacher, class and room | [Picture 25](evidence/25-student-class.jpg) |
| 26 | Student timetable uses grouped Sunday-Friday routine | [Picture 26](evidence/26-student-timetable.jpg) |
| 27 | Student sees homework assigned by teacher | [Picture 27](evidence/27-student-homework.jpg) |
| 28 | Student sees no published menu before canteen setup | [Picture 28](evidence/28-student-menu-empty.jpg) |
| 29 | Canteen head first login with empty menu | [Picture 29](evidence/29-canteen-first-login.jpg) |
| 30 | Canteen identity and Sunday-Friday hours saved and published | [Picture 30](evidence/30-canteen-hours-published.jpg) |
| 31 | Menu saved as draft with fictional food at NPR 80 | [Picture 31](evidence/31-canteen-draft-saved.jpg) |
| 32 | Student cannot see the saved unpublished menu | [Picture 32](evidence/32-student-draft-hidden.jpg) |
| 33 | Canteen head publishes the saved menu | [Picture 33](evidence/33-canteen-menu-published.jpg) |
| 34 | Student sees published QA Vegetable Momo at NPR 80 | [Picture 34](evidence/34-student-published-menu.jpg) |
| 35 | Canteen saves published item as sold out | [Picture 35](evidence/35-canteen-sold-out.jpg) |
| 36 | Student sees sold-out label without losing name and price | [Picture 36](evidence/36-student-sold-out.jpg) |
| 37 | Canteen restores availability | [Picture 37](evidence/37-canteen-availability-restored.jpg) |
| 38 | Student sees restored available item | [Picture 38](evidence/38-student-availability-restored.jpg) |
| 39 | Fictional guardian linked to the child with admin verification | [Picture 39](evidence/39-parent-created.jpg) |
| 40 | Parent first login requires password change before viewing child | [Picture 40](evidence/40-parent-first-login-gate.jpg) |
| 41 | Parent sees only linked fictional child after required password transition | [Picture 41](evidence/41-parent-overview.jpg) |
| 42 | Parent monthly attendance shows saved O present and totals | [Picture 42](evidence/42-parent-attendance.jpg) |
| 43 | Parent sees teacher homework for linked child | [Picture 43](evidence/43-parent-homework.jpg) |
| 44 | Parent sees linked child timetable | [Picture 44](evidence/44-parent-timetable.jpg) |
| 45 | Observed parent canteen state during cross-role check | [Picture 45](evidence/45-parent-canteen-observed.jpg) |
| 46 | Canteen unpublishes menu back to draft | [Picture 46](evidence/46-canteen-withdrawn.jpg) |
| 47 | Withdrawn menu disappears from student view | [Picture 47](evidence/47-student-withdrawn-hidden.jpg) |
| 48 | Withdrawn menu also hidden from parent | [Picture 48](evidence/48-parent-withdrawn-hidden.jpg) |
| 49 | Parent account screen limited to own contact details | [Picture 49](evidence/49-parent-account.jpg) |
| 50 | Admin publishes fictional school notice for today | [Picture 50](evidence/50-admin-notice-published.jpg) |
| 51 | Parent sees admin-published notice | [Picture 51](evidence/51-parent-notice-readback.jpg) |
| 52 | Student profile shows fictional identity and card actions | [Picture 52](evidence/52-student-profile.jpg) |
| 53 | Student QR dialog generated for own identity | [Picture 53](evidence/53-student-qr.jpg) |
| 54 | Second class Grade 7 B added without disturbing Grade 6 A | [Picture 54](evidence/54-second-class-created.jpg) |
| 55 | New school Grade 6 extra-subject list starts collapsed at 390px | [Picture 55](evidence/55-mobile-list-collapsed.jpg) |
| 56 | Explicit Show list reveals QA Science from another grade | [Picture 56](evidence/56-mobile-list-expanded.jpg) |
| 57 | Hide list closes the extra catalogue again | [Picture 57](evidence/57-mobile-list-hidden-again.jpg) |
| 58 | Final admin overview after full new-school role walkthrough | [Picture 58](evidence/58-admin-final-overview.jpg) |
| 59 | Admin signs in after server restart with saved school data still present | [Picture 59](evidence/59-after-server-restart.jpg) |

### Preliminary seeded-fixture pictures — separate from the empty-start run

Before the empty-database clarification, a disposable seeded fixture was used for the initial list check. It was stopped and removed. These two images are preliminary only; they are not part of steps 1–59.

- [Preliminary collapsed list](prechecks/01-mobile-list-collapsed.jpg).
- [Preliminary expanded list](prechecks/02-mobile-list-expanded.jpg).

All 61 pictures in this folder are linked above.
