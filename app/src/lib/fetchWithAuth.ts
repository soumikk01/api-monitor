/**
 * fetchWithAuth — industry-level authenticated fetch wrapper
 *
 * Strategy:
 *  1. Attempt the request with the current access token.
 *  2. On 401 → try to mint a new access token using the refresh token.
 *  3. Retry the original request once with the new access token.
 *  4. If refresh also fails → clear session and redirect to /login.
 *
 * A single in-flight refresh promise is shared across concurrent requests
 * so we never call /auth/refresh multiple times in parallel (token rotation safe).
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

// Singleton refresh promise — prevents concurrent refresh storms
let refreshingPromise: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    const refreshToken = localStorage.getItem('refresh_token');
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

      // Store the new tokens
      localStorage.setItem('access_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }

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
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('activeProjectId');
  // Redirect to login — works in both client and during effects
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
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
  const accessToken = localStorage.getItem('access_token');

  const makeRequest = (token: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // First attempt
  let response = await makeRequest(accessToken);

  if (response.status !== 401) return response;

  // ── 401 received — try to refresh ──────────────────────────────────────
  const newToken = await tryRefresh();

  if (!newToken) {
    // Refresh failed → sign out
    clearSession();
    return response; // return the 401 response so callers don't throw
  }

  // Retry with fresh token
  response = await makeRequest(newToken);

  if (response.status === 401) {
    // Even after refresh we still get 401 → clear session
    clearSession();
  }

  return response;
}

/**
 * Convenience: silently refresh the access token on app boot if it has expired.
 * Call this once in useAuth's initialization effect.
 * Returns the valid access token or null if the session is dead.
 */
export async function ensureValidToken(): Promise<string | null> {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  // Quick validation — if /users/me succeeds, token is still valid
  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) return token;

  if (res.status === 401) {
    // Try refresh before giving up
    return tryRefresh();
  }

  return null;
}
