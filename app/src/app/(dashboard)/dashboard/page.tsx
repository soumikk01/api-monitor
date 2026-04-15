// Redirect /dashboard to /overview
import { redirect } from 'next/navigation';
export default function DashboardRedirectPage() {
  redirect('/overview');
}
