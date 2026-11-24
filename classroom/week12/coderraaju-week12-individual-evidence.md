# Week 12 individual QA evidence — Bal Raju (CoderRaaju)

**Date:** November 24, 2026 (Asia/Seoul)
**Scope:** Canteen publication and availability, #54/#56. The team's primary Week 12 target remains [#83](bug-report-83.md).

## Week 11 starting state and Week 12 question

[Week 11](../week11/coderraaju-individual-assignment.md#canteen-test-results) recorded isolated passes and hosted role reads. The hosted menu write/read-back sequence remained unverified. This check asks whether the current backend still keeps a draft private, shows published changes to the student and hides the menu after withdrawal. The [final demo roadmap](../final-demo-roadmap.md) keeps that behavior inside the frozen scope.

## Conditions, steps and results

**Revision:** `563740a0e85413b91bccbb9b6ecdd678938d6d94` on Team1 main.
**Runner and environment:** Codex, Linux, Node.js test runner over HTTP, disposable MySQL 8.4. No browser or physical device used.
**Starting state:** Fresh temporary schema, fictional student and canteen-head accounts, and fixed service date set by the [existing suite](../../backend/tests/canteen-menu.test.mjs). No Railway data used.

| Step | Expected | Actual |
| --- | --- | --- |
| Save draft, read as student | Draft saves and student sees no menu | Save returned HTTP 200 and student read returned no menu. |
| Publish and read as student | Menu appears on the fixture date | Publish returned HTTP 200 and the student read returned the published menu. |
| Mark sold out, then restore | Status updates while name/price are preserved | Sold-out read preserved name and price. Restored availability survived restart. |
| Withdraw and read as student | Student no longer sees the menu | Unpublish returned HTTP 200 and the student read returned no menu. |

**Result:** Scoped API pass. Backend build passed and all 14 tests passed, zero failed or skipped. [Direct command and output](evidence/coderraaju-canteen-2026-11-24.txt).

## Browser retest — November 24

**Result: pass in the local browser fixture.** Codex drove the built StudentHub UI in Chromium 156.0.8078.79 on Debian Linux at 1280×800 using two separate browser contexts. The frontend and backend matched revision `563740a0e85413b91bccbb9b6ecdd678938d6d94`. The app used real canteen routes and a fresh disposable MySQL database. The only accounts and menu data were fictional. The Nepal service date was November 24.

| Browser step | Expected result | Actual result |
| --- | --- | --- |
| Start with an empty menu | Student view shows no published menu | Empty database was asserted and the student saw the empty-state message. |
| Save a draft, then reload as student | The draft is hidden | Draft save returned HTTP 200. After reload, the empty state was visible and the item was absent. |
| Publish and reload as student | Item, price and availability are visible | The student saw Week 12 QA sample lunch, NPR 70, Available. |
| Mark sold out, then restore availability | Each reload reflects the new status and the same item and price | Student saw Sold out and then Available on successive reloads. The item and NPR 70 stayed the same. |
| Withdraw and reload as student | Student returns to the empty state | Empty-state message returned and the item was absent. |

[Browser run output](evidence/coderraaju-canteen-browser-2026-11-24.txt) · [14-check API output](evidence/coderraaju-canteen-2026-11-24.txt).

## Disposition and handoff

Scoped all-clear for the local canteen browser and API flows. No application defect was observed, so no fix or bug severity was assigned. Hosted acceptance remains open for #54/#56 because the shared Railway deployment has no confirmed test fixture. Galan coordinates that fixture. Once agreed, repeat the browser sequence with two approved accounts, capture the deployed revision and safe evidence, and restore the agreed fixture state.

**Attribution:** Codex ran the tests and drafted the evidence at the user's request via the CoderRaaju connection. Bal Raju can review and confirm the shared report entry. This run did not include a separately observed personal test or uncoached peer trial.

## Fresh-session retest and visual proof

A second run started from a separate empty fixture at the same application revision and settings. After publication and withdrawal, Codex closed the student browser context, opened a clean context, signed in again and navigated to Canteen. This distinguishes a persisted publication state from data retained in the first tab.

| Check | Expected | Observed | Proof |
| --- | --- | --- | --- |
| Draft privacy | A student reload shows no published menu | The empty-state message appeared and the sample item was absent. | [Draft screenshot](evidence/coderraaju-browser/01-draft-hidden.jpg) |
| Publication across sessions | A new student session sees the published menu and correct price | After a fresh sign-in, the fictional sample lunch appeared with NPR 70 and Available. | [Fresh-login publication screenshot](evidence/coderraaju-browser/02-fresh-login-published.jpg) |
| Availability changes | After reload the item changes status and keeps its price | Sold out appeared after the first change. Available reappeared after restoration. Both reads retained the item and NPR 70. | [Sold-out screenshot](evidence/coderraaju-browser/03-sold-out.jpg) · [Output](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt) |
| Withdrawal across sessions | A new student session sees no menu and storage has no published row | A fresh sign-in showed the empty state. The database retained exactly one row for the date with publication disabled. | [Fresh-login withdrawal screenshot](evidence/coderraaju-browser/04-fresh-login-withdrawn.jpg) · [Output](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt) |

### Repeat the check

1. Run the StudentHub build on the recorded revision with a disposable database, fictional student and canteen-head accounts, and an empty menu for the Nepal service date.
2. Start separate browser contexts for the two roles. Save a fictional item as draft and reload Canteen in the student context.
3. Publish the draft, close the student context, sign in from a clean context and compare the item name, price and availability.
4. Mark the item sold out, reload as student, restore availability and reload again. Compare name and price on both reads.
5. Withdraw the menu and repeat the clean-context sign-in. Confirm that the empty-state message returns and that the isolated database has one unpublished row for the date. Remove the disposable fixture.

### Disposition from the added evidence

**Verified scoped all-clear.** The second run adds fresh-session and database evidence to the earlier reload checks. This supports keeping canteen readiness work focused on the existing hosted acceptance gate instead of changing application code. The shared production fixture was unavailable for this run, so hosted acceptance remains outside the verified scope and retains its existing priority. This is a Codex-executed retest. The course's non-author human and personal confirmation criteria require a separately attributable result.
