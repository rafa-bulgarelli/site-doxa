/**
 * ─── A PLATAFORMA DE VERDADE, DENTRO DO CAPÍTULO ─────────────────────────────
 *
 * A cena animada explica o que a etapa PEDE; o print prova como a tela é. O
 * dono foi direto: o cliente chega no painel depois de ler o manual, e se o
 * que ele viu aqui não se parece com o que ele vê lá, o manual perde a
 * autoridade justamente na hora em que ela vale.
 *
 * Três decisões que não são gosto:
 *
 *  · **O print NÃO é decoração.** As cenas são `aria-hidden` porque o texto ao
 *    lado já diz tudo que elas desenham. Um print carrega informação que não
 *    está escrita em lugar nenhum (a nota, os nomes dos campos, o caminho do
 *    botão), então cada um vem como `<figure>` com um `alt` que descreve o que
 *    a tela mostra — nunca um alt vazio.
 *  · **Slug manda, arquivo não.** Quem tem print é o capítulo, pelo slug do
 *    banco (`onboarding`, `voz` no seed v2/v3/v4). Capítulo sem entrada no mapa
 *    não abre bloco nenhum — versão antiga do manual atravessa isto sem um
 *    único caso especial, igual às cenas.
 *  · **`width`/`height` são os pixels REAIS do arquivo** (conferidos com
 *    `sips`), com `loading="lazy"`: sem eles o navegador não reserva a altura,
 *    e a imagem chegando empurra o texto que o cliente está lendo.
 */
import { Entrada } from './pecas';

/** Um print da plataforma, do jeito que ele entra na página. */
interface Print {
  /** Caminho servido a partir de `public/` — os arquivos são do prelude. */
  src: string;
  /** O que a tela MOSTRA, para quem não a enxerga. Nunca vazio. */
  alt: string;
  /** A leitura curta embaixo da imagem: o que olhar naquele print. */
  legenda: string;
  largura: number;
  altura: number;
}

const PRINTS: Record<string, readonly Print[]> = {
  onboarding: [
    {
      src: '/manual/prints/onboarding-scan.avif',
      alt:
        'Tela do Doxa Scan do onboarding na plataforma, com a nota 46 de 100, o aviso de que ' +
        'não é preciso buscar a nota máxima a partir de 75 pontos, e o bloco "Alcance de topo ' +
        'de funil" avaliado em 4 de 10 com a análise da resposta logo abaixo.',
      legenda:
        'O Doxa Scan lê o onboarding inteiro e dá uma nota. Não precisa nota máxima: de 75 pontos ' +
        'para cima já dá para seguir.',
      largura: 1400,
      altura: 805,
    },
    {
      src: '/manual/prints/onboarding-negocio.avif',
      alt:
        'Cartão "Sobre o negócio" do onboarding: a pergunta sobre o que a empresa faz, a resposta ' +
        'escrita pelo cliente e, embaixo, a "Análise desta resposta" com nota 4 de 10 dividida em ' +
        'o que está bom, o que pode melhorar, como melhorar e o impacto no resultado.',
      legenda:
        'Cada resposta volta analisada, com o que está bom e o que falta. Aqui a nota é 4 de 10 ' +
        'porque o mecanismo ficou abstrato.',
      largura: 1400,
      altura: 1119,
    },
    {
      src: '/manual/prints/onboarding-autoridade.avif',
      alt:
        'Cartão "Autoridade e diferencial" do onboarding, com nota 3 de 10 marcada como fraca: a ' +
        'análise aponta a falta de um número verificável, de uma credencial e de uma posição ' +
        'clara contra algo do mercado, e explica o impacto disso nos vídeos.',
      legenda:
        'Resposta fraca não trava você — a plataforma diz o que falta (um número, uma credencial, ' +
        'uma posição) e deixa seguir.',
      largura: 1400,
      altura: 1143,
    },
  ],
  voz: [
    {
      src: '/manual/prints/voz-minha-voz.avif',
      alt:
        'Tela "Minha Voz" da plataforma, com as três etapas do clone em sequência — upload das ' +
        'gravações de voz, voz em treinamento e voz pronta para uso — o aviso de que ainda não ' +
        'existe uma voz profissional criada e o botão "Criar clone de voz".',
      legenda:
        'A voz tem três etapas, nessa ordem: você envia as gravações, a plataforma treina, e só ' +
        'então a voz fica pronta para uso.',
      largura: 1400,
      altura: 805,
    },
    {
      src: '/manual/prints/voz-clone-de-voz.avif',
      alt:
        'Formulário "Clone de Voz Profissional": campos de nome da voz, idioma das amostras em ' +
        'português, descrição e etiqueta de sotaque; à direita, as opções de enviar amostras ou ' +
        'gravar na hora, com o aviso de mandar pelo menos 30 minutos de áudio, uma hora no ideal.',
      legenda:
        'É aqui que a gravação entra. Áudio limpo e fala natural — sem decorar nada — é o que ' +
        'define a qualidade da voz.',
      largura: 1400,
      altura: 807,
    },
  ],
};

/** Os prints daquele capítulo. Slug sem print devolve lista vazia, sem erro. */
export function printsDaSecao(slug: string): readonly Print[] {
  return PRINTS[slug] ?? [];
}

/**
 * O bloco de prints do capítulo — nada quando o capítulo não tem nenhum.
 *
 * O título sai como `<h2>` de metadado em vez do `Rotulo` das peças (que é um
 * `<p>`, para "Capítulo 2 de 4"): quem navega por cabeçalho precisa achar as
 * imagens sem varrer a página inteira, e o tamanho continua discreto de
 * propósito — a prova é a imagem, não o letreiro dela.
 */
export default function Prints({ slug }: { slug: string }) {
  const prints = printsDaSecao(slug);
  if (prints.length === 0) return null;
  return (
    /* Um respiro depois dos cartões: a prova entra QUANDO o texto já foi lido,
       não junto dele. `Entrada` é a mesma peça do resto do fluxo, então
       `prefers-reduced-motion` já vem respeitado. */
    <Entrada atraso={0.15}>
      <section className="mt-10">
        <h2 className="text-[14px] uppercase tracking-[0.16em] text-doxa-muted">
          Na plataforma, é assim
        </h2>
        <div className="mt-4 space-y-4">
          {prints.map((print) => (
            /* Uma coluna só: são prints largos de tela cheia, e duas colunas
               num celular deixariam a letra da plataforma ilegível. */
            <figure
              key={print.src}
              className="overflow-hidden rounded-3xl border border-doxa-line bg-doxa-surface"
            >
              <img
                src={print.src}
                alt={print.alt}
                width={print.largura}
                height={print.altura}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
              <figcaption className="px-5 py-4 text-[16px] leading-[1.6] text-white/65">
                {print.legenda}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </Entrada>
  );
}
