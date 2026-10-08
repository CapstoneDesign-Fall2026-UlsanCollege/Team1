<script setup lang="ts">
import StudentIcon from './StudentIcon.vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { days, scheduleApi, type Meeting, type Semester } from '../schedules'
import WeeklySchedule from './WeeklySchedule.vue'
const props = defineProps<{ revision?: number }>()
watch(() => props.revision, () => { if (!busy.value && !editing.value) void load() })
type Offering = { offering_id: number; semester_id: number; major: string | null; course_code: string; course_name: string; professor: string | null; section: string }
const majors = ref<string[]>([]), major = ref<string | null>('')
const terms = ref<Semester[]>([]), offerings = ref<Offering[]>([]), meetings = ref<Meeting[]>([])
const semester = ref(0), editing = ref<number | null>(null), loading = ref(true), busy = ref(false), expanded = ref(false)
const error = ref(''), message = ref(''), formElement = ref<HTMLFormElement | null>(null)
const form = reactive({ course_offering_id: 0, day_of_week: 1, start_time: '', end_time: '', location: '' })
const choices = computed(() => offerings.value.filter(o => o.semester_id === semester.value && o.major === major.value))
const visible = computed(() => meetings.value.filter(m => m.semester_id === semester.value && m.major === major.value))
const professor = computed(() => choices.value.find(o => o.offering_id === form.course_offering_id)?.professor)
const validTimes = computed(() => Boolean(form.start_time && form.end_time && form.end_time > form.start_time))
const conflicts = computed(() => validTimes.value ? visible.value.filter(m => m.id !== editing.value && m.day_of_week === form.day_of_week && m.start_time.slice(0,5) < form.end_time && m.end_time.slice(0,5) > form.start_time) : [])
const overlaps = computed(() => conflicts.value.length > 0)
function cancel() {
  editing.value = null
  Object.assign(form, { course_offering_id: choices.value[0]?.offering_id ?? 0, start_time: '', end_time: '', location: '' })
}
watch(semester, cancel)
watch(major, cancel)
async function load() {
  loading.value = true; error.value = ''
  try {
    const [a,b,c,d] = await Promise.all([scheduleApi('admin/semesters'), scheduleApi('admin/course-assignments'), scheduleApi('admin/schedules'), scheduleApi('admin/majors')])
    majors.value = d.majors
    if (major.value !== null && !majors.value.includes(major.value)) major.value = majors.value[0] ?? ''
    terms.value = a.semesters; offerings.value = b.offerings; meetings.value = c.schedules
    if (!terms.value.some(t => t.id === semester.value)) semester.value = terms.value[0]?.id ?? 0
    if (!choices.value.some(o => o.offering_id === form.course_offering_id)) cancel()
  } catch(e) { error.value = e instanceof Error ? e.message : 'Unable to load schedules.' }
  finally { loading.value = false }
}
async function save() {
  if (busy.value || overlaps.value || !validTimes.value) return
  busy.value = true; error.value = ''; message.value = ''
  try {
    const result = await scheduleApi('admin/schedules' + (editing.value ? '/' + editing.value : ''), editing.value ? 'PUT' : 'POST', form)
    cancel(); await load(); if (!error.value) message.value = result.message + ' Students in this major and semester will see it when they open or refresh Schedule.'
  } catch(e) { error.value = e instanceof Error ? e.message : 'Unable to save.' }
  finally { busy.value = false }
}
async function edit(m: Meeting) {
  editing.value = m.id; Object.assign(form, { course_offering_id: m.course_offering_id, day_of_week: m.day_of_week, start_time: m.start_time.slice(0,5), end_time: m.end_time.slice(0,5), location: m.location })
  message.value = ''; await nextTick(); formElement.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }); formElement.value?.querySelector<HTMLSelectElement>('#meeting-day')?.focus({ preventScroll: true })
}
async function remove(m: Meeting) {
  if (busy.value) return
  busy.value = true; error.value = ''; message.value = ''
  try { await scheduleApi('admin/schedules/' + m.id, 'DELETE'); meetings.value = meetings.value.filter(row => row.id !== m.id); if (editing.value === m.id) cancel(); message.value = 'Class meeting removed.' }
  catch(e) { error.value = e instanceof Error ? e.message : 'Unable to remove meeting.' }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template>
  <section class="card planner" :class="{ expanded }" @keydown.esc="expanded = false">
    <div class="toolbar"><div><p class="eyebrow">WEEKLY PLANNING</p><h2>Class timetable</h2></div><div class="buttons"><button type="button" class="secondary" :aria-pressed="expanded" @click="expanded = !expanded"><StudentIcon name="expand" />{{ expanded ? 'Exit large view' : 'Large view' }}</button><button type="button" class="secondary" :disabled="busy || loading" @click="load"><StudentIcon name="refresh" />Refresh</button></div></div>
    <p class="muted">Choose a semester and major to plan that group's timetable. Different majors can have classes at the same time.</p>
    <p v-if="loading" role="status">Loading timetable…</p><p v-if="error" class="error" role="alert">{{ error }}</p><p v-if="message" class="success" role="status">{{ message }}</p>
    <template v-if="!loading && terms.length">
      <label for="schedule-term">Semester</label><select id="schedule-term" v-model="semester" :disabled="busy"><option v-for="t in terms" :key="t.id" :value="t.id">{{ t.name }} {{ t.academic_year }}</option></select>
      <label for="schedule-major">Major</label><select id="schedule-major" v-model="major" :disabled="busy"><option disabled value="">Choose a major</option><option v-for="name in majors" :key="name" :value="name">{{name}}</option><option v-if="offerings.some(o => o.major === null)" :value="null">Unassigned legacy courses</option></select>
      <form ref="formElement" class="meeting-form" @submit.prevent="save">
        <h3>{{ editing ? 'Edit class meeting' : 'Add a class meeting' }}</h3>
        <p v-if="!choices.length">Assign courses to this major and semester in Course Planning first, then press Refresh here.</p>
        <fieldset v-else :disabled="busy"><div class="fields"><label>Course<select v-model="form.course_offering_id" required :disabled="editing !== null"><option v-for="o in choices" :key="o.offering_id" :value="o.offering_id">{{ o.course_code }} · {{ o.course_name }} · Section {{ o.section }}</option></select></label><label>Weekday<select id="meeting-day" v-model="form.day_of_week"><option v-for="(day,i) in days" :key="day" :value="i+1">{{ day }}</option></select></label><label>Starts<input v-model="form.start_time" type="time" required></label><label>Ends<input v-model="form.end_time" type="time" required></label><label>Room / location<input v-model="form.location" maxlength="150" required placeholder="e.g. Building A, Room 302"></label></div>
        <p class="muted">{{ professor || 'Professor not assigned' }} · Campus local time</p><div v-if="overlaps" class="warning" role="status"><strong>Overlapping class in this semester:</strong><p v-for="conflict in conflicts" :key="conflict.id">{{ conflict.course_code }} · {{ conflict.course_name }} — {{ days[conflict.day_of_week - 1] }}, {{ conflict.start_time.slice(0,5) }}–{{ conflict.end_time.slice(0,5) }}</p></div><p v-else-if="form.start_time && form.end_time && !validTimes" class="warning">End time must be after start time.</p>
        <div class="buttons"><button :disabled="overlaps || !validTimes || !form.course_offering_id"><StudentIcon name="edit" />{{ busy ? 'Saving…' : editing ? 'Save changes' : 'Add meeting' }}</button><button v-if="editing" type="button" class="secondary" @click="cancel"><StudentIcon name="cancel" />Cancel edit</button></div></fieldset>
      </form>
      <div class="summary"><strong>{{ visible.length }} weekly meetings</strong><span>Overlapping times are blocked automatically.</span></div><WeeklySchedule :meetings="visible" editable :busy="busy" @edit="edit" @remove="remove" />
    </template><p v-else-if="!loading && !error">Create a semester to start planning classes.</p>
  </section>
</template>
<style scoped>
.planner{margin-top:24px}.toolbar,.buttons,.summary{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.toolbar h2{margin:0}.buttons button{font-size:13px;padding:11px 15px}.expanded{position:fixed;inset:16px;z-index:30;margin:0;overflow:auto;box-shadow:0 0 0 32px #20352deb}.meeting-form{margin:20px 0;padding:20px;background:#f6f9f8;border:1px solid #dae6e0;border-radius:12px}.meeting-form h3{margin:0 0 15px;font-size:17px}fieldset{border:0;padding:0;min-width:0}.fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px}label{display:block;margin:0;font-size:14px;font-weight:600}select,input{width:100%;min-width:0;margin-top:8px;padding:12px;border:1px solid #bfcfc8;border-radius:8px;background:#fff;color:#213b32;font:inherit}.summary{margin:22px 0 14px;font-size:13px}.summary span{color:#61736b}.success{padding:14px;background:#e8f5ed;border-radius:8px;color:#235d40}.warning{color:#854717;background:#fff2dc;padding:12px;border-radius:8px}button:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #518cbe;outline-offset:2px}@media(max-width:600px){.planner{padding:16px}.expanded{inset:6px}.meeting-form{padding:14px}}
</style>
