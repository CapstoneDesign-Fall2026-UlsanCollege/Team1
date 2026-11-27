<script setup lang="ts">
withDefaults(defineProps<{status?:string;dueOn?:string;today?:string}>(),{status:'pending'})
const labels:Record<string,string>={pending:'Unmarked',submitted:'O · Done',missing:'X · Not done',reviewed:'O · Reviewed',late:'– · Late submission'}
</script>
<template><span class="homework-status" :class="status">{{labels[status]||'Pending'}}{{status==='pending'&&dueOn&&today&&dueOn<today?' · Overdue':''}}</span></template>
<style scoped>.homework-status{display:inline-block;margin:8px 0;padding:6px 10px;border-radius:8px;background:#eef2f0;color:#465f54;font-size:13px;font-weight:600}.submitted{background:#e5f1fa;color:#255a80}.reviewed{background:#e5f4eb;color:#185b38}.missing{background:#fff0ed;color:#a22f24}</style>
