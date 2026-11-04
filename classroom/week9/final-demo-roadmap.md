# Final Demo Roadmap — StudentHub

**Team:** Team 1  
**Prepared:** Week 9  
**Current status:** MVP gap remains; school/homeroom path is planned, not yet verified.

## Final demo destination

The core final-demo journey is:

**Administrator → school year/grade/homeroom class → student membership → homeroom teacher → Student My Class → subjects/timetable → school canteen menu**

The optional high-school job feature must not block this journey.

## What the demo will not claim

- no automatic conversion of college majors into school grades;
- no classroom-finder feature;
- no attendance or marks;
- no teacher or parent login portal;
- no guaranteed personal teacher availability beyond recorded class conflicts;
- no live-deployment claim until the deployed version is actually checked;
- no job eligibility claim from school level alone.

## Roadmap to Week 16

| Week | Milestone | Check and evidence | Owner | Risk / fallback |
|---:|---|---|---|---|
| 10 | Close the evidence gap and start the school foundation | `CoderRaaju` records a real non-author C0 result; #66 has a first implementation/check result | `CoderRaaju` for C0 test; `bishal482` for #66 | If live hosting is unavailable, use the documented local path and state that limit |
| 11 | MVP verification / feature-freeze decision | A thin admin → class membership → homeroom/My Class path is demonstrable with fictional data, or the team explicitly freezes to the smaller verified subset | Owners of #66/#67/#68 | If downstream dependencies are not ready, freeze optional teacher-conflict/jobs work |
| 12 | QA and bug triage | Peer/non-author tests cover core role boundaries, student isolation, empty/error states and canteen visibility | QA owner to confirm | Fix demo-blocking defects before adding features |
| 13 | Handoff/setup trial | Another teammate follows setup instructions from a clean start and records the first confusing/failing step | Setup/docs owner to confirm | Revise setup and repeat the failed step |
| 14 | Demo lock | Final demo script, safe fictional dataset, evidence links and fallback are frozen | Demo lead to confirm | Use local fallback if hosting remains unreliable |
| 15 | Readiness | Stable build, known risks, contribution evidence and presentation roles are confirmed | Whole team | Reject late features that threaten the core path |
| 16 | Final demo and handoff | Present only evidence-backed behavior and provide roadmap/design/setup/evidence handoff | Whole team | Explain remaining limits rather than overclaiming |

## Immediate actions

1. **CoderRaaju:** run and record the C0 non-author test from the published procedure.
2. **bishal482:** implement/check the first thin school structure slice in #66.
3. **Team:** confirm owners for #67 and #68 instead of leaving all downstream work under one login.
4. **Team:** add each member's personal Week 9 row to the shared report.
5. **Team:** keep #64 teacher conflict prevention behind #62/#63 dependencies; do not make it a Week 9 proof claim.
