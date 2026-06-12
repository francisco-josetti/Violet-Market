'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthPageShell from './AuthPageShell';
import SocialAuthButtons from './SocialAuthButtons';
import AuthDivider from './AuthDivider';
import EmailAuthToggleButton from './EmailAuthToggleButton';
import FormFieldError from './FormFieldError';
import { routes } from '../../lib/routes';
import { LOGIN_FORM_DRAFT_KEY } from '../../lib/formStorage';
import { usePersistedForm } from '../../hooks/usePersistedForm';
import { getZodFieldErrors, loginSchema } from '../../schemas/auth';
import { supabase, getSupabaseErrorMessage } from '../../lib/auth';

const loginInitialValues = {
  email: '',
  password: '',
  showEmailForm: false,
};

export default function LoginView() {
  const router = useRouter();
  const persistOptions = useMemo(() => ({ skipPersist: ['showEmailForm'] as const }), []);

  const { values, setField, hydrated, resetDraft } = usePersistedForm(
    LOGIN_FORM_DRAFT_KEY,
    loginInitialValues,
    persistOptions,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    setFieldErrors({});
    setApiError('');
    setSuccess('');
    setField('showEmailForm', false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(
        `Conexão com ${provider === 'google' ? 'Google' : 'Apple'} iniciada. Integração OAuth em breve.`,
      );
    }, 600);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setApiError('');
    setSuccess('');

    const result = loginSchema.safeParse({
      email: values.email,
      password: values.password,
    });

    if (!result.success) {
      setFieldErrors(getZodFieldErrors(result.error));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    setLoading(false);

    if (error) {
      setApiError(getSupabaseErrorMessage(error, 'Erro ao fazer login.'));
      return;
    }

    resetDraft();
    setSuccess('Login realizado com sucesso!');
    router.push(routes.home);
  };

  if (!hydrated) {
    return null;
  }

  const inputErrorClass = (field: string) =>
    fieldErrors[field]
      ? 'border-error/50 focus:border-error/50 focus:ring-error/20'
      : 'border-white/10 focus:border-primary/50 focus:ring-primary/25';

  return (
    <AuthPageShell>
      <div className="glass-panel luxury-shadow rounded-2xl p-8 md:p-10 flex flex-col gap-6 border border-primary/10">
        <div className="text-center flex flex-col gap-2">
          <Link
            href={routes.home}
            className="font-hanken text-2xl font-extrabold text-primary tracking-tight hover:text-white transition-colors"
          >
            Violet Market
          </Link>
          <h1 className="font-hanken text-xl font-bold text-on-surface">
            Bem-vindo de volta
          </h1>
          <p className="font-sans text-sm text-on-surface-variant">
            Acesse sua conta para continuar comprando
          </p>
        </div>

        {success && (
          <p
            className="text-sm text-tertiary bg-tertiary-container/15 border border-tertiary/20 rounded-lg px-4 py-3 font-sans"
            role="status"
          >
            {success}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <SocialAuthButtons mode="login" onProviderClick={handleSocialAuth} />
          <AuthDivider label="ou" />
          <EmailAuthToggleButton
            mode="login"
            isActive={values.showEmailForm}
            onClick={() => {
              setField('showEmailForm', !values.showEmailForm);
              setFieldErrors({});
              setApiError('');
              setSuccess('');
            }}
          />
        </div>

        {values.showEmailForm && (
          <form
            onSubmit={handleEmailLogin}
            className="flex flex-col gap-4 animate-fade-in"
            id="login-form"
            noValidate
          >
            {apiError && (
              <div className="text-sm text-error bg-error-container/10 border border-error/20 rounded-xl px-4 py-3" role="alert">
                {apiError}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="font-mono text-xs text-on-surface-variant uppercase tracking-wider"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => {
                    setField('email', e.target.value);
                    clearFieldError('email');
                  }}
                  placeholder="seu@email.com"
                  className={`w-full bg-surface-container-low border rounded-xl pl-11 pr-4 py-3.5 text-on-surface font-sans text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 transition-all ${inputErrorClass('email')}`}
                />
              </div>
              <FormFieldError message={fieldErrors.email} />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="font-mono text-xs text-on-surface-variant uppercase tracking-wider"
                >
                  Senha
                </label>
                <button
                  type="button"
                  className="font-sans text-xs text-primary hover:text-brand-violet transition-colors cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={values.password}
                  onChange={(e) => {
                    setField('password', e.target.value);
                    clearFieldError('password');
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-surface-container-low border rounded-xl pl-11 pr-12 py-3.5 text-on-surface font-sans text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 transition-all ${inputErrorClass('password')}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FormFieldError message={fieldErrors.password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-violet text-white py-4 rounded-xl font-mono text-sm font-medium tracking-wide hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
              id="login-submit-btn"
            >
              {loading ? 'Entrando...' : 'Entrar com e-mail'}
            </button>
          </form>
        )}

        <p className="text-center font-sans text-sm text-on-surface-variant">
          Ainda não tem conta?{' '}
          <Link
            href={routes.register}
            className="text-primary font-semibold hover:text-brand-violet transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
