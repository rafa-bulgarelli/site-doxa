import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { OUTRO } from './config';

const EASE = [0.16, 1, 0.3, 1] as const;

interface EscolhaProps {
  /** O `id` do enunciado, para o grupo herdar o nome dele. */
  rotuladoPor: string;
  opcoes: readonly string[];
  escolhidas: readonly string[];
  /** Aceita mais de uma. Muda o desenho do selecionado e o modo de avançar. */
  multipla: boolean;
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
      <div className="flex flex-wrap gap-2">
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
              transition={{ duration: 0.34, ease: EASE, delay: Math.min(i * 0.035, 0.28) }}
              /* Sem `whitespace-nowrap`: "Já paguei agência e não deu certo" é
                 mais largo que o cartão no celular, e uma pílula que não quebra
                 estoura a caixa em vez de descer de linha. */
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-left text-[13px] leading-snug transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                marcada
                  ? 'border-transparent bg-[#F4F1E8] text-[#0B0B0B]'
                  : 'border-white/[0.14] text-white/70 hover:border-white/40 hover:text-white'
              }`}
              /* O mesmo halo da etapa da vez na trilha do topo. A ficha é a
                 mesma peça do formulário, e o que está aceso se acende igual. */
              style={marcada ? { boxShadow: '0 0 18px -2px rgba(255,255,255,0.55)' } : undefined}
            >
              {/* O visto só na pergunta de várias respostas. Na de resposta
                  única ele seria ruído: ali o papel cheio já diz sozinho qual
                  é, e um visto sugere que dá para juntar mais. */}
              {multipla && marcada && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />}
              {opcao}
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
