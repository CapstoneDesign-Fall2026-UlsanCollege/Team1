<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { days } from '../schedules'
const props = defineProps<{ state: any; classId: number; yearId: number; busy: boolean; error?: string; classLabel?: string; save: (path: string, method: string, value: object) => Promise<any> }>()
const cl = computed(() => props.state.classes.find((c: any) => c.id === props.classId))
const terms = computed(() => props.state.terms.filter((t: any) => t.year_id === props.yearId))
const termId = ref(0), search = ref(''), selected = ref<{ kind: string; id: number } | null>(null), feedback = ref('')
const weekend = ref(false), outsideHours = ref(false)
const catalogForm = reactive({ course_id: 0, course_code: '', course_name: '' }), teacherForm = reactive({ name: '', staff_code: '' })
const library = computed(() => props.state.catalog.filter((c: any) => props.state.grade_subjects.some((g: any) => g.year_id === props.yearId && g.grade_label === cl.value?.grade_label && g.course_id === c.id) && (c.course_name + ' ' + c.course_code).toLowerCase().includes(search.value.toLowerCase())))
const assigned = computed(() => props.state.subjects.filter((s: any) => s.semester_id === termId.value && props.state.links.some((l: any) => l.class_id === props.classId && l.offering_id === s.id)))
const meetings = computed(() => props.state.meetings.filter((m: any) => assigned.value.some((s: any) => s.id === m.course_offering_id)))
const visibleDays = computed(() => weekend.value || meetings.value.some((m: any) => m.day_of_week === 6) ? [7, 1, 2, 3, 4, 5, 6] : [7, 1, 2, 3, 4, 5])
const minutes = (v: string) => Number(v.slice(0, 2)) * 60 + Number(v.slice(3, 5))
const hours = computed(() => { if (!outsideHours.value) return [10, 11, 12, 13, 14, 15]; const first = Math.min(10, ...meetings.value.map((m: any) => Math.floor(minutes(m.start_time) / 60))), last = Math.max(16, ...meetings.value.map((m: any) => Math.ceil(minutes(m.end_time) / 60))); return Array.from({ length: last - first }, (_, i) => first + i) })
const outsideCount = computed(() => meetings.value.filter((m: any) => minutes(m.start_time) < 600 || minutes(m.end_time) > 960).length)
const teachers = computed(() => props.state.teachers.filter((t: any) => t.is_active))
const subject = (id: number) => assigned.value.find((s: any) => s.id === id)
const teacherFor = (id: number) => props.state.subject_teachers.find((t: any) => t.offering_id === id)?.teacher_id ?? 0
const time = (hour: number) => String(hour).padStart(2, '0') + ':00'
function inSlot(day: number, hour: number) { return meetings.value.filter((m: any) => m.day_of_week === day && minutes(m.start_time) < (hour + 1) * 60 && minutes(m.end_time) > hour * 60) }
function pick(kind: string, id: number) { selected.value = { kind, id }; feedback.value = kind === 'catalog' ? 'Drop into Class subjects to choose a teacher in the popup form.' : 'Choose a timetable slot to review the lesson in a popup form.' }
const root = ref<HTMLElement | null>(null), dragging = ref(false), pointerX = ref(0), pointerY = ref(0)
let cleanupDrag: (() => void) | undefined, suppressClick = false
function nativeDrag(event:DragEvent,kind:string,id:number){if(props.busy){event.preventDefault();return}pick(kind,id);event.dataTransfer?.setData('application/x-studenthub',JSON.stringify({kind,id}));if(event.dataTransfer)event.dataTransfer.effectAllowed='move'}
function allowNativeDrop(event:DragEvent){event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect='move'}
function nativeDrop(event:DragEvent,day?:number,hour?:number){event.preventDefault();event.stopPropagation();cleanupDrag?.();if(props.busy || popup.value?.open)return;try{const value=JSON.parse(event.dataTransfer?.getData('application/x-studenthub')||'null');if(!value||!['catalog','subject','meeting'].includes(value.kind)||!Number.isSafeInteger(value.id))return;selected.value=value;if(day!==undefined && hour!==undefined)void place(day,hour);else void addSubject()}catch{feedback.value='Select a subject card and click the destination to open its form.'}}
function choose(kind: string, id: number) { if (!suppressClick) pick(kind, id) }
function startPointer(event: PointerEvent, kind: string, id: number) {
  if (props.busy || event.button !== 0) return
  cleanupDrag?.()
  const startX = event.clientX, startY = event.clientY, source = event.currentTarget as HTMLElement
  source.setPointerCapture(event.pointerId)
  function move(e: PointerEvent) {
    if (!dragging.value && Math.hypot(e.clientX - startX, e.clientY - startY) > 6) { dragging.value = true; pick(kind, id) }
    pointerX.value = e.clientX; pointerY.value = e.clientY
    if (dragging.value) e.preventDefault()
  }
  function stop(e: PointerEvent) {
    const didDrag = dragging.value
    const destination = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-planner-target]')
    cleanupDrag?.()
    if (!didDrag || popup.value?.open) return
    suppressClick = true; window.setTimeout(() => { suppressClick = false }, 0)
    if (!destination || !root.value?.contains(destination)) { feedback.value = 'Drop onto Class subjects or a timetable slot.'; return }
    if (destination.dataset.plannerTarget === 'class') void addSubject()
    else void place(Number(destination.dataset.day), Number(destination.dataset.hour))
  }
  function cancel() { cleanupDrag?.() }
  cleanupDrag = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); window.removeEventListener('pointercancel', cancel); dragging.value = false; if (source.hasPointerCapture(event.pointerId)) source.releasePointerCapture(event.pointerId); cleanupDrag = undefined }
  window.addEventListener('pointermove', move, { passive: false }); window.addEventListener('pointerup', stop); window.addEventListener('pointercancel', cancel)
}
onBeforeUnmount(() => cleanupDrag?.())
const pendingSlot = ref<{day:number;hour:number}|null>(null)
const popup = ref<HTMLDialogElement | null>(null), popupMode = ref(''), popupError = ref('')
const draft = reactive({ course_id:0, offering_id:0, meeting_id:0, teacher_id:0, day_of_week:7, start_time:'10:00', end_time:'11:00', location:'' })
const popupSubject = computed(() => popupMode.value === 'subject' ? props.state.catalog.find((c:any)=>c.id===draft.course_id)?.course_name : subject(draft.offering_id)?.course_name)
function closePopup() { if (!props.busy) { popup.value?.close(); popupMode.value=''; popupError.value='';pendingSlot.value=null } }
async function showPopup(mode:string) { popupMode.value=mode;popupError.value='';await nextTick();if(popup.value && !popup.value.open)popup.value.showModal() }
async function addSubject() {
  if (props.busy) return
  if (selected.value?.kind !== 'catalog') { feedback.value='Select a subject from the grade library first.';return }
  if (!termId.value) { feedback.value='Choose a school term first.';return }
  if (!library.value.some((c:any)=>c.id===selected.value!.id)) return
  Object.assign(draft,{course_id:selected.value.id,teacher_id:0});await showPopup('subject')
}
async function place(day:number,hour:number) {
  if(hour===13){feedback.value='1-2 PM is tiffin break. Choose another period.';return}
  if(props.busy || !selected.value)return
  if(selected.value.kind==='catalog'){pendingSlot.value={day,hour};await addSubject();return}
  const old=selected.value.kind==='meeting'?meetings.value.find((m:any)=>m.id===selected.value!.id):null
  const offeringId=old?.course_offering_id??selected.value.id
  if(!subject(offeringId)||(selected.value.kind==='meeting' && !old))return
  const duration=old?minutes(old.end_time)-minutes(old.start_time):60,end=hour*60+duration
  if(end>=1440){feedback.value='This lesson would extend beyond the end of the day.';return}
  Object.assign(draft,{offering_id:offeringId,meeting_id:old?.id??0,day_of_week:day,start_time:time(hour),end_time:String(Math.floor(end/60)).padStart(2,'0')+':'+String(end%60).padStart(2,'0'),location:old?.location??''})
  await showPopup('lesson')
}
async function editLesson(m:any){if(props.busy)return;Object.assign(draft,{offering_id:m.course_offering_id,meeting_id:m.id,day_of_week:m.day_of_week,start_time:m.start_time.slice(0,5),end_time:m.end_time.slice(0,5),location:m.location??''});await showPopup('lesson')}
async function openTeacher(id:number){if(props.busy)return;Object.assign(draft,{offering_id:id,teacher_id:teacherFor(id)});await showPopup('teacher')}
async function confirmPopup(){
  if(props.busy)return
  popupError.value='';let result
  try{
    if(popupMode.value==='subject')result=await props.save('subjects','POST',{class_id:props.classId,course_id:draft.course_id,semester_id:termId.value,teacher_id:draft.teacher_id})
    else if(popupMode.value==='teacher')result=await props.save('subjects/'+draft.offering_id+'/teacher','PUT',{teacher_id:draft.teacher_id})
    else result=await props.save('schedules'+(draft.meeting_id?'/'+draft.meeting_id:''),draft.meeting_id?'PUT':'POST',{course_offering_id:draft.offering_id,day_of_week:draft.day_of_week,start_time:draft.start_time,end_time:draft.end_time,location:draft.location})
    if(result){const slot=popupMode.value==='subject'?pendingSlot.value:null;selected.value=null;feedback.value=popupMode.value==='lesson'?'Timetable saved.':popupMode.value==='teacher'?'Teacher assignment saved.':'Subject added. Drag its class card into the timetable.';closePopup();if(slot && result.id){selected.value={kind:'subject',id:result.id};await place(slot.day,slot.hour)}}
    else popupError.value=props.error || 'Unable to save. Review the form and try again.'
  }catch(e){popupError.value=e instanceof Error?e.message:'Unable to save.'}
}
async function removeMeeting(id: number) { if (window.confirm('Remove this meeting from the timetable?')) await props.save('schedules/' + id, 'DELETE', {}) }
async function removeSubject(id: number) { if (window.confirm('Unlink this subject from the class? Original records remain saved.')) await props.save('classes/' + props.classId + '/subjects/' + id, 'DELETE', {}) }
async function addCatalog() { if (await props.save('grade-subjects', 'POST', { year_id: props.yearId, grade_label: cl.value.grade_label, ...(catalogForm.course_id ? { course_id: catalogForm.course_id } : { course_code: catalogForm.course_code, course_name: catalogForm.course_name }) })) Object.assign(catalogForm, { course_id: 0, course_code: '', course_name: '' }) }
async function addTeacher() { if (await props.save('teachers', 'POST', teacherForm)) Object.assign(teacherForm, { name: '', staff_code: '' }) }
watch(() => [props.classId, props.yearId], () => { selected.value = null; feedback.value = ''; termId.value = terms.value[0]?.id ?? 0 }, { immediate: true })
watch(() => props.state, () => { if (!terms.value.some((t: any) => t.id === termId.value)) termId.value = terms.value[0]?.id ?? 0;  })
watch(termId, () => { selected.value = null })
</script>
<template>
<section ref="root" class="planner" :class="{ dragging }" :aria-busy="busy"><div v-if="dragging" class="drag-ghost" :style="{ left: pointerX + 14 + 'px', top: pointerY + 14 + 'px' }">Place selected subject</div>
  <div class="planner-top"><div><h3>Plan this class’s week</h3><p class="class-identity">{{classLabel || 'Grade '+cl?.grade_label+' · Class '+cl?.name}}</p><p>1. Drag a subject · 2. Fill the popup · 3. Confirm to save</p></div><label>School term<select v-model="termId" :disabled="busy"><option :value="0">Choose a term</option><option v-for="t in terms" :key="t.id" :value="t.id">{{ t.name }}</option></select></label></div>
  <p v-if="!terms.length" class="notice">Create or link a term in Years and classes first.</p>
  <p role="status" class="notice">{{ feedback || 'Drag a card, or select it and click a destination. All times use Nepal time (NPT).' }}</p>
  <div class="workspace">
    <aside class="library"><h4>Grade {{ cl?.grade_label }} subject library <span>{{ library.length }}</span></h4>
      <label>Find a subject<input v-model="search" type="search" placeholder="Subject name or code"></label>

      <p class="hint">Saved for this grade and academic year.</p>
      <div class="library-list"><button v-for="c in library" :key="c.id" type="button" class="subject-card" :class="{ picked: selected?.kind === 'catalog' && selected.id === c.id }" draggable="false" :disabled="busy" @dragstart="nativeDrag($event, 'catalog', c.id)" @pointerdown="startPointer($event, 'catalog', c.id)" @click="choose('catalog', c.id)"><strong>{{ c.course_name }}</strong><small>{{ c.course_code }} · Select or drag →</small></button><p v-if="!library.length">No matching grade subjects. Add them below.</p></div>
      <button type="button" :disabled="busy || selected?.kind !== 'catalog' || !termId" @click="addSubject()">Add selected to class →</button>
      <details><summary>Manage subject library</summary><form @submit.prevent="addCatalog"><fieldset :disabled="busy"><label>Use existing subject<select v-model="catalogForm.course_id"><option :value="0">Create a new subject</option><option v-for="c in state.catalog" :key="c.id" :value="c.id">{{ c.course_name }} · {{ c.course_code }}</option></select></label><template v-if="!catalogForm.course_id"><label>Subject code<input v-model="catalogForm.course_code" required maxlength="50"></label><label>Subject name<input v-model="catalogForm.course_name" required maxlength="150"></label></template><button>Save to grade library</button></fieldset></form></details>
      <details><summary>Add a teacher</summary><form @submit.prevent="addTeacher"><fieldset :disabled="busy"><label>Staff code<input v-model="teacherForm.staff_code" required maxlength="40"></label><label>Teacher name<input v-model="teacherForm.name" required maxlength="150"></label><button>Save teacher</button></fieldset></form></details>
    </aside>
    <div class="planning-area">
      <section class="class-tray" data-planner-target="class" @dragover="allowNativeDrop" @drop="nativeDrop($event)"><div class="tray-heading"><h4>Class subjects <span>{{ assigned.length }}</span></h4><span>Drop library subjects here</span></div><p v-if="!assigned.length">Add a subject from the library to get started.</p><div class="class-cards"><article v-for="s in assigned" :key="s.id" class="assigned-card"><button type="button" class="subject-card" :class="{ picked: selected?.kind === 'subject' && selected.id === s.id }" draggable="false" :disabled="busy" @dragstart="nativeDrag($event, 'subject', s.id)" @pointerdown="startPointer($event, 'subject', s.id)" @click="choose('subject', s.id)"><strong>{{ s.course_name }}</strong><small>Select or drag into the week ↓</small></button><p class="teacher-label">{{ s.professor || 'Teacher not assigned' }}</p><button type="button" class="text-button" :disabled="busy" @click="openTeacher(s.id)">Change teacher</button><button type="button" class="text-button" :disabled="busy" @click="removeSubject(s.id)">Unlink</button></article></div></section>
      <div class="week-heading"><h4>Weekly timetable</h4><label class="weekends"><input v-model="weekend" type="checkbox">Include Saturday</label></div>
      <p class="hint">10:00 AM–4:00 PM · Drop a subject to review its day and time in a popup. A new lesson starts at one hour; adjust it before saving. Click a saved lesson to edit it.</p>
      <p v-if="outsideCount" class="hint">{{ outsideCount }} saved lesson(s) extend outside 10:00 AM–4:00 PM. <button type="button" class="text-button" @click="outsideHours = !outsideHours">{{ outsideHours ? 'Return to 10 AM–4 PM' : 'Show outside hours' }}</button></p>
      <div class="grid-scroll" tabindex="0" aria-label="Weekly timetable, scroll horizontally on small screens"><table><thead><tr><th scope="col">Time</th><th v-for="day in visibleDays" :key="day" scope="col">{{ days[day - 1] }}</th></tr></thead><tbody><tr v-for="hour in hours" :key="hour"><th scope="row">{{ time(hour) }}<small>{{ time(hour + 1) }}</small></th><td v-for="day in visibleDays" :key="day" :data-planner-target="hour===13?undefined:'slot'" :data-day="day" :data-hour="hour" @dragover="allowNativeDrop" @drop="nativeDrop($event,day,hour)"><span v-if="hour===13" class="tiffin-label">Tiffin break</span><article v-for="m in inSlot(day, hour)" :key="m.id" class="lesson"><button type="button" draggable="false" :disabled="busy" @dragstart="nativeDrag($event, 'meeting', m.id)" :class="{ picked: selected?.kind === 'meeting' && selected.id === m.id }" @pointerdown.stop="startPointer($event, 'meeting', m.id)" @click="editLesson(m)"><strong>{{ subject(m.course_offering_id)?.course_name }}</strong><small>{{ m.start_time.slice(0, 5) }}–{{ m.end_time.slice(0, 5) }}</small><small>{{ subject(m.course_offering_id)?.professor || 'Teacher unassigned' }}</small></button><button type="button" class="text-button" :disabled="busy" :aria-label="'Remove ' + subject(m.course_offering_id)?.course_name + ' on ' + days[day - 1]" @click="removeMeeting(m.id)">Remove</button></article><button v-if="hour!==13 && !inSlot(day, hour).length" type="button" class="slot" :disabled="busy || !selected" :aria-label="'Place selected subject on ' + days[day - 1] + ' at ' + time(hour)" @click="place(day, hour)">+</button></td></tr></tbody></table></div>
    </div>
  </div>
  <dialog ref="popup" aria-labelledby="subject-popup-title" @cancel.prevent="closePopup">
    <div class="popup-heading"><div><p class="hint">{{classLabel || 'Grade '+cl?.grade_label+' · Class '+cl?.name}} · {{terms.find((t:any)=>t.id===termId)?.name}}</p><h3 id="subject-popup-title">{{popupMode==='subject'?'Add class subject':popupMode==='teacher'?'Assign subject teacher':draft.meeting_id?'Edit lesson':'Add lesson'}}</h3></div><button type="button" class="text-button" :disabled="busy" aria-label="Close planner form" @click="closePopup">Close</button></div>
    <p class="popup-subject">{{popupSubject}}</p><p v-if="pendingSlot" class="hint">Step 1: confirm this subject and teacher. Next, review the lesson for {{days[pendingSlot.day-1]}} at {{time(pendingSlot.hour)}}. Each step saves only after confirmation.</p>
    <p v-if="popupError" class="popup-error" role="alert">{{popupError}}</p>
    <form @submit.prevent="confirmPopup"><fieldset :disabled="busy">
      <template v-if="popupMode==='subject' || popupMode==='teacher'"><label>Subject teacher<select v-model="draft.teacher_id" required><option :value="0" disabled>Choose a teacher</option><option v-for="t in teachers" :key="t.id" :value="t.id">{{t.name}} · {{t.staff_code}}</option></select></label><p v-if="!teachers.length" class="hint">Add a teacher using the library’s Add a teacher section first.</p><p v-if="popupMode==='teacher'" class="hint">This changes the teacher for all lessons of this subject offering, including its Sunday homeroom responsibility.</p></template>
      <template v-else><p class="hint">Teacher: {{subject(draft.offering_id)?.professor || 'Not assigned'}} · Nepal time (NPT)</p><div class="popup-fields"><label>Day<select v-model="draft.day_of_week"><option v-for="day in [7,1,2,3,4,5,6]" :key="day" :value="day">{{days[day-1]}}</option></select></label><label>Start time<input v-model="draft.start_time" type="time" required></label><label>End time<input v-model="draft.end_time" type="time" required></label></div><label>Location note (optional)<input v-model="draft.location" maxlength="150" placeholder="For example, usual classroom"></label><p class="hint">Repeats weekly in this subject’s term. Shared offerings update every linked class. Shared-room bookings are managed separately in Rooms.</p></template>
      <div class="popup-actions"><button :disabled="(popupMode==='subject'||popupMode==='teacher') && !draft.teacher_id">{{busy?'Saving…':popupMode==='subject'?'Confirm subject':popupMode==='teacher'?'Save teacher':'Save lesson'}}</button><button type="button" class="text-button" @click="closePopup">Cancel</button></div>
    </fieldset></form>
  </dialog>

</section>
</template>
<style scoped>
.planner{color:#233c35}.class-identity{font-weight:600;color:#345b48!important}.teacher-label{font-size:.8rem;color:#61766a;margin:10px 4px 3px}dialog{box-sizing:border-box;width:min(580px,calc(100vw - 24px));max-height:90vh;overflow:auto;border:1px solid #d1ded4;border-radius:16px;padding:24px;color:#294333}dialog::backdrop{background:#14332280}.popup-heading{display:flex;align-items:center;justify-content:space-between;gap:16px}.popup-heading h3{margin:0;font-size:21px}.popup-heading .hint{margin-top:0}.popup-subject{padding:12px;background:#edf5ef;border-radius:8px;font-weight:600}.popup-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:12px}.popup-error{background:#fbefeb;color:#9c4030;padding:12px;border-radius:8px;font-size:13px}.popup-actions{display:flex;gap:12px;margin-top:18px}.subject-card,.lesson>button:first-child{touch-action:none;user-select:none}.drag-ghost{position:fixed;z-index:1000;pointer-events:none;background:#284e3b;color:white;padding:12px;border-radius:8px;box-shadow:0 4px 15px #0003}.dragging [data-planner-target]{outline:1px dashed #98b49e}.dragging .slot{background:#f1f7f2}.planner-top,.week-heading,.tray-heading{display:flex;align-items:center;justify-content:space-between;gap:16px}.planner-top h3{font-size:1.4rem;margin:0}.planner-top p,.hint{color:#687a74;font-size:.88rem}.planner-top label{min-width:180px}h4{margin:0 0 12px;font-size:1rem}h4 span{background:#e0ece5;border-radius:20px;padding:2px 8px;font-size:.8rem}.notice{background:#e9f2ec;border-radius:10px;padding:12px 16px;font-size:.9rem;min-height:24px}.workspace{display:grid;grid-template-columns:255px minmax(0,1fr);gap:20px;align-items:start}.library,.class-tray{background:white;border:1px solid #dbe5df;border-radius:16px;padding:18px}.library{position:sticky;top:12px;max-height:calc(100vh - 48px);overflow:auto}.library-list{display:grid;gap:8px;max-height:300px;overflow:auto;margin:12px 0}.subject-card{display:block;text-align:left;width:100%;background:#f2f7f3;color:#294c40;border:1px solid #ccded2;padding:12px;border-radius:10px;cursor:grab}.subject-card strong,.subject-card small{display:block}.subject-card small{margin-top:5px;color:#60766b;font-size:.75rem}.picked{outline:3px solid #b47e24!important;outline-offset:1px}label{display:block;font-size:.8rem;font-weight:600;margin:10px 0}input,select{display:block;box-sizing:border-box;max-width:100%;width:100%;padding:10px;border:1px solid #c9d8ce;border-radius:7px;background:white;margin-top:5px;color:#253c33}button{font:inherit;background:#376453;color:white;border:0;border-radius:8px;padding:10px 12px;cursor:pointer}button:disabled{opacity:.5;cursor:default}button:focus-visible,summary:focus-visible{outline:3px solid #b47e24;outline-offset:2px}fieldset{padding:0;border:0;min-width:0}details{border-top:1px solid #e2e9e4;margin-top:14px;padding-top:12px}summary{cursor:pointer;font-size:.85rem}.planning-area{min-width:0}.class-tray{border:2px dashed #bdcfc2}.tray-heading>span{font-size:.75rem;color:#6c7f73}.class-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px}.assigned-card{border:1px solid #dae5de;border-radius:10px;padding:8px}.assigned-card label{margin:8px 0 0}.assigned-card select{font-size:.8rem}.text-button{background:transparent;color:#76604a;padding:5px;font-size:.73rem}.week-heading{margin-top:24px}.weekends{display:flex;gap:7px;align-items:center;white-space:nowrap}.weekends input{width:auto;margin:0}.grid-scroll{max-height:65vh;overflow:auto;border:1px solid #d3dfd7;border-radius:12px;background:white}table{border-collapse:separate;border-spacing:0;width:100%;min-width:620px;table-layout:fixed}th{background:#edf4ef;font-size:.77rem;padding:12px 5px;position:sticky;top:0;z-index:1}th:first-child{width:60px}th small{display:block;font-weight:400;color:#718278;margin-top:5px}td{height:76px;vertical-align:top;border-top:1px solid #e1e9e3;border-left:1px solid #e1e9e3;padding:4px}.slot{width:100%;height:72px;background:transparent;color:#588367;font-size:1.3rem;border:1px dashed transparent}.slot:not(:disabled):hover{background:#e8f2e9;border-color:#86a48c}.lesson{background:#e3efe6;border-radius:7px;margin-bottom:3px}.lesson>button:first-child{width:100%;text-align:left;background:transparent;color:#284e35;padding:7px;font-size:.78rem}.lesson small{display:block;font-size:.68rem;margin-top:3px}.lesson .text-button{padding:0 7px 5px}.hint{line-height:1.5}@media(max-width:850px){.workspace{grid-template-columns:210px minmax(0,1fr);gap:12px}.library{padding:12px}}@media(max-width:650px){.planner-top{align-items:stretch;flex-direction:column}.workspace{grid-template-columns:1fr}.library{position:static;max-height:none}.library-list{grid-template-columns:repeat(2,minmax(0,1fr));max-height:180px}.class-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.week-heading,.tray-heading{align-items:start}.planner-top h3{font-size:1.2rem}}
.tiffin-label{display:block;padding:14px 4px;color:#795a25;background:#fff3d9;text-align:center;font-size:12px;border-radius:6px}
</style>
