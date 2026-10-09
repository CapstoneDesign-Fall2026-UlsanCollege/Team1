# Student Job Finder

Students open **Student Job** to browse Seoul Open Data recruitment listings. The provider returns general jobs, including locations outside Seoul. Check qualifications, location, hours, and closing date with the employer before applying.

## Features

- **All jobs / Favourites:** heart buttons save and remove job details in MySQL for the signed-in student. Favourites work across devices. They are dated snapshots, not proof that a listing is still available. Up to 200 jobs can be saved.
- **Remembered filters:** selected days, times, unknown-schedule choice, submitted keyword, timetable choice, and semester are stored on this browser separately for each login ID. Private browsing or blocked browser storage may prevent persistence. These preferences do not sync across devices.
- **Keyword search:** a backend catalogue searches company, title, location, and description across provider batches, then paginates the matches. Catalogue downloads use batches of 1,000 with three concurrent workers, are shared between requests, and cached for ten minutes. The first search may take longer. Catalogues above 100,000 records are refused with an error rather than silently searched partially. Failed downloads can retry after one minute.
- **Availability filters:** known workdays and the whole shift must fit the chosen days/hours. These filters apply to the displayed result page or saved favourites. Leave both times empty for any hours. Earlier end times mean overnight availability.
- **Fits my timetable:** choose a semester. Known work schedules are compared with saved classes in campus time, including overnight spillover. Conflicts are labeled and excluded when enabled. Unknown schedules remain clearly labeled and can be excluded using the unknown toggle. No saved classes or a failed timetable load makes comparison unavailable. Travel time is not included.
- **Application actions:** display employer-supplied application instructions, documents, and contact details. Valid phone numbers get a tap-to-call link. There is no invented application URL or automated application submission.

## Schedule interpretation

Only explicit patterns in the working-hours field are interpreted: clear weekday ranges, weekday/five-day schedules, weekend schedules, and one unambiguous pair of times (including Korean AM/PM). Negotiable/rotating schedules, conflicting workdays, multiple time ranges, or missing data remain unknown. No overlap detected is an estimate, not a guarantee that a job fits.

## API and storage

- `GET /api/student/jobs?page=1&q=developer`
- `GET /api/student/job-favourites`
- `POST /api/student/job-favourites` with a job snapshot
- `DELETE /api/student/job-favourites/:id`

Only signed-in students can use these endpoints. Favourite ownership always comes from the session, never a submitted student ID. Job identifiers are server-generated fingerprints of company, title, location, posted/closing dates, and work address because the sample provider response has no stable listing identifier. Identical fingerprints are deduplicated. Changed identity fields can produce a new snapshot; saved listings are not automatically updated.

Set `SEOUL_API_KEY` only on the Railway backend service. No key is sent to the browser or saved in GitHub. Provider service: `recMntList`, JSON format. The backend uses the documented HTTP endpoint on port 8088; HTTPS probes were unsuccessful. This is an upstream transport limitation. Ordinary pages have a five-minute cache and individual requests time out after ten seconds. Errors do not expose the key or request URL. Job content is rendered as text.

The backend creates the additive `job_favourites` table at startup. The database account needs CREATE permission. Equivalent migration: `database/migrations/005_job_favourites.sql`.

Source: https://data.seoul.go.kr/dataList/OA-13341/A/1/datasetView.do
Guide: https://data.seoul.go.kr/together/guide/useGuide.do

## Verification on 2026-10-10

- 23 backend tests passed, including search beyond the first provider batch, shared caching, favourite ownership, normalized identifiers, duplicate saves, and cross-account deletion protection.
- 3 frontend parser/filter tests passed, including overnight timetable conflicts and exact class boundary times.
- Frontend TypeScript and production build passed.
- Browser checks with mocked API passed: hearts, favourites, removal, remembered filters after reload, timetable conflict filtering, keyword search, phone link, and 390px mobile layout.
- Earlier provider sample contract check returned five real records. Full catalogue search with the personal Railway key and MySQL persistence across devices still need live authenticated verification after deployment.
