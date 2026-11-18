# Tested-By Note — Week 11 StudentHub

## What we checked

- **Behavior / related Issue:** Special-room booking saves and survives reload. An overlapping booking for the same room is rejected. [Issue #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/72)
- **Tested by:** Ansh Sharma, independent teammate tester.
- **Date:** November 17, 2026.
- **Environment:** Deployed StudentHub, iPhone 16 Pro, Safari. The source note does not identify the deployed commit.

## Check steps

1. Open the room board and save a valid same-day special-room booking for the test class.
2. Refresh Safari, reopen the room and confirm that the saved booking and time are still shown.
3. Attempt a second booking for the same room at the same time and confirm the app rejects it.

## Result

- **Expected result:** The first booking survives refresh. The overlapping booking is rejected and the original remains.
- **Actual result:** Ansh observed the saved booking after refresh and the app rejected the overlapping attempt.
- **Proof link / screenshot:** [Ansh’s detailed booking result and screenshots](ansh-room-booking-iphone-test.md#detailed-test-record).

## Problems found

- The booking check passed. In a separate deployed iPhone check, a newly assigned subject and teacher appeared immediately but disappeared after refresh. [Subject-persistence evidence](ansh-iphone-subject-persistence.md) · [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83)

## Next action

- Use the booking evidence for #72. After the #83 fix, have a teammate repeat subject assignment and reload on iPhone Safari and record the tested revision and actual result.
- Track remaining live checks in the [MVP verification checklist](mvp-verification.md).
