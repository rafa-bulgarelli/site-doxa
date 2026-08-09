import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { ANCORA_FORMS } from '../../ancoras';

/** Folga da barra contra o topo e o pé da janela, em pixels. */
const MARGEM = 10;

/** A menor barra aceitável, no estado dormindo. Abaixo disso não se pega. */
const MINIMO = 44;

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
 * ─── O CARTÃO UM TERÇO MENOR NA JANELA ESTREITA ──────────────────────────────
 *
 * Pedido do dono, e o caso é mais estreito do que parece: num TELEFONE de
 * verdade esta peça não existe — o CSS a esconde inteira em `@media (hover:
 * none)`, porque lá o polegar cobre a barra e o sistema já desenha o próprio
 * indicador. O que sobra é a janela estreita COM ponteiro: um navegador puxado
 * para 320 de largura, que é onde o dono está olhando. Ali o painel aberto
 * ocupava 236 dos 320 pixels — três quartos da tela para um atalho.
 *
 * `ENCOLHE` mora aqui e o CSS repete a mesma fração em `calc()`, sempre visível
 * como conta e nunca como número pronto. As duas linguagens não têm como
 * compartilhar a constante, mas têm como mostrar a mesma origem: quem mudar uma
 * acha a outra procurando por "2 / 3".
 *
 * `ESTREITO` é o `sm` do Tailwind pela borda de baixo — o mesmo limite de 640
 * que separa telefone de resto no site inteiro. Um segundo limite só para esta
 * peça seria uma segunda opinião sobre o que é estreito.
 */
const ESTREITO = '(max-width: 639px)';
const ENCOLHE = 2 / 3;

/** As duas alturas fixas, já na escala da janela em que a peça está. */
function alturaFixa(cheia: number) {
  return window.matchMedia(ESTREITO).matches ? Math.round(cheia * ENCOLHE) : cheia;
}

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

/**
 * Quanto o ponteiro pode estar longe da peça e ainda contar como em cima dela.
 *
 * Vinte e seis pixels. Dormindo, a barra tem dezesseis de largura — sem folga,
 * abri-la seria um exercício de mira, e a referência que o dono trouxe reage à
 * APROXIMAÇÃO e não ao toque exato. Do lado direito não há folga a dar: a peça
 * já encosta na borda da janela.
 */
const FOLGA = 26;

/**
 * A faixa da direita em que vale a pena medir a peça, em pixels.
 *
 * A ilha aberta mede 236 e mora a 6 da borda; com a folga, nada além de 300
 * pixels da direita pode estar em cima dela. Fora dessa faixa a resposta é "não"
 * sem medir nada.
 */
const ALCANCE = 300;

/** Onde o botão leva. É a mesma âncora de toda CTA da página. */
const DESTINO = ANCORA_FORMS;

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
  /** O que falta ler, escrito no nó a cada quadro. Ver `desenhar`. */
  const faltaRef = useRef<HTMLSpanElement>(null);

  const [acordada, setAcordada] = useState(false);
  const [aberta, setAberta] = useState(false);

  /*
   * ─── OS REFS SÃO A FONTE DA VERDADE, E O ESTADO É A CÓPIA ────────────────
   *
   * O efeito roda uma vez só — em dependência, ouvintes, observador e medidas
   * seriam desmontados e remontados a cada abrir e fechar —, então ele precisa
   * ler os dois estados por `ref`.
   *
   * O que NÃO pode existir é a sincronia no sentido contrário. Estas duas linhas
   * já foram `acordadaRef.current = acordada` no corpo do componente, e isso é
   * um bug esperando a hora: os refs são escritos por relógios (a abertura, o
   * sono) que rodam FORA do ciclo do React, e qualquer re-render disparado por
   * outra coisa no meio do caminho devolvia ao ref o valor antigo do estado —
   * apagando uma decisão que já tinha sido tomada. O `setState` existe aqui só
   * para trocar as classes; quem manda é o ref.
   */
  const acordadaRef = useRef(false);
  const abertaRef = useRef(false);

  useEffect(() => {
    const barra = barraRef.current;
    if (barra == null) return;

    const doc = document.documentElement;
    let quadro = 0;
    let relogioEsticao: number | undefined;
    let ultimoY = window.scrollY;
    let ultimoT = performance.now();

    /*
     * O NOME DA SEÇÃO saiu daqui, e com ele a leitura dos `data-secao`.
     *
     * O painel dizia em que seção a pessoa estava; o dono trocou a linha por
     * quanto FALTA para o fim, que é a mesma régua contada pela outra ponta e
     * diz respeito ao que ele quer que aconteça em vez de onde a pessoa está.
     *
     * Os atributos `data-secao` continuam nas seis seções de propósito: eles são
     * marcação semântica barata, e são a fonte pronta se a linha voltar um dia.
     * O que saiu foi a medição por `ResizeObserver` e o laço por quadro — não o
     * contrato com o DOM.
     */

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
        ? alturaFixa(ILHA_ALTURA)
        : acordadaRef.current
          ? alturaFixa(VIVA_ALTURA)
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
      const feito = Math.round(progresso * 100);
      const lido = `${feito}%`;
      if (pctVivaRef.current != null) pctVivaRef.current.textContent = lido;
      if (pctCapaRef.current != null) pctCapaRef.current.textContent = lido;
      if (progressoRef.current != null) progressoRef.current.style.width = lido;
      /* O QUE FALTA sai da MESMA conta do que foi lido, e não de um segundo
         arredondamento: `round(1 - p)` e `100 - round(p)` discordam em um ponto
         percentual em metade dos valores, e o painel mostraria a capa em 40% com
         a linha dizendo "faltam 61%". A capa conta o que passou, a frase conta o
         que vem — o mesmo número pelas duas pontas. */
      if (faltaRef.current != null) faltaRef.current.textContent = `Faltam ${100 - feito}%`;

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

    };

    /* O BRILHO saiu daqui junto com a rampa de opacidade do CSS.

       Ele acendia a peça enquanto a página andava e a apagava sozinho depois — e
       fazia isso com o único recurso que o dono acabou de tirar de cena: a
       opacidade. Sem ela, `acender()` punha e tirava uma classe que não pinta
       nada, e um `setTimeout` por lote de rolagem para não pintar nada é pior do
       que não ter o efeito: parece que existe. Se o brilho voltar, ele volta por
       uma propriedade que sobreviva a "zero transparente" — `box-shadow`, ou o
       próprio cinza subindo um degrau. */

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

    /*
     * ─── A APROXIMAÇÃO, MEDIDA EM COORDENADAS E NÃO EM `pointerenter` ────────
     *
     * Este é o conserto do defeito que o dono viu: passado o formulário, o hover
     * simplesmente parava de abrir a ilha.
     *
     * `pointerenter` e `pointerleave` são eventos de FRONTEIRA — o navegador só
     * os dispara quando o ponteiro cruza a borda do elemento, e ele decide isso
     * pelo que está no topo naquele pixel. Numa peça que muda de tamanho três
     * vezes, que anda a cada quadro de rolagem e que atravessa uma página com
     * camadas próprias em cada seção, é fácil o par entrar/sair se desencontrar:
     * basta um `leave` disparar sem o `enter` correspondente e a peça fica com a
     * mão marcada como "fora" para sempre — que é exatamente o sintoma, um hover
     * que deixa de funcionar a partir de um certo ponto da página e não volta.
     *
     * Aqui a pergunta passa a ser aritmética, respondida a cada movimento do
     * ponteiro: o cursor está dentro do retângulo da peça, com folga? Não há
     * fronteira para perder, não há evento para se desencontrar, e o estado é
     * recalculado do zero a cada movimento — se algum quadro der a resposta
     * errada, o próximo conserta.
     *
     * De quebra, é o que a referência faz: a ilha do sistema reage à APROXIMAÇÃO
     * do ponteiro, e não ao toque exato na peça. A folga é o que torna uma barra
     * de oito pixels alcançável sem mira.
     */
    const aoMover = (evento: PointerEvent) => {
      // Arrastando, a mão já disse o que queria: o cursor sai da peça na
      // primeira sacudida, e deixar isto rodar fecharia a ilha e mexeria no
      // sono no meio de um gesto que tem dono.
      if (arrastando) return;

      let perto = false;
      /* O teste barato primeiro. Este ouvinte roda a cada movimento do ponteiro
         na PÁGINA INTEIRA, e `getBoundingClientRect` obriga o navegador a
         calcular layout — pago em todo movimento do mouse, seria um custo
         constante para responder "não" noventa e cinco por cento das vezes.
         Quem está longe da borda direita nem chega a medir a peça. */
      if (evento.clientX >= window.innerWidth - ALCANCE) {
        const caixa = barra.getBoundingClientRect();
        perto =
          evento.clientX >= caixa.left - FOLGA &&
          evento.clientY >= caixa.top - FOLGA &&
          evento.clientY <= caixa.bottom + FOLGA;
      }

      if (perto === sobre) return;
      sobre = perto;
      if (perto) abrirIlha();
      else fecharIlha();
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
        ? alturaFixa(VIVA_ALTURA)
        : Math.max(MINIMO, pista * (janela / total));
      const andar = pista - altura;
      if (andar <= 0) return;

      // A regra de três que faz a página seguir a mão: o quanto a peça pode
      // andar cobre o quanto a página pode rolar.
      const fator = (total - janela) / andar;
      window.scrollTo(0, rolagemNoInicio + (evento.clientY - mouseNoInicio) * fator);
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
      desenhar();
    });
    olho.observe(doc);

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', desenhar);
    barra.addEventListener('pointerdown', aoPegar);
    barra.addEventListener('pointermove', aoArrastar);
    barra.addEventListener('pointerup', aoSoltar);
    barra.addEventListener('pointercancel', aoSoltar);
    window.addEventListener('pointermove', aoMover, { passive: true });
    desenhar();

    return () => {
      window.cancelAnimationFrame(quadro);
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
      window.removeEventListener('pointermove', aoMover);
      doc.style.scrollBehavior = '';
    };
  }, []);

  /* O atalho. `scrollIntoView` e não `location.hash`: escrever o fragmento na
     barra de endereço deixaria `#forms` colado ali, e o próximo recarregamento
     abriria a página no formulário — que é exatamente o defeito que `main.tsx`
     consertou.

     `block: 'start'` e não `'center'`: a marca do salto tem altura zero
     (`Comparacao.tsx` explica por quê), e centrar um ponto o deixaria no meio da
     janela — meia tela do painel anterior por cima do papel. Alinhado pelo
     topo, o painel claro ocupa a tela inteira, que é o mesmo pouso do clique em
     qualquer botão da página. */
  const irParaOPedido = () => {
    setAberta(false);
    abertaRef.current = false;
    document.getElementById(DESTINO)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        {/* A régua contada pela outra ponta, a pedido do dono.
 
            "Início · da página, lidos" dizia onde a pessoa estava; isto diz o
            que falta e para quê. É a mesma porcentagem da capa, invertida — e a
            inversão é o argumento: um número que diminui é uma promessa se
            aproximando, e um que aumenta é só uma medida.
 
            Sem filhos no JSX, como a pílula acordada: o texto é escrito por
            `ref` a cada quadro, e um valor declarado aqui seria reposto pelo
            React a cada re-render, apagando o número. */}
        <div>
          <span ref={faltaRef} className="rolador-ilha-secao" />
          <span className="rolador-ilha-copy">para mudar sua empresa</span>
        </div>

        <span className="rolador-trilha">
          <span ref={progressoRef} className="rolador-progresso" />
        </span>

        <button type="button" className="rolador-ilha-botao" onClick={irParaOPedido} tabIndex={-1}>
          <span className="rolador-ilha-seta">
            <ArrowDown className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </span>
          Pule a experiência
        </button>
      </div>
    </div>
  );
}
