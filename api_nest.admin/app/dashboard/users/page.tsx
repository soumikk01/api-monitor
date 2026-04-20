'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? localStorage.getItem('admin_token') ?? '' : '';

interface UserProfile { id: string; email: string; name?: string; sdkToken: string; createdAt: string; }
interface CliCommand { command: string; token: string; instructions: string; }

export default function UsersPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cliCmd, setCliCmd] = useState<CliCommand | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = token();
    const headers = { Authorization: `Bearer ${t}` };
    Promise.all([
      fetch(`${API}/users/me`, { headers }).then(r => r.json()),
      fetch(`${API}/users/me/command`, { headers }).then(r => r.json()),
    ])
      .then(([u, cmd]) => { setUser(u as UserProfile); setCliCmd(cmd as CliCommand); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function regenerate() {
    if (!confirm('Regenerate SDK token? Existing CLI sessions will stop working.')) return;
    const res = await fetch(`${API}/users/me/regenerate-token`, {
      method: 'POST', headers: { Authorization: `Bearer ${token()}` },
    });
    const d = (await res.json()) as CliCommand;
    setCliCmd(d);
  }

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading…</div></div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-subtitle">User accounts and SDK token management</div>
        </div>
      </div>

      {/* Profile card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div className="card card-body" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: 'white' }}>
              {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{user?.name ?? 'Admin User'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{user?.email}</div>
            </div>
            <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>Admin</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'User ID', value: user?.id ?? '—' },
              { label: 'Joined',  value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SDK Token card */}
        <div className="card card-body" style={{ padding: '24px' }}>
          <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>🔑 SDK Token</div>
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)',
            wordBreak: 'break-all', lineHeight: 1.6, marginBottom: '12px'
          }}>
            {user?.sdkToken ?? '—'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => copy(user?.sdkToken ?? '')}>
              {copied ? '✓ Copied' : 'Copy token'}
            </button>
            <button className="btn btn-danger btn-sm" onClick={regenerate}>Regenerate</button>
          </div>
        </div>
      </div>

      {/* CLI Command card */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🖥️ CLI Init Command</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Run this in your dev project root</span>
        </div>
        <div className="card-body">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {cliCmd?.instructions}
          </div>
          <div style={{
            background: 'var(--sidebar-bg)', borderRadius: 'var(--radius-md)',
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
            fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#a5b4fc'
          }}>
            <span style={{ color: '#64748b', userSelect: 'none' }}>$</span>
            <span style={{ flex: 1, wordBreak: 'break-all' }}>{cliCmd?.command}</span>
            <button
              onClick={() => copy(cliCmd?.command ?? '')}
              className="btn btn-outline btn-sm"
              style={{ flexShrink: 0, color: 'var(--text-muted)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
