<script setup lang="ts">
import {computed,onMounted,ref} from 'vue'
import {scheduleApi} from '../schedules'
const props=defineProps<{reader:'student'|'parent'}>()
const items=ref<any[]>([]),loading=ref(false),error=ref(''),filter=ref('all')
const visible=computed(()=>items.value.filter(n=>filter.value==='all'||n.source===filter.value))
async function load(){loading.value=true;error.value='';try{items.value=(await scheduleApi(props.reader+'/notices')).notices}catch(e){items.value=[];error.value=e instanceof Error?e.message:'Unable to load notices.'}finally{loading.value=false}}
onMounted(load)
</script>
<template><section class="notice-board"><div class="board-heading"><h2>Notice board</h2><button type="button" class="secondary" :disabled="loading" @click="load">Refresh notices</button></div><p class="muted">School updates and teacher notices for {{reader==='parent'?'your linked children’s classes':'your current class'}}.</p><label>Show<select v-model="filter"><option value="all">All notices</option><option value="school">School notices</option><option value="class">Class notices</option></select></label><p v-if="loading" role="status">Loading notices…</p><p v-else-if="error" class="error" role="alert">{{error}}</p><template v-else><p class="muted">{{visible.length}} notice(s)</p><p v-if="!visible.length">No current published notices.</p><article v-for="n in visible" :key="n.source+'-'+n.id"><span class="badge">{{n.source==='school'?'School notice':'Grade '+n.grade_label+(n.class_name?' · Class '+n.class_name:'')}}</span><h3>{{n.title}}</h3><small>{{n.author}} · {{n.starts_on}} — {{n.ends_on}}</small><p class="notice-message">{{n.message}}</p></article></template></section></template>
<style scoped>
.notice-board{min-width:0}.board-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}h2{font-size:21px;margin:0}h3{font-size:17px;margin:10px 0}button{width:auto;margin:0;padding:10px 14px;min-height:44px;font-size:13px}label{display:block;font-size:13px;margin:16px 0}select{display:block;width:min(100%,280px);font:inherit;padding:10px;border:1px solid #c6d7cc;border-radius:8px;margin-top:6px;min-height:44px}article{padding:18px 0;border-top:1px solid #dce6df}small,.muted{font-size:13px;color:#62786b}.badge{font-size:12px;background:#edf4ef;padding:5px 8px;border-radius:6px}.notice-message{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6}
</style>
