<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {apiFetch} from '../api'
type Entry={id:string;actor_login:string;actor_role:string;action:string;record_type:string;record_key:string;occurred_at:string;changed_fields:string[];before_values:Record<string,unknown>|null;after_values:Record<string,unknown>|null}
const logs=ref<Entry[]>([]), actors=ref<{id:number;login_id:string}[]>([]),areas=ref<{id:string;label:string}[]>([])
const actor=ref(''),action=ref(''),area=ref(''),from=ref(''),until=ref(''),busy=ref(false),error=ref(''),more=ref(false),next=ref('')
const cursors=ref<string[]>([''])
let applied:Record<string,string>={}
function label(id:string){return areas.value.find(a=>a.id===id)?.label??id}
function value(v:unknown){return v===undefined?'—':typeof v==='object'?JSON.stringify(v):String(v)}
function time(v:string){return new Date(v).toLocaleString('en-GB',{timeZone:'Asia/Kathmandu'})}
async function load(){busy.value=true;error.value='';try{
 const params=new URLSearchParams(applied);const cursor=cursors.value.at(-1);if(cursor)params.set('before',cursor)
 const response=await apiFetch('/api/admin/activity-logs?'+params);const data=await response.json();if(!response.ok)throw Error(data.message||'Unable to load activity.')
 logs.value=data.logs;actors.value=data.actors;areas.value=data.areas;more.value=data.has_more;next.value=data.next_before??''
}catch(e){logs.value=[];more.value=false;error.value=e instanceof Error?e.message:'Unable to load activity.'}finally{busy.value=false}}
function apply(){applied=Object.fromEntries(Object.entries({actor:actor.value,action:action.value,area:area.value,from:from.value,until:until.value}).filter(([,v])=>v));cursors.value=[''];void load()}
function reset(){actor.value=action.value=area.value=from.value=until.value='';apply()}
function page(forward:boolean){if(forward)cursors.value.push(next.value);else cursors.value.pop();void load()}
onMounted(load)
</script>
<template>
<section class="activity card">
 <div class="heading"><div><p class="eyebrow">ACCOUNTABILITY</p><h2>Activity Log</h2><p class="muted">See who changed school and canteen records. Times and date filters use Nepal time.</p></div><button class="secondary" :disabled="busy" @click="apply">Refresh</button></div>
 <form class="filters" @submit.prevent="apply">
  <label>Person<select v-model="actor" :disabled="busy"><option value="">All staff</option><option v-for="p in actors" :key="p.id" :value="String(p.id)">{{p.login_id}}</option></select></label>
  <label>Action<select v-model="action" :disabled="busy"><option value="">All actions</option><option value="create">Created</option><option value="update">Updated</option><option value="delete">Deleted</option></select></label>
  <label>Record type<select v-model="area" :disabled="busy"><option value="">All records</option><option v-for="a in areas" :key="a.id" :value="a.id">{{a.label}}</option></select></label>
  <label>From<input v-model="from" type="date" :disabled="busy"></label><label>Until<input v-model="until" type="date" :min="from" :disabled="busy"></label>
  <div class="buttons"><button :disabled="busy">Apply</button><button class="secondary" type="button" :disabled="busy" @click="reset">Reset</button></div>
 </form>
 <p v-if="error" class="error" role="alert">{{error}} <button :disabled="busy" @click="load">Retry</button></p>
 <p v-if="busy" role="status">Loading activity…</p>
 <p v-else-if="!error&&!logs.length" class="empty">No changes match these filters.</p>
 <article v-for="entry in logs" :key="entry.id" class="entry">
  <div class="entry-head"><strong>{{entry.actor_login}}</strong><span>{{entry.actor_role==='admin'?'Administrator':'Canteen head'}}</span><time>{{time(entry.occurred_at)}} NPT</time></div>
  <p><span class="badge">{{entry.action}}</span> {{label(entry.record_type)}} · Record {{entry.record_key}}</p>
  <details><summary>{{entry.changed_fields.length}} changed field{{entry.changed_fields.length===1?'':'s'}} · View details</summary><div class="table-wrap"><table><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody><tr v-for="field in entry.changed_fields" :key="field"><th>{{field}}</th><td>{{value(entry.before_values?.[field])}}</td><td>{{value(entry.after_values?.[field])}}</td></tr></tbody></table></div></details>
 </article>
 <div class="pager"><button class="secondary" :disabled="busy||cursors.length===1" @click="page(false)">Previous</button><span>Page {{cursors.length}} · 20 per page</span><button class="secondary" :disabled="busy||!more" @click="page(true)">Next</button></div>
 <p class="muted footnote">Read-only history starts when logging is activated. Private profile values and passwords are hidden. Changes made directly in the database are outside this log. Use a separate login for each staff member.</p>
</section>
</template>
<style scoped>
.activity{padding:24px}.heading,.entry-head,.pager,.buttons{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.heading{justify-content:space-between}.heading h2{margin:8px 0}.filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:20px 0}.filters label{margin:0}.filters input,.filters select{width:100%;margin:6px 0 0;min-width:0}.buttons{align-self:end}.buttons button,.heading button,.pager button{width:auto;margin:0}.entry{padding:18px 0;border-top:1px solid #dce5df}.entry-head span,.entry-head time{font-size:13px;color:#64746d}.entry-head time{margin-left:auto}.entry p{margin:10px 0}.entry summary{cursor:pointer;font-size:14px;color:#365f50}.table-wrap{overflow:auto;margin-top:12px}table{width:100%;border-collapse:collapse;font-size:13px;text-align:left}th,td{border:1px solid #dce5df;padding:8px;vertical-align:top;overflow-wrap:anywhere;max-width:360px}.pager{justify-content:space-between;margin-top:18px}.footnote{font-size:13px;margin-top:20px}.empty{padding:24px 0}@media(max-width:640px){.activity{padding:16px}.filters{grid-template-columns:repeat(2,minmax(0,1fr))}.entry-head time{width:100%;margin:0}.pager{font-size:12px}}
</style>
