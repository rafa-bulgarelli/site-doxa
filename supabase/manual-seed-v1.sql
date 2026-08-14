-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — SEED DA VERSÃO 1, para colar no SQL Editor do Supabase.
--
-- Rode DEPOIS de `manual.sql`, UMA vez. É idempotente pelo número: se a versão
-- 1 já existe, o bloco avisa e não faz nada — rodar de novo nunca duplica.
--
-- O conteúdo aqui é a seção 9 do prompt mestre (a fonte de verdade das regras,
-- em `.claude/tower/cards/004-manual-interativo-prompt-mestre.md`) vertida para
-- a linguagem que o cliente lê: direta, didática, sem juridiquês. Cada regra
-- diz O QUE fazer, POR QUE existe e COMO agir na prática — proibição sem porquê
-- assusta em vez de ensinar.
--
-- Duas decisões de tom, deliberadas:
--  · Nenhuma afirmação absoluta sobre algoritmo de rede social. Toda
--    justificativa é apresentada como parte da metodologia operacional da DOXA.
--  · `severidade = 'critica'` marca SÓ o que pode invalidar a garantia —
--    impulsionamento, alteração de vídeo, engajamento comprado, vídeo curto
--    indevido em dia útil, a rotina 60/90/3 e o intervalo de 24h. O resto é
--    orientação operacional, e o destaque visual precisa dessa diferença.
--
-- O INSERT nasce rascunho e o bloco termina em `manual_publicar_versao`, que
-- carimba o hash e assume a vigência — o mesmo caminho que a área admin usará
-- para as próximas versões. Nenhuma linha aqui contorna o fluxo real.
-- ─────────────────────────────────────────────────────────────────────────────

do $seed$
declare
  v_id uuid;
  s_id uuid;
begin
  if exists (select 1 from public.manual_versoes where numero = 1) then
    raise notice 'versao 1 ja existe — nada a fazer';
    return;
  end if;

  insert into public.manual_versoes (numero, titulo, declaracao, status)
    values (
      1,
      'Manual de Uso e Regras da Garantia da DOXA',
      'Declaro que li integralmente o Manual de Uso e Regras da Garantia da DOXA, compreendi todas as orientações, obrigações, permissões e proibições apresentadas e estou ciente de que o cumprimento integral dessas condições é necessário para a manutenção da garantia contratual. Confirmo que os dados informados são verdadeiros e que recebi acesso ao conteúdo completo da versão indicada neste registro.',
      'rascunho'
    )
    returning id into v_id;

  -- ── 1. BOAS-VINDAS ─────────────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'boas-vindas', 'Boas-vindas',
      'Você está entrando na estratégia da DOXA. Este manual existe para uma coisa: garantir que você saiba exatamente o que fazer — e o que não fazer — para que a garantia valha do primeiro ao último dia. São 21 seções curtas. Leia com calma; ao final, você confirma que leu e concorda, e recebe um comprovante em PDF.',
      1) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'BV-1', 'Leia antes de marcar',
      'Percorra as seções na ordem e marque cada caixa somente depois de entender a regra. Se alguma coisa não ficar clara, pergunte à equipe da DOXA antes de concluir.',
      'O aceite ao final registra que você leu e entendeu cada item. Marcar sem ler cria expectativa errada dos dois lados — e é você quem executa a maior parte da estratégia.',
      'Ficou em dúvida na regra das 24 horas? Pare, mande a pergunta no grupo com a equipe, e só depois marque a caixa e siga em frente.',
      'normal', true, 1);

  -- ── 2. COMO FUNCIONA A DOXA ────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'como-funciona-a-doxa', 'Como funciona a DOXA',
      'A DOXA produz os seus vídeos com tecnologia de clone e inteligência artificial: roteiro, voz, corte e estética saem prontos, desenhados para desempenho orgânico. A sua parte é publicar exatamente como recebeu, no ritmo combinado. O resultado vem da soma das duas partes — produção mais execução.',
      2) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'CF-1', 'Cada lado tem um papel',
      'A DOXA entrega os vídeos prontos; você publica seguindo as regras deste manual. Nenhum dos dois lados funciona sozinho.',
      'A metodologia foi desenhada como um sistema: o conteúdo certo, publicado do jeito certo, no ritmo certo. Quando a execução muda, a leitura do resultado deixa de ser confiável.',
      'Recebeu o vídeo? Baixe, publique nas três redes no mesmo dia e siga o cronograma. Não guarde para depois nem adiante vários de uma vez.',
      'normal', true, 1);

  -- ── 3. O QUE A DOXA ENTREGA ────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'o-que-a-doxa-entrega', 'O que a DOXA entrega',
      'Durante o período da estratégia, a DOXA entrega os vídeos curtos prontos para publicação — cada um único, com roteiro, voz clonada, edição e capa. Você recebe o arquivo final; não precisa editar, cortar ou ajustar nada. Aliás, não pode: o arquivo publicado deve ser exatamente o arquivo recebido.',
      3) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'ED-1', 'Confira o que recebeu',
      'Ao receber cada vídeo, baixe o arquivo e confira se abriu corretamente no seu celular. Qualquer problema com o arquivo, avise a equipe antes de publicar.',
      'Um arquivo corrompido ou baixado pela metade publicado assim mesmo vira um vídeo com defeito no seu perfil — e retrabalho para os dois lados.',
      'O vídeo chegou sem som no seu teste? Não publique. Mande mensagem no grupo e aguarde o arquivo correto.',
      'normal', true, 1);

  -- ── 4. COMO FUNCIONA A GARANTIA ────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'como-funciona-a-garantia', 'Como funciona a garantia',
      'A garantia da DOXA é de 1.000.000 de visualizações em 90 dias corridos, contados a partir da publicação do primeiro vídeo. Somam-se as visualizações de todos os vídeos publicados, nas três redes: Instagram, TikTok e YouTube Shorts. Se você cumprir integralmente todas as condições deste manual e a meta não for alcançada, existe estorno de 100% conforme as condições e o prazo do contrato.',
      4) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'GA-1', 'A meta e o período',
      'A garantia cobre 1.000.000 de visualizações somadas entre Instagram, TikTok e YouTube Shorts, de todos os vídeos publicados, em 90 dias corridos a partir do primeiro vídeo publicado.',
      'Meta, período e forma de contagem precisam estar claros desde o início — é contra esses números que o resultado será aferido ao final.',
      'Publicou o primeiro vídeo no dia 1º de março? O período de aferição vai até o final de maio, e toda visualização dos vídeos publicados nas três redes conta para a soma.',
      'critica', true, 1),
    (s_id, 'GA-2', 'A garantia tem condições',
      'A garantia vale enquanto todas as regras deste manual forem cumpridas integralmente. Este aplicativo não calcula visualizações nem decide sobre a garantia — ele comprova que você recebeu, leu e aceitou as regras.',
      'O estorno de 100% existe para quem executou a estratégia por completo. A aferição do resultado e a análise de cumprimento acontecem fora deste aplicativo, pelos canais do contrato.',
      'Ao final dos 90 dias, a apuração considera as visualizações somadas e o cumprimento das regras — por isso cada seção deste manual importa.',
      'critica', true, 2);

  -- ── 5. COMO PREENCHER O ONBOARDING ─────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'como-preencher-o-onboarding', 'Como preencher o onboarding',
      'O onboarding é a matéria-prima dos seus roteiros: é dali que a DOXA entende a sua empresa, a sua oferta, o seu público e o seu posicionamento. Quanto melhor o material de entrada, melhor o conteúdo que sai.',
      5) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'ON-1', 'Respostas completas e verdadeiras',
      'Responda às perguntas do onboarding de forma completa e verdadeira, com contexto suficiente sobre empresa, oferta, público e posicionamento. Evite respostas vagas ou de uma palavra. Envie as informações e os documentos solicitados.',
      'Os roteiros nascem das suas respostas. Resposta rasa vira conteúdo genérico — e conteúdo genérico não representa a sua empresa.',
      'Na pergunta sobre público, em vez de "empresários", escreva: "donos de clínicas odontológicas de médio porte, que já investem em marketing mas não aparecem em vídeo".',
      'normal', true, 1),
    (s_id, 'ON-2', 'Um responsável centraliza a comunicação',
      'Mantenha um responsável principal do seu lado para centralizar a comunicação com a equipe da DOXA e informe qualquer problema que possa afetar o projeto.',
      'Informação espalhada entre várias pessoas se perde e atrasa. Um canal único mantém decisões rápidas e rastreáveis.',
      'Defina desde o início: "quem fala com a DOXA é a Ana" — e toda dúvida, aviso ou material passa por ela.',
      'normal', true, 2);

  -- ── 6. COMO GRAVAR O ÁUDIO ─────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'como-gravar-o-audio', 'Como gravar o áudio',
      'A sua voz é a base do clone de voz. A gravação não precisa de estúdio — precisa de silêncio, naturalidade e constância. Siga o roteiro e a duração solicitados na plataforma principal.',
      6) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'AU-1', 'Ambiente silencioso',
      'Grave em ambiente silencioso: sem eco, sem música, sem ruído de fundo — nada de rua, ventilador, televisão ou outras vozes.',
      'O clone aprende com tudo que estiver no áudio. Ruído e eco entram no aprendizado e degradam a voz gerada em todos os vídeos.',
      'Grave num quarto fechado, longe da janela, com ar-condicionado e ventilador desligados. Um guarda-roupa aberto perto ajuda a matar o eco.',
      'normal', true, 1),
    (s_id, 'AU-2', 'Voz natural, ritmo normal',
      'Fale com a sua voz natural, em ritmo normal, com dicção clara, mantendo distância consistente do microfone do início ao fim.',
      'O clone reproduz o que ouve: se a gravação sai forçada ou irregular, a voz gerada soa forçada e irregular em todos os vídeos.',
      'Leia o roteiro como se explicasse para um cliente na sua frente — sem voz de locutor, sem pressa, sem sussurro, com o celular sempre à mesma distância da boca.',
      'normal', true, 2),
    (s_id, 'AU-3', 'Sem filtros nem efeitos',
      'Não use filtros, efeitos ou qualquer processamento na gravação. Envie o áudio cru, exatamente como saiu do aparelho.',
      'Processamento esconde as características reais da voz que o clone precisa aprender. A DOXA trata o áudio no ponto certo do processo.',
      'Grave no aplicativo de gravação padrão do celular e envie o arquivo original — sem passar por aplicativo de "melhorar áudio" antes.',
      'normal', true, 3);

  -- ── 7. COMO PRODUZIR AS FOTOS ──────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'como-produzir-as-fotos', 'Como produzir as fotos',
      'As fotos alimentam o clone visual. O que a tecnologia precisa é simples: ver o seu rosto com clareza, em boa luz, sem nada na frente.',
      7) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'FO-1', 'Nitidez e luz',
      'Envie fotos nítidas, em boa resolução, com iluminação uniforme e o rosto completamente visível. Evite sombras fortes e imagens borradas.',
      'O clone é construído a partir do que aparece nas fotos. Rosto mal iluminado ou borrado vira clone impreciso — e refazer custa tempo do projeto.',
      'Fotografe de dia, de frente para a janela (nunca de costas para ela), segurando o celular na altura dos olhos.',
      'normal', true, 1),
    (s_id, 'FO-2', 'Sem filtros, sem óculos escuros',
      'Não use filtros nem óculos escuros. A foto deve mostrar o seu rosto real, como ele é.',
      'Filtro altera exatamente os traços que a tecnologia precisa capturar. Óculos escuros escondem a região dos olhos, que é central para a semelhança.',
      'Tire as fotos direto na câmera do celular, sem modo retrato exagerado, sem suavização de pele, sem acessórios cobrindo o rosto.',
      'normal', true, 2),
    (s_id, 'FO-3', 'Enquadramento e expressão',
      'Prefira enquadramento próximo, fotos frontais e os ângulos solicitados, com expressão natural. Quando solicitado, inclua fotos sorrindo com os dentes visíveis. Em dúvida, envie antes ao grupo da equipe.',
      'Fotos sorrindo com dentes visíveis melhoram a reprodução da boca em fala — é um pedido técnico, não estético. E validar antes evita refação depois.',
      'Monte um conjunto: frontal séria, frontal sorrindo com dentes, leve perfil esquerdo e direito. Na dúvida sobre alguma, pergunte no grupo antes de enviar o lote.',
      'normal', true, 3);

  -- ── 8. COMO BAIXAR E PUBLICAR OS VÍDEOS ────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'como-baixar-e-publicar', 'Como baixar e publicar os vídeos',
      'A regra operacional inteira cabe em duas palavras: baixou, publicou. O arquivo que a DOXA entrega é o arquivo que vai ao ar — o mesmo, nas três redes, no mesmo dia.',
      8) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'BP-1', 'Baixou, publicou',
      'Baixe o arquivo no seu celular ou dispositivo e publique exatamente o arquivo recebido, preservando a qualidade. Use o MESMO vídeo nas três redes: Instagram, TikTok e YouTube Shorts.',
      'Cada vídeo é finalizado para desempenho do jeito que foi entregue. Republicar de outra fonte, reexportar ou converter degrada qualidade e altera o conteúdo — e conteúdo alterado sai da metodologia.',
      'Recebeu o vídeo 12? Baixe o arquivo original, abra o Instagram e publique; depois o TikTok, com o mesmo arquivo; depois o YouTube. Nada de baixar do Instagram para repostar no TikTok.',
      'critica', true, 1),
    (s_id, 'BP-2', 'As três redes no mesmo dia',
      'Publique cada vídeo nas três redes no mesmo dia, de forma simultânea ou tão próxima quanto for operacionalmente possível.',
      'A metodologia mede o desempenho do conteúdo nas três redes em paralelo. Publicações espalhadas em dias diferentes quebram essa leitura.',
      'Reserve um momento do dia para a publicação: sente, publique nas três redes em sequência, e pronto — o vídeo do dia está completo.',
      'critica', true, 2);

  -- ── 9. ROTINA DOS 60 VÍDEOS ────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'rotina-dos-60-videos', 'Rotina dos 60 vídeos',
      'Nos 90 dias do período, você publica no mínimo 60 vídeos — 60 conteúdos únicos, cada um nas três redes. O ritmo é de até um vídeo da DOXA por dia útil. Perder um dia isolado não invalida nada; o que importa é completar os 60 dentro dos 90 dias.',
      9) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'RT-1', 'Sessenta vídeos, três redes, noventa dias',
      'Publique no mínimo 60 conteúdos únicos durante os 90 dias, cada um deles nas três redes — Instagram, TikTok e YouTube Shorts — com o mesmo arquivo.',
      'A meta de visualizações é calculada sobre esse volume completo de publicação. Menos vídeos, ou vídeos fora de alguma rede, reduzem a soma e quebram a condição da garantia.',
      'Um vídeo publicado só no Instagram e no TikTok não conta como completo — falta o YouTube Shorts. Complete as três redes para cada um dos 60.',
      'critica', true, 1),
    (s_id, 'RT-2', 'No máximo um por dia útil',
      'Durante os dias úteis, publique no máximo um vídeo da DOXA por dia. Não compense dias perdidos publicando vários vídeos da DOXA no mesmo dia.',
      'Cada vídeo precisa da própria janela de distribuição. Dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance do outro — a compensação destrói justamente o que ela tenta recuperar.',
      'Ficou dois dias sem publicar? Siga do ponto em que parou, um vídeo por dia útil. Os 90 dias comportam os 60 vídeos com folga.',
      'critica', true, 2),
    (s_id, 'RT-3', 'Um dia perdido não é o fim',
      'Perder um dia isolado de publicação não invalida a garantia. A margem existe exatamente para isso — desde que os 60 vídeos sejam concluídos nas três plataformas dentro dos 90 dias.',
      'A rotina foi desenhada com folga real: 60 vídeos em 90 dias deixam espaço para imprevistos sem comprometer a estratégia.',
      'Viajou na quarta e não publicou? Retome na quinta normalmente. Não publique dois na quinta — apenas siga o ritmo.',
      'normal', true, 3);

  -- ── 10. REGRA DAS 24 HORAS ─────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'regra-das-24-horas', 'Regra das 24 horas',
      'Entre um vídeo da DOXA e o próximo, nos dias úteis, precisa existir um intervalo mínimo REAL de 24 horas — horas contadas no relógio, não datas no calendário.',
      10) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'RH-1', 'Vinte e quatro horas de relógio',
      'Respeite intervalo mínimo real de 24 horas entre os vídeos da DOXA nos dias úteis. Se um vídeo foi publicado segunda-feira às 22h, o próximo só pode ser publicado a partir das 22h de terça-feira. A regra NÃO é "um vídeo em cada data".',
      'A janela de 24 horas preserva a distribuição orgânica do vídeo anterior. Publicar cedo demais interrompe ou divide o alcance do conteúdo que ainda estava crescendo — é a metodologia protegendo o seu próprio resultado.',
      'Publicou segunda às 22h? Terça às 15h ainda NÃO pode — mesmo sendo outro dia no calendário. A partir das 22h de terça, pode.',
      'critica', true, 1);

  -- ── 11. DIAS ÚTEIS ─────────────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'dias-uteis', 'O que pode ser publicado durante a semana',
      'De segunda a sexta, os perfis participantes ficam reservados para a estratégia: o único vídeo curto do dia é o da DOXA. Todo o resto do seu conteúdo — foto, carrossel, story — continua liberado.',
      11) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'DU-1', 'Vídeo curto em dia útil, só da DOXA',
      'De segunda a sexta-feira, não publique Reels, TikToks, Shorts ou qualquer outro vídeo curto — seu ou de terceiros — nos perfis participantes. Os únicos vídeos curtos da semana são os da DOXA, respeitando o intervalo de 24 horas.',
      'Vídeos curtos disputam a mesma janela de distribuição. Um vídeo extra no meio da semana divide o alcance do vídeo da estratégia — e contamina a leitura do desempenho orgânico.',
      'Quer repostar um vídeo engraçado na quarta-feira? Não no perfil participante. Guarde para o sábado, ou publique em outro perfil que não esteja na estratégia.',
      'critica', true, 1),
    (s_id, 'DU-2', 'Foto, carrossel e story continuam livres',
      'Fotos, carrosséis, stories e qualquer conteúdo que não seja vídeo curto continuam liberados nos dias úteis, sem restrição de horário.',
      'A regra protege a janela dos vídeos curtos — os outros formatos não disputam essa janela, então seguem a sua rotina normal.',
      'Publicou o vídeo da DOXA às 12h? Pode postar carrossel às 14h, stories o dia todo e foto à noite. Só não pode outro vídeo curto.',
      'normal', true, 2);

  -- ── 12. FINAIS DE SEMANA ───────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'finais-de-semana', 'O que pode ser publicado no final de semana',
      'Sábado e domingo são seus. A restrição de vídeos curtos vale só para os dias úteis — no final de semana o perfil volta ao seu ritmo normal.',
      12) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'FS-1', 'Final de semana liberado',
      'Aos sábados e domingos você pode publicar vídeos curtos próprios, conteúdos de terceiros, stories, fotos e carrosséis. A liberação vale mesmo que o seu vídeo fique a menos de 24 horas de um vídeo da DOXA.',
      'A metodologia concentra a aferição do desempenho nos dias úteis. O final de semana fica livre para você manter a sua presença sem regras adicionais de horário.',
      'Publicou o vídeo da DOXA sexta às 18h? Sábado de manhã pode postar o seu Reel normalmente — a liberação do final de semana prevalece.',
      'normal', true, 1);

  -- ── 13. IMPULSIONAMENTO ────────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'impulsionamento', 'Impulsionamento, turbinamento e tráfego pago',
      'Nos perfis em que a estratégia da DOXA está ativa, não existe meio-termo: IMPULSIONAR, TURBINAR ou PROMOVER qualquer publicação é proibido durante todo o período — inclusive posts que não são da DOXA. Impulsionamentos e campanhas pagas interferem na leitura isolada do desempenho orgânico e podem alterar os sinais de distribuição do perfil. Google Ads e campanhas em outros perfis continuam permitidos.',
      13) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'IM-1', 'Não impulsione nada nos perfis participantes',
      'Não IMPULSIONE, não TURBINE e não PROMOVA nenhuma publicação dos perfis participantes durante o período — nem posts da DOXA, nem posts seus, nem conteúdo antigo.',
      'Para preservar a metodologia e permitir uma avaliação confiável da estratégia orgânica, os perfis participantes não podem receber nenhuma forma de mídia paga. Um único post impulsionado contamina a leitura do perfil inteiro — é uma condição central da metodologia.',
      'Bateu a vontade de turbinar aquele post antigo que foi bem? Não faça — é exatamente o tipo de ação que invalida a condição. Se precisar de mídia paga, use outro perfil.',
      'critica', true, 1),
    (s_id, 'IM-2', 'Pause as campanhas antigas antes de começar',
      'Pause toda campanha antiga ligada aos perfis participantes ANTES da primeira publicação, e não ative nenhuma campanha nova nesses perfis durante o período.',
      'Campanha rodando é impulsionamento em curso — mesmo criada meses atrás. A condição precisa valer do primeiro ao último dia do período.',
      'Antes do vídeo 1 ir ao ar, abra o gerenciador de anúncios e confira: nenhuma campanha ativa apontando para os perfis da estratégia. Encontrou uma? Pause e só então comece.',
      'critica', true, 2),
    (s_id, 'IM-3', 'O que continua permitido',
      'Google Ads, campanhas em outros perfis e anúncios que não usam os perfis participantes continuam permitidos normalmente.',
      'A restrição protege a leitura orgânica dos perfis da estratégia — o que acontece fora deles não interfere nessa leitura.',
      'A sua campanha de Google Ads para o site pode continuar rodando. O perfil secundário da empresa, fora da estratégia, também pode anunciar.',
      'normal', true, 3);

  -- ── 14. ALTERAÇÕES PROIBIDAS ───────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'alteracoes-proibidas', 'Alterações proibidas nos vídeos',
      'O vídeo que a DOXA entrega é uma peça finalizada. Qualquer mudança — por menor que pareça — descaracteriza o conteúdo e sai da metodologia.',
      14) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'AL-1', 'Não altere nada no vídeo',
      'Não altere corte, duração, velocidade, proporção, resolução, qualidade, música, áudio, voz, legendas incorporadas, textos, capa, roteiro, estética, elementos gráficos, marca ou qualquer conteúdo disponibilizado pela IA. O arquivo publicado é o arquivo recebido, intacto.',
      'Cada elemento do vídeo — do primeiro corte à capa — é decidido com foco em desempenho. Alterar um detalhe muda a peça inteira, e a DOXA não consegue responder pelo resultado de um conteúdo que não é mais o que produziu.',
      'Achou que o vídeo ficaria melhor com outra música ou com a sua logo no canto? Não edite. Publique como veio e mande a sugestão para a equipe avaliar nos próximos.',
      'critica', true, 1);

  -- ── 15. TÍTULOS, DESCRIÇÕES E CONFIGURAÇÕES ────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'titulos-e-descricoes', 'Títulos, descrições e configurações',
      'Junto com cada vídeo, a equipe fornece o título, a descrição e as orientações de configuração da publicação. Eles fazem parte do conteúdo — publicar com outros textos é publicar outra coisa.',
      15) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'TD-1', 'Use os textos fornecidos',
      'Publique cada vídeo com o título, a descrição e as configurações fornecidas pela equipe. Não acrescente hashtags, marcações ou textos próprios sem orientação.',
      'Título e descrição são parte da estratégia de cada vídeo, pensados junto com o roteiro. Texto improvisado muda como o conteúdo se apresenta e é lido.',
      'O vídeo veio com título e descrição prontos? Copie e cole exatamente. Quer sugerir uma hashtag? Pergunte à equipe antes — não adicione por conta própria.',
      'normal', true, 1);

  -- ── 16. COMENTÁRIOS E ENGAJAMENTO ──────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'comentarios-e-engajamento', 'Comentários e engajamento',
      'Comentários são parte do resultado — ficam abertos. E todo o engajamento do período precisa ser real: comprar métrica, além de violar a metodologia, contamina exatamente o número que a garantia mede.',
      16) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'CE-1', 'Comentários ficam abertos',
      'Não limite nem desative os comentários das publicações. Comentários ofensivos ou preconceituosos podem ser excluídos — modere abusos sem bloquear a participação normal da audiência.',
      'A conversa nos comentários faz parte da distribuição do conteúdo. Fechar comentários corta essa camada; moderar abusos pontuais não.',
      'Apareceu um comentário preconceituoso? Exclua aquele comentário. Não desative a caixa de comentários do vídeo inteiro.',
      'normal', true, 1),
    (s_id, 'CE-2', 'Nenhum engajamento comprado',
      'Não adquira, direta ou indiretamente, seguidores, curtidas, visualizações, comentários, compartilhamentos, nem qualquer engajamento artificial ou serviço destinado a manipular métricas.',
      'Engajamento comprado contamina os resultados, viola a metodologia e pode gerar penalizações pelas próprias redes. A aferição da garantia depende de números reais — métrica inflada invalida a medição e a condição.',
      'Recebeu oferta de "pacote de seguidores" ou convite para grupo de engajamento? Recuse. Um único lote de curtidas compradas já compromete a estratégia inteira.',
      'critica', true, 2);

  -- ── 17. EXPECTATIVAS SOBRE O CLONE ─────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'expectativas-sobre-o-clone', 'Expectativas sobre clone, voz e estética',
      'O clone é uma representação aproximada de você — não um espelho. Podem existir diferenças de aparência, voz, gestos e expressões. A DOXA usa a tecnologia para buscar o melhor resultado possível, e a qualidade dos seus materiais de entrada influencia diretamente o que sai.',
      17) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'CL-1', 'O clone é aproximado',
      'Entenda e aceite que o clone não será necessariamente idêntico a você: diferenças de aparência, voz, gestos e expressões fazem parte da tecnologia atual.',
      'Alinhar essa expectativa desde já evita frustração no primeiro vídeo. O critério da estratégia é o desempenho do conteúdo, e a semelhança evolui com a qualidade dos materiais enviados.',
      'Achou a voz do clone um pouco diferente da sua? É esperado dentro de uma margem. Se algo parecer fora do normal, aponte para a equipe avaliar tecnicamente.',
      'normal', true, 1),
    (s_id, 'CL-2', 'A metodologia decide a estética',
      'Roteiro, corte, edição, voz e estética são definidos pela DOXA com foco em desempenho e potencial de viralização — não em gosto estético individual. Mudanças de escopo precisam de autorização prévia da equipe; preferências puramente subjetivas não substituem os critérios técnicos.',
      'O que faz um vídeo viralizar raramente coincide com o que cada um faria diferente no detalhe. A metodologia existe para maximizar resultado — e é ela que a garantia pressupõe.',
      'Prefere outro estilo de corte? Traga como sugestão para a equipe. O que não pode é alterar o vídeo ou exigir mudança fora do escopo combinado.',
      'normal', true, 2);

  -- ── 18. CONDIÇÕES DA GARANTIA ──────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'condicoes-da-garantia', 'Condições da garantia',
      'A garantia é um compromisso de dupla via: a DOXA entrega a estratégia completa, e você executa as regras deste manual por inteiro. A única margem operacional prevista é a dos dias sem publicação — tudo o mais é condição.',
      18) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'CG-1', 'Cumprimento integral é a condição',
      'Cumpra integralmente todas as regras deste manual durante os 90 dias. A margem existente é somente para dias sem publicação, desde que os 60 vídeos sejam concluídos nas três redes dentro do período.',
      'O estorno de 100% pressupõe a estratégia executada por completo. As regras não são burocracia — são as condições que tornam o resultado mensurável.',
      'Na dúvida se uma ação é permitida — um post, um anúncio, uma edição — pergunte à equipe ANTES de fazer. Perguntar não custa nada; desfazer às vezes é impossível.',
      'critica', true, 1),
    (s_id, 'CG-2', 'A aferição acontece fora deste aplicativo',
      'Entenda que este aplicativo não mede visualizações, não acompanha publicações e não decide sobre a garantia. A análise operacional e a aferição do resultado acontecem pelos canais previstos no contrato.',
      'O papel deste sistema é um só: comprovar que você recebeu, leu e aceitou as regras antes de começar. A apuração do resultado é um processo separado.',
      'Ao final do período, a apuração das visualizações somadas nas três redes e a verificação do cumprimento seguem o rito do contrato — não uma tela deste manual.',
      'normal', true, 2);

  -- ── 19. PERDA DA GARANTIA ──────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'perda-da-garantia', 'O que causa perda da garantia',
      'Esta é a seção mais importante do manual. Qualquer descumprimento das regras pode invalidar imediatamente a garantia — e para quatro delas não existe nenhuma tolerância operacional.',
      19) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'PG-1', 'As quatro linhas que não se cruzam',
      'Não existe tolerância operacional para: impulsionamento em perfil participante, alteração de conteúdo entregue, engajamento artificial e publicação de vídeo curto indevido em dia útil. Qualquer descumprimento pode invalidar imediatamente a garantia.',
      'Cada uma dessas quatro ações contamina diretamente aquilo que a garantia mede — o desempenho orgânico do conteúdo entregue. Não há como "descontar" o efeito depois; por isso não há margem.',
      'Um post turbinado, um vídeo com a música trocada, um pacote de curtidas ou um Reel próprio na terça-feira: qualquer um desses, sozinho, já pode invalidar a garantia.',
      'critica', true, 1),
    (s_id, 'PG-2', 'O que NÃO é descumprimento',
      'Saiba distinguir: insatisfação subjetiva com voz, corte, roteiro ou estética não equivale a descumprimento nem cancela a garantia — ela está ligada ao resultado agregado de visualizações e ao cumprimento das regras. A interrupção antecipada do projeto impede a conclusão do período de aferição, e as obrigações financeiras e contratuais continuam regidas pelo contrato assinado.',
      'Separar gosto pessoal de condição objetiva protege os dois lados: você sabe exatamente o que está em jogo, e a avaliação do resultado permanece sobre números, não sobre impressões.',
      'Não gostou do estilo de um vídeo? Isso não afeta a garantia — traga o feedback à equipe. Parar de publicar por causa disso, por outro lado, interrompe a aferição.',
      'normal', true, 2);

  -- ── 20. RESUMO FINAL ───────────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'resumo-final', 'Resumo final',
      'Antes da declaração, o essencial em uma tela: 60 vídeos únicos em 90 dias, cada um nas três redes, com o mesmo arquivo intacto. Até um vídeo da DOXA por dia útil, com 24 horas reais de intervalo. Dias úteis sem outros vídeos curtos; final de semana livre. Nenhum impulsionamento nos perfis participantes, nenhuma alteração nos vídeos, nenhum engajamento comprado, comentários abertos.',
      20) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'RF-1', 'Revisei o essencial',
      'Confirme que revisou o resumo das obrigações: a rotina de publicação (60/90/3 redes, um por dia útil, 24 horas reais), as restrições de dias úteis, a proibição de impulsionamento, a integridade dos vídeos e a proibição de engajamento artificial.',
      'O resumo é a última chance de pegar uma dúvida antes do aceite. Depois dele vem a declaração final — e o registro do seu aceite é definitivo.',
      'Bateu dúvida em qualquer item do resumo? Volte à seção correspondente agora — o botão de voltar existe para isso.',
      'normal', true, 1);

  -- ── 21. DECLARAÇÃO DE CIÊNCIA ──────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'declaracao-de-ciencia', 'Declaração de ciência',
      'Falta um passo. Na próxima tela você revisa os seus dados, relê a declaração de ciência e confirma o aceite. O registro guarda a data, a hora e a versão exata deste manual — e gera o seu comprovante em PDF, que fica disponível para você e arquivado com a DOXA.',
      21) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'DC-1', 'O que o aceite registra',
      'O aceite registra data e horário, a versão do manual, o texto exato de cada regra que você marcou e os dados de auditoria da conexão (endereço IP e navegador). Não é uma assinatura eletrônica — é o comprovante de que você recebeu, leu e aceitou estas regras.',
      'Transparência total sobre o que fica registrado: você sabe exatamente o que o comprovante contém antes de confirmar.',
      '',
      'normal', false, 1);

  perform public.manual_publicar_versao(v_id);
end;
$seed$;

-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, confira:
--
--   select numero, titulo, status, publicado_em is not null as publicada,
--          hash_conteudo is not null as com_hash
--     from public.manual_versoes;                     -- 1 linha, publicada
--   select count(*) from public.manual_secoes;        -- 21
--   select count(*) from public.manual_regras;        -- 37
--   select count(*) from public.manual_regras
--     where severidade = 'critica';                   -- 14
-- ─────────────────────────────────────────────────────────────────────────────
