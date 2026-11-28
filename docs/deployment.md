# Deployment and recovery

[Railway site](https://team1-production.up.railway.app/). Root Dockerfile uses Node 24, builds Vue with base `/` and same-origin API, and serves it through Express with SERVE_FRONTEND=true. Private database variables stay in Railway. Watch patterns in railway.json exclude documentation-only changes.

1. Run [checks](setup-guide.md), inspect diff and commit the tested revision.
2. Push reviewed source to main. Record exact SHA in [release receipt](../classroom/week13/release.md).
3. Confirm Railway shows that revision Active and deployment successful. A previous active release while building is not success.
4. Open the public site. Separately record authenticated role acceptance using approved fictional data.
5. If code fails, redeploy the last working release through Railway after checking schema compatibility. Code rollback does not reverse database changes.

This release requests no production reset or schema migration. Keep backups outside Git; follow [school data recovery](school-data-recovery.md) for explicit restore checks. Before demo, record release revision, safe starting state, browser/device, expected/actual results and actual tester. Never record credentials or real student contact data.
