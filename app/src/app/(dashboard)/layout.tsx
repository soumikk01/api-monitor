import React, { Suspense } from 'react';
import TopNavbar from '@/components/TopNavbar/TopNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div style={{ height: '46px' }} />}>
        <TopNavbar />
      </Suspense>
      {/* Push page content below the fixed 46px navbar */}
      <div style={{ paddingTop: '46px', minHeight: '100vh', boxSizing: 'border-box' }}>
        {children}
      </div>
    </>
  );
}
