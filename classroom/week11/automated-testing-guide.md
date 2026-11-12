# StudentHub automated testing guide

**Team:** Team 1 — StudentHub  
**Week:** 11  
**Updated:** November 12, 2026  
**Owner:** Galan Bishal (@bishal482), prepared with coding assistance  
**Issue:** [#84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/84)

Adapted from the [course automated-testing guide](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/course-materials/blob/main/student-starter-kit/docs/automated-testing-guide.md), read November 12. This describes our actual project, rather than copying its Vitest/Python examples.

## 1. Tool and prerequisites

StudentHub uses Vue/TypeScript and an Express/MySQL backend. Both test folders already use Node's built-in **node:test** runner; keep that runner. Frontend tests transpile the small TypeScript helpers using the existing TypeScript dependency. They do not render Vue screens.

Use Node 24 and npm (local check: Node v24.19.0, npm 11.17.0), and PowerShell in VS Code. Open the repository root: it contains backend, frontend and classroom. On Galan's laptop the active copy is:

```powershell
cd "C:\Users\galan\Documents\Codex\2026-10-01\hey-x20\school-foundation"
Get-Location
```

Other people should use their own clone's root. Do not run these from the classroom folder. For a fresh dependency install, run `npm.cmd ci --prefix backend` and `npm.cmd ci --prefix frontend` once. This test setup is not proof that a fresh empty application database can be bootstrapped; [#77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77) remains separate.

## 2. Choose the requirement before testing

Existing requirement: an admission login is YY + two-digit grade + section A–I mapped to 1–9 + three-digit student number. Unsupported inputs must fail rather than produce colliding IDs. [Source](../../frontend/src/student-id.ts); [real tests](../../frontend/tests/student-id.test.mjs); [individual-edit requirement #82](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/82).

| Input | Expected | Reason |
|---|---|---|
| 2026-11-09, grade 6, A, number 61 | 26061061 | Fixed prefix and padded number |
| 2027-01-01, grade 10, B, number 1 | 27102001 | Admission year and section change |
| 2026-02-30 | Rejected | Impossible date |
| Section J / number 000 / number 1000 | Rejected | Outside agreed format |

The existing test arranges those inputs, calls the production helper and asserts its result. For example: `assert.equal(schoolStudentId(studentIdPrefix('2026-11-09','6','A'),'61'),'26061061')`. It does not prove the admin form saves an account.

## 3. Run locally, one step at a time

Start with the focused test:

```powershell
node --test frontend/tests/student-id.test.mjs
```

Then run all frontend helper tests:

```powershell
npm.cmd --prefix frontend test
```

Run backend build/tests without a database (ensure the optional RUN_*_DB_TESTS flags are not enabled in this terminal):

```powershell
npm.cmd --prefix backend test
```

Build the frontend to check Vue/TypeScript compilation:

```powershell
$env:VITE_BASE_PATH='/'
$env:VITE_API_ORIGIN=''
npm.cmd --prefix frontend run build
```

A build is not a test of clicks or saved data. Exit code 0 means that command succeeded. Read `$LASTEXITCODE` immediately after a command if uncertain.

## 4. Understand results and prove detection

A pass confirms only the named checks. A failure should identify expected versus actual. A skipped test did not run and must not be called passed.

On November 12, the assistant ran the real student-ID test with one deliberately wrong expected prefix in a temporary test copy. It failed as intended. The temporary file was removed; the original test and production logic were unchanged, then the original test passed again. Do not commit the wrong expectation or weaken assertions to obtain green results.

| Check | Actual local result | Proof |
|---|---|---|
| Focused student-ID test after detection check | 2 passed, 0 failed | [Output](evidence/student-id-restored-2026-11-12.txt) |
| Deliberately wrong expected prefix | Nonzero exit, mismatch detected; intentional failure | [Output](evidence/intentional-failure-2026-11-12.txt) |
| Frontend helper suite | 17 passed, 0 failed | [Output](evidence/frontend-tests-2026-11-12.txt) |
| Backend without DB fixtures | 41 passed, 0 failed, 3 skipped | [Output](evidence/backend-tests-without-db-2026-11-12.txt) |
| Frontend build | Passed | [Output](evidence/frontend-build-2026-11-12.txt) |

## 5. Optional isolated database checks

The three opt-in suites cover school planning/teacher/account behavior, Activity Log and canteen menus. They create and remove randomly named temporary fixture databases; they do not use the application's DB_NAME or copy student records. They require a local MySQL login allowed to create/drop databases. Do not paste credentials into commands, evidence or GitHub.

Use your private env file path (not a public file), and run from the repository root after the backend build:

```powershell
npm.cmd --prefix backend run build
$env:RUN_SCHOOL_DB_TESTS='1'
$env:RUN_ACTIVITY_DB_TESTS='1'
$env:RUN_MENU_DB_TESTS='1'
node --env-file="PATH_TO_YOUR_PRIVATE_BACKEND_ENV" --test backend/tests/*.test.mjs
Remove-Item Env:RUN_SCHOOL_DB_TESTS, Env:RUN_ACTIVITY_DB_TESTS, Env:RUN_MENU_DB_TESTS
```

Replace the placeholder before running. Do not run seed/setup scripts merely to run tests. These optional DB checks are **not** included in the current CI job. Earlier isolated school results remain [historical Week 10 evidence](../week10/student-login-id-check.md), not a new Week 11 full-database result.

## 6. GitHub Actions

The [automated workflow](../../.github/workflows/tests.yml) runs on push, pull request and manual dispatch. It uses Node 24, the committed backend/frontend lockfiles, npm ci, backend build/tests, frontend tests and frontend build. Permissions are read-only; no private database password, Seoul key or deployment access is needed.

Open [Actions: StudentHub automated checks](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/actions/workflows/tests.yml), choose the run for your commit, then open the checks job. Green means its steps passed; red requires reading the first failed step. Installation/setup failure is different from a failed behavior assertion. The existing Pages deployment workflow is separate and does not prove the backend is online.

Actual first-run status is recorded in [testing evidence](testing-evidence.md). Never substitute the Actions list URL for a claimed successful run.

## 7. Browser and peer testing remain necessary

For subject assignment, a person should select a class, tap a library subject, choose a teacher, save, reload and verify the subject/teacher. Add a lesson, reload and inspect the timetable. Try a conflicting time and confirm no unintended save. Phone scrolling, popup accessibility and physical-device behavior require browser/phone checks beyond helper tests.

The mobile patch in [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83) has build/helper checks but final browser verification was blocked by the browser tool; physical-phone verification remains pending. Assistant results are not a teammate's independent test. Record tester, date, exact commit, steps, expected/actual, safe proof and first failing step before closing a human-verification gate.
