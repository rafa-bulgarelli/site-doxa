-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — SEED DA VERSÃO 2, para colar no SQL Editor do Supabase.
--
-- Rode DEPOIS de `manual-seed-v1.sql`, UMA vez. Idempotente pelo número: se a
-- versão 2 já existe, avisa e não faz nada. Publicar a v2 arquiva a v1 — quem
-- já aceitou a v1 fica intacto para sempre (convite preso à versão do dia).
--
-- ─── POR QUE UMA V2 ──────────────────────────────────────────────────────────
--
-- A v1 pedia 36 aceites em 21 seções — pedágio, não educação: ninguém lê 30
-- telas de texto preto. A v2 reorganiza no fluxo que o dono pediu:
--
--   1. onboarding  → como a plataforma começa            (explica, sem aceite)
--   2. voz         → como gravar a voz do clone           (explica, sem aceite)
--   3. clone       → fotos e expectativa                  (explica, sem aceite)
--   4. garantia    → A ROTINA DE POSTAGEM — os 8 itens que quebram a garantia,
--                    cada um com checkbox                 (o aceite de verdade)
--   5. termos      → o restante do conteúdo contratual, como Termos de Uso —
--                    a UI mostra num documento "ver os termos completos" antes
--                    da declaração final; nada aqui pede checkbox individual
--
-- Os SLUGS acima são CONTRATO com a interface (`src/manual/publico` escolhe a
-- cena animada pelo slug, e `termos` fica fora da navegação de capítulos).
-- Renomear um slug aqui é quebrar a tela lá.
--
-- Checkbox SÓ em `severidade = 'critica'` — que aqui coincide com `obrigatoria`.
-- O PDF e o hash continuam cobrindo TUDO, termos inclusos: a prova não afinou,
-- só a leitura ficou humana.
-- ─────────────────────────────────────────────────────────────────────────────

do $seed$
declare
  v_id uuid;
  s_id uuid;
begin
  if exists (select 1 from public.manual_versoes where numero = 2) then
    raise notice 'versao 2 ja existe — nada a fazer';
    return;
  end if;

  insert into public.manual_versoes (numero, titulo, declaracao, status)
    values (
      2,
      'Manual DOXA — Como funciona e o que protege a sua garantia',
      'Declaro que li integralmente o Manual de Uso e Regras da Garantia da DOXA, incluindo os Termos de Uso, compreendi todas as orientações, obrigações, permissões e proibições apresentadas e estou ciente de que o cumprimento integral dessas condições é necessário para a manutenção da garantia contratual. Confirmo que os dados informados são verdadeiros e que recebi acesso ao conteúdo completo da versão indicada neste registro.',
      'rascunho'
    )
    returning id into v_id;

  -- ── 1. O ONBOARDING ────────────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'onboarding', 'O onboarding',
      'Tudo começa com você contando quem é a sua empresa. As suas respostas viram os roteiros dos seus vídeos — quanto mais contexto você der, mais o conteúdo soa como você.',
      1) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'ON-1', 'Responda com contexto, não com uma palavra',
      'Conte da sua empresa, da oferta, do público e do posicionamento com frases completas e verdadeiras.',
      'Os roteiros nascem das suas respostas. Resposta rasa vira vídeo genérico.',
      'Em vez de "empresários", escreva: "donos de clínicas odontológicas que já investem em marketing mas não aparecem em vídeo".',
      'normal', false, 1),
    (s_id, 'ON-2', 'Uma pessoa centraliza a conversa',
      'Escolha um responsável do seu lado para falar com a equipe da DOXA e avisar de qualquer problema.',
      'Informação espalhada se perde. Um canal único mantém tudo rápido e rastreável.',
      'Defina desde o início: "quem fala com a DOXA é a Ana" — e tudo passa por ela.',
      'normal', false, 2);

  -- ── 2. A SUA VOZ ───────────────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'voz', 'A sua voz',
      'A plataforma clona a sua voz a partir de uma gravação sua. Não precisa de estúdio — precisa de silêncio e naturalidade. Siga o roteiro e a duração que a plataforma pedir.',
      2) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'VZ-1', 'Grave num lugar silencioso',
      'Nada de eco, música, rua, ventilador ou outras vozes no fundo.',
      'O clone aprende com TUDO que estiver no áudio — ruído entra no aprendizado e suja a voz de todos os vídeos.',
      'Quarto fechado, longe da janela, ar-condicionado desligado. Um guarda-roupa aberto por perto mata o eco.',
      'normal', false, 1),
    (s_id, 'VZ-2', 'Fale natural, envie cru',
      'Voz normal, ritmo normal, celular sempre à mesma distância — e nenhum filtro ou aplicativo de "melhorar áudio" antes de enviar.',
      'O clone reproduz o que ouve: gravação forçada vira voz forçada, e processamento esconde o que ele precisa aprender.',
      'Leia o roteiro como se explicasse para um cliente na sua frente — sem voz de locutor, sem pressa.',
      'normal', false, 2);

  -- ── 3. O SEU CLONE ─────────────────────────────────────────────────────────
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'clone', 'O seu clone',
      'As fotos alimentam o clone visual. A tecnologia precisa de uma coisa só: ver o seu rosto com clareza. E vale alinhar desde já: o clone é uma aproximação sua, não um espelho.',
      3) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'CL-1', 'Foto nítida, de frente, em boa luz',
      'Rosto inteiro visível, luz uniforme, enquadramento próximo. Evite sombra forte e foto borrada.',
      'O clone é construído do que aparece — rosto mal iluminado vira clone impreciso.',
      'Fotografe de dia, DE FRENTE para a janela, celular na altura dos olhos. Inclua fotos sorrindo com os dentes quando pedido.',
      'normal', false, 1),
    (s_id, 'CL-2', 'Sem filtro, sem óculos escuros',
      'A foto mostra o seu rosto real. Nada de suavização de pele, modo retrato exagerado ou acessório cobrindo o rosto.',
      'Filtro altera exatamente os traços que a tecnologia precisa capturar.',
      'Câmera padrão do celular, sem retoque. Na dúvida, mande antes no grupo da equipe.',
      'normal', false, 2),
    (s_id, 'CL-3', 'O clone é uma aproximação',
      'Podem existir diferenças de aparência, voz e gestos — é a tecnologia atual. A qualidade do que você envia influencia direto o resultado.',
      'Expectativa alinhada agora evita frustração no primeiro vídeo. O critério da estratégia é o desempenho do conteúdo.',
      'Achou a voz um pouco diferente? Esperado dentro de uma margem. Algo muito fora, aponte para a equipe avaliar.',
      'normal', false, 3);

  -- ── 4. A ROTINA QUE PROTEGE A GARANTIA ─────────────────────────────────────
  -- Os 8 itens com checkbox. CADA UM, descumprido, pode invalidar a garantia.
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'garantia', 'A rotina que protege a sua garantia',
      'A garantia é de 1.000.000 de visualizações em 90 dias, somando Instagram, TikTok e YouTube Shorts. Cumprindo a rotina abaixo por inteiro, se a meta não vier, o estorno é de 100% conforme o contrato. São 8 itens — leia cada um e marque que entendeu.',
      4) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'GA-1', 'A meta: 1 milhão em 90 dias, nas três redes',
      'A contagem começa no primeiro vídeo publicado e soma as visualizações de todos os vídeos no Instagram, TikTok e YouTube Shorts. A garantia vale enquanto TODOS os itens desta lista forem cumpridos.',
      'É contra esses números e condições que o resultado será aferido no final.',
      'Primeiro vídeo no dia 1º de março? A aferição vai até o fim de maio, somando as três redes.',
      'critica', true, 1),
    (s_id, 'GA-2', '60 vídeos únicos, cada um nas três redes',
      'Publique no mínimo 60 conteúdos únicos nos 90 dias — e cada um deles nas três redes, com o MESMO arquivo.',
      'A meta é calculada sobre esse volume completo. Vídeo fora de uma rede é vídeo incompleto.',
      'Publicou só no Instagram e no TikTok? Falta o YouTube Shorts — o vídeo ainda não conta.',
      'critica', true, 2),
    (s_id, 'GA-3', 'Um vídeo por dia útil, com 24 horas DE RELÓGIO',
      'No máximo um vídeo da DOXA por dia útil, com intervalo mínimo real de 24 horas — publicou segunda às 22h, o próximo é a partir das 22h de terça. Não compense dias perdidos publicando vários de uma vez.',
      'Cada vídeo precisa da própria janela de distribuição. Publicar cedo demais corta o alcance do anterior.',
      'Terça às 15h ainda NÃO pode, mesmo sendo outro dia no calendário. A partir das 22h, pode.',
      'critica', true, 3),
    (s_id, 'GA-4', 'Dia útil sem outros vídeos curtos — fim de semana é seu',
      'De segunda a sexta, o único vídeo curto nos perfis participantes é o da DOXA — nada de Reels, TikToks ou Shorts seus ou de terceiros. Foto, carrossel e story continuam livres. Sábado e domingo, publique o que quiser.',
      'Vídeos curtos disputam a mesma janela de distribuição; um extra no meio da semana divide o alcance do vídeo da estratégia.',
      'Quer repostar um vídeo na quarta? Guarde para o sábado, ou use um perfil fora da estratégia.',
      'critica', true, 4),
    (s_id, 'GA-5', 'Baixou, publicou — sem editar NADA',
      'Publique exatamente o arquivo recebido, nas três redes, no mesmo dia. Não altere corte, duração, velocidade, música, voz, legenda, capa, texto nem qualidade — e use os títulos e descrições fornecidos.',
      'Cada detalhe do vídeo é decidido para desempenho. Alterar um detalhe muda a peça inteira — e a DOXA não responde pelo resultado de um conteúdo que não produziu.',
      'Achou que ficaria melhor com outra música ou a sua logo? Não edite. Publique como veio e mande a sugestão para a equipe.',
      'critica', true, 5),
    (s_id, 'GA-6', 'Nada de impulsionar, turbinar ou promover',
      'Nos perfis participantes, nenhuma publicação pode ser impulsionada, turbinada ou promovida durante o período — nem posts antigos, nem posts seus. Pause campanhas ligadas a esses perfis ANTES do primeiro vídeo. Google Ads e outros perfis continuam liberados.',
      'Mídia paga interfere na leitura isolada do desempenho orgânico — é a condição central da metodologia.',
      'Antes do vídeo 1: abra o gerenciador de anúncios e confira que nenhuma campanha aponta para os perfis da estratégia.',
      'critica', true, 6),
    (s_id, 'GA-7', 'Nenhum engajamento comprado',
      'Não compre, direta ou indiretamente, seguidores, curtidas, visualizações, comentários ou qualquer engajamento artificial.',
      'Métrica inflada contamina exatamente o número que a garantia mede — e pode gerar punição das próprias redes.',
      'Oferta de "pacote de seguidores" ou grupo de engajamento? Recuse. Um único lote já compromete a estratégia.',
      'critica', true, 7),
    (s_id, 'GA-8', 'Descumpriu, pode perder — na dúvida, pergunte ANTES',
      'Qualquer descumprimento desta lista pode invalidar a garantia imediatamente, sem tolerância operacional. A margem que existe é só para dias sem publicação, desde que os 60 vídeos saiam em 90 dias.',
      'As quatro ações sem perdão — impulsionar, editar vídeo, comprar engajamento, vídeo curto indevido em dia útil — contaminam o que a garantia mede, e não há como descontar o efeito depois.',
      'Na dúvida se pode — um post, um anúncio, uma edição — pergunte à equipe antes de fazer. Perguntar é grátis; desfazer às vezes é impossível.',
      'critica', true, 8),
    (s_id, 'GA-9', 'O que NÃO quebra a garantia',
      'Perder um dia isolado de publicação não invalida nada — retome no dia seguinte. E não gostar do estilo de um vídeo é feedback para a equipe, não descumprimento.',
      'A rotina tem folga de verdade: 60 vídeos em 90 dias deixam espaço para imprevistos.',
      'Viajou na quarta? Publique na quinta normalmente — um por dia, sem dobrar.',
      'normal', false, 9);

  -- ── 5. TERMOS DE USO ───────────────────────────────────────────────────────
  -- O conteúdo contratual completo, fora da navegação: a UI mostra este bloco
  -- como documento ("ver os termos completos") antes da declaração final.
  insert into public.manual_secoes (versao_id, slug, titulo, descricao, ordem)
    values (v_id, 'termos', 'Termos de uso',
      'O detalhe completo das condições que você está aceitando. Este documento faz parte do aceite e é impresso no seu comprovante em PDF.',
      5) returning id into s_id;
  insert into public.manual_regras (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem) values
    (s_id, 'TU-1', 'O que a DOXA entrega',
      'Durante o período da estratégia, a DOXA produz e entrega os vídeos curtos prontos para publicação — cada um único, com roteiro, voz clonada, edição e capa. O cliente recebe o arquivo final e o publica conforme a rotina deste manual.',
      'A metodologia é um sistema: produção da DOXA mais execução do cliente. Nenhum dos lados funciona sozinho.',
      '',
      'normal', false, 1),
    (s_id, 'TU-2', 'A garantia e o estorno',
      'A garantia é de 1.000.000 de visualizações em 90 dias corridos a partir da primeira publicação, somando Instagram, TikTok e YouTube Shorts, de todos os vídeos publicados. Cumpridas integralmente todas as condições, se a meta não for alcançada existe estorno de 100% conforme as condições e o prazo do contrato. Este aplicativo não calcula resultado nem decide sobre a garantia: ele comprova que o cliente recebeu, leu e aceitou as regras. A aferição acontece pelos canais previstos no contrato.',
      'Meta, período, contagem e o papel deste registro precisam estar claros desde o início.',
      '',
      'normal', false, 2),
    (s_id, 'TU-3', 'A rotina de publicação, em detalhe',
      'No mínimo 60 conteúdos únicos em 90 dias, cada um publicado nas três redes com o mesmo arquivo, no mesmo dia, de forma simultânea ou tão próxima quanto possível. Nos dias úteis, no máximo um vídeo da DOXA por dia, com intervalo mínimo real de 24 horas entre vídeos, e nenhum outro vídeo curto — próprio ou de terceiros — nos perfis participantes; fotos, carrosséis e stories permanecem livres. Aos sábados e domingos a publicação de vídeos próprios é liberada, mesmo a menos de 24 horas de um vídeo da DOXA. Dias isolados sem publicação não invalidam a garantia, desde que os 60 vídeos sejam concluídos no período; não é permitido compensar publicando mais de um vídeo da DOXA no mesmo dia.',
      'A janela de distribuição de cada vídeo é o que a rotina protege.',
      '',
      'normal', false, 3),
    (s_id, 'TU-4', 'Integridade do conteúdo',
      'O arquivo publicado deve ser exatamente o arquivo entregue, preservando qualidade, sem alteração de corte, duração, velocidade, proporção, resolução, música, áudio, voz, legendas incorporadas, textos, capa, roteiro, estética, elementos gráficos ou marca. Títulos, descrições e configurações fornecidos pela equipe fazem parte do conteúdo e devem ser utilizados como entregues; acréscimos por conta própria dependem de orientação prévia.',
      'Cada elemento é decidido com foco em desempenho; alterar um detalhe muda a peça inteira.',
      '',
      'normal', false, 4),
    (s_id, 'TU-5', 'Mídia paga e engajamento',
      'Durante o período, os perfis participantes não podem ter nenhuma publicação impulsionada, turbinada ou promovida — inclusive posts alheios à DOXA — e campanhas antigas ligadas a esses perfis devem ser pausadas antes da primeira publicação. Permanecem permitidos Google Ads e campanhas que não utilizem os perfis participantes. É expressamente proibido adquirir, direta ou indiretamente, seguidores, curtidas, visualizações, comentários, compartilhamentos ou qualquer engajamento artificial. Os comentários das publicações não devem ser limitados ou desativados; comentários ofensivos ou preconceituosos podem ser excluídos.',
      'Mídia paga e métrica inflada interferem na leitura isolada do desempenho orgânico que a garantia mede.',
      '',
      'normal', false, 5),
    (s_id, 'TU-6', 'Metodologia, escopo e expectativas',
      'Roteiro, corte, edição, voz e estética são definidos pela DOXA com foco em desempenho e potencial de viralização. O clone é uma representação aproximada, podendo apresentar diferenças de aparência, voz, gestos e expressões; a qualidade dos materiais de entrada influencia diretamente o resultado. Preferências puramente subjetivas não substituem os critérios técnicos, e alterações de escopo dependem de autorização prévia da DOXA.',
      'A metodologia prioriza resultado — é ela que a garantia pressupõe.',
      '',
      'normal', false, 6),
    (s_id, 'TU-7', 'Perda da garantia e encerramento',
      'O cumprimento integral das regras é condição da garantia, e qualquer descumprimento pode invalidá-la imediatamente — sem tolerância operacional para impulsionamento, alteração de conteúdo, engajamento artificial ou publicação de vídeo curto indevido em dia útil. Insatisfação subjetiva com voz, corte, roteiro ou estética não equivale a descumprimento nem cancela a garantia. A interrupção antecipada do projeto impede a conclusão do período de aferição, e as obrigações financeiras e contratuais seguem regidas pelo contrato assinado. A análise operacional acontece fora deste aplicativo.',
      'Separar condição objetiva de gosto pessoal protege os dois lados.',
      '',
      'normal', false, 7),
    (s_id, 'TU-8', 'Privacidade e registro do aceite',
      'O aceite registra data e horário, a versão do manual, o texto exato de cada item confirmado e, para auditoria, o endereço IP e o navegador utilizados. Esses dados não são exibidos publicamente nem usados para marketing. O comprovante em PDF fica disponível para o cliente e arquivado com a DOXA pelo prazo de guarda de documentos contratuais. Este registro não é uma assinatura eletrônica: é a comprovação de que o cliente recebeu, leu e aceitou estas condições.',
      'Transparência total sobre o que fica registrado, antes de confirmar.',
      '',
      'normal', false, 8);

  perform public.manual_publicar_versao(v_id);
end;
$seed$;

-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, confira:
--
--   select numero, status from public.manual_versoes order by numero;
--     -- v1 arquivada · v2 publicada
--   select count(*) from public.manual_secoes s
--     join public.manual_versoes v on v.id = s.versao_id where v.numero = 2;
--     -- 5
--   select count(*) filter (where r.obrigatoria) as aceites,
--          count(*) as total
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id where v.numero = 2;
--     -- 8 aceites, 24 no total
-- ─────────────────────────────────────────────────────────────────────────────
