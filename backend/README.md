# StudentHub login API

1. Copy .env.example to .env and set DB_PASSWORD locally (never commit it).
2. MySQL must be running on port 3307 with the studenthub users table and a bcrypt-hashed account.
3. Run npm.cmd run dev here. Run npm.cmd run dev in ../frontend separately.
4. Open the Vite URL. Vite proxies /api to the backend on port 3000.

No public registration is provided. The database role controls access.
Sessions use HttpOnly, SameSite cookies, expire after 8 hours, and are held in memory.
Restarting the backend signs everyone out. This is a local-development setup.
Before public deployment, use HTTPS, a persistent session store, a dedicated database user, and deployment-specific proxy/rate-limit settings.
Account creation, password reset/change, and academic management are not implemented yet.
Existing users tables must match the schema discussed in the project.

Checks: npm.cmd run build; npm.cmd test.

