import { CommandMenu, type SecaoDeMenu } from '../ui/CommandMenu';
import { IDIOMAS, useIdioma, type Idioma, type PorIdioma } from '../../idioma';
import { Bandeira } from './bandeiras';

/**
 * ─── O MENU DO TOPO ──────────────────────────────────────────────────────────
 *
 * A `CommandMenu` não sabe o que é uma seção do site nem o que é um idioma.
 * Este arquivo é quem sabe: ele traduz a pílula genérica para o vocabulário
 * desta página — as seis seções e os três idiomas, com as bandeiras deles.
 *
 * ─── AS SEÇÕES SÃO AS DE VERDADE ─────────────────────────────────────────────
 *
 * A navegação que este menu substitui era "Produto · Como funciona · Empresa",
 * três `href="#"` que rolavam zero pixel — e duas delas nomeando páginas que
 * este site nunca teve. O que entra no lugar são as seis seções que EXISTEM,
 * lidas pelo atributo que elas já carregam.
 */

/**
 * As seis seções, pelo valor do `data-secao` que cada uma declara no DOM.
 *
 * A string é a CHAVE e o alvo da rolagem ao mesmo tempo, e é por isso que ela
 * fica em português mesmo quando o menu está em inglês: o que traduz é o
 * rótulo, não o contrato com o DOM. Trocar isto exige trocar a `<section>`
 * correspondente na mesma janela.
 *
 * `Rolador.tsx` documenta por que os `data-secao` continuam lá depois de a
 * barra ter parado de lê-los: são marcação semântica barata, prontos para o
 * próximo consumidor. Este é o próximo consumidor.
 */
const SECOES = [
  'Início',
  'Como funciona',
  'Prova',
  'Quanto custa',
  'Perguntas',
  'Contato',
] as const;

type Secao = (typeof SECOES)[number];

/**
 * Quantos quadros esperar por uma seção que ainda não montou.
 *
 * Quatro das seis são `lazy` — nos primeiros instantes da visita elas ainda são
 * o vão do `Suspense`, e o `data-secao` não está no documento. Um clique nesse
 * intervalo não acharia nada, não rolaria um pixel e não escreveria nada no
 * console: exatamente o defeito que `App.tsx` já teve com a âncora `#forms`, e
 * a mesma cura.
 *
 * Sessenta quadros são cerca de um segundo. Depois disso desiste em silêncio,
 * que é o mesmo que teria acontecido sem a espera.
 */
const QUADROS_DE_ESPERA = 60;

function rolarPara(secao: Secao) {
  const tentar = (restantes: number) => {
    const alvo = document.querySelector(`[data-secao="${secao}"]`);
    if (alvo != null) {
      alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (restantes > 0) {
      window.requestAnimationFrame(() => tentar(restantes - 1));
    }
  };
  tentar(QUADROS_DE_ESPERA);
}

/**
 * O texto do menu nos três idiomas.
 *
 * `PorIdioma` é o que impede o defeito clássico: alguém acrescenta uma frase em
 * português, esquece o espanhol, e quem escolheu espanhol lê `undefined`. Aqui
 * isso não compila.
 *
 * Os nomes dos idiomas NÃO são traduzidos, e é regra e não descuido: quem
 * procura o próprio idioma numa lista procura pela palavra que ele conhece.
 * "Espanhol" não ajuda ninguém que só lê espanhol a achar o espanhol.
 */
interface TextoDoMenu {
  titulo: string;
  viralize: string;
  secoes: string;
  idiomas: string;
  nav: string;
  /** Só para leitor de tela: o "+" é forma, e forma não se anuncia. */
  abrir: string;
  rotulos: Readonly<Record<Secao, string>>;
}

const TEXTO: PorIdioma<TextoDoMenu> = {
  pt: {
    titulo: 'Menu',
    viralize: 'Viralize agora',
    secoes: 'Seções',
    idiomas: 'Idiomas',
    nav: 'Menu principal',
    abrir: 'Abrir o menu',
    rotulos: {
      'Início': 'Início',
      'Como funciona': 'Como funciona',
      'Prova': 'Prova',
      'Quanto custa': 'Quanto custa',
      'Perguntas': 'Perguntas',
      'Contato': 'Contato',
    },
  },
  en: {
    titulo: 'Menu',
    viralize: 'Go viral now',
    secoes: 'Sections',
    idiomas: 'Languages',
    nav: 'Main menu',
    abrir: 'Open menu',
    rotulos: {
      'Início': 'Home',
      'Como funciona': 'How it works',
      'Prova': 'Proof',
      'Quanto custa': 'Pricing',
      'Perguntas': 'FAQ',
      'Contato': 'Contact',
    },
  },
  es: {
    titulo: 'Menú',
    viralize: 'Hazte viral ahora',
    secoes: 'Secciones',
    idiomas: 'Idiomas',
    nav: 'Menú principal',
    abrir: 'Abrir el menú',
    rotulos: {
      'Início': 'Inicio',
      'Como funciona': 'Cómo funciona',
      'Prova': 'Pruebas',
      'Quanto custa': 'Cuánto cuesta',
      'Perguntas': 'Preguntas',
      'Contato': 'Contacto',
    },
  },
};

/** Como cada idioma se chama na própria língua. */
const NOME_DO_IDIOMA: PorIdioma<string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

/**
 * O menu não recebe nada.
 *
 * Ele já recebeu: a foto do case ativo entrava aqui como prop e era o único
 * motivo de esta peça saber que existe um deck de clientes lá embaixo. Saiu a
 * pedido do dono — "menos é mais" —, e com ela saiu o acoplamento inteiro. O
 * `Hero` deixou de precisar passar o case adiante, e o menu passou a ser uma
 * peça que só depende do idioma.
 */
export function MenuDoxa() {
  const [idioma, trocarIdioma] = useIdioma();
  const texto = TEXTO[idioma];

  const secoes: SecaoDeMenu[] = [
    {
      rotulo: texto.secoes,
      itens: SECOES.map((secao) => ({
        nome: texto.rotulos[secao],
        aoEscolher: () => rolarPara(secao),
      })),
    },
    {
      rotulo: texto.idiomas,
      grade: true,
      itens: IDIOMAS.map((valor: Idioma) => ({
        nome: NOME_DO_IDIOMA[valor],
        icone: <Bandeira idioma={valor} />,
        centrado: true,
        ativo: valor === idioma,
        // O painel fica aberto: a única confirmação de que o clique valeu é o
        // contorno mudando de lugar e o texto do menu virando outro idioma, e
        // fechar na hora esconderia as duas coisas.
        mantemAberto: true,
        aoEscolher: () => trocarIdioma(valor),
      })),
    },
  ];

  return (
    <CommandMenu
      id="menu-doxa"
      rotuloNav={texto.nav}
      rotuloAbrir={texto.abrir}
      /* Fechada, ela é o buraco que `Hero.tsx` reservou no cabeçalho — as duas
         medidas têm de bater. Aberta, cresce para a ESQUERDA, porque o
         contêiner que a segura é ancorado à direita: é assim que o painel ganha
         largura para a grade de três idiomas sem empurrar botão nenhum.

         Os números saíram de MEDIÇÃO, não de estimativa. A frase mais comprida
         dos três idiomas é o espanhol "Hazte viral ahora": 88 px na Almarai e
         91 px na reserva sans-serif, medidos no Chrome. Com o disco de 40 px, o
         "+" de 28 e os recuos, o conteúdo pede 195 px — daí os 208 (13rem).

         O `min()` é o que salva o telefone estreito. 208 px fixos somados ao
         logo (91), aos recuos (40) e ao vão (8) dão 347, e uma tela de 320 px
         ganharia rolagem HORIZONTAL — o defeito mais feio que um cabeçalho pode
         ter. Com o `calc`, a pílula cede o que falta abaixo de 352 px de tela e
         mantém os 208 acima disso. Abaixo, quem cede é a linha de status, que
         tem reticências e não corte seco. */
      larguraFechada="max-w-[min(13rem,calc(100vw-9rem))]"
      larguraAberta="max-w-[min(20rem,calc(100vw-2.5rem))]"
      titulo={texto.titulo}
      secoes={secoes}
      avatar={<DiscoLaranja />}
      status={[
        <span key="viralize" className="flex min-w-0 items-center gap-1.5">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-doxa-sinal" />
          {/* `truncate` e `min-w-0` juntos, e os dois são necessários: um item
              de flex não encolhe abaixo do próprio conteúdo sem o `min-w-0`, e
              sem ele o `truncate` nunca teria o que truncar. É o que troca o
              corte no meio da letra por reticências, no telefone estreito onde
              a pílula cede largura. */}
          <span className="truncate">{texto.viralize}</span>
        </span>,
      ]}
    />
  );
}

/**
 * O disco laranja, exatamente o do demo do 21st.
 *
 * Aqui estava a foto do cliente do case ativo, trocando junto com o deck. Saiu
 * a pedido do dono: era mais uma coisa se mexendo num cabeçalho que já tem uma
 * bolinha pulsando, e o menu não precisa provar nada — a prova é a seção
 * inteira lá embaixo.
 *
 * Sem conteúdo e sem rótulo: é forma, não informação. Um `aria-label` aqui
 * faria o leitor de tela anunciar uma decoração antes do nome do menu.
 */
function DiscoLaranja() {
  return (
    <span
      aria-hidden
      className="block h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-orange-300 to-red-500"
    />
  );
}
