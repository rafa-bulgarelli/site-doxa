/**
 * ─── UM ITEM POR TELA ────────────────────────────────────────────────────────
 *
 * A v2 punha os oito itens da garantia numa lista só, e o dono reprovou com a
 * frase que define este arquivo: "você deixa tudo na mesma página e o cara vai
 * descer marcando tudo, não vai nem ler nada". Aqui cada item obrigatório é uma
 * TELA — mini-cena, "Item 3 de 8", título grande em serifa, a instrução e a
 * confirmação daquele item, que é o que libera o próximo.
 *
 * A tela é ENXUTA por decisão do dono, depois de ver a versão cheia: só o
 * cartão da regra, o "Li, concordo" e os botões. Saíram daqui a revelação "Por
 * que isso protege você" (com o "Na prática") e o aviso vermelho do item
 * crítico — texto que o cliente não pediu, na tela em que ele tem UMA coisa
 * para fazer. Ficaram a ilustração e a trilha: uma é o que faz a regra ser
 * entendida sem ler, a outra é orientação de onde se está, não texto do passo.
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
import { ANEL_SIRI, Entrada, Fio, Rotulo, TrilhaDeItens } from './pecas';
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
 * A frase é UMA só, em toda tela de item: o texto do aceite é o que o cliente
 * declara ter lido, e frase que muda de tela para tela é prova que varia.
 */
function ConfirmacaoDoItem({ marcada, aoAlternar }: { marcada: boolean; aoAlternar: () => void }) {
  const texto = 'Li, entendi e concordo com este item';
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

interface PropsDoItem {
  regra: Regra;
  /** 1-based, para ler na tela: "Item 3 de 8". */
  numero: number;
  total: number;
  /** Um booleano por item obrigatório do capítulo, na ordem — a trilha os desenha. */
  confirmados: readonly boolean[];
  aoAlternar: (id: string) => void;
}

export function TelaDoItem({ regra, numero, total, confirmados, aoAlternar }: PropsDoItem) {
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

      {/* Nada entre a instrução e a caixa: a tela do item tem UMA coisa a
          fazer, e todo parágrafo a mais aqui é um convite a rolar sem ler. */}
      <ConfirmacaoDoItem marcada={marcada} aoAlternar={() => aoAlternar(regra.id)} />
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
