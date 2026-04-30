import { Suspense } from 'react';
import ServicesPage from '@/features/dashboard/components/ServicesPage/ServicesPage';

export const metadata = {
  title: 'Services | Apio',
  description: 'Manage services for your project',
};

export default function Page() {
  return (
    <Suspense>
      <ServicesPage />
    </Suspense>
  );
}
