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
 * Quantos vídeos tocam ao mesmo tempo. Seis, que é o número de lugares do X.
 *
 * O campo desenha o mosaico QUATRO vezes para que a volta do infinito seja
 * invisível, então há vinte e quatro molduras no documento e não seis. Este é o
 * teto de quantas delas estão TOCANDO — o resto é still, e a troca acontece
 * conforme o campo deriva. `rodape/Peca.tsx` explica a mecânica das vagas.
 */
export const EXPOSTAS = 6;

/** Onde uma peça senta na grade do X: coluna e linha, de 1 em diante. */
export interface Lugar {
  coluna: number;
  linha: number;
}

/**
 * ─── O X ─────────────────────────────────────────────────────────────────────
 *
 * Pedido do dono, e o desenho é uma grade de cinco colunas por três linhas com
 * seis peças nas diagonais:
 *
 *     1 · · · 2
 *     · 3 · 4 ·
 *     5 · · · 6
 *
 * O MIOLO VAZIO é o motivo de o X ser melhor do que a grade cheia que estava
 * aqui: o fecho ("Você leu até o fim") mora exatamente no centro da tela, e
 * antes ele nascia por cima de um vídeo, com um véu de 65% pagando a conta de
 * separar os dois. No X, o texto ocupa o buraco que o desenho já deixa — os
 * vídeos passam a emoldurar o pedido em vez de disputar com ele.
 *
 * As posições são dadas em `gridColumn`/`gridRow` e não com células vazias de
 * enfeite: oito divs vazias por cópia seriam trinta e duas no documento só para
 * empurrar as outras. As colunas têm largura FIXA (e não `auto`) justamente
 * porque disso: sem conteúdo, uma coluna `auto` mede zero e o X desmorona para
 * o canto esquerdo.
 */
const LUGARES: readonly Lugar[] = [
  { coluna: 1, linha: 1 },
  { coluna: 5, linha: 1 },
  { coluna: 2, linha: 2 },
  { coluna: 4, linha: 2 },
  { coluna: 1, linha: 3 },
  { coluna: 5, linha: 3 },
];

/**
 * As peças do X: cada lugar com o reel que o ocupa.
 *
 * A volta pelo resto (`% REELS.length`) é o que garante que dois vizinhos nunca
 * sejam o mesmo arquivo: com três clientes e seis lugares, a sequência anda
 * sempre um passo à frente, e cada braço do X carrega um cliente diferente.
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
