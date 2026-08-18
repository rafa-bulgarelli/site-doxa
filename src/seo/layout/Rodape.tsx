import type { ReactElement } from 'react';
import { secoes } from '../indice';
import { HREF_PERGUNTAS } from '../site';

/**
 * O rodapé das páginas SEO.
 *
 * Links de seção e mais nada. O brief é explícito (§17): "sem 50 links
 * aleatórios no footer — links para humanos". As seções são a arquitetura do
 * site; a lista de páginas mora no índice de cada uma.
 *
 * A lista sai de `secoes()` e não das cinco chaves de `SECOES`, e a diferença
 * importa: `secoes()` devolve só o que este build PUBLICOU. Enquanto
 * `/plataformas` não tiver página, um link para ela seria um 404 saindo de
 * todas as páginas do site — link interno quebrado, item 39 do brief. Cada
 * seção entra no rodapé sozinha, no build em que ganhar a primeira página.
 *
 * `Perguntas` aponta para o FAQ da landing, com as respostas do dono. Uma
 * segunda página de perguntas seria a mesma informação disputando a mesma
 * busca. O href vem de `HREF_PERGUNTAS` (que vem de `src/ancoras.ts`) e não da
 * string à mão: âncora escrita nas duas pontas quebra sem avisar.
 */

const ANO = new Date().getFullYear();

export function Rodape(): ReactElement {
  return (
    <footer className="mt-20 border-t border-doxa-line bg-doxa-stage px-5 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* As opacidades daqui são de CONTRASTE, não de gosto: a 13px, branco
            a 45% dá 4,42:1 e a 25% dá 2,0:1 sobre `bg-doxa-stage` — os dois
            abaixo dos 4,5:1 da WCAG AA. 60% (links) e 50% (assinatura) passam
            e mantêm a assinatura mais apagada que os links. A landing tem a
            mesma classe no rodapé dela e NÃO muda: é decisão de design do
            dono, e esta track é só das páginas SEO. */}
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-3">
          {secoes().map((secao) => (
            <a
              key={secao.url}
              href={secao.url}
              className="text-[13px] text-white/60 transition-colors hover:text-white"
            >
              {secao.h1}
            </a>
          ))}
          <a href="/" className="text-[13px] text-white/60 transition-colors hover:text-white">
            Página inicial
          </a>
          <a href={HREF_PERGUNTAS} className="text-[13px] text-white/60 transition-colors hover:text-white">
            Perguntas
          </a>
        </nav>
        <p className="text-[13px] text-white/50">© {ANO} Doxa</p>
      </div>
    </footer>
  );
}
