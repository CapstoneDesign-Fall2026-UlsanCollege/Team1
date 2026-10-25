<script setup lang="ts">
import StudentIcon from './StudentIcon.vue'
defineProps<{loginId:string;busy:boolean;error:string}>()
defineEmits<{logout:[]}>()
</script>
<template>
 <header><a class="brand" href="/">S<span>StudentHub</span></a><span class="tag">Campus Eat</span></header>
 <main class="canteen-workspace">
  <section class="dashboard">
   <div class="dashboard-heading"><div><p class="eyebrow">CANTEEN HEAD WORKSPACE</p><h1>Welcome, {{loginId}}.</h1></div><button type="button" class="secondary logout" :disabled="busy" @click="$emit('logout')"><StudentIcon name="logout"/>Log out</button></div>
   <p v-if="error" class="error" role="alert">{{error}}</p>
   <p class="description">Your dedicated workspace for the campus canteen.</p>
   <section class="card canteen-intro"><p class="eyebrow">CAMPUS EAT</p><h2>Canteen management is coming next</h2><p>You are signed in as the canteen head. Menu publishing, prices, opening hours and sold-out controls will be added in the next slices.</p><p class="muted">For account access or a password problem, contact your administrator.</p></section>
  </section>
 </main>
 <footer>StudentHub · Campus canteen</footer>
</template>
<style scoped>
.canteen-intro{max-width:none;margin-top:28px}.canteen-intro p{line-height:1.7}.logout{display:flex;align-items:center;gap:8px}.logout svg{width:20px;height:20px;flex-shrink:0}.canteen-workspace{overflow-wrap:anywhere}
</style>
