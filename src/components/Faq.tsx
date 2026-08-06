import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { CampoPergunta } from './faq/CampoPergunta';
import { encontra } from './faq/busca';
import { ABERTURA, DUVIDAS, SEM_RESPOSTA, type Duvida } from './faq/config';
import { MotionButton } from './ui/MotionButton';

const EASE = [0.16, 1, 0.3, 1] as const;

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

  const responder = (pergunta: string, duvida: Duvida | null) => {
    const achada = duvida ?? encontra(pergunta, DUVIDAS);
    setTrocas((atuais) => [
      {
        id: proximoId.current++,
        pergunta,
        paragrafos: achada?.resposta ?? [SEM_RESPOSTA.titulo, SEM_RESPOSTA.corpo],
        escape: achada == null,
      },
      ...atuais,
    ]);
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

      <div className="relative mx-auto w-full max-w-3xl">
        <motion.div
          initial={parado ? undefined : { opacity: 0, y: 16 }}
          animate={naTela ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="text-[12px] font-medium tracking-[0.06em] text-white/50">
            {ABERTURA.rotulo}
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
            exemplo={ABERTURA.exemplo}
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

        {/* As respostas, a mais nova em cima. */}
        <div className="mt-10 flex flex-col gap-8">
          <AnimatePresence initial={false}>
            {trocas.map((troca) => (
              <motion.div key={troca.id} layout={!parado} {...entrada}>
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
                      {paragrafo}
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
