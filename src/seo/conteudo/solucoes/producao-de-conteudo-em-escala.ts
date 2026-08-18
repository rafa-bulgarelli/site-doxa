import type { Pagina } from '../../tipos';

/**
 * A página do VOLUME. O formato do vídeo é assunto de
 * `/solucoes/videos-curtos-para-empresas`; a regra de cadência, de
 * `/solucoes/conteudo-organico-para-empresas`. Aqui a pergunta é uma só: como
 * sustentar sessenta conteúdos sem montar uma produtora dentro da empresa.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · as nove etapas do jeito antigo (Briefing… Publicação) e os 18 dias até o
 *    primeiro vídeo → `src/components/semcom/config.ts` (`STEPS`, `PRAZO_SEM`);
 *  · a faixa de R$ 8.000 a R$ 10.500 por mês e as 25 contratações →
 *    `src/components/comparacao/config.ts` (`CUSTO_DE`, `CUSTO_ATE`, `ITENS`),
 *    apresentadas como o inventário do "jeito antigo" que a landing publica —
 *    o próprio arquivo avisa que é ilustração do que uma operação interna
 *    acumula, e não levantamento de mercado (source of truth §4);
 *  · 60 conteúdos únicos em 90 dias e o máximo de um vídeo por dia útil →
 *    `supabase/manual-seed-v1.sql` (`RT-1`, `RT-2`), com a ressalva do contrato;
 *  · "operações de alta frequência, podendo publicar múltiplos conteúdos por
 *    dia" → `src/components/faq/config.ts`, chave `volume`;
 *  · tecnologia, IA, processos próprios e operação especializada → chave `escala`;
 *  · "operação proprietária de conteúdo baseada em volume, testes constantes,
 *    análise de dados e otimização" → chave `como-gera`;
 *  · validação antes da publicação, quando o fluxo do cliente exige → chave
 *    `aprovacao`;
 *  · onboarding → estratégia → produção → aprovações → publicação → análise →
 *    chave `processo`;
 *  · os primeiros vídeos que geram dado e o descarte rápido → chave
 *    `primeiros-videos`;
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa →
 *    `supabase/manual-seed-v2.sql`, source of truth §2.
 *
 * O que NÃO está aqui: quebra do custo mensal entre produção, agência e
 * tráfego (é suposição comentada em `semcom/config.ts`), preço da Doxa, prazo
 * do primeiro vídeo DELA e qualquer custo por peça — nenhum tem fonte.
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'producao-de-conteudo-em-escala',
  titulo: 'Produção de conteúdo em escala: volume sem montar estúdio',
  descricao:
    'Como sustentar dezenas de vídeos por trimestre sem montar produtora: o que a escala exige, o que ela custa por dentro e onde a Doxa assume a operação.',
  h1: 'Produção de conteúdo em escala',
  resumo:
    'Produzir em escala não é postar mais vezes: é fazer o próximo vídeo custar menos que o anterior. Enquanto cada peça exigir agenda, estúdio e gravação, o volume cresce junto com o custo — e é isso que trava a operação no segundo mês. A Doxa trabalha com a referência de sessenta conteúdos únicos em noventa dias, conforme as condições e o prazo do contrato.',
  intencao: 'comercial',
  palavrasChave: [
    'produção de conteúdo em escala',
    'conteúdo em escala para empresas',
    'operação de conteúdo',
    'produzir muito conteúdo',
    'volume de conteúdo nas redes sociais',
  ],
  hubs: ['/guias/videos-curtos', '/guias/marketing-organico'],
  relacionadas: [
    '/solucoes/videos-curtos-para-empresas',
    '/solucoes/producao-de-videos-com-ia',
    '/guias/como-produzir-conteudo-sem-equipe',
    '/guias/como-postar-todos-os-dias-sem-equipe',
    '/comparativos/agencia-vs-equipe-interna',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Diga quantos vídeos a sua empresa precisa publicar por mês e quem produz hoje. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Escala é uma conta de custo marginal',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A pergunta que define se uma operação escala não é "quantos vídeos vocês fazem?". É **quanto custa o próximo**. Numa produção tradicional, o décimo vídeo do mês custa praticamente o mesmo que o primeiro: cada peça pede pauta, agenda, deslocamento, gravação e edição. A curva é reta, e por isso dobrar o volume significa dobrar a conta.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Uma operação que escala inverte isso: o esforço grande fica na montagem do processo — quem fala, com que voz, sobre o quê, em que formato — e cada peça seguinte consome só o que é específico dela. Não é uma promessa de custo zero; é uma mudança no lugar onde o dinheiro entra.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que volume é pré-requisito, não vaidade',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Volume tem má fama porque é confundido com barulho. Só que, sem volume, uma empresa não tem amostra: quatro vídeos por mês são quatro pontos, e nenhum padrão de hook, tema ou formato se enxerga em quatro pontos. Publicar muito não é o objetivo — é a condição para saber o que funciona antes do trimestre acabar.',
    },
    {
      tipo: 'lista',
      itens: [
        'Com poucos vídeos, um resultado bom é indistinguível de sorte, e um ruim não ensina nada.',
        'Com volume, o vídeo que não foi bem deixa de ser prejuízo e vira leitura.',
        'A decisão que sobra é a boa: aumentar a produção em torno do que funciona e descartar rápido o que não funciona.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A conta do jeito antigo, etapa por etapa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O caminho tradicional até um vídeo publicado tem nove etapas, e cada uma delas é uma fila de espera. A landing da Doxa aponta **18 dias** até o primeiro vídeo por esse caminho — não porque alguém trabalhe devagar, mas porque as etapas são sequenciais.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Etapa', 'O que ela consome'],
      linhas: [
        ['Briefing', 'Reuniões de alinhamento antes de existir qualquer ideia escrita.'],
        ['Roteiro', 'Escrita, revisão e a volta que costuma vir depois da leitura.'],
        ['Aprovação', 'A fila mais silenciosa: o material fica parado esperando alguém responder.'],
        ['Agenda', 'Encontrar um dia em que a pessoa que aparece, a equipe e o espaço coincidam.'],
        ['Estúdio', 'Reserva, montagem, luz e o custo fixo do espaço.'],
        ['Filmmaker', 'Diária de quem filma, mais o equipamento que vem junto.'],
        ['Captação', 'O dia de gravação: horas concentradas para render poucas peças.'],
        ['Edição', 'Corte, legenda, trilha e capa, peça por peça.'],
        ['Publicação', 'Calendário, upload e o começo da leitura de resultado.'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O inventário que a Doxa publica na comparação da landing soma **25 contratações** entre gente, equipamento, espaço, pós-produção e distribuição, numa faixa de **R$ 8.000 a R$ 10.500 por mês**. É uma ilustração do que uma operação interna acumula para publicar com constância, e não um levantamento de mercado.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como a Doxa sustenta o volume',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A escala vem de tecnologia, inteligência artificial, processos próprios e uma operação especializada em produção de conteúdo em escala, o que permite criar, testar e otimizar formatos muito mais rápido do que uma operação tradicional. O caminho depois da contratação é fixo:',
    },
    {
      tipo: 'lista',
      ordenada: true,
      itens: [
        'Onboarding, para entender a empresa, os objetivos, o público, o posicionamento e as referências.',
        'Estratégia definida a partir disso, incluindo em que redes a distribuição faz sentido.',
        'Produção: cada vídeo é único, com roteiro, voz clonada, edição e capa.',
        'Aprovações, quando o fluxo do cliente exige — a empresa acompanha temas, roteiros, versões e materiais.',
        'Publicação no perfil da própria empresa, e análise contínua para orientar os próximos conteúdos.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A referência de volume é de **sessenta conteúdos únicos em noventa dias**, conforme as condições e o prazo do contrato, com no máximo um vídeo da operação por dia útil. Por que existe um teto, e não só um piso, é o assunto de [conteúdo orgânico para empresas](/solucoes/conteudo-organico-para-empresas). O volume exato de cada operação depende do plano contratado, e a Doxa trabalha com operações de alta frequência.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que continua sendo trabalho da empresa',
    },
    {
      tipo: 'lista',
      itens: [
        'Dizer o que a marca pode e não pode afirmar — restrição de jurídico e de posicionamento não se descobre de fora.',
        'Entregar os materiais mapeados no onboarding: imagens, vídeos, áudios ou participações, conforme o formato escolhido.',
        'Publicar. O arquivo chega pronto para postar, e quem publica no próprio perfil é a empresa.',
        'Decidir o que fazer com a audiência que aparecer: quem responde comentário e quem atende quem chega.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando escala não é a resposta',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se a empresa ainda não sabe o que vende, para quem, e por que alguém a escolheria, volume só acelera a chegada de uma mensagem confusa a mais gente. Escala multiplica o que já existe — inclusive o que está errado. O mesmo vale para quem precisa de resultado numa semana: operação de conteúdo é construção de canal, e canal leva meses.',
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
          pergunta: 'Quantos vídeos vocês produzem por mês?',
          resposta:
            'O volume depende do plano contratado. A Doxa trabalha com operações de alta frequência, podendo produzir e publicar múltiplos conteúdos por dia. O volume exato é definido de acordo com a estratégia e a meta de performance de cada cliente.',
        },
        {
          pergunta: 'Como a Doxa gera tantas visualizações?',
          resposta:
            'Construímos uma operação proprietária de conteúdo baseada em volume, testes constantes, análise de dados e otimização. Em vez de depender de um único vídeo viral, criamos um sistema contínuo para aumentar as chances de distribuição e crescimento.',
        },
        {
          pergunta: 'Como funciona o processo depois que eu contrato?',
          resposta:
            'O processo começa com um onboarding, para entendermos a empresa, os objetivos, o público, o posicionamento e as referências. Em seguida estruturamos a estratégia, iniciamos a produção, passamos pelas aprovações necessárias e começamos a publicar. A partir daí, os resultados são analisados continuamente para orientar os próximos conteúdos.',
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
        'Faça a conta antes da reunião: quantas peças a sua empresa conseguiu publicar no último trimestre e quantas pessoas encostaram em cada uma. Esses dois números dizem mais sobre a viabilidade da escala do que qualquer proposta. Depois disso, quem preenche o formulário é chamado pelo time da Doxa em até 24 horas para marcar a auditoria estratégica.',
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
