import AccountLayout from '@/features/dashboard/components/AccountLayout/AccountLayout';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccountLayout>{children}</AccountLayout>;
}
