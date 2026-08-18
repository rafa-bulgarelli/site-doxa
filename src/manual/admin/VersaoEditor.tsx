/**
 * ─── A VERSÃO, POR DENTRO ────────────────────────────────────────────────────
 *
 * Rascunho: editor de título, declaração, seções e regras, com reordenação e o
 * botão de publicar. Publicada ou arquivada: SÓ leitura, e o botão que existe é
 * o de duplicar como rascunho.
 *
 * A tela não decide o que é editável — ela só espelha. Quem recusa a edição de
 * uma versão publicada é o TRIGGER do banco, que vale até para a service_role;
 * esconder os campos aqui é cortesia com quem está trabalhando, não segurança.
 *
 * PUBLICAR é o único gesto sem volta desta área: ele arquiva a vigente e
 * carimba o hash do conteúdo. Por isso vem em dois tempos, com o número da
 * versão escrito na confirmação.
 */
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Copy, Plus, Send } from 'lucide-react';
import { dataCompleta } from '../../leads/central/pecas';
import {
  carregarConteudo,
  criarRascunho,
  criarSecao,
  publicarVersao,
  salvarCabecalhoDaVersao,
  salvarSecao,
} from './dados';
import { podePublicar, proximaOrdem, regrasDaSecao, slugLivre, trocarOrdem } from './conteudo';
import { EditorDeSecao, SecaoLida } from './EditorDeSecao';
import {
  APAGADO,
  Aviso,
  BOTAO_BORDA,
  BOTAO_PRIMARIO,
  CampoLongo,
  CampoTexto,
  Erro,
  Esqueleto,
  Etiqueta,
  TITULO_DE_BLOCO,
} from './pecas';
import { mensagemDe } from './usarAdmin';
import type { EstadoDoPainel } from './usarAdmin';
import type { RegraLinha, SecaoLinha, VersaoLinha } from '../tipos';

/** O cabeçalho editável de um rascunho: título e declaração final. */
function CabecalhoDoRascunho({
  versao,
  aoErro,
  aoRecarregar,
}: {
  versao: VersaoLinha;
  aoErro: (mensagem: string) => void;
  aoRecarregar: () => Promise<void>;
}) {
  const [titulo, setTitulo] = useState(versao.titulo);
  const [declaracao, setDeclaracao] = useState(versao.declaracao);
  const [salvando, setSalvando] = useState(false);
  const sujo = titulo !== versao.titulo || declaracao !== versao.declaracao;

  const salvar = async () => {
    setSalvando(true);
    try {
      await salvarCabecalhoDaVersao(versao.id, { titulo, declaracao });
      await aoRecarregar();
    } catch (problema) {
      aoErro(mensagemDe(problema));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
      <div className="grid gap-3">
        <CampoTexto rotulo="Título do manual" valor={titulo} aoMudar={setTitulo} />
        <CampoLongo
          rotulo="Declaração final"
          valor={declaracao}
          aoMudar={setDeclaracao}
          linhas={5}
          dica="O texto que o cliente confirma no fim — de 50 a 4000 caracteres"
        />
      </div>
      <p className="mt-2 text-[12px] tabular-nums text-white/35">
        {declaracao.length} caracteres · o banco aceita de 50 a 4000
      </p>
      <button
        type="button"
        onClick={() => void salvar()}
        disabled={!sujo || salvando}
        className={`mt-4 ${BOTAO_PRIMARIO}`}
      >
        {salvando ? 'Salvando…' : sujo ? 'Salvar cabeçalho' : 'Salvo'}
      </button>
    </section>
  );
}

export function VersaoEditor({
  versaoId,
  painel,
  ir,
}: {
  versaoId: string;
  painel: EstadoDoPainel;
  ir: (destino: string) => void;
}) {
  const [secoes, setSecoes] = useState<SecaoLinha[]>([]);
  const [regras, setRegras] = useState<RegraLinha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [confirmandoPublicacao, setConfirmandoPublicacao] = useState(false);

  const versao = painel.versoes.find((linha) => linha.id === versaoId) ?? null;
  const rascunho = versao?.status === 'rascunho';

  const recarregarConteudo = useCallback(async () => {
    setCarregando(true);
    try {
      const conteudo = await carregarConteudo(versaoId);
      setSecoes(conteudo.secoes);
      setRegras(conteudo.regras);
    } catch (problema) {
      setErro(mensagemDe(problema));
    } finally {
      setCarregando(false);
    }
  }, [versaoId]);

  useEffect(() => {
    void recarregarConteudo();
  }, [recarregarConteudo]);

  const executar = async (acao: () => Promise<void>) => {
    setOcupado(true);
    setErro(null);
    try {
      await acao();
      await recarregarConteudo();
    } catch (problema) {
      setErro(mensagemDe(problema));
    } finally {
      setOcupado(false);
    }
  };

  const novaSecao = () =>
    void executar(() =>
      criarSecao({
        versao_id: versaoId,
        slug: slugLivre('Seção nova', secoes.map((secao) => secao.slug)),
        titulo: 'Seção nova',
        descricao: '',
        ordem: proximaOrdem(secoes),
      }),
    );

  const moverSecao = (id: string, direcao: -1 | 1) =>
    void executar(async () => {
      for (const nova of trocarOrdem(secoes, id, direcao)) {
        await salvarSecao(nova.id, { ordem: nova.ordem });
      }
    });

  const publicar = () =>
    void executar(async () => {
      await publicarVersao(versaoId);
      setConfirmandoPublicacao(false);
      await painel.recarregar();
    });

  const duplicar = () =>
    void executar(async () => {
      const nova = await criarRascunho(versaoId);
      await painel.recarregar();
      ir(`/manual/${nova.versao_id}`);
    });

  if (versao == null) {
    return (
      <Aviso
        titulo="Versão não encontrada."
        corpo="O endereço aponta para uma versão que não existe nesta conta."
        acao={{ rotulo: 'Ver as versões', aoClicar: () => ir('/manual') }}
      />
    );
  }

  const ferramentas = { aoRecarregar: recarregarConteudo, aoErro: setErro };
  const emOrdem = [...secoes].sort((a, b) => a.ordem - b.ordem || a.slug.localeCompare(b.slug));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => ir('/manual')} className={BOTAO_BORDA}>
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Todas as versões
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={duplicar} disabled={ocupado} className={BOTAO_BORDA}>
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
            Duplicar como rascunho
          </button>
          {rascunho && !confirmandoPublicacao && (
            <button
              type="button"
              onClick={() => setConfirmandoPublicacao(true)}
              disabled={ocupado || !podePublicar(regras)}
              className={BOTAO_PRIMARIO}
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
              Publicar
            </button>
          )}
          {rascunho && confirmandoPublicacao && (
            <>
              <span className="text-[13px]" style={{ color: APAGADO }}>
                A v{versao.numero} vira a vigente e a atual é arquivada. Sem volta.
              </span>
              <button
                type="button"
                onClick={publicar}
                disabled={ocupado}
                className={BOTAO_PRIMARIO}
              >
                {ocupado ? 'Publicando…' : `Publicar a v${versao.numero}`}
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoPublicacao(false)}
                className={BOTAO_BORDA}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-[2rem] leading-none tracking-[-0.02em] text-white">
          {versao.titulo}
        </h1>
        <Etiqueta>v{versao.numero}</Etiqueta>
        <span className="text-[13px] text-white/40">
          {rascunho
            ? `rascunho criado em ${dataCompleta(versao.criado_em)}`
            : versao.publicado_em != null && `publicada em ${dataCompleta(versao.publicado_em)}`}
        </span>
      </div>

      {rascunho && !podePublicar(regras) && (
        <p className="text-[13px] text-white/45">
          Enquanto não houver ao menos uma regra obrigatória, não há o que aceitar — e o banco
          recusa a publicação.
        </p>
      )}

      <Erro mensagem={erro} />

      {carregando ? (
        <Esqueleto linhas={4} />
      ) : (
        <>
          {rascunho ? (
            <CabecalhoDoRascunho
              versao={versao}
              aoErro={setErro}
              aoRecarregar={painel.recarregar}
            />
          ) : (
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
              <h2 className={TITULO_DE_BLOCO}>Declaração final</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-white/70">
                {versao.declaracao}
              </p>
            </section>
          )}

          {emOrdem.length === 0 && (
            <Aviso
              titulo="Esta versão está vazia."
              corpo={
                rascunho
                  ? 'Comece por uma seção — ela é o capítulo que agrupa as regras.'
                  : 'Nenhuma seção foi gravada nesta versão.'
              }
            />
          )}

          {emOrdem.map((secao, indice) =>
            rascunho ? (
              <EditorDeSecao
                key={secao.id}
                secao={secao}
                regras={regrasDaSecao(regras, secao)}
                primeira={indice === 0}
                ultima={indice === emOrdem.length - 1}
                aoMover={(direcao) => moverSecao(secao.id, direcao)}
                ferramentas={ferramentas}
              />
            ) : (
              <SecaoLida key={secao.id} secao={secao} regras={regrasDaSecao(regras, secao)} />
            ),
          )}

          {rascunho && (
            <button type="button" onClick={novaSecao} disabled={ocupado} className={BOTAO_BORDA}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Seção nova
            </button>
          )}
        </>
      )}
    </div>
  );
}
