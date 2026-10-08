<script setup lang="ts">
import StudentIcon from './StudentIcon.vue'
import { apiFetch } from '../api'
import { ref } from 'vue'
const emit = defineEmits<{ created: [] }>()
const name=ref('Fall Semester'), year=ref(new Date().getFullYear()), start=ref(''), end=ref(''), error=ref(''), saving=ref(false)
async function submit(){ error.value=''; saving.value=true; try { const r=await apiFetch('/api/admin/semesters',{method:'POST',headers:{'Content-Type':'application/json','X-StudentHub':'1'},body:JSON.stringify({name:name.value,academic_year:year.value,start_date:start.value,end_date:end.value})}); const d=await r.json(); if(!r.ok) throw new Error(d.message); name.value='Fall Semester'; start.value=''; end.value=''; emit('created') } catch(e){error.value=e instanceof Error?e.message:'Unable to create semester'} finally{saving.value=false} }
</script>
<template><section class="card semester-create"><p class="eyebrow">ACADEMIC SETUP</p><h2>Create semester</h2><form @submit.prevent="submit"><label>Name<input v-model="name" required maxlength="100"></label><label>Academic year<input v-model.number="year" type="number" min="2000" max="2200" required></label><div class="date-grid"><label>Start date<input v-model="start" type="date" required></label><label>End date<input v-model="end" type="date" required></label></div><p v-if="error" class="error">{{error}}</p><button :disabled="saving"><StudentIcon name="save" />{{saving?'Saving…':'Add semester'}}</button></form></section></template>
