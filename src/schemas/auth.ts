import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Informe seu nome.')
      .min(2, 'O nome deve ter pelo menos 2 caracteres.'),
    email: z
      .string()
      .trim()
      .min(1, 'Informe seu e-mail.')
      .email('Informe um e-mail válido.'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
    acceptedTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.acceptedTerms === true, {
    message: 'Aceite os termos de uso para criar sua conta.',
    path: ['acceptedTerms'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export function getZodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Verifique os dados informados.';
}

export function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}
