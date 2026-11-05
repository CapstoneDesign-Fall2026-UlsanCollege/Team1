<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
    if (!error.value) message.value = result.message
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to save. Your changes are still in the form.' }
  finally { saving.value = false;emit('busy',false) }
}
onMounted(()=>load())
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
      <label class="date-field">Service date<input v-model="date" type="date" min="2000-01-01" max="2200-12-31" :disabled="saving || loading" @change="changeDate"></label>
      <div v-if="manage&&loadedDate&&!loading" class="menu-stats"><div><strong>{{items.length}}</strong><span>Menu items</span></div><div><strong>{{available}}</strong><span>Available</span></div><div><strong>{{soldOut}}</strong><span>Sold out</span></div><div><strong>{{published?'Published':'Draft'}}</strong><span>{{dirty?'Unsaved changes':'Saved status'}}</span></div></div><form v-if="loadedDate && !loading" class="card" @submit.prevent="save">
        <fieldset :disabled="saving">
          <p class="muted">Prices are in {{currency==='NPR'?'Nepalese rupees (NPR)':'Korean won (existing menu)'}}. Save a draft or publish the menu for students to see on its service date.</p>
          <p v-if="!items.length" class="muted">No items for this date yet. Add your first menu item.</p>
          <article v-for="(item, index) in items" :key="item.id ?? index" class="menu-row">
            <label>Item name<input v-model="item.name" required maxlength="150" :aria-label="'Item ' + (index + 1) + ' name'"></label>
            <label>Price ({{currency==='NPR'?'Rs.':'₩'}})<input v-model.number="item.price" type="number" min="0" max="1000000" step="1" required :aria-label="'Item ' + (index + 1) + ' price'"></label>
            <label>Availability<select v-model="item.status" :aria-label="'Item '+(index+1)+' availability'"><option value="unknown">Not confirmed</option><option value="available">Available</option><option value="sold_out">Sold out</option></select></label>
            <button type="button" class="secondary" :aria-label="'Remove item ' + (index + 1)" @click="items.splice(index, 1)">Remove</button>
          </article>
          <button type="button" class="secondary" :disabled="items.length >= 40" @click="items.push({ name: '', price: 0, status:'unknown' })">Add item</button>
          <label class="publish"><input v-model="published" type="checkbox">Publish this date’s menu</label>
          <p class="muted">{{ published ? 'Students can see this menu on ' + loadedDate + ' after saving.' : 'Draft: hidden from students after saving.' }}</p>
          <button :disabled="!items.length || saving">{{ saving ? 'Saving…' : 'Save menu' }}</button>
        </fieldset>
      </form>
    </template>
    <template v-else-if="!loading && !error">
      <h3>Today’s menu · {{ date }}</h3>
      <p v-if="!hasMenu" class="muted">No menu has been published for today. Please check again later.</p>
      <article v-for="item in items" :key="item.id" class="card menu-item"><h3>{{ item.name }}</h3><div class="food-details"><strong>{{currency==='NPR'?'Rs.':'₩'}} {{Number(item.price).toLocaleString()}}</strong><span class="food-status" :class="item.status">{{item.status==='sold_out'?'Sold out':item.status==='available'?'Available':'Availability not confirmed'}}</span></div></article>
      <p class="muted">Food information only. Please visit the campus canteen to order.</p>
    </template>
    <p v-if="updated && !loading && !error" class="muted">Last updated {{ displayTime(updated) }} (Nepal time)</p>
  </section>
</template>

<style scoped>
.daily-menu{overflow-wrap:anywhere}.menu-heading,.menu-item{display:flex;align-items:center;justify-content:space-between;gap:16px}.menu-heading h2,.menu-item h3{margin:0}.menu-heading>button{width:auto;flex-shrink:0;white-space:nowrap}.date-field{display:block;max-width:220px;margin:20px 0}.daily-menu select{width:100%;padding:11px;border:1px solid #c4d4c9;border-radius:8px;font:inherit;background:white;color:#263e33;margin-top:6px}.daily-menu input{width:100%;box-sizing:border-box;margin-top:6px}.daily-menu fieldset{border:0;padding:0;min-width:0}.daily-menu .card{margin:16px 0}.menu-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(85px,.7fr) minmax(130px,1fr) auto;align-items:end;gap:12px;padding-bottom:18px;border-bottom:1px solid #dce5df;margin-bottom:18px}.menu-row label{margin:0}.publish{display:flex;align-items:center;gap:10px;margin-top:20px}.publish input{width:18px;height:18px;margin:0;flex-shrink:0}.daily-menu form button{width:auto;margin:8px 8px 0 0}.daily-menu .muted{font-size:14px;line-height:1.6}.menu-item strong{white-space:nowrap}.menu-item h3{overflow-wrap:anywhere;min-width:0}@media(max-width:600px){.menu-row{grid-template-columns:minmax(0,1fr) auto}.menu-row label:first-child{grid-column:1/-1}.menu-item{align-items:flex-start}.menu-heading{align-items:flex-start}}
.menu-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}.menu-stats>div{background:#edf4ef;border:1px solid #dbe7de;border-radius:12px;padding:14px}.menu-stats strong,.menu-stats span{display:block}.menu-stats strong{font-size:20px;color:#345b46}.menu-stats span{font-size:11px;color:#6f8275;margin-top:6px}.food-details{display:flex;align-items:end;flex-direction:column;gap:7px}.food-status{font-size:11px;padding:5px 8px;border-radius:12px;background:#edf1ef;color:#65766c}.food-status.available{background:#e3f1e7;color:#2e6643}.food-status.sold_out{background:#fbe8e4;color:#a34332}@media(max-width:600px){.menu-stats{grid-template-columns:1fr 1fr}.menu-stats strong{font-size:17px}.menu-row{grid-template-columns:1fr 1fr}.menu-row button{justify-self:start}}
</style>
