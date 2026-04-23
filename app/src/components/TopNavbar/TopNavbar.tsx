'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Moon, Sun, LogOut, User, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { AVATARS } from '@/features/dashboard/components/AccountPage/avatars';
import styles from './TopNavbar.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Project {
  id: string;
  name: string;
}

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isProjectsPage = pathname === '/projects';
  const isAccountPage = pathname.startsWith('/projects/account');
  const isAuditPage = pathname === '/projects/account/audit';
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showUserDrop, setShowUserDrop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [avatarIndex, setAvatarIndex] = useState<number>(0);

  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getAvatar = () => parseInt(localStorage.getItem('userAvatarIndex') ?? '0', 10);
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setAvatarIndex(getAvatar());

      const handleStorage = () => setAvatarIndex(getAvatar());
      window.addEventListener('storage', handleStorage);
      window.addEventListener('avatarChanged', handleStorage);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('avatarChanged', handleStorage);
      };
    }
  }, []);

  const currentAvatar = AVATARS[avatarIndex] ?? AVATARS[0];


  /* ── fetch projects ── */
  const fetchProjects = useCallback(async () => {
    const token = authStorage.getAccessToken();
    if (!token) return;
    try {
      const res = await fetch(`${API}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json() as Project[];
      // Prefer projectId from URL, then localStorage, then first project
      const urlId = searchParams.get('projectId');
      const savedId = localStorage.getItem('activeProjectId');
      const targetId = urlId ?? savedId;
      const found = data.find(p => p.id === targetId) ?? data[0] ?? null;
      setActiveProject(found);
    } catch { /* ignore */ }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    const run = async () => { await fetchProjects(); };
    void run();
  }, [user, fetchProjects]);

  /* ── Ctrl+K shortcut ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchVal(''); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* ── click outside dropdowns ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className={`${styles.navbar}${dark ? ' ' + styles.dark : ''}`} id="top-navbar">
      {/* ══ LEFT ══ */}
      <div className={styles.left}>
        {/* Logo */}
        <Link href="/projects" className={styles.brand} title="Back to Projects">
          <span className={styles.brandIcon}>
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="currentColor"/>
            </svg>
          </span>
          <span className={styles.brandText}>API NEST</span>
        </Link>

        {!isProjectsPage && !isAccountPage && (
          <>
            <span className={styles.sep} />

            {/* Active project name — Click to go to projects */}
            <Link href="/projects" className={styles.selectorBtn} title="Back to Projects">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span className={styles.selectorLabel}>{activeProject?.name ?? 'No project'}</span>
            </Link>

            <span className={styles.sep} />

            {/* Environment badge */}
            <button className={styles.envBtn} title="Environment: Production">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>main</span>
              <span className={styles.prodBadge}>PRODUCTION</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <span className={styles.sep} />

            {/* Connect — opens Getting Started right-side panel */}
            <button
              className={styles.connectBtn}
              title="Connect your backend"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('panel', 'getting-started');
                router.push(`${pathname}?${params.toString()}`, { scroll: false });
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Connect
            </button>
          </>
        )}

        {isAccountPage && (
          <>
            <span className={styles.sep} />
            <span className={styles.selectorBtn} style={{ cursor: 'default', pointerEvents: 'none' }}>
              <User size={14} style={{ marginRight: '6px', opacity: 0.8 }} />
              <span className={styles.selectorLabel}>Account</span>
            </span>
            
            {isAuditPage && (
              <>
                <span className={styles.sep} />
                <span className={styles.selectorBtn} style={{ cursor: 'default', pointerEvents: 'none' }}>
                  <ClipboardList size={14} style={{ marginRight: '6px', opacity: 0.8 }} />
                  <span className={styles.selectorLabel}>Audit</span>
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* ══ RIGHT ══ */}
      <div className={styles.right}>
        {/* Feedback */}
        <a href="mailto:feedback@apinest.dev" className={styles.ghostBtn}>
          Feedback
        </a>

        {/* Search */}
        <div className={`${styles.searchBox} ${searchOpen ? styles.searchOpen : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className={styles.searchIco}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={searchRef}
            className={styles.searchInput}
            placeholder="Search…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onBlur={() => { if (!searchVal) setSearchOpen(false); }}
          />
          {!searchOpen && (
            <button className={styles.kbdBtn} onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}>
              <kbd className={styles.kbd}>Ctrl K</kbd>
            </button>
          )}
        </div>

        {/* Icon buttons */}
        <button className={styles.iconBtn} title="Help & Docs" onClick={() => router.push('/docs')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <button className={styles.iconBtn} title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        <button className={styles.iconBtn} title="Settings" onClick={() => router.push(activeProject ? `/settings?projectId=${activeProject.id}` : '/settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        {/* Upgrade */}
        <Link href="#" className={styles.upgradeBtn}>
          Upgrade to Pro
        </Link>

        {/* User avatar */}
        <div className={styles.dropWrap} ref={userRef}>
          <button
            id="user-avatar-btn"
            className={styles.avatar}
            onClick={() => setShowUserDrop(s => !s)}
            title={user?.name || user?.email}
          >
            {currentAvatar.svg}
          </button>

          {showUserDrop && (
            <div className={`${styles.drop} ${styles.dropRight}`}>
              <div className={styles.dropHeader}>
                <div className={styles.dropAvatar}>
                  {currentAvatar.svg}
                </div>
                <div className={styles.dropUser}>{user?.name || 'Account'}</div>
                <div className={styles.dropEmail}>{user?.email}</div>
              </div>
              <div className={styles.dropDivider}/>
              <button className={styles.dropItem} onClick={() => { setShowUserDrop(false); router.push('/projects/account'); }}>
                <User size={14} style={{ marginRight: '8px', opacity: 0.7 }} />
                Account
              </button>

              <div className={styles.dropDivider}/>
              <button 
                className={styles.dropItem} 
                onClick={() => {
                  toggleTheme();
                }}
              >
                {dark ? (
                  <><Sun size={14} style={{ marginRight: '8px', opacity: 0.7 }} /> Light mode</>
                ) : (
                  <><Moon size={14} style={{ marginRight: '8px', opacity: 0.7 }} /> Dark mode</>
                )}
              </button>
              <div className={styles.dropDivider}/>
              <button className={`${styles.dropItem} ${styles.dropItemDanger}`} onClick={handleLogout}>
                <LogOut size={14} style={{ marginRight: '8px', opacity: 0.7 }} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
