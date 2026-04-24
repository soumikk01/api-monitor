/**
 * fetchWithAuth — industry-level authenticated fetch wrapper
 *
 * Uses sessionStorage for tokens so each browser tab has its own session.
 * Opening a new tab always requires fresh login — tokens are NOT shared across tabs.
 *
 * Strategy:
 *  1. Attempt the request with the current access token.
 *  2. On 401 → try to mint a new access token using the refresh token.
 *  3. Retry the original request once with the new access token.
 *  4. If refresh also fails → clear session and redirect to /login.
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

// Singleton refresh promise — prevents concurrent refresh storms
let refreshingPromise: Promise<string | null> | null = null;

// ── Storage helpers (sessionStorage = per-tab, not shared between tabs) ──
export const authStorage = {
  getAccessToken: () => sessionStorage.getItem('access_token'),
  getRefreshToken: () => sessionStorage.getItem('refresh_token'),
  setAccessToken: (t: string) => sessionStorage.setItem('access_token', t),
  setRefreshToken: (t: string) => sessionStorage.setItem('refresh_token', t),
  clear: () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    // Clear all localStorage state so next user gets a clean session
    localStorage.removeItem('activeProjectId');
    localStorage.removeItem('userAvatarIndex');
  },
};

async function tryRefresh(): Promise<string | null> {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json() as {
        accessToken?: string;
        refreshToken?: string;
      };

      if (!data.accessToken) return null;

      authStorage.setAccessToken(data.accessToken);
      if (data.refreshToken) authStorage.setRefreshToken(data.refreshToken);

      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

function clearSession() {
  authStorage.clear();
  // AuthGuard detects user = null and calls router.replace('/login') — no hard reload needed
}

/**
 * Drop-in replacement for `fetch` that:
 * - Injects `Authorization: Bearer <token>` automatically
 * - Refreshes the access token on 401 and retries once
 * - Signs the user out if refresh also fails
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = authStorage.getAccessToken();

  const makeRequest = (token: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let response = await makeRequest(accessToken);

  if (response.status !== 401) return response;

  // ── 401 received — try to refresh ──────────────────────────────────────
  const newToken = await tryRefresh();

  if (!newToken) {
    clearSession();
    return response;
  }

  response = await makeRequest(newToken);

  if (response.status === 401) {
    clearSession();
  }

  return response;
}

/**
 * Silently refresh the access token on app boot if it has expired.
 * Returns the valid access token or null if the session is dead.
 */
export async function ensureValidToken(): Promise<string | null> {
  const token = authStorage.getAccessToken();
  if (!token) return null;

  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) return token;

  if (res.status === 401) {
    return tryRefresh();
  }

  return null;
}
