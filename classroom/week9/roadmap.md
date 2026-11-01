# StudentHub — revised school roadmap

**Updated:** November 1, 2026 · [Design Doc v2](design-doc-v2.md)

Classroom finding is cancelled. Homeroom classes mean student groups, not physical rooms. Job search remains optional for high-school users; its new audience gating is planned.

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
