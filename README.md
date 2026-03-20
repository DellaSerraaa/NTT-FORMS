# NTT Forms (Next.js + Supabase + Vercel)

Projeto com Next.js (App Router), fluxo de lead mobile-first com animacoes e envio para Supabase.

## 1) Instalar dependencias

```bash
npm install
```

## 2) Configurar Supabase

1. Execute no SQL Editor do Supabase:
   `supabase/form_submissions.sql`
2. Configure `.env.local` com:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cckrhvxwapooohhzxhwj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<sua-chave-publishable-ou-anon>
```

## 3) Rodar local

```bash
npm run dev
```

## 4) Rodar testes unitarios

```bash
npm test
```

## 5) Deploy na Vercel

1. Suba para um repositorio Git.
2. Importe o repositorio na Vercel.
3. Adicione as variaveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
4. Faca o deploy.

## Estrutura

- `app/page.tsx`: pagina principal.
- `components/NTTLeadFlow.tsx`: UI e fluxo do formulario.
- `proxy.ts`: proxy global para refresh de sessao.
- `utils/supabase/config.ts`: validacao de variaveis de ambiente.
- `utils/supabase/clients/*`: clientes Supabase por contexto (browser/server/proxy).
- `utils/supabase/queries/*`: operacoes de dados por contexto.
- `utils/supabase/types.ts`: tipos de payload do Supabase.
- `utils/supabase/index.ts`: API central para imports.
- `supabase/form_submissions.sql`: tabela + policy de insert anonimo.
