import type { Pagina } from '../../tipos';

/**
 * Verbete-base do cluster de métricas. Define o que CONTA como interação e
 * mostra a armadilha do denominador. NÃO abre lista de táticas ("como aumentar
 * o engajamento") — isso é do guia de alcance — e NÃO publica "taxa ideal":
 * não existe número desses com fonte, e inventá-lo seria estatística sem
 * origem, que a régua de copy proíbe.
 *
 * A divisão com os vizinhos: `/glossario/alcance-organico` conta PESSOAS,
 * `/glossario/impressoes` conta EXIBIÇÕES, `/glossario/retencao` mede tempo
 * proporcional, e este aqui conta AÇÕES.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · comprar seguidores, curtidas, visualizações, comentários ou
 *    compartilhamentos contamina resultados e pode gerar penalização das redes
 *    — é regra do manual, condição de quem JÁ é cliente →
 *    `docs/seo/source-of-truth.md` §8, fonte: `supabase/manual-seed-v1.sql:287`.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'engajamento',
  titulo: 'Engajamento: o que conta como interação e o que não conta',
  descricao:
    'Engajamento é a soma das ações que uma pessoa faz além de assistir. O que entra na conta, os dois denominadores possíveis e por que a taxa engana.',
  h1: 'Engajamento',
  resumo:
    'Uma medida de reação — e não de quanta gente foi alcançada, que é outra métrica.',
  intencao: 'informacional',
  palavrasChave: [
    'engajamento',
    'o que é engajamento',
    'taxa de engajamento',
    'métricas de redes sociais',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/glossario/alcance-organico',
    '/glossario/impressoes',
    '/glossario/retencao',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Engajamento é a soma das ações que uma pessoa executa num conteúdo além de assistir: curtida, comentário, compartilhamento, salvamento, clique e seguir o perfil depois de ver. Ver não conta. O que conta é o que a pessoa faz **depois** de ver.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que não entra na conta',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Visualização não é engajamento — é a condição para que ele exista. Alcance também não: conta pessoas atingidas, e está em [alcance orgânico](/glossario/alcance-organico). Impressão, menos ainda: a mesma pessoa gera várias. Misturar as quatro num relatório é um jeito comum de concluir que um mês foi bom quando só foi movimentado.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A taxa depende do denominador',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Taxa de engajamento é o total de ações dividido por uma base, e há duas em uso. Sobre **seguidores**, ela favorece perfis pequenos e infla quando o vídeo alcança muita gente de fora — o número sobe sem que a base tenha mudado. Sobre **alcance**, mede o que aconteceu com quem viu. São números diferentes para o mesmo vídeo: comparar o seu com o de outra pessoa sem conferir a fórmula não diz nada.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Nem toda ação vale o mesmo',
    },
    {
      tipo: 'lista',
      itens: [
        'Curtida é barata: um toque, sem intenção clara.',
        'Salvamento diz "quero isto de volta": é interesse com prazo.',
        'Compartilhamento diz "isto serve para outra pessoa", e leva o vídeo a quem você não alcança.',
        'Comentário abre conversa, e conversa costuma manter o vídeo em circulação.',
        'Seguir é a ação mais rara, e a única que muda a relação daí em diante.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Engajamento comprado não é engajamento. Nas operações da Doxa isso é regra escrita para quem já é cliente: comprar seguidores, curtidas, visualizações, comentários ou compartilhamentos contamina os resultados e pode gerar penalização das redes. O número sobe, a leitura do que funciona se perde, e o mês seguinte é decidido sobre um dado falso.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A métrica que costuma explicar melhor a distribuição de um vídeo curto não é o engajamento, e sim a [retenção](/glossario/retencao): assistir já produz esse sinal, e só uma parte de quem assiste toca num botão.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase, sem aquecimento.
 * [x]  2. O único fato da Doxa tem entrada no source of truth (§8), e está
 *          rotulado como regra de quem JÁ é cliente.
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: AÇÕES. Alcance conta pessoas, impressões contam
 *          exibições, retenção mede tempo. Sem lista de táticas — é do guia.
 * [x]  7. Incremental: a armadilha dos dois denominadores e a hierarquia das
 *          ações. Sem "taxa ideal": esse número não tem fonte.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-organico` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo do verbete.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "operação", "visualizações".
 * [x] 14. Publicaria sem Google: sim — o denominador da taxa é a confusão que
 *          faz duas empresas discutirem números que não se comparam.
 * ────────────────────────────────────────────────────────────────────────── */
