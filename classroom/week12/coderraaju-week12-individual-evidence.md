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
