/**
 * ─── AS PEÇAS DA ÁREA DA EQUIPE ──────────────────────────────────────────────
 *
 * Os pedaços pequenos que aparecem em mais de uma tela. Ficam juntos pela mesma
 * razão das peças da Central: cada um tem quinze linhas, e um arquivo por peça
 * seria uma pasta de imports.
 *
 * O visual é o da Central — mesmos tokens `doxa.*`, mesmo cinza, `font-serif`
 * nos títulos. A COR entra só onde ela É o dado: verde para concluído, âmbar
 * para o que está andando, vermelho apagado para o que morreu. Um painel lido
 * todo dia precisa que a situação se leia antes da palavra.
 */
import { useState } from 'react';
import { Check, Copy, Trash2 } from 'lucide-react';
import { OURO, VERDE } from '../../leads/central/pecas';
import { ROTULO_DA_SITUACAO } from './filtrar';
import type { Situacao } from './filtrar';

/** O vermelho apagado do que não vale mais. O mesmo do erro do portão. */
export const APAGADO = '#E8938C';

/** O vermelho aceso do gesto que destrói. O mesmo da exclusão na Central. */
export const PERIGO = '#E0453F';

/** As classes dos dois botões que se repetem em toda tela. */
export const BOTAO_PRIMARIO =
  'inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition-opacity disabled:opacity-30';
export const BOTAO_BORDA =
  'inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-4 py-2 text-[13px] text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30';

/*
 * Os botões do que não tem volta. `min-h-[44px]` não é capricho: é o alvo
 * mínimo do polegar, e um gesto irreversível não pode depender de mira boa.
 */
export const BOTAO_PERIGO =
  'inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E0453F] px-4 py-2 text-[13px] font-semibold text-white transition-opacity disabled:opacity-40';
export const BOTAO_PERIGO_BORDA =
  'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#E0453F]/50 px-4 py-2 text-[13px] font-semibold text-[#E0453F] transition-colors hover:bg-[#E0453F]/10 disabled:opacity-40';
/** O "deixa pra lá" que anda sempre ao lado de um vermelho — e do mesmo tamanho. */
export const BOTAO_DESISTIR = `${BOTAO_BORDA} min-h-[44px]`;

/*
 * ─── OS RÓTULOS ─────────────────────────────────────────────────────────────
 *
 * Rótulo de campo, de coluna e de bloco: SERIFA e caixa de frase. A versão
 * anterior era caixa alta com `tracking` largo — bonita numa etiqueta, cansada
 * numa tela lida o dia inteiro, e o dono pediu o contrário em todo lugar. A
 * serifa em 11–12px fica raquítica, então o tamanho sobe junto: é a mesma
 * palavra com mais ar, não um título novo.
 */
export const ROTULO = 'font-serif text-[13px] text-white/45';
export const ROTULO_DE_CAMPO = 'font-serif text-[14px] text-white/55';
export const TITULO_DE_BLOCO = 'font-serif text-[15px] text-white/55';

const COR_DA_SITUACAO: Record<Situacao, string> = {
  pendente: 'rgba(255,255,255,0.55)',
  aberto: OURO,
  concluido: VERDE,
  revogado: APAGADO,
  expirado: APAGADO,
};

/** A pílula de situação do convite. */
export function Selo({ situacao }: { situacao: Situacao }) {
  const cor = COR_DA_SITUACAO[situacao];
  return (
    <span
      className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] leading-none"
      style={{ color: cor, borderColor: `${cor}44` }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: cor }} />
      {ROTULO_DA_SITUACAO[situacao]}
    </span>
  );
}

/** A pílula neutra — versão, número, contagem. */
export function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[12px] leading-none text-white/70">
      {children}
    </span>
  );
}

/**
 * O contador da visão geral: o rótulo em cima, o número embaixo.
 *
 * É irmão do contador da Central (`leads/central/pecas`) e existe separado por
 * UM motivo: o rótulo daqui é serifa em caixa de frase, e mexer no de lá mudaria
 * a Central de leads, que não é desta rodada. No dia em que a Central receber a
 * mesma tipografia, os dois voltam a ser um.
 */
export function Contador({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors sm:p-6">
      <p className={ROTULO}>{rotulo}</p>
      {/* Tabular para os números não dançarem quando a lista atualiza. */}
      <p className="mt-2 font-serif text-[2.6rem] leading-none tabular-nums text-white">{valor}</p>
    </div>
  );
}

/** A moldura de qualquer estado que não seja "tem conteúdo". */
export function Aviso({
  titulo,
  corpo,
  acao,
}: {
  titulo: string;
  corpo: string;
  acao?: { rotulo: string; aoClicar: () => void };
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <p className="font-serif text-[1.6rem] leading-tight text-white">{titulo}</p>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/45">{corpo}</p>
      {acao && (
        <button type="button" onClick={acao.aoClicar} className={`mt-6 ${BOTAO_BORDA}`}>
          {acao.rotulo}
        </button>
      )}
    </div>
  );
}

/** O esqueleto enquanto a lista não chega. */
export function Esqueleto({ linhas = 5 }: { linhas?: number }) {
  return (
    <div className="space-y-2 p-4" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: linhas }, (_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

/** Um campo de ficha. Ausência vira travessão — dita, não escondida. */
export function Campo({
  rotulo,
  valor,
  largo = false,
}: {
  rotulo: string;
  valor: string | null | undefined;
  largo?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 ${
        largo ? 'sm:col-span-2' : ''
      }`}
    >
      <p className={ROTULO}>{rotulo}</p>
      {/* `break-words` porque e-mail e hash são mais compridos que a coluna. */}
      <p className="mt-1 break-words text-[15px] leading-snug text-white">
        {valor != null && valor.length > 0 ? valor : <span className="text-white/25">—</span>}
      </p>
    </div>
  );
}

/** A tarja vermelha de erro. Altura reservada não: aqui ela some mesmo. */
export function Erro({ mensagem }: { mensagem: string | null }) {
  if (mensagem == null) return null;
  return (
    <p className="mt-3 rounded-xl border px-4 py-3 text-[13px]" style={{ color: APAGADO, borderColor: `${APAGADO}44` }}>
      {mensagem}
    </p>
  );
}

export type EstadoDaCopia = 'parado' | 'copiado' | 'falhou';

/**
 * Copia para a área de transferência, e é honesto quando não consegue.
 *
 * `navigator.clipboard` não existe fora de contexto seguro e pode ser negado
 * pelo navegador — quando isso acontece o chamador precisa saber, porque a
 * alternativa é a pessoa achar que copiou o link e colar o que tinha antes no
 * WhatsApp do cliente.
 */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

function textoDaCopia(estado: EstadoDaCopia, rotulo: string): string {
  switch (estado) {
    case 'copiado':
      return 'Copiado!';
    case 'falhou':
      return 'Não deu — copie à mão';
    default:
      return rotulo;
  }
}

/** O botão de copiar, com o eco de dois segundos. */
export function BotaoCopiar({
  texto,
  rotulo = 'Copiar link',
  aoCopiar,
}: {
  texto: string;
  rotulo?: string;
  aoCopiar?: () => void;
}) {
  const [estado, setEstado] = useState<EstadoDaCopia>('parado');

  const copiar = async () => {
    const deu = await copiarTexto(texto);
    setEstado(deu ? 'copiado' : 'falhou');
    if (deu && aoCopiar) aoCopiar();
    // O eco volta ao normal sozinho: um botão que fica "Copiado!" para sempre
    // deixa de dizer se a SEGUNDA cópia funcionou.
    window.setTimeout(() => setEstado('parado'), 2000);
  };

  return (
    <button type="button" onClick={() => void copiar()} className={BOTAO_PRIMARIO}>
      {estado === 'copiado' ? (
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      ) : (
        <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
      )}
      {textoDaCopia(estado, rotulo)}
    </button>
  );
}

/* ─── A EXCLUSÃO ───────────────────────────────────────────────────────────── */

/**
 * O "tem certeza?" da exclusão, em DOIS TEMPOS no mesmo lugar.
 *
 * O precedente é o da Central de leads, e a razão é a mesma: `confirm()` do
 * navegador não se estila e um modal para isto é cerimônia. O botão troca de
 * cara e cobra o segundo clique — dois cliques distantes no tempo e idênticos
 * no lugar são o que impede o duplo-clique nervoso de apagar sozinho.
 *
 * Quem manda no estado é o CHAMADOR, e não este componente: numa lista, pedir
 * exclusão precisa cancelar o "revogar mesmo" da linha ao lado, e um estado
 * escondido aqui dentro deixaria dois pedidos abertos ao mesmo tempo.
 */
export function ExcluirEmDoisTempos({
  confirmando,
  ocupado,
  rotulo = 'Excluir',
  aoPedir,
  aoConfirmar,
  aoDesistir,
}: {
  confirmando: boolean;
  ocupado: boolean;
  rotulo?: string;
  aoPedir: () => void;
  aoConfirmar: () => void;
  aoDesistir: () => void;
}) {
  if (!confirmando) {
    return (
      <button type="button" onClick={aoPedir} disabled={ocupado} className={BOTAO_PERIGO_BORDA}>
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        {rotulo}
      </button>
    );
  }
  return (
    <>
      <button type="button" onClick={aoConfirmar} disabled={ocupado} className={BOTAO_PERIGO}>
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
        {ocupado ? 'Excluindo…' : 'Excluir de vez'}
      </button>
      <button type="button" onClick={aoDesistir} disabled={ocupado} className={BOTAO_DESISTIR}>
        Cancelar
      </button>
    </>
  );
}

/* ─── OS CAMPOS DE FORMULÁRIO ──────────────────────────────────────────────── */

const CAIXA =
  'mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30';

export function CampoTexto({
  rotulo,
  valor,
  aoMudar,
  tipo = 'text',
  dica,
  problema,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  tipo?: 'text' | 'email' | 'date' | 'number';
  dica?: string;
  problema?: string;
}) {
  return (
    <label className="block">
      <span className={ROTULO_DE_CAMPO}>{rotulo}</span>
      <input
        type={tipo}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        placeholder={dica}
        className={CAIXA}
      />
      {problema != null && (
        <span className="mt-1 block text-[12px]" style={{ color: APAGADO }}>
          {problema}
        </span>
      )}
    </label>
  );
}

export function CampoLongo({
  rotulo,
  valor,
  aoMudar,
  linhas = 3,
  dica,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  linhas?: number;
  dica?: string;
}) {
  return (
    <label className="block">
      <span className={ROTULO_DE_CAMPO}>{rotulo}</span>
      <textarea
        value={valor}
        rows={linhas}
        onChange={(evento) => aoMudar(evento.target.value)}
        placeholder={dica}
        className={`${CAIXA} resize-y leading-relaxed`}
      />
    </label>
  );
}
