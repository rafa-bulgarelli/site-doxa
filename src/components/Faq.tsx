import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Bolinhas, type Ponto } from './faq/Bolinhas';
import { CARGA, CampoPergunta, MOLA } from './faq/CampoPergunta';
import { Revela } from './faq/Revela';
import { encontra } from './faq/busca';
import { ABERTURA, DESTAQUES, DUVIDAS, ESPERA, SEM_RESPOSTA, type Duvida } from './faq/config';
import { CORES, SEM_COR, corDaDuvida } from './faq/cores';
import { MotionButton } from './ui/MotionButton';
import { ANCORA_FAQ, HREF_FORMS, ID_CARTAO_PEDIDO } from '../ancoras';
import { MANCHETE } from '../tipografia';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Quando a resposta nasce, em milissegundos.
 *
 * É a duração da barra que varre o campo, LIDA do próprio campo e não escrita de
 * novo aqui: o texto tem de aparecer no instante em que a barra termina. Com
 * dois números separados, um dia eles divergem — e então ou a resposta aparece
 * antes de a barra chegar ao fim (a barra vira enfeite), ou sobra um vão de nada
 * entre as duas (a barra vira atraso).
 *
 * NÃO é latência fingida: não há nada sendo processado atrás disto, e o número é
 * o tempo de um gesto, não de uma espera. É o que torna a causa visível — a
 * mesma razão de uma porta mostrar que foi a maçaneta que a abriu.
 */
const RESPOSTA = CARGA * 1000;

/**
 * Quanto a seção leva para se partir em duas.
 *
 * Um pouco MENOS que a barra, e de propósito: na primeira pergunta as duas
 * coisas correm juntas, e o painel tem de estar parado quando o texto nasce
 * dentro dele. Terminando junto, a resposta nasceria no último quadro de uma
 * coluna ainda em movimento.
 */
const PARTIDA = 420;

/**
 * A saída de uma resposta, e o intervalo entre uma e a seguinte.
 *
 * Vivem aqui em cima porque duas coisas dependem deles: a animação de cada
 * resposta, lá embaixo, e a conta de quando a seção pode se recompor depois de
 * limpar. Escritos nos dois lugares, um dia a seção fecha no meio da varrida —
 * que foi exatamente o defeito que o dono viu.
 */
const SAIDA = 300;
const CASCATA = 60;

/**
 * A faixa da seção antes e depois da primeira pergunta.
 *
 * Fechada ela é a coluna centrada de sempre: sem resposta nenhuma na tela, uma
 * caixa de pergunta esticada por 1.400 pixels não tem o que fazer com eles — e
 * o campo, que é o único objeto da seção, ficaria com a proporção de um rodapé.
 * Aberta ela vai para `max-w-screen-2xl`, que é a MESMA faixa da comparação e do
 * "como funciona": com as duas colunas em cena, a seção precisa de toda a
 * largura da página, e passa a alinhar com o resto dela.
 */
const FECHADA = '48rem';
const ABERTA = '96rem';

/** A cadência da abertura — a mesma do resto do site. */
const TRANSICAO = {
  transitionDuration: `${PARTIDA}ms`,
  transitionTimingFunction: `cubic-bezier(${EASE.join(',')})`,
} as const;

/**
 * A pergunta digitada, com a primeira letra em caixa alta.
 *
 * Quem escreve num campo de conversa escreve em minúscula, e aqui a pergunta é
 * exibida em serifa de 1,9rem — do tamanho de um título. Um título que começa
 * minúsculo lê como erro de quem fez a página, não como escolha de quem digitou.
 * Só a primeira letra: o resto é o texto da pessoa e não se mexe nele.
 */
function comoTitulo(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Uma troca: o que foi perguntado e o que foi respondido. */
interface Troca {
  id: number;
  pergunta: string;
  paragrafos: readonly string[];
  /** A resposta é o desvio para o consultor, e não uma resposta de fato. */
  escape: boolean;
  /** A mesma que o ponto desta dúvida tem no cabeçalho — é o que liga os dois. */
  cor: string;
}

/**
 * A posição de um elemento na PÁGINA, somada pela cadeia de `offsetTop`.
 *
 * E não `getBoundingClientRect`, que seria a leitura óbvia: o painel claro da
 * comparação sobe GIRADO e só assenta em zero grau perto do fim da rolagem. O
 * rect enxerga a caixa girada — o pé do formulário mede um valor diferente a
 * cada quadro da subida, e medir no quadro errado é congelar um recuo torto.
 * `offsetTop` é posição de LAYOUT: transform não a toca, e ela vale a mesma
 * coisa antes, durante e depois do giro.
 */
function topoNaPagina(el: HTMLElement): number {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

/**
 * O ar acima do rótulo "FAQ" é o ar abaixo do formulário — MEDIDO, e não escrito.
 *
 * O pedido do dono era uma simetria: o vão entre o pé do formulário e a costura
 * (onde o papel vira preto) tem de medir o mesmo que o vão entre a costura e o
 * rótulo "FAQ". Escrever isso como padding não funciona, e o motivo é que o vão
 * de cima NÃO é um padding: é o `pb-24` do painel claro MAIS metade da sobra
 * que o `min-h-screen` dele deixa quando o conteúdo é menor que a tela. Ele
 * anda meio pixel a cada pixel de altura de janela — 102px numa tela de 853,
 * 146 em 940, 213 em 1080 — e a sobra ainda muda com a LARGURA, porque a faixa
 * do título quebra em mais ou menos linhas. Nenhuma constante em CSS acerta os
 * dois lados ao mesmo tempo; `calc()` em `svh` erra até trinta pixels de uma
 * largura para a outra.
 *
 * Então o número vem da página: distância do pé do `#pedido` até o topo desta
 * seção, relida a cada mudança de layout. Não há laço — o recuo daqui muda a
 * altura do corpo, mas não move nada que esteja ACIMA desta seção, então a
 * segunda medição devolve o mesmo valor e o React não re-renderiza.
 *
 * Enquanto não há medida — antes da comparação montar, ou numa página que não
 * a tenha —, valem as classes do elemento (`pt-10 md:pt-24`), que são o valor
 * certo justamente nos casos em que o painel não sobra espaço nenhum: no
 * telefone e em qualquer tela onde o conteúdo dele passa da altura da janela.
 */
function useArDoPedido(secaoRef: RefObject<HTMLElement>): number | null {
  const [ar, setAr] = useState<number | null>(null);

  useLayoutEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;

    const medir = () => {
      const pedido = document.getElementById(ID_CARTAO_PEDIDO);
      if (!pedido) return;
      const vao = topoNaPagina(secao) - (topoNaPagina(pedido) + pedido.offsetHeight);
      if (vao > 0) setAr(vao);
    };

    medir();

    /* No CORPO, e não na janela: a comparação é `lazy`, e quando ela monta
       depois desta seção o que muda não é o tamanho da janela, é a altura da
       página. O observador pega as duas coisas — o mount tardio, a fonte que
       chega, a coluna que reflui — e o `resize` cobre o caso em que a janela
       muda de largura sem que a altura do corpo mude. */
    const observador = new ResizeObserver(medir);
    observador.observe(document.body);
    window.addEventListener('resize', medir);
    return () => {
      observador.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, [secaoRef]);

  return ar;
}

/**
 * O FAQ, em forma de conversa — e as respostas são escritas, não geradas.
 *
 * A forma é de chat porque a página inteira fala de uma máquina que trabalha
 * para quem está lendo, e um acordeão de perguntas frequentes é o objeto mais
 * genérico da internet. O MOTOR não é de chat: cada resposta daqui foi escrita
 * pelo dono e mora em `faq/config.ts`. O que o campo faz é achar qual delas
 * responde ao que foi digitado — e dizer que não sabe quando nenhuma responde.
 *
 * Dizer que não sabe é a decisão mais importante desta seção. Esta página
 * promete um milhão de views ou o dinheiro de volta; um gerador solto falando de
 * prazo, escopo e reembolso acerta quase sempre e, no dia em que erra, publicou
 * por escrito uma promessa que a empresa passa a dever. Quem pergunta o que a
 * página não sabe cai no consultor, que é para onde tudo aqui aponta de
 * qualquer forma.
 *
 * E o campo não se anuncia como inteligência artificial em lugar nenhum — nem no
 * título, nem no rótulo, nem no exemplo do campo. Parecer um modelo e ser uma
 * busca seria mentir sobre a única coisa que esta seção existe para fazer:
 * responder direito.
 *
 * ─── O DESENHO: CABEÇALHO EM CIMA, DUAS COLUNAS EMBAIXO ──────────────────────
 *
 * Fechada, a seção é a coluna de 48rem CENTRADA que sempre foi: um campo sozinho
 * não tem o que fazer com a largura da página. Ela vai para `max-w-screen-2xl` —
 * a mesma faixa da comparação e do "como funciona" —, e é só a partir daí que o
 * rótulo, o título e o campo passam a nascer na MESMA linha vertical dos títulos
 * das outras seções. O alinhamento com a página é consequência de haver duas
 * colunas, não um estado permanente.
 *
 * ─── O GATILHO É O CLIQUE NO CAMPO, E NÃO A PRIMEIRA PERGUNTA ────────────────
 *
 * Isto mudou a pedido do dono, e o argumento dele é o certo: a caixa crescia
 * sozinha, e crescer sozinha é movimento sem consequência. Agora o mesmo clique
 * que abre o campo abre a página — a faixa alarga, as duas colunas nascem, e a
 * da direita já diz que é ali que a resposta vai sair. A caixa maior deixa de
 * ser um efeito e passa a ser o começo de uma conversa que tem dois lados.
 *
 * Quem clica fora sem escrever nada devolve tudo, mas SÓ enquanto não houver
 * resposta na tela: com respostas, a coluna continua sendo necessária.
 *
 * ─── O CABEÇALHO MORA NA COLUNA DA ESQUERDA ─────────────────────────────────
 *
 * Ele já ficou fora do grid, em largura total, e a razão era o sinal que
 * atravessava o vão: com o título dentro da coluna, o risco saía do campo numa
 * altura e a resposta nascia em outra. O sinal não existe mais, e o dono pediu a
 * coisa que essa arrumação impedia — que TODO o lado esquerdo fique fixo ao
 * rolar, e não só o campo.
 *
 * `sticky` gruda um elemento, não uma região: para o rótulo, a régua, o título e
 * o campo grudarem JUNTOS, eles têm de ser o mesmo elemento. Dois `sticky`
 * irmãos com o mesmo `top` se sobreporiam no primeiro pixel de rolagem.
 *
 * A consequência é que a coluna das respostas passa a começar na altura do
 * rótulo, e não na do campo. É o preço, e ele é barato: o que se lê à direita é
 * a resposta, e ela ganha a altura inteira da seção para existir.
 *
 * Fechada, a coluna de respostas tem largura zero e o campo ocupa a faixa
 * inteira. Aberta ela vai para 44% — a mesma proporção que a comparação usa para
 * o cartão do pedido — e a divisória se desenha de cima para baixo entre as duas.
 *
 * Isto resolve o defeito que o empilhamento tinha e que nenhuma dose de espaço
 * consertava: a resposta empurrava os atalhos para longe e cada nova pergunta
 * afundava a anterior, então ler a terceira resposta custava rolar por cima das
 * duas primeiras. Separadas, as duas coisas param de disputar o mesmo eixo — o
 * campo fica GRUDADO no topo enquanto se lê (`sticky`), e perguntar de novo não
 * exige caçar o campo de volta.
 *
 * A divisão só existe a partir de `lg`. Abaixo disso não há largura para duas
 * colunas de texto, e a seção continua sendo o que sempre foi: campo em cima,
 * respostas embaixo, a mais nova primeiro.
 *
 * `overflow-x-clip` e não `overflow-hidden`: `hidden` faz da seção um contêiner
 * de rolagem, e um `sticky` lá dentro passa a grudar num box que não rola — ou
 * seja, não gruda. `clip` corta o que vazar na horizontal sem criar contêiner
 * nenhum, que é exatamente o que se queria das duas vezes.
 */
export function Faq() {
  const parado = useReducedMotion() === true;
  const secaoRef = useRef<HTMLElement>(null);
  const naTela = useInView(secaoRef, { amount: 0.2, once: true });
  const arDoPedido = useArDoPedido(secaoRef);

  const [rascunho, setRascunho] = useState('');
  const [trocas, setTrocas] = useState<readonly Troca[]>([]);
  // Contador em vez do tamanho da lista: a chave do React tem de ser única para
  // sempre, e um índice se repete assim que a lista muda de forma.
  const proximoId = useRef(0);

  /** Se a coluna de respostas já está aberta. */
  const [aberto, setAberto] = useState(false);
  /** O relógio que devolve a seção à coluna única depois de limpar. */
  const fechamento = useRef<number | undefined>(undefined);

  /** Quantas barras estão varrendo o campo. Contador, e não booleano: duas
      perguntas seguidas não podem apagar o sinal uma da outra. */
  const [cargas, setCargas] = useState(0);

  /** Se a pilha de respostas está saindo agora. */
  const [limpando, setLimpando] = useState(false);

  /* Se o campo está aberto AGORA — um espelho do estado que mora lá dentro.
     Não é a mesma coisa que `aberto`: a seção continua partida enquanto houver
     resposta na tela, e o campo já voltou a ser pastilha faz tempo. Este aqui
     serve a uma coisa só: os atalhos precisam saber a hora de entrar. */
  const [escrevendo, setEscrevendo] = useState(false);

  const responder = (pergunta: string, duvida: Duvida | null) => {
    const achada = duvida ?? encontra(pergunta, DUVIDAS);
    const nova = {
      id: proximoId.current++,
      pergunta,
      paragrafos: achada?.resposta ?? [SEM_RESPOSTA.titulo, SEM_RESPOSTA.corpo],
      escape: achada == null,
      // Pela POSIÇÃO da dúvida no arquivo, e não por uma cor guardada nela: a
      // ordem das seis é o arco do anel, e é ela que decide qual tom cada uma
      // recebe. Quem não foi achada fica com o creme do consultor.
      cor: achada == null ? SEM_COR : corDaDuvida(DUVIDAS.indexOf(achada)),
    };

    // Perguntar durante o fechamento cancela o fechamento: sem isto, a coluna
    // encolheria no meio da resposta nova por causa de um clique já desfeito.
    window.clearTimeout(fechamento.current);
    setAberto(true);

    if (parado) {
      setTrocas((atuais) => [nova, ...atuais]);
      return;
    }

    /*
     * Um sinal só, e ele mora DENTRO do campo.
     *
     * Existia também um risco atravessando o vão até a coluna das respostas, e
     * ele saiu a pedido do dono pelo motivo certo: longe do campo, sem nada o
     * ligando ao objeto que recebeu a pergunta, ele lia como um traço jogado na
     * tela. A barra que varre a base do campo faz o mesmo trabalho com o dono à
     * vista — e quem clica num atalho vê a mesma barra correr, o que amarra o
     * atalho ao campo sem precisar mover o foco para lá.
     */
    setCargas((n) => n + 1);

    window.setTimeout(() => {
      setCargas((n) => n - 1);
      setTrocas((atuais) => [nova, ...atuais]);
    }, RESPOSTA);
  };

  const enviar = () => {
    const pergunta = rascunho.trim();
    if (pergunta.length === 0) return;
    setRascunho('');
    // Enviar fecha o campo lá dentro, e o espelho tem de fechar junto: sem
    // isto os atalhos ficariam marcados como "já entraram", e a próxima
    // abertura os revelaria parados em vez de os fazer nascer.
    setEscrevendo(false);
    responder(pergunta, null);
  };

  /*
   * Limpar esvazia agora e fecha DEPOIS.
   *
   * As respostas saem em cascata, e a coluna que as segura não pode encolher por
   * baixo delas enquanto isso — o texto se reflui em duas linhas a menos no meio
   * da própria saída, e o que era uma varrida vira um solavanco. Fechar um
   * tempo de travessia mais tarde deixa a pilha sair inteira na largura em que
   * ela estava, e só então a seção se recompõe.
   */
  const limpar = () => {
    /*
     * A conta da VARRIDA, e ela é o conserto de um engasgo que o dono viu.
     *
     * As respostas saem em cascata: 300ms cada uma, com 60 de atraso entre
     * uma e a seguinte. A última, portanto, só termina em `300 + (n-1)*60`.
     * Fechar depois de um tempo FIXO fazia a coluna encolher por baixo das
     * respostas que ainda estavam saindo — o texto se refluía em duas linhas a
     * menos no meio da própria saída, e o que era uma varrida virava solavanco.
     * Contando as que existem, a pilha sai inteira na largura em que estava e a
     * seção só se recompõe depois.
     */
    const quantas = trocas.length;
    const varrida = parado ? 0 : SAIDA + Math.max(0, quantas - 1) * CASCATA;

    setTrocas([]);
    setLimpando(true);
    window.clearTimeout(fechamento.current);
    fechamento.current = window.setTimeout(() => {
      setAberto(false);
      setLimpando(false);
    }, varrida);
  };

  /*
   * A seção se parte no CLIQUE do campo, e não mais só na primeira pergunta.
   *
   * O dono viu o que faltava: a caixa crescia sozinha, e crescer sozinha é
   * movimento sem consequência. Agora o mesmo clique que abre o campo abre a
   * página — a faixa alarga, as duas colunas nascem, e a da direita já diz que é
   * ali que a resposta vai sair. A caixa maior deixa de ser um efeito e passa a
   * ser o começo de uma conversa que tem dois lados.
   *
   * Desistir devolve tudo, mas SÓ se não houver resposta na tela: com respostas,
   * a coluna continua sendo necessária, e fechá-la porque alguém clicou fora do
   * campo apagaria o que a pessoa está lendo.
   */
  const aoAbrirCampo = () => {
    window.clearTimeout(fechamento.current);
    setEscrevendo(true);
    setAberto(true);
  };

  const aoDesistir = () => {
    setEscrevendo(false);
    if (trocas.length === 0) setAberto(false);
  };

  // Os atalhos somem conforme são usados: um botão que devolve a resposta que já
  // está na tela é um botão que não faz nada.
  /* `DESTAQUES` e não `DUVIDAS` daqui para baixo, e a diferença é o que
     mantém a bandeja com seis botões enquanto o campo sabe responder vinte e
     três. A régua e os pontos medem as SEIS — são elas que a linha acima do
     campo chama de "as dúvidas que todo mundo tem", e uma régua com denominador
     23 mal sairia do lugar depois de a pessoa ler três respostas. */
  const respondidas = new Set(trocas.map((t) => t.pergunta));
  const atalhos = DESTAQUES.filter((d) => !respondidas.has(d.pergunta));
  const cobertas = DESTAQUES.length - atalhos.length;

  /* Os pontos do cabeçalho, na ordem DO ARQUIVO e não na ordem em que foram
     perguntados: é essa ordem que faz o âmbar vir sempre antes do coral,
     independentemente de por onde a pessoa começou. Os pontos se acumulam da
     esquerda para a direita como uma régua que se preenche, e não como um
     histórico embaralhado. */
  const lidas: readonly Ponto[] = DESTAQUES.map((duvida, i) => ({ duvida, i }))
    .filter(({ duvida }) => respondidas.has(duvida.pergunta))
    .map(({ duvida, i }) => ({ chave: duvida.chave, cor: corDaDuvida(i) }));

  const entrada = parado
    ? {}
    : {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.7 },
      };

  return (
    <section
      ref={secaoRef}
      id={ANCORA_FAQ}
      data-secao="Perguntas"
      /* ─── A SEÇÃO TEM ALTURA PRÓPRIA, e o conteúdo mora no TOPO dela ───────
       *
       * Fechada, esta seção era um rótulo, um título e uma pastilha de 48
       * pixels: duzentos e cinquenta pixels de coisa entre duas seções que
       * ocupam telas inteiras. O que se lia disso não era "seção enxuta", era um
       * vão entre a comparação e o rodapé — e um vão não é onde alguém para
       * para perguntar. Daí o `min-h`.
       *
       * ─── O RECUO DE CIMA É O RECUO DE BAIXO DO FORMULÁRIO ─────────────────
       *
       * O recuo do topo é MEDIDO, e o `useArDoPedido` acima explica por quê: o
       * vão que ele espelha não é um padding, é padding mais sobra de
       * centragem, e anda com o tamanho da janela. As classes `pt-10 md:pt-24`
       * continuam aqui como o valor de partida — elas são o número certo
       * exatamente nas telas em que o painel claro não sobra espaço nenhum.
       *
       * E a sobra de altura que o `min-h` DESTA seção cria não entra na conta:
       * ela cai toda embaixo, que é para onde a seção cresce quando a primeira
       * resposta chega. Foi por isso que o `justify-center` saiu daqui — ele
       * repartia essa sobra pelos dois lados e inflava o vão de cima para quase
       * trezentos pixels, o dobro do recuo que ele devia estar espelhando.
       *
       * `svh` e não `vh`: no telefone, `vh` mede a tela com as barras do
       * navegador recolhidas, e uma seção que quer 92% disso nasce mais alta do
       * que o que se vê. `svh` é a medida pequena — a que existe o tempo todo.
       *
       * A altura é MÍNIMA: aberta, com respostas empilhadas na coluna da
       * direita, a seção cresce por cima dela como sempre cresceu.
       */
      className="relative flex min-h-[80svh] flex-col overflow-x-clip bg-black px-5 pb-16 pt-10 md:min-h-[92svh] md:px-10 md:pb-24 md:pt-24"
      style={arDoPedido === null ? undefined : { paddingTop: arDoPedido }}
    >
      {/* SEM GRADE E SEM FACHO no fundo, a pedido do dono, e a razão é o que
          existe atrás deles: nada. Nas outras seções a textura corre por baixo
          de cartões, painéis e imagens, e o facho é uma luz passando SOB alguma
          coisa. Aqui o fundo é preto liso do começo ao fim — a mesma luz vira
          uma mancha clara boiando sozinha, e a grade parada vira sujeira na
          tela. A textura da seção passa a ser só a do campo, que é uma caixa e
          se comporta como as outras caixas do site. */}

      <div
        className="relative mx-auto w-full transition-[max-width] motion-reduce:transition-none"
        style={{ ...TRANSICAO, maxWidth: aberto ? ABERTA : FECHADA }}
      >
        {/* ─── AS DUAS COLUNAS ─────────────────────────────────────────────
         *
         * As colunas moram no `style` de propósito: `grid-template-columns` só
         * vale onde o elemento é grid, e ele só é grid em `lg`. Assim o mesmo
         * objeto descreve os dois estados sem quatro classes condicionais.
         *
         * O vão NÃO é `gap`: é recuo das duas colunas (`pr-16` e `pl-16`) com a
         * divisória no meio. Com gap, a divisória teria de ser um absoluto solto
         * por cima do grid, posicionado por uma conta em `calc` que só se manteria
         * certa enquanto ninguém mexesse nas frações. Como recuo, ela é a borda
         * de um elemento que já está no lugar certo — e o sinal tem exatamente
         * meio vão para atravessar, que é o `VAO` que ele já conhece.
         *
         * ─── FECHADO É `0%`, E NUNCA `0fr` ────────────────────────────────────
         *
         * Aqui estava o engasgo que o dono viu, e ele não era peso de máquina: a
         * abertura SALTAVA no meio do caminho.
         *
         * `grid-template-columns` só interpola quando os dois lados têm o mesmo
         * número de tracks E o mesmo TIPO em cada um. Qualquer diferença de tipo
         * derruba a propriedade inteira para `discrete`, e discrete não anda —
         * troca de valor de uma vez na metade da duração. Fechado em `0fr` e
         * aberto em `44%`, os tipos eram outros (`<flex>` contra `<percentage>`),
         * então era exatamente isso que acontecia: a faixa e os recuos deslizavam
         * os 420ms inteiros e a coluna da direita aparecia INTEIRA aos 210. O que
         * se sente disso não é "rápido demais": é engasgo, porque são partes do
         * mesmo gesto andando em regimes diferentes.
         *
         * Em `0%`, os dois lados são `minmax(<length-percentage>, <percentage>)`
         * e o navegador interpola. Fechado, `0%` mede exatamente o que `0fr`
         * media: zero. Não se ganhou nada no layout — ganhou-se o MEIO da
         * animação, que antes não existia.
         */}
        <div
          className="transition-[grid-template-columns] motion-reduce:transition-none lg:grid"
          style={{
            ...TRANSICAO,
            gridTemplateColumns: aberto
              ? 'minmax(0, 1fr) minmax(0, 44%)'
              : 'minmax(0, 1fr) minmax(0, 0%)',
          }}
        >
          {/* ─── A COLUNA DA PERGUNTA ─────────────────────────────────────── */}
          <div
            className={`relative transition-[padding] motion-reduce:transition-none lg:sticky lg:top-24 lg:self-start ${
              aberto ? 'lg:pr-16' : 'lg:pr-0'
            }`}
            style={TRANSICAO}
          >
            {/* ─── O CABEÇALHO ────────────────────────────────────────────────── */}
            <motion.div
              initial={parado ? undefined : { opacity: 0, y: 16 }}
              animate={naTela ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {/* O rótulo, em SERIFA e aceso.
                  Saiu daqui o ponto que pulsava: um LED em loop eterno num fundo
                  preto liso é movimento sem informação, e o dono viu isso antes de
                  qualquer argumento. E saiu também o "01 de 06" que o substituiu:
                  dois algarismos pedem para ser lidos e comparados, enquanto seis
                  pontos dizem o total num relance.

                  A serifa é a do site — a mesma dos títulos —, e não a sans dos
                  rótulos das outras seções. É o que tira "FAQ" da categoria de
                  etiqueta e o põe na de nome próprio da seção. Em `texto-aceso`, o
                  brilho forte: no `fraco` ele sumia contra o preto, que foi
                  exatamente a reclamação. */}
              {/* ─── TUDO NUMA LINHA: rótulo, régua, pontos ────────────────────
               *
               * Ordem pedida pelo dono, e ela é a de quem lê: o NOME da seção, o
               * quanto dela já foi lido, e quais respostas foram. Empilhada, a
               * régua era um segundo objeto começando outro bloco logo abaixo do
               * rótulo; na mesma linha, os três viram um instrumento só — e o
               * cabeçalho passa a ocupar uma linha em vez de duas, o que é o que
               * aproxima o título do rótulo.
               *
               * O rótulo perdeu espaçamento (0.2em → 0.1em), também a pedido:
               * ao lado de uma régua e de seis pontos, "F A Q" esparramado
               * competia por largura com as duas coisas que informam. */}
              <span className="flex items-center gap-4">
                <span className="texto-aceso font-serif text-[19px] uppercase leading-none tracking-[0.1em] text-[#F4F1E8]">
                  {ABERTURA.rotulo}
                </span>

                {/* A régua: o mesmo progresso em forma de barra. Ela se estende
                    uma vez quando a seção entra na tela e depois só é
                    PREENCHIDA, a cada resposta lida — o gradiente por baixo é
                    fixo em 13rem, então o que cresce revela as cores na ordem em
                    que os pontos acendem, em vez de espremer as seis dentro do
                    pedaço já ganho.

                    `min-w-0` com `flex-1`: sem ele, um item flex não encolhe
                    abaixo do próprio conteúdo, e num telefone a régua empurraria
                    os pontos para fora da coluna em vez de ceder largura. */}
                <motion.span
                  aria-hidden
                  className="block h-[3px] min-w-0 max-w-[13rem] flex-1 origin-left overflow-hidden rounded-full bg-white/[0.10]"
                  initial={parado ? undefined : { scaleX: 0 }}
                  animate={naTela ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                >
                  <motion.span
                    className="block h-full rounded-full"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${CORES.join(', ')})`,
                      backgroundSize: '13rem 100%',
                    }}
                    initial={false}
                    animate={{ width: `${(cobertas / DESTAQUES.length) * 100}%` }}
                    transition={parado ? { duration: 0 } : { duration: 0.55, ease: EASE }}
                  />
                </motion.span>

                <Bolinhas pontos={lidas} parado={parado} />
              </span>

              {/* No corpo do fecho do rodapé, e não mais um degrau abaixo: as
                  duas são a última pergunta e a última frase da página, e uma
                  seção com a altura das outras pedia um título com o peso dos
                  outros. */}
              {/* ─── O CONVITE AO LADO DO TÍTULO, a pedido do dono ────────────
               *
               * Embaixo, ele era a terceira linha de um bloco de três e lia
               * como legenda. Na mesma linha do título, ele é a resposta à
               * pergunta que o título faz — "o que você quer saber?" /
               * "pergunte o que quiser" — e a seção passa a abrir com um
               * diálogo em vez de com um cabeçalho.
               *
               * `items-baseline` e não `items-center`: são dois tamanhos de
               * letra muito diferentes (70px contra 19), e centralizados pela
               * caixa o texto pequeno flutuaria no meio da altura do grande.
               * Pela base, os dois se apoiam na mesma linha, que é como
               * conviveriam numa página impressa.
               *
               * `flex-wrap` porque cabe, mas não em toda tela: o título mede
               * 493px e o convite 183 numa coluna de 768 — folga de 92. Aberta
               * a coluna de respostas, ou num monitor menor, a conta aperta e
               * o convite cai para a linha de baixo sozinho, que é o pior caso
               * aceitável (é exatamente onde ele morava antes).
               */}
              {/* `gap-y-4` e não `gap-y-1`, a pedido do dono.
               *
               * O vão vertical só existe quando o convite NÃO cabe ao lado do
               * título e cai para a linha de baixo — e era aí que os dois
               * colavam. Quatro pixels de vão entre duas serifas de 70 e de 36
               * não separam nada: sem espaço, o convite lê como a segunda linha
               * do próprio título, e a página fica com uma pergunta de duas
               * linhas em vez de uma pergunta e um convite.
               *
               * O vão horizontal continua sendo o de sempre: lado a lado eles
               * estão na MESMA linha de base, e ali a proximidade é o que faz a
               * frase menor ler como resposta à maior. */}
              <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-4">
                <h2 className={`font-serif ${MANCHETE} leading-[0.95] tracking-[-0.03em] text-[#F4F1E8] md:text-[4.4rem]`}>
                  {ABERTURA.titulo}
                </h2>
                {/* ─── EM SERIFA E ACESO, e por que NÃO no tamanho do título ──
                 *
                 * O dono pediu a serifa do título, o tamanho do título e um
                 * glow. Os dois primeiros pedidos brigam entre si, e a medida
                 * decide: na coluna fechada de 768px o título ocupa 493, sobram
                 * 255 — e esta frase em serifa mede 480 nos 70px do título. No
                 * tamanho pedido ela não caberia ao lado, e cairia para a linha
                 * de baixo, que é exatamente de onde o dono a tirou no pedido
                 * anterior. Trinta e seis é o maior corpo que mantém as duas
                 * coisas: mede 223 e sobra folga de 32.
                 *
                 * `texto-aceso-siri`: a cor mora na LETRA, a pedido do dono,
                 * com o brilho de acompanhante. Uma fita com as seis cores de
                 * `faq/cores.ts` corre por dentro dos glifos, e o halo troca
                 * junto — é sempre a cor que está passando. `index.css` explica
                 * por que a fita é linear e não cônica como o anel do campo, e
                 * por que o brilho é `drop-shadow` e não `text-shadow`.
                 *
                 * `text-[#F4F1E8]` fica de rede: se o navegador não recortar o
                 * fundo na forma do texto, a frase aparece em creme em vez de
                 * sumir. */}
                <p className="texto-aceso-siri font-serif text-[24px] leading-none tracking-[-0.02em] text-[#F4F1E8] md:text-[36px]">
                  {ABERTURA.dica}
                </p>
              </div>
              {/* O SEGUNDO CAMINHO, apagado.
                  O convite subiu para a linha do título e esta linha ficou com
                  o que ele não diz: que não é obrigatório formular nada. Em
                  cinza porque é a alternativa, e a alternativa não disputa com
                  a porta principal — quem já sabe o que quer perguntar não
                  precisa nem ler isto. */}
              {/* E este desce junto: com o convite mais solto acima, um vão de
                  dezesseis pixels aqui embaixo faria a alternativa apagada
                  parecer mais próxima do convite do que o convite está do
                  título — invertendo a hierarquia que os dois vãos existem para
                  declarar. */}
              <p className="mt-6 max-w-lg text-[17px] leading-snug text-white/40 md:text-[19px]">
                {ABERTURA.limite}
              </p>
            </motion.div>

            <motion.div
              className="mt-12 lg:mt-16"
              initial={parado ? undefined : { opacity: 0, y: 16 }}
              animate={naTela ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            >
              <CampoPergunta
                valor={rascunho}
                /* As SEIS em destaque, na ordem do arquivo, e não as vinte e
                   três. O campo passa o tempo todo escrevendo sozinho o que
                   sabe responder — com vinte e três, o ciclo fica longo demais
                   para alguém chegar a ver o próprio começo, e a frase que
                   aparece deixa de casar com o botão logo abaixo dela. */
                exemplos={[ABERTURA.exemplo, ...DESTAQUES.map((d) => d.pergunta)]}
                carregando={cargas > 0}
                aoDigitar={setRascunho}
                aoEnviar={enviar}
                aoAbrir={aoAbrirCampo}
                aoDesistir={aoDesistir}
                /* Os atalhos DENTRO da caixa, no andar de baixo. São as
                   perguntas de verdade com o rótulo curto — quem não quer
                   formular nada toca no assunto, quem quer escreve no andar de
                   cima. Enquanto moravam soltos aqui embaixo, liam como uma
                   fileira de botões que por acaso ficava perto do campo.

                   Eles vestem a MOLA do campo: crescem 4% sob a mão e afundam 4%
                   no clique, na mesma curva com que a caixa acima abre e fecha.

                   A escala vem do framer e não de `active:scale` do Tailwind: o
                   framer escreve `transform` no `style` do elemento para animar
                   a entrada e a saída, e um `transform` de classe seria
                   sobrescrito por ele — o clique simplesmente não afundaria. */
                bandeja={
                  atalhos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence initial={false}>
                        {atalhos.map((duvida, i) => (
                          <motion.button
                            key={duvida.chave}
                            type="button"
                            onClick={() => responder(duvida.pergunta, duvida)}
                            layout={!parado}
                            initial={parado ? undefined : { opacity: 0, y: -6, scale: 0.94 }}
                            /* Entram quando a GAVETA abre, um atrás do outro.
                               A gaveta os traz de trás do campo; o escalonado é
                               o que faz cada um chegar por conta própria em vez
                               de o bloco inteiro deslizar como um adesivo. Sem
                               `naTela` aqui: até a gaveta abrir eles estão
                               recortados, e uma entrada gasta atrás de uma
                               cortina fechada é uma entrada perdida. */
                            animate={
                              escrevendo
                                ? {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                      duration: 0.34,
                                      ease: MOLA,
                                      delay: 0.1 + i * 0.04,
                                    },
                                  }
                                : { opacity: 0, y: -6, scale: 0.94 }
                            }
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                            whileHover={parado ? undefined : { scale: 1.04 }}
                            whileTap={parado ? undefined : { scale: 0.96 }}
                            /* Só a mão e o clique caem aqui: a entrada leva o
                               atraso escalonado no próprio `animate`, e um
                               atraso vazando para o hover faria o botão
                               responder um quinto de segundo depois do mouse. */
                            transition={{ duration: 0.2, ease: MOLA }}
                            /* Fundo OPACO, e mais claro que a caixa. Translúcido a 3% de
                               branco, o atalho era um buraco um pouco mais claro
                               no fundo da caixa; sólido em #1F1F1F ele é um
                               objeto POUSADO nela — e é isso que faz uma
                               pastilha parecer clicável sem precisar de mais
                               contorno. */
                            className="rounded-full border border-white/[0.14] bg-[#1F1F1F] px-4 py-2 text-[13px] font-medium text-white/70 outline-none transition-colors duration-200 hover:border-white/30 hover:bg-[#2A2A2A] hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
                          >
                            {duvida.atalho}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : null
                }
              />
            </motion.div>
          </div>

          {/* ─── A COLUNA DAS RESPOSTAS ───────────────────────────────────────
           *
           * `min-w-0` impede que uma palavra longa estoure a coluna e empurre o
           * grid inteiro; `relative` é o poste da divisória.
           *
           * A margem de cima só existe empilhado. Dividido, o topo desta coluna
           * bate com o topo do campo — é esse alinhamento que faz as duas lerem
           * como duas metades da mesma coisa.
           */}
          <div
            className={`relative min-w-0 transition-[padding] motion-reduce:transition-none ${
              aberto ? 'mt-12 lg:mt-0 lg:pl-16' : 'lg:pl-0'
            }`}
            style={TRANSICAO}
          >
            {/* A divisória. Ela se DESENHA de cima para baixo quando o painel
                abre, em vez de aparecer inteira: uma linha que surge pronta lê
                como parte do fundo que sempre esteve ali, e esta linha é
                consequência de uma pergunta. `inset-y-0` a faz correr a altura
                cheia da coluna, que o grid estica até a mais alta das duas. */}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0 hidden w-px origin-top bg-white/[0.10] lg:block"
              initial={false}
              animate={{ scaleY: aberto ? 1 : 0 }}
              transition={{ duration: parado ? 0 : PARTIDA / 1000, ease: EASE }}
            />

            {/*
             * A promessa, enquanto a coluna ainda está vazia.
             *
             * Ela é a razão de a seção se partir no CLIQUE e não na pergunta.
             * Sem ela, clicar para escrever abriria metade da tela em branco — e
             * meia tela em branco lê como coisa quebrada, não como espaço
             * reservado. Dizendo o que vai acontecer ali, o mesmo vazio vira
             * promessa, e o campo crescendo do outro lado ganha consequência.
             *
             * Nasce DEPOIS da divisória, com o atraso de uma partida: ela é o
             * conteúdo de um espaço que ainda está sendo aberto, e conteúdo que
             * aparece antes do continente lê como texto boiando.
             *
             * Em `white/25`, e não na cor do texto: isto não é uma resposta, é o
             * lugar onde uma vai nascer. No dia em que ler com o mesmo peso das
             * respostas de verdade, vira ruído em cima delas.
             */}
            <AnimatePresence>
              {aberto && !limpando && trocas.length === 0 && (
                <motion.div
                  key="espera"
                  initial={parado ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.5, ease: EASE, delay: parado ? 0 : PARTIDA / 1000 }}
                  className="max-w-md"
                >
                  <p className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-white/25 md:text-[1.9rem]">
                    {ESPERA.titulo}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/25">{ESPERA.corpo}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/*
             * A barra de limpar, e ela só existe quando há o que limpar.
             *
             * O dono viu o defeito de uso: cada pergunta empilha uma resposta e a
             * seção só cresce — quem faz cinco perguntas termina com uma página
             * de texto embaixo do campo. Limpar aqui não destrói nada, e é por
             * isso que é seguro: as respostas voltam com UM clique, porque os
             * atalhos que tinham sumido reaparecem no mesmo gesto. O que se apaga
             * é o histórico da sessão, não a informação.
             *
             * A contagem à esquerda existe para o botão ter sujeito. "Limpar"
             * sozinho não diz o que vai embora; "3 respostas · Limpar" diz.
             */}
            <AnimatePresence initial={false}>
              {trocas.length > 0 && (
                <motion.div
                  key="barra"
                  layout={!parado}
                  initial={parado ? undefined : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex items-center justify-between border-b border-white/[0.08] pb-3"
                >
                  {/* Só a contagem aqui. Os pontos desceram para junto de cada
                      pergunta, que é onde o dono os quis: empilhados nesta barra
                      eles eram um resumo de uma lista que já está logo abaixo —
                      ao lado da pergunta, cada um marca a SUA. O texto fica
                      porque o botão precisa de sujeito: "Limpar" sozinho não diz
                      o que vai embora. */}
                  <span className="text-[13px] text-white/35">
                    {trocas.length} {trocas.length === 1 ? 'resposta' : 'respostas'}
                  </span>

                  {/* Branco e cheio, e é o único botão sólido desta seção. Ele
                      não disputa com o de enviar: quando este existe, o campo
                      já foi usado, e a ação que sobra na tela é desfazer. */}
                  <button
                    type="button"
                    onClick={limpar}
                    className="group flex shrink-0 items-center gap-1.5 rounded-full bg-[#F4F1E8] py-1.5 pl-3 pr-3.5 text-[13px] font-medium text-[#0B0B0B] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {/* O X gira meia volta com a mão em cima. É o único movimento
                        do botão, e ele antecipa o que o clique faz: alguma coisa
                        vai ser desfeita. */}
                    <X
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none"
                      strokeWidth={2}
                    />
                    Limpar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* As respostas, a mais nova em cima. */}
            <div className="mt-8 flex flex-col gap-8">
              <AnimatePresence initial={false}>
                {trocas.map((troca, i) => (
                  <motion.div
                    key={troca.id}
                    layout={!parado}
                    {...entrada}
                    /*
                     * A saída é em cascata, de cima para baixo, e não em bloco.
                     *
                     * Todas somem no mesmo clique — se saíssem juntas, a seção
                     * inteira piscaria e o olho não teria o que seguir. Com seis
                     * centésimos entre uma e outra, o que se vê é uma varrida: a
                     * pilha é levantada de cima, e o pé da página sobe atrás dela.
                     * O `layout` é quem faz esse "atrás dela" acontecer sem
                     * ninguém animar altura na mão.
                     */
                    exit={
                      parado
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            y: -16,
                            scale: 0.97,
                            transition: {
                              duration: SAIDA / 1000,
                              ease: EASE,
                              delay: (i * CASCATA) / 1000,
                            },
                          }
                    }
                  >
                    {/* A pergunta fica à vista junto da resposta: sem ela, três
                        respostas empilhadas viram três parágrafos sobre nada.

                        E o ponto vem com ela, na cor daquela dúvida — o mesmo
                        que acendeu lá em cima quando a resposta chegou. É o que
                        liga os dois sem legenda nenhuma.

                        `items-start` com a margem em `em`, e não `items-center`:
                        centrado, o ponto de uma pergunta que quebra em duas
                        linhas escorregaria para o meio das duas. Em `em` ele
                        acompanha o corpo do título, que muda de 1,5 para 1,9rem
                        em `md` — um valor em pixels ficaria certo num
                        breakpoint e errado no outro. */}
                    <div className="flex items-start gap-3">
                      <span className="mt-[0.42em] shrink-0">
                        <Bolinhas
                          pontos={[{ chave: String(troca.id), cor: troca.cor }]}
                          parado={parado}
                        />
                      </span>
                      <p className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-[#F4F1E8] md:text-[1.9rem]">
                        {comoTitulo(troca.pergunta)}
                      </p>
                    </div>

                    <div className="mt-3 border-l border-white/[0.14] pl-5">
                      {troca.paragrafos.map((paragrafo, i) => (
                        <p
                          key={paragrafo}
                          className={`text-[15px] leading-relaxed text-white/70 md:text-base ${
                            i > 0 ? 'mt-3' : ''
                          }`}
                        >
                          {/* O segundo parágrafo começa depois do primeiro, e não
                              junto: o atraso é o tempo de ler o de cima. Sem ele
                              os dois se montam ao mesmo tempo e o efeito vira
                              ruído. */}
                          <Revela texto={paragrafo} atraso={i * 0.24} parado={parado} />
                        </p>
                      ))}

                      {troca.escape && (
                        <div className="mt-6">
                          <MotionButton label={SEM_RESPOSTA.acao} href={HREF_FORMS} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/*
       * As perguntas e as respostas também em dado estruturado.
       *
       * O que o Google indexa é o que está no HTML, e aqui as respostas só
       * entram no documento depois de um clique — sem isto, uma seção inteira de
       * conteúdo que responde exatamente o que as pessoas pesquisam seria
       * invisível para busca. É a mesma fonte da tela, montada do mesmo array,
       * então as duas não têm como divergir.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            /* Aqui vão as VINTE E TRÊS, e é o único lugar em que a distinção
               não vale: quem lê isto é o buscador, e ele não tem bandeja de
               atalhos para lotar. Cada resposta escondida é uma pergunta a mais
               pela qual a página pode ser encontrada. */
            mainEntity: DUVIDAS.map((duvida) => ({
              '@type': 'Question',
              name: duvida.pergunta,
              acceptedAnswer: { '@type': 'Answer', text: duvida.resposta.join(' ') },
            })),
          }),
        }}
      />
    </section>
  );
}
