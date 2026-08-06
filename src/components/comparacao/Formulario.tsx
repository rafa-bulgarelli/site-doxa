import { useEffect, useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
// O mesmo facho do hero, apontado para dentro deste cartão. É genérico apesar da
// pasta: recebe o container e escreve a posição do ponteiro nele. Custo zero de
// bundle, e é o que faz o único elemento clicável da página responder à mão.
import { DotGridSpotlight } from '../hero/DotGridSpotlight';
import { BordaViva } from './BordaViva';
import { CampoVivo } from './CampoVivo';
import { MotionButton } from '../ui/MotionButton';
import { FILTRO, NO_AR, PAGAMENTOS, RETORNO } from './config';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * O vermelho do erro, clareado para o papel escuro.
 *
 * É o mesmo sinal que o painel claro usava, com luminosidade suficiente para se
 * ler sobre `#0D0D0D` — o tom original desaparecia no fundo do cartão, e um erro
 * que não se lê é um formulário que trava sem dizer por quê. Cor com função, que
 * é a única exceção que a regra monocromática abre.
 */
const ERRO = '#E8938C';

interface Passo {
  chave: 'nome' | 'whatsapp' | 'arroba';
  /** O nome da etapa na trilha do topo. Uma palavra, senão não é uma trilha. */
  rotulo: string;
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

/**
 * As três perguntas, e a ordem delas é decisão de conversão.
 *
 * O nome vem primeiro. A primeira pergunta é a que decide se a pessoa entra, e o
 * nome é o compromisso mais barato que existe — ninguém desiste de um formulário
 * por ter dito como se chama. O WhatsApp é o dado caro, e ele é pedido no segundo
 * passo, quando a pessoa já não está começando e sim terminando. Perguntado
 * primeiro, ele é uma catraca na porta.
 */
const PASSOS: readonly Passo[] = [
  {
    chave: 'nome',
    rotulo: 'Nome',
    pergunta: 'Como a gente te chama?',
    dica: 'Para a primeira mensagem não começar fria.',
    exemplo: 'Seu nome completo',
    tipo: 'text',
    valida: (v) => (v.trim().length < 2 ? 'Escreve o seu nome.' : null),
  },
  {
    chave: 'whatsapp',
    rotulo: 'WhatsApp',
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
    chave: 'arroba',
    rotulo: 'Perfil',
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
 * É um CARTÃO PRETO sobre o papel, e essa é a decisão que organiza todo o resto.
 * A página inteira é preta e o creme é a exceção que responde a ela; devolver o
 * preto ao pedido fecha o arco — a marca reaparece exatamente no instante do
 * compromisso, e o único elemento que precisa de clique volta a ter o contraste
 * máximo da página. Não é um elemento novo: é a mesma superfície dos cartões do
 * hero e dos painéis de "Como funciona" (`bg-doxa-surface`, dot-grid por dentro,
 * borda que clareia quando é a vez dela) aparecendo na hora certa.
 *
 * Sobre creme, sombra preta finalmente existe — sobre preto ela não existia. É
 * ela que faz o cartão ler como objeto POUSADO no papel em vez de impresso nele.
 *
 * Uma pergunta por vez, e a razão é de conversão, não de efeito. Um bloco com
 * três campos abertos é uma tarefa; uma pergunta com um campo é uma resposta. A
 * pessoa se compromete com a primeira tecla, e a partir daí está terminando algo
 * que começou — que é uma força bem maior do que a de começar.
 *
 * O que já foi respondido fica visível em fichas acima, e cada ficha volta para
 * o seu passo com um clique. É o que impede a sensação de funil sem saída: dá
 * para corrigir sem recomeçar.
 *
 * O `ref` do cartão vem de FORA porque a seção precisa da geometria dele: é nele
 * que o fio vindo do argumento aterrissa, e quem desenha o fio é o painel.
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
export function Formulario({
  cartaoRef,
  sinalPausado,
}: {
  cartaoRef: RefObject<HTMLDivElement>;
  /** Repassado à borda: quem manda no sinal é o painel, não o formulário. */
  sinalPausado: boolean;
}) {
  const [passo, setPasso] = useState(0);
  const [dados, setDados] = useState({ nome: '', whatsapp: '', arroba: '' });
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  /** Para onde a animação corre: 1 avança, -1 volta. */
  const [sentido, setSentido] = useState(1);
  const campoRef = useRef<HTMLInputElement>(null);
  const parado = useReducedMotion() === true;

  /**
   * Quando o cartão sobe.
   *
   * Ele NÃO entra junto com o painel. O painel claro gira, assenta, e só então o
   * cartão chega — ser a última coisa a aparecer é o que o torna a coisa que
   * chegou. Metade dele visível já basta como sinal: o painel entra girado, e
   * esperar por mais adiaria a entrada até depois de o giro terminar.
   */
  const naTela = useInView(cartaoRef, { amount: 0.5, once: true });

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
    <motion.div
      ref={cartaoRef}
      initial={parado ? undefined : { opacity: 0, y: 28, scale: 0.98 }}
      animate={naTela ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
      // A borda abre de 11% para 22% com a mão em cima — a mesma regra que diz
      // qual painel tem a vez em "Como funciona". Sem escala: o cartão é uma
      // superfície, não um botão, e uma superfície que cresce ao ser apontada
      // promete um clique que ela não aceita.
      //
      // `w-full` e ponto: a largura é decidida pela coluna do grid, que vale 40%
      // da tela e cresce com ela. Um `max-w` aqui seria uma segunda opinião
      // sobre o mesmo número, e a que ganha é sempre a menor.
      //
      // `cartao-pedido` é o gancho do piscar: o CSS liga a cintilação dos pontos
      // quando o ponteiro está sobre ESTE cartão. Uma classe própria, e não o
      // `group` do Tailwind — `group` sem nome também casaria com o `group-hover`
      // do botão lá dentro, e o disco dele se encheria com a mão em qualquer
      // canto do cartão, longe do botão.
      // Tres sombras, tres trabalhos. A preta longa assenta o cartao no papel.
      // A branca externa e' o halo que o descola do creme. E a branca INTERNA e'
      // a que o dono pediu: contra o preto do miolo, ela e' a unica que se ve
      // como fumaca, subindo pelas bordas para dentro. Uma so' por fora nao
      // aparece sobre papel claro, e uma so' por dentro deixa o cartao chapado
      // contra o creme.
      className="cartao-pedido relative w-full overflow-hidden rounded-3xl border border-white/[0.16] bg-doxa-surface shadow-[0_40px_100px_-40px_rgba(0,0,0,0.5),0_0_60px_-14px_rgba(255,255,255,0.28),inset_0_0_70px_-24px_rgba(255,255,255,0.22)] transition-[border-color,box-shadow] duration-500 hover:border-white/[0.3] hover:shadow-[0_52px_120px_-40px_rgba(0,0,0,0.6),0_0_80px_-12px_rgba(255,255,255,0.4),inset_0_0_80px_-20px_rgba(255,255,255,0.3)]"
    >
      {/* A 25% e não a 40%: a grade em repouso corre por baixo da pergunta e do
          campo, e ali ela é textura, não desenho. Vê-la é o defeito. */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-25" />
      <DotGridSpotlight containerRef={cartaoRef} className="is-forte" />
      {/* A luz por dentro. Um retângulo preto chapado no creme lê como buraco no
          papel; com um clarão no topo ele lê como objeto iluminado — que é o
          mesmo vocabulário do `hero-glow`, a única forma de destaque que a marca
          permite. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_55%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]" />
      {/* O sinal que chegou pelo fio continua aqui, contornando o cartão. */}
      <BordaViva alvoRef={cartaoRef} pausado={sinalPausado} />

      <div className="relative p-8 md:p-12">
        {/* O andamento. Três de três é curto o bastante para ser dito por extenso,
            e dizer quantos faltam é o que impede a pessoa de imaginar dez. */}
        {/* ── A trilha das etapas, e ela tem NOME.

            Era "01 / 03" com uma barra ao lado, e o dono leu como morto — com
            razão: uma fração informa quanto falta e não diz nada sobre o quê.
            Com os nomes à vista, a pessoa vê a tarefa inteira antes de começar
            — nome, WhatsApp, perfil — e o que ela avalia deixa de ser "quantas
            perguntas ainda vêm" e passa a ser "isso é rápido".

            Três estados, três tratamentos: a etapa da vez é a única em papel
            cheio, com o texto em preto e o mesmo halo da borda do cartão; as
            respondidas ficam com o fio verde e o visto, no verde do selo "Com
            Doxa"; as que faltam são só um contorno apagado. É a linha do tempo
            do preenchimento, e cada resposta acende um pedaço dela. */}
        {passo < PAGAMENTO && (
          <div className="flex flex-wrap items-center gap-2">
            {PASSOS.map((p, i) => {
              const feito = i < passo;
              const agora = i === passo;
              return (
                <motion.span
                  key={p.chave}
                  initial={parado ? undefined : { opacity: 0, y: -8 }}
                  animate={naTela || parado ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.35 + i * 0.09 }}
                  /* `whitespace-nowrap` e peso de fonte IGUAL nos três
                     estados. A etapa da vez tinha `font-medium`, e uma pílula
                     que engorda ao ficar ativa muda de largura — com `flex-wrap`
                     na fila, isso é capaz de empurrar a terceira para a linha de
                     baixo e mudar a altura do cartão inteiro no meio do
                     preenchimento. O destaque vem do fundo, que não ocupa
                     espaço nenhum. */
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] leading-none transition-colors duration-500 ${
                    agora
                      ? 'border-transparent bg-[#F4F1E8] text-[#0B0B0B]'
                      : feito
                        ? 'text-[#F4F1E8]'
                        : 'border-white/[0.12] text-white/30'
                  }`}
                  style={
                    agora
                      ? { boxShadow: '0 0 18px -2px rgba(255,255,255,0.55)' }
                      : feito
                        ? { borderColor: `${NO_AR}80`, background: `${NO_AR}1a` }
                        : undefined
                  }
                >
                  {feito ? (
                    <Check className="h-3 w-3 shrink-0" strokeWidth={3} style={{ color: NO_AR }} />
                  ) : (
                    <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                  )}
                  {p.rotulo}
                </motion.span>
              );
            })}
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
                className="flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 text-[12px] text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
              >
                <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                {dados[p.chave]}
              </motion.button>
            ))}
          </div>
        )}

        {/* Um piso para o corpo do cartão — piso, e não altura fixa. As três
            perguntas têm o mesmo desenho e já saem quase da mesma altura; o que
            este número impede é o cartão DESABAR num passo mais curto que os
            outros e o papel embaixo pulsar junto. Travar a altura no maior dos
            passos seria a outra ponta do mesmo erro: um vão morto no pé do
            cartão em todos os passos, para acertar um. */}
        <div className="min-h-[19rem]">
          <AnimatePresence mode="wait" initial={false}>
            {atual != null && (
              <motion.div key={atual.chave} {...desliza} className="mt-7">
                <label htmlFor={`campo-${atual.chave}`} className="block">
                  <span className="block font-serif text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-white md:text-[2.35rem]">
                    {atual.pergunta}
                  </span>
                  {/* 15px e 70% de branco, e os dois números subiram juntos por
                      um motivo só: esta linha é a que responde "por que você
                      quer isso de mim?" — a única defesa que o formulário tem
                      contra a pessoa desistir de entregar o dado. Escrita em
                      13px a 45%, ela existia sem ser lida. */}
                  <span className="mt-2 block text-[15px] text-white/70">{atual.dica}</span>
                </label>

                <CampoVivo
              id={`campo-${atual.chave}`}
              valor={dados[atual.chave]}
              exemplo={atual.exemplo}
              tipo={atual.tipo}
              autoComplete={
                atual.chave === 'whatsapp' ? 'tel' : atual.chave === 'nome' ? 'name' : 'off'
              }
              invalido={erro != null}
              descritoPor={erro != null ? `erro-${atual.chave}` : undefined}
              campoRef={campoRef}
              aoDigitar={(bruto) => {
                const valor = atual.formata != null ? atual.formata(bruto) : bruto;
                setDados((d) => ({ ...d, [atual.chave]: valor }));
                if (erro != null) setErro(null);
              }}
              aoTeclar={(evento) => {
                if (evento.key === 'Enter') {
                  evento.preventDefault();
                  avancar();
                }
              }}
            />

            {/* A linha do erro tem altura fixa. Sem isso o botão sobe e desce
                    conforme a validação fala, e ele é justamente o alvo que a
                    pessoa está mirando. */}
                <div className="mt-3 min-h-[1.5rem]">
                  <span
                    id={`erro-${atual.chave}`}
                    role="alert"
                    className="text-[13px]"
                    style={{ color: ERRO }}
                  >
                    {erro}
                  </span>
                </div>

                {/* O botão do site, e não mais um disco de 44px. A ação mais
                    importante da página não pode ser a menor coisa clicável
                    dela: aqui ela é a mesma pílula que se enche de tinta do
                    hero e da parede de prova. */}
                {/* O voltar só existe quando há para onde voltar, e entra com
                    o mesmo salto elástico da lâmina — mola de atrito baixo: ele
                    passa do tamanho, recua e para. É o gesto que a página usa
                    para dizer "isto acabou de aparecer".

                    Fora do `MotionButton`: aquele é a pílula que se enche de
                    tinta e é a ação PRINCIPAL da tela. Dois deles lado a lado
                    seriam duas ações do mesmo peso, e voltar não é. Um disco de
                    contorno ao lado de uma pílula cheia diz a hierarquia sem
                    precisar de rótulo. */}
                <div className="mt-3 flex items-center gap-3">
                  <AnimatePresence initial={false}>
                    {passo > 0 && (
                      <motion.button
                        key="voltar"
                        type="button"
                        onClick={() => voltar(passo - 1)}
                        aria-label="Voltar para a pergunta anterior"
                        initial={parado ? false : { scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.18 } }}
                        transition={
                          parado
                            ? { duration: 0.15 }
                            : {
                                opacity: { duration: 0.14 },
                                scale: { type: 'spring', stiffness: 560, damping: 12, mass: 0.6 },
                              }
                        }
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* `min-w-0` para a pílula ceder a largura do disco em vez de
                      empurrá-lo para fora da caixa. */}
                  <div className="min-w-0 flex-1">
                    <MotionButton label="Continuar" onClick={avancar} fullWidth />
                  </div>
                </div>
              </motion.div>
            )}

            {passo === PAGAMENTO && (
              <motion.div key="pagamento" {...desliza} className="mt-7">
                <p className="font-serif text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-white md:text-[2.35rem]">
                  Falta o filtro.
                </p>

                <div className="mt-6 rounded-2xl border border-white/[0.09] bg-white/[0.04] p-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-[2.4rem] leading-none text-white">
                      {FILTRO.valor}
                    </span>
                    <span className="text-[15px] text-white/50">{FILTRO.titulo}</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-snug text-white/50">{FILTRO.corpo}</p>

                  {/* PENDENTE-DONO: a lista de métodos ocupa o lugar em que entram
                      os campos do provedor e os botões de carteira. Aqueles não
                      podem ser redesenhados — Apple e Google mandam na aparência
                      dos deles —, e é bom que seja assim: a pessoa reconhece o
                      botão e toca. */}
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.09] pt-5">
                    {PAGAMENTOS.map((forma) => (
                      <span
                        key={forma}
                        className="rounded-full border border-white/[0.12] px-3 py-1 text-[12px] text-white/45"
                      >
                        {forma}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <MotionButton
                    label={`Pagar ${FILTRO.valor} e agendar`}
                    onClick={pagar}
                    busy={enviando}
                    fullWidth
                  />
                </div>

                <button
                  type="button"
                  onClick={() => voltar(PASSOS.length - 1)}
                  className="mt-4 flex items-center gap-1.5 rounded px-1 py-0.5 text-[13px] text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
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
                {/* Creme sobre preto: no cartão, o disco da confirmação é a única
                    coisa em papel cheio, e é ele que devolve a cor do painel
                    para dentro da caixa que respondeu. */}
                <motion.span
                  initial={parado ? undefined : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F1E8] text-[#0B0B0B]"
                >
                  <Check className="h-7 w-7" strokeWidth={2} />
                </motion.span>

                {/* Nada aqui afirma que um pagamento aconteceu: a frase é sobre os
                    dados terem chegado, e continua verdadeira depois que o checkout
                    estiver ligado. */}
                <p className="mt-6 font-serif text-[1.9rem] leading-[1.1] tracking-[-0.02em] text-[#F4F1E8] md:text-[2.3rem]">
                  Recebemos.
                </p>
                <p className="mt-3 max-w-sm text-[15px] leading-snug text-white/55">
                  {RETORNO} No WhatsApp que você deixou, {dados.whatsapp}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
