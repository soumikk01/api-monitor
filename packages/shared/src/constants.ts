// ── App URLs (resolved at runtime from env vars or local defaults) ────────────
export const BACKEND_URL  = process.env.NEXT_PUBLIC_API_URL  ?? 'http://localhost:4000/api/v1';
export const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3001';
export const APP_URL      = process.env.NEXT_PUBLIC_APP_URL  ?? 'http://localhost:3000';

// ── sessionStorage token keys ─────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;
