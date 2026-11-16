# Guided first-school setup — #102

November 16, 2026 · Galan Bishal, with assistant implementation/testing support.

Saving only the school profile previously opened a class workspace with empty year/class selectors. Setup now presents one required form at a time:

**School → Academic year → School term → Classes → Ready**

Each successful save reloads saved records before choosing the next step. Invalid saves keep the current form and error visible. Existing school names, years and terms are preserved; reopening setup resumes at the first missing requirement for the selected year. Incomplete class-workspace navigation routes to **Year & class setup**, with a visible progress indicator. Overview provides a **Continue school setup** shortcut and matching ordered guide.

After the first active class is saved, the completion screen offers **Open school classes** or **Add more classes or review setup**. Established schools retain the existing setup-management forms. Rooms, subjects, teachers and student accounts are the next tasks after these school basics.

## Actual verification

Assistant-run browser checks used a separate fictional database at local port 3022; no user school records or Railway data were edited.

| Check | Result |
| --- | --- |
| Empty overview | Continue school setup shortcut visible |
| Save fictional school name/level | Automatically shows Step 2: academic year; no empty class selectors |
| Year with reversed dates | Error shown; remains on Step 2 with entered values |
| Save valid year | Automatically shows Step 3: term; dates default within the selected year |
| Refresh and open School classes while unfinished | Routes to Year & class setup; resumes Step 3 with saved school/year |
| Save term | Automatically shows Step 4: class |
| Save first active class | Shows setup-complete screen |
| Open school classes | Saved year, class and school term appear in normal workspace |
| Return to Year & class setup after completion | Existing management forms remain available |

Both production frontend builds/type checks passed. [Frontend regression output](evidence/guided-setup-frontend-tests.txt): 22 passed, zero failed/skipped. [Completion screenshot](evidence/guided-setup-complete.jpg) contains fictional test data only.

This is local assistant browser evidence, not independent human, physical-phone or hosted acceptance. No backend data-model change was required. Refresh the local frontend before checking the new flow.
