<script setup lang="ts">
import {computed,onMounted,onUnmounted,reactive,ref,watch} from 'vue'
import {scheduleApi,days} from '../schedules'
defineProps<{loginId:string;busy:boolean;error:string}>()
defineEmits<{logout:[]}>()
const data=ref<any>(null),page=ref('schedule'),loading=ref(false),saving=ref(false),error=ref(''),message=ref('')
const classId=ref(0),attendanceClass=ref(0),date=ref(''),day=ref(7),students=ref<any[]>([]),sheet=ref<any>(null),homework=ref<any[]>([])
const form=reactive({id:0,version:0,assignment:'',title:'',instructions:'',due_on:'',is_active:true})
const classes=computed<any[]>(()=>[...new Map<number,any>([...(data.value?.assignments??[]),...(data.value?.homerooms??[])].map(c=>[c.class_id,c])).values()])
const currentLessons=computed(()=>(data.value?.lessons??[]).filter((l:any)=>l.day_of_week===day.value))
const label=(c:any)=>'Grade '+c.grade_label+' · Class '+c.class_name
function assignment(id:number){return data.value?.assignments.find((a:any)=>a.offering_id===id)}
const rosterSearch=ref(''),rosterPage=ref(1)
const filteredStudents=computed(()=>students.value.filter(s=>(s.full_name+' '+s.login_id).toLowerCase().includes(rosterSearch.value.trim().toLowerCase())))
const rosterPages=computed(()=>Math.max(1,Math.ceil(filteredStudents.value.length/10)))
const visibleStudents=computed(()=>filteredStudents.value.slice((rosterPage.value-1)*10,rosterPage.value*10))
watch([rosterSearch,classId],()=>rosterPage.value=1)
const statusCount=computed(()=>sheet.value?.students.filter((s:any)=>s.status).length??0)
let timer:ReturnType<typeof setTimeout>|undefined,readVersion=0
watch(message,v=>{clearTimeout(timer);if(v)timer=setTimeout(()=>message.value='',4000)})
onUnmounted(()=>{clearTimeout(timer);readVersion++})
function resetHomework(){Object.assign(form,{id:0,version:0,assignment:'',title:'',instructions:'',due_on:data.value?.today??'',is_active:true})}
async function load(){
 loading.value=true;error.value=''
 try{data.value=await scheduleApi('teacher/dashboard');day.value=new Date(data.value.today+'T00:00:00Z').getUTCDay()||7;date.value=data.value.today;classId.value=classes.value[0]?.class_id??0;attendanceClass.value=data.value.homerooms[0]?.class_id??0;resetHomework();await loadPage()}
 catch(e){error.value=e instanceof Error?e.message:'Unable to load teacher workspace.'}
 finally{loading.value=false}
}
async function loadPage(){
 const version=++readVersion;error.value='';students.value=[];sheet.value=null
 try{
  if(page.value==='students'&&classId.value){const r=await scheduleApi('teacher/classes/'+classId.value+'/students');if(version===readVersion){students.value=r.students;rosterPage.value=1}}
  if(page.value==='attendance'&&attendanceClass.value&&date.value){const r=await scheduleApi('teacher/classes/'+attendanceClass.value+'/attendance?date='+date.value);if(version===readVersion)sheet.value=r}
  if(page.value==='homework'){const r=await scheduleApi('teacher/homework');if(version===readVersion)homework.value=r.homework}
 }catch(e){if(version===readVersion)error.value=e instanceof Error?e.message:'Unable to load this page.'}
}
async function open(next:string){page.value=next;await loadPage()}
async function saveHomework(){
 saving.value=true;error.value=''
 try{
  const [cl,off]=form.assignment.split(':').map(Number)
  const r=await scheduleApi('teacher/homework'+(form.id?'/'+form.id:''),form.id?'PUT':'POST',{class_id:cl,offering_id:off,title:form.title,instructions:form.instructions,due_on:form.due_on,version:form.version,is_active:form.is_active})
  message.value=r.message;resetHomework();await loadPage()
 }catch(e){error.value=e instanceof Error?e.message:'Unable to save homework.'}finally{saving.value=false}
}
function edit(h:any){Object.assign(form,{id:h.id,version:h.version,assignment:h.class_id+':'+h.offering_id,title:h.title,instructions:h.instructions,due_on:h.due_on,is_active:Boolean(h.is_active)})}
async function saveAttendance(){
 if(!sheet.value)return;saving.value=true;error.value=''
 try{const r=await scheduleApi('teacher/classes/'+attendanceClass.value+'/attendance','PUT',{date:date.value,version:sheet.value.version,records:sheet.value.students.filter((s:any)=>s.status).map((s:any)=>({student_user_id:s.id,status:s.status}))});message.value=r.message;await loadPage()}
 catch(e){error.value=e instanceof Error?e.message:'Unable to save attendance. Reload before retrying.'}finally{saving.value=false}
}
onMounted(load)
</script>
<template><div class="teacher-shell"><header><a class="brand" href="/">S<span>StudentHub</span></a><button class="secondary" :disabled="busy||saving" @click="$emit('logout')">Log out</button></header><main>
<div class="welcome"><div><p class="eyebrow">TEACHER WORKSPACE · {{data?.school?.name||'Your school'}}</p><h1>{{data?.teacher?.name||loginId}}</h1><p>{{data?.teacher?.staff_code}} · Your lessons, classes and daily tasks.</p></div><button class="secondary" :disabled="loading||saving" @click="load">Refresh workspace</button></div>
<nav aria-label="Teacher navigation"><button v-for="t in [{id:'schedule',name:'My schedule'},{id:'students',name:'Class students'},{id:'homework',name:'Homework'},{id:'attendance',name:'Homeroom attendance'}]" :key="t.id" :class="{secondary:page!==t.id}" :disabled="saving||loading" :aria-current="page===t.id?'page':undefined" @click="open(t.id)">{{t.name}}</button></nav>
<p v-if="error||$props.error" class="error" role="alert">{{error||$props.error}}</p><p v-if="message" class="success" role="status">{{message}}</p><p v-if="loading" role="status">Loading your workspace…</p>
<template v-if="data&&!loading">
<div class="facts"><span>{{classes.length}} assigned class(es)</span><span>Homeroom: {{data.homerooms.length?data.homerooms.map(label).join(', '):'Not assigned'}}</span><span>Nepal time</span></div>
<section v-if="page==='schedule'" class="panel"><div class="toolbar"><h2>My teaching schedule</h2><label>Day<select v-model="day"><option v-for="d in [7,1,2,3,4,5,6]" :key="d" :value="d">{{days[d-1]}}</option></select></label></div><p class="muted">Weekly lessons in currently active terms · Tiffin 1–2 PM</p><p v-if="!currentLessons.length">No lessons on this day.</p><article v-for="l in currentLessons" :key="l.id" class="lesson"><time>{{l.start_time}}–{{l.end_time}}</time><div><strong>{{assignment(l.course_offering_id)?.course_name}}</strong><p>{{assignment(l.course_offering_id)?label(assignment(l.course_offering_id)):''}} · {{l.location||'Room not set'}}</p></div></article></section>
<section v-if="page==='students'" class="panel"><div class="toolbar"><h2>Class students</h2><label>Class<select v-model="classId" :disabled="saving" @change="loadPage"><option v-for="c in classes" :key="c.class_id" :value="c.class_id">{{label(c)}}</option></select></label></div><p class="muted">Students enrolled today. Contact details are kept private.</p><p v-if="!students.length">No students to show for this class.</p><label>Find a student<input v-model="rosterSearch" type="search" placeholder="Name or student ID"></label><p class="muted">{{filteredStudents.length}} students · Page {{rosterPage}} of {{rosterPages}}</p><ol class="roster"><li v-for="s in visibleStudents" :key="s.id"><strong>{{s.full_name}}</strong><span>{{s.login_id}}</span></li></ol><div class="pager"><button class="secondary" :disabled="rosterPage===1" @click="rosterPage--">Previous</button><button class="secondary" :disabled="rosterPage===rosterPages" @click="rosterPage++">Next</button></div></section>
<section v-if="page==='homework'" class="panel"><h2>{{form.id?'Edit homework':'Assign homework'}}</h2><form @submit.prevent="saveHomework"><fieldset :disabled="saving"><div class="fields"><label>Class subject<select v-model="form.assignment" required :disabled="!!form.id"><option value="" disabled>Choose your class and subject</option><option v-for="a in data.assignments" :key="a.class_id+':'+a.offering_id" :value="a.class_id+':'+a.offering_id">{{label(a)}} · {{a.course_name}}</option></select></label><label>Due date<input v-model="form.due_on" type="date" :min="data.today" required></label></div><label>Title<input v-model="form.title" required maxlength="150"></label><label>Instructions<textarea v-model="form.instructions" required maxlength="2000" rows="3"></textarea></label><label v-if="form.id" class="check"><input v-model="form.is_active" type="checkbox">Visible to students</label><button :disabled="!data.assignments.length">{{saving?'Saving…':form.id?'Save changes':'Assign homework'}}</button><button v-if="form.id" type="button" class="secondary" @click="resetHomework">Cancel</button></fieldset></form><h3>My assignments</h3><p v-if="!homework.length">No homework assigned yet.</p><article v-for="h in homework" :key="h.id" class="homework"><div><strong>{{h.title}}</strong><small>{{assignment(h.offering_id)?.course_name||'Previous subject'}} · {{classes.find(c=>c.class_id===h.class_id)?label(classes.find(c=>c.class_id===h.class_id)):'Previous class'}} · Due {{h.due_on}} · {{h.is_active?'Visible':'Archived'}}</small><p class="instructions">{{h.instructions}}</p></div><button class="secondary" :disabled="saving" @click="edit(h)">Edit</button></article></section>
<section v-if="page==='attendance'" class="panel"><div class="toolbar"><h2>Homeroom attendance</h2><label>Class<select v-model="attendanceClass" :disabled="saving" @change="loadPage"><option v-for="c in data.homerooms" :key="c.class_id" :value="c.class_id">{{label(c)}}</option></select></label><label>Date<input v-model="date" type="date" :max="data.today" :disabled="saving" @change="loadPage"></label></div>
<p v-if="!data.homerooms.length">No homeroom is assigned to you. Your administrator can review Sunday’s 10 AM first lesson.</p><p class="muted">Choose each student’s status explicitly. Unmarked students are not counted as present. Saved statuses stay unless you change them. Saturday or closure dates are not automatically inferred.</p>
<template v-if="sheet"><p>{{statusCount}} of {{sheet.students.length}} marked</p><ul class="roster"><li v-for="s in sheet.students" :key="s.id"><div><strong>{{s.full_name}}</strong><small>{{s.login_id}}</small></div><label class="status-label"><span class="sr-only">Attendance for {{s.full_name}}</span><select v-model="s.status" :disabled="saving"><option value="" disabled>Unmarked</option><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option><option value="excused">Excused</option></select></label></li></ul><button :disabled="saving||!statusCount" @click="saveAttendance">{{saving?'Saving…':'Save attendance'}}</button><button class="secondary" :disabled="saving" @click="loadPage">Reload saved attendance</button></template></section>
</template></main></div></template>
<style scoped>
.teacher-shell{max-width:1120px;margin:auto;padding:0 24px;color:#243e33}.teacher-shell header,.welcome,.toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.teacher-shell header{padding:22px 0;border-bottom:1px solid #dae5dc}.teacher-shell main{padding:26px 0}.welcome h1{font-size:30px;margin:8px 0}.welcome p{font-size:13px;color:#63796b}.teacher-shell nav{display:flex;gap:8px;overflow:auto;padding:12px 0}.teacher-shell button{width:auto;padding:10px 14px;margin:0;font-size:13px;min-height:40px}.pager{display:flex;justify-content:space-between;gap:10px;margin-top:12px}.facts{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 18px;font-size:12px}.facts span{background:#eaf2ec;border-radius:20px;padding:8px 12px}.panel{background:white;border:1px solid #d9e5dc;border-radius:14px;padding:20px;min-width:0}.panel h2{font-size:20px;margin:0 0 12px}.toolbar label{font-size:12px}.teacher-shell input,.teacher-shell select,.teacher-shell textarea{font:inherit;font-size:14px;background:white;color:#243e33;border:1px solid #bacebf;border-radius:8px;padding:10px;width:100%;box-sizing:border-box;margin:5px 0 12px}.toolbar select{min-width:160px}.fields{display:grid;grid-template-columns:2fr 1fr;gap:12px}.teacher-shell label{display:block;font-size:13px}.teacher-shell fieldset{border:0;padding:0;margin:12px 0;min-width:0}.teacher-shell fieldset button,.panel>button{margin:8px 8px 0 0}.lesson{display:flex;gap:24px;padding:16px 0;border-bottom:1px solid #e3ebe6}.lesson time{font-size:13px;min-width:90px}.lesson p,.homework p{font-size:13px;margin:6px 0}.roster{padding:0;list-style:none}.roster li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #e3ebe6;font-size:14px}.roster span,.muted,small{font-size:12px;color:#667c6f}small{display:block;margin:5px 0}.status-label select{margin:0;min-width:110px}.homework{display:flex;justify-content:space-between;align-items:start;gap:12px;padding:16px 0;border-bottom:1px solid #e3ebe6}.instructions{white-space:pre-wrap;overflow-wrap:anywhere}.check{display:flex!important;gap:8px;align-items:center}.check input{width:auto!important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}@media(max-width:600px){.teacher-shell{padding:0 14px}.panel{padding:14px}.welcome h1{font-size:24px}.fields{grid-template-columns:1fr}.toolbar{align-items:start;gap:8px}.toolbar h2{width:100%}.toolbar label{flex:1;min-width:120px}.teacher-shell nav{display:grid;grid-template-columns:1fr 1fr;overflow:visible}.teacher-shell nav button{white-space:normal;width:100%;font-size:12px;padding:10px 8px}.roster strong{font-size:13px}.lesson{gap:12px}}
</style>
