import {fetchWithReadDeadline} from './safe-read'
const apiOrigin = import.meta.env.VITE_API_ORIGIN?.replace(/\/$/, '') ?? ''

export function apiFetch(path: string, options: RequestInit = {}) {
  return fetchWithReadDeadline(fetch, apiOrigin + path, { ...options, credentials: 'include' })
}
