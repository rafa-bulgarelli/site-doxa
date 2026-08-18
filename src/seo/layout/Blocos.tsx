import type { ReactElement } from 'react';
import { resolverLink } from '../indice';
import { slugificar, tokens } from '../inline';
import type { Token } from '../inline';
import { HREF_CTA } from '../site';
import type { Bloco, Faq, Passo } from '../tipos';

/**
 * O desenho de um `Bloco`.
 *
 * Um `switch` e nada mais: é aqui que "adicionar um tipo de bloco" custa um
 * `case`, e não um componente novo por página. O brief (§29) pede exatamente
 * isso — trinta arquivos repetindo layout é o que este arquivo existe para
 * impedir.
 */

/** Um link inline, com o destino resolvido contra o índice. */
function Ligacao({ token }: { token: Extract<Token, { tipo: 'link' }> }): ReactElement {
  if (!token.href.startsWith('/')) {
    return (
      <a
        href={token.href}
        rel="noopener noreferrer"
        target="_blank"
        className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
      >
        {token.texto}
      </a>
    );
  }
  const estado = resolverLink(token.href);
  switch (estado) {
    case 'existe':
      return (
        <a
          href={token.href}
          className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
        >
          {token.texto}
        </a>
      );
    // Rota planejada e ainda inexistente vira TEXTO. Publicar o `<a>` seria um
    // link interno quebrado; apagar a frase seria reescrever conteúdo. O `<a>`
    // aparece sozinho no build em que a página nascer.
    case 'planejada':
      return <span className="text-white">{token.texto}</span>;
    case 'desconhecida':
      throw new Error(
        `Link interno para rota desconhecida: "${token.href}". Crie a página ou registre a URL em rotas-planejadas.ts.`,
      );
    default:
      throw new Error(`Estado de link não tratado: ${String(estado)}`);
  }
}

/** Texto de conteúdo com a marcação inline resolvida. React escapa o resto. */
export function Inline({ texto }: { texto: string }): ReactElement {
  return (
    <>
      {tokens(texto).map((token, indice) => {
        const chave = `${indice}-${token.tipo}`;
        if (token.tipo === 'negrito') {
          return (
            <strong key={chave} className="font-bold text-white">
              {token.texto}
            </strong>
          );
        }
        if (token.tipo === 'link') return <Ligacao key={chave} token={token} />;
        return <span key={chave}>{token.texto}</span>;
      })}
    </>
  );
}

const ROTULO_DESTAQUE: Record<'nota' | 'atencao' | 'doxa', string> = {
  nota: 'Nota',
  atencao: 'Atenção',
  doxa: 'Na Doxa',
};

/**
 * As três caixas de destaque, separadas por PESO e não por cor.
 *
 * O site é monocromático fora do menu do topo (ver `tailwind.config.js`), então
 * a hierarquia de um callout tem de sair da borda e do fundo. `doxa` é a mais
 * clara porque é a única que fala em nome da empresa.
 */
const ESTILO_DESTAQUE: Record<'nota' | 'atencao' | 'doxa', string> = {
  nota: 'border-white/10 bg-doxa-surface',
  atencao: 'border-white/25 bg-doxa-raised',
  doxa: 'border-white/60 bg-doxa-raised',
};

function Passos({ itens }: { itens: readonly Passo[] }): ReactElement {
  return (
    <ol className="my-8 grid gap-4 md:grid-cols-3">
      {itens.map((passo, indice) => (
        <li
          key={passo.titulo}
          className="rounded-xl border border-doxa-line bg-doxa-surface p-5 md:p-6"
        >
          {/* /45 e não /30: o numeral é texto grande (24px), então a régua é
              3:1 — e 30% sobre `bg-doxa-surface` dá 2,28:1, reprovado. */}
          <span className="font-serif text-2xl text-white/45">
            {String(indice + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-2 font-serif text-xl text-white">{passo.titulo}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-white/60">
            <Inline texto={passo.texto} />
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * O FAQ como `<details>`.
 *
 * Nada de JS: `<details>` abre e fecha sozinho em todo navegador desde 2020, e
 * a resposta está no HTML mesmo fechada — visível ao rastreador e ao leitor de
 * tela. É a condição para o `FAQPage` do schema não ser marcação de conteúdo
 * invisível (§46).
 */
function Perguntas({ itens }: { itens: readonly Faq[] }): ReactElement {
  return (
    <div className="my-8 divide-y divide-doxa-line rounded-xl border border-doxa-line bg-doxa-surface">
      {itens.map((item) => (
        <details key={item.pergunta} className="group px-5 py-4 md:px-6">
          <summary className="cursor-pointer list-none font-serif text-lg text-white marker:hidden">
            {item.pergunta}
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-white/60">
            <Inline texto={item.resposta} />
          </p>
        </details>
      ))}
    </div>
  );
}

function Tabela({
  cabecalho,
  linhas,
}: {
  cabecalho: readonly string[];
  linhas: ReadonlyArray<readonly string[]>;
}): ReactElement {
  return (
    // `overflow-x-auto` porque uma tabela de três colunas não cabe em 320px e a
    // alternativa é a página inteira rolar de lado.
    <div className="my-8 overflow-x-auto rounded-xl border border-doxa-line">
      <table className="w-full min-w-[32rem] border-collapse text-left text-[15px]">
        <thead className="bg-doxa-raised">
          <tr>
            {cabecalho.map((celula) => (
              <th key={celula} className="px-4 py-3 font-bold text-white md:px-5">
                {celula}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-doxa-line">
          {linhas.map((linha) => (
            <tr key={linha.join('|')}>
              {linha.map((celula) => (
                <td key={celula} className="px-4 py-3 align-top text-white/60 md:px-5">
                  <Inline texto={celula} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CtaInterno({ texto, rotulo }: { texto: string; rotulo?: string }): ReactElement {
  return (
    <div className="my-10 rounded-xl border border-white/20 bg-doxa-raised p-6 md:p-8">
      <p className="font-serif text-xl leading-snug text-white md:text-2xl">
        <Inline texto={texto} />
      </p>
      <a
        href={HREF_CTA}
        className="mt-5 inline-flex items-center rounded-full bg-white px-6 py-3 text-[15px] font-bold text-black transition-colors hover:bg-white/85"
      >
        {rotulo ?? 'Falar com a Doxa'}
      </a>
    </div>
  );
}

export function BlocoDoCorpo({ bloco }: { bloco: Bloco }): ReactElement {
  switch (bloco.tipo) {
    case 'paragrafo':
      return (
        <p className="my-5 text-[15px] leading-[1.75] text-white/70 md:text-base">
          <Inline texto={bloco.texto} />
        </p>
      );
    case 'titulo':
      return bloco.nivel === 2 ? (
        <h2 id={slugificar(bloco.texto)} className="mt-12 font-serif text-3xl text-white md:text-4xl">
          {bloco.texto}
        </h2>
      ) : (
        <h3 id={slugificar(bloco.texto)} className="mt-8 font-serif text-2xl text-white">
          {bloco.texto}
        </h3>
      );
    case 'lista':
      return bloco.ordenada === true ? (
        <ol className="my-5 list-decimal space-y-2 pl-5 text-[15px] leading-[1.75] text-white/70 marker:text-white/30 md:text-base">
          {bloco.itens.map((item) => (
            <li key={item}>
              <Inline texto={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-5 list-disc space-y-2 pl-5 text-[15px] leading-[1.75] text-white/70 marker:text-white/30 md:text-base">
          {bloco.itens.map((item) => (
            <li key={item}>
              <Inline texto={item} />
            </li>
          ))}
        </ul>
      );
    case 'destaque':
      return (
        <aside className={`my-8 rounded-xl border p-5 md:p-6 ${ESTILO_DESTAQUE[bloco.variante]}`}>
          {/* 11px é texto pequeno: a régua é 4,5:1, e 40% sobre
              `bg-doxa-raised` dava 3,6:1. */}
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
            {ROTULO_DESTAQUE[bloco.variante]}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/80">
            <Inline texto={bloco.texto} />
          </p>
        </aside>
      );
    case 'tabela':
      return <Tabela cabecalho={bloco.cabecalho} linhas={bloco.linhas} />;
    case 'passos':
      return <Passos itens={bloco.itens} />;
    case 'faq':
      return <Perguntas itens={bloco.itens} />;
    case 'cta':
      return <CtaInterno texto={bloco.texto} rotulo={bloco.rotulo} />;
    default:
      throw new Error('Bloco de tipo desconhecido no corpo da página.');
  }
}

export function Corpo({ blocos }: { blocos: readonly Bloco[] }): ReactElement {
  return (
    <>
      {blocos.map((bloco, indice) => (
        <BlocoDoCorpo key={`${indice}-${bloco.tipo}`} bloco={bloco} />
      ))}
    </>
  );
}
