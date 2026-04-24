import { Suspense } from 'react';
import OverviewPage from '@/features/dashboard/components/OverviewPage/OverviewPage';

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <OverviewPage />
    </Suspense>
  );
}
