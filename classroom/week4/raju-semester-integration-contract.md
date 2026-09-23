# Week 4 Individual Contribution — Semester Integration Contract

**Student:** Bal Raju  
**Team:** 1  
**Week:** 4  
**Feature owner:** Semester slice  
**Status:** Proposed handoff for Week 5 implementation

## Why I selected this work

The Week 3 plan identifies me as the first owner for the Semester feature. Week 4
does not require coding, so I used the checkpoint to remove one integration
uncertainty before implementation starts: agreeing on the data shape and the
smallest API contract for the Semester slice.

## Feature outcome

A student can open the Semester slice and see the currently selected semester,
its start and end dates, and whether it is active.

## Proposed API contract

### Request

```http
GET /api/students/:studentId/semester
Accept: application/json
```

### Successful response

```json
{
  "studentId": "student-001",
  "semester": {
    "id": "2026-fall",
    "name": "Fall 2026",
    "startsOn": "2026-09-01",
    "endsOn": "2026-12-21",
    "isCurrent": true
  }
}
```

### Error cases

| Status | Situation | Required response |
|---|---|---|
| `400` | `studentId` is missing or invalid | Return a clear validation error |
| `404` | The student has no semester record | Return a not-found error |
| `500` | Database or unexpected server failure | Return a generic server error without database details |

## Proposed storage shape

The backend/database owner can map the existing data model to these fields:

| Field | Type | Rule |
|---|---|---|
| `studentId` | string | Identifies the student; required |
| `id` | string | Stable semester identifier; required |
| `name` | string | Display name such as `Fall 2026`; required |
| `startsOn` | `YYYY-MM-DD` | Inclusive start date; required |
| `endsOn` | `YYYY-MM-DD` | End date after `startsOn`; required |
| `isCurrent` | boolean | Only the active semester is `true` for a student |

The UI should use the sample response first and replace its data source with
this endpoint during backend integration. No additional semester features are
needed for the MVP.

## Acceptance checks for Week 5

- [ ] The Semester screen displays the semester name and date range.
- [ ] The screen uses the `studentId` supplied by the authenticated user.
- [ ] A valid response renders without hard-coded display values.
- [ ] A `404` response produces a useful empty/not-found state.
- [ ] Invalid date ranges are rejected before data is stored.
- [ ] The endpoint response matches the JSON shape above.

## Handoff and evidence

This document is my Week 4 individual evidence. In Week 5, I will confirm the
contract with the backend owner, implement or connect the Semester screen, and
attach a screenshot or test result showing the acceptance checks.
