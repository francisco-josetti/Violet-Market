import type { Metadata } from 'next';
import RegisterView from '@/src/components/auth/RegisterView';

export const metadata: Metadata = {
  title: 'Cadastro | Violet Market',
  description: 'Crie sua conta Violet Market',
};

export default function RegisterPage() {
  return <RegisterView />;
}
