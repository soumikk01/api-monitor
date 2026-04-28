'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import ProjectSettingsContent from '@/features/dashboard/components/SettingsPage/ProjectSettingsContent';
import styles from './ServicesPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Service {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  _count?: { apiCalls?: number };
}

interface Project {
  id: string;
  name: string;
  serviceMode: string; // 'single' | 'multi'
}

/* ── Animated hex logo ── */
const HexLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" width="18" height="18">
    <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="16" cy="16" r="4" fill="currentColor" />
  </svg>
);

const SingleServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
);

const MultiServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
    <circle cx="12" cy="7.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="7.5" cy="15.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16.5" cy="15.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="7.5" r="1.8" fill="currentColor"/>
    <circle cx="7.5" cy="15.5" r="1.8" fill="currentColor"/>
    <circle cx="16.5" cy="15.5" r="1.8" fill="currentColor"/>
  </svg>
);

/* ── Status dot ── */
const StatusDot = ({ active }: { active?: boolean }) => (
  <span className={`${styles.statusDot} ${active ? styles.statusActive : styles.statusIdle}`} />
);

/* ── Plus icon ── */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ── Arrow right ── */
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Close icon ── */
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Settings icon ── */
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

export default function ServicesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dark } = useTheme();

  const projectId = searchParams.get('projectId') ?? '';
  // Track Project Settings panel via URL param so browser Back works
  const showProjectSettings = searchParams.get('panel') === 'project-settings';

  const openProjectSettings = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('panel', 'project-settings');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const closeProjectSettings = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('panel');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const [project, setProject] = useState<Project | null>(() => {
    // Seed from localStorage so the title never flickers to 'Loading…'
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(`project:${searchParams.get('projectId') ?? ''}`);
    if (!cached) return null;
    try { return JSON.parse(cached) as Project; } catch { return null; }
  });
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  /* ── Fetch project + services in one pass ── */
  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [projRes, svcRes] = await Promise.all([
        fetchWithAuth(`${API}/projects/${projectId}`),
        fetchWithAuth(`${API}/projects/${projectId}/services`),
      ]);

      if (projRes.ok) {
        const proj = await projRes.json() as Project;
        setProject(proj);
        // Cache for instant render next time
        localStorage.setItem(`project:${projectId}`, JSON.stringify(proj));
      }
      if (svcRes.ok) {
        setServices(await svcRes.json() as Service[]);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  /* ── Navigate into service dashboard ── */
  const openService = (serviceId: string) => {
    router.push(`/dashboard?projectId=${projectId}&serviceId=${serviceId}`);
  };

  /* ── Create new service (multi-service mode) ── */
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetchWithAuth(`${API}/projects/${projectId}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newServiceName.trim(),
          description: newServiceDesc.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { message?: string };
        throw new Error(d.message ?? 'Failed to create service');
      }
      setShowCreateModal(false);
      setNewServiceName('');
      setNewServiceDesc('');
      await fetchData();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  const [initializing, setInitializing] = useState(false);

  /* ── Quick-init: create the default service for old single-mode projects ── */
  const initDefaultService = async () => {
    if (!project) return;
    setInitializing(true);
    try {
      const res = await fetchWithAuth(`${API}/projects/${projectId}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `default-service_${project.name}`,
          description: 'Default service',
        }),
      });
      if (res.ok) await fetchData();
    } catch { /* ignore */ } finally {
      setInitializing(false);
    }
  };

  // Treat missing/null serviceMode as 'single' (covers all old projects)
  const serviceMode = project?.serviceMode ?? 'single';
  const isSingle = serviceMode !== 'multi';
  const isMulti = serviceMode === 'multi';


  return (
    <div className={`${styles.page} ${dark ? styles.dark : ''}`}>
      {/* Ambient background */}
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />
      <div className={styles.gridLines} />

      <div className={styles.pageLayout}>
        {/* ── LEFT SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <button className={`${styles.sidebarBtn} ${styles.sidebarBtnSecondary}`} onClick={() => router.push('/projects')}>
              <ArrowRight /> Back to Projects
            </button>
          </nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Show Service Settings only when there's exactly one service or it's single-mode */}
            {services.length > 0 && isSingle && (
              <button
                className={`${styles.sidebarBtn} ${styles.sidebarBtnSecondary}`}
                onClick={() => router.push(`/service-settings?projectId=${projectId}&serviceId=${services[0].id}`)}
              >
                <SettingsIcon /> Service Settings
              </button>
            )}
            <button
              className={`${styles.sidebarBtn} ${styles.sidebarBtnSecondary} ${showProjectSettings ? styles.sidebarBtnActive : ''}`}
              onClick={() => showProjectSettings ? closeProjectSettings() : openProjectSettings()}
            >
              <SettingsIcon /> Project Settings
            </button>
          </div>
        </aside>

        {/* ── When showProjectSettings: replace content with inline settings ── */}
        {showProjectSettings ? (
          <ProjectSettingsContent
            projectId={projectId}
            onBack={closeProjectSettings}
          />
        ) : (

        <main className={styles.content}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div>
            {/* Use cached name — never shows 'Loading…' on revisit */}
            <h1 className={styles.title}>{project?.name ?? ''}</h1>
            {!loading && (
              <p className={styles.subtitle}>
                {isSingle
                  ? 'This project has a single default service. Click to enter the dashboard.'
                  : 'Manage your services. Each service monitors a separate API endpoint group.'}
              </p>
            )}
          </div>

          {/* Add service — only for multi-service mode, only after loaded */}
          {!loading && isMulti && (
            <button className={styles.addBtn} onClick={() => setShowCreateModal(true)}>
              <PlusIcon /> Add Service
            </button>
          )}
        </div>

        {/* ── SERVICES GRID ── */}
        {loading ? (
          /* ── SVG stroke-draw loader ── */
          <div className={styles.loaderWrap}>
            {/* Single service icon draw */}
            {(project === null || isSingle) && (
              <svg
                className={styles.loaderSvg}
                viewBox="0 0 120 120"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Outer circle */}
                <circle className={`${styles.loaderPath} ${styles.loaderPath1}`} cx="60" cy="60" r="46" />
                {/* Inner ring */}
                <circle className={`${styles.loaderPath} ${styles.loaderPath2}`} cx="60" cy="60" r="28" />
                {/* Center dot (filled via stroke trick) */}
                <circle className={`${styles.loaderPath} ${styles.loaderPath3}`} cx="60" cy="60" r="10" />
              </svg>
            )}
            {/* Multi service icon draw */}
            {isMulti && (
              <svg
                className={styles.loaderSvg}
                viewBox="0 0 120 120"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Top circle */}
                <circle className={`${styles.loaderPath} ${styles.loaderPath1}`} cx="60" cy="32" r="22" />
                {/* Bottom-left circle */}
                <circle className={`${styles.loaderPath} ${styles.loaderPath2}`} cx="35" cy="78" r="22" />
                {/* Bottom-right circle */}
                <circle className={`${styles.loaderPath} ${styles.loaderPath3}`} cx="85" cy="78" r="22" />
                {/* Center dots */}
                <circle className={`${styles.loaderPath} ${styles.loaderPath4}`} cx="60" cy="32" r="7" />
                <circle className={`${styles.loaderPath} ${styles.loaderPath5}`} cx="35" cy="78" r="7" />
                <circle className={`${styles.loaderPath} ${styles.loaderPath5}`} cx="85" cy="78" r="7" />
              </svg>
            )}
            <p className={styles.loaderLabel}>
              {project === null ? 'Loading…' : isSingle ? 'Single Service' : 'Multi Service'}
            </p>
          </div>
        ) : isSingle && services.length === 0 ? (
          /* single-mode project with no service yet — one-click setup */
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <div className={styles.emptyOrb} />
              <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                <polygon points="40,8 68,24 68,56 40,72 12,56 12,24"
                  stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
                <circle cx="40" cy="40" r="10" fill="currentColor" opacity="0.12" />
                <line x1="40" y1="32" x2="40" y2="48" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
                <line x1="32" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No service set up yet</h3>
            <p className={styles.emptyText}>
              Click below to initialize the default service for this project.
            </p>
            <button
              className={styles.addBtn}
              onClick={() => void initDefaultService()}
              disabled={initializing}
            >
              {initializing ? 'Setting up…' : <><PlusIcon /> Initialize Default Service</>}
            </button>
          </div>
        ) : isMulti && services.length === 0 ? (
          /* multi-mode — empty state */
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <div className={styles.emptyOrb} />
              <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                <polygon points="40,8 68,24 68,56 40,72 12,56 12,24"
                  stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
                <polygon points="40,18 58,28 58,52 40,62 22,52 22,28"
                  stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
                <circle cx="40" cy="40" r="8" fill="currentColor" opacity="0.15" />
                <line x1="40" y1="32" x2="40" y2="48" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                <line x1="32" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.4" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No services yet</h3>
            <p className={styles.emptyText}>Create your first service to start monitoring API calls</p>
            <button className={styles.addBtn} onClick={() => setShowCreateModal(true)}>
              <PlusIcon /> Create first service
            </button>
          </div>
        ) : (
          /* service cards — works for both single (1 card) and multi (N cards + add card) */
          <div className={styles.grid}>
            {services.map((service, idx) => (
              <div
                key={service.id}
                role="button"
                tabIndex={0}
                className={`${styles.card} ${styles.cardInteractive} ${hoveredCard === service.id ? styles.cardHovered : ''}`}
                onClick={() => openService(service.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openService(service.id);
                  }
                }}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ '--card-delay': `${idx * 0.06}s` } as React.CSSProperties}
              >
                <div className={styles.cardGlow} />
                <div className={styles.cardInner}>
                  <div className={styles.cardTop}>
                    <div className={styles.serviceIconWrap}>
                      {isSingle ? <SingleServiceIcon /> : <MultiServiceIcon />}
                    </div>
                    <StatusDot active />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    {service.description && (
                      <p className={styles.serviceDesc}>{service.description}</p>
                    )}
                    {service.isDefault && !service.description && (
                      <p className={styles.serviceDesc}>Default service for this project</p>
                    )}
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.footerMeta}>
                      {service.isDefault && (
                        <span className={styles.serviceTag}>Default</span>
                      )}
                      <span className={styles.serviceDate}>
                        {new Date(service.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}
                      </span>
                      {service._count?.apiCalls !== undefined && (
                        <span style={{ fontSize: '0.75rem', color: '#6B6B6B', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: '99px', marginLeft: '6px' }}>
                          {service._count.apiCalls} calls
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Connect button — opens Getting Started panel with this service's token */}
                      <button
                        className={styles.connectBtn ?? styles.enterBtn}
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid currentColor',
                          opacity: 0.7,
                          cursor: 'pointer',
                          background: 'transparent',
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // don't trigger card click
                          const params = new URLSearchParams(searchParams.toString());
                          params.set('panel', 'getting-started');
                          params.set('projectId', projectId);
                          params.set('serviceId', service.id);
                          params.set('serviceName', encodeURIComponent(service.name));
                          window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                      >
                        🔑 SDK Token
                      </button>
                      <div className={styles.enterBtn}>
                        Enter <ArrowRight />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add service card — only in multi mode */}
            {isMulti && (
              <button
                className={`${styles.card} ${styles.addCard}`}
                onClick={() => setShowCreateModal(true)}
              >
                <div className={styles.addCardInner}>
                  <div className={styles.addCardIcon}><PlusIcon /></div>
                  <span className={styles.addCardLabel}>Add Service</span>
                </div>
              </button>
            )}
          </div>
        )}
      </main>
        )}

        {/* ── CREATE SERVICE MODAL ── */}
        {showCreateModal && (
          <div className={styles.overlay} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalGlow} />
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <div className={styles.modalTitleIcon}><HexLogo /></div>
                  <h2>New Service</h2>
                </div>
                <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>
                  <CloseIcon />
                </button>
              </div>
              <form onSubmit={e => void handleCreateService(e)} className={styles.modalForm}>
                <div className={styles.field}>
                  <label htmlFor="svc-name" className={styles.fieldLabel}>
                    Service name <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="svc-name"
                    className={styles.fieldInput}
                    placeholder="e.g. payment-api"
                    value={newServiceName}
                    onChange={e => setNewServiceName(e.target.value)}
                    autoFocus
                    maxLength={80}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="svc-desc" className={styles.fieldLabel}>
                    Description <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="svc-desc"
                    className={styles.fieldTextarea}
                    placeholder="What does this service monitor?"
                    value={newServiceDesc}
                    onChange={e => setNewServiceDesc(e.target.value)}
                    rows={3}
                    maxLength={300}
                  />
                </div>
                {createError && <p className={styles.modalError}>{createError}</p>}
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.createBtn}
                    disabled={creating || !newServiceName.trim()}
                  >
                    {creating ? 'Creating…' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
