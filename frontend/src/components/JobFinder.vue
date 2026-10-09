<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { scheduleApi } from '../schedules'
import { weekdays, parseJobSchedule, matchesSchedule, scheduleLabel, timetableStatus, type ClassMeeting } from '../job-schedules'
import StudentIcon from './StudentIcon.vue'
const props = defineProps<{ loginId: string }>()
type Job = { savedAt?: string; id: string; company: string; title: string; location: string; salary: string; career: string; education: string; employment: string; posted: string; closes: string; description: string; address: string; hours: string; application: string; documents: string; phone: string }
const jobs = ref<Job[]>([]), page = ref(1), total = ref(0), pageSize = ref(30), fetchedAt = ref('')
const loading = ref(false), error = ref(''), search = ref('')
const availableDays = ref<number[]>([]), availableStart = ref(''), availableEnd = ref(''), includeUnknown = ref(true)
const invalidTime = computed(() => (!!availableStart.value !== !!availableEnd.value) || (!!availableStart.value && availableStart.value === availableEnd.value))
const filtersActive = computed(() => !!submittedSearch.value || fitsTimetable.value || !!availableDays.value.length || !!availableStart.value || !!availableEnd.value)
function clearFilters() { search.value = ''; submittedSearch.value = ''; availableDays.value = []; availableStart.value = ''; availableEnd.value = ''; includeUnknown.value = true; fitsTimetable.value=false; if(tab.value==='all') void load(1) }
const favourites = ref<(Job & {savedAt?: string})[]>([]), tab = ref('all'), saving = ref<string[]>([]), favouriteError = ref('')
const submittedSearch = ref(''), fitsTimetable = ref(false), meetings = ref<ClassMeeting[]>([]), terms = ref<{id:number;name:string;academic_year:number;start_date:string;end_date:string}[]>([]), semester = ref(0), timetableError = ref('')
const termMeetings = computed(() => meetings.value.filter(meeting => meeting.semester_id === semester.value))
const canCompare = computed(() => !!semester.value && termMeetings.value.length > 0 && !timetableError.value)
watch(canCompare, value => { if(!value) fitsTimetable.value=false })
const favouriteIds = computed(() => new Set(favourites.value.map(job => job.id)))
const preferenceKey = 'studenthub-job-filters:' + props.loginId
function restoreFilters() {
 try {
  const value = JSON.parse(localStorage.getItem(preferenceKey) || 'null')
  if (!value || typeof value !== 'object') return
  availableDays.value = Array.isArray(value.days) ? [...new Set<number>(value.days.filter((day: unknown) => Number.isInteger(day) && Number(day)>=0 && Number(day)<=6))] : []
  availableStart.value = typeof value.start === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value.start) ? value.start : ''
  availableEnd.value = typeof value.end === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value.end) ? value.end : ''
  includeUnknown.value = value.unknown !== false
  search.value = typeof value.search === 'string' ? value.search.slice(0,100) : ''; submittedSearch.value = search.value
  fitsTimetable.value = value.fits === true; semester.value = Number.isSafeInteger(value.semester) ? value.semester : 0
 } catch { /* Storage may be unavailable in private browsing. */ }
}
watch([availableDays,availableStart,availableEnd,includeUnknown,submittedSearch,fitsTimetable,semester], () => {
 try { localStorage.setItem(preferenceKey,JSON.stringify({days:availableDays.value,start:availableStart.value,end:availableEnd.value,unknown:includeUnknown.value,search:submittedSearch.value,fits:fitsTimetable.value,semester:semester.value})) } catch { /* Filters still work without storage. */ }
}, {deep:true})
function fitStatus(job: Job) { return canCompare.value ? timetableStatus(parseJobSchedule(job.hours),termMeetings.value) : 'unavailable' }
function fitLabel(job: Job) { return {unknown:'Schedule unknown — check with employer',conflict:'Overlaps your classes',clear:'No class overlap detected',unavailable:'Timetable comparison unavailable'}[fitStatus(job)] }
function phoneLink(phone: string) { const digits=phone.replace(/[^+0-9]/g,''); return /^\+?\d{7,15}$/.test(digits) ? 'tel:'+digits : undefined }
async function loadFavourites() {
 try { favourites.value = (await scheduleApi('student/job-favourites')).jobs; favouriteError.value = '' }
 catch(e) { favouriteError.value = e instanceof Error ? e.message : 'Unable to load favourites.' }
}
async function toggleFavourite(job: Job) {
 if (saving.value.includes(job.id)) return
 saving.value.push(job.id); favouriteError.value = ''
 try {
  if (favouriteIds.value.has(job.id)) { await scheduleApi('student/job-favourites/'+job.id,'DELETE'); favourites.value=favourites.value.filter(saved=>saved.id!==job.id) }
  else { const response=await scheduleApi('student/job-favourites','POST',{job}); favourites.value.unshift({...response.job,savedAt:new Date().toISOString()}) }
 } catch(e) { favouriteError.value = e instanceof Error ? e.message : 'Unable to save favourite.' }
 finally { saving.value = saving.value.filter(id=>id!==job.id) }
}
async function loadTimetable() {
 timetableError.value = ''
 try {
  const [schedules,semesters] = await Promise.all([scheduleApi('student/schedule'),scheduleApi('student/semesters')]); meetings.value=schedules.schedules;terms.value=semesters.semesters
  if (!terms.value.some(term=>term.id===semester.value)) semester.value=terms.value[0]?.id??0
  if (!canCompare.value) fitsTimetable.value=false
 } catch { timetableError.value='Your timetable could not be loaded. Try refreshing.'; fitsTimetable.value=false }
}
async function submitSearch() { if(loading.value) return; submittedSearch.value=search.value.trim(); if(tab.value==='all') await load(1) }
const pages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const visible = computed(() => {
  if (invalidTime.value) return []
  const query = submittedSearch.value.toLocaleLowerCase()
  return (tab.value==='favourites' ? favourites.value : jobs.value).filter(job => (!query || [job.title, job.company, job.location, job.description].some(value => value.toLocaleLowerCase().includes(query))) && matchesSchedule(parseJobSchedule(job.hours), { days: availableDays.value, start: availableStart.value, end: availableEnd.value, includeUnknown: includeUnknown.value }) && (!fitsTimetable.value || (canCompare.value && (fitStatus(job)==='clear' || (includeUnknown.value && fitStatus(job)==='unknown')))))
})

async function load(target = page.value) {
  if (loading.value) return
  loading.value = true; error.value = ''
  try {
    const data = await scheduleApi('student/jobs?page=' + target + '&q=' + encodeURIComponent(submittedSearch.value))
    jobs.value = data.jobs; page.value = data.page; total.value = data.total; pageSize.value = data.pageSize; fetchedAt.value = data.fetchedAt
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load jobs.' }
  finally { loading.value = false }
}
onMounted(() => { restoreFilters(); void load(); void loadFavourites(); void loadTimetable() })
</script>
<template>
  <section class="job-finder">
    <div class="job-heading"><div><h2>Find a job</h2><p>Recruitment listings from Seoul Open Data, including locations outside Seoul.</p></div><button type="button" class="secondary" :disabled="loading" @click="load()"><StudentIcon name="refresh" />Refresh</button></div>
    <p class="job-note">These are general listings. Check the location, closing date, qualifications, and working hours before applying.</p>
    <div class="job-tabs" role="group" aria-label="Job views"><button type="button" :aria-pressed="tab==='all'" :class="{secondary:tab!=='all'}" :disabled="loading" @click="tab='all'; load(1)">All jobs</button><button type="button" :aria-pressed="tab==='favourites'" :class="{secondary:tab!=='favourites'}" :disabled="loading" @click="tab='favourites'; loadFavourites()">Favourites ({{ favourites.length }})</button></div>
    <p v-if="tab==='favourites'" class="job-note">Saved copies of job details. Listings may have changed or closed; check with the employer before applying.</p>
    <p v-if="favouriteError" class="error" role="alert">{{ favouriteError }} <button type="button" class="secondary" @click="loadFavourites">Retry favourites</button></p>
    <form class="catalogue-search" @submit.prevent="submitSearch"><label class="job-search">Search jobs<div><StudentIcon name="search" /><input v-model="search" type="search" maxlength="100" placeholder="Company, job title, or location" aria-describedby="job-search-help"></div></label><button :disabled="loading">Search</button></form>
    <small id="job-search-help">Keyword search checks the provider catalogue (cached for 10 minutes). Availability filters apply to the returned page. The first search may take longer. Filters are remembered on this device for your account.</small>
    <fieldset class="schedule-filters"><legend>Your availability</legend>
      <p class="filter-help">Select the days you can work. A known schedule must fit entirely within your selected days and hours.</p>
      <div class="day-presets"><button type="button" class="secondary" @click="availableDays = [0,1,2,3,4]">Weekdays</button><button type="button" class="secondary" @click="availableDays = [5,6]">Weekends</button><button type="button" class="secondary" @click="availableDays = []">Any day</button></div>
      <div class="day-options"><label v-for="(day,index) in weekdays" :key="day"><input v-model="availableDays" type="checkbox" :value="index">{{ day }}</label></div>
      <div class="availability-hours"><label>Available from<input v-model="availableStart" type="time"></label><label>Available until<input v-model="availableEnd" type="time"></label></div>
      <p class="filter-help">Leave both times empty for any hours. An end time earlier than the start means overnight availability.</p>
      <p v-if="invalidTime" class="error" role="alert">Enter both times with different start and end times, or clear both.</p>
      <label class="unknown-toggle"><input v-model="includeUnknown" type="checkbox">Include listings with unknown days or hours</label>
      <p class="filter-help">Schedules are estimated from the employer's text. Unknown listings are not confirmed matches; check details with the employer.</p>
      <label>Compare with semester<select v-model.number="semester"><option :value="0">Choose a semester</option><option v-for="term in terms" :key="term.id" :value="term.id">{{term.name}} {{term.academic_year}}</option></select></label>
      <label class="unknown-toggle"><input v-model="fitsTimetable" type="checkbox" :disabled="!canCompare">Fits my timetable</label>
      <p v-if="timetableError" class="error" role="alert">{{timetableError}}</p><p v-else-if="!canCompare" class="filter-help">No saved classes for this semester. Timetable matching is unavailable.</p>
      <button type="button" class="secondary" @click="loadTimetable">Refresh timetable</button>
      <p class="filter-help">Comparison uses campus time and checks class overlaps, including overnight work. Travel time is not included. Unknown schedules are not confirmed fits.</p>
      <button type="button" class="secondary" :disabled="loading || (!filtersActive && includeUnknown)" @click="clearFilters">Clear filters</button>
    </fieldset>
    <p v-if="loading" role="status">{{submittedSearch ? 'Searching the provider catalogue… The first search may take longer.' : 'Loading job listings…'}}</p>
    <div v-if="error && tab==='all'"><p class="error" role="alert">{{ error }}</p><button type="button" :disabled="loading" @click="load()">Try again</button></div>
    <template v-else-if="!loading || tab==='favourites'">
      <p class="job-count" role="status">{{ visible.length }} shown · {{ tab==='favourites' ? favourites.length + ' saved jobs' : total.toLocaleString() + (submittedSearch ? ' keyword matches' : ' provider records') }}</p>
      <p v-if="!visible.length" class="job-empty">{{ tab==='favourites' && !favourites.length ? 'No favourites yet. Tap a heart on a job to save it.' : 'No matches. Adjust your filters or browse another page.' }}</p>
      <article v-for="job in visible" :key="job.id" class="job-card">
        <button type="button" class="favourite-heart" :aria-pressed="favouriteIds.has(job.id)" :aria-label="(favouriteIds.has(job.id) ? 'Remove favourite: ' : 'Save favourite: ') + job.title" :title="favouriteIds.has(job.id) ? 'Remove favourite' : 'Save favourite'" :disabled="saving.includes(job.id)" @click="toggleFavourite(job)"><svg viewBox="0 0 24 24" :fill="favouriteIds.has(job.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21 3 12C-2 5 7 0 12 6 17 0 26 5 21 12Z" /></svg></button>
        <p class="job-company">{{ job.company || 'Company not provided' }}</p><h3>{{ job.title || 'Job title not provided' }}</h3>
        <dl><div><dt>Location</dt><dd>{{ job.location || 'Not provided' }}</dd></div><div><dt>Pay</dt><dd>{{ job.salary || 'Not provided' }}</dd></div><div><dt>Experience</dt><dd>{{ job.career || 'Not provided' }}</dd></div><div><dt>Closing date</dt><dd>{{ job.closes || 'Check with employer' }}</dd></div></dl>
        <p v-if="job.savedAt" class="job-note">Saved {{new Date(job.savedAt).toLocaleDateString()}} · Confirm this listing is still open.</p>
        <p class="fit-label" :class="fitStatus(job)">{{ fitLabel(job) }}</p>
        <p class="schedule-label">{{ scheduleLabel(parseJobSchedule(job.hours)) }}</p>
        <div class="apply-actions"><a v-if="phoneLink(job.phone)" :href="phoneLink(job.phone)">Call employer</a><span>Apply through: {{job.application || 'Check with employer'}}</span></div>
        <details><summary>Job details and how to apply</summary>
          <p class="job-description">{{ job.description || 'Description not provided.' }}</p>
          <dl><div><dt>Work address</dt><dd>{{job.address || job.location || 'Not provided'}}</dd></div><div><dt>Working hours</dt><dd>{{ job.hours || 'Not provided' }}</dd></div><div><dt>Education</dt><dd>{{ job.education || 'Not provided' }}</dd></div><div><dt>Employment</dt><dd>{{ job.employment || 'Not provided' }}</dd></div><div><dt>Apply through</dt><dd>{{ job.application || 'Contact the employer' }}</dd></div><div><dt>Documents</dt><dd>{{ job.documents || 'Check with employer' }}</dd></div><div><dt>Contact phone</dt><dd>{{ job.phone || 'Not provided' }}</dd></div><div><dt>Posted</dt><dd>{{ job.posted || 'Not provided' }}</dd></div></dl>
          <p class="job-note">Follow the employer's application method above. StudentHub does not submit applications.</p>
        </details>
      </article>
    </template>
    <nav v-if="tab==='all'" class="job-pages" aria-label="Job pages"><button type="button" class="secondary" :disabled="loading || page <= 1" @click="load(page - 1)">Previous</button><span>Page {{ page }} of {{ pages }}</span><button type="button" class="secondary" :disabled="loading || page >= pages" @click="load(page + 1)">Next</button></nav>
    <p class="job-source">Source: <a href="https://data.seoul.go.kr/dataList/OA-13341/A/1/datasetView.do" target="_blank" rel="noopener noreferrer">Seoul Open Data — Job Portal recruitment information</a><span v-if="fetchedAt"> · Fetched {{ new Date(fetchedAt).toLocaleString() }}</span></p>
  </section>
</template>
<style scoped>
.job-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.catalogue-search button{width:auto}.schedule-filters select{display:block;width:100%;padding:12px;margin-top:8px;border:1px solid #c5d7ce;border-radius:8px;font:inherit}.favourite-heart{float:right;min-height:44px;min-width:44px;padding:10px;background:#f9eef0;color:#a32d50;margin-left:10px}.favourite-heart svg{width:24px;height:24px}.fit-label{font-size:13px;line-height:1.5}.fit-label.conflict{color:#a22f24}.fit-label.clear{color:#126653}.fit-label.unknown,.fit-label.unavailable{color:#60736e}.apply-actions{display:flex;align-items:center;flex-wrap:wrap;gap:12px;font-size:14px;line-height:1.6}.apply-actions a{display:inline-block;padding:12px;background:#126653;color:white;border-radius:8px;text-decoration:none}.schedule-filters{margin:22px 0;padding:16px;border:1px solid #c5d7ce;border-radius:12px;background:white}.schedule-filters legend{font-weight:700}.filter-help{font-size:13px;line-height:1.6;color:#60736e}.day-presets,.day-options{display:flex;flex-wrap:wrap;gap:8px}.day-presets button{padding:10px 12px;font-size:13px}.day-options label,.unknown-toggle{display:flex;gap:8px;align-items:center;margin:8px 0;min-height:44px}.day-options label{padding:6px 10px;border:1px solid #dce5df;border-radius:8px}.day-options input,.unknown-toggle input{width:18px;height:18px;flex-shrink:0}.availability-hours{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.availability-hours label{margin:12px 0}.availability-hours input{display:block;margin-top:6px}.schedule-label{font-size:13px;color:#36594d;background:#eef4f0;padding:10px;border-radius:8px;overflow-wrap:anywhere}.job-finder{color:#263b32}.job-heading{display:flex;justify-content:space-between;align-items:center;gap:16px}.job-heading h2{margin:0}.job-heading p,.job-note,.job-source,small{color:#60736e;font-size:14px;line-height:1.6}.job-heading button{flex-shrink:0}.job-note{padding:12px;background:#eef4f0;border-radius:8px}.job-search{margin:20px 0 6px}.job-search>div{display:flex;align-items:center;gap:10px;margin-top:8px}.job-search svg{width:22px;height:22px;flex-shrink:0}.job-search input{min-width:0}.job-count{font-size:14px}.job-card{background:white;border:1px solid #dce5df;border-radius:12px;padding:20px;margin:14px 0}.job-company{color:#126653;font-weight:600;margin:0 0 8px}.job-card h3{font-size:18px;line-height:1.5}dl{margin:12px 0}dl>div{display:grid;grid-template-columns:115px minmax(0,1fr);gap:12px;padding:6px 0;font-size:14px;line-height:1.6}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}summary{cursor:pointer;color:#126653;font-weight:600;padding:12px 0;min-height:44px}.job-description{white-space:pre-wrap;line-height:1.7;font-size:14px;overflow-wrap:anywhere}.job-pages{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:24px}.job-pages span{font-size:14px}.job-source a{color:#126653}.job-source{overflow-wrap:anywhere}.job-empty{padding:24px;background:white;border-radius:12px}@media(max-width:600px){.job-heading{flex-wrap:wrap}.job-card{padding:16px}dl>div{grid-template-columns:90px minmax(0,1fr)}.job-pages button{padding:12px}.job-pages span{text-align:center}}
</style>
