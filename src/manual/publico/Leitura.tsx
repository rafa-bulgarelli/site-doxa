/**
 * ─── A LEITURA, SEM TRANSPORTE ───────────────────────────────────────────────
 *
 * O caminho desenhado: abertura → identificação → capítulos → revisão, com o
 * gate de avanço, o foco e a rolagem na troca de passo. Nada aqui conhece
 * token, `fetch` ou rota — quem tem transporte avisa por `aoTrocarPasso` e
 * `aoConcluir`, e quem não tem simplesmente não passa.
 *
 * Isto saiu de dentro do `Fluxo` para que a PRÉVIA do time (`Previa.tsx`) ande
 * pelas MESMAS telas com estado local. Duas cópias do caminho visual
 * divergiriam no primeiro capítulo novo, e a equipe estaria conferindo uma tela
 * que o cliente não vê — que é justamente o que a prévia existe para evitar.
 */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Abertura } from './Abertura';
import { Capitulo } from './Capitulo';
import { Indisponivel } from './Estados';
import { Identificacao } from './Identificacao';
import { Revisao } from './Revisao';
import {
  aceiteDaSessao,
  alternarRegra,
  capituloDoPasso,
  capitulosEmOrdem,
  chaveDoPasso,
  impedimentosDoAceite,
  nomeParaAceite,
  passoAnterior,
  podeAvancarDa,
  proximoPasso,
  termosDaVersao,
} from './maquina';
import type { Passo, Sessao } from './maquina';
import type { ReactNode } from 'react';

/* ─── O FOCO AO TROCAR DE PASSO ────────────────────────────────────────────── */

/**
 * Leva o foco e a rolagem ao topo quando o passo MUDA — e só quando muda.
 *
 * Duas armadilhas do repo estão pagas aqui. A primeira: `focus()` na montagem
 * faz a página rolar sozinha, e as rotas do manual são `lazy`, então isso
 * aconteceria segundos depois do load; daí `preventScroll` e a intenção
 * guardada com o valor ANTERIOR num ref — bandeira "já montou" não sobrevive ao
 * StrictMode, que roda o efeito duas vezes. A segunda: o nó vem por
 * `useState` + ref de callback, nunca uma `ref` recebida por props, que chega
 * `null` no efeito do filho e só quebra no site publicado.
 */
function usarFocoNoPasso(chave: string): (no: HTMLDivElement | null) => void {
  const [alvo, setAlvo] = useState<HTMLDivElement | null>(null);
  const anterior = useRef<string>();
  const semMovimento = useReducedMotion();

  useEffect(() => {
    const passada = anterior.current;
    anterior.current = chave;
    if (passada == null || passada === chave) return;
    window.scrollTo({ top: 0, behavior: semMovimento === true ? 'auto' : 'smooth' });
    if (alvo != null) alvo.focus({ preventScroll: true });
  }, [chave, alvo, semMovimento]);

  return setAlvo;
}

/* ─── AS TELAS DO PASSO ────────────────────────────────────────────────────── */

interface PropsDoPasso {
  sessao: Sessao;
  enviando: boolean;
  erroDoEnvio?: string;
  /** Entregue à revisão no lugar do botão de concluir. Ver `PropsDaLeitura`. */
  fechoDaRevisao?: ReactNode;
  aoAlternar: (id: string) => void;
  aoAvancar: () => void;
  aoVoltar: () => void;
  aoDigitarNome: (valor: string) => void;
  aoConfirmarDeclaracao: (valor: boolean) => void;
  aoConcluir: () => void;
}

function PassoNaTela(props: PropsDoPasso) {
  const { sessao } = props;
  const { convite, versao, passo, marcadas } = sessao;

  switch (passo.tipo) {
    case 'abertura':
      return <Abertura versao={versao} convite={convite} aoComecar={props.aoAvancar} />;
    case 'identificacao':
      return (
        <Identificacao
          convite={convite}
          nome={sessao.nome}
          aoDigitarNome={props.aoDigitarNome}
          aoAvancar={props.aoAvancar}
          aoVoltar={props.aoVoltar}
        />
      );
    case 'capitulo': {
      const capitulo = capituloDoPasso(passo, versao);
      // Índice fora da lista não deveria existir; se existir, é melhor dizer do
      // que renderizar um capítulo vazio como se fosse o manual.
      if (capitulo == null) {
        return <Indisponivel mensagem="Este capítulo não existe nesta versão." />;
      }
      return (
        <Capitulo
          capitulo={capitulo}
          posicao={passo.indice + 1}
          total={capitulosEmOrdem(versao).length}
          marcadas={marcadas}
          aoAlternar={props.aoAlternar}
          aoAvancar={props.aoAvancar}
          aoVoltar={props.aoVoltar}
        />
      );
    }
    case 'revisao':
      return (
        <Revisao
          estado={aceiteDaSessao(sessao)}
          nomeParaMostrar={nomeParaAceite(convite, sessao.nome)}
          termos={termosDaVersao(versao)}
          impedimentos={impedimentosDoAceite(aceiteDaSessao(sessao))}
          enviando={props.enviando}
          erro={props.erroDoEnvio}
          fecho={props.fechoDaRevisao}
          aoConfirmarDeclaracao={props.aoConfirmarDeclaracao}
          aoConcluir={props.aoConcluir}
          aoVoltar={props.aoVoltar}
        />
      );
    default:
      throw new Error(`passo desconhecido: ${JSON.stringify(passo)}`);
  }
}

/* ─── A LEITURA ────────────────────────────────────────────────────────────── */

export interface PropsDaLeitura {
  sessao: Sessao;
  trocarSessao: (sessao: Sessao) => void;
  /**
   * Avisa que o passo mudou, com a sessão JÁ nova — é onde o fluxo do cliente
   * sobe o progresso. A prévia não passa nada, e é isso que a mantém muda.
   */
  aoTrocarPasso?: (passo: Passo, sessao: Sessao) => void;
  enviando?: boolean;
  erroDoEnvio?: string;
  aoConcluir: () => void;
  /**
   * Substitui o bloco do botão de concluir na revisão.
   *
   * Existe por causa da prévia, que anda até o fim e NÃO pode gravar aceite: no
   * lugar do botão ela põe o selo de "fim da prévia". Ausente, a revisão é a do
   * cliente, com o botão e os impedimentos — o caminho real não muda.
   */
  fechoDaRevisao?: ReactNode;
}

export function Leitura({
  sessao,
  trocarSessao,
  aoTrocarPasso,
  enviando = false,
  erroDoEnvio,
  aoConcluir,
  fechoDaRevisao,
}: PropsDaLeitura) {
  const prenderFoco = usarFocoNoPasso(chaveDoPasso(sessao.passo));

  const irPara = (destino: Passo): void => {
    const nova: Sessao = { ...sessao, passo: destino };
    trocarSessao(nova);
    if (aoTrocarPasso != null) aoTrocarPasso(destino, nova);
  };

  const avancar = (): void => {
    const capitulo = capituloDoPasso(sessao.passo, sessao.versao);
    // O gate de novo, longe do botão: aparência muda em refactor, isto não.
    if (capitulo != null && !podeAvancarDa(capitulo, sessao.marcadas)) return;
    irPara(proximoPasso(sessao.passo, sessao.versao));
  };

  return (
    /* `tabIndex={-1}` para o foco poder pousar aqui na troca de passo; sem
       `outline` porque o anel é do elemento que o cliente ATIVOU, não deste. */
    <div ref={prenderFoco} tabIndex={-1} className="outline-none">
      <PassoNaTela
        sessao={sessao}
        enviando={enviando}
        erroDoEnvio={erroDoEnvio}
        fechoDaRevisao={fechoDaRevisao}
        aoAlternar={(id) => trocarSessao({ ...sessao, marcadas: alternarRegra(sessao.marcadas, id) })}
        aoAvancar={avancar}
        aoVoltar={() => irPara(passoAnterior(sessao.passo, sessao.versao))}
        aoDigitarNome={(valor) => trocarSessao({ ...sessao, nome: valor })}
        aoConfirmarDeclaracao={(valor) => trocarSessao({ ...sessao, declaracaoConfirmada: valor })}
        aoConcluir={aoConcluir}
      />
    </div>
  );
}
