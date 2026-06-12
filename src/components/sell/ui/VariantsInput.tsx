// 1. Imports externos
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

// 2. Imports internos

// 3. Tipos/interfaces locais
interface Variant {
  name: string;
  values: string[];
}

interface VariantsInputProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

// 4. Constantes locais

// 5. Componente
function VariantsInput({ variants, onChange }: VariantsInputProps) {
  const addVariant = () => {
    onChange([...variants, { name: '', values: [] }]);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, idx) => idx !== index));
  };

  const updateVariantName = (index: number, name: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], name };
    onChange(updated);
  };

  const updateVariantValues = (index: number, rawValues: string) => {
    const valuesArray = rawValues
      .split(',')
      .map((val) => val.trim())
      .filter((val) => val !== '');
    const updated = [...variants];
    updated[index] = { ...updated[index], values: valuesArray };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
          Variantes (Ex: Cor, Tamanho)
        </span>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1 text-xs text-primary hover:text-brand-violet transition-colors cursor-pointer font-semibold"
        >
          <Plus size={14} />
          Adicionar Variante
        </button>
      </div>

      {variants.length === 0 ? (
        <p className="text-xs text-on-surface-variant/40 italic">
          Nenhuma variante adicionada. O produto será cadastrado como único.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {variants.map((variant, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-3 bg-surface-container-low/40 border border-white/5 p-4 rounded-xl relative"
            >
              <div className="flex-1 flex flex-col gap-1.5">
                <label
                  htmlFor={`variant-name-${idx}`}
                  className="text-[10px] uppercase font-mono tracking-wider text-on-surface-variant/60"
                >
                  Nome da Variante
                </label>
                <input
                  id={`variant-name-${idx}`}
                  type="text"
                  value={variant.name}
                  onChange={(e) => updateVariantName(idx, e.target.value)}
                  placeholder="Ex: Cor"
                  className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-sans text-xs focus:outline-none focus:ring-1 focus:border-primary/50 focus:ring-primary/25 transition-all text-on-surface"
                />
              </div>

              <div className="flex-[2] flex flex-col gap-1.5">
                <label
                  htmlFor={`variant-values-${idx}`}
                  className="text-[10px] uppercase font-mono tracking-wider text-on-surface-variant/60 flex justify-between"
                >
                  Valores (separados por vírgula)
                  {variant.values.length > 0 && (
                    <span className="text-[9px] text-primary">{variant.values.length} adicionados</span>
                  )}
                </label>
                <input
                  id={`variant-values-${idx}`}
                  type="text"
                  defaultValue={variant.values.join(', ')}
                  onChange={(e) => updateVariantValues(idx, e.target.value)}
                  placeholder="Ex: Preto, Branco, Cinza"
                  className="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-sans text-xs focus:outline-none focus:ring-1 focus:border-primary/50 focus:ring-primary/25 transition-all text-on-surface"
                />
              </div>

              <button
                type="button"
                onClick={() => removeVariant(idx)}
                className="self-end sm:self-center p-2 bg-error-container/10 hover:bg-error-container/20 text-error rounded-lg transition-colors cursor-pointer mt-2 sm:mt-0"
                title="Remover variante"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 6. Export default
export default VariantsInput;
