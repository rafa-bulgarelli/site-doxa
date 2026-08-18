import type { Pagina } from '../../tipos';

/**
 * O arco inteiro de um trimestre de produção — a metodologia virada em plano
 * para quem vai executar por conta própria.
 *
 * Fronteira com as vizinhas: `/guias/como-postar-todos-os-dias-sem-equipe` é a
 * ROTINA SEMANAL (o dia de captura, a fila, o dia que falha) e continua dona
 * dela; `/guias/como-viralizar-no-tiktok` é o dono do bloco de CADÊNCIA e aqui
 * aparece resumido em uma frase com link; `/solucoes/producao-de-conteudo-em-
 * escala` é a página comercial do mesmo assunto. Esta é o ARCO DE 90 DIAS: a
 * aritmética, as fases e onde ele quebra.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · 60 conteúdos únicos em 90 dias, um por dia útil, nas três redes, com o
 *    mesmo arquivo no mesmo dia → `docs/seo/source-of-truth.md` §2 e §8, regra
 *    `RT-1`, fonte: `supabase/manual-seed-v1.sql:179,183`. É condição de quem
 *    já é cliente da Doxa, e a página diz isso com todas as letras;
 *  · no máximo um vídeo por dia útil, sem compensar acumulando no mesmo dia →
 *    §8, regra `RT-2`, fonte: `supabase/manual-seed-v1.sql:187-191`;
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → §2, fonte:
 *    `supabase/manual-seed-v2.sql:168`;
 *  · os primeiros conteúdos abaixo do esperado geram dados sobre audiência,
 *    temas, formatos, hooks e narrativas → §2, fonte:
 *    `src/components/faq/config.ts` (resposta `primeiros-videos`);
 *  · retorno em até 24 horas para marcar a auditoria estratégica → §2, fonte:
 *    `public/llms.txt:47-49`; `src/components/comparacao/config.ts:273,297`.
 *
 * A aritmética do trimestre (13 semanas, ~65 dias úteis) é contagem de
 * calendário, verificável por qualquer um, e não estatística de terceiro.
 * Nenhum número de mercado entra aqui: não há fonte citável para nenhum.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-produzir-60-videos-em-90-dias',
  titulo: 'Como produzir 60 vídeos em 90 dias: o plano do trimestre',
  descricao:
    'Sessenta vídeos em noventa dias dá cerca de um por dia útil. A aritmética do trimestre, as quatro fases, o que se grava em lote e onde o plano quebra.',
  h1: 'Como produzir 60 vídeos em 90 dias',
  resumo:
    'Sessenta vídeos em noventa dias corridos dá cerca de um por dia útil, com dois ou três dias de folga — e a parte difícil não é gravar, é manter a fila cheia na semana em que tudo aperta. Abaixo, a conta do trimestre, as quatro fases em que ele se divide, o que se produz em lote e os três pontos em que o plano costuma quebrar.',
  intencao: 'informacional',
  palavrasChave: [
    'como produzir 60 vídeos em 90 dias',
    'produzir vídeos em lote',
    'plano de conteúdo trimestral',
    'quantos vídeos por trimestre',
    'operação de conteúdo em 90 dias',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/como-postar-todos-os-dias-sem-equipe',
    '/guias/como-escrever-roteiro-de-video-curto',
    '/guias/como-usar-o-mesmo-video-nas-tres-redes',
    '/solucoes/producao-de-conteudo-em-escala',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o plano fecha no papel e o gargalo é ter quem produza esse volume todo mês, conte quantos vídeos a sua empresa precisa publicar. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A conta, antes do plano',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Noventa dias corridos são treze semanas. Tirando sábados e domingos, sobram cerca de 65 dias úteis, e um punhado deles cai em feriado — na prática, entre 60 e 63 dias de publicação. É por isso que sessenta peças e noventa dias andam juntos: o número não é redondo por estética, ele é o que cabe em um vídeo por dia útil com dois ou três dias de margem.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A consequência dessa conta precisa ficar clara antes de começar: **o trimestre não é um esforço, é uma linha de produção**. Sustentar sessenta gravações separadas em treze semanas é raro, e caro quando acontece. Quem chega ao fim produziu em lote e publicou no varejo — a rotina semanal que sai desse desenho está em [como postar todos os dias sem equipe](/guias/como-postar-todos-os-dias-sem-equipe).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As quatro fases do trimestre',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Semana 0 — a base que não se refaz depois',
          texto:
            'Antes do primeiro vídeo: a lista bruta de assuntos (cinquenta linhas, sem filtro, tiradas das perguntas que a sua empresa responde toda semana), o cenário fixo, o enquadramento, o padrão de legenda e de capa. Tudo que for decidido aqui deixa de ser decidido sessenta vezes.',
        },
        {
          titulo: 'Semanas 1 a 4 — amplitude',
          texto:
            'Os primeiros vinte vídeos existem para varrer possibilidades: três ou quatro formatos diferentes, assuntos de famílias distintas, aberturas de tipos opostos. Não tente acertar; tente cobrir terreno. Os conteúdos que performam abaixo do esperado nessa fase não são desperdício — é deles que sai o dado sobre audiência, tema, formato e abertura.',
        },
        {
          titulo: 'Semanas 5 a 9 — profundidade',
          texto:
            'Com quatro semanas no ar, já dá para ver o que a sua audiência assiste até o fim. Aqui o trabalho é o oposto do anterior: escolher dois formatos e um par de famílias de assunto e produzir variações densas em cima deles. Costuma ser a fase que rende mais no trimestre, e é a mais chata de executar.',
        },
        {
          titulo: 'Semanas 10 a 13 — consolidação',
          texto:
            'Fecha-se o que funcionou em série (mesmo formato, numeração explícita, expectativa de continuidade) e reserva-se um bloco de gravação para repor a fila do trimestre seguinte. Terminar com a fila zerada é o erro que faz o segundo trimestre nunca começar.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que se produz em lote e o que não',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A economia inteira do plano está em agrupar o que custa troca de contexto e deixar solto o que custa atenção. A divisão que costuma se sustentar é esta:',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Etapa', 'Em lote?', 'Por quê'],
      linhas: [
        ['Levantamento de assunto', 'Sim, uma vez por trimestre', 'Pensar em pauta é caro; pensar na pauta de um vídeo só é caríssimo'],
        ['Roteiro', 'Sim, de cinco em cinco', 'Escrever em série mantém o tom e revela repetição antes da gravação'],
        ['Gravação', 'Sim, um bloco por semana', 'Cenário, luz e roupa montados uma vez rendem dez peças'],
        ['Edição', 'Sim, no mesmo dia da gravação', 'A referência do que foi dito ainda está fresca'],
        ['Capa e legenda', 'Sim, junto da edição', 'Padrão definido na semana 0 transforma a etapa em execução'],
        ['Publicação', 'Não, nunca', 'Publicar em lote é o único item da lista que destrói o resultado dos outros'],
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'A última linha é a que mais gente ignora. Vídeos publicados no mesmo dia disputam a mesma audiência, e um atropela o alcance do outro — produzir em lote é economia, publicar em lote é prejuízo. O detalhe da cadência está em [como viralizar no TikTok](/guias/como-viralizar-no-tiktok).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A fila é o plano',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um trimestre de sessenta vídeos não se mede pelo que já foi publicado, e sim por quantos dias de publicação existem prontos na pasta. Essa folga é o amortecedor do plano, e ela tem um tamanho recomendável: duas semanas. Abaixo disso, o trimestre passa a depender de nada dar errado — e treze semanas são tempo demais para essa aposta.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Por isso a métrica de acompanhamento do plano não é "quantos publiquei", é **"quantos dias de fila eu tenho"**. Um número só, conferido na sexta-feira. Se ele encolheu duas semanas seguidas, a gravação da semana seguinte é inegociável, mesmo que o calendário esteja cheio.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os três pontos em que o plano quebra',
    },
    {
      tipo: 'lista',
      itens: [
        '**Semana 3, o tédio do formato.** O formato ainda não deu resultado e já cansou quem grava. É cedo demais para concluir qualquer coisa: a fase de amplitude existe para ser desconfortável, e trocar tudo agora apaga o único dado que estava sendo construído.',
        '**Semana 6, a fila que zera.** A empolgação inicial produziu vinte vídeos em duas semanas e nada nas duas seguintes. O conserto não é publicar mais; é voltar a gravar em bloco, mesmo com peças no ar.',
        '**A semana do vídeo que foi bem.** Um resultado alto tenta a operação inteira a virar cópia dele. Repita o formato com outro assunto antes de reescrever o trimestre — se o segundo também for bem, o ganho era do formato; se não for, era do tema, e o plano não deveria ter mudado.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'De onde vem essa régua',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A grandeza de sessenta peças em noventa dias não foi inventada para esta página: é o volume mínimo do período de garantia de uma operação de conteúdo que roda todo dia útil, e vem acompanhada das regras de publicação do mesmo pacote.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Esse é o desenho da operação da Doxa, e os números são condição de quem já é cliente: no mínimo 60 conteúdos únicos em 90 dias, um por dia útil, cada peça com roteiro, voz clonada, edição e capa próprios, publicada pelo cliente nas três redes — Instagram, TikTok e YouTube Shorts —, conforme as condições e o prazo do contrato.',
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
          pergunta: 'Sessenta é um número mágico?',
          resposta:
            'Não é mágico, é aritmético: sessenta peças é o que cabe em um vídeo por dia útil dentro de um trimestre, e é a partir dessa faixa que dá para separar padrão de acaso. Um plano de trinta funciona pela metade — menos dado, conclusões mais lentas —, e um plano de cento e vinte exige publicar duas vezes por dia, o que faz os vídeos competirem entre si.',
        },
        {
          pergunta: 'Preciso de sessenta assuntos diferentes?',
          resposta:
            'Precisa de sessenta peças únicas, o que é outra coisa. Um mesmo assunto rende cinco vídeos quando cada um defende uma afirmação diferente sobre ele, com abertura, exemplo e fecho próprios. O que não funciona é reaproveitar o mesmo corte com legenda trocada: aí não são cinco testes, é um teste publicado cinco vezes.',
        },
        {
          pergunta: 'Quantos dias de gravação isso exige?',
          resposta:
            'Depende do formato, mas a conta útil é por bloco: se um dia de gravação com cenário montado rende de oito a doze peças, o trimestre inteiro cabe em cinco a sete blocos. O tempo que se perde não está na filmagem — está em montar e desmontar o contexto, e é exatamente esse custo que o lote elimina.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O primeiro passo desta semana',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abra um documento e escreva cinquenta perguntas que a sua empresa já respondeu por mensagem nos últimos trinta dias. Não filtre, não ordene, não julgue. Essa lista é a matéria-prima do trimestre inteiro, e ela é a única etapa que ninguém pode fazer por você. O que vem depois — estrutura de roteiro, abertura, edição — está em [como escrever roteiro de vídeo curto](/guias/como-escrever-roteiro-de-video-curto).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: 60 em 90 dias é ~1 por dia útil, e o
 *          gargalo é a fila. Sem aquecimento.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §8).
 * [x]  3. Nada da §9: sem preço, mensalidade, fidelidade, prazo do primeiro
 *          vídeo, "1.500 clientes" ou "parceiros".
 * [x]  4. Termos proibidos ausentes; nenhuma promessa de viralização.
 * [x]  5. Os números do manual (60/90/três redes) vêm com "conforme as
 *          condições e o prazo do contrato" e rotulados como condição de
 *          cliente.
 * [x]  6. Intenção própria: o ARCO de 90 dias. A rotina semanal é de
 *          /guias/como-postar-todos-os-dias-sem-equipe; a cadência é de
 *          /guias/como-viralizar-no-tiktok (resumida em uma frase + link); a
 *          versão comercial é /solucoes/producao-de-conteudo-em-escala.
 * [x]  7. Incremental: a aritmética 90 corridos → ~65 dias úteis, as quatro
 *          fases, a tabela do que vai em lote e a métrica "dias de fila".
 * [x]  8. title (56 caracteres), description e H1 exclusivos; H2 em hierarquia.
 * [x]  9. Hub /guias/videos-curtos; envia links úteis, recebe do hub.
 * [x] 10. Não é comparativo; ainda assim nomeia os três pontos em que o
 *          próprio plano quebra, em vez de vendê-lo como infalível.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing: a keyword aparece no título, no resumo e onde a frase
 *          pede.
 * [x] 13. Vocabulário do dono: "conteúdos únicos", "dia útil", "pronto para
 *          postar", "auditoria estratégica". (A página NÃO usa "views somadas":
 *          ela fala de volume e cadência, não da meta.)
 * [x] 14. Teste final (§45): sim — é o plano que eu escreveria num guardanapo
 *          para alguém que me perguntasse por onde começar um trimestre.
 * ────────────────────────────────────────────────────────────────────────── */
