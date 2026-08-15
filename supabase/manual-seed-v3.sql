-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — V3, pelo caminho REAL: rascunho da v2 → edições → publica.
--
-- Rode DEPOIS de `manual-seed-v2.sql`, UMA vez. Idempotente pelo número.
-- Diferente dos seeds anteriores, este arquivo não recria o conteúdo: ele usa
-- `manual_criar_rascunho` — exatamente o que a área admin faria — e aplica as
-- DUAS mudanças que o dono pediu depois de ver a v2 na prévia:
--
--   1. voz: entra a dica do GRAVADOR DO CELULAR (VZ-3) — são 30 min a 2 h de
--      áudio no total; ninguém fala isso de uma vez, grava-se aos poucos.
--   2. garantia: o "Respire" (GA-9) vira narrativa do que PODE — primeiro o
--      único veto da semana, depois a liberdade, sem terror.
--
-- Convite novo nasce v3; quem já aceitou v1/v2 fica intacto.
-- ─────────────────────────────────────────────────────────────────────────────

do $v3$
declare
  origem uuid;
  nova public.manual_versoes;
  secao_voz uuid;
begin
  if exists (select 1 from public.manual_versoes where numero = 3) then
    raise notice 'versao 3 ja existe — nada a fazer';
    return;
  end if;

  select id into origem from public.manual_versoes where numero = 2;
  if origem is null then
    raise exception 'v2 nao existe — rode manual-seed-v2.sql antes';
  end if;

  nova := public.manual_criar_rascunho(origem, null);

  -- 1. A dica do gravador, na seção da voz.
  select id into secao_voz
    from public.manual_secoes where versao_id = nova.id and slug = 'voz';
  insert into public.manual_regras
      (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem)
    values (secao_voz, 'VZ-3', 'Use o gravador do seu celular — e grave aos poucos',
      'O material todo fica entre 30 minutos e 2 horas de áudio — ninguém fala isso de uma vez. Abra o gravador nativo do seu celular, grave um trecho, pare, respire, grave de novo. Vários arquivos curtos servem perfeitamente.',
      'Gravando em momentos diferentes, a sua voz chega com entonações e emoções variadas — e o clone aprende uma voz mais rica e natural. E para você é muito mais leve do que uma maratona.',
      'Grave 10 minutos hoje de manhã, mais 15 à tarde, mais um pouco amanhã. Junte os arquivos e envie todos — não precisa emendar nada.',
      'normal', false, 3);

  -- 2. O "Respire" sem terror: primeiro o único veto, depois a liberdade.
  update public.manual_regras r
    set titulo = 'Respire — o que você PODE fazer',
        instrucao = 'A única coisa vetada na semana é vídeo curto que não seja da DOXA. Fora isso, o perfil é seu: carrosséis, fotos e stories todos os dias — e no fim de semana, até vídeos curtos seus. E perder um dia sem publicar? Tudo bem: retome no dia seguinte e siga.',
        porque = 'A rotina tem folga de verdade — 60 vídeos em 90 dias deixam espaço para imprevistos. As regras protegem a janela dos vídeos, não tomam o seu perfil.',
        exemplo = 'Segunda a sexta: o vídeo da DOXA + os stories e carrosséis que você quiser. Sábado: seu vlog pessoal, à vontade. Perdeu a quarta? Publica quinta.'
    from public.manual_secoes s
    where r.secao_id = s.id and s.versao_id = nova.id and r.codigo = 'GA-9';

  perform public.manual_publicar_versao(nova.id);
end;
$v3$;

-- Conferir: select numero, status from public.manual_versoes order by numero;
--   → v1 arquivada · v2 arquivada · v3 publicada
