# Parent accounts and dashboard — #99

Implemented by Galan Bishal with assistant support, November 16, 2026.

## School administrator

1. Open **Accounts → Parents → Create parent**.
2. Verify the guardian's authority using school records. Enter their name and at least one contact method.
3. Search for the child by name or student ID. Check their class before selecting them.
4. Choose the relationship. The suggested login is `P` followed by the child's student ID, such as `P2412061`. Another guardian receives an unused suffix such as `P2412061B`.
5. Set an initial password of at least 12 characters and share it privately. The parent must change it before viewing child records.
6. Use **Linked children** to add another verified child, remove a link or restore it. A parent's login stays the same when another child is added. Disable the account to end its sessions.

The permanent database links grant access. Knowing a student ID, changing a login prefix or scanning a student QR does not establish guardianship. Multiple guardians can link to one child; one parent can link to multiple children.

## Parent

Use the normal sign-in page. After the initial password change, sign in again to see the dashboard. It provides child selection, current class/homeroom teacher, attendance, homework, grouped weekly lessons, upcoming special-room bookings, published notices and today's published canteen menu.

Attendance uses O present, X absent, − late and E excused. Three late marks add one adjusted absence within the selected month. Original marks remain unchanged; unmarked dates do not become absences. Changing the displayed month does not change today's overview status.

Parents can update their own email/phone and password. Academic records and child links are read-only. Email-based password requests use the existing administrator review process; parents without a registered email contact the school directly. Administrator resets require another first-login password change.

Administrators publish dated announcements from **School notices**. Draft and expired notices remain hidden from parents. Parent accounts and verified child links are excluded from school CSV transfer. Relevant changes appear in Activity Log without passwords or contact values.

## Verification

- Both TypeScript/production builds passed.
- [Backend results](evidence/parent-workspace-backend-tests.txt): 93 passed, zero failed/skipped, including parent creation, password gate/session invalidation, cross-child/role denial, multiple child links, stale-link versions, disable/remove access, notices, menu publication, contact/reset, CSV exclusion and audit redaction.
- [Frontend results](evidence/parent-workspace-frontend-tests.txt): 22 passed.
- Assistant-run local browser check used only disposable fictional school/guardian data. Verified switching between two linked children, homework instructions, grouped Sunday–Friday timetable, current notice, attendance totals (three lates plus one absence = two adjusted absences), the initial-password gate, administrator parent list, student search/login suggestion and verified-link controls.
- [Mobile attendance](evidence/parent-attendance-mobile.jpg) and [create-parent popup](evidence/parent-create-mobile.jpg) were captured from that fictional fixture, without credentials.
- Browser form creation/password mutations were covered through API tests, not submitted through the browser. A physical-phone and independent human check remain pending; these results do not claim either.

## Railway rollout

Source [6977501](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/697750118a2ddde2c887fdd29cc6c18825ed49b2) was pushed to main. [GitHub CI passed](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/runs/43740866612).

Assistant-run live HTTP checks on November 16 confirmed the public root returned 200 and the served JavaScript contained the new parent dashboard. An approved administrator session received 200 from `/api/admin/parents` and `/api/admin/notices`, both initially empty; the same admin was denied `/api/parent/children` with 403. Guests received 401 from both parent/administrator paths. The test session was logged out. This verifies deployed route/schema availability, not a real guardian's full hosted workflow. No real parent accounts or links were created, and no production school data was replaced.

At a 390px simulated browser viewport, the final attendance page had no horizontal page overflow, a 347px child selector and an internally scrolling register. This is a desktop browser viewport check, not physical-phone evidence.

## Reproduce locally

Use PowerShell in the repository root, configure the backend environment as described in the main README, then build both packages. For a disposable school review, set `PARENT_REVIEW=1` and `TEACHER_REVIEW_ATTENDANCE=1` before running `backend/scripts/teacher-review.mjs` with the configured backend environment. The script prints temporary credentials privately, serves on port 3019, and deletes its own isolated review database after `stop`. Never record those passwords in evidence.

The normal server applies the additive parent schema at startup. Existing accounts retain their roles; existing school records are preserved. No real guardian accounts are created automatically.

## Child-search layout correction

Fixed a shared full-width form-button rule squeezing the student search input. Search now uses a two-column grid on wider screens and stacked controls on phones. The production frontend build passed. Assistant browser checks at 800, 390 and 320 pixels confirmed input widths of 424, 288 and 218 pixels, with no horizontal dialog overflow. Searching and selecting the fictional Aarav Example record populated its P-prefixed login. [Measurements](evidence/parent-child-search-layout.json) · [Screenshot](evidence/parent-child-search-fixed.jpg). This corrects the earlier incomplete popup layout check.
