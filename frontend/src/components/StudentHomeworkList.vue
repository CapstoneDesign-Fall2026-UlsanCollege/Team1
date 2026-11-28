<script setup lang="ts">
import HomeworkStatus from './HomeworkStatus.vue'
import {homeworkDateLabel} from '../student-homework-filters'
defineProps<{items:any[];today:string}>()
</script>
<template><div class="student-task-list"><details v-for="h in items" :key="h.id" class="student-task"><summary :aria-label="h.title+', '+h.course_name+', due '+h.due_on+'. Open instructions'"><span class="task-first"><strong>{{h.title}}</strong><HomeworkStatus :status="h.progress_status" :due-on="h.due_on" :today="today" /></span><span class="task-second"><span>{{h.course_name}}</span><time :datetime="h.due_on">Due {{homeworkDateLabel(h.due_on,today)}}</time><span class="task-expand" aria-hidden="true">+</span></span></summary><div class="task-detail"><p>{{h.instructions||'No additional instructions.'}}</p><dl><div><dt>Teacher</dt><dd>{{h.teacher_name||'Not listed'}}</dd></div><div><dt>Due date</dt><dd>{{h.due_on}}</dd></div><div v-if="h.assigned_on"><dt>Assigned</dt><dd>{{h.assigned_on}}</dd></div></dl></div></details></div></template>
