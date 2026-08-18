/**
 * ─── UM CAPÍTULO DO MANUAL, UMA COISA DE CADA VEZ ────────────────────────────
 *
 * O redesenho da v2 tirou o texto contratual do caminho ("tá com muito texto, 30
 * coisinhas pra dar aceite — ninguém vai ler essa porra"). O da v3 tirou a lista
 * de aceites: "uma etapa para CADA item da garantia. Você deixa tudo na mesma
 * página e o cara vai descer marcando tudo, não vai nem ler nada". O da v5 tira
 * a ÚLTIMA parede que restava: os capítulos que só explicavam despejavam todos
 * os cartões e todos os prints numa tela só, e era exatamente a rolagem que o
 * dono reprovou nos outros.
 *
 * Agora TODO capítulo é uma sequência: intro → uma tela por cartão, com o print
 * da plataforma logo depois do cartão que ele prova → (na garantia) uma tela por
 * item, com a confirmação na tela do próprio item. Quem decide quantas telas são
 * é `etapasDo`, a partir dos DADOS — uma versão antiga do manual atravessa isto
 * sem um único caso especial, e uma versão com dez itens ganha dez telas.
 *
 * A única exceção é o quadro de fotos do clone (`SLUG_DO_CLONE`), que é
 * ilustração e não cobra nada: slug sem quadro simplesmente não tem a etapa.
 */
import { cenaDaSecao, cenaDoPasso } from '../cenas/contrato';
import ExemplosDeFotos from '../cenas/ExemplosDeFotos';
import { Interludio, TelaDoItem } from './Aceites';
import {
  Botao,
  BotaoDiscreto,
  Casca,
  Entrada,
  Fio,
  Linha,
  Revelacao,
  Rotulo,
  Titulo,
  Trilho,
} from './pecas';
import { etapasDo, obrigatoriasDa, podeAvancarDaEtapa } from './maquina';
// A `Etapa` é o contrato entre a máquina e estas telas: tipo novo aqui sem tela
// correspondente vira erro de compilação no `switch`, não tela em branco.
import type { Etapa } from './maquina';
import type { Print } from './prints';
import type { Regra, Secao } from '../tipos';

/* ─── A ILUSTRAÇÃO DO CAPÍTULO ─────────────────────────────────────────────── */

function Cena({ slug }: { slug: string }) {
  const Desenho = cenaDaSecao(slug);
  if (Desenho == null) return null;
  return (
    <div className="mb-8">
      <Desenho />
    </div>
  );
}

/**
 * A mini-cena de UM passo — o mesmo desenho que a garantia já usa no item
 * (`Aceites.tsx`), estendido aos capítulos que só explicam: cada "Passo X de Y"
 * abre com a animação daquele passo, e a animação é o que explica FAZENDO,
 * antes de o texto falar.
 *
 * O vocabulário é o `codigo` da regra no banco, não a posição na tela: código
 * sem cena (toda versão antiga do manual, um seed novo que renomeou) fica sem
 * ilustração e a etapa continua inteira — sem erro e sem buraco.
 */
function MiniCenaDoPasso({ codigo }: { codigo: string }) {
  const Desenho = cenaDoPasso(codigo);
  if (Desenho == null) return null;
  return (
    <div className="mb-8">
      <Desenho />
    </div>
  );
}

/* ─── O CARTÃO DE LEITURA ──────────────────────────────────────────────────── */

/**
 * Um cartão explicativo: título grande, instrução, e o resto guardado.
 *
 * O porquê e o exemplo entram numa revelação porque a tela precisa caber num
 * celular sem rolagem infinita — e porque o cliente que já entendeu não deve
 * pagar o pedágio de rolar por um texto que não pediu.
 */
export function CartaoDeLeitura({ regra, cor }: { regra: Regra; cor?: string }) {
  const temPorque = regra.porque.trim().length > 0;
  const temExemplo = regra.exemplo.trim().length > 0;
  return (
    <article className="rounded-3xl border border-doxa-line bg-doxa-surface p-6">
      <Fio cor={cor} />
      <h3 className="mt-4 font-serif text-[26px] leading-[1.15] text-white sm:text-[28px]">
        {regra.titulo}
      </h3>
      <p className="mt-4 text-[17px] leading-[1.7] text-white/80">{regra.instrucao}</p>
      {(temPorque || temExemplo) && (
        <div className="mt-4">
          <Revelacao rotulo="Por que isso importa">
            <div className="space-y-3 border-l border-white/[0.14] pl-4">
              {temPorque && <p className="text-[17px] leading-[1.7] text-white/65">{regra.porque}</p>}
              {temExemplo && (
                <p className="text-[17px] leading-[1.7] text-white/65">
                  <span className="text-white/45">Na prática: </span>
                  {regra.exemplo}
                </p>
              )}
            </div>
          </Revelacao>
        </div>
      )}
    </article>
  );
}

/* ─── AS TELAS DE CADA ETAPA ───────────────────────────────────────────────── */

/**
 * A promessa do caminho, na abertura.
 *
 * Ela existe porque tela única dá o tamanho de graça e sequência não dá: sem
 * saber que são cinco passos curtos, o cliente não sabe se está entrando num
 * corredor de dois minutos ou de vinte — e a dúvida sozinha faz fechar a aba.
 */
function promessaDoCaminho(itens: number, passos: number): string {
  if (itens === 1) return 'É 1 item, numa tela só. Leia e confirme para seguir.';
  if (itens > 1) {
    return `São ${itens} itens, um por tela. Leia cada um e confirme para seguir — dá para voltar quando quiser.`;
  }
  if (passos === 1) return 'É 1 passo curto. Nada para confirmar aqui: é só leitura.';
  return `São ${passos} passos curtos — um por tela. Nada para confirmar aqui: é só leitura.`;
}

/** A abertura do capítulo: a cena grande, o contexto e o que vem pela frente. */
function TelaDeIntro({
  capitulo,
  itens,
  passos,
}: {
  capitulo: Secao;
  itens: number;
  passos: number;
}) {
  return (
    <Entrada>
      <Cena slug={capitulo.slug} />
      <Titulo>{capitulo.titulo}</Titulo>
      <div className="mt-5">
        <Linha>{capitulo.descricao}</Linha>
      </div>
      <p className="mt-7 rounded-2xl border border-white/[0.14] bg-doxa-surface px-5 py-4 text-[17px] leading-[1.6] text-white/70">
        {promessaDoCaminho(itens, passos)}
      </p>
    </Entrada>
  );
}

/**
 * A tela de UM print da plataforma.
 *
 * A cena animada explica o que a etapa PEDE; o print prova como a tela é — o
 * cliente chega no painel depois de ler o manual, e se o que ele viu aqui não
 * se parece com o que ele vê lá, o manual perde a autoridade na hora em que ela
 * vale. Era um bloco no fim do capítulo (todos os prints empilhados) e virou
 * uma tela por print, pelo mesmo veredito que derrubou a parede de texto:
 * quatro imagens largas seguidas se rolam sem olhar; uma sozinha se olha.
 *
 * Três decisões que não são gosto:
 *
 *  · **O print NÃO é decoração.** As cenas são `aria-hidden` porque o texto ao
 *    lado já diz tudo que elas desenham; o print carrega informação que não
 *    está escrita em lugar nenhum (a nota, os campos, o caminho do botão).
 *    Daí `<figure>` com `alt` descritivo — nunca um alt vazio.
 *  · **O letreiro é `<h2>`**, e não o `Rotulo` das peças (que é um `<p>`, para
 *    "Capítulo 2 de 4"): quem navega por cabeçalho precisa achar a imagem.
 *  · **`width`/`height` são os pixels REAIS** (`prints.ts`), com `loading`
 *    preguiçoso: sem eles o navegador não reserva a altura, e a imagem chegando
 *    empurra o texto que o cliente está lendo.
 */
function TelaDoPrint({ print }: { print: Print }) {
  return (
    <Entrada>
      {/* A mesma roupa do `Rotulo` — serifa, caixa de frase — porque é o mesmo
          tipo de letreiro; o que muda é ser `<h2>`, para quem navega por
          cabeçalho achar a imagem. */}
      <h2 className="font-serif text-[16px] text-doxa-muted">Na plataforma, é assim</h2>
      {/* Uma coluna só: são prints largos de tela cheia, e duas colunas num
          celular deixariam a letra da plataforma ilegível. */}
      <figure className="mt-4 overflow-hidden rounded-3xl border border-doxa-line bg-doxa-surface">
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
    </Entrada>
  );
}

/** Um cartão de leitura sozinho na tela, com a posição dele no capítulo. */
function TelaDoCartao({
  regra,
  numero,
  total,
}: {
  regra: Regra;
  numero: number;
  total: number;
}) {
  return (
    <Entrada>
      {/* A cena ACIMA do rótulo, como na tela do item: o desenho é a primeira
          coisa que se vê, e "Passo 2 de 3" é orientação de onde se está — não
          a abertura do assunto. */}
      <MiniCenaDoPasso codigo={regra.codigo} />
      <Rotulo>
        Passo {numero} de {total}
      </Rotulo>
      <div className="mt-4">
        <CartaoDeLeitura regra={regra} />
      </div>
    </Entrada>
  );
}

/**
 * O quadro de fotos, pedido do dono para o capítulo do clone: "o que fazer e o
 * que não fazer, o mais mastigado possível". O desenho vem das cenas — aqui só
 * o título e a moldura, para que a etapa continue existindo mesmo que a
 * ilustração mude por completo.
 */
function Fotos() {
  return (
    <Entrada>
      <Rotulo>Exemplos</Rotulo>
      <div className="mt-4">
        <Titulo>Que foto serve — e que foto não serve</Titulo>
      </div>
      <div className="mt-5">
        <Linha>
          Duas colunas, sem meio-termo: à esquerda o que o clone precisa, à direita o que atrapalha.
          Na dúvida, mande no grupo antes de enviar.
        </Linha>
      </div>
      <div className="mt-8">
        <ExemplosDeFotos />
      </div>
    </Entrada>
  );
}

/* ─── O CAPÍTULO ───────────────────────────────────────────────────────────── */

/** O corpo da etapa da vez. Etapa que não existe não desenha nada. */
function CorpoDaEtapa({
  capitulo,
  etapa,
  marcadas,
  aoAlternar,
}: {
  capitulo: Secao;
  etapa: Etapa;
  marcadas: readonly string[];
  aoAlternar: (id: string) => void;
}) {
  const obrigatorias = obrigatoriasDa(capitulo);
  switch (etapa.tipo) {
    case 'intro':
      return <TelaDeIntro capitulo={capitulo} itens={etapa.itens} passos={etapa.passos} />;
    case 'cartao':
      return <TelaDoCartao regra={etapa.regra} numero={etapa.numero} total={etapa.total} />;
    case 'print':
      return <TelaDoPrint print={etapa.print} />;
    case 'item':
      return (
        <TelaDoItem
          regra={etapa.regra}
          numero={etapa.numero}
          total={etapa.total}
          confirmados={obrigatorias.map((regra) => marcadas.includes(regra.id))}
          aoAlternar={aoAlternar}
        />
      );
    case 'respiro':
      return <Interludio regras={etapa.regras} itens={obrigatorias.length} />;
    case 'fotos':
      return <Fotos />;
    default:
      throw new Error(`etapa desconhecida: ${JSON.stringify(etapa)}`);
  }
}

/**
 * O cabeçalho de toda tela do capítulo.
 *
 * A fração anda DENTRO do capítulo: com uma etapa por item, um trilho que só se
 * mexe na troca de capítulo ficaria parado por oito telas seguidas — e trilho
 * parado lê como progresso que não acontece.
 */
function Cabecalho({
  posicao,
  total,
  etapa,
  etapas,
}: {
  posicao: number;
  total: number;
  etapa: number;
  etapas: number;
}) {
  return (
    <>
      <Rotulo>
        Capítulo {posicao} de {total}
      </Rotulo>
      <div className="mt-3">
        <Trilho fracao={total === 0 ? 1 : (posicao - 1 + (etapa + 1) / etapas) / total} />
      </div>
    </>
  );
}

interface PropsDoCapitulo {
  capitulo: Secao;
  /** 1-based, para ler na tela: "Capítulo 2 de 4". */
  posicao: number;
  total: number;
  /** O índice da etapa dentro do capítulo. Fora da lista, cai na primeira. */
  etapa: number;
  marcadas: readonly string[];
  aoAlternar: (id: string) => void;
  aoAvancar: () => void;
  aoVoltar: () => void;
}

export function Capitulo(props: PropsDoCapitulo) {
  const { capitulo, posicao, total, marcadas } = props;
  const etapas = etapasDo(capitulo);
  const indice = props.etapa >= 0 && props.etapa < etapas.length ? props.etapa : 0;
  const daVez = etapas[indice];

  return (
    <Casca>
      <Cabecalho posicao={posicao} total={total} etapa={indice} etapas={etapas.length} />

      <div className="mt-8">
        {daVez != null && (
          /* `key` na etapa: trocar de tela refaz a entrada inteira, e é o gesto
             que diz "mudou de assunto" sem empurrar o texto durante a leitura. */
          <CorpoDaEtapa
            key={`${capitulo.id}-${indice}`}
            capitulo={capitulo}
            etapa={daVez}
            marcadas={marcadas}
            aoAlternar={props.aoAlternar}
          />
        )}
      </div>

      <Rodape
        etapa={daVez}
        marcadas={marcadas}
        ultimaDoCapitulo={indice === etapas.length - 1}
        ultimoCapitulo={posicao === total}
        aoAvancar={props.aoAvancar}
        aoVoltar={props.aoVoltar}
      />
    </Casca>
  );
}

/* ─── O QUE FECHA A ETAPA ──────────────────────────────────────────────────── */

function rotuloDoAvanco(
  etapa: Etapa | undefined,
  fimDoManual: boolean,
  ultimaDoCapitulo: boolean,
): string {
  if (fimDoManual) return 'Ir para a revisão final';
  if (etapa == null) return 'Continuar →';
  switch (etapa.tipo) {
    case 'intro':
      // Capítulo que cobra aceite diz para onde vai; o que só explica convida.
      return etapa.itens > 0 ? 'Começar pelo item 1 →' : 'Começar →';
    case 'cartao':
    case 'print':
      // "Entendi" fecha o capítulo — é o gesto que o dono descreveu. No meio do
      // caminho ele mentiria: ainda falta coisa para ler.
      return ultimaDoCapitulo ? 'Entendi →' : 'Próximo →';
    case 'item':
      return etapa.numero < etapa.total ? 'Próximo item →' : 'Continuar →';
    case 'fotos':
      return 'Entendi →';
    case 'respiro':
      return 'Continuar →';
    default:
      throw new Error(`etapa desconhecida: ${JSON.stringify(etapa)}`);
  }
}

/**
 * O rodapé.
 *
 * Fora da tela que cobra aceite não há o que travar, e um botão que não responde
 * ao toque seria mentira. Na tela do item — onde a caixa está — ele só acende
 * com ela marcada, e a tela DIZ o que falta antes de o cliente tentar: botão
 * apagado sem explicação é o jeito mais rápido de perder alguém.
 */
function Rodape({
  etapa,
  marcadas,
  ultimaDoCapitulo,
  ultimoCapitulo,
  aoAvancar,
  aoVoltar,
}: {
  etapa: Etapa | undefined;
  marcadas: readonly string[];
  ultimaDoCapitulo: boolean;
  ultimoCapitulo: boolean;
  aoAvancar: () => void;
  aoVoltar: () => void;
}) {
  const travado = etapa != null && !podeAvancarDaEtapa(etapa, marcadas);
  const fimDoManual = ultimaDoCapitulo && ultimoCapitulo;
  return (
    <div className="mt-10 space-y-3">
      {travado && (
        <p className="text-center text-[16px] text-white/55" role="status">
          Confirme o item acima para continuar.
        </p>
      )}
      {/* Sem `aceso` aqui de propósito: o anel da Siri é a luz do gesto que
          FECHA (começar o manual, confirmar o aceite), e um anel em cada
          "Continuar" deixaria de significar "é aqui" para virar papel de
          parede — que é como ele já morreu uma vez no FAQ. */}
      <Botao onClick={aoAvancar} desabilitado={travado}>
        {rotuloDoAvanco(etapa, fimDoManual, ultimaDoCapitulo)}
      </Botao>
      <BotaoDiscreto onClick={aoVoltar}>Voltar</BotaoDiscreto>
    </div>
  );
}
