'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Docs.module.scss';

export default function DocsPage() {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`${styles.page} ${dark ? styles.dark : ''}`}>
      
      {/* ── THEME TOGGLE ── */}
      <button className={styles.themeToggle} onClick={() => setDark(!dark)} aria-label="Toggle theme">
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>

      {/* ── NAVIGATION SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <polygon points="10,1 19,6 19,14 10,19 1,14 1,6" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="3" fill="currentColor"/>
            </svg>
          </div>
          <span className={styles.brandText}>Apio Docs</span>
        </Link>

        <nav className={styles.nav}>
          <div className={styles.navHead}>Overview</div>
          <div onClick={() => scrollTo('introduction')} className={`${styles.navItem} ${activeSection === 'introduction' ? styles.active : ''}`}>Introduction</div>
          <div onClick={() => scrollTo('architecture')} className={`${styles.navItem} ${activeSection === 'architecture' ? styles.active : ''}`}>Architecture</div>

          <div className={styles.navHead}>Integration</div>
          <div onClick={() => scrollTo('getting-started')} className={`${styles.navItem} ${activeSection === 'getting-started' ? styles.active : ''}`}>Quick Start</div>
          <div onClick={() => scrollTo('cli-reference')} className={`${styles.navItem} ${activeSection === 'cli-reference' ? styles.active : ''}`}>CLI Reference</div>
          
          <div className={styles.navHead}>Platform</div>
          <div onClick={() => scrollTo('security')} className={`${styles.navItem} ${activeSection === 'security' ? styles.active : ''}`}>Security Vault</div>
          <div onClick={() => scrollTo('webhooks')} className={`${styles.navItem} ${activeSection === 'webhooks' ? styles.active : ''}`}>WebSockets</div>
        </nav>
      </aside>

      {/* ── DOCUMENTATION CONTENT ── */}
      <main className={styles.content}>
        <div className={styles.docWrapper}>
          
          <div className={styles.hero}>
            <h1>Technical Documentation</h1>
            <p>Welcome to the Apio Developer Handbook. Everything you need to securely monitor, query, and integrate your microservices.</p>
          </div>

          <section id="introduction" className={styles.section}>
            <h2>Introduction</h2>
            <p>Apio is a highly-scalable, drop-in <strong>Observability SaaS</strong> built for modern monolithic and microservice infrastructures. Unlike traditional loggers that require thousands of lines of boilerplate setup, we engineered a global package that intercepts traffic without modifying your core business logic.</p>
            
            <div className={styles.infoBox}>
              <h4>
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
                Core Philosophy
              </h4>
              <p>We built this platform to guarantee that 99.99% of crashes are recorded, alerted, and categorized within 14 milliseconds of occurring in production.</p>
            </div>
          </section>

          <section id="architecture" className={styles.section}>
            <h2>System Architecture</h2>
            <p>The platform runs on a proprietary distributed 4-package monorepo design, utilizing the world&apos;s most robust open-source technologies:</p>
            
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Subsystem</th>
                    <th>Runtime</th>
                    <th>Responsibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>API-CLI Package</strong></td>
                    <td><code>Node.js (Bun)</code></td>
                    <td>Global request interceptor hooking directly into native <code>fetch</code> and <code>axios</code> instances.</td>
                  </tr>
                  <tr>
                    <td><strong>Ingest Engine</strong></td>
                    <td><code>NestJS / Prisma</code></td>
                    <td>Secures raw socket events and persists metrics globally to <code>MongoDB</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>Enterprise Admin</strong></td>
                    <td><code>Next.js 16</code></td>
                    <td>Internal workspace granting developers cross-tenant visibility.</td>
                  </tr>
                  <tr>
                    <td><strong>Observer App</strong></td>
                    <td><code>Next.js 16</code></td>
                    <td>Customer-facing portal streaming real-time glassmorphic datasets.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="getting-started" className={styles.section}>
            <h2>Quick Start Integration</h2>
            <p>Integrating Apio into an express server or an existing NestJS repo takes approximately 10 seconds. You do not need to rewrite your network handlers.</p>
            
            <h3>Step 1: Obtain a Global SDK Token</h3>
            <p>Navigate to the <strong>Settings</strong> page within the main application and locate your unique cryptographic SDK token.</p>

            <h3>Step 2: Initialize via NPM</h3>
            <p>Launch the CLI initialization script in the root directory of your target backend node package.</p>
            
            <div className={styles.terminal}>
              <div className={styles.termLine}>
                <span className={styles.prompt}>~/my-backend-app ❯</span>
                <span className={styles.cmd}>npx apio-cli init --token sdk_84f93a...</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.comment}># The CLI will now intercept external calls automatically.</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.prompt}>~/my-backend-app ❯</span>
                <span className={styles.cmd}>npm run start</span>
              </div>
            </div>
          </section>

          <section id="cli-reference" className={styles.section}>
            <h2>CLI Command Reference</h2>
            <p>The package execution supports several high-level parameters for enterprise compliance rules and data redaction:</p>

            <div className={styles.terminal}>
              <div className={styles.termLine}>
                <span className={styles.cmd}>apio-cli init --token &lt;YOUR_TOKEN&gt; --ignore-paths &quot;/health,/metrics&quot;</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.comment}># Prevent specific low-value routes from saturating the websocket</span>
              </div>
            </div>
          </section>

          <section id="security" className={styles.section}>
            <h2>Security Vault & Redaction</h2>
            <p>We absolutely respect PII (Personally Identifiable Information). By default, the Apio interceptor automatically drops payloads exceeding standard chunk limits and purges headers matching the following blacklists before transit:</p>
            <ul>
              <li style={{marginBottom: '0.5rem', color: 'var(--text-muted)'}}>Authentication Headers (Authorization Barer tokens, API Keys)</li>
              <li style={{marginBottom: '0.5rem', color: 'var(--text-muted)'}}>Common Financial Identifiers (SSN, PCI data)</li>
              <li style={{marginBottom: '0.5rem', color: 'var(--text-muted)'}}>Internal Node VM Memory Signatures</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
