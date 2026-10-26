# Pipo Education

Plataforma onde professores do Ensino Fundamental e Médio criam assistentes virtuais de IA
personalizados para complementar os estudos dos alunos.

- **Professor**: entra com e-mail (link mágico), cria assistentes definindo matéria, série,
  instruções e modelo de IA (Claude Opus 5.5, Sonnet 5.5 ou Haiku 5.5).
- **Aluno**: entra só com o código de 6 letras da turma, sem cadastro, e conversa com o assistente.

## Rodar local

```bash
npm install
npm run dev
```

Sem `.env`, o app abre em **modo demo**: os assistentes ficam salvos no navegador e a IA é simulada.

## Ligar no Supabase

1. Crie um projeto em supabase.com.
2. Copie `.env.example` para `.env` e preencha URL e chave anon.
3. Rode a migration `supabase/migrations/20261026000000_inicial.sql` no SQL Editor.
4. Configure a chave da Anthropic e publique a função de chat:

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy chat
```

## Estrutura

- `src/pages` — telas (início, login, painel, editor, acesso e chat do aluno)
- `src/lib/dados.ts` — acesso a dados (Supabase ou modo demo)
- `supabase/migrations` — tabelas e regras de segurança (RLS)
- `supabase/functions/chat` — chama a IA com as regras de segurança para menores + instruções do professor
