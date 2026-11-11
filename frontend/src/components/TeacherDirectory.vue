<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { scheduleApi, days } from '../schedules'
const loading=ref(false),error=ref(''),search=ref(''),subject=ref(''),state=ref<any>(null),directory=ref<any>(null),yearId=ref(0),termId=ref(0)
const showSchedules=ref(false)
const years=computed(()=>state.value?.years??[])
const terms=computed(()=>state.value?.terms.filter((t:any)=>t.year_id===yearId.value)??[])
const assignments=computed(()=>directory.value?.assignments.filter((a:any)=>a.semester_id===termId.value)??[])
const subjectOptions=computed(()=>[...new Map<string,{code:string;name:string}>(assignments.value.map((a:any)=>[a.course_code,{code:a.course_code,name:a.course_name}])).values()].sort((a,b)=>a.name.localeCompare(b.name)))
watch(subjectOptions,options=>{if(!loading.value&&subject.value&&subject.value!=='__unassigned'&&!options.some(s=>s.code===subject.value))subject.value=''})
const teachers=computed(()=>directory.value?.teachers.filter((t:any)=>{
 const matchesName=(t.name+' '+t.staff_code).toLowerCase().includes(search.value.trim().toLowerCase())
 const assigned=assignments.value.filter((a:any)=>a.teacher_id===t.id)
 return matchesName&&(!subject.value||(subject.value==='__unassigned'?!assigned.length:assigned.some((a:any)=>a.course_code===subject.value)))
})??[])
const firstPeriods=computed(()=>assignments.value.filter((a:any)=>a.start_time==='10:00' && a.day_of_week===7))
const classLabel=(a:any)=>`Grade ${a.grade_label} · Class ${a.class_name}`
function unique(values:any[],key:string){return [...new Map(values.map(v=>[v[key],v])).values()]}
function homerooms(id:number){return unique(firstPeriods.value.filter((a:any)=>a.teacher_id===id && new Set(firstPeriods.value.filter((b:any)=>b.class_id===a.class_id).map((b:any)=>b.teacher_id)).size===1),'class_id')}
function varying(id:number){return firstPeriods.value.filter((a:any)=>a.teacher_id===id && new Set(firstPeriods.value.filter((b:any)=>b.class_id===a.class_id).map((b:any)=>b.teacher_id)).size>1)}
function subjects(id:number){return unique(assignments.value.filter((a:any)=>a.teacher_id===id),'offering_id')}
function subjectTypes(id:number){return unique(subjects(id),'course_name')}
const schoolDays=[7,1,2,3,4,5]
function timetableRows(id:number){return [...new Set(['10:00|11:00','11:00|12:00','12:00|13:00','13:00|14:00','14:00|15:00','15:00|16:00',...meetings(id).map((m:any)=>m.start_time+'|'+m.end_time)])].sort().map(slot=>{const [start,end]=slot.split('|');return {start,end,break:start==='13:00'&&end==='14:00'}})}
function lessonsAt(id:number,day:number,start:string,end:string){return meetings(id).filter((m:any)=>m.day_of_week===day&&m.start_time===start&&m.end_time===end)}
function lessonClasses(meetingId:number){return unique(assignments.value.filter((a:any)=>a.meeting_id===meetingId),'class_id').map(a=>'G'+a.grade_label+'-C_'+a.class_name).join(', ')}
function teachingDays(id:number){return [...schoolDays,...(meetings(id).some((m:any)=>m.day_of_week===6)?[6]:[])]}
function meetings(id:number){return unique(assignments.value.filter((a:any)=>a.teacher_id===id && a.meeting_id),'meeting_id').sort((a:any,b:any)=>[7,1,2,3,4,5,6].indexOf(a.day_of_week)-[7,1,2,3,4,5,6].indexOf(b.day_of_week)||a.start_time.localeCompare(b.start_time))}
function routineGroups(id:number){
 const groups=new Map<string,{days:number[];day:number}>()
 for(const day of teachingDays(id)){
  const key=JSON.stringify(timetableRows(id).map(slot=>lessonsAt(id,day,slot.start,slot.end).map((m:any)=>m.course_offering_id)))
  const existing=groups.get(key)
  if(existing)existing.days.push(day);else groups.set(key,{days:[day],day})
 }
 return [...groups.values()]
}
function routineDayLabel(values:number[]){return values.length===6 && schoolDays.every(d=>values.includes(d))?'Sun-Fri':values.map(d=>days[d-1].slice(0,3)).join(', ')}
async function load(){if(loading.value)return;loading.value=true;error.value='';directory.value=null
 try{state.value=await scheduleApi('admin/school');if(!years.value.some((y:any)=>y.id===yearId.value))yearId.value=years.value.find((y:any)=>y.start_date<=state.value.today&&y.end_date>=state.value.today)?.id??years.value[0]?.id??0
 if(!terms.value.some((t:any)=>t.id===termId.value))termId.value=terms.value.find((t:any)=>t.start_date<=state.value.today&&t.end_date>=state.value.today)?.id??terms.value[0]?.id??0
 if(yearId.value)directory.value=await scheduleApi('admin/school/teacher-directory?year_id='+yearId.value)
 }catch(e){error.value=e instanceof Error?e.message:'Unable to load teachers.'}finally{loading.value=false}}
onMounted(load)
</script>
<template>
<section class="card teacher-directory"><div class="heading"><div><p class="eyebrow">TEACHER DIRECTORY</p><h2>Teacher list</h2></div><button class="secondary" :disabled="loading" @click="load">Refresh teachers</button></div><p class="muted">Find teachers and their homeroom classes. Check Schedule when you need their teaching routines.</p>
<div class="filters"><label>Academic year<select v-model="yearId" :disabled="loading" @change="termId=0;load()"><option :value="0">Choose a year</option><option v-for="y in years" :key="y.id" :value="y.id">{{y.name}}</option></select></label><label>School term<select v-model="termId" :disabled="loading"><option :value="0">Choose a term</option><option v-for="t in terms" :key="t.id" :value="t.id">{{t.name}}</option></select></label><label>Subject<select v-model="subject" :disabled="loading||!termId"><option value="">All subjects</option><option v-for="s in subjectOptions" :key="s.code" :value="s.code">{{s.name}}</option><option value="__unassigned">No subject assigned</option></select></label><label>Find a teacher<input v-model="search" type="search" placeholder="Name or staff code"></label><label class="schedule-toggle"><input v-model="showSchedules" type="checkbox">Schedule</label></div>
<p v-if="error" class="error" role="alert">{{error}}</p><p v-if="loading" role="status">Loading teachers…</p>
<template v-else-if="directory"><p class="muted" role="status">{{teachers.length}} of {{directory.teachers.length}} teachers<span v-if="subject"> · {{subject==='__unassigned'?'No subject assigned':subjectOptions.find(s=>s.code===subject)?.name}}</span></p><p v-if="!teachers.length" class="muted">No teachers match these filters. Choose All subjects or clear the search.</p><p v-if="!termId" class="muted">Choose or create a school term to view teaching assignments.</p>
<div v-if="!showSchedules&&teachers.length" class="table-scroll directory-table"><table><thead><tr><th scope="col">Teacher</th><th scope="col">Staff code</th><th scope="col">Subject</th><th scope="col">Homeroom class</th></tr></thead><tbody><tr v-for="t in teachers" :key="t.id"><td><strong>{{t.name}}</strong><small>{{t.is_active?'Active':'Inactive'}}</small></td><td>{{t.staff_code}}</td><td>{{subjectTypes(t.id).map(s=>s.course_name).join(' · ')||'Not assigned'}}</td><td><span v-for="cl in homerooms(t.id)" :key="cl.class_id" class="class-label">{{classLabel(cl)}}</span><span v-if="!homerooms(t.id).length">{{varying(t.id).length?'Review conflicting timetable':'Not assigned'}}</span></td></tr></tbody></table></div>
<template v-if="showSchedules">
<article v-for="t in teachers" :key="t.id" class="teacher-row"><div class="teacher-heading"><div><h3>{{t.name}}</h3><p class="muted">{{t.staff_code}} · {{t.is_active?'Active':'Inactive'}}</p></div><span class="badge">{{subjectTypes(t.id).map(s=>s.course_name).join(' · ')||'Subject unassigned'}}</span></div>
<div class="homeroom"><strong>Homeroom class</strong><p v-for="cl in homerooms(t.id)" :key="cl.class_id">{{classLabel(cl)}} <small>Sunday 10 AM teacher</small></p><p v-if="!homerooms(t.id).length" class="muted">No confirmed homeroom class in this term.</p><p v-for="a in varying(t.id)" :key="a.class_id+'-'+a.day_of_week" class="review">{{classLabel(a)}} · {{days[a.day_of_week-1]}} at 10 AM. More than one teacher is linked to Sunday’s first lesson; review the timetable.</p></div>
<div class="table-scroll" tabindex="0" :aria-label="t.name+' teaching routine'"><table class="routine-table"><caption>Daily routine · Nepal time</caption><thead><tr><th scope="col">Days</th><th v-for="slot in timetableRows(t.id)" :key="slot.start+'|'+slot.end" scope="col">{{slot.start}}–{{slot.end}}</th></tr></thead><tbody><tr v-for="group in routineGroups(t.id)" :key="group.day"><th scope="row">{{routineDayLabel(group.days)}}</th><td v-for="slot in timetableRows(t.id)" :key="slot.start+'|'+slot.end" :class="{'tiffin-cell':slot.break}"><span v-if="slot.break">TIFFIN</span><div v-for="m in lessonsAt(t.id,group.day,slot.start,slot.end)" :key="m.meeting_id" class="routine-lesson" :title="m.course_name"><strong>{{lessonClasses(m.meeting_id)}}</strong></div><span v-if="!slot.break && !lessonsAt(t.id,group.day,slot.start,slot.end).length" class="free-period">Free</span></td></tr></tbody></table></div>
</article>
</template>
<p v-if="showSchedules" class="muted">A class without a saved Sunday 10 AM lesson or a linked directory teacher has no confirmed homeroom teacher.</p>
</template></section>
</template>
<style scoped>
.teacher-directory .filters .schedule-toggle{display:flex;align-items:center;gap:8px;align-self:end;min-height:40px;cursor:pointer;margin-top:0}.teacher-directory .filters .schedule-toggle input{width:18px;height:18px;min-height:0;margin:0;padding:0;accent-color:#376751}

.directory-table table{text-align:left;min-width:560px}.directory-table th,.directory-table td{text-align:left;white-space:normal;padding:10px 12px;border-left:0;border-right:0}.directory-table small{display:block;font-size:11px;color:#6d8074;margin-top:4px}.directory-table strong{font-size:13px}.class-label{display:block}.teacher-directory .filters{grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:16px 0}.teacher-directory .filters label{font-size:12px}.teacher-directory .filters input,.teacher-directory .filters select{font-size:13px;padding:9px;min-height:40px}

.heading,.teacher-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.heading h2,.teacher-heading h3{margin:0}.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:20px 0}label{display:block;font-size:14px;font-weight:600}input,select{box-sizing:border-box;width:100%;padding:10px;border:1px solid #bccfc5;border-radius:8px;background:white;color:#243d32;font:inherit;margin-top:6px}.teacher-row{border:1px solid #d9e4dd;border-radius:12px;padding:16px;margin:12px 0;min-width:0}.teacher-heading .muted{margin:5px 0}.badge{padding:7px 12px;border-radius:20px;background:#edf4ef;color:#365847;font-size:13px;font-weight:600}.homeroom{font-size:12px;display:flex;align-items:baseline;gap:6px 12px;flex-wrap:wrap;margin:8px 0}.homeroom p{margin:0}.homeroom small{color:#607969}.review{color:#835c25}.muted{font-size:13px;line-height:1.6;color:#63766c}button{width:auto}.table-scroll{overflow-x:auto;max-width:100%;margin-top:10px}table{width:100%;border-collapse:collapse;font-size:12px;text-align:center}caption{text-align:left;font-size:11px;color:#63766c;margin-bottom:6px}th,td{border:1px solid #dbe5df;padding:9px 7px;white-space:nowrap}thead th{background:#edf4ef;color:#365847;font-size:11px;font-weight:500}.routine-table{min-width:650px;table-layout:fixed}.routine-table th:first-child{width:75px}.routine-table tbody th{font-size:11px}.routine-lesson strong{font-size:12px;font-weight:600}.routine-lesson+.routine-lesson{margin-top:5px}.tiffin-cell{background:#fff3d9;color:#795a25;font-size:11px;font-weight:600}.free-period{color:#87988e}@media(max-width:600px){.heading{align-items:start;flex-direction:column}.teacher-row{padding:12px}.teacher-heading{flex-wrap:wrap}.badge{font-size:12px}.homeroom small{display:none}}
</style>
