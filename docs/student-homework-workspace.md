# Student homework workspace

The Home avatar remains clickable without a visible My profile label. The home grid keeps its existing destinations, and a homework shortcut uses the signed-in student's real unfinished homework. Past-due shortcuts open history for that subject; other shortcuts open current work with its subject selected. No student can change teacher-recorded statuses.

Homework is a two-line queue: title/status, then subject/due day. Open a row to read the full title, instructions, teacher and dates. Student/parent status labels use Done, Not done, Late submission, Reviewed and Unmarked rather than register symbols.

Current homework is grouped by due date. Due filters are all current days, today, tomorrow, or the seven-day window starting today. Subjects and due-day filters combine. History is closed by default, opens behind a vertical divider on desktop and below current work on narrow screens, and has its own independent subject filter. Overdue unfinished work remains highlighted as needing attention. The existing current/history grouping and authorized latest-100 homework feed remain unchanged; this is not a lifetime archive.

Filters/history visibility are kept in query parameters so they survive reopening this screen. Refresh re-fetches saved teacher marks and retains valid filter choices. Clear filters resets current filters; history has its own All subjects choice. Notices remain available through the existing Notice board destination rather than preceding homework.

## Verification

Assistant-run local browser checks with fictional fixtures: profile avatar opens the profile without a visible label; current Science and history English filters remain independent; due-today plus Science gives a clear empty state; clearing filters restores the queue; opening a task reveals full instructions. At 390px the page has no horizontal overflow, filters measure 44px, rows measure 78px and history stacks below the current list. No production data was changed for these checks.

Frontend build and 46 tests passed, including combined subject/due filtering and English date labels across year boundaries. Hallmark static sweep: zero Floor failures and zero Reflex findings on touched components/styles. Four dynamic-label wrap warnings were reviewed: variable task names are intentionally allowed to wrap in full details, and action buttons explicitly remain unwrapped. The render tier had no HTML target; visual verification used the supported in-app browser instead. No automated Hallmark render or independent reviewer pass is claimed.
