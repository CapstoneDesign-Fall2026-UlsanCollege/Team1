<script setup lang="ts">
import StudentSchool from './StudentSchool.vue'
import DailyMenu from './DailyMenu.vue'
const emit=defineEmits<{open:[page:'course'|'schedule'|'eat'|'profile'];context:[school:{name:string;level:string}|null]}>()
</script>
<template><div class="student-home"><div class="welcome"><p>WELCOME BACK</p><h2>Your day, in one place.</h2><span>Class updates, lessons and your school canteen.</span></div><StudentSchool dashboard @open="emit('open',$event)" @context="emit('context',$event)"/><section class="home-canteen"><DailyMenu preview/><button class="canteen-link" @click="emit('open','eat')">Open canteen · full menu, hours & location →</button></section><button class="profile-link" @click="emit('open','profile')">View my profile →</button></div></template>
<style scoped>
.student-home{display:grid;gap:18px}.welcome{padding:4px 0 2px}.welcome p{font-size:10px;letter-spacing:1.6px;color:#66816f;margin:0 0 10px}.welcome h2{font-size:25px!important;margin:0 0 8px!important;color:#244635}.welcome span{font-size:12px;color:#748175}.home-canteen{border:1px solid #dce6df;background:white;padding:18px;border-radius:14px;min-width:0}.canteen-link,.profile-link{background:transparent;color:#38694d;font-size:12px;text-align:left;padding:10px 0;margin-top:8px;width:auto}.profile-link{margin:0}.home-canteen :deep(.menu-heading h2){font-size:19px}.home-canteen :deep(.menu-item){padding:13px;margin:10px 0}.home-canteen :deep(.menu-item h3){font-size:14px}
@media(min-width:1000px){.student-home{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:start}.welcome{grid-column:1/-1}.home-canteen{margin:0}.profile-link{grid-column:1/-1}}
</style>
