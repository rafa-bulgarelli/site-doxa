import type { Pagina } from '../../tipos';

/**
 * Verbete: o termo e a definição. A EXECUÇÃO (como escrever um) é do guia
 * `/guias/como-fazer-videos-curtos-que-prendem` — este verbete não vira
 * tutorial, conforme a seção Canibalização do `docs/seo/keyword-map.md`.
 *
 * Sem fato da Doxa e sem estatística de terceiro: é definição de mecanismo.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'hook',
  titulo: 'Hook: o que é o gancho de um vídeo curto',
  descricao:
    'Hook é a abertura que decide se alguém continua assistindo. O que ele precisa fazer nos primeiros segundos e por que ele vale mais que o resto do vídeo.',
  h1: 'Hook',
  resumo:
    'Hook é a abertura de um vídeo — as primeiras palavras e a primeira imagem — e a única função dela é impedir que a pessoa vá para o próximo vídeo. Num feed de vídeo curto, é o pedaço que decide o alcance de tudo que vem depois.',
  intencao: 'informacional',
  palavrasChave: ['hook', 'o que é hook em vídeo', 'gancho de vídeo', 'primeiros segundos'],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/como-fazer-videos-curtos-que-prendem',
    '/glossario/retencao',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Hook é a abertura de um vídeo curto: as primeiras palavras, a primeira imagem e o primeiro movimento. A função dele é uma só — fazer com que a pessoa não vá para o vídeo seguinte. Tudo que ele promete, o resto do vídeo precisa entregar.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que ele decide o alcance',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A plataforma mostra um vídeo novo para um grupo pequeno de pessoas e observa o que elas fazem. Se boa parte dessas pessoas sai nos primeiros segundos, a entrega para por ali. Como o abandono se concentra no começo, o hook é a variável com maior efeito sobre quantas pessoas vão ver o vídeo — e é também a mais barata de mudar, porque não exige regravar o conteúdo inteiro.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que um hook precisa fazer',
    },
    {
      tipo: 'lista',
      itens: [
        'Declarar o assunto, sem apresentação da marca antes.',
        'Dar um motivo para continuar: uma pergunta, uma tensão, um número, um erro comum.',
        'Ser específico. "Uma dica de marketing" não é hook; "o erro que faz o seu vídeo morrer no terceiro segundo" é.',
        'Cumprir o que promete. Hook que promete o que o vídeo não entrega derruba a retenção no meio, que é pior do que perder no começo.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um exemplo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abertura fraca: "Oi, aqui é o João, da Clínica X, e hoje eu vou falar um pouco sobre cuidados com a pele." A pessoa ainda não sabe se o assunto é dela e já gastou cinco segundos. Abertura forte: "Se a sua pele arde depois do protetor solar, provavelmente você está passando na hora errada." Mesmo conteúdo, mesma gravação, outra chance de alcance.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O hook é o que decide quantas pessoas começam; a [retenção](/glossario/retencao) é o que mostra quantas ficaram. Para escrever hooks na prática, o guia [como fazer vídeos curtos que prendem](/guias/como-fazer-videos-curtos-que-prendem).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Não há fato sobre a Doxa nesta página — nada a checar.
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: o termo. A execução é do guia.
 * [x]  7. Incremental: o par de aberturas fraca × forte com o mesmo conteúdo.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário coerente com o do repositório.
 * [x] 14. Publicaria sem Google: sim — o exemplo comparado resolve a dúvida.
 * ────────────────────────────────────────────────────────────────────────── */
