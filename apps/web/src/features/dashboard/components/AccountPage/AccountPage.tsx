'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useCallback, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Shimmer, ShimmerBlock, ShimmerRow } from '@/components/Shimmer/Shimmer';
import { AVATARS } from './avatars';
import styles from './AccountPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Stats {
  totalProjects: number;
  totalCalls: number;
  joinedAt?: string;
}

export default function AccountPage() {
  const { dark } = useTheme();
  const { user, logoutWithTransition, getCliCommand } = useAuth();


  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalCalls: 0 });
  const [cliCommand, setCliCommand] = useState<{ command: string; token: string; instructions: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('userAvatarIndex') ?? '0', 10);
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorage = () => {
        setSelectedAvatar(parseInt(localStorage.getItem('userAvatarIndex') ?? '0', 10));
      };
      window.addEventListener('storage', handleStorage);
      window.addEventListener('avatarChanged', handleStorage);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('avatarChanged', handleStorage);
      };
    }
  }, []);

  const currentAvatar = AVATARS[selectedAvatar] ?? AVATARS[0];

  const handleSelectAvatar = async (index: number) => {
    setSelectedAvatar(index);
    localStorage.setItem('userAvatarIndex', String(index));
    window.dispatchEvent(new Event('avatarChanged'));
    setShowAvatarPicker(false);

    const token = authStorage.getAccessToken();
    try {
      await fetch(`${API}/users/me/avatar`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ avatar: index })
      });
    } catch(err) {
      console.error('Failed to update avatar in DB', err);
    }
  };

  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const token = authStorage.getAccessToken();
    try {
      const pRes = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
      if (pRes.ok) {
        const projects = await pRes.json() as unknown[];
        setStats(s => ({ ...s, totalProjects: projects.length }));
      }
    } catch { /* silent */ }
    try {
      const cmd = await getCliCommand();
      setCliCommand(cmd);
    } catch { /* silent */ }
    setIsLoading(false);
  }, [user, getCliCommand]);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleLogout = () => { logoutWithTransition(); };

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

  if (isLoading) {
    return (
      <main className={`${styles.content}${dark ? ' ' + styles.dark : ''}`}>
        <ShimmerBlock>
          {/* Page header */}
          <Shimmer width="22%" height={34} borderRadius={6} delay={1} />
          <Shimmer width="50%" height={16} borderRadius={4} delay={1} />
          {/* Profile hero card */}
          <ShimmerRow style={{ marginTop: '0.5rem', alignItems: 'center', gap: '1.25rem' }}>
            <Shimmer width={72} height={72} borderRadius={36} delay={2} />
            <ShimmerBlock style={{ gap: '0.5rem', flex: 1 }}>
              <Shimmer width="35%" height={22} borderRadius={6} delay={2} />
              <Shimmer width="48%" height={16} borderRadius={4} delay={2} />
              <Shimmer width={80} height={22} borderRadius={12} delay={3} />
            </ShimmerBlock>
            <ShimmerRow style={{ gap: '2rem' }}>
              <Shimmer width={60} height={52} borderRadius={8} delay={3} />
              <Shimmer width={60} height={52} borderRadius={8} delay={3} />
            </ShimmerRow>
          </ShimmerRow>
          {/* Profile Details panel */}
          <Shimmer height={48} borderRadius={8} delay={3} style={{ marginTop: '0.5rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Shimmer height={56} borderRadius={8} delay={3} />
            <Shimmer height={56} borderRadius={8} delay={4} />
            <Shimmer height={56} borderRadius={8} delay={4} />
            <Shimmer height={56} borderRadius={8} delay={4} />
          </div>
          {/* SDK Token panel */}
          <Shimmer height={48} borderRadius={8} delay={4} style={{ marginTop: '0.5rem' }} />
          <Shimmer height={64} borderRadius={8} delay={5} />
          <Shimmer width="30%" height={36} borderRadius={8} delay={5} />
        </ShimmerBlock>
      </main>
    );
  }

  return (
    <main className={`${styles.content}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.header}>
        <h1>My Account</h1>
        <p>Manage your profile, API token, and account preferences.</p>
      </div>

      {/* ── PROFILE HERO ── */}
      <div className={styles.heroCard}>
        {/* Avatar with edit icon */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatarCircle}>
            {currentAvatar.svg}
          </div>
          <button
            className={styles.avatarEditBtn}
            onClick={() => setShowAvatarPicker(true)}
            title="Change avatar"
            aria-label="Change profile photo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
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
            <div className={`${styles.fieldValue} ${styles.mono}`}>{user?.id ?? '—'}</div>
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

      {/* ── AVATAR PICKER MODAL ── */}
      {showAvatarPicker && (
        <div className={styles.pickerBackdrop} onClick={() => setShowAvatarPicker(false)}>
          <div className={styles.pickerModal} onClick={e => e.stopPropagation()}>
            <div className={styles.pickerHeader}>
              <span>Choose your avatar</span>
              <button className={styles.pickerClose} onClick={() => setShowAvatarPicker(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <p className={styles.pickerSub}>
              unique avatars to match your personality
            </p>
            <div className={styles.pickerGrid}>
              {AVATARS.map((av, i) => (
                <button
                  key={i}
                  className={`${styles.pickerItem} ${selectedAvatar === i ? styles.pickerItemSelected : ''}`}
                  onClick={() => handleSelectAvatar(i)}
                >
                  {av.svg}
                  <span className={styles.avatarTooltip}>{av.label}</span>
                  {selectedAvatar === i && (
                     <span className={styles.pickerCheck}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
