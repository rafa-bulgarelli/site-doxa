/**
 * ─── O DETALHE DO LEAD ───────────────────────────────────────────────────────
 *
 * O que a referência chama de "Detalhes da lead": o score em radar e barras, e
 * depois a ficha inteira em campos.
 *
 * Duas adaptações conscientes em relação à referência:
 *
 *  1. Não há "confirmar a compra". Nada aqui se vende — este painel é a caixa de
 *     entrada do próprio time, e o botão de baixo é fechar.
 *
 *  2. Os campos são os NOSSOS. A referência mostra "meta 90 dias" e "tem
 *     sócio?"; o nosso formulário nunca perguntou isso, e inventar um campo
 *     vazio para parecer com a imagem seria mentir sobre o que temos.
 */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { scoreDo, EIXOS, EXPLICACAO } from '../score';
import type { Lead } from '../tipos';
import { Barra, Chip, Estrelas, Radar, dataCompleta, quandoFoi } from './pecas';

/** Um campo da ficha. `null` vira travessão — ausência dita, não escondida. */
function Campo({ rotulo, valor }: { rotulo: string; valor: string | null | undefined }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">{rotulo}</p>
      {/* `break-words` porque e-mail e @ podem ser mais compridos que a coluna,
          e a alternativa é o texto vazando para fora do cartão. */}
      <p className="mt-1 break-words text-[15px] leading-snug text-white">
        {valor && valor.length > 0 ? valor : <span className="text-white/25">—</span>}
      </p>
    </div>
  );
}

export function Detalhe({ lead, aoFechar }: { lead: Lead; aoFechar: () => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  const { eixos, pontos, estrelas } = scoreDo(lead);

  /*
   * Escape fecha, e o foco entra na caixa.
   *
   * Sem o foco, quem navega por teclado continua no botão da linha atrás do
   * modal e tabula por uma tabela inteira que está coberta. Com ele, o próximo
   * Tab já está dentro do diálogo.
   */
  useEffect(() => {
    caixa.current?.focus({ preventScroll: true });
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar();
    };
    document.addEventListener('keydown', aoTeclar);
    // A página atrás não rola enquanto o diálogo está aberto — no celular,
    // rolar o fundo por engano é o defeito mais comum de modal.
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = antes;
    };
  }, [aoFechar]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={aoFechar}
      role="presentation"
    >
      <div
        ref={caixa}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${lead.nome}`}
        // O clique de dentro não fecha: sem isto, selecionar o WhatsApp com o
        // mouse fecha o diálogo no meio da seleção.
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-4xl rounded-2xl border border-white/[0.1] bg-doxa-surface p-5 outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-serif text-[1.8rem] leading-tight tracking-[-0.02em] text-white sm:text-[2.2rem]">
              {lead.nome}
            </h2>
            <p className="mt-1 text-[13px] text-white/45">
              {dataCompleta(lead.criado_em)} · {quandoFoi(lead.criado_em)}
            </p>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="shrink-0 rounded-full border border-white/[0.12] p-2 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip>{lead.origem}</Chip>
          <Chip>{lead.caminho === 'agencia' ? 'Quer ser agência' : 'Quer viralizar'}</Chip>
          {lead.baixado && <Chip>Baixado</Chip>}
          {lead.desqualificado && <Chip>Abaixo da faixa</Chip>}
        </div>

        {/* ── O SCORE */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[17px] font-semibold text-white">Score da lead</h3>
              <p className="mt-1 max-w-md text-[13px] leading-snug text-white/45">
                Leitura das respostas da ficha. Nada aqui é adivinhado — cada ponto sai de algo
                que a pessoa respondeu.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Estrelas quantas={estrelas} tamanho={16} />
              <span className="rounded-full border border-white/[0.12] px-3 py-1 text-[13px] tabular-nums text-white/80">
                {pontos} pts
              </span>
            </div>
          </div>

          {/* Empilha no telefone e vira duas colunas no notebook: sete barras ao
              lado de um radar de 280px não cabem em 390 de largura. */}
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
            <div className="flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <Radar eixos={eixos} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {EIXOS.map((eixo) => (
                <div key={eixo} title={EXPLICACAO[eixo]}>
                  <Barra eixo={eixo} valor={eixos[eixo]} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── A FICHA */}
        <section className="mt-4 rounded-2xl border border-white/[0.08] p-4 sm:p-6">
          <h3 className="text-[17px] font-semibold text-white">O que ele respondeu</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Campo rotulo="WhatsApp" valor={lead.whatsapp} />
            <Campo rotulo="E-mail" valor={lead.email} />
            <Campo rotulo="Instagram" valor={lead.arroba} />
            <Campo rotulo="Investimento por mês" valor={lead.investimento} />
            <Campo rotulo="Segmento" valor={lead.segmento} />
            <Campo rotulo="Faturamento atual" valor={lead.faturamento} />
            <Campo rotulo="Objetivo com os vídeos" valor={lead.objetivo} />
            <Campo rotulo="Aparece nos vídeos?" valor={lead.aparece} />
          </div>

          {/* A trava é lista e ganha a linha inteira: com cinco marcadas, uma
              coluna de metade da largura quebra cada uma em duas linhas. */}
          <div className="mt-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">
              O que trava hoje
            </p>
            {lead.trava && lead.trava.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {lead.trava.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-[15px] text-white/25">— não respondeu</p>
            )}
          </div>

          {/* Quem saiu antes da ficha é a maioria dos leads, e a Central não pode
              parecer quebrada por isso: a ausência é dita com todas as letras. */}
          {lead.segmento == null && (
            <p className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[13px] leading-snug text-white/45">
              Saiu antes de responder a ficha. O contato está completo — o que falta é o
              contexto, e ele pode ser perguntado na conversa.
            </p>
          )}
        </section>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={aoFechar}
            className="rounded-full border border-white/[0.14] px-5 py-2.5 text-[14px] text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
