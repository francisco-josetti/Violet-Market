// 1. Imports externos
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

// 2. Imports internos
import { step3Schema } from '../../../lib/sell/schemas';
import VariantsInput from '../ui/VariantsInput';
import { StepProps } from '../../../lib/sell/types';

// 3. Tipos/interfaces locais
type Step3Values = {
  description: string;
  variants: { name: string; values: string[] }[];
  shippingType: 'free' | 'negotiate' | 'calculate';
  weightKg?: number | '';
  cep?: string;
};

const zodResolver = (schema: typeof step3Schema) => (values: Step3Values) => {
  const parsedValues = {
    ...values,
    weightKg: values.shippingType === 'calculate' && values.weightKg !== '' ? Number(values.weightKg) : undefined,
    cep: values.shippingType === 'calculate' ? values.cep : undefined,
  };
  const result = schema.safeParse(parsedValues);
  if (result.success) return { values: result.data, errors: {} };
  return {
    values: {},
    errors: result.error.issues.reduce((acc, issue) => {
      acc[issue.path[0] as string] = { type: 'validation', message: issue.message };
      return acc;
    }, {} as Record<string, { type: string; message: string }>),
  };
};

// 4. Constantes locais
const SHIPPING_OPTIONS = [
  { id: 'free', label: 'Frete Grátis', desc: 'Você arca com os custos de envio' },
  { id: 'negotiate', label: 'A combinar', desc: 'Comprador negocia a entrega com você' },
  { id: 'calculate', label: 'Calcular por CEP', desc: 'Correios calcula com base em peso/CEP' },
] as const;

// 5. Componente
function Step3Details({ defaultValues, onStepComplete, onBack }: StepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [addressDetails, setAddressDetails] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<Step3Values>({
    defaultValues: {
      description: defaultValues.description || '',
      variants: defaultValues.variants || [],
      shippingType: defaultValues.shippingType || 'free',
      weightKg: defaultValues.weightKg ?? '',
      cep: defaultValues.cep || '',
    },
    resolver: zodResolver(step3Schema) as any,
  });

  const descriptionText = watch('description') || '';
  const selectedShipping = watch('shippingType');
  const cepValue = watch('cep') || '';

  useEffect(() => {
    headingRef.current?.focus();
    descRef.current?.focus();
  }, []);

  // Integração com ViaCEP
  useEffect(() => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8 && selectedShipping === 'calculate') {
      setAddressDetails('Buscando endereço...');
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) {
            setAddressDetails('CEP não encontrado');
          } else {
            setAddressDetails(`${data.logradouro ? data.logradouro + ', ' : ''}${data.bairro ? data.bairro + ' — ' : ''}${data.localidade}/${data.uf}`);
          }
        })
        .catch(() => setAddressDetails('Erro ao consultar ViaCEP'));
    } else {
      setAddressDetails(null);
    }
  }, [cepValue, selectedShipping]);

  const onSubmit = (data: Step3Values) => {
    onStepComplete({
      ...data,
      weightKg: data.shippingType === 'calculate' && data.weightKg !== '' && data.weightKg !== undefined ? Number(data.weightKg) : undefined,
      cep: data.shippingType === 'calculate' ? data.cep : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-fade-in text-on-surface">
      <h2 ref={headingRef} tabIndex={-1} className="font-hanken text-2xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-primary/20 rounded-md">
        Detalhes & Logística
      </h2>

      {/* Descrição */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="description" className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Descrição do Produto</label>
          <span className="text-xs text-on-surface-variant/40 font-mono">{descriptionText.length} caracteres (mín. 20)</span>
        </div>
        <textarea
          id="description"
          rows={5}
          {...register('description')}
          ref={(e) => {
            register('description').ref(e);
            (descRef.current as HTMLTextAreaElement | null) = e;
          }}
          className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 transition-all resize-y ${
            errors.description ? 'border-error/50 focus:border-error/50 focus:ring-error/20' : 'border-white/10 focus:border-primary/50 focus:ring-primary/25'
          }`}
          placeholder="Descreva detalhes como características, estado de conservação, acessórios inclusos e tempo de uso..."
        />
        {errors.description && <p className="text-xs text-error font-sans" role="alert">{errors.description.message}</p>}
      </div>

      {/* Variantes Dinâmicas */}
      <Controller
        name="variants"
        control={control}
        render={({ field }) => <VariantsInput variants={field.value || []} onChange={field.onChange} />}
      />

      {/* Opções de Frete */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Opções de Frete</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SHIPPING_OPTIONS.map((opt) => {
            const isSelected = selectedShipping === opt.id;
            return (
              <label
                key={opt.id}
                className={`flex flex-col p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-brand-violet bg-brand-violet/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                    : 'border-white/10 bg-surface-container-low/40 text-on-surface-variant hover:border-white/20'
                }`}
              >
                <input type="radio" value={opt.id} {...register('shippingType')} className="sr-only" />
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-[10px] opacity-60 leading-tight mt-1">{opt.desc}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Inputs condicionados a cálculo por CEP */}
      {selectedShipping === 'calculate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="weightKg" className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Peso do Produto (kg)</label>
            <input
              id="weightKg"
              type="number"
              step="0.01"
              {...register('weightKg')}
              className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.weightKg ? 'border-error/50 focus:border-error/50 focus:ring-error/20' : 'border-white/10 focus:border-primary/50 focus:ring-primary/25'
              }`}
              placeholder="Ex: 0.85"
            />
            {errors.weightKg && <p className="text-xs text-error font-sans" role="alert">{errors.weightKg.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cep" className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">CEP de Origem</label>
            <input
              id="cep"
              type="text"
              maxLength={8}
              {...register('cep')}
              className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.cep ? 'border-error/50 focus:border-error/50 focus:ring-error/20' : 'border-white/10 focus:border-primary/50 focus:ring-primary/25'
              }`}
              placeholder="Ex: 01001000"
            />
            {addressDetails && <p className="text-xs text-primary font-sans mt-0.5">{addressDetails}</p>}
            {errors.cep && <p className="text-xs text-error font-sans" role="alert">{errors.cep.message}</p>}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center gap-4 mt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-surface-container-low hover:bg-surface-container border border-white/10 hover:border-white/20 text-on-surface font-mono text-sm font-semibold py-3.5 rounded-xl transition-all cursor-pointer text-center"
          >
            Voltar
          </button>
        )}
        <button
          type="submit"
          className="flex-1 bg-brand-violet hover:bg-brand-violet/90 text-white font-mono text-sm font-semibold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] cursor-pointer text-center"
        >
          Avançar para Revisão
        </button>
      </div>
    </form>
  );
}

// 6. Export default
export default Step3Details;
