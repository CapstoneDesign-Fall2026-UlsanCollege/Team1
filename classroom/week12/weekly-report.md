# Week 12 — Shared weekly report

**Team:** Team 1 — StudentHub · **Sprint:** 3, QA and handoff  
**Updated:** November 25, 2026 · **Homework checkpoint:** November 25, end of day

## Goal and commitment

Carry the Week 11 #83 phone subject-persistence finding into a bounded QA decision. Keep the final-demo feature scope frozen. This report summarizes recorded evidence; each member must confirm their own contribution entry.

- [x] Preserve the Week 11 failure and incorporate Ansh's different-combination retest.
- [x] Define and run a targeted API save/read-back/session/restart check using fictional isolated data.
- [x] Record severity separately from priority, evidence limits and an owned next check.
- [x] Record Galan’s physical-iPhone Safari new-subject save/refresh result, with ordered screenshots and timetable confirmation.
- [ ] Complete the remaining original-combination/revision acceptance review before closing #83.
- [ ] Each member confirms their own current contribution and support role.

The earlier completion mark in [639810d](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/639810d3e388d107cd44fd52d0e80aba1d141e28) and [November 21 personal feedback](galan-iphone-feedback.md) remain historical evidence. The checklist above now distinguishes the completed November 25 scoped phone test from remaining original-case acceptance. It does not describe all phone testing as outstanding or claim an exact original-case retest passed.

## Evidence

| Item | Link and actual status |
| --- | --- |
| Carried-in freeze and risk | [Week 11 report](../week11/weekly-report.md) — frozen scope; incomplete acceptance |
| Original failure | [November 15 iPhone record](../week11/ansh-iphone-subject-persistence.md) — preserve unchanged |
| Structured triage and peer summary | [Bug report](bug-report-83.md), [peer notes / tested-by summary](peer-test-notes.md), [change/attribution record](change-record.md) |
| Current peer result | [Ansh's November 19 retest](ansh-subject-persistence-retest.md) — scoped pass, different subject/teacher |
| QA checklist and proof | [Protocol](qa-checklist.md), [updated Galan QA result](galan-qa-result.md), [raw API output](evidence/subject-persistence-2026-11-21.txt) — seven isolated API groups passed; November 25 browser/phone results are separately attributed |
| November 25 deployment and phone evidence | [Deployment proof, original-context read-back and six-picture phone sequence](nov25-feedback-follow-up.md) — active source 07b4926 verified during desktop inspection; Galan’s iPhone Safari New01 / ibib assignment and reported Sunday lesson persisted after refresh. Exact phone-run revision remains unestablished |
| Empty-start full role walkthrough, Nov 21–22 | [Bishal check report](bishal_check/report.md) — 59 main screenshots plus two labelled preliminary images; school setup, admin/teacher/student/canteen/parent flows, selected permissions and restart persistence. Assistant-run local evidence, not independent/production acceptance |
| Code and test commit | [ec7392c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ec7392ca572aba1560d865bc4ed1c09232f37056) — test harness only, no application fix |
| Issue and next decision | [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83), [Week 12 roadmap checkpoint](roadmap.md) |
| Final demo and handoff route | [Shared Final Demo Roadmap, Weeks 10–16](../final-demo-roadmap.md) — planned milestones, owners, proof and fallbacks |
| Shared ownership map | [Existing source of truth](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth), [Week 11 review](../week11/ai-use-and-code-ownership-audit.md) — no stewardship change asserted |
| Week 12 AI-use and understanding review | [Current weekly audit](ai-use-and-code-ownership-audit.md) — actual assistance, individual slices and explanation/support gaps; shared area map remains linked |

## Individual entries — confirmation status explicit

| Student | Recorded contribution | Evidence / confirmation |
| --- | --- | --- |
| Galan Bishal (@bishal482) | Directed Week 12 QA and usability work; with Codex assistance, added targeted persistence verification, portrait-list show/hide, triage/peer/attribution records, course responses, AI audit and final-demo roadmap. Supplied mobile feedback/image and requested the retrospective correction of omitted Week 11 work. Personally ran the November 25 iPhone Safari existing-record and New01 creation/assignment/refresh checks; supplied six ordered new-subject pictures and explicitly confirmed timetable persistence. | [Full Week 12 receipt](individual-evidence.md), [Week 11 omissions review](galan-week11-contribution-review.md), [personal feedback](galan-iphone-feedback.md), [November 25 phone sequence](nov25-feedback-follow-up.md#galans-new-subject-sequence--iphone-safari), [updated QA result](galan-qa-result.md). The linked records demonstrate Galan’s QA coordination, usability improvements, evidence documentation and successful personal iPhone Safari persistence checks. Contributions retain their original delivery dates, with personal testing and Codex-assisted work clearly attributed. |
| Ansh Sharma (@anshsharma123) | His own November 19 record reports deployed iPhone save/refresh persistence for Discrete Mathematics / Farhan Khan in Grade 6 A. | [Individual evidence receipt](ansh-week12-individual-evidence.md) and [existing peer receipt](ansh-subject-persistence-retest.md). No new test is attributed to Ansh by this report. |
| Bal Raju (@CoderRaaju) | Carried Week 11 canteen QA forward. Codex verified the canteen flow in two local Chromium runs and all 14 isolated API checks passed. The second browser run verified publication and withdrawal through fresh student sign-ins and confirmed one unpublished database row after withdrawal. | [Individual evidence and screenshots](coderraaju-week12-individual-evidence.md#fresh-session-retest-and-visual-proof) · [Direct browser output](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt). Scoped local all-clear; hosted acceptance requires an agreed fixture. |
| Buddha Raj Giri (@BudhaRajgiri) | Prepared a scoped Week 12 own-class/homeroom QA plan and evidence worksheet with ChatGPT assistance. No code change or runtime test is claimed yet; the user must review, perform and record the checks. | [Week 12 individual evidence worksheet](budhrajgiri-week12-individual-evidence.md); [Week 11 evidence](../week11/evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) remains historical only. Personal confirmation and genuine proof are pending. |

## November 25 feedback follow-up

| Check | Actual outcome and attribution |
| --- | --- |
| Deployment revision | Codex read Railway deployment Details: active deployment 26931a93-35cb-4fd3-a940-5cafa1146f51 linked source 07b49264829ee6878c6d32dd307c04d5c7e286d9. This verifies the desktop inspection revision, not the later phone-run revision. |
| Original named combination, existing record | Codex confirmed Moral Education / Hari Adhikari in Grade 6 A persisted after full reload and class reselection. Galan separately confirmed it on physical iPhone Safari and supplied a picture. No original-combination creation/save was repeated. |
| New subject, class assignment and lesson | Galan created New01 (code New subject) in Grade 6’s library and assigned it to Grade 6 A / Room 101 / School term 2026–2027. He selected Gita Gurung T07, then changed to displayed teacher ibib because of a reported collision, and placed Sunday 10–11 AM. Six pictures support the sequence and after-refresh class list; he explicitly confirmed the lesson remained after refresh. |
| Status correction | #83’s stale phone checklist was corrected to acknowledge Ansh’s completed different-combination pass. Galan’s completed phone check is now recorded separately from Codex’s checks and remaining original-case acceptance. |

[Full receipt, deployment proof and ordered pictures](nov25-feedback-follow-up.md) · [Updated QA result](galan-qa-result.md).

The teacher collision reason is Galan’s report; no conflict-message picture was supplied. The after-refresh timetable result is explicitly reported, without a separate timetable picture. The iOS version, exact phone-run revision and original record IDs remain unestablished. Galan’s run is personal author testing, not an independent peer retest. No general fix is inferred, no new product feature was added, and teammates’ entries remain unchanged.

## Risks and decisions

| Item | Owner | Decision / next check |
| --- | --- | --- |
| #83 original Safari mismatch remains unisolated | Galan; proposed retester Ansh | Historical Major severity. P2 targeted reliability follow-up after current scoped pass. Completed: named original-record reload checks and Galan’s different-combination new-assignment Safari pass. Keep original proof and issue open for review of the remaining original creation sequence, exact phone-run revision/IDs and independent acceptance; preserve existing school data. |
| #77 clean setup and #60/#65 full live acceptance | Galan coordinates; testers to confirm | Carried Week 11 P1 verification gaps, not newly reproduced bugs. No closure or full MVP pass is claimed by this focused check. |
| #54/#56 hosted canteen browser acceptance | Galan coordinates with Bal Raju | Local Chromium and API checks passed. Use the agreed fixture to repeat the flow on the deployed revision. |
| Personal entries / area explanations | Each member | Confirm own work; no proxy authorship or invented independent test. |

**Decision:** retain the frozen promise. Teacher dashboard stays core; parent dashboard stays stretch. The evidence now includes the isolated API pass, live existing-record read-back and Galan’s personal new-assignment Safari pass. These do not establish the original cause or justify a runtime fix, a new feature, or automatic closure of #83. Do not restart a whole-MVP test merely to fill the checklist.

## Bridge to handoff

Galan coordinates any remaining exact-context closure evidence and links the supported disposition from #83 before November 25 end of day; his already-reported successful use remains recorded. Members add/confirm their own entries. Use the existing setup/area-map checks for the next handoff trial after the current QA boundary is resolved.

Prepared with AI assistance from existing repository records and the [course Week 12 requirements](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/tree/main/week-12); not a team sign-off. Galan’s November 25 phone execution is explicitly reported and supported as described above; no new teammate execution is inferred.

## Galan’s follow-up confirmation — November 21

Galan replied that the mobile result was good with no error and that lists now appear only when pressed. [Direct feedback and limits](galan-iphone-feedback.md). This supplies a personal reported result and links the portrait-list improvement in fd9cf3b. Exact subject/teacher/context, deployed revision, explicit reload steps and an after-change persistence screenshot were not supplied; the before-change list screenshot is linked in the receipt. His historical completion mark remains linked above; the current checklist separates the completed scoped check from outstanding original-case acceptance. This November 21 feedback alone is not an independent exact-combination retest.
