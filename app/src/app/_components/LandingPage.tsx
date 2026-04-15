'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './LandingPage.module.scss';

/* ─────────────────────────────────────────────
   Scroll-reveal hook
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─────────────────────────────────────────────
   Magnetic button hook (subtle pull-toward-cursor)
───────────────────────────────────────────── */
function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', onMove as EventListener);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove as EventListener);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [onMove, onLeave]);

  return ref;
}

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
function useCounter(target: string, running: boolean) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!running) return;
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix  = target.replace(/[0-9.]/g, '');
    if (isNaN(numeric)) { 
      const t = setTimeout(() => setDisplay(target), 0); 
      return () => clearTimeout(t); 
    }
    const start = Date.now();
    const dur   = 1400;
    let raf: number;
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val   = numeric * eased;
      const fmt   = numeric < 10 ? val.toFixed(2) : Math.round(val).toString();
      setDisplay(`${fmt}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, target]);

  return display;
}

/* ─────────────────────────────────────────────
   Terminal demo
───────────────────────────────────────────── */
const TERMINAL_LINES = [
  { delay: 0,    type: 'cmd',     text: 'narch init --project=my-api' },
  { delay: 600,  type: 'success', text: '✓  Project initialised  (id: proj_k2x9a)' },
  { delay: 1000, type: 'cmd',     text: 'narch watch --env=production' },
  { delay: 1500, type: 'info',    text: 'Watching 14 endpoints across 3 regions…' },
  { delay: 2200, type: 'ok',      text: '[200]  GET  /api/v1/users          42 ms' },
  { delay: 2700, type: 'ok',      text: '[200]  POST /api/v1/events         18 ms' },
  { delay: 3200, type: 'warn',    text: '[429]  GET  /api/v1/feed           rate-limited' },
  { delay: 3800, type: 'ok',      text: '[200]  GET  /api/v1/health         3 ms' },
  { delay: 4400, type: 'error',   text: '[503]  POST /api/v1/payments       ← ALERT sent' },
  { delay: 5000, type: 'info',    text: 'Incident #INS-041 opened  ·  PagerDuty notified' },
  { delay: 5600, type: 'ok',      text: '[200]  GET  /api/v1/status         12 ms' },
  { delay: 6200, type: 'muted',   text: '↻  uptime 99.98%  ·  p99 latency 61 ms' },
];

function TerminalDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const CYCLE = 7500;

    const schedule = () => {
      setVisibleCount(0);
      TERMINAL_LINES.forEach((line, i) => {
        const t = setTimeout(() => setVisibleCount(i + 1), line.delay);
        timeouts.push(t);
      });
      const loop = setTimeout(() => {
        timeouts.forEach(clearTimeout);
        timeouts = [];
        schedule();
      }, CYCLE);
      timeouts.push(loop);
    };

    schedule();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Auto-scroll terminal body as lines appear
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [visibleCount]);

  return (
    <div className={styles.terminal}>
      <div className={styles.termHeader}>
        <span className={`${styles.termDot} ${styles.termRed}`} />
        <span className={`${styles.termDot} ${styles.termYellow}`} />
        <span className={`${styles.termDot} ${styles.termGreen}`} />
        <span className={styles.termTitle}>narch — production</span>
      </div>
      <div className={styles.termBody} ref={bodyRef}>
        {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={`${styles.termLine} ${styles[`term_${line.type}`]}`}>
            {line.type === 'cmd' && <span className={styles.termPrompt}>❯</span>}
            <span>{line.text}</span>
          </div>
        ))}
        <span className={styles.termCursor}>▋</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Spring background (unchanged)
───────────────────────────────────────────── */
const SpringBackground = () => (
  <div className={styles.springBg} aria-hidden="true">
    <svg className={styles.branch1} viewBox="0 0 220 180" fill="none">
      <path d="M10,170 Q50,110 90,85 Q120,65 160,52 Q180,45 210,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45"/>
      <path d="M90,85 Q100,62 118,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>
      <path d="M120,65 Q140,42 158,28" stroke="#7C6050" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
      <g transform="translate(120,46)">
        <circle cx="0" cy="-7" r="5.5" fill="#FFB7C5" opacity="0.85"/><circle cx="6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/>
        <circle cx="4.1" cy="5.7" r="5.5" fill="#FF8FAB" opacity="0.75"/><circle cx="-4.1" cy="5.7" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/>
        <circle cx="0" cy="0" r="4" fill="#FFFACD"/><circle cx="0" cy="0" r="1.8" fill="#F6C800"/>
      </g>
      <g transform="translate(93,82)">
        <circle cx="0" cy="-6" r="4.5" fill="#FFD1DC" opacity="0.9"/><circle cx="5.7" cy="-1.9" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="3.5" cy="4.9" r="4.5" fill="#FFD1DC" opacity="0.85"/><circle cx="-3.5" cy="4.9" r="4.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-5.7" cy="-1.9" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="0" cy="0" r="3.2" fill="#FFFACD"/><circle cx="0" cy="0" r="1.3" fill="#F6C800"/>
      </g>
      <g transform="translate(161,50)">
        <circle cx="0" cy="-5" r="3.5" fill="#FFB7C5" opacity="0.8"/><circle cx="4.7" cy="-1.6" r="3.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="2.9" cy="4.1" r="3.5" fill="#FFB7C5" opacity="0.8"/><circle cx="-2.9" cy="4.1" r="3.5" fill="#FF8FAB" opacity="0.7"/>
        <circle cx="-4.7" cy="-1.6" r="3.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="0" cy="0" r="2.5" fill="#FFFACD"/><circle cx="0" cy="0" r="1" fill="#F6C800"/>
      </g>
      <ellipse cx="140" cy="72" rx="5" ry="3" fill="#FFB7C5" opacity="0.55" transform="rotate(-30 140 72)"/>
      <ellipse cx="178" cy="40" rx="4" ry="2.5" fill="#FFD1DC" opacity="0.5" transform="rotate(22 178 40)"/>
    </svg>

    <svg className={styles.branch2} viewBox="0 0 220 180" fill="none">
      <path d="M210,170 Q170,110 130,85 Q100,65 62,52 Q42,45 12,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M130,85 Q120,62 103,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      <g transform="translate(100,45)">
        <circle cx="0" cy="-7" r="5.5" fill="#FFD1DC" opacity="0.9"/><circle cx="6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="4.1" cy="5.7" r="5.5" fill="#FFD1DC" opacity="0.85"/><circle cx="-4.1" cy="5.7" r="5.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="0" cy="0" r="4" fill="#FFFACD"/><circle cx="0" cy="0" r="1.8" fill="#F6C800"/>
      </g>
      <g transform="translate(128,82)">
        <circle cx="0" cy="-6" r="4.5" fill="#FFB7C5" opacity="0.85"/><circle cx="5.7" cy="-1.9" r="4.5" fill="#FFD1DC" opacity="0.9"/>
        <circle cx="3.5" cy="4.9" r="4.5" fill="#FFB7C5" opacity="0.8"/><circle cx="-3.5" cy="4.9" r="4.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-5.7" cy="-1.9" r="4.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="0" cy="0" r="3.2" fill="#FFFACD"/><circle cx="0" cy="0" r="1.3" fill="#F6C800"/>
      </g>
      <ellipse cx="65" cy="70" rx="4.5" ry="2.8" fill="#FFB7C5" opacity="0.5" transform="rotate(40 65 70)"/>
    </svg>

    {[styles.petal1,styles.petal2,styles.petal3,styles.petal4,styles.petal5,styles.petal6,styles.petal7].map((p,i) => (
      <svg key={i} className={`${styles.petal} ${p}`} viewBox="0 0 14 22" fill="none">
        <ellipse cx="7" cy="11" rx="5" ry="9.5" fill={i%2===0?'#FFB7C5':'#FFD1DC'} opacity="0.65" transform={`rotate(${i*15-20} 7 11)`}/>
      </svg>
    ))}

    {[styles.sp1,styles.sp2,styles.sp3,styles.sp4,styles.sp5,styles.sp6].map((s,i) => (
      <svg key={i} className={`${styles.sparkle} ${s}`} viewBox="0 0 20 20" fill="none">
        <path d="M10,1 L11.2,8.8 L19,10 L11.2,11.2 L10,19 L8.8,11.2 L1,10 L8.8,8.8 Z" fill="#1A1A1A" opacity="0.5"/>
      </svg>
    ))}

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
    <svg className={styles.bloom3} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="5" r="4.5" fill="#FFB7C5" opacity="0.75"/>
      <circle cx="21.4" cy="10.2" r="4.5" fill="#FFD1DC" opacity="0.8"/>
      <circle cx="18.7" cy="19.8" r="4.5" fill="#FFB7C5" opacity="0.75"/>
      <circle cx="9.3" cy="19.8" r="4.5" fill="#FF8FAB" opacity="0.7"/>
      <circle cx="6.6" cy="10.2" r="4.5" fill="#FFD1DC" opacity="0.8"/>
      <circle cx="14" cy="14" r="4.5" fill="#FFFACD"/><circle cx="14" cy="14" r="1.8" fill="#F6C800"/>
    </svg>

    <svg className={styles.curly1} viewBox="0 0 70 35" fill="none">
      <path d="M5,28 C12,6 22,6 28,18 C34,30 44,30 50,18 C56,6 62,8 66,14" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.18"/>
    </svg>
    <svg className={styles.curly2} viewBox="0 0 55 28" fill="none">
      <path d="M3,22 C9,5 17,5 22,13 C27,22 35,22 40,13 C45,4 51,7 53,13" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.15"/>
    </svg>
    <svg className={styles.dots1} viewBox="0 0 60 20" fill="none">
      <circle cx="5" cy="10" r="2.5" fill="#1A1A1A" opacity="0.22"/>
      <circle cx="18" cy="10" r="1.8" fill="#1A1A1A" opacity="0.18"/>
      <circle cx="31" cy="10" r="2.5" fill="#1A1A1A" opacity="0.22"/>
      <circle cx="44" cy="10" r="1.8" fill="#7C6050" opacity="0.18"/>
    </svg>
    <svg className={styles.dots2} viewBox="0 0 40 14" fill="none">
      <circle cx="4" cy="7" r="2" fill="#7C6050" opacity="0.2"/>
      <circle cx="15" cy="7" r="1.5" fill="#1A1A1A" opacity="0.16"/>
      <circle cx="26" cy="7" r="2" fill="#1A1A1A" opacity="0.2"/>
      <circle cx="37" cy="7" r="1.5" fill="#7C6050" opacity="0.16"/>
    </svg>
  </div>
);

/* ─────────────────────────────────────────────
   SVG illustrations (unchanged)
───────────────────────────────────────────── */
const IlluApiGlobe = () => (
  <svg viewBox="0 0 100 100" fill="none" className={styles.cardSvg}>
    <path d="M20,70 Q20,55 35,55 Q40,40 55,40 Q70,40 75,55 Q90,55 90,70 Z" fill="#ffffff" opacity="0.5"/>
    <circle cx="55" cy="52" r="22" fill="#E8F4FF" stroke="#1A1A1A" strokeWidth="2.5"/>
    <ellipse cx="55" cy="52" rx="22" ry="10" stroke="#1A1A1A" strokeWidth="1.5" opacity="0.3"/>
    <line x1="55" y1="30" x2="55" y2="74" stroke="#1A1A1A" strokeWidth="1.5" opacity="0.3"/>
    <circle cx="77" cy="52" r="4" fill="#A8D8FF" stroke="#1A1A1A" strokeWidth="1.5"/>
    <path d="M47,52 Q51,56 55,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M59,52 Q63,56 67,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="45" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    <circle cx="69" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    <path d="M40,42 Q47,24 63,28 Q60,37 66,42 Z" fill="#6B6B6B" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="63" cy="28" r="3.5" fill="#F6D55C" stroke="#1A1A1A" strokeWidth="1.5"/>
    <text x="55" y="82" textAnchor="middle" fill="#1A1A1A" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" opacity="0.7">99.99% uptime</text>
  </svg>
);

const IlluApiPulse = () => (
  <svg viewBox="0 0 100 100" fill="none" className={styles.cardSvg}>
    <path d="M25,62 Q20,48 35,43 Q40,28 55,33 Q70,28 76,43 Q91,48 86,62 Z" fill="#ffffff" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M31,52 Q55,22 79,52" fill="none" stroke="#6B6B6B" strokeWidth="3"/>
    <rect x="24" y="46" width="10" height="14" rx="5" fill="#B8F2D6" stroke="#1A1A1A" strokeWidth="2"/>
    <rect x="79" y="46" width="10" height="14" rx="5" fill="#B8F2D6" stroke="#1A1A1A" strokeWidth="2"/>
    <path d="M43,52 Q47,49 51,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M60,52 Q64,49 68,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="40" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    <circle cx="71" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    <path d="M17,38 L22,33 L22,43 Z" fill="#1A1A1A"/>
    <path d="M22,33 L27,36" stroke="#1A1A1A" strokeWidth="1.5"/>
    <path d="M84,28 L89,23 L89,36 Z" fill="#1A1A1A"/>
    <path d="M89,23 L95,26 L95,33" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
    <text x="55" y="85" textAnchor="middle" fill="#1A1A1A" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" opacity="0.7">Real-time alerts</text>
  </svg>
);

const IlluApiShield = () => (
  <svg viewBox="0 0 100 100" fill="none" className={styles.cardSvg}>
    <path d="M35,50 Q50,38 65,50 L70,68 Q50,82 30,68 Z" fill="#F6D55C" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M30,56 Q20,46 34,46" fill="none" stroke="#F6D55C" strokeWidth="6" strokeLinecap="round"/>
    <path d="M30,56 Q20,46 34,46" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M70,52 Q80,57 70,70" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M40,45 C40,36 62,36 62,45 Z" fill="#F6D55C" stroke="#1A1A1A" strokeWidth="2"/>
    <circle cx="51" cy="37" r="3" fill="#1A1A1A"/>
    <path d="M50,55 L58,59 L58,65 L50,69 L42,65 L42,59 Z" fill="#FFB38A" stroke="#1A1A1A" strokeWidth="1.5"/>
    <path d="M47,62 L49.5,64.5 L54,59" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M43,32 Q46,22 40,26" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    <path d="M51,28 Q54,18 48,22" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    <text x="50" y="92" textAnchor="middle" fill="#1A1A1A" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" opacity="0.7">Zero breaches</text>
  </svg>
);

/* ─────────────────────────────────────────────
   Stat item with counter
───────────────────────────────────────────── */
function StatItem({ v, l }: { v: string; l: string }) {
  const { ref, visible } = useInView(0.3);
  const display = useCounter(v, visible);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${styles.statItem} ${visible ? styles.statVisible : ''}`}
    >
      <span className={styles.statVal}>{display}</span>
      <span className={styles.statLbl}>{l}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function LandingPage() {
  const [dark, setDark] = useState(false);
  // Magnetic refs for CTA buttons
  const magPrimary   = useMagnetic(0.25);
  const magSecondary = useMagnetic(0.25);
  const magToggle    = useMagnetic(0.35);

  // Scroll-reveal sections
  const { ref: badgeRef, visible: badgeVisible } = useInView(0.2);
  const { ref: headlineRef, visible: headlineVisible } = useInView(0.2);
  const { ref: subRef, visible: subVisible } = useInView(0.2);
  const { ref: ctasRef, visible: ctasVisible } = useInView(0.2);
  const { ref: terminalRef, visible: terminalVisible } = useInView(0.15);
  const { ref: cardsRef, visible: cardsVisible } = useInView(0.1);
  const { ref: statsRef, visible: statsVisible } = useInView(0.15);
  const { ref: footerRef, visible: footerVisible } = useInView(0.1);

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <SpringBackground />

      {/* ── THEME TOGGLE ── */}
      <button
        id="theme-toggle"
        ref={magToggle as React.RefObject<HTMLButtonElement>}
        className={styles.themeToggle}
        onClick={() => setDark((d) => !d)}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={dark ? 'Light mode' : 'Dark mode'}
      >
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
            {[0,60,120,180,240,300].map((deg) => (
              <line key={deg} x1="12" y1="2" x2="12" y2="5"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                transform={`rotate(${deg} 12 12)`}/>
            ))}
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* ── NAVBAR ── */}
      <header className={styles.navWrap}>
        <nav className={`${styles.nav} ${styles.navIn}`}>
          <div className={styles.logo}>
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="#1A1A1A"/>
            </svg>
            <span className={styles.logoMark}>N_ARCH</span>
          </div>
          <div className={styles.navLinks}>
            {['Products','Solutions','Pricing','Company','Support'].map((link, i) => (
              <a key={link} href={link === 'Solutions' ? '#features' : link === 'Pricing' ? '#stats' : '#'}
                className={styles.navLink}
                style={{ animationDelay: `${0.05 * i}s` }}>
                {link}
              </a>
            ))}
          </div>
          <Link href="/login" className={styles.navPill}>Try for free</Link>
        </nav>
      </header>

      {/* ── HERO ── */}
      <main className={styles.hero}>

        {/* Badge */}
        <div
          ref={badgeRef as React.RefObject<HTMLDivElement>}
          className={`${styles.socialProof} ${badgeVisible ? styles.fadeUp : styles.hidden}`}
          style={{ animationDelay: '0.1s' }}
        >
          <div className={styles.avatarRow}>
            {['#A8D8FF','#B8F2D6','#FFB38A','#F6D55C'].map((color, i) => (
              <div key={i} className={styles.avatar} style={{ backgroundColor: color, zIndex: 4 - i }}>
                <svg viewBox="0 0 20 20" fill="none" width="11" height="11" opacity="0.65">
                  <circle cx="10" cy="7" r="4" fill="#1A1A1A"/>
                  <path d="M4,18 Q10,12 16,18" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
            ))}
          </div>
          <span className={styles.socialText}>Over <strong>1k</strong> engineers online</span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef as React.RefObject<HTMLHeadingElement>}
          className={`${styles.headline} ${headlineVisible ? styles.fadeUp : styles.hidden}`}
          style={{ animationDelay: '0.2s' }}
        >
          Monitor Your APIs<br />
          <span className={styles.hlAccent}>in Real-Time</span>
        </h1>

        {/* Sub */}
        <p
          ref={subRef as React.RefObject<HTMLParagraphElement>}
          className={`${styles.sub} ${subVisible ? styles.fadeUp : styles.hidden}`}
          style={{ animationDelay: '0.3s' }}
        >
          Instantly track uptime, errors, and performance with a single command.<br />
          The command center for high-performance engineering teams.
        </p>

        {/* CTAs */}
        <div
          ref={ctasRef as React.RefObject<HTMLDivElement>}
          className={`${styles.ctaRow} ${ctasVisible ? styles.fadeUp : styles.hidden}`}
          style={{ animationDelay: '0.42s' }}
        >
          <Link
            href="/login"
            ref={magPrimary as React.RefObject<HTMLAnchorElement>}
            className={styles.ctaPrimary}
            id="cta-get-started"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
              <polygon points="5,3 13,8 5,13"/>
            </svg>
            Get Started
            <span className={styles.ctaShine} aria-hidden="true" />
          </Link>
          <a
            href="#terminal-demo"
            ref={magSecondary as React.RefObject<HTMLAnchorElement>}
            className={styles.ctaSecondary}
            id="cta-view-demo"
          >
            View Demo
            <svg viewBox="0 0 16 16" fill="none" width="11" height="11">
              <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <polyline points="9,4 13,8 9,12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </a>
        </div>

        {/* Terminal */}
        <div
          id="terminal-demo"
          ref={terminalRef as React.RefObject<HTMLDivElement>}
          className={`${styles.terminalWrap} ${terminalVisible ? styles.fadeUp : styles.hidden}`}
          style={{ animationDelay: '0.55s' }}
        >
          <TerminalDemo />
        </div>

        {/* Feature cards */}
        <div
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className={`${styles.cardRow} ${cardsVisible ? styles.cardsIn : ''}`}
          id="features"
        >
          {[
            { cls: styles.cardBlue,   delay: '0s',    Illu: IlluApiGlobe,  tag: 'Auto Detection', title: 'Always Online',    desc: 'Our engine crawls your infrastructure to identify and map all active API routes automatically.' },
            { cls: styles.cardGreen,  delay: '0.12s', Illu: IlluApiPulse,  tag: 'Live Monitoring', title: 'Real-Time Pulse', desc: 'Sub-second precision on uptime and status changes. Get notified before your users notice.' },
            { cls: styles.cardOrange, delay: '0.24s', Illu: IlluApiShield, tag: 'Secure Vault',     title: 'Zero Breach',    desc: 'P99 latency distribution across global regions. Identify bottlenecks and threats instantly.' },
          ].map(({ cls, delay, Illu, tag, title, desc }, i) => (
            <div
              key={i}
              className={`${styles.card} ${cls} ${i === 1 ? styles.cardCenter : ''}`}
              style={{ '--card-delay': delay } as React.CSSProperties}
            >
              <div className={styles.cardVisual}><Illu /></div>
              <div className={styles.cardBody}>
                <span className={styles.cardTag}>{tag}</span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── STATS ── */}
      <section
        id="stats"
        ref={statsRef as React.RefObject<HTMLElement>}
        className={`${styles.statsBar} ${statsVisible ? styles.statsIn : ''}`}
      >
        {[
          { v: '99.99%', l: 'Platform Uptime' },
          { v: '1.2B+',  l: 'Requests Scanned' },
          { v: '< 5ms',  l: 'Latency Overhead' },
          { v: '25+',    l: 'Global Nodes' },
        ].map((s) => <StatItem key={s.l} v={s.v} l={s.l} />)}
      </section>

      {/* ── FOOTER ── */}
      <footer
        ref={footerRef as React.RefObject<HTMLElement>}
        className={`${styles.footer} ${footerVisible ? styles.fadeUp : styles.hidden}`}
      >
        <span className={styles.footerCopy}>© 2025 NEURAL_ARCHITECT // CORE_KERNEL_STABLE</span>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Legal</a>
          <a href="#" className={styles.footerLink}>Docs</a>
          <Link href="/login" className={styles.footerCta}>Initialize Session →</Link>
        </div>
      </footer>
    </div>
  );
}
