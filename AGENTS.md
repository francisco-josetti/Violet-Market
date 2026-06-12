# AGENTS.md — Violet Market

Leia este arquivo antes de qualquer edição de código no repositório.

---

## Stack real (verificada em package.json)

| Tecnologia | Versão | Nota |
|---|---|---|
| Next.js | 15 | App Router; `next.config.ts` com `reactStrictMode: true` |
| React | 19 | hooks only |
| TypeScript | 5.8 | `strict: true`; `noEmit: true`; `@/*` path alias mapeia para raiz |
| Zod | 4 | Schemas por etapa em `src/lib/sell/schemas.ts` |
| React Hook Form | 7.77 | Controller para inputs controlados |
| Tailwind CSS | 4 | via `@tailwindcss/postcss` |
| motion | 12 | (sucessor do framer-motion) |
| lucide-react | 0.546 | ícones |
| Supabase JS | 2.107 | (cliente, mas app usa auth localStorage) |
| Google Gen AI | 2.4 | `GEMINI_API_KEY` no `.env.local` |
| Supabase JS | 2.107 | Auth, profiles, products; `NEXT_PUBLIC_SUPABASE_*` no `.env.local` |

---

## Comandos exatos

```sh
npm run dev      # next dev --port 3000
npm run build    # next build
npm run start    # next start --port 3000
npm run lint     # tsc --noEmit  (sem ESLint)
```

Não há testes, pre-commit hooks, ou CI configurados.

---

## Arquitetura

- **Single-package Next.js app.** Todo código de componente/lógica fica em `src/`.
- **Rotas**: `app/` (cadastro, cart, catalog, login, perfil, produto/[id], sell, sell/success)
- **Pages são wrapper finos** — lógica real em componentes em `src/components/`.
- **Auth**: Supabase Auth (`supabase.auth`). Sessão via `onAuthStateChange`. CRUD de perfis em `public.profiles`.
- **Cart**: React Context (`src/contexts/CartContext.tsx`), não Zustand.
- **Dados mock**: `src/data.ts` exporta `PRODUCTS` (array de `ProductPrereq`) e `COUPONS`.

---

## Feature "Vender Produto" (`/sell`)

### Arquivos

```
src/lib/sell/           ← schemas, types, api, draft
src/components/sell/    ← SellWizard, steps/, ui/
app/sell/               ← page.tsx, success/page.tsx
```

### Regras de wizard

- Estado gerido inline no `SellWizard.tsx` (useState), sem Context/Zustand externo.
- Cada etapa (StepProps) recebe `defaultValues` + `onStepComplete` + `onBack`.
- Step1Info exporta `CATEGORIES` usado por Step4Review.
- Step4Review chama `publishProduct()` e `clearDraft()` + redireciona em sucesso.
- `uploadPhoto()` em `api.ts` retorna Data URL (mock local, não upload real).
- `publishProduct()` faz POST `/api/products` com preço em centavos; fallback mock se API não responder.

### Validação

- `step1Schema` / `step2Schema` / `step3BaseSchema` + refinements em `step3Schema`.
- `sellFormSchema` = merge de `step1Schema + step2Schema + step3BaseSchema` (sem os refinements).
- `SellFormData` inferido de `sellFormSchema`.

### Rascunho

- localStorage key `marketplace_sell_draft` via `src/lib/sell/draft.ts`.
- Banner de continuar/descartar ao entrar em `/sell`.

### Constantes de upload (não alterar)

```
MAX_PHOTOS = 8, MAX_FILE_SIZE_MB = 10
ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
```

---

## Convenções (do código existente)

| Item | Regra |
|---|---|
| Componentes | function declaration, export default |
| Ordem arquivo | imports → tipos locais → constantes → componente → export |
| Máx 150 linhas | por componente |
| Naming | Componentes PascalCase, hooks `use*`, utils camelCase, constantes SCREAMING_SNAKE_CASE |
| `any` | zero explícito |
| `console.log` | proibido; `console.error` só em catch |
| Fetch de API | só via `src/lib/sell/api.ts`, nunca direto no componente |
| Acessibilidade | label com htmlFor, aria-current="step", role="alert" em erros, foco gerenciado |

---

## Restrições ao agente

- Não instalar novas dependências sem perguntar.
- Não editar arquivos fora de `app/`, `src/components/`, `src/lib/`.
- Não usar `alert()`/`confirm()`/`prompt()`.
- Não gerar testes sem solicitação explícita.
- Preferir edição sobre criação de novos arquivos.
