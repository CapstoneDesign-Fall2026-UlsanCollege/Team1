# CoderRaaju — Week 12 Individual Assignment

**Student:** Bal Raju (`CoderRaaju`)  
**Team:** Team 1 — StudentHub  
**Date:** November 24, 2026 (Asia/Seoul)  
**Related issues:** [#54 — menu publication](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54) · [#56 — item availability](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/56)

## My Week 12 task

Carry the Week 11 canteen check forward by verifying what a student sees after a canteen head saves, publishes, changes availability, or withdraws a menu. Week 11 established isolated API behavior and hosted role reads. Week 12 added browser evidence and checked publication and withdrawal from fresh student sign-ins. [Week 11 baseline](../week11/coderraaju-individual-assignment.md#canteen-test-results) · [Final demo roadmap](../final-demo-roadmap.md)

## Frozen demo behavior being checked

**Save draft → student sees no menu → publish → student sees the item → mark sold out → restore availability → withdraw → student sees no menu.**

This assignment verifies the existing canteen flow. The team's primary Week 12 QA target is tracked separately in [the #83 bug report](bug-report-83.md).

## Test environment

| Field | Recorded setup | Evidence |
| --- | --- | --- |
| Tested revision | Frontend and backend at [`563740a`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/563740a0e85413b91bccbb9b6ecdd678938d6d94) | [Browser run metadata](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L1-L8) |
| Browser and device | Chromium 156.0.8078.79, Debian Linux, 1280 × 800 desktop viewport | [First browser run](evidence/coderraaju-canteen-browser-2026-11-24.txt) |
| Starting state | Empty menu table in disposable MySQL 8.4, November 24 Nepal service date, fictional canteen-head and student accounts in separate browser contexts | [Fresh-session run](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L6-L8) |
| Runner | Codex drove the built StudentHub UI with Playwright. The existing API suite ran separately against isolated MySQL. | [API test source](../../backend/tests/canteen-menu.test.mjs) · [API output](evidence/coderraaju-canteen-2026-11-24.txt) |

## Expected and actual results

**Result: all five browser check groups passed on the local fixture.** The backend build and all 14 isolated API checks also passed, with zero failures or skips. The table links each result to its proof. [Browser run](evidence/coderraaju-canteen-browser-2026-11-24.txt) · [API output](evidence/coderraaju-canteen-2026-11-24.txt)

### Fresh-session retest and visual proof

| Step | Expected result | Actual result | Evidence |
| --- | --- | --- | --- |
| 1. Open student Canteen before any menu exists | Student sees the empty state. | The menu table was empty and the student page showed no published menu. | [Starting-state log](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L6-L8) |
| 2. Save draft and reload as student | Canteen head can save the draft. Student cannot see the item. | Save returned HTTP 200. The student saw the empty state and the sample item was absent. | [Draft screenshot](evidence/coderraaju-browser/01-draft-hidden.jpg) · [Draft assertion](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L8) |
| 3. Publish and sign in as student in a fresh browser context | The new session sees the published item, price and availability. | The student saw **Week 12 QA sample lunch**, **NPR 70**, and **Available**. | [Published menu screenshot](evidence/coderraaju-browser/02-fresh-login-published.jpg) · [Publication assertion](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L9) |
| 4. Mark sold out and reload | Student sees Sold out and the item and price stay the same. | **Sold out** appeared after reload. The sample lunch still cost **NPR 70**. | [Sold-out screenshot](evidence/coderraaju-browser/03-sold-out.jpg) · [Sold-out assertion](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L10) |
| 5. Restore availability and reload | Student sees Available with the same item and price. | **Available** returned. The name and price stayed the same. The separate API suite also verified restored availability after server restart. | [Restoration assertion](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L11) · [API output](evidence/coderraaju-canteen-2026-11-24.txt) |
| 6. Withdraw and sign in as student in another fresh context | Student sees no published menu. The saved menu remains an unpublished draft. | A fresh sign-in showed the empty state. The database held exactly one unpublished row for the service date. | [Withdrawal screenshot](evidence/coderraaju-browser/04-fresh-login-withdrawn.jpg) · [Browser and database assertion](evidence/coderraaju-canteen-fresh-session-2026-11-24.txt#L12) |

## Repeatable test steps

1. Use the recorded StudentHub revision with an empty disposable MySQL fixture and fictional accounts for the current Nepal service date.
2. Open separate browser contexts for canteen head and student. Create a sample item, save as draft, then reload Canteen as student.
3. Publish the menu. Close the student context, sign in from a clean context and compare the item, price and availability.
4. Mark the item sold out, reload as student, restore availability and reload again. Check that name and price remain correct each time.
5. Withdraw the menu, start another clean student session and confirm the empty state. Check that the fixture has one unpublished row for the service date before removing the fixture.

## Week 12 contribution summary and disposition

**Verified local all-clear.** The fresh sign-ins confirmed that publication and withdrawal survive beyond the original student tab. The database check confirmed that withdrawal hides the menu while retaining the draft. The observed result supports keeping the existing hosted acceptance priority for #54/#56. It produced no confirmed defect to fix or severity to assign. [Shared weekly report](weekly-report.md#individual-entries--confirmation-status-explicit) · [Peer handoff notes](peer-test-notes.md#canteen-qa-handoff--november-24)

The Railway browser repeat requires an agreed fixture because production menus are shared by date. Galan coordinates the fixture and the deployed revision for that check. The result above covers the local browser and API runs. Codex performed those runs and drafted this receipt at the user's request through the CoderRaaju connection. [Week 12 AI-use audit](ai-use-and-code-ownership-audit.md)
