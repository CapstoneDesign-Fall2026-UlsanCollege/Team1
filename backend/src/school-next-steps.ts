import type {Pool,RowDataPacket} from 'mysql2/promise';

// Only readiness counts leave this endpoint; no names, contacts or credentials.
export async function schoolNextSteps(pool:Pool,today:string){
 const rows=async(sql:string,args:any[]=[]) => (await pool.execute<RowDataPacket[]>(sql,args))[0];
 const count=async(sql:string,args:any[]=[])=>Number((await rows(sql,args))[0].n);
 const years=await rows("SELECT id,name,DATE_FORMAT(start_date,'%Y-%m-%d') start_date,DATE_FORMAT(end_date,'%Y-%m-%d') end_date FROM school_years ORDER BY start_date DESC,id DESC");
 const year=years.find(y=>y.start_date<=today&&y.end_date>=today)??years[0]??null;
 const yearId=year?.id??0;
 const date=year?(today<year.start_date?year.start_date:today>year.end_date?year.end_date:today):today;
 const activeClasses='FROM school_classes cl WHERE cl.year_id=? AND cl.is_active=1';
 const validOffering='FROM school_class_offerings l JOIN course_offerings co ON co.id=l.offering_id JOIN school_terms st ON st.semester_id=co.semester_id AND st.year_id=cl.year_id JOIN school_offering_teachers ot ON ot.offering_id=co.id JOIN school_teachers t ON t.id=ot.teacher_id AND t.is_active=1 WHERE l.class_id=cl.id';
 return {year:year?{id:year.id,name:year.name}:null,today,counts:{
  school:await count('SELECT COUNT(*) n FROM school_profile WHERE id=1'),
  terms:await count('SELECT COUNT(*) n FROM school_terms WHERE year_id=?',[yearId]),
  classes:await count('SELECT COUNT(*) n '+activeClasses,[yearId]),
  rooms:await count('SELECT COUNT(*) n FROM school_rooms'),
  unroomed:await count('SELECT COUNT(*) n '+activeClasses+' AND NOT EXISTS(SELECT 1 FROM school_class_rooms a WHERE a.class_id=cl.id AND a.year_id=cl.year_id)',[yearId]),
  grades_without_subjects:await count('SELECT COUNT(DISTINCT cl.grade_label) n '+activeClasses+' AND NOT EXISTS(SELECT 1 FROM school_grade_subjects g WHERE g.year_id=cl.year_id AND g.grade_label=cl.grade_label)',[yearId]),
  teachers:await count('SELECT COUNT(*) n FROM school_teachers WHERE is_active=1'),
  classes_without_subjects:await count('SELECT COUNT(*) n '+activeClasses+' AND NOT EXISTS(SELECT 1 '+validOffering+')',[yearId]),
  classes_without_lessons:await count('SELECT COUNT(*) n '+activeClasses+' AND NOT EXISTS(SELECT 1 '+validOffering+' AND EXISTS(SELECT 1 FROM class_schedules cs WHERE cs.course_offering_id=co.id))',[yearId]),
  teachers_without_login:await count(`SELECT COUNT(DISTINCT t.id) n FROM school_teachers t JOIN school_offering_teachers ot ON ot.teacher_id=t.id JOIN school_class_offerings l ON l.offering_id=ot.offering_id JOIN school_classes cl ON cl.id=l.class_id JOIN course_offerings co ON co.id=l.offering_id JOIN school_terms st ON st.semester_id=co.semester_id AND st.year_id=cl.year_id WHERE cl.year_id=? AND cl.is_active=1 AND t.is_active=1 AND NOT EXISTS(SELECT 1 FROM school_teacher_accounts a JOIN users u ON u.id=a.user_id AND u.role='teacher' AND u.is_active=1 WHERE a.teacher_id=t.id)`,[yearId]),
  classes_without_students:await count(`SELECT COUNT(*) n ${activeClasses} AND NOT EXISTS(SELECT 1 FROM school_memberships m JOIN users u ON u.id=m.student_user_id AND u.role='student' AND u.is_active=1 WHERE m.class_id=cl.id AND m.year_id=cl.year_id AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?))`,[yearId,date,date]),
  canteen_staff:await count("SELECT COUNT(*) n FROM users WHERE role='canteen_head' AND is_active=1"),
 }};
}
