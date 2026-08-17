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
 *  · **Os arquivos são os `-v2`, de 960px de largura.** Os de 1400px saíam do
 *    `sips` como AVIF em GRADE (a imagem tilada em seis itens `av01` acima de
 *    ~960px), e grade AVIF não decodifica em todo navegador: 200 OK,
 *    `content-type` certo e moldura VAZIA na tela do cliente. Reencodados a
 *    960px eles voltam a ser item único. O nome novo (`-v2`) não é enfeite: é
 *    o cache-bust determinístico das duas camadas (Cloudflare e Vercel) que
 *    estavam servindo o arquivo quebrado.
 *
 * E uma distinção que já custou revisão: o `alt` descreve o que a TELA mostra —
 * se o print escreve "a partir de 75 pontos", é isso que o alt conta. A régua
 * que a DOXA cobra (cada resposta de 8 para cima, e o geral de 75 para cima) é
 * assunto da LEGENDA, que é a nossa voz e não a da plataforma.
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
      src: '/manual/prints/onboarding-scan-v2.avif',
      alt:
        'Tela "Doxa Scan (onboarding)" da plataforma: a nota 46 de 100, o aviso de que não é ' +
        'preciso buscar a nota máxima porque a partir de 75 pontos já dá para seguir em frente, ' +
        'um alerta de resposta essencial a corrigir e o bloco "Alcance de topo de funil" ' +
        'avaliado em 4 de 10, com a análise da resposta logo abaixo.',
      legenda:
        'O Doxa Scan lê o onboarding inteiro e dá duas notas: uma para cada resposta e uma geral. ' +
        'Para seguir, cada resposta precisa de 8 de 10 para cima, e a nota geral, de 75 de 100 ' +
        'para cima.',
      largura: 960,
      altura: 552,
      apos: 'ON-1',
    },
    {
      slug: 'onboarding-negocio',
      src: '/manual/prints/onboarding-negocio-v2.avif',
      alt:
        'Cartão "Sobre o negócio" do onboarding: a pergunta sobre o que a empresa faz hoje, a ' +
        'resposta escrita pelo cliente e, embaixo, a "Análise desta resposta" com nota 4 de 10 ' +
        'dividida em o que está bom, o que pode melhorar, como melhorar e o impacto no resultado.',
      legenda:
        'Cada resposta volta analisada, com o que está bom e o que falta. Aqui a nota é 4 de 10 ' +
        'porque a explicação ficou abstrata — e 4 não passa: é reescrever, com o passo a passo, ' +
        'até chegar a 8.',
      largura: 960,
      altura: 765,
      apos: 'ON-1',
    },
    {
      slug: 'onboarding-autoridade',
      src: '/manual/prints/onboarding-autoridade-v2.avif',
      alt:
        'Cartão "Autoridade e diferencial" do onboarding com nota 3 de 10 marcada como fraca: a ' +
        'análise aponta que faltam um número verificável, uma credencial e uma posição clara ' +
        'contra algo do mercado, e explica o impacto disso nos vídeos.',
      legenda:
        'Resposta abaixo de 8 trava o onboarding — esta, com 3 de 10, precisa ser refeita. A ' +
        'análise diz exatamente o que falta para a nota subir: um número verificável, uma ' +
        'credencial, uma posição clara.',
      largura: 960,
      altura: 747,
      apos: 'ON-1',
    },
    // A ÂNCORA DESTE É A PRIMEIRA REGRA DO CAPÍTULO, não a última: da v7 em
    // diante o `ON-0` ("Comece pelos perfis de redes sociais") abre o
    // onboarding, e o print prova a tela logo depois dele. Num convite preso à
    // v6 — que não tem `ON-0` — este print vira "solto" e cai no fim do
    // capítulo, exatamente onde ele sempre esteve: a degradação é o
    // comportamento antigo, não um erro. Por isso a legenda fala do que o
    // cliente FAZ na plataforma, e nunca de em que tela do manual ela está.
    {
      slug: 'onboarding-redes',
      src: '/manual/prints/onboarding-redes-v2.avif',
      alt:
        'Bloco "Perfis de Redes Sociais" do onboarding, com os campos de perfil do Instagram, ' +
        'perfil do TikTok e canal do YouTube preenchidos com os links, e embaixo a confirmação ' +
        'em verde de que os perfis fornecidos estão corretos.',
      legenda:
        'Preencha os três perfis logo no começo: Instagram, TikTok e YouTube. São eles que a ' +
        'rotina de publicação usa — copie cada link dentro do app da rede e confira letra por ' +
        'letra antes de confirmar.',
      largura: 960,
      altura: 583,
      apos: 'ON-0',
    },
  ],
  // A ORDEM aqui é a ordem REAL do que acontece na plataforma: enviar as
  // amostras → fazer a verificação por voz → a plataforma treinar → a voz ficar
  // pronta. O print da verificação PENDENTE vem logo depois do envio porque é
  // esse o estado que aparece na tela assim que as gravações sobem; o da
  // verificação vem por último porque é a AÇÃO que resolve o pendente.
  voz: [
    {
      slug: 'voz-minha-voz',
      src: '/manual/prints/voz-minha-voz-v2.avif',
      alt:
        'Tela "Minha Voz" da plataforma com as três etapas do clone em sequência — upload das ' +
        'gravações de voz, voz em treinamento e voz pronta para uso —, o aviso de que ainda não ' +
        'existe uma voz profissional criada e o botão "Criar clone de voz".',
      legenda:
        'A voz passa por quatro etapas, nessa ordem: você envia as gravações, faz a verificação ' +
        'por voz, a plataforma treina, e só então a voz fica pronta para uso.',
      largura: 960,
      altura: 552,
    },
    {
      slug: 'voz-clone-de-voz',
      src: '/manual/prints/voz-clone-de-voz-v2.avif',
      alt:
        'Formulário "Clone de Voz Profissional": campos de nome da voz, idioma das amostras em ' +
        'português, descrição e etiqueta de sotaque; à direita, as opções de enviar amostras ou ' +
        'gravar na hora, com a dica de mandar pelo menos 30 minutos de áudio, uma hora no ideal, ' +
        'com fala natural e sem decorar nada.',
      legenda:
        'É aqui que as gravações entram. A própria plataforma pede o mesmo que a gente: pelo ' +
        'menos 30 minutos de áudio, fala natural, nada decorado.',
      largura: 960,
      altura: 552,
    },
    {
      slug: 'voz-pendente',
      src: '/manual/prints/voz-pendente-v2.avif',
      alt:
        'Tela "Minha Voz" com o clone em andamento: a primeira etapa concluída, a segunda em ' +
        '"voz em treinamento" com o aviso "Conclua a verificação por voz" e o cartão da voz ' +
        'criada com a etiqueta "Verificação pendente" e os botões "Concluir verificação" e ' +
        '"Descartar rascunho".',
      legenda:
        'Enviadas as gravações, a voz aparece como "Verificação pendente" — e é aí que ela fica ' +
        'parada até você concluir a verificação. Tela assim é só tocar em "Concluir verificação".',
      largura: 960,
      altura: 552,
    },
    {
      slug: 'voz-verificar',
      src: '/manual/prints/voz-verificar-v2.avif',
      alt:
        'Tela "Verifique sua voz": a plataforma pede que a pessoa se grave lendo em voz alta a ' +
        'frase "O sol nasce no leste e se põe no oeste", em ambiente silencioso, com os botões ' +
        '"Gravar" e "Enviar verificação".',
      legenda:
        'A verificação é o passo depois do envio: você lê uma frase curta na hora e envia, e a ' +
        'plataforma confirma que a voz é sua. Só então o treinamento começa e a voz é liberada.',
      largura: 960,
      altura: 553,
    },
  ],
};

/** Os prints daquele capítulo, na ordem. Slug sem print devolve lista vazia. */
export function printsDaSecao(slug: string): readonly Print[] {
  return PRINTS[slug] ?? [];
}
