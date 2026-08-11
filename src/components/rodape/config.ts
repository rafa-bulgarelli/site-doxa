import { HREF_FAQ, HREF_FORMS } from '../../ancoras';
import type { Idioma, PorIdioma } from '../../idioma';
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
 * PENDENTE-DONO: as trinta peças da grade são os três reels reais repetidos,
 * exatamente como a parede de prova faz em `proof/reels.ts` e pela mesma razão
 * — a repetição é quantos retângulos se desenha, e nunca uma afirmação de
 * quantos casos existem. Quando os arquivos que faltam entrarem em `REELS`, a
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
 * DESCE — 200px no desktop, que é o dobro do vão e perto de meio passo — para
 * que duas vizinhas nunca alinhem as bordas na mesma altura.
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
 *     de 100px dão 2760px de bloco — e o mosaico de seis peças que estava aqui
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
 * As peças: cada lugar com o reel que o ocupa. SÓ VÍDEO.
 *
 * Um em cada quatro lugares já foi cartão de custo — o video maker, o
 * roteirista, a agência —, e o dono mandou tirar depois de ver na tela. Fica a
 * razão pela qual a ideia era boa e mesmo assim não era: o cartão diz o que a
 * Doxa substitui, e é um argumento que a página inteira já fez duas seções
 * antes, com a lista completa e com a conta somando na frente da pessoa. Aqui
 * embaixo, o trabalho é outro — quem chegou ao rodapé já leu o argumento, e o
 * que falta é ver a coisa entregue.
 *
 * A distribuição é LINHA a linha, e é essa ordem que faz a conta funcionar. A
 * volta pelo resto (`% REELS.length`) anda um passo a cada peça, então dois
 * vizinhos de lado nunca são o mesmo arquivo; e como uma linha tem dez peças e
 * três não divide dez, a linha de baixo começa um cliente adiante — o que
 * resolve o vizinho de cima e de baixo pela mesma conta.
 *
 * PENDENTE-DONO: são os três clientes reais repetidos, como a parede de prova
 * faz. A repetição é quantos retângulos se desenha, e nunca uma afirmação de
 * quantos casos existem.
 */
export const PECAS: readonly { lugar: Lugar; reel: Reel }[] = LUGARES.map(
  (lugar, indice) => ({ lugar, reel: REELS[indice % REELS.length] }),
);

/**
 * O fecho: a última coisa que a página fala.
 *
 * ─── O QUE MUDOU, E POR QUÊ ──────────────────────────────────────────────────
 *
 * Era "Você leu até o fim. / O que falta é uma foto e um áudio." O dono chamou
 * de crua, e ela era: um relatório do que a pessoa acabou de fazer, entregue no
 * lugar da página onde ela está mais perto de agir. Rolar até o rodapé não é
 * notícia para quem rolou.
 *
 * O que substitui faz o trabalho contrário — em vez de descrever o gesto,
 * DEVOLVE o gesto como argumento: ninguém desce uma página inteira por engano,
 * e dizer isso em voz alta é a coisa mais barata que existe para transformar o
 * tempo já investido em razão para continuar. É o mesmo movimento do "Falta uma
 * coisa: você" da comparação, no fim da linha.
 *
 * ─── E O QUE NÃO MUDOU ───────────────────────────────────────────────────────
 *
 * Divertido não é permissão para prometer. Nenhuma linha aqui afirma prazo,
 * preço, resultado ou número: a primeira fala do gesto de quem lê, a segunda é
 * a MESMA troca do "como funciona", importada e não reescrita, e a terceira é a
 * segmentação que já existia — as duas plateias numa frase só, porque quem tem
 * um negócio e quem atende vários chegam ao mesmo formulário.
 *
 * ─── O BOTÃO, e o limite do "divertido" ──────────────────────────────────────
 *
 * Ele foi a "Bora começar" e voltou, por ordem do dono, que leu na tela e disse
 * que não é profissional. Ele tem razão, e a lição é sobre ONDE cada registro
 * cabe: o título pode ter graça porque é uma observação sobre quem lê, e graça
 * ali soa como alguém falando. O botão não é uma frase, é o rótulo de um
 * compromisso — e gíria no rótulo de um compromisso lê como leviandade
 * justamente no instante em que a pessoa está decidindo confiar dinheiro.
 *
 * "Entrar em contato" diz o que acontece ao clicar, e não mais que isso.
 */
interface Fecho {
  titulo: string;
  linha: string;
  publico: string;
  acao: string;
  /** Onde o pedido mora — o mesmo destino do escape do FAQ. */
  destino: string;
}

/*
 * A linha do meio continua DERIVADA de `TROCA_DEPOIS`, agora por idioma: a
 * troca dita no "como funciona" e a dita aqui são a mesma frase, e uma cópia
 * que o compilador mantém segue melhor que duas que um humano promete manter.
 * Em inglês a concordância muda de forma — "all that's missing is" — mas o
 * objeto da frase vem do mesmo lugar.
 */
const fechoEm = (idioma: Idioma): Fecho => {
  const troca = TROCA_DEPOIS[idioma].replace(/\.$/, '');
  if (idioma === 'en') {
    return {
      titulo: 'Nobody scrolls this far by accident.',
      linha: `All that's missing is ${troca.toLowerCase()}.`,
      publico: 'Run a business? Serve several? Same door either way.',
      acao: 'Get in touch',
      destino: HREF_FORMS,
    };
  }
  return {
    titulo: 'Ninguém rola até aqui por acaso.',
    linha: `Falta ${troca.toLowerCase()}.`,
    publico: 'Tem um negócio? Atende vários? A porta é a mesma.',
    acao: 'Entrar em contato',
    destino: HREF_FORMS,
  };
};

export const FECHO: PorIdioma<Fecho> = { pt: fechoEm('pt'), en: fechoEm('en'), es: fechoEm('pt') };

/**
 * Os links rápidos: âncoras que EXISTEM.
 *
 * Um rodapé cheio de links que não levam a lugar nenhum é pior do que um rodapé
 * curto — e este repositório já perdeu tempo com exatamente isso: `#pedido` era
 * apontado por dois botões e não existia em elemento nenhum. Por isso os
 * destinos vêm de `ancoras.ts`, onde a string mora ao lado do elemento que a
 * carrega, em vez de serem escritos à mão aqui.
 */
const ATALHOS_PT: readonly { rotulo: string; destino: string }[] = [
  { rotulo: 'Perguntas', destino: HREF_FAQ },
  { rotulo: 'Falar com a gente', destino: HREF_FORMS },
];

const ATALHOS_EN: readonly { rotulo: string; destino: string }[] = [
  { rotulo: 'FAQ', destino: HREF_FAQ },
  { rotulo: 'Talk to us', destino: HREF_FORMS },
];

export const ATALHOS: PorIdioma<readonly { rotulo: string; destino: string }[]> = {
  pt: ATALHOS_PT,
  en: ATALHOS_EN,
  es: ATALHOS_PT,
};
