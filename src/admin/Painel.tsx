/**
 * ─── O PAINEL ────────────────────────────────────────────────────────────────
 *
 * O que aparece depois da senha: a lista das ferramentas internas, uma por
 * cartão. É a única tela do site que sabe que as três áreas existem juntas — e
 * a única coisa que ela faz por elas é apontar o caminho.
 *
 * NADA de `import` dos módulos das ferramentas aqui dentro. Cada uma é uma rota
 * própria, com pacote `lazy` próprio, e importar uma delas para desenhar um
 * cartão traria a Central inteira (ou o manual inteiro) para o pacote de quem
 * só abriu o menu. Por isso os cartões são ÂNCORAS de verdade: `<a href>` faz a
 * navegação de página completa que este site usa entre rotas — não há router
 * global —, e de quebra continua abrindo em nova aba com o meio do mouse, o que
 * um `onClick` com `location.href` mataria em silêncio.
 *
 * Os destinos são MONTADOS a partir das constantes de rota de cada módulo
 * (`manual/config`, `conversor/config`) em vez de escritos à mão: quando um
 * endereço mudar lá, este menu acompanha, em vez de virar um link morto que só
 * o dono descobre clicando.
 *
 * O motion aqui é só transição de cor no hover, de propósito. Isto é tela de
 * trabalho: quem chega já sabe o que veio fazer, e uma entrada animada em seis
 * cartões atrasaria o clique que a pessoa já tinha decidido.
 */
import { BookOpen, FileCheck2, LogOut, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROTA_BASE as ROTA_DO_CONVERSOR } from '../conversor/config';
import { ROTA_BASE as ROTA_DO_MANUAL } from '../manual/config';
import { sair } from '../leads/deposito';

/** O caminho da área do time dentro do manual — o `Rota.tsx` de lá lê `admin`. */
const ADMIN_DO_MANUAL = `${ROTA_DO_MANUAL}/admin`;

/** Um destino secundário: entra fundo na ferramenta, sem passar pela home dela. */
interface Atalho {
  readonly rotulo: string;
  readonly destino: string;
}

interface Ferramenta {
  readonly nome: string;
  readonly descricao: string;
  readonly destino: string;
  readonly icone: LucideIcon;
  readonly atalhos: readonly Atalho[];
}

/**
 * As ferramentas do time, na ordem de uso.
 *
 * Exportada porque o teste prova os destinos por aqui: um cartão apontando para
 * rota inexistente não dá erro nenhum na tela — dá a landing, que é o pior jeito
 * de descobrir que o link quebrou.
 */
export const FERRAMENTAS: readonly Ferramenta[] = [
  {
    nome: 'Central de Leads',
    descricao: 'Os leads do formulário: score, filtros, exportação.',
    destino: '/leads',
    icone: Users,
    atalhos: [],
  },
  {
    nome: 'Manual do cliente',
    descricao: 'Convites, aceites e versões do manual.',
    destino: ADMIN_DO_MANUAL,
    icone: BookOpen,
    atalhos: [
      { rotulo: 'Prévia do manual', destino: `${ADMIN_DO_MANUAL}/previa` },
      { rotulo: 'Convites', destino: `${ADMIN_DO_MANUAL}/convites` },
    ],
  },
  {
    nome: 'Conversor PDF ↔ Word',
    descricao: 'Sobe PDF, sai Word — e o contrário.',
    destino: ROTA_DO_CONVERSOR,
    icone: FileCheck2,
    atalhos: [],
  },
];

function Cartao({ ferramenta }: { ferramenta: Ferramenta }) {
  const Icone = ferramenta.icone;
  return (
    <li className="flex flex-col rounded-3xl border border-doxa-line bg-doxa-surface p-6 transition-colors hover:border-white/25">
      {/* O cartão inteiro é o link, e o alvo passa de 48px com folga: esta tela
          é usada no celular, entre uma reunião e outra. */}
      <a href={ferramenta.destino} className="flex flex-1 flex-col">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-doxa-line bg-doxa-raised text-white/70">
          <Icone className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h2 className="mt-5 font-serif text-[1.5rem] leading-tight text-white">
          {ferramenta.nome}
        </h2>
        <p className="mt-2 flex-1 text-[16px] leading-relaxed text-white/50">
          {ferramenta.descricao}
        </p>
        <span className="mt-5 text-[13px] uppercase tracking-[0.16em] text-white/40">
          Abrir →
        </span>
      </a>

      {ferramenta.atalhos.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2 border-t border-doxa-line pt-4">
          {ferramenta.atalhos.map((atalho) => (
            <li key={atalho.destino}>
              <a
                href={atalho.destino}
                className="inline-flex min-h-[44px] items-center rounded-full border border-doxa-line bg-doxa-raised px-4 text-[14px] text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                {atalho.rotulo}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Painel({ aoSair }: { aoSair: () => void }) {
  const sairDaConta = () => {
    // Sair apaga a SESSÃO, não uma permissão desta página: quem sai daqui sai
    // das quatro áreas, porque é a mesma conta do time nas quatro.
    sair();
    aoSair();
  };

  return (
    <main className="min-h-screen bg-doxa-bg px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/50">
              Painel
            </span>
            <h1 className="mt-4 font-serif text-[2.2rem] leading-none tracking-[-0.02em] text-white md:text-[2.6rem]">
              Painel DOXA.
            </h1>
            <p className="mt-2 text-[16px] leading-snug text-white/45">
              As ferramentas internas do time, num lugar só.
            </p>
          </div>

          <button
            type="button"
            onClick={sairDaConta}
            aria-label="Sair do painel"
            className="shrink-0 rounded-full border border-white/[0.14] p-2.5 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FERRAMENTAS.map((ferramenta) => (
            <Cartao key={ferramenta.destino} ferramenta={ferramenta} />
          ))}
        </ul>
      </div>
    </main>
  );
}
