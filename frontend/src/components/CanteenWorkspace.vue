<script setup lang="ts">
import WorkspaceNav from './WorkspaceNav.vue'
import {computed,onMounted,onUnmounted,ref} from 'vue'
import StudentIcon from './StudentIcon.vue'
import DailyMenu from './DailyMenu.vue'
import CanteenDetails from './CanteenDetails.vue'
defineProps<{loginId:string;busy:boolean;error:string}>()
const emit=defineEmits<{logout:[]}>()
const section=ref('menu'),saving=ref(false),menuDirty=ref(false),detailsDirty=ref(false)
const dirty=computed(()=>menuDirty.value||detailsDirty.value)
function logout(){if(dirty.value&&!window.confirm('Leave with unsaved canteen changes?'))return;emit('logout')}
function beforeLeave(event:BeforeUnloadEvent){if(dirty.value){event.preventDefault();event.returnValue=''}}
onMounted(()=>window.addEventListener('beforeunload',beforeLeave))
onUnmounted(()=>window.removeEventListener('beforeunload',beforeLeave))
</script>
<template>
<header><a class="brand" href="/">S<span>StudentHub</span></a><span class="tag">School canteen</span></header>
<main class="canteen-workspace" data-workspace="canteen"><section class="canteen-shell"><div class="workspace-top"><div><p class="workspace-context">Canteen workspace</p><h1>Canteen dashboard</h1><p class="intro">Manage meals for the school week.</p></div><div class="account"><span>{{loginId}}</span><button type="button" class="secondary logout" :disabled="busy||saving" @click="logout"><StudentIcon name="logout"/>Log out</button></div></div>
<p v-if="error" class="error" role="alert">{{error}}</p><p v-if="dirty" class="workspace-inline-warning" role="status">Unsaved changes in {{menuDirty?'Daily menu':'Hours & location'}}{{menuDirty&&detailsDirty?' and Hours & location':''}}. Save before leaving.</p><div class="workspace-layout"><WorkspaceNav :items="[{id:'menu',label:'Daily menu'},{id:'details',label:'Hours & location'}]" :current="section" label="Canteen navigation" :disabled="saving" @select="section=$event" /><div class="workspace-content"><DailyMenu v-show="section==='menu'" manage @dirty="menuDirty=$event" @busy="saving=$event"/><CanteenDetails v-show="section==='details'" manage @dirty="detailsDirty=$event" @busy="saving=$event"/></div></div></section></main><footer>StudentHub · School canteen · Nepal time</footer>
</template>
<style scoped>
/* Hallmark · shape: app screen · genre: modern-minimal · theme: brand · redesign: full · nav: shared role navigation · states: loading empty error full · v2.0.0 */
/* Hallmark · pre-emit critique: one shell recipe; nested content retains its own table and calendar geometry. */

.canteen-workspace{max-width:var(--ui-container);margin:auto;padding:24px;overflow-wrap:anywhere;color:var(--ui-ink)}.workspace-top{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.workspace-top h1{font-size:28px;line-height:1.3;letter-spacing:0;margin:8px 0}.intro{font-size:13px;color:var(--ui-muted);line-height:1.6;margin:4px 0 0}.account{display:flex;align-items:center;gap:12px;font-size:12px}.logout{display:flex;align-items:center;gap:8px;white-space:nowrap;width:auto;min-height:44px;margin:0;padding:8px 12px}.logout svg{width:18px;height:18px}.workspace-layout{display:block}.workspace-content{min-width:0}footer{text-align:center;font-size:12px;color:var(--ui-muted);padding:24px}@media(max-width:600px){.canteen-workspace{padding:20px 16px}.workspace-top{align-items:start;gap:12px;flex-wrap:wrap}.workspace-top h1{font-size:24px}.account{margin-left:auto}.account>span{font-size:12px}}
</style>
