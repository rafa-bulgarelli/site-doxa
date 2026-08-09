import { useEffect, useRef, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { OUTRO } from './config';
// A paleta da fita, e ela é da MARCA e não do FAQ apesar da pasta: é a mesma
// sequência que o `texto-aceso-siri` desenha nas letras e que o anel do campo de
// pergunta gira na borda. Importada em vez de repetida — três listas de sete
// cores divergem na primeira vez que alguém troca um tom.
import { CORES } from '../faq/cores';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * As cores do anel, entregues ao CSS.
 *
 * A primeira volta no fim: um `conic-gradient` não fecha sozinho, e sem repetir
 * a cor inicial haveria uma emenda dura entre o último e o primeiro tom —
 * girando, ela apareceria como uma costura dando voltas na borda. É a mesma
 * observação que o campo do FAQ faz, e a mesma conta: se ela mudar, muda nos
 * dois.
 */
const ANEL: CSSProperties = {
  ['--anel-siri-cores' as string]: [...CORES, CORES[0]].join(', '),
};

interface EscolhaProps {
  /** O `id` do enunciado, para o grupo herdar o nome dele. */
  rotuladoPor: string;
  opcoes: readonly string[];
  escolhidas: readonly string[];
  /** Aceita mais de uma. Muda o desenho do selecionado e o modo de avançar. */
  multipla: boolean;
  /**
   * Uma resposta por linha, numerada.
   *
   * Para as perguntas de POUCAS opções longas, onde a fila em `flex-wrap` vira
   * duas pílulas de larguras diferentes coladas — que se lê como duas caixas
   * mal encaixadas e não como uma lista de escolhas. Empilhadas e numeradas,
   * elas viram o que são: as alternativas, na ordem.
   *
   * Não vale para as de MUITAS opções curtas — os oito segmentos empilhados
   * seriam oito linhas de tela para uma pergunta que se responde de raspão.
   */
  empilhada?: boolean;
  /** O texto de exemplo do campo que `OUTRO` abre. Ausente, `OUTRO` não abre nada. */
  livre?: string;
  textoLivre: string;
  aoEscolher: (opcao: string) => void;
  aoEscreverLivre: (valor: string) => void;
  /** Enter no campo livre segue adiante, como nos passos de digitar. */
  aoConfirmarLivre: () => void;
}

/**
 * As respostas de TOQUE da ficha do consultor.
 *
 * Nenhuma pergunta daqui se digita, e a razão é a mesma que decidiu a ordem do
 * formulário: estas cinco vêm DEPOIS do pagamento, quando a pessoa já entregou o
 * que interessava e está fazendo um favor. Favor com teclado é favor que se
 * abandona no meio — ainda mais no celular, onde cada campo aberto sobe um
 * teclado que come metade da tela. Um toque por pergunta é o preço que este
 * momento aguenta.
 *
 * A escolha fechada também é o que faz a resposta SERVIR. Cem leads dizendo
 * "advogado", "advocacia", "sou advogado" e "direito trabalhista" não viram uma
 * tabela; cem toques na mesma pílula viram. O campo livre existe só onde a lista
 * pode não conter a pessoa — e ali ele é a válvula, não o padrão.
 *
 * Botões com `aria-pressed` e não um `radiogroup`, mesmo na pergunta de resposta
 * única. Um grupo de rádio de verdade exige navegação por setas para não mentir
 * ao leitor de tela, e essa é uma máquina inteira a mais para um ganho que aqui
 * não existe: são cinco a oito alvos por tela, todos alcançáveis com Tab, e
 * "pressionado" descreve exatamente o que a pílula faz.
 */
export function Escolha({
  rotuladoPor,
  opcoes,
  escolhidas,
  multipla,
  empilhada = false,
  livre,
  textoLivre,
  aoEscolher,
  aoEscreverLivre,
  aoConfirmarLivre,
}: EscolhaProps) {
  const parado = useReducedMotion() === true;
  const livreRef = useRef<HTMLInputElement>(null);
  const abriuLivre = livre != null && escolhidas.includes(OUTRO);

  /*
   * O campo do "Outro" recebe o foco quando ABRE, e só então.
   *
   * Quem toca em "Outro" está dizendo que vai escrever; obrigar a pessoa a
   * tocar de novo no campo que ela mesma acabou de abrir é o clique mais
   * irritante que um formulário cobra. `preventScroll` pela mesma razão do
   * `focus` dos passos de digitar, documentada em `Formulario.tsx`: focar um
   * elemento fora da tela faz o navegador rolar até ele, e aqui a ficha pode
   * estar no pé de um cartão alto.
   */
  useEffect(() => {
    if (abriuLivre) livreRef.current?.focus({ preventScroll: true });
  }, [abriuLivre]);

  return (
    <div role="group" aria-labelledby={rotuladoPor}>
      <div className={empilhada ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'}>
        {opcoes.map((opcao, i) => {
          const marcada = escolhidas.includes(opcao);
          return (
            <motion.button
              key={opcao}
              type="button"
              aria-pressed={marcada}
              onClick={() => aoEscolher(opcao)}
              initial={parado ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              /* O escalonamento é curto e tem TETO: a oitava pílula não pode
                 chegar meio segundo depois da primeira, senão a lista termina
                 de se montar depois de a pessoa já ter escolhido. */
              /* ── A BORRACHA DO CLIQUE, a pedido do dono.

                 A pílula afunda sob o dedo e volta PASSANDO do lugar: a mola
                 tem atrito baixo, então ela ultrapassa o repouso, recua menos e
                 para. É a mesma física da lâmina da ladainha e do disco de
                 voltar deste formulário — a página inteira usa esse gesto para
                 dizer "isto respondeu a você", e uma escolha que agora exige
                 um "Continuar" precisa mais dele do que precisava: sem o
                 avanço automático, o toque não tem mais a virada de tela como
                 confirmação.

                 Sai de graça do `whileTap`: não há estado, contador nem
                 controles por opção. Apertar leva a 0,96, soltar devolve a 1, e
                 é a própria mola que faz o repique na volta.

                 A transição de `scale` é escrita à parte porque a do bloco tem
                 o `delay` da entrada escalonada — herdado, ele atrasaria o
                 afundar em até 0,28s depois do dedo. */
              whileTap={parado ? undefined : { scale: 0.96 }}
              transition={{
                duration: 0.34,
                ease: EASE,
                delay: Math.min(i * 0.035, 0.28),
                scale: { type: 'spring', stiffness: 520, damping: 11, mass: 0.7 },
              }}
              /* Sem `whitespace-nowrap`: "Já paguei agência e não deu certo" é
                 mais largo que o cartão no celular, e uma pílula que não quebra
                 estoura a caixa em vez de descer de linha.

                 Em repouso as opções estavam a 70% de branco sobre fio de 14%, e
                 o dono leu como "muito apagadas" — com razão: uma resposta ainda
                 não escolhida não é uma resposta secundária, é a única coisa que
                 aquela tela pede. O apagado tem lugar numa LISTA de referência,
                 não num par de alternativas. Branco cheio sobre fio de 30%.

                 O FUNDO é `bg-doxa-surface`, a pedido do dono: exatamente o do
                 campo de pergunta do FAQ. Não é a mesma cor por coincidência de
                 gosto — as duas caixas fazem o mesmo trabalho na página (uma
                 superfície escura que espera uma resposta e acende sob a mão), e
                 a mesma cor é o que faz o visitante reconhecer a segunda por já
                 ter usado a primeira. O branco a 5% que estava aqui era um
                 quinto tom de cinza no site, inventado para este botão.

                 E o hover NÃO mexe mais em borda nem em fundo, a pedido do
                 dono: quem responde ao ponteiro é o anel e as duas faixas de
                 luz, e mais nada. Um contorno que clareia ao mesmo tempo em que
                 uma luz colorida acende são dois efeitos disputando o mesmo
                 gesto — e o que se lê não é ênfase dobrada, é a borda brigando
                 com a luz.

                 ─── E A ESCOLHIDA TAMBÉM NÃO MUDA DE FUNDO ───────────────────

                 Ela já foi papel creme cheio com halo branco, e o dono desfez:
                 a selecionada fica com o MESMO fundo das outras e se distingue
                 só pela borda acesa (`.anel-siri-aceso`, que liga o anel e as
                 duas luzes fora do hover).

                 A leitura ganha coerência com isso — a luz passa a significar
                 uma coisa só nesta tela: "é esta". Sob a mão ela diz "é esta se
                 você clicar", escolhida ela diz "é esta". Com o creme, havia
                 dois vocabulários para a mesma afirmação.

                 E o estado não depende só de cor nem só de animação: `aria-pressed`
                 carrega a escolha para quem não vê a borda, e a regra de
                 `prefers-reduced-motion` mantém a luz ACESA parando apenas a
                 volta — o que é decisão antiga deste arquivo e agora paga duas
                 vezes. */
              className={`anel-siri relative flex items-center border border-white/30 bg-doxa-surface text-left leading-snug text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                empilhada
                  ? 'w-full rounded-2xl px-5 py-4 text-[15px]'
                  : 'rounded-full px-4 py-2.5 text-[13px]'
              } ${marcada ? 'anel-siri-aceso' : ''}`}
              /* ── O ANEL DO CAMPO DE PERGUNTA, aqui, a pedido do dono.

                 `.anel-siri` é o mesmo efeito do campo do FAQ: um
                 `conic-gradient` de um pixel correndo pela borda, e ele SÓ
                 existe sob a mão ou sob o foco — fora disso não há `animation`
                 declarada e o navegador não calcula quadro nenhum. É por isso
                 que dá para pôr em duas, cinco ou oito pílulas sem custo.

                 `relative` porque o anel é um `::before` em `inset: -1px`, e
                 `border-radius: inherit` faz ele copiar o raio de cada forma —
                 a mesma classe serve a pílula redonda e ao cartão empilhado.

                 O `focus-visible:ring` branco continua por cima: o anel é
                 decoração e responde ao mouse também, e quem navega por teclado
                 precisa de um indicador que não dependa de cor nem de
                 animação. */
              style={ANEL}
            >
              {/* ── AS DUAS FAIXAS DE LUZ, as mesmas do campo do FAQ.

                  `.anel-luz` é a camada, `.luz-halo` o brilho largo que vaza
                  para fora e `.luz-borda` a cor acesa em cima do contorno. As
                  três só existem sob a mão ou sob o foco: fora disso a camada
                  está em `opacity: 0`, nenhuma `animation` está declarada, e um
                  `blur` de 12 pixels que não está na tela não custa quadro.

                  Em `<span>` e não `<div>` como no FAQ: o conteúdo de um
                  `<button>` é conteúdo de FRASE, e um `div` aqui dentro é HTML
                  inválido mesmo o navegador aceitando. As regras casam por
                  classe e por `.anel-luz span`, então a troca de tag não muda
                  nada.

                  O `.anel-siri-isca` — o pulso que chama a mão de longe — NÃO
                  vem junto, e é opt-in por classe própria justamente para isso:
                  no FAQ há um campo só e ele precisa se anunciar; aqui são duas
                  a oito alternativas, e oito caixas pulsando em intervalo não é
                  um chamado, é um alarme. */}
              <span className="anel-luz" aria-hidden>
                <span className="luz-halo" />
                <span className="luz-borda" />
              </span>

              {/* O conteúdo em `relative` para pintar ACIMA da luz: elementos
                  posicionados pintam sobre os estáticos, e sem isto o halo
                  passaria na frente do texto da própria alternativa. */}
              <span className="relative flex items-center gap-3">
                {/* O NÚMERO da alternativa, só na versão empilhada.

                    Ele existe para a lista ser lida como lista: sem ele, duas
                    caixas iguais uma sobre a outra são duas caixas, e o olho não
                    sabe se está diante de uma escolha ou de dois avisos. Em
                    `tabular-nums` e num tom abaixo do texto, como os números da
                    ladainha — ele ordena e não compete. */}
                {empilhada && (
                  <span
                    aria-hidden
                    /* O número numa CAIXA, a pedido do dono.
 
                       Solto, ele era um dígito de 13px encostado no texto — 5
                       pixels de largura sem forma nenhuma, que o olho lê como
                       uma sujeira antes da frase e não como o índice dela. Numa
                       caixa quadrada de 26 ele vira o que é: a tecla que
                       corresponde àquela alternativa.
 
                       QUADRADO de canto macio, e não redondo: a trilha do topo
                       já usa pílulas e o botão de ação é um disco — o redondo
                       nesta tela significa "coisa em que se toca". Um quadradinho
                       diz índice, que é justamente o que ele é. `rounded-md`
                       contra o `rounded-2xl` do cartão é a mesma família de
                       canto, dois passos abaixo.
 
                       `leading-none` porque o dígito centra pela caixa, e a
                       altura de linha herdada o empurraria para baixo do meio. */
                    className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border text-[12px] leading-none tabular-nums transition-colors duration-300 ${
                      marcada
                        ? 'border-white/25 bg-white/[0.14] text-white'
                        : 'border-white/15 bg-white/[0.06] text-white/55'
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
                {/* O visto só na pergunta de várias respostas. Na de resposta
                    única ele seria ruído: ali o papel cheio já diz sozinho qual
                    é, e um visto sugere que dá para juntar mais. */}
                {multipla && marcada && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />}
                {opcao}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {abriuLivre && (
          <motion.div
            key="livre"
            initial={parado ? undefined : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            {/* Um input comum, e não o `CampoVivo` das perguntas de cima. Aquele
                é a serifa grande com a letra caindo e o cursor desenhado — o
                tratamento da pergunta principal da tela. Aqui é a exceção de uma
                opção dentro de uma lista, e dar a ela o desenho mais caro do
                formulário a promoveria acima das oito pílulas ao lado. */}
            <input
              ref={livreRef}
              type="text"
              value={textoLivre}
              placeholder={livre}
              aria-label={livre}
              onChange={(evento) => aoEscreverLivre(evento.target.value)}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') {
                  evento.preventDefault();
                  aoConfirmarLivre();
                }
              }}
              className="mt-3 w-full border-b border-white/20 bg-transparent pb-2 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/70"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
