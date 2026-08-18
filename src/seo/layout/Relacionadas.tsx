import type { ReactElement } from 'react';
import { ehDaLanding, porUrl, resolverLink } from '../indice';
import { SECOES } from '../site';

/**
 * O bloco "continue por aqui" do fim da página.
 *
 * Só entra o que EXISTE. Uma `relacionadas` pode citar rotas ainda planejadas —
 * é assim que a track de conteúdo escreve o cluster inteiro de uma vez —, e
 * aqui elas são filtradas: um card apontando para 404 é pior do que um bloco
 * menor. Se nada da lista existir ainda, o bloco não aparece.
 */
export function Relacionadas({ urls }: { urls: readonly string[] }): ReactElement | null {
  // A landing é `existe` para `resolverLink` (o CTA aponta para ela), mas não é
  // um card de conteúdo: ela não tem `h1` nem `resumo` neste índice, e um card
  // "continue por aqui → página inicial" não continua leitura nenhuma.
  const existentes = urls.filter((url) => !ehDaLanding(url) && resolverLink(url) === 'existe');
  if (existentes.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-5 pt-16 md:px-10">
      <h2 className="font-serif text-2xl text-white md:text-3xl">Continue por aqui</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {existentes.map((url) => (
          <li key={url}>
            <a
              href={url}
              className="block h-full rounded-xl border border-doxa-line bg-doxa-surface p-5 transition-colors hover:border-white/25 md:p-6"
            >
              <span className="font-serif text-lg text-white">{titulo(url)}</span>
              <span className="mt-2 block text-[14px] leading-relaxed text-white/50">
                {resumo(url)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** O rótulo do card: o `h1` da página, ou o da seção quando a URL é um índice. */
function titulo(url: string): string {
  const pagina = porUrl(url);
  if (pagina != null) return pagina.h1;
  const secao = SECOES[url];
  if (secao != null) return secao.h1;
  throw new Error(`Relacionada existente sem título: ${url}`);
}

function resumo(url: string): string {
  const pagina = porUrl(url);
  if (pagina != null) return pagina.resumo;
  const secao = SECOES[url];
  if (secao != null) return secao.resumo;
  throw new Error(`Relacionada existente sem resumo: ${url}`);
}
