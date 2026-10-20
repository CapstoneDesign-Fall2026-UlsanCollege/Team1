import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import * as vue from 'vue';

const component = readFileSync(new URL('../src/components/JobFinder.vue', import.meta.url), 'utf8');
const source = component.split('<script setup lang="ts">')[1].split('</script>')[0].replace(/^import .*$/gm, '');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const parserSource = readFileSync(new URL('../src/job-schedules.ts', import.meta.url), 'utf8');
const parserJs = ts.transpileModule(parserSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const schedules = await import('data:text/javascript;base64,' + Buffer.from(parserJs).toString('base64'));
const job = { id:'one', title:'Developer', company:'Example', location:'Seoul', description:'', hours:'', phone:'' };
const page = jobs => ({ jobs, page:1, pageSize:30, total:60, fetchedAt:'' });
function mount(api, stored = {}) {
 const scope = vue.effectScope();
 const names = ['computed','ref','watch','onMounted','defineProps','localStorage','scheduleApi',...Object.keys(schedules)];
 const values = [vue.computed,vue.ref,vue.watch,()=>{},()=>({loginId:'test'}),{getItem:()=>JSON.stringify(stored),setItem:()=>{}},api,...Object.values(schedules)];
 const factory = new Function(...names, js + '\nreturn {search,submittedSearch,restoreFilters,submitSearch,switchTab,clearFilters,refreshJobs,availableDays,availableStart,availableEnd,includeUnknown,favourites,visible,jobs,load,loading,total,page};');
 return { state:scope.run(()=>factory(...values)), stop:()=>scope.stop() };
}
test('old stored keyword is ignored and clearing the input reloads unfiltered jobs',async()=>{
 const calls=[];
 const app=mount(async path=>{calls.push(path);return page([job]);},{search:'old keyword'});
 try {
  const s=app.state;s.restoreFilters();assert.equal(s.search.value,'');assert.equal(s.submittedSearch.value,'');
  s.search.value='Developer';await s.submitSearch();assert.match(calls.at(-1),/q=Developer$/);
  s.search.value='';await vue.nextTick();await Promise.resolve();
  assert.equal(s.submittedSearch.value,'');assert.match(calls.at(-1),/page=1&q=$/);
 } finally {app.stop();}
});
test('Refresh clears a submitted keyword and availability and returns to the full first page',async()=>{
 const calls=[]; const app=mount(async path=>{calls.push(path);return page([job]);});
 try {
  const s=app.state;s.search.value='Developer';await s.submitSearch();
  s.availableDays.value=[5,6];s.availableStart.value='09:00';s.availableEnd.value='15:00';s.includeUnknown.value=false;s.page.value=3;
  s.refreshJobs();await vue.nextTick();await Promise.resolve();
  assert.equal(s.search.value,'');assert.equal(s.submittedSearch.value,'');assert.deepEqual(s.availableDays.value,[]);
  assert.equal(s.availableStart.value,'');assert.equal(s.availableEnd.value,'');assert.equal(s.includeUnknown.value,true);
  assert.equal(calls.at(-1),'student/jobs?page=1&q=');assert.equal(s.page.value,1);assert.equal(s.total.value,60);
 } finally { app.stop(); }
});
test('favourites show saved details without the catalogue keyword or availability restrictions',async()=>{
 const app=mount(async()=>({jobs:[job]}));
 try {
  const s=app.state;s.search.value='unrelated';s.submittedSearch.value='unrelated';
  s.availableStart.value='09:00';s.availableEnd.value='';s.includeUnknown.value=false;
  s.switchTab('favourites');await vue.nextTick();await Promise.resolve();
  assert.equal(s.search.value,'');assert.equal(s.visible.value.length,1);assert.equal(s.visible.value[0].title,'Developer');
 } finally {app.stop();}
});
test('a late keyword response cannot replace a cleared search or its page count',async()=>{
 const requests=[];const app=mount(path=>new Promise(resolve=>requests.push({path,resolve})));
 try {
  const s=app.state;s.submittedSearch.value='old';const old=s.load(1);
  s.clearFilters();assert.equal(requests.length,2);
  requests[1].resolve(page([job]));await vue.nextTick();await Promise.resolve();
  requests[0].resolve({...page([]),total:1});await old;
  assert.equal(s.jobs.value[0].title,'Developer');assert.equal(s.total.value,60);assert.equal(s.loading.value,false);
 } finally {app.stop();}
});
