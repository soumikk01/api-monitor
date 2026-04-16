'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './LoginPage.module.scss';

/* ── Spring Blossom Background (mirrors LandingPage) ── */
const SpringBackground = () => (
  <div className={styles.springBg} aria-hidden="true">
    {/* Branch top-left */}
    <svg className={styles.branch1} viewBox="0 0 220 180" fill="none">
      <path d="M10,170 Q50,110 90,85 Q120,65 160,52 Q180,45 210,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45"/>
      <path d="M90,85 Q100,62 118,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>
      <path d="M120,65 Q140,42 158,28" stroke="#7C6050" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
      <g transform="translate(120,46)">
        <circle cx="0" cy="-7" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/>
        <circle cx="4.1" cy="5.7" r="5.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-4.1" cy="5.7" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/>
        <circle cx="0" cy="0" r="4" fill="#FFFACD"/><circle cx="0" cy="0" r="1.8" fill="#F6C800"/>
      </g>
      <g transform="translate(93,82)">
        <circle cx="0" cy="-6" r="4.5" fill="#FFD1DC" opacity="0.9"/>
        <circle cx="5.7" cy="-1.9" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="3.5" cy="4.9" r="4.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="-3.5" cy="4.9" r="4.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-5.7" cy="-1.9" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="0" cy="0" r="3.2" fill="#FFFACD"/><circle cx="0" cy="0" r="1.3" fill="#F6C800"/>
      </g>
      <g transform="translate(161,50)">
        <circle cx="0" cy="-5" r="3.5" fill="#FFB7C5" opacity="0.8"/>
        <circle cx="4.7" cy="-1.6" r="3.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="2.9" cy="4.1" r="3.5" fill="#FFB7C5" opacity="0.8"/>
        <circle cx="-2.9" cy="4.1" r="3.5" fill="#FF8FAB" opacity="0.7"/>
        <circle cx="-4.7" cy="-1.6" r="3.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="0" cy="0" r="2.5" fill="#FFFACD"/><circle cx="0" cy="0" r="1" fill="#F6C800"/>
      </g>
      <ellipse cx="140" cy="72" rx="5" ry="3" fill="#FFB7C5" opacity="0.55" transform="rotate(-30 140 72)"/>
    </svg>

    {/* Branch top-right (mirrored) */}
    <svg className={styles.branch2} viewBox="0 0 220 180" fill="none">
      <path d="M210,170 Q170,110 130,85 Q100,65 62,52 Q42,45 12,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M130,85 Q120,62 103,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      <g transform="translate(100,45)">
        <circle cx="0" cy="-7" r="5.5" fill="#FFD1DC" opacity="0.9"/>
        <circle cx="6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="4.1" cy="5.7" r="5.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="-4.1" cy="5.7" r="5.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="0" cy="0" r="4" fill="#FFFACD"/><circle cx="0" cy="0" r="1.8" fill="#F6C800"/>
      </g>
      <g transform="translate(128,82)">
        <circle cx="0" cy="-6" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="5.7" cy="-1.9" r="4.5" fill="#FFD1DC" opacity="0.9"/>
        <circle cx="3.5" cy="4.9" r="4.5" fill="#FFB7C5" opacity="0.8"/>
        <circle cx="-3.5" cy="4.9" r="4.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-5.7" cy="-1.9" r="4.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="0" cy="0" r="3.2" fill="#FFFACD"/><circle cx="0" cy="0" r="1.3" fill="#F6C800"/>
      </g>
      <ellipse cx="65" cy="70" rx="4.5" ry="2.8" fill="#FFB7C5" opacity="0.5" transform="rotate(40 65 70)"/>
    </svg>

    {/* Floating petals */}
    <svg className={`${styles.petal} ${styles.petal1}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5.5" ry="10" fill="#FFB7C5" opacity="0.7" transform="rotate(-20 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal2}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9.5" fill="#FFD1DC" opacity="0.65" transform="rotate(15 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal3}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="4.5" ry="9" fill="#FF8FAB" opacity="0.55" transform="rotate(-35 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal4}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9" fill="#FFB7C5" opacity="0.6" transform="rotate(25 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal5}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5.5" ry="9.5" fill="#FFD1DC" opacity="0.7" transform="rotate(-10 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal6}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="4" ry="8" fill="#FFB7C5" opacity="0.5" transform="rotate(30 7 11)"/></svg>

    {/* Sparkle stars */}
    <svg className={`${styles.sparkle} ${styles.sp1}`} viewBox="0 0 20 20" fill="none"><path d="M10,1 L11.2,8.8 L19,10 L11.2,11.2 L10,19 L8.8,11.2 L1,10 L8.8,8.8 Z" fill="#1A1A1A" opacity="0.65"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp2}`} viewBox="0 0 14 14" fill="none"><path d="M7,1 L7.8,6.2 L13,7 L7.8,7.8 L7,13 L6.2,7.8 L1,7 L6.2,6.2 Z" fill="#1A1A1A" opacity="0.5"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp3}`} viewBox="0 0 18 18" fill="none"><path d="M9,1.5 L10,7.8 L16.5,9 L10,10.2 L9,16.5 L8,10.2 L1.5,9 L8,7.8 Z" fill="#7C6050" opacity="0.4"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp4}`} viewBox="0 0 10 10" fill="none"><path d="M5,0.5 L5.6,4.4 L9.5,5 L5.6,5.6 L5,9.5 L4.4,5.6 L0.5,5 L4.4,4.4 Z" fill="#1A1A1A" opacity="0.45"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp5}`} viewBox="0 0 16 16" fill="none"><path d="M8,1 L9,6.8 L15,8 L9,9.2 L8,15 L7,9.2 L1,8 L7,6.8 Z" fill="#1A1A1A" opacity="0.55"/></svg>

    {/* Standalone blooms */}
    <svg className={styles.bloom1} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="8" r="7.5" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="33.6" cy="15.5" r="7.5" fill="#FFD1DC" opacity="0.75"/>
      <circle cx="30.2" cy="28.6" r="7.5" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="13.8" cy="28.6" r="7.5" fill="#FF8FAB" opacity="0.7"/>
      <circle cx="10.4" cy="15.5" r="7.5" fill="#FFD1DC" opacity="0.75"/>
      <circle cx="22" cy="22" r="7" fill="#FFFACD"/><circle cx="22" cy="22" r="3" fill="#F6C800"/>
    </svg>
    <svg className={styles.bloom2} viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="6" r="5.8" fill="#FFD1DC" opacity="0.85"/>
      <circle cx="26" cy="12" r="5.8" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="23.2" cy="23" r="5.8" fill="#FF8FAB" opacity="0.75"/>
      <circle cx="10.8" cy="23" r="5.8" fill="#FFD1DC" opacity="0.85"/>
      <circle cx="8" cy="12" r="5.8" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="17" cy="17" r="5.5" fill="#FFFACD"/><circle cx="17" cy="17" r="2.2" fill="#F6C800"/>
    </svg>
  </div>
);

export default function LoginPage() {
  const [dark, setDark] = useState(false);
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_DUMMY_EMAIL ?? '');
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_DUMMY_PASSWORD ?? '');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <SpringBackground />

      {/* ── THEME TOGGLE (moon / sun) ── */}
      <button
        id="theme-toggle"
        className={styles.themeToggle}
        onClick={() => setDark((d) => !d)}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={dark ? 'Light mode' : 'Dark mode'}
      >
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* ── NAVBAR ── */}
      <header className={styles.navWrap}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="#1A1A1A"/>
            </svg>
            <span className={styles.logoMark}>N_ARCH</span>
          </div>
          <Link href="/" className={styles.backLink}>← Home</Link>
        </nav>
      </header>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <circle cx="12" cy="8" r="4" stroke="#1A1A1A" strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className={styles.cardTitle}>Welcome back</h1>
            <p className={styles.cardSub}>Sign in to your Neural Architect account</p>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className={styles.input}
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with</span>
            <span className={styles.dividerLine} />
          </div>

          <div className={styles.oauthRow}>
            <button type="button" className={styles.oauthBtn}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className={styles.oauthBtn}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </button>
          </div>

          <div className={styles.utilLinks}>
            <a href="#" className={styles.forgotLink}>Forgot password?</a>
            <Link href="/register" className={styles.registerLink}>
              Create account →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
