/**
 * ─── O CAMINHO DO CLIENTE ────────────────────────────────────────────────────
 *
 * Do link do WhatsApp ao PDF na mão. Este arquivo é só a ORQUESTRAÇÃO: quem
 * decide alguma coisa é `maquina.ts` (pura, testada), quem fala com o servidor
 * é `api.ts`, e quem desenha são as telas ao lado. Aqui mora o estado.
 *
 * Duas rotas chegam:
 *  · `['convite', '<token>']` — o fluxo inteiro; o token sai daqui e vai no
 *    CORPO de toda chamada, nunca na URL;
 *  · `['concluido']` — a confirmação depois do aceite.
 *
 * Qualquer outra coisa é link quebrado, e tem tela própria.
 */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { PropsDeRota } from '../tipos';
import { ROTA_BASE } from '../config';
import { abrirConvite, concluirAceite, pedirPdf, salvarProgresso } from './api';
import {
  aceiteDaSessao,
  alternarRegra,
  andamentoDe,
  chaveDoPasso,
  impedimentosDoAceite,
  montarPedidoConcluir,
  montarPedidoProgresso,
  nomeParaAceite,
  passoAnterior,
  podeAvancarDa,
  podeConcluir,
  proximoPasso,
  secaoDoPasso,
  secoesEmOrdem,
  situacaoDe,
} from './maquina';
import type { Passo, Sessao, Situacao } from './maquina';
import { guardarComprovante, pegarComprovante } from './memoria';
import { Abertura } from './Abertura';
import { Conclusao } from './Conclusao';
import {
  Carregando,
  FalhaComVolta,
  Indisponivel,
  JaConcluido,
  LinkExpirado,
  LinkInvalido,
  LinkRevogado,
} from './Estados';
import { Identificacao } from './Identificacao';
import { Revisao } from './Revisao';
import { Secao } from './Secao';

/* ─── O PDF, PEDIDO SOB DEMANDA ────────────────────────────────────────────── */

interface Download {
  url?: string;
  pedindo: boolean;
  erro?: string;
  pedir: () => void;
}

/** A URL assinada dura minutos: cada clique pede uma nova em vez de guardar. */
function usarPdf(token?: string): Download {
  const [url, setUrl] = useState<string>();
  const [pedindo, setPedindo] = useState(false);
  const [erro, setErro] = useState<string>();

  const pedir = async (): Promise<void> => {
    if (token == null) return;
    setPedindo(true);
    setErro(undefined);
    const resultado = await pedirPdf(token);
    setPedindo(false);
    if (resultado.ok) setUrl(resultado.dados.pdf_url);
    else setErro(resultado.falha.mensagem);
  };

  return { url, pedindo, erro, pedir: () => void pedir() };
}

/* ─── ABRIR O CONVITE ──────────────────────────────────────────────────────── */

interface Convite {
  /** `undefined` enquanto a resposta não chegou. */
  situacao?: Situacao;
  trocarSessao: (sessao: Sessao) => void;
  tentarDeNovo: () => void;
}

function usarConvite(token: string): Convite {
  const [situacao, setSituacao] = useState<Situacao>();
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    // `cancelado` evita que uma resposta atrasada da tentativa anterior
    // sobrescreva a tela da tentativa nova.
    let cancelado = false;
    setSituacao(undefined);
    void abrirConvite(token).then((resultado) => {
      if (!cancelado) setSituacao(situacaoDe(resultado));
    });
    return () => {
      cancelado = true;
    };
  }, [token, tentativa]);

  return {
    situacao,
    trocarSessao: (sessao) => setSituacao({ tipo: 'fluxo', sessao }),
    tentarDeNovo: () => setTentativa((quantas) => quantas + 1),
  };
}

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

/* ─── O ACEITE ─────────────────────────────────────────────────────────────── */

interface Envio {
  token: string;
  sessao: Sessao;
  navegar: (destino: string) => void;
  marcarEnvio: (enviando: boolean) => void;
  mostrarErro: (mensagem?: string) => void;
}

/** Grava o aceite e sai da rota. É a única chamada daqui que não tem desfazer. */
async function registrarAceite(envio: Envio): Promise<void> {
  const { token, sessao, navegar, marcarEnvio, mostrarErro } = envio;
  const estado = aceiteDaSessao(sessao);
  if (!podeConcluir(estado)) return;

  marcarEnvio(true);
  mostrarErro(undefined);
  const resultado = await concluirAceite(montarPedidoConcluir(token, estado));
  marcarEnvio(false);
  if (!resultado.ok) {
    mostrarErro(resultado.falha.mensagem);
    return;
  }

  guardarComprovante({
    ...resultado.dados,
    token,
    versao_numero: sessao.versao.numero,
    nome: nomeParaAceite(sessao.convite, sessao.nome),
    empresa: sessao.convite.empresa,
  });
  navegar(`${ROTA_BASE}/concluido`);
}

/* ─── AS TELAS DO PASSO ────────────────────────────────────────────────────── */

interface PropsDoPasso {
  sessao: Sessao;
  enviando: boolean;
  erroDoEnvio?: string;
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
    case 'secao': {
      const secao = secaoDoPasso(passo, versao);
      // Índice fora da lista não deveria existir; se existir, é melhor dizer do
      // que renderizar uma seção vazia como se fosse o manual.
      if (secao == null) return <Indisponivel mensagem="Esta seção não existe nesta versão." />;
      return (
        <Secao
          secao={secao}
          posicao={passo.indice + 1}
          total={secoesEmOrdem(versao).length}
          andamento={andamentoDe(versao, marcadas)}
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
          impedimentos={impedimentosDoAceite(aceiteDaSessao(sessao))}
          enviando={props.enviando}
          erro={props.erroDoEnvio}
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

function Leitura({
  token,
  sessao,
  trocarSessao,
  navegar,
}: {
  token: string;
  sessao: Sessao;
  trocarSessao: (sessao: Sessao) => void;
  navegar: (destino: string) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erroDoEnvio, setErroDoEnvio] = useState<string>();
  const prenderFoco = usarFocoNoPasso(chaveDoPasso(sessao.passo));

  const irPara = (destino: Passo): void => {
    const nova: Sessao = { ...sessao, passo: destino };
    trocarSessao(nova);
    // O servidor é a memória ENTRE visitas; dentro da visita o estado é local.
    // Por isso o progresso sobe na troca de passo, e não a cada checkbox — e
    // por isso a falha dele é ignorada: travar a leitura porque um POST de
    // conveniência não subiu seria punir o cliente por um problema nosso.
    void salvarProgresso(montarPedidoProgresso(token, destino, aceiteDaSessao(nova)));
  };

  const avancar = (): void => {
    const secao = secaoDoPasso(sessao.passo, sessao.versao);
    // O gate de novo, longe do botão: aparência muda em refactor, isto não.
    if (secao != null && !podeAvancarDa(secao, sessao.marcadas)) return;
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
        aoAlternar={(id) => trocarSessao({ ...sessao, marcadas: alternarRegra(sessao.marcadas, id) })}
        aoAvancar={avancar}
        aoVoltar={() => irPara(passoAnterior(sessao.passo, sessao.versao))}
        aoDigitarNome={(valor) => trocarSessao({ ...sessao, nome: valor })}
        aoConfirmarDeclaracao={(valor) => trocarSessao({ ...sessao, declaracaoConfirmada: valor })}
        aoConcluir={() =>
          void registrarAceite({
            token,
            sessao,
            navegar,
            marcarEnvio: setEnviando,
            mostrarErro: setErroDoEnvio,
          })
        }
      />
    </div>
  );
}

/* ─── O QUE O LINK ABRIU ───────────────────────────────────────────────────── */

function Bloqueio({ estado }: { estado: 'invalido' | 'expirado' | 'revogado' }) {
  switch (estado) {
    case 'expirado':
      return <LinkExpirado />;
    case 'revogado':
      return <LinkRevogado />;
    case 'invalido':
      return <LinkInvalido />;
    default:
      throw new Error(`estado de convite desconhecido: ${String(estado)}`);
  }
}

function FluxoDoConvite({ token, navegar }: { token: string; navegar: (destino: string) => void }) {
  const { situacao, trocarSessao, tentarDeNovo } = usarConvite(token);
  const pdf = usarPdf(token);

  if (situacao == null) return <Carregando />;

  switch (situacao.tipo) {
    case 'falha':
      return situacao.falha.recuperavel ? (
        <FalhaComVolta mensagem={situacao.falha.mensagem} aoTentarDeNovo={tentarDeNovo} />
      ) : (
        <Indisponivel mensagem={situacao.falha.mensagem} />
      );
    case 'bloqueado':
      return <Bloqueio estado={situacao.estado} />;
    case 'concluido':
      return situacao.aceite == null ? (
        <Conclusao pedindoPdf={pdf.pedindo} aoPedirPdf={pdf.pedir} />
      ) : (
        <JaConcluido
          aceite={situacao.aceite}
          pdfUrl={pdf.url}
          aoBaixar={pdf.pedir}
          baixando={pdf.pedindo}
          erro={pdf.erro}
        />
      );
    case 'fluxo':
      return (
        <Leitura
          token={token}
          sessao={situacao.sessao}
          trocarSessao={trocarSessao}
          navegar={navegar}
        />
      );
    default:
      throw new Error('situação desconhecida do convite');
  }
}

/* ─── DEPOIS DO ACEITE ─────────────────────────────────────────────────────── */

function TelaDeConclusao() {
  const comprovante = pegarComprovante();
  const pdf = usarPdf(comprovante?.token);
  return (
    <Conclusao
      comprovante={comprovante}
      pdfUrl={pdf.url}
      pedindoPdf={pdf.pedindo}
      erroDoPdf={pdf.erro}
      aoPedirPdf={pdf.pedir}
    />
  );
}

export default function Fluxo({ segmentos, navegar }: PropsDeRota) {
  const token = segmentos[0] === 'convite' ? segmentos[1] : undefined;
  if (token != null && token.length > 0) {
    // `key` no token: trocar de convite na mesma aba recomeça o estado inteiro,
    // em vez de misturar o manual de um com o progresso do outro.
    return <FluxoDoConvite key={token} token={token} navegar={navegar} />;
  }
  if (segmentos[0] === 'concluido') return <TelaDeConclusao />;
  return <LinkInvalido />;
}
