<script setup lang="ts">
import { studentIdPrefix, schoolStudentId } from '../student-id'
import StudentIcon from './StudentIcon.vue'
import { apiFetch } from '../api'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { scheduleApi, type Semester } from '../schedules'
const props = defineProps<{ revision?: number; initialClass?: number }>()
const context=ref<any>(null),schoolYear=ref(0),grade=ref(''),classId=ref(0),startsOn=ref('')
const roomData=ref<any>(null),roomError=ref('')
const selectedClass=computed(()=>classChoices.value.find((c:any)=>c.id===classId.value))
const studentNumber=ref('')
const idPrefix=computed(()=>studentIdPrefix(startsOn.value,grade.value,selectedClass.value?.name??''))
const studentLoginId=computed(()=>schoolMode.value?schoolStudentId(idPrefix.value,studentNumber.value):form.login_id)
const classroom=computed(()=>roomData.value?.assignments.find((a:any)=>a.class_id===classId.value&&a.year_id===schoolYear.value)?.room_number)
const homeroom=computed(()=>{
  const c=context.value
  if(!c||!classId.value||!startsOn.value)return 'Choose a class and enrollment date'
  const terms=c.terms.filter((t:any)=>t.year_id===schoolYear.value&&t.start_date<=startsOn.value&&t.end_date>=startsOn.value)
  if(!terms.length)return 'No active term on this date'
  const subjects=c.subjects.filter((s:any)=>terms.some((t:any)=>t.id===s.semester_id)&&c.links.some((l:any)=>l.class_id===classId.value&&l.offering_id===s.id))
  const first=subjects.filter((s:any)=>c.meetings.some((m:any)=>m.course_offering_id===s.id&&m.day_of_week===7&&m.start_time.slice(0,5)==='10:00'))
  const ids=[...new Set(first.flatMap((s:any)=>c.subject_teachers.filter((a:any)=>a.offering_id===s.id).map((a:any)=>a.teacher_id)))]
  if(ids.length>1)return 'Conflicting first lessons — review timetable'
  if(first.some((s:any)=>!c.subject_teachers.some((a:any)=>a.offering_id===s.id)))return 'First lesson teacher not assigned'
  const teacher=c.teachers.find((t:any)=>t.id===ids[0])
  return teacher?(teacher.is_active?teacher.name:teacher.name+' · Inactive'):'Not assigned'
})
async function loadRooms(){
  roomError.value='';roomData.value=null
  try{roomData.value=await scheduleApi('admin/school/rooms')}
  catch{roomError.value='Room information unavailable'}
}
function generatePassword(){
  const bytes=crypto.getRandomValues(new Uint8Array(18))
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  form.password=Array.from(bytes,b=>alphabet[b%alphabet.length]).join('')
  showPassword.value=true
}
const schoolMode=computed(()=>Boolean(context.value?.profile))
const activeClasses=computed(()=>context.value?.classes.filter((c:any)=>c.year_id===schoolYear.value&&c.is_active)??[])
const grades=computed<string[]>(()=>[...new Set<string>(activeClasses.value.map((c:any)=>c.grade_label))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})))
const classChoices=computed(()=>activeClasses.value.filter((c:any)=>c.grade_label===grade.value))
const enrollmentYear=computed(()=>context.value?.years.find((y:any)=>y.id===schoolYear.value))
function chooseYear(){grade.value='';classId.value=0;const y=enrollmentYear.value,today=context.value?.today;startsOn.value=y?(today<y.start_date?y.start_date:today>y.end_date?y.end_date:today):''}
function preselect(){const cl=context.value?.classes.find((c:any)=>c.id===props.initialClass&&c.is_active);if(cl){schoolYear.value=cl.year_id;chooseYear();grade.value=cl.grade_label;classId.value=cl.id}}
watch(()=>props.initialClass,preselect)
const semesters = ref<Semester[]>([]), semesterLoading = ref(false), semesterError = ref('')
const semesterStatus = ref(''), showPassword = ref(false)
async function loadSemesters() {
  if (semesterLoading.value) return
  semesterLoading.value = true; semesterError.value = ''; semesterStatus.value = ''
  try {
    const school=await scheduleApi('admin/school');context.value=school
    if(school.profile){
      void loadRooms()
      if(!school.years.some((y:any)=>y.id===schoolYear.value)){schoolYear.value=school.years.find((y:any)=>y.start_date<=school.today&&y.end_date>=school.today)?.id??school.years[0]?.id??0;chooseYear()}
      if(!activeClasses.value.some((c:any)=>c.id===classId.value)){classId.value=0;preselect()}
      return
    }
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
  login_id: '', password: '', full_name: '', university: 'Mahendra School',
  major: '', year_of_study: 1, email: '', phone_number: '', address: '',
  semester_id: null as number | null,
})
const form = reactive(emptyForm())
const saving = ref(false)
const error = ref('')
const success = ref('')
let successTimer:ReturnType<typeof setTimeout>|undefined
watch(success,value=>{clearTimeout(successTimer);if(value)successTimer=setTimeout(()=>{success.value=''},4000)})
onUnmounted(()=>clearTimeout(successTimer))

async function submit(event:SubmitEvent) {
  const keepClass=(event.submitter as HTMLButtonElement|null)?.value==='another'
  if (saving.value || semesterLoading.value) return
  if (!schoolMode.value && form.semester_id !== null && (semesterError.value || !semesters.value.some(t => t.id === form.semester_id))) {
    error.value = 'Refresh the semester list before creating this student.'; return
  }
  error.value = ''; success.value = ''
  if (new TextEncoder().encode(form.password).length > 72) {
    error.value = 'Password must be at most 72 UTF-8 bytes. Use fewer characters.'
    return
  }
  if(schoolMode.value&&(!classId.value||!startsOn.value)){error.value='Choose a class and enrollment date.';return}
  if(schoolMode.value&&!studentLoginId.value){error.value='Choose a grade (1–12), section (A–I), valid enrollment date and student number (001–999).';return}
  saving.value = true; emit('saving', true)
  try {
    const response = await apiFetch(schoolMode.value?'/api/admin/school/students':'/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1' },
      body: JSON.stringify(schoolMode.value?{login_id:studentLoginId.value,password:form.password,full_name:form.full_name,email:form.email,phone_number:form.phone_number,address:form.address,class_id:classId.value,starts_on:startsOn.value,revision:context.value.revision}:form),
    })
    const data = await response.json().catch(() => ({ message: 'The backend is unavailable. Please try again.' }))
    if (response.status === 401) { emit('expired'); return }
    if (!response.ok) throw new Error(data.message || 'Could not create student.')
    success.value = `Created ${data.student.full_name} (${data.student.login_id}). They can now log in with the password you assigned.`
    if(schoolMode.value){const cl=classChoices.value.find((c:any)=>c.id===classId.value);success.value+=` Enrolled in Grade ${grade.value} · Class ${cl?.name} from ${startsOn.value}.`}
    const term = semesters.value.find(t => t.id === form.semester_id)
    if (term) success.value += ` Assigned to ${term.name} ${term.academic_year}.`
    Object.assign(form, emptyForm())
    studentNumber.value=''
    emit('created');await loadSemesters()
    if(!keepClass&&schoolMode.value){grade.value='';classId.value=0}
    await nextTick()
    document.getElementById('student-name')?.focus()
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
    <p v-if="semesterError" class="error" role="alert">{{semesterError}} <button type="button" class="secondary" @click="loadSemesters">Retry</button></p>
    <p v-if="semesterLoading" role="status">Loading school information…</p>
    <form v-if="!semesterLoading&&!semesterError" @submit.prevent="submit">
      <fieldset :disabled="saving">
        <legend>1 · Student & class</legend><button v-if="schoolMode" type="button" class="secondary refresh-choices" @click="loadSemesters">Refresh class choices</button>
        <div class="form-grid">
          <div><label for="student-name">Full name *</label><input id="student-name" v-model="form.full_name" required maxlength="150" autocomplete="off"></div>
          <template v-if="!schoolMode"><div><label for="student-university">University *</label><input id="student-university" v-model="form.university" required maxlength="150" autocomplete="off"></div>
          <div><label for="student-major">Major *</label><input id="student-major" v-model="form.major" required maxlength="150"></div>
          <div><label for="student-year">Year of study *</label><input id="student-year" v-model.number="form.year_of_study" type="number" required min="1" max="255" step="1"></div>
          </template><template v-if="schoolMode"><div><label>School<input :value="context.profile.name" disabled></label></div><div><label>Academic year *<select v-model="schoolYear" required @change="chooseYear"><option :value="0" disabled>Choose a year</option><option v-for="y in context.years" :key="y.id" :value="y.id">{{y.name}}</option></select></label></div><div><label>Grade *<select v-model="grade" required @change="classId=0"><option value="" disabled>Choose a grade</option><option v-for="g in grades" :key="g" :value="g">Grade {{g}}</option></select></label></div><div><label>Class *<select v-model="classId" required><option :value="0" disabled>Choose a class</option><option v-for="cl in classChoices" :key="cl.id" :value="cl.id">Class {{cl.name}}</option></select></label></div><div><label>Enrollment date *<input v-model="startsOn" type="date" required :min="enrollmentYear?.start_date" :max="enrollmentYear?.end_date"></label></div><div v-if="selectedClass" class="class-preview full-width" aria-live="polite"><div><span>Classroom</span><strong>{{roomError||(classroom?'Room '+classroom:roomData?'Not assigned':'Loading…')}}</strong><button v-if="roomError" type="button" class="secondary" @click="loadRooms">Retry room information</button></div><div><span>Homeroom teacher</span><strong>{{homeroom}}</strong><small>Sunday’s 10 AM teacher · term active on enrollment date</small></div></div><p class="muted full-width">The account and class enrollment save together. Subjects follow this class’s saved timetable from the enrollment date.</p><p v-if="!activeClasses.length" class="muted full-width">Create an active class in School classes before enrolling a student.</p></template>
          <div v-if="!schoolMode" class="full-width"><label for="initial-semester">Semester</label>
            <div class="semester-control"><select id="initial-semester" v-model="form.semester_id" :disabled="semesterLoading || !!semesterError"><option :value="null">Assign later</option><option v-for="term in semesters" :key="term.id" :value="term.id">{{term.name}} {{term.academic_year}}</option></select><button type="button" class="secondary" :disabled="semesterLoading" @click="loadSemesters"><StudentIcon name="refresh" />{{semesterLoading ? 'Refreshing…' : 'Refresh list'}}</button></div>
            <small>The student receives this semester’s courses and timetable automatically.</small>
            <p v-if="semesterLoading" role="status">Loading semesters…</p><p v-else-if="semesterError" class="error" role="alert">{{semesterError}}</p><p v-else-if="!semesters.length" class="muted">Create a semester below, or choose Assign later.</p>
            <p v-if="semesterStatus" class="semester-status" role="status">{{semesterStatus}}</p>
          </div>
        </div>
      </fieldset>
      <fieldset :disabled="saving" :aria-busy="saving">
        <legend>2 · Login details</legend>
        <div class="form-grid">
          <div v-if="schoolMode" class="school-student-id">
            <label for="student-number">Student number *</label>
            <div class="student-id-control"><span class="id-prefix" aria-label="Automatic ID prefix">{{idPrefix||'— — —'}}</span><input id="student-number" v-model="studentNumber" type="text" inputmode="numeric" required pattern="0*[1-9][0-9]*" maxlength="3" placeholder="061" autocomplete="off" aria-describedby="student-id-help" @blur="studentNumber=/^\d{1,3}$/.test(studentNumber)?studentNumber.padStart(3,'0'):studentNumber"></div>
            <small id="student-id-help">First five digits: enrollment year + grade + section (A=1, B=2, … I=9). Enter student number 001–999.</small>
            <p class="id-preview" aria-live="polite">Student ID: <strong>{{studentLoginId||'Complete the class details and student number'}}</strong></p>
            <small v-if="selectedClass&&!idPrefix" class="error">This ID format supports grades 1–12 and sections A–I. Review the selected class or enrollment date.</small>
            <small>This becomes the login ID and stays unchanged after class transfers. Existing IDs are not renamed.</small>
          </div>
          <div v-else><label for="student-id">Student ID *</label><input id="student-id" v-model="form.login_id" required maxlength="50" pattern="[A-Za-z0-9_-]+" autocomplete="off" aria-describedby="student-id-help"><small id="student-id-help">Letters, numbers, underscores or hyphens.</small></div>
          <div><label for="student-password">Initial password *</label><div class="password-control"><input id="student-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required minlength="12" maxlength="72" autocomplete="new-password" aria-describedby="student-password-help"><button type="button" class="secondary" :aria-pressed="showPassword" @click="showPassword = !showPassword">{{showPassword ? 'Hide' : 'Show'}}</button></div><button type="button" class="secondary generate-password" @click="generatePassword">Generate password</button><small id="student-password-help">At least 12 characters; maximum 72 UTF-8 bytes. Share privately with the student.</small></div>
        </div>
      </fieldset>
      <details class="optional-contact"><summary>Student contact details (optional)</summary><fieldset :disabled="saving">
        <legend>Student contact details</legend>
        <div class="form-grid">
          <div><label for="student-email">Email</label><input id="student-email" v-model="form.email" type="email" maxlength="254" autocomplete="off"></div>
          <div><label for="student-phone">Phone number</label><input id="student-phone" v-model="form.phone_number" type="tel" maxlength="30" autocomplete="off"></div>
          <div class="full-width"><label for="student-address">Address</label><textarea id="student-address" v-model="form.address" rows="2" maxlength="500" autocomplete="off"></textarea></div>
        </div>
      </fieldset>
      </details>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="create-actions"><span>{{schoolMode?'Account and class enrollment save together.':'Account and semester assignment save together.'}}</span><div class="save-buttons"><button type="submit" :disabled="saving || semesterLoading || !!semesterError || (schoolMode&&(!classId||!studentLoginId))" value="create"><StudentIcon name="save" />{{ saving ? 'Creating student…' : 'Create student' }}</button><button type="submit" class="secondary" :disabled="saving || semesterLoading || !!semesterError || (schoolMode&&(!classId||!studentLoginId))" value="another">Save &amp; add another</button></div></div>
    </form>
  </section>
</template>
<style scoped>
.student-id-control{display:flex;align-items:stretch;margin-top:6px}.id-prefix{display:flex;align-items:center;padding:10px 14px;background:#eaf2ed;border:1px solid #bacdc3;border-right:0;border-radius:8px 0 0 8px;font:600 18px monospace;letter-spacing:2px}.student-create .student-id-control input{min-width:0;width:100%;margin:0;border-radius:0 8px 8px 0;flex:1}.id-preview{font-size:13px;margin:10px 0;overflow-wrap:anywhere}
.class-preview{display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#eef4f0;border-radius:10px;padding:12px}.class-preview span,.class-preview strong{display:block}.class-preview span{font-size:12px;color:#63766b;margin-bottom:5px}.class-preview strong{font-size:14px}.save-buttons{display:flex;gap:10px;flex-wrap:wrap}.student-create .generate-password{width:auto;padding:7px 12px;font-size:12px;margin-top:8px}.student-create fieldset{min-width:0}.password-control{min-width:0}@media(max-width:550px){.class-preview{grid-template-columns:1fr}.save-buttons{width:100%}}

.optional-contact{border:1px solid #d8e4dd;border-radius:10px;padding:14px;margin:18px 0}.optional-contact summary{cursor:pointer;font-size:14px;color:#476c58}.student-create .optional-contact fieldset{border:0;padding:12px 0 0;margin:0}.optional-contact legend{display:none}.refresh-choices{padding:8px 12px;font-size:12px;margin-bottom:14px}

.student-create .password-control button{min-width:64px;width:auto;margin:6px 0 0}.student-create .password-control input{width:0;flex:1}.student-create .semester-control button{min-width:0;width:auto;margin-top:6px}
.student-create fieldset{padding:18px;border:1px solid #d8e4dd;border-radius:12px;margin:22px 0}.student-create legend{padding:0 8px;font-size:15px}.student-create .form-grid{gap:16px 22px}.student-create label{margin-top:0}.student-create input{margin-top:6px}.student-create small{display:block;line-height:1.5;margin-top:6px;color:#63766b}.password-control,.semester-control{display:flex;align-items:center;gap:10px}.password-control input,.semester-control select{flex:1;min-width:0}.password-control button,.semester-control button{flex-shrink:0;padding:12px 16px;font-size:13px}.optional{font-size:12px;font-weight:400;color:#63766b;margin-left:8px}.semester-status{color:#2d6650;font-size:13px;margin:8px 0 0}.create-actions{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.create-actions span{font-size:13px;color:#63766b}@media(max-width:550px){.student-create fieldset{padding:12px}.semester-control{flex-wrap:wrap}.semester-control select{flex-basis:100%}.create-actions button{width:100%}}
select{display:block;width:100%;padding:14px;margin:6px 0;border:1px solid #bacdc3;border-radius:8px;background:white;color:#263b32;font:inherit}
</style>
