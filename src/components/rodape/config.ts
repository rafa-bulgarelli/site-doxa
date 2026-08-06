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
 * PENDENTE-DONO: as catorze peças são os três reels reais repetidos, exatamente
 * como a parede de prova faz em `proof/reels.ts` e pela mesma razão — a
 * repetição é quantos retângulos se desenha, e nunca uma afirmação de quantos
 * casos existem. Quando os arquivos que faltam entrarem em `REELS`, a
 * repetição para sozinha e não há nada para desfazer aqui.
 */

/**
 * Quantas peças o mosaico tem, e o corte entre as duas metades.
 *
 * `EXPOSTAS` é o teto de vídeos TOCANDO ao mesmo tempo — número do dono, e é
 * também o que a tela comporta sem virar um mural de coisas se mexendo. As
 * `ESCONDIDAS` existem no campo desde o primeiro quadro: elas são o que a
 * pessoa encontra ao arrastar, e é ter mais do que cabe na tela que faz o campo
 * parecer não ter fim. Uma peça escondida é um still — vira vídeo quando entra
 * em cena e uma vaga se abre.
 */
export const EXPOSTAS = 6;
const ESCONDIDAS = 8;

/**
 * As peças, na ordem em que a grade as recebe.
 *
 * A volta pelo resto (`% REELS.length`) é o que garante que dois vizinhos nunca
 * sejam o mesmo arquivo: com três clientes e catorze lugares, a sequência anda
 * sempre um passo à frente, e o que a tela mostra de cada vez é sempre a
 * alternância dos três — nunca o mesmo cliente duas vezes lado a lado.
 */
export const PECAS: readonly Reel[] = Array.from(
  { length: EXPOSTAS + ESCONDIDAS },
  (_, indice) => REELS[indice % REELS.length],
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
