-- Additive history table. Runtime ensureActivitySchema installs the allowlisted AFTER triggers.
-- Applying this SQL alone does not activate recording; start the updated backend.
CREATE TABLE IF NOT EXISTS activity_logs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 actor_user_id INT UNSIGNED NOT NULL, actor_login VARCHAR(50) NOT NULL,
 actor_role VARCHAR(30) NOT NULL, action VARCHAR(10) NOT NULL,
 record_type VARCHAR(60) NOT NULL, record_key VARCHAR(190) NOT NULL,
 changed_fields JSON NOT NULL, before_values JSON NULL, after_values JSON NULL,
 occurred_at DATETIME(3) NOT NULL,
 KEY ix_activity_actor(actor_user_id,id), KEY ix_activity_record(record_type,id),
 KEY ix_activity_time(occurred_at,id), KEY ix_activity_action(action,id)
) ENGINE=InnoDB;
