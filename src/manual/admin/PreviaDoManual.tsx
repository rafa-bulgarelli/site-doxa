/**
 * ─── VER COMO O CLIENTE VÊ ───────────────────────────────────────────────────
 *
 * A rota `/manual-doxa/admin/previa`, atrás do mesmo portão do resto da área.
 * A equipe percorre o manual inteiro — cenas, capítulos, os aceites, os termos,
 * a revisão — sem criar convite, sem token e sem gravar linha nenhuma.
 *
 * O conteúdo é o da versão VIGENTE, lido do PostgREST com a sessão do time (as
 * mesmas consultas do editor). Prévia com manual de mentira não serviria para
 * conferir nada — o que se quer ver aqui é exatamente o que o próximo convite
 * vai entregar.
 *
 * A tela ocupa a página inteira, FORA da moldura do painel. Duas razões: a
 * `Casca` do fluxo já é um `<main>`, e aninhar um `<main>` dentro do outro
 * quebra a navegação de quem usa leitor de tela; e ver o manual emoldurado por
 * abas de administração mentiria sobre o que o cliente enxerga.
 */
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Previa } from '../publico/Previa';
import { carregarConteudo } from './dados';
import { montarVersao } from './conteudo';
import { Aviso, BOTAO_BORDA, Esqueleto } from './pecas';
import { mensagemDe } from './usarAdmin';
import type { Carga, EstadoDoPainel } from './usarAdmin';
import type { ReactNode } from 'react';
import type { Versao, VersaoLinha } from '../tipos';

/* ─── O CONTEÚDO DA VIGENTE ────────────────────────────────────────────────── */

interface CargaDoConteudo {
  /** `null` enquanto o conteúdo não chegou — ou quando não há vigente. */
  versao: Versao | null;
  carregando: boolean;
  erro: string | null;
  tentarDeNovo: () => void;
}

function usarVersaoVigente(vigente: VersaoLinha | null): CargaDoConteudo {
  const [versao, setVersao] = useState<Versao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  const carregar = useCallback(async (linha: VersaoLinha) => {
    setCarregando(true);
    setErro(null);
    try {
      const conteudo = await carregarConteudo(linha.id);
      setVersao(montarVersao(linha, conteudo.secoes, conteudo.regras));
    } catch (problema) {
      setErro(mensagemDe(problema));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (vigente == null) {
      // Sem versão publicada não há o que buscar, e ficar "carregando" para
      // sempre esconderia o recado que explica o que fazer.
      setVersao(null);
      setCarregando(false);
      return;
    }
    void carregar(vigente);
  }, [vigente, tentativa, carregar]);

  return { versao, carregando, erro, tentarDeNovo: () => setTentativa((quantas) => quantas + 1) };
}

/* ─── O QUE A TELA MOSTRA ──────────────────────────────────────────────────── */

/** O que a prévia mostra agora. Um tipo, e não uma escada de `if` dentro do JSX. */
export type EstadoDaPrevia =
  | { tipo: 'carregando' }
  | { tipo: 'sessao' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'sem-versao' }
  | { tipo: 'pronta'; versao: Versao };

export interface SituacaoDaPrevia {
  cargaDoPainel: Carga;
  erroDoPainel: string | null;
  carregandoConteudo: boolean;
  erroDoConteudo: string | null;
  versao: Versao | null;
}

const ERRO_GENERICO = 'Pode ser a rede daqui ou o banco do outro lado.';

/**
 * A decisão da tela, pura e testável.
 *
 * A ordem importa: sessão vencida vem antes de tudo (mandar "tentar de novo"
 * para quem precisa entrar de novo é o jeito rápido de fazer a pessoa achar que
 * o sistema quebrou), erro antes de carregando (a falha de uma tentativa
 * anterior não pode ficar escondida atrás de um esqueleto), e "sem versão" só
 * quando a busca terminou — antes disso ainda não se sabe se há vigente.
 */
export function estadoDaPrevia(situacao: SituacaoDaPrevia): EstadoDaPrevia {
  if (situacao.cargaDoPainel === 'sessao') return { tipo: 'sessao' };
  if (situacao.erroDoConteudo != null) {
    return { tipo: 'erro', mensagem: situacao.erroDoConteudo };
  }
  if (situacao.cargaDoPainel === 'erro') {
    return { tipo: 'erro', mensagem: situacao.erroDoPainel ?? ERRO_GENERICO };
  }
  if (situacao.cargaDoPainel === 'carregando' || situacao.carregandoConteudo) {
    return { tipo: 'carregando' };
  }
  if (situacao.versao == null) return { tipo: 'sem-versao' };
  return { tipo: 'pronta', versao: situacao.versao };
}

/* ─── AS MOLDURAS DE ESPERA ────────────────────────────────────────────────── */

/** O quadro sóbrio de carregando/erro. A prévia de verdade não usa moldura. */
function Espera({ aoVoltar, children }: { aoVoltar: () => void; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-doxa-bg px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <button type="button" onClick={aoVoltar} className={BOTAO_BORDA}>
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Voltar ao painel
        </button>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

interface Saidas {
  aoVoltar: () => void;
  aoTentarDeNovo: () => void;
  aoVerVersoes: () => void;
}

/** O desenho de cada estado que ainda não é o manual na tela. */
function EsperaNaTela({ estado, saidas }: { estado: EstadoDaPrevia; saidas: Saidas }) {
  const { aoVoltar } = saidas;
  switch (estado.tipo) {
    case 'carregando':
      return (
        <Espera aoVoltar={aoVoltar}>
          <Esqueleto linhas={4} />
        </Espera>
      );
    case 'sessao':
      return (
        <Espera aoVoltar={aoVoltar}>
          <Aviso
            titulo="A sessão venceu."
            corpo="Por segurança, a entrada expira. Volte ao painel e entre de novo para ver a prévia."
            acao={{ rotulo: 'Voltar ao painel', aoClicar: aoVoltar }}
          />
        </Espera>
      );
    case 'erro':
      return (
        <Espera aoVoltar={aoVoltar}>
          <Aviso
            titulo="Não deu para carregar o manual."
            corpo={estado.mensagem}
            acao={{ rotulo: 'Tentar de novo', aoClicar: saidas.aoTentarDeNovo }}
          />
        </Espera>
      );
    case 'sem-versao':
      return (
        <Espera aoVoltar={aoVoltar}>
          <Aviso
            titulo="Nenhuma versão publicada."
            corpo="A prévia mostra a versão vigente — a mesma que um convite novo entregaria hoje. Publique uma versão e volte aqui."
            acao={{ rotulo: 'Ver as versões', aoClicar: saidas.aoVerVersoes }}
          />
        </Espera>
      );
    default:
      throw new Error(`estado da prévia sem tela: ${JSON.stringify(estado)}`);
  }
}

/* ─── A TELA ───────────────────────────────────────────────────────────────── */

export function PreviaDoManual({
  painel,
  ir,
}: {
  painel: EstadoDoPainel;
  ir: (destino: string) => void;
}) {
  const conteudo = usarVersaoVigente(painel.vigente);
  const aoVoltar = () => ir('');
  const estado = estadoDaPrevia({
    cargaDoPainel: painel.carga,
    erroDoPainel: painel.erro,
    carregandoConteudo: conteudo.carregando,
    erroDoConteudo: conteudo.erro,
    versao: conteudo.versao,
  });

  /* `key` no id da versão: publicar outra enquanto a prévia está aberta
     recomeça o caminho na versão nova, em vez de misturar o passo já andado
     numa versão com o conteúdo da outra. */
  if (estado.tipo === 'pronta') {
    return <Previa key={estado.versao.id} versao={estado.versao} aoSair={aoVoltar} />;
  }

  return (
    <EsperaNaTela
      estado={estado}
      saidas={{
        aoVoltar,
        aoTentarDeNovo: conteudo.tentarDeNovo,
        aoVerVersoes: () => ir('/manual'),
      }}
    />
  );
}
