'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{
      background: '#0e0e0e',
      color: '#ffffff',
      fontFamily: '"Inter", sans-serif',
      minHeight: '100vh',
      overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* Grid Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(to right, rgba(156,255,147,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(156,255,147,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 41, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,255,0,0.06))',
        backgroundSize: '100% 4px, 3px 100%',
        backgroundColor: 'transparent',
      }} />

      {/* ── TOP NAV ── */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        borderBottom: '1px solid rgba(192,178,248,0.1)',
        background: '#0e0e0e',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontSize: 20, fontWeight: 700, letterSpacing: '0.2em',
              color: '#c0b2f8', textShadow: '0 0 10px rgba(192,178,248,0.4)',
              fontFamily: '"Space Grotesk", sans-serif', textTransform: 'uppercase',
            }}>NEURAL_ARCHITECT</span>
            <span style={{
              display: 'none',
              color: '#c0b2f8', fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              opacity: 0.4, borderLeft: '1px solid rgba(192,178,248,0.2)', paddingLeft: 16,
            }}>LOGIN_SEC_V4.2</span>
            <span style={{
              color: '#c0b2f8', fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              opacity: 0.4, borderLeft: '1px solid rgba(192,178,248,0.2)', paddingLeft: 16,
            }}>LOGIN_SEC_V4.2</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span className="material-symbols-outlined" style={{ color: '#adaaaa', cursor: 'pointer', fontSize: 20 }}>terminal</span>
            <span className="material-symbols-outlined" style={{ color: '#adaaaa', cursor: 'pointer', fontSize: 20 }}>settings</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CANVAS ── */}
      <main style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

        {/* Login Module */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 448 }}>

          {/* Decorative hex clip top-right */}
          <div style={{
            position: 'absolute', top: -16, right: -16, width: 96, height: 96,
            background: 'rgba(192,178,248,0.1)', zIndex: 0, pointerEvents: 'none',
            clipPath: 'polygon(100% 0, 100% 70%, 30% 100%, 0 100%, 0 0)',
          }} />

          {/* Glass Container */}
          <div style={{
            position: 'relative',
            background: 'rgba(19,19,19,0.8)',
            backdropFilter: 'blur(20px)',
            padding: 32,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 0 40px rgba(0,0,0,0.8)',
            overflow: 'hidden',
          }}>

            {/* Scanline overlay inside card */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              backgroundImage: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,255,0,0.06))',
              backgroundSize: '100% 4px, 3px 100%',
              backgroundColor: 'transparent',
            }} />

            <div style={{ position: 'relative', zIndex: 10 }}>

              {/* Title */}
              <div style={{ marginBottom: 40, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <h1 style={{
                    fontSize: 36, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                    lineHeight: 1, margin: 0,
                    fontFamily: '"Space Grotesk", sans-serif',
                    textShadow: '-2px 0 #00eefc, 2px 0 #ff51fa',
                  }}>SYSTEM LOGIN</h1>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                    color: '#cd7aff',
                  }}>LVL_01_AUTH</span>
                </div>
                <p style={{
                  color: '#ababab', fontSize: 12,
                  fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.02em',
                }}>IDENTITY_VERIFICATION_REQUIRED_FOR_PROTOCOL_X</p>
              </div>

              {/* Form */}
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                {/* Username */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#ababab',
                    letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block',
                  }}>USERNAME</label>
                  <div className="bracket-input" style={{ padding: 4 }}>
                    <input
                      type="text"
                      placeholder="INPUT_ID"
                      style={{
                        width: '100%', background: 'transparent', border: 'none', outline: 'none',
                        color: '#c0b2f8', fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 14, padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.1em',
                      }}
                    />
                  </div>
                </div>

                {/* Encryption Key */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#ababab',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>ENCRYPTION_KEY</label>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(0,207,252,0.4)' }}>lock</span>
                  </div>
                  <div className="bracket-input" style={{ padding: 4 }}>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      style={{
                        width: '100%', background: 'transparent', border: 'none', outline: 'none',
                        color: '#c0b2f8', fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 14, padding: '8px 12px', letterSpacing: '0.1em',
                      }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div style={{ paddingTop: 16 }}>
                  <Link
                    href="/dashboard"
                    style={{
                      display: 'block', width: '100%', textAlign: 'center',
                      background: '#a597db',
                      color: '#251754',
                      padding: '16px 0',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em',
                      fontSize: 13, fontFamily: '"Space Grotesk", sans-serif',
                      textDecoration: 'none', position: 'relative', overflow: 'hidden',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#b2a5ea';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(165,151,219,0.5)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = '#a597db';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    INITIALIZE_SESSION
                  </Link>
                </div>
              </form>

              {/* Utility Links */}
              <div style={{
                marginTop: 32, display: 'flex', justifyContent: 'space-between',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em',
              }}>
                <a href="#" style={{ color: '#ababab', textDecoration: 'underline', textDecorationColor: 'rgba(0,207,252,0.3)', textUnderlineOffset: 4 }}>
                  RECOVER_ACCESS
                </a>
                <a href="#" style={{ color: '#ababab' }}>REQUEST_DECODING</a>
              </div>
            </div>

            {/* Status Bar */}
            <div style={{
              marginTop: 32, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: 16, fontSize: 9, fontFamily: '"JetBrains Mono", monospace',
              color: '#757575', opacity: 0.5,
            }}>
              <span>IP: 192.168.0.X</span>
              <span>OS: OBSIDIAN_v0.1</span>
              <span style={{ marginLeft: 'auto' }}>ENCRYPT: AES-256</span>
            </div>

            {/* Floating Metadata Panel – left side */}
            <div style={{
              position: 'absolute', left: -128, top: '25%',
              width: 96, display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ borderLeft: '1px solid rgba(192,178,248,0.4)', paddingLeft: 8 }}>
                <p style={{ fontSize: 8, fontFamily: '"JetBrains Mono", monospace', color: '#c0b2f8', marginBottom: 4 }}>LATENCY</p>
                <div style={{ height: 4, width: '100%', background: 'rgba(192,178,248,0.2)' }}>
                  <div style={{ height: '100%', width: '66%', background: '#c0b2f8' }} />
                </div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(0,207,252,0.4)', paddingLeft: 8 }}>
                <p style={{ fontSize: 8, fontFamily: '"JetBrains Mono", monospace', color: '#00cffc', marginBottom: 4 }}>PACKETS</p>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,1,0,1].map((on, i) => (
                    <div key={i} style={{ width: 4, height: 12, background: on ? '#00cffc' : 'rgba(0,207,252,0.2)' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Globe decoration – top right */}
      <div style={{
        position: 'fixed', top: 80, right: 32, pointerEvents: 'none', opacity: 0.2, zIndex: 5,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="System Map"
          style={{ width: 128, height: 128, filter: 'grayscale(1)' }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFTD6SlvVVZGdq7IvV4nWwm1GSHKDWxltTmWYnSwmuzKStgSKKAmgHsqqrcSunye6Dl-1i9C93FNz_ugxqhzBr5G4Z1rRp4mjKBxziNfdnylsvhUgLkfxM-5zr2P_aCXw8xxlKfDJHt9J5c-PLnRK0Bku2VGu2o49hpVSRGR_poMh5GlqwxXNNzlYfLVUg2U0gXpeHfX-h2vvD5TCXzIqWgqPaIaYdbAE0TFw_tGKa4YOerQv0UVKdGtVAXmWpQ3Ly7eLMmWlmtr1X"
        />
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        position: 'fixed', bottom: 0, width: '100%', zIndex: 50,
        background: '#0e0e0e', borderTop: '1px solid rgba(192,178,248,0.1)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 24px',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '-0.02em',
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9cff93' }}>
              <span style={{
                width: 6, height: 6, background: '#9cff93', borderRadius: '50%',
                display: 'inline-block', animation: 'pulse-fast 1s infinite',
              }} />
              <span>MAINFRAME_ONLINE</span>
            </div>
            <div style={{ display: 'flex', gap: 16, color: '#adaaaa' }}>
              <span>SYS_LOAD: 0.22%</span>
              <span>LOCATION: [40.7128, -74.0060]</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, color: '#adaaaa' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>ENCRYPTION_DOCS</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>VULNERABILITY_REPORT</a>
            <span style={{ color: 'rgba(156,255,147,0.4)' }}>© 2024 NEURAL_ARCHITECT_MAINFRAME</span>
          </div>
        </div>
      </footer>

      <style>{`
        .bracket-input {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: none;
        }
        .bracket-input::before, .bracket-input::after {
          content: '';
          position: absolute;
          bottom: 0;
          width: 10px;
          height: 10px;
          border-bottom: 2px solid #777575;
        }
        .bracket-input::before {
          left: 0;
          border-left: 2px solid #777575;
        }
        .bracket-input::after {
          right: 0;
          border-right: 2px solid #777575;
        }
        .bracket-input:focus-within::before,
        .bracket-input:focus-within::after {
          border-color: #9cff93;
          box-shadow: 0 0 10px rgba(156,255,147,0.27);
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        input::placeholder { color: rgba(117,117,117,0.5); }
      `}</style>
    </div>
  );
}
