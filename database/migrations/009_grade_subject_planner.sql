-- Additive grade subject library and stable teacher identities. No sample data.
CREATE TABLE IF NOT EXISTS school_teachers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, staff_code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL, is_active TINYINT NOT NULL DEFAULT 1
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_grade_subjects (
    year_id INT UNSIGNED NOT NULL, grade_label VARCHAR(30) NOT NULL, course_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(year_id,grade_label,course_id),
    FOREIGN KEY(year_id) REFERENCES school_years(id), FOREIGN KEY(course_id) REFERENCES courses(id)
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_offering_teachers (
    offering_id INT UNSIGNED PRIMARY KEY, teacher_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(offering_id) REFERENCES course_offerings(id), FOREIGN KEY(teacher_id) REFERENCES school_teachers(id)
  ) ENGINE=InnoDB;
