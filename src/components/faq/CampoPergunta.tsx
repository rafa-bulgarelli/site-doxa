import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { BordaViva } from '../comparacao/BordaViva';

interface CampoPerguntaProps {
  valor: string;
  /** As frases que o campo escreve sozinho enquanto está vazio. */
  exemplos: readonly string[];
  aoDigitar: (valor: string) => void;
  aoEnviar: () => void;
}

/** A altura de uma linha do campo, em pixels. */
const MINIMA = 56;
/** Onde ele para de crescer e passa a rolar por dentro. */
const MAXIMA = 168;

/** Milissegundos por letra escrita, por letra apagada, e a pausa na frase pronta. */
const ESCREVE = 42;
const APAGA = 22;
const LE = 1900;

/** Quanto tempo o texto enviado leva para se desfazer. */
const SUMICO = 420;

/**
 * O exemplo que se escreve sozinho, uma pergunta depois da outra.
 *
 * Um placeholder parado é uma instrução; um que escreve é uma demonstração. E
 * ele resolve um problema real desta seção: as respostas existem para seis
 * perguntas e mais nada, e ninguém adivinha quais são olhando para uma caixa
 * vazia. Ciclando as perguntas de verdade, o campo passa o tempo inteiro
 * ensinando o que ele sabe responder — que é a diferença entre um campo que
 * parece inteligente e um que parece quebrado.
 *
 * Apaga mais rápido do que escreve, e é assim de propósito: apagar é a parte
 * chata: ninguém precisa vê-la no mesmo ritmo em que leu a frase.
 *
 * Para de vez quando alguém digita. Um texto se escrevendo atrás do que a
 * pessoa está escrevendo é duas coisas disputando o mesmo lugar.
 */
function useExemploVivo(frases: readonly string[], ativo: boolean) {
  const [indice, setIndice] = useState(0);
  const [escrito, setEscrito] = useState('');
  const [apagando, setApagando] = useState(false);

  useEffect(() => {
    if (!ativo || frases.length === 0) return;
    const frase = frases[indice % frases.length] ?? '';

    if (!apagando && escrito.length < frase.length) {
      const id = window.setTimeout(() => setEscrito(frase.slice(0, escrito.length + 1)), ESCREVE);
      return () => window.clearTimeout(id);
    }
    if (!apagando) {
      const id = window.setTimeout(() => setApagando(true), LE);
      return () => window.clearTimeout(id);
    }
    if (escrito.length > 0) {
      // De dois em dois: apagar letra a letra na mesma cadência de escrever
      // dobra o tempo do ciclo sem acrescentar nada para ler.
      const id = window.setTimeout(() => setEscrito(escrito.slice(0, -2)), APAGA);
      return () => window.clearTimeout(id);
    }
    setApagando(false);
    setIndice((i) => i + 1);
  }, [ativo, frases, indice, escrito, apagando]);

  return escrito;
}

/**
 * O campo da pergunta: uma caixa que cresce, se acende e se apaga.
 *
 * A caixa cresce com o que se escreve porque um `<input>` corta a frase pela
 * esquerda quando ela passa da largura, e quem escreve uma pergunta longa perde
 * de vista o começo do que perguntou — logo antes de apertar enviar, que é o
 * pior momento para não poder reler.
 *
 * A altura é escrita no elemento a cada tecla, e é assim porque não existe
 * `height: auto` que sirva: `scrollHeight` só diz a altura do conteúdo quando a
 * caixa está MENOR do que ele. Encolher para a mínima antes de medir é o que dá
 * uma medida que não depende da altura do quadro anterior — sem isso a caixa só
 * sabe crescer, e apagar texto deixa o vão aberto.
 *
 * Enter envia, Shift+Enter quebra linha. É a convenção de todo campo de conversa
 * e não precisa de legenda; o que precisaria de legenda é o contrário.
 */
export function CampoPergunta({ valor, exemplos, aoDigitar, aoEnviar }: CampoPerguntaProps) {
  const parado = useReducedMotion() === true;
  const campoRef = useRef<HTMLTextAreaElement>(null);
  const caixaRef = useRef<HTMLDivElement>(null);
  const [comFoco, setComFoco] = useState(false);
  /** O texto que acabou de ser enviado e ainda está se desfazendo. */
  const [sumindo, setSumindo] = useState<string | null>(null);

  const vazio = valor.length === 0;
  const exemplo = useExemploVivo(exemplos, vazio && !parado);

  const ajustar = useCallback(() => {
    const campo = campoRef.current;
    if (campo == null) return;
    campo.style.height = `${MINIMA}px`;
    const natural = campo.scrollHeight;
    campo.style.height = `${Math.max(MINIMA, Math.min(natural, MAXIMA))}px`;
    /*
     * A barra de rolagem só pode existir quando há o que rolar.
     *
     * O dono viu uma barra numa caixa VAZIA, e ela era real: uma linha deste
     * campo mede 56,375px (24,375 de entrelinha mais 32 de recuo) e o piso da
     * caixa é 56. `scrollHeight` devolve inteiro e arredonda para baixo, então a
     * altura calculada ficava três décimos de pixel menor que o conteúdo — o
     * bastante para o navegador concluir que havia transbordo e desenhar a
     * barra. Escondido por padrão, o arredondamento deixa de ter consequência; e
     * quando o texto passa do TETO, aí sim há rolagem de verdade e a barra volta
     * a ser a resposta certa.
     */
    campo.style.overflowY = natural > MAXIMA ? 'auto' : 'hidden';
  }, []);

  // No layout e não em `useEffect`: a altura tem de estar certa no quadro em que
  // a letra aparece. Um quadro atrás, o campo dá um salto visível a cada linha.
  useLayoutEffect(ajustar, [valor, ajustar]);

  // A largura muda a quebra de linha, e a quebra muda a altura. Sem isto, girar
  // o telefone deixa a caixa com a altura do retrato e o texto por baixo dela.
  useEffect(() => {
    window.addEventListener('resize', ajustar);
    return () => window.removeEventListener('resize', ajustar);
  }, [ajustar]);

  /*
   * Enviar, e o texto não some em degrau.
   *
   * Ele é copiado para uma camada por cima e sai de lá desfocando e subindo,
   * enquanto o campo já está vazio e pronto para a próxima. O corte seco fazia
   * a pergunta desaparecer sem ir a lugar nenhum — e ela vai: a descida logo
   * abaixo a leva até a resposta. As duas animações são o mesmo gesto contado em
   * dois pedaços.
   */
  const enviar = () => {
    if (valor.trim().length === 0) return;
    if (!parado) {
      setSumindo(valor);
      window.setTimeout(() => setSumindo(null), SUMICO);
    }
    aoEnviar();
  };

  const temTexto = valor.trim().length > 0;

  return (
    /* A caixa inteira é o alvo do clique, e não só o texto: um campo de conversa
       que só aceita clique nos poucos pixels da primeira linha é um campo que
       parece quebrado. */
    <div
      ref={caixaRef}
      onClick={() => campoRef.current?.focus()}
      className="relative rounded-2xl border border-white/[0.12] bg-doxa-surface transition-colors focus-within:border-white/30"
    >
      <div className="dot-grid pointer-events-none absolute inset-0 rounded-2xl opacity-25" />

      {/*
       * O contorno vivo, só com o campo em foco.
       *
       * É o mesmo componente que corre a borda dos dois cartões da comparação, e
       * isso é o ponto: o site tem UM jeito de dizer "esta caixa está ligada", e
       * o FAQ passa a falar essa língua em vez de inventar a própria. Sem foco
       * ele não existe — um contorno correndo sozinho numa seção parada é
       * decoração, e com o cursor dentro dele é resposta.
       */}
      {comFoco && !parado && (
        <BordaViva alvoRef={caixaRef} trecho="campo" raio={16} moldura={false} />
      )}

      <textarea
        ref={campoRef}
        value={valor}
        onChange={(evento) => aoDigitar(evento.target.value)}
        onFocus={() => setComFoco(true)}
        onBlur={() => setComFoco(false)}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter' && !evento.shiftKey) {
            evento.preventDefault();
            enviar();
          }
        }}
        rows={1}
        /* O `placeholder` nativo fica vazio: quem desenha o exemplo é a camada
           abaixo, porque texto de placeholder não anima. O rótulo acessível
           continua no `aria-label`, que é onde ele sempre esteve. */
        placeholder=""
        aria-label="Escreva a sua pergunta"
        /* `resize-none` porque a alça de redimensionar do navegador briga com a
           altura que este componente escreve — puxar a alça e digitar devolvia a
           caixa ao tamanho calculado, o que lê como o campo desobedecendo. */
        className="relative block w-full resize-none bg-transparent px-5 py-4 pr-16 text-[15px] leading-relaxed text-[#F4F1E8] outline-none"
      />

      {/* O exemplo que se escreve, na mesma métrica do campo — mesma fonte,
          mesmo corpo, mesma entrelinha, mesmo recuo. Qualquer diferença aqui
          aparece como um salto no instante em que a pessoa começa a digitar. */}
      {vazio && sumindo == null && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 px-5 py-4 pr-16 text-[15px] leading-relaxed text-white/30"
        >
          {parado ? exemplos[0] : exemplo}
          {!parado && <span className="cursor-exemplo">|</span>}
        </div>
      )}

      {/* A pergunta enviada, se desfazendo. */}
      <AnimatePresence>
        {sumindo != null && (
          <motion.div
            key="sumindo"
            aria-hidden
            initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            animate={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
            transition={{ duration: SUMICO / 1000, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-0 top-0 px-5 py-4 pr-16 text-[15px] leading-relaxed text-[#F4F1E8]"
          >
            {sumindo}
          </motion.div>
        )}
      </AnimatePresence>

      {/* O botão de enviar acende com o que foi escrito. Apagado ele continua
          clicável de propósito: desabilitar um botão sem dizer por quê deixa a
          pessoa clicando num objeto morto — assim ele responde, e o campo é que
          diz que falta a pergunta. */}
      <button
        type="button"
        onClick={enviar}
        aria-label="Enviar a pergunta"
        className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
          temTexto
            ? 'bg-[#F4F1E8] text-[#0B0B0B]'
            : 'border border-white/[0.14] text-white/30 hover:text-white/60'
        }`}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}
