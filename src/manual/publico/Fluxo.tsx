/**
 * O fluxo público do convite. ESQUELETO do prelude — a track do fluxo público
 * substitui este arquivo inteiro; ele existe para a rota compilar e montar.
 */
import type { PropsDeRota } from '../tipos';

export default function Fluxo({ segmentos }: PropsDeRota) {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-doxa-bg px-5"
      data-caminho={segmentos.join('/')}
    >
      <p className="text-[15px] text-white/50">Carregando…</p>
    </main>
  );
}
