# Prompt — Aba "Vender Produto" (Marketplace / React + Next.js)

## Como usar
Cole este prompt (ou a seção relevante) diretamente no chat sempre que quiser gerar,
refatorar ou expandir qualquer parte da aba de venda. Substitua os campos entre `< >`
com os detalhes do seu projeto antes de enviar.

---

## Prompt principal

```
Você é um engenheiro front-end sênior especializado em React e Next.js (App Router).
Estou construindo um marketplace e preciso da funcionalidade completa de "Vender Produto" —
um wizard de cadastro dividido em etapas, com validação, feedback visual e pronto para
integrar com uma API REST.

### Contexto do projeto
- Framework: Next.js 14+ com App Router
- Estilização: <Tailwind CSS>
- Gerenciamento de estado: <Zustand | Context API | Redux Toolkit — escolha um>
- Formulários: React Hook Form + Zod para validação
- Upload de imagens: <Cloudinary | S3 presigned URL | outro — especifique>
- Autenticação: o usuário já está logado; o token JWT está disponível via <cookie | localStorage | contexto>

### O que precisa ser gerado

#### 1. Estrutura de arquivos
Crie os arquivos seguindo a convenção do App Router:
app/
  sell/
    page.tsx          ← rota principal /sell
    layout.tsx        ← layout da seção de venda (opcional)
components/
  sell/
    SellWizard.tsx    ← orquestra as etapas
    steps/
      Step1Info.tsx   ← informações básicas
      Step2Media.tsx  ← fotos e mídia
      Step3Details.tsx← detalhes e logística
      Step4Review.tsx ← revisão e publicação
    ui/
      StepIndicator.tsx
      PhotoUploader.tsx
      PriceInput.tsx

#### 2. Etapas do wizard

**Etapa 1 — Informações básicas**
Campos obrigatórios: título (min 10, max 120 chars), categoria (select hierárquico),
subcategoria, condição (Novo / Usado — como novo / Usado — bom estado / Com defeito),
preço (número, min R$ 1,00), quantidade em estoque (inteiro positivo).
Campo opcional: SKU interno.

**Etapa 2 — Fotos & Mídia**
Mínimo 1 foto, máximo 8. Drag-and-drop + clique para selecionar.
Preview em grid com reordenação (drag). Indicação de foto principal (primeira).
Validação: JPG/PNG/WEBP, máx 10 MB por arquivo.
Mostrar progresso de upload por arquivo.

**Etapa 3 — Detalhes & Logística**
Descrição longa (rich text simples ou textarea com contagem de chars, mín 20).
Atributos variantes (opcional): cor, tamanho, modelo — campos dinâmicos add/remove.
Dimensões e peso para cálculo de frete.
Opções de frete: Grátis / A combinar / Calcular por CEP (integrar com <ViaCEP | Correios API>).

**Etapa 4 — Revisão & Publicação**
Resumo completo de todos os campos preenchidos.
Botão "Editar" em cada seção que volta para a etapa correspondente.
Botão "Publicar" que faz o POST para a API e redireciona para /sell/success ou exibe erro inline.

#### 3. Validação
Use Zod para definir o schema de cada etapa. A validação deve ocorrer ao tentar
avançar para a próxima etapa. Erros devem aparecer inline abaixo de cada campo,
não em alertas globais.

#### 4. Persistência de rascunho
Salve o estado do formulário no localStorage a cada mudança de etapa, com chave
`marketplace_sell_draft`. Ao abrir /sell, verifique se existe rascunho e ofereça
a opção "Continuar de onde parei" ou "Começar novo anúncio".

#### 5. Acessibilidade
- Todos os inputs com label associada via htmlFor/id
- StepIndicator com aria-current="step" na etapa ativa
- Mensagens de erro com role="alert"
- Foco automático no primeiro campo ao entrar em cada etapa

#### 6. Integração com API
Ao publicar, faça um POST para `<SEU_ENDPOINT>/api/products` com o seguinte shape:
{
  title: string,
  categoryId: string,
  condition: "new" | "like_new" | "good" | "defective",
  price: number,         // em centavos
  stock: number,
  images: string[],      // URLs já uploadadas
  description: string,
  variants?: { name: string; values: string[] }[],
  shipping: { type: "free" | "negotiate" | "calculate"; weightKg?: number }
}
Trate os estados: loading (botão desabilitado + spinner), erro da API (mensagem inline),
sucesso (redirecionar para /sell/success?id=<productId>).

### Restrições e preferências
- Não use bibliotecas de UI prontas (MUI, Chakra, Shadcn) — componentes próprios apenas
- Código em TypeScript estrito (strict: true)
- Sem comentários óbvios no código; comente apenas lógica não trivial
- Cada componente em arquivo separado; máx ~150 linhas por arquivo
- Nenhum `any` explícito

### Entregáveis
Gere os arquivos na ordem: schemas Zod → tipos TypeScript → componentes de UI base →
componentes de etapa → SellWizard → page.tsx. Para cada arquivo, mostre o caminho
completo antes do bloco de código.
```

---

## Variações úteis

### Só quero refatorar uma etapa específica
```
Refatore o componente Step2Media.tsx do wizard de venda descrito acima.
Problema atual: <descreva o problema>.
Mantenha a interface TypeScript existente; não quebre os outros componentes.
```

### Quero adicionar uma nova funcionalidade
```
No wizard de venda (React/Next.js, React Hook Form + Zod), adicione <funcionalidade>.
O estado global do wizard está em SellWizard.tsx usando <Zustand | Context>.
Mostre apenas os arquivos que precisam ser criados ou modificados.
```

### Quero revisar o código gerado
```
Revise o código abaixo do componente <Nome> do meu marketplace.
Aponte: bugs, problemas de acessibilidade, performance (re-renders desnecessários),
e violações de TypeScript strict. Sugira melhorias com exemplos de código.

<cole o código aqui>
```

---

## Dicas de uso

1. **Seja específico sobre o endpoint**: substitua `<SEU_ENDPOINT>` antes de enviar —
   o agente vai gerar o fetch/axios com a URL correta.
2. **Uma etapa por vez**: se o contexto ficar grande, peça cada etapa separadamente
   usando a variação "Só quero refatorar uma etapa específica".
3. **Itere pelo `AGENTS.md`**: para sessões longas de geração de código, use o
   arquivo `AGENTS.md` junto com Claude Code para manter consistência entre sessões.
