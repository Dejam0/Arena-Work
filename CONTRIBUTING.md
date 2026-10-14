# Contribuindo com o Alfinet Arena

Valeu pelo interesse! Este guia mostra como rodar o projeto e abrir um PR.

## Pré-requisitos

- Node.js 22+
- [Supabase CLI](https://supabase.com/docs/guides/cli) e Docker (para o banco local)

## Setup

```bash
git clone https://github.com/JhonathanCosta-Dev/Arena-Work.git
cd Arena-Work
npm ci
cp .env.example .env.local
supabase start          # sobe o Supabase local e aplica as migrations de supabase/migrations
```

Preencha o `.env.local` com a URL e as chaves que o `supabase start` imprimir.

Para popular o banco local com dados de exemplo:

```bash
SEED_CONFIRM=DEVELOPMENT_ONLY npm run seed
```

> ⚠️ Use **sempre** um Supabase local ou um projeto seu de desenvolvimento. Nunca rode o seed nem
> migrations contra um banco de produção.

## Fluxo de trabalho

1. Procure uma issue (as marcadas com `good first issue` são boas para começar) ou abra uma nova
   descrevendo o que pretende fazer antes de mudanças grandes.
2. Faça um fork e crie uma branch a partir da `main`: `feat/descricao-curta` ou `fix/descricao-curta`.
3. Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):
   `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `test: ...`.
4. Antes de abrir o PR, rode:

   ```bash
   npm run verify   # lint + typecheck + testes + build

   ```

5. Abra o PR para a `main` preenchendo o template. A CI precisa passar.

## Banco de dados

- Toda mudança de schema entra como **nova migration** em `supabase/migrations/` — nunca edite uma
  migration já existente.
- Toda tabela nova precisa de **RLS habilitado** e policies explícitas.
- A chave `service_role` só pode ser usada no servidor (`import 'server-only'`).

## Segurança

Encontrou uma vulnerabilidade? **Não abra issue pública** — veja o [SECURITY.md](SECURITY.md).

## Conduta

Ao participar você concorda com o [Código de Conduta](CODE_OF_CONDUCT.md).
