import { HREF_FAQ, HREF_FORMS } from '../ancoras';
import type { Hub, Tipo } from './tipos';

/**
 * As constantes do site que TODA página SEO precisa. Um lugar só, porque
 * domínio e nome da entidade repetidos em vinte arquivos divergem no vigésimo
 * primeiro — e entidade inconsistente é o item 24 do brief.
 */

/** Com `www`, sem barra final. É a forma canônica de toda URL absoluta. */
export const DOMINIO = 'https://www.doxaviral.com';

export const NOME = 'Doxa';

export const IDIOMA = 'pt-BR';

/** O `og:locale`, que usa sublinhado e não hífen. */
export const LOCALE_OG = 'pt_BR';

/**
 * O prefixo de URL de cada tipo.
 *
 * `guia`, `dor` e `hub` compartilham `/guias` de propósito: para quem lê, uma
 * dor ("por que meus vídeos não têm views") e um hub são conteúdo editorial do
 * mesmo lugar. O tipo separa o LAYOUT, não a pasta da URL.
 */
export const PREFIXO: Record<Tipo, string> = {
  solucao: '/solucoes',
  plataforma: '/plataformas',
  guia: '/guias',
  comparativo: '/comparativos',
  dor: '/guias',
  glossario: '/glossario',
  hub: '/guias',
};

/**
 * A pasta de `src/seo/conteudo/` de cada tipo.
 *
 * Não é igual a `PREFIXO`: três tipos publicam em `/guias` e cada um mora na
 * própria pasta, senão o autor de uma dor teria de saber que ela é um "guia".
 * O `indice.ts` valida os dois lados — arquivo na pasta errada é erro de build.
 */
export const DIRETORIO: Record<Tipo, string> = {
  solucao: 'solucoes',
  plataforma: 'plataformas',
  guia: 'guias',
  comparativo: 'comparativos',
  dor: 'dores',
  glossario: 'glossario',
  hub: 'hubs',
};

export interface DadosHub {
  titulo: string;
  descricao: string;
}

/** O nome curto de cada hub, para breadcrumb e listas de cluster. */
export const HUBS: Record<Hub, DadosHub> = {
  '/guias/marketing-no-tiktok': {
    titulo: 'Marketing no TikTok',
    descricao: 'Como empresas produzem, publicam e crescem no TikTok.',
  },
  '/guias/reels-no-instagram': {
    titulo: 'Reels no Instagram',
    descricao: 'Produção e distribuição de vídeo vertical no Instagram.',
  },
  '/guias/ia-no-marketing': {
    titulo: 'IA no marketing',
    descricao: 'O que a inteligência artificial muda na produção de conteúdo.',
  },
  '/guias/marketing-organico': {
    titulo: 'Marketing orgânico',
    descricao: 'Crescer por distribuição, sem depender de mídia paga.',
  },
  '/guias/videos-curtos': {
    titulo: 'Vídeos curtos',
    descricao: 'Formato vertical, retenção e o que faz um vídeo ser assistido.',
  },
};

export interface DadosSecao {
  titulo: string;
  descricao: string;
  h1: string;
  resumo: string;
}

/**
 * Os cinco índices de seção.
 *
 * Texto INSTITUCIONAL de propósito: um índice descreve o que está listado
 * abaixo dele e mais nada. Claim de produto aqui seria a mesma promessa dita
 * num sexto lugar, sem ninguém para mantê-la em dia.
 */
export const SECOES: Record<string, DadosSecao> = {
  '/solucoes': {
    titulo: 'Soluções da Doxa: produção de conteúdo em vídeo com IA',
    descricao:
      'As frentes de trabalho da Doxa em produção de vídeo com inteligência artificial: o que cada uma resolve, para quem serve e como funciona na prática.',
    h1: 'Soluções',
    resumo:
      'Cada página desta seção descreve uma frente de trabalho da Doxa: o que ela resolve, para quem serve e o que o cliente recebe.',
  },
  '/plataformas': {
    titulo: 'Conteúdo por plataforma: TikTok, Instagram e YouTube Shorts',
    descricao:
      'O que muda na produção e na distribuição de vídeo vertical em cada plataforma, e como uma operação de conteúdo se organiza para atender todas elas.',
    h1: 'Plataformas',
    resumo:
      'TikTok, Instagram e YouTube Shorts pedem o mesmo formato e premiam coisas diferentes. Esta seção trata de uma plataforma por página.',
  },
  '/guias': {
    titulo: 'Guias de conteúdo orgânico, vídeo curto e IA no marketing',
    descricao:
      'Material de referência sobre produção de conteúdo, alcance orgânico, vídeo vertical e uso de inteligência artificial no marketing, sem depender de contratar nada.',
    h1: 'Guias',
    resumo:
      'Material de referência sobre produção de conteúdo, alcance orgânico e vídeo curto. Escrito para ser útil a quem lê, contrate a Doxa ou não.',
  },
  '/comparativos': {
    titulo: 'Comparativos: orgânico e pago, IA e produção tradicional',
    descricao:
      'Comparações entre caminhos de produção e distribuição de conteúdo, com o que cada lado resolve, o que custa e em que situação ele é a escolha certa.',
    h1: 'Comparativos',
    resumo:
      'Duas alternativas por página, com o que cada uma resolve e onde ela é a escolha errada. Comparativo que só tem um vencedor não é comparativo.',
  },
  '/glossario': {
    titulo: 'Glossário de marketing de conteúdo e vídeo curto',
    descricao:
      'Os termos que aparecem em toda conversa sobre conteúdo orgânico e vídeo vertical, explicados em uma página por verbete, com os conceitos vizinhos.',
    h1: 'Glossário',
    resumo:
      'Um verbete por página: o que o termo significa, por que ele importa e onde ele aparece na prática.',
  },
};

/**
 * A imagem de prévia social — `public/og.png`, gerada por `scripts/og-imagem.mjs`.
 *
 * PNG de 1200×630, e não AVIF nem WebP: boa parte dos leitores de link (o do
 * WhatsApp inclusive) não decodifica os dois formatos modernos e mostraria o
 * cartão sem imagem, que é o problema que esta constante existe para resolver.
 *
 * Guardado como CAMINHO e não como URL absoluta de propósito. O domínio mora em
 * `DOMINIO`, uma vez só; escrito de novo aqui, ele viraria a segunda cópia que
 * diverge no dia da troca. Quem emite a tag (`head.ts`, `index.html`) absolutiza
 * com `urlAbsoluta` — e `og:image` relativa não é lida por leitor de link
 * nenhum, então a forma final É absoluta.
 *
 * O tipo continua `string | null`: `head.ts` só emite `og:image` quando há
 * arquivo, e uma tag apontando para o vazio é pior do que a ausência dela.
 */
export const OG_IMAGEM: string | null = '/og.png';

/** As medidas reais do arquivo. O leitor de link reserva a caixa antes de baixar. */
export const OG_IMAGEM_LARGURA = 1200;
export const OG_IMAGEM_ALTURA = 630;

/**
 * O `alt` da prévia. Descreve o que ESTÁ na imagem — a wordmark e a promessa —,
 * e não uma frase de marketing nova: a imagem é feita do que a landing já diz.
 */
export const OG_IMAGEM_ALT = 'Doxa — um milhão de views. Ou seu dinheiro de volta.';

/**
 * O destino de todo CTA: o formulário da landing. Não há outro funil.
 *
 * O fragmento vem de `src/ancoras.ts`, que é o dono dos ids da landing. Escrito
 * à mão aqui, `#forms` seria a terceira cópia de um contrato entre arquivos que
 * não se conhecem — e quando ele quebra, quebra em silêncio: o clique rola zero
 * pixel e nada aparece no console.
 */
export const HREF_CTA = `/${HREF_FORMS}`;

/** As perguntas da landing, pelo mesmo motivo de `HREF_CTA`. */
export const HREF_PERGUNTAS = `/${HREF_FAQ}`;

/**
 * As URLs da LANDING que uma página SEO pode citar.
 *
 * Elas existem — são a home e duas âncoras dela —, mas não passam por
 * `urlsPublicadas()`, que só conhece o que o prerender escreve. Sem esta lista,
 * `resolverLink('/#forms')` devolvia `desconhecida` e `Blocos.tsx` lançava no
 * render: o CTA do motor derrubava o build do motor.
 */
export const ROTAS_DA_LANDING: readonly string[] = ['/', HREF_CTA, HREF_PERGUNTAS];

/** O fecho padrão, quando a página não escreve o próprio. */
export const CTA_PADRAO = {
  texto: 'Conte o que a sua empresa precisa publicar. O time da Doxa responde em até 24 horas.',
  rotulo: 'Falar com a Doxa',
};

/** A wordmark, copiada para `public/brand/` para ser servida sem hash. */
export const WORDMARK = {
  src: '/brand/doxa-wordmark-white-96.avif',
  largura: 364,
  altura: 96,
};
