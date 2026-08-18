import type { Pagina } from '../../tipos';

/**
 * A dor de ALCANCE — diagnóstico e o que fazer. O verbete
 * `/glossario/alcance-organico` define e diz como se mede; esta página é o
 * diagnóstico e as táticas, e o verbete nunca abre lista de táticas. A
 * fronteira está no keyword-map, seção Canibalização.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · as visualizações contabilizadas nas metas da Doxa são orgânicas, sem
 *    depender de compra de mídia → `docs/seo/source-of-truth.md` §8, fonte:
 *    `src/components/faq/config.ts:174-175`;
 *  · não é preciso investir em mídia para atingir as metas orgânicas
 *    contratadas; complementar com anúncios é separado → §8, fonte:
 *    `src/components/faq/config.ts:344-345`;
 *  · impulsionar, turbinar ou promover é proibido nos perfis onde a estratégia
 *    está ativa, inclusive em posts que não são da Doxa → §8, fonte:
 *    `supabase/manual-seed-v1.sql:241`;
 *  · engajamento artificial contamina resultados, viola a metodologia e pode
 *    gerar penalização das redes → §8, fonte:
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:531-543`;
 *  · dois vídeos no mesmo dia disputam o mesmo espaço → `RT-2`, §8, fonte:
 *    `supabase/manual-seed-v1.sql:187-191`;
 *  · o mesmo arquivo publicado nas três redes, no mesmo dia → `RT-1`, §8,
 *    fonte: `supabase/manual-seed-v1.sql:183`.
 *
 * Sem número de mercado sobre queda de alcance: não há fonte nomeada.
 */
export const pagina: Pagina = {
  tipo: 'dor',
  slug: 'como-aumentar-o-alcance-organico',
  titulo: 'Como aumentar o alcance orgânico quando ele parou',
  descricao:
    'O que fazer quando o alcance do perfil estagnou: como separar queda real de mudança de formato e as alavancas que ainda funcionam sem pagar mídia.',
  h1: 'Como aumentar o alcance orgânico',
  resumo:
    'Alcance orgânico não cresce por vontade nem por frequência sozinha: ele cresce quando mais gente que não te segue assiste o seu vídeo até perto do fim. Antes de mudar qualquer coisa, vale saber se o seu alcance caiu de verdade ou se você mudou de formato sem perceber. Abaixo, o diagnóstico e as alavancas que sobram depois dele.',
  intencao: 'informacional',
  palavrasChave: [
    'aumentar alcance orgânico',
    'alcance caiu',
    'perdi alcance no instagram',
    'mais alcance sem pagar',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/glossario/alcance-organico',
    '/guias/por-que-meus-videos-nao-tem-views',
    '/comparativos/organico-vs-pago',
    '/glossario/retencao',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o diagnóstico apontou volume e a sua empresa não consegue sustentar a frequência, conte o que precisa publicar por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Primeiro: o seu alcance caiu mesmo?',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Boa parte das quedas de alcance que as pessoas relatam não é queda: é mudança de mistura. Quem publicava três vídeos e dez fotos por mês e passou a publicar dez fotos e um vídeo vê o alcance despencar sem que nada tenha mudado na plataforma, porque o vídeo curto é o formato que mais entrega para quem não segue o perfil. Compare períodos com o mesmo tipo de conteúdo antes de concluir qualquer coisa.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A segunda confusão comum é olhar o número absoluto em vez da proporção. Um mês com metade das publicações tem metade do alcance, e isso não diz nada sobre a qualidade do conteúdo. O número que interessa é o alcance médio por publicação, e dentro dele a fatia que veio de quem não segue o perfil.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Se o alcance por vídeo se manteve e o total caiu, o problema é frequência. Se o alcance por vídeo caiu, o problema é o conteúdo. São diagnósticos diferentes e não se resolvem com a mesma ação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As alavancas que realmente movem o alcance',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'A abertura do vídeo',
          texto:
            'É a alavanca de maior efeito e a mais barata de mexer. Se metade das pessoas sai nos primeiros segundos, nenhuma outra mudança compensa isso. Reescrever a abertura e republicar o mesmo conteúdo é o teste mais rápido que existe.',
        },
        {
          titulo: 'A frequência, até um piso razoável',
          texto:
            'Abaixo de dois ou três vídeos por semana, a plataforma tem pouca amostra para entender quem é o seu público. Subir a frequência costuma aumentar o alcance total antes de aumentar o alcance por vídeo.',
        },
        {
          titulo: 'O espaçamento entre publicações',
          texto:
            'Dois vídeos no mesmo dia disputam a mesma audiência e um atropela o alcance do outro. Espalhar as publicações costuma render mais do que aumentar a quantidade.',
        },
        {
          titulo: 'A mesma peça nas três redes',
          texto:
            'Publicar o mesmo vídeo no TikTok, no Reels e no YouTube Shorts multiplica a chance de encontrar a audiência sem multiplicar a produção. É a alavanca com melhor relação entre esforço e resultado.',
        },
        {
          titulo: 'O assunto, medido e não adivinhado',
          texto:
            'Depois de dez ou quinze vídeos, dois ou três temas terão desempenho claramente melhor. Fazer mais cinco variações de cada um deles rende mais do que inventar um tema novo.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que parece alavanca e não é',
    },
    {
      tipo: 'lista',
      itens: [
        '**Hashtag.** Ela ajuda a plataforma a classificar o vídeo, e só. Não existe conjunto secreto que multiplique alcance.',
        '**Horário de publicação.** Move pouco perto da abertura e da regularidade, e não salva um vídeo com retenção baixa.',
        '**Pedir engajamento no vídeo.** "Comenta aí" sem motivo produz comentários vazios, que não sustentam distribuição nenhuma.',
        '**Comprar seguidores, curtidas ou visualizações.** Contamina o dado que você usaria para decidir, viola as regras das plataformas e pode gerar penalização.',
        '**Impulsionar.** Compra alcance no momento e apaga a informação: depois disso você não sabe mais se o conteúdo se sustentava sozinho.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um plano de trinta dias',
    },
    {
      tipo: 'lista',
      ordenada: true,
      itens: [
        'Semana 1: medir. Alcance médio por vídeo, proporção de não seguidores e curva de retenção dos últimos dez vídeos.',
        'Semana 1: escolher os dois temas com melhor desempenho e descartar os que não performaram, sem tentar salvá-los.',
        'Semanas 2 a 4: publicar um vídeo por dia útil, alternando os dois temas, com aberturas diferentes entre si.',
        'Fim do mês: comparar alcance médio por vídeo com o do mês anterior — nunca o total, que depende da quantidade.',
        'Repetir, mantendo o que subiu e trocando uma variável de cada vez.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa trabalha exatamente sobre este canal: as visualizações contabilizadas nas metas da empresa são orgânicas, vindas da distribuição dos conteúdos produzidos dentro da operação, e não é preciso investir em mídia paga para atingir as metas contratadas. Nos perfis em que a estratégia está ativa, impulsionar publicações é proibido — inclusive posts que não são da operação —, e a razão é a mesma que aparece na lista acima: mídia paga no mesmo perfil embaralha o dado que decide o que produzir a seguir.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se você quiser complementar a estratégia com anúncios, isso é feito separadamente. E se o seu diagnóstico deu em volume, o obstáculo é de produção — o assunto de [como produzir conteúdo sem equipe](/guias/como-produzir-conteudo-sem-equipe).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Perguntas frequentes',
    },
    {
      tipo: 'faq',
      itens: [
        {
          pergunta: 'Quanto tempo leva para o alcance voltar a crescer?',
          resposta:
            'Depende de qual era a causa. Correções de abertura costumam aparecer no vídeo seguinte, porque cada publicação é um teste novo. Correções de frequência levam algumas semanas, já que a plataforma precisa de amostra para reaprender quem é o público do perfil. Não há prazo garantido em nenhum dos dois casos.',
        },
        {
          pergunta: 'Publicar o mesmo vídeo nas três redes prejudica o alcance?',
          resposta:
            'Nada indica que publicar o mesmo conteúdo em redes diferentes seja penalizado: cada plataforma distribui dentro dela mesma. O que costuma pesar é publicar um arquivo com marcas visíveis de outra rede, porque a rede de destino pode tratar isso como material reciclado.',
        },
        {
          pergunta: 'Devo apagar os vídeos antigos que foram mal?',
          resposta:
            'Apagar não ajuda: o que costuma reduzir a amostra dos próximos é a sequência de retenção baixa, não a existência do vídeo antigo — e apagar não desfaz isso. O histórico é justamente o dado que mostra qual formato funcionou, então vale mais republicar o conteúdo com uma abertura nova do que apagar o original.',
        },
        {
          pergunta: 'Seguidores ainda importam para o alcance?',
          resposta:
            'Importam menos do que se imagina em vídeo curto, porque uma parte relevante do alcance costuma vir de quem ainda não segue o perfil. Seguidor é consequência de conteúdo que funcionou, e não a condição para que ele funcione.',
        },
      ],
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: alcance cresce quando mais gente de fora
 *          assiste até perto do fim.
 * [x]  2. Fatos da Doxa com entrada no source of truth (§8).
 * [x]  3. Nada da §9.
 * [x]  4. Termos proibidos ausentes; tráfego pago aparece só como o que é
 *          proibido nos perfis da estratégia.
 * [x]  5. A garantia não é citada com número nem prazo, e a página diz
 *          explicitamente que não há prazo garantido para o alcance voltar.
 * [x]  6. Intenção própria: diagnóstico + táticas. O verbete
 *          `/glossario/alcance-organico` define e mede, e não abre lista de
 *          táticas — a divisão que o keyword-map exige.
 * [x]  7. Incremental: a distinção entre queda real e mudança de mistura, e o
 *          plano de trinta dias.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-organico`, recebe dele e envia links.
 * [x] 10. Não é comparativo; a seção "o que parece alavanca e não é" contraria
 *          o senso comum em vez de agradar.
 * [x] 11. CTA único no fim, condicionado ao diagnóstico.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "operação", "visualizações contabilizadas nas
 *          metas".
 * [x] 14. Publicaria sem Google: sim — a primeira seção evita a maior perda de
 *          tempo do assunto, que é consertar uma queda que não existiu.
 * ────────────────────────────────────────────────────────────────────────── */
