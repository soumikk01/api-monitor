import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="bg-[#050505] font-body text-on-surface selection:bg-primary selection:text-black min-h-screen">
      <div className="scanline-overlay pointer-events-none fixed inset-0 z-[999]"></div>

      {/* Top Nav */}
      <header className="flex justify-between items-center w-full px-6 h-16 fixed top-0 z-[60] bg-black/80 backdrop-blur-xl border-b border-primary/20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">hub</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-primary neon-green font-headline group-hover:skew-x-[-3deg] transition-transform">NEURAL_ARCHITECT</h1>
          </div>
          <nav className="hidden md:flex gap-8 font-headline uppercase tracking-[0.25em] text-[10px] font-bold">
            <a className="text-primary border-b border-primary pb-1 transition-all" href="#">SYSTEM_CORE</a>
            <a className="text-on-surface-variant hover:text-primary transition-all" href="#">NODES_MAP</a>
            <a className="text-on-surface-variant hover:text-primary transition-all" href="#">SECURE_VAULT</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <input 
              className="bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:outline-none text-[10px] font-mono w-56 px-4 py-2 text-primary placeholder-primary/20 tracking-widest uppercase transition-all"
              placeholder="QUERY_SYSTEM..." 
              type="text" 
            />
            <span className="absolute right-3 top-2.5 text-[8px] text-primary/40 font-mono">CMD+K</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/5">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/5">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
          <button className="px-6 py-2 bg-primary text-on-primary-fixed font-headline font-bold text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-[0.97] transition-all shadow-[0_0_20px_rgba(156,255,147,0.3)]">
            DEPLOY_NODE
          </button>
        </div>
      </header>

      {/* Side Nav */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col z-50 bg-black/40 backdrop-blur-md border-r border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-secondary/10 border border-secondary/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">admin_panel_settings</span>
            </div>
            <div className="space-y-0.5">
              <p className="font-mono text-[11px] font-bold text-secondary tracking-widest">OPERATOR_01</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-secondary rounded-full pulse-fast"></span>
                <p className="font-mono text-[8px] text-on-surface-variant uppercase tracking-tighter">LVL_7_AUTH_GRNTD</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[8px] font-mono text-outline font-bold tracking-[0.3em] mb-4 uppercase">Navigation_Tree</p>
          <a className="group relative flex items-center px-6 py-3 bg-primary/5 text-primary border-l-2 border-primary" href="#">
            <span className="material-symbols-outlined text-[18px] mr-4 opacity-70">grid_view</span>
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase">Overview</span>
            <span className="absolute right-4 text-[8px] opacity-30">01</span>
          </a>
          <a className="group relative flex items-center px-6 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all" href="#">
            <span className="material-symbols-outlined text-[18px] mr-4 opacity-70">data_array</span>
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase">Active_Logs</span>
            <span className="absolute right-4 text-[8px] opacity-10">02</span>
          </a>
          <a className="group relative flex items-center px-6 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all" href="#">
            <span className="material-symbols-outlined text-[18px] mr-4 opacity-70">lan</span>
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase">Neural_Net</span>
            <span className="absolute right-4 text-[8px] opacity-10">03</span>
          </a>
          <a className="group relative flex items-center px-6 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all" href="#">
            <span className="material-symbols-outlined text-[18px] mr-4 opacity-70">memory</span>
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase">Kernel_Mod</span>
            <span className="absolute right-4 text-[8px] opacity-10">04</span>
          </a>
        </nav>
        <div className="p-6 mt-auto space-y-4">
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-3/4 shadow-[0_0_8px_rgba(0,207,252,0.5)]"></div>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-on-surface-variant tracking-widest">
            <span>MEM_USAGE</span><span>75%</span>
          </div>
          <button className="w-full py-2.5 bg-secondary text-on-secondary font-mono text-[10px] font-bold tracking-[0.2em] uppercase hover:brightness-110 active:scale-95 transition-all">EXECUTE_PROC</button>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex justify-between">
          <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">help</span></button>
          <Link href="/login" className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-sm">logout</span></Link>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="ml-64 mt-16 h-[calc(100vh-64px-32px)] flex flex-col overflow-y-auto custom-scrollbar relative">
        <div className="data-stream-bg"></div>
        <section className="p-8 space-y-8 flex-1 pb-16 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-black font-headline tracking-tight uppercase" style={{textShadow: '0 0 20px rgba(156,255,147,0.3)'}}>DASHBOARD_V2_CORE</h2>
              <p className="font-mono text-[10px] text-on-surface-variant tracking-[0.4em] font-bold">STREAMS_LIVE // AUTO_UPDATE_ACTIVE</p>
            </div>
            <div className="cyber-glass px-4 py-2 border border-primary/20 flex items-center gap-3">
              <span className="w-2 h-2 bg-primary rounded-full pulse-fast"></span>
              <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">SYNC_OK</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Uptime */}
            <div className="col-span-12 lg:col-span-5 cyber-glass p-8 neon-border-primary group transition-all hover:bg-primary/5 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-6xl">query_stats</span>
              </div>
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Global_Uptime_Metric</p>
                  <div className="h-0.5 w-12 bg-primary shadow-[0_0_5px_#9cff93]"></div>
                </div>
                <span className="text-[8px] font-mono text-primary bg-primary/10 px-2 py-1 border border-primary/20 uppercase tracking-widest">REALTIME_V_A</span>
              </div>
              <div className="flex items-end gap-3 mb-6">
                <h3 className="font-headline font-black text-7xl tracking-tighter text-on-surface" style={{textShadow: '0 0 15px rgba(156,255,147,0.3)'}}>99.99</h3>
                <span className="text-primary font-headline text-3xl font-bold mb-2">%</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-1.5 w-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_10px_#9cff93]" style={{width: '99.99%'}}></div>
                </div>
                <div className="flex justify-between font-mono text-[8px] text-on-surface-variant tracking-[0.2em] font-bold">
                  <span>UP_PK_24H</span>
                  <span className="text-primary">NO_DRP_DTCTD</span>
                </div>
              </div>
            </div>

            {/* Active Nodes */}
            <div className="col-span-12 lg:col-span-4 cyber-glass p-8 neon-border-secondary group transition-all hover:bg-secondary/5">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Active_Monitor_Nodes</p>
                  <div className="h-0.5 w-12 bg-secondary shadow-[0_0_5px_#00cffc]"></div>
                </div>
                <span className="material-symbols-outlined text-secondary text-sm">sensors</span>
              </div>
              <div className="flex items-end gap-3 mb-6">
                <h3 className="font-headline font-black text-7xl tracking-tighter text-on-surface" style={{textShadow: '0 0 15px rgba(0,238,252,0.3)'}}>14</h3>
                <span className="text-secondary font-mono text-[10px] font-bold mb-2 uppercase tracking-widest">Active_Inst</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                <div className="h-6 bg-secondary/40 border border-secondary/20"></div>
                <div className="h-6 bg-secondary/60 border border-secondary/20"></div>
                <div className="h-6 bg-secondary/80 border border-secondary/20"></div>
                <div className="h-6 bg-secondary border border-secondary/20"></div>
              </div>
            </div>

            {/* Alert Status */}
            <div className="col-span-12 lg:col-span-3 cyber-glass p-8 neon-border-error group transition-all hover:bg-error/5">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Alert_Status</p>
                  <div className="h-0.5 w-12 bg-error shadow-[0_0_5px_#ff7351]"></div>
                </div>
                <span className="material-symbols-outlined text-error text-sm pulse-fast">warning</span>
              </div>
              <div className="flex items-end gap-3 mb-6">
                <h3 className="font-headline font-black text-7xl tracking-tighter text-error" style={{textShadow: '0 0 15px rgba(255,115,81,0.3)'}}>01</h3>
              </div>
              <div className="bg-error/10 border border-error/20 p-2">
                <p className="font-mono text-[8px] text-error font-bold uppercase tracking-widest">Critical_Fault_In: AUTH_SRV</p>
              </div>
            </div>
          </div>

          {/* Table and Chart */}
          <div className="grid grid-cols-12 gap-8 items-stretch">
            {/* API Status Table */}
            <div className="col-span-12 xl:col-span-8 space-y-4">
              <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary"></div>
                  <h4 className="font-headline font-bold text-lg tracking-tight uppercase">TRAFFIC_CONTROL_MATRIX</h4>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-mono text-[10px] text-on-surface-variant font-bold tracking-widest">LAST_SYNC: 0.2S_AGO</p>
                  <button className="text-primary hover:rotate-180 transition-transform duration-700">
                    <span className="material-symbols-outlined text-lg">refresh</span>
                  </button>
                </div>
              </div>
              <div className="cyber-glass overflow-hidden border border-white/5">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-on-surface-variant/80 border-b border-white/10">
                      <th className="px-8 py-5 font-bold uppercase tracking-[0.3em] text-[9px]">Identifier</th>
                      <th className="px-8 py-5 font-bold uppercase tracking-[0.3em] text-[9px]">Protocol_State</th>
                      <th className="px-8 py-5 font-bold uppercase tracking-[0.3em] text-[9px]">Latency</th>
                      <th className="px-8 py-5 font-bold uppercase tracking-[0.3em] text-[9px]">Exit_Code</th>
                      <th className="px-8 py-5 font-bold uppercase tracking-[0.3em] text-[9px] text-right">System_Msg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="group hover:bg-primary/5 transition-colors">
                      <td className="px-8 py-4 text-on-surface font-bold tracking-widest group-hover:text-primary transition-colors">AUTH_SERVER_PRIMARY</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          <span className="text-primary text-[10px] font-bold tracking-widest">0x00_OPRNL</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-secondary font-bold">42.02 MS</td>
                      <td className="px-8 py-4 opacity-50">200_OK</td>
                      <td className="px-8 py-4 text-right text-on-surface-variant font-medium">PKT_FLW_STABLE</td>
                    </tr>
                    <tr className="group hover:bg-primary/5 transition-colors">
                      <td className="px-8 py-4 text-on-surface font-bold tracking-widest group-hover:text-primary transition-colors">PAYMENT_GW_RETAIL</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          <span className="text-primary text-[10px] font-bold tracking-widest">0x00_OPRNL</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-secondary font-bold">118.45 MS</td>
                      <td className="px-8 py-4 opacity-50">200_OK</td>
                      <td className="px-8 py-4 text-right text-on-surface-variant font-medium">PKT_FLW_STABLE</td>
                    </tr>
                    <tr className="group bg-error/5 hover:bg-error/10 transition-colors">
                      <td className="px-8 py-4 text-on-surface font-bold tracking-widest">USER_STORAGE_RELAY</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-error pulse-fast"></span>
                          <span className="text-error text-[10px] font-bold tracking-widest">0x01_FAILED</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-error font-bold">TIMEOUT</td>
                      <td className="px-8 py-4 text-error font-bold">503_ERR</td>
                      <td className="px-8 py-4 text-right text-error font-bold">SRV_NOT_RSPNDNG</td>
                    </tr>
                    <tr className="group hover:bg-tertiary/5 transition-colors">
                      <td className="px-8 py-4 text-on-surface font-bold tracking-widest">LEGACY_INV_SYSTEM</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                          <span className="text-tertiary text-[10px] font-bold tracking-widest">0x02_WARN</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-tertiary font-bold">842.10 MS</td>
                      <td className="px-8 py-4 opacity-50">200_OK</td>
                      <td className="px-8 py-4 text-right text-on-surface-variant font-medium">THOLD_EXCEEDED</td>
                    </tr>
                    <tr className="group hover:bg-primary/5 transition-colors">
                      <td className="px-8 py-4 text-on-surface font-bold tracking-widest group-hover:text-primary transition-colors">CDN_EDGE_OPTIMIZER</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          <span className="text-primary text-[10px] font-bold tracking-widest">0x00_OPRNL</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-secondary font-bold">12.01 MS</td>
                      <td className="px-8 py-4 opacity-50">200_OK</td>
                      <td className="px-8 py-4 text-right text-on-surface-variant font-medium">PKT_FLW_STABLE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Latency Chart */}
            <div className="col-span-12 xl:col-span-4 cyber-glass p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-sm tracking-[0.2em] uppercase">Latency_Stream</h4>
                  <div className="h-0.5 w-8 bg-secondary"></div>
                </div>
                <span className="material-symbols-outlined text-secondary text-sm">auto_graph</span>
              </div>
              <div className="flex-1 relative flex items-end min-h-[200px]">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="latency-grad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#00cffc" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00cffc" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur result="coloredBlur" stdDeviation="1.5" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="20" y2="20" />
                  <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="40" y2="40" />
                  <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="60" y2="60" />
                  <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="80" y2="80" />
                  <path d="M0,80 L10,75 L20,85 L30,55 L40,65 L50,35 L60,45 L70,25 L80,35 L90,15 L100,20 L100,100 L0,100 Z" fill="url(#latency-grad)" />
                  <path d="M0,80 L10,75 L20,85 L30,55 L40,65 L50,35 L60,45 L70,25 L80,35 L90,15 L100,20" fill="none" filter="url(#glow)" stroke="#00cffc" strokeWidth="2" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-black/40 border-l-2 border-secondary p-4">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant mb-1">AVG_TIME</p>
                  <p className="font-mono text-xl font-black text-secondary">124<span className="text-[10px] ml-1">MS</span></p>
                </div>
                <div className="bg-black/40 border-l-2 border-primary p-4">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant mb-1">P99_PEAK</p>
                  <p className="font-mono text-xl font-black text-primary">412<span className="text-[10px] ml-1">MS</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-secondary"></div>
              <h4 className="font-headline font-bold text-lg tracking-tight uppercase">SYSTEM_OUTPUT_STREAMS</h4>
            </div>
            <div className="cyber-glass border border-white/10 relative">
              <div className="bg-white/5 px-6 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-error/50"></div>
                    <div className="w-2 h-2 rounded-full bg-secondary/50"></div>
                    <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                  </div>
                  <span className="font-mono text-[9px] text-primary font-bold tracking-[0.4em] uppercase">TERMINAL_INSTANCE: 0x2A9</span>
                </div>
                <div className="flex gap-4 font-mono text-[9px] text-on-surface-variant">
                  <span className="border-r border-white/10 pr-4">ENC: BASE64_AES</span>
                  <span className="border-r border-white/10 pr-4">BUFF: 1024KB</span>
                  <span className="text-primary/70">ROOT_ACCESS: GRNTD</span>
                </div>
              </div>
              <div className="p-6 h-64 overflow-y-auto font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/60 selection:bg-primary/30">
                <p className="text-white/40 mb-1"><span className="text-primary/70">[14:22:01.442]</span> <span className="text-secondary font-bold">INFO:</span> HANDSHAKE_INIT &gt;&gt; AUTH_SERVER_PRIMARY (ADDR: 192.168.0.1)</p>
                <p className="text-white/40 mb-1"><span className="text-primary/70">[14:22:02.102]</span> <span className="text-primary font-bold">SUCCESS:</span> HANDSHAKE_CPLT &lt;&lt; AUTH_SERVER_PRIMARY (LAT: 42ms)</p>
                <p className="text-white/40 mb-1"><span className="text-primary/70">[14:22:05.881]</span> <span className="text-secondary font-bold">INFO:</span> POLLING_INSTANCES &gt;&gt; PAYMENT_GATEWAY_V3 [INSTANCE_ID: 0x4f]</p>
                <p className="text-white/40 mb-1"><span className="text-primary/70">[14:22:10.003]</span> <span className="text-error font-bold">ERR_0x99:</span> TIMEOUT_EXCEPTION &lt;&lt; USER_STORAGE_RELAY [ATTEMPT 3/5]</p>
                <p className="text-white/40 mb-2 p-2 bg-error/10 border border-error/20"><span className="text-error font-bold">[14:22:12.112] CRITICAL:</span> SERVICE_STATE_CHANGE &gt;&gt; USER_STORAGE_RELAY :: [ONLINE] -&gt; [FAULT]. FAILOVER_SEQ_INITIATED.</p>
                <p className="text-white/40 mb-1"><span className="text-primary/70">[14:22:15.655]</span> <span className="text-tertiary font-bold">WARN:</span> LATENCY_SPIKE_DETECTION &lt;&lt; LEGACY_INV_SYSTEM :: VALUE: 842ms | THOLD: 500ms</p>
                <p className="text-white/40 mb-1"><span className="text-primary/70">[14:22:20.210]</span> <span className="text-secondary font-bold">INFO:</span> LOAD_BALANCER_REROUTE :: SUCCESS. REDIRECTED_TRAFFIC_TO: [12_NODES_CLUSTER_B]</p>
                <p className="text-white/40 mb-1"><span className="text-primary/70">[14:22:25.109]</span> <span className="text-secondary font-bold">INFO:</span> SYS_INTEGRITY_CHECK :: STATUS: NOMINAL</p>
                <p className="text-primary font-black animate-pulse mt-2 tracking-widest cursor-default">SYSTEM_AWAITING_INPUT_...</p>
              </div>
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
            <span className="text-primary flex items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              API_STATUS_READY
            </span>
          </div>
          <div className="font-black font-mono text-[10px] text-primary/30 tracking-[0.3em]">
            SYS_VER_4.9.2_OBSIDIAN
          </div>
        </footer>
      </main>

      {/* Corner glows */}
      <div className="fixed top-0 right-0 w-32 h-32 bg-primary/5 pointer-events-none blur-3xl z-0"></div>
      <div className="fixed bottom-0 left-0 w-48 h-48 bg-secondary/5 pointer-events-none blur-3xl z-0"></div>
    </div>
  );
}
