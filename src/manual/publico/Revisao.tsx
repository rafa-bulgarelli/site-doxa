/**
 * ─── A REVISÃO FINAL ─────────────────────────────────────────────────────────
 *
 * A última tela antes de uma linha que não se apaga — e, no redesenho, a mais
 * enxuta de todas. Ela mostra quatro coisas, nesta ordem:
 *
 *  · os dados sobre os quais o registro será gravado;
 *  · o resumo compacto dos itens confirmados, para quem já não lembra quantos
 *    eram depois de ler o manual inteiro;
 *  · os termos de uso, atrás de "ler os termos completos";
 *  · a declaração, inteira, no texto da versão, com o checkbox embaixo.
 *
 * A declaração continua ABERTA de propósito. Esconder o texto do consentimento
 * atrás de um link é o padrão que transforma aceite em clique automático, e é
 * justamente isso que este registro não pode ser. Os termos podem ficar
 * fechados porque a declaração diz, em texto visível, que eles fazem parte —
 * quem confirma está avisado do que está confirmando.
 */
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Botao,
  BotaoDiscreto,
  CaixaDeAceite,
  Casca,
  Dado,
  EASE,
  Linha,
  Rotulo,
  Titulo,
} from './pecas';
import { DocumentoDeTermos } from './Termos';
import { obrigatoriasDaVersao } from './maquina';
import type { EstadoDoAceite } from './maquina';
import type { ReactNode } from 'react';
import type { Secao } from '../tipos';

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <Rotulo>{titulo}</Rotulo>
      {children}
    </section>
  );
}

/* ─── O QUE FOI CONFIRMADO ─────────────────────────────────────────────────── */

/**
 * O resumo compacto: uma linha por item, com o visto de quem já marcou.
 *
 * Não repete instrução nem porquê — quem quiser reler volta ao capítulo. Aqui é
 * conferência, não segunda leitura.
 */
function ResumoDosItens({ estado }: { estado: EstadoDoAceite }) {
  const marcadas = new Set(estado.marcadas);
  const itens = obrigatoriasDaVersao(estado.versao);
  return (
    <ul className="mt-4 divide-y divide-doxa-line overflow-hidden rounded-3xl border border-doxa-line bg-doxa-surface">
      {itens.map((regra) => {
        const feita = marcadas.has(regra.id);
        return (
          <li key={regra.id} className="flex items-start gap-3 px-5 py-4">
            <span
              aria-hidden
              className={`mt-0.5 text-[17px] leading-[1.5] ${
                feita ? 'text-emerald-400' : 'text-white/25'
              }`}
            >
              {feita ? '✓' : '○'}
            </span>
            <span className="text-[17px] leading-[1.5] text-white/80">{regra.titulo}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* ─── OS TERMOS, A UM TOQUE ────────────────────────────────────────────────── */

function BlocoDeTermos({ termos }: { termos: Secao }) {
  const [aberto, setAberto] = useState(false);
  const semMovimento = useReducedMotion() === true;

  return (
    // O rótulo é fixo e o título vem do banco: a seção já se chama "Termos de
    // uso", e repetir a mesma frase duas vezes seguidas lê como erro.
    <Bloco titulo="O documento completo">
      <div className="mt-4 rounded-3xl border border-doxa-line bg-doxa-surface p-6">
        <h3 className="font-serif text-[24px] leading-[1.2] text-white">{termos.titulo}</h3>
        <p className="mt-3 text-[17px] leading-[1.7] text-white/70">{termos.descricao}</p>
        <div className="mt-5">
          <BotaoDiscreto onClick={() => setAberto((estava) => !estava)}>
            {aberto ? 'Fechar os termos' : 'Ler os termos completos'}
          </BotaoDiscreto>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            key="documento"
            initial={semMovimento ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: semMovimento ? 0 : 0.4, ease: EASE }}
            className="mt-4"
          >
            <DocumentoDeTermos secao={termos} />
          </motion.div>
        )}
      </AnimatePresence>
    </Bloco>
  );
}

/* ─── A TELA ───────────────────────────────────────────────────────────────── */

export function Revisao({
  estado,
  nomeParaMostrar,
  termos,
  impedimentos,
  enviando,
  erro,
  fecho,
  aoConfirmarDeclaracao,
  aoConcluir,
  aoVoltar,
}: {
  estado: EstadoDoAceite;
  nomeParaMostrar: string;
  /** Ausente nas versões do manual que não trazem a seção de termos. */
  termos?: Secao;
  /** Vazio = pode concluir. Vem da máquina, não da tela. */
  impedimentos: string[];
  enviando: boolean;
  erro?: string;
  /**
   * O que fecha a tela no lugar do botão de concluir.
   *
   * Ausente — o caso do cliente — é o botão, com os impedimentos e o erro do
   * envio. Só a prévia da equipe passa alguma coisa aqui, e passa justamente
   * para que não exista botão nenhum capaz de gravar um aceite de mentira.
   */
  fecho?: ReactNode;
  aoConfirmarDeclaracao: (valor: boolean) => void;
  aoConcluir: () => void;
  aoVoltar: () => void;
}) {
  const travado = impedimentos.length > 0 || enviando;

  return (
    <Casca>
      {/* A versão vive no rótulo, não numa linha de dado: ela identifica o que
          está sendo aceito, mas não é informação que o cliente confere. */}
      <Rotulo>Revisão final · Versão {estado.versao.numero}</Rotulo>
      <div className="mt-4">
        <Titulo>Confira antes de confirmar</Titulo>
      </div>
      <div className="mt-5">
        <Linha>Falta pouco: confira os dados, leia a declaração e confirme.</Linha>
      </div>

      <Bloco titulo="Seus dados">
        <div className="mt-4 rounded-3xl border border-doxa-line bg-doxa-surface p-6">
          <Dado rotulo="Nome" valor={nomeParaMostrar} />
          <Dado rotulo="E-mail" valor={estado.convite.email} />
          <Dado rotulo="Empresa" valor={estado.convite.empresa} />
        </div>
      </Bloco>

      <Bloco titulo="O que você confirmou">
        <ResumoDosItens estado={estado} />
      </Bloco>

      {termos != null && <BlocoDeTermos termos={termos} />}

      <Bloco titulo="Declaração">
        <div className="mt-4 whitespace-pre-line rounded-3xl border border-doxa-line bg-doxa-surface p-6 text-[17px] leading-[1.75] text-white/80">
          {estado.versao.declaracao}
        </div>
        <div className="mt-5">
          <CaixaDeAceite marcada={estado.declaracaoConfirmada} aoAlternar={aoConfirmarDeclaracao}>
            Confirmo que li e concordo com a declaração acima
          </CaixaDeAceite>
        </div>
      </Bloco>

      <div className="mt-10 space-y-3">
        {fecho ?? (
          <>
            {impedimentos.length > 0 && (
              <ul className="space-y-1 text-center text-[16px] text-white/55" role="status">
                {impedimentos.map((falta) => (
                  <li key={falta}>{falta}</li>
                ))}
              </ul>
            )}
            {erro != null && (
              <p className="text-center text-[16px] text-white/80" role="alert">
                {erro}
              </p>
            )}
            <Botao onClick={aoConcluir} desabilitado={travado}>
              {enviando ? 'Registrando…' : 'Confirmar e concluir'}
            </Botao>
          </>
        )}
        <BotaoDiscreto onClick={aoVoltar}>Voltar aos capítulos</BotaoDiscreto>
      </div>
    </Casca>
  );
}
