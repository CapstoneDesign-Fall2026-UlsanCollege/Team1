<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { calendarCells, calendarError, calendarMonths, isoMonth, nepalCalendarToday, validCalendarValue } from '../english-calendar'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue?: string | null; type?: 'date' | 'month'; min?: string; max?: string; required?: boolean; disabled?: boolean }>(), { type: 'date' })
const emit = defineEmits<{ 'update:modelValue': [value: string]; change: [event: Event] }>()
const attrs = useAttrs(), uid = useId()
const input = ref<HTMLInputElement>(), picker = ref<HTMLDialogElement>(), opener = ref<HTMLButtonElement>()
const draft = ref(props.modelValue ?? ''), year = ref(2026), month = ref(0)
const heading = `${uid}-calendar-title`
const cells = computed(() => calendarCells(year.value, month.value))
const error = computed(() => calendarError(draft.value, props.type, props.min, props.max))
function validate() { input.value?.setCustomValidity(error.value) }
watch(() => props.modelValue, value => { draft.value = value ?? '' })
watch([draft, () => props.min, () => props.max], () => { void nextTick(validate) }, { immediate: true })
function typed(event: Event) {
  draft.value = (event.target as HTMLInputElement).value
  validate()
  // Partial typing must not send malformed dates to dependent API requests.
  if (!draft.value || !error.value) emit('update:modelValue', draft.value)
}
function changed(event: Event) { if (!error.value) emit('change', event) }
function allowed(value: string) { return !calendarError(value, props.type, props.min, props.max) }
async function open() {
  if (props.disabled || opener.value?.matches(':disabled')) return
  let value = props.modelValue || nepalCalendarToday().slice(0, props.type === 'month' ? 7 : 10)
  if (!validCalendarValue(value, props.type)) value = nepalCalendarToday().slice(0, props.type === 'month' ? 7 : 10)
  if (props.min && value < props.min) value = props.min
  if (props.max && value > props.max) value = props.max
  year.value = Number(value.slice(0, 4)); month.value = Number(value.slice(5, 7)) - 1
  picker.value?.showModal()
  await nextTick()
  const target = picker.value?.querySelector<HTMLButtonElement>(`[data-value="${value}"]:not(:disabled)`) || picker.value?.querySelector<HTMLButtonElement>('[data-value]:not(:disabled)')
  target?.focus()
}
function close() { picker.value?.close(); opener.value?.focus() }
async function choose(value: string) {
  if (!allowed(value)) return
  draft.value = value
  emit('update:modelValue', value)
  await nextTick()
  validate()
  close()
  emit('change', new Event('change', { bubbles: true }))
}
function navigate(delta: number) {
  const date = new Date(`${isoMonth(year.value, month.value)}-01T00:00:00Z`)
  if (props.type === 'month') date.setUTCFullYear(year.value + delta)
  else date.setUTCMonth(month.value + delta)
  const y = date.getUTCFullYear()
  if (y >= 1 && y <= 9999) { year.value = y; month.value = date.getUTCMonth() }
}
async function moveFocus(event: KeyboardEvent, value: string) {
  const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
  if (props.type !== 'date' || offsets[event.key] === undefined) return
  event.preventDefault()
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + offsets[event.key]!)
  const next = date.toISOString().slice(0, 10)
  if (!allowed(next)) return
  year.value = date.getUTCFullYear(); month.value = date.getUTCMonth()
  await nextTick()
  picker.value?.querySelector<HTMLButtonElement>(`[data-value="${next}"]`)?.focus()
}
</script>

<template>
  <span class="english-date-field">
    <input ref="input" v-bind="attrs" type="text" :value="draft" :required="required" :disabled="disabled" :placeholder="type==='month'?'YYYY-MM':'YYYY-MM-DD'" :pattern="type==='month'?'[0-9]{4}-[0-9]{2}':'[0-9]{4}-[0-9]{2}-[0-9]{2}'" :maxlength="type==='month'?7:10" :aria-invalid="draft && error ? true : undefined" autocomplete="off" inputmode="text" @input="typed" @change="changed">
    <button ref="opener" type="button" class="english-date-open" :disabled="disabled" :aria-label="type==='month'?'Open English month calendar':'Open English date calendar'" aria-haspopup="dialog" @click.prevent="open">
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/></svg>
    </button>
    <Teleport to="body">
      <dialog ref="picker" class="english-calendar" lang="en" :aria-labelledby="heading" @cancel.prevent="close" @click="($event.target===picker)&&close()">
        <div class="english-calendar-heading"><h2 :id="heading">{{type==='month'?'Choose a month':'Choose a date'}}</h2><button type="button" @click="close" aria-label="Close calendar">Close</button></div>
        <div class="english-calendar-navigation"><button type="button" :aria-label="type==='month'?'Previous year':'Previous month'" @click="navigate(-1)">‹</button><strong>{{type==='month'?year:calendarMonths[month]+' '+year}}</strong><button type="button" :aria-label="type==='month'?'Next year':'Next month'" @click="navigate(1)">›</button></div>
        <div class="english-calendar-jump"><label>Month<select v-model.number="month" :disabled="type==='month'"><option v-for="(name,i) in calendarMonths" :key="name" :value="i">{{name}}</option></select></label><label>Year<input v-model.number="year" type="number" min="1" max="9999" @change="year=Math.min(9999,Math.max(1,Number(year)||2026))"></label></div>
        <div v-if="type==='month'" class="english-calendar-months"><button v-for="(name,i) in calendarMonths" :key="name" type="button" :data-value="isoMonth(year,i)" :disabled="!allowed(isoMonth(year,i))" :aria-pressed="modelValue===isoMonth(year,i)" @click="choose(isoMonth(year,i))">{{name}}</button></div>
        <template v-else><div class="english-calendar-weekdays" aria-hidden="true"><span v-for="name in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="name">{{name}}</span></div><div class="english-calendar-days"><template v-for="(value,i) in cells" :key="i"><button v-if="value" type="button" :data-value="value" :disabled="!allowed(value)" :aria-label="calendarMonths[month]+' '+Number(value.slice(-2))+', '+year" :aria-pressed="modelValue===value" :aria-current="value===nepalCalendarToday()?'date':undefined" @click="choose(value)" @keydown="moveFocus($event,value)">{{Number(value.slice(-2))}}</button><span v-else></span></template></div></template>
        <div class="english-calendar-footer"><span>English calendar · Nepal dates</span><button v-if="!required" type="button" @click="choose('')">Clear</button></div>
      </dialog>
    </Teleport>
  </span>
</template>

<style>
.english-date-field{display:flex;align-items:center;position:relative;min-width:0;width:100%}
#app .english-date-field>input{width:100%;min-width:0;padding-right:48px;font-size:16px}
#app .english-date-field>.english-date-open{position:absolute;right:4px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:40px;min-width:40px;height:40px;min-height:40px;padding:8px;margin:0;background:transparent;color:#245e49;border:0}
.english-calendar{width:min(368px,calc(100% - 24px));max-height:calc(100dvh - 32px);overflow:auto;border:1px solid #cbdad1;border-radius:16px;padding:20px;background:#fff;color:#243e33;font-family:Inter,"Segoe UI",sans-serif;box-shadow:0 20px 70px #153c2a30}
.english-calendar::backdrop{background:#153c2a70}
.english-calendar .english-calendar-heading,.english-calendar .english-calendar-navigation,.english-calendar .english-calendar-footer{display:flex;align-items:center;justify-content:space-between;gap:8px}
.english-calendar .english-calendar-heading h2{margin:0;font-size:18px;letter-spacing:normal}
.english-calendar button{width:auto;min-width:0;min-height:40px;margin:0;padding:8px;border:0;border-radius:8px;background:#eef4f0;color:#245e49;font:600 14px/1.3 Inter,"Segoe UI",sans-serif;cursor:pointer}
.english-calendar button:disabled{opacity:.35;cursor:not-allowed}
.english-calendar button:focus-visible,#app .english-date-open:focus-visible{outline:2px solid #21896f;outline-offset:2px}
.english-calendar .english-calendar-navigation{margin:18px 0 12px}
.english-calendar .english-calendar-navigation button{width:40px;font-size:24px}
.english-calendar .english-calendar-jump{display:grid;grid-template-columns:1.4fr 1fr;gap:12px;margin-bottom:14px}
.english-calendar .english-calendar-jump label{display:block;margin:0;font-size:12px;font-weight:600}
.english-calendar .english-calendar-jump input,.english-calendar .english-calendar-jump select{width:100%;max-width:100%;min-width:0;height:40px;padding:6px;margin:4px 0 0;border:1px solid #bccfc5;border-radius:8px;font:16px Inter,"Segoe UI",sans-serif;background:#fff;color:#243e33}
.english-calendar .english-calendar-jump :is(input,select):focus-visible{outline:2px solid #21896f;outline-offset:2px}
.english-calendar .english-calendar-weekdays,.english-calendar .english-calendar-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;text-align:center}
.english-calendar .english-calendar-weekdays{font-size:12px;color:#60736e;margin-bottom:6px}
.english-calendar .english-calendar-days button{padding:4px;min-height:40px;background:transparent}
.english-calendar .english-calendar-months{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.english-calendar button[aria-pressed=true]{background:#245e49;color:white}
.english-calendar button[aria-current=date]{box-shadow:inset 0 0 0 1px #245e49}
.english-calendar button:hover:not(:disabled):not([aria-pressed=true]){background:#e0ebe5}
.english-calendar .english-calendar-footer{margin-top:16px;padding-top:12px;border-top:1px solid #dce5df;font-size:11px;color:#60736e}
</style>
