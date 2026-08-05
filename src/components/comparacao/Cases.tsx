import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { REELS, type Reel } from '../proof/reels';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Os cases, como três miniaturas que abrem o vídeo.
 *
 * Ficam do lado "Com Doxa" por um motivo de argumento, não de decoração: o card
 * diz que basta uma foto e um áudio, e a pergunta imediata é "e sai o quê?".
 * Estas três respondem — são os mesmos arquivos da parede de prova, então nada
 * aqui é material novo nem promessa nova.
 *
 * O pôster carrega junto com a página; o vídeo só é montado quando alguém
 * clica. Três `<video>` num card seria meio megabyte gasto para o caso de a
 * pessoa querer ver, e a maioria não quer.
 */
export function Cases() {
  const [aberto, setAberto] = useState<Reel | null>(null);

  useEffect(() => {
    if (aberto == null) return;
    const sair = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setAberto(null);
    };
    document.addEventListener('keydown', sair);
    // A página não pode rolar por trás do vídeo — o modal é fixo e o fundo
    // deslizando embaixo dele é o defeito clássico de modal em landing page.
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', sair);
      document.body.style.overflow = antes;
    };
  }, [aberto]);

  return (
    <>
      {/* Altura travada: o card do lado esquerdo é esticado pelo grid para
          acompanhar este, e três miniaturas em 9:13 numa coluna de um terço
          empurram os dois para setecentos pixels — a pilha de peças fica
          boiando num mar de preto. */}
      <div className="flex max-h-[11rem] gap-2">
        {REELS.map((reel) => (
          <button
            key={reel.handle}
            type="button"
            onClick={() => setAberto(reel)}
            aria-label={`Ver o vídeo de ${reel.handle}`}
            className="group relative aspect-[9/12] min-h-0 flex-1 overflow-hidden rounded-xl border border-black/10 bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
          >
            <img
              src={reel.posterUrl}
              alt=""
              aria-hidden
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1 p-2">
              <Play className="h-3 w-3 shrink-0 fill-white text-white" strokeWidth={0} />
              <span className="truncate text-[10px] font-medium text-white">{reel.handle}</span>
            </span>
          </button>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {aberto != null && (
            <motion.div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-5 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={() => setAberto(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`Vídeo de ${aberto.handle}`}
            >
              <motion.div
                className="relative max-h-full w-full max-w-[min(24rem,90vw)] overflow-hidden rounded-2xl border border-white/[0.14] bg-black shadow-[0_50px_120px_-40px_rgba(0,0,0,1)]"
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.4, ease: EASE }}
                onClick={(evento) => evento.stopPropagation()}
              >
                {aberto.videoUrl == null ? (
                  <img src={aberto.posterUrl} alt="" className="w-full" />
                ) : (
                  <video
                    src={aberto.videoUrl}
                    poster={aberto.posterUrl}
                    className="max-h-[80vh] w-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                )}

                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="truncate text-[13px] font-medium text-white">
                    {aberto.handle}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAberto(null)}
                    aria-label="Fechar"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.14] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
