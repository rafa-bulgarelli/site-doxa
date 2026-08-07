import { TROCA_DEPOIS } from '../comparacao/config';
import { REELS, type Reel } from '../proof/reels';

/*
 * ─── O CONTEÚDO DO RODAPÉ ────────────────────────────────────────────────────
 *
 * A regra do `faq/config.ts` vale aqui inteira, e por um motivo a mais: este é
 * o ÚLTIMO texto da página. Uma frase inventada sobre prazo, preço ou garantia
 * no rodapé é uma promessa publicada — e no lugar onde ela é lida por quem já
 * decidiu. Então nada nasce aqui: tudo é IMPORTADO de onde o fato já mora. Uma
 * cópia que o compilador mantém é melhor do que duas que um humano promete
 * manter, e este arquivo não tem uma única sentença comercial própria.
 *
 * As duas exceções são texto sobre a TELA, não sobre o serviço: o fecho ("você
 * leu até o fim") e os rótulos de navegação. Nenhum dos dois promete nada.
 */

/**
 * ─── O MOSAICO É DE VÍDEO, a pedido do dono ─────────────────────────────────
 *
 * Ele era de TEXTO, e o argumento de então está aqui porque continua verdadeiro
 * e agora é uma dívida em vez de uma decisão: este repositório tem TRÊS
 * clientes, e um infinito construído com três peças distintas denuncia o loop
 * no primeiro puxão. O que mudou é o que se ganha do outro lado — o rodapé
 * passa a fechar a página com a MESMA coisa que a página inteira promete
 * entregar, em movimento, em vez de com uma repetição das frases que a pessoa
 * acabou de ler duas telas acima.
 *
 * PENDENTE-DONO: as seis peças são os três reels reais repetidos, exatamente
 * como a parede de prova faz em `proof/reels.ts` e pela mesma razão — a
 * repetição é quantos retângulos se desenha, e nunca uma afirmação de quantos
 * casos existem. Quando os arquivos que faltam entrarem em `REELS`, a
 * repetição para sozinha e não há nada para desfazer aqui.
 */

/**
 * Quantos vídeos tocam ao mesmo tempo.
 *
 * Seis, e o número é do dono. Ele NÃO é mais "quantos lugares o desenho tem" —
 * a grade uniforme tem trinta lugares por cópia e cento e vinte no documento,
 * porque o campo desenha o mosaico quatro vezes para que a volta do infinito
 * seja invisível. Seis é o teto de quantas dessas molduras estão TOCANDO; o
 * resto é still, que é a mesma imagem repetida e custa quase nada. A troca
 * acontece conforme o campo deriva, e `rodape/Peca.tsx` explica as vagas.
 */
export const EXPOSTAS = 6;

/** Onde uma peça senta na grade: coluna e linha, de 1 em diante. */
export interface Lugar {
  coluna: number;
  linha: number;
}

/**
 * ─── A GRADE UNIFORME, EM COLUNAS DESENCONTRADAS ─────────────────────────────
 *
 * Pedido do dono, e substituiu o X de seis peças que morava aqui: três vídeos
 * empilhados por coluna, sempre o mesmo vão entre eles, e a coluna seguinte
 * DESCE meio passo — o vão inteiro — para que duas vizinhas nunca alinhem as
 * bordas na mesma altura.
 *
 *     █ · █ · █ ·        ( · = a mesma coluna, meio passo abaixo )
 *     · █ · █ · █
 *     █ · █ · █ ·
 *     · █ · █ · █
 *
 * O deslocamento é `translateY` em `Peca.tsx`, e não margem: as linhas são
 * `auto`, e uma margem no topo de uma peça esticaria a linha inteira — as
 * outras nove colunas desceriam junto, que é exatamente o contrário do desenho.
 *
 * ─── POR QUE DEZ COLUNAS, E POR QUE UM NÚMERO PAR ────────────────────────────
 *
 * Três exigências se cruzam neste número, e ele é a menor coisa que satisfaz as
 * três:
 *
 *  1. PAR, senão a emenda aparece. O bloco se repete lado a lado, e o
 *     desencontro só continua na cópia seguinte se a última coluna do bloco for
 *     descida e a primeira da próxima não for. Com número ímpar, duas colunas
 *     na mesma altura se encostam na emenda e o padrão denuncia onde ele
 *     recomeça.
 *
 *  2. LARGO o bastante para cobrir a janela. A volta do infinito acontece a um
 *     bloco de distância, então um bloco mais estreito que a tela deixa uma
 *     faixa vazia entrar em cena no fim da deriva. Dez colunas de 11rem com vão
 *     de 50px dão 2260px de bloco — e o mosaico de seis peças que estava aqui
 *     media 1248px numa janela de 1507, com a falha já presente e disfarçada
 *     pelo vazio do próprio X.
 *
 *  3. NÃO múltiplo de três, que é quantos clientes existem. Os reels são
 *     distribuídos linha a linha; com nove ou doze colunas, cada linha
 *     recomeçaria no mesmo arquivo e as colunas sairiam todas idênticas. Dez
 *     deixa resto um, então cada linha entra deslocada de um cliente e o mesmo
 *     rosto nunca cai ao lado nem em cima de si mesmo.
 */
const COLUNAS = 10;
const LINHAS = 3;

const LUGARES: readonly Lugar[] = Array.from({ length: LINHAS }, (_, linha) =>
  Array.from({ length: COLUNAS }, (_, coluna) => ({ coluna: coluna + 1, linha: linha + 1 })),
).flat();

/**
 * As peças: cada lugar com o reel que o ocupa.
 *
 * A ordem é LINHA a linha, e é ela que faz a distribuição funcionar. A volta
 * pelo resto (`% REELS.length`) anda um passo a cada peça, então dois vizinhos
 * de lado nunca são o mesmo arquivo; e como uma linha tem dez peças e três não
 * divide dez, a linha de baixo começa um cliente adiante — o que resolve o
 * vizinho de cima e de baixo pela mesma conta.
 *
 * PENDENTE-DONO segue valendo: são os três clientes reais repetidos, como a
 * parede de prova faz. A repetição é quantos retângulos se desenha, e nunca uma
 * afirmação de quantos casos existem.
 */
export const PECAS: readonly { lugar: Lugar; reel: Reel }[] = LUGARES.map(
  (lugar, indice) => ({ lugar, reel: REELS[indice % REELS.length] }),
);

/**
 * O fecho: a última coisa que a página fala.
 *
 * Não promete nada de novo — descreve o que já aconteceu ("você leu até o fim")
 * e o que falta, que é a mesma troca do "como funciona", importada. As duas
 * plateias numa frase só, a pedido do dono: quem tem um negócio e quem atende
 * vários chegam ao mesmo formulário, então não são dois caminhos, são duas
 * maneiras de dizer a mesma oferta.
 */
export const FECHO = {
  titulo: 'Você leu até o fim.',
  linha: `O que falta é ${TROCA_DEPOIS.toLowerCase().replace(/\.$/, '')}.`,
  publico: 'Para quem tem um negócio, e para quem atende vários.',
  acao: 'Falar com a gente',
  /** Onde o pedido mora — o mesmo destino do escape do FAQ. */
  destino: '#pedido',
};

/**
 * Os links rápidos: âncoras que EXISTEM.
 *
 * Só entra aqui o que tem um `id` correspondente na página. Um rodapé cheio de
 * links que não levam a lugar nenhum é pior do que um rodapé curto — e este
 * repositório acabou de perder tempo com exatamente isso: `#pedido` era
 * apontado por dois botões e não existia em elemento nenhum.
 */
export const ATALHOS: readonly { rotulo: string; destino: string }[] = [
  { rotulo: 'Perguntas', destino: '#faq' },
  { rotulo: 'Falar com a gente', destino: '#pedido' },
];
