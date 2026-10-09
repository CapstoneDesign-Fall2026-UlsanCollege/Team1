<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { scheduleApi } from '../schedules'
import { weekdays, parseJobSchedule, matchesSchedule, scheduleLabel } from '../job-schedules'
import StudentIcon from './StudentIcon.vue'
type Job = { id: string; company: string; title: string; location: string; salary: string; career: string; education: string; employment: string; posted: string; closes: string; description: string; hours: string; application: string; documents: string; phone: string }
const jobs = ref<Job[]>([]), page = ref(1), total = ref(0), pageSize = ref(30), fetchedAt = ref('')
const loading = ref(false), error = ref(''), search = ref('')
const availableDays = ref<number[]>([]), availableStart = ref(''), availableEnd = ref(''), includeUnknown = ref(true)
const invalidTime = computed(() => (!!availableStart.value !== !!availableEnd.value) || (!!availableStart.value && availableStart.value === availableEnd.value))
const filtersActive = computed(() => !!search.value.trim() || !!availableDays.value.length || !!availableStart.value || !!availableEnd.value)
function clearFilters() { search.value = ''; availableDays.value = []; availableStart.value = ''; availableEnd.value = ''; includeUnknown.value = true }
const pages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const visible = computed(() => {
  if (invalidTime.value) return []
  const query = search.value.trim().toLocaleLowerCase()
  return jobs.value.filter(job => (!query || [job.title, job.company, job.location, job.description].some(value => value.toLocaleLowerCase().includes(query))) && matchesSchedule(parseJobSchedule(job.hours), { days: availableDays.value, start: availableStart.value, end: availableEnd.value, includeUnknown: includeUnknown.value }))
})

async function load(target = page.value) {
  if (loading.value) return
  loading.value = true; error.value = ''
  try {
    const data = await scheduleApi('student/jobs?page=' + target)
    jobs.value = data.jobs; page.value = data.page; total.value = data.total; pageSize.value = data.pageSize; fetchedAt.value = data.fetchedAt
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load jobs.' }
  finally { loading.value = false }
}
onMounted(() => { void load() })
</script>
<template>
  <section class="job-finder">
    <div class="job-heading"><div><h2>Find a job</h2><p>Recruitment listings from Seoul Open Data, including locations outside Seoul.</p></div><button type="button" class="secondary" :disabled="loading" @click="load()"><StudentIcon name="refresh" />Refresh</button></div>
    <p class="job-note">These are general listings. Check the location, closing date, qualifications, and working hours before applying.</p>
    <label class="job-search">Search this page<div><StudentIcon name="search" /><input v-model="search" type="search" maxlength="100" placeholder="Company, job title, or location" aria-describedby="job-search-help"></div></label>
    <small id="job-search-help">Search and schedule filters apply to this page only. Use Next to browse more jobs.</small>
    <fieldset class="schedule-filters"><legend>Your availability</legend>
      <p class="filter-help">Select the days you can work. A known schedule must fit entirely within your selected days and hours.</p>
      <div class="day-presets"><button type="button" class="secondary" @click="availableDays = [0,1,2,3,4]">Weekdays</button><button type="button" class="secondary" @click="availableDays = [5,6]">Weekends</button><button type="button" class="secondary" @click="availableDays = []">Any day</button></div>
      <div class="day-options"><label v-for="(day,index) in weekdays" :key="day"><input v-model="availableDays" type="checkbox" :value="index">{{ day }}</label></div>
      <div class="availability-hours"><label>Available from<input v-model="availableStart" type="time"></label><label>Available until<input v-model="availableEnd" type="time"></label></div>
      <p class="filter-help">Leave both times empty for any hours. An end time earlier than the start means overnight availability.</p>
      <p v-if="invalidTime" class="error" role="alert">Enter both times with different start and end times, or clear both.</p>
      <label class="unknown-toggle"><input v-model="includeUnknown" type="checkbox">Include listings with unknown days or hours</label>
      <p class="filter-help">Schedules are estimated from the employer's text. Unknown listings are not confirmed matches; check details with the employer.</p>
      <button type="button" class="secondary" :disabled="!filtersActive && includeUnknown" @click="clearFilters">Clear filters</button>
    </fieldset>
    <p v-if="loading" role="status">Loading job listings…</p>
    <div v-if="error"><p class="error" role="alert">{{ error }}</p><button type="button" :disabled="loading" @click="load()">Try again</button></div>
    <template v-else-if="!loading">
      <p class="job-count" role="status">{{ visible.length }} shown on page {{ page }} · {{ total.toLocaleString() }} provider records</p>
      <p v-if="!visible.length" class="job-empty">{{ filtersActive ? 'No matches on this page. Adjust your filters or browse the next page.' : 'No job listings returned for this page.' }}</p>
      <article v-for="job in visible" :key="job.id" class="job-card">
        <p class="job-company">{{ job.company || 'Company not provided' }}</p><h3>{{ job.title || 'Job title not provided' }}</h3>
        <dl><div><dt>Location</dt><dd>{{ job.location || 'Not provided' }}</dd></div><div><dt>Pay</dt><dd>{{ job.salary || 'Not provided' }}</dd></div><div><dt>Experience</dt><dd>{{ job.career || 'Not provided' }}</dd></div><div><dt>Closing date</dt><dd>{{ job.closes || 'Check with employer' }}</dd></div></dl>
        <p class="schedule-label">{{ scheduleLabel(parseJobSchedule(job.hours)) }}</p>
        <details><summary>Job details and how to apply</summary>
          <p class="job-description">{{ job.description || 'Description not provided.' }}</p>
          <dl><div><dt>Working hours</dt><dd>{{ job.hours || 'Not provided' }}</dd></div><div><dt>Education</dt><dd>{{ job.education || 'Not provided' }}</dd></div><div><dt>Employment</dt><dd>{{ job.employment || 'Not provided' }}</dd></div><div><dt>Apply through</dt><dd>{{ job.application || 'Contact the employer' }}</dd></div><div><dt>Documents</dt><dd>{{ job.documents || 'Check with employer' }}</dd></div><div><dt>Contact phone</dt><dd>{{ job.phone || 'Not provided' }}</dd></div><div><dt>Posted</dt><dd>{{ job.posted || 'Not provided' }}</dd></div></dl>
          <p class="job-note">Follow the employer's application method above. StudentHub does not submit applications.</p>
        </details>
      </article>
    </template>
    <nav class="job-pages" aria-label="Job pages"><button type="button" class="secondary" :disabled="loading || page <= 1" @click="load(page - 1)">Previous</button><span>Page {{ page }} of {{ pages }}</span><button type="button" class="secondary" :disabled="loading || page >= pages" @click="load(page + 1)">Next</button></nav>
    <p class="job-source">Source: <a href="https://data.seoul.go.kr/dataList/OA-13341/A/1/datasetView.do" target="_blank" rel="noopener noreferrer">Seoul Open Data — Job Portal recruitment information</a><span v-if="fetchedAt"> · Fetched {{ new Date(fetchedAt).toLocaleString() }}</span></p>
  </section>
</template>
<style scoped>
.schedule-filters{margin:22px 0;padding:16px;border:1px solid #c5d7ce;border-radius:12px;background:white}.schedule-filters legend{font-weight:700}.filter-help{font-size:13px;line-height:1.6;color:#60736e}.day-presets,.day-options{display:flex;flex-wrap:wrap;gap:8px}.day-presets button{padding:10px 12px;font-size:13px}.day-options label,.unknown-toggle{display:flex;gap:8px;align-items:center;margin:8px 0;min-height:44px}.day-options label{padding:6px 10px;border:1px solid #dce5df;border-radius:8px}.day-options input,.unknown-toggle input{width:18px;height:18px;flex-shrink:0}.availability-hours{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.availability-hours label{margin:12px 0}.availability-hours input{display:block;margin-top:6px}.schedule-label{font-size:13px;color:#36594d;background:#eef4f0;padding:10px;border-radius:8px;overflow-wrap:anywhere}.job-finder{color:#263b32}.job-heading{display:flex;justify-content:space-between;align-items:center;gap:16px}.job-heading h2{margin:0}.job-heading p,.job-note,.job-source,small{color:#60736e;font-size:14px;line-height:1.6}.job-heading button{flex-shrink:0}.job-note{padding:12px;background:#eef4f0;border-radius:8px}.job-search{margin:20px 0 6px}.job-search>div{display:flex;align-items:center;gap:10px;margin-top:8px}.job-search svg{width:22px;height:22px;flex-shrink:0}.job-search input{min-width:0}.job-count{font-size:14px}.job-card{background:white;border:1px solid #dce5df;border-radius:12px;padding:20px;margin:14px 0}.job-company{color:#126653;font-weight:600;margin:0 0 8px}.job-card h3{font-size:18px;line-height:1.5}dl{margin:12px 0}dl>div{display:grid;grid-template-columns:115px minmax(0,1fr);gap:12px;padding:6px 0;font-size:14px;line-height:1.6}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}summary{cursor:pointer;color:#126653;font-weight:600;padding:12px 0;min-height:44px}.job-description{white-space:pre-wrap;line-height:1.7;font-size:14px;overflow-wrap:anywhere}.job-pages{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:24px}.job-pages span{font-size:14px}.job-source a{color:#126653}.job-source{overflow-wrap:anywhere}.job-empty{padding:24px;background:white;border-radius:12px}@media(max-width:600px){.job-heading{flex-wrap:wrap}.job-card{padding:16px}dl>div{grid-template-columns:90px minmax(0,1fr)}.job-pages button{padding:12px}.job-pages span{text-align:center}}
</style>
