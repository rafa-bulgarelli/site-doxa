/**
 * ─── O CAMINHO DO CLIENTE ────────────────────────────────────────────────────
 *
 * Do link do WhatsApp ao PDF na mão. Este arquivo é só a ORQUESTRAÇÃO: quem
 * decide alguma coisa é `maquina.ts` (pura, testada), quem fala com o servidor
 * é `api.ts`, quem anda pelos passos é `Leitura.tsx` e quem desenha são as
 * telas ao lado. Aqui mora o que só o CONVITE tem: o token, o progresso que
 * sobe e o aceite que grava.
 *
 * Duas rotas chegam:
 *  · `['convite', '<token>']` — o fluxo inteiro; o token sai daqui e vai no
 *    CORPO de toda chamada, nunca na URL;
 *  · `['concluido']` — a confirmação depois do aceite.
 *
 * Qualquer outra coisa é link quebrado, e tem tela própria.
 */
import { useEffect, useState } from 'react';
import type { PropsDeRota } from '../tipos';
import { ROTA_BASE } from '../config';
import { abrirConvite, concluirAceite, pedirPdf, salvarProgresso } from './api';
import {
  aceiteDaSessao,
  montarPedidoConcluir,
  montarPedidoProgresso,
  nomeParaAceite,
  podeConcluir,
  situacaoDe,
} from './maquina';
import type { Sessao, Situacao } from './maquina';
import { guardarComprovante, pegarComprovante } from './memoria';
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
import { Leitura } from './Leitura';

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

/* ─── A LEITURA COM TRANSPORTE ─────────────────────────────────────────────── */

/**
 * A leitura do cliente ligada ao servidor.
 *
 * O caminho e as telas são da `Leitura`; o que este pedaço acrescenta é o que
 * só o convite tem — o token, o progresso que sobe e o aceite que grava.
 */
function LeituraDoConvite({
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

  return (
    <Leitura
      sessao={sessao}
      trocarSessao={trocarSessao}
      aoTrocarPasso={(destino, nova) => {
        // O servidor é a memória ENTRE visitas; dentro da visita o estado é
        // local. Por isso o progresso sobe na troca de passo, e não a cada
        // checkbox — e por isso a falha dele é ignorada: travar a leitura
        // porque um POST de conveniência não subiu seria punir o cliente por
        // um problema nosso.
        void salvarProgresso(montarPedidoProgresso(token, destino, aceiteDaSessao(nova)));
      }}
      enviando={enviando}
      erroDoEnvio={erroDoEnvio}
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
          invitePlataforma={situacao.invitePlataforma}
        />
      );
    case 'fluxo':
      return (
        <LeituraDoConvite
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
