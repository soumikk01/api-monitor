'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ProjectSettingsSidebar.module.scss';

interface Props {
  projectId?: string;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function ProjectSettingsSidebar({ projectId, activeSection: propActiveSection, onSectionChange }: Props) {
  const [localActiveSection, setLocalActiveSection] = useState('general');
  const activeSection = propActiveSection ?? localActiveSection;

  useEffect(() => {
    if (onSectionChange) return;
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setLocalActiveSection(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onSectionChange]);

  const handleNavClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    } else {
      setLocalActiveSection(section);
    }
  };

  const backHref = projectId ? `/dashboard?projectId=${projectId}` : '/dashboard';

  return (
    <aside className={styles.sidebar} data-state="expanded">
      <nav className={styles.nav}>
        <Link href={backHref} className={styles.backBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className={styles.label}>Back to Project</span>
        </Link>

        <div className={styles.sectionTitle}>Settings</div>

        <a
          href="#general"
          onClick={() => handleNavClick('general')}
          className={`${styles.navItem} ${activeSection === 'general' ? styles.active : ''}`}
        >
          <span className={styles.label}>General</span>
        </a>

        <a
          href="#access"
          onClick={() => handleNavClick('access')}
          className={`${styles.navItem} ${activeSection === 'access' ? styles.active : ''}`}
        >
          <span className={styles.label}>Project Access</span>
        </a>

        <a
          href="#availability"
          onClick={() => handleNavClick('availability')}
          className={`${styles.navItem} ${activeSection === 'availability' ? styles.active : ''}`}
        >
          <span className={styles.label}>Availability</span>
        </a>

        <a
          href="#domains"
          onClick={() => handleNavClick('domains')}
          className={`${styles.navItem} ${activeSection === 'domains' ? styles.active : ''}`}
        >
          <span className={styles.label}>Custom Domains</span>
        </a>

        <div className={styles.sectionTitle}>Danger Zone</div>

        <a
          href="#advanced"
          onClick={() => handleNavClick('advanced')}
          className={`${styles.navItem} ${activeSection === 'advanced' ? styles.active : ''}`}
        >
          <span className={styles.label}>Advanced</span>
        </a>
      </nav>
    </aside>
  );
}
