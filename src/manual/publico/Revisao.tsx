/**
 * ─── A REVISÃO FINAL ─────────────────────────────────────────────────────────
 *
 * A última tela antes de uma linha que não se apaga. Ela repete três coisas de
 * propósito, mesmo que o cliente tenha acabado de ler tudo:
 *
 *  · os dados sobre os quais o registro será gravado;
 *  · o resumo do que ele confirmou, seção por seção, com as críticas nomeadas —
 *    quem chega aqui depois de dez minutos de leitura já não lembra quantas
 *    eram nem quais pesavam mais;
 *  · o aviso de que descumprir uma regra crítica pode invalidar a garantia.
 *
 * A declaração aparece INTEIRA, no texto da versão, e o checkbox fica embaixo
 * dela. Texto de declaração escondido atrás de "leia aqui" é o padrão que
 * transforma consentimento em clique automático, e é justamente isso que este
 * registro não pode ser.
 */
import type { ReactNode } from 'react';
import {
  Botao,
  BotaoDiscreto,
  CaixaDeAceite,
  Casca,
  Dado,
  Quadro,
  SeloCritica,
  Titulo,
} from './pecas';
import { obrigatoriasDa, secoesEmOrdem } from './maquina';
import type { EstadoDoAceite } from './maquina';
import type { Regra } from '../tipos';

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-[13px] uppercase tracking-[0.16em] text-white/70">{titulo}</h2>
      {children}
    </section>
  );
}

function ResumoDasSecoes({ estado }: { estado: EstadoDoAceite }) {
  const marcadas = new Set(estado.marcadas);
  return (
    <ul className="mt-4 space-y-3">
      {secoesEmOrdem(estado.versao).map((secao) => {
        const obrigatorias = obrigatoriasDa(secao);
        const feitas = obrigatorias.filter((regra) => marcadas.has(regra.id)).length;
        const criticas: Regra[] = obrigatorias.filter((regra) => regra.severidade === 'critica');
        return (
          <li key={secao.id} className="rounded-2xl border border-doxa-line bg-doxa-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[15px] text-white">{secao.titulo}</p>
              <p className="shrink-0 text-[13px] text-white/45">
                {feitas}/{obrigatorias.length}
              </p>
            </div>
            {criticas.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <SeloCritica />
                <span className="text-[13px] text-white/55">
                  {criticas.map((regra) => regra.codigo).join(' · ')}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Revisao({
  estado,
  nomeParaMostrar,
  impedimentos,
  enviando,
  erro,
  aoConfirmarDeclaracao,
  aoConcluir,
  aoVoltar,
}: {
  estado: EstadoDoAceite;
  nomeParaMostrar: string;
  /** Vazio = pode concluir. Vem da máquina, não da tela. */
  impedimentos: string[];
  enviando: boolean;
  erro?: string;
  aoConfirmarDeclaracao: (valor: boolean) => void;
  aoConcluir: () => void;
  aoVoltar: () => void;
}) {
  const travado = impedimentos.length > 0 || enviando;

  return (
    <Casca>
      <p className="text-[11px] uppercase tracking-[0.18em] text-doxa-muted">Revisão final</p>
      <div className="mt-3">
        <Titulo>Confira antes de confirmar</Titulo>
      </div>

      <Bloco titulo="Seus dados">
        <div className="mt-3 rounded-2xl border border-doxa-line bg-doxa-surface p-5">
          <Dado rotulo="Nome" valor={nomeParaMostrar} />
          <Dado rotulo="E-mail" valor={estado.convite.email} />
          <Dado rotulo="Empresa" valor={estado.convite.empresa} />
          <Dado rotulo="Versão do manual" valor={`Versão ${estado.versao.numero}`} />
        </div>
      </Bloco>

      <Bloco titulo="O que você confirmou">
        <ResumoDasSecoes estado={estado} />
      </Bloco>

      <div className="mt-6">
        <Quadro tom="atencao">
          As regras marcadas como críticas são condição do serviço: descumpri-las pode invalidar
          a garantia do seu contrato com a DOXA.
        </Quadro>
      </div>

      <Bloco titulo="Declaração">
        <div className="mt-3 whitespace-pre-line rounded-2xl border border-doxa-line bg-doxa-surface p-5 text-[15px] leading-[1.7] text-white/80">
          {estado.versao.declaracao}
        </div>
        <div className="mt-4">
          <CaixaDeAceite marcada={estado.declaracaoConfirmada} aoAlternar={aoConfirmarDeclaracao}>
            Confirmo que li e concordo com a declaração acima
          </CaixaDeAceite>
        </div>
      </Bloco>

      <div className="mt-8 space-y-3">
        {impedimentos.length > 0 && (
          <ul className="space-y-1 text-center text-[14px] text-white/55" role="status">
            {impedimentos.map((falta) => (
              <li key={falta}>{falta}</li>
            ))}
          </ul>
        )}
        {erro != null && (
          <p className="text-center text-[14px] text-white/80" role="alert">
            {erro}
          </p>
        )}
        <Botao onClick={aoConcluir} desabilitado={travado}>
          {enviando ? 'Registrando…' : 'Confirmar e concluir'}
        </Botao>
        <BotaoDiscreto onClick={aoVoltar}>Voltar às seções</BotaoDiscreto>
      </div>
    </Casca>
  );
}
