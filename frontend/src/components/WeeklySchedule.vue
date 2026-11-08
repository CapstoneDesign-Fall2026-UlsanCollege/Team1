<script setup lang="ts">
import {groupWeeklyRoutine} from '../weekly-routine'
import {computed} from 'vue'
import StudentIcon from './StudentIcon.vue'
import { days, type Meeting } from '../schedules'
const props=defineProps<{ meetings: Meeting[]; editable?: boolean; busy?: boolean; school?:boolean; compact?:boolean }>()
const displayDays=computed(()=> (props.school?[7,1,2,3,4,5,...(props.meetings.some(m=>m.day_of_week===6)?[6]:[])]:[1,2,3,4,5,6,7]).map(id=>({id,name:days[id-1]})))
const routines=computed(()=>groupWeeklyRoutine(props.meetings,Boolean(props.school)))

defineEmits<{ edit: [meeting: Meeting]; remove: [meeting: Meeting] }>()
</script>
<template>
  <div v-if="compact&&!editable" class="routine-groups">
    <p class="routine-help">Days with the same lessons share one routine. Different schedules are shown separately.</p>
    <section v-for="routine in routines" :key="routine.days.join('-')" class="routine-group">
      <div class="routine-heading"><h3>{{routine.label}}</h3><span>{{routine.meetings.length?routine.meetings.length+' lessons per day':'No lessons'}}</span></div>
      <p v-if="!routine.meetings.length" class="free">No classes scheduled.</p>
      <ol v-else class="routine-lessons"><li v-for="m in routine.meetings" :key="m.id"><time>{{m.start_time.slice(0,5)}}–{{m.end_time.slice(0,5)}}</time><div><strong>{{m.course_name}}</strong><small>{{m.professor||(school?'Teacher not assigned':'Professor not assigned')}}<span v-if="m.location"> · {{m.location}}</span><span v-if="!school"> · Section {{m.section}}</span></small></div></li></ol>
      <p v-if="school&&routine.meetings.length" class="routine-break">Tiffin · 1–2 PM</p>
    </section>
  </div>
  <div v-else class="week">
    <section v-for="day in displayDays" :key="day.id" class="day">
      <h3>{{ day.name }} <small>{{ meetings.filter(m => m.day_of_week === day.id).length }} classes</small></h3>
      <p v-if="!meetings.some(m => m.day_of_week === day.id)" class="free">No classes scheduled</p>
      <article v-for="m in meetings.filter(m => m.day_of_week === day.id).sort((a,b) => a.start_time.localeCompare(b.start_time))" :key="m.id" class="meeting">
        <strong class="time">{{ m.start_time.slice(0,5) }} – {{ m.end_time.slice(0,5) }}</strong>
        <h4>{{ m.course_code }} · {{ m.course_name }}</h4>
        <p>{{ m.location }}<span v-if="!school"> · Section {{ m.section }}</span></p><p>{{ m.professor || (school?'Teacher not assigned':'Professor not assigned') }}</p>
        <div v-if="editable" class="actions"><button title="Edit" type="button" :disabled="busy" @click="$emit('edit', m)" :aria-label="'Edit ' + m.course_code + ' on ' + day.name"><StudentIcon name="edit" /></button><button title="Remove" type="button" class="remove" :disabled="busy" @click="$emit('remove', m)" :aria-label="'Remove ' + m.course_code + ' on ' + day.name"><StudentIcon name="remove" /></button></div>
      </article>
    </section>
  </div>
</template>
<style scoped>
.week{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px}.day{background:#f7f9fc;border:1px solid #d7e0eb;border-radius:12px;padding:15px;min-width:0}.day h3{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:15px;margin:0 0 14px;color:#263349}.day small{font-size:12px;color:#64748b;font-weight:400}.free{font-size:13px;color:#66758a}.meeting{padding:14px;background:white;border:1px solid #d6e0ed;border-left:4px solid #4b6da6;border-radius:8px;margin-top:10px;overflow-wrap:anywhere}.time{font-size:13px;color:#355887}.meeting h4{font-size:14px;line-height:1.5;margin:8px 0}.meeting p{font-size:13px;line-height:1.5;margin:5px 0;color:#55647b}.actions{display:flex;gap:8px;margin-top:12px}.actions button{background:#edf2fa;color:#315487;font-size:12px;padding:8px 12px}.actions .remove{background:#fff0ed;color:#9f302a}button:focus-visible{outline:3px solid #5585bc;outline-offset:3px}
.routine-groups{display:grid;gap:14px}.routine-help{font-size:12px;color:#6b7e70;margin:0;line-height:1.6}.routine-group{border:1px solid #d8e5db;border-radius:12px;background:white;padding:16px}.routine-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding-bottom:10px;border-bottom:1px solid #e1eae3}.routine-heading h3{font-size:16px;color:#2d513b;margin:0}.routine-heading>span{font-size:11px;color:#708273}.routine-lessons{list-style:none;margin:0;padding:0}.routine-lessons li{display:grid;grid-template-columns:110px minmax(0,1fr);gap:14px;padding:12px 0;border-bottom:1px solid #edf1ed}.routine-lessons time{font-size:12px;color:#4c7259}.routine-lessons strong{display:block;font-size:14px;color:#2d4133}.routine-lessons small{display:block;font-size:12px;color:#708075;margin-top:5px;overflow-wrap:anywhere}.routine-break{font-size:12px;background:#fff5df;color:#7a602d;border-radius:7px;padding:9px;margin:12px 0 0}@media(max-width:500px){.routine-group{padding:13px}.routine-lessons li{grid-template-columns:84px minmax(0,1fr);gap:9px}.routine-lessons small{font-size:11px}.routine-heading h3{font-size:15px}}
</style>
