# Password reset requests

Students use **Forgot password?** on the login page and submit their student ID and registered profile email. Matching active student accounts get one pending request. All valid submissions receive the same confirmation so the endpoint does not reveal whether an account exists. Students without a saved email must contact the administrator.

Administrators open **Requests**, refresh the queue, and review a student. Verify identity independently through a trusted university contact or in person before checking the verification box. Enter and confirm a new password, then reset it. Share that password privately with the verified student. Requests can also be rejected.

## Security and storage

- New passwords require at least 12 characters and at most 72 UTF-8 bytes.
- Passwords are hashed with bcrypt, never saved as plain text.
- Successful resets invalidate the student's existing sessions.
- Only administrators can list or resolve requests.
- Public submissions are limited to five per IP address per 15 minutes in each running backend instance.
- Repeated submissions do not create duplicate pending rows.
- The database update and request completion run in a transaction.
- Reviewed requests retain status, reviewer ID, and review time.
- No email delivery is configured. This is an administrator-reviewed process, not an automatic email reset link.

## Deployment

The backend creates `password_reset_requests` on startup with `CREATE TABLE IF NOT EXISTS`. The database account needs permission to create the table. The equivalent migration is `database/migrations/004_password_reset_requests.sql`. Existing student records are preserved.

## Verification on 2026-10-10

- All 18 backend tests passed, including access control, identity-verification requirement, password byte limits, hashing, session revocation, request replay, rejection, rate limiting, and response privacy.
- Frontend TypeScript check and production build passed.
- Browser checks with mocked API responses passed: request form, confirmation, back to login, admin review verification guard, reset submission, and 390px mobile layout.
- Cloud migration and live database reset have not been tested. After deployment, verify the workflow using a dedicated test student before resetting real student accounts.
