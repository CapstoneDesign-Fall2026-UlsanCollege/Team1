# Individual Evidence — Galan Bishal, Week 12

**Student:** Galan Bishal · **GitHub:** [@bishal482](https://github.com/bishal482)  
**Team:** Team 1 — StudentHub · **Sprint:** 3, QA and handoff  
**Reporting week:** November 19–25, 2026 · **Evidence updated:** November 22, 2026 (Asia/Seoul)

This is the single maintained individual record for my Week 12 work. It consolidates the former individual_work.md summary with the detailed contributions, changed files, check results and original commits below. The [shared Weekly Report](weekly-report.md) remains the single team report. Coding/test/documentation assistance is disclosed below; consolidating the records does not create new implementation or test claims.

## Work covered in this consolidated record

1. Targeted subject-assignment API verification and raw proof.
2. Portrait-phone extra-subject list show/hide improvement.
3. QA diagnosis, priority, issue evidence and Week 12 decision flowchart.
4. Final Demo Roadmap, course responses and requirements coverage.
5. AI/code-ownership audit and my personal mobile feedback/image.
6. Retrospective recovery of omitted Week 11 work, retaining original dates.
7. Empty-school-to-five-role walkthrough and screenshot report.
8. Separate administrator, teacher, student, canteen-head and parent guides.

The written dependency trace and repeatable harness are evidence of preparation, not proof of personal oral explanation or a newly completed independent exact-condition retest. Higher-priority setup/live acceptance gaps remain ahead of optional features. This record supports review of contributions and does not guarantee a grade.

## 1. Targeted subject-assignment persistence verification

**Problem and contribution:** carried the Week 11 #83 finding into a narrow API check instead of rerunning the whole MVP or assuming a cause. Added `subject-persistence-check.mjs`, defined conditions before execution and retained actual output.

**Commit:** [ec7392c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ec7392c).

**Expected:** the assigned subject and teacher remain linked to the same class after fresh reads, a new login and app restart; duplicate/stale writes cannot remove or duplicate it.

**Actual:** seven check groups passed. Duplicate/stale requests returned HTTP 409; SQL showed one saved relationship and no duplicate offering. The fictional temporary schema was removed. **Runner:** Codex at my request, not a non-author human test.

**Proof:** [pre-run conditions](qa-checklist.md), [executable check](subject-persistence-check.mjs), [raw output](evidence/subject-persistence-2026-11-21.txt), [exact backend revision and limits](galan-qa-result.md). This proves the tested API boundary, not a fix for the original deployed Safari conditions.

## 2. Portrait-phone subject-list improvement

**Problem and contribution:** the always-expanded Other school subjects list made the planner long and inconvenient. Requested and delivered a default-collapsed portrait list with Show list / Hide list, subject count, accessible expanded/control attributes and reset when class/year changes.

**Changed file:** `frontend/src/components/SchoolSubjectPlanner.vue`. **Commit:** [fd9cf3b](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/fd9cf3b).

**Actual checks:** production build and 25 frontend regressions passed; the deployed asset contained the new toggle. I subsequently reported a good mobile result with no error. These are separate automated/release and personal-feedback records, not an independent end-to-end gesture test.

**Proof:** [my feedback and screenshot receipt](galan-iphone-feedback.md), [before-change image](evidence/galan-subject-list-before-collapse.jpg). The image demonstrates the original long list, not an after-change save/reload result.

## 3. QA triage and traceable issue evidence

**Contribution:** preserved Ansh's original failing test, distinguished his later changed-combination pass, recorded historical Major severity separately from the current P2 follow-up, and linked actual conditions/results, affected area, owner and next decision to #83.

**Commits:** [698292d](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/698292d), [a03977c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/a03977c).

**Proof:** [structured bug report](bug-report-83.md), [peer/tested-by summary](peer-test-notes.md), [issue update](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83#issuecomment-7058467298), [Week 12 decision flowchart](roadmap.md). These records do not reassign Ansh's phone execution to me or declare the original cause fixed.

## 4. Final-demo planning and complete course-response package

**Contribution:** prepared the Weeks 10–16 Final Demo Roadmap with a Mermaid flowchart, checkable milestones, owners, planned proof, risks and fallbacks. Kept teacher dashboard core and parent dashboard stretch. Reviewed all Week 12 course files and linked resources, then supplied Team 1 responses and a requirements coverage index.

**Commits:** [a679f5a roadmap](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/a679f5a), [8e5e42b one-pager/checklist](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/8e5e42b), [a03977c completion review](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/a03977c).

**Proof:** [Final Demo Roadmap](../final-demo-roadmap.md), [one-pager](one-pager.md), [work checklist](work-checklist.md), [shared report](weekly-report.md), [coverage index](README.md#requirements-coverage), [change/attribution record](change-record.md). The package review checked 170 local file references with none missing at that revision; planned future trials are not claimed completed.

## 5. AI-use/code-ownership disclosure and personal mobile evidence

**Contribution:** added a Week 12 audit identifying actual assistance, affected boundaries, individual slices and unconfirmed explanation/support roles. Supplied personal no-error mobile feedback and the original-list image, preserving scope and capture limits.

**Commits:** [afd965a audit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/afd965a), [639810d personal completion mark](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/639810d), [3792e1e feedback](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/3792e1e), [65e8fe3 image](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/65e8fe3).

**Proof:** [AI-use and code-ownership audit](ai-use-and-code-ownership-audit.md), [personal receipt](galan-iphone-feedback.md). My reported success is recorded; the exact original subject/teacher combination, deployed revision and explicit refresh sequence were not supplied in that feedback.

## 6. Retrospective recovery of omitted Week 11 contributions

**Contribution completed this week:** requested and prepared an evidence review comparing the earlier individual receipt with published commit metadata, diffs and feature/test notes. Corrected inaccurate UTC dates and added omitted implementation/deployment work to the original record, with links.

**Commit:** [ecc5e62](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ecc5e62).

**Proof:** [full omissions review](galan-week11-contribution-review.md), [metadata inventory](evidence/galan-week11-commit-inventory.json), [corrected Week 11 receipt](../week11/individual_work.md). All 64 referenced commit objects and local links validated during the review. The inventory's 53 author-matched commits are not 53 features or grading points.

The older Railway migration, CSV/building controls, timetable tools, account/QR/parent implementation and empty-school setup retain their **Week 11 delivery dates**. This week's contribution is recovering their documentation, not claiming to implement them again.

## 7. Empty-school-to-role walkthrough — November 21–22

Requested a new separate empty database, admin-guided school/year/term/class setup, room and account creation, then individual-role execution with a screenshot at each stage. Codex completed the browser walkthrough and explicitly labelled API/SQL checks; the database is preserved separately for review.

**Evidence commit:** [c2b0aa2 — empty-school setup, five-role walkthrough and 61 linked pictures](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c2b0aa2). The 61 pictures comprise 59 numbered main-walkthrough screenshots and two clearly separated preliminary seeded-fixture pictures. They are not 61 distinct tests.

**Evidence:** [Full step-by-step report and all 61 picture links](bishal_check/report.md), including 59 main numbered screenshots, [initial empty counts](bishal_check/evidence/initial-counts.json), [final saved-state proof](bishal_check/evidence/final-readback.json), [post-restart role reads](bishal_check/evidence/post-restart-role-reads.txt). Admin, teacher, student, canteen head and parent workflows are separated in the report. The menu was intentionally withdrawn at the end.

**Actual checks:** production builds and 25 frontend regressions passed; teacher homework/attendance read back through student/parent views, canteen publication/availability/withdrawal read back across roles, selected permissions returned expected 401/403, mobile disclosure opened/closed, and stored records remained after server restart. The parent initial-password transition was an API check, not browser-form automation. The booking overlap was prevented by an unavailable-supervisor UI guard, not submitted for server rejection in this browser run.

**Scope:** assistant-run local fictional school, tested application source ca96fdd. This does not replace physical iPhone testing, an independent fresh-clone handoff, production acceptance or every feature/edge case. Older Week 11 implementation dates and classmates' evidence remain unchanged.

## 8. Role-specific workflow documentation — November 22

**Contribution:** requested and organized separate Markdown documents for the five roles in `classroom/week12/bishal_check`. Each explains prerequisites, steps from sign-in, actual observed results, relevant screenshot sequence and remaining limits. Cross-role evidence identifies the person/role that performed the action instead of attributing every action to the guide's role.

**Commit:** [81a2e31 — role-specific workflow guides](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/81a2e31).

| Role document | Documented work and evidence |
| --- | --- |
| [Administrator](bishal_check/admin.md) | Empty-school setup, year/term/classes, floors/rooms, subjects, teacher/student/canteen/parent account creation, routine, booking read-back, Activity Log, notice and restart review |
| [Teacher](bishal_check/teacher.md) | Own schedule, assigned-class roster, homework creation, homeroom attendance save/refresh and receiving-role read-back |
| [Student](bishal_check/student.md) | Own class/homeroom/room, timetable, teacher homework, menu publication/status changes, profile and QR dialog |
| [Canteen head](bishal_check/canteen-head.md) | Hours/location, menu draft privacy, publication, sold-out/restoration and withdrawal, with student/parent read-back |
| [Parent](bishal_check/parent.md) | Verified fictional child link, initial-login protection/API transition, child overview, attendance, homework, timetable, menu, own account and notices. Parent remains stretch scope |

**Validation:** all 59 main steps are represented across the guides; their local file/screenshot links passed validation. The [folder index](bishal_check/README.md#documents-by-role) links every guide, while the [full report](bishal_check/report.md) preserves the complete chronological sequence and all picture links. [Image manifest](bishal_check/screenshot-manifest.json) retains hashes/dimensions; [raw checks](bishal_check/evidence/role-read-checks.txt) and [final SQL read-back](bishal_check/evidence/final-readback.json) remain directly available.

This documentation reuses the recorded walkthrough; it is not five new test executions. Galan directed the testing and document structure; Codex performed the stated interactions/checks and drafted the files. No new product feature, teammate execution or additional independent acceptance is claimed.

## Roadmap slice, ownership and assistance

My bounded current slice is #83 planner → school API → MySQL class/offering/teacher relationships, plus the portrait-list usability follow-up. [Shared area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth).

I supplied project requirements, UI feedback, scope decisions and the provided screenshot. Codex generated/edited code and text, inspected repository evidence and ran the automated/release checks stated above. The [audit](ai-use-and-code-ownership-audit.md) and [change record](change-record.md) distinguish those roles. Personal oral code explanation, independent review and teammates' own entries are not inferred from this receipt. Ansh, Bal Raju and Buddha retain credit for their own recorded work.

## Remaining action and limits

Before November 25 end of day, reconcile any available exact-context #83 closure evidence and confirm personal explanation/support arrangements. The API/peer scoped passes and my positive feedback do not establish every device, a diagnosed original cause, clean-clone handoff or full live-role acceptance. Teacher dashboard remains core, parent dashboard stretch, and feature scope remains frozen.
