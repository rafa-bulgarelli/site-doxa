import type { Pagina } from '../../tipos';

/**
 * Verbete de ADJACÊNCIA (§47 do brief): define o termo de forma editorial e
 * neutra, inclusive sobre usos que a Doxa não vende. A ponte legítima é o
 * clone da Doxa como ele está descrito em `HowItWorks.tsx` — nunca uma frase
 * que sugira venda de avatar como produto. A divisão com
 * `/glossario/clone-de-voz` é por IMAGEM (aqui) e VOZ (lá), conforme o
 * `docs/seo/keyword-map.md`.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · uma foto e uma amostra de voz viram um clone que grava no lugar do
 *    cliente → `docs/seo/source-of-truth.md` §1 e §2, fonte:
 *    `public/llms.txt:6-9`; `src/components/HowItWorks.tsx:84-92`;
 *  · a stack inclui HeyGen, tratada como FERRAMENTA e nunca como parceira →
 *    §6, fonte: `src/components/tools.ts:3-13,18-24`.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'avatar-de-ia',
  titulo: 'Avatar de IA: o que é o apresentador gerado por software',
  descricao:
    'Avatar de IA é a imagem de uma pessoa gerada por software para falar num vídeo. Como ele é construído, para que serve e onde ele ainda não convence.',
  h1: 'Avatar de IA',
  resumo:
    'Avatar de IA é a imagem de uma pessoa, gerada por software, que apresenta um vídeo no lugar de uma gravação com câmera. Ele pode ser um personagem inventado ou a réplica de alguém real, e essa diferença muda tudo no uso.',
  intencao: 'informacional',
  palavrasChave: ['avatar de ia', 'ai avatar', 'apresentador virtual'],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/guias/ia-no-marketing',
    '/guias/o-que-e-avatar-de-ia',
    '/glossario/clone-de-voz',
    '/solucoes/producao-de-videos-com-ia',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Avatar de IA é a imagem de uma pessoa, gerada por software, que aparece falando num vídeo sem que ninguém tenha ligado uma câmera para aquela gravação. A fala é sincronizada com um áudio, e o resultado é um apresentador que pode gravar quantas vezes for necessário, sem agenda e sem estúdio.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Dois tipos, com implicações diferentes',
    },
    {
      tipo: 'lista',
      itens: [
        '**Avatar genérico:** um personagem que não corresponde a ninguém, escolhido de um catálogo. Rápido de usar e impessoal — a mesma figura pode estar apresentando o vídeo de outra marca no mesmo dia.',
        '**Réplica de uma pessoa real:** construída a partir de material de alguém que autorizou. É o caso em que o avatar carrega o rosto de quem realmente responde pelo que está sendo dito.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Para que serve na prática',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O uso que faz diferença é o de volume: quando uma empresa precisa publicar vídeo com constância, o gargalo raramente é a ideia — é reunir a pessoa, o cenário e o tempo de gravação toda semana. Um avatar resolve exatamente esse gargalo, e não os outros. Ele não escreve um roteiro melhor nem descobre o que a audiência quer ouvir.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde ele ainda não convence',
    },
    {
      tipo: 'lista',
      itens: [
        'Emoção genuína e reação espontânea: um avatar entrega bem uma explicação, e mal uma comemoração.',
        'Demonstração física: mostrar um produto sendo usado ainda pede câmera.',
        'Vídeos em que a espontaneidade é a mensagem, como bastidores e resposta a comentário.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como isso aparece na Doxa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa usa o segundo tipo: o cliente manda uma foto e uma amostra da própria voz, e a plataforma monta um clone que grava os vídeos no lugar dele. Não é um personagem de catálogo — é a imagem de quem já responde pela marca. A produção roda sobre ferramentas de mercado, entre elas o HeyGen, que são ferramentas usadas e nada além disso: nenhuma delas endossa a Doxa.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A outra metade do assunto, a voz, está em [clone de voz](/glossario/clone-de-voz). Para o formato longo e editorial do tema, o guia [o que é um avatar de IA](/guias/o-que-e-avatar-de-ia).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Os fatos da Doxa têm entrada no source of truth (§1, §2, §6).
 * [x]  3/4. Nada da §9; o HeyGen aparece como FERRAMENTA, com a ressalva de
 *          não-endosso que `src/components/tools.ts` exige.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: a IMAGEM. A voz é do verbete vizinho; a solução
 *          comercial é de `/solucoes/clone-de-ia-para-videos`.
 * [x]  7. Incremental: a separação entre avatar genérico e réplica, e a lista
 *          honesta do que ele ainda não faz.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/ia-no-marketing` e conecta a 4 relacionados.
 * [x] 10. Não é comparativo, mas admite os limites da tecnologia.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "clone".
 * [x] 14. Publicaria sem Google: sim — a distinção entre avatar de catálogo e
 *          réplica autorizada é a primeira pergunta que alguém deveria fazer.
 * ────────────────────────────────────────────────────────────────────────── */
