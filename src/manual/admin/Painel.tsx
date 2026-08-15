/**
 * ─── O PAINEL DA EQUIPE ──────────────────────────────────────────────────────
 *
 * A rota `/manual-doxa/admin`. O portão vem primeiro: sem sessão, nada aqui
 * renderiza — e não por decoração, mas porque as políticas do banco não
 * entregam uma linha para quem não está autenticado.
 *
 * O roteamento interno é por SEGMENTO, e os segmentos chegam do `Rota.tsx` já
 * sem o 'admin':
 *
 *   []                        visão geral
 *   ['convites']              a lista
 *   ['convites', '<id>']      o detalhe de um convite
 *   ['manual']                as versões
 *   ['manual', '<versaoId>']  o conteúdo (editor, se for rascunho)
 *   ['previa']                o manual como o cliente o vê, sem convite
 *
 * A prévia sai da moldura de propósito — ela É a tela do cliente, e o motivo
 * está no cabeçalho do `PreviaDoManual`.
 *
 * Este arquivo é `lazy` a partir do `Rota`: quem abre o link de convite no
 * celular não baixa um byte de nada que está aqui dentro.
 */
import { useState } from 'react';
import { BookLock, LogOut, RefreshCw } from 'lucide-react';
import { sair, sessaoAtiva, temBanco } from '../../leads/deposito';
import { ROTA_BASE } from '../config';
import { ConviteDetalhe } from './ConviteDetalhe';
import { Convites } from './Convites';
import { Portao } from './Portao';
import { PreviaDoManual } from './PreviaDoManual';
import { VersaoEditor } from './VersaoEditor';
import { Versoes } from './Versoes';
import { VisaoGeral } from './VisaoGeral';
import { Aviso, BOTAO_BORDA } from './pecas';
import { usarAdmin } from './usarAdmin';
import type { EstadoDoPainel } from './usarAdmin';
import type { Situacao } from './filtrar';
import type { PropsDeRota } from '../tipos';

const ABAS = [
  { chave: '', rotulo: 'Visão geral' },
  { chave: 'convites', rotulo: 'Convites' },
  { chave: 'manual', rotulo: 'Manual' },
  { chave: 'previa', rotulo: 'Ver como o cliente vê' },
] as const;

/** O que decide qual tela aparece — separado para o `switch` caber na cabeça. */
function Conteudo({
  segmentos,
  painel,
  ir,
  situacaoInicial,
  verConvites,
}: {
  segmentos: string[];
  painel: EstadoDoPainel;
  ir: (destino: string) => void;
  situacaoInicial: Situacao | 'todos';
  verConvites: (situacao: Situacao) => void;
}) {
  // Caminho vazio é a visão geral: `/manual-doxa/admin` chega aqui como `[]`.
  const area = segmentos[0] ?? '';
  const alvo: string | undefined = segmentos[1];
  switch (area) {
    case '':
      return <VisaoGeral painel={painel} ir={ir} verConvites={verConvites} />;
    case 'convites':
      return alvo == null ? (
        <Convites painel={painel} ir={ir} situacaoInicial={situacaoInicial} />
      ) : (
        <ConviteDetalhe id={alvo} painel={painel} ir={ir} />
      );
    case 'manual':
      return alvo == null ? (
        <Versoes painel={painel} ir={ir} />
      ) : (
        <VersaoEditor versaoId={alvo} painel={painel} ir={ir} />
      );
    default:
      return (
        <Aviso
          titulo="Esta página não existe."
          corpo="O endereço não bate com nenhuma tela da área do time."
          acao={{ rotulo: 'Ir para a visão geral', aoClicar: () => ir('') }}
        />
      );
  }
}

/** A moldura: cabeçalho, abas e o conteúdo. Só existe com sessão. */
function Area({
  segmentos,
  navegar,
  aoSair,
}: {
  segmentos: string[];
  navegar: (destino: string) => void;
  aoSair: () => void;
}) {
  const painel = usarAdmin();
  /* O filtro inicial da lista viaja por estado e não pela URL: o roteador do
     manual fatia o CAMINHO, e uma query no `pushState` viraria um segmento
     inventado na próxima navegação. */
  const [situacaoInicial, setSituacaoInicial] = useState<Situacao | 'todos'>('todos');

  const ir = (destino: string) => navegar(`${ROTA_BASE}/admin${destino}`);

  const verConvites = (situacao: Situacao) => {
    setSituacaoInicial(situacao);
    ir('/convites');
  };

  const sairDaConta = () => {
    sair();
    aoSair();
  };

  const abaAtiva = segmentos[0] ?? '';

  /* A prévia é a única tela desta área que NÃO usa a moldura: ela mostra o
     manual como o cliente o recebe, e o cliente não vê abas nem cabeçalho de
     administração. Ela trata os próprios estados de carga porque roda fora do
     `if` de sessão/erro que protege o resto do painel. */
  if (abaAtiva === 'previa') return <PreviaDoManual painel={painel} ir={ir} />;

  return (
    <main className="min-h-screen bg-doxa-bg px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/50">
              <BookLock className="h-3 w-3" strokeWidth={2} />
              Manual DOXA
            </span>
            <h1 className="mt-4 font-serif text-[2.2rem] leading-none tracking-[-0.02em] text-white md:text-[2.8rem]">
              Área do time
            </h1>
            <p className="mt-2 max-w-xl text-[15px] leading-snug text-white/45">
              Crie o convite, mande o link, acompanhe o aceite. E cuide das versões do manual que
              o cliente assina.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void painel.recarregar()}
              className={BOTAO_BORDA}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${painel.carga === 'carregando' ? 'animate-spin' : ''}`}
                strokeWidth={2}
              />
              Atualizar
            </button>
            <button
              type="button"
              onClick={sairDaConta}
              aria-label="Sair da área do time"
              className="rounded-full border border-white/[0.14] p-2.5 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="mt-8 inline-flex rounded-full border border-white/[0.1] bg-white/[0.03] p-1">
          {ABAS.map((aba) => (
            <button
              key={aba.chave}
              type="button"
              onClick={() => ir(aba.chave.length === 0 ? '' : `/${aba.chave}`)}
              aria-pressed={abaAtiva === aba.chave}
              className={`rounded-full px-5 py-2.5 text-[14px] transition-colors ${
                abaAtiva === aba.chave ? 'bg-white text-black' : 'text-white/55 hover:text-white'
              }`}
            >
              {aba.rotulo}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {painel.carga === 'sessao' ? (
            <Aviso
              titulo="A sessão venceu."
              corpo="Por segurança, a entrada expira. Entre de novo para ver os convites."
              acao={{ rotulo: 'Entrar de novo', aoClicar: sairDaConta }}
            />
          ) : painel.carga === 'erro' ? (
            <Aviso
              titulo="Não deu para carregar."
              corpo={painel.erro ?? 'Pode ser a rede daqui ou o banco do outro lado.'}
              acao={{ rotulo: 'Tentar de novo', aoClicar: () => void painel.recarregar() }}
            />
          ) : (
            <Conteudo
              segmentos={segmentos}
              painel={painel}
              ir={ir}
              situacaoInicial={situacaoInicial}
              verConvites={verConvites}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default function Painel({ segmentos, navegar }: PropsDeRota) {
  const [dentro, setDentro] = useState(() => sessaoAtiva());

  /*
   * Sem Supabase configurado não existe área do time — e dizer isso é melhor do
   * que mostrar um painel vazio. A Central tem um modo simulado porque o
   * formulário da landing precisa dele; o manual fala com a API e com o
   * PostgREST de verdade, e um banco de mentira aqui só ensinaria a confiar
   * numa tela que não é a de produção.
   */
  if (!temBanco) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-doxa-bg px-5 py-16">
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-[1.8rem] leading-tight text-white">
            Sem banco conectado.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/50">
            A área do manual lê o Supabase direto. Configure `VITE_SUPABASE_URL` e
            `VITE_SUPABASE_ANON_KEY` neste ambiente para entrar.
          </p>
        </div>
      </main>
    );
  }

  if (!dentro) return <Portao aoEntrar={() => setDentro(true)} />;

  return <Area segmentos={segmentos} navegar={navegar} aoSair={() => setDentro(false)} />;
}
