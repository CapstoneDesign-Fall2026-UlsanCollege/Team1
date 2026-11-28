<script setup lang="ts">
import '../styles/student-workspace.css'
withDefaults(defineProps<{status?:string;dueOn?:string;today?:string}>(),{status:'pending'})
const labels:Record<string,string>={pending:'Unmarked',submitted:'Done',missing:'Not done',reviewed:'Reviewed',late:'Late submission'}
</script>
<template><span class="homework-status" :class="status">{{labels[status]||'Unmarked'}}<span v-if="status==='pending'&&dueOn&&today&&dueOn<today">, overdue</span></span></template>
