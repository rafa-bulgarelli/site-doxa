import { useEffect, useRef, useState } from 'react';

/** Folga do polegar contra o topo e o pé da janela, em pixels. */
const MARGEM = 10;

/** O menor polegar aceitável. Abaixo disso ele deixa de ser pegável. */
const MINIMO = 44;

/** Quanto a barra continua acesa depois do último quadro de rolagem, em ms. */
const BRILHO = 900;

/** Quanto o polegar espera parado antes de desinchar, em ms. */
const DESINCHA = 90;

/**
 * O teto do esticão, e por que ele existe.
 *
 * Quarenta e cinco por cento a mais de altura. Sem teto, uma rolada de trackpad
 * a três mil pixels por segundo esticaria o polegar até a altura da janela — e
 * um traço de vidro cobrindo a tela inteira não lê como velocidade, lê como
 * defeito. Este número é o ponto em que a deformação ainda é reconhecível como
 * a MESMA peça, andando depressa.
 */
const ESTICAO = 0.45;

/** Onde a leitura da seção acontece: um terço abaixo do topo da janela. */
const LINHA_DE_LEITURA = 0.3;

interface Secao {
  nome: string;
  /** Distância do topo da página, em pixels. */
  topo: number;
  /** A mesma posição, como fração do que dá para rolar. */
  fracao: number;
}

/**
 * A posição de um elemento na PÁGINA, somada pela cadeia de `offsetTop`.
 *
 * E não `getBoundingClientRect`, pelo mesmo motivo que `Faq.tsx` já documenta: o
 * painel claro da comparação sobe GIRADO e só assenta perto do fim da rolagem, e
 * o rect enxerga a caixa girada — a marca dessa seção andaria a cada quadro do
 * giro. `offsetTop` é posição de layout, e transform não a toca.
 */
function topoNaPagina(el: HTMLElement): number {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

/**
 * ─── O ROLADOR: A LINHA DO TEMPO DA PÁGINA ───────────────────────────────────
 *
 * A barra de rolagem, desenhada por nós, no formato que o dono escolheu entre
 * quatro: o scrub de um player de vídeo.
 *
 * A metáfora não é enfeite — é a coisa que esta página VENDE. Um site que existe
 * para dizer "a gente entrega vídeo pronto" e cuja régua de leitura funciona
 * como a régua de um player está dizendo a mesma frase duas vezes, uma delas sem
 * texto. É também o que justifica cada peça daqui:
 *
 *  - as MARCAS são os capítulos de um vídeo, e dizem que a página tem partes
 *    antes de a pessoa ter rolado por elas;
 *  - o RÓTULO sob a mão é o que um player mostra enquanto se arrasta a cabeça de
 *    leitura, e responde "onde eu vou parar se soltar aqui";
 *  - o ESTICÃO é a única parte que não vem do player e sim do site: é a mesma
 *    borracha da entrada do "Como funciona", aplicada à velocidade da rolagem.
 *
 * ─── O QUE ELA CONTINUA NÃO FAZENDO ──────────────────────────────────────────
 *
 * Não toca na rolagem. Nenhum ouvinte de roda, nenhum `preventDefault`, nenhuma
 * inércia caseira: a roda, o teclado e o trackpad seguem sendo do navegador, e
 * esta barra só LÊ `scrollY` — só escreve quando a pessoa arrasta o polegar, que
 * é a função dele. Uma barra própria que anima a rolagem por conta é o defeito
 * clássico deste componente: o site ganha uma inércia que o resto do sistema não
 * tem, e quem usa trackpad sente na primeira rolada.
 *
 * E não faz SNAP. O dono escolheu "soltar = mola, sem snap forçado", e é a
 * escolha certa: um scrub que se recusa a parar entre dois capítulos é um
 * controle que discute com quem o está usando.
 *
 * ─── POR QUE QUASE NADA AQUI É ESTADO REACT ──────────────────────────────────
 *
 * A posição, a altura e o esticão vão direto no `style` por `ref`. Em estado,
 * cada quadro de rolagem seria um `setState` do componente que a página inteira
 * contém — sessenta re-renders por segundo para mover um retângulo de seis
 * pixels. O React não precisa saber onde está a barra; o navegador precisa.
 *
 * Estado só para as duas coisas que MUDAM DE VERDADE e raramente: a lista de
 * seções (que só muda quando um pedaço `lazy` chega) e o nome da seção atual
 * (que muda cinco vezes numa leitura inteira).
 */
export function Rolador() {
  const polegarRef = useRef<HTMLDivElement>(null);
  const marcasRef = useRef<HTMLDivElement>(null);
  const secoesRef = useRef<Secao[]>([]);
  const nomeRef = useRef<string | null>(null);

  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [atual, setAtual] = useState<string | null>(null);

  useEffect(() => {
    const polegar = polegarRef.current;
    const marcas = marcasRef.current;
    if (polegar == null || marcas == null) return;

    const doc = document.documentElement;
    let quadro = 0;
    let relogioBrilho: number | undefined;
    let relogioEsticao: number | undefined;
    let ultimoY = window.scrollY;
    let ultimoT = performance.now();

    /*
     * As marcas, lidas do DOM.
     *
     * A fonte é `data-secao` em cada `<section>`, e não uma lista escrita aqui:
     * uma lista neste arquivo seria uma segunda verdade sobre quais seções a
     * página tem, e ela envelheceria na primeira seção nova — com o sintoma
     * mais chato possível, que é uma régua mentindo baixinho.
     *
     * Relida a cada mudança de altura porque as seções são `lazy`: no primeiro
     * quadro só existe o hero, e as outras cinco chegam depois.
     */
    const medirSecoes = () => {
      const janela = window.innerHeight;
      const percorrivel = doc.scrollHeight - janela;
      if (percorrivel <= 1) return;

      const lidas: Secao[] = Array.from(
        document.querySelectorAll<HTMLElement>('[data-secao]'),
      ).map((el) => {
        const topo = topoNaPagina(el);
        return {
          nome: el.dataset.secao ?? '',
          topo,
          fracao: Math.min(1, Math.max(0, topo / percorrivel)),
        };
      });

      secoesRef.current = lidas;
      // Só re-renderiza quando a régua mudou de verdade. Sem esta comparação, o
      // `ResizeObserver` reagiria a cada pixel de altura da página com um
      // re-render da lista inteira.
      setSecoes((antigas) =>
        antigas.length === lidas.length &&
        antigas.every((a, i) => a.nome === lidas[i]?.nome && a.fracao === lidas[i]?.fracao)
          ? antigas
          : lidas,
      );
    };

    const desenhar = () => {
      quadro = 0;
      const janela = window.innerHeight;
      const total = doc.scrollHeight;
      const percorrivel = total - janela;

      /* Página que cabe na tela não tem barra. `display` e não `opacity`: um
         elemento invisível na frente da borda direita ainda pega o clique.

         E `flex`, não `block`: a cápsula centra o vidro por flexbox, e `block`
         deixaria o `::before` como caixa inline — largura e altura viram
         sugestões ignoradas, e o vidro some. */
      if (percorrivel <= 1) {
        polegar.style.display = 'none';
        marcas.style.display = 'none';
        return;
      }
      polegar.style.display = 'flex';
      marcas.style.display = 'block';

      const pista = janela - MARGEM * 2;
      const altura = Math.max(MINIMO, pista * (janela / total));
      const andar = pista - altura;
      const progresso = Math.min(1, Math.max(0, window.scrollY / percorrivel));

      polegar.style.height = `${altura}px`;
      polegar.style.transform = `translateY(${MARGEM + progresso * andar}px)`;

      /* As marcas moram numa camada própria e são posicionadas em `calc`, com o
         andar e o meio-polegar entregues como variáveis. É o que permite a
         régua inteira acompanhar uma mudança de altura da janela sem re-render:
         o React já escreveu a fração de cada marca no `top` dela, e aqui só se
         atualizam os dois números que essa conta consome. */
      marcas.style.setProperty('--andar', `${andar}px`);
      marcas.style.setProperty('--meio', `${altura / 2}px`);

      /* ─── O ESTICÃO ────────────────────────────────────────────────────────
       *
       * Velocidade em pixels por milissegundo, medida entre dois quadros. O
       * polegar cresce no eixo em que anda e encolhe no outro na mesma
       * proporção: é assim que borracha se comporta, e é o que separa "a peça
       * esticou" de "a peça ficou maior". A conta do encolhimento é feita no
       * CSS a partir desta mesma variável, para os dois nunca saírem de fase.
       *
       * Só a IDA estica. Desinchar é trabalho da transição elástica lá do CSS,
       * e é ela que dá o "boing" de chegada — por isso o relógio abaixo devolve
       * o valor a 1 assim que a rolagem para, em vez de interpolar aqui.
       */
      const agora = performance.now();
      const dt = agora - ultimoT;
      if (dt > 0) {
        const velocidade = Math.abs(window.scrollY - ultimoY) / dt;
        const estica = 1 + Math.min(ESTICAO, velocidade / 10);
        polegar.style.setProperty('--estica', estica.toFixed(3));
        ultimoY = window.scrollY;
        ultimoT = agora;
        window.clearTimeout(relogioEsticao);
        relogioEsticao = window.setTimeout(
          () => polegar.style.setProperty('--estica', '1'),
          DESINCHA,
        );
      }

      /* Qual seção está sendo lida. A linha de leitura fica um terço abaixo do
         topo da janela, e não no topo: com a leitura no topo, a seção "muda" no
         instante em que a anterior ainda ocupa dois terços da tela — o rótulo
         diria uma coisa e o olho estaria vendo outra. */
      const linha = window.scrollY + janela * LINHA_DE_LEITURA;
      let nome: string | null = null;
      for (const secao of secoesRef.current) {
        if (secao.topo <= linha) nome = secao.nome;
      }
      if (nome !== nomeRef.current) {
        nomeRef.current = nome;
        setAtual(nome);
      }
    };

    /* A barra acende enquanto a página anda e se apaga sozinha depois. É o que
       a mantém discreta: parada, é uma lasca de vidro; em movimento, é a régua
       que diz onde a pessoa está. A classe some por CSS, não por desmontagem —
       o polegar precisa continuar no lugar para o hover reacender. */
    const acender = () => {
      polegar.classList.add('rolador-aceso');
      marcas.classList.add('rolador-aceso');
      window.clearTimeout(relogioBrilho);
      relogioBrilho = window.setTimeout(() => {
        polegar.classList.remove('rolador-aceso');
        marcas.classList.remove('rolador-aceso');
      }, BRILHO);
    };

    const aoRolar = () => {
      acender();
      if (quadro === 0) quadro = window.requestAnimationFrame(desenhar);
    };

    /*
     * O ARRASTO — a cabeça de leitura.
     *
     * `setPointerCapture` e não ouvintes no documento: com a captura, o ponteiro
     * continua entregando os eventos a este elemento mesmo quando o cursor sai
     * dele — que é o caso normal, porque quem arrasta uma barra de seis pixels
     * sai dela na primeira sacudida. Sem isso, o arrasto morre no meio.
     *
     * `scroll-behavior: smooth` é desligado durante o arrasto e devolvido no
     * fim. O site inteiro rola macio, e isso é bom para um clique em âncora e
     * péssimo aqui: cada pixel de arrasto viraria uma animação começando, e a
     * página andaria atrás da mão com um atraso elástico. Devolver no fim é
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
      marcas.classList.add('rolador-aceso');
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
       decodificando. Com `resize` só, a régua ficaria errada até a pessoa rolar
       de novo — e as marcas apontariam para o lugar errado, que é pior do que
       não ter marca nenhuma. */
    const olho = new ResizeObserver(() => {
      medirSecoes();
      desenhar();
    });
    olho.observe(doc);

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', desenhar);
    polegar.addEventListener('pointerdown', aoPegar);
    polegar.addEventListener('pointermove', aoArrastar);
    polegar.addEventListener('pointerup', aoSoltar);
    polegar.addEventListener('pointercancel', aoSoltar);
    medirSecoes();
    desenhar();

    return () => {
      window.cancelAnimationFrame(quadro);
      window.clearTimeout(relogioBrilho);
      window.clearTimeout(relogioEsticao);
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

  /* `aria-hidden` nas duas camadas, e sem papel de `scrollbar`: esta barra não
     acrescenta nada a quem não a vê. A rolagem por teclado é do navegador e não
     passa por aqui, e anunciar um "controle deslizante" que não responde a seta
     nenhuma seria prometer uma interação que não existe. */
  return (
    <>
      <div ref={marcasRef} aria-hidden className="rolador-marcas">
        {secoes.map((secao) => (
          <span
            key={secao.nome}
            className={`rolador-marca${secao.nome === atual ? ' rolador-marca-aqui' : ''}`}
            style={{ top: `calc(${MARGEM}px + var(--andar, 0px) * ${secao.fracao} + var(--meio, 0px))` }}
          />
        ))}
      </div>

      <div ref={polegarRef} aria-hidden className="rolador">
        <span className="rolador-rotulo">{atual}</span>
      </div>
    </>
  );
}
