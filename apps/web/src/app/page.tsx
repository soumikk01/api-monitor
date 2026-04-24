import dynamic from 'next/dynamic';

// Code-split the landing page into its own JS chunk.
// LandingPage is 'use client' internally — Next.js handles hydration automatically.
// We intentionally omit ssr:false so the server can pre-render the initial shell
// (better LCP/SEO), while the heavy client JS is deferred to a separate chunk.
const LandingPage = dynamic(
  () => import('@/features/landing/components/LandingPage'),
  { loading: () => <div style={{ minHeight: '100vh', background: '#F5F1E8' }} /> }
);

export default LandingPage;
