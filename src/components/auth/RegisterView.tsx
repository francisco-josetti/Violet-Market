'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import AuthPageShell from './AuthPageShell';
import SocialAuthButtons from './SocialAuthButtons';
import AuthDivider from './AuthDivider';
import EmailAuthToggleButton from './EmailAuthToggleButton';
import FormFieldError from './FormFieldError';
import { routes } from '../../lib/routes';
import { REGISTER_FORM_DRAFT_KEY } from '../../lib/formStorage';
import { usePersistedForm } from '../../hooks/usePersistedForm';
import { getZodFieldErrors, registerSchema } from '../../schemas/auth';
import { createClient } from '../../lib/supabase/client';
import { getSupabaseErrorMessage } from '../../lib/auth';

const registerInitialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
  showEmailForm: false,
};

export default function RegisterView() {
  const router = useRouter();
  const persistOptions = useMemo(() => ({ skipPersist: ['showEmailForm'] as const }), []);

  const { values, setField, hydrated, resetDraft } = usePersistedForm(
    REGISTER_FORM_DRAFT_KEY,
    registerInitialValues,
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

  const handleSocialAuth = async (provider: 'google') => {
    setFieldErrors({});
    setApiError('');
    setSuccess('');
    setField('showEmailForm', false);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setLoading(false);
      setApiError(getSupabaseErrorMessage(error, `Erro ao conectar com Google.`));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setApiError('');
    setSuccess('');
  
    const result = registerSchema.safeParse({
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      acceptedTerms: values.acceptedTerms,
    });
  
    if (!result.success) {
      setFieldErrors(getZodFieldErrors(result.error));
      return;
    }
  
    setLoading(true);
  
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: { name: result.data.name },
      },
    });
  
    setLoading(false);
  
    if (signUpError) {
      setApiError(getSupabaseErrorMessage(signUpError, 'Erro ao criar conta.'));
      return;
    }
  
    resetDraft();
    setSuccess('Conta criada com sucesso!');
    router.push(routes.login);
  };

  if (!hydrated) {
    return null;
  }

  const inputErrorClass = (field: string) =>
    fieldErrors[field]
      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
      : 'border-border focus:border-primary focus:ring-primary/25';

  return (
    <AuthPageShell>
      <div className="bg-card border border-border rounded-2xl p-8 md:p-10 flex flex-col gap-6 shadow-lg">
        <div className="text-center flex flex-col gap-2">
          <Link
            href={routes.home}
            className="font-hanken text-2xl font-extrabold text-primary tracking-tight hover:text-foreground transition-colors"
          >
            Violet Market
          </Link>
          <h1 className="font-hanken text-xl font-bold text-foreground">
            Crie sua conta
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            Junte-se ao marketplace de performance de elite
          </p>
        </div>

        {success && (
          <p
            className="text-sm text-tertiary bg-tertiary/10 border border-tertiary/20 rounded-lg px-4 py-3 font-sans"
            role="status"
          >
            {success}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <SocialAuthButtons mode="register" onProviderClick={handleSocialAuth} />
          <AuthDivider label="ou" />
          <EmailAuthToggleButton
            mode="register"
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
            onSubmit={handleRegister}
            className="flex flex-col gap-4 animate-fade-in"
            id="register-form"
            noValidate
          >
            {apiError && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3" role="alert">
                {apiError}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-name"
                className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
              >
                Nome completo
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => {
                    setField('name', e.target.value);
                    clearFieldError('name');
                  }}
                  placeholder="Seu nome"
                  className={`w-full bg-background border rounded-xl pl-11 pr-4 py-3.5 text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all ${inputErrorClass('name')}`}
                />
              </div>
              <FormFieldError message={fieldErrors.name} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-email"
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
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => {
                    setField('email', e.target.value);
                    clearFieldError('email');
                  }}
                  placeholder="seu@email.com"
                  className={`w-full bg-background border rounded-xl pl-11 pr-4 py-3.5 text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all ${inputErrorClass('email')}`}
                />
              </div>
              <FormFieldError message={fieldErrors.email} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-password"
                className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.password}
                  onChange={(e) => {
                    setField('password', e.target.value);
                    clearFieldError('password');
                  }}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full bg-background border rounded-xl pl-11 pr-12 py-3.5 text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all ${inputErrorClass('password')}`}
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
              <FormFieldError message={fieldErrors.password} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-confirm-password"
                className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
              >
                Confirmar senha
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={(e) => {
                    setField('confirmPassword', e.target.value);
                    clearFieldError('confirmPassword');
                  }}
                  placeholder="Repita a senha"
                  className={`w-full bg-background border rounded-xl pl-11 pr-4 py-3.5 text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all ${inputErrorClass('confirmPassword')}`}
                />
              </div>
              <FormFieldError message={fieldErrors.confirmPassword} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={values.acceptedTerms}
                  onChange={(e) => {
                    setField('acceptedTerms', e.target.checked);
                    clearFieldError('acceptedTerms');
                  }}
                  className="mt-1 w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/30 cursor-pointer accent-primary"
                />
                <span className="font-sans text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                  Li e aceito os{' '}
                  <a href="#" className="text-primary hover:underline">
                    Termos de Uso
                  </a>{' '}
                  e a{' '}
                  <a href="#" className="text-primary hover:underline">
                    Política de Privacidade
                  </a>
                </span>
              </label>
              <FormFieldError message={fieldErrors.acceptedTerms} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-mono text-sm font-medium tracking-wide hover:bg-primary/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
              id="register-submit-btn"
            >
              {loading ? 'Criando conta...' : 'Criar conta com e-mail'}
            </button>
          </form>
        )}

        <p className="text-center font-sans text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link
            href={routes.login}
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
