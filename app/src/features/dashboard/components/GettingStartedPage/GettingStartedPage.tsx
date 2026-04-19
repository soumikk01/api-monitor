'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from './GettingStartedPage.module.scss';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function GettingStartedPage() {
  const { user } = useAuth();
  const [sdkToken, setSdkToken] = useState<string>('');
  const [sdkLoading, setSdkLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null); // tracks WHICH snippet is copied
  const [dark, setDark] = useState(false);
  const [pm, setPm] = useState<'npm' | 'yarn' | 'pnpm' | 'bun'>('npm');

  // Derived package manager commands
  const pmCmds = {
    npm:  { install: 'npm install',  exec: 'npx',      run: 'npm run dev' },
    yarn: { install: 'yarn add',     exec: 'yarn dlx',  run: 'yarn dev' },
    pnpm: { install: 'pnpm add',     exec: 'pnpm dlx',  run: 'pnpm dev' },
    bun:  { install: 'bun add',      exec: 'bunx',      run: 'bun run dev' },
  }[pm];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    fetch(`${API}/users/me/command`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then((d: { token?: string; command?: string }) => {
        if (d.token) setSdkToken(d.token);
      })
      .catch(() => {})
      .finally(() => setSdkLoading(false));
  }, [user]);

  const cliCommand = `${pmCmds.exec} api-nest-cli@latest init --token ${sdkToken || 'sdk_your_token_here'}`;

  function copy(text: string, key: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  }

  return (
    <div className={`${styles.page}${dark ? ' ' + styles.dark : ''}`}>
      <div className={styles.noiseOverlay} />
      <div className={styles.dotPattern} />


      {/* Theme toggle */}
      <button className={styles.themeToggle} onClick={() => setDark(!dark)} aria-label="Toggle theme">
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/overview" className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="10" cy="10" r="3" fill="currentColor" />
            </svg>
          </div>
          <span className={styles.brandText}>API NEST</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/overview" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Overview
          </Link>
          <Link href="/getting-started" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 12 12 14 14" />
            </svg>
            Getting Started
          </Link>
          <Link href="/settings" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>Getting Started</h1>
            <p>Set up API monitoring in your project in under 60 seconds.</p>
          </div>
        </div>

        {/* Welcome banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeIcon}>👋</div>
          <div>
            <div className={styles.welcomeTitle}>Welcome, {user?.name || user?.email || 'Developer'}!</div>
            <div className={styles.welcomeSub}>
              Your personalized command is ready below. Copy, run, done.
            </div>
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
            >
              {p}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className={styles.steps}>

          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepBody}>
              <div className={styles.stepTitle}>Get your SDK token</div>
              <div className={styles.stepDesc}>
                You&apos;re already logged in — your unique SDK token is below.
                It identifies your project. Find it anytime in <Link href="/settings" className={styles.link}>Settings → SDK Token</Link>.
              </div>
              <div className={styles.tokenBox}>
                <span className={styles.tokenLabel}>Your SDK Token</span>
                <div className={styles.tokenRow}>
                  <code className={styles.tokenValue}>
                    {sdkLoading ? '— loading…' : (sdkToken || '— not available')}
                  </code>
                  <button
                    className={styles.copyBtn}
                    onClick={() => copy(sdkToken, 'token')}
                    disabled={!sdkToken}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copied === 'token' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepBody}>
              <div className={styles.stepTitle}>Install &amp; run the init command in your project</div>
              <div className={styles.stepDesc}>
                Open a terminal in your <strong>backend project folder</strong> and run all three commands in order.
                The CLI automatically patches your <code style={{background:'rgba(0,0,0,0.06)', padding:'2px 6px', borderRadius:4, fontFamily:'monospace'}}>package.json</code> start script — no source file changes needed.
              </div>

              {/* Command block 1 */}
              <div style={{marginBottom:'0.75rem'}}>
                <div style={{fontSize:'0.75rem', fontWeight:700, color:'#888', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.06em'}}>Step 2a — Install the package</div>
                <div className={styles.terminal}>
                  <div className={styles.termHeader}>
                    <span className={styles.termDot} style={{ background: '#ff5f57' }} />
                    <span className={styles.termDot} style={{ background: '#febc2e' }} />
                    <span className={styles.termDot} style={{ background: '#28c840' }} />
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

              {/* Command block 2 */}
              <div style={{marginBottom:'0.75rem'}}>
                <div style={{fontSize:'0.75rem', fontWeight:700, color:'#888', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.06em'}}>Step 2b — Run the init command (auto-configures everything)</div>
                <div className={styles.terminal}>
                  <div className={styles.termHeader}>
                    <span className={styles.termDot} style={{ background: '#ff5f57' }} />
                    <span className={styles.termDot} style={{ background: '#febc2e' }} />
                    <span className={styles.termDot} style={{ background: '#28c840' }} />
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
                  ].map(item => (
                    <div key={item} className={styles.whatItem}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepBody}>
              <div className={styles.stepTitle}>Start your server</div>
              <div className={styles.stepDesc}>
                Your start script is now patched. Just run it normally — monitoring starts automatically:
              </div>
              <div className={styles.terminal}>
                <div className={styles.termHeader}>
                  <span className={styles.termDot} style={{ background: '#ff5f57' }} />
                  <span className={styles.termDot} style={{ background: '#febc2e' }} />
                  <span className={styles.termDot} style={{ background: '#28c840' }} />
                  <span className={styles.termTitle}>Terminal</span>
                  <button className={styles.termCopy} onClick={() => copy(pmCmds.run, 'run')}>
                      {copied === 'run' ? '✓ Copied!' : 'Copy'}
                    </button>
                </div>
                <div className={styles.termBody}>
                  <span className={styles.prompt}>~/your-backend ❯ </span>
                  <span className={styles.cmd}>{pmCmds.run} &nbsp;<span className={styles.comment}># monitoring loads automatically</span></span>
                </div>
              </div>
              <div style={{marginTop:'1rem', padding:'0.85rem 1.2rem', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:12, fontSize:'0.85rem', color:'#059669'}}>
                🟢 You will see <strong>[api-nest] Monitoring active</strong> in your terminal when it&apos;s working.
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div className={styles.stepBody}>
              <div className={styles.stepTitle}>Watch your APIs appear live!</div>
              <div className={styles.stepDesc}>
                Make any HTTP request to your server (open your app, hit an endpoint, call your API).
                Every request will appear in the Overview dashboard in real-time — method, path, status, latency.
              </div>
              <Link href="/overview" className={styles.dashBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                Open Dashboard →
              </Link>
            </div>
          </div>

        </div>

        {/* Docker Section */}
        <div className={styles.trouble} style={{marginBottom:'1.5rem'}}>
          <div className={styles.troubleTitle}>🐳 Using Docker?</div>
          <p style={{fontSize:'0.9rem', color:'var(--text-muted, #6B6B6B)', marginBottom:'1.25rem', lineHeight:1.6}}>
            When your server runs inside a Docker container, <code style={{background:'rgba(0,0,0,0.06)', padding:'2px 6px', borderRadius:4, fontFamily:'monospace'}}>localhost:4000</code> points to the container itself — not your host machine.
            Use environment variables to tell the agent where to reach the API Nest backend. <strong>No file changes needed.</strong>
          </p>

          <div style={{marginBottom:'1rem'}}>
            <div style={{fontSize:'0.75rem', fontWeight:700, color:'#888', marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.06em'}}>Option A — docker run</div>
            <div className={styles.terminal}>
              <div className={styles.termHeader}>
                <span className={styles.termDot} style={{ background: '#ff5f57' }} />
                <span className={styles.termDot} style={{ background: '#febc2e' }} />
                <span className={styles.termDot} style={{ background: '#28c840' }} />
                <span className={styles.termTitle}>Terminal</span>
              </div>
              <div className={styles.termBody} style={{lineHeight:2}}>
                <span className={styles.cmd}>docker run \</span><br/>
                <span className={styles.cmd}>&nbsp; -e APINEST_BACKEND_URL=http://host.docker.internal:4000 \</span><br/>
                <span className={styles.cmd}>&nbsp; -e APINEST_SDK_TOKEN={sdkToken || 'sdk_your_token'} \</span><br/>
                <span className={styles.cmd}>&nbsp; -e APINEST_PROJECT_ID=your_project_id \</span><br/>
                <span className={styles.cmd}>&nbsp; your-image</span>
              </div>
            </div>
          </div>

          <div style={{marginBottom:'1rem'}}>
            <div style={{fontSize:'0.75rem', fontWeight:700, color:'#888', marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.06em'}}>Option B — docker-compose.yml</div>
            <div className={styles.terminal}>
              <div className={styles.termHeader}>
                <span className={styles.termDot} style={{ background: '#ff5f57' }} />
                <span className={styles.termDot} style={{ background: '#febc2e' }} />
                <span className={styles.termDot} style={{ background: '#28c840' }} />
                <span className={styles.termTitle}>docker-compose.yml</span>
              </div>
              <div className={styles.termBody} style={{lineHeight:1.9}}>
                <span className={styles.comment}>services:</span><br/>
                <span className={styles.comment}>&nbsp; backend:</span><br/>
                <span className={styles.comment}>&nbsp;&nbsp;&nbsp; build: .</span><br/>
                <span className={styles.comment}>&nbsp;&nbsp;&nbsp; environment:</span><br/>
                <span className={styles.cmd}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; APINEST_BACKEND_URL: http://host.docker.internal:4000</span><br/>
                <span className={styles.cmd}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; APINEST_SDK_TOKEN: {sdkToken || 'sdk_your_token'}</span><br/>
                <span className={styles.cmd}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; APINEST_PROJECT_ID: your_project_id</span>
              </div>
            </div>
          </div>

          <div style={{background:'rgba(79,123,247,0.06)', border:'1px solid rgba(79,123,247,0.15)', borderRadius:12, padding:'0.9rem 1.2rem', fontSize:'0.85rem', color:'#4F7BF7'}}>
            💡 <strong>Linux Docker users:</strong> Use <code style={{fontFamily:'monospace'}}>172.17.0.1</code> instead of <code style={{fontFamily:'monospace'}}>host.docker.internal</code> — that&apos;s the Docker bridge gateway IP on Linux.
          </div>
        </div>

        {/* Troubleshoot */}
        <div className={styles.trouble}>
          <div className={styles.troubleTitle}>🛠️ Troubleshooting</div>
          <div className={styles.troubleList}>
            <details className={styles.faq}>
              <summary>APIs not showing after starting the server?</summary>
              <p>Make sure you ran <code>npm install api-nest-cli@latest</code> AND <code>npx api-nest-cli@latest init --token ...</code> before starting. Also confirm you see <strong>[api-nest] Monitoring active</strong> in the terminal output — if not, the package didn&apos;t load correctly.</p>
            </details>
            <details className={styles.faq}>
              <summary>Live Socket shows &quot;Connecting&quot;?</summary>
              <p>The WebSocket can&apos;t reach the API Nest backend. Make sure the backend is running on port 4000 and refresh the page. The status will turn green when connected.</p>
            </details>
            <details className={styles.faq}>
              <summary>Server crashes with &quot;Cannot find module api-nest-cli/register.js&quot;?</summary>
              <p>Run <code>npm install api-nest-cli@latest</code> inside your <strong>backend folder</strong> first, then run the init command again. The package must be installed locally before the node flag can load it.</p>
            </details>
            <details className={styles.faq}>
              <summary>Running from a monorepo root (e.g. project has a backend/ folder)?</summary>
              <p>Run both commands from inside your backend directory: <code>cd backend</code>, then <code>npm install api-nest-cli@latest</code>, then <code>npx api-nest-cli@latest init --token ...</code>. The CLI will patch <code>backend/package.json</code> directly.</p>
            </details>
            <details className={styles.faq}>
              <summary>My project uses TypeScript / ES Modules?</summary>
              <p>Fully supported. The CLI detects <code>&quot;type&quot;: &quot;module&quot;</code> in your package.json and uses <code>--import</code> flag (ESM) instead of <code>--require</code> (CJS) automatically.</p>
            </details>
          </div>
        </div>

      </main>
    </div>
  );
}
