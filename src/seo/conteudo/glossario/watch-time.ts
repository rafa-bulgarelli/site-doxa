import type { Pagina } from '../../tipos';

/**
 * Verbete: o par de `/glossario/retencao`. Aqui a medida é TEMPO ABSOLUTO; lá
 * é proporção. O verbete não abre lista de táticas.
 *
 * Sem fato da Doxa e sem estatística de terceiro.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'watch-time',
  titulo: 'Watch time: o tempo total que o seu vídeo somou',
  descricao:
    'Watch time é a soma do tempo que as pessoas passaram assistindo ao seu vídeo. Como ele difere da retenção e por que vídeo curto pode ganhar de vídeo longo.',
  h1: 'Watch time',
  resumo:
    'Enquanto a retenção mede proporção, o watch time mede tempo absoluto — e é a leitura dos dois juntos que diz se o vídeo prendeu muita gente ou pouca gente por muito tempo.',
  intencao: 'informacional',
  palavrasChave: ['watch time', 'tempo de exibição', 'tempo médio de visualização'],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/glossario/retencao',
    '/glossario/short-form',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Watch time é o tempo total assistido de um vídeo, somando todas as pessoas que o viram. Ele aparece de duas formas nos painéis das plataformas: o tempo somado e o tempo médio por espectador, que é o total dividido por quem assistiu.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A diferença para a retenção',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Retenção é proporcional e responde onde as pessoas saíram. Watch time é absoluto e responde quanto tempo elas ficaram. Um vídeo pode ter retenção excelente e watch time baixo — bastam poucas pessoas assistindo a um vídeo curtíssimo até o fim —, e o contrário também acontece.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um exemplo hipotético',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Vídeo', 'Duração', 'Retenção média', 'Tempo médio assistido'],
      linhas: [
        ['A', '15 s', '80%', '12 s'],
        ['B', '60 s', '25%', '15 s'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Os dois vídeos da tabela são números inventados para ilustrar a leitura, e não a medição de ninguém. O vídeo A parece muito melhor pela retenção, e é mesmo melhor no que ele se propôs a fazer. Mas o vídeo B segurou cada pessoa por mais tempo. Os dois números medem coisas diferentes, e usar só um deles leva a decisões ruins: pela retenção você cortaria o B; pelo watch time você abandonaria o A.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que fazer com o número',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A leitura mais útil é comparar o tempo médio assistido com a duração do vídeo, e não perseguir o watch time somado — que sobe naturalmente com o alcance e por isso mede mais a distribuição do que a qualidade. Vídeo curto com tempo médio próximo da duração total é um vídeo que fez o trabalho dele.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O verbete vizinho é [retenção](/glossario/retencao); a definição do formato que essas métricas medem está em [short-form](/glossario/short-form).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Nenhum fato sobre a Doxa nesta página. Os números da tabela são um
 *          EXEMPLO didático declarado como tal, não resultado de cliente.
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: a métrica de tempo absoluto.
 * [x]  7. Incremental: a tabela que mostra as duas métricas discordando.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário coerente.
 * [x] 14. Publicaria sem Google: sim.
 * ────────────────────────────────────────────────────────────────────────── */
