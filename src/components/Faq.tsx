import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { DotGridSpotlight } from './hero/DotGridSpotlight';
import { CampoPergunta } from './faq/CampoPergunta';
import { Revela } from './faq/Revela';
import { encontra } from './faq/busca';
import { ABERTURA, DUVIDAS, SEM_RESPOSTA, type Duvida } from './faq/config';
import { MotionButton } from './ui/MotionButton';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Quanto o sinal leva para descer do campo até a resposta, em milissegundos.
 *
 * Casado com a duração de `.pulso-descida` no CSS: a resposta nasce no instante
 * em que o sinal termina de chegar. Se os dois números divergirem, ou o texto
 * aparece antes de a linha chegar nele (e a linha vira enfeite), ou fica um vão
 * de nada entre os dois (e a linha vira atraso).
 *
 * NÃO é latência fingida: não há nada sendo processado atrás disto, e o número é
 * o tempo de um gesto, não de uma espera. É o que torna a causa visível — a
 * mesma razão de uma porta mostrar que foi a maçaneta que a abriu.
 */
const DESCIDA = 420;

/**
 * A pergunta digitada, com a primeira letra em caixa alta.
 *
 * Quem escreve num campo de conversa escreve em minúscula, e aqui a pergunta é
 * exibida em serifa de 1,9rem — do tamanho de um título. Um título que começa
 * minúsculo lê como erro de quem fez a página, não como escolha de quem digitou.
 * Só a primeira letra: o resto é o texto da pessoa e não se mexe nele.
 */
function comoTitulo(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Uma troca: o que foi perguntado e o que foi respondido. */
interface Troca {
  id: number;
  pergunta: string;
  paragrafos: readonly string[];
  /** A resposta é o desvio para o consultor, e não uma resposta de fato. */
  escape: boolean;
}

/**
 * O FAQ, em forma de conversa — e as respostas são escritas, não geradas.
 *
 * A forma é de chat porque a página inteira fala de uma máquina que trabalha
 * para quem está lendo, e um acordeão de perguntas frequentes é o objeto mais
 * genérico da internet. O MOTOR não é de chat: cada resposta daqui foi escrita
 * pelo dono e mora em `faq/config.ts`. O que o campo faz é achar qual delas
 * responde ao que foi digitado — e dizer que não sabe quando nenhuma responde.
 *
 * Dizer que não sabe é a decisão mais importante desta seção. Esta página
 * promete um milhão de views ou o dinheiro de volta; um gerador solto falando de
 * prazo, escopo e reembolso acerta quase sempre e, no dia em que erra, publicou
 * por escrito uma promessa que a empresa passa a dever. Quem pergunta o que a
 * página não sabe cai no consultor, que é para onde tudo aqui aponta de
 * qualquer forma.
 *
 * E o campo não se anuncia como inteligência artificial em lugar nenhum — nem no
 * título, nem no rótulo, nem no exemplo do campo. Parecer um modelo e ser uma
 * busca seria mentir sobre a única coisa que esta seção existe para fazer:
 * responder direito.
 *
 * ─── O DESENHO ───────────────────────────────────────────────────────────────
 *
 * O campo fica EM CIMA e as respostas descem embaixo dele, ao contrário de um
 * chat. Num chat as mensagens empurram o campo para baixo, e numa página que
 * rola isso obriga a pessoa a caçar o campo de novo a cada pergunta. Aqui ele
 * não sai do lugar: a resposta aparece exatamente onde o olho já estava, e a
 * mais nova fica sempre em cima, sem ninguém precisar rolar para lê-la.
 */
export function Faq() {
  const parado = useReducedMotion() === true;
  const secaoRef = useRef<HTMLElement>(null);
  const naTela = useInView(secaoRef, { amount: 0.2, once: true });

  const [rascunho, setRascunho] = useState('');
  const [trocas, setTrocas] = useState<readonly Troca[]>([]);
  // Contador em vez do tamanho da lista: a chave do React tem de ser única para
  // sempre, e um índice se repete assim que a lista muda de forma.
  const proximoId = useRef(0);

  /** Quantos sinais estão descendo agora. Contador, e não booleano: duas
      perguntas seguidas não podem apagar o fio uma da outra. */
  const [descendo, setDescendo] = useState(0);

  const responder = (pergunta: string, duvida: Duvida | null) => {
    const achada = duvida ?? encontra(pergunta, DUVIDAS);
    const nova = {
      id: proximoId.current++,
      pergunta,
      paragrafos: achada?.resposta ?? [SEM_RESPOSTA.titulo, SEM_RESPOSTA.corpo],
      escape: achada == null,
    };

    if (parado) {
      setTrocas((atuais) => [nova, ...atuais]);
      return;
    }

    setDescendo((n) => n + 1);
    window.setTimeout(() => {
      setTrocas((atuais) => [nova, ...atuais]);
      setDescendo((n) => n - 1);
    }, DESCIDA);
  };

  const enviar = () => {
    const pergunta = rascunho.trim();
    if (pergunta.length === 0) return;
    setRascunho('');
    responder(pergunta, null);
  };

  // Os atalhos somem conforme são usados: um botão que devolve a resposta que já
  // está na tela é um botão que não faz nada.
  const respondidas = new Set(trocas.map((t) => t.pergunta));
  const atalhos = DUVIDAS.filter((d) => !respondidas.has(d.pergunta));

  const entrada = parado
    ? {}
    : {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.7 },
      };

  return (
    <section
      ref={secaoRef}
      id="faq"
      className="relative overflow-hidden bg-black px-5 py-24 md:px-10 md:py-32"
    >
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" />
      {/* O facho que acende os pontos sob a mão — o mesmo do hero e do cartão do
          pedido. Esta seção era a única da página que não reagia ao ponteiro, e
          era boa parte do motivo de ela parecer morta: não faltava efeito, faltava
          a página INTEIRA falando a mesma língua aqui dentro. */}
      <DotGridSpotlight containerRef={secaoRef} />

      <div className="relative mx-auto w-full max-w-3xl">
        <motion.div
          initial={parado ? undefined : { opacity: 0, y: 16 }}
          animate={naTela ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* O rótulo com o LED, e não mais uma palavra cinza sozinha.
              É o mesmo ponto que pulsa nos selos "Sem Doxa" / "Com Doxa": núcleo
              aceso com brilho próprio e dois anéis defasados, sempre um nascendo
              enquanto o outro apaga. Lá ele diz que o sistema está no ar; aqui
              diz que tem alguém do outro lado da pergunta. Em creme, porque a
              cor de estado é da seção de comparação e esta não tem estado. */}
          <span className="inline-flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
              {['selo-anel', 'selo-anel selo-anel-tardio'].map((classe) => (
                <span
                  key={classe}
                  className={`absolute inline-flex h-full w-full rounded-full bg-[#F4F1E8] ${classe}`}
                />
              ))}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F4F1E8] shadow-[0_0_10px_#F4F1E8,0_0_3px_#F4F1E8]" />
            </span>
            <span className="text-[12px] font-medium tracking-[0.06em] text-white/60">
              {ABERTURA.rotulo}
            </span>
          </span>
          <h2 className="mt-4 font-serif text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-[#F4F1E8] md:text-[3.6rem]">
            {ABERTURA.titulo}
          </h2>
          <p className="mt-3 text-[15px] text-white/50">{ABERTURA.dica}</p>
        </motion.div>

        <motion.div
          initial={parado ? undefined : { opacity: 0, y: 16 }}
          animate={naTela ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mt-8"
        >
          <CampoPergunta
            valor={rascunho}
            /* As perguntas de verdade, na ordem do arquivo. O campo passa o
               tempo todo dizendo o que ele sabe responder — e as seis frases
               que ele escreve são exatamente as seis que têm resposta. */
            exemplos={[ABERTURA.exemplo, ...DUVIDAS.map((d) => d.pergunta)]}
            aoDigitar={setRascunho}
            aoEnviar={enviar}
          />
        </motion.div>

        {/* Os atalhos. São as perguntas de verdade, com o rótulo curto — quem
            clica não precisa formular nada, e quem prefere escrever tem o campo
            logo acima. */}
        {atalhos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {atalhos.map((duvida, i) => (
                <motion.button
                  key={duvida.chave}
                  type="button"
                  onClick={() => responder(duvida.pergunta, duvida)}
                  layout={!parado}
                  initial={parado ? undefined : { opacity: 0, y: 8 }}
                  animate={naTela || trocas.length > 0 ? { opacity: 1, y: 0 } : undefined}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.2 + i * 0.05 }}
                  className="rounded-full border border-white/[0.14] bg-white/[0.03] px-4 py-2 text-[13px] text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  {duvida.atalho}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/*
         * A DESCIDA: o sinal levando a pergunta até onde a resposta nasce.
         *
         * É a gramática do site aplicada ao FAQ. No hero, uma foto e uma voz
         * correm por um fio até o vídeo pronto; na comparação, o argumento corre
         * do cartão do "falta você" até o formulário. Aqui a pergunta corre até
         * a resposta — e é por isso que o texto enviado se desfaz subindo no
         * campo logo acima: as duas animações são o mesmo gesto contado em dois
         * pedaços.
         *
         * O fio ocupa altura real enquanto existe, e não é absoluto: absoluto,
         * ele passaria por cima da primeira resposta em vez de abrir caminho
         * para ela. Some quando o sinal chega, e o que estava embaixo sobe pelo
         * `layout` — o mesmo mecanismo da varrida do botão de limpar.
         */}
        <AnimatePresence>
          {descendo > 0 && (
            <motion.div
              key="descida"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 44 }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.16, ease: EASE }}
              className="mt-6 overflow-hidden"
              aria-hidden
            >
              <svg className="h-11 w-full" viewBox="0 0 4 44" fill="none" preserveAspectRatio="none">
                {/* O trilho, fraco: sem ele o pulso corre no vazio e não se lê
                    como uma linha sendo percorrida. */}
                <path d="M 2 0 L 2 44" stroke="rgba(255,255,255,0.10)" strokeWidth={2} />
                <path
                  d="M 2 0 L 2 44"
                  pathLength={1}
                  className="pulso pulso-descida"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/*
         * A barra de limpar, e ela só existe quando há o que limpar.
         *
         * O dono viu o defeito de uso: cada pergunta empilha uma resposta e a
         * seção só cresce — quem faz cinco perguntas termina com uma página de
         * texto embaixo do campo. Limpar aqui não destrói nada, e é por isso que
         * é seguro: as respostas voltam com UM clique, porque os atalhos que
         * tinham sumido reaparecem no mesmo gesto. O que se apaga é o histórico
         * da sessão, não a informação.
         *
         * A contagem à esquerda existe para o botão ter sujeito. "Limpar"
         * sozinho não diz o que vai embora; "3 respostas · Limpar" diz.
         */}
        <AnimatePresence initial={false}>
          {trocas.length > 0 && (
            <motion.div
              key="barra"
              layout={!parado}
              initial={parado ? undefined : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-10 flex items-center justify-between border-b border-white/[0.08] pb-3"
            >
              <span className="text-[13px] text-white/35">
                {trocas.length} {trocas.length === 1 ? 'resposta' : 'respostas'}
              </span>

              <button
                type="button"
                onClick={() => setTrocas([])}
                className="group flex items-center gap-1.5 rounded-full border border-white/[0.14] py-1.5 pl-3 pr-3.5 text-[13px] text-white/50 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {/* O X gira meia volta com a mão em cima. É o único movimento
                    do botão, e ele antecipa o que o clique faz: alguma coisa
                    vai ser desfeita. */}
                <X
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none"
                  strokeWidth={2}
                />
                Limpar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* As respostas, a mais nova em cima. */}
        <div className="mt-8 flex flex-col gap-8">
          <AnimatePresence initial={false}>
            {trocas.map((troca, i) => (
              <motion.div
                key={troca.id}
                layout={!parado}
                {...entrada}
                /*
                 * A saída é em cascata, de cima para baixo, e não em bloco.
                 *
                 * Todas somem no mesmo clique — se saíssem juntas, a seção
                 * inteira piscaria e o olho não teria o que seguir. Com seis
                 * centésimos entre uma e outra, o que se vê é uma varrida: a
                 * pilha é levantada de cima, e o pé da página sobe atrás dela.
                 * O `layout` é quem faz esse "atrás dela" acontecer sem
                 * ninguém animar altura na mão.
                 */
                exit={
                  parado
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: -16,
                        scale: 0.97,
                        transition: { duration: 0.3, ease: EASE, delay: i * 0.06 },
                      }
                }
              >
                {/* A pergunta fica à vista junto da resposta: sem ela, três
                    respostas empilhadas viram três parágrafos sobre nada. */}
                <p className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-[#F4F1E8] md:text-[1.9rem]">
                  {comoTitulo(troca.pergunta)}
                </p>

                <div className="mt-3 border-l border-white/[0.14] pl-5">
                  {troca.paragrafos.map((paragrafo, i) => (
                    <p
                      key={paragrafo}
                      className={`text-[15px] leading-relaxed text-white/70 md:text-base ${
                        i > 0 ? 'mt-3' : ''
                      }`}
                    >
                      {/* O segundo parágrafo começa depois do primeiro, e não
                          junto: o atraso é o tempo de ler o de cima. Sem ele os
                          dois se montam ao mesmo tempo e o efeito vira ruído. */}
                      <Revela texto={paragrafo} atraso={i * 0.24} parado={parado} />
                    </p>
                  ))}

                  {troca.escape && (
                    <div className="mt-6">
                      <MotionButton label={SEM_RESPOSTA.acao} href="#pedido" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/*
       * As perguntas e as respostas também em dado estruturado.
       *
       * O que o Google indexa é o que está no HTML, e aqui as respostas só
       * entram no documento depois de um clique — sem isto, uma seção inteira de
       * conteúdo que responde exatamente o que as pessoas pesquisam seria
       * invisível para busca. É a mesma fonte da tela, montada do mesmo array,
       * então as duas não têm como divergir.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: DUVIDAS.map((duvida) => ({
              '@type': 'Question',
              name: duvida.pergunta,
              acceptedAnswer: { '@type': 'Answer', text: duvida.resposta.join(' ') },
            })),
          }),
        }}
      />
    </section>
  );
}
