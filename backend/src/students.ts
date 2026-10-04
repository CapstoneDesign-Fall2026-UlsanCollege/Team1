import bcrypt from 'bcryptjs';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export type StudentProfile = {
  full_name: string; university: string; major: string | null;
  year_of_study: number | null; email: string | null;
  phone_number: string | null; address: string | null;
};

export async function getStudentProfile(pool: Pool, userId: number): Promise<StudentProfile | undefined> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT full_name, university, major, year_of_study, email, phone_number, address
     FROM student_profiles WHERE user_id = ? LIMIT 1`, [userId]
  );
  return rows[0] as StudentProfile | undefined;
}
export async function updateStudentContact(pool: Pool, userId: number, input: { email: string | null; phone_number: string | null; address: string | null }) {
  await pool.execute('UPDATE student_profiles SET email = ?, phone_number = ?, address = ? WHERE user_id = ?', [input.email, input.phone_number, input.address, userId]);
}

export type NewStudent = {
  semester_id?: number | null;
  login_id: string;
  password: string;
  full_name: string;
  university: string;
  major: string;
  year_of_study: number;
  email?: string;
  phone_number?: string;
  address?: string;
};

export function validateStudent(input: unknown):
  | { ok: true; student: NewStudent }
  | { ok: false; message: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, message: 'Provide student information.' };
  }
  const data = input as Record<string, unknown>;
  if (data.semester_id !== undefined && data.semester_id !== null && (!Number.isSafeInteger(data.semester_id) || (data.semester_id as number) < 1)) {
    return { ok: false, message: 'Choose a valid semester.' };
  }
  const limits = { login_id: 50, full_name: 150, university: 150, major: 150, email: 254, phone_number: 30, address: 500 };
  const text: Record<string, string> = {};
  for (const [field, max] of Object.entries(limits)) {
    const value = data[field];
    const optional = ['email', 'phone_number', 'address'].includes(field);
    if (value === undefined && optional) { text[field] = ''; continue; }
    if (typeof value !== 'string' || value.trim().length > max || (!optional && !value.trim())) {
      return { ok: false, message: field + ' must be text with ' + (optional ? 'at most ' : '1–') + max + ' characters.' };
    }
    text[field] = value.trim();
  }
  if (!/^[A-Za-z0-9_-]+$/.test(text.login_id!)) {
    return { ok: false, message: 'Student ID may contain letters, numbers, underscores and hyphens.' };
  }
  if (typeof data.password !== 'string' || data.password.length < 12 || Buffer.byteLength(data.password) > 72) {
    return { ok: false, message: 'Password must be at least 12 characters and at most 72 UTF-8 bytes.' };
  }
  if (typeof data.year_of_study !== 'number' || !Number.isInteger(data.year_of_study) || data.year_of_study < 1 || data.year_of_study > 255) {
    return { ok: false, message: 'Year of study must be a whole number between 1 and 255.' };
  }
  if (text.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  return { ok: true, student: {
    login_id: text.login_id!, password: data.password,
    full_name: text.full_name!, university: text.university!, major: text.major!,
    year_of_study: data.year_of_study,
    email: text.email, phone_number: text.phone_number, address: text.address,
    ...(data.semester_id == null ? {} : { semester_id: data.semester_id as number }),
  } };
}

// Called with validated input by the admin-only API endpoint.
export async function createStudent(
  pool: Pool,
  student: NewStudent
): Promise<number> {
  const passwordHash = await bcrypt.hash(student.password, 12);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Create the login account. The role is always student.
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO users (login_id, password_hash, role)
       VALUES (?, ?, 'student')`,
      [student.login_id, passwordHash]
    );

    const userId = result.insertId;

    // Link the profile to the new account.
    await connection.execute(
      `INSERT INTO student_profiles
       (
         user_id, full_name, university, major,
         year_of_study, email, phone_number, address
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        student.full_name,
        student.university,
        student.major,
        student.year_of_study,
        student.email || null,
        student.phone_number || null,
        student.address || null,
      ]
    );

    if (student.semester_id != null) {
      await connection.execute('INSERT INTO student_semesters (student_user_id,semester_id) VALUES (?,?)', [userId,student.semester_id]);
    }
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
