# Architecture Sketch

**Team:** Team 1  
**Project:** Student Life MVP  
**Last updated:** 2026/09/21  

## One-sentence architecture

This project uses:

> Frontend: Vue + TypeScript + Vite / Backend: Node.js + TypeScript / Data: MySQL / External services: None for the MVP

## Simple diagram

```text
                         User
                           ↓
              Student Life Dashboard
                          ↓
        ┌─────────────────────────────────┐
        │          Vue + TypeScript       │
        │              + Vite             │
        └─────────────────────────────────┘
                           ↓
                    API Requests
                           ↓
        ┌─────────────────────────────────┐
        │       Node.js + TypeScript      │
        │          Backend / API           │
        └─────────────────────────────────┘
                           ↓
        ┌─────────────────────────────────┐
        │              MySQL              │
        │         Persistent Data         │
        └─────────────────────────────────┘
                           ↓
        ┌─────────────────────────────────┐
        │ Student Profile                 │
        │ Semester                        │
        │ Course                          │
        │ Schedule                        │
        │ Student Job                     │
        └─────────────────────────────────┘
```
## Main parts

| Part | What it does | Owner | Risk / uncertainty |
|---|---|---|---|
| UI | Displays the Student Life Dashboard and the five slices | Galan / Team | Learning Vue and TypeScript |
| Data | Stores student profile, semester, course, schedule, and student job data | Ansh | Database structure may change during development |
| Logic/API | Handles requests between the frontend and MySQL database | Ansh / Team | Backend API design and integration are new |
| Setup/docs | Documents the architecture, setup, decisions, and development process | Buddha | Documentation may fall behind development |

## Evidence links

Link the sketch, diagram, related Issue, or preview here.

- Architecture Sketch / Diagram: [photo](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/e08fb9da117ea2100aa65d7523cf27c56881f35c/classroom/week3/benweek3.png)
- Tech Stack Comparison: [compare_stack](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/336ca397db4ff949d5ba45f4fc84abd9d19c8ff9/classroom/week3/tech-stack-comparison.md)
- Student Life MVP Scope: [scope](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/13#issue-5484747447)

## Important decisions

| Decision | Why we chose it | Risk |
|---|---|---|
| Vue + TypeScript + Vite | Provides a structured frontend and keeps TypeScript consistent across the project | Team needs to learn Vue and TypeScript |
| Node.js + TypeScript | Allows the backend to use the same language as the frontend | Team needs to learn API and server-side development |
| MySQL | Suitable for structured relational data such as courses, schedules, and student information | Database relationships may become more complex |
| Five independent slices first | Keeps the MVP small and allows parallel development | Integration may require changes later |
| Backend/Database integration after feature development | Prevents backend work from blocking the initial feature development | Integration work is concentrated in the second phase |
| No external services for MVP | Keeps the project simple and focused on the core Student Life features | Some future features may require external APIs |

## What could break?

- The team may underestimate the time needed to learn Vue, TypeScript, and Node.js.
- Different slices may require changes to the MySQL database structure during integration.
- Frontend and backend API formats may not match when the slices are connected.
- The project could become too large if features outside the five Student Life slices are added.
