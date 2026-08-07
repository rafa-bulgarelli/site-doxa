import { useEffect, useRef } from 'react';

/** Folga do polegar contra o topo e o pé da janela, em pixels. */
const MARGEM = 10;

/** O menor polegar aceitável. Abaixo disso ele deixa de ser pegável. */
const MINIMO = 44;

/** Quanto a barra continua acesa depois do último quadro de rolagem, em ms. */
const BRILHO = 900;

/**
 * ─── O ROLADOR ───────────────────────────────────────────────────────────────
 *
 * A barra de rolagem da página, desenhada por nós, a pedido do dono: vidro
 * líquido, sem trilho, e viva.
 *
 * ─── POR QUE ELA NÃO É MAIS A NATIVA ─────────────────────────────────────────
 *
 * A barra do navegador aceita cor, canto e borda — e nada além. `backdrop-filter`
 * não se aplica a `::-webkit-scrollbar-thumb` em navegador nenhum, e sem ele não
 * existe vidro: o que faz um objeto parecer vidro é ele DESFOCAR o que está
 * atrás, e a barra nativa não tem "atrás". Um branco translúcido com borda clara
 * é uma imitação de vidro, e a diferença aparece exatamente onde ela passa por
 * cima de um vídeo do rodapé.
 *
 * E ela paga a conta que a nativa cobrava: com uma barra própria, a do sistema é
 * escondida, a página recupera os 10px de largura que a customização anterior
 * reservava para sempre, e o "sem trilho" do pedido vira o estado natural — não
 * há o que esconder, porque só existe o polegar.
 *
 * ─── O QUE ELA NÃO FAZ ───────────────────────────────────────────────────────
 *
 * Não toca na rolagem. Nenhum ouvinte de roda, nenhum `preventDefault`, nenhuma
 * rolagem simulada: a roda, o teclado, o trackpad e o `#âncora` continuam sendo
 * do navegador, e esta barra só LÊ `scrollY` para se posicionar. A única coisa
 * que ela escreve é quando a pessoa arrasta o polegar — que é a função dele.
 *
 * Uma barra própria que anima a rolagem por conta ("smooth scroll" caseiro) é o
 * defeito clássico deste componente: o site fica com uma inércia que o resto do
 * sistema operacional não tem, e quem usa trackpad sente na hora.
 *
 * ─── POR QUE NÃO HÁ ESTADO REACT AQUI ────────────────────────────────────────
 *
 * A posição é escrita direto no `style` do elemento, por `ref`. Em estado, cada
 * quadro de rolagem seria um `setState` — sessenta re-renders por segundo de um
 * componente que a página inteira contém, para mover um retângulo de seis
 * pixels. O React não precisa saber onde está a barra; o navegador precisa.
 *
 * `requestAnimationFrame` para não escrever duas vezes no mesmo quadro: o evento
 * de rolagem dispara mais vezes do que a tela desenha.
 */
export function Rolador() {
  const polegarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const polegar = polegarRef.current;
    if (polegar == null) return;

    const doc = document.documentElement;
    let quadro = 0;
    let relogio: number | undefined;

    /* A conta inteira, num lugar só. Ela roda a cada quadro de rolagem e a cada
       mudança de tamanho — e é de propósito que nada dela seja guardado entre
       uma chamada e outra: a altura do documento muda quando uma seção `lazy`
       chega, quando o FAQ abre uma resposta e quando o telefone gira, e um
       valor medido uma vez estaria errado em todos esses momentos. */
    const desenhar = () => {
      quadro = 0;
      const janela = window.innerHeight;
      const total = doc.scrollHeight;
      const percorrivel = total - janela;

      /* Página que cabe na tela não tem barra. `display` e não `opacity`: um
         elemento invisível na frente da borda direita ainda pega o clique.

         E `flex` de volta, não `block`: a cápsula centra o vidro por flexbox, e
         `block` deixaria o `::before` como caixa inline — largura e altura
         viram sugestões ignoradas, e o vidro some. */
      if (percorrivel <= 1) {
        polegar.style.display = 'none';
        return;
      }
      polegar.style.display = 'flex';

      const pista = janela - MARGEM * 2;
      const altura = Math.max(MINIMO, pista * (janela / total));
      const andar = pista - altura;
      const progresso = Math.min(1, Math.max(0, window.scrollY / percorrivel));

      polegar.style.height = `${altura}px`;
      polegar.style.transform = `translateY(${MARGEM + progresso * andar}px)`;
    };

    /* A barra acende enquanto a página anda e se apaga sozinha depois. É o
       "interativo" do pedido, e também o que a mantém discreta: parada, ela é
       uma lasca de vidro; em movimento, ela é a régua que diz onde a pessoa
       está. A classe some por CSS, não por desmontagem — o polegar precisa
       continuar no lugar para o hover reacender. */
    const acender = () => {
      polegar.classList.add('rolador-aceso');
      window.clearTimeout(relogio);
      relogio = window.setTimeout(() => polegar.classList.remove('rolador-aceso'), BRILHO);
    };

    const aoRolar = () => {
      acender();
      if (quadro === 0) quadro = window.requestAnimationFrame(desenhar);
    };

    /*
     * O ARRASTO.
     *
     * `setPointerCapture` e não ouvintes no documento: com a captura, o ponteiro
     * continua entregando os eventos a este elemento mesmo quando o cursor sai
     * dele — que é o caso normal, porque quem arrasta uma barra de seis pixels
     * sai dela na primeira sacudida. Sem isso, o arrasto morre no meio.
     *
     * `scroll-behavior: smooth` é desligado durante o arrasto e devolvido no
     * fim. O site inteiro rola macio, e isso é bom para um clique em âncora e
     * péssimo aqui: cada pixel de arrasto viraria uma animação começando, e a
     * barra andaria atrás da mão com um atraso elástico. Devolver no fim é
     * obrigatório, senão o primeiro arrasto tira o macio do site para sempre.
     */
    let arrastando = false;
    let mouseNoInicio = 0;
    let rolagemNoInicio = 0;

    const aoPegar = (evento: PointerEvent) => {
      arrastando = true;
      mouseNoInicio = evento.clientY;
      rolagemNoInicio = window.scrollY;
      polegar.setPointerCapture(evento.pointerId);
      polegar.classList.add('rolador-preso');
      doc.style.scrollBehavior = 'auto';
      evento.preventDefault();
    };

    const aoArrastar = (evento: PointerEvent) => {
      if (!arrastando) return;
      const janela = window.innerHeight;
      const total = doc.scrollHeight;
      const pista = janela - MARGEM * 2;
      const altura = Math.max(MINIMO, pista * (janela / total));
      const andar = pista - altura;
      if (andar <= 0) return;

      // A regra de três que faz a página seguir a mão: o quanto o polegar pode
      // andar cobre o quanto a página pode rolar.
      const fator = (total - janela) / andar;
      window.scrollTo(0, rolagemNoInicio + (evento.clientY - mouseNoInicio) * fator);
      acender();
    };

    const aoSoltar = (evento: PointerEvent) => {
      if (!arrastando) return;
      arrastando = false;
      polegar.releasePointerCapture(evento.pointerId);
      polegar.classList.remove('rolador-preso');
      doc.style.scrollBehavior = '';
    };

    /* `ResizeObserver` no `<html>`, e não um ouvinte de `resize` da janela: o
       que muda a altura do documento quase nunca é a janela mudando de tamanho.
       É uma seção `lazy` chegando, uma resposta do FAQ abrindo, uma imagem
       decodificando. Com `resize` só, a barra ficaria do tamanho errado até a
       pessoa rolar de novo. */
    const olho = new ResizeObserver(() => desenhar());
    olho.observe(doc);

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', desenhar);
    polegar.addEventListener('pointerdown', aoPegar);
    polegar.addEventListener('pointermove', aoArrastar);
    polegar.addEventListener('pointerup', aoSoltar);
    polegar.addEventListener('pointercancel', aoSoltar);
    desenhar();

    return () => {
      window.cancelAnimationFrame(quadro);
      window.clearTimeout(relogio);
      olho.disconnect();
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', desenhar);
      polegar.removeEventListener('pointerdown', aoPegar);
      polegar.removeEventListener('pointermove', aoArrastar);
      polegar.removeEventListener('pointerup', aoSoltar);
      polegar.removeEventListener('pointercancel', aoSoltar);
      doc.style.scrollBehavior = '';
    };
  }, []);

  /* `aria-hidden` e sem papel de `scrollbar`: esta barra não acrescenta nada a
     quem não a vê. A rolagem por teclado é do navegador e não passa por aqui, e
     anunciar um "controle deslizante" que não responde a seta nenhuma seria
     prometer uma interação que não existe. */
  return <div ref={polegarRef} aria-hidden className="rolador" />;
}
