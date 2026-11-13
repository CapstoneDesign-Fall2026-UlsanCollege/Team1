# Sunday–Friday lesson option

**Owner:** Galan Bishal, with coding assistance

**Date:** November 14, 2026

**Issue:** [#91 — Definition of Done](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/91)

## How to use it

Open Add lesson or edit an existing Sunday–Friday lesson. In **Day**, choose **Sunday–Friday (same time daily)**, enter the time and select **Save Sunday–Friday**.

The server checks all six days and saves them in one transaction. When editing, it updates this subject's matching original time/location slots, adds missing school days, and keeps other periods and Saturday unchanged. Saturday lessons remain individually editable. Shared offerings continue to affect every linked class, as the form explains.

An error on any weekday prevents the entire save; the message names the failing day. Repeating the same routine does not add duplicate meetings. Existing single-day editing remains available.

## Verification

- [Database test log](evidence/daily-routine-tests-2026-11-14.txt) includes all-six-day creation, repeat-save deduplication, editing, Saturday/unrelated-period preservation, stale revisions and role checks.
- A Friday class conflict rolled back the whole attempted edit, leaving the planning revision and all saved rows unchanged.
- A Thursday teacher conflict against another class also rolled back every attempted change.
- Backend TypeScript and frontend production builds passed. All 17 existing frontend tests passed.
- Assistant browser test used a disposable fictional database: edited Sunday's Mathematics lesson, chose the new group option, moved it from 10–11 to 12–13 and confirmed six saved lessons appeared in the 12:00 timetable row after read-back.
- [Lesson form with the new option](evidence/sunday-friday-form.png).

No production lessons were changed by these tests. No independent teammate test is claimed. Hosted release availability is recorded separately in the issue.

## Published checks

All 84 backend tests passed with no skips; all 17 frontend tests passed. [CI passed for implementation 1046d86](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/43492195358). On Railway, the new routine endpoint rejected an empty request with HTTP 400 before any write. The live Computer Studies lesson form offered Sunday–Friday (same time daily); it was selected and then cancelled without saving. [Hosted form screenshot](evidence/sunday-friday-live-form.png). The local preview was restarted with the updated backend.
