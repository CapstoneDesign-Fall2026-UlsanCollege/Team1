<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {scheduleApi} from '../schedules'
const loading=ref(false),error=ref(''),items=ref<any[]>([])
async function load(){loading.value=true;error.value='';try{items.value=(await scheduleApi('student/homework')).homework}catch(e){error.value=e instanceof Error?e.message:'Unable to load homework.'}finally{loading.value=false}}
onMounted(load)
</script>
<template><section class="homework-panel"><div class="heading"><h2>Class homework</h2><button class="secondary" :disabled="loading" @click="load">Refresh</button></div><p v-if="loading" role="status">Loading homework…</p><p v-if="error" class="error" role="alert">{{error}}</p><p v-if="!loading&&!error&&!items.length">No homework has been assigned to your current class.</p><article v-for="h in items" :key="h.id"><small>{{h.course_name}} · {{h.teacher_name}}</small><h3>{{h.title}}</h3><strong>Due {{h.due_on}}</strong><p>{{h.instructions}}</p></article></section></template>
<style scoped>
.heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.heading button{width:auto;padding:9px 12px;font-size:12px}article{padding:16px 0;border-bottom:1px solid #dce6df}small{color:#66796e;font-size:12px}h3{font-size:17px;margin:8px 0}strong{font-size:12px}article p{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.6}
</style>
