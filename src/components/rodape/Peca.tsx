import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Reel } from '../proof/reels';
import type { Lugar } from './config';

/** Quanto uma peça sem vaga espera antes de tentar de novo, em milissegundos. */
const ESPERA_VAGA = 1200;

/**
 * O PALCO: quantos vídeos podem estar tocando ao mesmo tempo no campo inteiro.
 *
 * É a peça de engenharia que o pedido do dono exige, e o número dele — seis em
 * exposição — é o que a torna possível. O campo infinito desenha o mosaico
 * QUATRO vezes (duas na horizontal, duas na vertical) para que a volta ao zero
 * seja invisível; com catorze peças, são cinquenta e seis retângulos montados.
 * Cinquenta e seis `<video>` seria um rodapé que derruba a aba.
 *
 * Então o retângulo é sempre o still, que é barato e é a mesma imagem repetida
 * — e o vídeo é um recurso ESCASSO, entregue a quem está em cena, com teto.
 * Quem entra pede uma vaga; quem sai devolve. Quem chega com a casa cheia
 * continua sendo um still e tenta de novo daqui a pouco — com o campo em
 * deriva, uma vaga se abre em segundos.
 *
 * Contador em `ref` e não em estado, de propósito: a contabilidade das vagas
 * não desenha nada. Em estado, cada peça que entrasse ou saísse de cena
 * repintaria as outras cinquenta e cinco.
 */
export interface Palco {
  /** Tenta ocupar uma vaga. Devolve se conseguiu. */
  pedir: () => boolean;
  devolver: () => void;
}

export function usePalco(maximo: number): Palco {
  const ocupadas = useRef(0);
  const teto = useRef(maximo);

  useEffect(() => {
    teto.current = maximo;
  }, [maximo]);

  // Estável por toda a vida do rodapé: é ele que entra na lista de dependências
  // do efeito de cada peça, e um objeto novo a cada render faria as cinquenta e
  // seis devolverem e repedirem a vaga a cada quadro.
  return useMemo(
    () => ({
      pedir: () => {
        if (ocupadas.current >= teto.current) return false;
        ocupadas.current += 1;
        return true;
      },
      devolver: () => {
        ocupadas.current = Math.max(0, ocupadas.current - 1);
      },
    }),
    [],
  );
}

interface PecaProps {
  reel: Reel;
  /** A célula da grade em que esta peça senta — é ela que desenha o X. */
  lugar: Lugar;
  palco: Palco;
  /** Se o rodapé já está revelado. Escondido atrás da página, nada toca. */
  ativo: boolean;
}

/**
 * Uma peça do mosaico: o still de um reel publicado, e o vídeo quando há vaga.
 *
 * A moldura é a mesma da parede de prova e a mesma do hero — canto de 12px e um
 * fio de branco a 14%. É de propósito: esta é a terceira vez que a página
 * mostra o arquivo de um cliente, e mudar o enquadramento faria parecer outro
 * tipo de objeto. O arroba fica, pequeno, porque é o que torna a peça
 * CHECÁVEL — sem ele, catorze retângulos bonitos são catorze imagens de banco.
 *
 * O still nunca é substituído pelo vídeo: o vídeo nasce POR CIMA dele, na
 * mesma moldura, e aparece em fade no quadro em que o arquivo já ia começar.
 * Assim não existe o buraco preto do buffer, e nada se mexe quando ele chega.
 */
export function Peca({ reel, lugar, palco, ativo }: PecaProps) {
  const cascaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emCena, setEmCena] = useState(false);
  const [tocando, setTocando] = useState(false);

  /* Quem decide o que está em cena é o navegador, e não uma conta de posição.
     O campo anda sozinho e ainda é arrastado: qualquer coordenada calculada
     aqui estaria errada no quadro seguinte. O observador responde à pergunta
     certa — "isto está na tela?" — de graça e fora da thread principal.

     `threshold: 0.35` e não zero: uma peça com dois por cento de si aparecendo
     na quina da tela não é uma peça em cena, e gastaria uma das seis vagas
     sendo praticamente invisível. */
  useEffect(() => {
    const casca = cascaRef.current;
    if (casca == null) return;
    const olho = new IntersectionObserver(
      (entradas) => setEmCena(entradas.some((entrada) => entrada.isIntersecting)),
      { threshold: 0.35 },
    );
    olho.observe(casca);
    return () => olho.disconnect();
  }, []);

  /*
   * A vaga: pedida ao entrar em cena, devolvida na limpeza.
   *
   * A devolução mora no `return` do efeito e em nenhum outro lugar. É o que
   * garante que sair de cena, o rodapé se esconder de novo ou a peça ser
   * desmontada devolvam a vaga pelo MESMO caminho — três lugares diferentes
   * devolvendo à mão é como um contador de recursos vaza até travar em zero
   * vagas com nada tocando.
   */
  useEffect(() => {
    if (!ativo || !emCena || reel.videoUrl == null) return;

    let minha = false;
    let relogio: number | undefined;

    const tentar = () => {
      minha = palco.pedir();
      if (minha) setTocando(true);
      else relogio = window.setTimeout(tentar, ESPERA_VAGA);
    };
    tentar();

    return () => {
      window.clearTimeout(relogio);
      if (minha) palco.devolver();
      setTocando(false);
    };
  }, [ativo, emCena, palco, reel.videoUrl]);

  /* O play é chamado à mão, e o mudo é escrito no elemento antes dele. `muted`
     é o atributo com que o React é notoriamente frouxo, e um navegador recusa
     começar um vídeo que pede som sem ter sido pedido — é a mesma cicatriz que
     a parede de prova já carrega. */
  useEffect(() => {
    const video = videoRef.current;
    if (video == null) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, [tocando]);

  return (
    <div
      ref={cascaRef}
      /* A largura vem da COLUNA (`w-full`) e não de um número aqui: as colunas
         têm largura fixa, e é quem desenha a grade que a escolhe. A altura é o
         formato do arquivo — 9:16, que é como um reel é publicado.

         ─── O MEIO PASSO DAS COLUNAS PARES ──────────────────────────────────

         `translateY` e não margem: as linhas da grade são `auto`, e uma margem
         empurraria a LINHA inteira para baixo — as outras nove colunas
         desceriam junto e não haveria desencontro nenhum. Transform desloca o
         que se pinta sem tocar no que se mede.

         A distância vem de `--desloca`, escrita na grade em `Rodape.tsx`, e no
         desktop ela vale 200px — o dobro do vão, a pedido do dono, que é perto
         de meio passo. Um valor escrito aqui não teria como acompanhar o
         breakpoint, e ele muda no telefone: `style` não tem media query. */
      style={{
        gridColumn: lugar.coluna,
        gridRow: lugar.linha,
        transform: lugar.coluna % 2 === 0 ? 'translateY(var(--desloca))' : undefined,
      }}
      className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-white/[0.14] bg-doxa-raised"
    >
      <img
        src={reel.posterUrl}
        alt=""
        aria-hidden
        loading="lazy"
        draggable={false}
        className="h-full w-full select-none object-cover"
      />

      {tocando && reel.videoUrl != null && (
        <motion.video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.posterUrl}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          loop
          playsInline
          preload="none"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        />
      )}

      {/* O arroba, sobre um degradê curto. O degradê existe para o texto ter
          contraste em qualquer quadro do vídeo — sem ele, um reel que abre num
          fundo claro apaga a única coisa que torna a peça verificável. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
        <span className="select-none font-ui text-[11px] font-semibold text-white/75 md:text-[12px]">
          {reel.handle}
        </span>
      </div>
    </div>
  );
}
