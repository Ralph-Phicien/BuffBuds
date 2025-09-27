// Set in netlify env not for dev, so default to empty string
const API_BASE = import.meta.env?.VITE_API_BASE_URL || ''; 

// API request function
export async function apiRequest(path, method = 'GET', body) {

  const url = `${API_BASE}${path}`;

  // headers and credentials for cookies
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text.slice(0,200)}`);
  }
  if (!ct.includes('application/json')) {
    throw new Error(`Expected JSON but got ${ct}. First bytes: ${text.slice(0,120)}`);
  }
  return JSON.parse(text);
}
