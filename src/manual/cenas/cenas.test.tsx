/**
 * ─── AS CENAS DESENHAM? ──────────────────────────────────────────────────────
 *
 * `renderToStaticMarkup`, o mesmo caminho de `publico/telas.test.tsx`: sem DOM,
 * sem jsdom, sem dependência nova. Não é teste de desenho — ninguém afirma um
 * traço de SVG em asserção. É a prova das coisas que, quebradas, custam caro e
 * não aparecem em lugar nenhum:
 *
 * 1. **A cena renderiza.** Ela abre um capítulo (ou uma etapa de item), então
 *    um índice fora do array durante o loop derruba a página inteira do
 *    cliente, não só a ilustração.
 * 2. **A cena é `aria-hidden`.** É o contrato de `contrato.tsx`: o desenho é
 *    decorativo, e quem fala com leitor de tela é o texto do capítulo.
 * 3. **A cena serve quem pediu MENOS movimento.** Esse caminho só existe em
 *    runtime — sem este teste, ninguém o executa antes do cliente.
 * 4. **Toda tinta que a cena PEDE, a cena DEFINE.** Desde que a cor entrou, um
 *    `url(#arco)` apontando para um gradiente que não existe pinta a forma de
 *    preto no preto: some sem erro, sem console, sem nada. O teste casa cada
 *    referência com o `id` correspondente no mesmo desenho.
 *
 * Por que trocar `useReducedMotion`: em Node não há `matchMedia`, e framer
 * responde `false` para sempre. O `importActual` mantém o `motion` de verdade —
 * substituída é só a resposta da preferência.
 */
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentType } from 'react';

const preferencia = vi.hoisted(() => ({ reduzido: false }));

vi.mock('framer-motion', async () => {
  const real = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...real, useReducedMotion: () => preferencia.reduzido };
});

import CenaOnboarding from './CenaOnboarding';
import CenaVoz from './CenaVoz';
import CenaClone from './CenaClone';
import CenaGarantia from './CenaGarantia';
import Meta from './itens/Meta';
import Sessenta from './itens/Sessenta';
import Relogio from './itens/Relogio';
import Semana from './itens/Semana';
import Intacto from './itens/Intacto';
import SemImpulso from './itens/SemImpulso';
import SemCompra from './itens/SemCompra';
import PergunteAntes from './itens/PergunteAntes';
import ExemplosDeFotos, { Quadro } from './ExemplosDeFotos';
import Redes from './passos/Redes';
import Contexto from './passos/Contexto';
import UmCanal from './passos/UmCanal';
import Silencio from './passos/Silencio';
import FalaNatural from './passos/FalaNatural';
import Gravador from './passos/Gravador';
import MesmoEquipamento from './passos/MesmoEquipamento';
import FotoNitida from './passos/FotoNitida';
import SemFiltro from './passos/SemFiltro';
import Aproximacao from './passos/Aproximacao';
import { cenaDaSecao, cenaDoItem, cenaDoPasso } from './contrato';
import { ARCO } from './luz';
import { ARCO_DO_FECHO } from './fecho';

interface CenaDoTeste {
  /** O slug da seção, ou o código da regra no caso das mini-cenas. */
  readonly chave: string;
  readonly Cena: ComponentType;
}

const CAPITULOS: readonly CenaDoTeste[] = [
  { chave: 'onboarding', Cena: CenaOnboarding },
  { chave: 'voz', Cena: CenaVoz },
  { chave: 'clone', Cena: CenaClone },
  { chave: 'garantia', Cena: CenaGarantia },
];

const ITENS: readonly CenaDoTeste[] = [
  { chave: 'GA-1', Cena: Meta },
  { chave: 'GA-2', Cena: Sessenta },
  { chave: 'GA-3', Cena: Relogio },
  { chave: 'GA-4', Cena: Semana },
  { chave: 'GA-5', Cena: Intacto },
  { chave: 'GA-6', Cena: SemImpulso },
  { chave: 'GA-7', Cena: SemCompra },
  { chave: 'GA-8', Cena: PergunteAntes },
];

/**
 * As mini-cenas dos PASSOS dos capítulos 1–3.
 *
 * A chave é o `codigo` da regra no seed (v2/v3/v7/v8), que é o mesmo vocabulário
 * do contrato: se uma cena for parar no código errado, o passo abre com a
 * animação de outro passo — e isso não aparece em erro nenhum, só em quem lê.
 */
const PASSOS: readonly CenaDoTeste[] = [
  { chave: 'ON-0', Cena: Redes },
  { chave: 'ON-1', Cena: Contexto },
  { chave: 'ON-2', Cena: UmCanal },
  { chave: 'VZ-1', Cena: Silencio },
  { chave: 'VZ-2', Cena: FalaNatural },
  { chave: 'VZ-3', Cena: Gravador },
  { chave: 'VZ-4', Cena: MesmoEquipamento },
  { chave: 'CL-1', Cena: FotoNitida },
  { chave: 'CL-2', Cena: SemFiltro },
  { chave: 'CL-3', Cena: Aproximacao },
];

const TODAS = [...CAPITULOS, ...ITENS, ...PASSOS];

function desenhar(Cena: ComponentType): string {
  return renderToStaticMarkup(<Cena />);
}

/** A fase em cartaz, lida do `data-fase` que o palco escreve na moldura. */
function faseDe(html: string): number {
  const achado = /data-fase="(\d+)"/.exec(html);
  if (achado == null) throw new Error('a cena não escreveu data-fase na moldura');
  return Number(achado[1]);
}

/** Toda tinta pedida por `url(#...)` neste desenho. */
function tintasPedidas(html: string): readonly string[] {
  return [...html.matchAll(/url\(#([^)]+)\)/g)].map((achado) => achado[1]);
}

describe('as cenas do manual', () => {
  for (const { chave, Cena } of TODAS) {
    it(`a cena de ${chave} desenha um SVG e nasce escondida do leitor`, () => {
      const html = desenhar(Cena);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('<svg');
      expect(html).toContain('viewBox=');
    });

    it(`a cena de ${chave} define toda tinta que pede, e tem cor no quadro que ensina`, () => {
      // O quadro conferido é o PARADO — o do fim da história. É lá que a cor
      // tem de estar: a fase 0 de algumas cenas é cinza de propósito (a semana
      // por fazer, as fotos antes do veredito), e cobrar cor dela seria cobrar
      // que a cena não tenha começo.
      preferencia.reduzido = true;
      try {
        const html = desenhar(Cena);
        const pedidas = tintasPedidas(html);
        expect(pedidas.length).toBeGreaterThan(0);
        for (const tinta of pedidas) {
          expect(html).toContain(`id="${tinta}"`);
        }
      } finally {
        preferencia.reduzido = false;
      }
    });
  }

  it('duas cenas na mesma página não dividem o mesmo id de gradiente', () => {
    // O caso real: o fluxo mostra a etapa de um item logo abaixo da cena do
    // capítulo. Com id fixo, a segunda pintaria com a paleta da primeira — e
    // sumiria de vez quando a primeira desmontasse.
    const html = renderToStaticMarkup(
      <>
        <CenaVoz />
        <Meta />
      </>,
    );
    const ids = [...html.matchAll(/id="(cena[^"-]+)-arco"/g)].map((achado) => achado[1]);
    expect(ids.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('o contrato entrega as quatro cenas de capítulo, e nada além', () => {
    for (const { chave, Cena } of CAPITULOS) {
      expect(cenaDaSecao(chave)).toBe(Cena);
    }
    // `termos` é documento, não capítulo: não tem — nem deve ter — ilustração.
    expect(cenaDaSecao('termos')).toBeNull();
    expect(cenaDaSecao('secao-de-uma-versao-antiga')).toBeNull();
  });

  it('o contrato entrega uma mini-cena para cada um dos oito itens', () => {
    for (const { chave, Cena } of ITENS) {
      expect(cenaDoItem(chave)).toBe(Cena);
    }
    expect(cenaDoItem('GA-99')).toBeNull();
  });

  it('o contrato entrega uma mini-cena para cada um dos dez passos', () => {
    for (const { chave, Cena } of PASSOS) {
      expect(cenaDoPasso(chave)).toBe(Cena);
    }
    // Regra sem cena não pode explodir a página: o fluxo pergunta por código e
    // renderiza o que vier. Código de uma versão antiga do manual devolve nulo,
    // e o passo simplesmente abre sem ilustração.
    expect(cenaDoPasso('ON-9')).toBeNull();
    expect(cenaDoPasso('GA-1')).toBeNull();
  });

  it('nenhum passo ficou com o esqueleto do prelude', () => {
    // Os nove primeiros nasceram como um `<svg>` vazio, para a track do fluxo
    // provar que o slot estava ligado antes de a cena existir. Um esqueleto esquecido é
    // uma moldura vazia no ar: sem erro, sem console, sem desenho. Cena de
    // verdade desenha dezenas de formas e escreve a fase na moldura.
    for (const { chave, Cena } of PASSOS) {
      const html = desenhar(Cena);
      expect(html, chave).toContain('data-fase');
      expect([...html.matchAll(/<(rect|path|circle|ellipse)/g)].length).toBeGreaterThan(6);
    }
  });
});

describe('as cenas com movimento reduzido', () => {
  for (const { chave, Cena } of TODAS) {
    it(`a cena de ${chave} vira desenho parado, e não tela vazia`, () => {
      const primeiroQuadro = desenhar(Cena);
      expect(faseDe(primeiroQuadro)).toBe(0);
      preferencia.reduzido = true;
      try {
        const html = desenhar(Cena);
        expect(html).toContain('aria-hidden="true"');
        // O quadro parado é o do FIM da história, o que ensina — parar na fase
        // 0 entregaria uma moldura vazia, pior do que não ter cena nenhuma.
        expect(faseDe(html)).toBeGreaterThan(0);
      } finally {
        preferencia.reduzido = false;
      }
    });
  }
});

/**
 * ─── O FECHO DO ARCO ─────────────────────────────────────────────────────────
 *
 * O pedido do dono: "quando as animações atingem o último estágio — deu tudo
 * certo — TODAS tenham o degradê". "Todas" tem exceção nomeada por ele mesmo: as
 * duas cenas que já tinham passado com nota dez ficam como estão.
 *
 * Desenho não tem asserção óbvia, mas o fecho tem assinatura: o `d` do arco. É
 * ele que se cobra aqui, em três frentes — presente no quadro que ensina, UM por
 * cena (três passadas do mesmo caminho, e não seis), e ausente na primeira fase,
 * que é o que impede alguém de "simplificar" o degradê para sempre visível e
 * matar os três tempos.
 */
describe('o fecho do arco no quadro que ensina', () => {
  /** Quantas vezes o caminho do fecho aparece no desenho. */
  function passadasDoFecho(html: string): number {
    return [...html.matchAll(new RegExp(`d="${ARCO_DO_FECHO}"`, 'g'))].length;
  }

  /** O desenho da cena no quadro PARADO — o do fim da história. */
  function quadroFinal(Cena: ComponentType): string {
    preferencia.reduzido = true;
    try {
      return desenhar(Cena);
    } finally {
      preferencia.reduzido = false;
    }
  }

  /**
   * As duas que o dono mandou não tocar.
   *
   * Elas já fecham com o arco do jeito delas — a onda inteira pintada no arco na
   * cena da voz, o mostrador do relógio no seu. Aplicar o fecho padrão por cima
   * seria acrescentar um segundo degradê ao único quadro que já estava aprovado.
   */
  const NOTA_DEZ = new Set(['voz', 'GA-3']);
  const COM_FECHO = TODAS.filter(({ chave }) => !NOTA_DEZ.has(chave));

  it('cobre todas as cenas menos as duas de nota dez', () => {
    // A conta é a trava: cena nova entra na lista de TODAS e cai aqui sem
    // fecho, e este número é o que denuncia o esquecimento.
    expect(COM_FECHO.length).toBe(TODAS.length - 2);
    expect(COM_FECHO.length).toBe(20);
  });

  for (const { chave, Cena } of COM_FECHO) {
    it(`a cena de ${chave} fecha com o degradê, e com UM só`, () => {
      // Três passadas: o halo, o meio e o traço cheio de `TracoDeLuz`. Seis
      // seriam dois fechos no mesmo palco — a "festa" que a doutrina proíbe.
      expect(passadasDoFecho(quadroFinal(Cena)), chave).toBe(3);
    });

    it(`a cena de ${chave} não mostra o degradê na primeira fase`, () => {
      // Os três tempos, nas palavras do dono: "aparece · destaca · dá certo".
      // Degradê desde o primeiro quadro entrega o terceiro tempo antes do
      // primeiro, e a cena deixa de contar história nenhuma.
      expect(passadasDoFecho(desenhar(Cena)), chave).toBe(0);
    });
  }

  for (const chave of NOTA_DEZ) {
    const nota10 = TODAS.find((cena) => cena.chave === chave);
    if (nota10 == null) throw new Error(`a cena de nota dez sumiu da lista: ${chave}`);
    it(`a cena de ${chave} continua SEM o fecho — ela é nota dez`, () => {
      expect(passadasDoFecho(quadroFinal(nota10.Cena))).toBe(0);
      expect(passadasDoFecho(desenhar(nota10.Cena))).toBe(0);
    });
  }

  it('o fecho pinta com o arco do PRÓPRIO palco, e não com o de outra cena', () => {
    // A armadilha de `luz.tsx`: `id` de gradiente é global no documento. Duas
    // cenas na mesma página com o mesmo `id` fazem a segunda pintar de preto no
    // preto — some sem erro nenhum. Cada fecho tem de citar o id do seu palco.
    preferencia.reduzido = true;
    try {
      const html = renderToStaticMarkup(
        <>
          <Contexto />
          <UmCanal />
        </>,
      );
      const pintados = [...html.matchAll(/stroke="url\(#(cena[^)"]+)-arco\)"/g)].map(
        (achado) => achado[1],
      );
      expect(new Set(pintados).size).toBe(2);
      for (const id of pintados) {
        expect(html).toContain(`id="${id}-arco"`);
      }
    } finally {
      preferencia.reduzido = false;
    }
  });
});

/**
 * ─── A CENA DA GA-2, QUE JÁ CONTOU O FATO ERRADO ─────────────────────────────
 *
 * Ela desenhava 20+20+20=60 — "vinte em cada rede" —, e o combinado é o
 * contrário: **60 vídeos ÚNICOS, cada um publicado nas três redes**. O erro não
 * apareceu em teste nenhum porque desenho não tem asserção óbvia; o que dá para
 * cobrar, e é o que se cobra aqui, são as duas assinaturas da versão errada:
 * um número ao lado de cada rede (a divisão escrita) e o 20 em si.
 */
describe('a cena dos sessenta (GA-2)', () => {
  /** Todo texto que a cena escreve — em cena, texto é sempre número. */
  function numerosEscritos(html: string): readonly string[] {
    return [...html.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((achado) => achado[1]);
  }

  /** Quantas vezes o glifo do vídeo é desenhado com a cor da origem. */
  function videosDesenhados(html: string): number {
    return [...html.matchAll(new RegExp(`fill="${ARCO[0]}"`, 'g'))].length;
  }

  it('escreve UM número no quadro que ensina, e ele é o 60', () => {
    preferencia.reduzido = true;
    try {
      const html = desenhar(Sessenta);
      // Um número por rede seria a divisão de volta, com outra roupa. A cena
      // tem direito a um número só: o total de vídeos únicos.
      expect(numerosEscritos(html)).toEqual(['60']);
    } finally {
      preferencia.reduzido = false;
    }
  });

  it('não escreve 20 em fase nenhuma, nem na primeira', () => {
    expect(desenhar(Sessenta)).not.toContain('>20<');
    preferencia.reduzido = true;
    try {
      expect(desenhar(Sessenta)).not.toContain('>20<');
    } finally {
      preferencia.reduzido = false;
    }
  });

  it('entrega às três redes o MESMO vídeo, e não um pedaço para cada', () => {
    // O antídoto contra a leitura de divisão é o cartão REPETIDO: o vídeo da
    // esquerda mais uma cópia igual em cada rede. Quatro é o mínimo — a pilha
    // que fecha a cena desenha o mesmo glifo mais algumas vezes.
    preferencia.reduzido = true;
    try {
      expect(videosDesenhados(desenhar(Sessenta))).toBeGreaterThanOrEqual(4);
    } finally {
      preferencia.reduzido = false;
    }
  });
});

/**
 * ─── OS DOIS DEFEITOS QUE O DONO NOMEOU NAS CENAS-PILOTO ─────────────────────
 *
 * Nenhum dos dois aparece em teste de comportamento: são de DESENHO, e desenho
 * não tem asserção óbvia. O que dá para cobrar — e é o que se cobra aqui — é a
 * assinatura de cada versão reprovada, para que ela não volte por descuido numa
 * refatoração daqui a seis meses.
 */
describe('as cenas-piloto dos passos, depois da revisão do dono', () => {
  /** Os raios de todo `<circle>` do desenho. */
  function raios(html: string): readonly number[] {
    return [...html.matchAll(/<circle[^>]*\sr="([\d.]+)"/g)].map((achado) => Number(achado[1]));
  }

  it('a cena das redes não desenha círculo nenhum — os ícones são os reais', () => {
    // A versão reprovada punha cada rede numa forma genérica dentro de um
    // círculo cinza, e o dono nomeou o defeito duas vezes: "afogado",
    // "enforcado". Os ícones de `redes.tsx` são só `path`, e o resto desta cena
    // é retângulo e traço — então um `<circle>` aqui já é a jaula de volta.
    preferencia.reduzido = true;
    try {
      expect(desenhar(Redes)).not.toContain('<circle');
    } finally {
      preferencia.reduzido = false;
    }
  });

  it('o texto do link tem alturas de letra diferentes, e não vira código de barras', () => {
    // O diagnóstico do dono na primeira versão: "parece código de barras". A
    // cura foi dar linha de base ao texto — letra que sobe, letra que desce —,
    // e é isso que se cobra: blocos todos da mesma altura são o código de
    // barras de volta.
    // No quadro PARADO, que é o do fim: na fase 0 os campos estão vazios de
    // propósito, e não há letra nenhuma para medir.
    preferencia.reduzido = true;
    try {
      const html = desenhar(Redes);
      const alturas = [...html.matchAll(/<rect[^>]*rx="1\.5"[^>]*/g)].map((achado) => {
        const altura = /height="([\d.]+)"/.exec(achado[0]);
        if (altura == null) throw new Error(`letra sem altura: ${achado[0]}`);
        return altura[1];
      });
      expect(alturas.length).toBeGreaterThan(20);
      expect(new Set(alturas).size).toBeGreaterThanOrEqual(3);
    } finally {
      preferencia.reduzido = false;
    }
  });

  it('o microfone do silêncio não volta para dentro de um círculo', () => {
    // Era um anel de raio 30 em volta do glifo, e o dono disse a palavra:
    // ENFORCANDO. Respiro é ausência de jaula, não jaula maior. Os únicos
    // círculos que sobraram na cena são as duas cabeças da nota de música do
    // ruído, de raio 4,5 — qualquer coisa grande aqui é o anel de volta.
    for (const raio of raios(desenhar(Silencio))) {
      expect(raio).toBeLessThan(10);
    }
  });
});

/**
 * O quadro tem duas metades, e o teste segue a divisão:
 *
 * - `Quadro` é o miolo puro, os doze cartões — é dele que se cobra a foto, o
 *   rótulo e o `alt`.
 * - `ExemplosDeFotos` é o de fora: o quadro inteiro MAIS o guia em PDF. Não há
 *   estado nenhum a cobrar (houve um reveal por clique, e ele caiu), então o
 *   que se cobra dele é o primeiro desenho — que já é o desenho final.
 */
describe('o quadro de exemplos de foto', () => {
  const html = renderToStaticMarkup(<Quadro />);

  interface FotoDoQuadro {
    readonly src: string;
    readonly alt: string;
  }

  /** Cada `<img>` do quadro, com o par src/alt que chega a quem não vê. */
  function fotos(): readonly FotoDoQuadro[] {
    return [...html.matchAll(/<img[^>]*>/g)].map((achado) => {
      const tag = achado[0];
      const src = /src="([^"]*)"/.exec(tag);
      const alt = /alt="([^"]*)"/.exec(tag);
      if (src == null || alt == null) throw new Error(`<img> sem src ou sem alt: ${tag}`);
      return { src: src[1], alt: alt[1] };
    });
  }

  const SERVE = [
    'serve-de-frente',
    'serve-cenario-real',
    'serve-boa-luz',
    'serve-natural',
    'serve-boca-em-fala',
    'serve-sentado',
  ];
  const NAO_SERVE = [
    'nao-serve-maos-no-rosto',
    'nao-serve-bracos-cruzados',
    'nao-serve-de-pe',
    'nao-serve-longe',
    'nao-serve-reflexo',
    'nao-serve-de-pe-sorrindo',
  ];

  it('mostra os dois grupos, com o veredito escrito em palavra', () => {
    expect(html).toContain('Assim serve');
    expect(html).toContain('Assim não serve');
  });

  it('dá um rótulo curto a cada um dos doze cartões', () => {
    for (const virtude of [
      'De frente',
      'Cenário real',
      'Boa luz',
      'Natural',
      'Boca em fala',
      'Sentado',
    ]) {
      expect(html).toContain(virtude);
    }
    for (const motivo of [
      'Mãos no rosto',
      'Braços cruzados',
      'De pé',
      'Longe',
      'Reflexo',
      'De pé, sorrindo',
    ]) {
      expect(html).toContain(motivo);
    }
  });

  it('mostra as doze fotos de verdade, seis de cada lado', () => {
    // O caminho do asset é escrito à mão no componente: um erro de digitação
    // some em silêncio no navegador (imagem quebrada, nada no console), e é
    // aqui que ele tem de aparecer.
    const encontrados = fotos().map((foto) => foto.src);
    const esperados = [...SERVE, ...NAO_SERVE].map((nome) => `/manual/fotos/${nome}.avif`);
    expect(encontrados).toEqual(esperados);
  });

  it('descreve cada foto para quem não a vê, e diz o veredito no fim', () => {
    // A troca dos retratos desenhados por fotos mudou a natureza da prova de
    // acessibilidade: antes bastava esconder o desenho, agora cada foto TEM de
    // falar. Um alt vazio aqui seria uma coluna inteira muda.
    const encontradas = fotos();
    expect(encontradas.length).toBe(12);
    for (const { src, alt } of encontradas) {
      expect(alt.length).toBeGreaterThan(20);
      const veredito = src.includes('/nao-serve-') ? '— não serve' : '— serve';
      expect(alt.endsWith(veredito)).toBe(true);
    }
  });

  it('esconde os SELOS do leitor de tela, e só eles', () => {
    // Este quadro não é uma cena: os rótulos e os `alt` são a informação, e um
    // `aria-hidden` no bloco inteiro entregaria uma tela muda a quem mais
    // precisa da lista. Cada `aria-hidden` do markup tem de estar num `<svg>`.
    const escondidos = [...html.matchAll(/<(\w+)[^>]*aria-hidden/g)].map((achado) => achado[1]);
    expect(escondidos.length).toBeGreaterThan(0);
    expect(new Set(escondidos)).toEqual(new Set(['svg']));
  });

  it('escreve o rótulo em corpo legível — nada de letra de 12px', () => {
    expect(html).toContain('text-[16px]');
  });
});

describe('o quadro que nasce aberto', () => {
  /** Os `<li>` que nascem invisíveis, esperando a vez de entrar. */
  function cartoesEntrando(html: string): number {
    return [...html.matchAll(/<li[^>]*style="opacity:0/g)].length;
  }

  it('mostra as doze fotos no primeiro desenho, sem botão-convite', () => {
    // O pedido do dono, em uma frase: "deixe essa seção sempre aberta". Houve
    // uma versão com um botão "ver os exemplos" na frente do quadro, e ela
    // cobrava um toque para mostrar justamente o conteúdo da etapa. Este teste
    // é o que segura a volta dela: o primeiro desenho da página já é o quadro.
    const inicial = renderToStaticMarkup(<ExemplosDeFotos />);
    expect([...inicial.matchAll(/<img/g)].length).toBe(12);
    expect(inicial).toContain('/manual/fotos/');
    expect(inicial).toContain('Assim serve');
    expect(inicial).toContain('Assim não serve');
    // Nenhum `<button>` no primeiro desenho: o convite era um, e cobrar a
    // ausência do ELEMENTO pega qualquer redação nova do mesmo botão.
    expect(inicial).not.toContain('<button');
  });

  it('faz os doze cartões entrarem um a um, os que servem primeiro', () => {
    // A entrada escalonada sobreviveu à queda do convite: a etapa monta quando
    // o cliente chega nela, e é aí que os cartões entram. A prova possível sem
    // DOM: todos os doze nascem em `opacity:0` (logo, ENTRAM) e a ordem do
    // markup é serve → não serve, que é a ordem do atraso.
    const html = renderToStaticMarkup(<Quadro />);
    expect(cartoesEntrando(html)).toBe(12);
    expect(html.indexOf('serve-de-frente')).toBeLessThan(html.indexOf('nao-serve-'));
  });

  it('entrega os doze de uma vez a quem pediu menos movimento', () => {
    // Quadro em conta-gotas para quem pediu menos movimento é o contrário do
    // que foi pedido: ele tem de nascer inteiro, sem estilo de transição.
    preferencia.reduzido = true;
    try {
      const html = renderToStaticMarkup(<Quadro />);
      expect(cartoesEntrando(html)).toBe(0);
      expect([...html.matchAll(/<img/g)].length).toBe(12);
    } finally {
      preferencia.reduzido = false;
    }
  });

  it('põe o guia em PDF em destaque, em aba nova, desde o primeiro instante', () => {
    // O guia é o elemento de maior destaque da seção — o botão CHEIO, branco
    // sobre preto —, e é ele que responde "como tiro uma que sirva".
    const inicial = renderToStaticMarkup(<ExemplosDeFotos />);
    expect(inicial).toContain('href="/manual/guia-de-fotos.pdf"');
    expect(inicial).toContain('target="_blank"');
    expect(inicial).toContain('rel="noreferrer"');
    expect(inicial).toContain('Baixe nosso guia de fotos');
    expect(inicial).toContain('como tirar as suas melhores fotos');
    expect(inicial).toContain('bg-white');
    expect(inicial).toContain('text-black');
  });
});
