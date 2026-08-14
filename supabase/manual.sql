-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — o esquema inteiro, para colar no SQL Editor do Supabase.
--
-- Rode UMA VEZ, no projeto que já tem a Central de leads (`schema.sql`). É
-- idempotente: rodar de novo não apaga aceite nenhum e não duplica política.
--
-- ─── A DECISÃO QUE ORGANIZA TUDO ─────────────────────────────────────────────
--
-- Este esquema guarda PROVA: que um cliente recebeu, leu e aceitou as regras da
-- garantia. Prova que pode ser alterada não é prova — então a imutabilidade
-- mora AQUI, em trigger, e não na boa vontade da interface. Nem a service_role
-- reescreve um aceite: trigger não é RLS, ninguém passa por cima.
--
-- O desenho de acesso é o mesmo da Central, e pelo mesmo motivo:
--
--   ESCRITA  →  ninguém        (só a API em `api/manual/*`, com a service_role)
--   LEITURA  →  autenticado    (a conta única do time — a área admin lê direto)
--   anon     →  NADA           (o cliente nunca fala com o banco: fala com a API,
--                               e o token do convite é a credencial dele)
--
-- O token do convite NUNCA existe aqui dentro — só o SHA-256 dele. Quem vazar
-- este banco não consegue abrir convite nenhum.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── PERFIS DA EQUIPE
-- Hoje existe UMA conta (ver `CONTA_DO_TIME` no código) e ela é admin. A tabela
-- existe para o dia em que houver mais gente: papel decide o que a API deixa
-- fazer ('admin' publica versão; 'cx' cria e revoga convite).
create table if not exists public.manual_perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null check (length(trim(nome)) between 2 and 120),
  papel text not null check (papel in ('admin', 'cx')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ── VERSÕES DO MANUAL
-- Um convite aponta para UMA versão, para sempre. O que o cliente aceitou é o
-- que estava publicado no dia — atualização de manual vale só para convite novo.
create table if not exists public.manual_versoes (
  id uuid primary key default gen_random_uuid(),
  numero int not null unique check (numero > 0),
  titulo text not null check (length(trim(titulo)) between 2 and 200),
  -- A declaração final que o cliente confirma, versionada junto com as regras:
  -- mudar o texto da declaração É mudar o manual.
  declaracao text not null check (length(declaracao) between 50 and 4000),
  status text not null default 'rascunho' check (status in ('rascunho', 'publicada', 'arquivada')),
  -- SHA-256 do conteúdo canônico (ver `manual_hash_versao`), carimbado na
  -- publicação. É o que o PDF imprime e o que prova que nada mudou depois.
  hash_conteudo text check (hash_conteudo is null or length(hash_conteudo) = 64),
  criado_por uuid references public.manual_perfis (id) on delete set null,
  criado_em timestamptz not null default now(),
  publicado_em timestamptz,
  constraint publicacao_coerente check (
    (status = 'rascunho' and publicado_em is null and hash_conteudo is null)
    or (status <> 'rascunho' and publicado_em is not null and hash_conteudo is not null)
  )
);

-- Só UMA versão vigente para convites novos. O índice é a regra, não a UI.
create unique index if not exists manual_versoes_vigente_idx
  on public.manual_versoes (status) where (status = 'publicada');

-- ── SEÇÕES
create table if not exists public.manual_secoes (
  id uuid primary key default gen_random_uuid(),
  versao_id uuid not null references public.manual_versoes (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  titulo text not null check (length(trim(titulo)) between 2 and 200),
  -- O parágrafo de abertura da seção — o contexto antes da primeira regra.
  descricao text not null default '' check (length(descricao) <= 4000),
  ordem int not null check (ordem >= 0),
  criado_em timestamptz not null default now(),
  unique (versao_id, slug)
);
create index if not exists manual_secoes_versao_idx
  on public.manual_secoes (versao_id, ordem);

-- ── REGRAS
-- Cada regra é a unidade do aceite: título, a regra em linguagem clara, POR QUE
-- ela existe e um exemplo prático. O checkbox do cliente marca ISTO.
create table if not exists public.manual_regras (
  id uuid primary key default gen_random_uuid(),
  secao_id uuid not null references public.manual_secoes (id) on delete cascade,
  codigo text not null check (codigo ~ '^[A-Z0-9]+(-[A-Z0-9]+)*$' and length(codigo) <= 20),
  titulo text not null check (length(trim(titulo)) between 2 and 200),
  instrucao text not null check (length(instrucao) between 2 and 4000),
  porque text not null default '' check (length(porque) <= 4000),
  exemplo text not null default '' check (length(exemplo) <= 4000),
  -- 'critica' = descumprir pode invalidar a garantia. A UI dá o destaque; o PDF
  -- imprime a marca. 'normal' é orientação operacional.
  severidade text not null default 'normal' check (severidade in ('normal', 'critica')),
  -- Regra não-obrigatória existe para texto informativo que não pede checkbox.
  obrigatoria boolean not null default true,
  ordem int not null check (ordem >= 0),
  criado_em timestamptz not null default now(),
  unique (secao_id, codigo)
);
create index if not exists manual_regras_secao_idx
  on public.manual_regras (secao_id, ordem);

-- ── CONVITES
-- O link que o CX manda por WhatsApp. O token vive só no link; aqui fica o hash.
create table if not exists public.manual_convites (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (length(token_hash) = 64),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and length(email) <= 160),
  empresa text not null check (length(trim(empresa)) between 2 and 160),
  -- Preenchido pelo CX quando já se sabe quem assina; senão o cliente informa
  -- no fluxo e o nome vai direto para o aceite, nunca de volta para cá.
  nome_cliente text check (nome_cliente is null or length(trim(nome_cliente)) between 2 and 160),
  versao_id uuid not null references public.manual_versoes (id) on delete restrict,
  status text not null default 'pendente' check (status in ('pendente', 'aberto', 'concluido', 'revogado')),
  -- Expirado é DERIVADO (expira_em < now() com status pendente/aberto), nunca
  -- um status gravado: um job para marcar expirados seria uma peça a mais para
  -- falhar, e a comparação com o relógio não falha.
  expira_em timestamptz,
  criado_por uuid references public.manual_perfis (id) on delete set null,
  criado_em timestamptz not null default now(),
  aberto_em timestamptz,
  concluido_em timestamptz,
  revogado_em timestamptz,
  -- Regenerar = revogar este e criar outro apontando para cá. O histórico da
  -- cadeia fica no banco, não na memória do CX.
  regenerado_de uuid references public.manual_convites (id) on delete set null,
  constraint concluido_coerente check ((status = 'concluido') = (concluido_em is not null)),
  constraint revogado_coerente check ((status = 'revogado') = (revogado_em is not null)),
  constraint aberto_coerente check (status not in ('aberto', 'concluido') or aberto_em is not null)
);
create index if not exists manual_convites_status_idx
  on public.manual_convites (status, criado_em desc);
create index if not exists manual_convites_versao_idx
  on public.manual_convites (versao_id);
create index if not exists manual_convites_regenerado_idx
  on public.manual_convites (regenerado_de);

-- ── PROGRESSO PARCIAL
-- Onde o cliente parou, para retomar pelo mesmo link. NÃO é aceite: a conclusão
-- refaz a conferência inteira no servidor e ignora o que estiver aqui.
create table if not exists public.manual_progresso (
  convite_id uuid primary key references public.manual_convites (id) on delete cascade,
  secao_ordem int not null default 0 check (secao_ordem >= 0),
  regras_marcadas uuid[] not null default '{}',
  nome_informado text check (nome_informado is null or length(trim(nome_informado)) between 2 and 160),
  atualizado_em timestamptz not null default now()
);

-- ── ACEITES
-- A prova. Uma linha por convite — o `unique` é a idempotência: dois cliques no
-- botão de concluir disputam a mesma linha e o segundo encontra a do primeiro.
create table if not exists public.manual_aceites (
  id uuid primary key default gen_random_uuid(),
  convite_id uuid not null unique references public.manual_convites (id) on delete restrict,
  versao_id uuid not null references public.manual_versoes (id) on delete restrict,
  -- Snapshots. O convite pode um dia ser corrigido; o que valeu no aceite é o
  -- que estava na tela na hora, e mora aqui para sempre.
  nome text not null check (length(trim(nome)) between 2 and 160),
  empresa text not null,
  email text not null,
  declaracao text not null,
  aceito_em timestamptz not null default now(),
  -- IP e navegador: auditoria do aceite, e SÓ isso. Nunca aparecem para o
  -- cliente nem viram insumo de marketing — ver a política de privacidade.
  ip text check (ip is null or length(ip) <= 64),
  user_agent text check (user_agent is null or length(user_agent) <= 400),
  conteudo_sha256 text not null check (length(conteudo_sha256) = 64),
  -- Preenchidos DEPOIS, quando o PDF sobe para o bucket. O trigger só deixa
  -- este par sair de null para valor — nunca mudar de novo.
  pdf_caminho text check (pdf_caminho is null or length(pdf_caminho) <= 300),
  pdf_sha256 text check (pdf_sha256 is null or length(pdf_sha256) = 64),
  criado_em timestamptz not null default now()
);
create index if not exists manual_aceites_versao_idx
  on public.manual_aceites (versao_id);

-- ── ITENS DO ACEITE
-- Uma linha por regra obrigatória, com o TEXTO da regra congelado. O PDF é
-- gerado daqui, nunca da tabela viva de regras.
create table if not exists public.manual_aceite_itens (
  id uuid primary key default gen_random_uuid(),
  aceite_id uuid not null references public.manual_aceites (id) on delete restrict,
  regra_id uuid not null references public.manual_regras (id) on delete restrict,
  codigo text not null,
  titulo text not null,
  instrucao text not null,
  porque text not null,
  exemplo text not null,
  severidade text not null,
  aceito_em timestamptz not null default now(),
  unique (aceite_id, regra_id)
);
create index if not exists manual_aceite_itens_regra_idx
  on public.manual_aceite_itens (regra_id);
create index if not exists manual_aceite_itens_aceite_idx
  on public.manual_aceite_itens (aceite_id);

-- ── EVENTOS
-- A linha do tempo de cada convite: criado, aberto, progresso, revogado,
-- concluído, PDF gerado, PDF baixado, exportação. Só entra, nunca sai.
create table if not exists public.manual_eventos (
  id uuid primary key default gen_random_uuid(),
  convite_id uuid references public.manual_convites (id) on delete cascade,
  ator text not null check (ator in ('cliente', 'equipe', 'sistema')),
  ator_id text check (ator_id is null or length(ator_id) <= 160),
  tipo text not null check (length(tipo) between 2 and 60),
  detalhes jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);
create index if not exists manual_eventos_convite_idx
  on public.manual_eventos (convite_id, criado_em desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- IMUTABILIDADE — trigger, porque trigger vale até para a service_role.
-- ─────────────────────────────────────────────────────────────────────────────

-- Versão publicada não se edita; se quer mudar, duplica como rascunho e publica
-- outra. A única transição permitida é publicada → arquivada (quando a próxima
-- entra no lugar), com todo o resto da linha intacto.
create or replace function public.manual_travar_versao()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.status <> 'rascunho' then
      raise exception 'versao % nao e rascunho — versao publicada nao se apaga', old.numero;
    end if;
    return old;
  end if;
  if old.status = 'rascunho' then
    return new;
  end if;
  if old.status = 'publicada' and new.status = 'arquivada'
    and new.numero = old.numero and new.titulo = old.titulo
    and new.declaracao = old.declaracao and new.hash_conteudo = old.hash_conteudo
    and new.publicado_em = old.publicado_em then
    return new;
  end if;
  raise exception 'versao % esta % — conteudo publicado e imutavel', old.numero, old.status;
end;
$$;

drop trigger if exists manual_travar_versao on public.manual_versoes;
create trigger manual_travar_versao
  before update or delete on public.manual_versoes
  for each row execute function public.manual_travar_versao();

-- Seção e regra só mudam enquanto a versão-mãe é rascunho.
create or replace function public.manual_travar_conteudo()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  alvo_versao uuid;
  situacao text;
begin
  if tg_table_name = 'manual_secoes' then
    alvo_versao := coalesce(new.versao_id, old.versao_id);
  else
    select s.versao_id into alvo_versao
      from public.manual_secoes s
      where s.id = coalesce(new.secao_id, old.secao_id);
  end if;
  select v.status into situacao from public.manual_versoes v where v.id = alvo_versao;
  if situacao is distinct from 'rascunho' then
    raise exception 'a versao desta % esta % — so rascunho se edita', tg_table_name, coalesce(situacao, 'ausente');
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists manual_travar_conteudo on public.manual_secoes;
create trigger manual_travar_conteudo
  before insert or update or delete on public.manual_secoes
  for each row execute function public.manual_travar_conteudo();

drop trigger if exists manual_travar_conteudo on public.manual_regras;
create trigger manual_travar_conteudo
  before insert or update or delete on public.manual_regras
  for each row execute function public.manual_travar_conteudo();

-- Aceite não se apaga e não se reescreve. A única mudança que existe é o par
-- do PDF saindo de null para valor, uma vez — o upload acontece depois do
-- INSERT, e se falhar, a retentativa preenche.
create or replace function public.manual_travar_aceite()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'aceite e prova — nao se apaga';
  end if;
  if new.id = old.id and new.convite_id = old.convite_id and new.versao_id = old.versao_id
    and new.nome = old.nome and new.empresa = old.empresa and new.email = old.email
    and new.declaracao = old.declaracao and new.aceito_em = old.aceito_em
    and new.ip is not distinct from old.ip and new.user_agent is not distinct from old.user_agent
    and new.conteudo_sha256 = old.conteudo_sha256 and new.criado_em = old.criado_em
    and (old.pdf_caminho is null or new.pdf_caminho = old.pdf_caminho)
    and (old.pdf_sha256 is null or new.pdf_sha256 = old.pdf_sha256) then
    return new;
  end if;
  raise exception 'aceite e prova — so o par do pdf preenche, e uma vez';
end;
$$;

drop trigger if exists manual_travar_aceite on public.manual_aceites;
create trigger manual_travar_aceite
  before update or delete on public.manual_aceites
  for each row execute function public.manual_travar_aceite();

-- Item de aceite e evento: só entra.
create or replace function public.manual_so_entra()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% e registro de auditoria — nao se altera nem se apaga', tg_table_name;
end;
$$;

drop trigger if exists manual_so_entra on public.manual_aceite_itens;
create trigger manual_so_entra
  before update or delete on public.manual_aceite_itens
  for each row execute function public.manual_so_entra();

drop trigger if exists manual_so_entra on public.manual_eventos;
create trigger manual_so_entra
  before update or delete on public.manual_eventos
  for each row execute function public.manual_so_entra();

-- Convite não se apaga (revoga-se), e as colunas de identidade não mudam:
-- trocar o e-mail de um convite andando seria trocar QUEM está aceitando.
create or replace function public.manual_travar_convite()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'convite nao se apaga — revogue e o historico fica';
  end if;
  if new.token_hash <> old.token_hash or new.email <> old.email
    or new.empresa <> old.empresa or new.versao_id <> old.versao_id
    or new.criado_em <> old.criado_em
    or new.criado_por is distinct from old.criado_por
    or new.regenerado_de is distinct from old.regenerado_de then
    raise exception 'identidade do convite e imutavel — regenere um novo';
  end if;
  if old.status in ('concluido', 'revogado') and row(new.*) is distinct from row(old.*) then
    raise exception 'convite % nao muda mais', old.status;
  end if;
  return new;
end;
$$;

drop trigger if exists manual_travar_convite on public.manual_convites;
create trigger manual_travar_convite
  before update or delete on public.manual_convites
  for each row execute function public.manual_travar_convite();

-- ─────────────────────────────────────────────────────────────────────────────
-- FUNÇÕES — o que precisa ser atômico vive aqui, numa transação só.
-- Todas EXCLUSIVAS da service_role (revoke no fim): a API é o único chamador.
-- ─────────────────────────────────────────────────────────────────────────────

-- O hash canônico de uma versão: título, declaração e cada seção com as suas
-- regras, na ordem, separados por \x1f (um byte que não existe em texto digitado).
-- Publicação carimba; conclusão recalcula e grava o que mediu.
create or replace function public.manual_hash_versao(p_versao uuid)
returns text
language sql
stable
set search_path = ''
as $$
  select encode(extensions.digest(convert_to(
    v.titulo || chr(31) || v.declaracao || chr(31) ||
    coalesce((
      select string_agg(
        s.slug || chr(31) || s.titulo || chr(31) || s.descricao || chr(31) || coalesce((
          select string_agg(
            r.codigo || chr(31) || r.titulo || chr(31) || r.instrucao || chr(31) ||
            r.porque || chr(31) || r.exemplo || chr(31) || r.severidade || chr(31) ||
            r.obrigatoria::text,
            chr(30) order by r.ordem, r.codigo)
          from public.manual_regras r where r.secao_id = s.id), ''),
        chr(29) order by s.ordem, s.slug)
      from public.manual_secoes s where s.versao_id = p_versao), ''),
    'utf8'), 'sha256'), 'hex')
  from public.manual_versoes v where v.id = p_versao;
$$;

-- Publica um rascunho: carimba o hash, arquiva a vigente, assume o lugar.
create or replace function public.manual_publicar_versao(p_versao uuid)
returns public.manual_versoes
language plpgsql
set search_path = ''
as $$
declare
  alvo public.manual_versoes;
begin
  select * into alvo from public.manual_versoes where id = p_versao for update;
  if not found then
    raise exception 'versao inexistente';
  end if;
  if alvo.status <> 'rascunho' then
    raise exception 'versao % esta % — so rascunho se publica', alvo.numero, alvo.status;
  end if;
  if not exists (
    select 1 from public.manual_regras r
      join public.manual_secoes s on s.id = r.secao_id
      where s.versao_id = p_versao and r.obrigatoria
  ) then
    raise exception 'versao sem regra obrigatoria nao vira manual — nao ha o que aceitar';
  end if;

  update public.manual_versoes
    set status = 'arquivada'
    where status = 'publicada';

  update public.manual_versoes
    set status = 'publicada',
        publicado_em = now(),
        hash_conteudo = public.manual_hash_versao(p_versao)
    where id = p_versao
    returning * into alvo;
  return alvo;
end;
$$;

-- Duplica uma versão como rascunho novo — o único jeito de "editar" o que já
-- foi publicado.
create or replace function public.manual_criar_rascunho(p_origem uuid, p_autor uuid)
returns public.manual_versoes
language plpgsql
set search_path = ''
as $$
declare
  nova public.manual_versoes;
  secao record;
  nova_secao uuid;
begin
  insert into public.manual_versoes (numero, titulo, declaracao, status, criado_por)
    select coalesce((select max(numero) from public.manual_versoes), 0) + 1,
           v.titulo, v.declaracao, 'rascunho', p_autor
      from public.manual_versoes v where v.id = p_origem
    returning * into nova;
  if nova.id is null then
    raise exception 'versao de origem inexistente';
  end if;

  for secao in
    select * from public.manual_secoes where versao_id = p_origem order by ordem
  loop
    insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
      values (nova.id, secao.slug, secao.titulo, secao.descricao, secao.ordem)
      returning id into nova_secao;
    insert into public.manual_regras
        (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem)
      select nova_secao, r.codigo, r.titulo, r.instrucao, r.porque, r.exemplo,
             r.severidade, r.obrigatoria, r.ordem
        from public.manual_regras r where r.secao_id = secao.id;
  end loop;
  return nova;
end;
$$;

-- ── A CONCLUSÃO. Uma transação, um lock, uma verdade.
--
-- O navegador manda a lista de regras que marcou; esta função NÃO confia nela:
-- busca de novo as obrigatórias da versão do convite e exige que cada uma
-- esteja na lista. Faltou uma, nada acontece. O snapshot dos textos sai das
-- tabelas vivas AQUI DENTRO, na mesma transação — não existe janela entre
-- conferir e congelar.
--
-- Idempotente pelo lock + unique: o clique duplo espera o lock, encontra o
-- status 'concluido' e recebe o MESMO aceite de volta, com `ja_existia = true`.
create or replace function public.manual_concluir(
  p_convite uuid,
  p_nome text,
  p_regras uuid[],
  p_declaracao_confirmada boolean,
  p_ip text,
  p_user_agent text
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  convite public.manual_convites;
  versao public.manual_versoes;
  nome_final text;
  faltantes int;
  aceite public.manual_aceites;
begin
  select * into convite from public.manual_convites where id = p_convite for update;
  if not found then
    raise exception 'convite_inexistente';
  end if;

  if convite.status = 'concluido' then
    select * into aceite from public.manual_aceites where convite_id = convite.id;
    return jsonb_build_object('aceite_id', aceite.id, 'aceito_em', aceite.aceito_em,
      'conteudo_sha256', aceite.conteudo_sha256, 'ja_existia', true);
  end if;
  if convite.status = 'revogado' then
    raise exception 'convite_revogado';
  end if;
  if convite.expira_em is not null and convite.expira_em < now() then
    raise exception 'convite_expirado';
  end if;
  if not p_declaracao_confirmada then
    raise exception 'declaracao_nao_confirmada';
  end if;

  nome_final := coalesce(nullif(trim(convite.nome_cliente), ''), nullif(trim(p_nome), ''));
  if nome_final is null or length(nome_final) < 2 then
    raise exception 'nome_ausente';
  end if;

  select * into versao from public.manual_versoes where id = convite.versao_id;

  select count(*) into faltantes
    from public.manual_regras r
    join public.manual_secoes s on s.id = r.secao_id
    where s.versao_id = convite.versao_id
      and r.obrigatoria
      and not (r.id = any (coalesce(p_regras, '{}')));
  if faltantes > 0 then
    raise exception 'regras_faltando';
  end if;

  insert into public.manual_aceites
      (convite_id, versao_id, nome, empresa, email, declaracao,
       ip, user_agent, conteudo_sha256)
    values
      (convite.id, convite.versao_id, nome_final, convite.empresa, convite.email,
       versao.declaracao, p_ip, p_user_agent,
       public.manual_hash_versao(convite.versao_id))
    returning * into aceite;

  insert into public.manual_aceite_itens
      (aceite_id, regra_id, codigo, titulo, instrucao, porque, exemplo, severidade)
    select aceite.id, r.id, r.codigo, r.titulo, r.instrucao, r.porque, r.exemplo, r.severidade
      from public.manual_regras r
      join public.manual_secoes s on s.id = r.secao_id
      where s.versao_id = convite.versao_id and r.obrigatoria;

  update public.manual_convites
    set status = 'concluido',
        concluido_em = now(),
        aberto_em = coalesce(aberto_em, now())
    where id = convite.id;

  insert into public.manual_eventos (convite_id, ator, tipo, detalhes)
    values (convite.id, 'cliente', 'aceite_concluido',
            jsonb_build_object('aceite_id', aceite.id));

  return jsonb_build_object('aceite_id', aceite.id, 'aceito_em', aceite.aceito_em,
    'conteudo_sha256', aceite.conteudo_sha256, 'ja_existia', false);
end;
$$;

-- ── ROW LEVEL SECURITY
alter table public.manual_perfis enable row level security;
alter table public.manual_versoes enable row level security;
alter table public.manual_secoes enable row level security;
alter table public.manual_regras enable row level security;
alter table public.manual_convites enable row level security;
alter table public.manual_progresso enable row level security;
alter table public.manual_aceites enable row level security;
alter table public.manual_aceite_itens enable row level security;
alter table public.manual_eventos enable row level security;

-- O time LÊ tudo — a área admin consulta o PostgREST direto, como a Central.
-- NENHUMA política de escrita, em tabela nenhuma: quem escreve é a API com a
-- service_role, que não passa por aqui. E NENHUMA política para `anon`: a
-- chave pública não enxerga uma linha deste esquema.
do $$
declare
  tabela text;
begin
  foreach tabela in array array[
    'manual_perfis', 'manual_versoes', 'manual_secoes', 'manual_regras',
    'manual_convites', 'manual_progresso', 'manual_aceites',
    'manual_aceite_itens', 'manual_eventos'
  ] loop
    execute format('drop policy if exists "equipe le" on public.%I', tabela);
    execute format(
      'create policy "equipe le" on public.%I for select to authenticated using (true)',
      tabela);
  end loop;
end;
$$;

-- O time EDITA rascunho direto, como marca leads na Central — e o juiz do
-- estado é o TRIGGER, não a política: uma versão publicada recusa INSERT,
-- UPDATE e DELETE de seção e regra venha de quem vier. As políticas só dizem
-- QUEM pode tentar.
drop policy if exists "equipe cria rascunho" on public.manual_versoes;
create policy "equipe cria rascunho" on public.manual_versoes
  for insert to authenticated with check (status = 'rascunho');
drop policy if exists "equipe edita rascunho" on public.manual_versoes;
create policy "equipe edita rascunho" on public.manual_versoes
  for update to authenticated using (status = 'rascunho') with check (status = 'rascunho');
drop policy if exists "equipe apaga rascunho" on public.manual_versoes;
create policy "equipe apaga rascunho" on public.manual_versoes
  for delete to authenticated using (status = 'rascunho');
drop policy if exists "equipe edita conteudo" on public.manual_secoes;
create policy "equipe edita conteudo" on public.manual_secoes
  for all to authenticated using (true) with check (true);
drop policy if exists "equipe edita conteudo" on public.manual_regras;
create policy "equipe edita conteudo" on public.manual_regras
  for all to authenticated using (true) with check (true);

-- Copiar link e exportar CSV são eventos que a área admin registra direto; o
-- `with check` impede a equipe de forjar evento de cliente ou de sistema.
drop policy if exists "equipe registra evento" on public.manual_eventos;
create policy "equipe registra evento" on public.manual_eventos
  for insert to authenticated with check (ator = 'equipe');

-- As funções são da API, e de mais ninguém: um `authenticated` que chamasse
-- `manual_concluir` pelo PostgREST estaria concluindo convite sem passar pela
-- validação de token.
revoke execute on function public.manual_hash_versao(uuid) from public, anon, authenticated;
revoke execute on function public.manual_publicar_versao(uuid) from public, anon, authenticated;
revoke execute on function public.manual_criar_rascunho(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.manual_concluir(uuid, text, uuid[], boolean, text, text) from public, anon, authenticated;

-- ── O BUCKET DOS PDFs — privado. Sem política em storage.objects, nem o time
-- lê por URL direta: todo download sai da API como URL assinada de minutos.
insert into storage.buckets (id, name, public)
  values ('manual-pdfs', 'manual-pdfs', false)
  on conflict (id) do nothing;

-- ── O PERFIL DA CONTA DO TIME — a mesma de `CONTA_DO_TIME` no código.
insert into public.manual_perfis (id, nome, papel)
  select u.id, 'Equipe DOXA', 'admin'
    from auth.users u where u.email = 'equipe@doxaviral.com'
  on conflict (id) do update set papel = 'admin';

-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, confira:
--
--   select tablename, policyname, roles, cmd from pg_policies
--     where tablename like 'manual_%';
--
-- Toda linha é `authenticated` — NENHUMA pode ser `anon`. As de escrita são só
-- as seis do bloco de rascunho e a de evento da equipe; escrita em convite,
-- progresso, aceite e item não existe para papel nenhum: é a API, com a
-- service_role, ou ninguém.
-- ─────────────────────────────────────────────────────────────────────────────
