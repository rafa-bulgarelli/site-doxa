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
  '/guias/como-usar-ia-no-marketing',
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
];
