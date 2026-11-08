<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { scheduleApi, type Meeting, type Semester } from '../schedules'
import WeeklySchedule from './WeeklySchedule.vue'
const terms = ref<Semester[]>([]), meetings = ref<Meeting[]>([]), semester = ref(0)
const loading = ref(true), error = ref(''), schoolMode = ref(false)
const visible = computed(() => meetings.value.filter(m => m.semester_id === semester.value))
async function load() {
  loading.value = true; error.value = ''
  try {
    const [a,b] = await Promise.all([scheduleApi('student/semesters'), scheduleApi('student/schedule')])
    terms.value = a.semesters; meetings.value = b.schedules; schoolMode.value = Boolean(a.school_mode)
    if (!terms.value.some(t => t.id === semester.value)) semester.value = terms.value[0]?.id ?? 0
  } catch(e) { error.value = e instanceof Error ? e.message : 'Unable to load your timetable.' }
  finally { loading.value = false }
}
onMounted(load)
</script>
<template>
  <section class="timetable">
    <div class="heading"><h2>Your weekly timetable</h2><button :disabled="loading" @click="load">Refresh</button></div>
    <p class="note">{{ schoolMode ? 'Subjects match your effective school class membership and linked term.' : 'Classes match your major and assigned semester.' }} Meetings repeat weekly in {{ schoolMode ? 'Nepal time (NPT)' : 'Korea time' }}.</p>
    <p v-if="loading" role="status">Loading your classes…</p>
    <p v-else-if="error" class="error" role="alert">{{ error }}</p>
    <template v-else>
      <p v-if="!terms.length">{{ schoolMode ? 'No school terms are available for your current class membership. Contact your administrator.' : 'You have not been assigned to a semester yet.' }}</p>
      <template v-else><label for="student-schedule-term">{{schoolMode?'School term':'Semester'}}</label><select id="student-schedule-term" v-model="semester"><option v-for="t in terms" :key="t.id" :value="t.id">{{ t.name }}{{schoolMode?'':' '+t.academic_year}}</option></select>
      <p class="note">{{ visible.length }} class meetings each week<span v-if="visible[0]?.major"> · {{visible[0].major}}</span></p><p v-if="!visible.length">{{ schoolMode ? 'No meetings are linked to your class in this term yet.' : 'No classes are scheduled for your major in this semester.' }}</p><WeeklySchedule v-else :meetings="visible" :school="schoolMode" /></template>
    </template>
  </section>
</template>
<style scoped>
.heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.heading h2{font-size:18px;margin:0}.heading button{font-size:13px;background:#edf3fc;color:#315487;padding:10px 14px}.note{color:#63738b;font-size:13px;line-height:1.6}label{display:block;font-weight:600;font-size:14px}select{width:100%;padding:12px;border:1px solid #bccade;border-radius:8px;background:white;color:#263349;margin-top:8px;font:inherit}
</style>
