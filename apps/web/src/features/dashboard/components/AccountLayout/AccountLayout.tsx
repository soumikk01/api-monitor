'use client';
import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Key, Shield, ClipboardList } from 'lucide-react';
import styles from './AccountLayout.module.scss';
import React from 'react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  const pathname = usePathname();

  return (
    <div className={`${styles.layout}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />

      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <Link href="/projects" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </Link>

          <div style={{ margin: '12px 0 6px', height: '1px', background: 'rgba(0,0,0,0.06)' }} className={styles.navDivider} />

          <div className={styles.navGroupLabel}>Account Settings</div>

          <Link
            href="/projects/account"
            className={`${styles.navItem} ${pathname === '/projects/account' ? styles.activeNavItem : ''}`}
          >
            <Key size={14} />
            Profile & Tokens
          </Link>

          <Link href="#" className={styles.navItem}>
            <Shield size={14} />
            Security
          </Link>

          <div className={styles.navGroupLabel} style={{ marginTop: '16px' }}>Logs</div>

          <Link
            href="/projects/account/audit"
            className={`${styles.navItem} ${pathname === '/projects/account/audit' ? styles.activeNavItem : ''}`}
          >
            <ClipboardList size={14} />
            Audit
          </Link>
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className={styles.mainArea}>
        {children}
      </div>
    </div>
  );
}
