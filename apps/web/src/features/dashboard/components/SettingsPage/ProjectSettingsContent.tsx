'use client';

/**
 * ProjectSettingsContent — self-contained settings panel.
 * Props:
 *   projectId  – the project to manage (required)
 *   onBack     – called when user clicks "Back to Services"
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { queryClient } from '@/lib/queryClient';
import { queryKeys, fetchProject, fetchMembers } from '@/lib/queries';
import ProjectSettingsSidebar from '@/components/ProjectSettingsSidebar/ProjectSettingsSidebar';
import styles from '../SettingsPage/SettingsPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Props {
  projectId: string;
  onBack: () => void;
}

export default function ProjectSettingsContent({ projectId, onBack }: Props) {
  const { user } = useAuth();
  const [editName, setEditName]       = useState('');
  const [isSaving, setIsSaving]       = useState(false);
  const [saveStatus, setSaveStatus]   = useState<'idle' | 'success' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState('general');
  const [showDeleteModal,   setShowDeleteModal]   = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [inviteInput,   setInviteInput]   = useState('');
  const [inviteError,   setInviteError]   = useState('');

  // ── Project — instant from React Query cache (already loaded by ServicesPage) ─
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
    placeholderData: () => {
      try {
        const list = JSON.parse(localStorage.getItem('cachedProjectsV2') ?? '[]') as { id: string; name: string; serviceMode: string; createdAt: string }[];
        return list.find(p => p.id === projectId);
      } catch { return undefined; }
    },
  });

  const projectName = project?.name ?? '';

  // Sync editName when project loads
  useEffect(() => { if (project?.name) setEditName(project.name); }, [project?.name]);

  // ── Members — cached 60s ─────────────────────────────────────────────────
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: queryKeys.projects.members(projectId),
    queryFn: () => fetchMembers(projectId),
    enabled: !!projectId,
    staleTime: 60_000,
  });

  // ── Hash-based section nav ────────────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveSection(hash || 'general');
      setInviteError('');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ── Save general (name) mutation ─────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetchWithAuth(`${API}/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to save');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    },
    onError: () => setSaveStatus('error'),
    onSettled: () => setIsSaving(false),
  });

  const handleSaveGeneral = () => {
    if (!editName.trim() || editName.trim() === projectName) return;
    setIsSaving(true);
    setSaveStatus('idle');
    saveMutation.mutate(editName.trim());
  };

  // ── Add member mutation ───────────────────────────────────────────────────
  const addMemberMutation = useMutation({
    mutationFn: async (emailOrId: string) => {
      const res = await fetchWithAuth(`${API}/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrId }),
      });
      if (!res.ok) {
        const data = await res.json() as { message?: string };
        let msg = data.message ?? 'Failed to add member';
        if (typeof msg === 'string' && msg.startsWith('Cannot POST')) {
          msg = 'The invitation service is currently unavailable. Please try again later.';
        }
        throw new Error(msg);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.members(projectId) });
      setInviteInput('');
    },
    onError: (err: Error) => setInviteError(err.message),
  });

  // ── Delete project ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await fetchWithAuth(`${API}/projects/${projectId}`, { method: 'DELETE' });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() });
      localStorage.removeItem(`projName:${projectId}`);
      window.location.href = '/projects';
    } catch { /* ignore */ }
  };

  const loadState = projectLoading && !project ? 'loading' : 'ready';



  // ── Override the "Back to Project" link in ProjectSettingsSidebar ───────────
  // We pass onSectionChange so the parent controls the active section.
  // The "Back" button in that sidebar navigates to /dashboard — we override
  // via a wrapper that intercepts clicks at the sidebar level.

  return (
    <>
      {/* Settings sidebar — reuse the real one, override back link via CSS trick */}
      <div style={{ position: 'relative' }}>
        <ProjectSettingsSidebar
          projectId={projectId}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        {/* Invisible overlay on "Back to Project" link to intercept click */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '0.75rem',
            width: 'calc(100% - 1.5rem)',
            height: '38px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 20,
          }}
          aria-label="Back to Services"
        />
      </div>

      {/* Main content */}
      <main className={styles.content}>
        {loadState === 'loading' ? (
          <div style={{ padding: '2rem', color: '#999', fontSize: '0.9rem' }}>Loading settings…</div>
        ) : (
          <>
            <div className={styles.header}>
              <h1>Project Settings</h1>
              <p>General configuration, domains, ownership, and lifecycle</p>
            </div>

            {/* General Settings */}
            {activeSection === 'general' && (
              <div className={styles.panel} id="general">
                <div className={styles.panelHeader}><h3>General Settings</h3></div>
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
                    <input className={`${styles.input} ${styles.readOnly}`} value={projectId} readOnly />
                    <p className={styles.helperText}>Reference used in APIs and URLs.</p>
                  </div>
                </div>
                <div className={styles.panelFooter}>
                  {saveStatus === 'success' && (
                    <span style={{ fontSize: '0.85rem', color: '#16a34a', marginRight: '1rem' }}>✓ Saved</span>
                  )}
                  {saveStatus === 'error' && (
                    <span style={{ fontSize: '0.85rem', color: '#ef4444', marginRight: '1rem' }}>✗ Failed</span>
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
            )}

            {/* Project Access */}
            {activeSection === 'access' && (
              <div className={styles.panel} id="access">
                <div className={styles.panelHeader}><h3>Project access</h3></div>
                <div className={styles.panelBody}>
                  <h4>Organization-wide access</h4>
                  <p style={{ marginTop: '0.25rem' }}>All 1 organization members can access this project.</p>
                  <div className={styles.addMemberRow}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Enter User ID or Email address"
                      value={inviteInput}
                      onChange={e => setInviteInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addMemberMutation.mutate(inviteInput.trim())}
                    />
                    <button
                      className={styles.secondaryBtn}
                      disabled={!inviteInput.trim() || addMemberMutation.isPending}
                      onClick={() => addMemberMutation.mutate(inviteInput.trim())}
                    >
                      {addMemberMutation.isPending ? 'Adding...' : 'Add member'}
                    </button>
                  </div>
                  {inviteError && (
                    <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{inviteError}</div>
                  )}
                  <div className={styles.tableBlock} style={{ marginTop: '1.5rem' }}>
                    <div className={styles.tableHeader}>
                      <div className={styles.colName}>Member</div>
                      <div className={styles.colRole}>Role</div>
                    </div>
                    {membersLoading ? (
                      <div className={styles.tableRow}>
                        <div className={styles.colName}>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Loading members…</div>
                        </div>
                      </div>
                    ) : members.length > 0 ? members.map(m => (
                      <div className={styles.tableRow} key={m.user.id}>
                        <div className={styles.colName}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.user.email}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1px' }}>
                            {m.user.email === user?.email ? 'You' : m.user.name ?? 'Member'}
                          </div>
                        </div>
                        <div className={styles.colRole}>{m.role}</div>
                      </div>
                    )) : (
                      <div className={styles.tableRow}>
                        <div className={styles.colName}>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>No members yet. Add one above.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Availability */}
            {activeSection === 'availability' && (
              <div className={styles.panel} id="availability">
                <div className={styles.panelHeader}><h3>Project availability</h3></div>
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
            )}

            {/* Custom Domains */}
            {activeSection === 'domains' && (
              <div className={styles.panel} id="domains">
                <div className={styles.panelHeader}><h3>Custom domains</h3></div>
                <div className={styles.panelBody}>
                  <p>Present a branded experience to your users.</p>
                  <div className={styles.infoBox} style={{ marginTop: '1.25rem' }}>
                    <h4>Custom domains are a Pro Plan add-on</h4>
                    <p style={{ marginTop: '0.35rem' }}>Paid Plans come with free vanity subdomains or Custom Domains for an additional $10/month per domain.</p>
                    <button className={styles.secondaryBtn} style={{ marginTop: '1rem' }}>Upgrade to Pro</button>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeSection === 'advanced' && (
              <>
                <div className={`${styles.panel} ${styles.dangerPanel}`} id="advanced">
                  <div className={styles.panelHeader}><h3>Transfer project</h3></div>
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
                <div className={`${styles.panel} ${styles.dangerPanel}`}>
                  <div className={styles.panelHeader}><h3>Delete project</h3></div>
                  <div className={styles.panelBody}>
                    <p>Permanently remove your project and all of its data.</p>
                    <p className={styles.helperText} style={{ marginTop: '0.5rem' }}>
                      This action is irreversible. All API call logs, configurations, and project data will be deleted permanently.
                    </p>
                  </div>
                  <div className={`${styles.panelFooter} ${styles.dangerFooter}`}>
                    <button
                      className={styles.dangerBtn}
                      onClick={() => { setDeleteConfirmText(''); setShowDeleteModal(true); }}
                    >
                      Delete project
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Confirm deletion of {projectName}</h2>
              <button className={styles.closeBtn} onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.warningBanner}>
                <AlertTriangle size={18} />
                <span>This action cannot be undone.</span>
              </div>
              <p className={styles.modalText}>
                This will permanently delete the <strong>{projectName}</strong> project and all of its data.
              </p>
              <div className={styles.confirmSection}>
                <label>Type <strong>{projectName}</strong> to confirm.</label>
                <input
                  type="text"
                  className={styles.input}
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder="Type the project name here"
                  autoFocus
                />
                <button
                  className={styles.dangerBtnFull}
                  disabled={deleteConfirmText !== projectName}
                  onClick={() => void handleDelete()}
                >
                  I understand, delete this project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
