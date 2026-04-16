'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') ?? '' : '';

interface UserProfile { id: string; email: string; name?: string; sdkToken: string; }

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [backendUrl, setBackendUrl] = useState(API);
  const [wsUrl, setWsUrl] = useState(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => setUser(d as UserProfile))
      .catch(console.error);
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function logout() {
    localStorage.clear();
    router.push('/');
  }

  const infoRows = [
    { label: 'Backend URL',  value: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1' },
    { label: 'WebSocket URL', value: process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000' },
    { label: 'Admin Panel Port', value: '3001' },
    { label: 'Main App Port',    value: '3000' },
    { label: 'Backend Port',     value: '4000' },
    { label: 'Prisma',           value: 'MongoDB v6' },
    { label: 'CLI Package',      value: 'api-monitor-cli@1.0.0' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Admin panel configuration and system info</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Account info */}
        <div className="card">
          <div className="card-header"><span className="card-title">👤 Account</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div className="form-label">Email</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{user?.email ?? '—'}</div>
            </div>
            <div>
              <div className="form-label">Name</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user?.name ?? 'Not set'}</div>
            </div>
            <div>
              <div className="form-label">User ID</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{user?.id ?? '—'}</div>
            </div>
            <hr style={{ borderColor: 'var(--border)', borderTop: 'none' }} />
            <button className="btn btn-danger" onClick={logout}>
              ⎋ Sign out
            </button>
          </div>
        </div>

        {/* Connection config */}
        <div className="card">
          <div className="card-header"><span className="card-title">🔌 Connection</span></div>
          <div className="card-body">
            <form onSubmit={save}>
              <div className="form-group">
                <label className="form-label">Backend API URL</label>
                <input className="form-input" value={backendUrl} onChange={e => setBackendUrl(e.target.value)} placeholder="http://localhost:4000/api/v1" />
              </div>
              <div className="form-group">
                <label className="form-label">WebSocket URL</label>
                <input className="form-input" value={wsUrl} onChange={e => setWsUrl(e.target.value)} placeholder="http://localhost:4000" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {saved ? '✓ Saved' : 'Save settings'}
              </button>
            </form>
          </div>
        </div>

        {/* System info */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header"><span className="card-title">🖥️ System Information</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
              {infoRows.map(({ label, value }, i) => (
                <div key={label} style={{
                  padding: '12px 16px',
                  borderBottom: i < infoRows.length - 3 ? '1px solid var(--border)' : 'none',
                  borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ gridColumn: '1 / -1', borderColor: 'var(--danger-light)' }}>
          <div className="card-header" style={{ borderColor: 'var(--danger-light)' }}>
            <span className="card-title" style={{ color: 'var(--danger)' }}>⚠️ Danger Zone</span>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>Sign out of admin panel</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>You will be redirected to the login page.</div>
            </div>
            <button className="btn btn-danger" onClick={logout}>Sign out →</button>
          </div>
        </div>
      </div>
    </>
  );
}
