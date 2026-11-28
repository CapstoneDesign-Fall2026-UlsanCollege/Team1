<script setup lang="ts">
import { apiFetch } from '../api'
import { computed, ref, nextTick, watch } from 'vue'
import StudentIcon from './StudentIcon.vue'
import StudentIdCard from './StudentIdCard.vue'
import JobFinder from './JobFinder.vue'
import SchoolCanteen from './DailyMenu.vue'
import StudentTimetable from './StudentTimetable.vue'
import StudentSubjects from './StudentSubjects.vue'
import StudentSchool from './StudentSchool.vue'
import StudentHomework from './StudentHomework.vue'
import NoticeBoard from './NoticeBoard.vue'
import StudentHome from './StudentHome.vue'
defineProps<{ loginId: string; busy: boolean; error: string }>()
defineEmits<{ logout: [] }>()
type Page = 'notices' | 'homework' | 'life' | 'profile' | 'semester' | 'course' | 'schedule' | 'jobs' | 'home' | 'settings' | 'eat' | 'school'
const page = ref<Page>('home')
type ClassTab='overview'|'timetable'|'subjects'
const classTab=ref<ClassTab>('overview'),studentContent=ref<HTMLElement>()
function openClassTab(tab:ClassTab){classTab.value=tab;void nextTick(()=>studentContent.value?.scrollTo({top:0}))}
const schoolInfo=ref<{name:string;level:string}|null>(null)
const schoolMode=computed(()=>Boolean(schoolInfo.value))
const menu = ref(false)
const navigationDialog=ref<HTMLDialogElement>()
watch(menu,async open=>{await nextTick();if(open&&!navigationDialog.value?.open)navigationDialog.value?.showModal();else if(!open&&navigationDialog.value?.open)navigationDialog.value.close()})
function dismissBackdrop(event:MouseEvent){const box=navigationDialog.value?.getBoundingClientRect();if(box&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))menu.value=false}
type Profile = { full_name: string; university: string; major: string | null; year_of_study: number | null; email: string | null; phone_number: string | null; address: string | null }
const profile = ref<Profile | null>(null)
const profileLoading = ref(false)
const profileError = ref('')
const semesters = ref<{id:number;name:string;academic_year:number;start_date:string;end_date:string}[]>([])
const semesterLoading = ref(false), semesterError = ref('')
const editing = ref(false)
const saving = ref(false)
const editForm = ref({ email: '', phone_number: '', address: '' })
const profileRows = computed(() => profile.value ? [
  ['Email', profile.value.email], ['Phone', profile.value.phone_number],
  ['Address', profile.value.address],
] : [])
async function loadProfile() {
  if (profileLoading.value) return
  profileLoading.value = true; profileError.value = ''; profile.value = null
  try {
    const response = await apiFetch('/api/student/profile')
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
    const response = await apiFetch('/api/student/profile/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1' }, body: JSON.stringify(editForm.value) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Unable to update profile.')
    editing.value = false; await loadProfile()
  } catch (e) { profileError.value = e instanceof Error ? e.message : 'Unable to update profile.' }
  finally { saving.value = false }
}
const sections = computed<{page:Page;title:string;icon:string}[]>(()=>[
  { page: 'notices', title: 'Notice board', icon: 'course' },
  { page: 'homework', title: 'Homework', icon: 'course' },
  { page: 'school', title: 'My Class', icon: 'semester' },
  { page: 'profile', title: 'Student Profile', icon: 'profile' },
  { page: 'semester', title: schoolMode.value?'School terms':'Semester', icon: 'semester' },
  { page: 'course', title: schoolMode.value?'Subjects':'Courses', icon: 'course' },
  { page: 'schedule', title: 'Timetable', icon: 'schedule' },
  { page: 'jobs', title: 'Job search', icon: 'jobs' },
  { page: 'eat', title: 'School Canteen', icon: 'canteen' },
].filter(item=>!(schoolMode.value&&['semester','schedule','course'].includes(item.page))&&!(schoolInfo.value?.level==='middle'&&item.page==='jobs')) as {page:Page;title:string;icon:string}[])
const title = computed(() => sections.value.find(item => item.page === page.value)?.title ?? ({ life: 'Student Life', home: 'Home', settings: 'Settings' } as Record<string, string>)[page.value])
function displayDate(value: string) { return new Date(value).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) }
function go(next:Page){menu.value=false;if(schoolMode.value&&['school','schedule','course'].includes(next)){page.value='school';openClassTab(next==='schedule'?'timetable':next==='course'?'subjects':'overview')}else{page.value=next;if(next==='profile')void loadProfile();if(next==='semester')void loadSemesters();void nextTick(()=>studentContent.value?.scrollTo({top:0}))}}

async function loadSemesters(){ semesterLoading.value=true; semesterError.value=''; semesters.value=[]; try { const r=await apiFetch('/api/student/semesters'); const d=await r.json(); if(!r.ok) throw new Error(d.message || 'Unable to load terms.'); semesters.value=d.semesters } catch(e) { semesterError.value=e instanceof Error?e.message:'Unable to load terms.' } finally { semesterLoading.value=false } }

</script>

<template>
  <div class="student-view" data-workspace="student">
    <div class="student-shell">
      <header class="student-top">
        <button v-if="['life', 'home', 'settings'].includes(page)" class="icon-button" type="button" aria-label="Open navigation" :aria-expanded="menu" aria-controls="student-menu" aria-haspopup="dialog" @click="menu = !menu"><StudentIcon name="menu" /></button>
        <button v-else class="icon-button" type="button" aria-label="Back to home" @click="go('home')"><StudentIcon name="back" /></button>
        <h1>{{ title }}</h1><span class="top-spacer"></span>
      </header>
      <dialog ref="navigationDialog" id="student-menu" class="student-navigation" aria-labelledby="student-navigation-title" @cancel.prevent="menu=false" @close="menu=false" @click="dismissBackdrop"><div class="navigation-heading"><div><h2 id="student-navigation-title">Your workspace</h2><p>{{schoolInfo?.name||loginId}}</p></div><button type="button" class="navigation-close" aria-label="Close navigation" @click="menu=false"><StudentIcon name="cancel" /></button></div><nav aria-label="Student menu" class="navigation-links"><button type="button" class="navigation-item" :class="{'is-current':page==='home'||page==='life'}" :aria-current="page==='home'||page==='life'?'page':undefined" @click="go('home')"><StudentIcon name="home"/><span>Home</span></button><button v-for="item in sections" :key="item.page" type="button" class="navigation-item" :class="{'is-current':page===item.page}" :aria-current="page===item.page?'page':undefined" @click="go(item.page)"><StudentIcon :name="item.icon"/><span>{{item.title}}</span></button></nav><div class="navigation-account"><button type="button" class="navigation-item" :class="{'is-current':page==='settings'}" @click="go('settings')"><StudentIcon name="settings"/><span>Account settings</span></button><button type="button" class="navigation-item" :disabled="busy" @click="$emit('logout')"><StudentIcon name="logout"/><span>{{busy?'Logging out…':'Log out'}}</span></button></div></dialog>
      <main ref="studentContent" class="student-content">
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <StudentHome v-if="page==='home'||page==='life'" :items="sections" @open="go" @context="schoolInfo=$event" />
        <template v-else-if="page === 'profile'">
          <p v-if="profileLoading" role="status">Loading your profile…</p>
          <div v-else-if="profileError"><p class="error" role="alert">{{ profileError }}</p><button class="student-primary" @click="loadProfile">Try again</button></div>
          <template v-else-if="profile">
            <StudentIdCard :full-name="profile.full_name" :school="profile.university" :login-id="loginId" :major="!schoolMode?profile.major:null" /><section class="student-panel contact-panel"><div class="panel-heading"><h2>Contact details</h2><button class="edit-button" @click="editing = !editing">{{ editing ? 'Cancel' : 'Edit contact details' }}</button></div><form v-if="editing" class="edit-form" @submit.prevent="saveProfile"><label>Email<input v-model="editForm.email" type="email" maxlength="254"></label><label>Phone<input v-model="editForm.phone_number" maxlength="30"></label><label>Address<textarea v-model="editForm.address" maxlength="500" rows="2"></textarea></label><button class="student-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save changes' }}</button></form><dl v-else><div v-for="[field, value] in profileRows" :key="String(field)"><dt>{{ field }}</dt><dd>{{ value || 'Not provided' }}</dd></div></dl></section>
          </template>
        </template>
        <JobFinder v-else-if="page === 'jobs'" :login-id="loginId" />
        <div v-else-if="page==='eat'" class="student-canteen"><SchoolCanteen/></div>
        <NoticeBoard v-else-if="page==='notices'" reader="student" /><StudentHomework v-else-if="page==='homework'" />
        <section v-else-if="page==='school'" class="my-class-workspace"><nav class="class-subtabs" aria-label="My Class sections"><button v-for="([id,label]) in [['overview','Class overview'],['timetable','Timetable'],['subjects','Subjects']]" :key="id" type="button" :aria-current="classTab===id?'page':undefined" @click="openClassTab(id as ClassTab)">{{label}}</button></nav><StudentSchool v-if="classTab==='overview'" :navigation="false" @open="go" @context="schoolInfo=$event" /><StudentTimetable v-else-if="classTab==='timetable'" :login-id="loginId" /><StudentSubjects v-else /></section>

        <section v-else-if="page === 'settings'" class="student-panel settings-panel"><h2>Account</h2><p>Signed in as {{ loginId }}</p><p class="student-muted">For account or password changes, contact your administrator.</p><button class="student-primary" :disabled="busy" @click="$emit('logout')">{{ busy ? 'Logging out…' : 'Log out' }}</button></section>
        <section v-else-if="page === 'semester'" class="student-panel semester-list"><h2>Your semesters</h2><p v-if="semesterLoading">Loading…</p><p v-else-if="semesterError" class="error" role="alert">{{ semesterError }} <button type="button" @click="loadSemesters">Retry</button></p><p v-else-if="!semesters.length" class="student-muted">You have not been assigned to a semester yet.</p><div v-for="item in semesters" :key="item.id" class="semester-row"><strong>{{item.name}} {{item.academic_year}}</strong><span>{{displayDate(item.start_date)}}  to  {{displayDate(item.end_date)}}</span></div></section>
        <StudentSubjects v-else-if="page==='course'" />
        <StudentTimetable v-else-if="page === 'schedule'" :login-id="loginId" />
      </main>
      <nav class="student-bottom" aria-label="Main navigation"><button :class="{selected:page==='home'}" :aria-current="page==='home'?'page':undefined" @click="go('home')"><StudentIcon name="home"/><span>Home</span></button><button :class="{selected:schoolMode?page==='school':page==='schedule'}" :aria-current="(schoolMode?page==='school':page==='schedule')?'page':undefined" @click="go(schoolMode?'school':'schedule')"><StudentIcon :name="schoolMode?'semester':'schedule'"/><span>{{schoolMode?'My Class':'Timetable'}}</span></button><button :class="{selected:page==='eat'}" :aria-current="page==='eat'?'page':undefined" @click="go('eat')"><StudentIcon name="canteen"/><span>Canteen</span></button><button :class="{selected:page==='profile'}" :aria-current="page==='profile'?'page':undefined" @click="go('profile')"><StudentIcon name="profile"/><span>Profile</span></button></nav>
    </div>
  </div>
</template>

<style scoped>
/* Hallmark · shape: app screen · genre: modern-minimal · theme: brand · redesign: full · nav: shared role navigation · states: loading empty error full · v2.0.0 */
/* Hallmark · pre-emit critique: one shell recipe; nested content retains its own table and calendar geometry. */

.student-view{min-height:100dvh;padding:24px 20px;background:var(--ui-canvas);color:var(--ui-ink);font-family:var(--ui-font)}
.student-shell{display:flex;flex-direction:column;width:100%;max-width:900px;height:calc(100dvh - 48px);min-height:0;margin:auto;border:1px solid var(--ui-rule);border-radius:var(--ui-panel-radius);background:var(--ui-surface);overflow:clip}
.student-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;width:100%;max-width:none;margin:0;padding:12px 20px;background:var(--ui-soft);border-bottom:1px solid var(--ui-rule)}
.student-top h1{text-wrap:balance;min-width:0;font-size:18px;line-height:1.4;font-weight:650;margin:0;letter-spacing:0;overflow-wrap:break-word}.icon-button{display:grid;place-items:center;min-width:44px;min-height:44px;padding:8px;background:transparent;color:inherit;border-radius:var(--ui-radius)}.icon-button svg{width:22px;height:22px}.top-spacer{width:44px;flex-shrink:0}
.student-content{flex:1;min-height:0;min-width:0;width:100%;max-width:none;margin:0;padding:24px;overflow-y:auto;overscroll-behavior-y:contain;scroll-padding-block:20px}.student-content>*{min-width:0}.student-content input,.student-content textarea{font-size:16px}.student-view h2{font-size:20px;line-height:1.4;letter-spacing:0;margin:0 0 12px;color:inherit;min-width:0;overflow-wrap:break-word}.student-muted{font-size:13px;line-height:1.6;color:var(--ui-muted)}
.student-bottom{position:relative;display:flex;justify-content:space-around;flex-shrink:0;z-index:2;border-top:1px solid var(--ui-rule);padding:8px 12px max(8px,env(safe-area-inset-bottom));background:var(--ui-surface)}.student-bottom button{display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:0;min-height:52px;width:auto;margin:0;padding:8px 12px;background:transparent;color:var(--ui-muted);border-radius:var(--ui-radius);font-size:12px;font-weight:500}.student-bottom svg{width:22px;height:22px}.student-bottom .selected{background:var(--ui-soft);color:var(--ui-accent)}
.student-panel{min-width:0;border:1px solid var(--ui-rule);border-radius:var(--ui-radius)}.student-panel dl{margin:0;padding:0 16px}.student-panel dl>div{display:flex;justify-content:space-between;gap:20px;padding:12px 0;border-bottom:1px solid var(--ui-rule);font-size:14px}.student-panel dl>div:last-child{border:0}.student-panel dd{margin:0;text-align:right;color:var(--ui-muted);overflow-wrap:anywhere}.panel-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--ui-rule)}.panel-heading h2{margin:0;padding:0}.edit-button{min-height:44px;width:auto;margin:0;padding:8px 12px;background:transparent;color:var(--ui-accent);font-size:13px}.edit-form{padding:16px}.edit-form label{display:block;margin:0 0 16px;font-size:13px}.edit-form input,.edit-form textarea{width:100%;margin:8px 0 0;padding:12px;border:1px solid var(--ui-rule);border-radius:var(--ui-radius);font:inherit;font-size:16px}.student-primary{background:var(--ui-accent);color:var(--ui-surface);min-height:44px;font-size:14px}.settings-panel{padding:20px}.settings-panel p{font-size:14px;line-height:1.6}.student-view button:focus-visible{outline:2px solid var(--ui-focus);outline-offset:3px}.student-canteen{display:grid;gap:20px}.student-canteen :deep(.menu-item){box-shadow:none}.contact-panel{border:0;border-radius:0}.contact-panel .panel-heading{padding:0 0 12px}.contact-panel dl{padding:0}.contact-panel .edit-form{padding:8px 0 0}
.class-subtabs{display:flex;gap:4px;margin:0 0 20px;padding:4px;background:var(--ui-soft);border:1px solid var(--ui-rule);border-radius:var(--ui-radius)}.class-subtabs button{flex:1;min-width:0;min-height:44px;margin:0;padding:8px;background:transparent;color:var(--ui-muted);font-size:13px;border:1px solid transparent;border-radius:6px}.class-subtabs button[aria-current=page]{background:var(--ui-surface);border-color:var(--ui-rule);color:var(--ui-accent)}.my-class-workspace{min-width:0}
.student-navigation{position:fixed;inset:0 auto 0 0;margin:0;width:min(320px,calc(100% - 24px));height:100dvh;max-height:100dvh;max-width:none;padding:20px 16px;border:0;border-right:1px solid var(--ui-rule);border-radius:0;background:var(--ui-surface);color:var(--ui-ink);overflow-y:auto;overscroll-behavior:contain}.student-navigation::backdrop{background:var(--ui-overlay)}.navigation-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 8px 20px;border-bottom:1px solid var(--ui-rule)}.student-view .navigation-heading h2{font-size:18px;margin:0}.navigation-heading p{font-size:12px;line-height:1.5;color:var(--ui-muted);margin:8px 0 0;overflow-wrap:anywhere}.student-navigation .navigation-close{display:grid;place-items:center;flex-shrink:0;width:44px;height:44px;margin:0;padding:12px;border:1px solid var(--ui-rule);border-radius:var(--ui-radius);background:var(--ui-surface);color:var(--ui-ink)}.navigation-close svg{width:20px;height:20px}.navigation-links{display:grid;gap:4px;padding:16px 0}.student-navigation .navigation-item{display:flex;align-items:center;gap:12px;width:100%;min-height:48px;margin:0;padding:12px;border:1px solid transparent;border-radius:var(--ui-radius);background:transparent;color:var(--ui-ink);font-size:14px;font-weight:500;text-align:left}.navigation-item svg{width:20px;height:20px;flex-shrink:0;color:var(--ui-muted)}.student-navigation .navigation-item:hover{background:var(--ui-soft)}.student-navigation .navigation-item.is-current{background:var(--ui-soft);border-color:var(--ui-rule);color:var(--ui-accent)}.navigation-item.is-current svg{color:var(--ui-accent)}.navigation-account{display:grid;gap:4px;border-top:1px solid var(--ui-rule);padding-top:12px}.student-navigation button:disabled{color:var(--ui-muted);background:var(--ui-soft);cursor:not-allowed;opacity:.55}
@media(max-width:600px){.student-view{padding:0}.student-shell{height:100dvh;border:0;border-radius:0}.student-top{padding:12px 16px}.student-content{padding:20px 16px}.student-bottom{padding-inline:8px}.student-bottom button{padding:8px}.class-subtabs button{font-size:12px}.settings-panel{padding:16px}}
@media(max-width:400px){.student-panel dl>div{flex-direction:column;gap:8px}.student-panel dd{text-align:left}}
</style>
