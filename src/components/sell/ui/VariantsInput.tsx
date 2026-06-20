import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Variant {
  name: string;
  values: string[];
}

interface VariantsInputProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

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
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          Variantes (Ex: Cor, Tamanho)
        </span>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer font-semibold"
        >
          <Plus size={14} />
          Adicionar Variante
        </button>
      </div>

      {variants.length === 0 ? (
        <p className="text-xs text-muted-foreground/50 italic">
          Nenhuma variante adicionada. O produto será cadastrado como único.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {variants.map((variant, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-3 bg-muted border border-border p-4 rounded-xl relative"
            >
              <div className="flex-1 flex flex-col gap-1.5">
                <label
                  htmlFor={`variant-name-${idx}`}
                  className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground"
                >
                  Nome da Variante
                </label>
                <input
                  id={`variant-name-${idx}`}
                  type="text"
                  value={variant.name}
                  onChange={(e) => updateVariantName(idx, e.target.value)}
                  placeholder="Ex: Cor"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sans text-xs focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary/25 transition-all text-foreground"
                />
              </div>

              <div className="flex-[2] flex flex-col gap-1.5">
                <label
                  htmlFor={`variant-values-${idx}`}
                  className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground flex justify-between"
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
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sans text-xs focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary/25 transition-all text-foreground"
                />
              </div>

              <button
                type="button"
                onClick={() => removeVariant(idx)}
                className="self-end sm:self-center p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors cursor-pointer mt-2 sm:mt-0"
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

export default VariantsInput;