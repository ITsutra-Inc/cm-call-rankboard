export async function fetchCallLog(dateFrom, dateTo) {
  const params = new URLSearchParams({ dateFrom, dateTo });
  const res = await fetch(`/api/call-log?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.details || `API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchExtensions() {
  const res = await fetch('/api/extensions');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.details || `API error: ${res.status}`);
  }
  return res.json();
}
