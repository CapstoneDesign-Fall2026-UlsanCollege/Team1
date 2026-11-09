<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {weekdayDate,recommendedPrice} from '../canteen-menu-tools'
import CanteenDetails from './CanteenDetails.vue'
import { scheduleApi } from '../schedules'

const props = defineProps<{ manage?: boolean; preview?: boolean }>()
const emit=defineEmits<{busy:[value:boolean]}>()
type Item = { id?: string; name: string; price: number; status:'unknown'|'available'|'sold_out' }
const campusDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())
const date = ref(campusDate()), loadedDate = ref(''), version = ref(0)
const items = ref<Item[]>([]), published = ref(false), hasMenu = ref(false)
const currency=ref('NPR'),baseline=ref(''),savedPublished=ref(false)
const dirty=computed(()=>hasMenu.value || items.value.length ? JSON.stringify({items:items.value,published:published.value})!==baseline.value:false)
const available=computed(()=>items.value.filter(i=>i.status==='available').length)
const soldOut=computed(()=>items.value.filter(i=>i.status==='sold_out').length)
const updated = ref(''), loading = ref(false), saving = ref(false)
const error = ref(''), message = ref('')
let request = 0
const dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const recommendations=ref<{name:string;price:number}[]>([]),recommendationError=ref('')
const newMenuDialog=ref<HTMLDialogElement|null>(null),newDate=ref(''),newMenuError=ref(''),startingMenu=ref(false)
const daysDialog=ref<HTMLDialogElement|null>(null),copyWeek=ref(''),copyDays=ref<number[]>([]),copyError=ref('')
const copyResult=ref<{created:string[];skipped:string[]}|null>(null)
const targetDates=computed(()=>{try{return copyDays.value.map(day=>weekdayDate(copyWeek.value,day)).sort()}catch{return []}})
function dateForDay(day:number){try{return weekdayDate(copyWeek.value,day)}catch{return ''}}
async function openApplyDays(){copyWeek.value=date.value;copyDays.value=[];copyError.value='';await nextTick();daysDialog.value?.showModal()}
async function applyDays(){if(saving.value||!targetDates.value.length)return;saving.value=true;emit('busy',true);copyError.value='';
 try{const result=await scheduleApi('canteen/menu/apply-days','POST',{dates:targetDates.value,currency:currency.value,items:items.value.map(i=>({name:i.name,price:i.price,status:'unknown'}))});copyResult.value={created:result.created,skipped:result.skipped};message.value=result.message;daysDialog.value?.close();await loadRecommendations()}
 catch(e){copyError.value=e instanceof Error?e.message:'Unable to copy menus. Review dates and retry.'}
 finally{saving.value=false;emit('busy',false)}
}
watch([copyWeek,copyDays],()=>{copyError.value=''},{deep:true})
const autoPrices=new WeakMap<Item,number>()
async function loadRecommendations(){if(!props.manage)return;recommendationError.value='';try{recommendations.value=(await scheduleApi('canteen/menu/items')).items}catch{recommendationError.value='Saved-item suggestions could not load. You can still type a new item.'}}
function suggestPrice(item:Item){
 const price=currency.value==='NPR'?recommendedPrice(item.name,recommendations.value):undefined
 if(price!==undefined){item.price=price;autoPrices.set(item,price)}
 else if(autoPrices.has(item)){if(item.price===autoPrices.get(item))item.price=0;autoPrices.delete(item)}
}
async function openNewMenu(){newDate.value=date.value;newMenuError.value='';await nextTick();newMenuDialog.value?.showModal()}
async function startNewMenu(){
 if(!newDate.value||startingMenu.value)return
 startingMenu.value=true;newMenuError.value=''
 try{const result=await scheduleApi('canteen/menu?date='+encodeURIComponent(newDate.value));if(result.menu){newMenuError.value='A menu already exists on this date. Choose a different date, or close this form and select that date to edit it.';return}
 if(dirty.value&&!window.confirm('Discard unsaved changes and start a new menu?'))return
 date.value=newDate.value;await load();if(hasMenu.value){newMenuError.value='A menu was saved on this date while loading. Its saved items have been loaded; close this form to review them.';return}if(!error.value){items.value=[{name:'',price:0,status:'unknown'}];published.value=false;newMenuDialog.value?.close()}
 }catch(e){newMenuError.value=e instanceof Error?e.message:'Unable to check this date.'}finally{startingMenu.value=false}
}
const itemFields=ref<HTMLInputElement[]>([])
function setItemField(el:unknown,index:number){if(el instanceof HTMLInputElement)itemFields.value[index]=el}
async function addFood(choice?:{name:string;price:number}){if(items.value.length>=40)return;items.value.push({name:choice?.name??'',price:choice?.price??0,status:'unknown'});await nextTick();itemFields.value[items.value.length-1]?.focus()}
const quickChoices=computed(()=>currency.value==='NPR'?recommendations.value.filter(c=>!items.value.some(i=>i.name.trim().toLowerCase()===c.name.trim().toLowerCase())).slice(0,6):[])
const weekDays=computed(()=>{try{return dayNames.map((name,i)=>({name,date:weekdayDate(date.value,i)}))}catch{return []}})
async function goToDate(value:string){date.value=value;await changeDate()}
async function moveWeek(offset:number){const current=new Date(date.value+'T00:00:00Z');if(!Number.isFinite(current.getTime()))return;current.setUTCDate(current.getUTCDate()+offset);await goToDate(current.toISOString().slice(0,10))}
const displayTime = (value: string) => new Date(value).toLocaleString(undefined, { timeZone: 'Asia/Kathmandu' })
let timer:ReturnType<typeof setTimeout>|undefined
watch(message,value=>{clearTimeout(timer);if(value)timer=setTimeout(()=>message.value='',4000)})
onBeforeUnmount(()=>{clearTimeout(timer);request++})
async function load(confirmDiscard=false) {
  if(confirmDiscard && dirty.value && !window.confirm('Discard unsaved menu changes and reload?'))return
  const current = ++request
  const requestedDate = date.value
  loading.value = true; error.value = ''; message.value = ''; loadedDate.value = ''
  // Do not leave the previous date's food visible during a failed load.
  items.value = []; updated.value = ''; hasMenu.value = false
  try {
    const data = await scheduleApi(props.manage ? 'canteen/menu?date=' + requestedDate : 'student/canteen')
    if (current !== request) return
    date.value = props.manage ? data.date : data.today
    loadedDate.value = date.value; version.value = data.menu?.version ?? 0
    items.value = data.menu?.items ?? []; published.value = data.menu?.published ?? false
    savedPublished.value=data.menu?.published??false;hasMenu.value = Boolean(data.menu); updated.value = data.menu?.updated_at ?? '';currency.value=data.menu?.currency??'NPR';baseline.value=JSON.stringify({items:items.value,published:published.value})
  } catch (e) {
    if (current === request) error.value = e instanceof Error ? e.message : 'Unable to load the menu.'
  } finally { if (current === request) loading.value = false }
}
async function changeDate(){if(dirty.value&&!window.confirm('Discard unsaved menu changes and change date?')){date.value=loadedDate.value;return}await load()}
async function save() {
  if (saving.value || loading.value || !loadedDate.value || loadedDate.value !== date.value) return
  saving.value = true; emit('busy',true); error.value = ''; message.value = ''
  try {
    const result = await scheduleApi('canteen/menu/' + loadedDate.value, 'PUT', {
      version: version.value, published: published.value, currency:currency.value,
      items: items.value.map(({ id, name, price, status }) => ({ ...(id ? { id } : {}), name, price, status })),
    })
    await load()
    if (!error.value) {message.value = result.message;await loadRecommendations()}
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to save. Your changes are still in the form.' }
  finally { saving.value = false;emit('busy',false) }
}
onMounted(()=>{void load();void loadRecommendations()})
</script>

<template>
  <section class="daily-menu" :class="{'manage-menu':manage}">
    <div v-if="!manage" class="menu-heading"><div><h2>{{preview?'School Canteen':'Today’s menu'}}</h2></div>
      <button type="button" class="secondary" :disabled="loading || saving" @click="load(true)">Refresh</button>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }} <button type="button" class="secondary" :disabled="loading || saving" @click="load(true)">Reload saved data</button></p>
    <p v-if="message" class="success" role="status">{{ message }}</p>
    <div v-if="manage&&copyResult" class="copy-result" role="status"><strong>{{copyResult.created.length}} drafts created · {{copyResult.skipped.length}} dates skipped</strong><p v-if="copyResult.created.length">Created: {{copyResult.created.join(', ')}}</p><p v-if="copyResult.skipped.length">Existing menus kept: {{copyResult.skipped.join(', ')}}</p><button type="button" class="secondary" @click="copyResult=null">Dismiss summary</button></div>
    <p v-if="loading" role="status">Loading menu…</p>
    <template v-if="manage">
      <div class="date-toolbar"><div class="date-navigation"><button type="button" class="secondary week-arrow" aria-label="Previous week" :disabled="saving||loading" @click="moveWeek(-7)">‹</button><button type="button" class="secondary" :disabled="saving||loading||date===campusDate()" @click="goToDate(campusDate())">Today</button><button type="button" class="secondary week-arrow" aria-label="Next week" :disabled="saving||loading" @click="moveWeek(7)">›</button><button type="button" class="secondary" aria-label="Refresh menu" title="Reload saved menu" :disabled="saving||loading" @click="load(true)">↻</button></div><label class="date-picker">Menu date<input v-model="date" type="date" min="2000-01-01" max="2200-12-31" :disabled="saving||loading" @change="changeDate"></label></div>
      <nav class="week-strip" aria-label="Choose menu day"><button v-for="day in weekDays" :key="day.date" type="button" :title="day.date" :aria-label="day.name+' '+day.date" :aria-pressed="date===day.date" :class="{selected:date===day.date}" :disabled="saving||loading" @click="goToDate(day.date)"><span>{{day.name.slice(0,3)}}</span><strong>{{Number(day.date.slice(-2))}}</strong></button></nav>
      <div v-if="loadedDate&&!loading" class="menu-summary"><span class="publication-badge" :class="{live:savedPublished}">{{savedPublished?'Published':'Draft'}}</span><span>{{items.length}} items · {{available}} available · {{soldOut}} sold out</span><span v-if="dirty" class="pending">Unsaved changes</span><button type="button" class="new-menu-link" :disabled="saving||loading" @click="openNewMenu">+ New menu</button></div>
      <form v-if="loadedDate && !loading" class="card menu-editor" @submit.prevent="save">
        <fieldset :disabled="saving">
          <p v-if="recommendationError" class="muted" role="status">{{recommendationError}} <button type="button" class="secondary" @click="loadRecommendations">Retry suggestions</button></p><datalist id="canteen-saved-items"><option v-for="choice in recommendations" :key="choice.name" :value="choice.name">रू {{choice.price}}</option></datalist><div class="food-list-heading"><div><h3>Menu items <small>{{currency==='NPR'?'रू NPR':'KRW'}}</small></h3><p class="muted">Type a food name for saved-price suggestions.</p></div><button type="button" class="secondary" :disabled="items.length>=40" @click="addFood()">+ Add food</button></div><div v-if="quickChoices.length" class="quick-foods"><span>Quick add</span><button v-for="choice in quickChoices" :key="choice.name" type="button" :disabled="items.length>=40" @click="addFood(choice)">+ {{choice.name}} <small>रू {{choice.price}}</small></button></div>
          <p v-if="!items.length" class="muted">No items for this date yet. Add your first menu item.</p>
          <article v-for="(item, index) in items" :key="item.id ?? index" class="menu-row">
            <label>Item name<input :ref="el=>setItemField(el,index)" v-model="item.name" :list="currency==='NPR'?'canteen-saved-items':undefined" autocomplete="off" @input="suggestPrice(item)" required maxlength="150" :aria-label="'Item ' + (index + 1) + ' name'"></label>
            <label>Price ({{currency==='NPR'?'रू':'KRW'}})<input v-model.number="item.price" type="number" min="0" max="1000000" step="1" required :aria-label="'Item ' + (index + 1) + ' price'"></label>
            <label>Availability<select v-model="item.status" :aria-label="'Item '+(index+1)+' availability'"><option value="unknown">Not confirmed</option><option value="available">Available</option><option value="sold_out">Sold out</option></select></label>
            <button type="button" class="secondary" :aria-label="'Remove item ' + (index + 1)" @click="items.splice(index, 1)">×</button>
          </article>
          <button v-if="items.length" type="button" class="text-add" :disabled="items.length>=40" @click="addFood()">+ Add another food</button>
          <div class="editor-actions"><div class="save-status"><strong>{{dirty?'Ready to save changes':savedPublished?'Menu is visible to students':'Draft · hidden from students'}}</strong><small>{{loadedDate}} · Nepal time</small></div><div class="save-buttons"><button type="button" class="secondary copy-action" :disabled="!items.length||saving||currency!=='NPR'" @click="openApplyDays">Copy to days</button><button type="submit" class="secondary" :disabled="!items.length||saving" @click="published=false">{{savedPublished?'Unpublish & save draft':'Save draft'}}</button><button type="submit" :disabled="!items.length||saving" @click="published=true">{{saving?'Saving…':savedPublished?'Save changes':'Publish menu'}}</button></div></div>
        </fieldset>
      </form>
    </template>
    <template v-else-if="!loading && !error">
      <p class="student-menu-date">{{date}} · Nepal time</p>
      <p v-if="!hasMenu" class="muted">The canteen head has not published a menu for this date yet. Check again after it is published.</p>
      <article v-for="item in (preview?items.slice(0,3):items)" :key="item.id" class="card menu-item"><h3>{{ item.name }}</h3><div class="food-details"><strong>{{currency==='NPR'?'रू':'KRW'}} {{Number(item.price).toLocaleString()}}</strong><span class="food-status" :class="item.status">{{item.status==='sold_out'?'Sold out':item.status==='available'?'Available':'Availability not confirmed'}}</span></div></article>
      <p v-if="!preview" class="muted">Please order at the school canteen counter.</p>
    </template>
    <dialog ref="daysDialog" class="new-menu-dialog"><form @submit.prevent="applyDays"><fieldset :disabled="saving"><h3>Apply menu to selected days</h3><p class="muted">Copy the items and prices currently in this form. Your source menu stays unchanged. Copies are unpublished drafts with availability not confirmed.</p><label>Week containing<input v-model="copyWeek" type="date" min="2000-01-01" max="2200-12-31" required @change="copyDays=[]"></label><div class="copy-days"><label v-for="(day,i) in dayNames" :key="day" class="copy-day"><input v-model="copyDays" type="checkbox" :value="i" :disabled="!dateForDay(i)||dateForDay(i)===loadedDate"><span>{{day}}<small>{{dateForDay(i)}}{{dateForDay(i)===loadedDate?' · source menu':''}}</small></span></label></div><p v-if="targetDates.length" class="muted">{{targetDates.length}} dates selected. Dates with existing menus will be skipped. Drafts will be created for the remaining dates.</p><p v-if="copyError" class="error" role="alert">{{copyError}}</p><div class="dialog-actions"><button type="button" class="secondary" @click="daysDialog?.close()">Cancel</button><button :disabled="!targetDates.length||saving">{{saving?'Saving drafts…':'Create selected drafts'}}</button></div></fieldset></form></dialog>
    <dialog ref="newMenuDialog" class="new-menu-dialog"><form @submit.prevent="startNewMenu"><h3>Create a new daily menu</h3><p class="muted">Start with an empty draft. Existing menus will stay saved.</p><label>New menu date<input v-model="newDate" type="date" min="2000-01-01" max="2200-12-31" required></label><p v-if="newMenuError" class="error" role="alert">{{newMenuError}}</p><div class="dialog-actions"><button type="button" class="secondary" :disabled="startingMenu" @click="newMenuDialog?.close()">Cancel</button><button :disabled="startingMenu">{{startingMenu?'Checking date…':'Start draft'}}</button></div></form></dialog>
    <details v-if="!manage&&!preview" class="student-service-details"><summary>Hours & location</summary><CanteenDetails compact /></details>
    <p v-if="updated && !loading && !error" class="muted">Last updated {{ displayTime(updated) }} (Nepal time)</p>
  </section>
</template>

<style scoped>
.daily-menu{overflow-wrap:anywhere}.menu-heading,.menu-item{display:flex;align-items:center;justify-content:space-between;gap:16px}.menu-heading h2,.menu-item h3{margin:0}.menu-heading>button{width:auto;flex-shrink:0;white-space:nowrap}.date-field{display:block;max-width:220px;margin:20px 0}.daily-menu select{width:100%;padding:11px;border:1px solid #c4d4c9;border-radius:8px;font:inherit;background:white;color:#263e33;margin-top:6px}.daily-menu input{width:100%;box-sizing:border-box;margin-top:6px}.daily-menu fieldset{border:0;padding:0;min-width:0}.daily-menu .card{margin:16px 0}.menu-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(85px,.7fr) minmax(130px,1fr) auto;align-items:end;gap:12px;padding-bottom:18px;border-bottom:1px solid #dce5df;margin-bottom:18px}.menu-row label{margin:0}.publish{display:flex;align-items:center;gap:10px;margin-top:20px}.publish input{width:18px;height:18px;margin:0;flex-shrink:0}.daily-menu form button{width:auto;margin:8px 8px 0 0}.daily-menu .muted{font-size:14px;line-height:1.6}.menu-item strong{white-space:nowrap}.menu-item h3{overflow-wrap:anywhere;min-width:0}@media(max-width:600px){.menu-row{grid-template-columns:minmax(0,1fr) auto}.menu-row label:first-child{grid-column:1/-1}.menu-item{align-items:flex-start}.menu-heading{align-items:flex-start}}
.menu-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}.menu-stats>div{background:#edf4ef;border:1px solid #dbe7de;border-radius:12px;padding:14px}.menu-stats strong,.menu-stats span{display:block}.menu-stats strong{font-size:20px;color:#345b46}.menu-stats span{font-size:11px;color:#6f8275;margin-top:6px}.food-details{display:flex;align-items:end;flex-direction:column;gap:7px}.food-status{font-size:11px;padding:5px 8px;border-radius:12px;background:#edf1ef;color:#65766c}.food-status.available{background:#e3f1e7;color:#2e6643}.food-status.sold_out{background:#fbe8e4;color:#a34332}@media(max-width:600px){.menu-stats{grid-template-columns:1fr 1fr}.menu-stats strong{font-size:17px}.menu-row{grid-template-columns:1fr 1fr}.menu-row button{justify-self:start}}
.menu-filters{display:flex;align-items:end;gap:12px;flex-wrap:wrap;margin:16px 0}.menu-filters label{font-size:13px;font-weight:600;min-width:150px;flex:1}.menu-filters .date-field{margin:0;max-width:none}.menu-filters>button{width:auto;margin:0;white-space:nowrap}.new-menu-dialog{max-height:calc(100vh - 32px);overflow:auto;border:1px solid #d4e1d8;border-radius:16px;padding:24px;width:min(440px,calc(100vw - 32px));box-sizing:border-box;color:#2d4839}.new-menu-dialog::backdrop{background:#153c2a70}.new-menu-dialog h3{margin-top:0}.dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}.dialog-actions button{width:auto}@media(max-width:600px){.menu-filters label{min-width:120px}.menu-filters>button{width:100%}}
.copy-days{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.copy-day{margin:0;display:flex;gap:8px;align-items:center;padding:9px;border:1px solid #d8e4db;border-radius:8px;font-size:12px}.copy-day input{width:16px;height:16px;flex-shrink:0;margin:0}.copy-day small{display:block;color:#718477;font-size:10px;margin-top:4px}
.copy-result{background:#edf5ef;border:1px solid #ccdfd1;border-radius:10px;padding:14px 16px;margin:12px 0;font-size:13px}.copy-result p{font-size:12px;line-height:1.6;margin:6px 0}.copy-result button{width:auto;font-size:12px;padding:6px 10px;margin-top:6px}

.manage-menu .menu-heading h2{font-size:20px}.manage-menu .menu-heading>button{padding:8px 12px;font-size:12px}.date-toolbar{display:flex;align-items:center;gap:10px;margin:14px 0 10px}.date-navigation{display:flex;gap:4px}.date-toolbar button{width:auto;margin:0;padding:9px 13px;font-size:12px;white-space:nowrap}.date-toolbar .week-arrow{font-size:22px;line-height:18px;padding:9px 11px}.date-picker{display:flex;align-items:center;gap:8px;margin:0 0 0 auto;font-size:12px;color:#617568}.date-picker input{width:150px;margin:0;padding:8px;font-size:12px}.week-strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.week-strip button{margin:0;width:auto;background:white;color:#5d7465;border:1px solid #d7e3da;padding:8px 4px;border-radius:9px}.week-strip button span,.week-strip button strong{display:block}.week-strip button span{font-size:11px;font-weight:400}.week-strip button strong{font-size:17px;margin-top:3px}.week-strip button.selected{background:#38624f;color:white;border-color:#38624f}.menu-summary{display:flex;align-items:center;gap:12px;margin:12px 0;font-size:12px;color:#6b7d71;flex-wrap:wrap}.publication-badge{font-size:10px;background:#eef1ef;color:#6b7d71;padding:4px 9px;border-radius:12px}.publication-badge.live{background:#dfeee3;color:#376b48}.pending{color:#95671e;font-size:11px}.manage-menu .menu-editor{padding:16px 18px;margin:0;border-radius:12px;overflow:visible}.food-list-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px}.food-list-heading h3{font-size:15px;margin:0}.food-list-heading h3 small{font-weight:400;font-size:10px;margin-left:5px;color:#6a7c70}.food-list-heading .muted{font-size:11px;margin:4px 0 0}.food-list-heading>button{margin:0!important;padding:8px 12px;font-size:12px;white-space:nowrap}.quick-foods{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:8px 0 12px}.quick-foods>span{font-size:10px;color:#7a8b80}.quick-foods button{margin:0!important;font-size:11px;padding:6px 9px;border-radius:20px;background:#edf4ef;color:#40614c;border:1px solid #d9e5dc}.quick-foods small{font-size:10px;color:#789080}.manage-menu .menu-row{grid-template-columns:minmax(0,2fr) minmax(76px,.65fr) minmax(135px,1fr) 32px;padding:10px 0;margin:0;gap:10px;align-items:center}.manage-menu .menu-row label{margin:0;font-size:10px;font-weight:500;color:#6b7e70}.manage-menu .menu-row input,.manage-menu .menu-row select{margin-top:4px;padding:8px 9px;font-size:13px;line-height:1.3}.manage-menu .menu-row>button{padding:5px;margin:14px 0 0!important;background:transparent;color:#8b6962;font-size:21px;line-height:22px}.manage-menu .text-add{padding:7px 0;margin:8px 0!important;font-size:12px;background:transparent;color:#416d53}.editor-actions{position:sticky;bottom:12px;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:14px;background:#f2f7f3;border:1px solid #d6e4d9;border-radius:10px;padding:11px 13px;margin-top:12px;box-shadow:0 3px 12px #254b3410}.save-status strong,.save-status small{display:block}.save-status strong{font-size:11px;font-weight:500;color:#42614e}.save-status small{font-size:10px;color:#7b8e80;margin-top:4px}.save-buttons{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.editor-actions .save-buttons button{margin:0;font-size:12px;padding:9px 12px;white-space:nowrap}.manage-menu>p.muted{font-size:10px;margin-top:10px}@media(max-width:650px){.date-toolbar{flex-wrap:wrap;gap:8px}.date-picker{font-size:0;margin-left:auto}.date-picker input{font-size:12px;width:140px}.date-toolbar>button{margin-left:auto}.week-strip{gap:4px}.week-strip button{padding:7px 2px}.week-strip button strong{font-size:15px}.week-strip button span{font-size:10px}.manage-menu .menu-editor{padding:12px}.manage-menu .menu-row{grid-template-columns:minmax(0,1fr) minmax(90px,.7fr) 26px;gap:6px 8px}.manage-menu .menu-row label:first-child{grid-column:1/3}.manage-menu .menu-row label:nth-child(2){grid-column:1;grid-row:2}.manage-menu .menu-row label:nth-child(3){grid-column:2;grid-row:2}.manage-menu .menu-row>button{grid-column:3;grid-row:1/3;align-self:center;margin:0!important}.manage-menu .menu-row{position:relative}.manage-menu .menu-row label:nth-child(2),.manage-menu .menu-row label:nth-child(3){grid-row:auto}.editor-actions{bottom:8px;flex-wrap:wrap;padding:10px}.save-buttons{width:100%;display:grid;grid-template-columns:1fr 1fr}.save-buttons button:last-child{grid-column:2}.save-buttons .copy-action{grid-column:1/-1}.save-status{width:100%}.quick-foods button{max-width:100%;overflow:hidden;text-overflow:ellipsis}.food-list-heading .muted{max-width:180px}}

.manage-menu .date-toolbar{margin-top:0}.new-menu-link{width:auto;margin:0 0 0 auto;padding:4px 0;background:transparent;color:#426a52;font-size:12px}.manage-menu .menu-summary{gap:8px}.manage-menu .menu-row{padding:8px 0}@media(max-width:650px){.date-toolbar{flex-wrap:nowrap;gap:6px}.date-navigation{gap:3px}.date-toolbar button{padding:8px 10px}.date-toolbar .week-arrow{padding:8px 9px}.date-picker input{width:135px}.save-buttons{display:flex;flex-wrap:nowrap;gap:5px}.editor-actions .save-buttons button{flex:1;font-size:11px;padding:8px 6px}.save-status small{display:none}.save-status strong{font-size:10px}.editor-actions{gap:6px;padding:8px}.manage-menu .menu-row input,.manage-menu .menu-row select{font-size:12px;padding:7px 8px}.manage-menu .menu-summary{font-size:11px}.new-menu-link{font-size:11px}.food-list-heading{margin-bottom:6px}}
.student-menu-date{font-size:12px;color:#738174;margin:8px 0 16px}.student-service-details{margin:20px 0;border-top:1px solid #dce6df;padding-top:16px}.student-service-details>summary{cursor:pointer;font-size:14px;font-weight:600;color:#38634a;padding:6px 0}.daily-menu:not(.manage-menu) .menu-heading h2{font-size:21px;margin:0}
</style>
