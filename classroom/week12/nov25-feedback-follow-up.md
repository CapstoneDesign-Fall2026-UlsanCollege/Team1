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

## Disposition and next owner

The [November 19 Ansh physical-phone pass](ansh-subject-persistence-retest.md) is completed for Discrete Mathematics / Farhan Khan / Grade 6 A. Correct #83's stale outstanding-phone prose while retaining its different-combination limitation.

Keep #83 open. Galan owns coordinating an agreed disposable fixture for an original-combination new-assignment → save → full refresh check on physical iPhone Safari; Ansh is the proposed peer retester, subject to his confirmation. Record the then-active deployment SHA, class/term and record IDs, expected/actual and safe proof. The current production assignment already exists, so removing it solely to manufacture a new-assignment test would change school data and was not done. If a safe equivalent fixture is used, label that difference explicitly. #106 remains behind this reliability check; teacher dashboard is core and parent dashboard stretch.

No new product fix, human sign-off, full live-role acceptance or independent test is claimed.
