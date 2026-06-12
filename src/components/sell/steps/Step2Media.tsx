// 1. Imports externos
import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';

// 2. Imports internos
import { step2Schema } from '../../../lib/sell/schemas';
import PhotoUploader from '../ui/PhotoUploader';
import { StepProps } from '../../../lib/sell/types';

// 3. Tipos/interfaces locais
type Step2Values = {
  images: string[];
};

// Custom resolver do Zod
const zodResolver = (schema: typeof step2Schema) => (values: Step2Values) => {
  const result = schema.safeParse(values);
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

// 5. Componente
function Step2Media({ defaultValues, onStepComplete, onBack }: StepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { handleSubmit, control, formState: { errors } } = useForm<Step2Values>({
    defaultValues: {
      images: defaultValues.images || [],
    },
    resolver: zodResolver(step2Schema),
  });

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const onSubmit = (data: Step2Values) => {
    onStepComplete(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-fade-in text-on-surface">
      <div className="flex flex-col gap-2">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-hanken text-2xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
        >
          Fotos do Anúncio
        </h2>
        <p className="text-sm text-on-surface-variant/60 font-sans">
          Envie fotos reais do seu produto. A primeira foto será a imagem principal da capa.
        </p>
      </div>

      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <PhotoUploader
            images={field.value}
            onChange={field.onChange}
            error={errors.images?.message}
          />
        )}
      />

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
          Avançar para Detalhes
        </button>
      </div>
    </form>
  );
}

// 6. Export default
export default Step2Media;
