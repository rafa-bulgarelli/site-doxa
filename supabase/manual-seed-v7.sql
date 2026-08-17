-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — V7, pelo caminho real: rascunho da v6 → edição → publica.
--
-- Rode DEPOIS de `manual-seed-v6.sql`, UMA vez. Idempotente pelo número.
-- NÃO APLICADO ainda: este arquivo é o entregável do card 009, e quem o roda no
-- SQL Editor é a sessão principal, DEPOIS do gate de copy do dono.
--
-- ─── POR QUE UMA V7 ──────────────────────────────────────────────────────────
--
-- Veredito do dono: preencher os links das redes sociais é o PRIMEIRO passo do
-- onboarding, não o último. Hoje o cliente lê os três cartões de resposta, vê os
-- prints do Doxa Scan e só no fim descobre que existiam três campos de perfil
-- para preencher com cuidado — e link errado ali manda os vídeos dele para o
-- lugar errado, ou para lugar nenhum.
--
-- A v7 acrescenta UMA regra informativa, `ON-0`, na frente das outras duas do
-- capítulo do onboarding. É só isso: nenhuma regra é alterada, nenhuma é
-- apagada, nada muda em outra seção.
--
-- ─── POR QUE ISSO REORDENA A TELA SEM UMA LINHA DE CÓDIGO ────────────────────
--
-- O capítulo do onboarding não tem obrigatória nenhuma, então cada regra vira
-- uma tela de "Passo X de Y", na ordem do campo `ordem`. E cada print da
-- plataforma entra na tela SEGUINTE à do cartão que ele prova, pelo `codigo` da
-- regra âncora (`src/manual/publico/prints.ts`). Com a `ON-0` no lugar 0 e o
-- print das redes reancorado nela, o capítulo passa a ser:
--
--   intro · ON-0 (Passo 1 de 3) · print das redes · ON-1 (Passo 2 de 3) ·
--   print do Scan · print do negócio · print da autoridade · ON-2 (Passo 3 de 3)
--
-- Quem tem convite ABERTO preso à v6 continua lendo a v6 — lá não existe
-- `ON-0`, o print das redes fica sem âncora viva e cai no fim do capítulo, que
-- é exatamente onde ele está hoje. Nada quebra nos dois mundos, e é por isso que
-- a legenda nova do print fala do que o cliente FAZ na plataforma (preencher os
-- perfis logo no começo) e não de em que tela do manual ela aparece.
--
-- O que este arquivo NÃO faz, de propósito:
--
--   · **Não toca no aceite.** `ON-0` é `obrigatoria = false`: ela não vira
--     checkbox, não entra em `manual_concluir` e não muda o comprovante.
--   · **Não renumera ON-1 e ON-2.** Elas estão em 1 e 2 desde a v2 (as ordens em
--     dezenas da v5 foram SÓ na garantia), então o lugar 0 estava livre —
--     mexer em regra que já existe custaria risco por zero benefício.
--   · **Não mexe em outra seção.** Voz, clone, garantia e termos saem do
--     rascunho idênticos aos da v6.
-- ─────────────────────────────────────────────────────────────────────────────

do $v7$
declare
  origem uuid;
  nova public.manual_versoes;
  secao_onboarding uuid;
  ocupada integer;
begin
  if exists (select 1 from public.manual_versoes where numero = 7) then
    raise notice 'versao 7 ja existe — nada a fazer';
    return;
  end if;

  select id into origem from public.manual_versoes where numero = 6;
  if origem is null then
    raise exception 'v6 nao existe — rode manual-seed-v6.sql antes';
  end if;

  nova := public.manual_criar_rascunho(origem, null);

  select id into secao_onboarding
    from public.manual_secoes where versao_id = nova.id and slug = 'onboarding';
  if secao_onboarding is null then
    raise exception 'a v6 nao tem a secao onboarding';
  end if;

  -- A ordem 0 precisa estar VAGA: se um seed futuro puser outra regra ali, duas
  -- regras empatadas em `ordem` deixariam a ordem das telas por conta do banco
  -- — e o cliente leria o capítulo embaralhado, sem ninguém perceber.
  select count(*) into ocupada
    from public.manual_regras where secao_id = secao_onboarding and ordem = 0;
  if ocupada <> 0 then
    raise exception 'a ordem 0 do onboarding ja esta ocupada por % regra(s)', ocupada;
  end if;

  -- ── AS REDES SOCIAIS ABREM O CAPÍTULO ─────────────────────────────────────
  insert into public.manual_regras
      (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem)
    values (secao_onboarding, 'ON-0', 'Comece pelos perfis de redes sociais',
      'Logo no começo do onboarding, preencha os links dos seus três perfis — Instagram, TikTok e YouTube — e confira letra por letra antes de confirmar.',
      'São esses links que a rotina de publicação usa. Um caractere errado manda os seus vídeos para o lugar errado — ou para lugar nenhum.',
      'Abra o app da rede, toque no seu perfil, copie o link e cole no campo — sem digitar à mão.',
      'normal', false, 0);

  perform public.manual_publicar_versao(nova.id);
end;
$v7$;

-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, confira:
--
--   select numero, status from public.manual_versoes order by numero;
--     -- v1..v6 arquivadas · v7 publicada
--
--   select r.codigo, r.ordem, r.obrigatoria
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id
--    where v.numero = 7 and s.slug = 'onboarding' order by r.ordem;
--     -- ON-0 (0, false) · ON-1 (1, false) · ON-2 (2, false) — e NENHUM empate
--     -- de `ordem`, que é o que decide a ordem das telas.
--
--   select count(*) filter (where r.obrigatoria) as aceites, count(*) as total
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id where v.numero = 7;
--     -- 8 aceites (os MESMOS de sempre) · 26 no total (os 25 da v6 mais a ON-0)
--
-- E na tela, com um convite NOVO (v7): o capítulo 1 abre em "Passo 1 de 3 —
-- Comece pelos perfis de redes sociais", e o print das redes é a tela logo
-- depois dele.
-- ─────────────────────────────────────────────────────────────────────────────
