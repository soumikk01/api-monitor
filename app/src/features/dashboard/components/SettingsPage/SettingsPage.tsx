'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import ProjectSidebar from '@/components/ProjectSidebar/ProjectSidebar';
import { Shimmer, ShimmerBlock } from '@/components/Shimmer/Shimmer';
import styles from './SettingsPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function SettingsPage() {
  const { dark } = useTheme();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  // 'loading' = still fetching, 'empty' = no projects exist, 'ready' = project loaded
  const [loadState, setLoadState] = useState<'loading' | 'empty' | 'ready'>('loading');

  // ── Resolve active project from URL param or localStorage ──
  useEffect(() => {
    const paramId = searchParams.get('projectId');
    const token = authStorage.getAccessToken();
    if (!token) return;

    void (async () => {
      setLoadState('loading');
      const targetId = paramId ?? localStorage.getItem('activeProjectId');

      if (targetId) {
        try {
          const r = await fetch(`${API}/projects/${targetId}`, { headers: { Authorization: `Bearer ${token}` } });
          if (r.ok) {
            const p = await r.json() as { id: string; name: string };
            setProjectId(p.id);
            setProjectName(p.name);
            setEditName(p.name);
            localStorage.setItem('activeProjectId', p.id);
            setLoadState('ready');
            return;
          }
        } catch { /* ignore */ }
      }

      // Fallback: load first project
      try {
        const r = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) { setLoadState('empty'); return; }
        const projects = await r.json() as { id: string; name: string }[];
        if (projects.length > 0) {
          setProjectId(projects[0].id);
          setProjectName(projects[0].name);
          setEditName(projects[0].name);
          localStorage.setItem('activeProjectId', projects[0].id);
          setLoadState('ready');
        } else {
          setLoadState('empty');
        }
      } catch { setLoadState('empty'); }
    })();
  }, [searchParams, user]);

  const handleSaveGeneral = async () => {
    if (!projectId || !editName.trim() || editName.trim() === projectName) return;
    setIsSaving(true);
    setSaveStatus('idle');
    const token = authStorage.getAccessToken();
    try {
      const res = await fetch(`${API}/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (res.ok) {
        setProjectName(editName.trim());
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;
    if (!confirm(`Are you absolutely sure? This will permanently delete "${projectName}" and all its data. This action cannot be undone.`)) return;
    const token = authStorage.getAccessToken();
    try {
      await fetch(`${API}/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/projects';
    } catch { /* ignore */ }
  };

  // ── Loading skeleton ──
  if (loadState === 'loading') {
    return (
      <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
        <div className={styles.noiseOverlay} />
        <div className={styles.dotPattern} />
        <ProjectSidebar projectId={undefined} />
        <main className={styles.content}>
          <ShimmerBlock>
            {/* Page header */}
            <Shimmer width="30%" height={34} borderRadius={6} delay={1} />
            <Shimmer width="52%" height={16} borderRadius={4} delay={1} />
            {/* General Settings panel */}
            <Shimmer height={48} borderRadius={8} delay={2} style={{ marginTop: '0.75rem' }} />
            <Shimmer height={56} borderRadius={8} delay={2} />
            <Shimmer height={56} borderRadius={8} delay={3} />
            <Shimmer width="20%" height={36} borderRadius={8} delay={3} style={{ alignSelf: 'flex-end' }} />
            {/* Project Access panel */}
            <Shimmer height={48} borderRadius={8} delay={3} style={{ marginTop: '0.75rem' }} />
            <Shimmer height={100} borderRadius={8} delay={4} />
            {/* Project Availability panel */}
            <Shimmer height={48} borderRadius={8} delay={4} style={{ marginTop: '0.75rem' }} />
            <Shimmer height={80} borderRadius={8} delay={5} />
          </ShimmerBlock>
        </main>
      </div>
    );
  }

  // ── No project empty state — redirect user to create one ──
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
            <p>You need to create a project before you can access settings. Projects are where your API monitoring data lives.</p>
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

      {/* ── SIDEBAR — shared, always passes correct projectId ── */}
      <ProjectSidebar projectId={projectId ?? undefined} />

      {/* ── MAIN AREA ── */}
      <main className={styles.content}>
        <div className={styles.header}>
          <h1>Project Settings</h1>
          <p>General configuration, domains, ownership, and lifecycle</p>
        </div>

        {/* ── General Settings ── */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>General Settings</h3>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.formGroup}>
              <label>Project name</label>
              <input
                className={styles.input}
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="e.g. my-backend-api"
              />
              <p className={styles.helperText}>Displayed throughout the dashboard.</p>
            </div>

            <div className={styles.formGroup}>
              <label>Project ID</label>
              <input
                className={`${styles.input} ${styles.readOnly}`}
                value={projectId ?? 'Loading...'}
                readOnly
              />
              <p className={styles.helperText}>Reference used in APIs and URLs.</p>
            </div>
          </div>
          <div className={styles.panelFooter}>
            {saveStatus === 'success' && (
              <span style={{ fontSize: '0.85rem', color: '#16a34a', marginRight: '1rem' }}>✓ Saved successfully</span>
            )}
            {saveStatus === 'error' && (
              <span style={{ fontSize: '0.85rem', color: '#ef4444', marginRight: '1rem' }}>✗ Failed to save</span>
            )}
            <button
              className={styles.primaryBtn}
              onClick={() => void handleSaveGeneral()}
              disabled={isSaving || !editName.trim() || editName.trim() === projectName}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* ── Project Access ── */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Project access</h3>
          </div>
          <div className={styles.panelBody}>
            <h4>Organization-wide access</h4>
            <p style={{ marginTop: '0.25rem' }}>All 1 organization members can access this project.</p>

            <button className={styles.secondaryBtn} style={{ marginTop: '1rem' }}>Manage members</button>

            <div className={styles.tableBlock} style={{ marginTop: '1.5rem' }}>
              <div className={styles.tableHeader}>
                <div className={styles.colName}>Member</div>
                <div className={styles.colRole}>Role</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.colName}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.email || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1px' }}>You</div>
                </div>
                <div className={styles.colRole}>Owner</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Project Availability ── */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Project availability</h3>
          </div>
          <div className={styles.panelBody}>
            <p>Restart or pause your project when performing maintenance.</p>

            <div className={styles.actionRow} style={{ marginTop: '1.5rem' }}>
              <div>
                <h4>Restart project</h4>
                <p style={{ marginTop: '0.25rem' }}>Your project will not be available for a few minutes.</p>
              </div>
              <button className={styles.secondaryBtn}>Restart project</button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.actionRow}>
              <div>
                <h4>Pause project</h4>
                <p style={{ marginTop: '0.25rem' }}>Your project will not be accessible while it is paused.</p>
              </div>
              <button className={styles.secondaryBtn}>Pause project</button>
            </div>
          </div>
        </div>

        {/* ── Custom Domains ── */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Custom domains</h3>
          </div>
          <div className={styles.panelBody}>
            <p>Present a branded experience to your users.</p>
            <div className={styles.infoBox} style={{ marginTop: '1.25rem' }}>
              <h4>Custom domains are a Pro Plan add-on</h4>
              <p style={{ marginTop: '0.35rem' }}>Paid Plans come with free vanity subdomains or Custom Domains for an additional $10/month per domain.</p>
              <button className={styles.secondaryBtn} style={{ marginTop: '1rem' }}>Upgrade to Pro</button>
            </div>
          </div>
        </div>

        {/* ── Transfer Project ── */}
        <div className={`${styles.panel} ${styles.dangerPanel}`}>
          <div className={styles.panelHeader}>
            <h3>Transfer project</h3>
          </div>
          <div className={styles.panelBody}>
            <p>Transfer this project to another organization or account.</p>
            <p className={styles.helperText} style={{ marginTop: '0.5rem' }}>
              To transfer projects, the owner must be a member of both the source and target organizations.
            </p>
          </div>
          <div className={styles.panelFooter}>
            <button className={styles.secondaryBtn}>Transfer project</button>
          </div>
        </div>

        {/* ── Delete Project ── */}
        <div className={`${styles.panel} ${styles.dangerPanel}`}>
          <div className={styles.panelHeader}>
            <h3>Delete project</h3>
          </div>
          <div className={styles.panelBody}>
            <p>Permanently remove your project and all of its data.</p>
            <p className={styles.helperText} style={{ marginTop: '0.5rem' }}>
              This action is irreversible. All API call logs, configurations, and project data will be deleted
              permanently. Make a backup if needed.
            </p>
          </div>
          <div className={`${styles.panelFooter} ${styles.dangerFooter}`}>
            <button className={styles.dangerBtn} onClick={() => void handleDelete()}>
              Delete project
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
