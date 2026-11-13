<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {scheduleApi} from '../schedules'
const props=defineProps<{dashboard?:boolean}>()
const emit=defineEmits<{open:[page:'course'|'schedule'];context:[school:{name:string;level:string}|null]}>()
type Data={school:{name:string;level:string}|null;today:string;membership:{year_name:string;grade_label:string;class_name:string;starts_on:string}|null;room:{id:number;room_number:string;name:string}|null;homeroom_teacher:{name:string;staff_code:string}|null;homeroom_status:string;lessons:{id:number;start_time:string;end_time:string;course_name:string;teacher_name:string|null;location:string}[]}
const loading=ref(true),error=ref(''),data=ref<Data|null>(null)
async function load(){loading.value=true;error.value='';data.value=null;try{data.value=await scheduleApi('student/school');emit('context',data.value!.school)}catch(e){error.value=e instanceof Error?e.message:'Unable to load your class.'}finally{loading.value=false}}
function dateLabel(value:string){return new Date(value+'T00:00:00Z').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'})}
onMounted(load)
</script>
<template>
<section class="my-class student-panel">
 <div class="heading"><div><p class="eyebrow">{{dashboard?'YOUR SCHOOL DAY':'MY CLASS'}}</p><h2>{{data?.membership?'Grade '+data.membership.grade_label+' · Class '+data.membership.class_name:'Your class'}}</h2></div><button type="button" class="secondary" :disabled="loading" @click="load">Refresh</button></div>
 <p v-if="loading" role="status">Loading your class…</p><p v-else-if="error" class="error" role="alert">{{error}} <button @click="load">Retry</button></p>
 <template v-else-if="data">
 <p class="school-name">{{data.school?.name??'StudentHub'}} <span v-if="data.membership">· {{data.membership.year_name}}</span></p>
 <p v-if="!data.school" class="muted">School class information has not been set up. You can still use your assigned academic pages.</p>
 <p v-else-if="!data.membership" class="muted">No class is assigned to you for {{data.today}}. Ask your school administrator to check your enrollment.</p>
 <template v-else>
 <div class="class-facts"><article><span>Homeroom teacher</span><strong>{{data.homeroom_teacher?.name??(data.homeroom_status==='needs_review'||data.homeroom_status==='inactive'?'Awaiting school update':'Not assigned yet')}}</strong><small v-if="!data.homeroom_teacher">Your administrator can update the class timetable.</small></article><article><span>Your classroom</span><strong>{{data.room?'Room '+data.room.room_number:'Not assigned yet'}}</strong><small v-if="data.room">{{data.room.name}}</small></article></div>
 <div v-if="dashboard" class="today"><div class="today-heading"><h3>{{dateLabel(data.today)}}</h3><span>Nepal time</span></div><p v-if="!data.lessons.length" class="muted">No lessons scheduled for today.</p><ol v-else><li v-for="lesson in data.lessons" :key="lesson.id"><time>{{lesson.start_time}}–{{lesson.end_time}}</time><div><strong>{{lesson.course_name}}</strong><small>{{lesson.teacher_name||'Teacher not assigned'}}<span v-if="lesson.location"> · {{lesson.location}}</span></small></div></li></ol><p v-if="new Date(data.today+'T00:00:00Z').getUTCDay()!==6" class="tiffin">Tiffin break · 1–2 PM</p></div>
 </template>
 <div class="class-actions"><button type="button" @click="emit('open','schedule')">Weekly timetable</button><button type="button" class="secondary" @click="emit('open','course')">Subjects</button></div>
 </template>
</section>
</template>
<style scoped>
.my-class{padding:20px!important;border:1px solid #dce6df!important;border-radius:14px!important;background:#fff;color:#243e33}.heading,.today-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.heading h2{margin:0;font-size:21px!important}.heading .eyebrow{font-size:10px;letter-spacing:1.3px;color:#688475;margin:0 0 7px}.heading button{width:auto;padding:8px 12px;font-size:12px}.school-name{font-size:12px;color:#647a6d;line-height:1.6}.class-facts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}.class-facts article{padding:14px;background:#edf4ef;border-radius:10px;min-width:0}.class-facts span,.class-facts strong,.class-facts small{display:block}.class-facts span{font-size:11px;color:#657c6e}.class-facts strong{font-size:15px;margin:8px 0;overflow-wrap:anywhere}.class-facts small,.muted{font-size:12px;line-height:1.6;color:#6a7c72}.today h3{font-size:14px;margin:10px 0}.today-heading>span{font-size:11px;color:#698173}.today ol{list-style:none;margin:8px 0;padding:0}.today li{display:flex;gap:16px;padding:12px 0;border-bottom:1px solid #e5ece7}.today time{font-size:12px;color:#486d57;min-width:84px}.today li strong{display:block;font-size:14px}.today li small{display:block;margin-top:4px;font-size:11px;color:#6c7d72}.tiffin{font-size:12px;background:#fff5dd;color:#806326;border-radius:8px;padding:10px}.class-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.class-actions button{width:auto;font-size:12px;padding:10px 14px}@media(max-width:420px){.my-class{padding:15px!important}.heading h2{font-size:18px!important}.today li{gap:10px}}
</style>
