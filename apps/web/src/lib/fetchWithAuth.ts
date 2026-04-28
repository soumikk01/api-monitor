/**
 * fetchWithAuth — production-hardened authenticated fetch wrapper
 *
 * Storage strategy (Supabase-style):
 *   accessToken  → localStorage  (survives page refresh)
 *   refreshToken → localStorage  (long-lived, rotated on every use)
 *
 * Key behaviors:
 *  - Singleton refresh deduplication: only ONE /auth/refresh call at a time
 *  - Transient errors (5xx/429/network) → session preserved, not cleared
 *  - Definitive 401/400 on refresh → session cleared (truly expired/revoked)
 *  - New tokens from auth app arrive via URL ?at=&rt= on login redirect
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

// ── Storage helpers ────────────────────────────────────────────────────────
export const authStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },
  setAccessToken: (t: string): void => {
    if (typeof window !== 'undefined') localStorage.setItem('access_token', t);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },
  setRefreshToken: (t: string): void => {
    if (typeof window !== 'undefined') localStorage.setItem('refresh_token', t);
  },

  /** Wipe ALL auth state — called on logout or definitive token failure */
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('activeProjectId');
    localStorage.removeItem('userAvatarIndex');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  },

  /** True only if we have at least one token (can attempt session restore) */
  hasSession: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!(localStorage.getItem('access_token') || localStorage.getItem('refresh_token'));
  },
};

// ── Singleton refresh ──────────────────────────────────────────────────────
// One in-flight refresh shared across all concurrent callers.
let _refreshPromise: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const rt = authStorage.getRefreshToken();
    if (!rt) return null;

    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
      });

      // 401 / 400 = token definitively invalid → must re-login
      if (res.status === 401 || res.status === 400) {
        authStorage.clear();
        return null;
      }

      // 429 / 5xx = transient → throw so callers DON'T clear the session
      if (!res.ok) throw new Error(`refresh_${res.status}`);

      const data = await res.json() as { accessToken?: string; refreshToken?: string };
      if (!data.accessToken) { authStorage.clear(); return null; }

      authStorage.setAccessToken(data.accessToken);
      if (data.refreshToken) authStorage.setRefreshToken(data.refreshToken);

      return data.accessToken;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

/**
 * Drop-in replacement for fetch():
 *  1. Proactively refreshes token if it expires in < 5 min
 *  2. Attaches Bearer token from localStorage
 *  3. On 401 → silently refreshes and retries ONCE
 *  4. Transient errors → session preserved
 *  5. Definitive failure → session cleared
 */

/** Parse JWT expiry without a library */
function getTokenExpiresInMs(token: string | null): number {
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return Infinity;
    return payload.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // ── Proactive refresh: if token expires in < 5 min, refresh now ──────────
  const currentToken = authStorage.getAccessToken();
  const expiresIn = getTokenExpiresInMs(currentToken);
  if (expiresIn > 0 && expiresIn < 5 * 60 * 1000) {
    try { await tryRefresh(); } catch { /* ignore transient errors */ }
  }

  const makeReq = (token: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let res = await makeReq(authStorage.getAccessToken());
  if (res.status !== 401) return res;

  // ── Silent refresh ────────────────────────────────────────────────────
  try {
    const newToken = await tryRefresh();
    if (!newToken) return res; // cleared already

    res = await makeReq(newToken);
    if (res.status === 401) authStorage.clear(); // still failing → hard logout
  } catch {
    // Transient (429, 5xx, offline) — preserve session, return original 401
    console.warn('[fetchWithAuth] Transient refresh error, session preserved');
  }

  return res;
}
