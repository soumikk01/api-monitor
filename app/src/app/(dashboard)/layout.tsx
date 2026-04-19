import React from 'react';
import TopNavbar from '@/components/TopNavbar/TopNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavbar />
      {/* Push page content below the fixed 46px navbar */}
      <div style={{ paddingTop: '46px', minHeight: '100vh', boxSizing: 'border-box' }}>
        {children}
      </div>
    </>
  );
}
