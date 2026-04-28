'use client';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from './GettingStartedPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Props {
  /** When provided, the panel shows the SDK token for this specific service */
  projectId?: string;
  serviceId?: string;
  serviceName?: string;
}

export default function GettingStartedPanel({ projectId, serviceId, serviceName }: Props) {

  const [sdkToken, setSdkToken] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);
  const [pm, setPm] = useState<'npm' | 'yarn' | 'pnpm' | 'bun'>('npm');

  const pmCmds = {
    npm:  { install: 'npm install',  exec: 'npx',      run: 'npm run dev' },
    yarn: { install: 'yarn add',     exec: 'yarn dlx',  run: 'yarn dev' },
    pnpm: { install: 'pnpm add',     exec: 'pnpm dlx',  run: 'pnpm dev' },
    bun:  { install: 'bun add',      exec: 'bunx',      run: 'bun run dev' },
  }[pm];

  const cliCommand = `${pmCmds.exec} api-nest-cli@latest init --token ${sdkToken || 'sdk_your_token_here'}`;

  useEffect(() => {
    let cancelled = false;
    setSdkToken('');

    (async () => {
      try {
        if (projectId && serviceId) {
          // ── Service-specific token ──────────────────────────────────────
          const cached = localStorage.getItem(`svcToken:${serviceId}`);
          if (cached && !cancelled) { setSdkToken(cached); }

          const res = await fetchWithAuth(`${API}/projects/${projectId}/services/${serviceId}`);
          if (!res.ok) throw new Error('Failed');
          const svc = await res.json() as { sdkToken?: string };
          if (!cancelled && svc.sdkToken) {
            setSdkToken(svc.sdkToken);
            localStorage.setItem(`svcToken:${serviceId}`, svc.sdkToken);
          }
        }
        // No service context — token stays '' and placeholder is shown in CLI command
      } catch {
        // ignore — placeholder shown in CLI command
      }
    })();
    return () => { cancelled = true; };
  }, [projectId, serviceId]);

  function copy(text: string, key: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  }

  return (
    /* Reuse the exact same .content wrapper the full page uses */
    <div className={styles.panelWrap}>

      {/* Page header — exactly like the full page */}
      <div className={styles.header}>
        <div>
          <h1>Getting Started</h1>
          {serviceName ? (
            <p>Setting up <strong>{serviceName}</strong> — your SDK token is pre-filled below.</p>
          ) : (
            <p>Set up API monitoring in your project in under 60 seconds.</p>
          )}
        </div>
      </div>

      {/* Welcome banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeIcon}>{serviceName ? '🔑' : '👋'}</div>
        <div>
          {serviceName ? (
            <>
              <div className={styles.welcomeTitle}>SDK Token for <strong>{serviceName}</strong></div>
              <div className={styles.welcomeSub}>This token is unique to this service. Run the command below to connect it.</div>
            </>
          ) : (
            <>
              <div className={styles.welcomeTitle}>Getting Started</div>
              <div className={styles.welcomeSub}>Select a service from the Services page to get your SDK token and connect it.</div>
            </>
          )}
        </div>
      </div>

      {/* Package manager selector */}
      <div className={styles.pmSelector}>
        <span className={styles.pmLabel}>Package manager:</span>
        {(['npm', 'yarn', 'pnpm', 'bun'] as const).map(p => (
          <button
            key={p}
            className={`${styles.pmTab}${pm === p ? ' ' + styles.pmActive : ''}`}
            onClick={() => setPm(p)}
          >{p}</button>
        ))}
      </div>

      {/* Steps */}
      <div className={styles.steps}>

        {/* Step 1 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>1</div>
          <div className={styles.stepBody}>
            <div className={styles.stepTitle}>Install &amp; run the init command in your project</div>
            <div className={styles.stepDesc}>
              Open a terminal in your <strong>backend project folder</strong> and run all three commands in order.
              The CLI automatically patches your{' '}
              <code style={{background:'rgba(0,0,0,0.06)',padding:'2px 6px',borderRadius:4,fontFamily:'monospace'}}>package.json</code>{' '}
              start script — no source file changes needed.
            </div>

            <div style={{marginBottom:'0.75rem'}}>
              <div style={{fontSize:'0.75rem',fontWeight:700,color:'#888',marginBottom:'0.4rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Step 2a — Install the package</div>
              <div className={styles.terminal}>
                <div className={styles.termHeader}>
                  <span className={styles.termDot} style={{background:'#ff5f57'}}/>
                  <span className={styles.termDot} style={{background:'#febc2e'}}/>
                  <span className={styles.termDot} style={{background:'#28c840'}}/>
                  <span className={styles.termTitle}>Terminal</span>
                  <button className={styles.termCopy} onClick={() => copy(`${pmCmds.install} api-nest-cli`, 'install')}>
                    {copied === 'install' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <div className={styles.termBody}>
                  <span className={styles.prompt}>~/your-backend ❯ </span>
                  <span className={styles.cmd}>{pmCmds.install} api-nest-cli</span>
                </div>
              </div>
            </div>

            <div style={{marginBottom:'0.75rem'}}>
              <div style={{fontSize:'0.75rem',fontWeight:700,color:'#888',marginBottom:'0.4rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Step 2b — Run the init command (auto-configures everything)</div>
              <div className={styles.terminal}>
                <div className={styles.termHeader}>
                  <span className={styles.termDot} style={{background:'#ff5f57'}}/>
                  <span className={styles.termDot} style={{background:'#febc2e'}}/>
                  <span className={styles.termDot} style={{background:'#28c840'}}/>
                  <span className={styles.termTitle}>Terminal</span>
                  <button className={styles.termCopy} onClick={() => copy(cliCommand, 'cli')}>{copied === 'cli' ? '✓ Copied!' : 'Copy'}</button>
                </div>
                <div className={styles.termBody}>
                  <span className={styles.prompt}>~/your-backend ❯ </span>
                  <span className={styles.cmd}>{cliCommand}</span>
                </div>
              </div>
            </div>

            <div className={styles.whatHappens}>
              <div className={styles.whatTitle}>What the init command does automatically:</div>
              <div className={styles.whatList}>
                {[
                  '✅ Validates your SDK token with the API Nest backend',
                  '✅ Creates a project named after your folder',
                  '✅ Patches your package.json "dev"/"start" script with --import flag',
                  '✅ Saves .api-nest.json config with your project ID',
                  '✅ Zero source file changes — monitoring loads via Node.js flag',
                ].map(item => <div key={item} className={styles.whatItem}>{item}</div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>2</div>
          <div className={styles.stepBody}>
            <div className={styles.stepTitle}>Start your server</div>
            <div className={styles.stepDesc}>
              Your start script is now patched. Just run it normally — monitoring starts automatically:
            </div>
            <div className={styles.terminal}>
              <div className={styles.termHeader}>
                <span className={styles.termDot} style={{background:'#ff5f57'}}/>
                <span className={styles.termDot} style={{background:'#febc2e'}}/>
                <span className={styles.termDot} style={{background:'#28c840'}}/>
                <span className={styles.termTitle}>Terminal</span>
                <button className={styles.termCopy} onClick={() => copy(pmCmds.run, 'run')}>{copied === 'run' ? '✓ Copied!' : 'Copy'}</button>
              </div>
              <div className={styles.termBody}>
                <span className={styles.prompt}>~/your-backend ❯ </span>
                <span className={styles.cmd}>{pmCmds.run} &nbsp;<span className={styles.comment}># monitoring loads automatically</span></span>
              </div>
            </div>
            <div style={{marginTop:'1rem',padding:'0.85rem 1.2rem',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:12,fontSize:'0.85rem',color:'#059669'}}>
              🟢 You will see <strong>[api-nest] Monitoring active</strong> in your terminal when it&apos;s working.
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>3</div>
          <div className={styles.stepBody}>
            <div className={styles.stepTitle}>Watch your APIs appear live!</div>
            <div className={styles.stepDesc}>
              Make any HTTP request to your server (open your app, hit an endpoint, call your API).
              Every request will appear in the Overview dashboard in real-time — method, path, status, latency.
            </div>
            <Link href="/dashboard" className={styles.dashBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Open Dashboard →
            </Link>
          </div>
        </div>

      </div>

      {/* Docker Section */}
      <div className={styles.trouble} style={{marginBottom:'1.5rem'}}>
        <div className={styles.troubleTitle}>🐳 Using Docker?</div>
        <p style={{fontSize:'0.9rem',color:'#6B6B6B',marginBottom:'1.25rem',lineHeight:1.6}}>
          When your server runs inside a Docker container,{' '}
          <code style={{background:'rgba(0,0,0,0.06)',padding:'2px 6px',borderRadius:4,fontFamily:'monospace',fontSize:'0.85em'}}>localhost:4000</code>{' '}
          points to the container itself — not your host machine.
          Use environment variables to tell the agent where to reach the API Nest backend.{' '}
          <strong>No file changes needed.</strong>
        </p>

        {/* Option A */}
        <div style={{marginBottom:'1rem'}}>
          <div style={{fontSize:'0.72rem',fontWeight:700,color:'#888',marginBottom:'0.5rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Option A — docker run</div>
          <div className={styles.terminal}>
            <div className={styles.termHeader}>
              <span className={styles.termDot} style={{background:'#ff5f57'}}/>
              <span className={styles.termDot} style={{background:'#febc2e'}}/>
              <span className={styles.termDot} style={{background:'#28c840'}}/>
              <span className={styles.termTitle}>Terminal</span>
            </div>
            <pre className={styles.termBody}><span className={styles.cmd}>{`docker run \\
  -e APINEST_BACKEND_URL=http://host.docker.internal:4000 \\
  -e APINEST_SDK_TOKEN=${sdkToken || 'sdk_your_token'} \\
  -e APINEST_PROJECT_ID=your_project_id \\
  your-image`}</span></pre>
          </div>
        </div>

        {/* Option B */}
        <div style={{marginBottom:'1rem'}}>
          <div style={{fontSize:'0.72rem',fontWeight:700,color:'#888',marginBottom:'0.5rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Option B — docker-compose.yml</div>
          <div className={styles.terminal}>
            <div className={styles.termHeader}>
              <span className={styles.termDot} style={{background:'#ff5f57'}}/>
              <span className={styles.termDot} style={{background:'#febc2e'}}/>
              <span className={styles.termDot} style={{background:'#28c840'}}/>
              <span className={styles.termTitle}>docker-compose.yml</span>
            </div>
            <pre className={styles.termBody}><span className={styles.comment}>{`services:
  backend:
    build: .
    environment:`}</span>{'\n'}
<span className={styles.cmd}>{`      APINEST_BACKEND_URL: http://host.docker.internal:4000
      APINEST_SDK_TOKEN: ${sdkToken || 'sdk_your_token'}
      APINEST_PROJECT_ID: your_project_id`}</span></pre>
          </div>
        </div>

        {/* Linux tip */}
        <div style={{background:'rgba(79,123,247,0.06)',border:'1px solid rgba(79,123,247,0.15)',borderRadius:12,padding:'0.9rem 1.2rem',fontSize:'0.85rem',color:'#4F7BF7'}}>
          💡 <strong>Linux Docker users:</strong> Use{' '}
          <code style={{fontFamily:'monospace',background:'rgba(79,123,247,0.1)',padding:'1px 5px',borderRadius:4}}>172.17.0.1</code> instead of{' '}
          <code style={{fontFamily:'monospace',background:'rgba(79,123,247,0.1)',padding:'1px 5px',borderRadius:4}}>host.docker.internal</code> — that&apos;s the Docker bridge gateway IP on Linux.
        </div>
      </div>

      {/* Troubleshooting */}
      <div className={styles.trouble}>
        <div className={styles.troubleTitle}>🛠️ Troubleshooting</div>
        <div className={styles.troubleList}>
          <details className={styles.faq}>
            <summary>APIs not showing after starting the server?</summary>
            <p>Make sure you ran <code>npm install api-nest-cli@latest</code> AND <code>npx api-nest-cli@latest init --token ...</code> before starting. Also confirm you see <strong>[api-nest] Monitoring active</strong> in the terminal output.</p>
          </details>
          <details className={styles.faq}>
            <summary>Live Socket shows &quot;Connecting&quot;?</summary>
            <p>The WebSocket can&apos;t reach the API Nest backend. Make sure the backend is running on port 4000 and refresh the page.</p>
          </details>
          <details className={styles.faq}>
            <summary>Server crashes with &quot;Cannot find module api-nest-cli/register.js&quot;?</summary>
            <p>Run <code>npm install api-nest-cli@latest</code> inside your <strong>backend folder</strong> first, then run the init command again.</p>
          </details>
          <details className={styles.faq}>
            <summary>Running from a monorepo root?</summary>
            <p>Run both commands from inside your backend directory: <code>cd backend</code>, then <code>npm install api-nest-cli@latest</code>, then the init command.</p>
          </details>
          <details className={styles.faq}>
            <summary>My project uses TypeScript / ES Modules?</summary>
            <p>Fully supported. The CLI detects <code>&quot;type&quot;: &quot;module&quot;</code> in your package.json and uses <code>--import</code> flag (ESM) instead of <code>--require</code> (CJS) automatically.</p>
          </details>
        </div>
      </div>

    </div>
  );
}
