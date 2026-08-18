import type { Pagina } from '../../tipos';

/**
 * A plataforma onde um perfil sem audiência ainda alcança gente — e o que isso
 * muda para quem posta em nome de uma marca.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 * Sobre a DOXA (o único tipo de fato que o source of truth governa):
 *  · TikTok é uma das três redes da garantia, ao lado de Instagram e YouTube
 *    Shorts → `supabase/manual-seed-v1.sql`; `src/components/Hero.tsx`;
 *  · a redação mais ampla ("TikTok, Instagram, YouTube e outras redes
 *    relevantes") → `src/components/faq/config.ts`, chave `redes`;
 *  · views 100% orgânicas, sem compra de mídia → chave `organico`;
 *  · não garantir que um vídeo específico viralize → chave `viralizar-garantido`;
 *  · o entregável vertical, legendado, pronto para postar, publicado pelo
 *    cliente → `src/components/HowItWorks.tsx`;
 *  · o mesmo arquivo nas três redes no mesmo dia, um vídeo por dia útil e a
 *    proibição de impulsionar nos perfis da estratégia → `RT-1`, `RT-2` e a
 *    seção de impulsionamento do manual (`supabase/manual-seed-v1.sql`),
 *    apresentados como o que se combina com quem JÁ é cliente (§8);
 *  · público e empresas pequenas → chaves `para-quem` e `pequenas`.
 *
 * Sobre a PLATAFORMA: o texto descreve mecânica de distribuição sem número,
 * sem citar política interna do TikTok e sem prometer posição. Não há fonte no
 * projeto para estatística de rede social, e por isso não há nenhuma aqui.
 */
export const pagina: Pagina = {
  tipo: 'plataforma',
  slug: 'tiktok-para-empresas',
  titulo: 'TikTok para empresas: o que muda quando o perfil é de marca',
  descricao:
    'Por que um perfil novo ainda alcança gente no TikTok, o que trava um perfil de empresa na rede e como a Doxa opera conteúdo vertical por lá, sem impulsionar.',
  h1: 'TikTok para empresas',
  resumo:
    'No TikTok, quem decide o alcance de um vídeo é o desempenho dele, não o tamanho do perfil que o publicou — e é isso que mantém a porta aberta para uma empresa que está começando. O preço dessa porta é publicar com constância e aceitar que cada vídeo recomeça a disputa do zero.',
  intencao: 'comercial',
  palavrasChave: [
    'tiktok para empresas',
    'marketing no tiktok para negócios',
    'tiktok b2b',
    'como usar tiktok na empresa',
    'perfil de marca no tiktok',
  ],
  hubs: ['/guias/marketing-no-tiktok'],
  relacionadas: [
    '/guias/como-viralizar-no-tiktok',
    '/glossario/algoritmo-do-tiktok',
    '/comparativos/tiktok-vs-instagram',
    '/solucoes/videos-curtos-para-empresas',
    '/plataformas/instagram-reels-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Conte como está o perfil da sua empresa no TikTok hoje. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que muda em relação a uma rede de seguidores',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Numa rede organizada por seguidores, publicar para dez pessoas alcança dez pessoas: o tamanho da audiência é o teto. No TikTok o feed principal é de recomendação — o vídeo é mostrado a um público que não segue o perfil, e o que ele fizer ali decide se será mostrado a mais gente. Isso tem duas consequências opostas, e as duas importam para uma empresa.',
    },
    {
      tipo: 'lista',
      itens: [
        'A boa: um perfil novo não está condenado. Não é preciso acumular audiência antes de alcançar alguém.',
        'A dura: nada é acumulado de graça. Um vídeo que foi bem não garante o próximo — cada peça recomeça a disputa, e é por isso que a rede pune quem posta em rajada e some.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os três erros que travam um perfil de empresa',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Transformar o perfil em catálogo',
          texto:
            'Uma sequência de vídeos de produto, sem nada além do produto, é anúncio sem verba: ninguém escolhe assistir. O que sustenta um perfil de marca é o assunto em volta do produto — a dúvida que o cliente traz, o erro que ele comete, o bastidor que explica o preço.',
        },
        {
          titulo: 'Republicar peça de campanha',
          texto:
            'Vídeo feito para TV, site ou reunião chega aqui com a linguagem errada: começa se apresentando, fala de si e demora. É o único formato que a rede identifica em dois segundos, e o polegar também.',
        },
        {
          titulo: 'Desistir no segundo mês',
          texto:
            'A conta que quase todo perfil de empresa faz: publica em rajada por três semanas, não vê retorno e para. Como a distribuição é por vídeo, parar significa recomeçar — e quem recomeça três vezes gastou três vezes sem completar nenhum ciclo de aprendizado.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Impulsionar aqui custa caro em dado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Nos perfis onde a operação da Doxa está ativa, impulsionar, turbinar ou promover publicação é proibido — inclusive posts que não são da Doxa —, e campanhas antigas nesses perfis são pausadas antes da primeira publicação. Não é purismo: alcance comprado se mistura ao orgânico e some com a única informação que interessa, que é o que o vídeo conseguiu fazer sozinho. As visualizações contabilizadas nas metas da Doxa são 100% orgânicas, provenientes da distribuição dos conteúdos produzidos dentro da operação.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Comprar seguidor, curtida ou visualização é pior do que inútil: contamina o resultado, viola a metodologia e pode gerar penalização das redes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O TikTok é uma das três redes que a Doxa usa como referência da operação, ao lado do Instagram e do YouTube Shorts — as visualizações da meta são somadas entre elas, conforme as condições e o prazo do contrato. O que chega ao cliente é o arquivo pronto para postar, vertical e legendado, e quem publica no perfil da empresa é a própria empresa. A rotina combinada com quem já é cliente prevê o mesmo conteúdo nas três redes, no mesmo dia, e no máximo um vídeo da operação por dia útil.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A estratégia de cada operação pode envolver TikTok, Instagram, YouTube e outras redes relevantes para o público da empresa — a distribuição é definida pelo comportamento da audiência, não por preferência de rede. O formato em si, que é o mesmo nas três, está em [vídeos curtos para empresas](/solucoes/videos-curtos-para-empresas).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Para quem o TikTok compensa',
    },
    {
      tipo: 'lista',
      itens: [
        'Empresas que precisam ser conhecidas por quem ainda não as procura: é a rede em que alcançar desconhecidos é o comportamento padrão.',
        'Marcas que têm assunto além do catálogo, e alguém disposto a falar dele com regularidade.',
        'Negócios B2B, com linguagem e formatos adaptados — decisor também rola feed, e o argumento é que ele encontre a sua empresa antes de precisar dela.',
        'Não compensa para quem quer testar por um mês. Sem constância, o teste não mede a rede: mede a desistência.',
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
          pergunta: 'Em quais redes sociais vocês publicam os conteúdos?',
          resposta:
            'A estratégia pode envolver TikTok, Instagram, YouTube e outras redes relevantes para o público da empresa. A distribuição é definida de acordo com o comportamento da audiência e os objetivos de cada operação.',
        },
        {
          pergunta: 'As visualizações do TikTok são orgânicas?',
          resposta:
            'As visualizações contabilizadas nas metas da Doxa são 100% orgânicas, provenientes da distribuição dos conteúdos produzidos dentro da nossa operação. Sem depender da compra de mídia para atingir as metas contratadas.',
        },
        {
          pergunta: 'Vocês conseguem garantir que meu conteúdo vai viralizar no TikTok?',
          resposta:
            'Não garantimos que um vídeo específico vai viralizar. O que fazemos é construir uma operação com volume, dados e testes suficientes para aumentar significativamente as chances de alcançar grandes audiências. Nossa garantia está relacionada à performance total contratada, e não ao desempenho de um único conteúdo.',
        },
        {
          pergunta: 'Minha empresa é pequena. Vale a pena estar no TikTok?',
          resposta:
            'Empresas pequenas também podem trabalhar com a Doxa, desde que exista potencial para transformar conteúdo em um canal relevante de crescimento. O mais importante não é o tamanho da empresa, e sim os objetivos, o mercado, o produto e a capacidade de aproveitar a audiência gerada pela operação.',
        },
        {
          pergunta: 'Preciso postar todo dia?',
          resposta:
            'A rotina combinada com quem já é cliente da Doxa prevê no máximo um vídeo da operação por dia útil, com pelo menos 24 horas entre um e outro: dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance do outro. O volume exato de cada operação é definido pela estratégia e pela meta de performance do cliente.',
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
        'Antes de abrir o perfil, escolha o assunto: três temas sobre os quais a sua empresa consegue falar por seis meses sem repetir. Perfil de marca não morre por falta de câmera, morre por falta de pauta. Para montar isso com o time da Doxa, quem preenche o formulário é chamado em até 24 horas para marcar a auditoria estratégica.',
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
