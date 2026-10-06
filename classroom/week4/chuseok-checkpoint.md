# Chuseok Checkpoint — Midterm Demo Sketch

**Team:** Team 1  
**Week:** 4  

This is the Week 4 report. It replaces the standard Weekly Report for this week.

This should be light. No required coding. No required team meeting.

## Rough sketch or photo

[click_me](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/e08fb9da117ea2100aa65d7523cf27c56881f35c/classroom/week3/benweek3.png)

- Student Life Dashboard sketch showing five slices:
  - Student Profile
  - Semester
  - Course
  - Schedule
  - Student Job

## Midterm demo sentence

Our midterm demo will show:

> A student authenticates, opens the Student Life Dashboard, selects a slice, and views useful student information using the five Student Life features. The features will first work independently with sample data, followed by backend and MySQL integration.

## One blocker or question for Week 5

- How should we connect the five independently developed slices to the Node.js + TypeScript backend and MySQL database without making the MVP too large?
- **Semester slice handoff:** Bal Raju documented the smallest proposed API and data contract for the Semester slice so backend integration can start with one agreed response shape. See [Raju's Week 4 integration contract](raju-semester-integration-contract.md).

## Optional: easiest first screen or interaction

- Student Life Dashboard with five simple navigation cards.
- First interaction: select a category and open its corresponding slice.

## Individual contribution evidence

- **Bal Raju (`CoderRaaju`):** Defined and personally confirmed the Semester
  slice's proposed API response, storage fields, error cases, and Week 5
  acceptance checks.

  Evidence:
  - [Semester Integration Contract](raju-semester-integration-contract.md)
  - [Week 4 Semester PR #22](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/pull/22)

  Backend approval status: proposed and awaiting explicit backend-owner
  confirmation before Week 5 integration.
