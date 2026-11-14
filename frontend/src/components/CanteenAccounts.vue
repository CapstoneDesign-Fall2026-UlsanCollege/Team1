<script setup lang="ts">
import {dismissAfterFourSeconds} from '../temporary-message'
import { nextTick, onMounted, ref } from 'vue'
import { scheduleApi } from '../schedules'
type StaffAccount = {id:number;login_id:string;is_active:boolean}
const createDialog=ref<HTMLDialogElement|null>(null),createError=ref('')
async function openCreate(){login.value='';password.value='';createError.value='';await nextTick();createDialog.value?.showModal()}
function closeCreate(){if(!saving.value){createDialog.value?.close();password.value='';createError.value=''}}
const accounts=ref<StaffAccount[]>([]), login=ref(''), password=ref('')
const loading=ref(false), saving=ref(false), error=ref(''), message=ref(''), confirming=ref(0)
dismissAfterFourSeconds(message)
const emit=defineEmits<{saving:[value:boolean]}>()
async function load() {
 loading.value=true;error.value=''
 try { accounts.value=(await scheduleApi('admin/canteen-accounts')).accounts }
 catch(e){error.value=e instanceof Error?e.message:'Unable to load staff accounts.'}
 finally{loading.value=false}
}
async function create() {
 if(saving.value)return;
 saving.value=true;emit('saving',true);createError.value='';message.value=''
 try {
  const data=await scheduleApi('admin/canteen-accounts','POST',{login_id:login.value,password:password.value})
  accounts.value=[...accounts.value,data.account];login.value='';message.value=data.message;createDialog.value?.close()
 }catch(e){createError.value=e instanceof Error?e.message:'Unable to create account.'}
 finally{password.value='';saving.value=false;emit('saving',false)}
}
async function changeStatus(account:StaffAccount) {
 saving.value=true;emit('saving',true);error.value='';message.value=''
 try {
  const data=await scheduleApi('admin/canteen-accounts/'+account.id+'/status','PUT',{is_active:!account.is_active})
  account.is_active=!account.is_active;confirming.value=0;message.value=data.message
 }catch(e){error.value=e instanceof Error?e.message:'Unable to update account.'}
 finally{saving.value=false;emit('saving',false)}
}
onMounted(load)
</script>
<template>
 <section class="card staff-accounts">
  <div class="heading"><div><p class="eyebrow">ACCOUNT ACCESS</p><h2>Canteen staff</h2></div><div class="heading-actions"><button type="button" :disabled="loading||saving" @click="openCreate">Create canteen staff</button><button type="button" class="secondary" :disabled="loading||saving" @click="load">Refresh accounts</button></div></div>
  <p class="muted">Create or disable canteen-head accounts here. The canteen head manages food information in a separate workspace.</p>
  <p v-if="error" class="error" role="alert">{{error}}</p><p v-if="message" class="success" role="status">{{message}}</p>
  <p v-if="loading" role="status">Loading staff accounts…</p>
  <p v-else-if="!accounts.length&&!error" class="muted">No canteen-head accounts yet.</p>
  <article v-for="account in accounts" :key="account.id" class="staff-account">
   <div><strong>{{account.login_id}}</strong><p>{{account.is_active?'Active':'Disabled'}} · Canteen head</p></div>
   <div v-if="confirming===account.id"><p>Disable {{account.login_id}} and sign out its current sessions?</p><button type="button" :disabled="saving" @click="changeStatus(account)">Confirm disable</button> <button type="button" class="secondary" :disabled="saving" @click="confirming=0">Cancel</button></div>
   <button v-else type="button" class="secondary" :disabled="saving" @click="account.is_active?confirming=account.id:changeStatus(account)">{{account.is_active?'Disable account':'Enable account'}}</button>
  </article>
  <dialog ref="createDialog" class="account-create-dialog" aria-labelledby="canteen-create-title" @cancel.prevent="closeCreate"><div class="heading"><h2 id="canteen-create-title">Create canteen staff</h2><button type="button" class="secondary" :disabled="saving" @click="closeCreate">Close</button></div><p class="muted">Create a login for the canteen head.</p>  <form @submit.prevent="create">
   <p v-if="createError" class="error" role="alert">{{createError}}</p>
   <div class="staff-fields"><label>Login ID<input v-model="login" autocomplete="off" maxlength="50" pattern="[A-Za-z0-9_-]+" required :disabled="saving" placeholder="e.g. canteen_head"></label>
   <label>Initial password<input v-model="password" type="password" autocomplete="new-password" minlength="12" required :disabled="saving" aria-describedby="staff-password-help"></label></div>
   <p id="staff-password-help" class="muted">Use at least 12 characters, at most 72 UTF-8 bytes. Share credentials privately with the canteen head.</p>
   <button :disabled="saving">{{saving?'Saving…':'Create account'}}</button>
  </form></dialog>
 </section>
</template>
<style scoped>
.staff-accounts{max-width:none}.staff-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.staff-fields input{width:100%;box-sizing:border-box}.staff-heading,.staff-account{display:flex;justify-content:space-between;align-items:center;gap:16px}.staff-heading{margin-top:28px}.staff-account{padding:16px 0;border-top:1px solid #dce5df;overflow-wrap:anywhere}.staff-account p{margin:6px 0;color:#60736e}.staff-accounts button{width:auto}.staff-accounts form{margin-top:24px}@media(max-width:600px){.staff-fields{grid-template-columns:1fr;gap:0}.staff-account{align-items:flex-start;flex-wrap:wrap}.staff-heading{flex-wrap:wrap}}
</style>
