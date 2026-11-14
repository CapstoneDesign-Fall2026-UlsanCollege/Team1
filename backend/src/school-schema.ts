import {randomUUID} from 'node:crypto';
import type { Pool } from 'mysql2/promise';

// Additive only. Never infer a grade/class from a legacy major or rewrite accounts.
export const schoolSchema = [
  `CREATE TABLE IF NOT EXISTS school_planning_lock (id INT PRIMARY KEY, version INT UNSIGNED NOT NULL DEFAULT 0) ENGINE=InnoDB`,
  `INSERT IGNORE INTO school_planning_lock(id,version) VALUES(1,0)`,
  `CREATE TABLE IF NOT EXISTS school_profile (
    id INT PRIMARY KEY, name VARCHAR(150) NOT NULL, level ENUM('middle','high') NOT NULL
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_years (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL UNIQUE,
    start_date DATE NOT NULL, end_date DATE NOT NULL
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_classes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, year_id INT UNSIGNED NOT NULL,
    grade_label VARCHAR(30) NOT NULL, name VARCHAR(50) NOT NULL,
    is_active TINYINT NOT NULL DEFAULT 1,
    UNIQUE KEY uq_school_class(year_id,grade_label,name),
    FOREIGN KEY(year_id) REFERENCES school_years(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_terms (
    semester_id INT UNSIGNED PRIMARY KEY, year_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(semester_id) REFERENCES semesters(id) ON DELETE RESTRICT,
    FOREIGN KEY(year_id) REFERENCES school_years(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_memberships (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, student_user_id INT UNSIGNED NOT NULL,
    year_id INT UNSIGNED NOT NULL, class_id INT UNSIGNED NOT NULL,
    starts_on DATE NOT NULL, ends_on DATE NULL,
    active_student INT UNSIGNED GENERATED ALWAYS AS (CASE WHEN ends_on IS NULL THEN student_user_id ELSE NULL END) STORED,
    UNIQUE KEY uq_school_membership(year_id,active_student),
    KEY ix_school_student(student_user_id,year_id),
    FOREIGN KEY(student_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY(year_id) REFERENCES school_years(id) ON DELETE RESTRICT,
    FOREIGN KEY(class_id) REFERENCES school_classes(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_class_offerings (
    class_id INT UNSIGNED NOT NULL, offering_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(class_id,offering_id),
    FOREIGN KEY(class_id) REFERENCES school_classes(id) ON DELETE RESTRICT,
    FOREIGN KEY(offering_id) REFERENCES course_offerings(id) ON DELETE RESTRICT
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_teachers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, staff_code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL, is_active TINYINT NOT NULL DEFAULT 1
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_teacher_subjects (
    teacher_id INT UNSIGNED PRIMARY KEY, course_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES school_teachers(id), FOREIGN KEY(course_id) REFERENCES courses(id)
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_grade_subjects (
    year_id INT UNSIGNED NOT NULL, grade_label VARCHAR(30) NOT NULL, course_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(year_id,grade_label,course_id),
    FOREIGN KEY(year_id) REFERENCES school_years(id), FOREIGN KEY(course_id) REFERENCES courses(id)
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_offering_teachers (
    offering_id INT UNSIGNED PRIMARY KEY, teacher_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(offering_id) REFERENCES course_offerings(id), FOREIGN KEY(teacher_id) REFERENCES school_teachers(id)
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_rooms (
    id INT UNSIGNED PRIMARY KEY, floor_number INT NOT NULL, position_number INT NOT NULL,
    kind ENUM('regular','special') NOT NULL, name VARCHAR(100) NOT NULL,
    UNIQUE KEY uq_room_position(floor_number,position_number)
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_class_rooms (
    year_id INT UNSIGNED NOT NULL, class_id INT UNSIGNED NOT NULL, room_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(year_id,class_id), UNIQUE KEY uq_year_room(year_id,room_id),
    FOREIGN KEY(year_id) REFERENCES school_years(id), FOREIGN KEY(class_id) REFERENCES school_classes(id), FOREIGN KEY(room_id) REFERENCES school_rooms(id)
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_room_bookings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, room_id INT UNSIGNED NOT NULL, class_id INT UNSIGNED NOT NULL,
    offering_id INT UNSIGNED NOT NULL, teacher_id INT UNSIGNED NOT NULL, day_of_week INT NOT NULL,
    start_time TIME NOT NULL, end_time TIME NOT NULL, starts_on DATE NOT NULL, ends_on DATE NOT NULL,
    repeats_weekly TINYINT NOT NULL, is_cancelled TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY(room_id) REFERENCES school_rooms(id), FOREIGN KEY(class_id) REFERENCES school_classes(id),
    FOREIGN KEY(offering_id) REFERENCES course_offerings(id), FOREIGN KEY(teacher_id) REFERENCES school_teachers(id)
  ) ENGINE=InnoDB`,

];
export async function ensureSchoolSchema(pool: Pool) {
  for (const sql of schoolSchema) await pool.query(sql);
  await pool.query('CREATE TABLE IF NOT EXISTS school_transfer_identity (id INT PRIMARY KEY, identity CHAR(36) NOT NULL) ENGINE=InnoDB');
  await pool.execute('INSERT IGNORE INTO school_transfer_identity(id,identity) VALUES(1,?)',[randomUUID()]);
  await pool.query(`CREATE TABLE IF NOT EXISTS school_floors (floor_number INT PRIMARY KEY, label VARCHAR(60) NOT NULL) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS school_building_settings (id INT PRIMARY KEY, initialized TINYINT NOT NULL DEFAULT 0) ENGINE=InnoDB`);
  const [columns]:any=await pool.query("SHOW COLUMNS FROM school_rooms LIKE 'room_number'");
  if(!columns.length)await pool.query('ALTER TABLE school_rooms ADD room_number VARCHAR(32) NULL UNIQUE');
  await pool.query('UPDATE school_rooms SET room_number=CAST(id AS CHAR) WHERE room_number IS NULL');
  await pool.query('INSERT IGNORE INTO school_building_settings(id,initialized) VALUES(1,0)');
  const c=await pool.getConnection();
  try{
  await c.beginTransaction();
  const [settings]:any=await c.query('SELECT initialized FROM school_building_settings WHERE id=1 FOR UPDATE');
  if(settings[0].initialized){await c.commit();return;}
  const [existing]:any=await c.query('SELECT id FROM school_rooms LIMIT 1');
  const specialNames=['Physics lab','Chemistry lab','Computer lab','Science lab','Dance room','Music room','Art room','Biology lab','Library','Activity room'];
  if(!existing.length)for(let floor=1;floor<=5;floor++)for(let position=1;position<=8;position++){
    const id=floor*100+position,special=position>=7;
    await c.execute('INSERT IGNORE INTO school_rooms(id,room_number,floor_number,position_number,kind,name) VALUES(?,?,?,?,?,?)',[id,String(id),floor,position,special?'special':'regular',special?specialNames[(floor-1)*2+position-7]:'Classroom '+id]);
  }
  await c.query("INSERT IGNORE INTO school_floors(floor_number,label) SELECT DISTINCT floor_number,CONCAT('Floor ',floor_number) FROM school_rooms");
  await c.query('UPDATE school_building_settings SET initialized=1 WHERE id=1');
  await c.commit();
  }catch(e){await c.rollback();throw e;}finally{c.release();}
}
