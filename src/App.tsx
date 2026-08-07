import { Suspense, lazy, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Rolador } from './components/ui/Rolador';

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

  return (
    <>
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
        <Hero />
        {/* Um `Suspense` por seção, e não um em volta das três: com um só, a
            seção mais lenta seguraria as outras duas prontas fora da tela. */}
        <Suspense fallback={<Vao />}>
          <HowItWorks />
        </Suspense>
        <Suspense fallback={<Vao />}>
          <ProofWall />
        </Suspense>
        <Suspense fallback={<Vao />}>
          <Comparacao />
        </Suspense>
        {/* O FAQ vem DEPOIS do pedido, e não antes. Perguntas frequentes antes
            do formulário são uma lista de objeções apresentada a quem ainda não
            objetou nada; depois dele, são a última porta para quem chegou até o
            fim e travou em alguma coisa. */}
        <Suspense fallback={<Vao />}>
          <Faq />
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
    </>
  );
}
