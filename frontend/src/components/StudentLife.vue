<script setup lang="ts">
import { computed, ref } from 'vue'
import StudentIcon from './StudentIcon.vue'
import StudentTimetable from './StudentTimetable.vue'
defineProps<{ loginId: string; busy: boolean; error: string }>()
defineEmits<{ logout: [] }>()
type Page = 'life' | 'profile' | 'semester' | 'course' | 'schedule' | 'jobs' | 'home' | 'settings'
const page = ref<Page>('life')
const menu = ref(false)
const search = ref('')
type Profile = { full_name: string; university: string; major: string | null; year_of_study: number | null; email: string | null; phone_number: string | null; address: string | null }
const profile = ref<Profile | null>(null)
const profileLoading = ref(false)
const profileError = ref('')
const semesters = ref<{id:number;name:string;academic_year:number;start_date:string;end_date:string}[]>([])
const semesterLoading = ref(false)
const courses = ref<{course_code:string;course_name:string;credits:number;professor:string|null;section:string;offering_id:number}[]>([])
const courseLoading = ref(false)
const editing = ref(false)
const saving = ref(false)
const editForm = ref({ email: '', phone_number: '', address: '' })
const profileRows = computed(() => profile.value ? [
  ['Name', profile.value.full_name], ['University', profile.value.university],
  ['Email', profile.value.email], ['Phone', profile.value.phone_number],
  ['Year', profile.value.year_of_study], ['Address', profile.value.address],
] : [])
async function loadProfile() {
  if (profileLoading.value) return
  profileLoading.value = true; profileError.value = ''; profile.value = null
  try {
    const response = await fetch('/api/student/profile')
    const data = await response.json()
    if (!response.ok) throw new Error(response.status === 401 ? 'Your session expired. Log out and log in again.' : data.message || 'Unable to load your profile.')
    const loaded = data.profile as Profile
    profile.value = loaded
    editForm.value = { email: loaded.email || '', phone_number: loaded.phone_number || '', address: loaded.address || '' }
  } catch (e) {
    profileError.value = e instanceof Error ? e.message : 'Unable to load your profile.'
  } finally { profileLoading.value = false }
}
async function saveProfile() {
  saving.value = true; profileError.value = ''
  try {
    const response = await fetch('/api/student/profile/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1' }, body: JSON.stringify(editForm.value) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Unable to update profile.')
    editing.value = false; await loadProfile()
  } catch (e) { profileError.value = e instanceof Error ? e.message : 'Unable to update profile.' }
  finally { saving.value = false }
}
const sections: { page: Page; title: string; icon: string }[] = [
  { page: 'profile', title: 'Student Profile', icon: 'profile' },
  { page: 'semester', title: 'Semester', icon: 'semester' },
  { page: 'course', title: 'Course', icon: 'course' },
  { page: 'schedule', title: 'Schedule', icon: 'schedule' },
  { page: 'jobs', title: 'Student Job', icon: 'jobs' },
]
const title = computed(() => sections.find(item => item.page === page.value)?.title ?? ({ life: 'Student Life', home: 'Home', settings: 'Settings' } as Record<string, string>)[page.value])
const inLife = computed(() => page.value !== 'home' && page.value !== 'settings')
function displayDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) }
function go(next: Page) { page.value = next; menu.value = false; if (next === 'profile') void loadProfile(); if (next === 'semester') void loadSemesters(); if (next === 'course') void loadCourses() }
async function loadSemesters(){ semesterLoading.value=true; try { const r=await fetch('/api/student/semesters'); const d=await r.json(); if(r.ok) semesters.value=d.semesters } finally { semesterLoading.value=false } }
async function loadCourses(){ courseLoading.value=true; try { const r=await fetch('/api/student/courses'); const d=await r.json(); if(r.ok) courses.value=d.courses } finally { courseLoading.value=false } }
</script>

<template>
  <div class="student-view">
    <div class="student-shell">
      <header class="student-top">
        <button v-if="['life', 'home', 'settings'].includes(page)" class="icon-button" aria-label="Open navigation" :aria-expanded="menu" aria-controls="student-menu" @click="menu = !menu"><StudentIcon name="menu" /></button>
        <button v-else class="icon-button" aria-label="Back to Student Life" @click="go('life')"><StudentIcon name="back" /></button>
        <h1>{{ title }}</h1><span class="top-spacer"></span>
      </header>
      <nav v-if="menu" id="student-menu" class="student-menu" aria-label="Student menu">
        <button v-for="item in sections" :key="item.page" @click="go(item.page)">{{ item.title }}</button>
        <button :disabled="busy" @click="$emit('logout')">{{ busy ? 'Logging out…' : 'Log out' }}</button>
      </nav>
      <main class="student-content">
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <div v-if="page === 'life'" class="student-grid">
          <button v-for="item in sections" :key="item.page" class="student-tile" :class="{ wide: item.page === 'jobs' }" @click="go(item.page)"><StudentIcon :name="item.icon" /><span>{{ item.title }}</span></button>
        </div>
        <template v-else-if="page === 'profile'">
          <p v-if="profileLoading" role="status">Loading your profile…</p>
          <div v-else-if="profileError"><p class="error" role="alert">{{ profileError }}</p><button class="student-primary" @click="loadProfile">Try again</button></div>
          <template v-else-if="profile">
            <section class="profile-summary"><div class="student-avatar"><StudentIcon name="profile" /></div><div><h2>{{ profile.full_name }}</h2><p>Student ID: {{ loginId }}</p><p class="student-muted">Major: {{ profile.major || 'Not provided' }}</p></div></section>
            <section class="student-panel"><div class="panel-heading"><h2>Personal Information</h2><button class="edit-button" @click="editing = !editing">{{ editing ? 'Cancel' : 'Edit' }}</button></div><form v-if="editing" class="edit-form" @submit.prevent="saveProfile"><label>Email<input v-model="editForm.email" type="email" maxlength="254"></label><label>Phone<input v-model="editForm.phone_number" maxlength="30"></label><label>Address<textarea v-model="editForm.address" maxlength="500" rows="2"></textarea></label><button class="student-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save changes' }}</button></form><dl v-else><div v-for="[field, value] in profileRows" :key="String(field)"><dt>{{ field }}</dt><dd>{{ value ?? 'Not provided' }}</dd></div></dl></section>
          </template>
        </template>
        <template v-else-if="page === 'jobs'">
          <div class="student-search"><StudentIcon name="search" /><input v-model="search" aria-label="Search jobs" placeholder="Search jobs…" type="search"></div>
          <section class="student-empty"><StudentIcon name="jobs" /><h2>{{ search.trim() ? 'Job search is coming soon' : 'Jobs will appear here' }}</h2><p>Browse part-time opportunities with location, pay, and working hours. Job listings aren’t available yet.</p></section>
        </template>
        <section v-else-if="page === 'home'" class="student-panel home-panel"><p class="student-muted">WELCOME TO STUDENTHUB</p><h2>Your student life, in one place.</h2><p>Student ID: {{ loginId }}</p><button class="student-primary" @click="go('life')">Open Student Life</button></section>
        <section v-else-if="page === 'settings'" class="student-panel settings-panel"><h2>Account</h2><p>Signed in as {{ loginId }}</p><p class="student-muted">For account or password changes, contact your administrator.</p><button class="student-primary" :disabled="busy" @click="$emit('logout')">{{ busy ? 'Logging out…' : 'Log out' }}</button></section>
        <section v-else-if="page === 'semester'" class="student-panel semester-list"><h2>Your semesters</h2><p v-if="semesterLoading">Loading…</p><p v-else-if="!semesters.length" class="student-muted">You have not been assigned to a semester yet.</p><div v-for="item in semesters" :key="item.id" class="semester-row"><strong>{{item.name}} {{item.academic_year}}</strong><span>{{displayDate(item.start_date)}} – {{displayDate(item.end_date)}}</span></div></section>
        <section v-else-if="page === 'course'" class="student-panel semester-list"><h2>Courses in your semester</h2><p v-if="courseLoading">Loading…</p><p v-else-if="!courses.length" class="student-muted">No courses have been added to your assigned semester yet.</p><div v-for="item in courses" :key="item.offering_id" class="semester-row"><div><strong>{{item.course_code}} · {{item.course_name}}</strong><small>{{item.credits}} credits · Section {{item.section}}</small></div><span>{{item.professor || 'Professor not assigned'}}</span></div></section>
        <StudentTimetable v-else-if="page === 'schedule'" />
      </main>
      <nav class="student-bottom" aria-label="Main navigation">
        <button :class="{ selected: page === 'home' }" :aria-current="page === 'home' ? 'page' : undefined" @click="go('home')"><StudentIcon name="home" /><span>Home</span></button>
        <button :class="{ selected: inLife }" :aria-current="inLife ? 'page' : undefined" @click="go('life')"><StudentIcon name="course" /><span>Student Life</span></button>
        <button :class="{ selected: page === 'settings' }" :aria-current="page === 'settings' ? 'page' : undefined" @click="go('settings')"><StudentIcon name="settings" /><span>Settings</span></button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.student-view{min-height:100dvh;background:#edf2f8;padding:32px 20px;color:#263349;font-family:'Segoe UI',sans-serif}.student-shell{max-width:760px;min-height:calc(100dvh - 64px);margin:auto;background:#fff;border:1px solid #c7d2e1;border-radius:14px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 40px #243c5810}.student-top{max-width:none;width:100%;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;background:#f7f9fc;border-bottom:1px solid #d5dce6}.student-top h1{font-size:18px;font-weight:650;letter-spacing:0;margin:0;color:inherit}.icon-button{background:transparent;color:inherit;padding:6px;border-radius:6px}.icon-button svg{width:22px;height:22px;display:block}.top-spacer{width:34px}.student-content{margin:0;padding:24px;width:100%;flex:1;max-width:none}.student-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.student-tile{background:linear-gradient(135deg,#f7faff,#edf3fb);color:#29374f;border:1px solid #aebed6;border-radius:9px;min-height:155px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;font-size:15px;font-weight:500;transition:background .15s,transform .15s}.student-tile:hover{background:#e4edf9;transform:translateY(-2px)}.student-tile svg{width:34px;height:34px}.student-tile.wide{grid-column:1/-1;min-height:130px}.student-bottom{position:sticky;bottom:0;display:flex;justify-content:space-around;background:#fff;border-top:1px solid #cbd5e3;padding:10px 12px max(10px,env(safe-area-inset-bottom))}.student-bottom button{display:flex;flex-direction:column;align-items:center;gap:5px;color:#485568;background:transparent;border-radius:7px;font-size:12px;padding:8px 20px;font-weight:500}.student-bottom svg{width:23px;height:23px}.student-bottom .selected{color:#275898;background:#f0f5fc}.student-menu{padding:10px 20px;background:#f7f9fc;border-bottom:1px solid #d5dce6;display:grid;gap:4px}.student-menu button{text-align:left;color:#263349;background:transparent;font-size:14px;padding:12px}.student-menu button:hover{background:#e8eff9}.profile-summary{display:flex;align-items:center;gap:18px;border:1px solid #ccd5e1;border-radius:8px;padding:20px;margin-bottom:18px}.student-avatar{width:64px;height:64px;border-radius:50%;border:1px solid #a9b3c1;background:#edf0f4;display:grid;place-items:center;flex-shrink:0}.student-avatar svg{width:39px;height:39px}.student-view h2{font-size:17px;letter-spacing:0;margin:0 0 10px;color:inherit}.profile-summary p{font-size:14px;margin:7px 0}.student-muted,.student-note{color:#66758a}.student-panel{border:1px solid #ccd5e1;border-radius:8px;overflow:hidden}.student-panel>h2{padding:14px 16px;background:#f7f9fc;border-bottom:1px solid #dce2ea;margin:0}.student-panel dl{margin:0;padding:0 16px}.student-panel dl>div{display:flex;justify-content:space-between;gap:20px;padding:16px 0;border-bottom:1px solid #e8edf3;font-size:14px}.student-panel dl>div:last-child{border-bottom:0}.student-panel dd{margin:0;color:#69778c;text-align:right}.student-note{font-size:13px;line-height:1.7;margin-top:18px}.student-search{display:flex;align-items:center;gap:10px;border:1px solid #bdc9dc;border-radius:7px;padding:0 12px;background:#f9fbfe}.student-search svg{width:20px;height:20px;flex-shrink:0}.student-search input{border:0;background:transparent;padding:12px 0;font-size:14px;color:inherit}.student-empty{text-align:center;padding:60px 16px}.student-empty>svg{width:45px;height:45px;color:#7d94b4;margin-bottom:22px}.student-empty p{max-width:350px;margin:0 auto;color:#687990;font-size:14px;line-height:1.8}.student-status{display:inline-block;margin-top:20px;font-size:12px;padding:6px 12px;border-radius:20px;background:#edf3fc;color:#42628e}.home-panel,.settings-panel{padding:24px}.home-panel>h2,.settings-panel>h2{background:none;padding:0;border:0;margin-bottom:18px}.home-panel p,.settings-panel p{line-height:1.8;font-size:14px;margin-bottom:16px}.student-primary{background:#315f9a;color:#fff;margin-top:12px;font-size:14px}.student-view button:focus-visible{outline:3px solid #5085ce;outline-offset:3px}@media(max-width:600px){.student-view{padding:0;background:white}.student-shell{min-height:100dvh;border:0;border-radius:0;box-shadow:none}.student-content{padding:18px 14px}.student-top{padding:14px}.student-grid{gap:12px}.student-tile{min-height:135px;font-size:14px}.student-tile.wide{min-height:115px}.student-bottom button{padding:7px 16px}.profile-summary{padding:16px;gap:14px}}
.student-shell{height:calc(100dvh - 64px);min-height:0}
.student-top,.student-bottom{flex-shrink:0}
.student-content{min-height:0;overflow-y:auto;overscroll-behavior-y:contain;scroll-padding-block:20px}
.student-bottom{position:relative;z-index:2}
.student-menu{flex-shrink:0;max-height:35dvh;overflow-y:auto}
@media(max-width:600px){.student-shell{height:100dvh;min-height:0}}
.panel-heading{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#f7f9fc;border-bottom:1px solid #dce2ea}.panel-heading h2{padding:0!important;border:0!important}.edit-button{background:transparent;color:#315f9a;padding:6px 10px;font-size:13px}.edit-form{padding:16px}.edit-form label{display:block;margin:0 0 14px;font-size:14px;font-weight:600}.edit-form input,.edit-form textarea{display:block;width:100%;margin-top:6px;padding:10px;border:1px solid #bcc9da;border-radius:6px;font:inherit}.edit-form button{font-size:14px}
.student-content>*{min-width:0}.profile-summary>div{min-width:0}.profile-summary,.student-panel dd,.semester-row{overflow-wrap:anywhere}.student-bottom button{min-width:0;min-height:44px}.icon-button{min-width:44px;min-height:44px}.top-spacer{width:44px}.student-content input,.student-content textarea{font-size:16px}@media(max-width:400px){.student-panel dl>div{flex-direction:column;gap:6px}.student-panel dd{text-align:left}.student-bottom button{padding:7px 10px}}
</style>
