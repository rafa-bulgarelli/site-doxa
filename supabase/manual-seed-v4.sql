-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — V4, pelo caminho real: rascunho da v3 → edição → publica.
--
-- Rode DEPOIS de `manual-seed-v3.sql`, UMA vez. Idempotente pelo número.
-- JÁ APLICADO no banco em 2026-08-17 (v3 arquivada, v4 publicada).
--
-- A mudança é UMA regra, e nasceu das fotos reais do card 006: quando o dono
-- bateu os rótulos olhando cada foto, a regra que explicava o conjunto inteiro
-- era outra — foto de clone é SENTADO, como quem grava, com a boca em posição
-- de fala, SEM sorriso congelado. O texto da v3 ("inclua fotos sorrindo com os
-- dentes quando pedido") contradizia os exemplos na mesma tela.
-- ─────────────────────────────────────────────────────────────────────────────

do $v4$
declare
  origem uuid;
  nova public.manual_versoes;
begin
  if exists (select 1 from public.manual_versoes where numero = 4) then
    raise notice 'versao 4 ja existe — nada a fazer';
    return;
  end if;

  select id into origem from public.manual_versoes where numero = 3;
  if origem is null then
    raise exception 'v3 nao existe';
  end if;

  nova := public.manual_criar_rascunho(origem, null);

  update public.manual_regras r
    set instrucao = 'Sentado, como quem grava: rosto inteiro visível, boca em posição de fala, luz uniforme, enquadramento próximo. Evite sombra forte, foto borrada, foto de pé ou sorriso congelado.',
        exemplo = 'Sente como se fosse gravar um vídeo, olhe para a câmera na altura dos olhos e fale — a foto certa parece um quadro de você conversando. De dia, de frente para a janela.'
    from public.manual_secoes s
    where r.secao_id = s.id and s.versao_id = nova.id and r.codigo = 'CL-1';

  perform public.manual_publicar_versao(nova.id);
end;
$v4$;

-- Conferir: select numero, status from public.manual_versoes order by numero;
--   → v1..v3 arquivadas · v4 publicada
