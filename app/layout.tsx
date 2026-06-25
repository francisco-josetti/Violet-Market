import type { Metadata } from 'next';
import AppShell from '@/src/components/AppShell';
import { createClient } from '../src/lib/supabase/server';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import type { AuthUser } from '../src/contexts/AuthContext';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Violet Market',
  description: 'Equipamentos premium e artefatos digitais exclusivos',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialUser: AuthUser | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', user.id)
      .single();

    initialUser = {
      id: user.id,
      email: user.email ?? '',
      name: profile?.name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      provider: user.app_metadata?.provider ?? 'email',
      loggedAt: user.created_at ?? new Date().toISOString(),
    };
  }

  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider initialUser={initialUser}>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}