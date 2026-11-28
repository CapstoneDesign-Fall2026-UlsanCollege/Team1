<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {scheduleApi} from '../schedules'
import profileAvatar from '../assets/student-avatar.svg'
import StudentIcon from './StudentIcon.vue'
type Destination='notices'|'homework'|'school'|'profile'|'semester'|'course'|'schedule'|'jobs'|'home'|'life'|'settings'|'eat'
const props=defineProps<{items:{page:Destination;title:string;icon:string}[]}>()
const emit=defineEmits<{open:[page:Destination];context:[school:{name:string;level:string}|null]}>()
const school=ref<{name:string;level:string}|null>(null),loading=ref(false),error=ref('')
const hints:Partial<Record<Destination,string>>={notices:'School and class updates',homework:'Assignments from your teachers',school:'Class, timetable & subjects',schedule:'Your weekly routine',course:'Subjects & teachers',eat:'Menu, hours & location',profile:'Your personal information',jobs:'Search and saved jobs',semester:'Assigned semesters'}
const order:Destination[]=['school','schedule','notices','homework','course','eat','jobs','semester']
function features(){return order.flatMap(page=>props.items.filter(item=>item.page===page))}
async function load(){loading.value=true;error.value='';try{const data=await scheduleApi('student/school');school.value=data.school;emit('context',data.school)}catch(e){error.value=e instanceof Error?e.message:'Unable to load school information.'}finally{loading.value=false}}
onMounted(load)
</script>
<template>
<section class="student-home" aria-label="Student home">
 <div class="welcome"><p>STUDENTHUB</p><div class="school-heading"><h2>{{school?.name||'Your student workspace'}}</h2><button v-if="items.some(item=>item.page==='profile')" type="button" class="profile-shortcut" aria-label="Open student profile" title="Student profile" @click="emit('open','profile')"><img :src="profileAvatar" alt="" width="48" height="48"><span>My profile</span></button></div><span>Choose what you need. Everything is one tap away.</span></div>
 <p v-if="loading" class="home-status" role="status">Loading your school…</p>
 <p v-if="error" class="error" role="alert">{{error}} <button class="retry" @click="load">Retry</button></p>
 <nav class="feature-tabs" aria-label="Student features"><button v-for="item in features()" :key="item.page" type="button" class="feature-tab" @click="emit('open',item.page)"><span class="feature-icon"><StudentIcon :name="item.icon"/></span><span class="feature-copy"><strong>{{item.title}}</strong><small>{{hints[item.page]}}</small></span><span class="feature-arrow" aria-hidden="true">›</span></button></nav>
</section>
</template>
<style scoped>
.student-home{min-width:0}.welcome{padding:4px 0 22px}.welcome p{font-size:10px;letter-spacing:1.6px;color:#66816f;margin:0 0 10px}.welcome h2{font-size:24px!important;line-height:1.35;margin:0 0 8px!important;color:#244635;overflow-wrap:anywhere}.welcome>span{font-size:13px;color:#748175;line-height:1.6}.feature-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.feature-tab{display:flex;align-items:center;gap:14px;min-height:100px;border:1px solid #d7e5db;border-radius:12px;background:#f5f9f6;padding:18px;text-align:left;color:#2d523b;width:100%;margin:0}.feature-tab:hover{background:#eaf3ed;border-color:#9bbca6}.feature-tab:focus-visible{outline:3px solid #4f8962;outline-offset:3px}.feature-icon{display:grid;place-items:center;background:#e5f0e8;border-radius:10px;width:44px;height:44px;flex-shrink:0}.feature-icon svg{width:24px;height:24px}.feature-copy{min-width:0;flex:1}.feature-copy strong,.feature-copy small{display:block}.feature-copy strong{font-size:15px;margin-bottom:7px}.feature-copy small{font-size:11px;line-height:1.5;color:#738577;font-weight:400}.feature-arrow{color:#91a996;font-size:24px}.home-status{font-size:12px;color:#6d8073}.retry{font-size:12px;padding:7px 10px}@media(max-width:500px){.welcome{padding-bottom:18px}.welcome h2{font-size:20px!important}.feature-tabs{gap:10px}.feature-tab{min-height:124px;flex-direction:column;align-items:flex-start;gap:10px;padding:14px;position:relative}.feature-icon{height:34px;width:34px;border-radius:8px}.feature-icon svg{width:20px;height:20px}.feature-copy strong{font-size:14px;margin-bottom:4px}.feature-copy small{font-size:10px}.feature-arrow{position:absolute;right:12px;top:16px;font-size:20px}}
.school-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:8px}.school-heading h2{flex:1;min-width:0;margin:0!important}.student-home .profile-shortcut{display:flex;align-items:center;gap:9px;flex-shrink:0;width:auto;min-height:48px;margin:0;padding:0;background:transparent;color:#31583f;border:0;border-radius:28px;font-size:12px}.profile-shortcut img{display:block;width:48px;height:48px;border:1px solid #c9dacf;border-radius:50%;background:#eaf2ec;box-sizing:border-box}.profile-shortcut:hover img{border-color:#659477}.profile-shortcut:focus-visible{outline:3px solid #4f8962;outline-offset:4px}@media(max-width:500px){.school-heading{gap:12px}.profile-shortcut span{display:none}.profile-shortcut img{width:44px;height:44px}}
</style>
