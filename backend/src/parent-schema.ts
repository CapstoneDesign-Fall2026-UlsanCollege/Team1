import type {Pool,RowDataPacket} from 'mysql2/promise';
export async function ensureParentSchema(pool:Pool){
 const [columns]=await pool.query<RowDataPacket[]>("SHOW COLUMNS FROM users LIKE 'role'");
 if(columns[0]?.Type!=="enum('admin','student','canteen_head','teacher','parent')"){
  if(columns[0]?.Type!=="enum('admin','student','canteen_head','teacher')")throw Error('Unexpected users.role schema; review parent migration.');
  await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin','student','canteen_head','teacher','parent') NOT NULL DEFAULT 'student'");
 }
 for(const sql of [
  `CREATE TABLE IF NOT EXISTS school_parent_profiles(user_id INT UNSIGNED PRIMARY KEY,full_name VARCHAR(150) NOT NULL,email VARCHAR(254) NULL,phone_number VARCHAR(30) NULL,must_change_password TINYINT NOT NULL DEFAULT 1,FOREIGN KEY(user_id) REFERENCES users(id)) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_parent_students(parent_user_id INT UNSIGNED NOT NULL,student_user_id INT UNSIGNED NOT NULL,relationship VARCHAR(20) NOT NULL,is_active TINYINT NOT NULL DEFAULT 1,verified_by INT UNSIGNED NOT NULL,version INT UNSIGNED NOT NULL DEFAULT 1,linked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(parent_user_id,student_user_id),FOREIGN KEY(parent_user_id) REFERENCES users(id),FOREIGN KEY(student_user_id) REFERENCES users(id),FOREIGN KEY(verified_by) REFERENCES users(id)) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS school_notices(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,title VARCHAR(150) NOT NULL,message TEXT NOT NULL,starts_on DATE NOT NULL,ends_on DATE NOT NULL,published TINYINT NOT NULL DEFAULT 0,version INT UNSIGNED NOT NULL DEFAULT 1,updated_by INT UNSIGNED NOT NULL,FOREIGN KEY(updated_by) REFERENCES users(id)) ENGINE=InnoDB`
 ])await pool.query(sql);
}
