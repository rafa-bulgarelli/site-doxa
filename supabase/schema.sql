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
--   INSERT  →  anônimo      (o formulário do site grava)
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
  faturamento text,
  trava text[],

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

-- ── ROW LEVEL SECURITY
-- Sem esta linha, as políticas abaixo não valem NADA: o RLS desligado libera
-- tudo para quem tiver qualquer chave.
alter table public.leads enable row level security;

-- O formulário do site grava, e só isso.
drop policy if exists "anonimo grava" on public.leads;
create policy "anonimo grava"
  on public.leads for insert
  to anon
  with check (true);

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
-- DEPOIS DE RODAR ISTO, FALTAM DOIS PASSOS NO PAINEL DO SUPABASE:
--
-- 1. Authentication → Users → Add user
--    E-mail: equipe@doxavira.com   (tem de bater com `CONTA_DO_TIME` no código)
--    Senha:  a senha do time. Marque "Auto Confirm User".
--
-- 2. Authentication → Providers → Email
--    DESLIGUE "Enable sign ups". Sem isso, qualquer pessoa cria a própria conta
--    com a chave pública e passa a ter permissão de LEITURA — a porta dos
--    fundos que anula todo o desenho acima.
-- ─────────────────────────────────────────────────────────────────────────────
