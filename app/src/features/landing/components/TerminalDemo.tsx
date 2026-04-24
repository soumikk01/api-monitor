'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './LandingPage.module.scss';

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

export default function TerminalDemo() {
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
