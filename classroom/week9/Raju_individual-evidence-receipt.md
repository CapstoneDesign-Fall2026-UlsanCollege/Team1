# Individual Evidence Receipt — Bal Raju

**Student:** Bal Raju (`CoderRaaju`)  
**Team:** Team 1 — StudentHub  
**Week:** 9 — October 29–November 4, 2026  
**Test role:** Non-author tester for the C0 canteen-head workspace

This receipt records my Week 9 attempt to follow the team’s C0 independent-test procedure. I completed the local setup and build steps, but the review fixture stopped before the browser test could begin. I am not claiming that the C0 behavior passed.

## Receipt 1 — Local setup and build

- **What I did:** Cloned the Team 1 repository, checked the working tree and current commit, installed backend and frontend dependencies, and ran both production builds.
- **Environment:** Windows PowerShell; Git `2.56.0.windows.4`; Node.js `v24.22.2`; npm `11.19.1`.
- **Tested checkout:** Branch `main`, commit `b2b7b36a06bf1273c5bfdfc292e76607d6819bae`; `git status --short` showed no changes.
- **Commands run:**
  - `npm.cmd ci --prefix backend`
  - `npm.cmd ci --prefix frontend`
  - `npm.cmd --prefix backend run build`
  - Set `VITE_BASE_PATH` to `/` and `VITE_API_ORIGIN` to an empty value
  - `npm.cmd --prefix frontend run build`
- **Actual result:** Both dependency installations completed, and both backend and frontend builds succeeded.
- **Limit:** npm reported dependency audit vulnerabilities during installation. I did not run `npm audit fix` or change dependencies as part of this test.

## Receipt 2 — C0 fixture startup attempt

- **What I did:** Ran the documented local C0 review fixture command: `node backend/scripts/c0-review.mjs`.
- **Evidence:** [C0 independent-test procedure](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week8/c0-independent-test.md) · [C0 review fixture](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/scripts/c0-review.mjs)
- **Actual result:** The script stopped at its frontend-marker check with an error stating that this was not the published C0-only workspace and that I should use a fresh checkout of the report commit.
- **What I did next:** Checked `git status --short`, `git rev-parse HEAD`, and `git branch --show-current`. The working tree was clean, the branch was `main`, and the checkout was still at `b2b7b36`.
- **Limit:** I did not bypass the guard or edit the application or test script to force it to run.

## Test status and evidence boundary

**Result: BLOCKED before browser testing.**

The backend and frontend builds passed. The review fixture did not start, so I did not test login, workspace behavior, reload/logout, staff-account controls, permission boundaries, disabling accounts, or mobile layout. No browser screenshots or functional C0 result are claimed. This attempt does not establish a pass or verify the live deployment.

## What I learned

A successful build does not prove that a test fixture can run against the checked-out application, and a setup attempt is not the same as a feature test. I should record the exact commit, actual command output, and where the test stopped—and avoid claiming results for steps I did not reach.

## Next action

I will share the fixture startup error and tested commit with the project maintainer, then wait for confirmation of the correct published test commit or an approved fixture/procedure update. If the team provides one, I will use a fresh checkout and record the actual browser results, including any failures, without bypassing the guard.

## Confirmation

This receipt describes only the setup, builds, and blocked fixture-start attempt I performed. It does not claim that I completed the C0 browser test, verified C0 behavior, or tested a live deployment.
