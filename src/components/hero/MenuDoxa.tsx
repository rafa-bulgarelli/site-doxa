import { CommandMenu, type SecaoDeMenu } from '../ui/CommandMenu';
import { IDIOMAS, useIdioma, type Idioma, type PorIdioma } from '../../idioma';
import type { HeroCase } from './cases';

/**
 * ─── O MENU DO TOPO ──────────────────────────────────────────────────────────
 *
 * A `CommandMenu` não sabe o que é uma seção do site nem o que é um idioma.
 * Este arquivo é quem sabe: ele traduz a pílula genérica para o vocabulário
 * desta página — as seis seções, os três idiomas, a foto do case que está no ar.
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
  rotulos: Readonly<Record<Secao, string>>;
}

const TEXTO: PorIdioma<TextoDoMenu> = {
  pt: {
    titulo: 'Menu',
    viralize: 'Viralize agora',
    secoes: 'Seções',
    idiomas: 'Idiomas',
    nav: 'Menu principal',
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

interface MenuDoxaProps {
  /**
   * O case que está no ar no canvas do hero.
   *
   * O quadradinho da pílula mostra a foto DESTE cliente e a linha de status diz
   * quem ele é — então o menu não é enfeite: ele carrega prova, e ela troca
   * junto com o deck lá embaixo.
   */
  caso: HeroCase;
}

export function MenuDoxa({ caso }: MenuDoxaProps) {
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
      /* Fechada, ela é o buraco que `Hero.tsx` reservou no cabeçalho — as duas
         medidas têm de bater. Aberta, cresce para a ESQUERDA, porque o
         contêiner que a segura é ancorado à direita: é assim que o painel ganha
         largura para a grade de três idiomas sem empurrar botão nenhum.

         Os dois números saíram de MEDIÇÃO, não de estimativa. A linha do
         cabeçalho é `overflow-hidden`, então texto que não cabe some sem aviso —
         e a frase mais comprida dos três idiomas é o espanhol "Hazte viral
         ahora". Medido no Chrome: 88 px na Almarai e 91 px na reserva
         sans-serif, o que dá 165 px de conteúdo no celular (sem a tecla) e
         203 px no desktop (com ela). Daí 176 e 224 — folga de 11 px e de 21 px
         sobre o PIOR caso, que é o espanhol antes de a webfont chegar.

         No celular a folga é vazio no fim da pílula, e por isso ela é curta. No
         desktop ela é o respiro entre o texto e a tecla, que se encostassem
         ficariam ilegíveis — ali a folga maior é o ponto. */
      larguraFechada="max-w-44 md:max-w-56"
      larguraAberta="max-w-[min(20rem,calc(100vw-2.5rem))]"
      titulo={texto.titulo}
      secoes={secoes}
      avatar={<AvatarDoCase caso={caso} />}
      status={[
        <span key="viralize" className="flex items-center gap-1.5">
          {/* O ÚNICO pixel colorido do site. `tailwind.config.js` explica a
              exceção; `animate-pulse` é o que diz "agora" sem uma palavra. */}
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-doxa-sinal" />
          {texto.viralize}
        </span>,
        caso.handle ?? caso.name,
      ]}
    />
  );
}

/**
 * A foto do cliente, no quadradinho da pílula.
 *
 * `photoThumbUrl` e não `photoUrl`: são 36 pixels na tela, e `cases.ts` conta
 * quanto custou servir o arquivo grande num espaço deste tamanho — 82 KB para
 * pintar 56 px. A miniatura de 168 px é exatamente esta caixa em densidade
 * tripla, e ela já está na rede por causa do deck de cases logo abaixo.
 *
 * Sem foto entregue, um degradê monocromático em vez de uma moldura vazia. A
 * pílula não pode encolher meia linha porque um case ainda não tem imagem.
 */
function AvatarDoCase({ caso }: { caso: HeroCase }) {
  if (caso.photoThumbUrl == null) {
    return (
      <span
        aria-hidden
        className="block h-9 w-9 shrink-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/[0.04]"
      />
    );
  }

  return (
    <img
      src={caso.photoThumbUrl}
      // Decorativa: quem é o cliente já está escrito na linha de status ao lado,
      // e um `alt` com o nome dele faria o leitor de tela dizer duas vezes.
      alt=""
      aria-hidden
      width={168}
      height={168}
      className="h-9 w-9 shrink-0 rounded-2xl object-cover"
    />
  );
}
