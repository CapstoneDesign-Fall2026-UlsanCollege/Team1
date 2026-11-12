# Railway recovery — November 12, 2026

Galan confirmed Hobby purchase and requested deployment. The GitHub-connected service automatically deployed the latest pushed source during the roadmap revision.

- Public site: https://team1-production.up.railway.app/
- Railway deployment: `c09765dc-4b18-44d4-9196-1dbae5c15129`.
- Dashboard: **Active / Deployment successful**. Team1 and both database services show Online.
- Source title shown: **Make roadmap a plain-language flowchart with optional teacher dashboard**, matching `33c2921`. Full deployment metadata SHA was not separately exported.
- Deploy logs: Starting Container; StudentHub API started on port 8080, November 12 at 15:56 GMT+9.

## Actual anonymous HTTP checks

| Path | Status | Observation |
|---|---|---|
| `/` | 200 | StudentHub HTML |
| `/assets/index-DL4Zcti9.js` | 200 | Current Add lesson code present |
| `/assets/index-BDHrFJcR.css` | 200 | Current compact admin styling present |
| `/api/auth/me` | 401 | Please log in |
| `/api/admin/school` | 401 | Please log in |
| `/api/student/school` | 401 | Please log in |
| `/api/canteen/home` | 401 | Please log in |

This supersedes the earlier 404 for basic public availability. No manual redeploy, variables change, credential reset, database replacement/import or additional service creation was performed. Published startup initialization ran successfully; production school data/account counts were not inspected.

## Remaining checks

Use approved existing accounts to verify admin planning/room save and conflict, student isolation, canteen publication and persistence. Check live data/backups before any migration; localhost credentials and data are not assumed to match Railway. Browser access intermittently timed out; HTTP checks completed. No authenticated workflow, independent human or database migration result is claimed. Issues #65/#60 retain those remaining criteria.
