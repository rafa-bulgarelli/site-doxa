/**
 * ─── UM CAPÍTULO DO MANUAL, UMA ETAPA POR VEZ ────────────────────────────────
 *
 * O redesenho da v2 tirou o texto contratual do caminho ("tá com muito texto, 30
 * coisinhas pra dar aceite — ninguém vai ler essa porra"). O da v3 tira a lista:
 * "uma etapa para CADA item da garantia, com uma animação diferente. Você deixa
 * tudo na mesma página e o cara vai descer marcando tudo, não vai nem ler nada".
 *
 * Então o capítulo virou uma SEQUÊNCIA. Quem decide quantas telas ele tem são os
 * DADOS (`etapasDo`), nunca o slug: capítulo com N obrigatórias abre com a cena
 * grande, dá N telas de item e fecha no respiro; capítulo sem nenhuma continua
 * sendo uma leitura só. Uma versão antiga do manual atravessa isto aqui sem um
 * único caso especial — e uma versão com dez itens ganha dez telas sozinha.
 *
 * A única exceção é o quadro de fotos do clone (`SLUG_DO_CLONE`), que é
 * ilustração e não cobra nada: slug sem quadro simplesmente não tem a etapa.
 */
import { cenaDaSecao } from '../cenas/contrato';
import ExemplosDeFotos from '../cenas/ExemplosDeFotos';
import { Interludio, TelaDoItem } from './Aceites';
import Prints from './Prints';
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
import type { Etapa } from './maquina';
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

/** A abertura do capítulo de aceites: a cena grande e o que vem pela frente. */
function TelaDeIntro({ capitulo, itens }: { capitulo: Secao; itens: number }) {
  return (
    <Entrada>
      <Cena slug={capitulo.slug} />
      <Titulo>{capitulo.titulo}</Titulo>
      <div className="mt-5">
        <Linha>{capitulo.descricao}</Linha>
      </div>
      <p className="mt-7 rounded-2xl border border-white/[0.14] bg-doxa-surface px-5 py-4 text-[17px] leading-[1.6] text-white/70">
        {itens === 1
          ? 'É 1 item, numa tela só. Leia e confirme para seguir.'
          : `São ${itens} itens, um por tela. Leia cada um e confirme para seguir — dá para voltar quando quiser.`}
      </p>
    </Entrada>
  );
}

/** O capítulo que só explica: os cartões, todos abertos, sem caixa nenhuma. */
function TelaDeLeitura({ capitulo, regras }: { capitulo: Secao; regras: Regra[] }) {
  return (
    <Entrada>
      <Cena slug={capitulo.slug} />
      <Titulo>{capitulo.titulo}</Titulo>
      <div className="mt-5">
        <Linha>{capitulo.descricao}</Linha>
      </div>
      <div className="mt-8 space-y-4">
        {regras.map((regra) => (
          <CartaoDeLeitura key={regra.id} regra={regra} />
        ))}
      </div>
      {/* Os prints reais da plataforma vêm DEPOIS dos cartões, e só nos
          capítulos que têm um (o próprio bloco decide pelo slug): primeiro o
          cliente lê o que precisa fazer, depois vê a tela onde vai fazer. */}
      <Prints slug={capitulo.slug} />
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
      return <TelaDeIntro capitulo={capitulo} itens={obrigatorias.length} />;
    case 'leitura':
      return <TelaDeLeitura capitulo={capitulo} regras={etapa.regras} />;
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

function rotuloDoAvanco(etapa: Etapa | undefined, fimDoManual: boolean): string {
  if (fimDoManual) return 'Ir para a revisão final';
  if (etapa == null) return 'Continuar →';
  switch (etapa.tipo) {
    case 'intro':
      return 'Começar pelo item 1 →';
    case 'item':
      return etapa.numero < etapa.total ? 'Próximo item →' : 'Continuar →';
    case 'leitura':
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
 * Fora da etapa de item não há o que travar, e um botão que não responde ao
 * toque seria mentira. Na etapa de item ele só acende com a confirmação
 * marcada — e a tela DIZ o que falta antes de o cliente tentar, porque botão
 * apagado sem explicação é o jeito mais rápido de perder alguém no meio.
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
        {rotuloDoAvanco(etapa, fimDoManual)}
      </Botao>
      <BotaoDiscreto onClick={aoVoltar}>Voltar</BotaoDiscreto>
    </div>
  );
}
