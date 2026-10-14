# Sprint Report — Week 6

Team: Team 1 — StudentHub  
Week: 6  
Date: 2026-10-14  
Prepared by: anshsharma123 

## Sprint goal (one sentence)
Reduce friction in StudentHub's job search, improve the mobile layout (compact time inputs), and prepare clear setup and verification documentation so teammates can independently reproduce and verify the vertical slice.

## What we committed to do
- Compact the availability filters and select the timetable semester automatically.
- Move the Search button beside its input and reduce the mobile From/Until input size.
- Publish setup and verification documentation and complete independent administrator navigation verification (Issue #44).

## What we actually did (status and evidence)
- Compact availability filters and automatic semester selection — Done  
  Evidence: implementation commit c7ad189 — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c7ad189

- Move Search beside the input and reduce mobile time-input size — Done  
  Evidence: implementation commit 2a90851 — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2a90851; frontend build and manual layout checks at 320/390/430 px.

- Publish setup and verification documentation — In progress (drafts created)  
  Evidence:
  - Setup Guide (draft): classroom/week6/setup-guide.md — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/setup-guide.md
  - Tested-By note (prepared): classroom/week6/test-by-note.md — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/test-by-note.md
  - Test record (worked example, prepared): classroom/week6/test-record-worked-example.md — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/test-record-worked-example.md
  - Work checklist: classroom/week6/work-checklist.md — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/work-checklist.md

- Independent administrator navigation verification (Issue #44) — Pending independent test  
  Evidence / status: Issue #44 — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44. The Tested-By steps are prepared but an independent teammate still needs to run them, record the Actual result, and attach proof.

## Tests and verification
- Backend automated tests: 23 tests passed (noted on Oct 10). Relevant test files: backend/tests/ (link in repo). Please attach CI or test-run logs for verification.
- Frontend build: build passed on Oct 14 (local/manual). Manual checks: mobile time inputs look compact and usable at 320, 390, and 430 px. No horizontal overflow observed.
- Manual verification pending:
  - Administrator navigation (Dashboard → Students → Semesters → Courses) requires an independent tester to complete test-by-note.md with tester name, date, actual result, and proof (screenshot/video).
  - Saved favourites persistence across multiple devices needs a repeatable test and proof.

## Evidence links
- Deployed app (live demo): https://team1-production.up.railway.app/
- Repository: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1
- Key commits:
  - c7ad189 — automatic semester selection / availability filters — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c7ad189
  - 2a90851 — Search placement and mobile time input adjustments — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2a90851
- Week 6 docs (drafts):
  - Setup Guide — classroom/week6/setup-guide.md
  - Tested-By note — classroom/week6/test-by-note.md
  - Test record example — classroom/week6/test-record-worked-example.md
  - Work checklist — classroom/week6/work-checklist.md
- Verification Issue: #44 — https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44

## Blockers and risks (owner + next action)
- Independent admin verification missing — Owner: Team 1 (assign a non-author tester). Next action: run Tested-By steps, fill test-by-note.md, attach proof, update Issue #44.
- Favourites persistence across devices not verified — Owner: Team 1. Next action: save a favourite on device A, reload and sign in on device B; attach proof.
- Setup guide / sprint report not yet published — Owner: anshsharma123 / Galan. Next action: confirm personal evidence and commit the finalized docs.

## Decisions made this week
- Automatically select the timetable semester to reduce user choices (owner: Galan). Evidence: commit c7ad189.
- Present compact availability filters to save vertical space (owner: Galan). Evidence: commit c7ad189.
- Move Search beside the input to reduce vertical space and simplify the UI (owner: Galan). Evidence: commit 2a90851.
- Reduce mobile time input width while keeping 44px touch targets for accessibility (owner: Galan). Evidence: frontend checks and notes.

## Next actions / Plan for Week 7 (concrete tasks and owners)
1. Complete independent admin navigation test and update Issue #44 (Owner: assigned tester). Deadline: Week 7 start.
2. Verify favourites persistence across devices and attach proof (Owner: Galan / Team 1).
3. Each student confirms their weekly contribution and adds an Individual Evidence Receipt (Owner: every student).
4. Add CI/test logs or paste backend test output to the report (Owner: someone with test access).
5. Publish finalized setup-guide.md and sprint report to the main branch after reviews (Owner: anshsharma123).

## Attachments / screenshots / logs
- (Placeholders) Add screenshots for:
  - Admin navigation sequence (Dashboard → Students → Semesters → Courses).
  - Mobile time inputs at 320/390/430 px.
  - Backend test run output or CI link.
  - Favourites persistence proof (two-device screenshot or short recording).

---

Notes
- Do not include API keys, passwords, or personal student data in screenshots or commits (SEOUL_API_KEY must remain in backend .env).
- Once the independent test and screenshots are attached, update Issue #44 and mark the verification status in this report.
