# StudentHub handoff

## Start here

1. Read [README](../../README.md): purpose, role behavior, evidence and limits.
2. Follow [setup](../../docs/setup-guide.md): prerequisites, safe fictional fixture, expected results and cleanup.
3. Find your boundary/check in [architecture](../../docs/architecture.md), then consult the [single area map](../week10/ai-use-and-code-ownership-audit.md#codebase-area-map--current-source-of-truth). A private walkthrough from one steward is not required.
4. Compare the [final feature list](final-feature-list.md) with the [frozen promise](../final-demo-roadmap.md#final-demo-promise).
5. Record the actual independent attempt in [Peer Test Notes](peer-test-notes.md), including confusion, help, blocked steps and a same-step retest after corrections.

## Safe demonstration route

Use only fictional local fixture data. Teacher assigns homework; student and linked parent read it. Canteen publishes a sample item; student reads it. [Actual local receipt](verification.md). Do not share private credentials, school exports or real child records. Historical screenshots remain labelled with their original date/revision.

## Before accepting the handoff

- Confirm exact commit, starting state and browser/device.
- Check actual result against expected result; a plan or build pass is not a reader trial.
- Trace teacher save → authenticated API/class scope → student/parent read using architecture links.
- Verify cleanup removes only the disposable fixture schema.
- Record permanent-install limitation: canonical baseline/first-admin route remains absent here. No permanent-install fallback verified.

[Release and deployment receipt](release.md) | [Recovery procedure](../../docs/deployment.md) | [Open actions/deadline](issues-and-reminders.md) | [Weekly report](weekly-report.md)

Human sign-off remains pending. Galan coordinates a non-author reader by December 2 end of day; the reader must supply their own result. Each member confirms their own contribution and code understanding.
