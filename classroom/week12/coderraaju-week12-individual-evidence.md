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

## Disposition and handoff

Hosted browser acceptance is blocked on an agreed fixture or isolated deployment. Production menus are shared by service date, and an approved live fixture was not confirmed for this run. The API result found no new defect, so it supports no bug severity or application fix. Keep the existing live acceptance priority and #54/#56 open. Galan coordinates the fixture. Bal Raju can then use separate browser sessions to repeat the same steps, record the deployed revision and device/browser, capture safe proof, and restore the agreed fixture state.

**Attribution:** Codex ran this check and drafted the evidence at the user's request via the CoderRaaju connection. Bal Raju's personal browser result and confirmation of the contribution entry are separate course requirements.
