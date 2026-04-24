import { redirect } from 'next/navigation';

// Auth app root — redirect to /login
export default function AuthRoot() {
  redirect('/login');
}
