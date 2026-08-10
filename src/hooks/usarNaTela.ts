import { useEffect, useState } from 'react';

/**
 * ─── QUEM ESTÁ NA TELA ───────────────────────────────────────────────────────
 *
 * Devolve se o elemento está visível, para quem anima poder PARAR quando não
 * está.
 *
 * ─── POR QUE ISTO EXISTE ─────────────────────────────────────────────────────
 *
 * A página é uma coluna longa com seis seções, e todas ficam MONTADAS depois de
 * carregadas: o `lazy` do `App` adia a chegada delas, não a saída. Sem um freio,
 * cada relógio, cada mola e cada `requestAnimationFrame` continua trabalhando
 * para sempre, mesmo com o dono do movimento a oito mil pixels de distância.
 *
 * O preço disso foi MEDIDO num telefone com a CPU quatro vezes mais lenta, com o
 * formulário aberto e ninguém tocando em nada:
 *
 *     52% da CPU ocupada · 112 layouts e 489 recálculos de estilo em 4s
 *
 *     2341 mutações  as letras do exemplo se escrevendo sozinhas   (no FAQ)
 *      476 mutações  a barra do relógio dos cases                  (no HERO)
 *      300 mutações  o cursor piscando do mesmo exemplo            (no FAQ)
 *      182 mutações  a palavra girando do título                   (no HERO)
 *      107 mutações  a prova alternando                            (no FORM)
 *
 * Nada disso estava na tela. Metade de um telefone queimada desenhando coisas
 * que ninguém podia ver — e é essa metade que faltava para digitar sem travar.
 *
 * ─── A MARGEM ────────────────────────────────────────────────────────────────
 *
 * `margem` é o quanto ANTES da borda a coisa volta a andar. Não é enfeite: um
 * movimento que só arranca quando já está visível arranca À VISTA, e uma palavra
 * que gira no instante em que aparece denuncia o truque. Meia tela de
 * antecedência devolve o movimento já em curso, que é como ele sempre esteve.
 *
 * ─── O QUE ELE NÃO É ─────────────────────────────────────────────────────────
 *
 * Não é um gatilho de "apareceu uma vez". Ele liga e desliga quantas vezes for
 * preciso, porque a pergunta que ele responde é do presente: "vale a pena gastar
 * CPU com isto AGORA?". Para revelar algo uma vez só, o certo é o `whileInView`
 * do framer-motion, que já está no bundle.
 */
export function usarNaTela(alvo: Element | null, margem = '50%'): boolean {
  /*
   * Começa LIGADO, e é deliberado.
   *
   * O observador só responde um quadro depois de montado. Começando desligado,
   * tudo que nasce visível — o hero, no primeiro desenho da página — fica parado
   * nesse quadro e arranca em seguida, à vista de quem acabou de chegar. O custo
   * de começar ligado é um quadro de trabalho para quem nasce fora da tela, e
   * esse ninguém vê.
   */
  const [naTela, setNaTela] = useState(true);

  useEffect(() => {
    if (alvo == null) return;
    /* Sem `IntersectionObserver` (navegador antigo), tudo continua andando como
       antes: é a resposta certa quando não dá para saber — parar o que talvez
       esteja na tela é um defeito visível, e gastar CPU é só um custo. */
    if (typeof IntersectionObserver === 'undefined') return;

    const olho = new IntersectionObserver(
      ([entrada]) => setNaTela(entrada?.isIntersecting ?? true),
      { rootMargin: margem },
    );
    olho.observe(alvo);
    return () => olho.disconnect();
  }, [alvo, margem]);

  return naTela;
}
