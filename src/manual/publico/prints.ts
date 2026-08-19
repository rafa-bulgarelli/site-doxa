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
 *  · **Todo arquivo tem 960px de largura.** Os de 1400px saíam do `sips` como
 *    AVIF em GRADE (a imagem tilada em seis itens `av01` acima de ~960px), e
 *    grade AVIF não decodifica em todo navegador: 200 OK, `content-type` certo
 *    e moldura VAZIA na tela do cliente. Reencodados a 960px eles voltam a ser
 *    item único. O sufixo no nome (`-v2` no onboarding, `-v3` nas capturas
 *    novas da voz) não é enfeite: é o cache-bust determinístico das duas
 *    camadas (Cloudflare e Vercel) — nome já servido nunca se sobrescreve.
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
  /**
   * O `<h2>` desta tela. Sem ele, o padrão ("Na plataforma, é assim").
   *
   * Existe porque a série da voz é um bloco com NOME PRÓPRIO, dado pelo dono
   * ("Como funciona na prática"), e numerado — o cliente precisa saber que
   * está no passo 3 de 7 e não numa tela solta.
   */
  letreiro?: string;
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
  // ─── "COMO FUNCIONA NA PRÁTICA": AS SETE CAPTURAS DA VOZ ──────────────────
  //
  // Nenhuma delas tem `apos`, e isso é decisão, não esquecimento: as sete são
  // um BLOCO com começo, meio e fim ("1 de 7" … "7 de 7"), e bloco não se
  // costura passo a passo. Sem âncora, a máquina as manda para o FIM do
  // capítulo na ordem em que estão aqui (`etapasDo` → `soltos`) — que é o
  // lugar pedido pelo dono: primeiro o capítulo explica as regras da voz,
  // depois o cliente vê a plataforma inteira, do começo ao fim.
  //
  // Ancorar no último passo daria o mesmo lugar numa versão e NADA numa
  // versão antiga que não tenha aquele código — e mentiria sobre a relação:
  // estas telas provam o fluxo da plataforma, não uma regra específica.
  //
  // A ORDEM é a ordem REAL do que acontece: entrar em Minha Voz → abrir o
  // formulário → gravar → baixar o que gravou → preencher e avançar →
  // verificação por voz → verificação manual, quando a por voz não passa.
  voz: [
    {
      slug: 'voz-etapa-1',
      src: '/manual/prints/voz-etapa-1-v3.avif',
      alt:
        'Tela "Minha Voz" da plataforma, com "Minha Voz Profissional" selecionado no menu ' +
        'lateral: as três etapas do clone em linha — "Upload das gravações de voz", "Voz em ' +
        'treinamento" e "Voz pronta para uso" —, o aviso "Você ainda não tem uma voz ' +
        'profissional. Crie a sua para gerar clones e conteúdos com a sua própria voz." e os ' +
        'botões "Dicas para obter os melhores resultados" e "Criar clone de voz".',
      legenda:
        'No menu da plataforma, "Minha Voz Profissional" e depois "Criar clone de voz". É por ' +
        'aqui que se entra — e é por aqui que se volta toda vez que você sair no meio e ' +
        'precisar continuar.',
      largura: 960,
      altura: 552,
      letreiro: 'Como funciona na prática · 1 de 7',
    },
    {
      slug: 'voz-etapa-2',
      src: '/manual/prints/voz-etapa-2-v3.avif',
      alt:
        'Tela "Clone de Voz Profissional" com o formulário ainda vazio: à esquerda os campos ' +
        '"Nome da voz" (exemplo "Voz do João"), "Idioma usado nas amostras de áudio" em ' +
        'Português, "Descrição" e o par Etiqueta/Valor com "Sotaque" escolhido; à direita as ' +
        'abas "Enviar amostras" e "Grave-se", o seletor "Escolher arquivos — Nenhum arquivo ' +
        'escolhido" e a dica "Apenas arquivos .mp3 ou .webm. Dica: envie no total pelo menos 30 ' +
        'minutos de áudio (ideal: 1 hora ou mais), com fala natural e sem vícios de linguagem. ' +
        'Não precisa decorar nada"; no rodapé, "Voltar" e "Avançar" apagado.',
      legenda:
        'O formulário da esquerda pode esperar: comece pela aba "Grave-se", à direita. A ' +
        'plataforma pede 30 minutos no mínimo; a DOXA cobra 60 minutos — é esse volume que dá ' +
        'uma voz que não falha no meio de um vídeo.',
      largura: 960,
      altura: 552,
      letreiro: 'Como funciona na prática · 2 de 7',
    },
    {
      slug: 'voz-etapa-3',
      src: '/manual/prints/voz-etapa-3-v3.avif',
      alt:
        'A aba "Grave-se" durante uma gravação: o mostrador circular com as marcas "Bom 30 ' +
        'min", "Melhor 1 h" e "Melhor ainda 2 h", a linha "Mais 12 minutos necessários", as ' +
        'três dicas da plataforma ("Use um microfone profissional", "Grave em um lugar ' +
        'silencioso" e "Faça pausas se necessário. Você pode enviar várias amostras e fazer ' +
        'pausas entre as gravações."), o aviso "Gravando — 13:27" com o botão "Parar" e a lista ' +
        '"Suas amostras 17.1 MB" com gravação 1.webm (04:14), Gravação 1 (05:22) e Gravação 2 ' +
        '(08:58), cada uma com tocar, baixar e apagar.',
      legenda:
        'Grave uns três minutos, pare, grave de novo — cada trecho vira uma amostra na lista. ' +
        'Sempre no mesmo aparelho e no mesmo lugar: celular no celular, computador no ' +
        'computador. O total precisa chegar a 60 minutos.',
      largura: 960,
      altura: 552,
      letreiro: 'Como funciona na prática · 3 de 7',
    },
    {
      slug: 'voz-etapa-4',
      src: '/manual/prints/voz-etapa-4-v3.avif',
      alt:
        'A mesma tela depois de "Parar": o player com "0:00 / 13:29", o menu de três pontinhos ' +
        'aberto sobre ele com as opções "Baixar" e "Velocidade da reprodução", os botões ' +
        '"Adicionar gravação" e "Regravar", e a lista "Suas amostras 17.1 MB" com o ícone de ' +
        'baixar em cada gravação.',
      legenda:
        'Antes de sair da plataforma: nos três pontinhos, "Baixar" — ou o ícone de baixar em ' +
        'cada linha da lista. O que não for baixado a plataforma apaga quando você sai — e o ' +
        'que se perdeu tem de ser gravado de novo. Ao voltar, use "Enviar amostras" com os ' +
        'arquivos salvos e siga gravando de onde parou.',
      largura: 960,
      altura: 552,
      letreiro: 'Como funciona na prática · 4 de 7',
    },
    {
      slug: 'voz-etapa-5',
      src: '/manual/prints/voz-etapa-5-v3.avif',
      alt:
        'O formulário preenchido: "Nome da voz" com "Rafael Fernandes", idioma Português, ' +
        'descrição "Uma voz masculina, alegre, feliz e espontânea." e as etiquetas ' +
        'Sotaque/Brasileiro, Gênero da voz/Masculina e Faixa etária/Jovem; à direita, "32 ' +
        'minutos fornecidos — Continue adicionando gravações para um clone melhor", o botão ' +
        '"Gravar" e as quatro amostras somando 29.5 MB, a última delas Gravação 3 com 13:29; o ' +
        'botão "Avançar" aceso no rodapé.',
      legenda:
        'Com os 60 minutos na lista, preencha o lado esquerdo: seu nome como nome da voz, o ' +
        'idioma, uma descrição curta da sua voz e as três etiquetas — sotaque, gênero da voz e ' +
        'faixa etária. Depois, "Avançar".',
      largura: 960,
      altura: 552,
      letreiro: 'Como funciona na prática · 5 de 7',
    },
    {
      slug: 'voz-etapa-6',
      src: '/manual/prints/voz-etapa-6-v3.avif',
      alt:
        'Tela "Verifique sua voz": o texto de consentimento sobre os direitos das amostras, a ' +
        'instrução "Para confirmar que a voz é sua, grave-se lendo em voz alta o texto da ' +
        'imagem abaixo. Leia cada linha uma única vez, em ambiente silencioso, e pare de gravar ' +
        'ao terminar.", a frase em destaque "A coragem não é a ausência de medo, mas ' +
        'simplesmente seguir em frente com dignidade, apesar desse medo.", os botões "Gravar" e ' +
        '"Enviar verificação" e o link "Não consigo completar a verificação por voz".',
      legenda:
        'Esta frase curta é a ÚNICA leitura de todo o processo — o resto é fala solta, sem ' +
        'texto nenhum. Leia em voz alta, toque em "Gravar" e depois em "Enviar verificação". ' +
        'Passando, a voz entra em treinamento e fica pronta para uso.',
      largura: 960,
      altura: 552,
      letreiro: 'Como funciona na prática · 6 de 7',
    },
    {
      slug: 'voz-etapa-7',
      src: '/manual/prints/voz-etapa-7-v3.avif',
      alt:
        'A mesma tela de verificação com o aviso "Você atingiu o limite de tentativas de ' +
        'verificação. Por segurança, uma nova tentativa só será possível após 24 horas. Você ' +
        'pode fechar esta janela e voltar depois — seu progresso fica salvo.", com a liberação ' +
        'marcada para 20/08/2026, 12:02:02; abaixo, o texto "Envie documentos que comprovem a ' +
        'titularidade da voz (ex.: documento de identidade). A análise é feita manualmente pela ' +
        'equipe e pode levar alguns dias.", o seletor "Escolher arquivos", o campo "Contexto ' +
        'adicional para o revisor (opcional)" e o botão "Solicitar verificação manual".',
      legenda:
        'Não passou na verificação por voz? Peça a manual: envie um documento com foto — RG, ' +
        'CNH ou passaporte — e toque em "Solicitar verificação manual". A equipe analisa em ' +
        'alguns dias, e você pode fechar a janela: o progresso fica salvo.',
      largura: 960,
      altura: 552,
      letreiro: 'Como funciona na prática · 7 de 7',
    },
  ],
};

/** Os prints daquele capítulo, na ordem. Slug sem print devolve lista vazia. */
export function printsDaSecao(slug: string): readonly Print[] {
  return PRINTS[slug] ?? [];
}
