'use client';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import ProjectSidebar from '@/components/ProjectSidebar/ProjectSidebar';
import ServiceSettingsSidebar from '@/components/ServiceSettingsSidebar/ServiceSettingsSidebar';
import { Shimmer, ShimmerBlock } from '@/components/Shimmer/Shimmer';
import styles from '../SettingsPage/SettingsPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function ServiceSettingsPage() {
  const { dark } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get('projectId') ?? '';
  const serviceId = searchParams.get('serviceId') ?? '';

  const [serviceName, setServiceName] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`svcName:${serviceId}`) ?? '';
  });
  const [serviceDesc, setServiceDesc] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`svcDesc:${serviceId}`) ?? '';
  });
  const [editName,    setEditName]    = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`svcName:${serviceId}`) ?? '';
  });
  const [editDesc,    setEditDesc]    = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`svcDesc:${serviceId}`) ?? '';
  });
  const [isDefault,   setIsDefault]   = useState(false);
  // Start ready if cache available — no loading flash
  const [loadState,   setLoadState]   = useState<'loading' | 'empty' | 'ready'>(() => {
    if (typeof window === 'undefined') return 'loading';
    return localStorage.getItem(`svcName:${serviceId}`) ? 'ready' : 'loading';
  });
  const [activeSection, setActiveSection] = useState('general');

  // Save state
  const [isSaving,   setIsSaving]   = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // SDK Token state
  const [sdkToken,    setSdkToken]    = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`svcToken:${serviceId}`) ?? '';
  });
  const [showToken,         setShowToken]         = useState(false);
  const [tokenCopied,       setTokenCopied]       = useState(false);
  const [regenerating,      setRegenerating]      = useState(false);
  const [showRegenModal,    setShowRegenModal]    = useState(false);
  const [tokenLoading,      setTokenLoading]      = useState(
    // If no cached token, we'll be loading it from the API
    () => typeof window !== 'undefined' && !localStorage.getItem(`svcToken:${serviceId}`)
  );

  // Delete modal state
  const [showDeleteModal,   setShowDeleteModal]   = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting,          setDeleting]          = useState(false);

  // ── Hash-based section navigation ──────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveSection(hash || 'general');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ── Load service data ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!projectId || !serviceId) return;

    void (async () => {
      try {
        const res = await fetchWithAuth(`${API}/projects/${projectId}/services/${serviceId}`);
        // Only show "not found" for a true 404 — 401/5xx are auth/network issues
        if (res.status === 404) { setLoadState('empty'); return; }
        if (!res.ok) {
          console.warn('[ServiceSettings] fetch failed', res.status);
          return; // keep showing cached content
        }
        const svc = await res.json() as { id: string; name: string; description?: string; isDefault: boolean; sdkToken?: string };
        setServiceName(svc.name);
        setServiceDesc(svc.description ?? '');
        setEditName(svc.name);
        setEditDesc(svc.description ?? '');
        setIsDefault(svc.isDefault);
        if (svc.sdkToken) {
          setSdkToken(svc.sdkToken);
          localStorage.setItem(`svcToken:${serviceId}`, svc.sdkToken);
        }
        // Always clear loading — whether or not sdkToken was in the response
        setTokenLoading(false);
        setLoadState('ready');
        // Cache name/desc for instant render on next open
        localStorage.setItem(`svcName:${serviceId}`, svc.name);
        localStorage.setItem(`svcDesc:${serviceId}`, svc.description ?? '');
      } catch {
        // Network error — keep showing cached content if available
        setTokenLoading(false); // never leave shimmer stuck on network failure
        if (!localStorage.getItem(`svcName:${serviceId}`)) setLoadState('empty');
      }
    })();
  }, [projectId, serviceId]);

  // ── Save general settings ───────────────────────────────────────────────────
  const handleSave = async () => {
    const nameChanged = editName.trim() !== serviceName;
    const descChanged = editDesc.trim() !== serviceDesc;
    if (!nameChanged && !descChanged) return;
    if (!editName.trim()) return;

    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetchWithAuth(`${API}/projects/${projectId}/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(nameChanged && { name: editName.trim() }),
          ...(descChanged && { description: editDesc.trim() || undefined }),
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { message?: string };
        throw new Error(d.message ?? 'Failed to save');
      }
      const updated = await res.json() as { name: string; description?: string };
      setServiceName(updated.name);
      setServiceDesc(updated.description ?? '');
      // Update cache so next open shows the new name immediately
      localStorage.setItem(`svcName:${serviceId}`, updated.name);
      localStorage.setItem(`svcDesc:${serviceId}`, updated.description ?? '');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete service ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetchWithAuth(`${API}/projects/${projectId}/services/${serviceId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      localStorage.removeItem(`svcName:${serviceId}`);
      localStorage.removeItem(`svcDesc:${serviceId}`);
      localStorage.removeItem(`svcToken:${serviceId}`);
      router.push(`/services?projectId=${projectId}`);
    } catch {
      setDeleting(false);
    }
  };

  // ── Regenerate SDK token ────────────────────────────────────────────────────
  const handleRegenerateToken = () => {
    setShowRegenModal(true); // open confirmation modal instead of confirm()
  };

  const confirmRegenerate = async () => {
    setShowRegenModal(false);
    setRegenerating(true);
    try {
      const res = await fetchWithAuth(
        `${API}/projects/${projectId}/services/${serviceId}/regenerate-token`,
        { method: 'POST' },
      );
      if (res.ok) {
        const { sdkToken: newToken } = await res.json() as { sdkToken: string };
        setSdkToken(newToken);
        setShowToken(true);       // auto-reveal new token
        setTokenLoading(false);
        localStorage.setItem(`svcToken:${serviceId}`, newToken);
      }
    } catch { /* ignore */ } finally {
      setRegenerating(false);
    }
  };

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(sdkToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const hasChanges = editName.trim() !== serviceName || editDesc.trim() !== serviceDesc;

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
        <div className={styles.ambientOrb1} />
        <div className={styles.ambientOrb2} />
        <div className={styles.gridLines} />
        <ProjectSidebar projectId={projectId || undefined} />
        <ServiceSettingsSidebar projectId={projectId} serviceId={serviceId} />
        <main className={styles.content}>
          <ShimmerBlock>
            <Shimmer width="30%" height={34} borderRadius={6} delay={1} />
            <Shimmer width="52%" height={16} borderRadius={4} delay={1} />
            <Shimmer height={48} borderRadius={8} delay={2} style={{ marginTop: '0.75rem' }} />
            <Shimmer height={56} borderRadius={8} delay={2} />
            <Shimmer height={56} borderRadius={8} delay={3} />
            <Shimmer width="20%" height={36} borderRadius={8} delay={3} style={{ alignSelf: 'flex-end' }} />
          </ShimmerBlock>
        </main>
      </div>
    );
  }

  // ── Empty / not found ───────────────────────────────────────────────────────
  if (loadState === 'empty') {
    return (
      <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
        <div className={styles.ambientOrb1} />
        <div className={styles.ambientOrb2} />
        <div className={styles.gridLines} />
        <ProjectSidebar projectId={projectId || undefined} />
        <ServiceSettingsSidebar projectId={projectId} serviceId={serviceId} />
        <main className={styles.content}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <circle cx="12" cy="12" r="9"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2>Service not found</h2>
            <p>This service may have been deleted or you don&apos;t have access.</p>
            <Link href={`/services?projectId=${projectId}`} className={styles.emptyBtn}>
              ← Back to Services
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />
      <div className={styles.gridLines} />

      <ProjectSidebar projectId={projectId || undefined} />
      <ServiceSettingsSidebar
        projectId={projectId}
        serviceId={serviceId}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* ── Main content ── */}
      <main className={styles.content}>
        <div className={styles.header}>
          <h1>Service Settings</h1>
          <p>Configure <strong>{serviceName}</strong> — name, description, and lifecycle.</p>
        </div>

        {/* ── General ── */}
        {activeSection === 'general' && (
          <div className={styles.panel} id="general">
            <div className={styles.panelHeader}>
              <h3>General Settings</h3>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.formGroup}>
                <label>Service name</label>
                <input
                  className={styles.input}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="e.g. auth-service"
                  disabled={isDefault}
                />
                <p className={styles.helperText}>
                  {isDefault
                    ? 'Default services cannot be renamed.'
                    : 'Used in the dashboard and API references.'}
                </p>
              </div>
              <div className={styles.formGroup}>
                <label>
                  Description{' '}
                  <span style={{ fontWeight: 400, color: '#aaa' }}>(optional)</span>
                </label>
                <input
                  className={styles.input}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="What does this service do?"
                />
                <p className={styles.helperText}>A short description shown in the services list.</p>
              </div>
              <div className={styles.formGroup}>
                <label>Service ID</label>
                <input
                  className={`${styles.input} ${styles.readOnly}`}
                  value={serviceId}
                  readOnly
                />
                <p className={styles.helperText}>Reference used in APIs and SDK configuration.</p>
              </div>
            </div>
            <div className={styles.panelFooter}>
              {saveStatus === 'success' && (
                <span style={{ fontSize: '0.85rem', color: '#16a34a', marginRight: '1rem' }}>
                  ✓ Saved successfully
                </span>
              )}
              {saveStatus === 'error' && (
                <span style={{ fontSize: '0.85rem', color: '#ef4444', marginRight: '1rem' }}>
                  ✗ Failed to save
                </span>
              )}
              <button
                className={styles.primaryBtn}
                onClick={() => void handleSave()}
                disabled={isSaving || !hasChanges || !editName.trim() || isDefault}
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        )}

        {/* ── SDK Token ── */}
        {activeSection === 'sdk' && (
          <div className={styles.panel} id="sdk">
            <div className={styles.panelHeader}>
              <h3>SDK Token</h3>
            </div>
            <div className={styles.panelBody}>
              <p>Use this token to connect <strong>{serviceName}</strong> to the API Nest interceptor.</p>
              <p className={styles.helperText} style={{ marginTop: '0.25rem' }}>
                Keep it secret — anyone with this token can send data to this service.
              </p>
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {tokenLoading ? (
                    /* Shimmer while fetching */
                    <div style={{ flex: 1, height: 42, borderRadius: 8, background: 'linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.06) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  ) : sdkToken ? (
                    /* Token loaded — show masked or real */
                    <input
                      className={`${styles.input} ${styles.readOnly}`}
                      style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#16a34a', flex: 1 }}
                      value={showToken ? sdkToken : ('sdk_' + '•'.repeat(Math.max(0, sdkToken.length - 4)))}
                      readOnly
                    />
                  ) : (
                    /* Token not returned by API — show message */
                    <input
                      className={`${styles.input} ${styles.readOnly}`}
                      style={{ flex: 1, color: '#999', fontStyle: 'italic' }}
                      value="Token unavailable — click Regenerate to create a new one"
                      readOnly
                    />
                  )}
                  <button
                    className={styles.secondaryBtn}
                    onClick={() => setShowToken(v => !v)}
                    style={{ whiteSpace: 'nowrap' }}
                    disabled={tokenLoading || !sdkToken}
                  >
                    {showToken ? 'Hide' : 'Show'}
                  </button>
                  <button
                    className={styles.secondaryBtn}
                    onClick={() => void handleCopyToken()}
                    style={{ whiteSpace: 'nowrap' }}
                    disabled={tokenLoading || !sdkToken}
                  >
                    {tokenCopied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              {sdkToken && (
                <div className={styles.formGroup}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Usage example</label>
                  <pre style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 6, padding: '0.75rem', fontSize: '0.8rem', overflow: 'auto' }}>
                    {'import { apiNest } from ' + "'@api-nest/sdk';" + '\n\n' +
                     'apiNest.init({ token: ' + "'" + (showToken ? sdkToken : 'sdk_' + '•'.repeat(20)) + "'" + ' });'}
                  </pre>
                </div>
              )}
            </div>
            <div className={styles.panelFooter} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <button
                className={styles.secondaryBtn}
                onClick={handleRegenerateToken}
                disabled={regenerating}
              >
                {regenerating ? 'Regenerating…' : '↺ Regenerate Token'}
              </button>
              <p style={{ fontSize: '0.78rem', color: '#ef4444', margin: 0 }}>
                ⚠ Regenerating will invalidate your current token immediately.
              </p>
            </div>
          </div>
        )}

        {/* ── Advanced / Danger Zone ── */}
        {activeSection === 'danger' && (
          <div className={`${styles.panel} ${styles.dangerPanel}`} id="danger">
            <div className={styles.panelHeader}>
              <h3>Delete service</h3>
            </div>
            <div className={styles.panelBody}>
              <p>Permanently remove this service and all associated monitoring data.</p>
              <p className={styles.helperText} style={{ marginTop: '0.5rem' }}>
                {isDefault
                  ? 'The default service cannot be deleted. Delete the project instead.'
                  : 'This action is irreversible. All API call logs for this service will be permanently deleted.'}
              </p>
            </div>
            <div className={`${styles.panelFooter} ${styles.dangerFooter}`}>
              <button
                className={styles.dangerBtn}
                disabled={isDefault}
                onClick={() => { setDeleteConfirmText(''); setShowDeleteModal(true); }}
              >
                Delete service
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Confirm deletion of {serviceName}</h2>
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
                This will permanently delete the <strong>{serviceName}</strong> service and all of
                its monitoring data.
              </p>
              <div className={styles.confirmSection}>
                <label>
                  Type <strong>{serviceName}</strong> to confirm.
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder="Type the service name here"
                  autoFocus
                />
                <button
                  className={styles.dangerBtnFull}
                  disabled={deleteConfirmText !== serviceName || deleting}
                  onClick={() => void handleDelete()}
                >
                  {deleting ? 'Deleting…' : 'I understand, delete this service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Regenerate Token Confirmation Modal ── */}
      {showRegenModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Regenerate SDK Token?</h2>
              <button className={styles.closeBtn} onClick={() => setShowRegenModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.warningBanner}>
                <AlertTriangle size={18} />
                <span>Your current token will be invalidated immediately.</span>
              </div>
              <p className={styles.modalText}>
                Any running apps or services using the current <strong>{serviceName}</strong> SDK token
                will stop sending monitoring data until you update them with the new token.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  className={styles.dangerBtnFull}
                  onClick={() => void confirmRegenerate()}
                >
                  Yes, regenerate token
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setShowRegenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
