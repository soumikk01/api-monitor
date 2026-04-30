'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? localStorage.getItem('admin_token') ?? '' : '';

interface ApiCall {
  id: string; method: string; url: string; host: string; path: string;
  statusCode?: number; latency: number; status: string; createdAt: string;
}
interface Project { id: string; name: string; }

export default function HistoryPage() {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? (d as Project[]) : [];
        setProjects(list);
        if (list.length) setSelectedProject(list[0].id);
        if (!Array.isArray(d)) console.warn('[apio] /projects returned non-array:', d);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    let cancelled = false;
    const params = new URLSearchParams({ projectId: selectedProject, page: String(page), limit: '25' });
    if (statusFilter) params.set('status', statusFilter);
    if (methodFilter) params.set('method', methodFilter);
    void (async () => {
      if (!cancelled) setLoading(true);
      try {
        const d = await fetch(`${API}/history?${params}`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json());
        if (cancelled) return;
        const res = d as { data: ApiCall[]; meta: { total: number; totalPages: number } };
        setCalls(res.data ?? []);
        setTotal(res.meta?.total ?? 0);
        setTotalPages(res.meta?.totalPages ?? 1);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedProject, page, statusFilter, methodFilter]);

  const latencyClass = (ms: number) => ms < 200 ? 'latency-fast' : ms < 800 ? 'latency-med' : 'latency-slow';
  const statusBadge = (code?: number) => !code ? 'badge-neutral' : code < 400 ? 'badge-success' : code < 500 ? 'badge-warning' : 'badge-danger';

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">API Call History</div>
          <div className="page-subtitle">{total.toLocaleString()} total calls recorded</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '16px', padding: '14px 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setPage(1); }}
          style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--surface-2)', color: 'var(--text-primary)' }}>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--surface-2)', color: 'var(--text-primary)' }}>
          <option value=''>All statuses</option>
          <option value='SUCCESS'>✅ Success</option>
          <option value='CLIENT_ERROR'>⚠️ 4xx Client Error</option>
          <option value='SERVER_ERROR'>🔴 5xx Server Error</option>
        </select>
        <select value={methodFilter} onChange={e => { setMethodFilter(e.target.value); setPage(1); }}
          style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--surface-2)', color: 'var(--text-primary)' }}>
          <option value=''>All methods</option>
          {['GET','POST','PUT','PATCH','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading…</div></div>
        ) : calls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🕐</div>
            <div className="empty-title">No calls found</div>
            <div className="empty-desc">Try changing your filters or make some API calls from your monitored app.</div>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr><th>Time</th><th>Method</th><th>Endpoint</th><th>Status</th><th>Latency</th></tr>
              </thead>
              <tbody>
                {calls.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                    <td><span className={`method-badge method-${c.method}`}>{c.method}</span></td>
                    <td><span className="url-cell" title={c.url}><span style={{ color: 'var(--text-muted)' }}>{c.host}</span>{c.path}</span></td>
                    <td><span className={`badge ${statusBadge(c.statusCode)}`}>{c.statusCode ?? '—'}</span></td>
                    <td><span className={`latency-cell ${latencyClass(c.latency)}`}>{c.latency}ms</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Page {page} of {totalPages} · {total} calls</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
