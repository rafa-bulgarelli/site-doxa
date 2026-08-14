/**
 * ─── UMA SEÇÃO DO MANUAL ─────────────────────────────────────────────────────
 *
 * Cada regra é um cartão com quatro camadas na mesma ordem, sempre: o que é
 * (título e instrução), POR QUE existe, um exemplo concreto, e o aceite. A
 * ordem não é decorativa — regra sem porquê assusta em vez de ensinar, e um
 * cliente que só leu a proibição chega ao fim sem entender o combinado.
 *
 * O botão de avançar só acende com todas as obrigatórias da seção marcadas, e
 * a tela DIZ quantas faltam antes de o cliente tentar. Botão apagado sem
 * explicação é o jeito mais rápido de perder alguém no meio do fluxo.
 *
 * Voltar está sempre aberto: reler não é risco.
 */
import { motion, useReducedMotion } from 'framer-motion';
import {
  Botao,
  BotaoDiscreto,
  CaixaDeAceite,
  Casca,
  Quadro,
  SeloCritica,
  Titulo,
  Trilho,
} from './pecas';
import { faltamNa, regrasEmOrdem } from './maquina';
import type { Andamento } from './maquina';
import type { Regra, Secao as SecaoDoManual } from '../tipos';

function Bloco({
  rotulo,
  texto,
  comLinha = false,
}: {
  rotulo: string;
  texto: string;
  comLinha?: boolean;
}) {
  return (
    <div className={`mt-4 ${comLinha ? 'border-t border-doxa-line pt-4' : ''}`}>
      <p className="text-[11px] uppercase tracking-[0.16em] text-doxa-muted">{rotulo}</p>
      <p className="mt-1.5 text-[14px] leading-[1.6] text-white/55">{texto}</p>
    </div>
  );
}

function CartaoDaRegra({
  regra,
  marcada,
  aoAlternar,
}: {
  regra: Regra;
  marcada: boolean;
  aoAlternar: () => void;
}) {
  const critica = regra.severidade === 'critica';
  return (
    <article
      className={`rounded-2xl border bg-doxa-surface p-5 ${
        critica ? 'border-white/25' : 'border-doxa-line'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-doxa-muted">{regra.codigo}</p>
        {critica && <SeloCritica />}
      </div>
      <h3 className="mt-2 text-[18px] leading-[1.3] text-white">{regra.titulo}</h3>
      <p className="mt-3 text-[15px] leading-[1.65] text-white/75">{regra.instrucao}</p>

      <Bloco rotulo="Por que existe" texto={regra.porque} comLinha />
      <Bloco rotulo="Na prática" texto={regra.exemplo} />

      {critica && (
        <div className="mt-4">
          <Quadro tom="atencao">
            Esta é uma regra crítica: descumpri-la pode invalidar a garantia do seu contrato.
          </Quadro>
        </div>
      )}

      <div className="mt-5">
        {regra.obrigatoria ? (
          <CaixaDeAceite marcada={marcada} aoAlternar={aoAlternar}>
            Li, entendi e concordo
          </CaixaDeAceite>
        ) : (
          <p className="text-[13px] uppercase tracking-[0.12em] text-doxa-muted">
            Informativo — não precisa de confirmação
          </p>
        )}
      </div>
    </article>
  );
}

function Topo({
  posicao,
  total,
  andamento,
}: {
  posicao: number;
  total: number;
  andamento: Andamento;
}) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-doxa-muted">
          Seção {posicao} de {total}
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-doxa-muted">
          {andamento.feitas}/{andamento.total} regras
        </p>
      </div>
      <div className="mt-3">
        <Trilho fracao={andamento.fracao} />
      </div>
    </>
  );
}

function oQueFalta(quantas: number): string {
  if (quantas === 0) return 'Tudo desta seção confirmado.';
  if (quantas === 1) return 'Falta confirmar 1 regra desta seção.';
  return `Faltam confirmar ${quantas} regras desta seção.`;
}

export function Secao({
  secao,
  posicao,
  total,
  andamento,
  marcadas,
  aoAlternar,
  aoAvancar,
  aoVoltar,
}: {
  secao: SecaoDoManual;
  /** 1-based, para ler na tela: "Seção 2 de 6". */
  posicao: number;
  total: number;
  andamento: Andamento;
  marcadas: readonly string[];
  aoAlternar: (id: string) => void;
  aoAvancar: () => void;
  aoVoltar: () => void;
}) {
  const semMovimento = useReducedMotion();
  const faltam = faltamNa(secao, marcadas);

  return (
    <Casca>
      <Topo posicao={posicao} total={total} andamento={andamento} />

      <div className="mt-7">
        <Titulo>{secao.titulo}</Titulo>
      </div>
      <p className="mt-4 text-[15px] leading-[1.65] text-white/60">{secao.descricao}</p>

      <motion.div
        /* A seção troca inteira: um fade curto marca que a página mudou sem
           empurrar o texto, que é o que enjoa numa leitura longa no celular. */
        key={secao.id}
        initial={semMovimento === true ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="mt-6 space-y-4"
      >
        {regrasEmOrdem(secao).map((regra) => (
          <CartaoDaRegra
            key={regra.id}
            regra={regra}
            marcada={marcadas.includes(regra.id)}
            aoAlternar={() => aoAlternar(regra.id)}
          />
        ))}
      </motion.div>

      <div className="mt-8 space-y-3">
        <p className="text-center text-[14px] text-white/55" role="status">
          {oQueFalta(faltam.length)}
        </p>
        <Botao onClick={aoAvancar} desabilitado={faltam.length > 0}>
          {posicao === total ? 'Ir para a revisão final' : 'Próxima seção'}
        </Botao>
        <BotaoDiscreto onClick={aoVoltar}>Voltar</BotaoDiscreto>
      </div>
    </Casca>
  );
}
