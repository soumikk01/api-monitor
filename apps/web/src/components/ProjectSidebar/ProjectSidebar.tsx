'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './ProjectSidebar.module.scss';

interface Props {
  projectId?: string;
}

type SidebarState = 'expanded' | 'collapsed' | 'hover';

export default function ProjectSidebar({ projectId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get('serviceId');
  const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('sidebarState') as SidebarState) || 'hover';
    }
    return 'hover';
  });
  const [showCtrl, setShowCtrl] = useState(false);
  const ctrlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.setProperty('--sidebar-width', sidebarState === 'expanded' ? '220px' : '64px');
    localStorage.setItem('sidebarState', sidebarState);
  }, [sidebarState]);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (ctrlRef.current && !ctrlRef.current.contains(e.target as Node)) setShowCtrl(false);
    };
    document.addEventListener('mousedown', clickOut);
    return () => document.removeEventListener('mousedown', clickOut);
  }, []);

  /** Build a clean absolute URL preserving the projectId and serviceId */
  const href = (path: string) => {
    if (!projectId) return path;
    const params = new URLSearchParams();
    params.set('projectId', projectId);
    if (serviceIdParam) params.set('serviceId', serviceIdParam);
    return `${path}?${params.toString()}`;
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className={styles.sidebar} data-state={sidebarState}>


      <nav className={styles.nav}>
        {/* Dashboard */}
        <Link
          href={href('/dashboard')}
          className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
          <span className={styles.label}>Dashboard</span>
        </Link>

        {/* Overview */}
        <Link
          href={href('/overview')}
          className={`${styles.navItem} ${isActive('/overview') ? styles.active : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span className={styles.label}>Overview</span>
        </Link>

        {/* Live Activity */}
        <Link
          href={href('/history')}
          className={`${styles.navItem} ${isActive('/history') ? styles.active : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className={styles.label}>Live Activity</span>
        </Link>

        {/* Settings — service-level when serviceId is present, project-level otherwise */}
        <Link
          href={serviceIdParam
            ? href('/service-settings')   // service context → Service Settings
            : href('/settings')}           // project-only context → Project Settings
          className={`${styles.navItem} ${(isActive('/settings') || isActive('/service-settings')) ? styles.active : ''}`}
          style={{ marginTop: 'auto' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span className={styles.label}>
            {serviceIdParam ? 'Service Settings' : 'Project Settings'}
          </span>
        </Link>
      </nav>

      {/* Sidebar Control */}
      <div className={styles.ctrlWrapper} ref={ctrlRef}>
        <button 
          className={styles.ctrlBtn} 
          onClick={() => setShowCtrl(!showCtrl)}
          title="Sidebar control"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </button>

        {showCtrl && (
          <div className={styles.ctrlDrop}>
            <div className={styles.ctrlHeader}>Sidebar control</div>
            <div className={styles.ctrlOptions}>
              <button className={styles.ctrlOpt} onClick={() => { setSidebarState('expanded'); setShowCtrl(false); }}>
                <span className={`${styles.optDot} ${sidebarState === 'expanded' ? styles.optDotActive : ''}`} /> Expanded
              </button>
              <button className={styles.ctrlOpt} onClick={() => { setSidebarState('collapsed'); setShowCtrl(false); }}>
                <span className={`${styles.optDot} ${sidebarState === 'collapsed' ? styles.optDotActive : ''}`} /> Collapsed
              </button>
              <button className={styles.ctrlOpt} onClick={() => { setSidebarState('hover'); setShowCtrl(false); }}>
                <span className={`${styles.optDot} ${sidebarState === 'hover' ? styles.optDotActive : ''}`} /> Expand on hover
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
