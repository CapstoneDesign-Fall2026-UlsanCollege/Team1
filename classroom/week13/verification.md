# Verification receipt — November 28, 2026

Runner: **Codex**, directed by Galan Bishal. Code: [b258c29](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/b258c29). Assistant-run evidence is not a teammate's independent test.

| Check | Expected | Actual / proof |
| --- | --- | --- |
| Frontend build | Vue/TypeScript/Vite succeed | Passed: [output](evidence/frontend-build.txt) |
| Frontend tests | No failures/skips | 49 passed: [output](evidence/frontend-tests.txt) |
| Backend build | TypeScript succeeds | Passed: [output](evidence/backend-build.txt) |
| Focused MySQL school suite | Isolated schema, no failures/skips | 47 passed: [output](evidence/school-planning-tests.txt) |

[Repeat commands](../../docs/setup-guide.md). MySQL credentials loaded privately, not recorded here; suite creates/removes its own random schema.

## Local browser observations from the preceding implementation session

Starting state: compiled worktree frontend on 127.0.0.1:3019 and fictional teacher-review.mjs fixture with UI_REVIEW/PARENT_REVIEW/TEACHER_REVIEW_ATTENDANCE enabled. Fixture removed after checks; no production data changed.

1. Teacher created **Local workflow verification**, Grade 6 A Mathematics. Expected: student/linked parent read it. Actual: both role views showed it.
2. Parent changed fictional contact email. Expected: navigation warns, cancellation retains draft, save persists. Actual: all matched; saved contact remained on returning.
3. Canteen changed a published item to **Local workflow lunch**. Expected: logout warns, cancellation retains draft; saved publication reaches student. Actual: matched, student saw the saved item at price 70.
4. Admin Accounts navigation: correct panel and active destination displayed.
5. At 390×844 CSS pixels, no page horizontal overflow across checked roles; shared nav controls/corrected parent inputs measured 44px. Desktop viewport check, not physical iPhone Safari.
6. Local fault proxy returned 503 for parent notices/canteen. Expected: warning/retry with main child records usable. Actual: warning visible, two homework rows and contact controls still available.

These observations are a session receipt; no screenshot artifacts were saved for the new browser checks. [Earlier screenshots](../week12/bishal_check/README.md) remain historical and are not substituted as pictures of this revision.

This does not prove permanent installation, independent handoff or latest-release live acceptance. [Peer trial](peer-test-notes.md), [release record](release.md).
