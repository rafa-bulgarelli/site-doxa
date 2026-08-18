import type { Pagina } from '../../tipos';

/**
 * A money page do cluster orgânico: o canal como ativo da empresa, não como
 * técnica. Volume e operação são assunto de `/solucoes/producao-de-conteudo-em-escala`.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · "views somadas" e "conteúdo vertical em escala" → `public/llms.txt`,
 *    source of truth §1 e §10;
 *  · as visualizações 100% orgânicas, sem compra de mídia → `src/components/faq/config.ts`,
 *    chave `organico`, palavra por palavra;
 *  · "não é preciso investir em mídia… complementar com anúncios é separado" →
 *    chave `midia-extra` do mesmo arquivo;
 *  · a garantia, na redação prudente ("metas de performance definidas em
 *    contrato… condições de garantia previstas no contrato") → chave
 *    `nao-bater`; a manchete "Um milhão de views. Ou seu dinheiro de volta." →
 *    `GARANTIA_PT` em `src/components/comparacao/config.ts`;
 *  · não garantir que um vídeo específico viralize → chave `viralizar-garantido`;
 *  · performance monitorada durante toda a operação → chave `acompanhar`;
 *  · público e empresas pequenas → chaves `para-quem` e `pequenas`;
 *  · a cadência de um vídeo por dia útil, a janela de 24 h de relógio e a
 *    proibição de impulsionar nos perfis da estratégia → regras `RT-2`, `RH-1`
 *    e a seção de impulsionamento do manual do cliente
 *    (`supabase/manual-seed-v1.sql`), citadas AQUI como o que a Doxa combina com
 *    quem já é cliente — source of truth §8 exige essa moldura;
 *  · 60 conteúdos em 90 dias, nas três redes → `RT-1` e a linha de apoio do
 *    hero, com a ressalva "conforme as condições e o prazo do contrato" (§3c).
 *
 * O que NÃO está aqui: preço, prazo do primeiro vídeo, fidelidade e qualquer
 * número de mercado sobre alcance orgânico — não há fonte para nenhum deles.
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'conteudo-organico-para-empresas',
  titulo: 'Conteúdo orgânico para empresas: o canal que não para',
  descricao:
    'O que o alcance orgânico cobra de uma empresa, por que ele continua rendendo depois que a verba acaba, e como a Doxa opera esse canal em vídeo vertical.',
  h1: 'Conteúdo orgânico para empresas',
  resumo:
    'Conteúdo orgânico é alcance conquistado: a plataforma entrega o vídeo porque as pessoas assistiram, não porque alguém pagou por impressão. O preço disso não é verba, é constância — volume, cadência e critério, todo mês. Abaixo, o que esse canal exige, onde ele falha, e o que a Doxa assume quando uma empresa decide construí-lo.',
  intencao: 'comercial',
  palavrasChave: [
    'conteúdo orgânico para empresas',
    'marketing orgânico para empresas',
    'crescimento orgânico nas redes sociais',
    'alcance orgânico para marca',
    'canal orgânico de conteúdo',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/comparativos/organico-vs-pago',
    '/solucoes/producao-de-conteudo-em-escala',
    '/guias/como-aumentar-o-alcance-organico',
    '/guias/estrategia-de-conteudo-para-empresas',
    '/glossario/alcance-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Conte em quais redes a sua empresa publica hoje e com que frequência. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Alcance comprado e alcance conquistado não são a mesma moeda',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Anúncio é aluguel de atenção: você paga por impressão e recebe impressão. No dia em que a verba para, o alcance para junto, e o que ficou foi o que a campanha conseguiu converter enquanto rodava. Conteúdo orgânico funciona ao contrário — a plataforma distribui porque **as pessoas assistiram**, e um vídeo que segurou audiência continua sendo entregue depois, sem custo adicional por pessoa alcançada.',
    },
    {
      tipo: 'lista',
      itens: [
        'O que o pago compra: velocidade e controle. Você escolhe quem vê, quando, e desliga na hora.',
        'O que o orgânico constrói: um ativo. Cada vídeo que funcionou continua entregando e ensina qual é o próximo.',
        'O que o orgânico não faz: aparecer amanhã. Ele cobra meses antes de virar canal previsível, e é por isso que empresa nenhuma deveria trocar um pelo outro do dia para a noite.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A escolha entre os dois raramente é definitiva, e ela tem uma página inteira só para si em [orgânico ou pago](/comparativos/organico-vs-pago). Aqui o assunto é o segundo caminho: o que ele exige de uma empresa que decide levá-lo a sério.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os três compromissos que o canal orgânico cobra',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Volume, porque sem ele não existe dado',
          texto:
            'Uma empresa que publica quatro vídeos por mês tem quatro amostras por mês. Nenhuma conclusão sobre hook, formato ou tema se sustenta nesse tamanho, e o mês termina com opinião no lugar de leitura.',
        },
        {
          titulo: 'Cadência, porque os seus vídeos competem entre si',
          texto:
            'Publicar cinco vídeos numa quinta-feira para compensar a semana parada não recupera nada: dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance do outro. Ritmo vale mais do que esforço concentrado.',
        },
        {
          titulo: 'Critério, porque nem todo número é resultado',
          texto:
            'Views de um público que nunca vai comprar são views. O trabalho é decidir o que repetir e o que descartar — e essa decisão não terceiriza para métrica nenhuma.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A janela de 24 horas, que é a regra que quase ninguém segue',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Na operação da Doxa isso é combinado por escrito com quem já é cliente, no manual que ele aceita ao contratar: **no máximo um vídeo da operação por dia útil**, e com pelo menos 24 horas de relógio entre um e outro. A janela existe para preservar a distribuição do vídeo anterior, que ainda está sendo entregue quando o seguinte estreia; o exemplo de como ela cai na semana está em [como viralizar no TikTok](/guias/como-viralizar-no-tiktok).',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'A regra é sobre vídeo curto; o resto do perfil segue rodando. Como essa convivência funciona no dia a dia está em [Reels para empresas](/plataformas/instagram-reels-para-empresas).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Zero impulsionamento: uma regra, não uma preferência',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Nos perfis em que a estratégia está ativa, impulsionar, turbinar ou promover publicação é proibido — inclusive posts que não são da Doxa —, e campanhas antigas nesses perfis são pausadas antes da primeira publicação. Google Ads e campanhas em outros perfis continuam permitidos. O motivo é aritmético: alcance comprado contamina a leitura do que a distribuição orgânica fez sozinha, e uma operação que mede errado otimiza errado.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É a mesma razão pela qual comprar seguidor, curtida ou visualização está fora de cogitação: além de violar a metodologia e poder gerar penalização das redes, engajamento artificial estraga exatamente o dado que a operação usa para decidir o próximo vídeo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa produz conteúdo vertical em escala e cuida da estratégia de distribuição do que produz. A referência de volume da operação é de **sessenta conteúdos únicos em noventa dias**, publicados no Instagram, no TikTok e no YouTube Shorts, conforme as condições e o prazo do contrato. As visualizações contabilizadas nas metas são 100% orgânicas, provenientes da distribuição dos conteúdos produzidos dentro da operação, sem depender da compra de mídia.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto: 'Um milhão de views. Ou seu dinheiro de volta.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A letra dessa manchete: a Doxa trabalha com metas de performance definidas em contrato. Caso a quantidade de visualizações acordada não seja atingida dentro do período estabelecido, são aplicadas as condições de garantia previstas no contrato. A garantia existe justamente para alinhar o resultado da Doxa ao resultado do cliente — e ela é sobre a performance total contratada, nunca sobre um vídeo específico.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Para quem esse canal compensa',
    },
    {
      tipo: 'lista',
      itens: [
        'Empresas que querem transformar conteúdo em um canal previsível e escalável de crescimento, e marcas que precisam ganhar relevância e ocupar espaço de forma consistente.',
        'Empresas pequenas, desde que exista potencial para transformar conteúdo em um canal relevante de crescimento: o que pesa não é o tamanho, e sim objetivo, mercado, produto e capacidade de aproveitar a audiência gerada.',
        'Não compensa para quem precisa de venda nesta semana. Para prazo curto e alvo estreito, mídia paga resolve melhor — e dizer o contrário seria vender o canal errado.',
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
          pergunta: 'As visualizações são orgânicas mesmo?',
          resposta:
            'As visualizações contabilizadas nas metas da Doxa são 100% orgânicas, provenientes da distribuição dos conteúdos produzidos dentro da nossa operação. Sem depender da compra de mídia para atingir as metas contratadas.',
        },
        {
          pergunta: 'Preciso investir em mídia além do valor pago para a Doxa?',
          resposta:
            'Para atingir as metas orgânicas contratadas com a Doxa, não é preciso investir em mídia. Nossa operação é desenvolvida para gerar distribuição sem depender de mídia paga. Se a empresa quiser complementar a estratégia com anúncios, isso pode ser feito separadamente.',
        },
        {
          pergunta: 'Vocês conseguem garantir que meu conteúdo vai viralizar?',
          resposta:
            'Não garantimos que um vídeo específico vai viralizar. O que fazemos é construir uma operação com volume, dados e testes suficientes para aumentar significativamente as chances de alcançar grandes audiências. Nossa garantia está relacionada à performance total contratada, e não ao desempenho de um único conteúdo.',
        },
        {
          pergunta: 'Eu consigo acompanhar quantas visualizações os conteúdos estão tendo?',
          resposta:
            'A performance é acompanhada durante toda a operação: visualizações e outros indicadores relevantes são monitorados o tempo todo. Assim, tanto a Doxa quanto o cliente acompanham a evolução da estratégia e o progresso em relação às metas contratadas.',
        },
        {
          pergunta: 'Posso continuar anunciando enquanto a operação orgânica roda?',
          resposta:
            'Nos perfis em que a estratégia está ativa, impulsionar publicações é proibido, e campanhas antigas nesses perfis precisam ser pausadas antes da primeira publicação. Google Ads e campanhas em outros perfis continuam permitidos, e complementar a estratégia com anúncios fora desses perfis é feito separadamente.',
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
        'O teste mais barato antes de contratar qualquer coisa é olhar os últimos noventa dias do seu perfil e contar duas coisas: quantos vídeos curtos saíram e quantos dias ficaram vazios. O primeiro número diz se existe dado; o segundo diz se existe rotina. Quem quiser fazer essa leitura acompanhado começa por uma conversa: quem preenche o formulário é chamado em até 24 horas para marcar a auditoria estratégica.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase RESPONDE a busca. Sem aquecimento, sem "no mundo
 *          digital", sem "cada vez mais empresas", sem definir o óbvio antes.
 * [x]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md.
 *          Cliente, número, prazo, preço, garantia e depoimento: zero invenção.
 * [x]  3. Nada da §9 (NÃO PUBLICÁVEL) apareceu — nem parafraseado, nem
 *          "suavizado": preço, mensalidade, fidelidade, direitos do vídeo,
 *          agência licenciada, os 1.500 clientes, "parceiros".
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
 *          para postar", "views somadas", "clone"). Vocabulário do §10.
 * [x] 14. Teste final (§45): "eu publicaria isso se o Google não existisse?"
 *          Se não, reescrever — não ajustar.
 * ────────────────────────────────────────────────────────────────────────── */
