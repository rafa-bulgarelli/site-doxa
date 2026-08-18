import type { Pagina } from '../../tipos';

/**
 * O termo que o DONO usa ("uma foto e um áudio viram o seu clone"). Este
 * verbete é o guarda-chuva das duas metades que já têm verbete próprio:
 * `/glossario/avatar-de-ia` é a IMAGEM e `/glossario/clone-de-voz` é a VOZ.
 * Aqui não se repete a construção de nenhuma das duas — o assunto é o que
 * define um clone (ser de uma pessoa determinada), o que o separa de um avatar
 * de catálogo e o consentimento que ele exige.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · o cliente manda uma foto e uma amostra da própria voz, e a plataforma
 *    monta um clone que grava os vídeos no lugar dele → `docs/seo/source-of-truth.md`
 *    §1 e §2, fonte: `public/llms.txt:6-9`; `src/components/HowItWorks.tsx:84-92`;
 *  · o passo 02 se chama "Criar clones" e a manchete dele é "Uma foto e um
 *    áudio viram o seu clone" → §2, fonte: `src/components/HowItWorks.tsx:71-92`;
 *  · "clone" é termo do dono → §10, fonte: `src/components/HowItWorks.tsx:84`.
 *
 * NÃO entra aqui: preço, prazo do primeiro vídeo, direitos do vídeo (§9.1,
 * pergunta 10) e nenhuma afirmação sobre o que a lei exige — o verbete fala de
 * autorização como prática, não como parecer jurídico.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'clone-digital',
  titulo: 'Clone digital: a réplica que grava no lugar da pessoa',
  descricao:
    'Clone digital é a réplica da imagem e da voz de alguém real, feita com material dessa pessoa. O que o separa de um avatar de catálogo e o que ele exige.',
  h1: 'Clone digital',
  resumo:
    'Clone digital é a réplica de uma pessoa real — a imagem dela e a voz dela — construída a partir de material que ela mesma forneceu, e usada para gravar vídeos sem que ela precise gravar. O detalhe que define o termo é a origem: um clone é de alguém específico, e por isso depende da autorização dessa pessoa.',
  intencao: 'informacional',
  palavrasChave: [
    'clone digital',
    'o que é clone digital',
    'clone de ia',
    'réplica digital de pessoa',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/guias/ia-no-marketing',
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
      texto: 'O que separa um clone de um avatar de catálogo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um avatar genérico é um personagem que não corresponde a ninguém e pode estar apresentando o vídeo de outra marca no mesmo dia — a construção dele está em [avatar de IA](/glossario/avatar-de-ia). Um clone é o contrário: carrega o rosto e a voz de quem já responde pela empresa. Quem assiste reconhece uma pessoa, e o que ela diz continua dito por ela.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que o clone resolve, e o que ele não resolve',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Ele resolve um gargalo específico: reunir a pessoa, o cenário e o tempo de gravação toda semana — publicar com constância deixa de depender da agenda de quem fala pela marca. O que ele não resolve é o resto: um clone não descobre o que a audiência quer ouvir nem conserta abertura fraca. A parte que decide o alcance continua escrita por gente.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Só se clona quem autorizou, e para o uso que foi autorizado. Rosto e voz identificam uma pessoa: a facilidade técnica de reproduzi-los não cria direito de usá-los. Registre por escrito quem autorizou, para qual finalidade e por quanto tempo — antes da primeira peça.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como o termo é usado na Doxa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É o vocabulário da própria operação: o cliente manda uma foto e uma amostra da voz, e a plataforma monta o clone que grava os vídeos no lugar dele. O passo se chama "criar clones", e a frase que o descreve é "uma foto e um áudio viram o seu clone". A metade da voz está em [clone de voz](/glossario/clone-de-voz).',
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
 *          próprio, e a página comercial é `/solucoes/clone-de-ia-para-videos`.
 * [x]  7. Incremental: a distinção clone × avatar de catálogo pelo lado da
 *          responsabilidade, e o que o clone NÃO resolve.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/ia-no-marketing` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo do verbete.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "clone", "uma foto e um áudio viram o seu
 *          clone", "operação".
 * [x] 14. Publicaria sem Google: sim — a nota de consentimento é a pergunta
 *          que ninguém faz antes de encomendar o primeiro vídeo.
 * ────────────────────────────────────────────────────────────────────────── */
