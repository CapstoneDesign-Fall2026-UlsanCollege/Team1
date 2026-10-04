import 'dotenv/config';
import { majorPlanningRouter } from './major-planning.js';
import { mysqlStudentAdmin } from './student-admin.js';
import { mysqlSchedules } from './schedules.js';
import mysql, { type RowDataPacket } from 'mysql2/promise';
import { createApp, type Account } from './app.js';
import { createStudent, getStudentProfile, updateStudentContact } from './students.js';
import { addSemester, listSemesters, assignedSemesters, assignSemester } from './semesters.js';
import { addOffering, coursesForStudent, enrollStudent, courseCatalog, assignCourse, removeCourse } from './courses.js';
import { courseAssignments, removeOffering, updateOfferingProfessor } from './courses.js';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3307),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'studenthub',
  connectionLimit: 5,
});
async function find(column: 'id' | 'login_id', value: number | string) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, login_id, password_hash, role, is_active FROM users WHERE ' + column + ' = ? LIMIT 1', [value]);
  return rows[0] as Account | undefined;
}
const app = createApp(
  { byLogin: login => find('login_id', login), byId: id => find('id', id), majorPlanning: majorPlanningRouter(pool),
    courseAssignments: () => courseAssignments(pool), removeOffering: id => removeOffering(pool, id), schedules: mysqlSchedules(pool),
    updateProfessor: (id, professor) => updateOfferingProfessor(pool, id, professor), studentAdmin: mysqlStudentAdmin(pool) },
  student => createStudent(pool, student),
  id => getStudentProfile(pool, id),
  (id, input) => updateStudentContact(pool, id, input),
  id => id === undefined ? listSemesters(pool) : assignedSemesters(pool, id),
  value => addSemester(pool, value),
  (studentId, semesterId) => assignSemester(pool, studentId, semesterId),
  value => addOffering(pool, value),
  id => coursesForStudent(pool, id),
  (studentId, offeringId) => enrollStudent(pool, studentId, offeringId),
  () => courseCatalog(pool),
  (courseId, semesterId, professor) => assignCourse(pool, courseId, semesterId, professor),
  (courseId, semesterId) => removeCourse(pool, courseId, semesterId)
);
const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, '127.0.0.1');
server.on('listening', () => console.log('StudentHub API: http://127.0.0.1:' + port));
server.on('error', (error: NodeJS.ErrnoException) => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Stop the existing backend before starting this version.`
    : `Backend failed to start: ${error.message}`);
  process.exitCode = 1;
  void pool.end();
});

