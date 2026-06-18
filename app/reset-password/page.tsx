import type { Metadata } from 'next';
import ResetPasswordView from '@/src/components/auth/ResetPasswordView';

export const metadata: Metadata = {
  title: 'Recuperar senha | Violet Market',
  description: 'Recupere sua senha do Violet Market',
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
