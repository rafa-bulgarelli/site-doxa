import type { Pagina } from '../../tipos';

/**
 * A cabeça de busca AMPLA do cluster de IA — "dá para deixar as redes com a
 * IA?" — respondida por FORMATO de publicação, que é o recorte que nenhuma
 * outra página do cluster tem.
 *
 * FRONTEIRA COM AS VIZINHAS (§38 do brief, seção Canibalização do keyword-map):
 *  · `/guias/ia-no-marketing` (hub) é dono da tabela ETAPA × quem faz hoje —
 *    aqui ela é citada em uma linha e linkada, não refeita;
 *  · `/solucoes/marketing-com-ia` é dono do modelo das QUATRO CAMADAS do
 *    marketing (matéria-prima, produção, distribuição, decisão);
 *  · `/solucoes/producao-de-videos-com-ia` é dono do PROCESSO em três passos e
 *    da conta do jeito antigo;
 *  · `/solucoes/clone-de-ia-para-videos` é dono de como o clone é montado.
 * O que sobra para esta página, e é dela: o perfil visto por formato — vídeo,
 * carrossel, foto, legenda, story e resposta —, e a parte que não se
 * automatiza, que é a conversa.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · uma foto e uma amostra de voz viram um clone que grava os vídeos no lugar
 *    do cliente → `docs/seo/source-of-truth.md` §1 e §2, fonte:
 *    `public/llms.txt:6-9`; `src/components/HowItWorks.tsx:84-92`;
 *  · o entregável é o arquivo do vídeo pronto para publicação, vertical,
 *    legendado, no formato do feed, e quem publica é o cliente → §2
 *    "Entregável", fonte: `src/components/HowItWorks.tsx:92`;
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → §2, fonte:
 *    `supabase/manual-seed-v2.sql:168`;
 *  · nos dias úteis os únicos vídeos curtos dos perfis participantes são os da
 *    operação, e fotos, carrosséis e stories seguem liberados → §8, fonte:
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:445-451`;
 *    `supabase/manual-seed-v1.sql:212`. É condição de quem já é cliente e está
 *    dita como tal — e é a fonte que autoriza dizer que o resto do perfil
 *    continua sendo publicado pela empresa;
 *  · identidade, posicionamento, público, linguagem e restrições mapeados no
 *    início e orientando a produção → §2, fonte:
 *    `src/components/faq/config.ts:485-486`;
 *  · a stack (HeyGen, ChatGPT, Claude, Meta, ElevenLabs) como FERRAMENTAS
 *    usadas, nunca parceiras → §6, fonte: `src/components/tools.ts:3-13,18-24`;
 *  · as quatro negativas do §47 → §1, fonte: `public/llms.txt:40-49`;
 *  · retorno em até 24 horas e auditoria estratégica → §2 "O funil", fonte:
 *    `src/components/comparacao/config.ts:273,297`.
 *
 * O que NÃO está aqui: preço, prazo do primeiro vídeo, quantos vídeos por mês,
 * direitos do vídeo — as perguntas de `PENDENTES` (§9.1). E nenhuma afirmação
 * sobre política de rotulagem de IA das plataformas: não há fonte citável, e a
 * FAQ diz isso em vez de inventar a regra.
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'conteudo-para-redes-sociais-com-ia',
  titulo: 'Conteúdo para redes sociais com IA: o que dá e o que não dá',
  descricao:
    'O que a inteligência artificial produz para um perfil de empresa, formato por formato, o que ela não deve assumir e onde fica a fronteira honesta.',
  h1: 'Conteúdo para redes sociais com IA',
  resumo:
    'Dá para gerar com IA quase tudo o que um perfil publica em vídeo: roteiro, locução, a imagem de quem fala, legenda e capa. Não dá para entregar a ela o perfil inteiro — o que se responde nos comentários, o que a marca pode prometer e o assunto que só a sua empresa conhece continuam do lado de cá. Esta página separa uma coisa da outra, formato por formato, e diz onde a conta fecha.',
  intencao: 'comercial',
  palavrasChave: [
    'conteúdo para redes sociais com ia',
    'ia para redes sociais',
    'criar conteúdo com inteligência artificial',
    'automatizar redes sociais com ia',
    'post com ia para empresa',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/guias/ia-no-marketing',
    '/solucoes/marketing-com-ia',
    '/solucoes/producao-de-videos-com-ia',
    '/solucoes/videos-curtos-para-empresas',
    '/guias/o-que-e-uma-agencia-de-marketing-com-ia',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a parte que trava é a produção de vídeo, diga quantos a sua empresa precisa publicar por mês e em quais redes. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um perfil faz três coisas, e a IA não faz as três',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A pergunta "dá para deixar as redes com a IA?" só tem resposta quando se separa o que um perfil de empresa realmente faz. São três funções, e elas não se parecem em nada uma com a outra.',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Produzir',
          texto:
            'A peça em si: roteiro, gravação, edição, legenda, capa. É trabalho em série, com forma repetível — e é aqui que a IA muda a conta de verdade.',
        },
        {
          titulo: 'Manter o ritmo',
          texto:
            'Publicar toda semana, sem sumir por quinze dias. A IA ajuda porque tira a produção da frente do calendário, mas quem sustenta cadência é processo, não software.',
        },
        {
          titulo: 'Responder',
          texto:
            'Comentário, mensagem, dúvida de cliente, reclamação. É relação, é caso a caso, e é a função em que automatizar cobra caro — o assunto tem uma seção só para ele mais abaixo.',
        },
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quem contrata "IA para redes sociais" esperando as três funções resolvidas recebe a primeira, parte da segunda e nenhuma da terceira. Não é falha de fornecedor: é o desenho do problema.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Formato por formato: o que sai pronto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A divisão por etapa de produção — o que o software gera e o que é decisão humana — está no hub de [IA no marketing](/guias/ia-no-marketing). A tabela abaixo faz outro corte, que é o que interessa a quem administra um perfil: olha cada formato que aquele perfil publica e diz o que muda em cada um.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Formato', 'O que a IA entrega', 'O que continua com a empresa'],
      linhas: [
        [
          'Vídeo vertical (Reels, TikTok, Shorts)',
          'A imagem de quem fala, a locução, a edição, a legenda e a capa',
          'O assunto, a aprovação e a publicação',
        ],
        [
          'Roteiro do vídeo',
          'Variações de abertura e de fecho a partir de um tema definido',
          'O que a marca afirma e o que ela se recusa a afirmar',
        ],
        [
          'Legenda e texto do post',
          'Versões curtas do mesmo conteúdo, adaptadas por rede',
          'A revisão de tudo o que promete prazo, preço ou resultado',
        ],
        [
          'Carrossel e foto',
          'Sugestão de estrutura e de texto para cada tela',
          'A imagem real do produto, da equipe e do lugar',
        ],
        [
          'Story do dia',
          'Pouca coisa: é formato de presença, não de série',
          'Praticamente tudo, porque o valor dele é ser do dia',
        ],
        [
          'Comentário e mensagem',
          'Nada que valha o risco — o motivo está na seção seguinte',
          'A resposta, com nome e responsabilidade de quem responde',
        ],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Duas leituras saem daí. A primeira: o formato em que a IA rende mais é justamente o vídeo vertical, aquele em que uma parte relevante do alcance costuma vir de quem ainda não segue o perfil — por isso a troca costuma compensar. A segunda: quanto mais o formato depende do que aconteceu hoje na sua empresa, menos há para automatizar, e insistir ali produz post sem informação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A conversa é a parte que não se terceiriza para o software',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Responder é onde o conteúdo vira negócio, e é a função de maior risco assimétrico do perfil: cem respostas automáticas corretas não compram nada, e uma errada vira print. A pessoa que comenta reclamando de um pedido, a que pergunta preço, a que aponta um erro no vídeo — as três precisam de alguém que possa decidir, e nenhuma delas precisa de velocidade.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'A regra prática que evita o pior: nada que a empresa não assinaria com o nome dela sai automaticamente. Sugestão de resposta gerada por software é útil como rascunho para quem responde; publicada sozinha, ela transforma a caixa de mensagens em um risco que ninguém está olhando.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Perfil com IA e perfil de IA',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Os dois publicam todo dia e são fáceis de distinguir para quem assiste. O perfil **com** IA usa software para produzir mais rápido o que a empresa já tinha a dizer. O perfil **de** IA usa software também para decidir o que dizer — e o resultado é o que qualquer concorrente receberia pedindo a mesma coisa, com a logomarca trocada no canto.',
    },
    {
      tipo: 'lista',
      itens: [
        'O conteúdo responde a uma pergunta que só chega a quem faz aquele trabalho, com o detalhe que um modelo não teria como saber.',
        'Existe uma pessoa identificável por trás — nome, rosto e voz de quem responde pelo que está sendo afirmado.',
        'O perfil assume posições que poderiam estar erradas. Conteúdo que não arrisca nada não informa nada.',
        'O que deu errado aparece. Nenhum modelo escreve sozinho sobre o pedido que a empresa entregou atrasado no mês passado.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando não vale a pena',
    },
    {
      tipo: 'lista',
      itens: [
        'Volume baixo: montar o processo custa uma vez e se paga na repetição. Para dois posts por mês, o custo de montagem nunca volta.',
        'Ninguém para aprovar: se nenhuma pessoa dentro da empresa pode dizer "isto a gente não afirma", a velocidade só antecipa o problema.',
        'Assunto que não é seu: revender o conteúdo genérico de um fabricante com o seu logo já era fraco antes da IA, e continua sendo depois.',
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
        'A Doxa fica com a produção da primeira função, na parte de vídeo: o cliente manda uma foto e uma amostra da própria voz, a plataforma monta um clone que grava os vídeos no lugar dele, e o que chega é o arquivo pronto para postar — vertical, legendado, no formato do feed. Cada vídeo é único: roteiro, voz clonada, edição e capa. Identidade, público, linguagem e restrições da empresa são mapeados no início e passam a orientar o que o clone diz. Como o clone é construído está em [clone de IA para vídeos](/solucoes/clone-de-ia-para-videos); o processo em três passos, em [produção de vídeos com IA](/solucoes/producao-de-videos-com-ia).',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A fronteira também vale a tinta. Quem publica é a empresa, no perfil dela — e as outras superfícies do perfil continuam com ela: nos perfis onde a operação está ativa, fotos, carrosséis e stories seguem liberados durante a semana, e essa é uma condição de quem já é cliente. Responder comentário e mensagem também segue sendo da empresa. A pipeline roda sobre ferramentas de mercado — HeyGen, ChatGPT, Claude, Meta e ElevenLabs —, que aparecem aqui como ferramentas usadas e nada além disso: nenhuma é parceira da Doxa nem endossa este texto.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'O que a Doxa não é vale ser dito na mesma frase: não é agência, não é tráfego pago, não vende curso, ferramenta nem assinatura de software, e não há checkout no site — o funil termina em conversa humana. O modelo completo do que se automatiza e do que não se automatiza no marketing está em [marketing com IA](/solucoes/marketing-com-ia).',
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
          pergunta: 'Preciso avisar que o conteúdo foi feito com IA?',
          resposta:
            'As regras de rotulagem são de cada plataforma e mudam com o tempo, então a resposta responsável é conferir a política vigente da rede antes de padronizar qualquer coisa. O que não depende de política: a imagem e a voz têm de ser de quem autorizou o uso, e a responsabilidade pelo que é dito no vídeo continua sendo de quem publica.',
        },
        {
          pergunta: 'Conteúdo produzido com IA alcança menos?',
          resposta:
            'Não há como afirmar isso de fora das plataformas, e quem afirma está adivinhando. O que dá para observar é mais simples e independe da ferramenta: conteúdo genérico costuma render pouco, tenha sido escrito por um modelo ou por uma pessoa apressada. O que a audiência abandona é o vídeo que não diz nada, não o vídeo que foi gerado.',
        },
        {
          pergunta: 'Dá para começar usando IA só numa parte?',
          resposta:
            'Um caminho comum é começar pelo texto: variações de roteiro e de legenda, com a gravação continuando como está. A troca que muda a conta de verdade é outra — parar de depender de uma agenda de gravação para cada peça —, e essa só compensa quando existe volume para produzir em série.',
        },
      ],
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o que dá e o que não dá para entregar à IA.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§1, §2, §6, §8).
 * [x]  3. Nada da §9: sem preço, prazo, fidelidade, direitos do vídeo, os 1.500
 *          clientes ou "parceiros" — as ferramentas aparecem como ferramentas.
 * [x]  4. Termos proibidos ausentes; as quatro negativas do §47 estão no
 *          destaque, na redação publicada do `llms.txt`.
 * [x]  5. A garantia não é citada — esta página não fala de meta nem de prazo.
 * [x]  6. Intenção própria: o perfil por FORMATO. O hub é dono da tabela por
 *          etapa, `marketing-com-ia` das quatro camadas, `producao-de-videos`
 *          dos três passos, `clone-de-ia` da montagem do clone. Cada um é
 *          citado com link, nenhum é refeito.
 * [x]  7. Incremental: a tabela por formato, a assimetria de risco da conversa
 *          e a distinção entre perfil com IA e perfil de IA.
 * [x]  8. Title, description e H1 exclusivos; H2 em hierarquia real.
 * [x]  9. Pertence a `/guias/ia-no-marketing`, recebe dele e envia quatro links
 *          contextuais úteis.
 * [x] 10. Não é comparativo; ainda assim tem uma seção inteira sobre quando a
 *          troca NÃO vale a pena.
 * [x] 11. CTA único no fim, condicionado ao gargalo de produção.
 * [x] 12. Sem stuffing: a keyword aparece no h1, no resumo e mais nada forçado.
 * [x] 13. Vocabulário do dono: "clone", "pronto para postar", "vertical,
 *          legendado, no formato do feed".
 * [x] 14. Publicaria sem Google: sim — a tabela por formato é a resposta que eu
 *          daria a um sócio perguntando o que dá para automatizar no perfil.
 * ────────────────────────────────────────────────────────────────────────── */
