# Week 12 individual evidence — Buddha Raj Giri

**GitHub:** [@BudhaRajgiri](https://github.com/BudhaRajgiri)  
**Project:** StudentHub · **Week:** 12 · **Date prepared:** November 25, 2026  
**Personal area:** Student My Class / homeroom display (StudentSchool.vue)

> This is an evidence worksheet, not a claim that the checks below have already been performed. The Week 12 documentation draft was prepared with ChatGPT assistance at the user's request. The user must review it, perform or confirm the marked checks, and add genuine screenshots/results before submission.

## 1. Scope and connection to the team work

My proposed Week 12 slice is a focused review of the signed-in student's own-class/homeroom experience. It follows the earlier #68 Student My Class proposal and the shared ownership record. It is separate from Galan's #83 subject-persistence implementation and QA work. No code change or independent Week 12 runtime test is claimed in this receipt.

Relevant boundaries to review:

- frontend/src/components/StudentSchool.vue — My Class display and its loading, retry, empty and missing-teacher states.
- Student My Class API in backend/src/school-planning.ts — authenticated student's membership scope.
- Timetable display/API only where needed to check that the signed-in student's class context is consistent.

## 2. Test plan — complete after performing the checks

Use an authorized student demo account and the agreed demo school data. Do not attempt to access another student's private records or change production data.

| Check | Steps | Expected result | Actual result / status |
| --- | --- | --- | --- |
| Assigned-class state | Sign in as the assigned student; open My Class | Only the signed-in student's assigned school/year/class/room/teacher context is shown | **Pending user test** |
| Refresh / retry | Refresh My Class and use its refresh control if available | The same authorized class context reloads without losing the view | **Pending user test** |
| No-class state | Use an intentionally unassigned test account, if the team provides one | Clear no-class message; no unrelated student's information appears | **Pending suitable test account** |
| Missing-teacher state | Use a test class with no active homeroom teacher, if available | Clear missing-teacher state; no stale or unrelated teacher is shown | **Pending suitable fixture** |
| Timetable consistency | Open the student's timetable from the same signed-in session | Timetable belongs to the same effective student/class context | **Pending user test** |
| Privacy boundary | Ask the project owner for a safe, authorized second-account/API test procedure; do not guess IDs or probe real records | A student cannot retrieve another student's class data by changing a client-side identifier | **Pending authorized verification** |
| Responsive view | Repeat the visible My Class view at phone and laptop widths, where available | Content and controls remain usable without hiding the class status | **Pending user test** |

## 3. Evidence to add

- [ ] Screenshot of the assigned-class state (hide names/IDs that should not be public).
- [ ] Screenshot of refresh result.
- [ ] Screenshot of no-class state, if a suitable test account is provided.
- [ ] Screenshot of missing-teacher state, if a suitable fixture is provided.
- [ ] Screenshot of timetable consistency, if checked.
- [ ] Record the deployed/local URL type, test date, browser/device, account role (not password), and exact app revision if known.
- [ ] Add actual steps, expected result, observed result, and pass/fail/not-tested status for each check.
- [ ] If a check cannot be run safely, state why and leave it **Not tested**.

## 4. Week 12 contribution and AI-use disclosure

**Contribution prepared in this record:** scoped the proposed own-class/homeroom review, mapped the relevant UI/API boundary, and prepared a test/evidence checklist with ChatGPT assistance.

**Code contribution:** none claimed in this Week 12 receipt.

**Runtime testing:** none claimed yet. The table above is a plan until I personally perform the checks and enter the actual observations.

**AI use:** ChatGPT helped inspect the existing Week 12 repository records and draft this evidence worksheet and the linked documentation update. I must review the wording, correct anything that does not match my work, and be able to explain the checks. No AI-generated test result is presented as my personal test.

**Explanation still to complete:** explain how the signed-in student's identity is used to scope My Class data, how the UI distinguishes no class from no teacher, and what evidence would demonstrate that a client cannot read another student's records.

## 5. Prior evidence — historical only

My Week 11 individual evidence is retained at [Week 11 individual receipt](../week11/evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md). It records earlier My Class, timetable, privacy and profile work. Those results are historical and are not relabelled as Week 12 tests.

## 6. Personal confirmation

- [ ] I reviewed this receipt and confirm the description matches my actual Week 12 contribution.
- [ ] I completed and recorded the checks I claim as passed.
- [ ] I added or linked the genuine proof files.
- [ ] I can explain the relevant UI/API boundary and the limits of my tests.

**Confirmation date:** pending  
**Support / peer reviewer:** pending personal agreement; no teammate is assigned on my behalf.
