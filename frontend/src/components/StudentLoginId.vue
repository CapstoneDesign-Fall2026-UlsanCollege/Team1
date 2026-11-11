<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import {scheduleApi} from '../schedules'
import {studentIdPrefix,schoolStudentId} from '../student-id'
const props=defineProps<{student:{id:number;login_id:string;full_name:string}}>()
const emit=defineEmits<{state:[value:{enabled:boolean;valid:boolean;payload:any}]}>()
const open=ref(false),loading=ref(false),error=ref(''),data=ref<any>(null),membership=ref(0),admittedOn=ref(''),number=ref('')
const selected=computed(()=>data.value?.memberships.find((m:any)=>m.id===membership.value))
const prefix=computed(()=>studentIdPrefix(admittedOn.value,selected.value?.grade_label??'',selected.value?.class_name??''))
const newId=computed(()=>schoolStudentId(prefix.value,number.value))
async function load(){
 loading.value=true;error.value=''
 try{data.value=await scheduleApi('admin/school/students/'+props.student.id+'/login-id');membership.value=data.value.memberships[0]?.id??0;admittedOn.value=data.value.memberships[0]?.starts_on??'';number.value=/^\d{7,8}$/.test(data.value.student.login_id)?data.value.student.login_id.slice(-3):''}
 catch(e){error.value=e instanceof Error?e.message:'Unable to load student identity.'}finally{loading.value=false}
}
watch(()=>props.student.id,()=>{open.value=false;data.value=null;error.value=''})
watch([open,loading,data,membership,admittedOn,number],()=>{
 emit('state',{enabled:open.value,valid:!loading.value&&!error.value&&!!newId.value&&newId.value!==data.value?.student.login_id&&admittedOn.value<=data.value?.today,payload:{expected_login_id:data.value?.student.login_id,membership_id:membership.value,admitted_on:admittedOn.value,student_number:number.value}})
},{immediate:true})
</script>
<template><div class="login-identity"><label class="toggle"><input v-model="open" type="checkbox" @change="open&&load()">Change login ID <span>Current: {{student.login_id}}</span></label>
<template v-if="open"><p v-if="loading" role="status">Loading enrollment…</p><p v-if="error" class="error" role="alert">{{error}}</p><template v-if="data&&!loading"><p class="muted">Confirm admission details; the earliest recorded enrollment is only a suggestion.</p><p v-if="!data.memberships.length">Assign a class in School classes first.</p><div v-else class="fields"><label>Admission class<select v-model="membership" required><option v-for="m in data.memberships" :key="m.id" :value="m.id">Grade {{m.grade_label}} · {{m.class_name}} · {{m.year_name}}</option></select></label><label>Admission date<input v-model="admittedOn" type="date" required :max="data.today"></label><label>Student number<input v-model="number" inputmode="numeric" required maxlength="3" pattern="0*[1-9][0-9]*" placeholder="061"></label></div><p class="preview">New login ID: <strong>{{newId||'Complete admission details'}}</strong></p><p class="muted">Password stays unchanged. Saving signs this student out.</p></template></template></div></template>
<style scoped>
.login-identity{border-top:1px solid #c8dccf;margin-top:14px;padding-top:12px}.toggle{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}.toggle input{width:16px;height:16px;margin:0}.toggle span{font-weight:400;color:#657b6d;margin-left:auto}.muted{font-size:12px;color:#657b6d;margin:8px 0}.fields{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px}.fields label{font-size:12px}.fields input,.fields select{width:100%;box-sizing:border-box;margin:5px 0 0;padding:9px;font:inherit;color:#244332;background:white;border:1px solid #b7cbbd;border-radius:8px;min-width:0}.preview{font-size:13px;margin:10px 0}@media(max-width:650px){.fields{grid-template-columns:1fr}.toggle{flex-wrap:wrap}.toggle span{margin-left:0}}
</style>
