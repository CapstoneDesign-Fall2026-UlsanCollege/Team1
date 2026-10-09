-- Also created by the backend on startup.
CREATE TABLE IF NOT EXISTS job_favourites (
 user_id INT UNSIGNED NOT NULL, job_id CHAR(64) NOT NULL, details JSON NOT NULL,
 saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(user_id,job_id),
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
