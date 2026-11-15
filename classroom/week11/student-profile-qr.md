# Student QR card inside Profile

**Owner:** Galan Bishal · **Date:** November 15, 2026 · **Issue:** [#97](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/97)

## Implemented

Profile now contains My student card between the profile summary and Personal Information. It shows school, name, student ID, current class/year and a locally generated QR image. Refresh card reloads the current record. Download student card creates a PNG containing those identification details and the QR, without contact information. An avatar/photo-upload feature is not added.

The QR contains a same-site URL with a random 256-bit record reference in its fragment. It contains no name, student number, contact fields, password or login session. Generation uses [node-qrcode](https://github.com/soldair/node-qrcode); no external QR-generation service receives student data.

Scanning opens a lookup view. A visitor must log in before any record is returned. Administrators can read active student cards; teachers must have an active teacher record and an active subject assignment in the student's current class and term. Students and canteen staff cannot use the staff lookup. The returned identity summary excludes email, phone, address, credentials and the QR reference itself.

References persist in `school_student_cards`, keyed to the student's internal account ID. Changing a login ID or class does not break the reference; lookup reads current details. Inactive accounts and ended teacher assignments are rejected. References are excluded from school CSV transfer packages. Startup creates the new table additively; existing accounts are preserved.

This is an identification reference, not proof that the person holding it is the student. Scanning does not record attendance. The printed/downloaded details are a snapshot; staff lookup reads current data. Card lookup and downloading require a working site; a local-host QR cannot be reached by a separate phone.

## Actual automated checks

| Check | Actual result |
|---|---|
| Full backend suite, with DB checks enabled | 87 passed, no failures or skips |
| New card access/persistence integration check | Stable own reference, distinct student references, forged student-ID query ignored, anonymous 401, student/canteen 403, unrelated teacher 404, assigned teacher/admin allowed |
| Inactive records and current class | Disabled student/teacher denied; ended teacher term denied; later membership and renamed login read through the original reference |
| CSV | Card-reference table excluded from exported package |
| Frontend tests | 22 passed, including PNG QR encoding/decoding back to the exact same-site fragment URL and malformed/cross-origin link rejection |
| Production builds | Backend and frontend passed |
| Dependency audit | QR dependencies have no reported production vulnerabilities; updated the existing Vite lockfile to patched 8.3.8 within its declared range |

One initial test incorrectly expected no later membership in a fixture that already had a future class. The assertion now checks that later class, and the date/record fixture is restored in `finally`; the complete suite passed afterwards.

## Remaining browser check

The browser tool could not connect in this session (`Trusted RPC service is not configured: browser`). No visual, browser-download, login-continuation or physical-phone scan pass is claimed. Keep the last criterion in #97 unchecked until this is actually run:

1. Log in as a fictional student and open Profile. Confirm the card appears above Personal Information at phone and desktop widths.
2. Download the PNG and scan both its QR and the on-screen QR with a phone.
3. Confirm a signed-out browser requests login and preserves the destination through login.
4. Sign in as an administrator or current assigned teacher; confirm the correct identity/class appears. Try an unrelated teacher and confirm access is denied.
5. Use Back to dashboard and verify normal navigation. Do not publish a real student's profile, contact details or QR in proof.

## Evidence

- [Backend results](evidence/student-card-backend-tests.txt)
- [Frontend results](evidence/student-card-frontend-tests.txt)
- [QR decoding test](../../../frontend/tests/student-card.test.mjs)
- [Hosted API check, without student data or credentials](evidence/student-card-hosted-check.json)

Source [425b99c](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/425b99c) reached Railway. The live site returned HTTP 200 with the QR-card bundle. Anonymous staff lookup returned 401; an authenticated administrator received the expected 404 for a nonexistent reference (confirming the route and reference table work), and 403 when attempting the student-only card endpoint. No real student reference was minted by this hosted check. Both GitHub workflows passed for the source commit. Browser/phone verification remains open in [#97](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/97).

