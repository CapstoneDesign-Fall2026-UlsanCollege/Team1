-- Additive teacher workspace migration. Application startup performs the guarded/idempotent equivalent.
-- Preserve existing role order; append teacher. Never infer login links from teacher names.
ALTER TABLE users MODIFY COLUMN role ENUM('admin','student','canteen_head','teacher') NOT NULL DEFAULT 'student';

CREATE TABLE IF NOT EXISTS school_teacher_accounts (
  user_id INT UNSIGNED PRIMARY KEY, teacher_id INT UNSIGNED NOT NULL UNIQUE,
  FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(teacher_id) REFERENCES school_teachers(id)
 ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_homework (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, class_id INT UNSIGNED NOT NULL, offering_id INT UNSIGNED NOT NULL,
  teacher_id INT UNSIGNED NOT NULL, created_by INT UNSIGNED NOT NULL, assigned_on DATE NOT NULL, due_on DATE NOT NULL,
  title VARCHAR(150) NOT NULL, instructions TEXT NOT NULL, is_active TINYINT NOT NULL DEFAULT 1,
  version INT UNSIGNED NOT NULL DEFAULT 1, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(class_id) REFERENCES school_classes(id), FOREIGN KEY(offering_id) REFERENCES course_offerings(id),
  FOREIGN KEY(teacher_id) REFERENCES school_teachers(id), FOREIGN KEY(created_by) REFERENCES users(id)
 ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_attendance_sheets (
  class_id INT UNSIGNED NOT NULL, attendance_date DATE NOT NULL, version INT UNSIGNED NOT NULL DEFAULT 0,
  updated_by INT UNSIGNED NOT NULL, PRIMARY KEY(class_id,attendance_date),
  FOREIGN KEY(class_id) REFERENCES school_classes(id), FOREIGN KEY(updated_by) REFERENCES users(id)
 ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_attendance (
  class_id INT UNSIGNED NOT NULL, attendance_date DATE NOT NULL, student_user_id INT UNSIGNED NOT NULL,
  status ENUM('present','absent','late','excused') NOT NULL, recorded_by INT UNSIGNED NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(class_id,attendance_date,student_user_id),
  FOREIGN KEY(class_id,attendance_date) REFERENCES school_attendance_sheets(class_id,attendance_date),
  FOREIGN KEY(student_user_id) REFERENCES users(id), FOREIGN KEY(recorded_by) REFERENCES users(id)
 ) ENGINE=InnoDB;
