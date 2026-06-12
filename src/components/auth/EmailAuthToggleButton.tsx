import { Mail } from 'lucide-react';

interface EmailAuthToggleButtonProps {
  mode: 'login' | 'register';
  isActive: boolean;
  onClick: () => void;
}

export default function EmailAuthToggleButton({
  mode,
  isActive,
  onClick,
}: EmailAuthToggleButtonProps) {
  const label = mode === 'login' ? 'Entrar com e-mail' : 'Cadastrar com e-mail';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border font-sans text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${
        isActive
          ? 'bg-primary/15 border-primary/40 text-primary'
          : 'bg-surface-container-high border-white/10 text-on-surface hover:border-primary/30 hover:bg-surface-container'
      }`}
      id="auth-email-toggle-btn"
      aria-expanded={isActive}
    >
      <Mail size={18} />
      {label}
    </button>
  );
}
