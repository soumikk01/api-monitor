'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMonitorSocket, ApiCallEvent } from '@/hooks/useMonitorSocket';
import { useAuth } from '@/hooks/useAuth';
import styles from './overview.module.scss';

/* ── Spring Blossom Background (shared with auth, dialed back) ── */
const SpringBackground = () => (
  <div className={styles.springBg} aria-hidden="true">
    <svg className={styles.branch1} viewBox="0 0 220 180" fill="none">
      <path d="M10,170 Q50,110 90,85 Q120,65 160,52 Q180,45 210,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45"/>
      <path d="M90,85 Q100,62 118,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>
      <g transform="translate(120,46)"><circle cx="0" cy="-7" r="5.5" fill="#FFB7C5" opacity="0.85"/><circle cx="6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/></g>
    </svg>
    <svg className={styles.branch2} viewBox="0 0 220 180" fill="none">
      <path d="M210,170 Q170,110 130,85 Q100,65 62,52 Q42,45 12,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
      <g transform="translate(100,45)"><circle cx="0" cy="-7" r="5.5" fill="#FFD1DC" opacity="0.9"/><circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/></g>
    </svg>
    <svg className={`${styles.petal} ${styles.petal1}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5.5" ry="10" fill="#FFB7C5" opacity="0.7" transform="rotate(-20 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal2}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9.5" fill="#FFD1DC" opacity="0.65" transform="rotate(15 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal3}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="4.5" ry="9" fill="#FF8FAB" opacity="0.55" transform="rotate(-35 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal4}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9" fill="#FFB7C5" opacity="0.6" transform="rotate(25 7 11)"/></svg>
  </div>
);

export default function OverviewPage() {
  const [dark, setDark] = useState(false);
  const { user } = useAuth();
  
  // Connect to the real-time NestJS socket
  const { connected: isConnected, events: calls } = useMonitorSocket({ projectId: user?.id ?? '' });

  // Calculate some dummy stats derived from live data
  const totalCalls = calls.length;
  const errorCalls = calls.filter((c: ApiCallEvent) => (c.statusCode ?? 200) >= 400).length;
  const errorRate = totalCalls > 0 ? ((errorCalls / totalCalls) * 100).toFixed(1) : '0.0';

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
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
          <span className={styles.brandText}>N_ARCH</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/overview" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Overview
          </Link>
          <Link href="#" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Live Activity
          </Link>
          <Link href="/settings" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>
        </nav>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>Platform Overview</h1>
            <p>Welcome back, {user?.name || 'Operator'} — Live Socket: {isConnected ? 'Connected 🟢' : 'Connecting 🟡'}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Instances</span>
            <span className={styles.statValue}>1</span>
            <span className={styles.statSub}>🟢 System Nominal</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total API Calls (Live)</span>
            <span className={styles.statValue}>{totalCalls}</span>
            <span className={styles.statSub}>In your current session</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Error Rate</span>
            <span className={styles.statValue} style={{ color: errorCalls > 0 ? '#ef4444' : undefined }}>{errorRate}%</span>
            <span className={styles.statSub} style={{ color: errorCalls > 0 ? '#ef4444' : undefined }}>
              {errorCalls} Failed Requests
            </span>
          </div>
        </div>

        <div className={styles.panel}>
          <h3>Real-time Traffic Control Matrix</h3>
          
          <div className={styles.feedList}>
            {calls.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No active traffic yet. Run the CLI tool to ingest data!
              </div>
            ) : (
              calls.slice(0, 10).map((call: ApiCallEvent, idx: number) => (
                <div key={idx} className={styles.feedItem}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <span className={styles.feedMethod}>{call.method}</span>
                    <span className={styles.feedEndpoint}>{call.url || call.path}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{call.latency}ms</span>
                    <span className={`${styles.feedStatus} ${(call.statusCode ?? 200) >= 400 ? styles.status400 : styles.status200}`}>
                      {call.statusCode ?? 200}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
