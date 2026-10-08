<script setup lang="ts">
import StudentIcon from './StudentIcon.vue'
import { days, type Meeting } from '../schedules'
defineProps<{ meetings: Meeting[]; editable?: boolean; busy?: boolean }>()
defineEmits<{ edit: [meeting: Meeting]; remove: [meeting: Meeting] }>()
</script>
<template>
  <div class="week">
    <section v-for="(day, index) in days" :key="day" class="day">
      <h3>{{ day }} <small>{{ meetings.filter(m => m.day_of_week === index + 1).length }} classes</small></h3>
      <p v-if="!meetings.some(m => m.day_of_week === index + 1)" class="free">No classes scheduled</p>
      <article v-for="m in meetings.filter(m => m.day_of_week === index + 1).sort((a,b) => a.start_time.localeCompare(b.start_time))" :key="m.id" class="meeting">
        <strong class="time">{{ m.start_time.slice(0,5) }} – {{ m.end_time.slice(0,5) }}</strong>
        <h4>{{ m.course_code }} · {{ m.course_name }}</h4>
        <p>{{ m.location }} · Section {{ m.section }}</p><p>{{ m.professor || 'Professor not assigned' }}</p>
        <div v-if="editable" class="actions"><button title="Edit" type="button" :disabled="busy" @click="$emit('edit', m)" :aria-label="'Edit ' + m.course_code + ' on ' + day"><StudentIcon name="edit" /></button><button title="Remove" type="button" class="remove" :disabled="busy" @click="$emit('remove', m)" :aria-label="'Remove ' + m.course_code + ' on ' + day"><StudentIcon name="remove" /></button></div>
      </article>
    </section>
  </div>
</template>
<style scoped>
.week{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px}.day{background:#f7f9fc;border:1px solid #d7e0eb;border-radius:12px;padding:15px;min-width:0}.day h3{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:15px;margin:0 0 14px;color:#263349}.day small{font-size:12px;color:#64748b;font-weight:400}.free{font-size:13px;color:#66758a}.meeting{padding:14px;background:white;border:1px solid #d6e0ed;border-left:4px solid #4b6da6;border-radius:8px;margin-top:10px;overflow-wrap:anywhere}.time{font-size:13px;color:#355887}.meeting h4{font-size:14px;line-height:1.5;margin:8px 0}.meeting p{font-size:13px;line-height:1.5;margin:5px 0;color:#55647b}.actions{display:flex;gap:8px;margin-top:12px}.actions button{background:#edf2fa;color:#315487;font-size:12px;padding:8px 12px}.actions .remove{background:#fff0ed;color:#9f302a}button:focus-visible{outline:3px solid #5585bc;outline-offset:3px}
</style>
