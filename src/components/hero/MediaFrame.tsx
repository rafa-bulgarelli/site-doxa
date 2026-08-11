import { useEffect, useRef, useState } from 'react';
import { usarNaTela } from '../../hooks/usarNaTela';
import { ImageOff, Volume2, VolumeX } from 'lucide-react';
import { useIdioma, type PorIdioma } from '../../idioma';

/** Os textos que só o leitor de tela e o `alt` veem. */
const TEXTO_MIDIA: PorIdioma<{
  fotoAlt: string;
  videoAlt: string;
  ligarSom: string;
  calarSom: string;
}> = {
  pt: {
    fotoAlt: 'Foto base enviada pelo cliente',
    videoAlt: 'Vídeo vertical produzido para o cliente',
    ligarSom: 'Ativar som do vídeo',
    calarSom: 'Silenciar vídeo',
  },
  en: {
    fotoAlt: 'Base photo sent by the client',
    videoAlt: 'Vertical video produced for the client',
    ligarSom: 'Unmute video',
    calarSom: 'Mute video',
  },
  es: {
    fotoAlt: 'Foto base enviada pelo cliente',
    videoAlt: 'Vídeo vertical produzido para o cliente',
    ligarSom: 'Ativar som do vídeo',
    calarSom: 'Silenciar vídeo',
  },
};

interface FrameProps {
  /** Ratio utility, e.g. `aspect-square` or `aspect-[9/16]`. */
  ratio: string;
  /** Null while the owner has not supplied this case's file. */
  src: string | null;
  /**
   * A mesma foto num tamanho intermediário, quando existe.
   *
   * Entra com `src` num `srcSet` para o navegador escolher — no telefone, a
   * moldura tem cerca de 150 px e o arquivo grande é seis vezes maior do que
   * cabe nela. Null cai no comportamento antigo, com `src` sozinho: um case
   * sem variante gerada continua aparecendo, só que pesado.
   */
  midSrc?: string | null;
}

/**
 * Media inside a canvas card is decorative, and the card around it is
 * draggable. Browsers give images and videos their own native drag, which wins
 * the gesture and leaves the card stuck — so pointer events are taken away from
 * the media entirely and the native drag is switched off on top of that.
 */
const MEDIA_CLASS = 'pointer-events-none h-full w-full select-none object-cover';

function PendingFrame({ ratio, raised = false }: { ratio: string; raised?: boolean }) {
  return (
    <div
      className={`relative flex ${ratio} w-full items-center justify-center ${
        raised ? 'bg-doxa-raised' : 'bg-doxa-surface'
      }`}
    >
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="relative flex flex-col items-center gap-2">
        <ImageOff className="h-6 w-6 text-white/25" strokeWidth={1.5} />
        <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">PENDENTE-DONO</span>
      </div>
    </div>
  );
}

/** The client's photo — the raw material handed over at the start. */
export function ClientPhoto({ ratio, src, midSrc }: FrameProps) {
  const [idioma] = useIdioma();
  if (!src) return <PendingFrame ratio={ratio} />;

  return (
    <div className={`relative ${ratio} w-full overflow-hidden bg-doxa-surface`}>
      <img
        key={src}
        src={src}
        /* As duas larguras reais dos arquivos, para o navegador escolher pela
           densidade e pela largura que só ele conhece. O `sizes` descreve o
           CSS: metade de uma coluna de 310px no telefone, 21% da janela da
           tela larga em diante — os mesmos números que o `Hero` desenha. */
        srcSet={midSrc ? `${midSrc} 480w, ${src} 888w` : undefined}
        sizes={midSrc ? '(min-width: 768px) 21vw, 150px' : undefined}
        alt={TEXTO_MIDIA[idioma].fotoAlt}
        className={MEDIA_CLASS}
        draggable={false}
        width={880}
        height={1100}
      />
    </div>
  );
}

/**
 * The finished vertical video, with sound left to the viewer.
 *
 * It starts muted because browsers block sound-on autoplay outright, and
 * `playsInline` stops iOS hijacking it into fullscreen. The toggle flips
 * `muted` on the element from inside the click, which is the gesture that
 * authorises audio — going through React state alone would land the change a
 * frame later, outside the gesture, and the browser would refuse it.
 */
function VideoFrame({ ratio, src, poster }: { ratio: string; src: string; poster: string | null }) {
  const [idioma] = useIdioma();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [no, setNo] = useState<HTMLVideoElement | null>(null);
  const naTela = usarNaTela(no);

  /*
   * O vídeo para quando sai da tela.
   *
   * `autoPlay loop` sem freio é um decodificador de vídeo ligado para sempre:
   * medido no telefone, o vídeo do hero continuava rodando quadro a quadro
   * enquanto o visitante preenchia o formulário oito mil pixels abaixo — e
   * decodificar vídeo não aparece como JavaScript em perfil nenhum, aparece como
   * o telefone inteiro ficando lento.
   *
   * Volta de onde parou, e não do começo: `pause()` guarda o tempo. Quem rola de
   * volta encontra a cena adiante, que é o que encontraria se ela nunca tivesse
   * parado — e é por isso que aqui não há `load()` nem `currentTime = 0`.
   *
   * O `play()` pode ser recusado (economia de bateria, por exemplo). Recusado,
   * fica o pôster, que é exatamente o que já acontece quando o autoplay é
   * bloqueado na chegada.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (video == null) return;
    if (naTela) void video.play().catch(() => undefined);
    else video.pause();
  }, [naTela]);

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className={`relative ${ratio} w-full overflow-hidden bg-doxa-raised`}>
      <video
        ref={(elemento) => {
          videoRef.current = elemento;
          setNo(elemento);
        }}
        src={src}
        poster={poster ?? undefined}
        className={MEDIA_CLASS}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={TEXTO_MIDIA[idioma].videoAlt}
      />
      <button
        type="button"
        onClick={toggleMuted}
        /* The card around this is draggable. Without stopping the press here,
           framer-motion starts a drag on the same pointerdown and the button
           slides out from under the cursor before the click resolves. */
        onPointerDown={(event) => event.stopPropagation()}
        className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.14] bg-black/50 text-white opacity-80 backdrop-blur-sm transition hover:bg-black/70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        aria-label={muted ? TEXTO_MIDIA[idioma].ligarSom : TEXTO_MIDIA[idioma].calarSom}
      >
        {muted ? (
          <VolumeX className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Volume2 className="h-4 w-4" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}

/**
 * The output node's media — the other end of the pipeline.
 *
 * The `key` forces a fresh element when the case changes: swapping `src` on a
 * live `<video>` leaves the old frame on screen until `load()` is called by
 * hand. Remounting also drops the viewer's sound choice back to muted, which
 * is the only state a new element is allowed to autoplay in anyway.
 */
export function ViralVideo({ ratio, src, poster }: FrameProps & { poster: string | null }) {
  if (!src) return <PendingFrame ratio={ratio} raised />;

  return <VideoFrame key={src} ratio={ratio} src={src} poster={poster} />;
}
