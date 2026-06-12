<div align="center">
  <h1>Violet Market</h1>
  <p><strong>Premium High-Performance Technology & Hardware Marketplace</strong></p>
  <p>Discover the future of commerce.</p>
</div>

## Sobre

Violet Market é um marketplace de tecnologia e hardware premium, construído com **Next.js 15** (App Router) e **React 19**. O projeto oferece uma experiência moderna de e-commerce com catálogo de produtos, carrinho de compras, sistema de autenticação via Supabase e um wizard completo para venda de produtos.

## Stack

| Tecnologia | Versão |
|---|---|
| Next.js | 15 (App Router) |
| React | 19 |
| TypeScript | 5.8 (strict) |
| Tailwind CSS | 4 |
| Supabase | Auth + Database |
| Zod | 4 (validação) |
| React Hook Form | 7.77 |
| motion | 12 (animações) |
| lucide-react | 0.546 (ícones) |
| Google Gen AI | 2.4 |

## Funcionalidades

- **Catálogo** — Navegue por produtos com filtros por categoria, preço e avaliação
- **Detalhe do Produto** — Galeria de imagens, especificações técnicas e avaliações
- **Carrinho** — Context-based cart gerenciado via React Context
- **Autenticação** — Login/cadastro com Supabase Auth e perfis em `public.profiles`
- **Vender Produto** — Wizard multi-etapas com validação Zod, rascunho salvo em localStorage e integração com API
- **Perfil do Usuário** — Visualização e edição de perfil

## Começando

**Pré-requisitos:** Node.js 18+

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Crie um arquivo .env.local com:
#   GEMINI_API_KEY=<sua-chave>
#   NEXT_PUBLIC_SUPABASE_URL=<url>
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção (porta 3000) |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |

## Projeto

```
app/              # Rotas App Router
├── cadastro/     # Cadastro de usuário
├── cart/         # Carrinho de compras
├── catalog/      # Catálogo de produtos
├── login/        # Login
├── perfil/       # Perfil do usuário
├── produto/      # Detalhe do produto
└── sell/         # Vender produto (wizard)
src/
├── components/   # Componentes React
├── contexts/     # Contextos (CartContext)
├── hooks/        # Hooks customizados
├── lib/          # Utilitários (auth, sell, supabase)
├── schemas/      # Schemas de validação
├── data.ts       # Dados mock (produtos e cupons)
└── types.ts      # Tipos compartilhados
```

## Licença

MIT
