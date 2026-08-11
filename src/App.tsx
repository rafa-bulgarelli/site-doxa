import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { ANCORA_FORMS, HREF_FORMS } from './ancoras';
import { ProvedorDeIdioma, useIdioma, type PorIdioma } from './idioma';
import { usarNaTela } from './hooks/usarNaTela';
import { Hero } from './components/Hero';
import { Rolador } from './components/ui/Rolador';
import { Cabecalho } from './components/Cabecalho';

/**
 * Tudo abaixo da primeira dobra sai do pacote inicial.
 *
 * O site é uma SPA sem pré-render: o HTML chega vazio e NADA aparece até o
 * JavaScript baixar, ser lido e executar. Enquanto isso acontece, o visitante
 * está olhando para preto — e estava esperando também pela parede de prova e
 * pelo miolo animado do "Como funciona", que somam duas mil das cinco mil e
 * setecentas linhas do site e não desenham um pixel da tela que ele está
 * vendo.
 *
 * O `.then` existe porque `lazy` quer um módulo com export `default` e estes
 * componentes são exports nomeados — a alternativa seria trocar a forma de
 * exportar de quatro arquivos para agradar a uma função.
 */
const HowItWorks = lazy(() =>
  import('./components/HowItWorks').then((m) => ({ default: m.HowItWorks })),
);
const ProofWall = lazy(() =>
  import('./components/ProofWall').then((m) => ({ default: m.ProofWall })),
);
const Comparacao = lazy(() =>
  import('./components/Comparacao').then((m) => ({ default: m.Comparacao })),
);
const Faq = lazy(() => import('./components/Faq').then((m) => ({ default: m.Faq })));
const Rodape = lazy(() => import('./components/Rodape').then((m) => ({ default: m.Rodape })));

/**
 * A Central de leads, na rota `/leads`.
 *
 * `lazy` como as seções, e por um motivo mais forte do que o delas: ninguém que
 * veio ver a página de vendas deve baixar um byte do painel interno. Ele só
 * existe no navegador de quem digitou a rota.
 */
const Leads = lazy(() => import('./leads/Rota'));

/**
 * Qual página está sendo pedida.
 *
 * Um `switch` no caminho, e não um roteador: o site tem DUAS rotas, e nenhuma
 * delas navega para a outra — a Central se chega por URL digitada, não por link.
 * `react-router` resolveria isto com 12 kB e um provider em volta da página
 * inteira. Se um dia houver uma terceira rota com navegação de verdade, é o
 * momento de trocar; hoje seria abstração sem consumidor.
 *
 * A `vercel.json` já reescreve tudo para o `index.html`, então `/leads` chega
 * aqui inteiro depois de um recarregamento ou de um link colado.
 */
function ehCentralDeLeads() {
  return window.location.pathname.replace(/\/+$/, '') === '/leads';
}

/**
 * O título e a descrição do documento, no idioma escolhido.
 *
 * O `index.html` continua em português, e está certo assim: é o que os
 * robôs de busca leem, e o padrão do site é o Brasil. Isto aqui corrige a ABA
 * e o que um leitor de tela anuncia para quem trocou de idioma — a única parte
 * do `<head>` que uma SPA consegue mudar de verdade. SEO em inglês de verdade
 * (hreflang, rota própria, prerender) é o card de SEO internacional, não um
 * `useEffect`.
 */
const META: PorIdioma<{ titulo: string; descricao: string }> = {
  pt: {
    titulo: 'Doxa — Um milhão de views. Ou seu dinheiro de volta.',
    descricao:
      'Uma foto e um áudio viram sessenta conteúdos em noventa dias. Um milhão de views somadas, ou seu dinheiro de volta.',
  },
  en: {
    titulo: 'Doxa — One million views. Or your money back.',
    descricao:
      'One photo and one audio clip become sixty videos in ninety days. One million combined views, or your money back.',
  },
  es: {
    titulo: 'Doxa — Um milhão de views. Ou seu dinheiro de volta.',
    descricao:
      'Uma foto e um áudio viram sessenta conteúdos em noventa dias. Um milhão de views somadas, ou seu dinheiro de volta.',
  },
};

function MetaDoIdioma() {
  const [idioma] = useIdioma();
  useEffect(() => {
    document.title = META[idioma].titulo;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', META[idioma].descricao);
  }, [idioma]);
  return null;
}

/**
 * O vão que uma seção ocupa enquanto o seu pedaço não chegou.
 *
 * Preto sobre preto, com uma tela de altura: se alguém rolar mais rápido do que
 * a rede, encontra o fundo da página em vez de um salto de layout. Na prática
 * quase ninguém vê isto — o carregamento adiantado abaixo busca os três pedaços
 * enquanto a pessoa ainda está lendo o hero.
 */
function Vao() {
  return <div className="min-h-screen" aria-hidden />;
}

/**
 * A seção que para de animar quando sai da tela.
 *
 * As seções são `lazy` na CHEGADA e nunca na saída: montada uma vez, cada
 * `@keyframes ... infinite` dentro delas gira para sempre. MEDIDO num telefone
 * com a CPU quatro vezes mais lenta, com o formulário aberto e ninguém tocando
 * em nada, era o que sobrava da conta depois de o resto ter sido freado.
 *
 * Um `div` simples de propósito. Ele não tem classe, não tem estilo e não cria
 * contexto de empilhamento nem bloco de contenção — o `sticky` de dentro das
 * seções continua se agarrando à `section` dele, que é onde sempre esteve.
 * Precisa ser um elemento COM CAIXA: `display: contents` seria mais discreto e
 * não serve, porque um elemento sem caixa nunca intersecta nada e o observador
 * nunca falaria.
 *
 * O freio é só de animação — o conteúdo continua montado, medível e rolável.
 */
function SecaoViva({ children }: { children: ReactNode }) {
  const [no, setNo] = useState<HTMLDivElement | null>(null);
  const naTela = usarNaTela(no);
  return (
    <div ref={setNo} className={naTela ? undefined : 'fora-da-tela'}>
      {children}
    </div>
  );
}

/**
 * As seis seções do site, na ordem que o dono desenhou:
 * hero · como funciona · prova · comparação (CTA) · FAQ · rodapé.
 *
 * As seis existem. A `SemCom` está de STAND BY fora daqui: ela continua no
 * repositório, inteira, e saiu da página por decisão do dono — 640vh de linha
 * do tempo presa ao scroll, logo antes do pedido, transformava em passageiro
 * justamente quem devia estar decidindo. A `Comparacao` ocupa o lugar dela com
 * o mesmo argumento e sem sequestrar o scroll.
 */
export default function App() {
  // Lido uma vez: sem navegação entre as duas rotas, o caminho não muda sem um
  // recarregamento — e um estado que escuta `popstate` seria um ouvinte para um
  // evento que este site não dispara.
  const [naCentral] = useState(ehCentralDeLeads);

  /**
   * Os pedaços de baixo, buscados assim que o navegador fica ocioso.
   *
   * Dividir o pacote sem isto trocaria um problema por outro: o visitante
   * chegaria mais rápido ao hero e depois esperaria uma seção de cada vez, no
   * meio da rolagem, que é o pior lugar para esperar. Aqui o download acontece
   * durante os segundos em que ele lê a promessa da dobra — a rede está livre
   * justamente nesse intervalo, porque tudo que a primeira tela precisava já
   * chegou.
   *
   * `requestIdleCallback` cede a vez para o hero: as animações de entrada, os
   * fios e o vídeo têm prioridade sobre um pedido que só interessa daqui a dez
   * segundos. O `timeout` é o limite da paciência — numa máquina que nunca
   * fica ociosa, o navegador é obrigado a chamar assim mesmo.
   */
  useEffect(() => {
    /**
     * ─── QUEM PAGA A CONTA DECIDE ────────────────────────────────────────────
     *
     * O adiantamento acima assume uma rede com folga: cinco pedidos que não
     * servem à tela atual, disparados de graça porque a banda estava sobrando.
     * Num 3G ou num plano com economia de dados ligada, essa premissa se
     * inverte — os cinco pedidos passam a disputar banda com o que a primeira
     * dobra ainda está baixando, e o visitante paga em segundos de espera por
     * uma seção que talvez nunca role até ver.
     *
     * `saveData` é o pedido explícito de quem ligou a economia no aparelho, e
     * recusá-lo seria gastar dado alheio contra a vontade declarada. O
     * `effectiveType` cobre a rede que está ruim sem ninguém ter pedido nada.
     *
     * Sem o adiantamento, cada seção volta a ser buscada quando a rolagem
     * chega nela — mais lento no meio do caminho, e é exatamente a troca certa
     * aqui: numa rede ruim, um atraso no meio da rolagem é melhor do que um
     * atraso na primeira tela, que é a única que todo mundo vê.
     *
     * A API não existe no Safari, e `undefined` cai no caminho generoso de
     * propósito: na dúvida, o comportamento é o de antes desta linha.
     */
    const rede = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const apertada =
      rede?.saveData === true ||
      rede?.effectiveType === 'slow-2g' ||
      rede?.effectiveType === '2g' ||
      rede?.effectiveType === '3g';
    if (apertada) return;

    const puxar = () => {
      void import('./components/HowItWorks');
      void import('./components/ProofWall');
      void import('./components/Comparacao');
      void import('./components/Faq');
      void import('./components/Rodape');
    };

    // Testado por `typeof`, e não com `in`: os tipos do DOM já declaram
    // `requestIdleCallback` em `Window`, então `'x' in window` faz o
    // TypeScript concluir que o outro caminho é impossível e estreitar
    // `window` para `never` — o Safari, que é quem não tem a função, discorda.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(puxar, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    // Um atraso fixo é a aproximação honesta: tempo suficiente para a primeira
    // dobra terminar de montar.
    const id = window.setTimeout(puxar, 1500);
    return () => window.clearTimeout(id);
  }, []);

  /**
   * ─── O SEGURO DA ÂNCORA `#forms` ─────────────────────────────────────────
   *
   * `#forms` marca o painel claro da comparação, e a comparação é `lazy`. Nos
   * primeiros segundos de visita ela ainda não montou — o que existe no lugar
   * dela é o vão do `Suspense`, e o elemento com esse `id` não está no
   * documento. Um clique nesse intervalo é o pior defeito possível numa CTA: o
   * navegador não acha o fragmento, não rola um pixel, não escreve nada no
   * console, e a pessoa conclui que o botão do site não funciona.
   *
   * A janela é curta mas real. O botão do topo está visível no primeiro quadro,
   * e o carregamento adiantado acima só acontece quando o navegador fica ocioso
   * — numa rede lenta, ou numa máquina ocupada, isso é segundo e meio depois.
   * Quem clica em "Quero viralizar" assim que lê o título cai bem no meio dela.
   *
   * Então: se o alvo já existe, este ouvinte não faz NADA e o salto é o do
   * navegador, com a rolagem suave do CSS. Se não existe, ele segura o clique,
   * puxa o pedaço na hora e rola quando o alvo aparecer.
   *
   * A espera é por QUADRO, e não um atraso fixo: o `import` resolver significa
   * que o código chegou, não que o React já pintou o painel. Sessenta quadros
   * são cerca de um segundo — depois disso, desiste em silêncio, que é o mesmo
   * que teria acontecido sem este seguro.
   */
  useEffect(() => {
    const rolarQuandoChegar = (quadrosRestantes: number) => {
      const alvo = document.getElementById(ANCORA_FORMS);
      if (alvo) {
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (quadrosRestantes > 0) {
        window.requestAnimationFrame(() => rolarQuandoChegar(quadrosRestantes - 1));
      }
    };

    const aoClicar = (evento: MouseEvent) => {
      // Cliques com modificador são "abrir noutra aba/janela", e são do
      // navegador. Botão do meio não gera `click` em toda plataforma, mas o
      // `button` é testado do mesmo jeito — só o principal é nosso.
      if (evento.defaultPrevented || evento.button !== 0) return;
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

      const alvo = evento.target as Element | null;
      if (!alvo?.closest(`a[href="${HREF_FORMS}"]`)) return;
      if (document.getElementById(ANCORA_FORMS)) return;

      evento.preventDefault();
      void import('./components/Comparacao').then(() => rolarQuandoChegar(60));
    };

    document.addEventListener('click', aoClicar);
    return () => document.removeEventListener('click', aoClicar);
  }, []);

  /*
   * A Central sai antes de tudo que a landing monta.
   *
   * Não é otimização: o `Rolador`, o rodapé fixo e as seções `lazy` são peças da
   * PÁGINA DE VENDAS, e desenhá-las atrás de um painel de trabalho seria um
   * rodapé aparecendo no meio de uma tabela de leads.
   */
  if (naCentral) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-doxa-bg" aria-hidden />}>
        <Leads />
      </Suspense>
    );
  }

  /* O provedor de idioma abraça a página inteira, e não só o cabeçalho.
     Hoje quem lê são duas peças do topo — o menu e o relógio —, e as duas
     PRECISAM ver o mesmo valor: com o estado solto em cada uma, trocar de
     idioma no menu deixaria o relógio em português para sempre. Amanhã, quando
     as seções forem traduzidas, elas já encontram o valor aqui. */
  return (
    <ProvedorDeIdioma>
      {/* FORA do `<main>`, como o `Rolador`: o cabeçalho é `fixed` e sobrevoa a
          página inteira. Dentro dele, sumiria junto com a página no reveal do
          rodapé — e o fim da rolagem é justamente onde alguém pode querer
          voltar ao topo. */}
      <MetaDoIdioma />
      <Cabecalho />

      {/*
       * O `<main>` é OPACO e vem por cima, e é só isso que faz o rodapé se
       * revelar.
       *
       * O rodapé é `fixed` no pé da janela desde o primeiro pixel do site
       * (`Rodape.tsx` explica o porquê). O que o esconde durante toda a rolagem
       * é esta camada: preta, e um degrau acima dele. Chegando ao fim, a página
       * desliza para fora da frente e o que estava atrás aparece — o site sai da
       * frente do rodapé, em vez de o rodapé chegar.
       *
       * `relative` porque `z-index` não faz nada em `position: static`, e sem
       * ele o rodapé fixo ficaria por cima da página inteira.
       */}
      <main className="relative z-10 bg-black">
        <SecaoViva>
          <Hero />
        </SecaoViva>
        {/* Um `Suspense` por seção, e não um em volta das três: com um só, a
            seção mais lenta seguraria as outras duas prontas fora da tela. */}
        <Suspense fallback={<Vao />}>
          <SecaoViva>
            <HowItWorks />
          </SecaoViva>
        </Suspense>
        <Suspense fallback={<Vao />}>
          <SecaoViva>
            <ProofWall />
          </SecaoViva>
        </Suspense>
        <Suspense fallback={<Vao />}>
          <SecaoViva>
            <Comparacao />
          </SecaoViva>
        </Suspense>
        {/* O FAQ vem DEPOIS do pedido, e não antes. Perguntas frequentes antes
            do formulário são uma lista de objeções apresentada a quem ainda não
            objetou nada; depois dele, são a última porta para quem chegou até o
            fim e travou em alguma coisa. */}
        <Suspense fallback={<Vao />}>
          <SecaoViva>
            <Faq />
          </SecaoViva>
        </Suspense>
      </main>

      {/* O rodapé fecha com o mesmo verbo com que o hero abriu: lá se arrasta a
          foto e o áudio que a pessoa vai entregar, aqui se arrasta um campo que
          não acaba e não pede nada. O último objeto da página é o único em que
          mexer não tem consequência — e é por isso que ele pode ser brinquedo.

          FORA do `<main>`, e é obrigatório que seja: ele é a camada de baixo do
          reveal, e o `<main>` é a de cima. Dentro dele, o rodapé estaria dentro
          da própria coisa que existe para escondê-lo. */}
      <Suspense fallback={<Vao />}>
        <Rodape />
      </Suspense>

      {/* A barra de rolagem, nossa. Fora do `<main>` e depois do rodapé: ela
          flutua sobre a página inteira, e é a única coisa do site que precisa
          ficar acima das duas camadas do reveal. NÃO é `lazy` — ela desenha na
          primeira dobra, e um pedaço separado só para ela chegaria depois da
          primeira rolagem, que é justamente quando ela deveria aparecer. */}
      <Rolador />
    </ProvedorDeIdioma>
  );
}
