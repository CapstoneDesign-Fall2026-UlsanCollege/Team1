# Seoul Job Finder

The student **Student Job** section reads recruitment information from Seoul Open Data through `GET /api/student/jobs?page=1`. Listings show company, title, location, salary, experience, and closing date. Expand a listing to see its description, working hours, qualifications, application methods, required documents, and contact phone.

These are general recruitment listings, not verified student-only or part-time jobs. The provider also returns locations outside Seoul. Closing dates and availability must be checked with the employer. The API does not provide a direct application URL in the verified sample; StudentHub displays supplied application instructions instead of inventing a link.

## Configuration

Set `SEOUL_API_KEY` on Railway's **Team1 backend service** and deploy. Never put the key in frontend code, public build variables, committed files, or browser requests. Production requires a personal key; it does not silently fall back to `sample`.

Provider service: `recMntList`, JSON format. The backend uses the documented `http://openapi.seoul.go.kr:8088` endpoint; HTTPS probes were unsuccessful during verification. Although browser users never receive the key, the upstream request uses HTTP. Assess this provider transport limitation before wider production use.

Each page requests 30 records. Search filters only the current page and says so in the interface. Previous/Next browse the provider's result set. Pages are cached for five minutes (maximum 20 pages); concurrent requests for one page share an upstream request. Requests time out after ten seconds. Provider errors are sanitized so the key and upstream URL are not shown in responses or error logs. Job text is rendered as text, not HTML.

Source: https://data.seoul.go.kr/dataList/OA-13341/A/1/datasetView.do
API guide: https://data.seoul.go.kr/together/guide/useGuide.do

## Verification on 2026-10-10

- All 21 backend tests passed, including authorization, pagination validation, provider response mapping, caching, concurrent requests, failure recovery, empty results, and key privacy.
- Frontend TypeScript and production build passed.
- Browser smoke checks passed with mocked API: listing cards, page search and empty state, expandable details, escaped HTML, pagination, error/retry, and 390px mobile layout.
- The backend adapter successfully normalized five live public sample records. This confirmed the provider response contract, not the personal Railway key.
- After deployment, sign in as a student, open **Student Job**, and verify live listings. Use an administrator account to check the separate password-reset Requests flow.

## Availability filters

Students can select weekdays, weekends, or individual available days and optionally enter available start/end times. A known shift must fit entirely inside the chosen availability. Earlier end times represent overnight availability; known overnight jobs also require availability on the next calendar day. Leave both times empty for any hours.

The parser reads only explicit patterns in the employer's working-hours field. It recognizes clear weekday ranges, weekday/five-day schedules, weekend schedules, and a single unambiguous pair of times including Korean AM/PM. Shift rotations, negotiable schedules, conflicting days, multiple time ranges, and missing information remain unknown. Unknown listings are included by default and visibly labeled; students can exclude them. These estimates are not a guarantee of compatibility. Timetable comparison is not implemented yet.

Filters apply only to the current provider page. Clear filters restores all listings on that page.

Verification: `node --test frontend/tests/job-schedules.test.mjs` passed both parser/filter tests. Frontend production build passed. Browser checks passed for weekend filtering, unknown exclusion, full-shift containment, clearing filters, and 390px mobile layout with mocked listings.
