import type { Metadata } from 'next';
import LoginView from '@/src/components/auth/LoginView';

export const metadata: Metadata = {
  title: 'Login | Violet Market',
  description: 'Acesse sua conta Violet Market',
};

export default function LoginPage() {
  return <LoginView />;
}
