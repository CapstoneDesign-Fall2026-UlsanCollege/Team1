<script setup lang="ts">
import StudentIcon from './StudentIcon.vue'
import { apiFetch } from '../api'
import { onMounted, reactive, ref, watch } from 'vue'
import { scheduleApi, type Semester } from '../schedules'
const props = defineProps<{ revision?: number }>()
const semesters = ref<Semester[]>([]), semesterLoading = ref(false), semesterError = ref('')
const semesterStatus = ref(''), showPassword = ref(false)
async function loadSemesters() {
  if (semesterLoading.value) return
  semesterLoading.value = true; semesterError.value = ''; semesterStatus.value = ''
  try {
    const data = await scheduleApi('admin/semesters')
    if (!Array.isArray(data.semesters)) throw new Error('Unable to read the semester list. Please retry.')
    semesters.value = data.semesters
    if (form.semester_id !== null && !semesters.value.some(t => t.id === form.semester_id)) {
      form.semester_id = null
      semesterStatus.value = 'The selected semester is no longer available. Choose another semester or assign later.'
    } else semesterStatus.value = `Semester list updated · ${semesters.value.length} available.`
  }
  catch(e) { semesterError.value = e instanceof Error ? e.message : 'Unable to load semesters.' }
  finally { semesterLoading.value = false }
}
onMounted(loadSemesters)
watch(() => props.revision, loadSemesters)

const emit = defineEmits<{ expired: []; saving: [value: boolean]; created: [] }>()
const emptyForm = () => ({
  login_id: '', password: '', full_name: '', university: 'Ulsan College',
  major: '', year_of_study: 1, email: '', phone_number: '', address: '',
  semester_id: null as number | null,
})
const form = reactive(emptyForm())
const saving = ref(false)
const error = ref('')
const success = ref('')

async function submit() {
  if (saving.value || semesterLoading.value) return
  if (form.semester_id !== null && (semesterError.value || !semesters.value.some(t => t.id === form.semester_id))) {
    error.value = 'Refresh the semester list before creating this student.'; return
  }
  error.value = ''; success.value = ''
  if (new TextEncoder().encode(form.password).length > 72) {
    error.value = 'Password must be at most 72 UTF-8 bytes. Use fewer characters.'
    return
  }
  saving.value = true; emit('saving', true)
  try {
    const response = await apiFetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1' },
      body: JSON.stringify(form),
    })
    const data = await response.json().catch(() => ({ message: 'The backend is unavailable. Please try again.' }))
    if (response.status === 401) { emit('expired'); return }
    if (!response.ok) throw new Error(data.message || 'Could not create student.')
    success.value = `Created ${data.student.full_name} (${data.student.login_id}). They can now log in with the password you assigned.`
    const term = semesters.value.find(t => t.id === form.semester_id)
    if (term) success.value += ` Assigned to ${term.name} ${term.academic_year}.`
    Object.assign(form, emptyForm())
    emit('created')
  } catch (e) {
    error.value = e instanceof TypeError
      ? 'Connection lost. Creation may have completed. Check before retrying; duplicate IDs will be rejected.'
      : e instanceof Error ? e.message : 'Could not create student.'
  } finally {
    form.password = ''
    showPassword.value = false
    saving.value = false; emit('saving', false)
  }
}
</script>

<template>
  <section class="card student-create" aria-labelledby="create-student-heading">
    <p class="eyebrow">STUDENT ACCOUNTS</p>
    <h2 id="create-student-heading">Create a student account</h2>
    <p class="muted">Assign a login ID and add their profile. Fields marked * are required.</p>
    <p v-if="success" class="success" role="status">{{ success }}</p>
    <form @submit.prevent="submit">
      <fieldset :disabled="saving" :aria-busy="saving">
        <legend>1 · Account details</legend>
        <div class="form-grid">
          <div><label for="student-id">Student ID *</label><input id="student-id" v-model="form.login_id" required maxlength="50" pattern="[A-Za-z0-9_-]+" autocomplete="off" aria-describedby="student-id-help"><small id="student-id-help">Letters, numbers, underscores or hyphens.</small></div>
          <div><label for="student-password">Initial password *</label><div class="password-control"><input id="student-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required minlength="12" maxlength="72" autocomplete="new-password" aria-describedby="student-password-help"><button type="button" class="secondary" :aria-pressed="showPassword" @click="showPassword = !showPassword">{{showPassword ? 'Hide' : 'Show'}}</button></div><small id="student-password-help">At least 12 characters; maximum 72 UTF-8 bytes. Share privately with the student.</small></div>
        </div>
      </fieldset>
      <fieldset :disabled="saving">
        <legend>2 · Student & academic details</legend>
        <div class="form-grid">
          <div><label for="student-name">Full name *</label><input id="student-name" v-model="form.full_name" required maxlength="150" autocomplete="off"></div>
          <div><label for="student-university">University *</label><input id="student-university" v-model="form.university" required maxlength="150" autocomplete="off"></div>
          <div><label for="student-major">Major *</label><input id="student-major" v-model="form.major" required maxlength="150"></div>
          <div><label for="student-year">Year of study *</label><input id="student-year" v-model.number="form.year_of_study" type="number" required min="1" max="255" step="1"></div>
          <div class="full-width"><label for="initial-semester">Semester</label>
            <div class="semester-control"><select id="initial-semester" v-model="form.semester_id" :disabled="semesterLoading || !!semesterError"><option :value="null">Assign later</option><option v-for="term in semesters" :key="term.id" :value="term.id">{{term.name}} {{term.academic_year}}</option></select><button type="button" class="secondary" :disabled="semesterLoading" @click="loadSemesters"><StudentIcon name="refresh" />{{semesterLoading ? 'Refreshing…' : 'Refresh list'}}</button></div>
            <small>The student receives this semester’s courses and timetable automatically.</small>
            <p v-if="semesterLoading" role="status">Loading semesters…</p><p v-else-if="semesterError" class="error" role="alert">{{semesterError}}</p><p v-else-if="!semesters.length" class="muted">Create a semester below, or choose Assign later.</p>
            <p v-if="semesterStatus" class="semester-status" role="status">{{semesterStatus}}</p>
          </div>
        </div>
      </fieldset>
      <fieldset :disabled="saving">
        <legend>3 · Contact details <span class="optional">Optional</span></legend>
        <div class="form-grid">
          <div><label for="student-email">Email</label><input id="student-email" v-model="form.email" type="email" maxlength="254" autocomplete="off"></div>
          <div><label for="student-phone">Phone number</label><input id="student-phone" v-model="form.phone_number" type="tel" maxlength="30" autocomplete="off"></div>
          <div class="full-width"><label for="student-address">Address</label><textarea id="student-address" v-model="form.address" rows="2" maxlength="500" autocomplete="off"></textarea></div>
        </div>
      </fieldset>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="create-actions"><span>Account and semester assignment save together.</span><button :disabled="saving || semesterLoading || (!!semesterError && form.semester_id !== null)"><StudentIcon name="save" />{{ saving ? 'Creating student…' : 'Create student' }}</button></div>
    </form>
  </section>
</template>
<style scoped>
.student-create .password-control button{min-width:64px;width:auto;margin:6px 0 0}.student-create .password-control input{width:0;flex:1}.student-create .semester-control button{min-width:0;width:auto;margin-top:6px}
.student-create fieldset{padding:18px;border:1px solid #d8e4dd;border-radius:12px;margin:22px 0}.student-create legend{padding:0 8px;font-size:15px}.student-create .form-grid{gap:16px 22px}.student-create label{margin-top:0}.student-create input{margin-top:6px}.student-create small{display:block;line-height:1.5;margin-top:6px;color:#63766b}.password-control,.semester-control{display:flex;align-items:center;gap:10px}.password-control input,.semester-control select{flex:1;min-width:0}.password-control button,.semester-control button{flex-shrink:0;padding:12px 16px;font-size:13px}.optional{font-size:12px;font-weight:400;color:#63766b;margin-left:8px}.semester-status{color:#2d6650;font-size:13px;margin:8px 0 0}.create-actions{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.create-actions span{font-size:13px;color:#63766b}@media(max-width:550px){.student-create fieldset{padding:12px}.semester-control{flex-wrap:wrap}.semester-control select{flex-basis:100%}.create-actions button{width:100%}}
select{display:block;width:100%;padding:14px;margin:6px 0;border:1px solid #bacdc3;border-radius:8px;background:white;color:#263b32;font:inherit}
</style>
