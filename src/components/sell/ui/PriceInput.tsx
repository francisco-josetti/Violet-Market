// 1. Imports externos
import React from 'react';
import { DollarSign } from 'lucide-react';

// 2. Imports internos

// 3. Tipos/interfaces locais
interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | '';
  onChange: (value: number) => void;
  error?: string;
  label: string;
}

// 4. Constantes locais

// 5. Componente
function PriceInput({ value, onChange, error, label, id, ...props }: PriceInputProps) {
  const displayValue = value === '' ? '' : value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo exceto números
    const cleanValue = e.target.value.replace(/\D/g, '');
    
    if (cleanValue === '') {
      onChange(0);
      return;
    }

    // Transforma em valor decimal (centavos divididos por 100)
    const numericValue = parseFloat(cleanValue) / 100;
    onChange(numericValue);
  };

  const inputErrorClass = error
    ? 'border-error/50 focus:border-error/50 focus:ring-error/20'
    : 'border-white/10 focus:border-primary/50 focus:ring-primary/25';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-on-surface-variant pointer-events-none font-mono text-sm font-semibold select-none">
          <DollarSign size={16} />
          <span>R$</span>
        </div>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          className={`w-full bg-surface-container-low border rounded-xl pl-16 pr-4 py-3 text-on-surface font-sans text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 transition-all ${inputErrorClass}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="0,00"
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-error font-sans" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// 6. Export default
export default PriceInput;
