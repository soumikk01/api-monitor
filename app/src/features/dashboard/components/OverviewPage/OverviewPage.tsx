'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMonitorSocket, ApiCallEvent } from '@/features/monitor/hooks/useMonitorSocket';
import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from './OverviewPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/* ── Spring Blossom Background ── */
const SpringBackground = () => null;

interface DbStats {
  total: number;
  errors: number;
  errorRate: number;
  avgLatency: number;
  successRate: number;
  activeInstances: number;
}

interface DbCall {
  id: string;
  method: string;
  url: string;
  path: string;
  host: string;
  statusCode: number | null;
  latency: number;
  status: string;
  createdAt: string;
}

export default function OverviewPage() {
  const [dark, setDark] = useState(false);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');

  // DB-sourced state
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [dbCalls, setDbCalls] = useState<DbCall[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // ── Resolve active project from URL or first project ──
  useEffect(() => {
    const paramId = searchParams.get('projectId');
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;

    void (async () => {
      if (paramId) {
        const r = await fetch(`${API}/projects/${paramId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (r.ok) {
          const p = await r.json() as { id: string; name: string };
          setProjectId(p.id);
          setProjectName(p.name);
          localStorage.setItem('activeProjectId', p.id);
        } else {
          setProjectId(paramId);
        }
      } else {
        const r = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) return;
        const projects = await r.json() as { id: string; name: string }[];
        const saved = localStorage.getItem('activeProjectId');
        const active = projects.find(p => p.id === saved) ?? projects[0];
        if (active) {
          setProjectId(active.id);
          setProjectName(active.name);
          localStorage.setItem('activeProjectId', active.id);
        }
      }
    })();
  }, [user, searchParams]);

  // ── Fetch real DB stats + recent call history when projectId is known ──
  const fetchDashboard = useCallback(async () => {
    if (!projectId) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setStatsLoading(true);
    try {
      const [statsRes, callsRes] = await Promise.all([
        fetch(`${API}/projects/${projectId}/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/projects/${projectId}/calls?limit=50`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (statsRes.ok) setDbStats(await statsRes.json() as DbStats);
      if (callsRes.ok) setDbCalls(await callsRes.json() as DbCall[]);
    } catch { /* ignore */ }
    finally { setStatsLoading(false); }
  }, [projectId]);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  // ── Real-time WebSocket feed ──
  const { connected: isConnected, events: liveEvents } = useMonitorSocket({ projectId });

  // Merge live WebSocket events on top of the DB-seeded list (dedup by id)
  const mergedCalls: (DbCall | ApiCallEvent)[] = [
    ...liveEvents,
    ...dbCalls.filter(db =>
      !liveEvents.some((live: ApiCallEvent) => live.id != null && live.id === db.id),
    ),
  ].slice(0, 50);

  // ── Compute display stats — prefer live counts, fall back to DB stats ──
  const totalCalls = liveEvents.length > 0 ? liveEvents.length : (dbStats?.total ?? 0);
  // Unified error check: live events have status string; DB records also have status
  const liveErrors = liveEvents.filter((c: ApiCallEvent) =>
    c.status === 'CLIENT_ERROR' || c.status === 'SERVER_ERROR' || (c.statusCode != null && c.statusCode >= 400)
  ).length;
  const errorCalls = liveEvents.length > 0 ? liveErrors : (dbStats?.errors ?? 0);
  const errorRate = totalCalls > 0 ? ((errorCalls / totalCalls) * 100).toFixed(1) : (dbStats?.errorRate?.toFixed(1) ?? '0.0');
  const avgLatency = dbStats?.avgLatency ?? 0;

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <div className={styles.dotPattern} />
      <SpringBackground />

      {/* ── THEME TOGGLE ── */}
      <button
        className={styles.themeToggle}
        onClick={() => setDark(!dark)}
        aria-label="Toggle theme"
      >
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="#1A1A1A"/>
            </svg>
          </div>
          <span className={styles.brandText}>API Nest</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/projects" className={styles.navItem} style={{ marginBottom: '0.5rem', opacity: 0.7 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Projects
          </Link>
          <Link href="/overview" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Overview
          </Link>
          <Link href="/getting-started" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" />
            </svg>
            Getting Started
          </Link>
          <Link href="/history" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Live Activity
          </Link>
          <Link href="/settings" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>
        </nav>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>{projectName ? `${projectName} — Overview` : 'Platform Overview'}</h1>
            <p>Welcome back, {user?.name || 'Operator'} — Live Socket: {isConnected ? 'Connected 🟢' : 'Connecting 🟡'}</p>
          </div>
          <button
            onClick={() => void fetchDashboard()}
            disabled={statsLoading}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.85rem',
              fontWeight: 600, opacity: statsLoading ? 0.5 : 1,
            }}
          >
            {statsLoading ? '⟳ Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        {/* ── STAT CARDS — real DB data ── */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Instances</span>
            <span className={styles.statValue}>{dbStats?.activeInstances ?? (statsLoading ? '…' : '0')}</span>
            <span className={styles.statSub}>
              {(dbStats?.activeInstances ?? 0) > 0 ? '🟢 System Nominal' : '⚪ No recent traffic'}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total API Calls</span>
            <span className={styles.statValue}>{totalCalls}</span>
            <span className={styles.statSub}>
              {avgLatency > 0 ? `Avg ${avgLatency}ms latency` : 'All time'}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Error Rate</span>
            <span className={styles.statValue} style={{ color: errorCalls > 0 ? '#ef4444' : undefined }}>
              {errorRate}%
            </span>
            <span className={styles.statSub} style={{ color: errorCalls > 0 ? '#ef4444' : undefined }}>
              {errorCalls} Failed Requests
            </span>
          </div>
        </div>

        {/* ── TRAFFIC FEED — seeded from DB, updated live ── */}
        <div className={styles.panel}>
          <h3>Real-time Traffic Control Matrix</h3>
          <div className={styles.feedList}>
            {mergedCalls.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                {statsLoading ? 'Loading traffic data…' : 'No traffic yet. Run the CLI tool to ingest data!'}
              </div>
            ) : (
              mergedCalls.map((call, idx) => {
                const code = (call as DbCall).statusCode ?? (call as ApiCallEvent).statusCode ?? 200;
                const method = call.method;
                const endpoint = (call as DbCall).url ?? (call as ApiCallEvent).url ?? (call as ApiCallEvent).path ?? '';
                const latency = call.latency;
                return (
                  <div key={(call as DbCall).id ?? idx} className={styles.feedItem}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.75rem' }}>
                      <span className={styles.feedMethod}>{method}</span>
                      <span className={styles.feedEndpoint}>{endpoint}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{latency}ms</span>
                      <span className={`${styles.feedStatus} ${Number(code) >= 400 ? styles.status400 : styles.status200}`}>
                        {code}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
