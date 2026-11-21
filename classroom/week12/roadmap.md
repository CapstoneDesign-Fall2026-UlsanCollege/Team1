# Week 12 QA roadmap checkpoint

November 21, 2026. The [main project roadmap](../../roadmap.md) defines the feature promise; [Week 11 freeze](../week11/weekly-report.md#freeze-decision-and-next-route) still applies. This checkpoint updates the next QA action without changing scope.

```mermaid
flowchart TD
    A["WEEK 11: PHONE SAVE FAILED<br/>Moral Education / Hari Adhikari disappeared after refresh"]
    B["WEEK 12: CURRENT PEER RETEST PASSED<br/>Grade 6 A, different subject and teacher<br/>Original failure remains linked"]
    C["API BOUNDARY CHECK PASSED<br/>Save, fresh reads, new login and restart<br/>Duplicate/stale writes preserve one link"]
    D["NEXT: EXACT DEPLOYED-CONTEXT CHECK<br/>Galan coordinates, retester to confirm<br/>Record revision and class/term/subject/teacher IDs<br/>Due November 25, end of day"]
    E{"What does the evidence show?"}
    F["Failure repeats: record proof<br/>Fix the confirmed cause and retest"]
    G["Pass: record exact scope<br/>Review issue acceptance before closure"]
    H["Cannot run: record actual blocker<br/>Name recovery owner and next check"]
    A --> B --> C --> D --> E
    E -->|Mismatch| F
    E -->|Matches expected| G
    E -->|Not tested| H
```

Proof: [original failure](../week11/ansh-iphone-subject-persistence.md), [current peer result](ansh-subject-persistence-retest.md), [assistant API result](galan-qa-result.md), [issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83), [shared report](weekly-report.md).

**Work order:** inherited P1 clean setup and live acceptance gaps (#77, #60/#65, hosted canteen acceptance) remain ahead of documentation polish. #83 exact-context follow-up is P2 after the current scoped pass; historical severity remains Major. Neither this ordering nor the local API all-clear declares the full MVP stable. Teacher dashboard remains core; parent dashboard and optional jobs are not new release gates.
