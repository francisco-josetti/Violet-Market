'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';
import { getSupabaseErrorMessage } from '@/src/lib/auth';
import { routes } from '@/src/lib/routes';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsRecovery(true);
      }
    });
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Informe seu e-mail.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(getSupabaseErrorMessage(resetError, 'Erro ao enviar e-mail de recuperação.'));
      return;
    }

    setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(getSupabaseErrorMessage(updateError, 'Erro ao atualizar senha.'));
      return;
    }

    setSuccess('Senha atualizada com sucesso!');
    setTimeout(() => {
      router.push(routes.login);
    }, 2000);
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <div className="px-6 md:px-16 pt-8 pb-4 w-full max-w-7xl mx-auto">
        <Link
          href={routes.login}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao login
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center px-6 py-8 md:py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 flex flex-col gap-6 shadow-lg">
            <div className="text-center flex flex-col gap-2">
              <Link
                href={routes.home}
                className="font-hanken text-2xl font-extrabold text-primary tracking-tight hover:text-foreground transition-colors"
              >
                Violet Market
              </Link>
              <h1 className="font-hanken text-xl font-bold text-foreground">
                {isRecovery ? 'Criar nova senha' : 'Recuperar senha'}
              </h1>
              <p className="font-sans text-sm text-muted-foreground">
                {isRecovery
                  ? 'Digite sua nova senha abaixo.'
                  : 'Informe seu e-mail para receber o link de recuperação.'}
              </p>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3" role="alert">
                {error}
              </div>
            )}

            {success && (
              <p
                className="text-sm text-tertiary bg-tertiary/10 border border-tertiary/20 rounded-lg px-4 py-3 font-sans"
                role="status"
              >
                {success}
              </p>
            )}

            {isRecovery ? (
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reset-password"
                    className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    Nova senha
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-background border border-border rounded-xl pl-11 pr-12 py-3.5 text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary/25 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-mono text-sm font-medium tracking-wide hover:bg-primary/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
                >
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRequestReset} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reset-email"
                    className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary/25 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-violet text-white py-4 rounded-xl font-mono text-sm font-medium tracking-wide hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1 flex items-center justify-center gap-2"
                >
                  <KeyRound size={16} />
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>
            )}

            <p className="text-center font-sans text-sm text-muted-foreground">
              <Link
                href={routes.login}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Voltar ao login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
