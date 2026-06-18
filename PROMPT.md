# Pendências — Violet Market (Supabase)

## Já concluído

- [x] **Segurança DB**: `handle_new_user` com `SET search_path = ''` + `REVOKE EXECUTE` de `anon`/`authenticated`
- [x] **RLS policies**: `auth.uid()` → `(select auth.uid())` em todas as policies de `products` e `profiles`
- [x] **RLS duplicadas**: removidas policies redundantes de `profiles` (SELECT e UPDATE)
- [x] **Storage**: removida policy de listagem pública do bucket `product-images`; corrigida policy de upload com `(select auth.uid())`; adicionada policy de DELETE
- [x] **Índices FK**: criados em `categories.parent_id` e `products.seller_id`
- [x] **Colunas**: `category_id` (FK → categories) e `subcategory` adicionadas à tabela `products`
- [x] **Upload real**: `uploadPhoto()` em `api.ts` agora faz upload ao Supabase Storage em vez de Data URL
- [x] **API Route**: `app/api/products/route.ts` — POST server-side com validação e autenticação
- [x] **Camada de produtos**: `src/lib/products.ts` — `getProducts()` e `getProductById()` buscam do Supabase com fallback para mocks
- [x] **Integração Profiles**: `AuthUser` agora inclui `name` e `avatarUrl`; layout e AuthContext buscam da tabela `profiles`; ProfileView exibe avatar real
- [x] **Middleware**: removida chamada duplicada de `getUser()`
- [x] **CatalogView / HomeView / DetailView**: buscam produtos do Supabase via hooks

---

## Pendente

### Alta prioridade

- [ ] **OAuth real (Google/Apple)** — Botões em `src/components/auth/SocialAuthButtons.tsx` são mock com `setTimeout`. Implementar `supabase.auth.signInWithOAuth({ provider: 'google' })` e `'apple'`. Precisa configurar providers no Dashboard do Supabase (Authentication → Providers).

- [ ] **"Esqueceu a senha?"** — Botão em `LoginView.tsx` sem `onClick`. Implementar fluxo com `supabase.auth.resetPasswordForEmail(email, { redirectTo: '<URL>/reset-password' })` e criar a página `app/reset-password/page.tsx`.

- [ ] **Persistir carrinho no banco** — `CartContext.tsx` é 100% in-memory com 2 itens mock. Criar tabela `cart_items` no Supabase com RLS e persistir o carrinho por usuário autenticado. Manter state local para UX mas sincronizar ao login.

### Média prioridade

- [ ] **Tabela `profiles` — edição de perfil** — O ProfileView exibe dados mas não permite editar. Criar formulário de edição (nome, avatar) com `supabase.from('profiles').update(...)` + upload de avatar ao Storage.

- [ ] **Configurar `SUPABASE_SERVICE_ROLE_KEY`** — Adicionar no `.env.local` e criar helper `src/lib/supabase/admin.ts` para operações server-side que precisem de privilégios elevados (ex: moderação de produtos).

- [ ] **Versionar migrations** — Inicializar `supabase/` no repo com `supabase init` + `supabase db pull` para manter o schema versionado. Atualizar `AGENTS.md` com esse workflow.

- [ ] **Página `/sell/success` — buscar produto real** — Atualmente usa mock. Ao redirecionar com `?id=<uuid>`, buscar o produto recém-criado do Supabase para exibir resumo real.

### Baixa prioridade

- [ ] **Singleton do browser client** — `createClient()` em `client.ts` cria nova instância a cada chamada. Implementar padrão singleton para evitar múltiplos listeners em `onAuthStateChange` durante HMR.

- [ ] **Cart view — produto do banco** — `CartView` e `CartContext` usam o tipo `ProductPrereq` do mock para exibir nome/preço. Quando produtos vêm do Supabase, o carrinho precisa armazenar o `productId` e buscar dados atualizados.

- [ ] **Imagem de avatar no bucket** — Criar bucket `avatars` com RLS e policy de upload/deleção própria. Atualizar `ProfileView` e edição de perfil para usar esse bucket.

- [ ] **Desconto VIP dinâmico** — O `CartView` hardcoded "5% VIP". Criar tabela `coupons` no Supabase, mover `COUPONS` do `data.ts` para o banco, e buscar cupons vigentes server-side.

- [ ] **Paginação real no catálogo** — `CatalogView` tem paginação visual estática. Implementar paginação server-side com `range()` do Supabase client.