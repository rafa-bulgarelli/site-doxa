import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Bolinhas, type Ponto } from './faq/Bolinhas';
import { CampoPergunta, MINIMA } from './faq/CampoPergunta';
import { Descida, VIAGEM } from './faq/Descida';
import { Revela } from './faq/Revela';
import { encontra } from './faq/busca';
import { ABERTURA, DUVIDAS, SEM_RESPOSTA, type Duvida } from './faq/config';
import { CORES, SEM_COR, corDaDuvida } from './faq/cores';
import { MotionButton } from './ui/MotionButton';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Quanto esperar para a resposta nascer, em milissegundos.
 *
 * Lido da própria descida, e não escrito de novo aqui: a resposta tem de
 * aparecer no instante em que o sinal termina de chegar. Com dois números
 * separados, um dia eles divergem — e então ou o texto aparece antes de a linha
 * chegar nele (a linha vira enfeite), ou sobra um vão de nada entre os dois (a
 * linha vira atraso).
 *
 * NÃO é latência fingida: não há nada sendo processado atrás disto, e o número é
 * o tempo de um gesto, não de uma espera. É o que torna a causa visível — a
 * mesma razão de uma porta mostrar que foi a maçaneta que a abriu.
 *
 * O MESMO número comanda a abertura da coluna de respostas, logo abaixo. Na
 * primeira pergunta não há sinal nenhum no desktop: o gesto é o painel se
 * abrindo, e a resposta nasce quando ele termina de abrir. Um só valor para as
 * duas coisas é o que garante que nunca haja espera sem causa na tela.
 */
const DESCIDA = VIAGEM * 1000;

/**
 * A faixa da seção antes e depois da primeira pergunta.
 *
 * Fechada ela é a coluna centrada de sempre: sem resposta nenhuma na tela, uma
 * caixa de pergunta esticada por 1.400 pixels não tem o que fazer com eles — e
 * o campo, que é o único objeto da seção, ficaria com a proporção de um rodapé.
 * Aberta ela vai para `max-w-screen-2xl`, que é a MESMA faixa da comparação e do
 * "como funciona": com as duas colunas em cena, a seção precisa de toda a
 * largura da página, e passa a alinhar com o resto dela.
 */
const FECHADA = '48rem';
const ABERTA = '96rem';

/** A cadência da abertura — a mesma do resto do site. */
const TRANSICAO = {
  transitionDuration: `${DESCIDA}ms`,
  transitionTimingFunction: `cubic-bezier(${EASE.join(',')})`,
} as const;

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
  /** A mesma que o ponto desta dúvida tem no cabeçalho — é o que liga os dois. */
  cor: string;
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
 * ─── O DESENHO: CABEÇALHO EM CIMA, DUAS COLUNAS EMBAIXO ──────────────────────
 *
 * Fechada, a seção é a coluna de 48rem CENTRADA que sempre foi: um campo sozinho
 * não tem o que fazer com a largura da página. Na primeira pergunta ela vai para
 * `max-w-screen-2xl` — a mesma faixa da comparação e do "como funciona" —, e é
 * só a partir daí que o rótulo, o título e o campo passam a nascer na MESMA
 * linha vertical dos títulos das outras seções. O alinhamento com a página é
 * consequência de haver duas colunas, não um estado permanente.
 *
 * O cabeçalho fica FORA do grid, em largura total, e isso não é arranjo visual —
 * é o que faz o sinal ter para onde ir. Com o título dentro da coluna esquerda,
 * o topo da coluna de respostas caía na altura do rótulo e o campo ficava
 * duzentos pixels abaixo dele: o risco saía do campo, atravessava na altura
 * errada e lia como um traço boiando. Com o cabeçalho em cima, o topo das duas
 * colunas é o mesmo, o campo é a primeira coisa da esquerda e a resposta é a
 * primeira coisa da direita — o sinal corre reto entre os dois.
 *
 * Fechada, a coluna de respostas tem largura zero e o campo ocupa a faixa
 * inteira. Na PRIMEIRA pergunta ela abre para `minmax(32rem, 44%)` — a mesma
 * proporção que a comparação usa para o cartão do pedido — e a divisória se
 * desenha de cima para baixo entre as duas.
 *
 * Isto resolve o defeito que o empilhamento tinha e que nenhuma dose de espaço
 * consertava: a resposta empurrava os atalhos para longe e cada nova pergunta
 * afundava a anterior, então ler a terceira resposta custava rolar por cima das
 * duas primeiras. Separadas, as duas coisas param de disputar o mesmo eixo — o
 * campo fica GRUDADO no topo enquanto se lê (`sticky`), e perguntar de novo não
 * exige caçar o campo de volta.
 *
 * A divisão só existe a partir de `lg`. Abaixo disso não há largura para duas
 * colunas de texto, e a seção continua sendo o que sempre foi: campo em cima,
 * respostas embaixo, a mais nova primeiro.
 *
 * `overflow-x-clip` e não `overflow-hidden`: `hidden` faz da seção um contêiner
 * de rolagem, e um `sticky` lá dentro passa a grudar num box que não rola — ou
 * seja, não gruda. `clip` corta o que vazar na horizontal sem criar contêiner
 * nenhum, que é exatamente o que se queria das duas vezes.
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

  /** Se a coluna de respostas já está aberta. */
  const [aberto, setAberto] = useState(false);
  /** Se ela está abrindo AGORA — dura o tempo de uma travessia. */
  const [abrindo, setAbrindo] = useState(false);
  /** O relógio que devolve a seção à coluna única depois de limpar. */
  const fechamento = useRef<number | undefined>(undefined);

  /** Quantos sinais estão correndo agora. Contador, e não booleano: duas
      perguntas seguidas não podem apagar o fio uma da outra. */
  const [sinais, setSinais] = useState(0);

  const responder = (pergunta: string, duvida: Duvida | null) => {
    const achada = duvida ?? encontra(pergunta, DUVIDAS);
    const nova = {
      id: proximoId.current++,
      pergunta,
      paragrafos: achada?.resposta ?? [SEM_RESPOSTA.titulo, SEM_RESPOSTA.corpo],
      escape: achada == null,
      // Pela POSIÇÃO da dúvida no arquivo, e não por uma cor guardada nela: a
      // ordem das seis é o arco do anel, e é ela que decide qual tom cada uma
      // recebe. Quem não foi achada fica com o creme do consultor.
      cor: achada == null ? SEM_COR : corDaDuvida(DUVIDAS.indexOf(achada)),
    };

    // Perguntar durante o fechamento cancela o fechamento: sem isto, a coluna
    // encolheria no meio da resposta nova por causa de um clique já desfeito.
    window.clearTimeout(fechamento.current);
    const primeira = !aberto;
    setAberto(true);

    if (parado) {
      setTrocas((atuais) => [nova, ...atuais]);
      return;
    }

    setSinais((n) => n + 1);
    if (primeira) setAbrindo(true);
    window.setTimeout(() => {
      setTrocas((atuais) => [nova, ...atuais]);
      setSinais((n) => n - 1);
      if (primeira) setAbrindo(false);
    }, DESCIDA);
  };

  const enviar = () => {
    const pergunta = rascunho.trim();
    if (pergunta.length === 0) return;
    setRascunho('');
    responder(pergunta, null);
  };

  /*
   * Limpar esvazia agora e fecha DEPOIS.
   *
   * As respostas saem em cascata, e a coluna que as segura não pode encolher por
   * baixo delas enquanto isso — o texto se reflui em duas linhas a menos no meio
   * da própria saída, e o que era uma varrida vira um solavanco. Fechar um
   * tempo de travessia mais tarde deixa a pilha sair inteira na largura em que
   * ela estava, e só então a seção se recompõe.
   */
  const limpar = () => {
    setTrocas([]);
    window.clearTimeout(fechamento.current);
    fechamento.current = window.setTimeout(() => setAberto(false), parado ? 0 : DESCIDA);
  };

  // Os atalhos somem conforme são usados: um botão que devolve a resposta que já
  // está na tela é um botão que não faz nada.
  const respondidas = new Set(trocas.map((t) => t.pergunta));
  const atalhos = DUVIDAS.filter((d) => !respondidas.has(d.pergunta));
  const cobertas = DUVIDAS.length - atalhos.length;

  /* Os pontos do cabeçalho, na ordem DO ARQUIVO e não na ordem em que foram
     perguntados: é essa ordem que faz o âmbar vir sempre antes do coral,
     independentemente de por onde a pessoa começou. Os pontos se acumulam da
     esquerda para a direita como uma régua que se preenche, e não como um
     histórico embaralhado. */
  const lidas: readonly Ponto[] = DUVIDAS.map((duvida, i) => ({ duvida, i }))
    .filter(({ duvida }) => respondidas.has(duvida.pergunta))
    .map(({ duvida, i }) => ({ chave: duvida.chave, cor: corDaDuvida(i) }));

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
      className="relative overflow-x-clip bg-black px-5 py-24 md:px-10 md:py-32"
    >
      {/* SEM GRADE E SEM FACHO no fundo, a pedido do dono, e a razão é o que
          existe atrás deles: nada. Nas outras seções a textura corre por baixo
          de cartões, painéis e imagens, e o facho é uma luz passando SOB alguma
          coisa. Aqui o fundo é preto liso do começo ao fim — a mesma luz vira
          uma mancha clara boiando sozinha, e a grade parada vira sujeira na
          tela. A textura da seção passa a ser só a do campo, que é uma caixa e
          se comporta como as outras caixas do site. */}

      <div
        className="relative mx-auto w-full transition-[max-width] motion-reduce:transition-none"
        style={{ ...TRANSICAO, maxWidth: aberto ? ABERTA : FECHADA }}
      >
        {/* ─── O CABEÇALHO ────────────────────────────────────────────────── */}
        <motion.div
          initial={parado ? undefined : { opacity: 0, y: 16 }}
          animate={naTela ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* O rótulo, em SERIFA e aceso.
              Saiu daqui o ponto que pulsava: um LED em loop eterno num fundo
              preto liso é movimento sem informação, e o dono viu isso antes de
              qualquer argumento. E saiu também o "01 de 06" que o substituiu:
              dois algarismos pedem para ser lidos e comparados, enquanto seis
              pontos dizem o total num relance.

              A serifa é a do site — a mesma dos títulos —, e não a sans dos
              rótulos das outras seções. É o que tira "FAQ" da categoria de
              etiqueta e o põe na de nome próprio da seção. Em `texto-aceso`, o
              brilho forte: no `fraco` ele sumia contra o preto, que foi
              exatamente a reclamação. */}
          <span className="flex items-center gap-4">
            <span className="texto-aceso font-serif text-[19px] uppercase leading-none tracking-[0.2em] text-[#F4F1E8]">
              {ABERTURA.rotulo}
            </span>
            <Bolinhas pontos={lidas} parado={parado} />
          </span>

          {/* A barra, que é o mesmo progresso em forma de régua. Ela se estende
              uma vez quando a seção entra na tela e depois só é PREENCHIDA, a
              cada resposta lida — o gradiente por baixo é fixo em 13rem, então
              o que cresce revela as cores na ordem em que os pontos acendem, em
              vez de espremer as seis dentro do pedaço já ganho. */}
          <motion.div
            aria-hidden
            className="mt-3.5 h-[3px] w-full max-w-[13rem] origin-left overflow-hidden rounded-full bg-white/[0.10]"
            initial={parado ? undefined : { scaleX: 0 }}
            animate={naTela ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundImage: `linear-gradient(90deg, ${CORES.join(', ')})`,
                backgroundSize: '13rem 100%',
              }}
              initial={false}
              animate={{ width: `${(cobertas / DUVIDAS.length) * 100}%` }}
              transition={parado ? { duration: 0 } : { duration: 0.55, ease: EASE }}
            />
          </motion.div>

          <h2 className="mt-5 font-serif text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-[#F4F1E8] md:text-[3.6rem]">
            {ABERTURA.titulo}
          </h2>
          <p className="mt-3 text-[15px] text-white/50">{ABERTURA.dica}</p>
        </motion.div>

        {/* ─── AS DUAS COLUNAS ─────────────────────────────────────────────
         *
         * As colunas moram no `style` de propósito: `grid-template-columns` só
         * vale onde o elemento é grid, e ele só é grid em `lg`. Assim o mesmo
         * objeto descreve os dois estados sem quatro classes condicionais.
         *
         * O vão NÃO é `gap`: é recuo das duas colunas (`pr-16` e `pl-16`) com a
         * divisória no meio. Com gap, a divisória teria de ser um absoluto solto
         * por cima do grid, posicionado por uma conta em `calc` que só se manteria
         * certa enquanto ninguém mexesse nas frações. Como recuo, ela é a borda
         * de um elemento que já está no lugar certo — e o sinal tem exatamente
         * meio vão para atravessar, que é o `VAO` que ele já conhece.
         */}
        <div
          className="mt-10 transition-[grid-template-columns] motion-reduce:transition-none lg:mt-14 lg:grid"
          style={{
            ...TRANSICAO,
            gridTemplateColumns: aberto
              ? 'minmax(0, 1fr) minmax(0, 44%)'
              : 'minmax(0, 1fr) minmax(0, 0fr)',
          }}
        >
          {/* ─── A COLUNA DA PERGUNTA ─────────────────────────────────────── */}
          <div
            className={`relative transition-[padding] motion-reduce:transition-none lg:sticky lg:top-24 lg:self-start ${
              aberto ? 'lg:pr-16' : 'lg:pr-0'
            }`}
            style={TRANSICAO}
          >
            {/* O sinal deitado mora AQUI, e não do outro lado: ele sai do campo,
                e é da borda do campo que ele tem de partir. Na primeira pergunta
                o desktop não ganha sinal — o gesto é o painel se abrindo, e um
                risco atravessando um vão que ainda está nascendo correria por
                cima de si mesmo. */}
            <AnimatePresence>
              {sinais > 0 && !abrindo && (
                <Descida key="atravessa" sentido="direita" centro={MINIMA / 2} />
              )}
            </AnimatePresence>

            <motion.div
              initial={parado ? undefined : { opacity: 0, y: 16 }}
              animate={naTela ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
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
                clica não precisa formular nada, e quem prefere escrever tem o
                campo logo acima. */}
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
          </div>

          {/* ─── A COLUNA DAS RESPOSTAS ───────────────────────────────────────
           *
           * `min-w-0` impede que uma palavra longa estoure a coluna e empurre o
           * grid inteiro; `relative` é o poste da divisória e da descida.
           *
           * A margem de cima só existe empilhado. Dividido, o topo desta coluna
           * bate com o topo do campo — é esse alinhamento que faz as duas lerem
           * como duas metades da mesma coisa, e é o que dá ao sinal uma linha
           * reta para percorrer.
           */}
          <div
            className={`relative min-w-0 transition-[padding] motion-reduce:transition-none ${
              aberto ? 'mt-12 lg:mt-0 lg:pl-16' : 'lg:pl-0'
            }`}
            style={TRANSICAO}
          >
            {/* A divisória. Ela se DESENHA de cima para baixo quando o painel
                abre, em vez de aparecer inteira: uma linha que surge pronta lê
                como parte do fundo que sempre esteve ali, e esta linha é
                consequência de uma pergunta. `inset-y-0` a faz correr a altura
                cheia da coluna, que o grid estica até a mais alta das duas. */}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0 hidden w-px origin-top bg-white/[0.10] lg:block"
              initial={false}
              animate={{ scaleY: aberto ? 1 : 0 }}
              transition={{ duration: parado ? 0 : DESCIDA / 1000, ease: EASE }}
            />

            <AnimatePresence>
              {sinais > 0 && <Descida key="desce" sentido="baixo" />}
            </AnimatePresence>

            {/*
             * A barra de limpar, e ela só existe quando há o que limpar.
             *
             * O dono viu o defeito de uso: cada pergunta empilha uma resposta e a
             * seção só cresce — quem faz cinco perguntas termina com uma página
             * de texto embaixo do campo. Limpar aqui não destrói nada, e é por
             * isso que é seguro: as respostas voltam com UM clique, porque os
             * atalhos que tinham sumido reaparecem no mesmo gesto. O que se apaga
             * é o histórico da sessão, não a informação.
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
                  className="flex items-center justify-between border-b border-white/[0.08] pb-3"
                >
                  {/* Só a contagem aqui. Os pontos desceram para junto de cada
                      pergunta, que é onde o dono os quis: empilhados nesta barra
                      eles eram um resumo de uma lista que já está logo abaixo —
                      ao lado da pergunta, cada um marca a SUA. O texto fica
                      porque o botão precisa de sujeito: "Limpar" sozinho não diz
                      o que vai embora. */}
                  <span className="text-[13px] text-white/35">
                    {trocas.length} {trocas.length === 1 ? 'resposta' : 'respostas'}
                  </span>

                  {/* Branco e cheio, e é o único botão sólido desta seção. Ele
                      não disputa com o de enviar: quando este existe, o campo
                      já foi usado, e a ação que sobra na tela é desfazer. */}
                  <button
                    type="button"
                    onClick={limpar}
                    className="group flex shrink-0 items-center gap-1.5 rounded-full bg-[#F4F1E8] py-1.5 pl-3 pr-3.5 text-[13px] font-medium text-[#0B0B0B] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
                        respostas empilhadas viram três parágrafos sobre nada.

                        E o ponto vem com ela, na cor daquela dúvida — o mesmo
                        que acendeu lá em cima quando a resposta chegou. É o que
                        liga os dois sem legenda nenhuma.

                        `items-start` com a margem em `em`, e não `items-center`:
                        centrado, o ponto de uma pergunta que quebra em duas
                        linhas escorregaria para o meio das duas. Em `em` ele
                        acompanha o corpo do título, que muda de 1,5 para 1,9rem
                        em `md` — um valor em pixels ficaria certo num
                        breakpoint e errado no outro. */}
                    <div className="flex items-start gap-3">
                      <span className="mt-[0.42em] shrink-0">
                        <Bolinhas
                          pontos={[{ chave: String(troca.id), cor: troca.cor }]}
                          parado={parado}
                        />
                      </span>
                      <p className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-[#F4F1E8] md:text-[1.9rem]">
                        {comoTitulo(troca.pergunta)}
                      </p>
                    </div>

                    <div className="mt-3 border-l border-white/[0.14] pl-5">
                      {troca.paragrafos.map((paragrafo, i) => (
                        <p
                          key={paragrafo}
                          className={`text-[15px] leading-relaxed text-white/70 md:text-base ${
                            i > 0 ? 'mt-3' : ''
                          }`}
                        >
                          {/* O segundo parágrafo começa depois do primeiro, e não
                              junto: o atraso é o tempo de ler o de cima. Sem ele
                              os dois se montam ao mesmo tempo e o efeito vira
                              ruído. */}
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
