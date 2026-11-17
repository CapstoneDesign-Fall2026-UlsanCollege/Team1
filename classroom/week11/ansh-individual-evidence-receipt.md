# Ansh Sharma — Week 11 individual evidence receipt

**Week:** 11 — MVP verification and release evidence
**Contributor:** Ansh Sharma (`anshsharma123`)
**Role:** Independent manual tester and evidence author
**Date:** 2026-11-15 to 2026-11-17

## My contribution

I independently tested two core administrator workflows on the deployed StudentHub site using an iPhone 16 Pro with iOS 27.0.1 and Safari. I recorded the actual result, including one failure and one successful save/conflict path. I did not claim to implement or fix the underlying code.

### 1. Subject-assignment persistence check — failed

- Opened Grade 6 · Class A on the deployed site and added Moral Education with teacher Hari Adhikari.
- The assignment appeared immediately after confirmation, but disappeared after Safari refresh.
- I captured before/after evidence and recorded the failure instead of treating the immediate UI update as a successful save.
- Evidence: [iPhone subject-assignment persistence check](ansh-iphone-subject-persistence.md)
- Related issue: [#83 — phone subject assignment and compact mobile administration text](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83)
- Result: **Failed persistence on the deployed iPhone site; requires diagnosis, a fix, and an independent retest.**

### 2. Special-room booking and overlap check — passed

- Created a valid Room 108 (Chemistry lab) booking for Grade 6 · Class A, Art and Music, 2026-11-17, 15:00–16:00 NPT.
- Refreshed Safari and verified that the booking remained visible.
- Submitted another request for Room 108 with the same date and time, using an available replacement teacher as required by the form.
- The site rejected the overlapping request with the room-conflict message; no second booking was created.
- Evidence: [iPhone special-room booking test](ansh-room-booking-iphone-test.md)
- Related issue: [#72 — school room board and same-day special-room bookings](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72)
- Result: **Passed valid save/read-back and overlap-rejection checks on the deployed iPhone site.**

## Evidence links

- [Subject-test screenshots and detailed expected/actual record](evidence/ansh-iphone-subject-persistence/)
- [Room-booking screenshots and detailed expected/actual record](evidence/ansh-room-booking-iphone-test/)
- [Week 11 test index](README.md)

## What I learned / follow-up

- An immediate success state is not sufficient evidence of a saved change; refresh/read-back is required.
- A conflict check should record the exact message and confirm that no conflicting second record was created.
- I will repeat the subject-assignment test after the persistence issue in #83 is fixed.
- This receipt records only my testing and evidence work. Code ownership, fixes, and work completed by other teammates remain theirs.

## AI-use note

AI assistance was used to help organize the written report and links. The phone actions, screenshots, observations, and stated results were performed or confirmed by Ansh Sharma.

