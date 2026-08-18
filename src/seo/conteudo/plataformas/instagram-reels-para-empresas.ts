import type { Pagina } from '../../tipos';

/**
 * A rede em que a empresa JÁ tem perfil — e é isso que a diferencia da página
 * do TikTok. Aqui o assunto é convivência: Reels dentro de uma conta que tem
 * feed, stories, seguidores antigos e um botão de impulsionar à mão.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 * Sobre a DOXA:
 *  · Instagram é uma das três redes da garantia → `supabase/manual-seed-v1.sql`;
 *    `src/components/Hero.tsx`;
 *  · de segunda a sexta os únicos vídeos curtos nos perfis participantes são os
 *    da operação, e fotos, carrosséis e stories seguem liberados; no sábado e no
 *    domingo o cliente pode publicar vídeos curtos próprios → seções de dias
 *    úteis e de fins de semana do manual do cliente (`supabase/manual-seed-v1.sql`;
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md`), citadas como
 *    o que se combina com quem JÁ é cliente (§8);
 *  · proibição de impulsionar nos perfis da estratégia, com Google Ads e outros
 *    perfis liberados → mesma fonte;
 *  · "não é preciso investir em mídia… anúncios são separados" →
 *    `src/components/faq/config.ts`, chave `midia-extra`;
 *  · propriedade e direitos de uso definidos no contrato de cada cliente →
 *    chave `direitos` do mesmo arquivo, palavra por palavra;
 *  · quem publica é o cliente, no perfil dele, com o arquivo pronto para postar
 *    → `src/components/HowItWorks.tsx`;
 *  · "baixou, publicou" — publicar exatamente o arquivo entregue, sem alterar
 *    corte, duração, música, áudio, legendas, textos ou capa → seção de
 *    integridade do arquivo do manual (`supabase/manual-seed-v1.sql`;
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md`), §8. O
 *    recorte desta página é o que só existe no Instagram: a própria tela de
 *    publicação convida a mexer no arquivo. A regra em si é de
 *    /solucoes/videos-curtos-para-empresas, e não é reexplicada aqui.
 *
 * Sobre a PLATAFORMA: nenhuma estatística, nenhuma política interna da Meta e
 * nenhuma promessa de alcance. Não há fonte para isso no projeto.
 */
export const pagina: Pagina = {
  tipo: 'plataforma',
  slug: 'instagram-reels-para-empresas',
  titulo: 'Reels para empresas: produção, cadência e o que trava o alcance',
  descricao:
    'Como encaixar Reels no perfil que a sua empresa já tem: convivência com feed e stories, por que o botão de impulsionar atrapalha e o que a Doxa entrega pronto.',
  h1: 'Reels para empresas',
  resumo:
    'Reels convive no mesmo perfil com feed, stories e a base que a sua empresa já tem, e é dele que costuma vir o alcance de quem ainda não chegou. Quem trata os dois como a mesma coisa acaba publicando vídeo para os próprios seguidores e concluindo que a rede não funciona.',
  intencao: 'comercial',
  palavrasChave: [
    'reels para empresas',
    'produção de reels',
    'instagram para empresas',
    'reels de marca',
    'vídeo vertical no instagram',
  ],
  hubs: ['/guias/reels-no-instagram'],
  relacionadas: [
    '/guias/como-crescer-no-instagram-organicamente',
    '/comparativos/tiktok-vs-instagram',
    '/solucoes/videos-curtos-para-empresas',
    '/plataformas/tiktok-para-empresas',
    '/glossario/alcance-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Diga quantos Reels a sua empresa publica hoje e o que trava. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Duas audiências no mesmo perfil',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um perfil de empresa no Instagram atende duas pessoas diferentes ao mesmo tempo, e elas quase não se cruzam. A primeira já segue: vê stories, acompanha lançamento, responde enquete. A segunda não faz ideia de que a sua empresa existe e só vai encontrá-la se um vídeo for entregue a ela. **Boa parte do alcance de quem não segue costuma vir dos Reels** — por que isso acontece está em [Reels no Instagram](/guias/reels-no-instagram); aqui o assunto é a convivência com o resto do perfil.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A confusão entre as duas costuma estar por trás da frustração com a rede. Publicar Reels pensando em quem já segue produz vídeo com recado interno — "estamos com novidade", "passa lá no link" —, que não interessa a desconhecido nenhum. E, como o alcance de quem não segue é o que faz o perfil crescer, o resultado fica parado enquanto o esforço aumenta.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O perfil que já existe é vantagem, se estiver arrumado',
    },
    {
      tipo: 'lista',
      itens: [
        'Quem chega por um Reels e se interessa vai ao perfil antes de qualquer outra coisa: o que está na bio e nos primeiros itens da grade responde "isso aqui é o quê?" em três segundos.',
        'Acervo antigo não atrapalha, mas contradição atrapalha: perfil que mudou de assunto três vezes obriga o visitante a decidir qual versão é a atual.',
        'O que vale reaproveitar não é o vídeo institucional — é o assunto dele. A pauta pode ser a mesma; a forma, não.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O botão de impulsionar é a armadilha da rede',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O Instagram deixa o botão de impulsionar embaixo do post, e a tentação aparece justamente quando um vídeo vai bem. É esse botão que a regra da operação desliga: nos perfis em que ela está ativa, impulsionar publicação é proibido, e o porquê está em [conteúdo orgânico para empresas](/solucoes/conteudo-organico-para-empresas). Se a empresa quiser complementar a estratégia com anúncios, isso é feito separadamente, fora do perfil onde o orgânico é medido.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que continua liberado enquanto a operação roda',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Uma dúvida honesta de quem já usa o perfil todo dia: a operação não congela o Instagram da empresa. Com quem já é cliente, o combinado é este — de segunda a sexta, os únicos vídeos curtos publicados nos perfis participantes são os da operação; **fotos, carrosséis e stories seguem liberados** a qualquer hora. No sábado e no domingo, a empresa pode publicar vídeos curtos próprios, mesmo a menos de 24 horas de um vídeo da Doxa.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A regra é sobre vídeo curto porque é ele que disputa a mesma fila de distribuição. Foto e story não competem com um Reels pelo mesmo espaço.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O Instagram é uma das três redes usadas como referência da operação, com TikTok e YouTube Shorts, e as visualizações da meta são somadas entre elas, conforme as condições e o prazo do contrato. O que chega à empresa é o arquivo pronto para postar — vertical, legendado, no formato do feed — e quem publica no perfil é ela mesma. O detalhe do que faz um vídeo curto funcionar está em [vídeos curtos para empresas](/solucoes/videos-curtos-para-empresas); a comparação entre as duas redes principais, em [TikTok ou Instagram](/comparativos/tiktok-vs-instagram).',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Esse arquivo sobe como está, e no Instagram isso pede atenção extra: a tela de publicação oferece cortar de novo, escolher outra capa, colar figurinha e pôr uma música por cima, tudo a um toque de distância. A peça entregue já chega com corte, legenda, capa e áudio decididos, e a regra combinada com quem já é cliente cabe em duas palavras — baixou, publicou —, cujo porquê está em [vídeos curtos para empresas](/solucoes/videos-curtos-para-empresas). Mexer na tela de upload não é ajuste estético.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando Reels não é a prioridade',
    },
    {
      tipo: 'lista',
      itens: [
        'Se a empresa vende para um público que não está no Instagram, começar por lá é escolher a rede pelo hábito de quem decide, não pelo de quem compra.',
        'Se o perfil existe só para atendimento, vídeo não é o problema a resolver primeiro: a resposta rápida é.',
        'Se a expectativa é ganhar seguidor, vale ajustar a régua: Reels entrega alcance, e seguidor é consequência de quem gostou o bastante para voltar.',
      ],
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
          pergunta: 'Posso continuar postando fotos e stories normalmente?',
          resposta:
            'De segunda a sexta, os únicos vídeos curtos publicados nos perfis participantes da estratégia são os da operação; fotos, carrosséis e stories seguem liberados. Nos fins de semana, a empresa pode publicar vídeos curtos próprios, mesmo a menos de 24 horas de um vídeo da Doxa.',
        },
        {
          pergunta: 'Quem publica os Reels no perfil da empresa?',
          resposta:
            'A publicação é feita pela própria empresa, no perfil dela: o que a Doxa entrega é o arquivo pronto para postar, vertical, legendado, no formato do feed.',
        },
        {
          pergunta: 'Quem é dono dos Reels produzidos pela Doxa?',
          resposta:
            'Os conteúdos são desenvolvidos exclusivamente para a operação da marca. Os direitos de utilização, propriedade e demais condições são estabelecidos no contrato de cada cliente, de acordo com o escopo contratado.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde começar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Separe os seus últimos Reels em dois grupos: os que fariam sentido para quem nunca ouviu falar da sua empresa e os que só funcionam para quem já segue. Se o segundo grupo for maior, o alcance parado tem explicação. Para revisar isso com o time da Doxa, quem preenche o formulário é chamado em até 24 horas para marcar a auditoria estratégica.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase RESPONDE a busca. Sem aquecimento, sem "no mundo
 *          digital", sem "cada vez mais empresas", sem definir o óbvio antes.
 * [x]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md.
 *          Cliente, número, prazo, preço, garantia e depoimento: zero invenção.
 * [x]  3. Nada da §9 (NÃO PUBLICÁVEL) apareceu — nem parafraseado, nem
 *          "suavizado": preço, mensalidade, fidelidade, agência licenciada, os
 *          1.500 clientes, "parceiros". A pergunta de propriedade aparece no
 *          FAQ, mas com a única resposta autorizada — a chave `direitos` de
 *          `faq/config.ts`, palavra por palavra, que remete ao contrato de cada
 *          cliente e não publica cláusula nenhuma. Mesma situação da pergunta
 *          de `preco` em /solucoes/producao-de-videos-com-ia.
 * [x]  4. Termos proibidos ausentes: "agência" como autodefinição, "parceiros"
 *          para as ferramentas, "assinatura", "curso", "tráfego pago" como
 *          serviço, "garantimos que vai viralizar".
 * [x]  5. Se cita a garantia, usa a redação prudente do FAQ; se usa os números
 *          do manual, vem com "conforme as condições e o prazo do contrato".
 * [x]  6. Motivo real de existir: responde a UMA intenção que nenhuma outra
 *          página do keyword-map já responde (conferir a seção Canibalização).
 * [x]  7. Informação incremental: pelo menos um bloco que a SERP não tem —
 *          mecanismo, número da metodologia, erro comum, exemplo concreto.
 * [x]  8. title exclusivo e orientado a intenção (nunca "Keyword | DOXA"),
 *          description exclusiva de 120–160 caracteres, H1 único, H2/H3 em
 *          hierarquia real.
 * [x]  9. Pertence a ≥1 hub, envia links contextuais e recebe do hub. Nenhum
 *          link decorativo: cada um é útil para quem lê, não para o crawler.
 * [x] 10. Comparativo é IMPARCIAL: admite onde a outra opção ganha. Não
 *          concluir artificialmente que a Doxa é sempre a resposta.
 * [x] 11. CTA por intenção — topo de funil: próximo conteúdo; meio:
 *          metodologia/prova; fundo: o formulário (#forms). Um só, no fim.
 * [x] 12. Sem keyword stuffing: a keyword-alvo aparece onde caberia se o
 *          Google não existisse. Sem sinônimo empilhado, sem lista de cidades.
 * [x] 13. Frases do dono usadas palavra por palavra quando existem ("pronto
 *          para postar", "views somadas", "baixou, publicou"). Vocabulário do §10.
 * [x] 14. Teste final (§45): "eu publicaria isso se o Google não existisse?"
 *          Se não, reescrever — não ajustar.
 * ────────────────────────────────────────────────────────────────────────── */
