'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import styles from './SettingsPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function SettingsPage() {
  const { dark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [cliCommand, setCliCommand] = useState<{ command: string; token: string; instructions: string } | null>(null);
  const { user, logout, getCliCommand } = useAuth();
  const router = useRouter();

  const loadCommand = useCallback(() => {
    if (user) getCliCommand().then(setCliCommand).catch(console.error);
  }, [user, getCliCommand]);

  useEffect(() => { loadCommand(); }, [loadCommand]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const copyToClipboard = async () => {
    if (cliCommand) {
      await navigator.clipboard.writeText(cliCommand.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /** Rotate SDK token via PATCH /users/me/regenerate-token, then reload the command */
  const handleRegenerate = async () => {
    setRegenerating(true);
    const token = authStorage.getAccessToken();
    try {
      const res = await fetch(`${API}/users/me/regenerate-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to regenerate token');
      loadCommand(); // refresh displayed command
    } catch (err) {
      console.error(err);
    } finally {
      setRegenerating(false);
    }
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
          <Link href="/settings" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Settings
          </Link>
        </nav>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className={styles.content}>
        <div className={styles.header}>
          <h1>Settings &amp; Configuration</h1>
          <p>Manage your account, SDK integration, and preferences.</p>
        </div>

        {/* ── Account Profile ── */}
        <div className={styles.panel}>
          <h3>Account Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label>Name</label>
              <div className={styles.fieldValue}>{user?.name || '—'}</div>
            </div>
            <div>
              <label>Email</label>
              <div className={styles.fieldValue}>{user?.email || '—'}</div>
            </div>
            <div>
              <label>Account created</label>
              <div className={styles.fieldValue}>
                {/* createdAt not in token but we can show something meaningful */}
                Active session
              </div>
            </div>
            <hr className={styles.divider}/>
            <div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Sign out securely
              </button>
            </div>
          </div>
        </div>

        {/* ── SDK / CLI Integration ── */}
        <div className={styles.panel}>
          <h3>CLI &amp; SDK Integration</h3>
          <p style={{ marginBottom: '1.25rem' }}>
            Run this command once inside your project to start intercepting all outbound HTTP calls
            and sending them to your API Nest dashboard in real time.
          </p>

          <div className={styles.codeBlock}>
            <code>
              {cliCommand ? cliCommand.command : 'Loading setup command…'}
            </code>
            <button className={styles.copyBtn} onClick={() => void copyToClipboard()}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontStyle: 'italic' }}>
            {cliCommand?.instructions}
          </p>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              className={styles.regenerateBtn}
              onClick={() => void handleRegenerate()}
              disabled={regenerating}
            >
              {regenerating ? 'Regenerating…' : '↻ Regenerate SDK Token'}
            </button>
            <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#ef4444' }}>
              ⚠ Regenerating will invalidate your current token. Active CLI connections will stop until you re-run the init command.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
