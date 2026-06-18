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
- **Rotas**: `app/` (cadastro, cart, catalog, login, perfil, produto/[id], sell, sell/success, reset-password, auth/callback, auth/confirm)
- **Pages são wrapper finos** — lógica real em componentes em `src/components/`.
- **Auth**: Supabase Auth (`supabase.auth`). Sessão via `onAuthStateChange`. CRUD de perfis em `public.profiles`. OAuth com Google e Apple reais via `signInWithOAuth`. Fluxo de reset de senha via `resetPasswordForEmail`. Callback em `app/auth/callback/route.ts` e `app/auth/confirm/route.ts`.
- **Cart**: React Context (`src/contexts/CartContext.tsx`). Carrinho persistido no banco (`cart_items`) para usuários autenticados; in-memory para visitantes.
- **Dados mock**: `src/data.ts` exporta `PRODUCTS` (array de `ProductPrereq`) e `COUPONS` — ambos com fallback quando DB não responde.

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
- `uploadPhoto()` em `api.ts` faz upload ao Supabase Storage.
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

## Perfil (`/perfil`)

- `ProfileView.tsx` exibe dados do usuário (`AuthUser`), estatísticas e atalhos.
- Botão "Editar perfil" abre modal `ProfileEditView.tsx` com formulário de nome e upload de avatar.
- Upload de avatar usa bucket `avatars` no Supabase Storage.
- Atualização do perfil via `supabase.from('profiles').update(...)`.

---

## Migrations (Supabase)

### Estrutura

```
supabase/migrations/   ← arquivos SQL versionados
```

### Workflow

```sh
# Instalar Supabase CLI (caso não tenha)
npm install supabase --save-dev

# Inicializar e linkar o projeto
npx supabase init
npx supabase link --project-ref ibgsmajftievjrhvctxz

# Puxar schema atual (sobrescreve migrations/)
npx supabase db pull

# Aplicar migrations locais ao branch remoto
npx supabase db push
```

### Tabelas atuais

```
public.profiles       ← perfil do usuário (id, name, email, avatar_url)
public.products       ← produtos do marketplace
public.categories     ← categorias (nome, slug, parent_id)
public.cart_items     ← itens do carrinho (user_id, product_id, quantity)
public.coupons        ← cupons de desconto (code, discount_percentage)
```

### Buckets storage

```
product-images        ← imagens dos produtos
avatars               ← avatares dos usuários
```

---

## Libs internas

| Arquivo | Propósito |
|---|---|
| `src/lib/products.ts` | `getProducts()`, `getProductsPaginated(page,size)`, `getProductById(id)` — fallback para mocks |
| `src/lib/coupons.ts` | `getCoupons()`, `validateCoupon(code)` — fallback para `data.ts` |
| `src/lib/supabase/admin.ts` | Cliente com `SUPABASE_SERVICE_ROLE_KEY` (server-side only) |
| `src/lib/supabase/client.ts` | Singleton do browser client (`@supabase/ssr`) |
| `src/lib/supabase/server.ts` | Server client para Server Components e Route Handlers |
| `src/lib/supabase/middleware.ts` | `updateSession()` usado pelo middleware root |
| `src/lib/auth.ts` | `getSupabaseErrorMessage()` — tradução de erros do Supabase |
| `src/lib/routes.ts` | Objeto `routes` com todas as rotas do app |
| `src/lib/sell/api.ts` | `uploadPhoto()`, `publishProduct()` |

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
