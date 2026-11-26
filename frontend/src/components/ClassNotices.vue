<script setup lang="ts">
import {computed,onMounted,reactive,ref,watch} from 'vue'
import {scheduleApi} from '../schedules'
import {dismissAfterFourSeconds} from '../temporary-message'
const props=defineProps<{classes?:any[];today?:string;manage?:boolean;composeOnly?:boolean;initialClassId?:number}>()
const emit=defineEmits<{busy:[value:boolean];saved:[]}>()
const targetClasses=ref<number[]>([])
const classId=ref(0),items=ref<any[]>([]),teacherId=ref(0),loading=ref(false),saving=ref(false),error=ref(''),message=ref(''),editing=ref(false)
let readVersion=0
dismissAfterFourSeconds(message)
const form=reactive({id:0,title:'',message:'',starts_on:'',ends_on:'',published:true,version:0})
const selected=computed(()=>props.classes?.find(c=>c.class_id===classId.value))
function reset(){Object.assign(form,{id:0,title:'',message:'',starts_on:props.today??'',ends_on:props.today??'',published:true,version:0});editing.value=false}
async function load(){const version=++readVersion;loading.value=true;error.value='';items.value=[];try{if(props.manage&&!classId.value)return;const result=await scheduleApi(props.manage?'teacher/classes/'+classId.value+'/notices':'student/class-notices');if(version===readVersion){items.value=result.notices;teacherId.value=result.teacher_id??0}}catch(e){if(version===readVersion)error.value=e instanceof Error?e.message:'Unable to load class notices.'}finally{if(version===readVersion)loading.value=false}}
function edit(item:any){Object.assign(form,item);editing.value=true}
function create(){reset();targetClasses.value=classId.value?[classId.value]:[];editing.value=true}
async function save(){if(saving.value)return;saving.value=true;emit('busy',true);error.value='';try{message.value=(await scheduleApi('teacher/classes/'+classId.value+'/notices'+(form.id?'/'+form.id:''),form.id?'PUT':'POST',{...form,...(!form.id?{class_ids:targetClasses.value}:{})})).message;reset();if(props.composeOnly)emit('saved');else await load()}catch(e){error.value=e instanceof Error?e.message:'Unable to save notice.'}finally{saving.value=false;emit('busy',false)}}
watch(classId,()=>{reset();if(props.composeOnly)create();else void load()})
onMounted(()=>{if(props.manage&&props.classes?.length){classId.value=props.initialClassId??props.classes[0].class_id;if(props.composeOnly)create()}else void load()})
</script>
<template><section class="class-notices" :class="{'notice-composer':composeOnly}"><div v-if="!composeOnly" class="notice-heading"><h2>Class notice board</h2><div class="notice-actions"><button v-if="manage" type="button" :disabled="!classId||saving||loading" @click="create">Create notice</button><button type="button" class="secondary" :disabled="saving||loading" @click="load">Refresh notices</button></div></div>
<label v-if="manage&&!composeOnly">Class<select v-model="classId" :disabled="saving"><option :value="0" disabled>Choose a class</option><option v-for="c in classes" :key="c.class_id" :value="c.class_id">Grade {{c.grade_label}} · Class {{c.class_name}}</option></select></label>
<p v-if="manage&&!composeOnly" class="muted">Post updates for {{selected?'Grade '+selected.grade_label+' · Class '+selected.class_name:'your assigned classes'}}. Students see published notices during their display dates. You can edit your own notices.</p>
<p v-if="error" class="error" role="alert">{{error}}</p><p v-if="message" class="success" role="status">{{message}}</p>
<form v-if="manage&&editing" class="notice-form" @submit.prevent="save"><fieldset :disabled="saving"><h3 v-if="!composeOnly">{{form.id?'Edit class notice':'New class notice'}}</h3><fieldset v-if="!form.id" class="target-classes"><legend>Who should receive this?</legend><div class="recipient-toolbar"><span class="recipient-count" role="status">{{targetClasses.length}} {{targetClasses.length===1?'class':'classes'}} selected</span><div class="recipient-tools"><button type="button" class="secondary" @click="targetClasses=(classes??[]).map(c=>c.class_id)">Select all</button><button type="button" class="secondary" :disabled="!targetClasses.length" @click="targetClasses=[]">Clear</button></div></div><div class="recipient-grid"><label v-for="c in classes" :key="c.class_id" class="recipient-card" :class="{chosen:targetClasses.includes(c.class_id)}"><input v-model="targetClasses" type="checkbox" :value="c.class_id"><span><strong>Grade {{c.grade_label}}</strong><small>{{c.class_name?'Class '+c.class_name:'All students in this class'}}</small></span></label></div><p class="recipient-hint">Choose one or more of your classes.</p></fieldset><label>Title<input v-model="form.title" required maxlength="150" placeholder="For example, bring your science notebook"></label><label>Message<textarea v-model="form.message" required maxlength="4000" rows="4" placeholder="Write a clear update for students and parents…"></textarea></label><div class="notice-dates"><label>Show from<input v-model="form.starts_on" type="date" required></label><label>Show until<input v-model="form.ends_on" type="date" :min="form.starts_on" required></label></div><label class="publish publication-option"><input v-model="form.published" type="checkbox"><span><strong>Publish notice</strong><small>Students and parents can read it during the selected dates.</small></span></label><div class="notice-actions notice-submit"><button :disabled="!form.id&&!targetClasses.length">{{saving?'Saving…':form.published?'Publish notice':'Save draft'}}</button><button v-if="!composeOnly" type="button" class="secondary" @click="reset">Cancel</button></div></fieldset></form>
<template v-if="!composeOnly"><p v-if="loading" role="status">Loading class notices…</p><p v-else-if="!error&&!items.length" class="muted">No {{manage?'saved':'current published'}} class notices.</p>
<article v-for="item in items" :key="item.id"><div class="notice-heading"><h3>{{item.title}}</h3><button v-if="manage&&item.teacher_id===teacherId" type="button" class="secondary" :disabled="saving" @click="edit(item)">Edit</button></div><small>{{item.teacher_name}} · {{item.starts_on}} — {{item.ends_on}}<template v-if="manage"> · {{item.published?'Published':'Draft'}}</template></small><p class="notice-message">{{item.message}}</p></article></template></section></template>
<style scoped>
.class-notices{min-width:0}.notice-heading,.notice-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.notice-actions{justify-content:flex-start}h2{font-size:20px;margin:0}h3{font-size:16px;margin:0}button{width:auto;margin:0;font-size:13px;padding:10px 14px;min-height:44px}label{display:block;margin:14px 0;font-size:13px}input:not([type=checkbox]),select,textarea{display:block;width:100%;min-width:0;box-sizing:border-box;margin-top:6px;padding:10px;border:1px solid #c4d4ca;border-radius:8px;font:inherit}fieldset{border:0;margin:0;padding:0;min-width:0}.notice-form{background:#f4f8f5;padding:16px;border:1px solid #dce6df;border-radius:10px;margin-top:16px}.notice-dates{display:grid;grid-template-columns:1fr 1fr;gap:12px}.publish{display:flex;align-items:center;gap:8px}.publish input{width:18px;height:18px;margin:0}article{padding:16px 0;border-bottom:1px solid #dce6df}small{display:block;color:#62776a;font-size:12px;margin-top:8px}.notice-message{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6}.muted{font-size:13px;line-height:1.6}@media(max-width:500px){.notice-dates{grid-template-columns:1fr;gap:0}}

.notice-composer .notice-form{background:transparent;border:0;padding:0;margin-top:14px}
.target-classes{padding-bottom:16px;border-bottom:1px solid #e0e9e3;margin-bottom:18px}
.target-classes legend{font-size:14px;font-weight:700;padding:0;margin-bottom:10px}
.recipient-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}
.recipient-count{font-size:12px;font-weight:600;color:#35644e;background:#edf5ef;padding:6px 10px;border-radius:20px}
.recipient-tools{display:flex;gap:4px}.recipient-tools button{font-size:12px;padding:6px 10px;min-height:36px;background:transparent}
.recipient-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.recipient-grid .recipient-card{display:flex;align-items:center;gap:10px;border:1px solid #d8e4dc;border-radius:10px;padding:12px;margin:0;background:white;cursor:pointer;min-height:64px}
.recipient-grid .recipient-card.chosen{background:#edf6ef;border-color:#56866a;box-shadow:inset 0 0 0 1px #56866a}
.recipient-card input[type=checkbox]{width:18px;height:18px;min-height:18px;margin:0;flex:0 0 18px;accent-color:#35644e}
.recipient-card strong{font-size:13px}.recipient-card small{margin-top:3px;font-size:12px}
.recipient-card:focus-within{outline:2px solid #21896f;outline-offset:2px}
.recipient-hint{font-size:12px;color:#62776a;margin:10px 0 0}
.publication-option{background:#f3f7f4;border-radius:10px;padding:12px}.publication-option strong{font-size:13px}.publication-option small{margin-top:4px;line-height:1.5}
.notice-submit{border-top:1px solid #e0e9e3;padding-top:14px;margin-top:16px;justify-content:flex-end}
.notice-submit button{min-width:140px}.notice-composer textarea{min-height:112px;resize:vertical}
@media(max-width:380px){.recipient-grid{grid-template-columns:1fr}.recipient-toolbar{flex-wrap:wrap}.notice-submit button{width:100%}}
</style>
