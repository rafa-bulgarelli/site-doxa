-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — V5, pelo caminho real: rascunho da v4 → edição → publica.
--
-- Rode DEPOIS de `manual-seed-v4.sql`, UMA vez. Idempotente pelo número.
-- NÃO APLICADO ainda: este arquivo é o entregável de conteúdo do card 007, e
-- quem o roda no SQL Editor é a sessão principal, DEPOIS do gate de copy.
--
-- ─── POR QUE UMA V5 ──────────────────────────────────────────────────────────
--
-- Duas mudanças, as duas vindas do mesmo veredito do dono ("uma coisa de cada
-- vez, e a copy dos capítulos 1 e 2 está horrível"):
--
--   1. COPY. `ON-1`, `ON-2` e `VZ-2` foram reescritas. O jargão de estúdio que
--      pedia o áudio "sem tratamento" sai do manual inteiro: não diz nada para
--      quem nunca gravou nada, e o que a regra quer é simplesmente "não passe o
--      áudio por aplicativo nenhum antes de enviar".
--
--   2. PARES TRAVA → DESTRAVA. A garantia continua com os MESMOS 8 aceites, na
--      mesma ordem relativa — nenhuma obrigatória nasce, morre ou muda de texto
--      aqui. O que entra são 8 informativas novas (`GA-1P`..`GA-8P`), cada uma
--      logo depois da regra que ela alivia: a tela mostra o par lado a lado (à
--      esquerda o que não pode, à direita o que continua podendo) e a
--      confirmação acontece ali, depois das DUAS metades.
--
--      As ordens da garantia viram dezenas (GA-n → n*10) só para abrir espaço
--      entre os pares; `GA-9`, o "Respire", vai para 95 e continua sendo a
--      ÚLTIMA regra do capítulo — é assim que a interface sabe que ele é o
--      interlúdio do fim, e não a destrava do GA-8.
--
--      As destravas são `obrigatoria = false` e `severidade = 'normal'`: elas
--      NÃO entram no aceite. `manual_concluir` só cobra e só congela o que é
--      `obrigatoria`, então a prova jurídica gravada é exatamente a de sempre.
--
-- Convite novo nasce v5; quem já aceitou v1..v4 fica intacto para sempre.
-- ─────────────────────────────────────────────────────────────────────────────

do $v5$
declare
  origem uuid;
  nova public.manual_versoes;
  secao_garantia uuid;
begin
  if exists (select 1 from public.manual_versoes where numero = 5) then
    raise notice 'versao 5 ja existe — nada a fazer';
    return;
  end if;

  select id into origem from public.manual_versoes where numero = 4;
  if origem is null then
    raise exception 'v4 nao existe — rode manual-seed-v4.sql antes';
  end if;

  nova := public.manual_criar_rascunho(origem, null);

  -- ── 1. O ONBOARDING, na voz de quem explica a empresa a um sócio novo ──────
  update public.manual_regras r
    set titulo = 'Suas respostas viram os seus vídeos',
        instrucao = 'Responda como se estivesse explicando a sua empresa para um sócio novo: o que você vende, para quem, e por que alguém escolhe você. Frases completas, com os detalhes que só quem está aí dentro sabe.',
        porque = 'A plataforma dá uma nota para cada resposta e diz o que faltou — e é desse texto que saem os temas e os roteiros dos seus vídeos. Resposta rasa vira vídeo genérico.',
        exemplo = 'Em vez de "empresários", escreva: "donos de clínicas odontológicas que já investem em marketing mas não aparecem em vídeo".'
    from public.manual_secoes s
    where r.secao_id = s.id and s.versao_id = nova.id and r.codigo = 'ON-1';

  update public.manual_regras r
    set titulo = 'Um canal, uma pessoa',
        instrucao = 'Escolha quem do seu time fala com a DOXA. Dúvida, aviso e problema passam por essa pessoa — e é para ela que a nossa equipe responde.',
        porque = 'Com um canal só, nada se perde no meio do caminho: a resposta chega rápido e todo mundo sabe o que já foi combinado.',
        exemplo = '"Quem fala com a DOXA é a Ana", decidido no primeiro dia.'
    from public.manual_secoes s
    where r.secao_id = s.id and s.versao_id = nova.id and r.codigo = 'ON-2';

  -- ── 2. A VOZ, sem jargão de estúdio ───────────────────────────────────────
  update public.manual_regras r
    set titulo = 'Fale natural',
        instrucao = 'Voz de conversa, ritmo normal, celular sempre à mesma distância. Nada de aplicativo de "melhorar áudio": a gravação vai do gravador direto para a plataforma.',
        porque = 'O clone reproduz o que ouve — gravação forçada vira voz forçada, e qualquer processamento apaga justamente o que ele precisa aprender.',
        exemplo = 'Leia como se explicasse para um cliente na sua frente: sem voz de locutor, sem pressa.'
    from public.manual_secoes s
    where r.secao_id = s.id and s.versao_id = nova.id and r.codigo = 'VZ-2';

  -- ── 3. A GARANTIA: espaço entre os itens, e o "Respire" no fim ─────────────
  select id into secao_garantia
    from public.manual_secoes where versao_id = nova.id and slug = 'garantia';
  if secao_garantia is null then
    raise exception 'a v4 nao tem a secao garantia';
  end if;

  update public.manual_regras r
    set ordem = case when r.codigo = 'GA-9' then 95 else r.ordem * 10 end
    where r.secao_id = secao_garantia;

  -- ── 4. AS OITO DESTRAVAS ───────────────────────────────────────────────────
  -- Cada uma diz o que a regra ao lado LIBERA. Nenhuma afirma nada que o manual
  -- já não afirme (GA-9 e os exemplos dos próprios itens): destrava é leitura da
  -- mesma regra pelo lado bom, não promessa nova.
  insert into public.manual_regras
      (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem)
    values
    (secao_garantia, 'GA-1P', 'A meta é nossa, não sua',
      'Quem persegue o milhão é a DOXA: tema, roteiro, voz, edição e capa saem daqui. Do seu lado, a tarefa é publicar o que chega.',
      'A garantia mede o resultado do conteúdo que nós produzimos — o que está no seu colo é a rotina, não o número.',
      'Não precisa acompanhar visualização todo dia: publique e siga o seu trabalho.',
      'normal', false, 15),
    (secao_garantia, 'GA-2P', 'Uns minutos por dia — baixar, publicar, seguir a vida',
      'O trabalho do dia é baixar o arquivo e publicar nas três redes. Não há roteiro para escrever, gravação para fazer nem edição para aprovar.',
      'São 60 vídeos em 90 dias, todos prontos: o que sobra para você é o gesto de publicar.',
      'Cinco minutos de manhã: abre o arquivo, sobe no Instagram, no TikTok e no Shorts, e pronto.',
      'normal', false, 25),
    (secao_garantia, 'GA-3P', 'Perdeu um dia? Publica no dia seguinte e segue',
      'Dia isolado sem publicar não invalida nada. Retome no dia seguinte, um vídeo por dia, sem dobrar para compensar.',
      'A rotina tem folga de verdade: 60 vídeos em 90 dias deixam espaço para imprevistos.',
      'Viajou na quarta? Publique na quinta normalmente.',
      'normal', false, 35),
    (secao_garantia, 'GA-4P', 'O perfil continua seu',
      'Stories, carrosséis e fotos, todo dia, à vontade — a regra da semana é só sobre vídeo curto. E no fim de semana até vídeo seu pode.',
      'O que a rotina protege é a janela de distribuição dos vídeos da estratégia; ela não toma o seu perfil.',
      'Segunda a sexta: o vídeo da DOXA mais os stories e carrosséis que você quiser. Sábado: seu vlog, à vontade.',
      'normal', false, 45),
    (secao_garantia, 'GA-5P', 'Zero trabalho de edição — o vídeo chega pronto',
      'Corte, legenda, música, capa, título e descrição já vêm decididos. Você não precisa abrir editor nenhum.',
      'Cada detalhe é escolhido pensando em desempenho — publicar como veio é o caminho mais curto, não uma amarra.',
      'Teve uma ideia para o vídeo? Manda para a equipe: ela entra na próxima leva, sem você mexer no arquivo.',
      'normal', false, 55),
    (secao_garantia, 'GA-6P', 'Você não paga para alcançar',
      'A conta do milhão é orgânica: nenhum centavo de mídia é necessário nos perfis da estratégia.',
      'Mídia paga atrapalharia a leitura isolada do desempenho — ela sai de cena pela metodologia, não por falta de verba.',
      'Google Ads e campanhas em perfis fora da estratégia continuam liberados.',
      'normal', false, 65),
    (secao_garantia, 'GA-7P', 'Engajamento de verdade pode — e ajuda',
      'Responder comentário, compartilhar no story, pedir para o time assistir de verdade: tudo isso pode. O que não entra é engajamento comprado.',
      'O que a garantia mede é atenção real; comprar número suja exatamente esse indicador — e as próprias redes punem.',
      'Responda os comentários dos seus vídeos: é engajamento real, e não custa nada.',
      'normal', false, 75),
    (secao_garantia, 'GA-8P', 'Perguntar nunca quebra a garantia',
      'Não existe pergunta que custe a garantia. Na dúvida sobre um post, um anúncio ou uma edição, manda no grupo antes de fazer.',
      'Perguntar é grátis; desfazer, às vezes, é impossível.',
      'Vai lançar uma campanha nova? Manda no grupo antes de subir.',
      'normal', false, 85);

  perform public.manual_publicar_versao(nova.id);
end;
$v5$;

-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, confira:
--
--   select numero, status from public.manual_versoes order by numero;
--     -- v1..v4 arquivadas · v5 publicada
--
--   select r.codigo, r.ordem, r.obrigatoria
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id
--    where v.numero = 5 and s.slug = 'garantia' order by r.ordem;
--     -- GA-1 (10) · GA-1P (15) · ... · GA-8 (80) · GA-8P (85) · GA-9 (95)
--
--   select count(*) filter (where r.obrigatoria) as aceites, count(*) as total
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id where v.numero = 5;
--     -- 8 aceites (os MESMOS de sempre) · 33 no total
-- ─────────────────────────────────────────────────────────────────────────────
