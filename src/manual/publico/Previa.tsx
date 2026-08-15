/**
 * ─── A PRÉVIA: O FLUXO INTEIRO, SEM CONVITE ──────────────────────────────────
 *
 * O pedido do dono, na letra: "ver o fluxo inteiro sem precisar criar um link
 * de convite". A equipe abre a prévia e ANDA pelo manual como o cliente
 * andaria — abertura, identificação, capítulos com as cenas, os aceites, os
 * termos e a revisão final.
 *
 * Três coisas a separam do fluxo real, e nenhuma é cosmética:
 *  · o convite é FICTÍCIO e mora aqui em cima, à vista;
 *  · não existe transporte — nem progresso que sobe, nem aceite que grava.
 *    `Leitura` só chama servidor quando alguém lhe passa uma função para isso,
 *    e esta tela não passa nenhuma. Auditoria não se suja com ensaio;
 *  · a revisão termina num SELO, não num botão de concluir.
 *
 * E a faixa de "PRÉVIA" fica fixa na tela o tempo todo. Confundir prévia com
 * fluxo real é o único erro caro que esta tela pode causar: alguém acharia que
 * mandou o manual para um cliente que nunca recebeu link nenhum.
 */
import { useState } from 'react';
import { Botao } from './pecas';
import { Leitura } from './Leitura';
import type { Sessao } from './maquina';
import type { ConviteAberto, Versao } from '../tipos';

/* ─── O CLIENTE QUE NÃO EXISTE ─────────────────────────────────────────────── */

/**
 * O convite de mentira da prévia.
 *
 * Com `nome_cliente` preenchido, a identificação aparece inteira e travada,
 * como no caso mais comum (o CX já sabe quem assina) — e o fluxo não cobra da
 * equipe um nome que ninguém vai gravar. Os textos dizem "Exemplo" de
 * propósito: se alguém tirar um print, o print se explica sozinho.
 */
export const CONVITE_DE_EXEMPLO: ConviteAberto = {
  email: 'cliente@exemplo.com',
  empresa: 'Empresa Exemplo',
  nome_cliente: 'Cliente Exemplo',
  expira_em: null,
};

/** A sessão do primeiro passo. Recomeçar é voltar exatamente a isto. */
export function sessaoDeExemplo(versao: Versao): Sessao {
  return {
    convite: CONVITE_DE_EXEMPLO,
    versao,
    passo: { tipo: 'abertura' },
    marcadas: [],
    nome: CONVITE_DE_EXEMPLO.nome_cliente ?? '',
    declaracaoConfirmada: false,
  };
}

/* ─── O QUE FECHA A PRÉVIA ─────────────────────────────────────────────────── */

/** O selo no lugar do botão de concluir. Ele é o fim do caminho, e diz por quê. */
function SeloDoFim({ aoRecomecar }: { aoRecomecar: () => void }) {
  return (
    <div className="rounded-3xl border border-white/25 bg-doxa-surface p-6 text-center">
      <p className="text-[17px] leading-[1.6] text-white">
        Fim da prévia — nenhum aceite foi gravado.
      </p>
      <p className="mt-3 text-[17px] leading-[1.6] text-white/60">
        No convite de verdade é aqui que o cliente confirma e o registro nasce. Nesta tela o botão
        não existe: não há convite, não há aceite e nada foi para a auditoria.
      </p>
      <div className="mt-6">
        <Botao onClick={aoRecomecar}>Recomeçar a prévia</Botao>
      </div>
    </div>
  );
}

/* ─── A FAIXA QUE NÃO SAI DA TELA ──────────────────────────────────────────── */

/**
 * A tarja fixa no rodapé.
 *
 * Fica embaixo porque é onde o polegar já está e porque a `Casca` reserva
 * `pb-28` no fim da coluna — a faixa não cobre o último botão de nenhum passo.
 */
function FaixaDePrevia({
  aoRecomecar,
  aoSair,
}: {
  aoRecomecar: () => void;
  aoSair?: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.14] bg-doxa-bg/95 px-5 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] leading-[1.4] text-white/55">
          <span className="mr-2 rounded-full border border-white/25 px-2.5 py-1 uppercase tracking-[0.16em] text-white/80">
            PRÉVIA
          </span>
          nada aqui é gravado
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={aoRecomecar}
            className="min-h-[44px] rounded-full border border-white/[0.14] px-4 text-[14px] text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Recomeçar
          </button>
          {aoSair != null && (
            <button
              type="button"
              onClick={aoSair}
              className="min-h-[44px] rounded-full border border-white/[0.14] px-4 text-[14px] text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Voltar ao painel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── A TELA ───────────────────────────────────────────────────────────────── */

/** A prévia não conclui: o selo ocupa o lugar do botão, e isto nunca é chamado. */
function naoConclui(): void {
  // De propósito vazio: concluir é o gesto que a prévia existe para NÃO ter.
}

/**
 * A prévia num passo qualquer — o estado fica de fora.
 *
 * É o que permite provar a tela em cada passo sem simular clique: o teste monta
 * a sessão que quiser e desenha. Mesma separação de `maquina.ts` e `Fluxo.tsx`.
 */
export function TelaDaPrevia({
  sessao,
  trocarSessao,
  aoRecomecar,
  aoSair,
}: {
  sessao: Sessao;
  trocarSessao: (sessao: Sessao) => void;
  aoRecomecar: () => void;
  aoSair?: () => void;
}) {
  return (
    <div>
      <Leitura
        sessao={sessao}
        trocarSessao={trocarSessao}
        /* Sem `aoTrocarPasso`: é a ausência desta função que garante que nenhum
           progresso suba. E `aoConcluir` nunca é chamado, porque com o selo no
           lugar do fecho a revisão não desenha botão de concluir nenhum. */
        aoConcluir={naoConclui}
        fechoDaRevisao={<SeloDoFim aoRecomecar={aoRecomecar} />}
      />
      <FaixaDePrevia aoRecomecar={aoRecomecar} aoSair={aoSair} />
    </div>
  );
}

export function Previa({ versao, aoSair }: { versao: Versao; aoSair?: () => void }) {
  const [sessao, setSessao] = useState<Sessao>(() => sessaoDeExemplo(versao));
  return (
    <TelaDaPrevia
      sessao={sessao}
      trocarSessao={setSessao}
      aoRecomecar={() => setSessao(sessaoDeExemplo(versao))}
      aoSair={aoSair}
    />
  );
}
