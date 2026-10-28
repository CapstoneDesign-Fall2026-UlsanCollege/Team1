# Week 8 — StudentHub

The implementation slices are tracked in the repository's **Issues** section. This folder is reserved for Week 8 reports and evidence.

## Midterm Gate response — October 28

- [One shared Week 8 Weekly Report](weekly-report.md): course/project lessons, current proof, MVP assessment, canonical member evidence and one Week 9 milestone.
- [Week 8 work checklist](work-checklist.md).
- [#65 — Restore one verified release path](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65), owner `bishal482`.
- [Independent C0 test procedure and pending result](c0-independent-test.md). A prepared procedure or assistant rerun is not an independent teammate test.
- [Current HTTP check](evidence/railway-http-check-2026-10-28.txt): public Railway URL returned 404 on October 28.
- [Assistant-run review-fixture rehearsal](evidence/c0-review-fixture-check-2026-10-28.txt): local in-memory API check only, not a live release.

**Current MVP assessment: still has a gap in deployed/repeatable verification.** Prioritise #65 before expanding the extension backlog below. Preserve unpublished draft code without treating it as a shipped feature. Personal contribution confirmations and the non-author test remain pending.

## Planned slices

- [#61 — C0 — Canteen-head account, workspace and permissions](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61)
- [#54 — C1 — Publish and view the daily campus canteen menu](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54)
- [#55 — C2 — Show campus canteen hours and location](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/55)
- [#56 — C3 — Mark canteen menu items available or sold out](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56)
- [#57 — R1 — Manage classrooms and link class meetings to rooms](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/57)
- [#58 — R2 — Find classrooms without recorded class conflicts](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/58)
- [#59 — R3 — Prevent overlapping class meetings in the same room](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/59)
- [#62 — T1 — Teacher directory and stable teacher records](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/62)
- [#63 — T2 — Teacher details, assigned subjects and weekly timetable](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/63)
- [#64 — T3 — Find available teachers and prevent subject-assignment conflicts](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/64)
- [#60 — V1 — Independently verify and release the new workflows](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/60)

C0 (#61) is implemented and locally verified; live Railway verification remains pending. The remaining slices are extension backlog and do not replace the Week 8 reset or #65's milestone. See each GitHub Issue for current status and evidence.

Campus Eat covers the campus canteen only. The canteen head manages menus, prices, hours and availability in a separate workspace. Administrators only create or disable the canteen-head account. Students view published canteen information. Room Finder covers administrator classroom availability.

The Teachers section is administrator-only: T1 records teacher identities, T2 shows their assigned subjects and weekly timetables, and T3 checks subject assignments against recorded teaching conflicts across majors. A slot without a recorded class is not a guarantee of personal availability. Implement T1 before T2 and T3; these slices do not require classroom search to be finished.
