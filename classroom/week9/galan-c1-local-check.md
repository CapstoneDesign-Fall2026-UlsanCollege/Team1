# Galan Bishal — C1 local check and hosting status

**Date:** 2026-11-04 · **Week:** 9 · **Login:** `bishal482`  
**Run by:** coding assistant on Galan's behalf; not an independent human result.

## Source and setup

- Feature implementation: [5b2fe5a](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/5b2fe5a).
- Published application baseline: [f889b9f](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/f889b9ff51b869a252cea15053216c3d45083cb7).
- Exact checkout at rerun: [457b12a](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/457b12a8ba00da79c70f4345bb4a26d5c1977575). Its two commits after f889b9f changed only Week 9 documentation; C1 source/test were unchanged. Uncommitted school/room application drafts were excluded from this checkout.
- Windows PowerShell; existing installed dependencies reused, not a cold-install check. Local MySQL credentials were supplied privately through the environment.
- The suite created a random `studenthub_menu_test_*` database and removed it afterward. It did not use the application's `DB_NAME` or modify real student records. Accounts were fictional and in memory.

## Command and actual result

From the repository root, with local MySQL credentials privately supplied as `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`:

```powershell
npm run build --prefix backend
$env:RUN_MENU_DB_TESTS = '1'
node --test backend/tests/canteen-menu.test.mjs
Remove-Item Env:RUN_MENU_DB_TESTS
```

The recorded run supplied those private values through Node's `--env-file` option. No environment-file contents or credentials are included in this evidence.

**Expected:** draft menus hidden, published menus readable by students, edits retained after restart, date rollover hides yesterday's menu, wrong roles denied, invalid/stale writes rejected without overwriting valid data.

**Actual:** backend build succeeded; **8 passed, 0 failed, 0 skipped**. [Complete output](evidence/c1-local-2026-11-04.txt). No failing step in this automated run.

| Check | Actual result | Limit |
|---|---|---|
| Draft/publish/edit/unpublish | Pass | Local API/MySQL, not browser proof |
| Restart persistence/date rollover | Pass | Controlled date fixture; original Asia/Seoul behavior |
| Anonymous/student/admin permissions | Pass | Fictional identities |
| Invalid, concurrent and stale writes | Pass | Tested transaction paths, not a load test |

## Separate deployment status

**Live release not verified.** No deployment, purchase, production login or database recovery was performed in this November 4 task. The last documented Railway inspection showed an expired trial/offline service; the owner plans to revisit a subscription on November 10. See [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65) and [October 28 observation](../week8/evidence/railway-dashboard-observation-2026-10-28.txt). That historical inspection is not a fresh November 4 dashboard check.

**Independent C1 result:** pending; [#54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/54) stays open. Bal Raju's separate C0 plan is not a C1 result.

**Local fallback:** follow the published [C1 setup/manual procedure](../../docs/canteen-daily-menu.md) with approved fictional accounts. Record the actual browser outcome before claiming demo proof. Existing C1 uses Korea dates and won; this check does not establish Nepal localization.
