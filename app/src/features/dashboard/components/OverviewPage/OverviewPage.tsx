'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMonitorSocket, ApiCallEvent } from '@/hooks/useMonitorSocket';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import ProjectSidebar from '@/components/ProjectSidebar/ProjectSidebar';
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
  const { dark } = useTheme();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');

  // DB-sourced state
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [dbCalls, setDbCalls] = useState<DbCall[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [loadState, setLoadState] = useState<'loading' | 'empty' | 'ready'>('loading');

  // ── Resolve active project from URL or first project ──
  useEffect(() => {
    const paramId = searchParams.get('projectId');
    const token = authStorage.getAccessToken();
    if (!token) return;

    void (async () => {
      setLoadState('loading');
      if (paramId) {
        const r = await fetch(`${API}/projects/${paramId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (r.ok) {
          const p = await r.json() as { id: string; name: string };
          setProjectId(p.id);
          setProjectName(p.name);
          localStorage.setItem('activeProjectId', p.id);
          setLoadState('ready');
        } else {
          setProjectId(paramId);
          setLoadState('ready');
        }
      } else {
        const r = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) { setLoadState('empty'); return; }
        const projects = await r.json() as { id: string; name: string }[];
        const saved = localStorage.getItem('activeProjectId');
        const active = projects.find(p => p.id === saved) ?? projects[0];
        if (active) {
          setProjectId(active.id);
          setProjectName(active.name);
          localStorage.setItem('activeProjectId', active.id);
          setLoadState('ready');
        } else {
          setLoadState('empty');
        }
      }
    })();
  }, [user, searchParams]);

  // ── Fetch real DB stats + recent call history when projectId is known ──
  const fetchDashboard = useCallback(async () => {
    if (!projectId) return;
    const token = authStorage.getAccessToken();
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
  const liveErrors = liveEvents.filter((c: ApiCallEvent) =>
    c.status === 'CLIENT_ERROR' || c.status === 'SERVER_ERROR' || (c.statusCode != null && c.statusCode >= 400)
  ).length;
  const errorCalls = liveEvents.length > 0 ? liveErrors : (dbStats?.errors ?? 0);
  const errorRate = totalCalls > 0 ? ((errorCalls / totalCalls) * 100).toFixed(1) : (dbStats?.errorRate?.toFixed(1) ?? '0.0');
  const avgLatency = dbStats?.avgLatency ?? 0;

  // ── Loading skeleton ──
  if (loadState === 'loading') {
    return (
      <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
        <div className={styles.noiseOverlay} />
        <div className={styles.dotPattern} />
        <ProjectSidebar projectId={undefined} />
        <main className={styles.content}>
          <div className={styles.header}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonSub} />
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard} style={{ height: 120 }}>
              <div className={styles.skeletonSub} style={{ width: '60%' }} />
              <div className={styles.skeletonBlock} style={{ width: '40%', height: 32, marginTop: 12 }} />
            </div>
            <div className={styles.statCard} style={{ height: 120 }}>
              <div className={styles.skeletonSub} style={{ width: '60%' }} />
              <div className={styles.skeletonBlock} style={{ width: '40%', height: 32, marginTop: 12 }} />
            </div>
            <div className={styles.statCard} style={{ height: 120 }}>
              <div className={styles.skeletonSub} style={{ width: '60%' }} />
              <div className={styles.skeletonBlock} style={{ width: '40%', height: 32, marginTop: 12 }} />
            </div>
          </div>
          <div className={styles.panel} style={{ marginTop: '2rem' }}>
            <div className={styles.skeletonBlock} style={{ height: 200 }} />
          </div>
        </main>
      </div>
    );
  }

  // ── No project empty state ──
  if (loadState === 'empty') {
    return (
      <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
        <div className={styles.noiseOverlay} />
        <div className={styles.dotPattern} />
        <ProjectSidebar projectId={undefined} />
        <main className={styles.content}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2>No project selected</h2>
            <p>You need to create a project before you can access the dashboard overview. Projects are where your API monitoring data lives.</p>
            <Link href="/projects" className={styles.emptyBtn}>
              Go to Projects
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <div className={styles.dotPattern} />
      <SpringBackground />

      {/* ── SIDEBAR — shared component, always passes correct projectId ── */}
      <ProjectSidebar projectId={projectId || undefined} />

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
