import type { Pagina } from '../../tipos';

/**
 * A rotina de leitura de números — o que olhar, quando, e o que decidir com o
 * que se vê.
 *
 * Fronteira com as vizinhas: os verbetes `/glossario/alcance-organico`,
 * `/glossario/retencao` e `/glossario/watch-time` DEFINEM cada métrica e são
 * citados com link, nunca reescritos; `/guias/como-aumentar-o-alcance-organico`
 * é a página de DIAGNÓSTICO de queda e continua dona das alavancas. Esta é a
 * única que trata do CALENDÁRIO de medição e do que o orgânico não mede.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · views SOMADAS entre Instagram, TikTok e YouTube Shorts → `docs/seo/
 *    source-of-truth.md` §3(c), fonte: `supabase/manual-seed-v1.sql:84`, sempre
 *    com a ressalva "conforme as condições e o prazo do contrato";
 *  · as visualizações contabilizadas nas metas são 100% orgânicas, sem depender
 *    da compra de mídia → §8, fonte: `src/components/faq/config.ts:174-175`;
 *  · a performance é monitorada durante toda a operação → §2, fonte:
 *    `src/components/faq/config.ts:554-555`;
 *  · os primeiros conteúdos abaixo do esperado geram dados sobre audiência,
 *    temas, formatos, hooks e narrativas → §2, fonte:
 *    `src/components/faq/config.ts` (resposta `primeiros-videos`);
 *  · engajamento artificial contamina resultados e pode gerar penalização das
 *    redes → §8, fonte: `supabase/manual-seed-v1.sql:287`;
 *  · 60 conteúdos únicos em 90 dias como referência de volume → §2, fonte:
 *    `supabase/manual-seed-v1.sql:179`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * Nenhum benchmark entra aqui — "retenção boa é X%", "alcance saudável é Y" são
 * afirmações que mudam por nicho e não têm fonte citável no repositório. A
 * página ensina a comparar o perfil com ele mesmo, que é o que sobra sem elas.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-medir-resultado-de-conteudo-organico',
  titulo: 'Como medir resultado de conteúdo orgânico sem se enganar',
  descricao:
    'Quatro números bastam, e nenhum deles é seguidores. O que olhar por semana, por mês e por trimestre — e o que o conteúdo orgânico simplesmente não mede.',
  h1: 'Como medir resultado de conteúdo orgânico',
  resumo:
    'A pergunta que organiza a medição não é "qual métrica olhar", é "que decisão esse número vai mudar". Quatro indicadores respondem quase tudo em vídeo curto, e nenhum deles é o número de seguidores. Abaixo, quais são, com que frequência olhar cada um, quais números enganam e o que o conteúdo orgânico não consegue medir por conta própria.',
  intencao: 'informacional',
  palavrasChave: [
    'como medir resultado de conteúdo',
    'métricas de conteúdo orgânico',
    'medir resultado de redes sociais',
    'kpi de conteúdo',
    'relatório de redes sociais',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/glossario/alcance-organico',
    '/glossario/retencao',
    '/glossario/watch-time',
    '/guias/como-aumentar-o-alcance-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a medição já está montada e o que falta é volume publicado para ela ter o que ler, conte quanto a sua empresa precisa produzir por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um número que não muda uma decisão é um enfeite',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O relatório de redes sociais que ninguém lê tem sempre a mesma característica: ele informa. Nenhuma linha dele diz o que fazer diferente na semana seguinte. Antes de escolher métrica, escolha as decisões — repetir ou descartar um formato, mudar a abertura, subir ou baixar a frequência, insistir ou sair de uma rede. Cada número que sobrar deve responder a uma dessas quatro.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os quatro números que bastam',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Número', 'A decisão que ele muda'],
      linhas: [
        ['Retenção nos primeiros segundos', 'Reescrever a abertura ou manter o padrão que está funcionando'],
        ['Fatia de quem não segue o perfil', 'Insistir no formato que traz gente nova ou trocar de rota'],
        ['Tempo médio assistido contra a duração', 'Cortar a peça, alongar o exemplo ou deixar como está'],
        ['Peças publicadas no período', 'Aumentar a produção antes de mexer em qualquer outra coisa'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que cada um significa está nos verbetes, e não vale a pena repetir aqui: [retenção](/glossario/retencao) mede proporção ao longo do vídeo, [watch time](/glossario/watch-time) mede tempo absoluto e [alcance orgânico](/glossario/alcance-organico) conta pessoas diferentes, não exibições. O quarto número não é uma métrica de plataforma — é o seu calendário, e ele explica mais resultado ruim do que os outros três juntos.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Nenhum desses números tem valor de referência universal. "Retenção boa" muda com nicho, formato e duração, e quem publica um número fechado está chutando pelo seu perfil. A comparação que serve é sempre a mesma: o seu vídeo de hoje contra os seus dos últimos trinta dias.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Semana, mês, trimestre: o que olhar em cada um',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Toda semana — dois minutos, e só a peça',
          texto:
            'Retenção dos primeiros segundos e fatia de não-seguidores dos vídeos da semana. A pergunta é uma: qual deles eu produziria de novo? Nenhuma decisão de estratégia se toma aqui, porque uma semana não é amostra.',
        },
        {
          titulo: 'Todo mês — o formato, não o vídeo',
          texto:
            'Junte as peças por formato e por família de assunto e compare as médias. Aqui as perguntas mudam de escala: que formato entrega mais? Que tema a audiência assiste até o fim? O que já pode ser descartado sem dó?',
        },
        {
          titulo: 'Todo trimestre — o canal',
          texto:
            'Volume publicado, evolução do alcance de não-seguidores e o que aconteceu do outro lado: contatos, conversas, buscas pelo nome da marca. É a única janela em que faz sentido perguntar se o canal está valendo o esforço.',
        },
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A regra que sustenta esse calendário é não deixar uma leitura invadir a outra: cada janela responde as perguntas do próprio tamanho. Decisão de trimestre tomada com dado de semana é o erro mais caro da lista, porque ele não parece erro — parece agilidade.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os números que enganam',
    },
    {
      tipo: 'lista',
      itens: [
        '**Seguidores.** É o indicador mais lento a se mexer e o menos ligado à entrega: no vídeo curto, uma parte relevante do alcance costuma vir de quem ainda não segue o perfil.',
        '**Curtidas.** Uma ação opcional, que parte do público executa e parte não. Ficar assistindo é o que cada espectador faz ou deixa de fazer, sem exceção — e por isso diz muito mais.',
        '**O vídeo que explodiu.** Ele é um ponto, não uma curva. Reescrever o trimestre em cima de um resultado isolado costuma acabar com uma sequência de cópias que não repetem o resultado.',
        '**A soma de views sem contexto.** Um total que sobe porque você publicou mais não é melhora de desempenho — é mais publicação. Divida pelo número de peças antes de comemorar.',
        '**Qualquer número comprado.** Seguidor, curtida ou visualização adquirida contamina a leitura de tudo que veio junto e pode gerar penalização das redes; depois disso, você deixa de saber o que era seu.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Três redes, três contagens diferentes',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Cada rede conta visualização com o próprio critério e entrega a um público diferente, então comparar o número de uma com o da outra mede a rede, não o vídeo. A soma serve para dimensionar a operação; o número separado serve para saber em que rede aquele assunto pegou. Como publicar a mesma peça nas três sem estragar o arquivo está em [como usar o mesmo vídeo nas três redes](/guias/como-usar-o-mesmo-video-nas-tres-redes).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que o orgânico não mede sozinho',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Aqui vale a honestidade que poucos relatórios têm: conteúdo orgânico não entrega atribuição limpa. A pessoa vê três vídeos em semanas diferentes, procura a marca pelo nome dias depois e chega pelo site. Nenhum painel de rede social vai conseguir ligar essa venda àquele vídeo, e insistir em fazê-lo produz número inventado com cara de rigor.',
    },
    {
      tipo: 'lista',
      itens: [
        'Pergunte "como você chegou até a gente?" em todo primeiro contato, e registre a resposta em texto livre.',
        'Acompanhe as buscas pelo nome da marca ao longo dos meses: é o sinal indireto mais confiável de que se dispõe.',
        'Compare o volume de conversas iniciadas antes e depois do trimestre, e não vídeo a vídeo.',
        'Trate o conteúdo como canal de demanda, não como fechamento: ele gera conversa, quem fecha é o time comercial.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Numa operação contratada, a leitura vira parte do serviço: na Doxa, a performance é acompanhada durante toda a operação, e as visualizações contabilizadas nas metas são orgânicas — vindas da distribuição dos conteúdos produzidos ali, sem depender de compra de mídia —, somadas entre Instagram, TikTok e YouTube Shorts, conforme as condições e o prazo do contrato.',
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
          pergunta: 'Se eu só puder olhar um número, qual é?',
          resposta:
            'A fatia do alcance que veio de quem ainda não segue o perfil. Ela responde a pergunta que interessa a um canal de crescimento — estou encontrando gente nova ou conversando com os mesmos de sempre? — e desmonta a ilusão do perfil que parece movimentado porque os seguidores atuais são fiéis.',
        },
        {
          pergunta: 'Como saber se o conteúdo trouxe cliente?',
          resposta:
            'Por pergunta direta, na maior parte dos casos: quem chega diz de onde veio, se alguém perguntar e anotar. O caminho indireto é olhar o volume de conversas iniciadas e as buscas pelo nome da marca ao longo de meses. O que não existe é um painel que ligue uma venda a um vídeo específico — e relatório que promete isso está estimando, não medindo.',
        },
        {
          pergunta: 'Preciso de ferramenta paga para medir?',
          resposta:
            'Para vídeo curto, não. Os painéis nativos das três redes já mostram retenção, tempo assistido e origem do alcance por publicação, que é o essencial. Uma planilha com uma linha por vídeo — data, formato, tema, retenção inicial, fatia de não-seguidores — resolve o resto e tem a vantagem de guardar o histórico quando o painel só mostra os últimos meses.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Monte a planilha em dez minutos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Uma aba, uma linha por vídeo, seis colunas: data, formato, tema, retenção nos primeiros segundos, fatia de não-seguidores e uma nota livre. Preencha os últimos dez vídeos hoje e passe a preencher um por dia. Em trinta dias você terá algo que nenhum painel entrega — o seu próprio histórico, no formato em que as suas decisões são tomadas.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: a pergunta certa é que decisão o número
 *          muda; quatro indicadores bastam.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §3, §8).
 * [x]  3. Nada da §9: sem preço, sem prazo, sem número de cliente.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. Views somadas nas três redes vêm com "conforme as condições e o
 *          prazo do contrato".
 * [x]  6. Intenção própria: o CALENDÁRIO de medição. Os verbetes definem cada
 *          métrica e são linkados; /guias/como-aumentar-o-alcance-organico
 *          continua dono do diagnóstico de queda.
 * [x]  7. Incremental: a tabela número × decisão, o ritmo semana/mês/trimestre
 *          e a seção sobre o que o orgânico NÃO mede.
 * [x]  8. title (55 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/marketing-organico; links contextuais úteis.
 * [x] 10. Não é comparativo; admite o limite de atribuição do canal em vez de
 *          prometer relatório que fecha a conta.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "views somadas", "operação", "conteúdos únicos".
 * [x] 14. Teste final (§45): sim — é a planilha que eu montaria com alguém na
 *          primeira reunião.
 * ────────────────────────────────────────────────────────────────────────── */
