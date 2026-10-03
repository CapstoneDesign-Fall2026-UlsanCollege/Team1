# Slice 5 — Investigate Student Job Search

## Question

How should we design the **Student Job Search** feature so students can find part-time jobs that fit their available time and schedule?

## Why it matters

Student Job Search is a feature inside **Student Life Hub**. It is not information about the student's existing job.

The purpose is to allow students to:

1. Open Job Search
2. See available jobs
3. Filter jobs
4. Open job details
5. Apply for a job

The feature should also connect with the student's Schedule so students can search for jobs that fit their available time.

## Options considered

| Option | What it would look like | Main benefit | Main concern |
|---|---|---|---|
| **Option A — Basic Job List** | Display available jobs in a simple list | Easy to implement | Limited search functionality |
| **Option B — Filtered Job Search** | Allow students to filter jobs by time, location, pay, and category | More useful for students and manageable for the midterm | Requires filter logic |
| **Option C — Automatic Schedule Matching** | Automatically compare student schedule with job schedules | Strong connection between Schedule and Job Search | More backend logic and complexity |

## Evidence

Students should be able to search using filters such as:

- Day
- Date
- Start time
- End time
- Location
- Distance
- Pay
- Job category
- Working hours

Example:

```text
Day: Monday
Date: October 5
Available from: 19:00
Available until: 23:00

The backend should return jobs that match the selected conditions.

Example result:

Restaurant Staff
Monday
19:00–23:00
₩12,000/hour
2 km away

[View Details]

The student can then open the job:

Job Details
↓
[Apply]
↓
Application saved
Schedule Integration

Student Job Search should use information from the Schedule when possible.

For example:

Schedule

Monday
09:00–18:00 — Class

↓

Available Time

Monday
19:00–23:00

↓

Job Search

Monday
19:00–23:00

↓

Matching Jobs

This creates the following connected flow:

Schedule
↓
Available Time
↓
Job Search
↓
Matching Jobs
↓
Job Details
↓
Application
Recommendation

Use Filtered Job Search for the midterm and connect it with the Schedule feature.

Students should be able to manually select or use their available time and filter jobs based on:

Day
Date
Start time
End time
Location
Distance
Pay
Job category
Working hours

Job data can be stored as sample data in MySQL.

A complex recommendation or AI matching system is not necessary for the midterm.

Tradeoff

Filtered Job Search provides useful functionality without requiring a complete employment marketplace.

Automatic schedule matching would create a stronger connection with Schedule, but it requires more backend logic.

For the midterm, basic schedule-based filtering is enough to demonstrate the main concept.

Main Flow
Student
↓
Schedule
↓
Available Time
↓
Job Search
↓
Filter Jobs
↓
View Job Details
↓
Apply
↓
Application Saved
```

## Definition of Done

- [ ] Student Job Search page is implemented in Vue.
- [ ] Available jobs are stored in the MySQL jobs table.
- [ ] Backend API can retrieve job data.
- [ ] Student can search available jobs.
- [ ] Student can filter jobs by day and time.
- [ ] Student can filter jobs by location, distance, pay, and job category.
- [ ] Job results display job title, working time, location, and pay.
- [ ] Student can open a Job Details page.
- [ ] Job Details page displays the required job information.
- [ ] Student can apply for a job.
- [ ] Application data is saved in the MySQL applications table.
- [ ] Schedule availability can be used as a Job Search condition.
- [ ] Sample job data is available in MySQL.
- [ ] Search → Filter → View → Apply works successfully.
- [ ] The feature is tested and works without major errors.
