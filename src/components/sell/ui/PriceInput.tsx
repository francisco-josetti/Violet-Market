import React from 'react';
import { DollarSign } from 'lucide-react';

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | '';
  onChange: (value: number) => void;
  error?: string;
  label: string;
}

function PriceInput({ value, onChange, error, label, id, ...props }: PriceInputProps) {
  const displayValue = value === '' ? '' : value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    
    if (cleanValue === '') {
      onChange(0);
      return;
    }

    const numericValue = parseFloat(cleanValue) / 100;
    onChange(numericValue);
  };

  const inputErrorClass = error
    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
    : 'border-border focus:border-primary focus:ring-primary/25';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground pointer-events-none font-mono text-sm font-semibold select-none">
          <DollarSign size={16} />
          <span>R$</span>
        </div>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          className={`w-full bg-background border rounded-xl pl-16 pr-4 py-3 text-foreground font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all ${inputErrorClass}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="0,00"
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive font-sans" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default PriceInput;