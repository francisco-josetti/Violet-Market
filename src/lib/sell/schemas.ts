import { z } from 'zod';

export const MAX_PHOTOS = 8;
export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const step1Schema = z.object({
  title: z
    .string()
    .min(10, 'O título deve ter no mínimo 10 caracteres')
    .max(120, 'O título deve ter no máximo 120 caracteres'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  subcategory: z.string().min(1, 'Selecione uma subcategoria'),
  condition: z.enum(['new', 'like_new', 'good', 'defective'], {
    message: 'Selecione a condição do produto',
  }),
  price: z
    .number({ message: 'Preço inválido' })
    .min(1.0, 'O preço mínimo é R$ 1,00'),
  stock: z
    .number({ message: 'Estoque inválido' })
    .int('A quantidade deve ser um número inteiro')
    .min(1, 'A quantidade em estoque deve ser no mínimo 1'),
  sku: z.string().optional(),
});

export const step2Schema = z.object({
  images: z
    .array(z.string().url('URL de imagem inválida'))
    .min(1, 'Envie pelo menos 1 foto')
    .max(8, 'Você pode enviar no máximo 8 fotos'),
});

export const step3BaseSchema = z.object({
  description: z
    .string()
    .min(20, 'A descrição deve ter no mínimo 20 caracteres'),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'Nome da variante obrigatório'),
        values: z.array(z.string().min(1, 'Insira um valor')).min(1, 'Adicione pelo menos um valor'),
      })
    )
    .optional(),
  shippingType: z.enum(['free', 'negotiate', 'calculate']),
  weightKg: z
    .number({ message: 'Insira um peso válido' })
    .min(0.01, 'O peso deve ser maior que zero')
    .optional(),
  cep: z.string().optional(),
});

export const step3Schema = step3BaseSchema
  .refine(
    (data) => {
      if (data.shippingType === 'calculate') {
        return data.weightKg !== undefined && data.weightKg > 0;
      }
      return true;
    },
    {
      message: 'O peso é obrigatório para cálculo de frete',
      path: ['weightKg'],
    }
  )
  .refine(
    (data) => {
      if (data.shippingType === 'calculate') {
        return (
          data.cep !== undefined &&
          /^[0-9]{8}$/.test(data.cep.replace(/\D/g, ''))
        );
      }
      return true;
    },
    {
      message: 'CEP inválido (deve conter 8 números)',
      path: ['cep'],
    }
  );

export const sellFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3BaseSchema);

export type SellFormData = z.infer<typeof sellFormSchema>;
