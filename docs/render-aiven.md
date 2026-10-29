# Render + Aiven migration

Recovery work for [#65](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/65).

Use the existing root Dockerfile on Render, branch main, empty root directory,
and the Free instance. It builds the frontend and backend together.

Set these Render environment variables using Aiven's MySQL connection fields:
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME (usually defaultdb).
Set SEOUL_API_KEY separately for job search. Never commit their values.

For the encrypted connection, set DB_SSL=true and DB_SSL_CA to the complete
public PEM CA certificate from Aiven Overview → Connection information → CA
certificate → Show. Include both BEGIN CERTIFICATE and END CERTIFICATE lines.
Actual multiline values and literal escaped newlines are supported. Certificate
and hostname verification remain enabled; TLS configuration does not prove a
successful database connection.

Before deploying, export the existing database through an available approved
source, import its tables/data into Aiven, and confirm existing account records
and academic data. The app's startup migrations extend an existing schema; they
do not restore a full database. Keep exports private and outside GitHub.
If the old Railway database is inaccessible, identify a local copy or backup
before claiming that existing records can be preserved. Do not silently seed a
replacement and describe it as a migration.

After migration, deploy the published commit and check startup logs, login,
role boundaries, courses/timetable, jobs and saved favourites. Record results
in the recovery Issue. Neither live connection nor data migration has been
verified by the local TLS configuration tests.
