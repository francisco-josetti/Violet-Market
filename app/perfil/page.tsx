import type { Metadata } from 'next';
import ProfileView from '@/src/components/ProfileView';

export const metadata: Metadata = {
  title: 'Meu Perfil | Violet Market',
  description: 'Gerencie sua conta, pedidos e preferências no Violet Market',
};

export default function PerfilPage() {
  return <ProfileView />;
}
