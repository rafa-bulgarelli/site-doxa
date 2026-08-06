import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { FILTRO, PAGAMENTOS, RETORNO } from './config';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Passo {
  chave: 'whatsapp' | 'nome' | 'arroba';
  pergunta: string;
  dica: string;
  exemplo: string;
  tipo: 'tel' | 'text';
  /** Devolve o erro, ou `null` se estiver bom. */
  valida: (valor: string) => string | null;
  /** Formata enquanto se digita. */
  formata?: (valor: string) => string;
}

/**
 * O celular brasileiro, formatado enquanto se digita.
 *
 * A máscara existe por um motivo prático antes de estético: com ela, o campo
 * diz sozinho quantos dígitos faltam. Sem ela, a pessoa só descobre que errou
 * quando aperta o botão — e no passo em que ela está decidindo se entrega o
 * contato, ser corrigido é um bom motivo para desistir.
 */
function mascaraTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length <= 2) return digitos.length > 0 ? `(${digitos}` : '';
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

const PASSOS: readonly Passo[] = [
  {
    chave: 'whatsapp',
    pergunta: 'Qual é o seu WhatsApp?',
    dica: 'É por lá que o consultor fala com você.',
    exemplo: '(11) 98765-4321',
    tipo: 'tel',
    formata: mascaraTelefone,
    valida: (v) => {
      const digitos = v.replace(/\D/g, '');
      if (digitos.length < 10) return 'Faltam dígitos. Com DDD, por favor.';
      if (digitos.length > 11) return 'Número comprido demais.';
      return null;
    },
  },
  {
    chave: 'nome',
    pergunta: 'Como a gente te chama?',
    dica: 'Para a primeira mensagem não começar fria.',
    exemplo: 'Seu nome',
    tipo: 'text',
    valida: (v) => (v.trim().length < 2 ? 'Escreve o seu nome.' : null),
  },
  {
    chave: 'arroba',
    pergunta: 'Qual é o @ da sua empresa?',
    dica: 'A gente olha o perfil antes de conversar.',
    exemplo: '@suaempresa',
    tipo: 'text',
    valida: (v) => (v.replace(/[@\s]/g, '').length < 2 ? 'Falta o @ do perfil.' : null),
  },
];

/** O passo do pagamento e o da confirmação vêm depois das perguntas. */
const PAGAMENTO = PASSOS.length;
const PRONTO = PASSOS.length + 1;

/**
 * O formulário do painel claro: três perguntas, o pagamento e a confirmação.
 *
 * Uma pergunta por vez, e a razão é de conversão, não de efeito. Um bloco com
 * três campos abertos é uma tarefa; uma pergunta com um campo é uma resposta. A
 * pessoa se compromete com a primeira tecla, e a partir daí está terminando
 * algo que começou — que é uma força bem maior do que a de começar.
 *
 * O que já foi respondido fica visível em fichas acima, e cada ficha volta para
 * o seu passo com um clique. É o que impede a sensação de funil sem saída: dá
 * para corrigir sem recomeçar.
 *
 * PENDENTE-DONO — duas coisas ainda não existem por baixo:
 *
 * 1. O PAGAMENTO. O passo está desenhado e desligado, a pedido do dono. Quando
 *    a conta do provedor estiver de pé, o botão deste passo passa a criar a
 *    cobrança e os campos de cartão entram no lugar da lista de métodos. Nada
 *    aqui simula pagamento aprovado: a tela de confirmação fala de dados
 *    recebidos e de retorno em 24 horas, que continua verdade depois de ligado.
 * 2. O DESTINO DO LEAD. Ainda não foi decidido para onde vão as respostas, e
 *    enquanto não for, este formulário NÃO PODE IR AO AR — alguém preencheria,
 *    veria a confirmação e ninguém receberia nada.
 */
export function Formulario() {
  const [passo, setPasso] = useState(0);
  const [dados, setDados] = useState({ whatsapp: '', nome: '', arroba: '' });
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  /** Para onde a animação corre: 1 avança, -1 volta. */
  const [sentido, setSentido] = useState(1);
  const campoRef = useRef<HTMLInputElement>(null);
  const parado = useReducedMotion() === true;

  const atual = PASSOS[passo];

  // O foco segue o passo. Sem isto, cada avanço obriga a pessoa a clicar no
  // campo antes de digitar — três cliques a mais num formulário de três campos.
  useEffect(() => {
    if (atual != null) campoRef.current?.focus();
  }, [passo, atual]);

  const avancar = () => {
    if (atual == null) return;
    const problema = atual.valida(dados[atual.chave]);
    if (problema != null) {
      setErro(problema);
      return;
    }
    setErro(null);
    setSentido(1);
    setPasso((p) => p + 1);
  };

  const voltar = (destino: number) => {
    setErro(null);
    setSentido(-1);
    setPasso(destino);
  };

  const pagar = () => {
    // PENDENTE-DONO: aqui entra a criação da cobrança. Hoje só atravessa para a
    // confirmação, com a espera de propósito — para o passo ser sentido no
    // protótipo como ele vai ser sentido de verdade.
    setEnviando(true);
    window.setTimeout(() => {
      setEnviando(false);
      setSentido(1);
      setPasso(PRONTO);
    }, 900);
  };

  const desliza = parado
    ? {}
    : {
        initial: { opacity: 0, x: sentido * 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: sentido * -28 },
        transition: { duration: 0.42, ease: EASE },
      };

  return (
    <div className="w-full max-w-md">
      {/* O andamento. Três de três é curto o bastante para ser dito por extenso,
          e dizer quantos faltam é o que impede a pessoa de imaginar dez. */}
      {passo < PAGAMENTO && (
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-black/40">
            {String(passo + 1).padStart(2, '0')} / {String(PASSOS.length).padStart(2, '0')}
          </span>
          <div className="h-px flex-1 bg-black/10">
            <motion.div
              className="h-px origin-left bg-black/50"
              initial={false}
              animate={{ scaleX: (passo + 1) / PASSOS.length }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>
      )}

      {/* O que já foi dito, em fichas que voltam ao passo com um clique. */}
      {passo > 0 && passo <= PAGAMENTO && (
        <div className="mt-5 flex flex-wrap gap-2">
          {PASSOS.slice(0, Math.min(passo, PASSOS.length)).map((p, i) => (
            <motion.button
              key={p.chave}
              type="button"
              onClick={() => voltar(i)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1.5 text-[12px] text-black/60 transition-colors hover:border-black/30 hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/40"
            >
              <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />
              {dados[p.chave]}
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {atual != null && (
          <motion.div key={atual.chave} {...desliza} className="mt-7">
            <label htmlFor={`campo-${atual.chave}`} className="block">
              <span className="block font-serif text-[1.9rem] leading-[1.1] tracking-[-0.02em] text-[#0B0B0B] md:text-[2.3rem]">
                {atual.pergunta}
              </span>
              <span className="mt-2 block text-[13px] text-black/45">{atual.dica}</span>
            </label>

            {/* Linha embaixo e nada mais. Caixa com borda em superfície clara vira
                um retângulo cinza no meio do papel; a linha deixa o campo ser
                tipografia, que é o que o resto do painel é. */}
            <input
              id={`campo-${atual.chave}`}
              ref={campoRef}
              type={atual.tipo}
              inputMode={atual.tipo === 'tel' ? 'tel' : 'text'}
              autoComplete={atual.chave === 'whatsapp' ? 'tel' : atual.chave === 'nome' ? 'name' : 'off'}
              value={dados[atual.chave]}
              placeholder={atual.exemplo}
              aria-invalid={erro != null}
              aria-describedby={erro != null ? `erro-${atual.chave}` : undefined}
              onChange={(evento) => {
                const bruto = evento.target.value;
                const valor = atual.formata != null ? atual.formata(bruto) : bruto;
                setDados((d) => ({ ...d, [atual.chave]: valor }));
                if (erro != null) setErro(null);
              }}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') {
                  evento.preventDefault();
                  avancar();
                }
              }}
              className="mt-6 w-full border-b border-black/20 bg-transparent pb-3 font-serif text-[2rem] text-[#0B0B0B] outline-none transition-colors placeholder:text-black/20 focus:border-black/60 md:text-[2.6rem]"
            />

            <div className="mt-4 flex min-h-[2.75rem] items-center justify-between gap-4">
              <span id={`erro-${atual.chave}`} className="text-[13px] text-[#B04B45]" role="alert">
                {erro}
              </span>
              <button
                type="button"
                onClick={avancar}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#F4F1E8] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2"
                aria-label="Continuar"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        )}

        {passo === PAGAMENTO && (
          <motion.div key="pagamento" {...desliza} className="mt-7">
            <p className="font-serif text-[1.9rem] leading-[1.1] tracking-[-0.02em] text-[#0B0B0B] md:text-[2.3rem]">
              Falta o filtro.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.035] p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[2.6rem] leading-none text-[#0B0B0B]">
                  {FILTRO.valor}
                </span>
                <span className="text-[15px] text-black/50">{FILTRO.titulo}</span>
              </div>
              <p className="mt-3 text-[13px] leading-snug text-black/50">{FILTRO.corpo}</p>

              {/* PENDENTE-DONO: a lista de métodos ocupa o lugar em que entram os
                  campos do provedor e os botões de carteira. Aqueles não podem
                  ser redesenhados — Apple e Google mandam na aparência dos deles
                  —, e é bom que seja assim: a pessoa reconhece o botão e toca. */}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-5">
                {PAGAMENTOS.map((forma) => (
                  <span
                    key={forma}
                    className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/45"
                  >
                    {forma}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={pagar}
              disabled={enviando}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0B0B0B] text-[15px] font-medium text-[#F4F1E8] transition-transform hover:scale-[1.02] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2"
            >
              {enviando ? (
                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
              ) : (
                <>
                  Pagar {FILTRO.valor} e agendar
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => voltar(PASSOS.length - 1)}
              className="mt-4 flex items-center gap-1.5 text-[13px] text-black/40 transition-colors hover:text-[#0B0B0B] focus-visible:outline-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              voltar
            </button>
          </motion.div>
        )}

        {passo === PRONTO && (
          <motion.div
            key="pronto"
            initial={parado ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-7"
          >
            <motion.span
              initial={parado ? undefined : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B0B0B] text-[#F4F1E8]"
            >
              <Check className="h-7 w-7" strokeWidth={2} />
            </motion.span>

            {/* Nada aqui afirma que um pagamento aconteceu: a frase é sobre os
                dados terem chegado, e continua verdadeira depois que o checkout
                estiver ligado. */}
            <p className="mt-6 font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-[#0B0B0B] md:text-[2.5rem]">
              Recebemos.
            </p>
            <p className="mt-3 max-w-sm text-[15px] leading-snug text-black/55">
              {RETORNO} No WhatsApp que você deixou, {dados.whatsapp}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
