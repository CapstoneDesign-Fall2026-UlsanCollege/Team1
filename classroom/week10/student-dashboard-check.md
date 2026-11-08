# Student dashboard and homeroom display

**Owner:** Galan Bishal (@bishal482), requested implementation with coding assistance.  
**Date:** November 9, 2026. [Issue #76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/76). Integrates with #68; does not rewrite another student's contribution claims.

## Problem and resulting behaviour

The student class response previously omitted homeroom and classroom data. Added authenticated effective-membership scope, usual classroom, active-term Sunday 10 AM homeroom teacher, explicit unassigned/inactive/ambiguous states and today's lessons in Nepal time. Query/body student IDs cannot select another student. No teacher is guessed from a legacy major or expired term.

Students now land on a practical Home page with class, teacher, room, today's lessons, tiffin and a published-menu preview. Bottom navigation goes directly to Home, Timetable, Canteen and More. My Class shares the same class facts. School-mode profile/subject/term wording replaces college labels; school timetable starts Sunday, keeps Saturday only when scheduled and avoids legacy section labels. Legacy academic routes remain available outside school mode.

The full canteen page places the daily menu before published hours/location. Home uses a compact preview without duplicating canteen information. Draft/current-date publication rules remain unchanged. The current local database has no published menu for the Nepal date observed during the check; the page explicitly explains that the canteen head must publish it. It does not show yesterday's food or expose draft menus. Owner action: sign in as canteen head, choose the applicable Nepal date, review items and select Publish menu. No menu was silently published by this work.

## Actual verification

Assistant-run automated checks, not independent teammate results:

- Backend TypeScript compilation passed.
- Full backend suite, all three isolated database suites enabled: **67 passed, 0 failed, 0 skipped**.
- New school integration check covers own room/homeroom/daily lessons, forged student IDs, class transfer date, unassigned student, inactive/multiple teachers, expired term, no first lesson and role boundaries. Test initially assumed the student stayed in the same class on a transfer date; corrected that expectation to follow the existing dated membership fixture.
- Existing canteen lifecycle suite verifies draft privacy, publish/read-back/unpublish, date rollover, hours/location and role protection.
- Frontend production build passed after final visual changes; **12 existing frontend checks passed**.

## Browser path and observed results

1. Sign in as the fictional Grade 6A account. Home opens directly.
2. Actual: Deepa Karki, Room 101, the correct class/year and five current-day lessons appeared. Nepal calendar date was Sunday November 8 during this Korea-date November 9 check.
3. Open Canteen. Actual: no unpublished meals leaked; clear not-published message and published opening hours/location displayed.
4. Open Timetable. Actual: School term 2026–2027, Sunday-first lessons and current teacher names; no misleading legacy Section A label.
5. Check desktop 1280x900 and phone 390x844. Actual: dashboard fits; phone document/scroll widths both 390px. Bottom navigation remains accessible. Temporary viewport override reset afterward.

[Desktop Home](evidence/student-home-desktop.jpg) | [Mobile Home](evidence/student-home-mobile.jpg) | [Mobile Canteen](evidence/student-canteen-mobile.jpg)

No account/profile data or canteen publication state was changed for these browser checks. Screenshots show only fictional school/teacher records.

## Remaining limits

Independent human review and hosted deployment remain pending. Current-day food requires canteen-head publication. Job-search backend policy/configuration remains tracked separately; this slice only suppresses its navigation for schools configured as middle school. This is not a grade/age authorization policy. Fresh-clone setup documentation needs separate repair: [#77](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/77).

## Follow-up: group repeated weekly routines

Owner requested fewer repeated day cards. Student timetables now group days whose subject/code, start/end time, teacher and room match, showing the lessons once. Non-consecutive day groups list the exact days; consecutive groups use a range. Different routines and scheduled Saturdays remain separate. Empty days remain explicit. Administrative edit controls still operate on individual days and saved meetings; this is a read-only presentation change with no database edits.

Three meaningful grouping checks passed (same routine despite record IDs/order; subject/time/teacher/room differences; empty/Saturday/legacy-section cases), bringing the frontend suite to **15 passed**. Frontend build passed. Local browser showed Sunday–Friday with five lessons once; 390px document and scroll width matched. [Mobile proof](evidence/student-grouped-timetable.jpg). No real dated school-event feed was added by this change; grouping reflects the saved weekly timetable.
