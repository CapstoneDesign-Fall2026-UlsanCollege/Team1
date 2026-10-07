# Team Contributions – Week 5 Review

## Overview
This week, Team 1 focused on moving StudentHub from a local development setup to a public deployment and validating whether the main user flows could work in the cloud environment. The team completed the core deployment work, connected the frontend and backend, and prepared the project evidence for review.

## Main team activities

### 1. Frontend public deployment
The team published the StudentHub frontend through GitHub Pages and verified that the built Vue application was accessible from the public project site.

- Public frontend: https://capstonedesign-fall2026-ulsancollege.github.io/Team1/
- Deployment workflow: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml
- Outcome: The frontend was successfully built and deployed as a public preview for the project.

### 2. Backend deployment to Railway
The backend API was deployed to Railway so the project could operate outside of a developer laptop.

- Backend server configuration: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/server.ts
- Setup included correct server binding, port configuration, and environment variables for the online service.
- Outcome: The backend service was successfully running on Railway and able to receive requests from the frontend.

### 3. Database migration to Railway MySQL
The team migrated the existing StudentHub database from the local environment to Railway MySQL and confirmed that the application tables were available in the cloud database.

- Relevant project setup and deployment notes: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/README.md
- Outcome: The database structure and application tables were imported successfully and configured for deployment use.

### 4. Frontend–backend integration
The team connected the public frontend with the deployed backend and corrected the configuration required for requests, cookies, and cross-origin access.

- Integration commit: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d
- Outcome: The project was connected to work as a single application across separate hosting providers.

### 5. Verification and testing
The team ran the required validation for the release candidate by checking the frontend production build and existing backend test suite.

- Result: the frontend build passed.
- Result: all 16 existing backend tests passed.
- This confirmed the project remained stable after the cloud deployment setup.

### 6. Documentation and weekly reporting
The team prepared and organized the project evidence for review by updating project documentation and weekly reports.

- Project README: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/README.md
- Week 5 documents: classroom/week5/
- Outcome: The team created a clear record of the work completed, remaining risks, and next steps.

## Team contribution summary
During Week 5, Team 1 successfully completed the core deployment milestone for StudentHub. The team moved the application from local development to a deployed public setup by publishing the frontend, deploying the backend, migrating the database, and connecting the components together. The team also verified the build and test status, which gave confidence that the project was ready for public review.

## Remaining concerns and next steps
The team also identified important follow-up issues that must be resolved before the project can be considered fully reliable in production:

- The timetable permission flow still shows an "Administrators only" error and needs further investigation.
- Deployed workflow verification still needs to be tested for real user actions.
- Mobile usability of the published student interface should be checked on smaller screens.
- The Saramin job-listing integration remains a future stretch task that depends on API approval.

## Conclusion
Week 5 was an important milestone for Team 1 because we completed the project’s public deployment foundation and validated that the main system is operational in a cloud environment. The team made meaningful progress in architecture, deployment, database migration, and integration, while also identifying the key verification tasks needed for the next phase.

## Evidence links
- StudentHub website: https://capstonedesign-fall2026-ulsancollege.github.io/Team1/
- GitHub Pages workflow: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/.github/workflows/deploy-frontend.yml
- Integration commit: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/commit/c15cf3d
- Backend server configuration: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/backend/src/server.ts
- Project README: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/blob/main/README.md
- Weekly report: classroom/week5/weekly-report.md
