const apiOrigin = import.meta.env.VITE_API_ORIGIN?.replace(/\/$/, '') ?? ''

export function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(apiOrigin + path, { ...options, credentials: 'include' })
}
