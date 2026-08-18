import type { Pagina } from '../../tipos';

/**
 * Verbete: define em poucas linhas e manda para o hub. A oferta comercial é de
 * `/solucoes/conteudo-organico-para-empresas`; o cluster é do hub. Divisão
 * conforme a seção Canibalização do `docs/seo/keyword-map.md`.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · a Doxa não vende tráfego pago; a garantia é de views orgânicas somadas →
 *    `docs/seo/source-of-truth.md` §1, fonte: `public/llms.txt:42`.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'conteudo-organico',
  titulo: 'Conteúdo orgânico: o que é e como se diferencia do pago',
  descricao:
    'Conteúdo orgânico é o que a empresa publica sem pagar pela exibição. O que entra nessa definição, o que fica de fora e por que a distinção importa.',
  h1: 'Conteúdo orgânico',
  resumo:
    'A definição por trás de boa parte do vocabulário de crescimento em redes sociais.',
  intencao: 'informacional',
  palavrasChave: ['conteúdo orgânico', 'o que é conteúdo orgânico', 'post orgânico'],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/solucoes/conteudo-organico-para-empresas',
    '/glossario/alcance-organico',
    '/comparativos/organico-vs-pago',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Conteúdo orgânico é toda publicação que a empresa faz sem pagar pela exibição: a plataforma decide quem vê, e essa decisão é tomada com base no comportamento de quem recebeu o conteúdo primeiro. O oposto é o conteúdo pago, em que a empresa compra o direito de aparecer para um público escolhido por ela.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que conta e o que não conta',
    },
    {
      tipo: 'lista',
      itens: [
        'Conta: vídeo, foto, carrossel, story e texto publicados no perfil da marca sem impulsionamento.',
        'Conta: material feito por criadores e publicado no perfil deles sem contrato de mídia paga — embora o custo de produção exista.',
        'Não conta: qualquer publicação impulsionada, mesmo que só por alguns reais e mesmo que a peça tenha nascido orgânica.',
        'Não conta: anúncio criado no gerenciador, ainda que ele pareça um post comum.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que a distinção importa na prática',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Porque as duas coisas se comportam de forma diferente no tempo. Um post orgânico que funcionou continua sendo entregue depois, às vezes por semanas, e o resultado dele é informação: você aprende que aquele assunto e aquela abertura funcionam. Um anúncio entrega enquanto há verba e para no dia em que ela acaba — o que ele deixa é audiência atingida, não aprendizado sobre o que sustenta atenção.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Há um efeito colateral que pouca gente antecipa: impulsionar um post orgânico apaga a resposta que você estava buscando. Depois do impulsionamento, não dá mais para saber se aquele conteúdo se sustentava sozinho.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A Doxa, aliás, não vende tráfego pago: a garantia da empresa é de views orgânicas somadas, e não de anúncios.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Para a comparação completa entre os dois caminhos, com o que cada um resolve, veja [orgânico ou pago](/comparativos/organico-vs-pago). Para o assunto inteiro, o hub de [marketing orgânico](/guias/marketing-organico).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. O fato da Doxa tem entrada no source of truth (§1).
 * [x]  3/4. Nada da §9; nenhum termo proibido — "tráfego pago" aparece só como
 *          o que a Doxa NÃO vende.
 * [x]  5. A garantia é citada na redação pública, sem número nem prazo.
 * [x]  6. Intenção própria: a definição. O comparativo decide; o hub organiza;
 *          a solução vende.
 * [x]  7. Incremental: a lista do que conta e do que não conta, e o efeito
 *          colateral do impulsionamento sobre o aprendizado.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-organico` e conecta a 4 relacionados.
 * [x] 10. Não se aplica; ainda assim o texto não conclui que orgânico ganha.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "views orgânicas somadas".
 * [x] 14. Publicaria sem Google: sim.
 * ────────────────────────────────────────────────────────────────────────── */
