'use client';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './GettingStartedPage.module.scss';



const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface Props {
  projectId?: string;
  serviceId?: string;
  serviceName?: string;
}

// ── Small helpers ────────────────────────────────────────────────────────────

function TermBlock({
  title, cmd, copyKey, copied, onCopy,
}: { title: string; cmd: string; copyKey: string; copied: string | null; onCopy: (t: string, k: string) => void }) {
  return (
    <div className={styles.terminal}>
      <div className={styles.termHeader}>
        <span className={styles.termDot} style={{ background: '#ff5f57' }} />
        <span className={styles.termDot} style={{ background: '#febc2e' }} />
        <span className={styles.termDot} style={{ background: '#28c840' }} />
        <span className={styles.termTitle}>{title}</span>
        <button
          className={`${styles.termCopy} ${copied === copyKey ? styles.termCopied : ''}`}
          onClick={() => onCopy(cmd, copyKey)}
        >
          {copied === copyKey ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <div className={styles.termBody}>
        <span className={styles.prompt}>~/your-project ❯ </span>
        <span className={styles.cmd}>{cmd}</span>
      </div>
    </div>
  );
}

function EnvBlock({
  win, unix, copied, onCopy, winKey, unixKey, winDisplay, unixDisplay,
}: {
  win: string; unix: string; winKey: string; unixKey: string;
  winDisplay?: string; unixDisplay?: string;
  copied: string | null; onCopy: (t: string, k: string) => void;
  fileContent?: string; fileType?: string;
}) {
  const [os, setOs] = useState<'win' | 'unix'>('win');
  // What to SHOW on screen vs what to COPY to clipboard
  const showWin  = winDisplay  ?? win;
  const showUnix = unixDisplay ?? unix;
  return (
    <div>
      <div className={styles.osPicker}>
        {(['win', 'unix'] as const).map(o => (
          <button key={o} className={`${styles.osTab} ${os === o ? styles.osTabActive : ''}`} onClick={() => setOs(o)}>
            {o === 'win' ? '🪟 Windows' : '🐧 Mac / Linux'}
          </button>
        ))}
      </div>
      {os === 'win' ? (
        <div className={styles.terminal}>
          <div className={styles.termHeader}>
            <span className={styles.termDot} style={{ background: '#ff5f57' }} />
            <span className={styles.termDot} style={{ background: '#febc2e' }} />
            <span className={styles.termDot} style={{ background: '#28c840' }} />
            <span className={styles.termTitle}>PowerShell</span>
            <button className={`${styles.termCopy} ${copied === winKey ? styles.termCopied : ''}`} onClick={() => onCopy(win, winKey)}>
              {copied === winKey ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className={styles.termBody}><span className={styles.cmd}>{showWin}</span></pre>
        </div>
      ) : (
        <div className={styles.terminal}>
          <div className={styles.termHeader}>
            <span className={styles.termDot} style={{ background: '#ff5f57' }} />
            <span className={styles.termDot} style={{ background: '#febc2e' }} />
            <span className={styles.termDot} style={{ background: '#28c840' }} />
            <span className={styles.termTitle}>Terminal (bash / zsh)</span>
            <button className={`${styles.termCopy} ${copied === unixKey ? styles.termCopied : ''}`} onClick={() => onCopy(unix, unixKey)}>
              {copied === unixKey ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className={styles.termBody}><span className={styles.cmd}>{showUnix}</span></pre>
        </div>
      )}
    </div>
  );
}



function StepCard({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepLeft}>
        <div className={styles.stepNum}>{num}</div>
        <div className={styles.stepConnector} />
      </div>
      <div className={styles.stepBody}>
        <div className={styles.stepTitle}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function CaptureGrid({ items }: { items: string[] }) {
  return (
    <div className={styles.captureGrid}>
      {items.map(i => (
        <div key={i} className={styles.captureItem}>
          <span className={styles.captureCheck}>✓</span>
          <span>{i}</span>
        </div>
      ))}
    </div>
  );
}

function SuccessTip({ children }: { children: React.ReactNode }) {
  return <div className={styles.successPill}>🟢 {children}</div>;
}

// ── Main component ───────────────────────────────────────────────────────────

export default function GettingStartedPanel({ projectId, serviceId, serviceName }: Props) {
  const [sdkToken, setSdkToken] = useState('');
  const [tokenVisible, setTokenVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [pm, setPm] = useState<'npm' | 'yarn' | 'pnpm' | 'bun'>('npm');
  const [lang, setLang] = useState<'nodejs' | 'java' | 'python' | 'go'>('nodejs');

  const pmCmds = {
    npm:  { install: 'npm install',  exec: 'npx',     run: 'npm run dev' },
    yarn: { install: 'yarn add',     exec: 'yarn dlx', run: 'yarn dev' },
    pnpm: { install: 'pnpm add',     exec: 'pnpm dlx', run: 'pnpm dev' },
    bun:  { install: 'bun add',      exec: 'bunx',     run: 'bun run dev' },
  }[pm];

  const cliCommand = `${pmCmds.exec} apio-cli@latest init --token ${sdkToken || 'sdk_your_token_here'}`;

  useEffect(() => {
    let cancelled = false;
    setSdkToken('');
    (async () => {
      try {
        if (projectId && serviceId) {
          const cached = localStorage.getItem(`svcToken:${serviceId}`);
          if (cached && !cancelled) setSdkToken(cached);
          const res = await fetchWithAuth(`${API}/projects/${projectId}/services/${serviceId}`);
          if (!res.ok) throw new Error('Failed');
          const svc = await res.json() as { sdkToken?: string };
          if (!cancelled && svc.sdkToken) {
            setSdkToken(svc.sdkToken);
            localStorage.setItem(`svcToken:${serviceId}`, svc.sdkToken);
          }
        }
      } catch { /* placeholder shown */ }
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

  const langMeta = {
    nodejs: { label: 'Node.js', emoji: '🟢', color: '#68a063' },
    java:   { label: 'Java',    emoji: '☕', color: '#f89820' },
    python: { label: 'Python',  emoji: '🐍', color: '#3572a5' },
    go:     { label: 'Go',      emoji: '🐹', color: '#00acd7' },
  };

  return (
    <div className={styles.panelWrap}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <h1>🚀 Getting Started</h1>
        {serviceName
          ? <p>Setting up <strong>{serviceName}</strong> — your SDK token is pre-filled.</p>
          : <p>Connect any backend to your live dashboard in under 60 seconds.</p>
        }
      </div>

      {/* ── Hero Banner ── */}
      <div className={styles.heroBanner}>
        <div className={styles.heroBannerGlow} />
        <div className={styles.heroIcon}>{serviceName ? '🔑' : '⚡'}</div>
        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>
            {serviceName ? `SDK Token for "${serviceName}"` : 'Zero-config API Monitoring'}
          </div>
          <div className={styles.heroSub}>
            {serviceName
              ? 'This token is pre-filled in all commands below. Just copy & run.'
              : 'Pick your language, run one command, and watch traffic flow live — no code rewrites needed.'}
          </div>
          {sdkToken && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>SDK Token</span>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#a78bfa', flex: 1, letterSpacing: tokenVisible ? 0 : 2 }}>
                {displayTok}
              </code>
              <button
                onClick={() => setTokenVisible(v => !v)}
                title={tokenVisible ? 'Hide token' : 'Reveal token'}
                style={{ background: 'none', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 6, color: '#a78bfa', cursor: 'pointer', padding: '3px 10px', fontSize: '0.78rem' }}
              >
                {tokenVisible ? '🙈 Hide' : '👁 Reveal'}
              </button>
              <button
                onClick={() => copy(tok, 'token-copy')}
                style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 6, color: '#a78bfa', cursor: 'pointer', padding: '3px 10px', fontSize: '0.78rem' }}
              >
                {copied === 'token-copy' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}
          <div className={styles.timeBadge}>⏱ Less than 60 seconds to set up</div>
        </div>
      </div>


      {/* ── Language Tabs ── */}
      <div className={styles.selectorRow}>
        <span className={styles.selectorLabel}>Choose your backend language</span>
        <div className={styles.tabs}>
          {(Object.entries(langMeta) as [typeof lang, typeof langMeta.nodejs][]).map(([l, m]) => (
            <button
              key={l}
              className={`${styles.tab} ${lang === l ? styles.tabActive : ''}`}
              onClick={() => setLang(l)}
            >
              <span className={styles.tabEmoji}>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Package manager (Node only) ── */}
      {lang === 'nodejs' && (
        <div className={styles.selectorRow}>
          <span className={styles.selectorLabel}>Package manager</span>
          <div className={styles.tabs}>
            {(['npm', 'yarn', 'pnpm', 'bun'] as const).map(p => (
              <button key={p} className={`${styles.tab} ${pm === p ? styles.tabActive : ''}`} onClick={() => setPm(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.divider} />

      {/* ══════════════ NODE.JS STEPS ══════════════ */}
      {lang === 'nodejs' && (
        <div className={styles.steps}>
          <StepCard num={1} title="Install the API Nest CLI in your backend folder">
            <div className={styles.stepDesc}>
              Open a terminal inside your <strong>backend project folder</strong> and run:
            </div>
            <TermBlock
              title="Terminal — install package"
              cmd={`${pmCmds.install} api-nest-cli`}
              copyKey="node-install"
              copied={copied}
              onCopy={copy}
            />
          </StepCard>

            <div style={{marginBottom:'0.75rem'}}>
              <div style={{fontSize:'0.75rem',fontWeight:700,color:'#888',marginBottom:'0.4rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Step 2a — Install the package</div>
              <div className={styles.terminal}>
                <div className={styles.termHeader}>
                  <span className={styles.termDot} style={{background:'#ff5f57'}}/>
                  <span className={styles.termDot} style={{background:'#febc2e'}}/>
                  <span className={styles.termDot} style={{background:'#28c840'}}/>
                  <span className={styles.termTitle}>Terminal</span>
                  <button className={styles.termCopy} onClick={() => copy(`${pmCmds.install} apio-cli`, 'install')}>
                    {copied === 'install' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <div className={styles.termBody}>
                  <span className={styles.prompt}>~/your-backend ❯ </span>
                  <span className={styles.cmd}>{pmCmds.install} apio-cli</span>
                </div>
              </div>
            </div>
            <CaptureGrid items={[
              'Validates your SDK token',
              'Creates project on dashboard',
              'Patches package.json start script',
              'Saves .api-nest.json config',
            ]} />
          </StepCard>

          <StepCard num={3} title="Start your server — monitoring loads automatically">
            <div className={styles.stepDesc}>
              Your start script is now patched. Just run it as you normally would:
            </div>
            <TermBlock
              title="Terminal — start server"
              cmd={pmCmds.run}
              copyKey="node-run"
              copied={copied}
              onCopy={copy}
            />
            <SuccessTip>Look for <strong>[api-nest] Monitoring active</strong> in your terminal output.</SuccessTip>
          </StepCard>

            <div className={styles.whatHappens}>
              <div className={styles.whatTitle}>What the init command does automatically:</div>
              <div className={styles.whatList}>
                {[
                  '✅ Validates your SDK token with the Apio backend',
                  '✅ Creates a project named after your folder',
                  '✅ Patches your package.json "dev"/"start" script with --import flag',
                  '✅ Saves .apio.json config with your project ID',
                  '✅ Zero source file changes — monitoring loads via Node.js flag',
                ].map(item => <div key={item} className={styles.whatItem}>{item}</div>)}
              </div>
              <Link href="/dashboard" className={styles.dashBtn}>
                View Dashboard →
              </Link>
            </div>
          </StepCard>
        </div>
      )}

      {/* ══════════════ JAVA STEPS ══════════════ */}
      {lang === 'java' && (
        <div className={styles.steps}>

          <StepCard num={1} title="Run the installer — automatically injects the monitoring filter">
            <div className={styles.stepDesc}>
              Open a terminal <strong>inside your Spring Boot project folder</strong> and run one command.
              The installer auto-detects your package name and drops{' '}
              <code style={{ fontFamily: 'monospace', background: 'rgba(79,123,247,0.1)', padding: '2px 6px', borderRadius: 4, fontSize: '0.85em', color: '#4F7BF7' }}>ApiMonitorFilter.java</code>
              {' '}into the right directory — <strong>no manual file editing needed</strong>.
            </div>
            <div className={styles.osPicker}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: 6 }}>OS:</span>
              {(['win', 'unix'] as const).map(o => (
                <button key={o} className={`${styles.osTab} ${o === 'win' ? styles.osTabActive : ''}`} style={{ pointerEvents: 'none', opacity: 1 }}>
                  {o === 'win' ? '🪟 Windows' : '🐧 Mac / Linux'}
                </button>
              ))}
            </div>
            <div style={{marginTop:'1rem',padding:'0.85rem 1.2rem',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:12,fontSize:'0.85rem',color:'#059669'}}>
              🟢 You will see <strong>[apio] Monitoring active</strong> in your terminal when it&apos;s working.
            </div>
            <TermBlock
              title="Maven wrapper"
              cmd=".\mvnw.cmd spring-boot:run"
              copyKey="java-run"
              copied={copied}
              onCopy={copy}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              No wrapper? Use <code style={{ fontFamily: 'monospace' }}>mvn spring-boot:run</code> or press ▶ in your IDE.
            </div>
            <SuccessTip>Look for <strong>[api-monitor] ✅ Sender active → …/ingest</strong> in your terminal.</SuccessTip>
          </StepCard>

          <StepCard num={3} title="Every request is captured automatically 🎉">
            <div className={styles.stepDesc}>
              Make any HTTP request to your server — it appears on the dashboard instantly.
            </div>
            <CaptureGrid items={[
              'Method, URL, status code',
              'Latency in milliseconds',
              'Request headers',
              'Batched every 500ms',
              'Works with Spring Security',
              'Re-queues on failure',
            ]} />
            <div className={styles.ctaCard} style={{ marginTop: '1rem' }}>
              <div className={styles.ctaText}>
                <h3>Watch it live</h3>
                <p>Real-time traffic on your dashboard</p>
              </div>
              <Link href="/dashboard" className={styles.dashBtn}>View Dashboard →</Link>
            </div>
          </StepCard>
        </div>
      )}

      {/* ══════════════ PYTHON STEPS ══════════════ */}
      {lang === 'python' && (
        <div className={styles.steps}>
          <StepCard num={1} title="Install FastAPI & Uvicorn">
            <div className={styles.stepDesc}>
              The monitoring agent uses only Python&apos;s <strong>standard library</strong> — no extra packages for monitoring itself.
            </div>
            <TermBlock
              title="Terminal"
              cmd="pip install fastapi uvicorn"
              copyKey="py-install"
              copied={copied}
              onCopy={copy}
            />
          </StepCard>

      {/* Docker Section */}
      <div className={styles.trouble} style={{marginBottom:'1.5rem'}}>
        <div className={styles.troubleTitle}>🐳 Using Docker?</div>
        <p style={{fontSize:'0.9rem',color:'#6B6B6B',marginBottom:'1.25rem',lineHeight:1.6}}>
          When your server runs inside a Docker container,{' '}
          <code style={{background:'rgba(0,0,0,0.06)',padding:'2px 6px',borderRadius:4,fontFamily:'monospace',fontSize:'0.85em'}}>localhost:4000</code>{' '}
          points to the container itself — not your host machine.
          Use environment variables to tell the agent where to reach the Apio backend.{' '}
          <strong>No file changes needed.</strong>
        </p>

          <StepCard num={3} title="Run the server — monitoring starts automatically">
            <TermBlock
              title="Terminal"
              cmd="python main.py"
              copyKey="py-run"
              copied={copied}
              onCopy={copy}
            />
            <SuccessTip>Look for <strong>[api-monitor] Sender active → …/ingest</strong> in your terminal. Server runs on <strong>http://localhost:8000</strong>.</SuccessTip>
          </StepCard>

          <StepCard num={4} title="Watch your Python APIs stream live! 🎉">
            <div className={styles.stepDesc}>
              Hit any endpoint on <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>http://localhost:8000</code> — every request appears instantly.
            </div>
            <pre className={styles.termBody}><span className={styles.cmd}>{`docker run \\
  -e APIO_BACKEND_URL=http://host.docker.internal:4000 \\
  -e APIO_SDK_TOKEN=${sdkToken || 'sdk_your_token'} \\
  -e APINEST_PROJECT_ID=your_project_id \\
  your-image`}</span></pre>
          </div>
        </div>
      )}

      {/* ══════════════ GO STEPS ══════════════ */}
      {lang === 'go' && (
        <div className={styles.steps}>
          <StepCard num={1} title="Set your SDK token as an environment variable">
            <div className={styles.stepDesc}>
              The Go middleware reads <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>APINEST_SDK_TOKEN</code> at startup — zero code changes needed.
            </div>
            <pre className={styles.termBody}><span className={styles.comment}>{`services:
  backend:
    build: .
    environment:`}</span>{'\n'}
<span className={styles.cmd}>{`      APIO_BACKEND_URL: http://host.docker.internal:4000
      APIO_SDK_TOKEN: ${sdkToken || 'sdk_your_token'}
      APINEST_PROJECT_ID: your_project_id`}</span></pre>
          </div>
        </div>
      )}

      {/* ── Docker section ── */}
      <div className={styles.trouble} style={{ marginBottom: '1.25rem' }}>
        <div className={styles.troubleTitle}>🐳 Using Docker?</div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.65 }}>
          When your server runs inside Docker, <code style={{ fontFamily: 'monospace', background: 'rgba(79,123,247,0.1)', padding: '2px 5px', borderRadius: 4, color: '#4F7BF7', fontSize: '0.85em' }}>localhost:4000</code> points to the container — not your host. Use these env vars instead:
        </p>
        <div className={styles.terminal}>
          <div className={styles.termHeader}>
            <span className={styles.termDot} style={{ background: '#ff5f57' }} />
            <span className={styles.termDot} style={{ background: '#febc2e' }} />
            <span className={styles.termDot} style={{ background: '#28c840' }} />
            <span className={styles.termTitle}>docker run</span>
            <button className={`${styles.termCopy} ${copied === 'docker' ? styles.termCopied : ''}`}
              onClick={() => copy(`docker run \\\n  -e APINEST_BACKEND_URL=http://host.docker.internal:4000 \\\n  -e APINEST_SDK_TOKEN=${tok} \\\n  your-image`, 'docker')}>
              {copied === 'docker' ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className={styles.termBody}><span className={styles.cmd}>{`docker run \\\n  -e APINEST_BACKEND_URL=http://host.docker.internal:4000 \\\n  -e APINEST_SDK_TOKEN=${tok} \\\n  your-image`}</span></pre>
        </div>
        <div className={styles.infoPill} style={{ marginTop: '0.75rem' }}>
          💡 Linux users: use <code style={{ fontFamily: 'monospace' }}>172.17.0.1</code> instead of <code style={{ fontFamily: 'monospace' }}>host.docker.internal</code>
        </div>
      </div>

      {/* ── Troubleshooting ── */}
      <div className={styles.trouble}>
        <div className={styles.troubleTitle}>🛠️ Troubleshooting</div>
        <div className={styles.troubleList}>
          <details className={styles.faq}>
            <summary>APIs not showing after starting the server?</summary>
            <p>Make sure you ran <code>npm install apio-cli@latest</code> AND <code>npx apio-cli@latest init --token ...</code> before starting. Also confirm you see <strong>[apio] Monitoring active</strong> in the terminal output.</p>
          </details>
          <details className={styles.faq}>
            <summary>Live Socket shows &quot;Connecting&quot;?</summary>
            <p>The WebSocket can&apos;t reach the Apio backend. Make sure the backend is running on port 4000 and refresh the page.</p>
          </details>
          <details className={styles.faq}>
            <summary>Server crashes with &quot;Cannot find module apio-cli/register.js&quot;?</summary>
            <p>Run <code>npm install apio-cli@latest</code> inside your <strong>backend folder</strong> first, then run the init command again.</p>
          </details>
          <details className={styles.faq}>
            <summary>Running from a monorepo root?</summary>
            <p>Run both commands from inside your backend directory: <code>cd backend</code>, then <code>npm install apio-cli@latest</code>, then the init command.</p>
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
