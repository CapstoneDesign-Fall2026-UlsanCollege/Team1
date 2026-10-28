# C0 — Non-author test procedure and pending record

**Issue:** [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/61)

**Coordination owner:** `bishal482` in [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).

**Current result:** NOT RUN BY A CONFIRMED NON-AUTHOR. This procedure is prepared with coding assistance. It is not a tester's attestation.

## Purpose and boundaries

A teammate who did not implement C0 should execute this independently, without the author coaching each step. Record confusion as well as errors. The local path below uses fictional in-memory accounts and no MySQL connection. It can verify UI/role behaviour; it cannot verify real database persistence or Railway deployment.

The author or a coding assistant may rehearse these instructions, but that does not satisfy the independent-test requirement. Do not copy the existing assistant-run results into the Actual result field.

## Local prerequisites and start point

Use **PowerShell** with Node.js 22 or 24 and npm installed. Work from a **fresh clone of the published Team1 main branch**, not the author's working directory containing unfinished extension code. No database credentials are needed. Verify the terminal location first:

```powershell
Get-Location
git rev-parse --show-toplevel
git status --short
git rev-parse HEAD
```

Expected: the clone root is Team1, status is clean, and the commit contains `backend/scripts/c0-review.mjs`. Record that exact commit in the result. The report/fixture commit contains the published C0 workspace; it does not publish menu/room/teacher draft code.

From that clone root:

```powershell
npm.cmd ci --prefix backend
npm.cmd ci --prefix frontend
npm.cmd --prefix backend run build
$env:VITE_BASE_PATH = '/'
$env:VITE_API_ORIGIN = ''
npm.cmd --prefix frontend run build
node backend/scripts/c0-review.mjs
```

Keep this terminal running. Open `http://127.0.0.1:3018/`. The terminal supplies a random temporary password for the fictional `review_admin`, `review_student` and `review_canteen` accounts. Do not photograph the terminal or publish the password. Restarting the fixture resets all users and sessions. If port 3018 is busy, set a different `$env:C0_REVIEW_PORT` before starting and use that port in the browser.

## State the expected result before executing

- Canteen head lands in a dedicated canteen workspace with no academic administration or job controls; reload restores the workspace and logout ends access.
- Administrator can create and disable canteen-head accounts under **Accounts → Canteen staff**, but has no daily menu controls.
- Student and canteen-head sessions cannot access administrator APIs; administrator/student sessions cannot access the canteen workspace API.
- Disabling a canteen-head account ends its existing sessions and rejects a new login.

## Repeatable steps

1. Sign in as `review_canteen` using the fixture password. Record the page heading and visible controls. Expected: **CANTEEN HEAD WORKSPACE**, with an explicit notice that menu controls come next.
2. Reload. Expected: the same workspace returns without another login. Sign out, reload, and confirm that the login form returns.
3. Sign in as `review_admin`. Open **Accounts → Canteen staff**. Expected: only account provisioning and active-status controls; no daily menu or price editor.
4. Create a fictional account, such as `review_new_head`, with a temporary password meeting the form's rules. Record no password in the test note. Try that same login ID again; expect a duplicate-ID error.
5. In a private browser window, sign in as the new fictional head. Reload and confirm the workspace remains correct. Keep this window open.
6. Back in the administrator window, disable that account and confirm the named action. In the private window, reload. Expected: its session is rejected and it must log in again; a new login with the disabled account also fails.
7. Return to the administrator window. Enable the account, then reload the old private-window session. Expected: the revoked session does not come back. A fresh login may succeed.
8. As `review_canteen`, visit `/api/admin/canteen-accounts` and `/api/student/profile` in the same origin. Expected: HTTP 403, no protected data. As `review_student` or `review_admin`, visit `/api/canteen/home`; expect 403. Use browser developer tools Network status if needed; do not include cookies in screenshots.
9. Check the staff form and canteen workspace at a phone-sized browser width. Expected: readable controls and no horizontal overflow. Record the tested width.
10. If any step fails, record the **first failing step**, actual message and screenshot. Keep the criterion incomplete; link a bug with one owner and next action.

Take screenshots of the fictional workspace and result messages only. Other academic/job features are not wired in this focused local fixture; their error states are not a result for C0.

## Tester-owned result record

The non-author must replace these pending fields after execution:

| Field | Current record |
|---|---|
| Tester GitHub login | Not confirmed |
| Tester did not implement C0 | Not confirmed |
| Actual date/time and environment | Not run |
| Exact tested commit | Not recorded by tester |
| Expected result | Defined above before execution |
| Actual result | Pending; no independent pass claimed |
| First failing step | Unknown until run |
| Proof links | No tester-owned proof supplied |
| Problem found | Unknown until run |
| Next action | `bishal482` confirms a non-author tester; tester follows these steps and edits this record or links their own issue comment |

- [ ] Tester identity, date, commit and environment entered by the actual tester.
- [ ] Expected and actual results and first failure are recorded.
- [ ] Safe screenshots/recording linked.
- [ ] Issue #61/#65 status reflects this result rather than the procedure alone.

## Separate live check

After Railway is accessible, repeat the approved-account workflow against the actual deployment and record its deployed commit and database result separately. Do not create production accounts without approval. The October 28 public check returned 404; this local fixture is a fallback, not a resolution of that deployment gap.
