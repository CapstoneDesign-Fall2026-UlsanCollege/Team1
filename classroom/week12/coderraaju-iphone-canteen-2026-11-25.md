# Bal Raju — hosted canteen check, November 25

**Student / login:** Bal Raju / CoderRaaju  
**Browser / device:** Safari on iPhone, as supplied in the conversation  
**Site:** https://team1-production.up.railway.app/  
**Menu date:** November 25, 2026  
**Attribution:** Galan supplied these nine original screenshots and identified Bal Raju as the person who performed the steps. This is a reported personal run, not a Codex-executed browser run. Codex organized the supplied evidence and drafted this documentation. The report does not independently authenticate the operator.

## Starting state and bounded objective

The account-creation form contains login ID Bal_can; the next image shows that account active. The canteen workspace is signed in as Bal_can. For November 25 it initially shows Draft, zero items, zero available and zero sold out. This is the starting state of the selected menu, not evidence of an empty database or isolated school fixture. Other staff accounts and saved-price suggestions already exist.

**Expected:** create a canteen-head account, enter three menu items and rupee prices, publish the selected menu, update a price, and make the published menu available to students. Copying to other days is a supplementary action.

**Revision:** exact deployed source SHA during this phone run was not captured. The desktop deployment receipt elsewhere in Week 12 is a separate observation and is not substituted here. iOS version, clean-session conditions and an agreed disposable fixture were not recorded.

## Ordered screenshots and actual observations

| Step | Expected | Actual visible evidence |
| --- | --- | --- |
| [1. Create account](evidence/coderraaju-iphone-2026-11-25/01.jpg) | Administrator enters a canteen-head login | Bal_can is entered; password is masked. Form is before submission. |
| [2. Account saved](evidence/coderraaju-iphone-2026-11-25/02.jpg) | New account appears enabled | Bal_can is listed Active · Canteen head. |
| [3. Open workspace](evidence/coderraaju-iphone-2026-11-25/03.jpg) | Account opens the canteen dashboard | Bal_can appears in the workspace; November 25 selected, Draft with zero items. |
| [4. Enter items](evidence/coderraaju-iphone-2026-11-25/04.jpg) | Enter names, prices and availability | Chowmein NPR 100 and Choila NPR 100 are visible in editing fields; changes are ready to save. |
| [5. Review menu](evidence/coderraaju-iphone-2026-11-25/05.jpg) | Review the proposed menu | Mandu NPR 1000 and Chowmein NPR 100 appear; Choila is partly visible. Publish menu is available. |
| [6. Published status](evidence/coderraaju-iphone-2026-11-25/06.jpg) | Publishing changes the selected menu status | Published, three items, three available, zero sold out; Mandu NPR 1000 is visible. |
| [7. Price edit](evidence/coderraaju-iphone-2026-11-25/07.jpg) | Change Mandu price to NPR 100 | Mandu field shows 100, with Save changes available. Published status is visible, but this image alone does not establish that this price edit was saved/read back. |
| [8. Open copying](evidence/coderraaju-iphone-2026-11-25/08.jpg) | Choose dates in the copy dialog | Apply menu to selected days is open with the November calendar. |
| [9. Select destinations](evidence/coderraaju-iphone-2026-11-25/09.jpg) | Choose Friday and Saturday | November 27 and 28 selected. UI says copies are drafts and existing menus will be skipped. This is before copy submission; no completion/read-back is pictured. |

## Reported results and acceptance status

The supplied explanation reports adding menu/prices, changing prices, copying to other days, publishing, and students being able to see the menu. The nine pictures support account creation, dashboard access, item entry, publication status, price editing and copy-date selection.

**Scoped observed result:** account creation and November 25 menu publication are supported by before/after images. Mobile controls for price editing and copy-date selection are demonstrated.

**User-reported, without direct result picture:** saved price change, completed copies and student visibility. None of these nine images shows the student dashboard. Preserve the reported result without presenting it as screenshot-verified fresh-session acceptance. Draft privacy, withdrawal, sold-out behavior and persistence after reload were not demonstrated by this phone sequence.

## Definition of Done and next evidence

- [x] Record starting menu state, device/browser, selected date and nine direct picture links.
- [x] Preserve the reported tester identity and clearly distinguish human-reported execution from documentation assistance.
- [x] Show active account and menu Published status.
- [ ] Capture exact deployed revision and confirmed fixture conditions.
- [ ] Show saved NPR 100 after reload and the student Canteen view in a fresh sign-in, comparing date/item/price.
- [ ] If claiming copy completion, show destination November 27/28 drafts after saving; otherwise retain it as demonstrated selection only.

No runtime change or full hosted acceptance is claimed. These targeted follow-ups stay within the frozen canteen demo path. Earlier local automated checks retain their original runner and revision in the [individual evidence](coderraaju-week12-individual-evidence.md).
