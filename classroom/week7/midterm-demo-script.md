# Midterm Demo Script

**Team:** Team 1 — StudentHub  
**Week:** 7–8  

## Opening

- **Project name:** StudentHub.
- **Target users:** Ulsan College students and administrators.
- **Problem:** Students need one convenient place to view academic information and find job opportunities that fit their schedules. Administrators need connected tools to manage students, semesters, courses, and timetables.

## Demo path

Use a prepared student account with scheduled classes.

1. **Open the weekly timetable.** Show the student’s courses, class days, times, and locations.
2. **Open Student Job.** Search using a prepared keyword, demonstrate availability filters, and explain Fits my timetable.
3. **Save a listing using its heart button.** Open Favourites and show the saved listing, employer contact information, and application instructions.

Prepare screenshot backups in case the external job provider is unavailable.

## What works now

- Administrator navigation, student account creation, profile editing, and semester assignments.
- Clickable semester details showing assigned students and courses, with links to their management views.
- Course and professor management, weekly class scheduling, and overlap checks.
- Student profiles, assigned semesters, courses, and weekly timetables.
- Seoul Open Data job listings, keyword search, availability filters, timetable comparison, and favourites.
- Administrator-reviewed password reset requests, with private manual password delivery.
- Railway deployment and responsive desktop/mobile interfaces.
- Latest recorded backend run: 24 tests passed. Frontend build and browser checks also passed.

## What does not work yet

- Campus Eat and Room Finder are planned and have not been implemented.
- Password-reset email delivery is manual.
- Timetable matching cannot confirm unclear working hours and does not include travel time.
- Independent teammate verification and live cross-device favourite persistence still need recorded evidence.
- Live semester deletion remains unverified.

## Evidence links

- **Repository:** [Team1 GitHub repository](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1)
- **Weekly Report:** [Week 6 shared report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/classroom/week6/weekly_report.md)
  - Add the Week 7–8 report link when published.
- **Demo/proof:** [Live StudentHub](https://team1-production.up.railway.app/)
- **Implementation and check notes:** [Job Finder documentation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/docs/job-finder.md)
- **Important Issues:**
  - [Issue #43 — Administrator navigation implementation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/43)
  - [Issue #44 — Administrator navigation verification](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/44)
- **Important commits:**
  - [Job favourites, timetable matching, and catalogue search](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/cba8f7b)
  - [Compact job filters](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/2a90851)
  - [Semester details and navigation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/292d96b)

## Contribution summary

Each member must confirm their own entry. Replace the placeholders with actual contributions and evidence.

| Student | What they contributed | Evidence link |
|---|---|---|
| Galan Bishal — bishal482 | Improved administrator navigation and job-search usability; added favourites, timetable comparison, and semester details with coding assistance. | [Admin navigation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c7ad189), [Job features](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/cba8f7b), [Semester details](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/292d96b) |
| [Member 2 name / GitHub login] | [Enter their specific contribution.] | [Their commit, issue, or document link.] |
| [Member 3 name / GitHub login] | [Enter their specific contribution.] | [Their commit, issue, or document link.] |
| [Member 4 name / GitHub login] | [Enter their specific contribution.] | [Their commit, issue, or document link.] |

## Next steps after midterm

- **Campus Eat:** Build a small list-and-details view for food options near campus, including price range, opening hours, and location.
- **Room Finder:** Build a small accommodation list with rent, deposit, distance from campus, and contact information.
- Confirm suitable data sources and assign implementation Issues before starting either feature.
- Complete remaining live workflow checks and attach independent teammate test evidence.
