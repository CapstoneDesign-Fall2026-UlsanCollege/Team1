<script setup lang="ts">

import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'

import ClassDetails from './ClassDetails.vue'
import SchoolSubjectPlanner from './SchoolSubjectPlanner.vue'

import { scheduleApi, days } from '../schedules'

const props = defineProps<{ selectedTab?: string; active?: boolean }>()

const emit = defineEmits<{ changed: [configured: boolean]; saving: [value: boolean]; create:[id:number]; rooms:[id:number] }>()

type Year = { id: number; name: string; start_date: string; end_date: string }

type Class = { id: number; year_id: number; grade_label: string; name: string; is_active: number }

type Term = Year & { year_id: number | null }

type Subject = { id: number; semester_id: number; course_code: string; course_name: string; professor: string | null; major: string | null }

type Membership = { id: number; student_user_id: number; year_id: number; class_id: number; starts_on: string; ends_on: string | null; grade_label: string; name: string }

type Student = { id: number; login_id: string; full_name: string; is_active: number; legacy_major: string | null }

type Meeting = { id: number; course_offering_id: number; day_of_week: number; start_time: string; end_time: string; location: string }

type State = { revision: number; profile: { name: string; level: string } | null; today: string; years: Year[]; classes: Class[]; terms: Term[]; subjects: Subject[]; links: { class_id: number; offering_id: number }[]; catalog: { id: number; course_code: string; course_name: string }[]; meetings: Meeting[] }

const roomAssignments = ref<{year_id:number;class_id:number;room_id:number;room_number:string}[]|null>(null), roomError=ref(false)

const state = ref<State | null>(null), loading = ref(true), busy = ref(false), error = ref(''), message = ref('')

let messageTimer: ReturnType<typeof setTimeout> | undefined
watch(message, value => {
  clearTimeout(messageTimer)
  if (value) messageTimer = setTimeout(() => { message.value = '' }, 4000)
})
onBeforeUnmount(() => clearTimeout(messageTimer))
const tab = ref(props.selectedTab ?? 'class'), yearId = ref(0), classId = ref(0), search = ref(''), students = ref<Student[]>([]), memberships = ref<Membership[]>([]), effective = ref('')

const memberFilter = ref('all'), memberPage = ref(1)

const filteredStudents = computed(() => students.value.filter(student => memberFilter.value === 'all' || (memberFilter.value === 'unassigned' ? !openMembership(student.id) : openMembership(student.id)?.class_id === Number(memberFilter.value))))

const memberPages = computed(() => Math.max(1, Math.ceil(filteredStudents.value.length / 10)))

const visibleStudents = computed(() => filteredStudents.value.slice((memberPage.value - 1) * 10, memberPage.value * 10))

watch([memberFilter, yearId], () => { memberPage.value = 1 })

watch(memberPages, count => { memberPage.value = Math.min(memberPage.value, count) })

const profile = reactive({ name: '', level: 'middle', confirm_school_mode: false })

const yearForm = reactive({ id: 0, name: '', start_date: '', end_date: '' })

const classForm = reactive({ id: 0, grade_label: '', name: '', is_active: true })

const termForm = reactive({ mode: 'new', name: '', start_date: '', end_date: '', semester_id: 0 })

const subjectForm = reactive({ mode: 'new', offering_id: 0, course_id: 0, semester_id: 0, teacher: '' })

const meeting = reactive({ id: 0, course_offering_id: 0, day_of_week: 1, start_time: '', end_time: '', location: '' })

const selectedYear = computed(() => state.value?.years.find(y => y.id === yearId.value))

const classes = computed(() => state.value?.classes.filter(c => c.year_id === yearId.value) ?? [])

const selectedClass = computed(() => classes.value.find(c => c.id === classId.value))

const terms = computed(() => state.value?.terms.filter(t => t.year_id === yearId.value) ?? [])

const legacyTerms = computed(() => state.value?.terms.filter(t => !t.year_id) ?? [])

const subjects = computed(() => state.value?.subjects.filter(s => state.value?.links.some(l => l.class_id === classId.value && l.offering_id === s.id)) ?? [])

const availableOfferings = computed(() => state.value?.subjects.filter(s => terms.value.some(t => t.id === s.semester_id) && !subjects.value.some(v => v.id === s.id)) ?? [])

const meetings = computed(() => state.value?.meetings.filter(m => subjects.value.some(s => s.id === m.course_offering_id)) ?? [])

const roomLabel = (c:Class) => {const assignment=roomAssignments.value?.find(a=>a.class_id===c.id && a.year_id===c.year_id);return roomError.value?'Room unavailable':roomAssignments.value===null?'Loading room…':assignment?'Room '+assignment.room_number:'Room not assigned'}

const className = (c?: Class) => c ? `Grade ${c.grade_label} · Class ${c.name} · ${roomLabel(c)}` : 'Choose a class'

async function loadRooms(){try{const data=await scheduleApi('admin/school/rooms');roomAssignments.value=data.assignments;roomError.value=false}catch{roomError.value=true}}

watch(()=>props.active,value=>{if(value)void load()})

const termName = (id: number) => state.value?.terms.find(t => t.id === id)?.name ?? 'Unmapped term'

const subjectName = (id: number) => state.value?.subjects.find(s => s.id === id)?.course_name ?? 'Subject'

const history = (id: number) => memberships.value.filter(m => m.student_user_id === id && m.year_id === yearId.value)

const openMembership = (id: number) => history(id).find(m => !m.ends_on)

function resetSelection() {

  if (!classes.value.some(c => c.id === classId.value)) classId.value = classes.value.find(c => c.is_active)?.id ?? 0

  effective.value = selectedYear.value && state.value ? (state.value.today < selectedYear.value.start_date ? selectedYear.value.start_date : state.value.today > selectedYear.value.end_date ? selectedYear.value.end_date : state.value.today) : ''

  Object.assign(classForm, { id: 0, grade_label: '', name: '', is_active: true })

  Object.assign(meeting, { id: 0, course_offering_id: 0, day_of_week: 1, start_time: '', end_time: '', location: '' })

}

async function loadStudents() {

  const data = await scheduleApi('admin/school/students?search=' + encodeURIComponent(search.value))

  students.value = data.students; memberships.value = data.memberships; memberPage.value = 1

}

async function load() {

  loading.value = true; error.value = ''

  try {

    const [school] = await Promise.all([scheduleApi('admin/school'),loadRooms()])

    state.value = school

    if (!state.value!.years.some(y => y.id === yearId.value)) yearId.value = state.value!.years.find(y => y.start_date <= state.value!.today && y.end_date >= state.value!.today)?.id ?? state.value!.years[0]?.id ?? 0

    if (state.value!.profile) Object.assign(profile, state.value!.profile)

    resetSelection(); await loadStudents()

  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load school planning.' }

  finally { loading.value = false }

}

async function save(path: string, method: string, value: object) {

  if (busy.value || loading.value || !state.value) return

  busy.value = true; emit('saving', true); error.value = ''; message.value = ''

  try {

    const result = await scheduleApi('admin/school/' + path, method, { ...value, revision: state.value.revision })

    await load(); if (!error.value) { message.value = result.message; emit('changed', Boolean(state.value?.profile)) }

    return result

  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to save. Reload to review saved records.' }

  finally { busy.value = false; emit('saving', false) }

}

async function saveYear() {

  if (await save('years' + (yearForm.id ? '/' + yearForm.id : ''), yearForm.id ? 'PUT' : 'POST', yearForm)) Object.assign(yearForm, { id: 0, name: '', start_date: '', end_date: '' })

}

async function saveClass() { await save('classes' + (classForm.id ? '/' + classForm.id : ''), classForm.id ? 'PUT' : 'POST', { ...classForm, year_id: yearId.value }) }

async function assign(student: Student, end = false) {

  if (!end && !selectedClass.value) return

  const existing = openMembership(student.id)

  if ((end || existing) && !window.confirm(`${end ? 'End' : 'Change'} ${student.full_name}’s class membership from ${effective.value}? Saved history will remain.`)) return

  await save(`students/${student.id}/membership`, 'PUT', { year_id: yearId.value, class_id: end ? null : classId.value, starts_on: effective.value })

}

async function saveTerm() {

  await save('terms', 'POST', { year_id: yearId.value, ...(termForm.mode === 'map' ? { semester_id: termForm.semester_id } : { name: termForm.name, start_date: termForm.start_date, end_date: termForm.end_date }) })

}

async function saveSubject() {

  await save('subjects', 'POST', { class_id: classId.value, ...(subjectForm.mode === 'map' ? { offering_id: subjectForm.offering_id } : { course_id: subjectForm.course_id, semester_id: subjectForm.semester_id, teacher: subjectForm.teacher }) })

}

async function deleteMeeting(id: number) {

  if (window.confirm('Remove this recorded meeting? A shared subject will change for every linked class.')) await save('schedules/' + id, 'DELETE', {})

}

async function findStudents() {

  if (busy.value) return

  busy.value = true; error.value = ''

  try { await loadStudents() } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to find students.' }

  finally { busy.value = false }

}

watch(() => props.selectedTab, value => { if (value && ['class','roster','teachers','classrooms','structure', 'members', 'subjects'].includes(value)) tab.value = value })

onMounted(load)

</script>



<template>

  <section class="school-manager" :class="{ compact: tab === 'subjects' || tab === 'members', 'membership-view': tab === 'members' }">

    <div class="heading"><div><p class="eyebrow">SCHOOL PLANNING</p><h2>{{tab==='structure'?'Years, grades and classes':'Class workspace'}}</h2></div><button type="button" class="secondary" :disabled="busy || loading" @click="load">Reload saved data</button></div>

    <p v-if="error" class="error" role="alert">{{ error }}</p><p v-if="message" class="success" role="status">{{ message }}</p><p v-if="loading" role="status">Loading school records…</p>

    <template v-if="state">

      <form v-if="!state.profile" class="card" @submit.prevent="save('profile', 'PUT', profile)"><fieldset :disabled="busy"><h3>Set up your school</h3><label>School name<input v-model="profile.name" required maxlength="150"></label><label>School level<select v-model="profile.level"><option value="middle">Middle school</option><option value="high">High school</option></select></label>

        <p>School mode changes student academic access to explicit class membership. Existing accounts, subjects and timetables stay saved; unmapped students will see an assignment-needed message.</p>

        <label class="check"><input v-model="profile.confirm_school_mode" type="checkbox" required>I understand and will review the student and subject mappings.</label><button :disabled="!profile.confirm_school_mode">Enable school planning</button></fieldset></form>

      <template v-else>

        <p class="school-title"><strong>{{ state.profile.name }}</strong> · {{ state.profile.level === 'middle' ? 'Middle school' : 'High school' }}</p>

        <p v-if="tab === 'structure'" class="muted">A homeroom class is a student group within an academic year.</p>

        <fieldset class="filters" :disabled="busy"><label>Academic year<select v-model="yearId" @change="resetSelection"><option :value="0">Choose a year</option><option v-for="y in state.years" :key="y.id" :value="y.id">{{ y.name }}</option></select></label><label>Homeroom class<select v-model="classId" @change="Object.assign(meeting, { id: 0, course_offering_id: 0 })"><option :value="0">Choose a class</option><option v-for="c in classes" :key="c.id" :value="c.id">{{ className(c) }}{{ c.is_active ? '' : ' · Inactive' }}</option></select></label></fieldset>

        <nav class="tabs" aria-label="Class workspace"><button v-for="item in [{id:'class',name:'Overview'},{id:'roster',name:'Students'},{id:'subjects',name:'Subjects & timetable'},{id:'teachers',name:'Teachers'},{id:'classrooms',name:'Rooms'},{id:'structure',name:'Year & class setup'}]" :key="item.id" type="button" :class="{secondary:tab!==item.id}" :aria-current="tab===item.id?'page':undefined" :disabled="busy" @click="tab=item.id">{{item.name}}</button></nav>
        <details v-if="tab==='class'" class="class-browser"><summary>Browse classes ({{classes.length}})</summary><div class="class-switcher"><button v-for="c in classes" :key="c.id" type="button" class="secondary" :aria-pressed="classId===c.id" @click="classId=c.id">Grade {{c.grade_label}} · Class {{c.name}}<small>{{roomLabel(c)}}</small></button></div></details>
        <ClassDetails v-if="['class','roster','teachers','classrooms'].includes(tab)&&selectedClass" :state="state" :class-id="classId" :view="tab" @open="tab=$event" @create="emit('create',$event)" @rooms="emit('rooms',$event)" />
        <p v-if="['class','roster','teachers','classrooms'].includes(tab)&&!selectedClass" class="muted">Create or choose a class to open its workspace.</p>

        <p v-if="tab==='members'"><button type="button" class="secondary" @click="tab='roster'">← Back to class students</button></p>

        <template v-if="tab === 'structure'">

          <form class="card" @submit.prevent="saveYear"><fieldset :disabled="busy"><h3>{{ yearForm.id ? 'Edit academic year' : 'Create academic year' }}</h3><div class="fields"><label>Year label<input v-model="yearForm.name" required maxlength="80" placeholder="2026–2027"></label><label>Starts<input v-model="yearForm.start_date" type="date" required></label><label>Ends<input v-model="yearForm.end_date" type="date" required></label></div><button>Save academic year</button><button v-if="selectedYear" type="button" class="secondary" @click="Object.assign(yearForm, selectedYear)">Edit selected year</button><button v-if="yearForm.id" type="button" class="secondary" @click="Object.assign(yearForm, { id: 0, name: '', start_date: '', end_date: '' })">Cancel edit</button></fieldset></form>

          <template v-if="selectedYear">

            <form class="card" @submit.prevent="saveClass"><fieldset :disabled="busy"><h3>{{ classForm.id ? 'Edit homeroom class' : 'Create homeroom class' }} · {{ selectedYear.name }}</h3><div class="fields"><label>Grade label<input v-model="classForm.grade_label" required maxlength="30" placeholder="2"></label><label>Class label<input v-model="classForm.name" required maxlength="50" placeholder="A"></label></div><label class="check"><input v-model="classForm.is_active" type="checkbox">Active</label><button>Save class</button><button v-if="selectedClass" type="button" class="secondary" @click="Object.assign(classForm, { ...selectedClass, is_active: Boolean(selectedClass.is_active) })">Edit selected class</button><button v-if="classForm.id" type="button" class="secondary" @click="Object.assign(classForm, { id: 0, grade_label: '', name: '', is_active: true })">Cancel edit</button></fieldset></form>

            <form class="card" @submit.prevent="saveTerm"><fieldset :disabled="busy"><h3>Terms in {{ selectedYear.name }}</h3><ul><li v-for="term in terms" :key="term.id">{{ term.name }} · {{ term.start_date }} – {{ term.end_date }}</li></ul><p v-if="!terms.length" class="muted">No terms linked yet.</p><label>Action<select v-model="termForm.mode"><option value="new">Create a school term</option><option value="map">Map an existing term after review</option></select></label>

              <label v-if="termForm.mode === 'map'">Existing unmapped term<select v-model="termForm.semester_id" required><option :value="0" disabled>Choose a term</option><option v-for="term in legacyTerms" :key="term.id" :value="term.id">{{ term.name }} · {{ term.start_date }} – {{ term.end_date }}</option></select></label>

              <div v-else class="fields"><label>Term name<input v-model="termForm.name" required maxlength="100"></label><label>Starts<input v-model="termForm.start_date" type="date" :min="selectedYear.start_date" :max="selectedYear.end_date" required></label><label>Ends<input v-model="termForm.end_date" type="date" :min="selectedYear.start_date" :max="selectedYear.end_date" required></label></div><button>Save term link</button></fieldset></form>

          </template>

        </template>

        <template v-if="tab === 'members'">

          <p v-if="!selectedYear">Choose an academic year first.</p>

          <template v-else>

            <form class="member-toolbar" @submit.prevent="findStudents">

              <label>Show students<select v-model="memberFilter" :disabled="busy"><option value="all">All classes</option><option value="unassigned">Not assigned</option><option v-for="c in classes" :key="c.id" :value="String(c.id)">Grade {{ c.grade_label }} · Class {{ c.name }}</option></select></label>

              <label>Find student<input v-model="search" maxlength="150" placeholder="Name or login ID"></label>

              <label>Effective date<input v-model="effective" type="date" :min="selectedYear.start_date" :max="selectedYear.end_date" :disabled="busy" required></label>

              <button :disabled="busy">Search</button>

            </form>

            <p class="muted member-help">Assign to <strong>{{ className(selectedClass) }}</strong>. Review each student before changing their class.</p>

            <div class="member-list">

            <p v-if="!filteredStudents.length">No students match these filters.</p>

            <article v-for="student in visibleStudents" :key="student.id" class="student-row">

              <div class="student-identity"><strong>{{ student.full_name }}</strong><small>{{ student.login_id }}{{ student.is_active ? '' : ' · Disabled' }}</small></div>

              <div class="student-assignment"><span v-if="openMembership(student.id)">Grade {{ openMembership(student.id)!.grade_label }} · Class {{ openMembership(student.id)!.name }}</span><span v-else class="muted">Not assigned</span></div>

              <div class="member-actions"><button type="button" :disabled="busy || !effective || !selectedClass?.is_active || !student.is_active || openMembership(student.id)?.class_id === classId" @click="assign(student)">{{ openMembership(student.id)?.class_id === classId ? 'Assigned' : 'Assign' }}</button><button v-if="openMembership(student.id)" type="button" class="secondary" :disabled="busy || !effective" @click="assign(student, true)">End</button></div>

              <details v-if="history(student.id).length"><summary>Membership history</summary><ul><li v-for="m in history(student.id)" :key="m.id">Grade {{ m.grade_label }} · {{ m.name }}: {{ m.starts_on }} → {{ m.ends_on || 'open' }}<span v-if="m.ends_on"> (end date excluded)</span></li></ul></details>

            </article>

            </div>

            <nav class="member-pagination" aria-label="Student pages"><span>{{ filteredStudents.length ? (memberPage - 1) * 10 + 1 : 0 }}–{{ Math.min(memberPage * 10, filteredStudents.length) }} of {{ filteredStudents.length }} students</span><button type="button" class="secondary" :disabled="memberPage <= 1 || busy" @click="memberPage--">Previous</button><span>Page {{ memberPage }} / {{ memberPages }}</span><button type="button" class="secondary" :disabled="memberPage >= memberPages || busy" @click="memberPage++">Next</button></nav>

            <p class="muted">Search checks up to 100 matching accounts. Narrow by name or login ID if needed.</p>

          </template>

        </template>

        <template v-if="tab === 'subjects'">

          <p v-if="!selectedClass">Choose a homeroom class first.</p>

          <template v-else>

            <SchoolSubjectPlanner :state="state" :class-id="classId" :year-id="yearId" :busy="busy" :error="error" :class-label="className(selectedClass)" :save="save" />

            <details><summary>Advanced: map existing offerings or edit exact meeting times</summary>

            <form class="card" @submit.prevent="saveSubject"><fieldset :disabled="busy || !selectedClass.is_active"><h3>Add class subject</h3><label>Action<select v-model="subjectForm.mode"><option value="new">Create offering from catalog</option><option value="map">Map existing offering after review</option></select></label>

              <label v-if="subjectForm.mode === 'map'">Existing offering in a linked term<select v-model="subjectForm.offering_id" required><option :value="0" disabled>Choose an offering</option><option v-for="s in availableOfferings" :key="s.id" :value="s.id">{{ s.course_code }} · {{ termName(s.semester_id) }} · {{ s.major || 'No legacy major' }} · #{{ s.id }}</option></select></label>

              <template v-else><label>Catalog subject<select v-model="subjectForm.course_id" required><option :value="0" disabled>Choose a subject</option><option v-for="c in state.catalog" :key="c.id" :value="c.id">{{ c.course_code }} · {{ c.course_name }}</option></select></label><label>School term<select v-model="subjectForm.semester_id" required><option :value="0" disabled>Choose a linked term</option><option v-for="t in terms" :key="t.id" :value="t.id">{{ t.name }}</option></select></label><label>Recorded subject teacher name (optional)<input v-model="subjectForm.teacher" maxlength="150"></label></template><button>Save class subject</button></fieldset></form>

            <h3>Weekly class meetings</h3><p class="muted">Times use Nepal time (NPT). Editing a shared offering changes its meetings for every linked class.</p>

            <article v-for="m in meetings" :key="m.id" class="card"><strong>{{ subjectName(m.course_offering_id) }}</strong><p>{{ days[m.day_of_week - 1] }} · {{ m.start_time.slice(0, 5) }}–{{ m.end_time.slice(0, 5) }} · {{ m.location }}</p><button type="button" class="secondary" :disabled="busy" @click="Object.assign(meeting, { ...m, start_time: m.start_time.slice(0, 5), end_time: m.end_time.slice(0, 5) })">Edit meeting</button><button type="button" class="secondary" :disabled="busy" @click="deleteMeeting(m.id)">Remove meeting</button></article>

            <form class="card" @submit.prevent="save('schedules' + (meeting.id ? '/' + meeting.id : ''), meeting.id ? 'PUT' : 'POST', meeting)"><fieldset :disabled="busy || !subjects.length"><h3>{{ meeting.id ? 'Edit meeting' : 'Add meeting' }}</h3><label>Class subject<select v-model="meeting.course_offering_id" :disabled="!!meeting.id" required><option :value="0" disabled>Choose a class subject</option><option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.course_code }} · {{ termName(s.semester_id) }}</option></select></label><div class="fields"><label>Day<select v-model="meeting.day_of_week"><option v-for="(day, i) in days" :key="day" :value="i + 1">{{ day }}</option></select></label><label>From<input v-model="meeting.start_time" type="time" required></label><label>Until<input v-model="meeting.end_time" type="time" required></label></div><label>Recorded location<input v-model="meeting.location" required maxlength="150"></label><button>Save meeting</button><button v-if="meeting.id" type="button" class="secondary" @click="meeting.id = 0; meeting.course_offering_id = 0">Cancel edit</button></fieldset></form>

            </details>

          </template>

        </template>

      </template>

    </template>

  </section>

</template>



<style scoped>
.class-browser{margin:12px 0}.class-browser summary{cursor:pointer;color:#476c58;font-size:14px}.class-switcher{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.class-switcher button{padding:10px 14px;font-size:13px}.class-switcher small{display:block;font-size:11px;margin-top:4px}.class-switcher [aria-pressed="true"]{outline:2px solid #37614f}


.school-manager{overflow-wrap:anywhere}.compact .heading h2{font-size:18px}.compact .heading .eyebrow,.compact .school-title{display:none}.compact .filters label{margin:6px 0}.compact .tabs{margin:8px 0}.heading{display:flex;justify-content:space-between;gap:14px;align-items:center}.heading h2{margin:0}.school-manager fieldset{border:0;padding:0;min-width:0}.school-manager .card{margin:20px 0}.school-manager label{display:block;margin:12px 0;font-weight:600}.school-manager input,.school-manager select{box-sizing:border-box;width:100%;font:inherit;padding:11px;border:1px solid #bccfc5;border-radius:8px;background:white;color:#213d34;min-width:0;margin-top:6px}.school-manager .check{display:flex;align-items:center;gap:10px}.check input{width:18px;height:18px;flex-shrink:0;margin:0}.filters,.fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:14px}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0}.school-manager button{width:auto;margin:6px 8px 6px 0}.school-manager .muted{font-size:14px;line-height:1.6}.search{display:flex;align-items:end;gap:10px}.search label{flex:1}.search button{margin-bottom:12px}.date-field{max-width:250px}.student-row small{display:block;color:#64776f;font-size:14px;margin-top:5px}.school-manager summary{cursor:pointer;margin:16px 0 8px}.school-manager li{line-height:1.7}.school-title{margin-top:18px}@media(max-width:600px){.heading{align-items:flex-start;flex-direction:column}.tabs button{flex:1 1 140px}.school-manager .card{padding:18px}.search{flex-wrap:wrap}.fields{grid-template-columns:1fr 1fr}.fields label:first-child{grid-column:1/-1}}

.member-toolbar{display:grid;grid-template-columns:minmax(150px,1fr) minmax(180px,1.5fr) minmax(150px, .8fr) auto;gap:12px;align-items:end;background:#eaf2ed;padding:12px 16px;border-radius:12px}.member-toolbar label{margin:0}.member-toolbar button{margin:0;min-height:42px}.member-toolbar input,.member-toolbar select{padding:9px}.member-help{margin:10px 0}.member-list{background:#fff;border:1px solid #d5e1db;border-radius:12px;padding:0 16px}.student-row{display:grid;grid-template-columns:minmax(150px,1.3fr) minmax(120px,1fr) auto;align-items:center;gap:8px 16px;padding:10px 0;border-bottom:1px solid #e1e9e5}.student-row:last-child{border-bottom:0}.student-row small{margin-top:2px;font-size:12px}.member-actions{display:flex;gap:6px}.member-actions button{padding:8px 12px;margin:0;font-size:13px}.student-row details{grid-column:1/-1;font-size:13px}.student-row summary{margin:0}.member-pagination{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:12px;font-size:14px}.member-pagination>span:first-child{margin-right:auto}.member-pagination button{padding:8px 14px;margin:0}.membership-view .filters label{margin:6px 0}.membership-view .tabs button{padding:10px 16px}.membership-view .heading{margin-bottom:8px}@media(max-width:700px){.member-toolbar{grid-template-columns:1fr 1fr;gap:10px}.member-toolbar button{width:100%}.student-row{grid-template-columns:1fr auto}.student-assignment{grid-column:1;grid-row:2;font-size:13px}.member-actions{grid-column:2;grid-row:1/3}.member-list{padding:0 12px}.member-pagination{gap:8px}.member-pagination>span:first-child{width:100%}}


.school-manager .tabs{gap:6px;margin:12px 0}.school-manager .tabs button{padding:10px 13px;font-size:13px;margin:0;min-height:42px}.school-manager .heading h2{font-size:22px}.school-manager .filters{gap:10px}.school-manager .filters label{font-size:13px;margin:8px 0}.school-manager .school-title{font-size:13px;margin:12px 0}@media(max-width:600px){.school-manager .tabs{flex-wrap:nowrap;overflow-x:auto;padding:3px 2px 8px}.school-manager .tabs button{flex:0 0 auto;white-space:nowrap}.school-manager .heading{flex-direction:row;align-items:center}.school-manager .heading button{padding:8px 10px;font-size:12px}.school-manager .heading .eyebrow{display:none}.school-manager .filters{grid-template-columns:1fr 1fr}.school-manager .filters select{font-size:13px;padding:9px}.school-manager .school-title{font-size:12px}}
</style>
