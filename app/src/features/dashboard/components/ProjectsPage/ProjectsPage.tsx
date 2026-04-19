'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from './ProjectsPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

type SortKey = 'name' | 'createdAt';
type ViewMode = 'grid' | 'list';

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
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

/* ── Sidebar nav icons ── */
const SideIcons = {
  users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/>
    </svg>
  ),
  activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  folder: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="18" height="18">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" opacity="0.9"/>
    </svg>
  ),
  settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [view, setView] = useState<ViewMode>('grid');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  /* ── redirect if not authenticated ── */
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  /* ── fetch projects ── */
  const fetchProjects = useCallback(async () => {
    const token = localStorage.getItem('access_token');
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

  /* ── create project ── */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setCreateError('');
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() || undefined }),
      });
      if (!res.ok) {
        const d = await res.json() as { message?: string };
        throw new Error(d.message ?? 'Failed to create project');
      }
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      await fetchProjects();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  /* ── delete project ── */
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${API}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch { /* ignore */ }
    setDeleteTarget(null);
  };

  /* ── filtered + sorted list ── */
  const filtered = projects
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const initials = (name: string) => name.slice(0, 2).toUpperCase();

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <nav className={styles.sideNav}>
          <button className={styles.sideBtn} title="Team" onClick={() => router.push('/overview')}>
            <SideIcons.users />
          </button>
          <button className={styles.sideBtn} title="Activity" onClick={() => router.push('/overview')}>
            <SideIcons.activity />
          </button>
          <button className={styles.sideBtn} title="Analytics" onClick={() => router.push('/overview')}>
            <SideIcons.chart />
          </button>
          <button className={`${styles.sideBtn} ${styles.sideBtnActive}`} title="Projects">
            <SideIcons.folder />
          </button>
          <button className={styles.sideBtn} title="Settings" onClick={() => router.push('/settings')}>
            <SideIcons.settings />
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <button
            className={styles.avatarBtn}
            title={user?.name || user?.email}
            onClick={() => { logout(); router.push('/login'); }}
          >
            {(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Projects</h1>
          <div className={styles.headerActions}>
            {/* Search */}
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}><SearchIcon /></span>
              <input
                id="project-search"
                className={styles.searchInput}
                placeholder="Search for a project"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Status / Sort */}
            <div className={styles.filterGroup}>
              <button className={styles.filterBtn}>
                Status <span className={styles.caret}>▾</span>
              </button>
              <button
                className={styles.filterBtn}
                onClick={() => setSort(s => s === 'name' ? 'createdAt' : 'name')}
              >
                {sort === 'name' ? 'Sorted by name' : 'Sorted by date'} <span className={styles.caret}>▾</span>
              </button>
            </div>

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
            <button id="new-project-btn" className={styles.newBtn} onClick={() => setShowModal(true)}>
              <PlusIcon /> New project
            </button>
          </div>
        </div>

        {/* Project cards */}
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.spinner} />
            <p>Loading projects…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><FolderIcon /></div>
            <p className={styles.emptyTitle}>
              {search ? 'No projects match your search' : 'No projects yet'}
            </p>
            {!search && (
              <button className={styles.newBtn} onClick={() => setShowModal(true)}>
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
                onClick={() => router.push(`/overview?projectId=${project.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && router.push(`/overview?projectId=${project.id}`)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{project.name}</span>
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
                        onClick={() => { setOpenMenu(null); router.push(`/overview?projectId=${project.id}`); }}
                      >
                        Open project
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
                  <div className={styles.cardInitials}>{initials(project.name)}</div>
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
              <h2>Create a new project</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><CloseIcon /></button>
            </div>
            <form onSubmit={handleCreate} className={styles.modalForm}>
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
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button id="create-project-submit" type="submit" className={styles.createBtn} disabled={creating || !newName.trim()}>
                  {creating ? 'Creating…' : 'Create project'}
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
