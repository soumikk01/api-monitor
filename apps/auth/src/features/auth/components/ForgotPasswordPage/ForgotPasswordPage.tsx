'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './ForgotPasswordPage.module.scss';

/* ── Spring Blossom Background (mirrors LandingPage) ── */
/* ── Sparkle Background (mirrors LandingPage stars) ── */
const SpringBackground = () => (
  <div className={styles.springBg} aria-hidden="true">
    <svg className={`${styles.sparkle} ${styles.sp1}`} viewBox="0 0 20 20" fill="none"><path d="M10,1 L11.2,8.8 L19,10 L11.2,11.2 L10,19 L8.8,11.2 L1,10 L8.8,8.8 Z" fill="#1A1A1A" opacity="0.65"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp2}`} viewBox="0 0 14 14" fill="none"><path d="M7,1 L7.8,6.2 L13,7 L7.8,7.8 L7,13 L6.2,7.8 L1,7 L6.2,6.2 Z" fill="#1A1A1A" opacity="0.5"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp3}`} viewBox="0 0 18 18" fill="none"><path d="M9,1.5 L10,7.8 L16.5,9 L10,10.2 L9,16.5 L8,10.2 L1.5,9 L8,7.8 Z" fill="#7C6050" opacity="0.4"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp4}`} viewBox="0 0 10 10" fill="none"><path d="M5,0.5 L5.6,4.4 L9.5,5 L5.6,5.6 L5,9.5 L4.4,5.6 L0.5,5 L4.4,4.4 Z" fill="#1A1A1A" opacity="0.45"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp5}`} viewBox="0 0 16 16" fill="none"><path d="M8,1 L9,6.8 L15,8 L9,9.2 L8,15 L7,9.2 L1,8 L7,6.8 Z" fill="#1A1A1A" opacity="0.55"/></svg>
  </div>
);

export default function ForgotPasswordPage() {
  // dark mode is always on — no toggle needed

  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleInvalid = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your account email.');
      handleInvalid();
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate network
      setStep(2);
    } catch {
      setError('Failed to send OTP. Please try again.');
      handleInvalid();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the verification OTP.');
      handleInvalid();
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate network
      router.push('/login');
    } catch {
      setError('Invalid or expired OTP. Please try again.');
      handleInvalid();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.page} ${styles.dark}`}>
      <div className={styles.patternOverlay} />
      <div className={styles.noiseOverlay} />
      <SpringBackground />

      {/* ── NAVBAR ── */}
      <header className={styles.navWrap}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="#1A1A1A"/>
            </svg>
            <span className={styles.logoMark}>API Nest</span>
          </div>
          <a href={process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'} className={styles.backLink}>← Home</a>
        </nav>
      </header>

      <main className={styles.centerMain}>
        <div className={styles.centerStack}>
          
          {/* ── CENTER COPY ── */}
          <div className={styles.topCopy}>
            <div className={styles.introIcon}>
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                {/* Lock icon — appropriate for password recovery */}
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.introTitle}>Recover account</h1>
            <p className={styles.introSub}>Securely reset your API Nest password</p>
          </div>

          {/* ── CARD ── */}
          <div className={styles.card}>
            {step === 1 ? (
              <form className={styles.form} onSubmit={handleSendOtp} noValidate>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="forgot-email">Account Email</label>
                  <input
                    id="forgot-email"
                    className={`${styles.input} ${isShaking ? styles.inputError : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                {error && (
                  <div role="alert" aria-live="polite" className={styles.errorBanner}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style={{ flexShrink: 0, marginTop: '1px' }}>
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className={`${styles.submitBtn} ${isLoading ? styles.loadingBtn : ''}`} disabled={isLoading}>
                  {isLoading ? (
                    <span className={styles.loaderContent}>
                      <svg className={styles.spinnerIcon} viewBox="0 0 24 24">
                        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleVerifyOtp} noValidate>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="forgot-otp">Verification OTP</label>
                  <input
                    id="forgot-otp"
                    className={`${styles.input} ${isShaking ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Enter the code sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    autoComplete="one-time-code"
                    required
                  />
                </div>

                {error && (
                  <div role="alert" aria-live="polite" className={styles.errorBanner}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style={{ flexShrink: 0, marginTop: '1px' }}>
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className={`${styles.submitBtn} ${isLoading ? styles.loadingBtn : ''}`} disabled={isLoading}>
                  {isLoading ? (
                    <span className={styles.loaderContent}>
                      <svg className={styles.spinnerIcon} viewBox="0 0 24 24">
                        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify OTP'}
                </button>
              </form>
            )}
          </div>

          {/* ── BOTTOM LINKS ── */}
          <div className={styles.bottomUtilLinks}>
            <span className={styles.bottomForgotLink}>Remembered your password?</span>
            <Link href="/login" className={styles.bottomRegisterLink}>
              Log in →
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
