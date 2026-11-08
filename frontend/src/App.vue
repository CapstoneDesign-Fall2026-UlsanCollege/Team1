<script setup lang="ts">
import { apiFetch } from './api'
import { computed, nextTick, onMounted, ref } from 'vue'
import ActivityLog from './components/ActivityLog.vue'
import CreateStudent from './components/CreateStudent.vue'
import StudentManager from './components/StudentManager.vue'
import TeacherDirectory from './components/TeacherDirectory.vue'
import SemesterDetails from './components/SemesterDetails.vue'
import CreateSemester from './components/CreateSemester.vue'
import AssignSemester from './components/AssignSemester.vue'
import CourseBoard from './components/CourseBoard.vue'
import ScheduleManager from './components/ScheduleManager.vue'
import StudentIcon from './components/StudentIcon.vue'
import PasswordReset from './components/PasswordReset.vue'
import StudentLife from './components/StudentLife.vue'
import CanteenWorkspace from './components/CanteenWorkspace.vue'
import CanteenAccounts from './components/CanteenAccounts.vue'
import SchoolManager from './components/SchoolManager.vue'
import SchoolRoomBoard from './components/SchoolRoomBoard.vue'
import SchoolDashboard from './components/SchoolDashboard.vue'
type User = { id: number; login_id: string; role: 'admin' | 'student' | 'canteen_head' }
const adminSection = ref('dashboard')
const initialStudentClass=ref(0),initialRoomClass=ref(0)
function enrollClass(id:number){initialStudentClass.value=id;goSection('students','create')}
function openClassRooms(id:number){initialRoomClass.value=id;goSection('rooms')}
const resetPage = ref(false)
const resetCount = ref(0)
const studentPanel = ref('directory')
const schoolMode = ref(false), schoolName = ref(''), visitedSchool = ref(false), dashboardRevision = ref(0), savingSchool = ref(false), schoolPanel = ref('class')
const adminSections = [
  { id: 'dashboard', title: 'Overview', icon: 'home' },
  { id: 'school', title: 'School classes', icon: 'course' },
  { id: 'rooms', title: 'Rooms', icon: 'home' },
  { id: 'students', title: 'Accounts', icon: 'profile' },
  { id: 'activity', title: 'Activity Log', icon: 'schedule' },
  { id: 'requests', title: 'Requests', icon: 'settings' },
]
const legacySections = [
  { id: 'semesters', title: 'Semesters', icon: 'semester' },
  { id: 'courses', title: 'Course planning', icon: 'course' },
  { id: 'timetable', title: 'Timetable', icon: 'schedule' },
]
const sectionTitle = computed(() => adminSection.value === 'dashboard' ? 'School overview' : [...adminSections, ...legacySections].find(s => s.id === adminSection.value)?.title ?? 'School workspace')
function goSection(section: string, panel?: string) {
  adminSection.value = section
  if (section === 'school') { visitedSchool.value = true; if (panel) schoolPanel.value = panel }
  if (section === 'students' && panel) studentPanel.value = panel
}
const user = ref<User | null>(null)
const loginId = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)
const loading = ref(true)
const creatingStudent = ref(false)
const editingStudent = ref(false)
const savingStaff = ref(false)
const studentRevision = ref(0)
const semesterRevision = ref(0)
const linkedStudent = ref(''), linkedSemester = ref(0), linkedMajor = ref<string|null>(null)
async function openSemesterStudent(login:string){linkedStudent.value='';await nextTick();linkedStudent.value=login;studentPanel.value='directory';adminSection.value='students'}
async function openSemesterTimetable(id:number,major:string|null){linkedMajor.value=major;await openSemesterArea(id,'timetable')}
async function openSemesterArea(id:number,area:string){linkedSemester.value=0;await nextTick();linkedSemester.value=id;adminSection.value=area}
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
  if(!['admin','student','canteen_head'].includes(account.role)) throw new Error('This account role is not supported.')
  await api('/' + (account.role==='canteen_head'?'canteen':account.role) + '/home')
  adminSection.value = 'dashboard'
  visitedSchool.value = false; schoolMode.value = false; schoolName.value = ''
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
  <CanteenWorkspace v-else-if="user?.role === 'canteen_head'" :login-id="user.login_id" :busy="busy" :error="error" @logout="logout" />
  <template v-else>
  <header><a class="brand" href="/">S<span>StudentHub</span></a><span class="tag">Your school, connected.</span></header>
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
      <PasswordReset v-if="resetPage" @back="resetPage = false" />
      <form v-else class="card" @submit.prevent="login">
        <p class="eyebrow">WELCOME BACK</p><h2>Log in to StudentHub</h2>
        <p class="muted">Use the account provided by your administrator.</p>
        <label for="login">Login ID</label>
        <input id="login" v-model="loginId" autocomplete="username" maxlength="50" required placeholder="Enter your login ID" :disabled="busy">
        <label for="password">Password</label>
        <input id="password" v-model="password" autocomplete="current-password" type="password" required placeholder="Enter your password" :disabled="busy">
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <button :disabled="busy">{{ busy ? 'Logging in…' : 'Log in →' }}</button>
        <p class="help"><button type="button" class="help-link" :disabled="busy" @click="resetPage = true; error = ''">Forgot password?</button><br>Need an account? Contact your administrator.</p>
      </form>
    </section>
    <section v-else class="dashboard admin-workspace">
      <div class="workspace-heading"><div><p class="eyebrow">ADMINISTRATION<span v-if="schoolName" class="school-label"> / {{ schoolName }}</span></p><h1>{{ sectionTitle }}</h1><p class="workspace-subtitle">{{ adminSection === 'dashboard' ? 'Less searching. More time for your school.' : 'Keep school information organised and easy to find.' }}</p></div><div class="workspace-account"><span class="admin-avatar" aria-hidden="true">AD</span><div><strong>{{ user.login_id }}</strong><span>Administrator</span></div><button type="button" class="logout-button" :disabled="busy || creatingStudent || editingStudent || savingStaff || savingSchool" @click="logout"><StudentIcon name="logout" />Log out</button></div></div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <template v-if="user.role === 'admin'">
        <nav class="admin-nav" aria-label="Admin navigation"><button v-for="section in adminSections" :key="section.id" type="button" :disabled="savingSchool" :class="{ selected: adminSection === section.id }" :aria-current="adminSection === section.id ? 'page' : undefined" @click="goSection(section.id)"><StudentIcon :name="section.icon" />{{ section.title }}<span v-if="section.id === 'requests' && resetCount" class="badge">{{ resetCount }}</span></button></nav>
        <SchoolDashboard v-show="adminSection === 'dashboard'" :revision="dashboardRevision" @open="goSection" @mode="schoolMode = $event" @school="schoolName = $event" />
        <ActivityLog v-if="adminSection === 'activity'" />
        <SchoolRoomBoard :initial-class="initialRoomClass" v-if="adminSection === 'rooms'" @saving="savingSchool = $event" />
        <SchoolManager :active="adminSection === 'school'" :selected-tab="schoolPanel" @create="enrollClass" @rooms="openClassRooms" v-if="visitedSchool" v-show="adminSection === 'school'" @changed="schoolMode = $event; dashboardRevision++" @saving="savingSchool = $event" />
        <p v-if="schoolMode && adminSection === 'students'" class="account-tip"><StudentIcon name="course" />School class assignments are managed in <button type="button" @click="goSection('school')">School classes</button>.</p>
        <div v-show="adminSection === 'students'" class="student-tabs" role="group" aria-label="Account actions"><button type="button" :class="{ secondary: studentPanel !== 'directory' }" :aria-pressed="studentPanel === 'directory'" @click="studentPanel = 'directory'"><StudentIcon name="profile" />Student list</button><button type="button" :class="{ secondary: studentPanel !== 'create' }" :aria-pressed="studentPanel === 'create'" @click="studentPanel = 'create'"><StudentIcon name="add" />Create student</button><button type="button" :class="{secondary:studentPanel!=='canteen'}" :aria-pressed="studentPanel==='canteen'" @click="studentPanel='canteen'">Canteen staff</button><button type="button" :class="{secondary:studentPanel!=='teachers'}" :aria-pressed="studentPanel==='teachers'" @click="studentPanel='teachers'">Teacher list</button></div>
        <div v-if="adminSection==='students' && studentPanel==='teachers'" class="admin-section"><TeacherDirectory /></div>
        <div v-show="adminSection==='students' && studentPanel==='canteen'" class="admin-section"><CanteenAccounts @saving="savingStaff=$event" /></div>
        <div v-show="adminSection === 'students' && studentPanel === 'create'" id="create-student" class="admin-section" tabindex="-1"><CreateStudent :initial-class="initialStudentClass" :revision="semesterRevision" @expired="sessionExpired" @saving="creatingStudent = $event" @created="studentRevision++" /></div>
        <div v-show="adminSection === 'students' && studentPanel === 'directory'" id="student-directory" class="admin-section" tabindex="-1"><StudentManager :selected-login="linkedStudent" :revision="studentRevision + dashboardRevision" @saving="editingStudent = $event" /></div>
        <div v-if="!schoolMode" v-show="adminSection === 'semesters'" id="manage-semesters" class="admin-section" tabindex="-1"><SemesterDetails :revision="semesterRevision + studentRevision + courseRevision" @student="openSemesterStudent" @courses="openSemesterArea($event, 'courses')" @timetable="openSemesterTimetable" @changed="semesterRevision++; studentRevision++" /><CreateSemester @created="semesterRevision++; studentRevision++" /></div>
        <div v-if="!schoolMode" v-show="adminSection === 'semesters'" id="assign-students" class="admin-section" tabindex="-1"><AssignSemester :revision="semesterRevision + studentRevision" @assigned="studentRevision++" /></div>
        <div v-show="adminSection === 'requests'"><PasswordReset admin @count="resetCount = $event" /></div>
        <div v-if="!schoolMode" v-show="adminSection === 'courses'" id="plan-courses" class="admin-section" tabindex="-1"><CourseBoard :selected-semester="linkedSemester" :revision="semesterRevision" @changed="courseRevision++" /></div>
        <div v-if="!schoolMode" v-show="adminSection === 'timetable'" id="class-timetable" class="admin-section" tabindex="-1"><ScheduleManager :selected-major="linkedMajor" :selected-semester="linkedSemester" :revision="semesterRevision + courseRevision" /></div>
        <details v-if="!schoolMode" class="legacy-tools"><summary>Previous academic planning tools</summary><p>Use these for existing semester-and-major records before enabling school planning.</p><div><button v-for="section in legacySections" :key="section.id" type="button" :aria-current="adminSection === section.id ? 'page' : undefined" @click="goSection(section.id)"><StudentIcon :name="section.icon" />{{ section.title }}</button></div></details>
      </template>
    </section>
  </main>
  <footer>StudentHub · Student Life Platform</footer>
  </template>
</template>

<style scoped>
.help-link{width:auto;margin:0;padding:0;background:transparent;color:#126653;text-decoration:underline;font-size:14px;min-height:44px}.admin-workspace{min-width:0;padding-top:12px}.workspace-heading{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:12px 0 26px}.workspace-heading .eyebrow{font-size:10px;letter-spacing:1.5px;margin:0 0 10px}.school-label{font-weight:500;color:#7e8f83;letter-spacing:.3px}.workspace-heading h1{font-size:34px;letter-spacing:-1.2px;margin:0 0 9px;line-height:1.2}.workspace-subtitle{font-size:13px;color:#829084;margin:0;line-height:1.6}.workspace-account{display:flex;align-items:center;gap:11px;flex-shrink:0}.admin-avatar{display:grid;place-items:center;width:38px;height:38px;background:#e4eee5;color:#477151;border-radius:50%;font-size:11px;font-weight:700}.workspace-account strong,.workspace-account span:not(.admin-avatar){display:block}.workspace-account strong{font-size:12px;font-weight:600}.workspace-account div>span{color:#8b978e;font-size:10px;margin-top:4px}.logout-button{display:flex;align-items:center;background:none;color:#7b8b7d;border:1px solid #dfe7dd;padding:9px 12px;font-size:11px;margin-left:8px}.logout-button svg{width:16px;height:16px}.admin-nav{display:flex;gap:5px;padding:0 0 14px;margin:0 0 28px;border-bottom:1px solid #dfe7df;flex-wrap:wrap}.admin-nav button{display:flex;align-items:center;justify-content:center;gap:8px;background:none;color:#788b7b;border:1px solid transparent;padding:11px 19px;font-size:13px;border-radius:9px;white-space:nowrap}.admin-nav button>svg{width:18px;height:18px;margin:0}.admin-nav button.selected{background:#e4eee4;color:#2e6041;border-color:#d9e5d9}.admin-nav button:hover{background:#edf3e9;color:#31593b}.admin-nav button:focus-visible,.legacy-tools button:focus-visible{outline:3px solid #729e85;outline-offset:3px}.student-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.student-tabs button{display:flex;align-items:center;font-size:13px;padding:12px 16px}.admin-section{min-width:0;scroll-margin-top:20px}.account-tip{display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:13px;line-height:1.7;color:#67806b;padding:12px 16px;border:1px solid #dce8dc;border-radius:10px;background:#edf4eb}.account-tip svg{width:17px;height:17px}.account-tip button{padding:0;background:none;color:#386b49;font-size:inherit;text-decoration:underline}.legacy-tools{margin:32px 0 12px;padding:17px 0;border-top:1px solid #e1e8df;font-size:12px;color:#8b998c}.legacy-tools summary{cursor:pointer;font-weight:500}.legacy-tools p{line-height:1.7}.legacy-tools>div{display:flex;flex-wrap:wrap;gap:8px}.legacy-tools button{display:flex;align-items:center;background:white;border:1px solid #dfe7dd;color:#718473;font-size:12px;padding:9px 13px}@media(max-width:700px){.workspace-heading{align-items:flex-start;gap:20px;flex-direction:column;padding-top:0}.workspace-heading h1{font-size:29px}.workspace-account{width:100%}.logout-button{margin-left:auto;min-height:40px}.admin-nav{gap:4px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:24px}.admin-nav button{flex-direction:column;font-size:11px;gap:6px;padding:10px 3px;min-width:0;white-space:normal}.admin-nav button>svg{width:19px;height:19px}.student-tabs button{flex:1 1 140px;font-size:12px;justify-content:center}.workspace-subtitle{font-size:12px}.school-label{display:block;margin-top:6px}.legacy-tools{margin-top:20px}}
</style>
