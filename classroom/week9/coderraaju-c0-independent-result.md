# CoderRaaju — Week 9 C0 Independent Test Result

**Student:** Bal Raju  
**GitHub login:** `CoderRaaju`  
**Team:** Team 1 — StudentHub  
**Week:** 9  
**Role:** Non-author tester for C0  
**Related Issues:** #61, #65  
**Procedure:** `classroom/week8/c0-independent-test.md`

## Why this test matters

Week 9 feedback says an earlier C0 test plan is not a test result. This receipt records the actual setup, tested version, expected behavior, observed behavior, first failure (if any), and safe evidence from my own independent run.

This local result does not prove a successful live Railway deployment.

## Test setup

- **Date/time:** PENDING
- **Operating system:** Windows
- **Shell:** Command Prompt / PowerShell — PENDING
- **Repository:** `CapstoneDesign-Fall2026-UlsanCollege/Team1`
- **Exact tested commit:** PENDING
- **Test environment:** local C0 fictional-account fixture
- **Live deployment tested:** No

## Build/setup result

| Check | Expected | Actual |
|---|---|---|
| Backend dependencies install | Completes without blocking error | PENDING |
| Frontend dependencies install | Completes without blocking error | PENDING |
| Backend build | TypeScript build succeeds | PENDING |
| Frontend build | Production build succeeds with C0 root-path settings | PENDING |
| C0 fixture starts | Opens local fixture on `127.0.0.1:3018` | PENDING |

## Canteen-head behavior

| Check | Expected result | Actual result |
|---|---|---|
| Login as fictional canteen head | Login succeeds | PENDING |
| Dedicated workspace | Canteen Head workspace appears | PENDING |
| Session reload | Reload keeps the correct role/session | PENDING |
| Logout | Session ends and login is required again | PENDING |
| Academic/admin controls | Canteen head cannot use academic administration | PENDING |

## Administrator account-management behavior

| Check | Expected result | Actual result |
|---|---|---|
| Admin opens Canteen Staff | Staff-account management is visible | PENDING |
| Create fictional canteen-head account | Valid account is created | PENDING |
| Duplicate login ID | Duplicate is rejected | PENDING |
| Disable account | Account becomes inactive | PENDING |
| Existing disabled session | Existing session is rejected after refresh/request | PENDING |
| Disabled login | Disabled account cannot sign in again | PENDING |

## Permission-boundary checks

| Request / behavior | Expected | Actual |
|---|---|---|
| Canteen head → admin-only API | `403` | PENDING |
| Canteen head → student-only API | `403` | PENDING |
| Wrong role → canteen workspace/write API | `403` | PENDING |
| Anonymous protected request | denied | PENDING |

## Mobile/manual layout check

- **Viewport width tested:** PENDING
- **Expected:** no page-level horizontal overflow; controls remain usable.
- **Actual:** PENDING

## Overall result

**Result:** NOT YET RECORDED

## First failing step

PENDING

## Evidence

Add only safe evidence. Do not publish temporary passwords, cookies, tokens, or real personal data.

- Screenshot 1: PENDING
- Screenshot 2: PENDING
- Screenshot 3: PENDING
- Tested commit link: PENDING
- Issue comment: PENDING

## What this result establishes

PENDING

## What this result does not establish

- It does not establish that Railway is restored or live.
- It does not establish that the new middle/high-school homeroom flow is implemented.
- It does not replace later deployment/browser verification for other slices.

## Next action

If every required C0 check passes, record the actual result in the Week 9 shared report and link this receipt in Issues #61/#65.

If any check fails, keep the overall result as FAIL/PARTIAL, record the first failing step, and link one concrete fix/retest action.
