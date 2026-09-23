# Week 3 Checkpoint — Student Life MVP

**Team:** Team 1
**Project:** Student Life Hub

## 1. Start with one user journey

> A student opens Student Life Hub, chooses a category, and views useful student information.

The Student Life MVP will focus on five small feature slices:

* Student Profile
* Semester
* Course
* Schedule
* Student Job

These features are part of the same Student Life Hub and will be developed as small, independent slices.

---

## 2. Slice the work into Issues

| Issue                                        | Type     | First owner     | Checkable result                                       |
| -------------------------------------------- | -------- | --------------- | ------------------------------------------------------ |
| Show a Student Profile using sample data     | Build    | Galan Bishal    | A student profile is visible with basic information    |
| Show the current Semester using sample data  | Build    | Bal Raju        | A semester screen displays the selected semester       |
| Show enrolled Courses using sample data      | Build    | Ansh Sharma     | Course information is visible in a simple list         |
| Show a weekly Schedule using sample data     | Build    | Buddha Raj Giri | A weekly schedule is visible with course times         |
| Show Student Job listings using sample data  | Build    | Team member     | Job cards show basic job information                   |
| Sketch the main Student Life screens         | Design   | Team member     | Rough screens for the main path are linked             |
| Compare the possible technology stacks       | Decision | Team member     | The team records the comparison and decision           |
| Map the main parts and their handoffs        | Design   | Team member     | The architecture sketch identifies the main components |
| Run the first shared setup and quality check | Quality  | Team            | The team records the result and next fix               |

The first five Issues are the main Student Life feature work. The remaining Issues reduce design, technology, architecture, and setup uncertainty.

---

## 3. Definition of Done

### Show a Student Profile using sample data

* **Visible result:** A Student Profile screen displays basic fictional student information.
* **Access path:** A teammate can open the screen from the Student Life Dashboard.
* **Check:** A teammate verifies that the expected profile information is visible.
* **Expected vs. actual:** Check whether all expected profile information appears correctly.
* **Evidence:** Screenshot, preview, commit, or GitHub Issue comment.

### Show the current Semester using sample data

* **Visible result:** The current or selected semester is clearly displayed.
* **Access path:** A teammate can reach the Semester screen from Student Life.
* **Check:** A teammate opens the screen and verifies the semester information.
* **Expected vs. actual:** Check whether the displayed information matches the sample data.
* **Evidence:** Screenshot, preview, commit, or GitHub Issue comment.

### Show enrolled Courses using sample data

* **Visible result:** A list of sample courses is displayed.
* **Access path:** A teammate can reach the Course screen from Student Life.
* **Check:** A teammate verifies the course names and basic information.
* **Expected vs. actual:** Check whether the displayed course information matches the sample data.
* **Evidence:** Screenshot, preview, commit, or test note.

---

## 4. Compare possible technology choices

| Question                         | Option A — React                                                    | Option B — Vanilla HTML/CSS/JavaScript                             |
| -------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| What is it good at?              | Building reusable and interactive UI components                     | Building simple web pages with basic technologies                  |
| What does the team already know? | The team can learn and use component-based development              | HTML, CSS and JavaScript are straightforward to understand         |
| What could slow us down?         | React setup and component structure may require additional learning | Larger projects can become harder to organize as features increase |
| Best first test                  | Build the Student Life Dashboard and one feature screen             | Build the Student Life Dashboard and one feature screen            |
| Decision                         | **Choose React**                                                    | Alternative                                                        |

### Decision sentence

> We choose **React** for the first Student Life slice because it supports reusable components and makes it easier to organize the five Student Life features as the project grows.

### Remaining uncertainty Issue

> Can the team successfully build and preview the first Student Life slice using React and keep the five feature components simple enough to develop independently?

---

## 5. Rough wireframe

### Student Life Dashboard

```text
┌─────────────────────────────────────┐
│          STUDENT LIFE HUB           │
├─────────────────────────────────────┤
│                                     │
│  👤 Student Profile                 │
│  Basic student information          │
│                                     │
│  📅 Semester                        │
│  Current semester information       │
│                                     │
│  📚 Courses                         │
│  Enrolled course information        │
│                                     │
│  🗓 Schedule                        │
│  Weekly class schedule              │
│                                     │
│  💼 Student Jobs                    │
│  Part-time job information          │
│                                     │
└─────────────────────────────────────┘
```

### Student Information

```text
┌─────────────────────────────────────┐
│          STUDENT PROFILE            │
├─────────────────────────────────────┤
│                                     │
│          [Profile Image]            │
│                                     │
│ Name: Buddha Raj Giri               │
│ Student ID: Sample ID               │
│ Department: Sample Department       │
│ Year: 2                             │
│                                     │
│        [Back to Dashboard]          │
└─────────────────────────────────────┘
```

### Student Job

```text
┌─────────────────────────────────────┐
│           STUDENT JOBS              │
├─────────────────────────────────────┤
│                                     │
│ Part-time Restaurant Worker         │
│ Location: Ulsan                     │
│ Hours: 17:00–22:00                  │
│                                     │
│ Part-time Cafe Worker               │
│ Location: Nam-gu                    │
│ Hours: 18:00–22:00                  │
│                                     │
└─────────────────────────────────────┘
```

**Wireframe evidence:** `LINK: Figma / wireframe`

The first screen will be the Student Life Dashboard because it mainly provides navigation to the five slices and does not require complex backend functionality.

---

## 6. Rough architecture

```text
                         User
                           │
                           ▼
                Student Life Dashboard
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Student Profile    Semester          Course
          │                │                │
          └────────────────┼────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
        Schedule                   Student Job
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    Feature Data
                           │
                           ▼
                    Backend / Database
```

### Development phases

| Phase                                  | Responsibility                                  | Main goal                             | Risk / uncertainty                 |
| -------------------------------------- | ----------------------------------------------- | ------------------------------------- | ---------------------------------- |
| Phase 1 — Parallel Feature Development | Build the five feature slices independently     | Make each slice work with sample data | Feature scope may become too large |
| Phase 2 — Backend/Database Integration | Connect the completed slices to persistent data | Save, retrieve, and share real data   | Data structures may conflict       |

### Phase 1 — Parallel Feature Development

The team will:

* Build the visible feature.
* Define the information each feature needs.
* Use sample data.
* Keep each slice independent.
* Prove that the basic interaction works.

### Phase 2 — Backend/Database Integration

After the feature structure is clear, the team will:

* Define the database structure.
* Create required backend/API connections.
* Connect each feature to persistent data.
* Test saving and retrieving data.
* Resolve integration problems between features.

Backend integration will not be required for every initial feature-development task.

---

## 7. Candidate vertical slice

> By midterm, a student can open Student Life Hub, choose a student-life category, and view useful information using a small working feature path.

### In scope

* Student Life Hub entry point
* Student Life Dashboard
* Basic navigation
* Student Profile
* Semester
* Course
* Schedule
* Student Job
* Sample data
* Simple display of student information

### Out of scope

* Advanced recommendation systems
* Roommate matching
* Complex personalization
* Favorites
* Unnecessary notifications
* Production-level visual design
* Complete backend integration for every feature
* All possible student services

The candidate vertical slice is a planning boundary for the first working Student Life path.

---

## 8. Weekly Report

### Goal

Prove a small Student Life path and reduce the biggest scope, technology, design, architecture, and setup uncertainties.

### Evidence links

* **Issue list:** LINK
* **Technology comparison:** LINK
* **Wireframe:** LINK
* **Architecture sketch:** LINK
* **Candidate vertical slice:** LINK
* **Sprint 0 quality check:** LINK

### Individual contribution entries

| Student         | What they did                                                                          | Evidence link               |
| --------------- | -------------------------------------------------------------------------------------- | --------------------------- |
| Galan Bishal    | Coordinated the Student Life scope and worked on the Student Profile feature.          | [LINK](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/16#issue-5484872554): Student Profile Issue |
| Bal Raju        | Worked on the Semester  feature and contributed to the Student Life feature structure. | LINK: Semester Issue        |
| Ansh Sharma     | Worked on the Course feature and contributed to the technology/backend discussion.     | LINK: Course Issue          |
| Buddha Raj Giri | Organized documentation and worked on the Student Job and feature-slice planning.      | LINK: Student Job Issue     |

Each team member should add at least one evidence link showing their own contribution.

---

## 9. Risk and bridge task

| Risk / blocker                                               | Owner | Next action                                                         |
| ------------------------------------------------------------ | ----- | ------------------------------------------------------------------- |
| Student Life could become too large                          | Team  | Keep the MVP limited to the five defined slices                     |
| Backend integration could interfere with feature development | Team  | Keep feature development and backend integration as separate phases |
| Different features may use inconsistent data structures      | Team  | Agree on basic sample-data fields before backend integration        |
| Responsive design may require additional work                | Team  | Test the first screens on mobile, laptop, and desktop sizes         |

### Next week's bridge task

Post the rough Chuseok sketch, repeat the midterm sentence, and name one blocker or question.

---

## 10. Sprint 0 quality check

* [x] 6–10 Issues exist, with first owners assigned.
* [x] At least three build Issues have a checkable Definition of Done.
* [x] Possible technology choices were compared.
* [x] The technology decision and remaining uncertainty are recorded.
* [x] A rough wireframe has been created.
* [x] A rough architecture sketch has been created.
* [x] The candidate vertical slice has an in-scope path.
* [x] The candidate vertical slice has an out-of-scope boundary.
* [x] The five Student Life slices are clearly identified.
* [x] Parallel feature development and backend integration have separate responsibilities.
* [ ] Sprint 0 evidence links need to be added.
* [ ] Weekly Report evidence links need to be added.
* [ ] Week 4 Chuseok Checkpoint needs to be prepared.

---

## Final checkpoint status

The Student Life MVP is limited to five small feature slices: **Student Profile, Semester, Course, Schedule, and Student Job**. The team will first develop these features independently with sample data and then handle backend/database integration separately.

The immediate goal is not to complete the entire Student Life Hub. The goal is to prove a small, usable Student Life path and reduce the main scope, technology, design, architecture, and setup uncertainties.
