# Issue verification — November 12, 2026

**Requested by:** Galan Bishal. **Executed by:** coding assistant; not an independent teammate or physical-phone test.

## Tested source and results

Backend/frontend checks ran against published commit `73c0987c8224ca4570413c2f8db3305006e6a2aa`. A subsequent CSS-only fix increases mobile typography selector specificity; the frontend was rebuilt and the final typography inspected in the browser. No backend logic or working-school records changed.

| Check | Actual | Proof |
|---|---|---|
| Full backend including school, menu and audit MySQL fixtures | 78 passed, 0 failed, 0 skipped; disposable databases cleaned up | [Raw output](evidence/full-backend-verification-2026-11-12.txt) |
| Frontend helpers | 17 passed, 0 failed | [Raw output](evidence/frontend-verification-2026-11-12.txt) |
| Final frontend build | Passed | [Output](evidence/frontend-verification-build-2026-11-12.txt) |
| Railway public root | HTTP 404; live release not verified | [HTTP observation](evidence/railway-verification-2026-11-12.txt) |

## Actual phone-width subject check (#83)

Used the disposable teacher review database, fictional review_admin, Grade 6 Class A, English and Bikash Example. No application studenthub records were copied or modified.

1. At 390×844, opened School classes → Subjects & timetable. Added the existing English subject to the grade library for this fixture.
2. Clicked its library card. The Add class subject dialog opened directly. Chose Bikash Example and confirmed. Class subjects increased from one to two; English showed Bikash Example.
3. Used English's Add lesson button, with no drag. Attempted Sunday 10:00–11:00: rejected with “This teacher already has a class at that time.” Dialog remained open.
4. Changed to Sunday 14:00–15:00 and saved. The lesson appeared. Reloaded the browser, reopened the planner and found the same English lesson and teacher. The failed 10:00 lesson had not appeared.
5. Opened Change teacher: Bikash Example was still selected. Popup close worked.
6. Final computed typography: body 14px, main heading 24px, input 16px; content width 375px within 390px viewport. At 320px, content width 305px and dialog scroll/client widths both 269px. No page/dialog horizontal overflow. The weekly timetable remains intentionally horizontally scrollable.
7. Cards compute touch-action: pan-y; custom pointer capture is mouse-only. This was a desktop-browser viewport/click check, **not** physical-touch scrolling, iOS keyboard or an independent human result.
8. Restored viewport, closed review tab and stopped helper to remove the disposable database.

[Persisted lesson screenshot](evidence/mobile-subject-reload-2026-11-12.jpg) · [Persisted teacher screenshot](evidence/mobile-subject-teacher-2026-11-12.jpg).

## Closure assessment

Reviewed all 26 currently open issue bodies. Every one still lists at least one unmet condition; no extra issue was closed by this verification.

- #83: viewport assignment/save/read-back/conflict/font criteria now verified locally; physical-phone repetition remains.
- #78–82, #73–76: local implementation/checks exist; explicitly required independent human/hosted gates remain.
- #54–56, #61: local canteen behavior is covered; real school/operator approval, remaining UI recovery checks and/or live verification still apply per issue.
- #62–68, #70, #72: school/teacher/room local checks are not a substitute for all original acceptance, non-author explanations or hosted verification.
- #69: high-school job audience gating remains unimplemented; existing job tests do not prove this policy.
- #77: fresh-clone/empty-database bootstrap has not been delivered/verified by this run.
- #60/#65: final release and hosting recovery cannot close while Railway returns 404 and remaining independent checks lack evidence.
- #84 and #85 were already closed for their completed automation/indexing scope.

No checklist was weakened or human identity invented to obtain a closure. Next human step: on a physical phone repeat #83's subject assignment and valid/conflicting lesson path, recording the actual result and safe proof. For other issues, arrange the specified non-author/live checks separately.
