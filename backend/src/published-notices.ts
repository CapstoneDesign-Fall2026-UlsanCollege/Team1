import type {Pool,RowDataPacket} from 'mysql2/promise';
export async function publishedNotices(pool:Pick<Pool,'execute'>,userId:number,role:'parent'|'student',date:string){
 type NoticeRow=RowDataPacket & {id:number;title:string;message:string;starts_on:string;ends_on:string;teacher_name?:string;grade_label?:string;class_name?:string};
 const rows=async(sql:string,args:any[]) => (await pool.execute<NoticeRow[]>(sql,args))[0];
 const school=await rows("SELECT id,title,message,DATE_FORMAT(starts_on,'%Y-%m-%d') starts_on,DATE_FORMAT(ends_on,'%Y-%m-%d') ends_on FROM school_notices WHERE published=1 AND starts_on<=? AND ends_on>=? ORDER BY starts_on DESC,id DESC LIMIT 100",[date,date]);
 const audience=role==='parent'?"JOIN school_parent_students ps ON ps.student_user_id=m.student_user_id JOIN users u ON u.id=ps.student_user_id WHERE ps.parent_user_id=? AND ps.is_active=1 AND u.is_active=1 AND u.role='student'":"WHERE m.student_user_id=?";
 const classes=await rows(`SELECT n.id,n.title,n.message,DATE_FORMAT(n.starts_on,'%Y-%m-%d') starts_on,DATE_FORMAT(n.ends_on,'%Y-%m-%d') ends_on,t.name teacher_name,cl.grade_label,cl.name class_name
 FROM school_class_notices n JOIN school_teachers t ON t.id=n.teacher_id JOIN school_classes cl ON cl.id=n.class_id JOIN school_years y ON y.id=cl.year_id
 WHERE n.published=1 AND n.starts_on<=? AND n.ends_on>=? AND cl.is_active=1 AND y.start_date<=? AND y.end_date>=?
 AND EXISTS(SELECT 1 FROM school_memberships m ${audience} AND m.class_id=n.class_id AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?))
 ORDER BY n.starts_on DESC,n.id DESC LIMIT 100`,[date,date,date,date,userId,date,date]);
 return [...school.map(n=>({...n,source:'school',author:'School administration'})),...classes.map(n=>({...n,source:'class',author:n.teacher_name}))].sort((a,b)=>b.starts_on.localeCompare(a.starts_on)||b.id-a.id);
}
