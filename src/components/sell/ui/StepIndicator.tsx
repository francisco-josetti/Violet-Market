// 1. Imports externos
import React from 'react';
import { Check } from 'lucide-react';

// 2. Imports internos

// 3. Tipos/interfaces locais
interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  onStepClick?: (step: 1 | 2 | 3 | 4) => void;
}

// 4. Constantes locais
const STEPS = [
  { id: 1, label: 'Informações', desc: 'Básicas' },
  { id: 2, label: 'Mídia', desc: 'Fotos' },
  { id: 3, label: 'Detalhes', desc: 'Logística' },
  { id: 4, label: 'Revisão', desc: 'Publicar' },
] as const;

// 5. Componente
function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="w-full" aria-label="Progresso do anúncio">
      <ol className="flex items-center w-full justify-between gap-2 md:gap-4 font-sans text-xs md:text-sm">
        {STEPS.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = onStepClick && step.id < currentStep;

          return (
            <li key={step.id} className="flex-1 flex items-center gap-2 md:gap-4">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-1.5 transition-all duration-300 ${
                  isClickable ? 'cursor-pointer hover:bg-accent' : 'cursor-default'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs md:text-sm transition-all duration-300 border ${
                    isCompleted
                      ? 'bg-tertiary border-tertiary text-on-tertiary'
                      : isActive
                      ? 'bg-primary border-primary text-white'
                      : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={`font-semibold text-xs tracking-wide uppercase transition-colors ${
                      isActive ? 'text-primary' : isCompleted ? 'text-tertiary' : 'text-muted-foreground/70'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 leading-tight">
                    {step.desc}
                  </p>
                </div>
              </button>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[2px] transition-all duration-500 rounded ${
                    isCompleted ? 'bg-tertiary/60' : 'bg-border'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// 6. Export default
export default StepIndicator;