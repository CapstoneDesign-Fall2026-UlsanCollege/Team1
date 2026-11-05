<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { scheduleApi } from '../schedules'
const emit = defineEmits<{ open: [page: 'course' | 'schedule'] }>()
const loading = ref(true), error = ref('')
const data = ref<{ school: { name: string; level: string } | null; today: string; membership: { year_name: string; grade_label: string; class_name: string; starts_on: string } | null } | null>(null)
async function load() {
  loading.value = true; error.value = ''; data.value = null
  try { data.value = await scheduleApi('student/school') }
  catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load your class.' }
  finally { loading.value = false }
}
onMounted(load)
</script>
<template>
  <section class="student-panel">
    <div class="heading"><h2>My class</h2><button type="button" class="secondary" :disabled="loading" @click="load">Refresh</button></div>
    <p v-if="loading" role="status">Loading your class…</p><p v-else-if="error" class="error" role="alert">{{ error }}</p>
    <template v-else-if="data">
      <p v-if="!data.school">Your school class information has not been set up. Contact your administrator.</p>
      <template v-else><p>{{ data.school.name }} · {{ data.school.level === 'middle' ? 'Middle school' : 'High school' }}</p>
        <template v-if="data.membership"><h3>Grade {{ data.membership.grade_label }} · Class {{ data.membership.class_name }}</h3><p>Academic year: {{ data.membership.year_name }}</p><p>Member from {{ data.membership.starts_on }}</p><div class="class-actions"><button type="button" @click="emit('open', 'course')">View subjects</button><button type="button" class="secondary" @click="emit('open', 'schedule')">View timetable</button></div></template>
        <p v-else>No class membership is effective for you today ({{ data.today }}). Contact your administrator if your assignment needs updating.</p>
      </template>
    </template>
  </section>
</template>
<style scoped>
.heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.heading h2{margin:0}.heading button{width:auto}.student-panel{overflow-wrap:anywhere}.student-panel p{line-height:1.6}.class-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.class-actions button{width:auto;font-size:14px;padding:12px 16px}
</style>
