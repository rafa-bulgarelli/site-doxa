import {
  CONVITE,
  FALTA,
  FILTRO,
  GARANTIA,
  RETORNO,
  TROCA_DEPOIS,
} from '../comparacao/config';
import { REELS } from '../proof/reels';

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

/* Desestruturado com padrão em vez de indexado: o `tsconfig` deste repo trata
   `ARRAY[0]` como possivelmente indefinido, e um `!` para calar o compilador é
   exatamente o tipo de coisa que o contrato de estilo proíbe. */
const [VIEWS_PROMETIDAS = '', DINHEIRO_DE_VOLTA = ''] = GARANTIA;
const [CORTA_A_CONTA = '', E_VIRALIZA = ''] = CONVITE;
const [FALTA_UMA_COISA = '', VOCE = ''] = FALTA;

/**
 * Um ladrilho do mosaico, e por que eles são de TEXTO.
 *
 * O infinito precisa de material que não se repita antes de a pessoa cansar de
 * arrastar. Este repositório tem TRÊS clientes e seis imagens ao todo — um
 * mosaico feito delas denuncia o loop no primeiro puxão, e o que se lê não é
 * "que legal", é "é sempre a mesma coisa". Texto não tem esse teto: cabem
 * quantas combinações a página tiver de voz, sem um único byte baixado.
 *
 * `marca` é a assinatura, `numero` é um resultado publicado com o perfil que o
 * fez, `frase` é uma linha que a página já diz em outro lugar e `arroba` é só o
 * perfil — checável por fora, que é a razão de ele existir na parede de prova.
 */
export type Ladrilho =
  | { tipo: 'marca' }
  | { tipo: 'numero'; valor: string; rotulo: string }
  | { tipo: 'frase'; texto: string }
  | { tipo: 'arroba'; texto: string };

/* Os números vêm dos reels, e SÓ dos que têm número. `flatMap` com lista vazia
   em vez de `filter` mais `!`: quem não teve as visualizações entregues pelo
   dono simplesmente não vira ladrilho, em vez de virar um ladrilho vazio. */
const NUMEROS: readonly Ladrilho[] = REELS.flatMap((reel) =>
  reel.views == null ? [] : [{ tipo: 'numero' as const, valor: reel.views, rotulo: reel.handle }],
);

const [PRIMEIRO_NUMERO, SEGUNDO_NUMERO] = NUMEROS;

/**
 * O mosaico, INTERCALADO à mão e não concatenado por tipo.
 *
 * Concatenando, os quatro `DOXA` sairiam juntos e o mosaico teria um canto de
 * marca, um canto de números e um canto de frases — que é um pôster, não um
 * campo. Alternados, qualquer tela que a pessoa arraste até tem um pouco de
 * cada coisa, e é isso que faz o infinito parecer ter sido composto em vez de
 * sorteado.
 */
export const LADRILHOS: readonly Ladrilho[] = [
  { tipo: 'marca' },
  { tipo: 'frase', texto: VIEWS_PROMETIDAS },
  { tipo: 'arroba', texto: '@corealquimias' },
  { tipo: 'frase', texto: DINHEIRO_DE_VOLTA },
  ...(PRIMEIRO_NUMERO == null ? [] : [PRIMEIRO_NUMERO]),
  { tipo: 'frase', texto: TROCA_DEPOIS },

  { tipo: 'frase', texto: CORTA_A_CONTA },
  { tipo: 'marca' },
  { tipo: 'frase', texto: E_VIRALIZA },
  { tipo: 'arroba', texto: '@uninovamotos' },
  { tipo: 'frase', texto: `${FILTRO.valor} ${FILTRO.titulo}` },
  ...(SEGUNDO_NUMERO == null ? [] : [SEGUNDO_NUMERO]),

  { tipo: 'frase', texto: FALTA_UMA_COISA },
  { tipo: 'marca' },
  { tipo: 'frase', texto: VOCE },
  { tipo: 'frase', texto: RETORNO },
  { tipo: 'arroba', texto: 'Magalu' },
  { tipo: 'marca' },
];

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
