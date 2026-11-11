<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref,watch} from 'vue'
import {scheduleApi,days} from '../schedules'
const props=defineProps<{classes:any[];today:string}>()
const emit=defineEmits<{busy:[value:boolean]}>()
const classId=ref(props.classes[0]?.class_id??0),month=ref(props.today.slice(0,7)),selectedDate=ref('')
const data=ref<any>(null),loading=ref(false),saving=ref(false),error=ref(''),message=ref(''),search=ref(''),draft=ref<Record<number,string>>({})
const symbols:Record<string,string>={present:'O',absent:'X',late:'-',excused:'E'}
const names:Record<string,string>={present:'Present',absent:'Absent',late:'Late',excused:'Excused'}
const selectedDay=computed(()=>data.value?.days.find((d:any)=>d.date===selectedDate.value))
const dirty=computed(()=>Boolean(data.value?.students.some((s:any)=>s.eligible.includes(selectedDate.value)&&(draft.value[s.id]??'')!==(s.marks[selectedDate.value]??''))))
const filtered=computed(()=>data.value?.students.filter((s:any)=>(s.full_name+' '+s.login_id).toLowerCase().includes(search.value.trim().toLowerCase()))??[])
let timer:ReturnType<typeof setTimeout>|undefined,request=0
watch([saving,dirty],()=>emit('busy',saving.value||dirty.value))
watch(message,v=>{clearTimeout(timer);if(v)timer=setTimeout(()=>message.value='',4000)})
onUnmounted(()=>{request++;clearTimeout(timer);emit('busy',false)})
function resetDraft(){draft.value=Object.fromEntries((data.value?.students??[]).map((s:any)=>[s.id,s.marks[selectedDate.value]??'']))}
function selectDate(date:string){if(dirty.value||saving.value)return;selectedDate.value=date;resetDraft()}
async function load(){
 if(!classId.value)return
 const current=++request;loading.value=true;error.value='';data.value=null
 try{
  const r=await scheduleApi('teacher/classes/'+classId.value+'/attendance/month?month='+month.value)
  if(current!==request)return;data.value=r
  if(!r.days.some((d:any)=>d.date===selectedDate.value&&d.editable))selectedDate.value=r.days.find((d:any)=>d.date===props.today&&d.editable)?.date??r.days.filter((d:any)=>d.editable).at(-1)?.date??''
  resetDraft()
 }catch(e){if(current===request)error.value=e instanceof Error?e.message:'Unable to load the monthly register.'}
 finally{if(current===request)loading.value=false}
}
async function save(){
 if(!data.value||!selectedDate.value)return;saving.value=true;error.value=''
 try{
  const records=data.value.students.filter((s:any)=>s.eligible.includes(selectedDate.value)&&draft.value[s.id]).map((s:any)=>({student_user_id:s.id,status:draft.value[s.id]}))
  const r=await scheduleApi('teacher/classes/'+classId.value+'/attendance','PUT',{date:selectedDate.value,version:selectedDay.value.version,records})
  message.value=r.message;await load()
 }catch(e){error.value=e instanceof Error?e.message:'Unable to save. Reload before retrying.'}finally{saving.value=false}
}
function eligible(s:any,date:string){return s.eligible.includes(date)}
function mark(s:any,date:string){return date===selectedDate.value?(draft.value[s.id]??''):(s.marks[date]??'')}
function meaning(s:any,date:string){return !eligible(s,date)?'Outside enrollment, future date or unavailable homeroom day':names[mark(s,date)]??'Unmarked'}
onMounted(load)
</script>
<template><section class="monthly-attendance">
<div class="toolbar"><div><h2>Monthly attendance register</h2><p>O Present · X Absent · - Late · E Excused · · Unmarked</p></div><div class="controls"><label>Class<select v-model="classId" :disabled="loading||saving||dirty" @change="load"><option v-for="c in classes" :key="c.class_id" :value="c.class_id">Grade {{c.grade_label}} · Class {{c.class_name}}</option></select></label><label>Month<input v-model="month" type="month" :max="today.slice(0,7)" :disabled="loading||saving||dirty" @change="load"></label></div></div>
<p v-if="!classes.length" class="muted">No homeroom is assigned to you. Your administrator can review Sunday’s 10 AM teacher.</p>
<p v-if="loading" role="status">Loading monthly attendance…</p><p v-if="error" class="error" role="alert">{{error}}</p><p v-if="message" class="success" role="status">{{message}}</p>
<template v-if="data">
<div class="register-actions"><label>Find a student<input v-model="search" type="search" placeholder="Name or student ID"></label><div><strong>Editing {{selectedDate}}</strong><p>{{dirty?'Unsaved changes. Save or discard before switching dates or pages.':'Click a date heading to edit that day.'}}</p></div><button :disabled="saving||!dirty" @click="save">{{saving?'Saving…':'Save selected day'}}</button><button class="secondary" :disabled="saving||loading" @click="load()">{{dirty?'Discard & reload':'Refresh register'}}</button></div>
<p class="formula">Adjusted X = X + ⌊Late ÷ 3⌋. Three late marks count as one absence within this month. Totals use saved marks; originals stay unchanged.</p>
<div class="register-scroll" tabindex="0" aria-label="Monthly attendance table, scroll horizontally for all dates and totals"><table><caption>{{month}} · {{filtered.length}} students · Nepal calendar dates</caption><thead><tr><th scope="col" class="student-col">Student</th><th v-for="d in data.days" :key="d.date" scope="col" :class="{selected:d.date===selectedDate,saturday:d.day===6}"><button :disabled="!d.editable||saving||(dirty&&d.date!==selectedDate)" :aria-label="'Edit attendance for '+d.date" :aria-pressed="d.date===selectedDate" @click="selectDate(d.date)">{{Number(d.date.slice(-2))}}<small>{{days[d.day-1].slice(0,2)}}</small></button></th><th scope="col" title="Present">O</th><th scope="col" title="Raw absent marks">X</th><th scope="col" title="Late marks">-</th><th scope="col" title="Excused">E</th><th scope="col" title="Days with a saved mark">Marked</th><th scope="col" title="Absences converted from late marks">Late → X</th><th scope="col" title="Raw absences plus one per three late marks">Adjusted X</th></tr></thead>
<tbody><tr v-for="s in filtered" :key="s.id"><th scope="row" class="student-col"><strong>{{s.full_name}}</strong><small>{{s.login_id}}</small></th>
<td v-for="d in data.days" :key="d.date" :class="[mark(s,d.date),{selected:d.date===selectedDate,unavailable:!eligible(s,d.date)}]" :title="d.date+': '+meaning(s,d.date)">
<select v-if="d.date===selectedDate&&d.editable&&eligible(s,d.date)" v-model="draft[s.id]" :disabled="saving" :aria-label="s.full_name+' attendance '+d.date"><option value="" disabled>·</option><option value="present">O</option><option value="absent">X</option><option value="late">-</option><option value="excused">E</option></select>
<span v-else>{{eligible(s,d.date)?symbols[mark(s,d.date)]||'·':''}}</span></td>
<td class="total">{{s.totals.present}}</td><td class="total">{{s.totals.absent}}</td><td class="total">{{s.totals.late}}</td><td class="total">{{s.totals.excused}}</td><td class="total">{{s.totals.marked}}</td><td class="total">{{s.totals.lateAbsences}}</td><td class="total adjusted"><strong>{{s.totals.adjustedAbsences}}</strong><small v-if="s.totals.remainingLates">{{s.totals.remainingLates}} late left</small></td></tr></tbody></table></div>
<p v-if="!filtered.length" class="muted">No students match this month and search.</p><p class="muted">Blank grey cells are future dates, outside enrollment or outside your homeroom scope. Saturdays are shaded as a guide, not automatically marked absent or closed. Unmarked and excused days do not add absences.</p>
</template></section></template>
<style scoped>
.monthly-attendance{background:#fff;border:1px solid #d7e3da;border-radius:14px;padding:20px;min-width:0;color:#243e33}.toolbar,.controls,.register-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.toolbar{justify-content:space-between}.toolbar h2{font-size:20px;margin:0 0 7px}.toolbar p,.register-actions p,.muted{font-size:12px;color:#6a7e70;line-height:1.6;margin:6px 0}.controls label,.register-actions label{font-size:12px;display:block}.controls input,.controls select,.register-actions input{display:block;box-sizing:border-box;border:1px solid #b9cdbf;border-radius:8px;background:white;color:#243e33;padding:9px;margin-top:5px;font:inherit}.controls select{min-width:180px}.register-actions{margin:18px 0 10px}.register-actions>div{flex:1;min-width:170px}.register-actions strong{font-size:13px}button{width:auto;font-size:12px;padding:9px 12px;margin:0}.formula{font-size:12px;background:#edf4ef;padding:10px;border-radius:8px;line-height:1.6}.register-scroll{overflow:auto;max-height:65vh;border:1px solid #cad9cf;border-radius:8px;position:relative}table{border-collapse:separate;border-spacing:0;font-size:12px;min-width:100%;table-layout:fixed}caption{text-align:left;padding:10px;font-size:12px;color:#607869}th,td{border-right:1px solid #d5e1d9;border-bottom:1px solid #d5e1d9;text-align:center;min-width:34px;height:36px;padding:0 3px;background:white}thead th{position:sticky;top:0;background:#edf3ef;z-index:2;font-size:11px}.student-col{position:sticky;left:0;z-index:1;text-align:left;min-width:160px;max-width:180px;padding:8px 10px;background:white}thead .student-col{z-index:3;background:#edf3ef}.student-col strong{display:block;font-size:12px;overflow-wrap:anywhere}.student-col small{display:block;font-size:10px;color:#748577;margin-top:4px}thead button{padding:6px 3px;width:100%;height:100%;background:transparent;color:#31583f;font-size:12px;line-height:1.3}thead button small{display:block;font-size:9px}thead button:disabled{opacity:.4}.selected{background:#edf7ef}.saturday{background:#fff2d8}.unavailable{background:#f3f4f3}.present{color:#286e44}.absent{color:#ad3d3d}.late{color:#9a690b}.excused{color:#526b9a}td select{border:1px solid #95b99f;border-radius:4px;background:transparent;color:inherit;appearance:none;text-align:center;font-size:15px;font-weight:600;width:30px;height:28px;padding:0;cursor:pointer}.total{padding:5px 10px;background:#f6f9f7;min-width:40px}.adjusted{background:#fff1e6;min-width:70px}.adjusted small{display:block;font-size:9px;color:#806445}button:focus-visible,select:focus-visible{outline:3px solid #4a8660;outline-offset:1px}@media(max-width:600px){.monthly-attendance{padding:12px}.controls{width:100%}.controls label{flex:1;min-width:120px}.controls select,.controls input{width:100%;min-width:0}.register-actions{gap:8px}.register-actions>label{width:100%}.register-actions input{width:100%}.student-col{min-width:120px;max-width:130px;padding:6px}.toolbar h2{font-size:18px}}
</style>
