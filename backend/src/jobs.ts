import express from 'express';
import { createHash } from 'node:crypto';

export type Job = {
  id: string; company: string; title: string; location: string; salary: string;
  career: string; education: string; employment: string; posted: string; closes: string;
  description: string; address: string; hours: string; application: string; documents: string; phone: string;
};
export type JobPage = { jobs: Job[]; total: number; page: number; pageSize: number; fetchedAt: string };
export type JobService = (page: number, query?: string) => Promise<JobPage>;
export function jobId(job: Pick<Job, 'company' | 'title' | 'location' | 'posted' | 'closes' | 'address'>) { return createHash('sha256').update(JSON.stringify([job.company,job.title,job.location,job.posted,job.closes,job.address])).digest('hex'); }
const size = 30;
const text = (row: Record<string, unknown>, field: string) => typeof row[field] === 'string' ? row[field].trim().slice(0, 12000) : '';
export function createSeoulJobs(key: () => string | undefined = () => process.env.SEOUL_API_KEY, request: typeof fetch = fetch): JobService {
  const cache = new Map<number, { expires: number; data: JobPage }>();
  const pending = new Map<number, Promise<JobPage>>();
  let catalogue: { jobs: Job[]; expires: number; fetchedAt: string } | undefined;
  let building: Promise<{ jobs: Job[]; expires: number; fetchedAt: string }> | undefined;
  let retryAfter = 0;
  async function allJobs() {
    if (catalogue && catalogue.expires > Date.now()) return catalogue;
    if (building) return building;
    if (Date.now() < retryAfter) throw new Error('Job search is temporarily unavailable. Try again in a minute.');
    building = (async () => {
      const first = await fetchPage(1,1000);
      if(first.total > 100000) throw new Error('catalogue too large');
      const batches: Job[][] = [first.jobs]; const count = Math.ceil(first.total / 1000);
      let next = 2;
      await Promise.all(Array.from({length:3}, async () => { while(next <= count) { const page = next++; const result = await fetchPage(page,1000); if (!result.jobs.length) throw new Error('catalogue changed'); batches[page-1]=result.jobs; } }));
      const jobs = [...new Map(batches.flat().map(job=>[job.id,job])).values()];
      return { jobs, expires: Date.now() + 10 * 60000, fetchedAt: new Date().toISOString() };
    })();
    try { catalogue = await building; return catalogue; }
    catch { retryAfter = Date.now() + 60000; throw new Error('Job search could not load the full catalogue. Try again in a minute.'); }
    finally { building = undefined; }
  }
  async function fetchPage(page: number, limit: number): Promise<JobPage> {
    const apiKey = key()?.trim();
    if (!apiKey || apiKey === 'sample') throw new Error('Job listings are not configured yet. Please contact your administrator.');
    const first = (page - 1) * limit + 1;
    try {
      const response = await request(`http://openapi.seoul.go.kr:8088/${encodeURIComponent(apiKey)}/json/recMntList/${first}/${first + limit - 1}/`, { signal: AbortSignal.timeout(10000), redirect: 'error' });
      if (!response.ok) throw new Error('upstream');
      const payload = await response.json(); const source = payload.recMntList;
      const code = source?.RESULT?.CODE ?? payload.RESULT?.CODE;
      if (code === 'INFO-200') return { jobs: [], total: 0, page, pageSize: limit, fetchedAt: new Date().toISOString() };
      if (code !== 'INFO-000' || !Array.isArray(source?.row) || !Number.isSafeInteger(Number(source.list_total_count)) || Number(source.list_total_count) < 0) throw new Error('upstream');
      const jobs: Job[] = source.row.filter((row: unknown) => row && typeof row === 'object').map((row: Record<string, unknown>) => {
        const job: Job = { id: '', company: text(row,'COMPANY'), title: text(row,'TITLE'), location: text(row,'REGION'),
          salary: text(row,'SAL_TP_NM'), career: text(row,'CAREER'), education: text(row,'MIN_EDUBG'), employment: text(row,'EMP_TP_NM'),
          posted: text(row,'REG_DT'), closes: text(row,'CLOSE_DT'), description: text(row,'JOB_CONT'), address: text(row,'WORK_REGION'), hours: text(row,'WORKDAY_WORKHR_CONT'),
          application: text(row,'RCPT_MTHD'), documents: text(row,'SUBMIT_DOC'), phone: text(row,'CONTACT_TELNO') };
        job.id = jobId(job); return job;
      });
      return { jobs: [...new Map(jobs.map(job=>[job.id,job])).values()], total: Number(source.list_total_count), page, pageSize: limit, fetchedAt: new Date().toISOString() };
    } catch { throw new Error('The job provider is unavailable or the API key needs checking. Please try again later.'); }
  }
  return async (page, query) => {
    if (query) {
      const data = await allJobs(); const normalized = query.toLocaleLowerCase();
      const matches = data.jobs.filter(job => [job.company,job.title,job.location,job.description].some(value => value.toLocaleLowerCase().includes(normalized)));
      return { jobs: matches.slice((page-1)*size,page*size), total: matches.length, page, pageSize:size, fetchedAt:data.fetchedAt };
    }
    const apiKey = key()?.trim();
    if (!apiKey || apiKey === 'sample') throw new Error('Job listings are not configured yet. Please contact your administrator.');
    const cached = cache.get(page);
    if (cached && cached.expires > Date.now()) return cached.data;
    const current = pending.get(page); if (current) return current;
    const load = fetchPage(page,size).then(data => {
      cache.delete(page); if (cache.size >= 20) cache.delete(cache.keys().next().value!);
      cache.set(page, { expires: Date.now() + 5 * 60000, data }); return data;
    });
    pending.set(page, load);
    try { return await load; } finally { pending.delete(page); }
  };
}
export function jobsRouter(service: JobService) {
  const router = express.Router();
  router.get('/student/jobs', async (req, res) => {
    if (res.locals.user.role !== 'student') { res.status(403).json({ message: 'Student accounts only.' }); return; }
    const value = req.query.page ?? '1';
    if (typeof value !== 'string' || !/^[1-9]\d{0,3}$/.test(value)) { res.status(400).json({ message: 'Choose a valid job page.' }); return; }
    const query = req.query.q ?? '';
    if (typeof query !== 'string' || query.length > 100) { res.status(400).json({ message: 'Search text must be at most 100 characters.' }); return; }
    try { res.json(await service(Number(value),query.trim())); }
    catch (error) { res.status(503).json({ message: error instanceof Error ? error.message : 'Unable to load jobs.' }); }
  });
  return router;
}
