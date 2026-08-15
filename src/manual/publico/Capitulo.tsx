/**
 * ─── UM CAPÍTULO DO MANUAL ───────────────────────────────────────────────────
 *
 * O redesenho pedido pelo dono em uma frase: "tá com muito texto, 30 coisinhas
 * pra dar aceite — ninguém vai ler essa porra".
 *
 * Então o capítulo EXPLICA antes de cobrar. Ele abre com a cena animada, tem
 * título grande, uma frase de contexto, cartões curtos com o porquê a um toque
 * de distância, e um único botão "Entendi". Checkbox nenhum: o aceite acontece
 * num capítulo só, o da garantia, e é a `ListaDeAceites` que o desenha.
 *
 * Quem decide qual dos dois feitios aparece são os DADOS (`feitioDo`), nunca o
 * slug — capítulo com regra obrigatória vira lista de aceites, sem ela vira
 * leitura. É o que faz uma versão antiga do manual continuar renderizando aqui
 * sem um único caso especial.
 *
 * A cena vem de `cenaDaSecao(slug)`: slug sem cena não tem ilustração, e o
 * capítulo continua inteiro — sem buraco e sem erro.
 */
import { cenaDaSecao } from '../cenas/contrato';
import { Botao, BotaoDiscreto, Casca, Entrada, Linha, Revelacao, Rotulo, Titulo, Trilho } from './pecas';
import { ListaDeAceites } from './Aceites';
import { feitioDo, informativasDa, obrigatoriasDa, regrasEmOrdem } from './maquina';
import type { FeitioDoCapitulo } from './maquina';
import type { Regra, Secao } from '../tipos';

/* ─── A ILUSTRAÇÃO ─────────────────────────────────────────────────────────── */

function Cena({ slug }: { slug: string }) {
  const Desenho = cenaDaSecao(slug);
  if (Desenho == null) return null;
  return (
    <div className="mt-8">
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
export function CartaoDeLeitura({ regra }: { regra: Regra }) {
  const temPorque = regra.porque.trim().length > 0;
  const temExemplo = regra.exemplo.trim().length > 0;
  return (
    <article className="rounded-3xl border border-doxa-line bg-doxa-surface p-6">
      <h3 className="font-serif text-[24px] leading-[1.2] text-white sm:text-[26px]">
        {regra.titulo}
      </h3>
      <p className="mt-3 text-[17px] leading-[1.7] text-white/75">{regra.instrucao}</p>
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

/* ─── O CAPÍTULO ───────────────────────────────────────────────────────────── */

export function Capitulo({
  capitulo,
  posicao,
  total,
  marcadas,
  aoAlternar,
  aoAvancar,
  aoVoltar,
}: {
  capitulo: Secao;
  /** 1-based, para ler na tela: "Capítulo 2 de 4". */
  posicao: number;
  total: number;
  marcadas: readonly string[];
  aoAlternar: (id: string) => void;
  aoAvancar: () => void;
  aoVoltar: () => void;
}) {
  const feitio = feitioDo(capitulo);
  const ultimo = posicao === total;

  return (
    <Casca>
      <Rotulo>
        Capítulo {posicao} de {total}
      </Rotulo>
      <div className="mt-3">
        <Trilho fracao={total === 0 ? 1 : posicao / total} />
      </div>

      {/* `key` no id: trocar de capítulo refaz a entrada inteira, e é o gesto
          que diz "mudou de assunto" sem empurrar o texto na leitura. */}
      <Entrada key={capitulo.id}>
        <Cena slug={capitulo.slug} />

        <div className="mt-8">
          <Titulo>{capitulo.titulo}</Titulo>
        </div>
        <div className="mt-5">
          <Linha>{capitulo.descricao}</Linha>
        </div>

        {feitio === 'aceites' ? (
          <ListaDeAceites
            obrigatorias={obrigatoriasDa(capitulo)}
            alivios={informativasDa(capitulo)}
            marcadas={marcadas}
            aoAlternar={aoAlternar}
          />
        ) : (
          <div className="mt-8 space-y-4">
            {regrasEmOrdem(capitulo).map((regra) => (
              <CartaoDeLeitura key={regra.id} regra={regra} />
            ))}
          </div>
        )}
      </Entrada>

      <Rodape
        feitio={feitio}
        ultimo={ultimo}
        faltam={obrigatoriasDa(capitulo).filter((regra) => !marcadas.includes(regra.id)).length}
        aoAvancar={aoAvancar}
        aoVoltar={aoVoltar}
      />
    </Casca>
  );
}

/* ─── O QUE FECHA O CAPÍTULO ───────────────────────────────────────────────── */

function oQueFalta(quantas: number): string {
  if (quantas === 1) return 'Falta confirmar 1 item.';
  return `Faltam confirmar ${quantas} itens.`;
}

function rotuloDoAvanco(feitio: FeitioDoCapitulo, ultimo: boolean): string {
  if (feitio === 'leitura') return 'Entendi →';
  return ultimo ? 'Ir para a revisão final' : 'Continuar →';
}

/**
 * O rodapé.
 *
 * No capítulo de leitura o botão está sempre aberto: não há o que travar, e um
 * "Entendi" que não responde ao toque seria mentira. No de aceites ele só
 * acende com todos marcados — e a tela DIZ quantos faltam antes de o cliente
 * tentar, porque botão apagado sem explicação é o jeito mais rápido de perder
 * alguém no meio do fluxo.
 */
function Rodape({
  feitio,
  ultimo,
  faltam,
  aoAvancar,
  aoVoltar,
}: {
  feitio: FeitioDoCapitulo;
  ultimo: boolean;
  faltam: number;
  aoAvancar: () => void;
  aoVoltar: () => void;
}) {
  const travado = feitio === 'aceites' && faltam > 0;
  return (
    <div className="mt-10 space-y-3">
      {travado && (
        <p className="text-center text-[16px] text-white/55" role="status">
          {oQueFalta(faltam)}
        </p>
      )}
      <Botao onClick={aoAvancar} desabilitado={travado}>
        {rotuloDoAvanco(feitio, ultimo)}
      </Botao>
      <BotaoDiscreto onClick={aoVoltar}>Voltar</BotaoDiscreto>
    </div>
  );
}
