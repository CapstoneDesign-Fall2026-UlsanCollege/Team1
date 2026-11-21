# Week 12 targeted QA checklist — Team 1

Prepared November 21, 2026 by Galan Bishal with coding assistance. Feature scope stays frozen.

## Carry-in and question (recorded before the assistant check)

- [Week 11 freeze and priorities](../week11/weekly-report.md#freeze-decision-and-next-route).
- [Original iPhone failure](../week11/ansh-iphone-subject-persistence.md): Moral Education / Hari Adhikari, Grade 6 A disappeared after refresh.
- [Current peer retest](ansh-subject-persistence-retest.md): Discrete Mathematics / Farhan Khan, Grade 6 A persisted after refresh. This is a different combination, not proof of the original cause or its fix.
- [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83).
- [Current roadmap](../../roadmap.md) and [area map](../week11/ai-use-and-code-ownership-audit.md#codebase-area-map).

**Today's bounded question:** does the production API retain an explicit Grade 6 A subject link and its teacher across a fresh read, a new admin session and an application restart, and reject duplicate/stale writes without losing the saved link?

This isolates the persistence boundary. It cannot reproduce Safari gestures, deployed database identity, browser selection state or the original production records.

## Starting state and planned steps

Run `subject-persistence-check.mjs` after building the backend. It uses configured MySQL credentials only to create one random `studenthub_w12_…` schema, populates fictional records, binds localhost on a random port, and removes only its schema in `finally`. It never selects application `DB_NAME`. No production mutation is authorized by this test.

| Step | Expected |
| --- | --- |
| Create school, year, Grade 6 A, term, subject and teacher in the isolated fixture | Required explicit links exist |
| Assign Moral Education to fictional Hari Adhikari | HTTP 201 and an offering ID |
| Fetch school state again and compare class, offering and teacher IDs | Same subject and teacher, not just a success banner |
| Attempt a duplicate and a stale revision write | HTTP 409, exactly one saved class/subject link |
| Log in again; read state; restart app using the same isolated pool; log in and read again | Same saved identifiers and teacher |
| Query saved links directly | One persisted relationship and matching teacher |

**Actual output and disposition:** recorded after execution in [Galan's QA result](galan-qa-result.md). The existing peer note remains [Ansh's own record](ansh-subject-persistence-retest.md); this assistant run will not be attributed to him.

## Remaining physical-device check

Galan coordinates with Ansh (proposed retester, not a new confirmed commitment) before November 25 end of day: on an agreed test class/term, record deployed revision, repeat the original subject/teacher combination or explain why unavailable, then compare class/term IDs before and after refresh. Capture safe proof. If it fails, repeat once and retain the first failure. Keep #83 open until its boundary is resolved.
