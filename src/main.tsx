import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { deveManterFragmento, tipoDeNavegacao } from './fragmento';
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
 * O preço era real e deixou de ser aceitável: um link com `#forms` não abria no
 * formulário. Isso valia enquanto o link profundo vindo de fora não existia —
 * agora existe. Cada página de `/solucoes` e `/guias` fecha num botão "Falar com
 * a Doxa" que aponta para `/#forms`, e apagar o fragmento dele jogava no topo da
 * home justamente quem tinha acabado de pedir o formulário.
 *
 * A regra ficou de um tamanho só: apaga quando o fragmento é HERANÇA (reload,
 * voltar/avançar, ou navegador que não sabe dizer) e mantém quando ele é
 * INTENÇÃO (navegação nova). Quem decide é `fragmento.ts`, que é puro e testado
 * nas cinco combinações; aqui em cima só se pergunta ao navegador como a página
 * abriu.
 *
 * `window.scrollTo(0, 0)` continua INCONDICIONAL. Mantido o fragmento, o alvo
 * (`#forms`, na comparação `lazy`) ainda não existe no documento, então não há
 * salto do navegador para respeitar — quem rola é o `App`, com animação, quando
 * a seção monta. Começar do topo e descer é o que se vê; começar no meio seria
 * o defeito que este bloco existe para impedir.
 */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
const tipoDaVisita = tipoDeNavegacao(performance.getEntriesByType('navigation'));
if (!deveManterFragmento(tipoDaVisita, window.location.hash)) {
  if (window.location.hash !== '') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}
window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
