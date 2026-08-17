/**
 * ─── OS PRINTS DA PLATAFORMA, COMO DADO ──────────────────────────────────────
 *
 * Dados puros: nada aqui conhece React, DOM ou `fetch`. Existe separado do
 * `Prints.tsx` porque quem decide ONDE cada print entra é a máquina do fluxo
 * (`etapasDo`), e a máquina não importa componente — se este arquivo fosse
 * `.tsx`, a derivação das etapas passaria a depender do React para responder
 * "quantas telas tem este capítulo".
 *
 * Três decisões que não são gosto:
 *
 *  · **O print NÃO é decoração.** As cenas são `aria-hidden` porque o texto ao
 *    lado já diz tudo que elas desenham. Um print carrega informação que não
 *    está escrita em lugar nenhum (a nota, os nomes dos campos, o caminho do
 *    botão), então cada um tem `alt` que descreve o que a tela mostra — nunca
 *    um alt vazio.
 *  · **Slug manda, arquivo não.** Quem tem print é o capítulo, pelo slug do
 *    banco (`onboarding`, `voz` no seed v2..v5). Capítulo sem entrada no mapa
 *    não ganha etapa nenhuma de print — versão antiga do manual atravessa isto
 *    sem um único caso especial, igual às cenas.
 *  · **`largura`/`altura` são os pixels REAIS do arquivo** (conferidos com
 *    `sips -g pixelWidth -g pixelHeight`), e o `<img>` os escreve: sem eles o
 *    navegador não reserva a altura, e a imagem chegando empurra o texto que o
 *    cliente está lendo.
 *
 * `apos` é o CÓDIGO da regra âncora — o print entra na tela seguinte à daquele
 * cartão, que é onde ele prova o que acabou de ser dito. Código que não existe
 * na versão (uma v2 antiga, um seed novo que renomeou) não quebra nada: o print
 * cai no fim do capítulo, junto com os que nunca tiveram âncora.
 */

/** Um print da plataforma, do jeito que ele entra no caminho. */
export interface Print {
  /** Identidade da etapa — vira `key` no React e é o que o teste procura. */
  slug: string;
  /** Caminho servido a partir de `public/`. */
  src: string;
  /** O que a tela MOSTRA, para quem não a enxerga. Nunca vazio. */
  alt: string;
  /** A leitura curta embaixo da imagem: o que olhar naquele print. */
  legenda: string;
  largura: number;
  altura: number;
  /** O `codigo` da regra depois da qual este print entra. Sem isto, vai ao fim. */
  apos?: string;
}

const PRINTS: Record<string, readonly Print[]> = {
  onboarding: [
    {
      slug: 'onboarding-scan',
      src: '/manual/prints/onboarding-scan.avif',
      alt:
        'Tela "Doxa Scan (onboarding)" da plataforma: a nota 46 de 100, o aviso de que não é ' +
        'preciso buscar a nota máxima porque a partir de 75 pontos já dá para seguir em frente, ' +
        'um alerta de resposta essencial a corrigir e o bloco "Alcance de topo de funil" ' +
        'avaliado em 4 de 10, com a análise da resposta logo abaixo.',
      legenda:
        'O Doxa Scan lê o onboarding inteiro e dá uma nota. Não precisa da nota máxima: de 75 ' +
        'pontos para cima já dá para seguir.',
      largura: 1400,
      altura: 805,
      apos: 'ON-1',
    },
    {
      slug: 'onboarding-negocio',
      src: '/manual/prints/onboarding-negocio.avif',
      alt:
        'Cartão "Sobre o negócio" do onboarding: a pergunta sobre o que a empresa faz hoje, a ' +
        'resposta escrita pelo cliente e, embaixo, a "Análise desta resposta" com nota 4 de 10 ' +
        'dividida em o que está bom, o que pode melhorar, como melhorar e o impacto no resultado.',
      legenda:
        'Cada resposta volta analisada, com o que está bom e o que falta. Aqui a nota é 4 de 10 ' +
        'porque a explicação ficou abstrata — faltou contar o passo a passo.',
      largura: 1400,
      altura: 1115,
      apos: 'ON-1',
    },
    {
      slug: 'onboarding-autoridade',
      src: '/manual/prints/onboarding-autoridade.avif',
      alt:
        'Cartão "Autoridade e diferencial" do onboarding com nota 3 de 10 marcada como fraca: a ' +
        'análise aponta que faltam um número verificável, uma credencial e uma posição clara ' +
        'contra algo do mercado, e explica o impacto disso nos vídeos.',
      legenda:
        'Resposta fraca não trava ninguém: a plataforma diz o que falta — um número, uma ' +
        'credencial, uma posição — e deixa seguir assim mesmo.',
      largura: 1400,
      altura: 1090,
      apos: 'ON-1',
    },
    {
      slug: 'onboarding-redes',
      src: '/manual/prints/onboarding-redes.avif',
      alt:
        'Bloco "Perfis de Redes Sociais" do onboarding, com os campos de perfil do Instagram, ' +
        'perfil do TikTok e canal do YouTube preenchidos com os links, e embaixo a confirmação ' +
        'em verde de que os perfis fornecidos estão corretos.',
      legenda:
        'No fim do onboarding entram os três perfis. São eles que a rotina de publicação usa — ' +
        'confira letra por letra antes de confirmar.',
      largura: 1400,
      altura: 851,
      apos: 'ON-2',
    },
  ],
  voz: [
    {
      slug: 'voz-minha-voz',
      src: '/manual/prints/voz-minha-voz.avif',
      alt:
        'Tela "Minha Voz" da plataforma com as três etapas do clone em sequência — upload das ' +
        'gravações de voz, voz em treinamento e voz pronta para uso —, o aviso de que ainda não ' +
        'existe uma voz profissional criada e o botão "Criar clone de voz".',
      legenda:
        'A voz tem três etapas, nessa ordem: você envia as gravações, a plataforma treina, e só ' +
        'então a voz fica pronta para uso.',
      largura: 1400,
      altura: 805,
    },
    {
      slug: 'voz-clone-de-voz',
      src: '/manual/prints/voz-clone-de-voz.avif',
      alt:
        'Formulário "Clone de Voz Profissional": campos de nome da voz, idioma das amostras em ' +
        'português, descrição e etiqueta de sotaque; à direita, as opções de enviar amostras ou ' +
        'gravar na hora, com a dica de mandar pelo menos 30 minutos de áudio, uma hora no ideal, ' +
        'com fala natural e sem decorar nada.',
      legenda:
        'É aqui que as gravações entram. A própria plataforma pede o mesmo que a gente: pelo ' +
        'menos 30 minutos de áudio, fala natural, nada decorado.',
      largura: 1400,
      altura: 805,
    },
    {
      slug: 'voz-verificar',
      src: '/manual/prints/voz-verificar.avif',
      alt:
        'Tela "Verifique sua voz": a plataforma pede que a pessoa se grave lendo em voz alta a ' +
        'frase "O sol nasce no leste e se põe no oeste", em ambiente silencioso, com os botões ' +
        '"Gravar" e "Enviar verificação".',
      legenda:
        'Antes de treinar, a plataforma confirma que a voz é sua: você lê uma frase curta na ' +
        'hora e envia.',
      largura: 1400,
      altura: 806,
    },
    {
      slug: 'voz-pendente',
      src: '/manual/prints/voz-pendente.avif',
      alt:
        'Tela "Minha Voz" com o clone em andamento: a primeira etapa concluída, a segunda em ' +
        '"voz em treinamento" com o aviso "Conclua a verificação por voz" e o cartão da voz ' +
        'criada com a etiqueta "Verificação pendente" e os botões "Concluir verificação" e ' +
        '"Descartar rascunho".',
      legenda:
        'Enquanto a verificação não é feita, a voz fica em "Verificação pendente" e o ' +
        'treinamento não começa. Tela assim é só concluir a verificação.',
      largura: 1400,
      altura: 805,
    },
  ],
};

/** Os prints daquele capítulo, na ordem. Slug sem print devolve lista vazia. */
export function printsDaSecao(slug: string): readonly Print[] {
  return PRINTS[slug] ?? [];
}
