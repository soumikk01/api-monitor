'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../ProjectSettingsSidebar/ProjectSettingsSidebar.module.scss';

interface Props {
  projectId: string;
  serviceId: string;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function ServiceSettingsSidebar({
  projectId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serviceId: _serviceId,
  activeSection: propActiveSection,
  onSectionChange,
}: Props) {
  const [localActiveSection, setLocalActiveSection] = useState('general');
  const activeSection = propActiveSection ?? localActiveSection;

  useEffect(() => {
    if (onSectionChange) return;
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setLocalActiveSection(hash || 'general');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onSectionChange]);

  const handleNavClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    } else {
      setLocalActiveSection(section);
    }
  };

  const backHref = `/services?projectId=${projectId}`;

  return (
    <aside className={styles.sidebar} data-state="expanded">
      <nav className={styles.nav}>
        <Link href={backHref} className={styles.backBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className={styles.label}>Back to Services</span>
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
          href="#sdk"
          onClick={() => handleNavClick('sdk')}
          className={`${styles.navItem} ${activeSection === 'sdk' ? styles.active : ''}`}
        >
          <span className={styles.label}>SDK Token</span>
        </a>

        <div className={styles.sectionTitle} style={{ color: '#ef4444' }}>Danger Zone</div>

        <a
          href="#danger"
          onClick={() => handleNavClick('danger')}
          className={`${styles.navItem} ${activeSection === 'danger' ? styles.active : ''}`}
          style={activeSection !== 'danger' ? { color: '#ef4444' } : undefined}
        >
          <span className={styles.label}>Advanced</span>
        </a>
      </nav>
    </aside>
  );
}
