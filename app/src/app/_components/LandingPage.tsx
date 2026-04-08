import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface font-body cursor-crosshair grid-pattern min-h-screen">
      <div className="scanlines fixed inset-0 z-40 pointer-events-none"></div>

      {/* Nav */}
      <nav className="flex justify-between items-center w-full px-6 h-16 fixed top-0 z-[60] bg-black/80 backdrop-blur-xl border-b border-primary/20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">hub</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-primary neon-green font-headline">
              NEURAL_ARCHITECT
            </span>
          </div>
          <div className="hidden md:flex gap-8 font-headline uppercase tracking-[0.25em] text-[10px] font-bold">
            <a className="text-on-surface-variant hover:text-primary transition-all" href="#">SYSTEM_CORE</a>
            <a className="text-on-surface-variant hover:text-primary transition-all" href="#">NODES_MAP</a>
            <a className="text-on-surface-variant hover:text-primary transition-all" href="#">SECURE_VAULT</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-6 py-2 bg-primary text-black font-headline font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(156,255,147,0.3)]">
            INITIALIZE_SESSION
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
        <div className="space-y-8 pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-sm">
            <span className="w-2 h-2 bg-primary rounded-full pulse-fast"></span>
            <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">v2.4.0 Engine Active</span>
          </div>
          <h1 className="font-headline font-black text-7xl md:text-8xl tracking-tighter uppercase leading-none text-on-surface neon-green" style={{letterSpacing: '-0.05em'}}>
            Monitor<br/>
            <span className="text-primary">Your<br/>APIs</span><br/>
            in Real-Time
          </h1>
          <p className="text-on-surface-variant leading-relaxed data-stream-bg p-4 rounded-sm border border-white/5">
            Instantly track uptime, errors, and performance with a single command. The command center for high-performance engineering teams.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="phosphor-glow text-on-primary-fixed px-8 py-4 font-headline font-bold text-[10px] uppercase tracking-widest hover:skew-x-[-3deg] hover:translate-y-[-2px] transition-all duration-75 hover:shadow-[0_0_25px_rgba(0,255,65,0.4)]">
              Get Started
            </Link>
            <button className="border border-secondary/20 hover:border-secondary px-8 py-4 font-headline font-bold text-sm uppercase tracking-widest transition-all text-neon-cyan bg-secondary/5">
              View Demo
            </button>
          </div>
        </div>
        <div className="relative hidden lg:block pt-20">
          <div className="glass-panel terminal-glow relative rounded-sm overflow-hidden p-8 border-secondary/20">
            <div className="bg-surface-container/50 px-6 py-3 flex items-center justify-between border-b border-white/10 mb-6">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-error/50"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary/50"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                </div>
                <span className="font-mono text-[9px] text-primary font-bold tracking-[0.4em] uppercase">TERMINAL_INSTANCE: 0x2A9</span>
              </div>
            </div>
            <div className="font-mono text-[11px] leading-relaxed space-y-1">
              <p className="text-white/40"><span className="text-primary/70">[14:22:01.442]</span> <span className="text-secondary font-bold">INFO:</span> HANDSHAKE_INIT &gt;&gt; AUTH_SERVER_PRIMARY</p>
              <p className="text-white/40"><span className="text-primary/70">[14:22:02.102]</span> <span className="text-primary font-bold">SUCCESS:</span> HANDSHAKE_CPLT (LAT: 42ms)</p>
              <p className="text-white/40"><span className="text-primary/70">[14:22:10.003]</span> <span className="text-error font-bold">ERR_0x99:</span> TIMEOUT_EXCEPTION &lt;&lt; USER_STORAGE_RELAY</p>
              <p className="text-white/40 p-2 bg-error/10 border border-error/20"><span className="text-error font-bold">[14:22:12.112] CRITICAL:</span> SERVICE_STATE_CHANGE &gt;&gt; [ONLINE] -&gt; [FAULT]</p>
              <p className="text-white/40"><span className="text-primary/70">[14:22:15.655]</span> <span className="text-tertiary font-bold">WARN:</span> LATENCY_SPIKE_DETECTION :: 842ms | THOLD: 500ms</p>
              <p className="text-primary font-black animate-pulse mt-2 tracking-widest">SYSTEM_AWAITING_INPUT_...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-screen-2xl mx-auto px-8 py-32">
        <div className="mb-16">
          <h2 className="font-headline font-black text-4xl uppercase tracking-tight mb-4 text-on-surface neon-green">Core Infrastructure</h2>
          <div className="h-0.5 w-32 bg-primary shadow-[0_0_5px_#9cff93]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto md:h-[800px]">
          <div className="md:col-span-3 bg-surface-container-low p-8 border border-white/5 hover:border-primary/40 transition-all group glitch-border relative">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <span className="material-symbols-outlined text-primary text-6xl mb-6 block">explore</span>
            <h3 className="font-headline font-bold text-2xl uppercase tracking-widest mb-4">Auto API Detection</h3>
            <p className="text-on-surface-variant leading-relaxed data-stream-bg p-4 rounded-sm border border-white/5">
              Our engine crawls your infrastructure to identify and map all active API routes automatically.
            </p>
            <div className="mt-6 font-mono text-[10px] text-primary/40 group-hover:text-primary tracking-widest transition-colors">
              ./scan_active_routes -- recursive
            </div>
          </div>
          <div className="md:col-span-3 bg-surface-container-low p-8 border border-white/5 hover:border-secondary/40 transition-all group relative">
            <span className="material-symbols-outlined text-secondary text-6xl mb-6 block">dynamic_feed</span>
            <h3 className="font-headline font-bold text-2xl uppercase tracking-widest mb-4">Real-Time Monitoring</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Sub-second precision on uptime and status changes. Get notified via Slack before your users notice.
            </p>
          </div>
          <div className="md:col-span-3 bg-surface-container-low p-8 border border-white/5 hover:border-tertiary/40 transition-all group relative">
            <span className="material-symbols-outlined text-tertiary text-6xl mb-6 block">insights</span>
            <h3 className="font-headline font-bold text-2xl uppercase tracking-widest mb-4">Latency Analytics</h3>
            <p className="text-on-surface-variant leading-relaxed">
              P99 latency distribution across global regions. Identify bottlenecks instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="bg-black/60 py-24 border-y border-primary/10">
        <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left group">
            <div className="text-neon-cyan font-mono text-4xl font-black mb-1 group-hover:animate-pulse">99.99%</div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em]">Platform Uptime</div>
          </div>
          <div className="text-center md:text-left group">
            <div className="text-primary font-mono text-4xl font-black mb-1 group-hover:animate-pulse">1.2B+</div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em]">Requests Scanned</div>
          </div>
          <div className="text-center md:text-left group">
            <div className="text-tertiary font-mono text-4xl font-black mb-1 group-hover:animate-pulse">&lt; 5ms</div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em]">Latency Overhead</div>
          </div>
          <div className="text-center md:text-left group">
            <div className="text-on-surface font-mono text-4xl font-black mb-1 group-hover:animate-pulse">25+</div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em]">Global Nodes</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-between items-center px-10 h-10 w-full fixed bottom-0 z-[60] bg-black/90 border-t border-primary/20 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <p className="font-mono text-[9px] tracking-[0.2em] text-primary/80 uppercase">© 2024 NEURAL_ARCHITECT // CORE_KERNEL_STABLE</p>
          <div className="w-1 h-1 bg-primary rounded-full pulse-fast"></div>
        </div>
        <div className="flex gap-8 items-center font-mono text-[9px] tracking-widest text-on-surface-variant">
          <a className="hover:text-primary transition-all uppercase" href="#">LEGAL_DOCS</a>
          <a className="hover:text-primary transition-all uppercase" href="#">TECH_MANUAL</a>
          <Link href="/login" className="text-primary flex items-center gap-2 uppercase">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            INITIALIZE_SESSION
          </Link>
        </div>
      </footer>
    </div>
  );
}

