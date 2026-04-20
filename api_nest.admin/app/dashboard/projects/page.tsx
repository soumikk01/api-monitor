'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? localStorage.getItem('admin_token') ?? '' : '';

interface Project { id: string; name: string; description?: string; createdAt: string; }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  async function reloadProjects() {
    const res = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token()}` } });
    const raw = await res.json();
    setProjects(Array.isArray(raw) ? (raw as Project[]) : []);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token()}` } });
      const raw = await res.json();
      if (!cancelled) { setProjects(Array.isArray(raw) ? (raw as Project[]) : []); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await fetch(`${API}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    setNewName(''); setNewDesc('');
    setCreating(false);
    void reloadProjects();
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project and all its API call history?')) return;
    await fetch(`${API}/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    void reloadProjects();
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Projects</div>
          <div className="page-subtitle">All monitoring projects across the platform</div>
        </div>
      </div>

      {/* Create project form */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header"><span className="card-title">➕ New Project</span></div>
        <div className="card-body">
          <form onSubmit={createProject} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Project name</label>
              <input className="form-input" placeholder="My API Project" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            </div>
            <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
              <label className="form-label">Description (optional)</label>
              <input className="form-input" placeholder="What APIs does this project monitor?" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating} style={{ flexShrink: 0, height: '38px' }}>
              {creating ? 'Creating…' : 'Create project'}
            </button>
          </form>
        </div>
      </div>

      {/* Projects table */}
      <div className="card">
        <div className="card-header"><span className="card-title">All Projects</span><span className="badge badge-neutral">{projects.length}</span></div>
        {loading ? (
          <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading…</div></div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <div className="empty-title">No projects yet</div>
            <div className="empty-desc">Create your first project above and run the CLI init command to start monitoring.</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.description ?? '—'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProject(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
