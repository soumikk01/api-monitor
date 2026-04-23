'use client';
import { authStorage } from '@/lib/fetchWithAuth';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import ProjectSidebar from '@/components/ProjectSidebar/ProjectSidebar';
import styles from './DashboardPage.module.scss';
import { Shimmer, ShimmerBlock, ShimmerRow } from '@/components/Shimmer/Shimmer';
import { ChevronDown, Database, GitBranch, Box, RotateCw } from 'lucide-react';

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
          <ShimmerBlock>
            {/* Page title + badge */}
            <ShimmerRow>
              <Shimmer width="38%" height={32} borderRadius={6} delay={1} />
              <Shimmer width={48} height={22} borderRadius={4} delay={1} style={{ alignSelf: 'center' }} />
            </ShimmerRow>
            {/* URL row */}
            <ShimmerRow>
              <Shimmer width="55%" height={18} borderRadius={4} delay={2} />
              <Shimmer width={72} height={22} borderRadius={4} delay={2} />
            </ShimmerRow>
            {/* 2x2 stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
              <Shimmer height={80} borderRadius={10} delay={2} />
              <Shimmer height={80} borderRadius={10} delay={3} />
              <Shimmer height={80} borderRadius={10} delay={3} />
              <Shimmer height={80} borderRadius={10} delay={4} />
            </div>
            {/* Schema card */}
            <Shimmer height={340} borderRadius={12} delay={4} />
          </ShimmerBlock>
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
            <div className={styles.schemaCard}>
              <div className={styles.schemaHeader}>
                  <span className={styles.schemaTitle}>Schema-per-tenant</span>
                  <div className={styles.schemaLine} />
                </div>

                <div className={styles.clusterBox}>
                  <div className={styles.clusterHeader}>
                    <span className={styles.clusterName}>PS-5 (US-EAST-1)</span>
                    <span className={styles.clusterLabel}>DATABASE CLUSTER</span>
                  </div>
                  
                  <div className={styles.logicalBox}>
                    <div className={styles.logicalHeader}>
                      <span className={styles.logicalName}>POSTGRES</span>
                      <span className={styles.logicalLabel}>LOGICAL DATABASE</span>
                    </div>

                    <div className={styles.tenantBox}>
                      <div className={styles.tenantHeader}>
                        <span className={styles.tenantUk}>UK</span>
                        <span className={styles.tenantLabel}>SCHEMA</span>
                      </div>
                      <div className={styles.tableBox}>
                        <div className={styles.tableHeader}>
                          <span className={styles.tableName}>ORDERS</span>
                          <span className={styles.tableLabel}>TABLE</span>
                        </div>
                        <div className={styles.graphContainer}>
                          <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="gradientUk" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path className={styles.graphFillUk} d="M 0 35 C 30 15, 60 40, 100 20 C 140 0, 170 30, 200 10 L 200 40 L 0 40 Z" fill="url(#gradientUk)" />
                            <path className={styles.graphStrokeUk} pathLength="100" d="M 0 35 C 30 15, 60 40, 100 20 C 140 0, 170 30, 200 10" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className={styles.tenantBox}>
                      <div className={styles.tenantHeader}>
                        <span className={styles.tenantDe}>DE</span>
                        <span className={styles.tenantLabel}>SCHEMA</span>
                      </div>
                      <div className={styles.tableBox}>
                        <div className={styles.tableHeader}>
                          <span className={styles.tableName}>ORDERS</span>
                          <span className={styles.tableLabel}>TABLE</span>
                        </div>
                        <div className={styles.graphContainer}>
                          <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="gradientDe" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path className={styles.graphFillDe} d="M 0 25 C 40 5, 80 35, 130 15 C 160 5, 180 25, 200 5 L 200 40 L 0 40 Z" fill="url(#gradientDe)" />
                            <path className={styles.graphStrokeDe} pathLength="100" d="M 0 25 C 40 5, 80 35, 130 15 C 160 5, 180 25, 200 5" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.replayBox} onClick={(e) => {
                  const el = e.currentTarget.parentElement;
                  if (el) {
                    el.style.animation = 'none';
                    void el.offsetHeight; /* trigger reflow */
                    el.style.animation = '';
                    const bars = el.querySelectorAll<SVGPathElement>('path[class*="graphStroke"], path[class*="graphFill"]');
                    bars.forEach((b) => {
                      b.style.animation = 'none';
                      void b.getBoundingClientRect(); // trigger reflow for SVG elements
                      b.style.animation = '';
                    });
                  }
                }}>
                  <RotateCw size={12} className={styles.replayIcon} /> Replay
                </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
