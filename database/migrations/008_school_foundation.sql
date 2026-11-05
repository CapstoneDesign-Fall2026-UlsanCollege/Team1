-- S1: additive school foundation. Existing user/profile/course data is retained.
-- Creating these tables does not enable school mode; an administrator must explicitly save the school profile.

CREATE TABLE IF NOT EXISTS school_planning_lock (id INT PRIMARY KEY, version INT UNSIGNED NOT NULL DEFAULT 0) ENGINE=InnoDB;

INSERT IGNORE INTO school_planning_lock(id,version) VALUES(1,0);

CREATE TABLE IF NOT EXISTS school_profile (
    id INT PRIMARY KEY, name VARCHAR(150) NOT NULL, level ENUM('middle','high') NOT NULL
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_years (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL UNIQUE,
    start_date DATE NOT NULL, end_date DATE NOT NULL
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_classes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, year_id INT UNSIGNED NOT NULL,
    grade_label VARCHAR(30) NOT NULL, name VARCHAR(50) NOT NULL,
    is_active TINYINT NOT NULL DEFAULT 1,
    UNIQUE KEY uq_school_class(year_id,grade_label,name),
    FOREIGN KEY(year_id) REFERENCES school_years(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_terms (
    semester_id INT UNSIGNED PRIMARY KEY, year_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(semester_id) REFERENCES semesters(id) ON DELETE RESTRICT,
    FOREIGN KEY(year_id) REFERENCES school_years(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_memberships (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, student_user_id INT UNSIGNED NOT NULL,
    year_id INT UNSIGNED NOT NULL, class_id INT UNSIGNED NOT NULL,
    starts_on DATE NOT NULL, ends_on DATE NULL,
    active_student INT UNSIGNED GENERATED ALWAYS AS (CASE WHEN ends_on IS NULL THEN student_user_id ELSE NULL END) STORED,
    UNIQUE KEY uq_school_membership(year_id,active_student),
    KEY ix_school_student(student_user_id,year_id),
    FOREIGN KEY(student_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY(year_id) REFERENCES school_years(id) ON DELETE RESTRICT,
    FOREIGN KEY(class_id) REFERENCES school_classes(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_class_offerings (
    class_id INT UNSIGNED NOT NULL, offering_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(class_id,offering_id),
    FOREIGN KEY(class_id) REFERENCES school_classes(id) ON DELETE RESTRICT,
    FOREIGN KEY(offering_id) REFERENCES course_offerings(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB;
