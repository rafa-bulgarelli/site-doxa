import type { Pagina } from '../../tipos';

/**
 * Verbete de ADJACÊNCIA (§47 do brief): a metade VOZ do par com
 * `/glossario/avatar-de-ia`. Editorial e neutro, inclusive sobre usos que a
 * Doxa não vende; a ponte é o clone da Doxa como está em `HowItWorks.tsx`.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · uma foto e uma amostra de voz viram um clone que grava no lugar do
 *    cliente → `docs/seo/source-of-truth.md` §1 e §2, fonte:
 *    `public/llms.txt:6-9`; `src/components/HowItWorks.tsx:84-92`;
 *  · cada vídeo entregue é único, com roteiro, voz clonada, edição e capa →
 *    §2, fonte: `supabase/manual-seed-v2.sql:168`;
 *  · a stack inclui ElevenLabs, tratada como FERRAMENTA e nunca como parceira
 *    → §6, fonte: `src/components/tools.ts:3-13,18-24`.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'clone-de-voz',
  titulo: 'Clone de voz: como uma amostra vira locução sintética',
  descricao:
    'Clone de voz é a reprodução da voz de uma pessoa por software, a partir de uma amostra. Como funciona, para que serve e o que exige em consentimento.',
  h1: 'Clone de voz',
  resumo:
    'Clone de voz é a reprodução sintética da voz de uma pessoa específica, construída a partir de uma amostra do que ela falou. A partir dela, qualquer texto pode virar locução naquela voz — o que torna o consentimento a parte mais importante do assunto.',
  intencao: 'informacional',
  palavrasChave: ['clone de voz', 'voz sintética', 'clonagem de voz ia'],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/guias/ia-no-marketing',
    '/glossario/avatar-de-ia',
    '/solucoes/clone-de-ia-para-videos',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Clone de voz é a reprodução da voz de uma pessoa específica por software, feita a partir de uma amostra do que ela já falou. Com o modelo pronto, qualquer texto escrito depois pode ser transformado em locução naquela voz, com a entonação e o sotaque dela.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como difere de uma voz sintética comum',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Uma voz sintética genérica é a que os aplicativos de leitura usam há anos: soa como ninguém em particular. Um clone é o oposto — ele soa como uma pessoa determinada, e essa é exatamente a razão de existir e o motivo de exigir cuidado. Reconhecer a voz de alguém é uma forma de confiança, e clonar uma voz é reproduzir esse sinal de confiança.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Para que serve em produção de conteúdo',
    },
    {
      tipo: 'lista',
      itens: [
        'Manter a mesma voz em dezenas de vídeos sem regravar locução a cada peça.',
        'Corrigir uma frase de um vídeo já produzido sem remarcar gravação.',
        'Produzir em ritmo constante quando a pessoa que fala pela marca não tem agenda para gravar toda semana.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'A regra que não se negocia: só se clona a voz de quem autorizou, e para o uso que foi autorizado. Voz é dado pessoal e é elemento de identificação — a facilidade técnica de reproduzir uma voz não cria nenhum direito de usá-la.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como isso aparece na Doxa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O clone da Doxa é feito com material do próprio cliente: uma foto e uma amostra da voz dele, entregues por ele. Cada vídeo produzido depois é único — roteiro, voz clonada, edição e capa. A produção roda sobre ferramentas de mercado, entre elas o ElevenLabs, que são ferramentas usadas e nada além disso: nenhuma delas endossa a Doxa.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A metade da imagem está em [avatar de IA](/glossario/avatar-de-ia). O cluster inteiro de IA está no hub de [IA no marketing](/guias/ia-no-marketing).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Os fatos da Doxa têm entrada no source of truth (§1, §2, §6).
 * [x]  3/4. Nada da §9; ElevenLabs aparece como FERRAMENTA, com a ressalva de
 *          não-endosso.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: a VOZ. A imagem é do verbete vizinho.
 * [x]  7. Incremental: a diferença entre voz sintética genérica e clone, e a
 *          nota de consentimento.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/ia-no-marketing` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "clone", "voz clonada".
 * [x] 14. Publicaria sem Google: sim — o parágrafo do consentimento é o que
 *          falta em boa parte das páginas sobre o tema.
 * ────────────────────────────────────────────────────────────────────────── */
