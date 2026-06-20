// 1. Imports externos
import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';

// 2. Imports internos
import { step1Schema } from '../../../lib/sell/schemas';
import PriceInput from '../ui/PriceInput';
import { StepProps } from '../../../lib/sell/types';

// 3. Tipos/interfaces locais
type Step1Values = {
  title: string;
  categoryId: string;
  subcategory: string;
  condition: 'new' | 'like_new' | 'good' | 'defective';
  price: number | '';
  stock: number | '';
  sku?: string;
};

// 4. Constantes locais
export const CATEGORIES = [
  {
    id: 'hardware',
    name: 'Hardware',
    subcategories: [
      { id: 'cpus', name: 'Processadores (CPUs)' },
      { id: 'gpus', name: 'Placas de Vídeo (GPUs)' },
      { id: 'storage', name: 'Armazenamento (SSD/HD)' },
      { id: 'motherboards', name: 'Placas-Mãe' },
    ],
  },
  {
    id: 'peripherals',
    name: 'Periféricos',
    subcategories: [
      { id: 'keyboards', name: 'Teclados' },
      { id: 'mouses', name: 'Mouses' },
      { id: 'monitors', name: 'Monitores' },
    ],
  },
  {
    id: 'audio',
    name: 'Áudio High-End',
    subcategories: [
      { id: 'headphones', name: 'Fones de Ouvido' },
      { id: 'speakers', name: 'Caixas de Som' },
      { id: 'microphones', name: 'Microfones' },
    ],
  },
  {
    id: 'wearables',
    name: 'Wearables',
    subcategories: [
      { id: 'smartwatches', name: 'Relógios Inteligentes' },
      { id: 'ar-vr', name: 'Óculos AR/VR' },
    ],
  },
  {
    id: 'accessories',
    name: 'Acessórios',
    subcategories: [
      { id: 'cases', name: 'Cases e Estojos' },
      { id: 'cables', name: 'Cabos e Carregadores' },
    ],
  },
] as const;

const CONDITIONS = [
  { id: 'new', label: 'Novo', desc: 'Lacrado ou nunca usado' },
  { id: 'like_new', label: 'Excelente', desc: 'Como novo, sem marcas' },
  { id: 'good', label: 'Bom estado', desc: 'Sinais normais de uso' },
  { id: 'defective', label: 'Com defeito', desc: 'Para conserto ou peças' },
] as const;

// Helper resolver manual do Zod para evitar dependência externa
const zodResolver = (schema: typeof step1Schema) => (values: Step1Values) => {
  const result = schema.safeParse({
    ...values,
    price: values.price === '' ? undefined : Number(values.price),
    stock: values.stock === '' ? undefined : Number(values.stock),
  });
  if (result.success) return { values: result.data, errors: {} };
  return {
    values: {},
    errors: result.error.issues.reduce((acc, issue) => {
      acc[issue.path[0] as string] = { type: 'validation', message: issue.message };
      return acc;
    }, {} as Record<string, { type: string; message: string }>),
  };
};

// 5. Componente
function Step1Info({ defaultValues, onStepComplete }: StepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<Step1Values>({
    defaultValues: {
      title: defaultValues.title || '',
      categoryId: defaultValues.categoryId || '',
      subcategory: defaultValues.subcategory || '',
      condition: defaultValues.condition || 'new',
      price: defaultValues.price ?? '',
      stock: defaultValues.stock ?? 1,
      sku: defaultValues.sku || '',
    },
    resolver: zodResolver(step1Schema),
  });

  const selectedCategory = watch('categoryId');
  const titleText = watch('title') || '';

  useEffect(() => {
    headingRef.current?.focus();
    firstInputRef.current?.focus();
  }, []);

  const selectedCatData = CATEGORIES.find((c) => c.id === selectedCategory);

  const onSubmit = (data: Step1Values) => {
    onStepComplete({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-fade-in text-foreground">
      <h2 ref={headingRef} tabIndex={-1} className="font-hanken text-2xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-primary/20 rounded-md">
        Informações Básicas do Produto
      </h2>

      {/* Título */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="title" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Título do Anúncio</label>
          <span className="text-xs text-muted-foreground/40 font-mono">{titleText.length}/120</span>
        </div>
        <input
          id="title"
          type="text"
          {...register('title')}
          ref={(e) => {
            register('title').ref(e);
            (firstInputRef.current as HTMLInputElement | null) = e;
          }}
          className={`w-full bg-card border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 transition-all ${
            errors.title ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/25'
          }`}
          placeholder="Ex: Drone Fotográfico Quantum Pro V2 com Câmera 8K"
        />
        {errors.title && <p className="text-xs text-destructive font-sans" role="alert">{errors.title.message}</p>}
      </div>

      {/* Categoria & Subcategoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoryId" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Categoria</label>
          <select
            id="categoryId"
            {...register('categoryId')}
            onChange={(e) => {
              register('categoryId').onChange(e);
              setValue('subcategory', '');
            }}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary/25 transition-all text-foreground"
          >
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          {errors.categoryId && <p className="text-xs text-destructive font-sans" role="alert">{errors.categoryId.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="subcategory" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Subcategoria</label>
          <select
            id="subcategory"
            {...register('subcategory')}
            disabled={!selectedCategory}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary/25 transition-all text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Selecione primeiro a categoria</option>
            {selectedCatData?.subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
          {errors.subcategory && <p className="text-xs text-destructive font-sans" role="alert">{errors.subcategory.message}</p>}
        </div>
      </div>

      {/* Condição do Produto */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Condição do Produto</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONDITIONS.map((cond) => {
            const isSelected = watch('condition') === cond.id;
            return (
              <label
                key={cond.id}
                className={`flex flex-col p-3 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-white'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/20'
                }`}
              >
                <input
                  type="radio"
                  value={cond.id}
                  {...register('condition')}
                  className="sr-only"
                />
                <span className="text-sm font-semibold">{cond.label}</span>
                <span className="text-[10px] opacity-60 leading-tight mt-1">{cond.desc}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Preço, Estoque & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <PriceInput
              id="price"
              label="Preço"
              value={field.value}
              onChange={field.onChange}
              error={errors.price?.message}
            />
          )}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="stock" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Quantidade em Estoque</label>
          <input
            id="stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
            className={`w-full bg-card border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 transition-all ${
              errors.stock ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/25'
            }`}
            placeholder="Ex: 5"
          />
          {errors.stock && <p className="text-xs text-destructive font-sans" role="alert">{errors.stock.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sku" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">SKU Interno (Opcional)</label>
          <input
            id="sku"
            type="text"
            {...register('sku')}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sans text-sm focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary/25 transition-all text-foreground"
            placeholder="Ex: DR-QTY-V2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white font-mono text-sm font-semibold py-3.5 rounded-xl transition-all cursor-pointer mt-4"
      >
        Avançar para Mídia
      </button>
    </form>
  );
}

// 6. Export default
export default Step1Info;