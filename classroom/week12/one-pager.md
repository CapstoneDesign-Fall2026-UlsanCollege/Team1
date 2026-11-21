# Week 12 — Team 1 response: Carry a QA Finding to a Verified Action

**Project:** StudentHub · **Sprint:** 3, QA and handoff  
**Class date:** November 19, 2026 · **Updated:** November 21, 2026  
**Homework due:** November 25, end of day  
**Course source:** [Week 12 one-pager](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/week-12/one-pager.md)

This is our Week 12 response, not a copy of the course instructions or a claim that Week 11 checks happened again. Earlier evidence stays linked with its original date and scope.

## Goal and carry-in

Follow [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83), the phone subject-assignment persistence finding, into a current, bounded decision. The [Week 11 freeze](../week11/weekly-report.md#freeze-decision-and-next-route) remains in force. Teacher schedule, roster, homework and attendance stay core; parent dashboard stays stretch.

**Promised behavior:** an administrator assigns a subject and teacher to the selected class/term, and sees the same saved relationship after refresh.

**Week 11 starting evidence:** Ansh reported Moral Education / Hari Adhikari missing after refresh in Grade 6 A. [Original failure](../week11/ansh-iphone-subject-persistence.md).

## What Week 12 adds

| Check | Actual result and proof | What it does not establish |
| --- | --- | --- |
| Ansh's November 19 deployed iPhone retest | Discrete Mathematics / Farhan Khan remained in Grade 6 A after refresh. [His note and screenshots](ansh-subject-persistence-retest.md) | Different subject/teacher combination; no diagnosis of the original cause |
| November 21 targeted API check, run by Codex for Galan | Seven check groups passed: assign, fresh read, duplicate rejection, stale rejection, new session, app restart, SQL relationship/count read-back. [Protocol](qa-checklist.md), [result](galan-qa-result.md), [raw proof](evidence/subject-persistence-2026-11-21.txt), [test commit ec7392c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/ec7392ca572aba1560d865bc4ed1c09232f37056) | Fictional isolated data, not Safari input, original production IDs or a deployed fix verification |
| Exact deployed-context iPhone comparison | Galan's [639810d update](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/639810d3e388d107cd44fd52d0e80aba1d141e28) marks this complete in the shared report | Galan subsequently reported good results with no error and confirmed the reduced lists. [His feedback](galan-iphone-feedback.md). Exact combination/context, deployed revision, refresh steps and screenshots were not supplied; this remains user-reported completion |

The API check used the production application factory and a random disposable MySQL schema. It did not change Railway or school records. No full MVP rerun or new application feature was needed.

## Diagnosis, priority and disposition

**Historical severity:** Major — a saved-looking assignment disappeared. **Current follow-up priority:** P2, as recorded in Ansh's scoped passing retest and our API result. That priority orders the discriminating reliability/evidence check; it does not erase historical severity or authorize closing an unresolved issue. Inherited P1 setup/live acceptance gaps remain ahead of polish. See [current work order](roadmap.md).

**Current supported disposition:** scoped API all-clear and scoped peer pass. No new runtime failure or root cause was demonstrated, so no speculative fix or fix PR was created. The original failure remains visible. Galan’s subsequent [no-error feedback](galan-iphone-feedback.md) is now linked. Exact-context details remain necessary before treating it as verification of the original failing combination. No genuine blocker is invented to fill a required form.

**Affected area:** `SchoolSubjectPlanner.vue` → subject POST/school GET in `school-planning.ts` → MySQL offering/class/teacher links. **Owner:** Galan. **Support:** Ansh supplied existing peer evidence; another run or support commitment is not asserted on his behalf. [Current shared area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth) and [Week 11 review](../week11/ai-use-and-code-ownership-audit.md). No boundary or stewardship change is introduced here.

## Course route and evidence index

| Course requirement | Our Week 12 response |
| --- | --- |
| Carry a Week 11 finding forward | #83 and original failure linked above; keep freeze decision |
| State uncertainty, starting conditions and expected result before the check | [QA checklist](qa-checklist.md) and executable [targeted check](subject-persistence-check.mjs) |
| Use non-author evidence where practical | Ansh's own receipt is linked above; assistant execution stays separately attributed. Uncoached execution is not inferred |
| Classify reproduced / not reproduced / not tested | Different-combination peer pass and local API pass are scoped; exact-context details await receipt |
| Update issue, severity, priority and next owner | [#83 Week 12 update](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83#issuecomment-7058167912), [QA disposition](galan-qa-result.md) |
| Fix/retest or record supported next disposition | No runtime fix claimed; retain original proof and reconcile newly reported completion |
| Link roadmap and current area map | [Final Demo Roadmap](../final-demo-roadmap.md), [Week 12 checkpoint](roadmap.md), shared map above |
| Complete one shared report with personal entries | [Week 12 shared report](weekly-report.md); each member still confirms their own entry/evidence |

## Before November 25 end of day

1. Galan links the exact-context comparison's actual result, tester/device, revision, selected school/year/class/term and subject/teacher details, plus safe proof. Do not repeat a completed test merely for paperwork if its existing receipt can be supplied.
2. Compare that result with the original failure. If a mismatch repeated, document the confirmed failure and assign the smallest fix/retest. If it passed, state the exact scope and assess #83's acceptance criteria. If circumstances differed, record the difference instead of claiming the original failure fixed.
3. Each member adds/confirms their own contribution in the single shared report. Confirm support/explanation roles personally.
4. Update #83, the Week 12 checkpoint and final roadmap consistently after the new receipt is available. Preserve the earlier test records as history.

**Definition of Done:** a reader can find the inherited target, current conditions/result/proof, separate severity and priority, supported disposition, owner and next check. Documents exist; personal confirmations and the newly reported comparison's evidence are not silently counted as verified.

**AI use:** Codex read the course one-pager and current repository evidence, drafted this response and checklist, and linked the prior assistant-run test. No new human test, code explanation, cause, fix or team sign-off is claimed. A future fix PR should follow the [course work policy](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/project-work-policy.md) and disclose assistance using its [PR note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/templates/pr-with-ai-use-note.md).
