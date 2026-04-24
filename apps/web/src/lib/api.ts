const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
