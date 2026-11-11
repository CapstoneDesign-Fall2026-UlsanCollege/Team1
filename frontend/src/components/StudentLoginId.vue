<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import {scheduleApi} from '../schedules'
import {studentIdPrefix,schoolStudentId} from '../student-id'
const props=defineProps<{student:{id:number;login_id:string;full_name:string}}>()
const emit=defineEmits<{busy:[value:boolean];changed:[value:string]}>()
const open=ref(false),loading=ref(false),saving=ref(false),error=ref(''),data=ref<any>(null),membership=ref(0),admittedOn=ref(''),number=ref('')
const selected=computed(()=>data.value?.memberships.find((m:any)=>m.id===membership.value))
const prefix=computed(()=>studentIdPrefix(admittedOn.value,selected.value?.grade_label??'',selected.value?.class_name??''))
const newId=computed(()=>schoolStudentId(prefix.value,number.value))
async function load(){
 loading.value=true;error.value=''
 try{data.value=await scheduleApi('admin/school/students/'+props.student.id+'/login-id');membership.value=data.value.memberships[0]?.id??0;admittedOn.value=data.value.memberships[0]?.starts_on??'';number.value=/^\d{7,8}$/.test(data.value.student.login_id)?data.value.student.login_id.slice(-3):''}
 catch(e){error.value=e instanceof Error?e.message:'Unable to load student identity.'}finally{loading.value=false}
}
watch(()=>props.student.id,()=>{open.value=false;data.value=null;error.value=''})
async function begin(){open.value=true;await load()}
async function save(){
 if(!newId.value||!data.value)return;saving.value=true;emit('busy',true);error.value=''
 try{
  const r=await scheduleApi('admin/school/students/'+props.student.id+'/login-id','PUT',{expected_login_id:data.value.student.login_id,membership_id:membership.value,admitted_on:admittedOn.value,student_number:number.value})
  open.value=false;data.value=null;emit('changed',r.login_id)
 }catch(e){error.value=e instanceof Error?e.message:'Unable to change login ID.'}finally{saving.value=false;emit('busy',false)}
}
</script>
<template><section class="login-identity"><div class="heading"><div><h3>Student login access</h3><p>Current ID: <strong>{{student.login_id}}</strong> · Password stays unchanged.</p></div><button v-if="!open" type="button" class="secondary" @click="begin">Change login ID</button></div>
<template v-if="open"><p v-if="loading" role="status">Loading recorded enrollment…</p><p v-if="error" class="error" role="alert">{{error}}</p>
<form v-if="data&&!loading" @submit.prevent="save"><fieldset :disabled="saving"><p class="muted">Confirm the student’s admission date and class/section at admission. The earliest recorded enrollment is a suggestion, not proof of the original admission date.</p>
<p v-if="!data.memberships.length">Assign a class in School classes first, then reopen this control.</p>
<div v-else class="fields"><label>Recorded class / section<select v-model="membership" required><option v-for="m in data.memberships" :key="m.id" :value="m.id">Grade {{m.grade_label}} · Class {{m.class_name}} · {{m.year_name}} · from {{m.starts_on}}</option></select></label><label>Admission date<input v-model="admittedOn" type="date" required :max="data.today"></label><label>Student number<input v-model="number" type="text" inputmode="numeric" required maxlength="3" pattern="0*[1-9][0-9]*" placeholder="061"></label></div>
<div class="preview"><span>{{data.student.login_id}}</span><strong>→ {{newId||'Complete the admission details'}}</strong></div><p class="muted">Automatic prefix: {{prefix||'—'}} (year + grade + section). Confirm the number if it was suggested from the old ID. Saving signs out this student’s sessions. Class transfers do not automatically change IDs.</p>
<div class="actions"><button type="submit" :disabled="!newId||newId===data.student.login_id">{{saving?'Saving…':'Save new login ID'}}</button><button type="button" class="secondary" @click="open=false;error=''">Cancel ID change</button></div></fieldset></form></template></section></template>
<style scoped>
.login-identity{border:1px solid #c8dccf;border-radius:12px;padding:16px;margin:16px 0;background:#f3f8f4}.heading{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}h3{margin:0;font-size:17px}.heading p,.muted{font-size:12px;color:#657b6d;line-height:1.6}.fields{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px}.fields label{display:block;font-size:12px}.fields input,.fields select{width:100%;box-sizing:border-box;margin:5px 0 0;padding:10px;font:inherit;color:#244332;background:white;border:1px solid #b7cbbd;border-radius:8px;min-width:0}fieldset{border:0;padding:0;min-width:0}.preview{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;font-size:15px}.preview span{color:#75867a}.actions{display:flex;gap:10px;flex-wrap:wrap}button{width:auto;padding:9px 12px;font-size:12px}@media(max-width:650px){.fields{grid-template-columns:1fr}.heading{align-items:start}.preview strong{overflow-wrap:anywhere}}
</style>
