USE studenthub;
CREATE TABLE IF NOT EXISTS student_semesters (
  student_user_id INT UNSIGNED NOT NULL,
  semester_id INT UNSIGNED NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_user_id, semester_id),
  FOREIGN KEY (student_user_id) REFERENCES student_profiles(user_id) ON DELETE RESTRICT,
  FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
