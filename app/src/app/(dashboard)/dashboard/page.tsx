import { Suspense } from 'react';
import DashboardPage from '../../../features/dashboard/components/DashboardPage/DashboardPage';

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <DashboardPage />
    </Suspense>
  );
}
