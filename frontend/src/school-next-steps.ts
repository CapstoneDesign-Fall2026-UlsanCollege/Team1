export type GuideSnapshot={year:{id:number;name:string}|null;today:string;counts:Record<string,number>}
export type GuideStep={id:string;title:string;detail:string;action:string;section:string;panel?:string;done:boolean}
export function schoolGuide(data:GuideSnapshot):GuideStep[]{
 const c=data.counts,school=c.school>0,year=school&&!!data.year,term=year&&c.terms>0,classes=term&&c.classes>0;
 const subjects=classes&&c.grades_without_subjects===0,teachers=c.teachers>0;
 const assigned=classes&&teachers&&c.classes_without_subjects===0;
 return [
  {id:'school',title:'Name your school',detail:'Save the school name and level.',action:'Set school details',section:'setup',done:school},
  {id:'year',title:'Create the academic year',detail:'Set the year label and start/end dates.',action:'Set academic year',section:'setup',done:year},
  {id:'term',title:'Create a school term',detail:'Link at least one term to this academic year.',action:'Set school term',section:'setup',done:term},
  {id:'classes',title:'Create grades and classes',detail:'Create at least one active homeroom class.',action:'Set up classes',section:'setup',done:classes},
  {id:'rooms',title:'Create rooms and assign classrooms',detail:c.rooms>0?`${c.unroomed} active class(es) still need a usual classroom.`:'Add floors and rooms, then assign a usual classroom to each active class.',action:'Open rooms',section:'rooms',done:classes&&c.rooms>0&&c.unroomed===0},
  {id:'subjects',title:'Build each grade’s subject library',detail:`${c.grades_without_subjects} grade(s) have no library subjects. Choose the grade/class in School management.`,action:'Set up subjects',section:'school',panel:'subjects',done:subjects},
  {id:'teachers',title:'Add teachers',detail:'Create active teacher records with their subject information.',action:'Open teacher list',section:'students',panel:'teachers',done:subjects&&teachers},
  {id:'assignments',title:'Assign subjects and teachers to classes',detail:`${c.classes_without_subjects} class(es) have no subject with an active teacher in this year’s terms.`,action:'Assign class subjects',section:'school',panel:'subjects',done:assigned},
  {id:'timetable',title:'Start each class timetable',detail:`${c.classes_without_lessons} class(es) have no saved lesson with an active teacher. Complete the remaining periods after the first lesson.`,action:'Open timetables',section:'school',panel:'subjects',done:assigned&&c.classes_without_lessons===0},
  {id:'teacher-login',title:'Give assigned teachers login access',detail:`${c.teachers_without_login} assigned teacher(s) need an enabled login.`,action:'Open teacher access',section:'students',panel:'teacher-access',done:assigned&&c.teachers_without_login===0},
  {id:'students',title:'Enroll students in classes',detail:`${c.classes_without_students} class(es) have no active student on the school date used for this year.`,action:'Open student accounts',section:'students',panel:'directory',done:classes&&c.classes_without_students===0},
  {id:'canteen',title:'Create a canteen staff account',detail:'An enabled canteen staff account can publish menus from its own workspace.',action:'Open canteen staff',section:'students',panel:'canteen',done:c.canteen_staff>0},
 ];
}
