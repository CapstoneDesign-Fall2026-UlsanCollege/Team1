# StudentHub — revised school roadmap

> Historical checkpoint. See the [current Week 11 roadmap](../week11/roadmap.md), updated November 12, 2026; teacher dashboard is stretch scope.
**Updated:** November 3, 2026 · [Design Doc v2](design-doc-v2.md)

StudentHub primarily supports school administration in Nepal. Each class has a usual classroom; shared labs and activity rooms have day/time bookings. The earlier general classroom-finder scope remains cancelled. Homeroom classes are student groups, separate from physical rooms. Job search remains optional for high-school users; its new audience gating is planned.

```mermaid
flowchart TD
    A["REUSABLE IMPLEMENTATION<br/>Accounts, terms, subjects and timetables<br/>Password reset requests<br/>C0 canteen-head workspace<br/>C1 daily menus — locally verified"]
    B["NEW TARGET<br/>Middle and high schools<br/>Grades and homeroom classes"]
    C["1 · School structure · #66<br/>Academic years, grades and class groups<br/>Student class membership<br/>Explicit legacy-data mapping"]
    D["2 · Teacher directory · #62<br/>Stable teacher IDs and staff codes<br/>Active / inactive records"]
    E["3 · Homeroom management · #67<br/>Assign a teacher by year and class<br/>Reassign with saved history<br/>Teacher ↔ class links"]
    F["4 · Student My Class · #68<br/>Own grade, class and homeroom teacher<br/>Own subjects and timetable"]
    G["5 · Teacher subject planning · #63–64<br/>Assigned subjects and weekly timetable<br/>Prevent recorded cross-class conflicts"]
    H["6 · Complete school canteen · #55–56<br/>Opening hours and location<br/>Item availability / sold out<br/>Managed by the canteen head"]
    J["OPTIONAL · HIGH SCHOOL · #69<br/>Keep job search, filters and favourites<br/>Implement school-level access gating"]
    R["HOSTING TRACK · #65<br/>Develop locally now<br/>Revisit Railway purchase November 10<br/>Verify original database and live release"]
    V["7 · Verify and release · #60<br/>Role and student-isolation checks<br/>Phone / desktop and recovery states<br/>Independent proof and final demo"]
    A --> B --> C --> D --> E --> F --> G --> H --> V
    C -.-> J -.-> V
    B -.-> R -.-> V
    classDef done fill:#e0eee6,stroke:#356353,color:#183c30;
    classDef next fill:#fff0cf,stroke:#c4963e,color:#594016;
    classDef plan fill:#f4f7fa,stroke:#8297aa,color:#253d50;
    class A done;
    class B,C next;
    class D,E,F,G,H,J,R,V plan;
```

Green means existing implementation, not a complete new school release. Gold identifies the new direction and next implementation. Grey items remain planned. C1 still needs browser/manual proof and live checking. Render/Aiven deployment history does not prove the original Railway database has been recovered.

Cancelled as **not planned**, not completed: [#51](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/51), [#57](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/57), [#58](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/58), [#59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/59).

## November 3 scope clarification — room allocation board

The owner approved a different room workflow: five floors with eight rooms each. Rooms ending in 07 and 08 are special rooms (10 total); the remaining 30 are usual classrooms. Administrators drag a class onto a room: a regular room gets a year-scoped class assignment, while a special room opens a day/time booking form. This is a local implementation, not a live release or a completion claim for the cancelled historical Issues above.

Locally implemented: editable room names, usual-classroom moves/releases, one-time and weekly special-room bookings, and room/class/teacher booking conflicts with stale-write protection. Details and proof: [Room board test note](room-board-test-note.md). No production data migration or Railway deployment has been performed.

Homeroom rule clarified November 2: the teacher of Sunday’s 10 AM lesson in a selected term is shown as the homeroom teacher in Accounts. This is derived from the subject timetable; the earlier separate manual-assignment/history plan is not implemented by that view.
