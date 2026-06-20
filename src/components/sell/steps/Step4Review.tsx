// 1. Imports externos
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Edit3, CheckCircle, Info, Image, Truck } from 'lucide-react';

// 2. Imports internos
import { publishProduct } from '../../../lib/sell/api';
import { clearDraft } from '../../../lib/sell/draft';
import { SellFormData } from '../../../lib/sell/schemas';
import { CATEGORIES } from './Step1Info';

// 3. Tipos/interfaces locais
interface Step4ReviewProps {
  formData: Partial<SellFormData>;
  goToStep: (step: 1 | 2 | 3 | 4) => void;
  onBack: () => void;
}

const CONDITION_LABELS = {
  new: 'Novo',
  like_new: 'Usado — Como novo',
  good: 'Usado — Bom estado',
  defective: 'Com defeito',
};

const SHIPPING_LABELS = {
  free: 'Frete Grátis',
  negotiate: 'A combinar',
  calculate: 'Calcular por CEP',
};

// 4. Constantes locais

// 5. Componente
function Step4Review({ formData, goToStep, onBack }: Step4ReviewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handlePublish = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await publishProduct(formData as SellFormData);
      clearDraft();
      router.push(`/sell/success?id=${response.productId}`);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao publicar o produto. Verifique sua conexão e tente novamente.',
      );
      setLoading(false);
    }
  };

  const getCategoryName = (catId?: string, subId?: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return '-';
    const sub = cat.subcategories.find((s) => s.id === subId);
    return `${cat.name} > ${sub ? sub.name : '-'}`;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-foreground font-sans">
      <h2 ref={headingRef} tabIndex={-1} className="font-hanken text-2xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-primary/20 rounded-md">
        Revisar & Publicar
      </h2>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3" role="alert">
          {error}
        </div>
      )}

      {/* Seção 1: Informações Básicas */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
            <Info size={16} /> Informações Básicas
          </h3>
          <button type="button" onClick={() => goToStep(1)} className="text-xs text-primary hover:text-primary flex items-center gap-1 transition-colors cursor-pointer font-medium">
            <Edit3 size={12} /> Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs md:text-sm">
          <p><span className="opacity-50">Título:</span> <strong className="font-medium text-foreground">{formData.title}</strong></p>
          <p><span className="opacity-50">Categoria:</span> <span className="font-medium">{getCategoryName(formData.categoryId, formData.subcategory)}</span></p>
          <p><span className="opacity-50">Condição:</span> <span className="font-medium">{CONDITION_LABELS[formData.condition || 'new']}</span></p>
          <p><span className="opacity-50">Estoque:</span> <span className="font-medium font-mono">{formData.stock} unidades</span></p>
          <p><span className="opacity-50">Preço:</span> <strong className="font-bold text-primary text-sm md:text-base">R$ {formData.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
          {formData.sku && <p><span className="opacity-50">SKU:</span> <span className="font-medium font-mono">{formData.sku}</span></p>}
        </div>
      </div>

      {/* Seção 2: Fotos */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
            <Image size={16} /> Fotos do Produto ({formData.images?.length || 0})
          </h3>
          <button type="button" onClick={() => goToStep(2)} className="text-xs text-primary hover:text-primary flex items-center gap-1 transition-colors cursor-pointer font-medium">
            <Edit3 size={12} /> Editar
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {formData.images?.map((url, idx) => (
            <div key={idx} className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Resumo ${idx}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-1 right-1 bg-tertiary text-on-tertiary text-[7px] font-bold px-1 py-0.2 rounded uppercase">
                  Capa
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Seção 3: Detalhes & Logística */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
            <Truck size={16} /> Detalhes & Envio
          </h3>
          <button type="button" onClick={() => goToStep(3)} className="text-xs text-primary hover:text-primary flex items-center gap-1 transition-colors cursor-pointer font-medium">
            <Edit3 size={12} /> Editar
          </button>
        </div>
        <div className="flex flex-col gap-3 text-xs md:text-sm">
          <div>
            <span className="opacity-50 block mb-1">Descrição:</span>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed bg-card p-3.5 rounded-xl border border-border">{formData.description}</p>
          </div>
          {formData.variants && formData.variants.length > 0 && (
            <div>
              <span className="opacity-50 block mb-1">Variantes:</span>
              <div className="flex flex-wrap gap-2">
                {formData.variants.map((v, i) => (
                  <div key={i} className="bg-muted border border-border px-2.5 py-1 rounded-lg text-xs">
                    <span className="font-semibold text-primary">{v.name}:</span> {v.values.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <p><span className="opacity-50">Tipo de Envio:</span> <span className="font-semibold">{SHIPPING_LABELS[formData.shippingType || 'free']}</span></p>
            {formData.shippingType === 'calculate' && (
              <>
                <p><span className="opacity-50">Peso do Pacote:</span> <span className="font-semibold font-mono">{formData.weightKg} kg</span></p>
                <p><span className="opacity-50">CEP de Origem:</span> <span className="font-semibold font-mono">{formData.cep}</span></p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ações Finais */}
      <div className="flex items-center gap-4 mt-4">
        <button
          type="button"
          disabled={loading}
          onClick={onBack}
          className="flex-1 bg-card hover:bg-muted border border-border hover:border-primary/20 text-foreground font-mono text-sm font-semibold py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Voltar
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={handlePublish}
          className="flex-1 bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-mono text-sm font-bold py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Publicando...
            </>
          ) : (
            'Confirmar e Publicar'
          )}
        </button>
      </div>
    </div>
  );
}

// 6. Export default
export default Step4Review;