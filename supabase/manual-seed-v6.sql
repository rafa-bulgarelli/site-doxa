-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — V6, pelo caminho real: rascunho da v5 → edição → publica.
--
-- Rode DEPOIS de `manual-seed-v5.sql`, UMA vez. Idempotente pelo número.
-- NÃO APLICADO ainda: este arquivo é o entregável do card 008, e quem o roda no
-- SQL Editor é a sessão principal, DEPOIS do gate de copy.
--
-- ─── POR QUE UMA V6 ──────────────────────────────────────────────────────────
--
-- A v5 criou oito informativas (`GA-1P`..`GA-8P`), uma colada em cada item da
-- garantia, para a tela do "par trava → destrava". O dono viu a tela pronta e
-- reprovou: cada item virou DUAS telas, e o capítulo dobrou de tamanho — o
-- contrário do "uma coisa de cada vez" que originou o redesenho inteiro.
--
-- A v6 desfaz só isso: **apaga as oito `GA-nP`** e devolve o capítulo ao que ele
-- era — um item por tela, a confirmação na tela do item, o `GA-9` ("Respire")
-- fechando. Nada mais muda.
--
-- O que este arquivo NÃO faz, de propósito:
--
--   · **Não insere regra nenhuma.** Nenhum `insert` em `manual_regras` aqui —
--     a v6 só tira.
--   · **Não mexe em texto nem em ordem das obrigatórias.** As ordens em dezenas
--     que a v5 criou (GA-1 em 10 … GA-8 em 80, GA-9 em 95) FICAM: renumerar não
--     muda uma linha da tela (quem ordena é o campo `ordem`, e a sequência
--     relativa é a mesma) e mexeria em oito regras que entram no aceite.
--   · **Não toca no aceite.** As `GA-nP` são `obrigatoria = false`: elas nunca
--     entraram em `manual_concluir` nem no conteúdo congelado. O comprovante que
--     sai da v6 é byte a byte o mesmo que sairia da v5.
--
-- Convite novo nasce v6; quem já aceitou v1..v5 fica intacto para sempre — e
-- quem tem um convite ABERTO da v5 continua lendo a v5, porque o convite fixa a
-- versão. É por isso que a interface também sabe lidar com as `GA-nP` no meio do
-- capítulo (elas simplesmente não viram tela): banco e tela chegam ao mesmo
-- resultado por caminhos independentes.
-- ─────────────────────────────────────────────────────────────────────────────

do $v6$
declare
  origem uuid;
  nova public.manual_versoes;
  secao_garantia uuid;
  apagadas integer;
begin
  if exists (select 1 from public.manual_versoes where numero = 6) then
    raise notice 'versao 6 ja existe — nada a fazer';
    return;
  end if;

  select id into origem from public.manual_versoes where numero = 5;
  if origem is null then
    raise exception 'v5 nao existe — rode manual-seed-v5.sql antes';
  end if;

  nova := public.manual_criar_rascunho(origem, null);

  select id into secao_garantia
    from public.manual_secoes where versao_id = nova.id and slug = 'garantia';
  if secao_garantia is null then
    raise exception 'a v5 nao tem a secao garantia';
  end if;

  -- ── AS OITO DESTRAVAS SAEM ────────────────────────────────────────────────
  -- Nomeadas uma a uma de propósito: apagar "toda informativa da garantia"
  -- levaria o `GA-9` junto, e o "Respire" é o fecho do capítulo.
  delete from public.manual_regras
    where secao_id = secao_garantia
      and codigo in (
        'GA-1P',  -- A meta é nossa, não sua
        'GA-2P',  -- Uns minutos por dia
        'GA-3P',  -- Perdeu um dia? Publica no dia seguinte
        'GA-4P',  -- O perfil continua seu
        'GA-5P',  -- Zero trabalho de edição
        'GA-6P',  -- Você não paga para alcançar
        'GA-7P',  -- Engajamento de verdade pode
        'GA-8P'   -- Perguntar nunca quebra a garantia
      );
  get diagnostics apagadas = row_count;
  if apagadas <> 8 then
    raise exception 'esperava apagar 8 destravas, apaguei %', apagadas;
  end if;

  perform public.manual_publicar_versao(nova.id);
end;
$v6$;

-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, confira:
--
--   select numero, status from public.manual_versoes order by numero;
--     -- v1..v5 arquivadas · v6 publicada
--
--   select r.codigo, r.ordem, r.obrigatoria
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id
--    where v.numero = 6 and s.slug = 'garantia' order by r.ordem;
--     -- GA-1 (10) · GA-2 (20) · ... · GA-8 (80) · GA-9 (95), e nenhuma GA-nP
--
--   select count(*) filter (where r.obrigatoria) as aceites, count(*) as total
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id where v.numero = 6;
--     -- 8 aceites (os MESMOS de sempre) · 25 no total (os 33 da v5 menos as 8)
-- ─────────────────────────────────────────────────────────────────────────────
