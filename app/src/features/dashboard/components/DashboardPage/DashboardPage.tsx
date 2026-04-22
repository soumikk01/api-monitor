'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import ProjectSidebar from '@/components/ProjectSidebar/ProjectSidebar';
import styles from './DashboardPage.module.scss';
import { ChevronDown, Database, GitBranch, Box } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function DashboardPage() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loadState, setLoadState] = useState<'loading' | 'empty' | 'ready'>('loading');

  useEffect(() => {
    const paramId = searchParams.get('projectId');
    const token = authStorage.getAccessToken();
    if (!token) return;

    void (async () => {
      setLoadState('loading');
      if (paramId) {
        const r = await fetch(`${API}/projects/${paramId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (r.ok) {
          const p = await r.json() as { id: string; name: string };
          setProjectId(p.id);
          setProjectName(p.name);
          localStorage.setItem('activeProjectId', p.id);
          setLoadState('ready');
        } else {
          setProjectId(paramId);
          setLoadState('ready');
        }
      } else {
        const r = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) { setLoadState('empty'); return; }
        const projects = await r.json() as { id: string; name: string }[];
        const saved = localStorage.getItem('activeProjectId');
        const active = projects.find(p => p.id === saved) ?? projects[0];
        if (active) {
          setProjectId(active.id);
          setProjectName(active.name);
          localStorage.setItem('activeProjectId', active.id);
          setLoadState('ready');
        } else {
          setLoadState('empty');
        }
      }
    })();
  }, [user, searchParams]);

  if (loadState === 'loading') {
    return (
      <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
        <div className={styles.noiseOverlay} />
        <div className={styles.dotPattern} />
        <ProjectSidebar projectId={undefined} />
        <main className={styles.content}>
          <div className={styles.skeletonBlock} style={{ height: 400 }} />
        </main>
      </div>
    );
  }

  const projectUrl = `https://${projectId.substring(0, 8) || 'yscdebrydv'}.api-monitor.co`;

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <div className={styles.dotPattern} />
      <ProjectSidebar projectId={projectId || undefined} />
      
      <main className={styles.content}>
        <div className={styles.dashboardContainer}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            <div className={styles.header}>
              <div className={styles.titleRow}>
                <h1>{projectName || 'api-monitor'}</h1>
                <span className={styles.badge}>NANO</span>
              </div>
              <div className={styles.urlRow}>
                <span className={styles.url}>{projectUrl}</span>
                <button className={styles.copyBtn}>
                  Copy <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className={styles.gridCards}>
              <div className={styles.card}>
                <div className={styles.iconBox} style={{ color: '#24B47E', backgroundColor: 'rgba(36, 180, 126, 0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="6" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="18" cy="12" r="2" />
                    <circle cx="6" cy="6" r="2" />
                    <circle cx="12" cy="6" r="2" />
                    <circle cx="18" cy="6" r="2" />
                    <circle cx="6" cy="18" r="2" />
                    <circle cx="12" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />
                  </svg>
                </div>
                <div className={styles.cardText}>
                  <div className={styles.label}>STATUS</div>
                  <div className={styles.value} style={{ color: '#fff' }}>Healthy</div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.iconBox}>
                  <Database size={20} />
                </div>
                <div className={styles.cardText}>
                  <div className={styles.label}>LAST MIGRATION</div>
                  <div className={styles.value}>No migrations</div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.iconBox}>
                  <Box size={20} />
                </div>
                <div className={styles.cardText}>
                  <div className={styles.label}>LAST BACKUP</div>
                  <div className={styles.value}>No backups</div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.iconBox}>
                  <GitBranch size={20} />
                </div>
                <div className={styles.cardText}>
                  <div className={styles.label}>RECENT BRANCH</div>
                  <div className={styles.value}>No branches</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightCol}>
            <div className={styles.networkBox}>
              <div className={styles.networkDotPattern} />
              
              <div className={styles.dbNode}>
                <div className={styles.dbIcon}>
                  <Database size={16} color="#fff" />
                </div>
                <div className={styles.dbInfo}>
                  <div className={styles.dbTitle}>
                    <span>Primary Database</span>
                    <span className={styles.flag}>🇮🇳</span>
                  </div>
                  <div className={styles.dbRegion}>South Asia (Mumbai)</div>
                  <div className={styles.dbSub}>ap-south-1 · t4g.nano</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
