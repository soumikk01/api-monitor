'use client';

import { useEffect, useState } from 'react';
import styles from './LogoutOverlay.module.scss';
import { useTheme } from '@/hooks/useTheme';

export default function LogoutOverlay() {
  useTheme(); // Subscribe to theme context (for future dark-mode overlay styling)
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      setActive(true);
    };

    window.addEventListener('show-logout-transition', handleTrigger);
    return () => window.removeEventListener('show-logout-transition', handleTrigger);
  }, []);

  if (!active) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.logoContainer}>
        <svg viewBox="0 0 20 20" fill="none" className={styles.logoSvg}>
          <polygon 
            className={styles.hexagon}
            points="10,1 19,6 19,14 10,19 1,14 1,6" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
          />
          <circle 
            className={styles.circle}
            cx="10" 
            cy="10" 
            r="3" 
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
