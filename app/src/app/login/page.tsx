'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-surface text-on-surface font-body overflow-hidden selection:bg-primary selection:text-on-primary min-h-screen">
      {/* Grid Background Layer */}
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(to right, rgba(156,255,147,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(156,255,147,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Scanline */}
      <div className="fixed inset-0 pointer-events-none z-40" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
        backgroundSize: '100% 4px'
      }}></div>

      {/* Header */}
      <header className="fixed top-0 w-full border-b border-primary/10 bg-[#0e0e0e] z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 h-16">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-[0.2em] text-primary neon-green font-headline uppercase">
              NEURAL_ARCHITECT
            </span>
            <span className="hidden md:block text-primary font-mono text-[10px] opacity-40 border-l border-primary/20 pl-4">
              LOGIN_SEC_V4.2
            </span>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary transition-colors">terminal</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary transition-colors">settings</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md group">
          {/* Decorative Accent */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 z-0 pointer-events-none" style={{clipPath: 'polygon(100% 0, 100% 70%, 30% 100%, 0 100%, 0 0)'}}></div>
          
          {/* Glass Container */}
          <div className="relative bg-surface-container-low/80 backdrop-blur-xl p-8 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Scanline */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,255,0,0.06))',
              backgroundSize: '100% 4px, 3px 100%'
            }}></div>

            <div className="relative z-10">
              {/* Title */}
              <div className="mb-10 text-left">
                <div className="flex justify-between items-baseline mb-2">
                  <h1 className="text-4xl font-extrabold tracking-[0.15em] uppercase leading-none" style={{textShadow: '-2px 0 #00eefc, 2px 0 #ff51fa'}}>
                    SYSTEM LOGIN
                  </h1>
                  <span className="font-mono text-[10px] text-tertiary">LVL_01_AUTH</span>
                </div>
                <p className="text-on-surface-variant text-sm font-mono tracking-tight">
                  IDENTITY_VERIFICATION_REQUIRED_FOR_PROTOCOL_X
                </p>
              </div>

              {/* Form */}
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Username */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-on-surface-variant tracking-widest block">USERNAME</label>
                  <div className="relative p-1" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                  }}>
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-outline pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-outline pointer-events-none"></div>
                    <input 
                      className="w-full bg-transparent border-none text-primary font-mono focus:outline-none placeholder:text-outline/30 px-3 py-2 uppercase tracking-widest text-sm"
                      placeholder="INPUT_ID" 
                      type="text" 
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-mono text-[10px] text-on-surface-variant tracking-widest block">ENCRYPTION_KEY</label>
                    <span className="material-symbols-outlined text-xs text-secondary/40">lock</span>
                  </div>
                  <div className="relative p-1" style={{background: 'rgba(255, 255, 255, 0.03)'}}>
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-outline pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-outline pointer-events-none"></div>
                    <input 
                      className="w-full bg-transparent border-none text-primary font-mono focus:outline-none placeholder:text-outline/30 px-3 py-2 tracking-widest text-sm"
                      placeholder="••••••••••••" 
                      type="password" 
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Link href="/dashboard" className="block w-full bg-primary-container text-on-primary-container py-4 font-bold uppercase tracking-[0.2em] transition-all hover:brightness-125 hover:shadow-[0_0_20px_rgba(156,255,147,0.5)] active:scale-[0.98] relative overflow-hidden text-center text-sm">
                    INITIALIZE_SESSION
                  </Link>
                </div>
              </form>

              {/* Links */}
              <div className="mt-8 flex justify-between font-mono text-[10px] tracking-widest">
                <a className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4" href="#">
                  RECOVER_ACCESS
                </a>
                <a className="text-on-surface-variant hover:text-tertiary transition-colors" href="#">
                  REQUEST_DECODING
                </a>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-8 pt-4 border-t border-white/5 flex gap-4 text-[9px] font-mono text-outline opacity-50">
              <span>IP: 192.168.0.X</span>
              <span>OS: OBSIDIAN_v0.1</span>
              <span className="ml-auto">ENCRYPT: AES-256</span>
            </div>

            {/* Floating Metadata Panel */}
            <div className="absolute -left-32 top-1/4 hidden xl:block w-24 space-y-4">
              <div className="border-l border-primary/40 pl-2">
                <p className="text-[8px] font-mono text-primary mb-1">LATENCY</p>
                <div className="h-1 w-full bg-primary/20">
                  <div className="h-full w-2/3 bg-primary"></div>
                </div>
              </div>
              <div className="border-l border-secondary/40 pl-2">
                <p className="text-[8px] font-mono text-secondary mb-1">PACKETS</p>
                <div className="flex gap-0.5">
                  <div className="w-1 h-3 bg-secondary"></div>
                  <div className="w-1 h-3 bg-secondary"></div>
                  <div className="w-1 h-3 bg-secondary/20"></div>
                  <div className="w-1 h-3 bg-secondary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-[#0e0e0e] border-t border-primary/10 z-50">
        <div className="flex justify-between items-center px-6 py-2 w-full font-mono text-[10px] tracking-tight">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 text-primary">
              <span className="w-1.5 h-1.5 bg-primary pulse-fast inline-block"></span>
              <span>MAINFRAME_ONLINE</span>
            </div>
            <div className="hidden md:flex gap-4 text-on-surface-variant">
              <span>SYS_LOAD: 0.22%</span>
              <span>LOCATION: [40.7128, -74.0060]</span>
            </div>
          </div>
          <div className="flex gap-6 text-on-surface-variant">
            <a className="hover:text-tertiary transition-colors" href="#">ENCRYPTION_DOCS</a>
            <a className="hover:text-tertiary transition-colors" href="#">VULNERABILITY_REPORT</a>
            <span className="text-primary/40">© 2024 NEURAL_ARCHITECT_MAINFRAME</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
