# Staff Activity Log

Open **Administration > Activity Log**. Administrators can filter by staff account, action, record type and Nepal dates, browse 20 entries per page, and expand before/after values. Canteen heads cannot read the log but their workspace changes are recorded. There is no edit/delete API.

## Recording and setup

The server runs `ensureActivitySchema` before listening. SQL migration 012 documents the history table; the runtime installer also creates versioned AFTER triggers on supported existing tables. MySQL must use InnoDB and the application account needs CREATE TABLE and TRIGGER privileges. Installation/schema failure prevents startup.

Authenticated request context follows each pooled connection and is cleared before release. Actor IDs from request bodies are ignored. Audit inserts and original mutations share their statement/transaction: an audit failure blocks the edit; rollback removes both. No-op updates produce no entry. Existing operations retain their transaction boundaries; multiple independent transactions are not combined.

Coverage: school profile/years/classes/terms/memberships, subjects/offerings/class links/grade library, teachers/assignments, lessons, rooms/usual classrooms/special bookings, student/staff account changes, administrator reset-request reviews, canteen menus and information. Private student profile values and affected-account login/password values are `[hidden]`; changed field names remain visible. The acting staff login is intentionally retained.

History starts at activation. Student self-service changes, authentication events, direct SQL/maintenance without authenticated context and database-engine cascades are outside this staff-change log. No historical events are invented. Database owners can alter logs: this is not an external tamper-proof ledger. Shared logins cannot identify the individual person; each administrator needs a separate controlled account.

## Backups

A private backup was restore-verified before local installation on November 8. JSON export was fixed and reverified before schema changes; no dump or credentials are committed.

The simple setup-local-school seed/backup helper deliberately refuses databases containing triggers. After activation, use a full operator-controlled MySQL backup including triggers and verify restoration in isolation. Preserve audit history; do not drop triggers to rerun seed scripts.

[Actual checks and proof](../classroom/week10/activity-log-check.md). Independent human review and hosted verification remain pending. Railway was not deployed.
