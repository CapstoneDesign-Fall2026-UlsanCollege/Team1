import {activityPool,activityRouter,withActivityActor} from './activity-log.js';
import {Router} from 'express';
import {canteenInfoRouter} from './canteen-info.js';
import { schoolPlanningRouter } from './school-planning.js';
import { canteenMenuRouter } from './canteen-menu.js';
import { mysqlCanteenAccounts } from './canteen-accounts.js';
import { semesterDetailsRouter } from './semester-details.js';
import { mysqlFavourites } from './job-favourites.js';
import { createSeoulJobs, type JobService } from './jobs.js';
import { mysqlResets } from './password-resets.js';
import { majorPlanningRouter } from './major-planning.js';
import { mysqlStudentAdmin } from './student-admin.js';
import { mysqlSchedules } from './schedules.js';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { createApp, type Account } from './app.js';
import { createStudent, getStudentProfile, updateStudentContact } from './students.js';
import { addSemester, listSemesters, assignedSemesters, assignSemester } from './semesters.js';
import { addOffering, coursesForStudent, enrollStudent, courseCatalog, assignCourse, removeCourse } from './courses.js';
import { courseAssignments, removeOffering, updateOfferingProfessor } from './courses.js';


// Production and disposable reviews share the same routes and persistence adapters.
export function createDatabaseApp(rawPool: Pool, options: { today?: () => string; jobs?: JobService } = {}) {
const pool=activityPool(rawPool);
async function find(column: 'id' | 'login_id', value: number | string) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, login_id, password_hash, role, is_active FROM users WHERE ' + column + ' = ? LIMIT 1', [value]);
  return rows[0] as Account | undefined;
}
return createApp(
  { withActor:withActivityActor, school:Router().use(schoolPlanningRouter(pool, options.today)).use(activityRouter(pool)), campus:Router().use(canteenMenuRouter(pool, options.today)).use(canteenInfoRouter(pool, options.today)), canteenAccounts: mysqlCanteenAccounts(pool), semesterDetails: semesterDetailsRouter(pool), favourites: mysqlFavourites(pool), jobs: options.jobs ?? createSeoulJobs(), resets: mysqlResets(pool), byLogin: login => find('login_id', login), byId: id => find('id', id), majorPlanning: majorPlanningRouter(pool),
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
}
