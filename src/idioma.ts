import { useCallback, useEffect, useState } from 'react';

/**
 * ─── O IDIOMA DA PÁGINA ──────────────────────────────────────────────────────
 *
 * Hoje isto governa UMA coisa: o texto do menu do topo, e o atributo `lang` do
 * documento. As seções continuam em português — a copy delas mora inline nos
 * `config.ts` de cada seção e a tradução é um trabalho à parte, com revisão do
 * dono antes de ir ao ar.
 *
 * O módulo existe agora, e não junto com aquele trabalho, porque a ESCOLHA é o
 * que precisa estar de pé primeiro: qual idioma, onde ele fica guardado, e quem
 * conta ao navegador. Quando as seções forem traduzidas, elas leem `useIdioma`
 * e nada aqui muda.
 *
 * O que este arquivo NÃO faz, de propósito:
 *
 *  - Não muda a URL. `/en` e `/es` como rotas é decisão de SEO, e SEO de idioma
 *    quer `hreflang` e sitemap por idioma — coisas que só fazem sentido quando
 *    existir conteúdo traduzido para apontar. Fazer a rota antes seria publicar
 *    três endereços servindo o mesmo português.
 *  - Não traduz nada sozinho. Não há dicionário global aqui: cada componente
 *    traz o seu, tipado por `Idioma`, e o compilador cobra os três.
 */

export const IDIOMAS = ['pt', 'en', 'es'] as const;

export type Idioma = (typeof IDIOMAS)[number];

/**
 * Um dicionário que o compilador obriga a ter os três idiomas.
 *
 * É o contrato que impede o defeito clássico do i18n caseiro: alguém adiciona
 * uma frase em português, esquece o espanhol, e a interface mostra `undefined`
 * para quem escolheu espanhol. Aqui isso não compila.
 */
export type PorIdioma<T> = Readonly<Record<Idioma, T>>;

/**
 * O que vai no `lang` do `<html>`.
 *
 * Português é `pt-BR` e não `pt`: o site é brasileiro, e a região muda a
 * hifenização e a voz que um leitor de tela usa. Inglês e espanhol vão sem
 * região porque não temos preferência entre as variantes — declarar `en-US`
 * seria inventar uma que ninguém escolheu.
 */
const LANG: PorIdioma<string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

const CHAVE = 'doxa:idioma';

function ehIdioma(valor: unknown): valor is Idioma {
  return typeof valor === 'string' && (IDIOMAS as readonly string[]).includes(valor);
}

/**
 * O idioma guardado da última visita, se houver um válido.
 *
 * Tudo dentro de `try`: `localStorage` LANÇA, não devolve null, quando o
 * navegador bloqueia armazenamento — navegação privada no Safari, cookies de
 * terceiros desligados, iframe com `sandbox`. Sem a guarda, o acesso derruba a
 * primeira renderização do site inteiro por causa de uma preferência de idioma.
 */
function guardado(): Idioma | null {
  try {
    const valor = window.localStorage.getItem(CHAVE);
    return ehIdioma(valor) ? valor : null;
  } catch {
    return null;
  }
}

/**
 * O idioma que o navegador pede, quando não há escolha guardada.
 *
 * `navigator.languages` e não `navigator.language`: a primeira é a lista
 * ordenada de preferências reais da pessoa, e alguém com `['es-AR', 'pt-BR']`
 * quer espanhol mesmo que o sistema esteja em outra coisa. Só o prefixo
 * interessa — `es-AR`, `es-419` e `es` são o mesmo idioma para nós.
 *
 * Português é o fim da linha, e não um caso a detectar: o site é em português,
 * então qualquer navegador que não peça inglês nem espanhol recebe o original.
 */
function doNavegador(): Idioma {
  const pedidos = navigator.languages ?? [navigator.language];
  for (const pedido of pedidos) {
    const prefixo = pedido.toLowerCase().split('-')[0];
    if (ehIdioma(prefixo)) return prefixo;
  }
  return 'pt';
}

/** A escolha guardada, ou o pedido do navegador, ou português. */
export function idiomaInicial(): Idioma {
  return guardado() ?? doNavegador();
}

/**
 * O idioma corrente e como trocá-lo.
 *
 * Um `useState` e não um contexto: hoje existe UM consumidor, o menu do topo, e
 * um provider em volta da página inteira para servir um componente seria
 * abstração sem consumidor. Quando as seções traduzirem, aí o estado sobe — e
 * sobe para um contexto, que é o momento certo de pagar por ele.
 */
export function useIdioma(): [Idioma, (proximo: Idioma) => void] {
  const [idioma, setIdioma] = useState(idiomaInicial);

  /*
   * O `<html lang>` acompanha a escolha.
   *
   * O `index.html` chega com `pt-BR` cravado, e ele está certo para o que o
   * documento entrega hoje. Isto o corrige quando a pessoa escolhe outra coisa:
   * `lang` é o que diz ao leitor de tela qual voz usar e ao navegador como
   * hifenizar, e um texto em espanhol declarado como português é lido com
   * sotaque errado, palavra por palavra.
   */
  useEffect(() => {
    document.documentElement.lang = LANG[idioma];
  }, [idioma]);

  const trocar = useCallback((proximo: Idioma) => {
    setIdioma(proximo);
    try {
      window.localStorage.setItem(CHAVE, proximo);
    } catch {
      // Armazenamento bloqueado. A escolha vale para esta visita e não
      // sobrevive ao recarregamento — que é degradar, e não quebrar.
    }
  }, []);

  return [idioma, trocar];
}
