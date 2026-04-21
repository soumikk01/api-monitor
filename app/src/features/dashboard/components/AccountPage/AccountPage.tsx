'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Key, Shield, ClipboardList } from 'lucide-react';
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

      {/* ── SIDEBAR (Minimal Back Button) ── */}
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <Link href="/projects" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Projects
          </Link>

          <div style={{ margin: '12px 0 6px', height: '1px', background: 'rgba(0,0,0,0.06)' }} className={styles.navDivider} />

          <div className={styles.navGroupLabel}>Account Settings</div>

          <Link href="#" className={styles.navItem}>
            <Key size={15} />
            Access Tokens
          </Link>

          <Link href="#" className={styles.navItem}>
            <Shield size={15} />
            Security
          </Link>

          <div className={styles.navGroupLabel} style={{ marginTop: '16px' }}>Logs</div>

          <Link href="#" className={styles.navItem}>
            <ClipboardList size={15} />
            Audit
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
