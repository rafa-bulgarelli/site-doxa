import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

interface CampoPerguntaProps {
  valor: string;
  exemplo: string;
  aoDigitar: (valor: string) => void;
  aoEnviar: () => void;
}

/** A altura de uma linha do campo, em pixels. */
const MINIMA = 56;
/** Onde ele para de crescer e passa a rolar por dentro. */
const MAXIMA = 168;

/**
 * O campo da pergunta: uma caixa que cresce com o que se escreve.
 *
 * Um `<input>` corta a frase pela esquerda quando ela passa da largura, e quem
 * escreve uma pergunta longa perde de vista o começo do que perguntou — logo
 * antes de apertar enviar, que é o pior momento para não poder reler. Um
 * `<textarea>` de altura fixa faz o mesmo na vertical. A caixa que cresce
 * resolve os dois, e para de crescer antes de empurrar o resto da página.
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
export function CampoPergunta({ valor, exemplo, aoDigitar, aoEnviar }: CampoPerguntaProps) {
  const campoRef = useRef<HTMLTextAreaElement>(null);

  const ajustar = useCallback(() => {
    const campo = campoRef.current;
    if (campo == null) return;
    campo.style.height = `${MINIMA}px`;
    campo.style.height = `${Math.max(MINIMA, Math.min(campo.scrollHeight, MAXIMA))}px`;
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

  const temTexto = valor.trim().length > 0;

  return (
    /* A caixa inteira é o alvo do clique, e não só o texto: um campo de conversa
       que só aceita clique nos poucos pixels da primeira linha é um campo que
       parece quebrado. */
    <div
      onClick={() => campoRef.current?.focus()}
      className="relative rounded-2xl border border-white/[0.12] bg-doxa-surface transition-colors focus-within:border-white/30"
    >
      <div className="dot-grid pointer-events-none absolute inset-0 rounded-2xl opacity-25" />

      <textarea
        ref={campoRef}
        value={valor}
        onChange={(evento) => aoDigitar(evento.target.value)}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter' && !evento.shiftKey) {
            evento.preventDefault();
            aoEnviar();
          }
        }}
        rows={1}
        placeholder={exemplo}
        aria-label="Escreva a sua pergunta"
        /* `resize-none` porque a alça de redimensionar do navegador briga com a
           altura que este componente escreve — puxar a alça e digitar devolvia a
           caixa ao tamanho calculado, o que lê como o campo desobedecendo. */
        className="relative block w-full resize-none bg-transparent px-5 py-4 pr-16 text-[15px] leading-relaxed text-[#F4F1E8] outline-none placeholder:text-white/30"
      />

      {/* O botão de enviar acende com o que foi escrito. Apagado ele continua
          clicável de propósito: desabilitar um botão sem dizer por quê deixa a
          pessoa clicando num objeto morto — assim ele responde, e o campo é que
          diz que falta a pergunta. */}
      <button
        type="button"
        onClick={aoEnviar}
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
