<script setup lang="ts">
import StudentIcon from './StudentIcon.vue'
import { onMounted, ref, watch } from 'vue'
import { scheduleApi, type Semester } from '../schedules'
type Student = { id:number; login_id:string; full_name:string; university:string; major:string|null; year_of_study:number|null; email:string|null; phone_number:string|null; address:string|null; is_active:boolean; semester_ids:number[] }
const semesters=ref<Semester[]>([])
const props=defineProps<{ revision:number }>()
const emit=defineEmits<{saving:[value:boolean]}>()
const students=ref<Student[]>([]), search=ref(''), draft=ref<Student|null>(null)
const loading=ref(false), busy=ref(false), error=ref(''), message=ref('')
async function load(){
  if(loading.value||busy.value||draft.value)return
  loading.value=true;error.value=''
  try{
    const [directory,terms]=await Promise.all([scheduleApi('admin/students?search='+encodeURIComponent(search.value.trim())),scheduleApi('admin/semesters')])
    if(directory.students.some((s:Student)=>!Array.isArray(s.semester_ids))) throw new Error('Restart the backend to load semester editing, then refresh this list.')
    students.value=directory.students;semesters.value=terms.semesters
  }
  catch(e){error.value=e instanceof Error?e.message:'Unable to load students.'}
  finally{loading.value=false}
}
function edit(student:Student){draft.value={...student,semester_ids:[...student.semester_ids]};message.value='';error.value=''}
async function save(){
  if(!draft.value||busy.value)return
  busy.value=true;emit('saving',true);error.value='';message.value=''
  const value={...draft.value,year_of_study:draft.value.year_of_study==null||String(draft.value.year_of_study)===''?null:Number(draft.value.year_of_study)}
  try{
    await scheduleApi('admin/students/'+value.id,'PUT',value)
    students.value=students.value.map(s=>s.id===value.id?value:s)
    draft.value=null;message.value='Saved '+value.full_name+'.'
  }catch(e){error.value=e instanceof Error?e.message:'Unable to save student.'}
  finally{busy.value=false;emit('saving',false)}
}
onMounted(load)
watch(()=>props.revision,()=>{void load()})
</script>
<template>
  <section class="card student-manager">
    <p class="eyebrow">STUDENT DIRECTORY</p><h2>Student list & editing</h2>
    <p class="muted">Find a student, update their profile, or change account access.</p>
    <form class="search-bar" @submit.prevent="load"><label for="student-search">Name or login ID<input id="student-search" v-model="search" type="search" maxlength="150" placeholder="Search students" :disabled="loading||busy||!!draft"></label><button :disabled="loading||busy||!!draft"><StudentIcon name="search" />Search / refresh</button></form>
    <p v-if="error" class="error" role="alert">{{error}}</p><p v-if="message" class="success" role="status">{{message}}</p>
    <form v-if="draft" class="editor" @submit.prevent="save">
      <h3>Edit {{draft.login_id}}</h3><p class="muted">Update the profile and choose which semesters this student belongs to.</p>
      <fieldset :disabled="busy"><div class="edit-grid">
        <label>Full name<input v-model="draft.full_name" required maxlength="150"></label>
        <label>University<input v-model="draft.university" required maxlength="150"></label>
        <label>Major<input v-model="draft.major" maxlength="150"></label>
        <label>Year of study<input v-model.number="draft.year_of_study" type="number" min="1" max="255" step="1"></label>
        <label>Email<input v-model="draft.email" type="email" maxlength="254"></label>
        <label>Phone<input v-model="draft.phone_number" type="tel" maxlength="30"></label>
        <label class="wide">Address<textarea v-model="draft.address" rows="2" maxlength="500"></textarea></label>
        <label>Account access<select v-model="draft.is_active"><option :value="true">Enabled</option><option :value="false">Disabled</option></select></label>
      </div>
      <fieldset class="semester-picker"><legend>Assigned semesters</legend>
        <p class="muted">Check semesters to assign them; uncheck to remove them. Courses and timetables follow these selections after saving. Keep past semesters checked to retain access.</p>
        <p v-if="!semesters.length">No semesters exist yet. Create one, then refresh this list.</p>
        <div class="semester-options"><label v-for="term in semesters" :key="term.id" class="semester-option"><input v-model="draft.semester_ids" type="checkbox" :value="term.id"><span>{{term.name}} {{term.academic_year}}</span></label></div>
        <p v-if="!draft.semester_ids.length" class="muted">No semesters selected. This student will have no semester courses or timetable.</p>
      </fieldset>
      <p v-if="!draft.is_active" class="muted">This student will be unable to log in or continue using their current session after saving.</p>
      <div class="actions"><button><StudentIcon name="save" />{{busy?'Saving…':'Save changes'}}</button><button type="button" class="secondary" @click="draft=null;error=''"><StudentIcon name="cancel" />Cancel</button></div></fieldset>
    </form>
    <p v-if="loading" role="status">Loading students…</p>
    <template v-else><p class="muted">{{students.length}} results · Up to 100 shown. Search to narrow the list.</p><p v-if="!students.length&&!error">No matching students.</p>
      <div class="student-rows"><article v-for="student in students" :key="student.id" class="student-row"><div><strong>{{student.full_name}}</strong><p>{{student.login_id}} · {{student.major || 'Major not provided'}}</p></div><span class="status" :class="{disabled:!student.is_active}">{{student.is_active?'Enabled':'Disabled'}}</span><button title="Edit" class="secondary" :disabled="busy||!!draft" :aria-label="'Edit '+student.full_name" @click="edit(student)"><StudentIcon name="edit" /></button></article></div>
    </template>
  </section>
</template>
<style scoped>
.semester-picker{margin-top:22px;padding-top:16px;border-top:1px solid #bfd5ca}.semester-picker legend{font-weight:600}.semester-options{display:grid;gap:8px;max-height:240px;overflow:auto}.semester-option{display:flex;align-items:center;gap:12px;padding:12px;background:white;border:1px solid #c8d9cf;border-radius:8px}.semester-option input{width:18px;height:18px;margin:0;flex-shrink:0}
.student-manager{margin-top:24px}.search-bar,.actions{display:flex;align-items:end;gap:12px;flex-wrap:wrap}.search-bar label{flex:1;min-width:180px}.search-bar button{margin-bottom:0}.editor{margin:20px 0;padding:20px;border:1px solid #bfd5ca;background:#f5f9f7;border-radius:12px}.editor h3{margin-top:0}fieldset{border:0;padding:0;min-width:0}.edit-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:16px}.wide{grid-column:1/-1}label{display:block;font-size:14px;font-weight:600}input,textarea,select{width:100%;margin-top:6px;border:1px solid #b9cbc2;border-radius:8px;padding:11px;font:inherit;background:white;color:#263b32}.actions{margin-top:18px}.student-rows{max-height:440px;overflow:auto}.student-row{display:flex;align-items:center;gap:14px;border-bottom:1px solid #e0e8e3;padding:16px 0;flex-wrap:wrap}.student-row>div{flex:1;min-width:160px;overflow-wrap:anywhere}.student-row p{font-size:13px;margin:6px 0;color:#617368}.student-row button{padding:9px 14px;font-size:13px}.status{font-size:12px;padding:6px 10px;background:#e7f2eb;color:#2a6244;border-radius:20px}.status.disabled{background:#f5e9e6;color:#8a4034}.success{padding:12px;background:#e7f2eb;color:#2a6244;border-radius:8px}
</style>
