<script setup lang="ts">
import { apiFetch } from './api'
import { onMounted, ref } from 'vue'
import CreateStudent from './components/CreateStudent.vue'
import StudentManager from './components/StudentManager.vue'
import CreateSemester from './components/CreateSemester.vue'
import AssignSemester from './components/AssignSemester.vue'
import CourseBoard from './components/CourseBoard.vue'
import ScheduleManager from './components/ScheduleManager.vue'
import StudentIcon from './components/StudentIcon.vue'
import StudentLife from './components/StudentLife.vue'
type User = { id: number; login_id: string; role: 'admin' | 'student' }
const adminSection = ref('dashboard')
const studentPanel = ref('directory')
const adminSections = [
  { id: 'dashboard', title: 'Dashboard', icon: 'home', detail: 'Choose an area to get started.' },
  { id: 'students', title: 'Students', icon: 'profile', detail: 'Create accounts and update student information.' },
  { id: 'semesters', title: 'Semesters', icon: 'semester', detail: 'Create semesters and assign students.' },
  { id: 'courses', title: 'Courses', icon: 'course', detail: 'Assign courses and professors by major.' },
  { id: 'timetable', title: 'Timetable', icon: 'schedule', detail: 'Plan weekly class meetings.' },
]
const user = ref<User | null>(null)
const loginId = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)
const loading = ref(true)
const creatingStudent = ref(false)
const editingStudent = ref(false)
const studentRevision = ref(0)
const semesterRevision = ref(0)
const courseRevision = ref(0)
function sessionExpired() {
  user.value = null
  error.value = 'Your session has expired. Please log in again.'
}

async function api(path: string, body?: object) {
  const response = await apiFetch('/api' + path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json', 'X-StudentHub': '1' } : {},
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await response.json().catch(() => ({ message: 'Backend unavailable. Make sure the API is running.' }))
  if (!response.ok) throw Object.assign(new Error(data.message || 'Request failed.'), { status: response.status })
  return data
}
async function openHome(account: User) {
  await api('/' + account.role + '/home')
  adminSection.value = 'dashboard'
  user.value = account
}
async function login() {
  busy.value = true; error.value = ''
  try {
    const data = await api('/auth/login', { login_id: loginId.value, password: password.value })
    await openHome(data.user)
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to log in.' }
  finally { password.value = ''; busy.value = false }
}
async function logout() {
  busy.value = true; error.value = ''
  try { await api('/auth/logout', {}); user.value = null }
  catch (e) { error.value = e instanceof Error ? e.message : 'Unable to log out.' }
  finally { busy.value = false }
}
onMounted(async () => {
  try { const data = await api('/auth/me'); await openHome(data.user) }
  catch (e) {
    if ((e as { status?: number }).status !== 401)
      error.value = 'Cannot reach the backend. Start it and try logging in.'
  } finally { loading.value = false }
})
</script>

<template>
  <StudentLife v-if="user?.role === 'student'" :login-id="user.login_id" :busy="busy" :error="error" @logout="logout" />
  <template v-else>
  <header><a class="brand" href="/">S<span>StudentHub</span></a><span class="tag">Your campus, connected.</span></header>
  <main>
    <p v-if="loading" role="status">Checking your session…</p>
    <section v-else-if="!user" class="login-layout">
      <div class="intro">
        <p class="eyebrow">STUDENT LIFE, SIMPLIFIED</p>
        <h1>A little more organized.<br>A lot more possible.</h1>
        <p class="description">Your courses, timetable, and student life in one place.</p>
        <div class="feature"><span>01</span><div><h3>Know your week</h3><p>Keep your classes and academic schedule together.</p></div></div>
        <div class="feature"><span>02</span><div><h3>Make room for opportunity</h3><p>Build toward finding work that fits your study time.</p></div></div>
      </div>
      <form class="card" @submit.prevent="login">
        <p class="eyebrow">WELCOME BACK</p><h2>Log in to StudentHub</h2>
        <p class="muted">Use the account provided by your administrator.</p>
        <label for="login">Student ID or admin username</label>
        <input id="login" v-model="loginId" autocomplete="username" maxlength="50" required placeholder="Enter your login ID" :disabled="busy">
        <label for="password">Password</label>
        <input id="password" v-model="password" autocomplete="current-password" type="password" required placeholder="Enter your password" :disabled="busy">
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <button :disabled="busy">{{ busy ? 'Logging in…' : 'Log in →' }}</button>
        <p class="help">Need an account or a password reset? Contact your administrator.</p>
      </form>
    </section>
    <section v-else class="dashboard">
      <div class="dashboard-heading"><div><p class="eyebrow">{{ user.role }} WORKSPACE</p><h1>Welcome, {{ user.login_id }}.</h1></div><button class="secondary" :disabled="busy || creatingStudent || editingStudent" @click="logout"><StudentIcon name="logout" />Log out</button></div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p class="description">Manage student accounts, semesters, course assignments, and class timetables.</p>
      <template v-if="user.role === 'admin'">
        <nav class="admin-nav" aria-label="Admin navigation">
          <button v-for="section in adminSections" :key="section.id" type="button" :class="{ selected: adminSection === section.id }" :aria-current="adminSection === section.id ? 'page' : undefined" @click="adminSection = section.id"><StudentIcon :name="section.icon" />{{ section.title }}</button>
        </nav>
        <section v-show="adminSection === 'dashboard'" class="admin-overview">
          <h2>What would you like to manage?</h2>
          <p class="muted">Choose a section. Your unfinished forms stay in place when you switch sections.</p>
          <div class="admin-shortcuts"><button v-for="section in adminSections.slice(1)" :key="section.id" type="button" @click="adminSection = section.id"><StudentIcon :name="section.icon" /><strong>{{ section.title }}</strong><span>{{ section.detail }}</span></button></div>
        </section>
        <div v-show="adminSection === 'students'" class="student-tabs" role="group" aria-label="Student actions"><button type="button" :class="{ secondary: studentPanel !== 'directory' }" :aria-pressed="studentPanel === 'directory'" @click="studentPanel = 'directory'"><StudentIcon name="profile" />Student list</button><button type="button" :class="{ secondary: studentPanel !== 'create' }" :aria-pressed="studentPanel === 'create'" @click="studentPanel = 'create'"><StudentIcon name="add" />Create student</button></div>
        <div v-show="adminSection === 'students' && studentPanel === 'create'" id="create-student" class="admin-section" tabindex="-1"><CreateStudent :revision="semesterRevision" @expired="sessionExpired" @saving="creatingStudent = $event" @created="studentRevision++" /></div>
        <div v-show="adminSection === 'students' && studentPanel === 'directory'" id="student-directory" class="admin-section" tabindex="-1"><StudentManager :revision="studentRevision" @saving="editingStudent = $event" /></div>
        <div v-show="adminSection === 'semesters'" id="manage-semesters" class="admin-section" tabindex="-1"><CreateSemester @created="semesterRevision++; studentRevision++" /></div>
        <div v-show="adminSection === 'semesters'" id="assign-students" class="admin-section" tabindex="-1"><AssignSemester :revision="semesterRevision + studentRevision" @assigned="studentRevision++" /></div>
        <div v-show="adminSection === 'courses'" id="plan-courses" class="admin-section" tabindex="-1"><CourseBoard :revision="semesterRevision" @changed="courseRevision++" /></div>
        <div v-show="adminSection === 'timetable'" id="class-timetable" class="admin-section" tabindex="-1"><ScheduleManager :revision="semesterRevision + courseRevision" /></div>
      </template>
    </section>
  </main>
  <footer>StudentHub · Student Life Platform</footer>
  </template>
</template>

<style scoped>
.dashboard-links{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 28px}.dashboard-links a{padding:11px 16px;border:1px solid #c5d7ce;border-radius:8px;background:#f4f8f6;color:#2d5748;text-decoration:none;font-size:14px;font-weight:600}.dashboard-links a:hover{background:#e6f0eb}.dashboard-links a:focus-visible{outline:3px solid #518cbe;outline-offset:3px}.admin-section{scroll-margin-top:20px}
</style>


<style scoped>
.student-tabs{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.admin-nav{display:flex;gap:8px;position:sticky;top:0;z-index:5;padding:12px 0;background:#f4f7f5;border-bottom:1px solid #dce5df;flex-wrap:wrap}.admin-nav button{display:flex;align-items:center;gap:8px;background:white;color:#36594d;border:1px solid #c5d7ce;padding:12px 16px}.admin-nav button.selected{background:#126653;color:white;border-color:#126653}.admin-nav svg,.dashboard-heading button svg{width:20px;height:20px;flex-shrink:0}.dashboard-heading button{display:flex;align-items:center;gap:8px}.admin-nav button:focus-visible,.admin-shortcuts button:focus-visible{outline:3px solid #518cbe;outline-offset:3px}.admin-overview{padding:24px 0}.admin-shortcuts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.admin-shortcuts button{text-align:left;background:white;color:#172f2e;border:1px solid #c5d7ce;padding:24px;display:grid;grid-template-columns:28px 1fr;gap:12px}.admin-shortcuts svg{width:26px;height:26px;color:#126653}.admin-shortcuts span{grid-column:2;font-size:14px;font-weight:400;line-height:1.6;color:#60736e}@media(max-width:600px){.admin-nav{gap:6px}.admin-nav button{flex:1 1 28%;justify-content:center;padding:10px 8px;font-size:13px}.admin-shortcuts{grid-template-columns:1fr}}
</style>
