'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_DUMMY_EMAIL ?? '');
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_DUMMY_PASSWORD ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { accessToken?: string; message?: string };
      if (!res.ok) throw new Error(data.message ?? 'Login failed');
      localStorage.setItem('admin_token', data.accessToken!);
      localStorage.setItem('access_token', data.accessToken!); // needed for WebSocket auth
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">📡</div>
          <h1>API Nest<br />Admin Panel</h1>
          <p>
            Full visibility into every API call across all users and projects.
            Real-time monitoring, analytics, and platform management in one place.
          </p>
          <div className="login-features">
            {[
              'Live API call feed across all projects',
              'User management and access control',
              'Platform-wide analytics and error rates',
              'Per-user SDK token management',
            ].map((f) => (
              <div key={f} className="login-feature">
                <div className="login-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-box">
          <h2>Welcome back</h2>
          <p>Sign in to your admin account</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-light)',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
            Admin access only · API Nest Platform
          </p>
        </div>
      </div>
    </div>
  );
}
