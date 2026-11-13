<script setup lang="ts">
import {onMounted,onUnmounted,ref,watch} from 'vue'
import {scheduleApi} from '../schedules'
const props=defineProps<{initialTeacher?:number}>()
const teachers=ref<any[]>([]),loading=ref(false),saving=ref(false),error=ref(''),message=ref(''),confirm=ref(0)
const teacherId=ref(0),login=ref(''),password=ref('')
let timer:ReturnType<typeof setTimeout>|undefined
watch(message,v=>{clearTimeout(timer);if(v)timer=setTimeout(()=>message.value='',4000)})
onUnmounted(()=>clearTimeout(timer))
async function load(){loading.value=true;error.value='';try{teachers.value=(await scheduleApi('admin/teacher-accounts')).teachers;if(props.initialTeacher&&teachers.value.some(t=>t.id===props.initialTeacher&&t.is_active&&!t.user_id))teacherId.value=props.initialTeacher}catch(e){error.value=e instanceof Error?e.message:'Unable to load teachers.'}finally{loading.value=false}}
async function create(){saving.value=true;error.value='';try{const r=await scheduleApi('admin/teacher-accounts','POST',{teacher_id:teacherId.value,login_id:login.value,password:password.value});message.value=r.message;teacherId.value=0;login.value='';await load()}catch(e){error.value=e instanceof Error?e.message:'Unable to create login.'}finally{password.value='';saving.value=false}}
async function status(t:any){saving.value=true;error.value='';try{const r=await scheduleApi('admin/teacher-accounts/'+t.user_id+'/status','PUT',{is_active:!t.account_active});message.value=r.message;confirm.value=0;await load()}catch(e){error.value=e instanceof Error?e.message:'Unable to change access.'}finally{saving.value=false}}
onMounted(load)
</script>
<template><section class="card teacher-access"><div class="heading"><div><p class="eyebrow">TEACHER ACCESS</p><h2>Teacher logins</h2></div><button class="secondary" :disabled="loading||saving" @click="load">Refresh</button></div>
<p>Link an account to an existing teacher. Their saved subject assignments and Sunday 10 AM homeroom determine access.</p>
<p v-if="error" class="error" role="alert">{{error}}</p><p v-if="message" class="success" role="status">{{message}}</p><p v-if="loading" role="status">Loading teacher access…</p>
<form @submit.prevent="create"><fieldset :disabled="saving||loading"><legend>Create teacher login</legend><div class="fields"><label>Teacher<select v-model="teacherId" required><option :value="0" disabled>Choose a teacher</option><option v-for="t in teachers.filter(t=>t.is_active&&!t.user_id)" :key="t.id" :value="t.id">{{t.name}} · {{t.staff_code}}</option></select></label><label>Login ID<input v-model="login" required maxlength="50" pattern="[A-Za-z0-9_-]+" autocomplete="off"></label><label>Initial password<input v-model="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password"></label></div><small>At least 12 characters, maximum 72 UTF-8 bytes. Share privately with the teacher.</small><button :disabled="!teacherId">Create teacher login</button></fieldset></form>
<div class="table-scroll"><table><thead><tr><th>Teacher</th><th>Login</th><th>Access</th></tr></thead><tbody><tr v-for="t in teachers" :key="t.id"><td><strong>{{t.name}}</strong><small>{{t.staff_code}}{{!t.is_active?' · Directory inactive':''}}</small></td><td>{{t.login_id||'No login yet'}}</td><td v-if="t.user_id"><span>{{t.account_active?'Enabled':'Disabled'}}</span><template v-if="confirm===t.user_id"><button :disabled="saving" @click="status(t)">Confirm disable</button><button class="secondary" @click="confirm=0">Cancel</button></template><button v-else class="secondary" :disabled="saving" @click="t.account_active?confirm=t.user_id:status(t)">{{t.account_active?'Disable':'Enable'}}</button></td><td v-else>—</td></tr></tbody></table></div>
</section></template>
<style scoped>
.heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.heading h2{margin:0}.fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}label{display:block;font-size:13px}input,select{width:100%;box-sizing:border-box;padding:10px;border:1px solid #bdcfc3;border-radius:8px;margin-top:5px;background:#fff;color:#243d32}fieldset{min-width:0;border:1px solid #dce6df;padding:16px;border-radius:10px}small{display:block;font-size:12px;color:#65796b;margin:5px 0}button{width:auto;margin:8px 8px 0 0;padding:9px 12px;font-size:13px}.table-scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:12px;border-bottom:1px solid #e3eae5}h2{font-size:22px}
</style>
