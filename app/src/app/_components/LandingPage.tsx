'use client';

import Link from 'next/link';
import styles from './LandingPage.module.scss';

/* â”€â”€ Spring Blossom Background â”€â”€ */
const SpringBackground = () => (
  <div className={styles.springBg} aria-hidden="true">
    {/* Branch top-left */}
    <svg className={styles.branch1} viewBox="0 0 220 180" fill="none">
      <path d="M10,170 Q50,110 90,85 Q120,65 160,52 Q180,45 210,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45"/>
      <path d="M90,85 Q100,62 118,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>
      <path d="M120,65 Q140,42 158,28" stroke="#7C6050" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
      {/* Blossom 1 */}
      <g transform="translate(120,46)">
        <circle cx="0" cy="-7" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/>
        <circle cx="4.1" cy="5.7" r="5.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-4.1" cy="5.7" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFD1DC" opacity="0.8"/>
        <circle cx="0" cy="0" r="4" fill="#FFFACD"/><circle cx="0" cy="0" r="1.8" fill="#F6C800"/>
      </g>
      {/* Blossom 2 */}
      <g transform="translate(93,82)">
        <circle cx="0" cy="-6" r="4.5" fill="#FFD1DC" opacity="0.9"/>
        <circle cx="5.7" cy="-1.9" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="3.5" cy="4.9" r="4.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="-3.5" cy="4.9" r="4.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-5.7" cy="-1.9" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="0" cy="0" r="3.2" fill="#FFFACD"/><circle cx="0" cy="0" r="1.3" fill="#F6C800"/>
      </g>
      {/* Blossom 3 small */}
      <g transform="translate(161,50)">
        <circle cx="0" cy="-5" r="3.5" fill="#FFB7C5" opacity="0.8"/>
        <circle cx="4.7" cy="-1.6" r="3.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="2.9" cy="4.1" r="3.5" fill="#FFB7C5" opacity="0.8"/>
        <circle cx="-2.9" cy="4.1" r="3.5" fill="#FF8FAB" opacity="0.7"/>
        <circle cx="-4.7" cy="-1.6" r="3.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="0" cy="0" r="2.5" fill="#FFFACD"/><circle cx="0" cy="0" r="1" fill="#F6C800"/>
      </g>
      {/* Loose petals */}
      <ellipse cx="140" cy="72" rx="5" ry="3" fill="#FFB7C5" opacity="0.55" transform="rotate(-30 140 72)"/>
      <ellipse cx="178" cy="40" rx="4" ry="2.5" fill="#FFD1DC" opacity="0.5" transform="rotate(22 178 40)"/>
    </svg>

    {/* Branch top-right (mirrored) */}
    <svg className={styles.branch2} viewBox="0 0 220 180" fill="none">
      <path d="M210,170 Q170,110 130,85 Q100,65 62,52 Q42,45 12,18" stroke="#7C6050" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M130,85 Q120,62 103,48" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      <g transform="translate(100,45)">
        <circle cx="0" cy="-7" r="5.5" fill="#FFD1DC" opacity="0.9"/>
        <circle cx="6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="4.1" cy="5.7" r="5.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="-4.1" cy="5.7" r="5.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-6.6" cy="-2.2" r="5.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="0" cy="0" r="4" fill="#FFFACD"/><circle cx="0" cy="0" r="1.8" fill="#F6C800"/>
      </g>
      <g transform="translate(128,82)">
        <circle cx="0" cy="-6" r="4.5" fill="#FFB7C5" opacity="0.85"/>
        <circle cx="5.7" cy="-1.9" r="4.5" fill="#FFD1DC" opacity="0.9"/>
        <circle cx="3.5" cy="4.9" r="4.5" fill="#FFB7C5" opacity="0.8"/>
        <circle cx="-3.5" cy="4.9" r="4.5" fill="#FF8FAB" opacity="0.75"/>
        <circle cx="-5.7" cy="-1.9" r="4.5" fill="#FFD1DC" opacity="0.85"/>
        <circle cx="0" cy="0" r="3.2" fill="#FFFACD"/><circle cx="0" cy="0" r="1.3" fill="#F6C800"/>
      </g>
      <ellipse cx="65" cy="70" rx="4.5" ry="2.8" fill="#FFB7C5" opacity="0.5" transform="rotate(40 65 70)"/>
    </svg>

    {/* Floating petals */}
    <svg className={`${styles.petal} ${styles.petal1}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5.5" ry="10" fill="#FFB7C5" opacity="0.7" transform="rotate(-20 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal2}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9.5" fill="#FFD1DC" opacity="0.65" transform="rotate(15 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal3}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="4.5" ry="9" fill="#FF8FAB" opacity="0.55" transform="rotate(-35 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal4}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9" fill="#FFB7C5" opacity="0.6" transform="rotate(25 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal5}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5.5" ry="9.5" fill="#FFD1DC" opacity="0.7" transform="rotate(-10 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal6}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="4" ry="8" fill="#FFB7C5" opacity="0.5" transform="rotate(30 7 11)"/></svg>
    <svg className={`${styles.petal} ${styles.petal7}`} viewBox="0 0 14 22" fill="none"><ellipse cx="7" cy="11" rx="5" ry="9" fill="#FFD1DC" opacity="0.6" transform="rotate(-25 7 11)"/></svg>

    {/* Sparkle stars */}
    <svg className={`${styles.sparkle} ${styles.sp1}`} viewBox="0 0 20 20" fill="none"><path d="M10,1 L11.2,8.8 L19,10 L11.2,11.2 L10,19 L8.8,11.2 L1,10 L8.8,8.8 Z" fill="#1A1A1A" opacity="0.65"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp2}`} viewBox="0 0 14 14" fill="none"><path d="M7,1 L7.8,6.2 L13,7 L7.8,7.8 L7,13 L6.2,7.8 L1,7 L6.2,6.2 Z" fill="#1A1A1A" opacity="0.5"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp3}`} viewBox="0 0 18 18" fill="none"><path d="M9,1.5 L10,7.8 L16.5,9 L10,10.2 L9,16.5 L8,10.2 L1.5,9 L8,7.8 Z" fill="#7C6050" opacity="0.4"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp4}`} viewBox="0 0 10 10" fill="none"><path d="M5,0.5 L5.6,4.4 L9.5,5 L5.6,5.6 L5,9.5 L4.4,5.6 L0.5,5 L4.4,4.4 Z" fill="#1A1A1A" opacity="0.45"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp5}`} viewBox="0 0 16 16" fill="none"><path d="M8,1 L9,6.8 L15,8 L9,9.2 L8,15 L7,9.2 L1,8 L7,6.8 Z" fill="#1A1A1A" opacity="0.55"/></svg>
    <svg className={`${styles.sparkle} ${styles.sp6}`} viewBox="0 0 12 12" fill="none"><path d="M6,0.5 L6.8,5.2 L11.5,6 L6.8,6.8 L6,11.5 L5.2,6.8 L0.5,6 L5.2,5.2 Z" fill="#7C6050" opacity="0.4"/></svg>

    {/* Standalone blooms */}
    <svg className={styles.bloom1} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="8" r="7.5" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="33.6" cy="15.5" r="7.5" fill="#FFD1DC" opacity="0.75"/>
      <circle cx="30.2" cy="28.6" r="7.5" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="13.8" cy="28.6" r="7.5" fill="#FF8FAB" opacity="0.7"/>
      <circle cx="10.4" cy="15.5" r="7.5" fill="#FFD1DC" opacity="0.75"/>
      <circle cx="22" cy="22" r="7" fill="#FFFACD"/><circle cx="22" cy="22" r="3" fill="#F6C800"/>
    </svg>
    <svg className={styles.bloom2} viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="6" r="5.8" fill="#FFD1DC" opacity="0.85"/>
      <circle cx="26" cy="12" r="5.8" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="23.2" cy="23" r="5.8" fill="#FF8FAB" opacity="0.75"/>
      <circle cx="10.8" cy="23" r="5.8" fill="#FFD1DC" opacity="0.85"/>
      <circle cx="8" cy="12" r="5.8" fill="#FFB7C5" opacity="0.8"/>
      <circle cx="17" cy="17" r="5.5" fill="#FFFACD"/><circle cx="17" cy="17" r="2.2" fill="#F6C800"/>
    </svg>
    <svg className={styles.bloom3} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="5" r="4.5" fill="#FFB7C5" opacity="0.75"/>
      <circle cx="21.4" cy="10.2" r="4.5" fill="#FFD1DC" opacity="0.8"/>
      <circle cx="18.7" cy="19.8" r="4.5" fill="#FFB7C5" opacity="0.75"/>
      <circle cx="9.3" cy="19.8" r="4.5" fill="#FF8FAB" opacity="0.7"/>
      <circle cx="6.6" cy="10.2" r="4.5" fill="#FFD1DC" opacity="0.8"/>
      <circle cx="14" cy="14" r="4.5" fill="#FFFACD"/><circle cx="14" cy="14" r="1.8" fill="#F6C800"/>
    </svg>

    {/* Curly vines */}
    <svg className={styles.curly1} viewBox="0 0 70 35" fill="none">
      <path d="M5,28 C12,6 22,6 28,18 C34,30 44,30 50,18 C56,6 62,8 66,14" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.18"/>
    </svg>
    <svg className={styles.curly2} viewBox="0 0 55 28" fill="none">
      <path d="M3,22 C9,5 17,5 22,13 C27,22 35,22 40,13 C45,4 51,7 53,13" stroke="#7C6050" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.15"/>
    </svg>

    {/* Dot clusters */}
    <svg className={styles.dots1} viewBox="0 0 60 20" fill="none">
      <circle cx="5" cy="10" r="2.5" fill="#1A1A1A" opacity="0.22"/>
      <circle cx="18" cy="10" r="1.8" fill="#1A1A1A" opacity="0.18"/>
      <circle cx="31" cy="10" r="2.5" fill="#1A1A1A" opacity="0.22"/>
      <circle cx="44" cy="10" r="1.8" fill="#7C6050" opacity="0.18"/>
    </svg>
    <svg className={styles.dots2} viewBox="0 0 40 14" fill="none">
      <circle cx="4" cy="7" r="2" fill="#7C6050" opacity="0.2"/>
      <circle cx="15" cy="7" r="1.5" fill="#1A1A1A" opacity="0.16"/>
      <circle cx="26" cy="7" r="2" fill="#1A1A1A" opacity="0.2"/>
      <circle cx="37" cy="7" r="1.5" fill="#7C6050" opacity="0.16"/>
    </svg>
  </div>
);

/* â”€â”€ Soft pastel illustrations (style) + API monitoring content â”€â”€ */
const IlluApiGlobe = () => (
  <svg viewBox="0 0 100 100" fill="none" className={styles.cardSvg}>
    {/* Cloud back */}
    <path d="M20,70 Q20,55 35,55 Q40,40 55,40 Q70,40 75,55 Q90,55 90,70 Z" fill="#ffffff" opacity="0.5"/>
    {/* Globe */}
    <circle cx="55" cy="52" r="22" fill="#E8F4FF" stroke="#1A1A1A" strokeWidth="2.5"/>
    <ellipse cx="55" cy="52" rx="22" ry="10" stroke="#1A1A1A" strokeWidth="1.5" opacity="0.3"/>
    <line x1="55" y1="30" x2="55" y2="74" stroke="#1A1A1A" strokeWidth="1.5" opacity="0.3"/>
    {/* Orbit dot */}
    <circle cx="77" cy="52" r="4" fill="#A8D8FF" stroke="#1A1A1A" strokeWidth="1.5"/>
    {/* Sleeping eyes (uptime = all quiet) */}
    <path d="M47,52 Q51,56 55,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M59,52 Q63,56 67,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Cheeks */}
    <circle cx="45" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    <circle cx="69" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    {/* Nightcap */}
    <path d="M40,42 Q47,24 63,28 Q60,37 66,42 Z" fill="#6B6B6B" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="63" cy="28" r="3.5" fill="#F6D55C" stroke="#1A1A1A" strokeWidth="1.5"/>
    {/* 99.99 label */}
    <text x="55" y="82" textAnchor="middle" fill="#1A1A1A" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" opacity="0.7">99.99% uptime</text>
  </svg>
);

const IlluApiPulse = () => (
  <svg viewBox="0 0 100 100" fill="none" className={styles.cardSvg}>
    {/* Cloud body */}
    <path d="M25,62 Q20,48 35,43 Q40,28 55,33 Q70,28 76,43 Q91,48 86,62 Z" fill="#ffffff" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round"/>
    {/* Headphones arch */}
    <path d="M31,52 Q55,22 79,52" fill="none" stroke="#6B6B6B" strokeWidth="3"/>
    {/* Earpieces */}
    <rect x="24" y="46" width="10" height="14" rx="5" fill="#B8F2D6" stroke="#1A1A1A" strokeWidth="2"/>
    <rect x="79" y="46" width="10" height="14" rx="5" fill="#B8F2D6" stroke="#1A1A1A" strokeWidth="2"/>
    {/* Happy eyes */}
    <path d="M43,52 Q47,49 51,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M60,52 Q64,49 68,52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Cheeks */}
    <circle cx="40" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    <circle cx="71" cy="56" r="3" fill="#FFB38A" opacity="0.6"/>
    {/* Music notes = real-time signal */}
    <path d="M17,38 L22,33 L22,43 Z" fill="#1A1A1A"/>
    <path d="M22,33 L27,36" stroke="#1A1A1A" strokeWidth="1.5"/>
    <path d="M84,28 L89,23 L89,36 Z" fill="#1A1A1A"/>
    <path d="M89,23 L95,26 L95,33" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
    {/* Label */}
    <text x="55" y="85" textAnchor="middle" fill="#1A1A1A" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" opacity="0.7">Real-time alerts</text>
  </svg>
);

const IlluApiShield = () => (
  <svg viewBox="0 0 100 100" fill="none" className={styles.cardSvg}>
    {/* Happy teapot body */}
    <path d="M35,50 Q50,38 65,50 L70,68 Q50,82 30,68 Z" fill="#F6D55C" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round"/>
    {/* Spout */}
    <path d="M30,56 Q20,46 34,46" fill="none" stroke="#F6D55C" strokeWidth="6" strokeLinecap="round"/>
    <path d="M30,56 Q20,46 34,46" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Handle */}
    <path d="M70,52 Q80,57 70,70" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Lid */}
    <path d="M40,45 C40,36 62,36 62,45 Z" fill="#F6D55C" stroke="#1A1A1A" strokeWidth="2"/>
    <circle cx="51" cy="37" r="3" fill="#1A1A1A"/>
    {/* Shield on body */}
    <path d="M50,55 L58,59 L58,65 L50,69 L42,65 L42,59 Z" fill="#FFB38A" stroke="#1A1A1A" strokeWidth="1.5"/>
    <path d="M47,62 L49.5,64.5 L54,59" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Steam = alerts */}
    <path d="M43,32 Q46,22 40,26" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    <path d="M51,28 Q54,18 48,22" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    {/* Label */}
    <text x="50" y="92" textAnchor="middle" fill="#1A1A1A" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" opacity="0.7">Zero breaches</text>
  </svg>
);

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.noiseOverlay} />
      <SpringBackground />

      {/* â”€â”€ CENTERED PILL NAVBAR â”€â”€ */}
      <header className={styles.navWrap}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="#1A1A1A"/>
            </svg>
            <span className={styles.logoMark}>N_ARCH</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#" className={styles.navLink}>Products</a>
            <a href="#features" className={styles.navLink}>Solutions</a>
            <a href="#stats" className={styles.navLink}>Pricing</a>
            <a href="#" className={styles.navLink}>Company</a>
            <a href="#" className={styles.navLink}>Support</a>
          </div>
          <Link href="/login" className={styles.navPill}>Try for free</Link>
        </nav>
      </header>

      {/* â”€â”€ HERO â”€â”€ */}
      <main className={styles.hero}>

        {/* Status badge */}
        <div className={styles.socialProof}>
          <div className={styles.avatarRow}>
            {['#A8D8FF', '#B8F2D6', '#FFB38A', '#F6D55C'].map((color, i) => (
              <div key={i} className={styles.avatar} style={{ backgroundColor: color, zIndex: 4 - i }}>
                <svg viewBox="0 0 20 20" fill="none" width="11" height="11" opacity="0.65">
                  <circle cx="10" cy="7" r="4" fill="#1A1A1A"/>
                  <path d="M4,18 Q10,12 16,18" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
            ))}
          </div>
          <span className={styles.socialText}>Over <strong>1k</strong> engineers online</span>
        </div>

        {/* Headline â€” original API monitoring copy */}
        <h1 className={styles.headline}>
          Monitor Your APIs<br />
          <span className={styles.hlAccent}>in Real-Time</span>
        </h1>

        {/* Sub â€” original copy */}
        <p className={styles.sub}>
          Instantly track uptime, errors, and performance with a single command.<br />
          The command center for high-performance engineering teams.
        </p>

        {/* CTAs */}
        <div className={styles.ctaRow}>
          <Link href="/login" className={styles.ctaPrimary}>
            <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
              <polygon points="5,3 13,8 5,13"/>
            </svg>
            Get Started
          </Link>
          <button className={styles.ctaSecondary}>View Demo</button>
        </div>

        {/* â”€â”€ 3 ILLUSTRATION CARDS â€” original feature content â”€â”€ */}
        <div className={styles.cardRow} id="features">

          {/* Card 1: Auto API Detection (blue) */}
          <div className={`${styles.card} ${styles.cardBlue}`}>
            <div className={styles.cardVisual}>
              <IlluApiGlobe />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardTag}>Auto Detection</span>
              <h3 className={styles.cardTitle}>Always Online</h3>
              <p className={styles.cardDesc}>Our engine crawls your infrastructure to identify and map all active API routes automatically.</p>
            </div>
          </div>

          {/* Card 2: Real-Time Monitoring (green) â€” raised center */}
          <div className={`${styles.card} ${styles.cardGreen} ${styles.cardCenter}`}>
            <div className={styles.cardVisual}>
              <IlluApiPulse />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardTag}>Live Monitoring</span>
              <h3 className={styles.cardTitle}>Real-Time Pulse</h3>
              <p className={styles.cardDesc}>Sub-second precision on uptime and status changes. Get notified before your users notice.</p>
            </div>
          </div>

          {/* Card 3: Security (orange) */}
          <div className={`${styles.card} ${styles.cardOrange}`}>
            <div className={styles.cardVisual}>
              <IlluApiShield />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardTag}>Secure Vault</span>
              <h3 className={styles.cardTitle}>Zero Breach</h3>
              <p className={styles.cardDesc}>P99 latency distribution across global regions. Identify bottlenecks and threats instantly.</p>
            </div>
          </div>

        </div>
      </main>

      {/* â”€â”€ STATS ROW â”€â”€ */}
      <section id="stats" className={styles.statsBar}>
        {[
          { v: '99.99%', l: 'Platform Uptime' },
          { v: '1.2B+',  l: 'Requests Scanned' },
          { v: '< 5ms',  l: 'Latency Overhead' },
          { v: '25+',    l: 'Global Nodes' },
        ].map((s) => (
          <div key={s.l} className={styles.statItem}>
            <span className={styles.statVal}>{s.v}</span>
            <span className={styles.statLbl}>{s.l}</span>
          </div>
        ))}
      </section>

      {/* â”€â”€ FOOTER â”€â”€ */}
      <footer className={styles.footer}>
        <span className={styles.footerCopy}>Â© 2025 NEURAL_ARCHITECT // CORE_KERNEL_STABLE</span>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Legal</a>
          <a href="#" className={styles.footerLink}>Docs</a>
          <Link href="/login" className={styles.footerCta}>Initialize Session â†’</Link>
        </div>
      </footer>
    </div>
  );
}

