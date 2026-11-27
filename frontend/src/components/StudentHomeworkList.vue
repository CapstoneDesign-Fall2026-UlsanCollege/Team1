<script setup lang="ts">
import HomeworkStatus from './HomeworkStatus.vue'
defineProps<{items:any[];today:string}>()
</script>
<template><article v-for="h in items" :key="h.id"><small>{{h.course_name}} · {{h.teacher_name}}</small><h3>{{h.title}}</h3><strong>Due {{h.due_on}}</strong><div><HomeworkStatus :status="h.progress_status" :due-on="h.due_on" :today="today" /></div><p>{{h.instructions}}</p></article></template>
<style scoped>article{padding:16px 0;border-bottom:1px solid #dce6df;min-width:0;overflow-wrap:anywhere}article:last-child{border-bottom:0}small{color:#66796e;font-size:12px}h3{font-size:17px;margin:8px 0}strong{font-size:12px}article p{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.6;margin:8px 0}</style>
