# Finding subjects for a newly created grade

**Owner:** Galan Bishal, with coding assistance

**Date:** November 14, 2026

**Issue:** [#90 — Definition of Done](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/90)

## Cause and change

The planner library contains only subjects explicitly linked to the selected grade and academic year. Creating a class does not copy a curriculum from another grade. Previously this appeared as an empty list, even when the school catalogue already contained Mathematics or other subjects. A search was also retained when switching classes.

The planner now distinguishes empty grade libraries from search results, shows the actual total library count, provides Clear search, and resets the search when changing class/year. Matching unlinked catalogue subjects appear under **Other school subjects** with an explicit **Add to Grade** button. Adding reuses the existing grade-library endpoint. The resulting card opens the existing teacher-assignment flow; no curriculum or teacher is assigned automatically.

## Actual verification

- Frontend production build/type check passed; all 17 existing frontend tests passed.
- Assistant browser test used a disposable fictional database, not production.
- Created a new Grade 5 Class A through Year & class setup.
- Switched to its subject planner and confirmed the previous search was cleared.
- Searched `Math`; Mathematics appeared as an available school catalogue suggestion despite the empty Grade 5 library.
- Selected Add Mathematics to Grade 5. Its library card appeared.
- Selected the card, chose a teacher, confirmed, and read back Mathematics under Class subjects.
- [Successful Grade 5 recovery screenshot](evidence/new-grade-subject-recovery.png).

No existing school classes were seeded or changed automatically. These are assistant-run checks, not an independent teammate pass. Hosted verification is recorded in the issue after deployment.
