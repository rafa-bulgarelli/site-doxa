import type { Pagina } from '../../tipos';

/**
 * Verbete curto: define, dá o critério prático e conecta. Sem fato da Doxa e
 * sem estatística de terceiro — é definição de conceito.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'conteudo-evergreen',
  titulo: 'Conteúdo evergreen: o que continua valendo depois',
  descricao:
    'Conteúdo evergreen é o que continua útil meses depois de publicado. Como saber se um assunto é perene e por que isso muda o retorno da produção.',
  h1: 'Conteúdo evergreen',
  resumo:
    'O oposto do conteúdo de contexto, que só funciona enquanto o assunto está no ar.',
  intencao: 'informacional',
  palavrasChave: ['conteúdo evergreen', 'conteúdo perene', 'evergreen significado'],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/estrategia-de-conteudo-para-empresas',
    '/glossario/conteudo-organico',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Conteúdo evergreen é o que continua útil muito depois de publicado, porque responde a uma dúvida que não depende da semana em que apareceu. O termo vem das árvores que não perdem as folhas, e a imagem é exata: o conteúdo não seca fora de estação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O teste de uma pergunta',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Para saber se um assunto é evergreen, pergunte se alguém teria a mesma dúvida daqui a um ano. "Como escolher entre dois tipos de piso" passa no teste; "o que achamos do anúncio que saiu ontem" não passa. Nenhum dos dois é melhor — eles servem a coisas diferentes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que isso muda o retorno da produção',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um vídeo de contexto rende uma vez e termina. Um vídeo evergreen pode ser entregue de novo semanas depois, republicado com outra abertura no semestre seguinte e usado como resposta a uma pergunta recorrente. Numa operação com volume, é a diferença entre um catálogo que se acumula e uma esteira que precisa produzir tudo de novo todo mês.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A proporção que costuma funcionar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A maior parte do que uma empresa publica pode ser evergreen, com espaço reservado para o conteúdo de contexto — que é o que faz o perfil parecer vivo e presente. Um perfil só de evergreen soa como um manual; um perfil só de contexto recomeça do zero todo mês. O ponto de equilíbrio depende do setor, e ele se descobre publicando.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O planejamento dessa mistura é assunto de [estratégia de conteúdo para empresas](/guias/estrategia-de-conteudo-para-empresas).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Nenhum fato sobre a Doxa nesta página.
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: o termo. O planejamento é do guia de estratégia.
 * [x]  7. Incremental: o teste de uma pergunta e a nota de proporção, sem
 *          inventar percentual — a página diz explicitamente que se descobre
 *          publicando, em vez de citar um número sem fonte.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-organico` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "operação".
 * [x] 14. Publicaria sem Google: sim.
 * ────────────────────────────────────────────────────────────────────────── */
