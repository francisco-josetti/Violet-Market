import { createClient } from './supabase/client';

export interface AuthSession {
  isLoggedIn: boolean;
  provider: string;
  email: string;
  loggedAt: string;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user) return null;

  return {
    isLoggedIn: true,
    provider: session.user.app_metadata?.provider ?? 'email',
    email: session.user.email ?? '',
    loggedAt: session.user.created_at ?? new Date().toISOString(),
  };
}

export function getSupabaseErrorMessage(
  error: { message?: string; code?: string } | null,
  fallback: string,
): string {
  if (!error?.message) return fallback;

  const msg = error.message.toLowerCase();

  if (msg.includes('already registered')) {
    return 'Este e-mail já está cadastrado.';
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de fazer login.';
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'Muitas tentativas. Aguarde um momento e tente novamente.';
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }

  return error.message;
}