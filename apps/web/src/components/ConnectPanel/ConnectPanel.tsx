'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import GettingStartedPanel from '@/features/dashboard/components/GettingStartedPage/GettingStartedPanel';
import styles from './ConnectPanel.module.scss';

function ConnectPanelInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('panel') === 'getting-started';

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('panel');
    const qs = params.toString();
    router.push(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      {/* Drawer */}
      <aside className={styles.drawer} aria-label="Getting Started">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Getting Started
          </div>
          <button className={styles.closeBtn} onClick={close} aria-label="Close panel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.body}>
          <GettingStartedPanel />
        </div>
      </aside>
    </>
  );
}

export default function ConnectPanel() {
  return (
    <Suspense fallback={null}>
      <ConnectPanelInner />
    </Suspense>
  );
}
