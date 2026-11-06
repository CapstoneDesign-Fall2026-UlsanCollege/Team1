<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {weekdayDate,recommendedPrice} from '../canteen-menu-tools'
import CanteenDetails from './CanteenDetails.vue'
import { scheduleApi } from '../schedules'

const props = defineProps<{ manage?: boolean }>()
const emit=defineEmits<{busy:[value:boolean]}>()
type Item = { id?: string; name: string; price: number; status:'unknown'|'available'|'sold_out' }
const campusDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())
const date = ref(campusDate()), loadedDate = ref(''), version = ref(0)
const items = ref<Item[]>([]), published = ref(false), hasMenu = ref(false)
const currency=ref('NPR'),baseline=ref('')
const dirty=computed(()=>hasMenu.value || items.value.length ? JSON.stringify({items:items.value,published:published.value})!==baseline.value:false)
const available=computed(()=>items.value.filter(i=>i.status==='available').length)
const soldOut=computed(()=>items.value.filter(i=>i.status==='sold_out').length)
const updated = ref(''), loading = ref(false), saving = ref(false)
const error = ref(''), message = ref('')
let request = 0
const dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const weekday=computed(()=>new Date(date.value+'T00:00:00Z').getUTCDay())
const recommendations=ref<{name:string;price:number}[]>([]),recommendationError=ref('')
const newMenuDialog=ref<HTMLDialogElement|null>(null),newDate=ref(''),newMenuError=ref(''),startingMenu=ref(false)
const daysDialog=ref<HTMLDialogElement|null>(null),copyWeek=ref(''),copyDays=ref<number[]>([]),copyError=ref('')
const targetDates=computed(()=>{try{return copyDays.value.map(day=>weekdayDate(copyWeek.value,day)).sort()}catch{return []}})
function dateForDay(day:number){try{return weekdayDate(copyWeek.value,day)}catch{return ''}}
async function openApplyDays(){copyWeek.value=date.value;copyDays.value=[];copyError.value='';await nextTick();daysDialog.value?.showModal()}
async function applyDays(){if(saving.value||!targetDates.value.length)return;saving.value=true;emit('busy',true);copyError.value='';
 try{const result=await scheduleApi('canteen/menu/apply-days','POST',{dates:targetDates.value,currency:currency.value,items:items.value.map(i=>({name:i.name,price:i.price,status:'unknown'}))});message.value=result.message;daysDialog.value?.close();await loadRecommendations()}
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
async function chooseDay(event:Event){const select=event.target as HTMLSelectElement;try{date.value=weekdayDate(date.value,Number(select.value));await changeDate()}catch{error.value='Choose a valid service date first.'}select.value=String(weekday.value)}
async function openNewMenu(){newDate.value=date.value;newMenuError.value='';await nextTick();newMenuDialog.value?.showModal()}
async function startNewMenu(){
 if(!newDate.value||startingMenu.value)return
 startingMenu.value=true;newMenuError.value=''
 try{const result=await scheduleApi('canteen/menu?date='+encodeURIComponent(newDate.value));if(result.menu){newMenuError.value='A menu already exists on this date. Choose a different date, or close this form and select that date to edit it.';return}
 if(dirty.value&&!window.confirm('Discard unsaved changes and start a new menu?'))return
 date.value=newDate.value;await load();if(hasMenu.value){newMenuError.value='A menu was saved on this date while loading. Its saved items have been loaded; close this form to review them.';return}if(!error.value){items.value=[{name:'',price:0,status:'unknown'}];published.value=false;newMenuDialog.value?.close()}
 }catch(e){newMenuError.value=e instanceof Error?e.message:'Unable to check this date.'}finally{startingMenu.value=false}
}
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
    hasMenu.value = Boolean(data.menu); updated.value = data.menu?.updated_at ?? '';currency.value=data.menu?.currency??'NPR';baseline.value=JSON.stringify({items:items.value,published:published.value})
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
  <section class="daily-menu"><CanteenDetails v-if="!manage" />
    <div class="menu-heading"><div><p class="eyebrow">CAMPUS CANTEEN ONLY</p><h2>{{ manage ? 'Daily menu' : 'Campus Eat' }}</h2></div>
      <button type="button" class="secondary" :disabled="loading || saving" @click="load(true)">Refresh</button>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }} <button type="button" class="secondary" :disabled="loading || saving" @click="load(true)">Reload saved data</button></p>
    <p v-if="message" class="success" role="status">{{ message }}</p>
    <p v-if="loading" role="status">Loading menu…</p>
    <template v-if="manage">
      <div class="menu-filters"><label>Menu day<select aria-label="Menu day" :value="weekday" :disabled="saving||loading" @change="chooseDay"><option v-for="(day,i) in dayNames" :key="day" :value="i">{{day}}</option></select></label><label class="date-field">Service date<input v-model="date" type="date" min="2000-01-01" max="2200-12-31" :disabled="saving || loading" @change="changeDate"></label><button type="button" :disabled="saving||loading" @click="openNewMenu">+ New menu</button></div>
      <div v-if="manage&&loadedDate&&!loading" class="menu-stats"><div><strong>{{items.length}}</strong><span>Menu items</span></div><div><strong>{{available}}</strong><span>Available</span></div><div><strong>{{soldOut}}</strong><span>Sold out</span></div><div><strong>{{published?'Published':'Draft'}}</strong><span>{{dirty?'Unsaved changes':'Saved status'}}</span></div></div><form v-if="loadedDate && !loading" class="card" @submit.prevent="save">
        <fieldset :disabled="saving">
          <p v-if="recommendationError" class="muted" role="status">{{recommendationError}} <button type="button" class="secondary" @click="loadRecommendations">Retry suggestions</button></p><datalist id="canteen-saved-items"><option v-for="choice in recommendations" :key="choice.name" :value="choice.name">रू {{choice.price}}</option></datalist><p class="muted">Choose a saved item to fill its latest rupee price, or type a new item and set its price.</p><p class="muted">Prices are in {{currency==='NPR'?'Nepalese rupees (NPR)':'KRW (legacy menu; not converted)'}}. Save a draft or publish the menu for students to see on its service date.</p>
          <p v-if="!items.length" class="muted">No items for this date yet. Add your first menu item.</p>
          <article v-for="(item, index) in items" :key="item.id ?? index" class="menu-row">
            <label>Item name<input v-model="item.name" :list="currency==='NPR'?'canteen-saved-items':undefined" autocomplete="off" @input="suggestPrice(item)" required maxlength="150" :aria-label="'Item ' + (index + 1) + ' name'"></label>
            <label>Price ({{currency==='NPR'?'रू':'KRW'}})<input v-model.number="item.price" type="number" min="0" max="1000000" step="1" required :aria-label="'Item ' + (index + 1) + ' price'"></label>
            <label>Availability<select v-model="item.status" :aria-label="'Item '+(index+1)+' availability'"><option value="unknown">Not confirmed</option><option value="available">Available</option><option value="sold_out">Sold out</option></select></label>
            <button type="button" class="secondary" :aria-label="'Remove item ' + (index + 1)" @click="items.splice(index, 1)">Remove</button>
          </article>
          <button type="button" class="secondary" :disabled="items.length >= 40" @click="items.push({ name: '', price: 0, status:'unknown' })">Add item</button>
          <label class="publish"><input v-model="published" type="checkbox">Publish this date’s menu</label>
          <p class="muted">{{ published ? 'Students can see this menu on ' + loadedDate + ' after saving.' : 'Draft: hidden from students after saving.' }}</p>
          <button type="button" class="secondary" :disabled="!items.length||saving||currency!=='NPR'" @click="openApplyDays">Apply to multiple days</button><button :disabled="!items.length || saving">{{ saving ? 'Saving…' : 'Save menu' }}</button>
        </fieldset>
      </form>
    </template>
    <template v-else-if="!loading && !error">
      <h3>Today’s menu · {{ date }}</h3>
      <p v-if="!hasMenu" class="muted">No menu has been published for today. Please check again later.</p>
      <article v-for="item in items" :key="item.id" class="card menu-item"><h3>{{ item.name }}</h3><div class="food-details"><strong>{{currency==='NPR'?'रू':'KRW'}} {{Number(item.price).toLocaleString()}}</strong><span class="food-status" :class="item.status">{{item.status==='sold_out'?'Sold out':item.status==='available'?'Available':'Availability not confirmed'}}</span></div></article>
      <p class="muted">Food information only. Please visit the campus canteen to order.</p>
    </template>
    <dialog ref="daysDialog" class="new-menu-dialog"><form @submit.prevent="applyDays"><fieldset :disabled="saving"><h3>Apply menu to selected days</h3><p class="muted">Copy the items and prices currently in this form. Your source menu stays unchanged. Copies are unpublished drafts with availability not confirmed.</p><label>Week containing<input v-model="copyWeek" type="date" min="2000-01-01" max="2200-12-31" required @change="copyDays=[]"></label><div class="copy-days"><label v-for="(day,i) in dayNames" :key="day" class="copy-day"><input v-model="copyDays" type="checkbox" :value="i" :disabled="!dateForDay(i)||dateForDay(i)===loadedDate"><span>{{day}}<small>{{dateForDay(i)}}{{dateForDay(i)===loadedDate?' · source menu':''}}</small></span></label></div><p v-if="targetDates.length" class="muted">{{targetDates.length}} dates selected. Existing menus will not be overwritten. If a date already has a menu, no copies are saved.</p><p v-if="copyError" class="error" role="alert">{{copyError}}</p><div class="dialog-actions"><button type="button" class="secondary" @click="daysDialog?.close()">Cancel</button><button :disabled="!targetDates.length||saving">{{saving?'Saving drafts…':'Create selected drafts'}}</button></div></fieldset></form></dialog>
    <dialog ref="newMenuDialog" class="new-menu-dialog"><form @submit.prevent="startNewMenu"><h3>Create a new daily menu</h3><p class="muted">Start with an empty draft. Existing menus will stay saved.</p><label>New menu date<input v-model="newDate" type="date" min="2000-01-01" max="2200-12-31" required></label><p v-if="newMenuError" class="error" role="alert">{{newMenuError}}</p><div class="dialog-actions"><button type="button" class="secondary" :disabled="startingMenu" @click="newMenuDialog?.close()">Cancel</button><button :disabled="startingMenu">{{startingMenu?'Checking date…':'Start draft'}}</button></div></form></dialog>
    <p v-if="updated && !loading && !error" class="muted">Last updated {{ displayTime(updated) }} (Nepal time)</p>
  </section>
</template>

<style scoped>
.daily-menu{overflow-wrap:anywhere}.menu-heading,.menu-item{display:flex;align-items:center;justify-content:space-between;gap:16px}.menu-heading h2,.menu-item h3{margin:0}.menu-heading>button{width:auto;flex-shrink:0;white-space:nowrap}.date-field{display:block;max-width:220px;margin:20px 0}.daily-menu select{width:100%;padding:11px;border:1px solid #c4d4c9;border-radius:8px;font:inherit;background:white;color:#263e33;margin-top:6px}.daily-menu input{width:100%;box-sizing:border-box;margin-top:6px}.daily-menu fieldset{border:0;padding:0;min-width:0}.daily-menu .card{margin:16px 0}.menu-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(85px,.7fr) minmax(130px,1fr) auto;align-items:end;gap:12px;padding-bottom:18px;border-bottom:1px solid #dce5df;margin-bottom:18px}.menu-row label{margin:0}.publish{display:flex;align-items:center;gap:10px;margin-top:20px}.publish input{width:18px;height:18px;margin:0;flex-shrink:0}.daily-menu form button{width:auto;margin:8px 8px 0 0}.daily-menu .muted{font-size:14px;line-height:1.6}.menu-item strong{white-space:nowrap}.menu-item h3{overflow-wrap:anywhere;min-width:0}@media(max-width:600px){.menu-row{grid-template-columns:minmax(0,1fr) auto}.menu-row label:first-child{grid-column:1/-1}.menu-item{align-items:flex-start}.menu-heading{align-items:flex-start}}
.menu-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}.menu-stats>div{background:#edf4ef;border:1px solid #dbe7de;border-radius:12px;padding:14px}.menu-stats strong,.menu-stats span{display:block}.menu-stats strong{font-size:20px;color:#345b46}.menu-stats span{font-size:11px;color:#6f8275;margin-top:6px}.food-details{display:flex;align-items:end;flex-direction:column;gap:7px}.food-status{font-size:11px;padding:5px 8px;border-radius:12px;background:#edf1ef;color:#65766c}.food-status.available{background:#e3f1e7;color:#2e6643}.food-status.sold_out{background:#fbe8e4;color:#a34332}@media(max-width:600px){.menu-stats{grid-template-columns:1fr 1fr}.menu-stats strong{font-size:17px}.menu-row{grid-template-columns:1fr 1fr}.menu-row button{justify-self:start}}
.menu-filters{display:flex;align-items:end;gap:12px;flex-wrap:wrap;margin:16px 0}.menu-filters label{font-size:13px;font-weight:600;min-width:150px;flex:1}.menu-filters .date-field{margin:0;max-width:none}.menu-filters>button{width:auto;margin:0;white-space:nowrap}.new-menu-dialog{max-height:calc(100vh - 32px);overflow:auto;border:1px solid #d4e1d8;border-radius:16px;padding:24px;width:min(440px,calc(100vw - 32px));box-sizing:border-box;color:#2d4839}.new-menu-dialog::backdrop{background:#153c2a70}.new-menu-dialog h3{margin-top:0}.dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}.dialog-actions button{width:auto}@media(max-width:600px){.menu-filters label{min-width:120px}.menu-filters>button{width:100%}}
.copy-days{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.copy-day{margin:0;display:flex;gap:8px;align-items:center;padding:9px;border:1px solid #d8e4db;border-radius:8px;font-size:12px}.copy-day input{width:16px;height:16px;flex-shrink:0;margin:0}.copy-day small{display:block;color:#718477;font-size:10px;margin-top:4px}
</style>
