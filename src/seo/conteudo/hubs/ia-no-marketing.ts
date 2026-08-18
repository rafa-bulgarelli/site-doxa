import type { Pagina } from '../../tipos';

/**
 * O hub do cluster de IA — o único que já nasce com um membro publicado
 * (`/solucoes/producao-de-videos-com-ia`, a página do prelude).
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · uma foto e uma amostra de voz viram um clone que grava no lugar do
 *    cliente; o vídeo sai vertical, legendado, no formato do feed →
 *    `docs/seo/source-of-truth.md` §1 e §2, fonte: `public/llms.txt:6-9`;
 *    `src/components/HowItWorks.tsx:84-92`;
 *  · os três passos (onboarding · clone · publicação) → §2, fonte:
 *    `src/components/HowItWorks.tsx:71-92`;
 *  · quem publica é o cliente, no perfil dele → §2, fonte:
 *    `src/components/HowItWorks.tsx:92`; `supabase/manual-seed-v1.sql:66`;
 *  · a stack é HeyGen, ChatGPT, Claude, Meta e ElevenLabs, tratadas como
 *    FERRAMENTAS e nunca como parceiras → §6, fonte:
 *    `src/components/tools.ts:3-13,18-24`;
 *  · a Doxa não é agência e não vende curso, ferramenta nem assinatura → §1,
 *    fonte: `public/llms.txt:40-43`;
 *  · identidade e tom de voz são mapeados no início e orientam a produção →
 *    §2, fonte: `src/components/faq/config.ts:485-486`.
 *
 * O que NÃO entra: preço, prazo do primeiro vídeo e qualquer número de mercado
 * sobre adoção de IA — §9 do source of truth e §49 do brief.
 */
export const pagina: Pagina = {
  tipo: 'hub',
  slug: 'ia-no-marketing',
  titulo: 'IA no marketing: onde ela entra na produção de conteúdo',
  descricao:
    'O que a inteligência artificial muda de verdade na produção de conteúdo, o que continua sendo decisão humana e como avaliar uma operação com IA.',
  h1: 'IA no marketing',
  resumo:
    'A inteligência artificial não mudou o que faz um conteúdo funcionar: mudou o custo de produzir o próximo. É por isso que ela aparece primeiro na produção — roteiro, locução, imagem de quem fala, legenda — e quase nada na decisão do que vale a pena dizer. Este hub separa uma coisa da outra e aponta para a página de cada assunto.',
  intencao: 'informacional',
  palavrasChave: [
    'ia no marketing',
    'inteligência artificial marketing',
    'ia para conteúdo',
    'marketing com inteligência artificial',
  ],
  hubs: [],
  relacionadas: [
    '/solucoes/producao-de-videos-com-ia',
    '/solucoes/marketing-com-ia',
    '/guias/o-que-e-uma-agencia-de-marketing-com-ia',
    '/guias/o-que-e-avatar-de-ia',
    '/comparativos/ia-vs-producao-tradicional-de-video',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se você já decidiu que quer produzir com IA e o que falta é quem opere isso todo dia, conte o volume que a sua empresa precisa publicar. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que a IA realmente resolve na produção de conteúdo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A parte cara de um vídeo nunca foi o software de edição. Era reunir gente, câmera, luz, estúdio e agenda a cada gravação, e refazer tudo isso na semana seguinte. O que a IA derruba é exatamente esse pedaço: a pessoa na frente da câmera, a voz e o cenário podem ser gerados a partir de material que já existe, e o custo do décimo vídeo do mês deixa de ser igual ao do primeiro.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Isso muda a economia da operação, não a qualidade do que se tem a dizer. Uma empresa que não sabia o que falar continua sem saber, só que agora publica cinco vezes mais rápido — e é assim que se produz volume genérico em escala industrial. A pergunta útil, portanto, não é "que ferramenta usar", e sim "o que a IA está me permitindo testar que antes eu não conseguia".',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que a IA gera, o que continua humano',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Etapa', 'Quem faz hoje'],
      linhas: [
        ['Imagem de quem fala e locução', 'Software, a partir de uma foto e de uma amostra de voz'],
        ['Variações de roteiro e legenda', 'Software, com revisão humana'],
        ['O que a marca pode e não pode dizer', 'Humano, sempre'],
        ['Leitura dos dados e escolha do que refazer', 'Humano, com apoio de dados'],
        ['Conhecimento do próprio negócio', 'Do cliente, e não há atalho'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A fronteira desta tabela é a coisa mais importante do assunto. Toda operação com IA que dá errado erra no mesmo lugar: automatiza também a linha de baixo, e publica conteúdo que soa como qualquer marca de qualquer setor. O termo técnico para o que sai dali é conteúdo genérico, e nenhuma ferramenta conserta isso.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como avaliar uma operação de conteúdo com IA',
    },
    {
      tipo: 'lista',
      itens: [
        'Quem decide o que entra em cada roteiro, e com base em quê.',
        'O que acontece com um vídeo que performou bem: vira cinco variações ou vira uma comemoração?',
        'O que acontece com um vídeo que performou mal: é descartado rápido ou vira mais três iguais?',
        'Onde entra a identidade e o tom de voz da marca, e quem os define.',
        'Quem publica, em qual perfil, e quem responde os comentários depois.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra neste assunto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa opera esse modelo de um jeito específico: o cliente manda uma foto e uma amostra da própria voz, a plataforma monta um clone que grava os vídeos no lugar dele, e o que chega é o arquivo pronto para postar — vertical, legendado, no formato do feed. Quem publica é o cliente, no perfil dele. A identidade, o público e as restrições da empresa são mapeados no início e passam a orientar a produção.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A produção roda sobre ferramentas de mercado — HeyGen, ChatGPT, Claude, Meta e ElevenLabs. São ferramentas usadas, e nada além disso: nenhuma delas é parceira da Doxa nem endossa o que está escrito aqui. Vale dizer também o que a Doxa não é, porque encurta a conversa: não é agência, não vende curso, ferramenta nem assinatura de software.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Ferramenta não é estratégia. Qualquer empresa pode assinar as mesmas contas; o que decide o resultado é o volume de testes e o critério para descartar rápido o que não funciona.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde continuar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Para o funcionamento em detalhe, [produção de vídeos com IA para empresas](/solucoes/producao-de-videos-com-ia) é a página mais completa do cluster. Para entender o componente que confunde mais gente, o guia [o que é um avatar de IA](/guias/o-que-e-avatar-de-ia). Para comparar com o caminho tradicional, [vídeo com IA ou produção tradicional](/comparativos/ia-vs-producao-tradicional-de-video).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Primeira frase responde: a IA muda o custo do próximo vídeo, não o
 *          que faz o conteúdo funcionar.
 * [x]  2. Todo fato da Doxa tem entrada no source of truth (§1, §2, §6).
 * [x]  3. Nada da §9: sem preço, prazo do primeiro vídeo, fidelidade nem os
 *          1.500 clientes.
 * [x]  4. As ferramentas aparecem como FERRAMENTAS, nunca "parceiros"; a Doxa
 *          é explicitamente descrita como não-agência.
 * [x]  5. A garantia não é citada nesta página.
 * [x]  6. Intenção própria: o mapa do cluster. O tutorial é do guia, a oferta é
 *          da solução — a canibalização prevista no keyword-map está respeitada.
 * [x]  7. Incremental: a tabela da fronteira humano/software e as cinco
 *          perguntas de avaliação.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Hub: envia contextuais e recebe do cluster (a página do prelude
 *          declara este hub e aparece na lista automática).
 * [x] 10. Não é comparativo, mas diz onde a IA NÃO ajuda.
 * [x] 11. CTA único, no fim.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "clone", "pronto para postar", "operação",
 *          "vertical, legendado, no formato do feed".
 * [x] 14. Publicaria sem Google: sim — a tabela é a conversa que eu teria com
 *          um diretor de marketing decidindo se contrata IA ou gente.
 * ────────────────────────────────────────────────────────────────────────── */
