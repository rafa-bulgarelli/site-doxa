-- ─────────────────────────────────────────────────────────────────────────────
-- CENTRAL DE LEADS — o esquema inteiro, para colar no SQL Editor do Supabase.
--
-- Rode UMA VEZ, no projeto novo. É idempotente: rodar de novo não apaga lead
-- nenhum e não duplica política.
--
-- ─── A DECISÃO QUE ORGANIZA TUDO ─────────────────────────────────────────────
--
-- A chave anônima do Supabase é PÚBLICA: ela vai compilada dentro do JavaScript
-- que qualquer visitante baixa, e num site estático não existe onde escondê-la.
-- Então ela não pode poder LER.
--
--   INSERT  →  NINGUÉM      (só o endpoint, que usa a chave de servidor)
--   SELECT  →  autenticado  (a Central lê)
--   UPDATE  →  autenticado  (marcar como baixado)
--   DELETE  →  ninguém      (nem o time; lead não se apaga por engano)
--
-- Sem isso, a "senha do time" seria teatro: bastaria abrir o bundle do site,
-- copiar a chave e baixar a base inteira de nomes, telefones e e-mails.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),

  -- ── O contato. Obrigatório: é o que o formulário exige para fechar.
  nome text not null check (length(trim(nome)) between 2 and 120),
  whatsapp text not null check (length(whatsapp) between 10 and 20),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  arroba text,

  -- ── A porta de entrada e a pergunta de corte.
  caminho text not null check (caminho in ('empresa', 'agencia')),
  investimento text,
  desqualificado boolean not null default false,
  origem text not null default 'Formulário do site',

  -- ── A ficha opcional. Tudo anulável: ela é pedida DEPOIS do contato e é
  --    pulável inteira, então "não respondeu" é um estado legítimo e comum.
  segmento text,
  -- O que a pessoa quer que os vídeos façam. Entrou depois dos primeiros leads,
  -- então `null` aqui não é falha de preenchimento: é lead anterior à pergunta.
  objetivo text,
  faturamento text,
  trava text[],

  -- ── A impressão do IP, para o limite de rajada do endpoint.
  --
  -- HASH, nunca o IP. O endereço cru é dado pessoal e não tem por que existir
  -- aqui: o que o limite precisa é de um identificador estável, e um SHA-256
  -- com tempero do servidor entrega isso sem guardar quem é a pessoa. Não
  -- aparece no painel nem no CSV — é infraestrutura, não informação de lead.
  ip_hash text,

  -- ── O estado na Central. Um lead vira "baixado" quando sai num CSV.
  baixado boolean not null default false,
  baixado_em timestamptz,

  -- Coerência entre os dois: baixado sem data, ou data sem baixado, é estado
  -- impossível — e um estado impossível no banco vira bug na tela um dia.
  constraint baixado_coerente check (
    (baixado and baixado_em is not null) or (not baixado and baixado_em is null)
  )
);

-- ── ÍNDICES
-- A Central pede a lista ordenada por data, e filtra por aba e por origem. São
-- as três leituras que existem, e cada uma tem o seu.
create index if not exists leads_criado_em_idx on public.leads (criado_em desc);
create index if not exists leads_baixado_idx on public.leads (baixado, criado_em desc);
create index if not exists leads_origem_idx on public.leads (origem);
-- O limite por IP consulta por hash dentro de uma janela de minutos. Sem este
-- índice, cada envio de formulário varreria a tabela inteira.
create index if not exists leads_ip_hash_idx on public.leads (ip_hash, criado_em desc);

-- ── ROW LEVEL SECURITY
-- Sem esta linha, as políticas abaixo não valem NADA: o RLS desligado libera
-- tudo para quem tiver qualquer chave.
alter table public.leads enable row level security;

-- ── NENHUMA POLÍTICA DE INSERT. Não é esquecimento.
--
-- Existiu uma, `"anonimo grava"`, enquanto o formulário falava direto com o
-- PostgREST. Ela foi derrubada em 09/08/2026, quando o `/api/lead` entrou no ar
-- e as quatro camadas foram provadas em produção. O endpoint grava com a
-- `service_role`, que ignora RLS — e é por isso que ele não precisa de política.
--
-- RECRIAR ESTA POLÍTICA REABRE A PORTA e anula o anti-bot inteiro: a chave
-- pública está dentro do bundle que qualquer visitante baixa, e com um INSERT
-- liberado ela é um endpoint de escrita aberto ao mundo, sem armadilha, sem
-- tempo mínimo, sem limite por IP e sem Turnstile. Este arquivo é idempotente
-- de propósito, e a linha de `drop` foi retirada junto com a de `create`
-- justamente para que rodá-lo de novo NÃO desfaça o fechamento.
--
-- PROVADO no dia em que fechou: um POST direto no PostgREST com a chave pública
-- devolve 401 `new row violates row-level security policy`, e o mesmo lead pelo
-- `/api/lead` devolve 201.

-- O time lê tudo. Uma conta só, compartilhada — ver `CONTA_DO_TIME` no código.
drop policy if exists "time le" on public.leads;
create policy "time le"
  on public.leads for select
  to authenticated
  using (true);

-- O time marca como baixado. Só estas duas colunas mudam na prática, mas o
-- Postgres não sabe restringir UPDATE por coluna numa política — a garantia de
-- que nada mais é alterado está no cliente, e o risco é aceitável: quem tem a
-- senha do time é o time.
drop policy if exists "time marca" on public.leads;
create policy "time marca"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

-- Nenhuma política de DELETE, de propósito: ninguém apaga lead pelo painel. Se
-- um dia for preciso, que seja aqui no SQL Editor, com intenção.

-- ─────────────────────────────────────────────────────────────────────────────
-- PARA UM BANCO QUE JÁ EXISTE, o que muda é só isto (o resto acima é idempotente):
--
--   alter table public.leads add column if not exists ip_hash text;
--   create index if not exists leads_ip_hash_idx on public.leads (ip_hash, criado_em desc);
--   alter table public.leads add column if not exists objetivo text;
--
-- O `/api/lead` sobrevive a qualquer uma destas faltando: ele tira a coluna que
-- o banco não conhece e grava o resto. O lead nunca se perde por migração
-- atrasada — o que se perde é o campo, e só até a linha acima rodar.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- A PORTA JÁ ESTÁ FECHADA (09/08/2026). Se um dia alguém precisar conferir:
--
--   select policyname, roles, cmd from pg_policies where tablename = 'leads';
--
-- Tem de devolver DUAS linhas, ambas para `authenticated`: `time le` (select) e
-- `time marca` (update). Qualquer linha com `anon` significa que a porta foi
-- reaberta por engano.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, FALTAM DOIS PASSOS NO PAINEL DO SUPABASE:
--
-- 1. Authentication → Users → Add user
--    E-mail: equipe@doxaviral.com  (tem de bater com `CONTA_DO_TIME` no código)
--    Senha:  a senha do time. Marque "Auto Confirm User".
--
-- 2. Authentication → Providers → Email
--    DESLIGUE "Enable sign ups". Sem isso, qualquer pessoa cria a própria conta
--    com a chave pública e passa a ter permissão de LEITURA — a porta dos
--    fundos que anula todo o desenho acima.
-- ─────────────────────────────────────────────────────────────────────────────
