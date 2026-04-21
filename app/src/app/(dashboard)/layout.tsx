import React, { Suspense } from 'react';
import TopNavbar from '@/components/TopNavbar/TopNavbar';
import ConnectPanel from '@/components/ConnectPanel/ConnectPanel';
import AuthGuard from '@/components/AuthGuard/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Suspense fallback={<div style={{ height: '46px' }} />}>
        <TopNavbar />
      </Suspense>
      {/* Push page content below the fixed 46px navbar */}
      <div style={{ paddingTop: '46px', minHeight: '100vh', boxSizing: 'border-box' }}>
        {children}
      </div>
      {/* Right-side Getting Started panel — shown when ?panel=getting-started */}
      <ConnectPanel />
    </AuthGuard>
  );
}
