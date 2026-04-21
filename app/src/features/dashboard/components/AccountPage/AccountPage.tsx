'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import styles from './AccountPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Stats {
  totalProjects: number;
  totalCalls: number;
  joinedAt?: string;
}

export default function AccountPage() {
  const { dark } = useTheme();
  const { user, logout, getCliCommand } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalCalls: 0 });
  const [cliCommand, setCliCommand] = useState<{ command: string; token: string; instructions: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  const loadData = useCallback(async () => {
    if (!user) return;
    const token = authStorage.getAccessToken();
    try {
      // load projects count
      const pRes = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
      if (pRes.ok) {
        const projects = await pRes.json() as unknown[];
        setStats(s => ({ ...s, totalProjects: projects.length }));
      }
    } catch { /* silent */ }
    // load CLI command
    try {
      const cmd = await getCliCommand();
      setCliCommand(cmd);
    } catch { /* silent */ }
  }, [user, getCliCommand]);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleLogout = () => { logout(); router.push('/login'); };

  const copyToClipboard = async () => {
    if (cliCommand) {
      await navigator.clipboard.writeText(cliCommand.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    const token = authStorage.getAccessToken();
    try {
      const res = await fetch(`${API}/users/me/regenerate-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      await loadData();
    } catch (err) { console.error(err); }
    finally { setRegenerating(false); }
  };

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <div className={styles.dotPattern} />

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
          <Link href="/projects" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Projects
          </Link>
          <Link href="/overview" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Overview
          </Link>
          <Link href="/settings" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Settings
          </Link>
          <Link href="/projects/account" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Account
          </Link>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.content}>
        <div className={styles.header}>
          <h1>My Account</h1>
          <p>Manage your profile, API token, and account preferences.</p>
        </div>

        {/* ── PROFILE HERO ── */}
        <div className={styles.heroCard}>
          <div className={styles.avatarCircle}>{userInitial}</div>
          <div className={styles.heroInfo}>
            <div className={styles.heroName}>{user?.name || 'Anonymous'}</div>
            <div className={styles.heroEmail}>{user?.email}</div>
            <div className={styles.heroBadge}>Free plan</div>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.totalProjects}</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>Active</span>
              <span className={styles.statLabel}>Session</span>
            </div>
          </div>
        </div>

        {/* ── PROFILE DETAILS ── */}
        <div className={styles.panel}>
          <h3>Profile Details</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Full name</label>
              <div className={styles.fieldValue}>{user?.name || '—'}</div>
            </div>
            <div className={styles.field}>
              <label>Email address</label>
              <div className={styles.fieldValue}>{user?.email || '—'}</div>
            </div>
            <div className={styles.field}>
              <label>Account ID</label>
              <div className={`${styles.fieldValue} ${styles.mono}`}>{(user as {id?: string})?.id ?? '—'}</div>
            </div>
            <div className={styles.field}>
              <label>Plan</label>
              <div className={styles.fieldValue}>Free</div>
            </div>
          </div>
        </div>

        {/* ── SDK TOKEN ── */}
        <div className={styles.panel}>
          <h3>SDK Token</h3>
          <p style={{ marginBottom: '1.25rem' }}>
            Use this token to connect your projects to the API Nest interceptor. Keep it secret.
          </p>
          <div className={styles.codeBlock}>
            <code>{cliCommand ? cliCommand.token : 'Loading token…'}</code>
            <button className={styles.copyBtn} onClick={() => void copyToClipboard()}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button
              className={styles.regenerateBtn}
              onClick={() => void handleRegenerate()}
              disabled={regenerating}
            >
              {regenerating ? 'Regenerating…' : '↻ Regenerate Token'}
            </button>
            <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#ef4444' }}>
              ⚠ Regenerating will invalidate your current token immediately.
            </p>
          </div>
        </div>

        {/* ── DANGER ZONE ── */}
        <div className={`${styles.panel} ${styles.dangerPanel}`}>
          <h3>Danger Zone</h3>
          <p>These actions are permanent and cannot be undone.</p>
          <div style={{ marginTop: '1.25rem' }}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Sign out securely
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
