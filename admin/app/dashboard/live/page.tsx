'use client';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WS = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface LiveCall {
  id: string;
  method: string;
  url: string;
  statusCode?: number;
  latency: number;
  status: string;
  createdAt: string;
  host: string;
  path: string;
}

const MAX_FEED = 100; // keep last 100 calls in memory

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') ?? '' : '';
}

function statusClass(code?: number) {
  if (!code) return 'badge-neutral';
  if (code < 400) return 'badge-success';
  if (code < 500) return 'badge-warning';
  return 'badge-danger';
}

const latencyClass = (ms: number) =>
  ms < 200 ? 'latency-fast' : ms < 800 ? 'latency-med' : 'latency-slow';

export default function LiveFeedPage() {
  const [calls, setCalls] = useState<LiveCall[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const pausedRef = useRef(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Load projects
  useEffect(() => {
    fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((data) => {
        const list = data as { id: string; name: string }[];
        setProjects(list);
        if (list.length > 0) setSelectedProject(list[0].id);
      })
      .catch(console.error);
  }, []);

  // Connect WebSocket when project selected
  useEffect(() => {
    if (!selectedProject) return;

    const sock = io(WS, { path: '/ws', transports: ['websocket'] });
    socketRef.current = sock;

    sock.on('connect', () => {
      setConnected(true);
      sock.emit('join:project', {
        projectId: selectedProject,
        token: `Bearer ${token()}`,
      });
    });

    sock.on('disconnect', () => setConnected(false));

    sock.on('api:call', (call: LiveCall) => {
      if (pausedRef.current) return;
      setCalls((prev) => [call, ...prev].slice(0, MAX_FEED));
      // Auto-scroll to top
      if (feedRef.current) {
        feedRef.current.scrollTop = 0;
      }
    });

    return () => { sock.disconnect(); };
  }, [selectedProject]);

  function togglePause() {
    pausedRef.current = !paused;
    setPaused(!paused);
  }

  function clearFeed() { setCalls([]); }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Live API Feed</div>
          <div className="page-subtitle">Real-time stream of all intercepted HTTP calls</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className={`live-indicator`} style={{ background: connected ? 'var(--success-light)' : 'var(--danger-light)', color: connected ? 'var(--success)' : 'var(--danger)' }}>
            <div className="live-dot" style={{ background: connected ? 'var(--success)' : 'var(--danger)' }} />
            {connected ? 'Connected' : 'Disconnected'}
          </div>
          <button className="btn btn-outline btn-sm" onClick={togglePause}>
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={clearFeed}>✕ Clear</button>
        </div>
      </div>

      {/* Project selector */}
      <div className="card" style={{ marginBottom: '16px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Monitoring project:</span>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px', background: 'var(--surface-2)', color: 'var(--text-primary)', outline: 'none' }}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
          {calls.length} calls captured
        </span>
      </div>

      {/* Feed */}
      <div className="card">
        <div ref={feedRef} style={{ overflowX: 'auto', maxHeight: '65vh', overflowY: 'auto' }}>
          {calls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📡</div>
              <div className="empty-title">Waiting for API calls…</div>
              <div className="empty-desc">
                Make HTTP requests from your monitored dev app and they'll appear here instantly.
              </div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Method</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call, i) => (
                  <tr key={call.id ?? i} style={{ opacity: paused ? 0.6 : 1 }}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {new Date(call.createdAt).toLocaleTimeString()}
                    </td>
                    <td><span className={`method-badge method-${call.method}`}>{call.method}</span></td>
                    <td>
                      <span className="url-cell" title={call.url}>
                        <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>{call.host}</span>
                        {call.path}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${statusClass(call.statusCode)}`}>
                        {call.statusCode ?? '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`latency-cell ${latencyClass(call.latency)}`}>
                        {call.latency}ms
                      </span>
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
