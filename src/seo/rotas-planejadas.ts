/**
 * As URLs que o mapa de conteúdo PREVÊ, existindo ou não ainda.
 *
 * Por que a lista existe: uma track de conteúdo escreve `/guias/o-que-e-ugc`
 * dentro de um parágrafo antes de o verbete existir. Sem esta lista há dois
 * caminhos ruins — publicar um `<a>` para 404 (link interno quebrado, item 39
 * do brief) ou proibir o link e reescrever a frase depois. Com ela há um
 * terceiro: o motor renderiza o rótulo como TEXTO enquanto a página não
 * existe, e o `<a>` aparece sozinho no dia em que ela nascer.
 *
 * A consequência dura está no `seo.test.ts`: link para URL que não é nem
 * existente nem planejada QUEBRA O TESTE. Errar o slug de um link não vira
 * texto silencioso — vira build vermelho.
 */
export const ROTAS_PLANEJADAS: readonly string[] = [
  // Índices de seção
  '/solucoes',
  '/plataformas',
  '/guias',
  '/comparativos',
  '/glossario',

  // Soluções (intenção comercial)
  '/solucoes/producao-de-videos-com-ia',
  '/solucoes/marketing-com-ia',
  '/solucoes/conteudo-organico-para-empresas',
  '/solucoes/producao-de-conteudo-em-escala',
  '/solucoes/videos-curtos-para-empresas',
  '/solucoes/clone-de-ia-para-videos',

  // Plataformas
  '/plataformas/tiktok-para-empresas',
  '/plataformas/instagram-reels-para-empresas',
  '/plataformas/youtube-shorts-para-empresas',

  // Os cinco hubs
  '/guias/marketing-no-tiktok',
  '/guias/reels-no-instagram',
  '/guias/ia-no-marketing',
  '/guias/marketing-organico',
  '/guias/videos-curtos',

  // Guias
  '/guias/como-viralizar-no-tiktok',
  '/guias/como-crescer-no-instagram-organicamente',
  '/guias/como-fazer-videos-curtos-que-prendem',
  '/guias/estrategia-de-conteudo-para-empresas',
  // '/guias/como-usar-ia-no-marketing' — RETIRADA em 2026-08-18: o eixo já tem três
  // donos (hub ia-no-marketing, /solucoes/marketing-com-ia, guia da agência com IA);
  // uma quarta página seria duplicata ou rasa. As citações foram redirecionadas.
  '/guias/o-que-e-avatar-de-ia',
  '/guias/o-que-e-ugc',

  // Comparativos
  '/comparativos/organico-vs-pago',
  '/comparativos/tiktok-vs-instagram',
  '/comparativos/ia-vs-producao-tradicional-de-video',
  '/comparativos/agencia-vs-equipe-interna',
  '/comparativos/ugc-vs-conteudo-de-marca',

  // Dores (topo de funil, publicadas em /guias)
  '/guias/por-que-meus-videos-nao-tem-views',
  '/guias/como-postar-todos-os-dias-sem-equipe',
  '/guias/como-produzir-conteudo-sem-equipe',
  '/guias/como-aumentar-o-alcance-organico',

  // Glossário
  '/glossario/alcance-organico',
  '/glossario/conteudo-organico',
  '/glossario/hook',
  '/glossario/retencao',
  '/glossario/watch-time',
  '/glossario/ugc',
  '/glossario/short-form',
  '/glossario/avatar-de-ia',
  '/glossario/clone-de-voz',
  '/glossario/algoritmo-do-tiktok',
  '/glossario/conteudo-evergreen',

  // ─── Rodada 2 (2026-08-18) — backlog do keyword-map, sem canibalizar a FASE 1 ───
  // Guias de execução (metodologia com fonte no manual) + adjacência §47 + B2B + Shorts
  '/guias/como-produzir-60-videos-em-90-dias',
  '/guias/como-usar-o-mesmo-video-nas-tres-redes',
  '/guias/como-fazer-hook-de-video-curto',
  '/guias/como-escrever-roteiro-de-video-curto',
  '/guias/quantas-vezes-postar-por-dia-no-tiktok',
  '/guias/como-medir-resultado-de-conteudo-organico',
  '/guias/o-que-e-uma-agencia-de-marketing-com-ia',
  '/guias/como-crescer-no-youtube-shorts',
  '/guias/marketing-de-conteudo-para-b2b',
  // Comparativos: as alternativas que o lead considera de verdade
  '/comparativos/freelancer-vs-agencia-de-conteudo',
  '/comparativos/conteudo-organico-vs-influenciador',
  // Glossário: métricas-base e termos da entrega
  '/glossario/engajamento',
  '/glossario/impressoes',
  '/glossario/clone-digital',
  '/glossario/roteiro-de-video-curto',
  '/glossario/legenda-embutida',
  '/glossario/feed-recomendado',
  '/glossario/cta',
  // Dor + soluções (cabeça de cluster ampla e a metade voz do clone)
  '/guias/por-que-meu-instagram-parou-de-crescer',
  '/solucoes/conteudo-para-redes-sociais-com-ia',
  '/solucoes/clone-de-voz-para-videos',
];
