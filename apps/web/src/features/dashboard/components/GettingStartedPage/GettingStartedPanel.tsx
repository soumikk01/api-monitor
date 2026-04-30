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

  // Real token used in clipboard copy — never shown in full on screen
  const tok = sdkToken || 'sdk_your_token_here';
  const backBase = API.replace('/api/v1', '');

  // Masked version shown on screen — reveal only on explicit user action
  const maskToken = (t: string) => t.length > 12 ? `${t.slice(0, 12)}••••••••` : t;
  const displayTok = tokenVisible ? tok : maskToken(tok);

  // Install URL — upgrade to HTTPS in production
  const isLocalhost = backBase.includes('localhost') || backBase.includes('127.0.0.1');
  const installBase = isLocalhost ? backBase : backBase.replace('http://', 'https://');

  const cliCmd = `${pmCmds.exec} api-nest-cli@latest init --token ${tok}`;
  // Display version with masked token
  const cliCmdDisplay = `${pmCmds.exec} api-nest-cli@latest init --token ${displayTok}`;


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

          <StepCard num={2} title="Run the init command — auto-configures everything">
            <div className={styles.stepDesc}>
              This validates your token, creates a project, and patches your start script automatically.
              <strong> No source file changes needed.</strong>
            </div>
            <div className={styles.terminal}>
              <div className={styles.termHeader}>
                <span className={styles.termDot} style={{ background: '#ff5f57' }} />
                <span className={styles.termDot} style={{ background: '#febc2e' }} />
                <span className={styles.termDot} style={{ background: '#28c840' }} />
                <span className={styles.termTitle}>Terminal — initialize monitoring</span>
                <button className={`${styles.termCopy} ${copied === 'node-init' ? styles.termCopied : ''}`} onClick={() => copy(cliCmd, 'node-init')}>
                  {copied === 'node-init' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <div className={styles.termBody}>
                <span className={styles.prompt}>~/your-project ❯ </span>
                <span className={styles.cmd}>{cliCmdDisplay}</span>
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

          <StepCard num={4} title="Watch your APIs stream live! 🎉">
            <div className={styles.stepDesc}>
              Make any HTTP request to your server — it appears on the dashboard instantly with method, path, status, and latency.
            </div>
            <div className={styles.ctaCard}>
              <div className={styles.ctaText}>
                <h3>Open your live dashboard</h3>
                <p>Traffic streams in real-time via WebSocket</p>
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
            <EnvBlock
              winKey="java-setup-win" unixKey="java-setup-unix"
              win={`$env:APINEST_SDK_TOKEN="${tok}"\n$env:APINEST_BACKEND_URL="${installBase}"\niwr -useb ${installBase}/install.ps1 | iex`}
              unix={`export APINEST_SDK_TOKEN="${tok}"\nexport APINEST_BACKEND_URL="${installBase}"\ncurl -fsSL ${installBase}/install.sh | bash`}
              winDisplay={`$env:APINEST_SDK_TOKEN="${displayTok}"\n$env:APINEST_BACKEND_URL="${installBase}"\niwr -useb ${installBase}/install.ps1 | iex`}
              unixDisplay={`export APINEST_SDK_TOKEN="${displayTok}"\nexport APINEST_BACKEND_URL="${installBase}"\ncurl -fsSL ${installBase}/install.sh | bash`}
              copied={copied} onCopy={copy}
            />
            <CaptureGrid items={[
              'Auto-detects your Java package name',
              'Places ApiMonitorFilter.java in src/main/java/<your.package>/',
              'No pom.xml changes needed',
              'No Maven dependencies to add',
            ]} />
          </StepCard>

          <StepCard num={2} title="Start your Spring Boot server — monitoring is live">
            <div className={styles.stepDesc}>
              The filter is already in place. Just start your server normally:
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

          <StepCard num={2} title="Set your SDK token as an environment variable">
            <div className={styles.stepDesc}>
              The <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>ApiMonitorMiddleware</code> reads the token from the environment — zero code changes.
            </div>
            <EnvBlock
              winKey="py-env-win" unixKey="py-env-unix"
              win={`$env:APINEST_SDK_TOKEN="${tok}"\n$env:APINEST_BACKEND_URL="${backBase}"\n$env:PORT="8000"`}
              unix={`export APINEST_SDK_TOKEN="${tok}"\nexport APINEST_BACKEND_URL="${backBase}"\nexport PORT=8000`}
              fileType="python"
              fileContent={`APINEST_SDK_TOKEN=${tok}\nAPINEST_BACKEND_URL=${backBase}\nPORT=8000`}
              copied={copied} onCopy={copy}
            />
          </StepCard>

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
            <div className={styles.endpointList}>
              {[
                ['GET',  '/api/ping', 'Health check'],
                ['POST', '/api/auth/login', 'Authentication'],
                ['GET',  '/api/users', 'User list (requires auth)'],
                ['GET',  '/api/products', 'Product catalog'],
                ['GET',  '/docs', 'Swagger UI (auto-generated)'],
              ].map(([m, path, desc]) => (
                <div key={path} className={styles.endpointItem}>
                  <span className={`${styles.methodBadge} ${m === 'GET' ? styles.methodGet : styles.methodPost}`}>{m}</span>
                  <code style={{ fontFamily: 'monospace', fontSize: '0.8em' }}>{path}</code>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 'auto' }}>{desc}</span>
                </div>
              ))}
            </div>
          </StepCard>
        </div>
      )}

      {/* ══════════════ GO STEPS ══════════════ */}
      {lang === 'go' && (
        <div className={styles.steps}>
          <StepCard num={1} title="Set your SDK token as an environment variable">
            <div className={styles.stepDesc}>
              The Go middleware reads <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>APINEST_SDK_TOKEN</code> at startup — zero code changes needed.
            </div>
            <EnvBlock
              winKey="go-env-win" unixKey="go-env-unix"
              win={`$env:APINEST_SDK_TOKEN="${tok}"\n$env:APINEST_BACKEND_URL="${backBase}"\n$env:PORT="8080"`}
              unix={`export APINEST_SDK_TOKEN="${tok}"\nexport APINEST_BACKEND_URL="${backBase}"\nexport PORT=8080`}
              fileType="go"
              fileContent={`APINEST_SDK_TOKEN=${tok}\nAPINEST_BACKEND_URL=${backBase}\nPORT=8080`}
              copied={copied} onCopy={copy}
            />
          </StepCard>

          <StepCard num={2} title="Run the server — no build step required">
            <div className={styles.stepDesc}>
              Go compiles and runs in one command. No <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>go build</code> required.
            </div>
            <TermBlock
              title="Terminal"
              cmd="go run main.go"
              copyKey="go-run"
              copied={copied}
              onCopy={copy}
            />
            <SuccessTip>Look for <strong>[api-monitor] Sender active → …/ingest</strong>. Server runs on <strong>http://localhost:8080</strong>.</SuccessTip>
          </StepCard>

          <StepCard num={3} title="Watch your Go APIs stream live! 🎉">
            <div className={styles.stepDesc}>
              Hit any endpoint on <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>http://localhost:8080/api/v1/ping</code> to confirm it&apos;s working.
            </div>
            <div className={styles.endpointList}>
              {[
                ['GET',  '/api/v1/ping', 'Health check'],
                ['POST', '/api/v1/auth/login', 'Authentication'],
                ['GET',  '/api/v1/users', 'User list'],
                ['GET',  '/api/v1/products', 'Product catalog'],
                ['GET',  '/api/v1/system/slow', 'Intentional 2-3s delay'],
              ].map(([m, path, desc]) => (
                <div key={path} className={styles.endpointItem}>
                  <span className={`${styles.methodBadge} ${m === 'GET' ? styles.methodGet : styles.methodPost}`}>{m}</span>
                  <code style={{ fontFamily: 'monospace', fontSize: '0.8em' }}>{path}</code>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 'auto' }}>{desc}</span>
                </div>
              ))}
            </div>
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
          {[
            ['APIs not showing after starting the server?',
              'Make sure you ran the install AND init commands before starting. Confirm you see [api-nest] Monitoring active in the terminal.'],
            ['Dashboard shows "Connecting"?',
              'The WebSocket can\'t reach the API Nest backend. Make sure the backend is running on port 4000 and refresh the page.'],
            ['"Cannot find module api-nest-cli/register.js"?',
              'Run npm install api-nest-cli@latest inside your backend folder first, then run the init command again.'],
            ['Running from a monorepo root?',
              'Run both commands from inside your backend directory: cd backend, then npm install api-nest-cli, then the init command.'],
            ['Using TypeScript or ES Modules?',
              'Fully supported. The CLI detects "type": "module" in your package.json and uses --import (ESM) instead of --require (CJS) automatically.'],
          ].map(([q, a]) => (
            <details key={q} className={styles.faq}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}
