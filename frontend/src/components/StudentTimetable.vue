<script setup lang="ts">
import EnglishDateInput from './EnglishDateInput.vue'
import {nepalCalendarToday} from '../english-calendar'
import {days} from '../schedules'
import { computed, onMounted, ref } from 'vue'
import { scheduleApi, type Meeting, type Semester } from '../schedules'
import WeeklySchedule from './WeeklySchedule.vue'
const terms = ref<Semester[]>([]), meetings = ref<Meeting[]>([]), semester = ref(0)
const loading = ref(true), error = ref(''), schoolMode = ref(false)
const date=ref(nepalCalendarToday()),day=ref(0),usualRoom=ref('')
const selectedWeekday=computed(()=>new Date(date.value+'T00:00:00Z').getUTCDay()||7)
const dayChoices=computed(()=>schoolMode.value?[7,1,2,3,4,5,...(visible.value.some(m=>m.day_of_week===6)||day.value===6?[6]:[])]:[1,2,3,4,5,6,7])
async function dateChanged(){day.value=selectedWeekday.value;await load(true)}
const visible = computed(() => meetings.value.filter(m => m.semester_id === semester.value))
async function load(forDate=false) {
  loading.value = true; error.value = ''
  try {
    const [a,b] = await Promise.all([scheduleApi('student/semesters?date='+encodeURIComponent(date.value)), scheduleApi('student/schedule?date='+encodeURIComponent(date.value))])
    terms.value = a.semesters; meetings.value = b.schedules; schoolMode.value = Boolean(a.school_mode);usualRoom.value=b.usual_room??''
    if(forDate||!terms.value.some(t=>t.id===semester.value)){const active=schoolMode.value?terms.value.find(t=>(t as any).start_date<=date.value&&(t as any).end_date>=date.value):undefined;semester.value=active?.id??(forDate&&schoolMode.value?0:terms.value[0]?.id??0)}
  } catch(e) { error.value = e instanceof Error ? e.message : 'Unable to load your timetable.' }
  finally { loading.value = false }
}
onMounted(load)
</script>
<template>
  <section class="timetable">
    <div class="heading"><h2>Your weekly timetable</h2><button :disabled="loading" @click="load()">Refresh</button></div>
    <p class="note">{{ schoolMode ? 'Subjects match your effective school class membership and linked term.' : 'Classes match your major and assigned semester.' }} Meetings repeat weekly in {{ schoolMode ? 'Nepal time (NPT)' : 'Korea time' }}.</p>
    <div v-if="schoolMode" class="date-controls"><label>View on date<EnglishDateInput v-model="date" type="date" min="2000-01-01" max="2200-12-31" required :disabled="loading" @change="dateChanged" /></label><button type="button" class="secondary" :disabled="loading" @click="date=nepalCalendarToday();dateChanged()">Today</button></div><p v-if="loading" role="status">Loading your classes…</p>
    <p v-else-if="error" class="error" role="alert">{{ error }}</p>
    <template v-else>
      <p v-if="!terms.length">{{ schoolMode ? 'No school terms are available for your current class membership. Contact your administrator.' : 'You have not been assigned to a semester yet.' }}</p>
      <template v-else><label for="student-schedule-term">{{schoolMode?'School term':'Semester'}}</label><select id="student-schedule-term" v-model="semester"><option v-if="!semester" :value="0" disabled>No active term on this date</option><option v-for="t in terms" :key="t.id" :value="t.id">{{ t.name }}{{schoolMode?'':' '+t.academic_year}}</option></select>
      <p class="note">{{ visible.length }} class meetings each week<span v-if="visible[0]?.major"> · {{visible[0].major}}</span></p><p v-if="!visible.length">{{ schoolMode ? (!semester?'No school term is active on this date. Choose a term to review its weekly routine.':'No meetings are linked to your class in this term yet.') : 'No classes are scheduled for your major in this semester.' }}</p><template v-else><div class="day-tabs" role="group" aria-label="Timetable day"><button type="button" :aria-pressed="day===0" @click="day=0">All days</button><button v-for="d in dayChoices" :key="d" type="button" :aria-pressed="day===d" @click="day=d">{{days[d-1]}}</button></div><p v-if="day" class="note">Showing {{days[day-1]}}. Matching days share this timetable.</p><WeeklySchedule :meetings="visible" :school="schoolMode" :day="day" :usual-room="usualRoom" compact /></template></template>
    </template>
  </section>
</template>
<style scoped>
.heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.heading h2{font-size:18px;margin:0}.heading button{font-size:13px;background:#edf3fc;color:#315487;padding:10px 14px}.note{color:#63738b;font-size:13px;line-height:1.6}label{display:block;font-weight:600;font-size:14px}select{width:100%;padding:12px;border:1px solid #bccade;border-radius:8px;background:white;color:#263349;margin-top:8px;font:inherit}
.date-controls{display:flex;align-items:end;gap:10px;flex-wrap:wrap;margin:16px 0}.date-controls label{width:210px;font-size:13px;margin:0}.date-controls button{min-height:44px;margin:0;padding:10px 14px;font-size:13px}.date-controls :deep(.english-date-field){margin-top:6px}.date-controls :deep(.english-date-field>input){height:44px;margin:0}.day-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0}.day-tabs button{min-height:44px;min-width:0;margin:0;padding:9px 12px;font-size:13px;border-radius:8px;background:#edf4ef;color:#365b49}.day-tabs button[aria-pressed=true]{background:#38624f;color:white}.day-tabs button:focus-visible,.date-controls button:focus-visible{outline:2px solid #21896f;outline-offset:2px}@media(max-width:500px){.day-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.day-tabs button{width:100%;font-size:12px;padding:9px 3px}}
</style>
