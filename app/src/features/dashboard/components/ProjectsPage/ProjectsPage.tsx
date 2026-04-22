'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Folders } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { authStorage } from '@/lib/fetchWithAuth';
import styles from './ProjectsPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  _count?: { apiCalls: number };
}

type SortKey = 'name' | 'createdAt';
type ViewMode = 'grid' | 'list';

/* ── Spring Blossom Background (shared with auth, dialed back) ── */
const SpringBackground = () => null;

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

export default function ProjectsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  
  const { dark } = useTheme();
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

  /* ── create project ── */
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

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <div className={styles.dotPattern} />
      <SpringBackground />

      {/* ── MAIN AREA ── */}
      <main className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Folders className={styles.titleIcon} size={28} strokeWidth={2} />
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
            <button id="new-project-btn" className={styles.newBtn} onClick={() => setShowModal(true)}>
              <PlusIcon /> New project
            </button>
          </div>
        </div>

        {/* Project cards */}
        {isInitialLoading ? (
          <div className={`${styles.grid} ${view === 'list' ? styles.gridList : ''}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.skeletonText} ${styles.skeletonTitle}`} />
                </div>
                <div className={`${styles.skeletonText} ${styles.skeletonDesc}`} />
                <div className={styles.cardFooter}>
                  <div className={`${styles.skeletonText} ${styles.skeletonDate}`} />
                  <div className={`${styles.skeletonText} ${styles.skeletonBadge}`} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
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
                onClick={() => router.push(`/dashboard?projectId=${project.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && router.push(`/dashboard?projectId=${project.id}`)}
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
                        onClick={() => { setOpenMenu(null); router.push(`/dashboard?projectId=${project.id}`); }}
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
