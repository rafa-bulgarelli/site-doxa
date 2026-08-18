import type { Pagina } from '../../tipos';

/**
 * Verbete da SUPERFÍCIE, não do mecanismo. `/glossario/algoritmo-do-tiktok`
 * já é dono de COMO o sistema decide (o ciclo de amostra, os sinais, os
 * mitos); esta página não repete nada disso: ela explica o que é a tela, como
 * ela difere do feed de quem você segue e o que essa diferença muda para quem
 * publica. Por isso o verbete serve para qualquer rede, e não só para o TikTok.
 *
 * Sem fato da Doxa e sem estatística de terceiro. Nenhuma afirmação sobre o
 * funcionamento interno das plataformas: o que está descrito é comportamento
 * observável por qualquer pessoa que use o aplicativo.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'feed-recomendado',
  titulo: 'Feed recomendado: a tela onde estranhos veem seu vídeo',
  descricao:
    'Feed recomendado é a aba que mostra conteúdo de perfis que você não segue. O que muda quando a distribuição deixa de depender da sua lista de seguidores.',
  h1: 'Feed recomendado',
  resumo:
    'Onde ficam o "Para você" do TikTok, a aba de Reels e a de Shorts — a superfície em que um perfil pequeno pode alcançar gente que nunca ouviu falar dele.',
  intencao: 'informacional',
  palavrasChave: [
    'feed recomendado',
    'para você',
    'aba de recomendações',
    'feed de recomendação',
  ],
  hubs: ['/guias/marketing-no-tiktok'],
  relacionadas: [
    '/glossario/algoritmo-do-tiktok',
    '/glossario/alcance-organico',
    '/glossario/short-form',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Feed recomendado é a tela em que a plataforma decide o que mostrar, em vez de listar o que os perfis seguidos publicaram. Ele aparece com nomes diferentes em cada rede — "Para você", a aba de Reels, a aba de Shorts —, e a característica comum é uma só: o que aparece ali não se limita às contas que a pessoa segue.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A diferença para o feed de quem você segue',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O feed de seguidos é uma lista: quem você escolheu, em alguma ordem. O feed recomendado é uma seleção: a plataforma escolhe, item a item, a partir do comportamento de quem está assistindo. No primeiro, seu público é o teto do seu alcance. No segundo, o número de seguidores deixa de ser o limite — e também deixa de ser garantia.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que isso muda para quem publica',
    },
    {
      tipo: 'lista',
      itens: [
        'O tamanho da conta não é passaporte: a tela mistura perfis grandes e perfis que ninguém conhece, e o critério de quem entra é do sistema de recomendação, não seu.',
        'O contexto tem de estar dentro da peça: quem vê não sabe quem você é, não viu o vídeo anterior e não vai ler a bio antes.',
        'Seguidor deixa de ser a métrica que resume tudo — o que resume é quanta gente nova o conteúdo alcança, assunto de [alcance orgânico](/glossario/alcance-organico).',
        'A ordem não é cronológica: publicar mais tarde não garante o topo da tela de ninguém.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Esta página descreve a superfície, não o critério. Como a seleção é feita — o ciclo de teste com um grupo pequeno, os sinais que pesam e o que é mito — está em [algoritmo do TikTok](/glossario/algoritmo-do-tiktok), e o mesmo raciocínio vale, com nomes diferentes, nas outras redes.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O formato que essa tela consome é o vídeo vertical curto, definido em [short-form](/glossario/short-form). Para a estratégia inteira nessa rede, o hub de [marketing no TikTok](/guias/marketing-no-tiktok).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Nenhum fato sobre a Doxa nesta página.
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: a SUPERFÍCIE. O mecanismo é do verbete de
 *          algoritmo, que esta página linka em vez de repetir.
 * [x]  7. Incremental: "no feed de seguidos o seu público é o teto; no
 *          recomendado, o número de seguidores deixa de ser limite e de ser
 *          garantia" — e a consequência prática para o roteiro.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-no-tiktok` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo do verbete.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário coerente com o do repositório.
 * [x] 14. Publicaria sem Google: sim — muita gente ainda mede um perfil de
 *          vídeo curto pelo número de seguidores.
 * ────────────────────────────────────────────────────────────────────────── */
