import express from 'express';

export type Job = {
  id: string; company: string; title: string; location: string; salary: string;
  career: string; education: string; employment: string; posted: string; closes: string;
  description: string; hours: string; application: string; documents: string; phone: string;
};
export type JobPage = { jobs: Job[]; total: number; page: number; pageSize: number; fetchedAt: string };
export type JobService = (page: number) => Promise<JobPage>;
const size = 30;
const text = (row: Record<string, unknown>, field: string) => typeof row[field] === 'string' ? row[field].trim().slice(0, 12000) : '';
export function createSeoulJobs(key: () => string | undefined = () => process.env.SEOUL_API_KEY, request: typeof fetch = fetch): JobService {
  const cache = new Map<number, { expires: number; data: JobPage }>();
  const pending = new Map<number, Promise<JobPage>>();
  return async (page) => {
    const apiKey = key()?.trim();
    if (!apiKey || apiKey === 'sample') throw new Error('Job listings are not configured yet. Please contact your administrator.');
    const cached = cache.get(page);
    if (cached && cached.expires > Date.now()) return cached.data;
    const current = pending.get(page); if (current) return current;
    const load = (async () => {
      try {
        const first = (page - 1) * size + 1;
        const response = await request(`http://openapi.seoul.go.kr:8088/${encodeURIComponent(apiKey)}/json/recMntList/${first}/${first + size - 1}/`, { signal: AbortSignal.timeout(10000), redirect: 'error' });
        if (!response.ok) throw new Error('upstream');
        const payload = await response.json();
        const source = payload.recMntList;
        const code = source?.RESULT?.CODE ?? payload.RESULT?.CODE;
        if (code === 'INFO-200') return { jobs: [], total: 0, page, pageSize: size, fetchedAt: new Date().toISOString() };
        if (code !== 'INFO-000' || !Array.isArray(source?.row) || !Number.isSafeInteger(Number(source.list_total_count)) || Number(source.list_total_count) < 0) throw new Error('upstream');
        const data: JobPage = {
          page, pageSize: size, total: Number(source.list_total_count), fetchedAt: new Date().toISOString(),
          jobs: source.row.filter((row: unknown) => row && typeof row === 'object').map((row: Record<string, unknown>, index: number) => ({
            id: String(first + index), company: text(row,'COMPANY'), title: text(row,'TITLE'), location: text(row,'REGION'),
            salary: text(row,'SAL_TP_NM'), career: text(row,'CAREER'), education: text(row,'MIN_EDUBG'), employment: text(row,'EMP_TP_NM'),
            posted: text(row,'REG_DT'), closes: text(row,'CLOSE_DT'), description: text(row,'JOB_CONT'), hours: text(row,'WORKDAY_WORKHR_CONT'),
            application: text(row,'RCPT_MTHD'), documents: text(row,'SUBMIT_DOC'), phone: text(row,'CONTACT_TELNO'),
          })),
        };
        cache.delete(page); if (cache.size >= 20) cache.delete(cache.keys().next().value!);
        cache.set(page, { expires: Date.now() + 5 * 60000, data }); return data;
      } catch { throw new Error('The job provider is unavailable or the API key needs checking. Please try again later.'); }
    })();
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
    try { res.json(await service(Number(value))); }
    catch (error) { res.status(503).json({ message: error instanceof Error ? error.message : 'Unable to load jobs.' }); }
  });
  return router;
}
