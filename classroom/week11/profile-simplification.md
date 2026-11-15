# One profile header and an on-demand QR

**Owner:** Galan Bishal · **Date:** November 15, 2026 · **Issue:** [#98](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/98)

The student Profile now shows name, avatar, school, student ID and current class/year once. It replaces the old summary box plus My student card box. Identity details remain visible from the existing profile response if the card request fails; QR/download actions wait for a valid card.

Show QR opens a compact native dialog with a 180px QR, Close button, student ID and “Staff login required” caption. The longer explanation is under About this QR. Refresh QR is inside this dialog, rather than taking space in the main profile. Native dialog behavior handles Escape and focus return. Download card is available in the profile and the dialog; the same PNG generation and protected lookup are retained. The download link is now attached before clicking for browser compatibility.

Contact details contains only email, phone and address, with Edit contact details / Cancel. Duplicate name/school rows and the extra contact-panel box/tinted header were removed. Identity and contacts use one divider, modest spacing, wrapping action rows and touch targets of at least 44px. No backend, identity, QR access or database changes were required.

## Validation

- Frontend production build passed after correcting an initial local file-encoding error.
- [22 frontend tests passed](evidence/profile-simplification-tests.txt), including QR PNG decoding. The QR test also decodes a compact 180px image using the longer Railway origin, matching the intended popup display size.
- Source review confirmed that the QR image exists only inside the dialog, the retired summary/card boxes are gone, contact rows contain only the three contact fields, and the existing download flow remains wired to both buttons.
- No additional backend suite was run for this frontend-only layout change. Existing permission evidence is in [the QR implementation note](student-profile-qr.md).

Browser setup still reports `Trusted RPC service is not configured: browser`. No live visual, physical-phone, actual download or dialog-interaction pass is claimed. The corresponding Definition of Done stays open in #98 and the original scan check stays open in #97.

## Remaining manual check

1. Open Profile at desktop and phone widths; confirm identity appears once and only contact fields appear below it.
2. Open Show QR, then test Close and Escape; focus should return to Show QR. Test Refresh QR and expand About this QR.
3. Download the card from each location and scan it using an approved fictional student record. Confirm staff sign-in and role restrictions still work.
4. Edit/cancel/save contact details. Confirm ordinary navigation still works and the main profile no longer requires scrolling past a large QR.

Keep real profiles and QR references out of shared screenshots. Hosted release evidence is recorded in [#98](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/98).
