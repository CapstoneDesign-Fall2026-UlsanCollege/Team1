# Week 3 worked example — Student Life MVP

**Team:** Team 1

This is the team's Week 3 planning and scope example. It shows the shape and level of detail expected for Sprint 0. The goal is to define a small first path, not to promise the entire Student Life system.

## The goal

By the end of Week 3, the team has:

- 6–10 small Issues with first owners;
- a Definition of Done on at least three build Issues;
- a comparison of possible technology choices;
- rough wireframe placeholders;
- a rough architecture sketch;
- a candidate midterm vertical slice;
- a completed Sprint 0 quality check;
- a Weekly Report with one evidence link and one-sentence receipt for every member; and
- a rough Chuseok checkpoint ready for Week 4.

The team is planning a first usable Student Life path, not the complete product.

## 1. Start with one user journey

> A student opens Student Life, chooses a category, and views useful student information.

This sentence keeps the team from trying to build every student service at once.

The five planned slices are:

- Student Profile
- Semester
- Course
- Schedule
- Student Job

The five slices are part of the same Student Life MVP, but they should remain small enough to develop independently.

## 2. Slice the work into Issues

### A quick slicing guide

When an Issue sounds like a whole feature, ask:

1. What is the smallest visible behavior we can check?
2. Can one person make meaningful progress on it in about a week?
3. What would count as proof that it works?
4. Is the Issue a build task, a decision, a design note, or a quality check?

If the answer is still vague, split the Issue again.

A useful Issue has one clear verb, one owner, and one checkable result.

### Too broad

> Build the complete Student Life system.

### Small enough to start

| Issue | Type | First owner | Checkable result |
|---|---|---|---|
| Show a Student Profile using sample data | Build | Galan | A student profile is visible with basic information |
| Show the current Semester using sample data | Build | Bal | A semester screen displays the selected semester |
| Show enrolled Courses using sample data | Build | Ansh | Course information is visible in a simple list |
| Show a weekly Schedule using sample data | Build | Buddha | A weekly schedule is visible with course times |
| Show Student Job listings using sample data | Build | Team member | Job cards show basic job information |
| Sketch the main Student Life screens | Design | Team member | Rough screens for the main path are linked |
| Compare the possible technology stacks | Decision | Team member | The team records the comparison and remaining uncertainty |
| Map the main parts and their handoffs | Design | Team member | The architecture sketch identifies the main components |
| Run the first shared setup and quality check | Quality | Team member | The team records the result and next fix |

The first five Issues form the main Student Life feature work. The remaining Issues reduce design, technology, architecture, and setup uncertainty.

## 3. Add Definition of Done to the first three build Issues

### Show a Student Profile using sample data

- Visible result: a Student Profile screen displays basic fictional student information.
- Access path: a teammate can open the screen from the Student Life area.
- Check: a teammate verifies that the expected profile information is visible.
- Expected vs. actual: record whether all expected information appeared.
- Evidence: add a screenshot, preview, commit, or useful link.

### Show the current Semester using sample data

- Visible result: the current or selected semester is clearly displayed.
- Access path: a teammate can reach the Semester screen from Student Life.
- Check: a teammate opens the screen and verifies the semester information.
- Expected vs. actual: record whether the displayed information matches the sample data.
- Evidence: add a screenshot, preview, commit, or Issue comment.

### Show enrolled Courses using sample data

- Visible result: a list of sample courses is displayed.
- Access path: a teammate can reach the Course screen from Student Life.
- Check: a teammate opens the screen and verifies the course names and basic information.
- Expected vs. actual: record any mismatch or uncertainty.
- Evidence: add a screenshot, preview, commit, or test note.

This gives the team observable completion criteria without requiring the backend to be finished.

## 4. Compare possible technology choices

The team should compare the technologies that could be used for the Student Life MVP before committing to the implementation.

| Question | Option A | Option B |
|---|---|---|
| What is it good at? |  |  |
| What does the team already know? |  |  |
| What could slow us down? |  |  |
| Best first test |  |  |
| Decision |  |  |

**Decision sentence:**

> We choose __________ for the first Student Life slice because __________.

**Remaining uncertainty Issue:**

> Can the team successfully build and preview the first Student Life slice using the chosen stack?

The team should record the comparison and decision in the related Issue or technology document.

## 5. Make a rough wireframe

| Screen or interaction | What the user needs to see | Simplest first version |
|---|---|---|
| Student Life Dashboard | The available Student Life slices | Five simple navigation cards |
| Student Information | Information from the selected student-life category | Simple information cards or lists |
| Student Job | Available part-time jobs | Simple job cards with title, location, and hours |

The easiest first screen is the **Student Life Dashboard** because it mainly provides navigation to the five slices and does not require complex backend functionality.

## 6. Map a rough architecture

~~~text
User
  -> Student Life Dashboard
  -> Student Profile / Semester / Course / Schedule / Student Job
  -> Feature data
  -> Backend / Database
~~~

The development responsibilities are separated into two phases.

| Phase | Responsibility | Main goal | Risk / uncertainty |
|---|---|---|---|
| Phase 1 — Parallel Feature Development | Build the five feature slices independently | Make each slice work with sample data | Feature scope may become too large |
| Phase 2 — Backend/Database Integration | Connect the completed slices to persistent data | Save, retrieve, and share real data | Data structures may conflict |

### Phase 1 — Parallel Feature Development

The team can work on the five slices simultaneously.

The responsibility is to:

- build the visible feature;
- define the information the feature needs;
- use sample data where appropriate;
- keep each slice independent; and
- prove that the basic interaction works.

### Phase 2 — Backend/Database Integration

Backend work is handled separately after the feature structure is clear.

The responsibility is to:

- define the database structure;
- create required backend/API connections;
- connect each slice to persistent data;
- test saving and retrieving data; and
- resolve integration problems between slices.

The team should not treat backend integration as part of every initial feature-development task.

## 7. Choose a candidate vertical slice

> By midterm, a student can open Student Life, choose a student-life category, and view useful information using a small working feature path.

**In scope:**

- Student Life entry point;
- one or more working feature slices;
- basic navigation;
- sample data;
- simple display of student information.

**Out of scope for this slice:**

- all possible student services;
- advanced recommendation systems;
- roommate matching;
- favorites;
- complex personalization;
- unnecessary notifications;
- polished production-level design;
- complete backend integration for every slice.

The candidate vertical slice is a planning boundary. It becomes a more detailed implementation plan in Week 5.

## 8. Write the Weekly Report

### Goal

Prove a small Student Life path and reduce the biggest scope, technology, design, and setup uncertainties.

### Evidence links

- LINK: Issue list
- LINK: Technology comparison
- LINK: Wireframe
- LINK: Architecture sketch
- LINK: Candidate vertical slice
- LINK: Sprint 0 quality check

### Individual contribution entries in the one shared Weekly Report

| Student | What they did | Evidence link |
|---|---|---|
| Galan Bishal | Coordinated the Student Life scope and helped define the feature slices. | LINK: Issue |
| Bal Raju | Contributed to the Student Life feature structure and scope discussion. | LINK: Issue |
| Ansh Sharma | Contributed to the feature structure and backend/integration discussion. | LINK: Issue |
| Buddha Raj Giri | Organized documentation and contributed to the Student Job and feature-slice planning. | LINK: Issue |

Every team member has personally entered one sentence and at least one evidence link in the shared report.

### Risk and bridge task

| Risk / blocker | Owner | Next action |
|---|---|---|
| Student Life could become too large | Team | Keep the MVP limited to the five defined slices |
| Backend integration could interfere with feature development | Team | Keep feature development and backend integration as separate phases |

**Next week's bridge task:** Post the rough Chuseok sketch, repeat the midterm sentence, and name one blocker or question. This is required but ungraded.

## 9. Check before leaving

- [ ] 6–10 Issues exist, with first owners assigned to the important ones.
- [ ] At least three build Issues have a checkable Definition of Done.
- [ ] The possible technology choices were compared and the decision or remaining uncertainty is written down.
- [ ] The wireframe is linked.
- [ ] The architecture sketch is linked.
- [ ] The candidate vertical slice has an in-scope path and an out-of-scope boundary.
- [ ] The five Student Life slices are clearly identified.
- [ ] Parallel feature development and backend integration have separate responsibilities.
- [ ] Sprint 0 checks are recorded.
- [ ] The Weekly Report has one evidence link and one-sentence receipt per member.
- [ ] The Week 4 Chuseok Checkpoint is ready for the rough sketch, sentence, and blocker/question.
