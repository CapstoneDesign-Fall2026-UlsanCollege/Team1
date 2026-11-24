# November 25 feedback follow-up — #83

Galan requested this follow-up; Codex performed the browser inspection and drafted this receipt. No teammate execution is attributed here.

## Verified deployment

Railway's active Team1 deployment was `26931a93-35cb-4fd3-a940-5cafa1146f51`, dated November 25, 2026 at 00:17 GMT+9. Its Details panel linked directly to source [07b49264829ee6878c6d32dd307c04d5c7e286d9](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/07b49264829ee6878c6d32dd307c04d5c7e286d9). This is provider-observed, not inferred from the latest branch commit. Earlier documentation-only deployments shown in history were skipped; that does not establish which revision is active.

[Deployment screenshot](evidence/nov25/railway-deployment.jpg) · [Details accessibility text](evidence/nov25/railway-deployment.txt).

## Original named context — existing-record check

| Field | Observed value |
| --- | --- |
| Site | https://team1-production.up.railway.app/ |
| Environment | Assistant-controlled desktop in-app browser; not physical iPhone Safari |
| School / year | Mahendra School / 2026–2027 |
| Class / room | Grade 6 · Class A / Room 101 |
| Term | School term 2026–2027 |
| Subject / code | Moral Education / SCH-MORAL |
| Saved teacher | Hari Adhikari |
| Before reload | Already present among eight class subjects |
| Expected | Existing assignment remains after a full page reload |
| Actual | Passed: after reload, reopened School management, reselected Grade 6 A and Subjects & timetable; Moral Education still showed Hari Adhikari among eight subjects |

[After-refresh screenshot](evidence/nov25/original-context-after-refresh.jpg) · [Complete after-refresh accessibility text](evidence/nov25/original-context-after-refresh.txt).

Reload returned navigation to Overview and initially selected Grade 10 A when reopening School management. The tester explicitly reselected Grade 6 A before comparing; navigation defaults must not be mistaken for lost assignments.

No school record was added, unlinked, reassigned or deleted. The existing assignment was deliberately preserved. Therefore this proves current existing-record read-back for the original named combination, **not** a repeat of the original create/save flow, original database IDs, original failing revision, or a diagnosed fix. No new API/SQL check is claimed.

## Galan's physical-iPhone follow-up

On November 25, Galan followed the guided steps on his iPhone: open School management, select Grade 6 A and Subjects & timetable, confirm Moral Education / Hari Adhikari, refresh the page, reopen the same class/section and confirm it remains. He answered yes before and after refresh, then supplied [this original phone screenshot](evidence/nov25/galan-iphone-after-refresh.jpg).

The image visibly shows Moral Education with Hari Adhikari and the hosted domain `team1-production.up.railway.app`. It supports his reported existing-assignment result. The selected class/year/term and reload action are not visible in this cropped view; Grade 6 A comes from the guided conversation. Galan subsequently confirmed Safari on his iPhone. The iOS version remains unconfirmed. The 07b4926 deployment above was verified separately during the assistant check, not captured on his phone; no exact phone-run revision is independently established.

**Result:** user-reported physical-iPhone existing-record refresh pass, with supporting screenshot. This is Galan's execution, not Codex's and not an independent non-author test. It does not repeat creation/save or establish the original failing revision/record IDs. No assignment was removed for this check.

## Galan's new-subject sequence — iPhone Safari

Galan supplied five sequential screenshots and explicitly confirmed this run was on iPhone Safari. This is his execution; Codex organized the evidence. The third picture identifies Grade 6 · Class A · Room 101 and School term 2026–2027.

| Step / original picture | Visible observation |
| --- | --- |
| [1. Create subject](evidence/nov25/galan-new-subject-1.jpg) | Creation form contains subject code `New subject`, subject name `New01`; Save to grade library is available. This picture is before submission. |
| [2. Library result](evidence/nov25/galan-new-subject-2.jpg) | Grade 6 library count is 12; searching New displays New01 with code New subject. Supports the creation result, not reload persistence. |
| [3. Assign teacher](evidence/nov25/galan-new-subject-3.jpg) | Add class subject popup shows New01, Gita Gurung · T07 selected and Confirm subject. Selection is visible; submission is not captured. |
| [4. Changed teacher](evidence/nov25/galan-new-subject-4.jpg) | New01 appears in class subjects with displayed teacher name `ibib`. Moral Education / Hari Adhikari remains visible. |
| [5. Timetable placement](evidence/nov25/galan-new-subject-5.jpg) | New01 / ibib appears Sunday 10:00–11:00 in the weekly timetable. |

**Galan's explanation:** Gita Gurung was unavailable due to a schedule collision, so he changed the subject teacher before placing the lesson. The images show the selected and resulting teacher names, but do not capture the conflict message; collision handling is user-reported, not independently established by these pictures.

**Current result:** new catalogue subject, class assignment with changed teacher and timetable placement are supported. Galan then reported that it remained after refresh and supplied [6. After-refresh class subjects](evidence/nov25/galan-new-subject-6-after-refresh.jpg). The image shows nine class subjects, including New01 / ibib and Moral Education / Hari Adhikari. **New-assignment class-list persistence passed in this reported iPhone Safari run**, supported by the sequential pictures. The reload action and class selector are not visible in picture 6; their context comes from the guided conversation. This does not by itself close the original-case acceptance in #83. This uses a different subject/teacher from the original Moral Education / Hari Adhikari case, and the exact phone-run deployment SHA is not established. The pictures do not show whether the existing Sunday Science lesson was moved or removed; no schedule-preservation claim is made.

**Timetable follow-up:** when specifically asked whether New01 remained in Sunday’s 10–11 AM slot after refresh, Galan answered yes. Timetable persistence therefore passed as a user-reported physical-iPhone Safari result. Picture 5 shows placement before refresh; picture 6 shows the class list after refresh. No separate after-refresh timetable image was supplied. The original subject/teacher creation sequence, exact phone-run revision and independent acceptance remain separate limits. No further school-data change is needed for this completed scoped check.

## Disposition and next owner

The [November 19 Ansh physical-phone pass](ansh-subject-persistence-retest.md) is completed for Discrete Mathematics / Farhan Khan / Grade 6 A. Correct #83's stale outstanding-phone prose while retaining its different-combination limitation.

Keep #83 open. Galan owns coordinating an agreed disposable fixture for an original-combination new-assignment → save → full refresh check on physical iPhone Safari; Ansh is the proposed peer retester, subject to his confirmation. Record the then-active deployment SHA, class/term and record IDs, expected/actual and safe proof. The current production assignment already exists, so removing it solely to manufacture a new-assignment test would change school data and was not done. If a safe equivalent fixture is used, label that difference explicitly. #106 remains behind this reliability check; teacher dashboard is core and parent dashboard stretch.

No new product fix, human sign-off, full live-role acceptance or independent test is claimed.
