import type { Pagina } from '../../tipos';

/**
 * Verbete: define e diz como se mede. NÃO abre lista de táticas — isso é de
 * `/guias/como-aumentar-o-alcance-organico`, conforme a seção Canibalização do
 * `docs/seo/keyword-map.md`.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · as visualizações contabilizadas nas metas são orgânicas, sem depender de
 *    compra de mídia → `docs/seo/source-of-truth.md` §8, fonte:
 *    `src/components/faq/config.ts:174-175`.
 * O resto é definição de mecanismo, sem número de terceiro.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'alcance-organico',
  titulo: 'Alcance orgânico: o que é, como se mede e o que não é',
  descricao:
    'Alcance orgânico é quanta gente diferente viu o seu conteúdo sem que ninguém pagasse por isso. O que ele mede, como se calcula e a diferença para impressões.',
  h1: 'Alcance orgânico',
  resumo:
    'Alcance orgânico é o número de pessoas diferentes que viram o seu conteúdo sem que ninguém tenha pagado para que ele aparecesse. É a métrica que separa distribuição conquistada de distribuição comprada.',
  intencao: 'informacional',
  palavrasChave: ['alcance orgânico', 'o que é alcance orgânico', 'alcance x impressões'],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/guias/como-aumentar-o-alcance-organico',
    '/glossario/conteudo-organico',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Alcance orgânico é o número de pessoas diferentes que viram uma publicação sem que ninguém tenha pagado por essa exibição. A palavra que faz o trabalho na definição é **diferentes**: alcance conta pessoas, não exibições.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Alcance não é o mesmo que impressões',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Impressões contam quantas vezes o conteúdo apareceu na tela; alcance conta quantas pessoas o viram. Se a mesma pessoa assiste ao seu vídeo três vezes, são três impressões e um alcance. Por isso impressões é sempre um número maior, e por isso comparar o alcance de um mês com as impressões de outro produz conclusões erradas.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O número que interessa dentro do alcance',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Num perfil que quer crescer, o alcance total diz pouco sozinho. O recorte útil é a fatia que veio de gente que ainda não segue o perfil, porque é ela que mede se você está encontrando público novo ou apenas conversando com quem já chegou. As três redes de vídeo curto mostram esse recorte nas métricas de cada publicação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um exemplo concreto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um perfil com 2.000 seguidores publica um vídeo que alcança 18.000 pessoas, das quais 16.500 não seguem o perfil. Isso não é sorte nem compra: é a plataforma tendo mostrado o vídeo a estranhos e eles tendo ficado. Um segundo vídeo, na mesma semana, alcança 2.100 pessoas — quase todas seguidores. O segundo não foi distribuído; ele apenas apareceu para quem já estava lá.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'É esse tipo de alcance que a Doxa contabiliza nas metas dos clientes: visualizações orgânicas, vindas da distribuição dos conteúdos produzidos na operação, sem depender da compra de mídia.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se o seu alcance parou de crescer, o diagnóstico e as alavancas estão em [como aumentar o alcance orgânico](/guias/como-aumentar-o-alcance-organico).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase, sem aquecimento.
 * [x]  2. O único fato da Doxa tem entrada no source of truth (§8).
 * [x]  3/4. Nada da §9; nenhum termo proibido.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: definição e medida. As táticas são do guia.
 * [x]  7. Incremental: a distinção alcance × impressões e o exemplo numérico
 *          ilustrativo (números de exemplo, declarados como exemplo, não como
 *          resultado de cliente).
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-organico` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no meio do verbete — só o fecho padrão do motor.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "operação", "visualizações contabilizadas".
 * [x] 14. Publicaria sem Google: sim — a confusão entre alcance e impressões é
 *          real e custa decisão errada todo mês.
 * ────────────────────────────────────────────────────────────────────────── */
