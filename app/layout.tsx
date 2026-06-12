import type { Metadata } from 'next';
import AppShell from '@/src/components/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Violet Market',
  description: 'Equipamentos premium e artefatos digitais exclusivos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
