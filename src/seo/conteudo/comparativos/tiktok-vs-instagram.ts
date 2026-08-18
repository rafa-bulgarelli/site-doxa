import type { Pagina } from '../../tipos';

/**
 * O comparativo que atende dois hubs ao mesmo tempo (TikTok e Instagram) e por
 * isso é o mais exposto a virar lista de senso comum. A defesa contra isso:
 * comparar por MECANISMO — o que cada rede foi desenhada para fazer — e não por
 * estatística de audiência, que aqui não teria fonte citável.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · as três redes da operação da Doxa (Instagram, TikTok e YouTube Shorts) →
 *    fonte: `docs/seo/source-of-truth.md` §2 e §3
 *    (`supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21`);
 *  · o mesmo arquivo, no mesmo dia, nas três redes; 60 conteúdos únicos em 90
 *    dias → fonte: `docs/seo/source-of-truth.md` §8, regra `RT-1`
 *    (`supabase/manual-seed-v1.sql:183`);
 *  · um vídeo por dia útil e 24 horas de relógio entre publicações → fonte: §8,
 *    regras `RT-2` e `RH-1`;
 *  · o entregável vertical, legendado, no formato do feed → fonte: §2
 *    (`src/components/HowItWorks.tsx:92`);
 *  · a estratégia pode envolver TikTok, Instagram, YouTube e outras redes
 *    relevantes para o público da empresa → fonte: §2
 *    (`src/components/faq/config.ts:392-393`). CUIDADO registrado no source of
 *    truth: a garantia conta as três redes fixas; a estratégia pode envolver
 *    outras. Esta página não diz que a garantia cobre rede fora das três;
 *  · retorno em até 24 horas → fonte: §2.
 *
 * NENHUM número sobre as plataformas entra aqui — nem usuários, nem idade média,
 * nem tempo de sessão. Não há fonte citável no projeto para nenhum deles, e o
 * brief proíbe estatística de terceiro sem fonte nomeada. A comparação é de
 * desenho de produto: o que cada rede faz com um vídeo novo.
 */
export const pagina: Pagina = {
  tipo: 'comparativo',
  slug: 'tiktok-vs-instagram',
  titulo: 'TikTok ou Instagram: onde a sua marca cresce mais rápido',
  descricao:
    'Uma rede foi desenhada para mostrar vídeo de quem você não segue; a outra, para manter a relação com quem já te segue. O que isso muda na sua estratégia.',
  h1: 'TikTok ou Instagram',
  resumo:
    'TikTok foi desenhado para entregar vídeo de gente que você não segue; o Instagram, para sustentar a relação com quem já segue e vender para essa base. Por isso um cresce mais rápido em descoberta e o outro converte melhor no fim da conversa — e por isso a resposta prática quase nunca é escolher, e sim publicar o mesmo arquivo nos dois com expectativas diferentes.',
  intencao: 'informacional',
  palavrasChave: [
    'tiktok ou instagram',
    'tiktok vs reels',
    'qual rede escolher',
    'diferença entre tiktok e instagram',
    'onde postar vídeo curto',
  ],
  hubs: ['/guias/marketing-no-tiktok', '/guias/reels-no-instagram'],
  relacionadas: [
    '/plataformas/tiktok-para-empresas',
    '/plataformas/instagram-reels-para-empresas',
    '/guias/como-viralizar-no-tiktok',
    '/guias/como-crescer-no-instagram-organicamente',
    '/plataformas/youtube-shorts-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a conclusão é publicar nas duas e o problema é produzir para as duas, conte quantos vídeos a sua empresa precisa por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Duas redes, dois problemas diferentes',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A diferença que explica quase todas as outras é o que cada aplicativo mostra quando você abre. No TikTok, a tela inicial é de recomendação: o que aparece vem de perfis que você não segue, e a base de seguidores conta pouco para o vídeo de hoje. No Instagram, o vídeo de quem você não segue divide espaço com o resto — feed de quem você acompanha, stories, mensagens — porque a rede foi construída em torno de uma lista de contatos, e o vídeo entrou depois.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A consequência prática é direta: o TikTok é um mecanismo de **descoberta**, e o Instagram é um mecanismo de **relação**. Uma marca desconhecida tende a ser encontrada mais rápido no primeiro; uma marca que já tem base tende a vender melhor no segundo. Nenhuma das duas frases é sobre qualidade: é sobre o que cada produto foi desenhado para fazer.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A comparação, critério a critério',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Critério', 'TikTok', 'Instagram'],
      linhas: [
        ['De onde vem o alcance', 'Recomendação para quem não segue', 'Mistura de seguidores e recomendação'],
        ['Perfil novo, sem base', 'Consegue alcance desde os primeiros vídeos', 'Costuma depender mais de base e de tempo'],
        ['Formatos disponíveis', 'O vídeo vertical é o centro de tudo', 'Vídeo, foto, carrossel, stories e mensagem'],
        ['Como a audiência responde', 'Comentário público, em volume', 'Conversa privada: salvar, story e mensagem direta'],
        ['Papel no funil', 'Descoberta de quem nunca ouviu falar', 'Prova, catálogo e fechamento da conversa'],
        ['Tolerância a conteúdo cru', 'Alta: produção caseira é a norma', 'Média — o perfil também é vitrine'],
        ['O arquivo do vídeo', 'Vertical e legendado', 'O mesmo, com atenção à área segura da tela'],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o TikTok ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Começar do zero.** Um perfil sem seguidores pode ter alcance no primeiro vídeo, porque a entrega não depende de base — depende do que o vídeo faz com quem o recebe.',
        '**Testar rápido.** Como cada peça é avaliada quase isoladamente, dá para descobrir em poucos dias qual assunto interessa e qual não interessa.',
        '**Assunto acima de marca.** Quem não conhece a empresa assiste mesmo assim, se o vídeo for bom. É a rede em que o conteúdo carrega a marca, e não o contrário.',
        '**Linguagem direta.** Produção caseira não é desvantagem ali; em muitos casos é o que faz o vídeo parecer legítimo.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o Instagram ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Fechar a conversa.** A pessoa assiste, olha o perfil, vê a prova, manda mensagem. O caminho inteiro acontece dentro do aplicativo.',
        '**Sustentar a relação.** Stories e mensagem direta mantêm contato com quem já conhece a marca — e é dessa base que costuma sair a venda repetida.',
        '**Formatos que o vídeo não cobre.** Carrossel explicativo, foto de produto, catálogo, lista de perguntas. Nem toda informação cabe em vídeo.',
        '**Ser onde a empresa já é procurada.** Muita gente confere o perfil da marca antes de comprar. Perfil vazio ali custa venda de um jeito que nenhuma outra rede compensa.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A resposta depende de qual é a sua escassez. Falta gente que conheça a marca: TikTok primeiro. Falta transformar quem já conhece em cliente: Instagram primeiro. Falta as duas coisas — que costuma ser o caso — o TikTok tende a dar sinal antes, e o Instagram precisa existir do mesmo jeito, porque é lá que a compra é conferida.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A resposta prática: o mesmo arquivo nas duas',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A pergunta "qual escolher" costuma nascer de uma premissa errada — a de que publicar nas duas custa o dobro. Não custa: o formato é o mesmo. Um vídeo vertical, legendado, no formato do feed serve às duas redes, e é assim que operações de volume trabalham: uma peça, publicada em todas elas.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que muda de uma rede para outra não é a peça, é a **expectativa**. O mesmo vídeo pode render alcance alto no TikTok e conversa no Instagram, e comparar os dois números como se medissem a mesma coisa leva à conclusão errada. Compare cada rede com ela mesma, mês a mês. A terceira, que quase ninguém completa, está em [YouTube Shorts para empresas](/plataformas/youtube-shorts-para-empresas).',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Dois cuidados de execução valem para as duas: a legenda precisa ficar fora da área que a interface cobre — e a interface não fica no mesmo lugar nas duas —, e o intervalo entre publicações deve ser respeitado em cada rede, porque dois vídeos publicados perto demais disputam a mesma audiência ali dentro.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'É por isso que a operação da Doxa nasce multiplataforma, e o desenho é condição de quem já é cliente: 60 conteúdos únicos em 90 dias, um por dia útil, o mesmo arquivo publicado nas três redes no mesmo dia, conforme as condições e o prazo do contrato. Quem publica é o cliente, no perfil dele — o que chega é o vídeo pronto para postar.',
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
          pergunta: 'Publicar o mesmo vídeo nas duas redes prejudica o alcance?',
          resposta:
            'Publicar nas duas não derruba uma à outra, e o mesmo arquivo vertical serve às duas. O cuidado é com o selo que uma rede grava no arquivo baixado dela e que aparece na outra, sinal costumeiramente lido como conteúdo reciclado — o caminho é exportar do editor, e não baixar de uma rede para subir na outra.',
        },
        {
          pergunta: 'Por onde começar se só der para manter uma?',
          resposta:
            'Se a empresa é desconhecida e precisa ser descoberta, o TikTok dá sinal mais rápido. Se ela já é procurada pelo nome e o problema é converter, o Instagram resolve antes. Vale lembrar que o perfil do Instagram é conferido por quem vai comprar mesmo quando não é o canal de publicação — nesse caso, ele existe como vitrine, ainda que não seja onde o esforço está.',
        },
        {
          pergunta: 'Reels e TikTok pedem edições diferentes?',
          resposta:
            'A peça é a mesma; o ajuste é de enquadramento. Cada rede cobre partes diferentes da tela com botões, legendas e nome do perfil, e o que precisa mudar é a posição do texto para não ficar escondido. Roteiro, corte e ritmo não mudam.',
        },
        {
          pergunta: 'E o YouTube Shorts, entra nessa conta?',
          resposta:
            'Entra, e costuma ser a rede que mais gente deixa de fora. O mesmo arquivo serve, e o custo de publicar ali é o de mais um upload. Numa operação que já produz vídeo vertical em volume, deixar o Shorts vazio é abrir mão de distribuição que já está paga.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Em uma frase',
    },
    {
      tipo: 'paragrafo',
      texto:
        'TikTok é onde a sua marca é descoberta e Instagram é onde ela é conferida — e como o arquivo é o mesmo, escolher entre as duas costuma ser resolver o problema errado.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: descoberta × relação, e o que isso muda.
 * [x]  2. Todo fato sobre a Doxa vem do source of truth (três redes, RT-1,
 *          60 conteúdos em 90 dias, entregável, 24 horas).
 * [x]  3. Nada da §9: nenhum número de plataforma, nenhum dado de audiência.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada; a página fala da rotina de publicação e não
 *          afirma cobertura de garantia em rede nenhuma.
 * [x]  6. Intenção própria: escolha entre redes. Os hubs organizam cada
 *          cluster; as páginas de plataforma falam de contratar.
 * [x]  7. Informação incremental: a comparação por desenho de produto, a área
 *          segura da tela e a regra do mesmo arquivo no mesmo dia.
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Pertence aos DOIS hubs do caso; links para as plataformas, os guias
 *          de execução e a terceira rede.
 * [x] 10. IMPARCIAL: quatro vantagens de cada lado e um veredito que depende da
 *          escassez de quem lê.
 * [x] 11. CTA único, no fim, condicionado.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "pronto para postar", "vertical, legendado, no
 *          formato do feed", "60 conteúdos".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
