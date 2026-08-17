/**
 * ─── UM ITEM POR TELA ────────────────────────────────────────────────────────
 *
 * A v2 punha os oito itens da garantia numa lista só, e o dono reprovou com a
 * frase que define este arquivo: "você deixa tudo na mesma página e o cara vai
 * descer marcando tudo, não vai nem ler nada". Aqui cada item obrigatório é uma
 * TELA — mini-cena, "Item 3 de 8", título grande em serifa, a instrução, o
 * porquê a um toque e a confirmação daquele item, que é o que libera o próximo.
 *
 * O que a tela única dava de graça e precisou ser reconstruído: o tamanho do
 * caminho. É o que a `TrilhaDeItens` faz — um ponto por item, aceso na cor da
 * fita quando confirmado. Sem ela, uma regra sozinha na tela esconde quantas
 * vêm depois, e fluxo de aceite sem horizonte é o mais fácil de abandonar.
 *
 * A cor é gramática, não enfeite: verde é o que protege a garantia, vermelho é
 * o que a quebra, e a fita da marca (`faq/cores.ts`) marca a passagem do tempo.
 * O anel da Siri aparece UMA vez por tela, na confirmação — é o gesto que falta.
 *
 * O interlúdio fecha o capítulo pelo lado positivo: as informativas ("o que
 * você PODE fazer") sozinhas numa tela verde, depois do último item. No meio da
 * lista, elas liam como mais uma condição — que é o contrário do que dizem.
 */
import { cenaDoItem } from '../cenas/contrato';
import { corDaDuvida } from '../../components/faq/cores';
import { ANEL_SIRI, Entrada, Fio, Revelacao, Rotulo, TrilhaDeItens } from './pecas';
import type { Regra } from '../tipos';

/* ─── A MINI-CENA DO ITEM ──────────────────────────────────────────────────── */

/** Código sem cena não tem ilustração, e a etapa continua inteira. */
function MiniCena({ codigo }: { codigo: string }) {
  const Desenho = cenaDoItem(codigo);
  if (Desenho == null) return null;
  return (
    <div className="mb-8">
      <Desenho />
    </div>
  );
}

/* ─── A CONFIRMAÇÃO DAQUELE ITEM ───────────────────────────────────────────── */

/**
 * O quadrado marcado.
 *
 * O `input` de verdade é `sr-only` (o desenho nativo não dá para estilizar sem
 * gambiarra), então o anel de foco do teclado tem que vir dele para cá pelo
 * `peer` — sem isso quem navega por tabulação não vê onde está.
 */
function Marca({ marcada }: { marcada: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[19px] leading-none transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-doxa-bg ${
        marcada ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/30 text-transparent'
      }`}
    >
      ✓
    </span>
  );
}

/**
 * O aceite de UM item.
 *
 * O rótulo inteiro é o alvo, com 64px de altura mínima: isto é marcado com o
 * polegar, em pé, e um erro de clique aqui é o cliente confirmando o que não
 * leu. Por marcar, ela leva o anel da Siri com a isca — é o único gesto que
 * falta na tela. Marcada, o anel sai e entra o verde.
 *
 * O texto muda de lugar quando o item tem destrava: na tela do par, a frase é
 * "Li, concordo" porque o que se acabou de ler são as DUAS metades.
 */
function ConfirmacaoDoItem({
  marcada,
  aoAlternar,
  texto = 'Li, entendi e concordo com este item',
}: {
  marcada: boolean;
  aoAlternar: () => void;
  texto?: string;
}) {
  return (
    <label
      style={marcada ? undefined : ANEL_SIRI}
      className={`relative mt-8 flex min-h-[64px] cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
        marcada
          ? 'border-emerald-400/45 bg-emerald-400/[0.07]'
          : 'anel-siri anel-siri-isca border-white/20 bg-doxa-surface hover:bg-white/[0.05]'
      }`}
    >
      <input type="checkbox" checked={marcada} onChange={aoAlternar} className="peer sr-only" />
      <Marca marcada={marcada} />
      <span className={`text-[17px] leading-[1.45] ${marcada ? 'text-white' : 'text-white/80'}`}>
        {texto}
      </span>
    </label>
  );
}

/* ─── A TELA DO ITEM ───────────────────────────────────────────────────────── */

/** O aviso do item crítico. Vermelho aqui é significado, não decoração. */
function AvisoCritico() {
  return (
    <p className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/[0.05] px-5 py-4 text-[17px] leading-[1.5] text-white/80">
      Este item, descumprido, pode quebrar a garantia.
    </p>
  );
}

/** Onde estou e quanto falta: a posição em texto e a trilha em pontos. */
function Posicao({
  numero,
  total,
  confirmados,
  cor,
}: {
  numero: number;
  total: number;
  confirmados: readonly boolean[];
  cor: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-[14px] uppercase tracking-[0.16em]" style={{ color: cor }}>
        Item {numero} de {total}
      </p>
      <TrilhaDeItens total={total} atual={numero} confirmados={confirmados} />
    </div>
  );
}

/** O porquê e o exemplo, a um toque — e nunca abertos por padrão. */
function PorQueProtege({ regra, cor }: { regra: Regra; cor: string }) {
  const temPorque = regra.porque.trim().length > 0;
  const temExemplo = regra.exemplo.trim().length > 0;
  if (!temPorque && !temExemplo) return null;
  return (
    <div className="mt-6">
      <Revelacao rotulo="Por que isso protege você">
        <div className="space-y-3 border-l pl-4" style={{ borderColor: cor }}>
          {temPorque && <p className="text-[17px] leading-[1.7] text-white/70">{regra.porque}</p>}
          {temExemplo && (
            <p className="text-[17px] leading-[1.7] text-white/70">
              <span className="text-white/45">Na prática: </span>
              {regra.exemplo}
            </p>
          )}
        </div>
      </Revelacao>
    </div>
  );
}

interface PropsDoItem {
  regra: Regra;
  /** 1-based, para ler na tela: "Item 3 de 8". */
  numero: number;
  total: number;
  /** Um booleano por item obrigatório do capítulo, na ordem — a trilha os desenha. */
  confirmados: readonly boolean[];
  aoAlternar: (id: string) => void;
  /** `true` quando a confirmação foi para a tela de destrava, logo adiante. */
  comDestrava?: boolean;
}

export function TelaDoItem({
  regra,
  numero,
  total,
  confirmados,
  aoAlternar,
  comDestrava = false,
}: PropsDoItem) {
  const marcada = confirmados[numero - 1] === true;
  // A cor do item vem da fita da marca, pela POSIÇÃO dele: oito itens em oito
  // tons vizinhos leem como uma sequência, e não como oito avisos diferentes.
  const cor = corDaDuvida(numero - 1);

  return (
    <Entrada>
      <MiniCena codigo={regra.codigo} />
      <Posicao numero={numero} total={total} confirmados={confirmados} cor={cor} />

      <div className="mt-4">
        <Fio cor={cor} />
      </div>
      <h2 className="mt-5 font-serif text-[30px] leading-[1.1] text-white sm:text-[38px]">
        {regra.titulo}
      </h2>
      <p className="mt-5 text-[19px] leading-[1.6] text-white/85">{regra.instrucao}</p>

      <PorQueProtege regra={regra} cor={cor} />
      {regra.severidade === 'critica' && <AvisoCritico />}

      {/* Com destrava, a caixa NÃO fica aqui: ela desce para a tela do par, e o
          cliente só confirma depois de ver o que a regra libera. Sem destrava
          (a v4 no ar, qualquer versão antiga), tudo segue como sempre foi. */}
      {!comDestrava && (
        <ConfirmacaoDoItem marcada={marcada} aoAlternar={() => aoAlternar(regra.id)} />
      )}
    </Entrada>
  );
}

/* ─── A DESTRAVA: O QUE A REGRA LIBERA ─────────────────────────────────────── */

/** Uma metade do par. Vermelho é o que não pode; verde é o que continua podendo. */
function MetadeDoPar({
  rotulo,
  regra,
  tom,
}: {
  rotulo: string;
  regra: Regra;
  tom: 'trava' | 'alivio';
}) {
  const cor =
    tom === 'trava'
      ? 'border-rose-400/30 bg-rose-400/[0.05]'
      : 'border-emerald-400/30 bg-emerald-400/[0.06]';
  const marca = tom === 'trava' ? 'text-rose-300/90' : 'text-emerald-300/90';
  return (
    <article className={`rounded-3xl border p-6 ${cor}`}>
      <p className={`text-[14px] uppercase tracking-[0.16em] ${marca}`}>{rotulo}</p>
      <h3 className="mt-3 font-serif text-[24px] leading-[1.15] text-white sm:text-[26px]">
        {regra.titulo}
      </h3>
      <p className="mt-3 text-[17px] leading-[1.7] text-white/75">{regra.instrucao}</p>
    </article>
  );
}

/**
 * O par trava → destrava, numa tela.
 *
 * A regra sozinha lê como perda; a regra ao lado do que ela libera lê como
 * troca — e é a troca que é verdade. Por isso a confirmação vive AQUI quando o
 * par existe: quem marca já viu as duas metades, não só a que cobra.
 *
 * A caixa alterna o id da OBRIGATÓRIA (`regra`), nunca o da informativa: o
 * aceite que vai para o banco continua sendo exatamente o mesmo de antes, e o
 * `manual_concluir` só olha para `obrigatoria` do lado de lá.
 *
 * No celular as duas metades empilham (uma coluna); do `sm` para cima ficam
 * lado a lado, que é onde a comparação acontece de relance.
 */
export function TelaDaDestrava({
  regra,
  alivio,
  marcada,
  aoAlternar,
}: {
  regra: Regra;
  alivio: Regra;
  marcada: boolean;
  aoAlternar: (id: string) => void;
}) {
  return (
    <Entrada>
      <Rotulo>O que muda para você</Rotulo>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <MetadeDoPar rotulo="Não pode" regra={regra} tom="trava" />
        <MetadeDoPar rotulo="Pode" regra={alivio} tom="alivio" />
      </div>
      {alivio.porque.trim().length > 0 && (
        <p className="mt-6 text-[17px] leading-[1.7] text-white/65">{alivio.porque}</p>
      )}
      {alivio.exemplo.trim().length > 0 && (
        <p className="mt-3 text-[17px] leading-[1.7] text-white/65">
          <span className="text-white/45">Na prática: </span>
          {alivio.exemplo}
        </p>
      )}
      <ConfirmacaoDoItem
        marcada={marcada}
        aoAlternar={() => aoAlternar(regra.id)}
        texto="Li, concordo com este item"
      />
    </Entrada>
  );
}

/* ─── O INTERLÚDIO: O QUE VOCÊ PODE FAZER ──────────────────────────────────── */

/** Uma informativa do capítulo, sem caixa de aceite: é folga, não condição. */
function NotaDeAlivio({ regra }: { regra: Regra }) {
  const temPorque = regra.porque.trim().length > 0;
  const temExemplo = regra.exemplo.trim().length > 0;
  return (
    <article className="rounded-3xl border border-emerald-400/25 bg-emerald-400/[0.05] p-6">
      <h3 className="font-serif text-[26px] leading-[1.15] text-white sm:text-[28px]">
        {regra.titulo}
      </h3>
      <p className="mt-4 text-[17px] leading-[1.7] text-white/80">{regra.instrucao}</p>
      {temPorque && <p className="mt-3 text-[17px] leading-[1.7] text-white/60">{regra.porque}</p>}
      {temExemplo && (
        <p className="mt-3 text-[17px] leading-[1.7] text-white/60">
          <span className="text-white/40">Na prática: </span>
          {regra.exemplo}
        </p>
      )}
    </article>
  );
}

/**
 * O respiro depois do último item.
 *
 * Ele é a única tela do capítulo que não cobra nada, e é de propósito que ela
 * venha logo depois da mais pesada: quem acabou de confirmar oito condições
 * precisa ouvir, na mesma voz, que a rotina tem folga de verdade.
 */
export function Interludio({ regras, itens }: { regras: Regra[]; itens: number }) {
  return (
    <Entrada>
      <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/[0.06] px-6 py-8 text-center">
        <Rotulo>Respire</Rotulo>
        <p className="mt-4 font-serif text-[30px] leading-[1.1] text-white sm:text-[36px]">
          {itens === 1 ? 'Item confirmado.' : `Os ${itens} itens estão confirmados.`}
        </p>
        <p className="mt-4 text-[17px] leading-[1.7] text-white/70">
          Agora a parte que quase ninguém conta: o que você continua podendo fazer.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {regras.map((regra) => (
          <NotaDeAlivio key={regra.id} regra={regra} />
        ))}
      </div>
    </Entrada>
  );
}
