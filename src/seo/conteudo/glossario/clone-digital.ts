import type { Pagina } from '../../tipos';

/**
 * O termo que o DONO usa ("uma foto e um áudio viram o seu clone"). Este
 * verbete é o guarda-chuva das duas metades que já têm verbete próprio:
 * `/glossario/avatar-de-ia` é a IMAGEM e `/glossario/clone-de-voz` é a VOZ.
 * Aqui não se repete NADA da construção das duas: nem os dois tipos de avatar
 * (é bloco de `avatar-de-ia`), nem o gargalo de agenda que o clone resolve
 * (idem), nem a regra de consentimento da voz (é bloco de `clone-de-voz`).
 * Uma linha e um link para cada metade. O que sobra é o que SÓ o guarda-chuva
 * tem: imagem e voz são duas autorizações distintas e revogáveis em separado,
 * e a pergunta contratual de quando a pessoa clonada sai da empresa.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · o cliente manda uma foto e uma amostra da própria voz, e a plataforma
 *    monta um clone que grava os vídeos no lugar dele → `docs/seo/source-of-truth.md`
 *    §1 e §2, fonte: `public/llms.txt:6-9`; `src/components/HowItWorks.tsx:84-92`;
 *  · o passo 02 se chama "Criar clones" e a manchete dele é "Uma foto e um
 *    áudio viram o seu clone" → §2, fonte: `src/components/HowItWorks.tsx:71-92`;
 *  · "clone" é termo do dono → §10, fonte: `src/components/HowItWorks.tsx:84`.
 *
 * NÃO entra aqui: preço, prazo do primeiro vídeo e nenhuma afirmação sobre o
 * que a lei exige — o verbete fala de autorização como prática, não como
 * parecer jurídico. E NÃO se responde de quem são os direitos do vídeo: é a
 * pergunta 10 de PENDENTES (§9.1, `src/components/faq/config.ts:672-717`).
 * A página faz o que é permitido fazer com uma pergunta sem resposta
 * autorizada: diz que ela existe, que a hora de fazê-la é antes, e que a
 * resposta é contratual.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'clone-digital',
  titulo: 'Clone digital: a réplica que grava no lugar da pessoa',
  descricao:
    'Clone digital é a réplica da imagem e da voz de alguém real, feita com material dessa pessoa. Por que são duas autorizações e o que combinar antes do vídeo.',
  h1: 'Clone digital',
  resumo:
    'O detalhe que define o termo é a origem: um clone é de alguém específico, e por isso depende da autorização dessa pessoa.',
  intencao: 'informacional',
  palavrasChave: [
    'clone digital',
    'o que é clone digital',
    'clone de ia',
    'réplica digital de pessoa',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/glossario/avatar-de-ia',
    '/glossario/clone-de-voz',
    '/solucoes/clone-de-ia-para-videos',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Clone digital é a réplica de uma pessoa real, imagem e voz, construída a partir de material fornecido por ela e usada para gravar vídeos sem uma nova gravação. Ele junta as duas metades tratadas em separado: o rosto e a voz que fala.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As duas metades já têm verbete',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A imagem está em [avatar de IA](/glossario/avatar-de-ia); a voz, em [clone de voz](/glossario/clone-de-voz). O que só aparece quando se olha para as duas juntas é o que vem abaixo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'São duas autorizações, não uma',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Rosto e voz são materiais distintos, e a permissão de usar um não é a de usar o outro. Alguém pode ceder a voz e não o rosto, ou aceitar uma campanha e não todas. Trate cada metade como item separado — quem autorizou, para quê, por quanto tempo — em vez de um "sim" genérico dado numa conversa.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'A permissão também é revogável em separado: retirada a da voz, o clone de imagem não cai junto. Saber qual metade está em qual peça é o que permite atender a um pedido desses sem apagar a biblioteca inteira.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A pergunta a fazer antes da primeira peça',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O clone costuma ser o de um sócio ou de um porta-voz — e pessoas saem das empresas. O que acontece com ele nesse dia, e por quanto tempo o material já gravado segue no ar, não é questão técnica: é contratual, e se combina antes do primeiro vídeo. Esta página não responde isso por você; registra que a pergunta existe.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como o termo é usado na Doxa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É o vocabulário do passo 02 da operação, "criar clones": "uma foto e um áudio viram o seu clone". O material é do próprio cliente, e o clone grava no lugar dele.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Os fatos da Doxa têm entrada no source of truth (§1, §2, §10) e usam
 *          a redação publicada do `HowItWorks.tsx`.
 * [x]  3. Nada da §9: sem preço, sem prazo do primeiro vídeo, sem direitos do
 *          vídeo (é uma das dez perguntas sem resposta autorizada).
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: o termo GUARDA-CHUVA. Imagem e voz têm verbete
 *          próprio e recebem UMA linha + link cada, sem repetir os blocos
 *          deles; a página comercial é `/solucoes/clone-de-ia-para-videos`.
 * [x]  7. Incremental, e só do guarda-chuva: duas autorizações em vez de uma,
 *          revogáveis em separado, e a pergunta de quando a pessoa clonada sai
 *          da empresa — sem responder direitos do vídeo (PENDENTES §9.1).
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/ia-no-marketing` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo do verbete.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "clone", "uma foto e um áudio viram o seu
 *          clone", "operação".
 * [x] 14. Publicaria sem Google: sim — "são duas autorizações" e "o que
 *          acontece quando essa pessoa sai" são as perguntas que ninguém faz
 *          antes de encomendar o primeiro vídeo.
 * ────────────────────────────────────────────────────────────────────────── */
