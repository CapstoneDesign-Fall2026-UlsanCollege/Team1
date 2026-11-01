<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { scheduleApi } from '../schedules'

const props = defineProps<{ manage?: boolean }>()
type Item = { id?: string; name: string; price: number }
const campusDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())
const date = ref(campusDate()), loadedDate = ref(''), version = ref(0)
const items = ref<Item[]>([]), published = ref(false), hasMenu = ref(false)
const updated = ref(''), loading = ref(false), saving = ref(false)
const error = ref(''), message = ref('')
let request = 0
const displayTime = (value: string) => new Date(value).toLocaleString(undefined, { timeZone: 'Asia/Seoul' })
async function load() {
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
    hasMenu.value = Boolean(data.menu); updated.value = data.menu?.updated_at ?? ''
  } catch (e) {
    if (current === request) error.value = e instanceof Error ? e.message : 'Unable to load the menu.'
  } finally { if (current === request) loading.value = false }
}
async function save() {
  if (saving.value || loading.value || !loadedDate.value || loadedDate.value !== date.value) return
  saving.value = true; error.value = ''; message.value = ''
  try {
    const result = await scheduleApi('canteen/menu/' + loadedDate.value, 'PUT', {
      version: version.value, published: published.value,
      items: items.value.map(({ id, name, price }) => ({ ...(id ? { id } : {}), name, price })),
    })
    await load()
    if (!error.value) message.value = result.message
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to save. Your changes are still in the form.' }
  finally { saving.value = false }
}
onMounted(load)
</script>

<template>
  <section class="daily-menu">
    <div class="menu-heading"><div><p class="eyebrow">CAMPUS CANTEEN ONLY</p><h2>{{ manage ? 'Daily menu' : 'Campus Eat' }}</h2></div>
      <button type="button" class="secondary" :disabled="loading || saving" @click="load">Refresh</button>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }} <button type="button" class="secondary" :disabled="loading || saving" @click="load">Reload saved data</button></p>
    <p v-if="message" class="success" role="status">{{ message }}</p>
    <p v-if="loading" role="status">Loading menu…</p>
    <template v-if="manage">
      <label class="date-field">Service date<input v-model="date" type="date" min="2000-01-01" max="2200-12-31" :disabled="saving || loading" @change="load"></label>
      <form v-if="loadedDate && !loading" class="card" @submit.prevent="save">
        <fieldset :disabled="saving">
          <p class="muted">Prices are in Korean won. Save a draft or publish the menu for students to see on its service date.</p>
          <p v-if="!items.length" class="muted">No items for this date yet. Add your first menu item.</p>
          <article v-for="(item, index) in items" :key="item.id ?? index" class="menu-row">
            <label>Item name<input v-model="item.name" required maxlength="150" :aria-label="'Item ' + (index + 1) + ' name'"></label>
            <label>Price (₩)<input v-model.number="item.price" type="number" min="0" max="1000000" step="1" required :aria-label="'Item ' + (index + 1) + ' price'"></label>
            <button type="button" class="secondary" :aria-label="'Remove item ' + (index + 1)" @click="items.splice(index, 1)">Remove</button>
          </article>
          <button type="button" class="secondary" :disabled="items.length >= 40" @click="items.push({ name: '', price: 0 })">Add item</button>
          <label class="publish"><input v-model="published" type="checkbox">Publish this date’s menu</label>
          <p class="muted">{{ published ? 'Students can see this menu on ' + loadedDate + ' after saving.' : 'Draft: hidden from students after saving.' }}</p>
          <button :disabled="!items.length || saving">{{ saving ? 'Saving…' : 'Save menu' }}</button>
        </fieldset>
      </form>
    </template>
    <template v-else-if="!loading && !error">
      <h3>Today’s menu · {{ date }}</h3>
      <p v-if="!hasMenu" class="muted">No menu has been published for today. Please check again later.</p>
      <article v-for="item in items" :key="item.id" class="card menu-item"><h3>{{ item.name }}</h3><strong>₩{{ Number(item.price).toLocaleString('ko-KR') }}</strong></article>
      <p class="muted">Food information only. Please visit the campus canteen to order.</p>
    </template>
    <p v-if="updated && !loading && !error" class="muted">Last updated {{ displayTime(updated) }} (Korea time)</p>
  </section>
</template>

<style scoped>
.daily-menu{overflow-wrap:anywhere}.menu-heading,.menu-item{display:flex;align-items:center;justify-content:space-between;gap:16px}.menu-heading h2,.menu-item h3{margin:0}.date-field{display:block;max-width:220px;margin:20px 0}.daily-menu input{width:100%;box-sizing:border-box;margin-top:6px}.daily-menu fieldset{border:0;padding:0;min-width:0}.daily-menu .card{margin:16px 0}.menu-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(110px,1fr) auto;align-items:end;gap:12px;padding-bottom:18px;border-bottom:1px solid #dce5df;margin-bottom:18px}.menu-row label{margin:0}.publish{display:flex;align-items:center;gap:10px;margin-top:20px}.publish input{width:18px;height:18px;margin:0;flex-shrink:0}.daily-menu form button{width:auto;margin:8px 8px 0 0}.daily-menu .muted{font-size:14px;line-height:1.6}.menu-item strong{white-space:nowrap}.menu-item h3{overflow-wrap:anywhere;min-width:0}@media(max-width:600px){.menu-row{grid-template-columns:minmax(0,1fr) auto}.menu-row label:first-child{grid-column:1/-1}.menu-item{align-items:flex-start}.menu-heading{align-items:flex-start}}
</style>
