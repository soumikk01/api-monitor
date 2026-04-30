'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? localStorage.getItem('admin_token') ?? '' : '';
}

interface PlatformStats {
  totalUsers: number;
  totalProjects: number;
  totalCalls: number;
  errorRate: number;
  avgLatency: number;
}

interface RecentCall {
  id: string;
  method: string;
  url: string;
  statusCode: number;
  latency: number;
  status: string;
  createdAt: string;
}

function StatCard({ icon, iconClass, label, value, delta, deltaDir }: {
  icon: string; iconClass: string; label: string;
  value: string | number; delta?: string; deltaDir?: 'up' | 'down';
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {delta && <div className={`stat-delta ${deltaDir}`}>{delta}</div>}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recent, setRecent] = useState<RecentCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const t = token();
        const headers = { Authorization: `Bearer ${t}` };

        // Fetch users and projects count
        const [usersRes, projectsRes] = await Promise.all([
          fetch(`${API}/users/me`, { headers }),
          fetch(`${API}/projects`, { headers }),
        ]);

        const projects = (await projectsRes.json()) as { id: string }[];
        const user = (await usersRes.json()) as { id: string };

        // Fetch analytics for first project if available
        let analyticsData = { total: 0, errorRate: 0, avgLatency: 0 };
        if (projects.length > 0) {
          const anRes = await fetch(`${API}/analytics/summary?projectId=${projects[0].id}`, { headers });
          if (anRes.ok) analyticsData = (await anRes.json()) as typeof analyticsData;
        }

        setStats({
          totalUsers: 1,
          totalProjects: projects.length,
          totalCalls: analyticsData.total,
          errorRate: analyticsData.errorRate,
          avgLatency: analyticsData.avgLatency,
        });

        // Fetch recent calls
        if (projects.length > 0) {
          const histRes = await fetch(`${API}/history?projectId=${projects[0].id}&limit=8`, { headers });
          if (histRes.ok) {
            const d = (await histRes.json()) as { data: RecentCall[] };
            setRecent(d.data ?? []);
          }
        }

        void user;
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const latencyClass = (ms: number) =>
    ms < 200 ? 'latency-fast' : ms < 800 ? 'latency-med' : 'latency-slow';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>
        Loading platform data…
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Platform Overview</div>
          <div className="page-subtitle">Real-time summary of all Apio activity</div>
        </div>
        <div className="live-indicator">
          <div className="live-dot" />
          Live
        </div>
      </div>

      {/* Stat grid */}
      <div className="stat-grid">
        <StatCard icon="👤" iconClass="indigo"  label="Total Users"    value={stats?.totalUsers ?? 0}   delta="↑ Your account" deltaDir="up" />
        <StatCard icon="📁" iconClass="blue"    label="Projects"        value={stats?.totalProjects ?? 0} />
        <StatCard icon="📡" iconClass="green"   label="API Calls (24h)" value={stats?.totalCalls ?? 0}  />
        <StatCard icon="⚠️" iconClass="amber"   label="Error Rate"      value={`${stats?.errorRate ?? 0}%`} delta={stats?.errorRate === 0 ? 'All green' : 'Check errors'} deltaDir={stats?.errorRate === 0 ? 'up' : 'down'} />
      </div>

      {/* Recent calls table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent API Calls</span>
          <a href="/dashboard/history" className="btn btn-outline btn-sm">View all →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No API calls yet</div>
              <div className="empty-desc">
                Run <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: '4px' }}>npx apio-cli init --token …</code> in your dev project to start monitoring
              </div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((call) => (
                  <tr key={call.id}>
                    <td><span className={`method-badge method-${call.method}`}>{call.method}</span></td>
                    <td><span className="url-cell">{call.url}</span></td>
                    <td>
                      <span className={`badge badge-${call.statusCode < 400 ? 'success' : call.statusCode < 500 ? 'warning' : 'danger'}`}>
                        {call.statusCode}
                      </span>
                    </td>
                    <td><span className={`latency-cell ${latencyClass(call.latency)}`}>{call.latency}ms</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(call.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
