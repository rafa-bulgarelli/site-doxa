import type { Pagina } from '../../tipos';

/**
 * O comparativo de cabeça do cluster orgânico — e o que mais exige imparcialidade,
 * porque a Doxa está de um dos lados. A régua do §11/§37 do brief: dar razão ao
 * pago onde ele ganha, com nome e situação, e não concluir que orgânico é sempre
 * a resposta.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · a Doxa não é tráfego pago; a garantia é de views orgânicas somadas, não de
 *    anúncios → fonte: `docs/seo/source-of-truth.md` §1 (`public/llms.txt:42`);
 *  · as visualizações contabilizadas nas metas são 100% orgânicas → fonte:
 *    `docs/seo/source-of-truth.md` §8 (`src/components/faq/config.ts:174-175`);
 *  · não é preciso investir em mídia para atingir as metas orgânicas
 *    contratadas; complementar com anúncios é separado → fonte:
 *    `docs/seo/source-of-truth.md` §8 (`src/components/faq/config.ts:344-345`);
 *  · nos perfis com a estratégia ativa é proibido impulsionar, turbinar ou
 *    promover publicações — inclusive as que não são da Doxa —, e campanhas
 *    antigas nesses perfis são pausadas antes da primeira publicação; Google Ads
 *    e campanhas em OUTROS perfis continuam permitidos → fonte:
 *    `docs/seo/source-of-truth.md` §8 (`supabase/manual-seed-v1.sql:241`);
 *  · a redação prudente da garantia ("metas de performance definidas em
 *    contrato") → fonte: `docs/seo/source-of-truth.md` §3(b)
 *    (`src/components/faq/config.ts:110-111`);
 *  · retorno em até 24 horas e auditoria estratégica → fonte:
 *    `docs/seo/source-of-truth.md` §2.
 *
 * Nenhum número de mercado entra aqui: não há no repositório fonte citável para
 * custo de mídia, CPM, CTR ou taxa de conversão, e uma média inventada viraria
 * promessa sobre o dinheiro de quem lê.
 *
 * O que NÃO está aqui de propósito: preço da Doxa, verba mínima recomendada e
 * qualquer comparação de ROI com número. Ver §9 do source of truth.
 */
export const pagina: Pagina = {
  tipo: 'comparativo',
  slug: 'organico-vs-pago',
  titulo: 'Orgânico ou pago: o que cada um compra de verdade',
  descricao:
    'Pago compra alcance imediato e para quando a verba para; orgânico demora e continua rendendo. A comparação por custo, prazo, previsibilidade e o que sobra.',
  h1: 'Orgânico ou pago',
  resumo:
    'Pago compra alcance imediato e para quando a verba para; orgânico demora mais e continua rendendo depois. A escolha quase nunca é permanente — o que muda é qual dos dois sustenta o mês seguinte. Esta página compara os dois por custo, prazo, previsibilidade e o que sobra quando você desliga.',
  intencao: 'informacional',
  palavrasChave: [
    'orgânico ou pago',
    'tráfego pago ou orgânico',
    'mídia paga vs orgânico',
    'alcance orgânico ou anúncio',
    'marketing orgânico e anúncios',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/solucoes/conteudo-organico-para-empresas',
    '/guias/como-aumentar-o-alcance-organico',
    '/glossario/alcance-organico',
    '/comparativos/agencia-vs-equipe-interna',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a decisão for construir o lado orgânico, conte quantos vídeos a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que cada um compra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Mídia paga compra distribuição: você entrega dinheiro e a plataforma entrega impressões, com público, geografia e horário definidos por você. É uma transação, e ela se encerra quando a verba acaba. Conteúdo orgânico compra **acúmulo**: cada peça publicada continua podendo ser entregue depois, e o que fica não é a impressão de ontem — é uma biblioteca e uma audiência que já sabem quem você é.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Daí sai a única regra que vale para os dois: pago resolve o mês, orgânico resolve o ano. Quem precisa de resultado em quinze dias e não tem histórico de conteúdo não vai conseguir isso organicamente; quem quer parar de pagar por cada visualização não vai conseguir isso comprando mídia.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A comparação, critério a critério',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Critério', 'Orgânico', 'Pago'],
      linhas: [
        ['Primeiro resultado', 'Semanas a meses, por acúmulo', 'No mesmo dia em que a campanha sobe'],
        ['Custo do próximo resultado', 'Tende a cair conforme a biblioteca cresce', 'Constante: cada impressão é comprada de novo'],
        ['Quando você desliga', 'O que já foi publicado continua sendo entregue', 'A entrega para junto com a verba'],
        ['Controle de quem vê', 'Baixo — a plataforma escolhe a audiência', 'Alto: segmentação, região, público semelhante'],
        ['Previsibilidade no curto prazo', 'Baixa: um mês pode não ter nenhuma peça forte', 'Alta: verba e entrega têm relação estável'],
        ['Teto de escala', 'Limitado pelo que a audiência aguenta consumir', 'Limitado pelo caixa disponível'],
        ['Data marcada', 'Arriscado: não se agenda a distribuição', 'Confiável: entrega no dia contratado'],
        ['O que fica no fim', 'Biblioteca de conteúdo e audiência própria', 'Aprendizado de campanha e listas de público'],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o pago ganha, sem discussão',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Esta seção existe porque comparativo que só tem um vencedor não é comparativo. Há situações em que insistir no orgânico é teimosia cara:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Data marcada.** Lançamento, inauguração, temporada, Black Friday. Distribuição orgânica não se agenda; verba, sim.',
        '**Público estreito e identificável.** Cargo específico, região específica, base de clientes já conhecida. A segmentação faz em uma semana o que o conteúdo levaria um ano para alcançar por acaso.',
        '**Retomada de quem já demonstrou interesse.** Quem visitou, abandonou o carrinho ou assistiu metade do vídeo é audiência que só a mídia paga permite chamar de volta na hora certa.',
        '**Teste rápido de oferta.** Descobrir se a promessa vende, e não se o vídeo prende, é uma pergunta que se responde em dias com verba e em meses sem ela.',
        '**Negócio local com raio pequeno.** Um público de poucos quilômetros raramente é servido bem pela distribuição orgânica, que não entende geografia como você entende.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o orgânico ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**O custo da próxima visualização.** No pago, o milésimo resultado custa como o primeiro. No orgânico, o custo está na produção — e a peça publicada em março pode continuar sendo entregue em agosto.',
        '**O que sobra.** Campanha desligada deixa relatório. Conteúdo publicado deixa biblioteca, audiência e material que o time comercial usa em conversa de venda.',
        '**Confiança.** Um perfil com histórico responde à pergunta que todo anúncio deixa em aberto: "essa empresa existe mesmo?". É a pesquisa que quase todo comprador faz antes de decidir.',
        '**Independência do caixa.** Mês apertado corta verba de mídia antes de qualquer outra coisa. O canal que depende só de verba desaparece exatamente no mês em que era mais necessário.',
        '**Dado sobre mensagem, não sobre público.** O orgânico diz o que as pessoas querem ouvir de você; o pago diz para quem vale a pena falar. São aprendizados diferentes, e o primeiro melhora o segundo.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O erro que estraga os dois ao mesmo tempo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É impulsionar a publicação orgânica do próprio perfil e continuar lendo o resultado como se fosse orgânico. A partir daí não há como saber se o vídeo se sustentou sozinho ou se a entrega foi comprada, e a decisão do que produzir em seguida passa a ser tomada com um número que não significa nada.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É uma regra dura o suficiente para a Doxa escrevê-la no manual de quem contrata: nos perfis em que a estratégia orgânica está ativa, nada é impulsionado, turbinado ou promovido — inclusive publicações que não fazem parte da operação —, e campanhas antigas nesses perfis são pausadas antes da primeira publicação. Anúncios em outros perfis e em outros canais, como busca, seguem permitidos: o que não pode é misturar as duas leituras no mesmo lugar.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A resposta honesta é "depende de quando você precisa do resultado". Se a data é este mês, comece pelo pago e construa o orgânico em paralelo. Se a pergunta é como parar de depender da verba no ano que vem, o orgânico precisa começar agora, porque ele cobra tempo antes de pagar.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como decidir no seu caso',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Escreva a data',
          texto:
            'Existe um compromisso com dia marcado — um lançamento, um evento, uma meta de trimestre? Se existe, parte da verba vai para mídia, e essa parte não está em discussão.',
        },
        {
          titulo: 'Pergunte o que acontece se você desligar',
          texto:
            'Simule cortar a verba por dois meses. Se a empresa fica sem canal nenhum, o problema não é escolher entre orgânico e pago: é depender de um só.',
        },
        {
          titulo: 'Separe os perfis e a leitura',
          texto:
            'Defina onde o orgânico será medido e não impulsione nada ali. Anúncio roda em outro lugar, com outro relatório. Duas leituras separadas valem mais do que uma média confusa.',
        },
        {
          titulo: 'Dê ao orgânico volume, não paciência',
          texto:
            'Quatro vídeos por mês não produzem dado suficiente para nenhuma conclusão. Se o orgânico vai entrar, ele entra com volume de publicação — ou não entra.',
        },
      ],
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'A Doxa fica de um lado só desta comparação: as visualizações contabilizadas nas metas são 100% orgânicas, e não é preciso investir em mídia para atingir as metas orgânicas contratadas. Se a empresa quiser complementar com anúncios, isso é feito separadamente — e continua sendo trabalho de outra gente.',
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
          pergunta: 'Dá para fazer os dois ao mesmo tempo?',
          resposta:
            'Dá, e costuma ser o arranjo das empresas que já vendem. O cuidado é não medir os dois no mesmo lugar: se a publicação orgânica for impulsionada, o número deixa de dizer se o conteúdo funciona. Separar os perfis, ou ao menos separar os relatórios, preserva as duas leituras.',
        },
        {
          pergunta: 'Quanto tempo o orgânico leva para dar resultado?',
          resposta:
            'Prazo para um perfil específico ninguém pode prometer: ele depende do assunto, do histórico da conta e do volume que a empresa sustenta. O que dá para dizer é o que encurta o caminho: volume de publicação com constância, uma ideia por vídeo e intervalo suficiente entre as peças para que uma não atrapalhe a outra. Sem volume, o prazo não é longo — é indefinido.',
        },
        {
          pergunta: 'Impulsionar um vídeo que foi bem organicamente ajuda?',
          resposta:
            'Ajuda a entregar mais, e atrapalha a entender por quê. Depois do impulsionamento, o desempenho do vídeo passa a misturar entrega comprada e entrega espontânea, e o aprendizado sobre o que a audiência assiste até o fim se perde. Em perfis com operação orgânica ativa, a recomendação é não impulsionar.',
        },
        {
          pergunta: 'Orgânico é mais barato que pago?',
          resposta:
            'Mais barato por visualização no longo prazo, e não necessariamente mais barato no mês. O orgânico troca custo de mídia por custo de produção e por tempo até o retorno; o pago troca tempo por dinheiro. Chamar um dos dois de barato sem dizer em que prazo é o jeito mais rápido de decidir errado.',
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
        'Pago é aluguel de atenção, orgânico é construção de patrimônio — e quase toda empresa saudável faz os dois, em proporções que mudam conforme ela deixa de precisar do primeiro.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o que cada lado compra e o que sobra.
 * [x]  2. Todo fato sobre a Doxa vem do source of truth (views 100% orgânicas,
 *          mídia não exigida, zero impulsionamento, 24 horas).
 * [x]  3. Nada da §9: sem preço, sem verba mínima, sem ROI inventado.
 * [x]  4. Termos proibidos ausentes: "tráfego pago" aparece só como categoria
 *          de mercado, nunca como serviço da Doxa.
 * [x]  5. A garantia não é citada em número; a página fala de metas orgânicas.
 * [x]  6. Intenção própria: o hub organiza o cluster, esta página decide entre
 *          dois caminhos. O hub não repete esta tabela.
 * [x]  7. Informação incremental: a tabela de oito critérios e a regra de
 *          separar a leitura (perfis com estratégia ativa sem impulsionamento).
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de marketing orgânico; links para a solução, para a dor de
 *          alcance, para o verbete e para o outro comparativo.
 * [x] 10. IMPARCIAL: cinco situações em que o pago ganha, com nome e caso, e um
 *          veredito "depende de quando você precisa do resultado".
 * [x] 11. CTA único, no fim, condicionado ("se a decisão for construir o lado
 *          orgânico").
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "views orgânicas", "auditoria estratégica".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
