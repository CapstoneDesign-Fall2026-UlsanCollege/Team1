export type Semester = { id: number; name: string; academic_year: number }
export type Meeting = { id: number; course_offering_id: number; semester_id: number; major: string | null; course_code: string; course_name: string; professor: string | null; section: string; day_of_week: number; start_time: string; end_time: string; location: string }
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export async function scheduleApi(path: string, method = 'GET', body?: object) {
  const response = await fetch('/api/' + path, { method, headers: method === 'GET' ? {} : { 'Content-Type': 'application/json', 'X-StudentHub': '1' }, ...(body ? { body: JSON.stringify(body) } : {}) })
  const data = await response.json().catch(() => ({ message: 'Backend unavailable. Please try again.' }))
  if (!response.ok) throw new Error(response.status === 401 ? 'Your session expired. Please log out and log in again.' : data.message || 'Request failed.')
  return data
}
