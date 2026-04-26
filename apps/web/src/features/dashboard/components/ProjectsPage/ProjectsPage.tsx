'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { authStorage } from '@/lib/fetchWithAuth';
import styles from './ProjectsPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Project {
  id: string;
  name: string;
  description?: string;
  serviceMode?: 'single' | 'multi';
  createdAt: string;
  _count?: { apiCalls: number };
}

type SortKey = 'name' | 'createdAt';
type ViewMode = 'grid' | 'list';

/* ── Projects heading icon ── */
const ProjectsIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" width="28" height="28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Bottom layer outline */}
    <rect x="2" y="11" width="24" height="14" rx="2.5"/>
    {/* Middle layer outline */}
    <rect x="4.5" y="7" width="19" height="14" rx="2"/>
    {/* Top layer outline */}
    <rect x="7" y="3" width="14" height="14" rx="1.5"/>
    {/* Lines inside top card */}
    <line x1="10" y1="8" x2="18" y2="8"/>
    <line x1="10" y1="11" x2="15.5" y2="11"/>
  </svg>
);

/* ── Spring Blossom Background (shared with auth, dialed back) ── */

/* ── Icon helpers ── */
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
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

export default function ProjectsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  
  const { dark } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [iconAnimDone, setIconAnimDone] = useState(false);
  const titleIconRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [view, setView] = useState<ViewMode>('grid');
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [serviceMode, setServiceMode] = useState<'single' | 'multi'>('single');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Edit (rename) state
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState('');


  /* ── fetch projects ── */
  const fetchProjects = useCallback(async () => {
    const token = authStorage.getAccessToken();
    if (!token) return;
    try {
      const res = await fetch(`${API}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json() as Project[];
      setProjects(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchProjects(); }, [fetchProjects]);

  /* ── close menu on outside click ── */
  useEffect(() => {
    const handler = () => setOpenMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  /* ── open modal (reset to step 1) ── */
  const openCreateModal = () => {
    setModalStep(1);
    setServiceMode('single');
    setNewName('');
    setNewDesc('');
    setCreateError('');
    setShowModal(true);
  };

  /* ── create project + navigate to services ── */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setCreateError('');
    const token = authStorage.getAccessToken();
    try {
      const res = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDesc.trim() || undefined,
          serviceMode,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { message?: string };
        throw new Error(d.message ?? 'Failed to create project');
      }
      const created = await res.json() as { id: string };
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      // Navigate to the services page for the new project
      router.push(`/services?projectId=${created.id}`);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  /* ── delete project ── */
  const handleDelete = async (id: string) => {
    const token = authStorage.getAccessToken();
    try {
      await fetch(`${API}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch { /* ignore */ }
    setDeleteTarget(null);
  };

  /* ── rename / update project ── */
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    setEditing(true);
    setEditError('');
    const token = authStorage.getAccessToken();
    try {
      const res = await fetch(`${API}/projects/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() || undefined }),
      });
      if (!res.ok) {
        const d = await res.json() as { message?: string };
        throw new Error(d.message ?? 'Failed to update project');
      }
      setEditTarget(null);
      await fetchProjects();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setEditing(false);
    }
  };

  /* ── filtered + sorted list ── */
  const filtered = projects
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const initials = (name: string) => name.slice(0, 2).toUpperCase();

  const isInitialLoading = authLoading || loading;

  /* Fly animation: once loading done, after a brief moment trigger fly-to-header */
  useEffect(() => {
    if (!isInitialLoading && !iconAnimDone) {
      const t = setTimeout(() => setIconAnimDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [isInitialLoading, iconAnimDone]);

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />
      <div className={styles.gridLines} />

      {/* ── MAIN AREA ── */}
      <main className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div ref={titleIconRef} className={`${styles.titleIconWrap} ${!isInitialLoading && iconAnimDone ? styles.titleIconVisible : styles.titleIconHidden}`}>
              <ProjectsIcon />
            </div>
            <h1 className={styles.title}>Projects</h1>
          </div>
          <div className={styles.headerActions}>
            {/* Search */}
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}><SearchIcon /></span>
              <input
                id="project-search"
                className={styles.searchInput}
                placeholder="Search projects"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <button
              className={styles.filterBtn}
              onClick={() => setSort(s => s === 'name' ? 'createdAt' : 'name')}
            >
              {sort === 'name' ? 'Sorted by name' : 'Sorted by date'} <span className={styles.caret}>▾</span>
            </button>

            {/* View toggle */}
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
                onClick={() => setView('grid')}
                title="Grid view"
              >
                <GridIcon />
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
                onClick={() => setView('list')}
                title="List view"
              >
                <ListIcon />
              </button>
            </div>

            {/* New project */}
            <button id="new-project-btn" className={styles.newBtn} onClick={openCreateModal}>
              <PlusIcon /> New project
            </button>
          </div>
        </div>

        {/* Project cards */}
        {isInitialLoading ? (
          /* ── SVG draw-in loader ── */
          <div className={styles.loaderWrap}>
            <svg
              className={styles.loaderSvg}
              viewBox="0 0 140 140"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Bottom layer */}
              <rect className={`${styles.loaderPath} ${styles.loaderPath1}`} x="10" y="55" rx="10" width="120" height="75" />
              {/* Middle layer */}
              <rect className={`${styles.loaderPath} ${styles.loaderPath2}`} x="22" y="35" rx="8" width="96" height="75" />
              {/* Top layer */}
              <rect className={`${styles.loaderPath} ${styles.loaderPath3}`} x="35" y="15" rx="7" width="70" height="75" />
              {/* Line 1 */}
              <line className={`${styles.loaderPath} ${styles.loaderPath4}`} x1="50" y1="38" x2="90" y2="38" />
              {/* Line 2 */}
              <line className={`${styles.loaderPath} ${styles.loaderPath5}`} x1="50" y1="52" x2="78" y2="52" />
            </svg>
            <p className={styles.loaderLabel}>Loading projects…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>
              {search ? 'No projects match your search' : 'No projects yet'}
            </p>
            {!search && (
              <button className={styles.newBtn} onClick={openCreateModal}>
                <PlusIcon /> Create your first project
              </button>
            )}
          </div>
        ) : (
          <div className={`${styles.grid} ${view === 'list' ? styles.gridList : ''}`}>
            {filtered.map(project => (
              <div
                key={project.id}
                className={styles.card}
                onClick={() => router.push(`/services?projectId=${project.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && router.push(`/services?projectId=${project.id}`)}
              >
                <div className={styles.cardHeader}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className={styles.cardName}>{project.name}</span>
                    <div className={styles.serviceBadge}>
                      {project.serviceMode === 'multi' ? <MultiServiceIcon /> : <SingleServiceIcon />}
                      {project.serviceMode === 'multi' ? 'Multi Service' : 'Single Service'}
                    </div>
                  </div>
                  <button
                    className={styles.menuBtn}
                    onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === project.id ? null : project.id); }}
                    title="Options"
                  >
                    <DotsIcon />
                  </button>
                  {openMenu === project.id && (
                    <div className={styles.dropdown} onClick={e => e.stopPropagation()}>
                      <button
                        className={styles.dropItem}
                        onClick={() => { setOpenMenu(null); router.push(`/services?projectId=${project.id}`); }}
                      >
                        Open project
                      </button>
                      <button
                        className={styles.dropItem}
                        onClick={() => {
                          setOpenMenu(null);
                          setEditTarget(project);
                          setEditName(project.name);
                          setEditDesc(project.description ?? '');
                          setEditError('');
                        }}
                      >
                        Rename
                      </button>
                      <button
                        className={`${styles.dropItem} ${styles.dropItemDanger}`}
                        onClick={() => { setOpenMenu(null); setDeleteTarget(project.id); }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {project.description && (
                  <p className={styles.cardDesc}>{project.description}</p>
                )}

                <div className={styles.cardFooter}>
                  <span className={styles.cardMeta}>
                    Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {project._count !== undefined && (
                      <span style={{ fontSize: '0.75rem', color: '#6B6B6B', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: '99px' }}>
                        {project._count.apiCalls} calls
                      </span>
                    )}
                    <div className={styles.cardInitials}>{initials(project.name)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── CREATE PROJECT MODAL ── */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{modalStep === 1 ? 'Choose project type' : 'Create a new project'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><CloseIcon /></button>
            </div>

            {modalStep === 1 ? (
              /* ── STEP 1: Pick service mode ── */
              <div className={styles.serviceTypeStep}>
                <p className={styles.serviceTypeHint}>How will this project be structured?</p>
                <div className={styles.serviceTypeGrid}>
                  <button
                    type="button"
                    className={`${styles.serviceTypeCard} ${serviceMode === 'single' ? styles.serviceTypeCardActive : ''}`}
                    onClick={() => setServiceMode('single')}
                  >
                    <div className={styles.serviceTypeIcon}>
                      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className={styles.serviceTypeLabel}>Single Service</div>
                    <div className={styles.serviceTypeDesc}>One default service auto-created for you</div>
                  </button>
                  <button
                    type="button"
                    className={`${styles.serviceTypeCard} ${serviceMode === 'multi' ? styles.serviceTypeCardActive : ''}`}
                    onClick={() => setServiceMode('multi')}
                  >
                    <div className={styles.serviceTypeIcon}>
                      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                        <circle cx="12" cy="7.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="7.5" cy="15.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="16.5" cy="15.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="7.5" r="1.8" fill="currentColor"/>
                        <circle cx="7.5" cy="15.5" r="1.8" fill="currentColor"/>
                        <circle cx="16.5" cy="15.5" r="1.8" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className={styles.serviceTypeLabel}>Multi Service</div>
                    <div className={styles.serviceTypeDesc}>Create and manage multiple services</div>
                  </button>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="button" className={styles.createBtn} onClick={() => setModalStep(2)}>
                    Continue →
                  </button>
                </div>
              </div>
            ) : (
              /* ── STEP 2: Name + description ── */
              <form onSubmit={e => void handleCreate(e)} className={styles.modalForm}>
                <div className={styles.serviceModeBadge}>
                  {serviceMode === 'single' ? '⬤ Single Service' : '⬤ Multi Service'}
                </div>
                <div className={styles.field}>
                  <label htmlFor="proj-name" className={styles.fieldLabel}>Project name <span className={styles.required}>*</span></label>
                  <input
                    id="proj-name"
                    className={styles.fieldInput}
                    placeholder="e.g. my-backend-api"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    autoFocus
                    maxLength={80}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="proj-desc" className={styles.fieldLabel}>Description <span className={styles.optional}>(optional)</span></label>
                  <textarea
                    id="proj-desc"
                    className={styles.fieldTextarea}
                    placeholder="What does this project monitor?"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    rows={3}
                    maxLength={300}
                  />
                </div>
                {createError && <p className={styles.modalError}>{createError}</p>}
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setModalStep(1)}>← Back</button>
                  <button id="create-project-submit" type="submit" className={styles.createBtn} disabled={creating || !newName.trim()}>
                    {creating ? 'Creating…' : 'Create project'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── EDIT / RENAME MODAL ── */}
      {editTarget && (
        <div className={styles.overlay} onClick={() => setEditTarget(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Rename project</h2>
              <button className={styles.closeBtn} onClick={() => setEditTarget(null)}><CloseIcon /></button>
            </div>
            <form onSubmit={e => void handleEdit(e)} className={styles.modalForm}>
              <div className={styles.field}>
                <label htmlFor="edit-name" className={styles.fieldLabel}>Project name <span className={styles.required}>*</span></label>
                <input
                  id="edit-name"
                  className={styles.fieldInput}
                  placeholder="e.g. my-backend-api"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                  maxLength={80}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="edit-desc" className={styles.fieldLabel}>Description <span className={styles.optional}>(optional)</span></label>
                <textarea
                  id="edit-desc"
                  className={styles.fieldTextarea}
                  placeholder="What does this project monitor?"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  maxLength={300}
                />
              </div>
              {editError && <p className={styles.modalError}>{editError}</p>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setEditTarget(null)}>Cancel</button>
                <button type="submit" className={styles.createBtn} disabled={editing || !editName.trim()}>
                  {editing ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteTarget && (
        <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Delete project</h2>
              <button className={styles.closeBtn} onClick={() => setDeleteTarget(null)}><CloseIcon /></button>
            </div>
            <p className={styles.deleteWarning}>
              This will permanently delete the project and all its monitoring data. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className={styles.deleteBtn} onClick={() => void handleDelete(deleteTarget)}>
                Delete project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
