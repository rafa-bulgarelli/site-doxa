import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/*
 * ─── A PÁGINA SEMPRE ABRE NO COMEÇO ──────────────────────────────────────────
 *
 * Pedido do dono: recarregar estava caindo direto no fim da página. Duas coisas
 * faziam isso, e as duas moram no navegador, não no site — por isso não havia
 * uma linha para "consertar" em componente nenhum:
 *
 *  1. A RESTAURAÇÃO DE ROLAGEM. Por padrão o navegador guarda onde a pessoa
 *     estava e devolve a posição no reload. Quem está trabalhando no rodapé
 *     recarrega dentro do rodapé — e cai no rodapé de novo, para sempre.
 *     `scrollRestoration = 'manual'` desliga isso e deixa a decisão com a
 *     página.
 *
 *  2. A ÂNCORA HERDADA. Clicar em "Perguntas" ou em qualquer CTA escreve
 *     `#faq` / `#forms` na barra de endereço, e ali fica. O próximo reload não
 *     abre a página: abre aquela seção. `replaceState` limpa o fragmento antes
 *     do primeiro render, sem entrada nova no histórico.
 *
 * Isto roda ANTES do `createRoot`, e o lugar importa: depois da montagem, o
 * salto do fragmento e a restauração já aconteceram, e o que se veria seria a
 * página pulando de um lugar para outro na frente da pessoa.
 *
 * O preço, e ele é real: um link compartilhado com `#faq` deixa de abrir no
 * FAQ. Os atalhos continuam funcionando por clique, dentro da sessão — o que se
 * perde é o link profundo vindo de fora, que este site ainda não usa em lugar
 * nenhum.
 */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (window.location.hash !== '') {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
