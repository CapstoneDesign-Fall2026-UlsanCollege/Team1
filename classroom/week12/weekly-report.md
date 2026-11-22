# Week 12 — Shared weekly report

**Team:** Team 1 — StudentHub · **Sprint:** 3, QA and handoff  
**Updated:** November 21, 2026 · **Homework checkpoint:** November 25, end of day

## Goal and commitment

Carry the Week 11 #83 phone subject-persistence finding into a bounded QA decision. Keep the final-demo feature scope frozen. This report summarizes recorded evidence; each member must confirm their own contribution entry.

- [x] Preserve the Week 11 failure and incorporate Ansh's different-combination retest.
- [x] Define and run a targeted API save/read-back/session/restart check using fictional isolated data.
- [x] Record severity separately from priority, evidence limits and an owned next check.
- [x] Complete the exact deployed-context iPhone comparison before closing #83.
- [ ] Each member confirms their own current contribution and support role.

The completion checkbox was marked by Galan in [639810d](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/639810d3e388d107cd44fd52d0e80aba1d141e28) and is preserved. He subsequently reported good results/no error and supplied the original-list image. [Personal receipt](galan-iphone-feedback.md). Exact subject/teacher/context, deployed revision and explicit refresh sequence remain unspecified; this is reported successful use, not an independently recorded repeat of the original combination.

## Evidence

| Item | Link and actual status |
| --- | --- |
| Carried-in freeze and risk | [Week 11 report](../week11/weekly-report.md) — frozen scope; incomplete acceptance |
| Original failure | [November 15 iPhone record](../week11/ansh-iphone-subject-persistence.md) — preserve unchanged |
| Structured triage and peer summary | [Bug report](bug-report-83.md), [peer notes / tested-by summary](peer-test-notes.md), [change/attribution record](change-record.md) |
| Current peer result | [Ansh's November 19 retest](ansh-subject-persistence-retest.md) — scoped pass, different subject/teacher |
| QA checklist and proof | [Protocol](qa-checklist.md), [Galan result](galan-qa-result.md), [raw output](evidence/subject-persistence-2026-11-21.txt) — assistant-run API check passed |
| Empty-start full role walkthrough, Nov 21–22 | [Bishal check report](bishal_check/report.md) — 59 main screenshots plus two labelled preliminary images; school setup, admin/teacher/student/canteen/parent flows, selected permissions and restart persistence. Assistant-run local evidence, not independent/production acceptance |
| Code and test commit | [ec7392c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ec7392ca572aba1560d865bc4ed1c09232f37056) — test harness only, no application fix |
| Issue and next decision | [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83), [Week 12 roadmap checkpoint](roadmap.md) |
| Final demo and handoff route | [Shared Final Demo Roadmap, Weeks 10–16](../final-demo-roadmap.md) — planned milestones, owners, proof and fallbacks |
| Shared ownership map | [Existing source of truth](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth), [Week 11 review](../week11/ai-use-and-code-ownership-audit.md) — no stewardship change asserted |
| Week 12 AI-use and understanding review | [Current weekly audit](ai-use-and-code-ownership-audit.md) — actual assistance, individual slices and explanation/support gaps; shared area map remains linked |

## Individual entries — confirmation status explicit

| Student | Recorded contribution | Evidence / confirmation |
| --- | --- | --- |
| Galan Bishal (@bishal482) | Directed Week 12 QA and usability work; with Codex assistance, added targeted persistence verification, portrait-list show/hide, triage/peer/attribution records, course responses, AI audit and final-demo roadmap. Supplied mobile feedback/image and requested the retrospective correction of omitted Week 11 work. | [Full Week 12 receipt](individual-evidence.md), [Week 11 omissions review](galan-week11-contribution-review.md), [personal feedback](galan-iphone-feedback.md). Older implementation retains Week 11 dates; assistant execution and personal code-explanation gaps remain explicit. |
| Ansh Sharma (@anshsharma123) | His own November 19 record reports deployed iPhone save/refresh persistence for Discrete Mathematics / Farhan Khan in Grade 6 A. | [Individual evidence receipt](ansh-week12-individual-evidence.md) and [existing peer receipt](ansh-subject-persistence-retest.md). No new test is attributed to Ansh by this report. |
| Bal Raju (@CoderRaaju) | No Week 12 individual result located in the current folder. | [Week 11 canteen work](../week11/coderraaju-individual-assignment.md) is historical context, not a new contribution. Add own Week 12 entry and evidence. |
| Buddha Raj Giri (@BudhaRajgiri) | No Week 12 individual result located in the current folder. | [Week 11 student evidence](../week11/evidence/BudhaRajgiri/BudhaRajgiri-Week11-Individual-Evidence.md) is historical context. Add own Week 12 entry and evidence. |

## Risks and decisions

| Item | Owner | Decision / next check |
| --- | --- | --- |
| #83 original Safari mismatch remains unisolated | Galan; proposed retester Ansh | Historical Major severity. P2 targeted reliability follow-up after current scoped pass. Keep original proof and issue open; compare exact deployed selection/IDs and reload by November 25. |
| #77 clean setup and #60/#65 full live acceptance | Galan coordinates; testers to confirm | Carried Week 11 P1 verification gaps, not newly reproduced bugs. No closure or full MVP pass is claimed by this focused check. |
| #54/#56 hosted canteen browser acceptance | Galan coordinates with Bal Raju | Earlier isolated/API checks remain separate from personal browser acceptance. Preserve the agreed fixture requirement. |
| Personal entries / area explanations | Each member | Confirm own work; no proxy authorship or invented independent test. |

**Decision:** retain the frozen promise. Teacher dashboard stays core; parent dashboard stays stretch. Today's result isolates an API boundary and does not justify a runtime fix, a new feature, or closing #83. Do not restart a whole-MVP test merely to fill the checklist.

## Bridge to handoff

Galan coordinates any remaining exact-context closure evidence and links the supported disposition from #83 before November 25 end of day; his already-reported successful use remains recorded. Members add/confirm their own entries. Use the existing setup/area-map checks for the next handoff trial after the current QA boundary is resolved.

Prepared with AI assistance from existing repository records and the [course Week 12 requirements](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/tree/main/week-12); not a team sign-off or a claim of newly performed human work.

## Galan’s follow-up confirmation — November 21

Galan replied that the mobile result was good with no error and that lists now appear only when pressed. [Direct feedback and limits](galan-iphone-feedback.md). This supplies a personal reported result and links the portrait-list improvement in fd9cf3b. Exact subject/teacher/context, deployed revision, explicit reload steps and an after-change persistence screenshot were not supplied; the before-change list screenshot is linked in the receipt. His completion mark is preserved; this feedback does not convert into an independent exact-combination retest.
