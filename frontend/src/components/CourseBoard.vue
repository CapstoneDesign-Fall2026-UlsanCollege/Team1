<script setup lang="ts">
import StudentIcon from './StudentIcon.vue'
import { apiFetch } from '../api'
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
const props = defineProps<{ revision?: number }>()
const emit = defineEmits<{ changed: [] }>()
watch(() => props.revision, () => { if (!busy.value && editingId.value === null) void load() })
type Course = { id: number; course_code: string; course_name: string; credits: number }
type Offering = Course & { offering_id: number; semester_id: number; major: string | null; professor: string | null; section: string }
type Semester = { id: number; name: string; academic_year: number }
const catalog = ref<Course[]>([])
const offerings = ref<Offering[]>([])
const semesters = ref<Semester[]>([])
const semesterId = ref(0), majors = ref<string[]>([]), newMajor = ref('')
const selectedSemester = computed(() => semesters.value.find(s => s.id === semesterId.value))
const unassigned = computed(() => offerings.value.filter(o => o.semester_id === semesterId.value && !o.major))
const legacyMajor = ref('')
function addMajor() {
  const value = newMajor.value.trim()
  if (!value || majors.value.some(m => m.toLowerCase() === value.toLowerCase())) return
  majors.value.push(value); newMajor.value = ''
}
async function classify(offering: Offering) {
  if (!legacyMajor.value || busy.value) return
  busy.value = true; error.value = ''
  try { const data = await api('course-assignments/' + offering.offering_id + '/major', 'PUT', { major: legacyMajor.value }); offering.major = data.major; message.value = data.message }
  catch(e) { error.value = e instanceof Error ? e.message : 'Unable to assign major.' }
  finally { busy.value = false }
}
const professor = ref('')
const chosenCourse = ref<number>(0)
const message = ref('')
const error = ref('')
const loading = ref(true)
const busy = ref(false)
const boardElement = ref<HTMLElement | null>(null)
const expanded = ref(false)
function syncLargeView() { expanded.value = document.fullscreenElement === boardElement.value }
async function toggleLargeView() {
  try {
    if (expanded.value) await document.exitFullscreen()
    else await boardElement.value?.requestFullscreen()
  } catch { error.value = 'Large view could not open. Try again using the Large view button.' }
}
onMounted(() => document.addEventListener('fullscreenchange', syncLargeView))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', syncLargeView))
const editingId = ref<number | null>(null)
const professorDraft = ref('')
const editError = ref('')
async function editProfessor(offering: Offering) {
  editingId.value = offering.offering_id
  professorDraft.value = offering.professor || ''
  editError.value = ''; message.value = ''
  await nextTick()
  document.getElementById('professor-' + offering.offering_id)?.focus()
}
async function saveProfessor(offering: Offering) {
  if (busy.value || !professorDraft.value.trim()) return
  busy.value = true; editError.value = ''; message.value = ''
  try {
    const data = await api('course-assignments/' + offering.offering_id + '/professor', 'PUT', { professor: professorDraft.value.trim() })
    offering.professor = data.professor
    editingId.value = null
    message.value = offering.course_code + ': professor updated. Students will see the change when they reopen Courses or refresh Schedule.'
  } catch (e) { editError.value = e instanceof Error ? e.message : 'Unable to update professor.' }
  finally { busy.value = false }
}

async function api(path: string, method = 'GET', body?: object) {
  const response = await apiFetch('/api/admin/' + path, {
    method,
    headers: method === 'GET' ? {} : { 'Content-Type': 'application/json', 'X-StudentHub': '1' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await response.json().catch(() => ({ message: 'Backend unavailable. Please try again.' }))
  if (!response.ok) throw new Error(data.message || 'Request failed.')
  if (method !== 'GET') emit('changed')
  return data
}
async function load() {
  loading.value = true; error.value = ''
  try {
    const [courses, terms, assignments, programs] = await Promise.all([
      api('courses'), api('semesters'), api('course-assignments'), api('majors'),
    ])
    catalog.value = courses.courses
    semesters.value = terms.semesters
    offerings.value = assignments.offerings
    majors.value = programs.majors
    if (!semesters.value.some(s => s.id === semesterId.value)) semesterId.value = semesters.value[0]?.id ?? 0
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unable to load the board.'
  } finally { loading.value = false }
}
onMounted(load)
function drag(course: Course, event: DragEvent) {
  event.dataTransfer?.setData('text/plain', String(course.id))
}
async function drop(major: string, event: DragEvent) {
  await assignToMajor(major, Number(event.dataTransfer?.getData('text/plain')))
}
async function assignToMajor(major: string, courseId: number) {
  if (busy.value || loading.value || error.value) return
  const course = catalog.value.find(c => c.id === courseId)
  if (!course || !semesterId.value) return
  message.value = ''
  if (!professor.value.trim()) { message.value = 'Enter a professor before adding a course.'; return }
  if (offerings.value.some(o => o.id === course.id && o.semester_id === semesterId.value && o.major === major && o.section === 'A')) {
    message.value = 'This course is already assigned to this major and semester (Section A).'; return
  }
  busy.value = true
  try {
    const data = await api('course-assignments', 'POST', {
      course_id: course.id, semester_id: semesterId.value, major, professor: professor.value.trim(),
    })
    offerings.value.push({ ...course, offering_id: data.id, semester_id: semesterId.value, major, professor: professor.value.trim(), section: 'A' })
    message.value = 'Course assignment saved.'
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to save assignment.' }
  finally { busy.value = false }
}
async function remove(offering: Offering) {
  if (busy.value) return
  busy.value = true; error.value = ''; message.value = ''
  try {
    await api('course-assignments/' + offering.offering_id, 'DELETE')
    offerings.value = offerings.value.filter(o => o.offering_id !== offering.offering_id)
    message.value = offering.course_code + ' removed from the semester.'
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to remove assignment.' }
  finally { busy.value = false }
}
</script>

<template>
  <section ref="boardElement" class="card course-board" :aria-busy="loading || busy">
    <p class="eyebrow">COURSE PLANNING</p>
    <h2>Plan courses by major</h2>
    <p class="muted">Choose a semester and course, then tap Add to major. You can also drag catalog courses into a major.</p>
    <div class="board-controls"><button type="button" class="secondary" :disabled="loading || busy || editingId !== null" @click="load"><StudentIcon name="refresh" />Refresh board</button><button type="button" class="secondary" :aria-pressed="expanded" @click="toggleLargeView"><StudentIcon name="expand" />{{ expanded ? 'Exit large view' : 'Large view' }}</button><span v-if="expanded">Press Esc to exit</span></div>
    <label>Professor for the next course assignment
      <input v-model="professor" maxlength="150" :disabled="busy" placeholder="Professor Lee">
    </label>
    <label>Semester<select v-model="semesterId" :disabled="busy || loading || editingId !== null"><option disabled :value="0">Choose a semester</option><option v-for="term in semesters" :key="term.id" :value="term.id">{{term.name}} {{term.academic_year}}</option></select></label>
    <label>Course to assign<select v-model="chosenCourse" :disabled="busy || loading"><option disabled :value="0">Choose a course</option><option v-for="course in catalog" :key="course.id" :value="course.id">{{course.course_code}} · {{course.course_name}}</option></select></label>
    <form class="board-controls" @submit.prevent="addMajor"><label>Another major<input v-model="newMajor" maxlength="150" placeholder="Exact major name used in student profiles" :disabled="busy"></label><button class="secondary" :disabled="busy || !newMajor.trim()"><StudentIcon name="add" />Add major column</button><small>A new column is saved when you add its first course.</small></form>
    <p v-if="error" class="error" role="alert">{{ error }} Use Refresh board to reload saved data.</p>
    <p v-if="message" class="success" role="status">{{ message }}</p>
    <p v-if="loading" role="status">Loading courses and saved assignments…</p>
    <div v-else class="board">
      <div class="catalog">
        <h3>Course catalog</h3>
        <p v-if="!catalog.length">No courses in the catalog.</p>
        <article v-for="course in catalog" :key="course.id" :draggable="!busy" @dragstart="drag(course, $event)" class="course-chip">
          <strong>{{ course.course_code }}</strong><span>{{ course.course_name }}</span><small>{{ course.credits }} credits</small>
        </article>
      </div>
      <div v-for="major in majors" :key="major" class="semester-drop" @dragover.prevent @drop.prevent="drop(major, $event)">
        <h3>{{ major }}</h3><small>{{selectedSemester?.name}} {{selectedSemester?.academic_year}}</small>
        <button type="button" class="secondary" :disabled="busy || !chosenCourse || !semesterId || !professor.trim()" @click="assignToMajor(major, chosenCourse)"><StudentIcon name="add" />Add to {{major}}</button>
        <p v-if="!offerings.some(o => o.semester_id === semesterId && o.major === major)" class="muted">No courses assigned. Drop a course here.</p>
        <article v-for="offering in offerings.filter(o => o.semester_id === semesterId && o.major === major)" :key="offering.offering_id" class="course-chip placed">
          <strong>{{ offering.course_code }}</strong><span>{{ offering.course_name }}</span>
          <small>{{ offering.professor || 'Professor not assigned' }} · Section {{ offering.section }}</small>
          <form v-if="editingId === offering.offering_id" class="professor-edit" @submit.prevent="saveProfessor(offering)">
            <label :for="'professor-' + offering.offering_id">Professor name</label>
            <input :id="'professor-' + offering.offering_id" v-model="professorDraft" required maxlength="150" :disabled="busy" @keydown.esc="!busy && (editingId = null)">
            <p v-if="editError" class="error" role="alert">{{ editError }}</p>
            <div class="professor-actions"><button :disabled="busy || !professorDraft.trim()"><StudentIcon name="save" />{{ busy ? 'Saving…' : 'Save professor' }}</button><button type="button" class="secondary" :disabled="busy" @click="editingId = null"><StudentIcon name="cancel" />Cancel</button></div>
          </form>
          <div v-else class="professor-actions"><button type="button" class="secondary" :disabled="busy || editingId !== null" :aria-label="'Edit professor for ' + offering.course_name + ' in ' + major" @click="editProfessor(offering)"><StudentIcon name="edit" />{{ offering.professor ? 'Edit professor' : 'Assign professor' }}</button><button title="Remove" type="button" class="remove-course" :disabled="busy || editingId !== null" :aria-label="'Remove ' + offering.course_name + ' from ' + major" @click="remove(offering)"><StudentIcon name="remove" /></button></div>
        </article>
      </div>
      <p v-if="!semesters.length" class="muted">Create a semester first, then refresh this board.</p>
    </div>
    <section v-if="unassigned.length"><h3>Existing courses needing a major</h3><p>Their saved class times are retained. Select a major to make them available to its students.</p><label>Major<select v-model="legacyMajor"><option disabled value="">Choose a major</option><option v-for="major in majors" :key="major">{{major}}</option></select></label><article v-for="o in unassigned" :key="o.offering_id" class="course-chip"><strong>{{o.course_code}} · {{o.course_name}}</strong><button :disabled="busy || !legacyMajor" @click="classify(o)"><StudentIcon name="add" />Assign major</button></article></section>
  </section>
</template>
<style scoped>
select{display:block;width:100%;padding:12px;border:1px solid #bdcdc5;border-radius:8px;background:white;color:inherit;font:inherit;margin:8px 0 16px}.board{grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))}.semester-drop{max-height:500px;overflow:auto}
.board-controls{display:flex;align-items:center;flex-wrap:wrap;gap:12px}.board-controls span{font-size:13px;color:#617368}.course-board:fullscreen{width:100%;height:100%;max-width:none;margin:0;border-radius:0;overflow:auto;padding:28px;background:#fff}.course-board:fullscreen .board{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));align-items:start}.course-board:fullscreen .catalog,.course-board:fullscreen .semester-drop{max-height:calc(100dvh - 320px);min-height:220px;overflow:auto}.course-board:fullscreen .board h3{position:sticky;top:-16px;background:#f8fbff;padding:12px 0;z-index:1}.board-controls button:focus-visible{outline:3px solid #518cbe;outline-offset:3px}@media(max-width:600px){.course-board:fullscreen{padding:16px}.course-board:fullscreen .catalog,.course-board:fullscreen .semester-drop{max-height:60dvh}}
.professor-edit{width:100%;margin-top:10px}.professor-edit label{font-size:13px}.professor-edit input{width:100%;min-width:0;margin:6px 0 12px}.professor-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.professor-actions button{font-size:12px;padding:9px 12px}.professor-actions button:focus-visible{outline:3px solid #518cbe;outline-offset:2px}
</style>
