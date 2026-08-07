import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';

/** Folga da barra contra o topo e o pé da janela, em pixels. */
const MARGEM = 10;

/** A menor barra aceitável, no estado dormindo. Abaixo disso não se pega. */
const MINIMO = 44;

/** Quanto a barra continua acesa depois do último quadro de rolagem, em ms. */
const BRILHO = 900;

/** Quanto ela espera parada antes de desinchar do esticão, em ms. */
const DESINCHA = 90;

/**
 * O teto do esticão.
 *
 * Quarenta e cinco por cento a mais de altura. Sem teto, uma rolada de trackpad
 * a três mil pixels por segundo esticaria a barra até a altura da janela — e um
 * traço cobrindo a tela inteira não lê como velocidade, lê como defeito.
 */
const ESTICAO = 0.45;

/**
 * ─── OS TRÊS ESTADOS, E O QUE DISPARA CADA UM ────────────────────────────────
 *
 * DORMINDO. Em repouso ela é uma barra de rolagem e nada mais: cinza, fina,
 * discreta — a primeira foto da referência. É a forma padrão, e é para ela que a
 * peça sempre volta.
 *
 * ACORDADA. Enquanto a página anda, ela vira a pílula preta com o disco e a
 * porcentagem — a segunda foto.
 *
 * ABERTA. Com a mão parada em cima, incha no painel inteiro.
 *
 * ─── O QUE ACORDA, E O QUE FAZ DORMIR ────────────────────────────────────────
 *
 * O gatilho é o MOVIMENTO, e não a posição na página. Foi assim que o dono
 * pediu, e é a regra certa: uma régua de leitura tem função enquanto a leitura
 * anda; parada no meio da página, ela é um objeto preto ocupando a borda da tela
 * sem nada para dizer. Rolou, acorda; parou por um segundo, volta a ser barra.
 *
 * O hover também segura acordada — senão a peça dormiria debaixo da mão de quem
 * está justamente indo abri-la.
 *
 * A espera antes de abrir é o que mantém a barra sendo duas coisas ao mesmo
 * tempo: ela é a alça de arrastar E a porta do painel. Abrindo no primeiro pixel
 * de hover, deixaria de ser alça — ninguém agarra uma coisa que vira outra
 * quando a mão chega perto. Um `pointerdown` durante a espera cancela e vira
 * arrasto: quem apertou já disse o que queria.
 */
const DORMIR = 1100;
const VIVA_ALTURA = 148;

/**
 * A altura do painel, e ela é uma CONTA e não um gosto.
 *
 * O botão estava saindo pela borda de baixo porque a soma do conteúdo passava da
 * altura fixa. Somando o que a caixa precisa conter, com 236 de largura: 28 de
 * recuo, 208 da capa (que é quadrada e ocupa a largura útil inteira), 37 dos
 * dois textos, 3 da trilha, 46 do botão e 36 dos três vãos. Dá 358.
 *
 * Quem mexer em qualquer medida do painel refaz esta conta — ou o `min-height:
 * 0` do CSS entra em ação, a capa encolhe para caber e deixa de ser quadrada,
 * que é o sintoma de que este número ficou pequeno.
 */
const ILHA_ALTURA = 358;
const ILHA_ESPERA = 220;

/** Onde a leitura da seção acontece: um terço abaixo do topo da janela. */
const LINHA_DE_LEITURA = 0.3;

/** Onde o botão leva. É a mesma âncora do fecho do rodapé e do escape do FAQ. */
const DESTINO = 'pedido';

/**
 * A posição de um elemento na PÁGINA, somada pela cadeia de `offsetTop`.
 *
 * E não `getBoundingClientRect`, pelo mesmo motivo que `Faq.tsx` já documenta: o
 * painel claro da comparação sobe GIRADO e só assenta perto do fim da rolagem, e
 * o rect enxerga a caixa girada — o nome da seção trocaria a cada quadro do giro.
 * `offsetTop` é posição de layout, e transform não a toca.
 */
function topoNaPagina(el: HTMLElement): number {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

/**
 * ─── A ILHA ──────────────────────────────────────────────────────────────────
 *
 * A barra de rolagem da página, desenhada por nós, no formato que o dono trouxe:
 * a ilha lateral que alguns utilitários de macOS colam na borda da tela.
 *
 * ─── POR QUE ELA NÃO É MAIS A NATIVA ─────────────────────────────────────────
 *
 * `::-webkit-scrollbar` aceita cor, canto e borda, e nada além. Nada do que está
 * aqui — inchar, abrir, mostrar texto, aceitar um clique — existe naquela API.
 * E trocar por uma barra própria devolveu à página os dez pixels de largura que
 * a versão nativa custava: no macOS a barra é flutuante, e a primeira regra de
 * `::-webkit-scrollbar` faz o navegador desistir do flutuante e reservar a
 * coluna dela para sempre.
 *
 * ─── O QUE ELA NÃO FAZ ───────────────────────────────────────────────────────
 *
 * Não toca na rolagem. Nenhum ouvinte de roda, nenhum `preventDefault`, nenhuma
 * inércia caseira: a roda, o teclado e o trackpad seguem sendo do navegador, e
 * esta barra só LÊ `scrollY` — só escreve quando a pessoa arrasta, que é a
 * função da alça. Uma barra própria que anima a rolagem por conta é o defeito
 * clássico deste componente: o site ganha uma inércia que o resto do sistema não
 * tem, e quem usa trackpad sente na primeira rolada.
 *
 * ─── POR QUE QUASE NADA AQUI É ESTADO REACT ──────────────────────────────────
 *
 * Posição, altura, esticão e porcentagem vão direto no `style` e no
 * `textContent` por `ref`. Em estado, cada quadro de rolagem seria um `setState`
 * do componente que a página inteira contém — sessenta re-renders por segundo
 * para mover um retângulo e trocar dois dígitos.
 *
 * Estado só para o que muda de verdade e raramente: dormindo/acordada, aberta, e
 * o nome da seção (que muda cinco vezes numa leitura inteira).
 */
export function Rolador() {
  const barraRef = useRef<HTMLDivElement>(null);
  const pctVivaRef = useRef<HTMLSpanElement>(null);
  const pctCapaRef = useRef<HTMLSpanElement>(null);
  const progressoRef = useRef<HTMLSpanElement>(null);
  const secoesRef = useRef<{ nome: string; topo: number }[]>([]);
  const nomeRef = useRef<string | null>(null);

  const [atual, setAtual] = useState<string | null>(null);
  const [acordada, setAcordada] = useState(false);
  const [aberta, setAberta] = useState(false);

  /* Os dois estados são lidos DENTRO do efeito, que roda uma vez só. Em
     dependência, o efeito inteiro — ouvintes, observador, medidas — seria
     desmontado e remontado a cada abrir e fechar. */
  const acordadaRef = useRef(false);
  const abertaRef = useRef(false);
  acordadaRef.current = acordada;
  abertaRef.current = aberta;

  useEffect(() => {
    const barra = barraRef.current;
    if (barra == null) return;

    const doc = document.documentElement;
    let quadro = 0;
    let relogioBrilho: number | undefined;
    let relogioEsticao: number | undefined;
    let ultimoY = window.scrollY;
    let ultimoT = performance.now();

    /*
     * As seções, lidas do DOM pelo `data-secao` de cada `<section>`.
     *
     * A fonte é o próprio elemento, e não uma lista escrita aqui: uma lista
     * neste arquivo seria uma segunda verdade sobre quais seções a página tem, e
     * ela envelheceria na primeira seção nova — com o sintoma mais chato
     * possível, que é uma régua mentindo baixinho.
     *
     * Relida a cada mudança de altura porque as seções são `lazy`: no primeiro
     * quadro só existe o hero, e as outras cinco chegam depois.
     */
    const medirSecoes = () => {
      secoesRef.current = Array.from(document.querySelectorAll<HTMLElement>('[data-secao]')).map(
        (el) => ({ nome: el.dataset.secao ?? '', topo: topoNaPagina(el) }),
      );
    };

    const desenhar = () => {
      quadro = 0;
      const janela = window.innerHeight;
      const total = doc.scrollHeight;
      const percorrivel = total - janela;

      /* Página que cabe na tela não tem barra. `display` e não `opacity`: um
         elemento invisível na frente da borda direita ainda pega o clique.

         E `flex`, não `block`: a cápsula centra o corpo por flexbox, e `block`
         deixaria o `::before` como caixa inline — largura e altura viram
         sugestões ignoradas, e a pílula some. */
      if (percorrivel <= 1) {
        barra.style.display = 'none';
        return;
      }
      barra.style.display = 'flex';

      const progresso = Math.min(1, Math.max(0, window.scrollY / percorrivel));
      const pista = janela - MARGEM * 2;

      /* A altura é o estado. Dormindo, ela é proporcional — é uma barra de
         rolagem, e o tamanho dela diz quanto da página cabe na tela. Acordada e
         aberta, passa a ser fixa: a pílula tem conteúdo dentro, e uma caixa de
         texto que muda de altura conforme o comprimento da página seria ilegível
         numa e vazia na outra. O que informa a posição, aí, é a porcentagem. */
      const alturaDormindo = Math.max(MINIMO, pista * (janela / total));
      const altura = abertaRef.current
        ? ILHA_ALTURA
        : acordadaRef.current
          ? VIVA_ALTURA
          : alturaDormindo;

      /* Aberta e acordada, ela é CENTRADA na posição que teria como barra — é
         dali que ela cresce, e é o que faz o inchaço parecer a mesma peça em vez
         de um cartão novo. E é presa dentro da janela: a barra mora no topo no
         começo da página e no pé no fim, e sem o limite metade do painel abriria
         para fora da tela justamente nos dois lugares onde ele tem mais chance
         de ser aberto. */
      const topoDormindo = MARGEM + progresso * (pista - alturaDormindo);
      const centro = topoDormindo + alturaDormindo / 2 - altura / 2;
      /* O teto pode ficar ABAIXO do piso numa janela mais baixa que o painel —
         e aí o `Math.min` devolveria um valor negativo, jogando a ilha para fora
         pelo topo. Encostar na margem é a resposta certa nesse caso: ela
         transborda por baixo, que é onde há a barra de serviço do rodapé e não o
         começo de uma leitura. */
      const teto = Math.max(MARGEM, janela - altura - MARGEM);
      const topo =
        altura === alturaDormindo
          ? topoDormindo
          : Math.min(Math.max(centro, MARGEM), teto);

      barra.style.height = `${altura}px`;
      barra.style.transform = `translateY(${topo}px)`;

      /* A porcentagem, escrita no nó e não em estado. Os dois lugares que a
         mostram — a pílula acordada e a capa do painel — recebem o mesmo texto,
         de uma conta só: dois cálculos separados para o mesmo número é como eles
         acabam divergindo num arredondamento. */
      const lido = `${Math.round(progresso * 100)}%`;
      if (pctVivaRef.current != null) pctVivaRef.current.textContent = lido;
      if (pctCapaRef.current != null) pctCapaRef.current.textContent = lido;
      if (progressoRef.current != null) progressoRef.current.style.width = lido;

      /* ─── O ESTICÃO ────────────────────────────────────────────────────────
       *
       * Velocidade em pixels por milissegundo, medida entre dois quadros. A
       * peça cresce no eixo em que anda e encolhe no outro na mesma proporção:
       * é assim que borracha se comporta, e é o que separa "esticou" de "ficou
       * maior". O encolhimento é calculado no CSS a partir desta mesma
       * variável, para os dois nunca saírem de fase.
       *
       * Só enquanto ela DORME. Acordada, a pílula tem texto dentro, e um bloco
       * de texto que se deforma ao rolar é um cartaz tremendo.
       */
      const agora = performance.now();
      const dt = agora - ultimoT;
      if (dt > 0 && !acordadaRef.current && !abertaRef.current) {
        const velocidade = Math.abs(window.scrollY - ultimoY) / dt;
        const estica = 1 + Math.min(ESTICAO, velocidade / 10);
        barra.style.setProperty('--estica', estica.toFixed(3));
        window.clearTimeout(relogioEsticao);
        relogioEsticao = window.setTimeout(() => barra.style.setProperty('--estica', '1'), DESINCHA);
      }
      ultimoY = window.scrollY;
      ultimoT = agora;

      /* Qual seção está sendo lida. A linha de leitura fica um terço abaixo do
         topo da janela, e não no topo: com a leitura no topo, a seção "muda" no
         instante em que a anterior ainda ocupa dois terços da tela — o painel
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

    /* Ela acende enquanto a página anda e se apaga sozinha depois. É o que a
       mantém discreta: parada, é uma lasca na borda; em movimento, é a régua que
       diz onde a pessoa está. */
    const acender = () => {
      barra.classList.add('rolador-aceso');
      window.clearTimeout(relogioBrilho);
      relogioBrilho = window.setTimeout(() => barra.classList.remove('rolador-aceso'), BRILHO);
    };

    /*
     * ─── O SONO ────────────────────────────────────────────────────────────
     *
     * Duas condições seguram a peça acordada, e nenhuma delas é posição: a
     * página ter andado há pouco, e a mão estar em cima. A primeira é o pedido
     * do dono — parou de descer, volta a ser barra de rolagem; a segunda existe
     * porque sem ela a peça dormiria debaixo da mão de quem está indo abri-la,
     * encolhendo de quarenta e seis pixels para oito com o ponteiro dentro.
     *
     * `avaliar` é chamada de todos os lados (rolagem, relógio, entrada e saída
     * do ponteiro) em vez de cada um mexer no estado por conta. Com quatro
     * donos escrevendo a mesma chave, é questão de tempo até dois discordarem —
     * e o sintoma seria uma barra que fica presa acordada depois que a página
     * parou, sem ninguém para desligá-la.
     */
    let rolouAgora = false;
    let sobre = false;
    let relogioSono: number | undefined;

    const avaliarSono = () => {
      const deve = rolouAgora || sobre || abertaRef.current;
      if (deve === acordadaRef.current) return;
      acordadaRef.current = deve;
      setAcordada(deve);
      // Dormindo, não há painel: ele é a terceira forma da mesma peça, e uma
      // caixa de trezentos pixels pendurada numa barra de oito não é forma
      // nenhuma.
      if (!deve && abertaRef.current) {
        abertaRef.current = false;
        setAberta(false);
      }
      desenhar();
    };

    const aoRolar = () => {
      acender();
      rolouAgora = true;
      avaliarSono();
      window.clearTimeout(relogioSono);
      relogioSono = window.setTimeout(() => {
        rolouAgora = false;
        avaliarSono();
      }, DORMIR);
      if (quadro === 0) quadro = window.requestAnimationFrame(desenhar);
    };

    /*
     * O ARRASTO.
     *
     * `setPointerCapture` e não ouvintes no documento: com a captura, o ponteiro
     * continua entregando os eventos a este elemento mesmo quando o cursor sai
     * dele — que é o caso normal, porque quem arrasta uma barra de oito pixels
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
    let relogioIlha: number | undefined;

    /* A mão chegando acorda na hora e agenda a abertura. Acordar primeiro não é
       detalhe: a ilha cresce a partir da PÍLULA, e abrir direto de uma barra de
       oito pixels seria a mesma animação sem o passo do meio — que é justamente
       o que a referência mostra. */
    const abrirIlha = () => {
      sobre = true;
      avaliarSono();
      window.clearTimeout(relogioIlha);
      if (arrastando || abertaRef.current) return;
      relogioIlha = window.setTimeout(() => {
        if (arrastando) return;
        abertaRef.current = true;
        setAberta(true);
        desenhar();
      }, ILHA_ESPERA);
    };

    const fecharIlha = () => {
      sobre = false;
      window.clearTimeout(relogioIlha);
      if (abertaRef.current) {
        abertaRef.current = false;
        setAberta(false);
      }
      // Depois de fechar, e não antes: `avaliarSono` lê `abertaRef` para decidir,
      // e chamada com o painel ainda aberto ela concluiria que a peça precisa
      // continuar acordada.
      avaliarSono();
      desenhar();
    };

    const aoPegar = (evento: PointerEvent) => {
      window.clearTimeout(relogioIlha);
      // Aberta, a cápsula é um painel com um botão dentro. Arrastar um painel
      // pelo texto dele levaria a página junto no primeiro clique errado.
      if (abertaRef.current) return;
      arrastando = true;
      mouseNoInicio = evento.clientY;
      rolagemNoInicio = window.scrollY;
      barra.setPointerCapture(evento.pointerId);
      barra.classList.add('rolador-preso');
      doc.style.scrollBehavior = 'auto';
      evento.preventDefault();
    };

    const aoArrastar = (evento: PointerEvent) => {
      if (!arrastando) return;
      const janela = window.innerHeight;
      const total = doc.scrollHeight;
      const pista = janela - MARGEM * 2;
      const altura = acordadaRef.current
        ? VIVA_ALTURA
        : Math.max(MINIMO, pista * (janela / total));
      const andar = pista - altura;
      if (andar <= 0) return;

      // A regra de três que faz a página seguir a mão: o quanto a peça pode
      // andar cobre o quanto a página pode rolar.
      const fator = (total - janela) / andar;
      window.scrollTo(0, rolagemNoInicio + (evento.clientY - mouseNoInicio) * fator);
      acender();
    };

    const aoSoltar = (evento: PointerEvent) => {
      if (!arrastando) return;
      arrastando = false;
      barra.releasePointerCapture(evento.pointerId);
      barra.classList.remove('rolador-preso');
      doc.style.scrollBehavior = '';
    };

    /* `ResizeObserver` no `<html>`, e não um ouvinte de `resize` da janela: o
       que muda a altura do documento quase nunca é a janela mudando de tamanho.
       É uma seção `lazy` chegando, uma resposta do FAQ abrindo, uma imagem
       decodificando. Com `resize` só, a régua ficaria errada até a pessoa rolar
       de novo. */
    const olho = new ResizeObserver(() => {
      medirSecoes();
      desenhar();
    });
    olho.observe(doc);

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', desenhar);
    barra.addEventListener('pointerdown', aoPegar);
    barra.addEventListener('pointermove', aoArrastar);
    barra.addEventListener('pointerup', aoSoltar);
    barra.addEventListener('pointercancel', aoSoltar);
    barra.addEventListener('pointerenter', abrirIlha);
    barra.addEventListener('pointerleave', fecharIlha);
    medirSecoes();
    desenhar();

    return () => {
      window.cancelAnimationFrame(quadro);
      window.clearTimeout(relogioBrilho);
      window.clearTimeout(relogioEsticao);
      window.clearTimeout(relogioIlha);
      window.clearTimeout(relogioSono);
      olho.disconnect();
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', desenhar);
      barra.removeEventListener('pointerdown', aoPegar);
      barra.removeEventListener('pointermove', aoArrastar);
      barra.removeEventListener('pointerup', aoSoltar);
      barra.removeEventListener('pointercancel', aoSoltar);
      barra.removeEventListener('pointerenter', abrirIlha);
      barra.removeEventListener('pointerleave', fecharIlha);
      doc.style.scrollBehavior = '';
    };
  }, []);

  /* O atalho. `scrollIntoView` e não `location.hash`: escrever o fragmento na
     barra de endereço deixaria `#pedido` colado ali, e o próximo recarregamento
     abriria a página no formulário — que é exatamente o defeito que `main.tsx`
     consertou. */
  const irParaOPedido = () => {
    setAberta(false);
    abertaRef.current = false;
    document.getElementById(DESTINO)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* `aria-hidden`: esta barra não acrescenta nada a quem não a vê. A rolagem por
     teclado é do navegador e não passa por aqui, e o atalho de dentro leva ao
     mesmo formulário que dois botões do conteúdo já oferecem. */
  return (
    <div
      ref={barraRef}
      aria-hidden
      className={`rolador${acordada ? ' rolador-viva' : ''}${aberta ? ' rolador-ilha' : ''}`}
    >
      {/* ─── ACORDADA: o disco e a porcentagem, como o relógio e a hora da
          segunda foto. Dois elementos e nada mais: é o estado de passagem, e
          tudo o que ele precisa dizer é "isto aqui é um objeto, e você está
          nesta altura da página". */}
      <div className="rolador-viva-corpo">
        <span className="rolador-viva-disco">
          <ArrowDown className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </span>
        {/* Sem filhos no JSX de propósito: o texto é escrito por `ref` a cada
            quadro, e um valor declarado aqui seria reposto pelo React a cada
            re-render, apagando o número. */}
        <span ref={pctVivaRef} className="rolador-viva-pct" />
      </div>

      {/*
       * ─── ABERTA: o player ─────────────────────────────────────────────────
       *
       * O arranjo é o da foto: a arte quadrada em cima, título e subtítulo, a
       * barra de progresso e o controle. O nosso disco é a PÁGINA — a capa
       * carrega o quanto dela já foi lido, o título é a seção em que a pessoa
       * está, e o controle é a única ação que esta barra tem para oferecer.
       *
       * O atalho existe porque a página é longa de propósito: ela argumenta em
       * seis seções, e quem já decidiu no meio do caminho não deveria ter de
       * rolar por mais três para achar o formulário. E mora escondido atrás de
       * um gesto, e não numa barra fixa no alto da tela: quem ainda está lendo
       * não precisa dele na frente.
       *
       * PENDENTE-DONO: o rótulo do botão é a sugestão do dono ("me leve para a
       * ação"), num registro mais solto que o "Entrar em contato" do rodapé. A
       * diferença é proposital: o botão do fecho é O compromisso da página e por
       * isso é sóbrio; este é um atalho que a pessoa descobre sozinha, e um
       * easter egg com voz de formulário perde a graça de ser um.
       */}
      <div className="rolador-ilha-corpo">
        <div className="rolador-capa">
          <span ref={pctCapaRef} />
        </div>

        <div>
          <span className="rolador-ilha-secao">{atual ?? 'Doxa'}</span>
          <span className="rolador-ilha-copy">da página, lidos</span>
        </div>

        <span className="rolador-trilha">
          <span ref={progressoRef} className="rolador-progresso" />
        </span>

        <button type="button" className="rolador-ilha-botao" onClick={irParaOPedido} tabIndex={-1}>
          <span className="rolador-ilha-seta">
            <ArrowDown className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </span>
          Me leve para a ação
        </button>
      </div>
    </div>
  );
}
