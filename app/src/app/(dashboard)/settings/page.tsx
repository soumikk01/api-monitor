'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import styles from '../overview/overview.module.scss';
import { useRouter } from 'next/navigation';

/* ── Spring Blossom Background ── */
const SpringBackground = () => (
  <div className={styles.springBg} aria-hidden="true">
    <svg className={styles.branch1} viewBox="0 0 220 180" fill="none">
      <path d="M10,170 Q50,110 90,85 Q120,65 160,52 Q180,45 210,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" opacity="0.45"/>
      <path d="M90,85 Q100,62 118,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <g transform="translate(120,46)"><circle cx="0" cy="-7" r="5.5" fill="#FFB7C5" opacity="0.85"/><circle cx="6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/></g>
    </svg>
    <svg className={styles.branch2} viewBox="0 0 220 180" fill="none">
      <path d="M210,170 Q170,110 130,85 Q100,65 62,52 Q42,45 12,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
      <g transform="translate(100,45)"><circle cx="0" cy="-7" r="5.5" fill="#FFD1DC" opacity="0.9"/><circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/></g>
    </svg>
    <svg className={`${styles.petal} ${styles.petal1}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5.5" ry="10" fill="#FFB7C5" opacity="0.7" transform="rotate(-20 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal2}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9.5" fill="#FFD1DC" opacity="0.65" transform="rotate(15 7 11)"/></svg>
  </div>
);

export default function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cliCommand, setCliCommand] = useState<{command: string, instructions: string} | null>(null);
  const { user, logout, getCliCommand } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getCliCommand().then(setCliCommand).catch(console.error);
    }
  }, [user, getCliCommand]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const copyToClipboard = () => {
    if (cliCommand) {
      navigator.clipboard.writeText(cliCommand.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <SpringBackground />

      {/* ── THEME TOGGLE ── */}
      <button className={styles.themeToggle} onClick={() => setDark(!dark)} aria-label="Toggle theme">
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>

      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="3" fill="#1A1A1A"/>
            </svg>
          </div>
          <span className={styles.brandText}>API Nest</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/overview" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Overview
          </Link>
          <Link href="/settings" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09z" /></svg>
            Settings
          </Link>
        </nav>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>Settings & Configuration</h1>
            <p>Manage your account, SDK integration, and app preferences.</p>
          </div>
        </div>

        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
          <h3>Account Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-main)', marginTop: '1rem' }}>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</strong>
              <div style={{ fontWeight: 600 }}>{user?.name || 'Operator'}</div>
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</strong>
              <div style={{ fontWeight: 600 }}>{user?.email || 'N/A'}</div>
            </div>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', opacity: 0.3 }} />
            <div>
               <button onClick={handleLogout} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: '#fff', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                 Log Out Securely
               </button>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 style={{ marginBottom: '0.5rem' }}>CLI Integration</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Use the following command to initialize the API Nest Interceptor inside your backend projects. This will bind the project to your dashboard automatically.
          </p>
          
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '1.2rem', position: 'relative' }}>
             <code style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '0.95rem' }}>
               {cliCommand ? cliCommand.command : 'Loading setup command...'}
             </code>
             <button 
               onClick={copyToClipboard}
               style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
             >
               {copied ? 'Copied!' : 'Copy'}
             </button>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {cliCommand?.instructions}
          </p>
        </div>
      </main>
    </div>
  );
}
