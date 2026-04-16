'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') ?? '' : '';

interface Project { id: string; name: string; }
interface Summary { total: number; errorRate: number; successRate: number; avgLatency: number; range: string; }
interface EndpointStat { endpoint: string; count: number; errorRate: number; avgLatency: number; }

const RANGES = [
  { label: '1 Hour',  value: '1h'  },
  { label: '24 Hours', value: '24h' },
  { label: '7 Days',  value: '7d'  },
  { label: '30 Days', value: '30d' },
];

function MiniBar({ value, max, cls = '' }: { value: number; max: number; cls?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="chart-bar-track">
      <div className={`chart-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [range, setRange] = useState('24h');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then((d) => { const list = d as Project[]; setProjects(list); if (list.length) setSelectedProject(list[0].id); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/analytics/summary?projectId=${selectedProject}&range=${range}`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${API}/analytics/endpoints?projectId=${selectedProject}`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
    ])
      .then(([s, e]) => { setSummary(s as Summary); setEndpoints((e as EndpointStat[]).slice(0, 10)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedProject, range]);

  const maxCalls = Math.max(...endpoints.map(e => e.count), 1);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Analytics</div>
          <div className="page-subtitle">Performance metrics and endpoint breakdown</div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '16px', padding: '14px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--surface-2)', color: 'var(--text-primary)' }}>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '4px' }}>
          {RANGES.map(r => (
            <button key={r.value} onClick={() => setRange(r.value)}
              className={`btn btn-sm ${range === r.value ? 'btn-primary' : 'btn-outline'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading analytics…</div></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="stat-grid" style={{ marginBottom: '20px' }}>
            <div className="stat-card">
              <div className="stat-icon indigo">📡</div>
              <div className="stat-info"><div className="stat-label">Total Calls</div><div className="stat-value">{summary?.total ?? 0}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info"><div className="stat-label">Success Rate</div><div className="stat-value">{summary?.successRate ?? 0}%</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">⚠️</div>
              <div className="stat-info"><div className="stat-label">Error Rate</div><div className="stat-value">{summary?.errorRate ?? 0}%</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">⚡</div>
              <div className="stat-info"><div className="stat-label">Avg Latency</div><div className="stat-value">{summary?.avgLatency ?? 0}ms</div></div>
            </div>
          </div>

          {/* Endpoint breakdown */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Endpoints by Call Count</span>
              <span className="badge badge-neutral">{endpoints.length} endpoints</span>
            </div>
            <div className="card-body">
              {endpoints.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px' }}>
                  <div className="empty-icon">📊</div>
                  <div className="empty-title">No data yet</div>
                </div>
              ) : (
                <div className="chart-bar-list">
                  {endpoints.map((ep) => (
                    <div key={ep.endpoint} className="chart-bar-row">
                      <div className="chart-bar-label" title={ep.endpoint}>{ep.endpoint}</div>
                      <MiniBar value={ep.count} max={maxCalls} cls={ep.errorRate > 30 ? 'red' : ep.errorRate > 10 ? 'amber' : 'green'} />
                      <div className="chart-bar-count">{ep.count}</div>
                      <span className={`badge badge-sm ${ep.errorRate > 30 ? 'badge-danger' : ep.errorRate > 10 ? 'badge-warning' : 'badge-success'}`} style={{ minWidth: '48px', textAlign: 'center', fontSize: '10px' }}>
                        {ep.errorRate}% err
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', minWidth: '54px', textAlign: 'right' }}>
                        {ep.avgLatency}ms
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
