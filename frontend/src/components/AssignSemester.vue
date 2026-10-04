<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { scheduleApi, type Semester } from '../schedules'
const props = defineProps<{ revision?: number }>()
const emit = defineEmits<{ assigned: [] }>()
const semesters = ref<Semester[]>([]), loading = ref(false), loadError = ref('')
async function load() {
  loading.value = true; loadError.value = ''
  try { semesters.value = (await scheduleApi('admin/semesters')).semesters; if (!semesters.value.some(s => s.id === semester.value)) semester.value = undefined }
  catch(e) { loadError.value = e instanceof Error ? e.message : 'Unable to load semesters.' }
  finally { loading.value = false }
}
onMounted(load)
watch(() => props.revision, load)
const student=ref(''); const semester=ref<number>(); const error=ref(''); const success=ref(''); const busy=ref(false)
async function submit(){if(busy.value||loading.value||loadError.value||!semester.value)return;error.value='';success.value='';busy.value=true;try{await scheduleApi('admin/semester-assignments','POST',{login_id:student.value.trim(),semester_id:semester.value});const selected=semesters.value.find(s=>s.id===semester.value);success.value=`Student assigned to ${selected?.name} ${selected?.academic_year}.`;emit('assigned')}catch(e){error.value=e instanceof Error?e.message:'Unable to assign'}finally{busy.value=false}}
</script>
<template>
  <section class="card semester-create">
    <p class="eyebrow">ENROLLMENT</p><h2>Assign student to semester</h2><p class="muted">Enter the student login ID and choose a semester.</p>
    <form @submit.prevent="submit">
      <label>Student login ID<input v-model="student" required maxlength="50" :disabled="busy"></label>
      <label>Semester<select v-model="semester" required :disabled="busy || loading || !!loadError"><option disabled :value="undefined">{{ loading ? 'Loading semesters…' : 'Choose a semester' }}</option><option v-for="term in semesters" :key="term.id" :value="term.id">{{ term.name }} {{ term.academic_year }}</option></select></label>
      <p v-if="loadError" class="error" role="alert">{{ loadError }}</p><p v-else-if="!loading && !semesters.length" class="muted">Create a semester above to assign students.</p>
      <button type="button" class="secondary refresh" :disabled="busy || loading" @click="load">Refresh semesters</button>
      <p v-if="error" class="error" role="alert">{{error}}</p><p v-if="success" class="success" role="status">{{success}}</p>
      <button :disabled="busy || loading || !!loadError || !semester">{{busy?'Assigning…':'Assign student'}}</button>
    </form>
  </section>
</template>
<style scoped>
select{display:block;width:100%;padding:14px;margin-top:6px;border:1px solid #bacdc3;border-radius:8px;background:white;color:#263b32;font:inherit}.refresh{font-size:13px;margin:12px 0 20px;padding:10px 14px}
</style>
