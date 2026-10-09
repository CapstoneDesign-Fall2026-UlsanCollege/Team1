-- The backend also creates this table on startup. Existing tables and rows are preserved.
CREATE TABLE IF NOT EXISTS password_reset_requests (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL UNIQUE,
 status ENUM('pending','completed','rejected') NOT NULL DEFAULT 'pending',
 requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 reviewed_at TIMESTAMP NULL, reviewed_by INT UNSIGNED NULL,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
