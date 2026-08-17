/**
 * ─── A PÁGINA DO CONVERSOR ───────────────────────────────────────────────────
 *
 * Uma tarefa, uma tela: escolher o arquivo, esperar, receber o documento. Não há
 * lista, não há histórico e não há botão de "formato de saída" — a direção sai
 * do que subiu, e perguntá-la seria um clique inventado.
 *
 * ─── OS QUATRO ESTADOS ───────────────────────────────────────────────────────
 *
 *   parado      → a área de upload, dizendo em letra grande o que ela aceita
 *   convertendo → indicador VIVO com o nome do arquivo; o upload e a conversão
 *                 são uma espera só, porque para quem espera é uma coisa só
 *   pronto      → o download já disparou; sobram "baixar de novo" e "converter
 *                 outro", que são as duas coisas que alguém faz em seguida
 *   erro        → a área de upload continua ali, com a frase do motivo embaixo
 *
 * O erro NÃO troca a tela por uma tela de erro: quem escolheu o arquivo errado
 * quer escolher outro no mesmo lugar, e sumir com o alvo obrigaria um clique de
 * volta antes da segunda tentativa. A frase mora num espaço de altura fixa pelo
 * mesmo motivo do portão — texto que aparece empurrando o botão para baixo faz o
 * segundo clique cair em outro lugar.
 *
 * O download é disparado no fluxo do envio, e não num efeito: o `StrictMode`
 * roda os efeitos duas vezes em desenvolvimento, e isso seriam dois arquivos
 * descendo por uma conversão só.
 */
import { useState } from 'react';
import { Download, FileCheck2, Loader2, LogOut, RotateCcw, UploadCloud } from 'lucide-react';
import { EXTENSAO_DOCX, EXTENSAO_PDF, TAMANHO_MAXIMO_BYTES } from './config';
import { enviar, type ConversaoPronta } from './enviar';
import { sair } from '../leads/deposito';
import type { CodigoDeErro } from './tipos';

const TETO_EM_MB = Math.round(TAMANHO_MAXIMO_BYTES / (1024 * 1024));

/**
 * A frase de cada código do contrato.
 *
 * É um `Record` do tipo inteiro de propósito: um código novo no contrato não
 * compila enquanto não ganhar texto aqui — é o compilador impedindo que a tela
 * mostre um espaço em branco no dia em que o servidor aprender um erro novo.
 *
 * Cada frase diz o que fazer em seguida. "Erro na conversão" sozinho manda a
 * pessoa tentar a mesma coisa de novo, e falhar de novo.
 */
const MENSAGENS: Record<CodigoDeErro, string> = {
  sem_sessao: 'Sua sessão terminou. Entre de novo para continuar.',
  sessao_invalida: 'Sua sessão terminou. Entre de novo para continuar.',
  tipo_nao_aceito: `Este arquivo não é PDF nem Word. Só ${EXTENSAO_PDF} e ${EXTENSAO_DOCX} passam por aqui.`,
  arquivo_grande: `Este arquivo passa de ${TETO_EM_MB} MB. Tente um menor, ou quebre o documento em partes.`,
  conversao_falhou:
    'Não deu para converter este arquivo. Se ele estiver protegido por senha ou for um documento digitalizado, é por aí.',
  conversao_demorou:
    'A conversão passou do tempo. Tente de novo — se insistir, o documento é pesado demais para o serviço.',
  provedor_indisponivel:
    'Não conseguimos falar com o serviço de conversão agora. Tente de novo em instantes.',
};

type Estado =
  | { nome: 'parado' }
  | { nome: 'convertendo'; arquivo: string }
  | { nome: 'pronto'; conversao: ConversaoPronta }
  | { nome: 'erro'; codigo: CodigoDeErro };

/**
 * Faz o navegador baixar o que está na memória.
 *
 * A âncora entra e sai do documento no mesmo instante: um `click()` em elemento
 * fora da árvore não dispara download em todos os navegadores.
 */
function baixar(conversao: ConversaoPronta): void {
  const endereco = URL.createObjectURL(conversao.blob);
  const ancora = document.createElement('a');
  ancora.href = endereco;
  ancora.download = conversao.nomeSugerido;
  document.body.appendChild(ancora);
  ancora.click();
  ancora.remove();
  // A revogação espera um tiquetaque: soltar o endereço na mesma linha do
  // clique corta o download antes de ele começar em alguns navegadores. Sem
  // revogar nunca, o blob fica preso na memória da aba até a página fechar.
  window.setTimeout(() => URL.revokeObjectURL(endereco), 0);
}

/** O que a área de upload mostra enquanto ninguém escolheu nada. */
function Convite({ arrastando }: { arrastando: boolean }) {
  return (
    <>
      <UploadCloud
        className={`h-7 w-7 transition-colors ${arrastando ? 'text-white' : 'text-white/40'}`}
        strokeWidth={1.5}
      />
      <p className="mt-4 text-[16px] text-white">
        {arrastando ? 'Solte o arquivo' : 'Arraste o documento aqui'}
      </p>
      <p className="mt-1 text-[14px] text-white/45">
        ou clique para escolher — {EXTENSAO_PDF} e {EXTENSAO_DOCX}, até {TETO_EM_MB} MB
      </p>
    </>
  );
}

/** A espera, com o nome na tela: sem ele, a página parece travada. */
function Trabalhando({ arquivo }: { arquivo: string }) {
  return (
    <div className="flex min-h-[188px] flex-col items-center justify-center px-6 py-14 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-white/70" strokeWidth={1.5} />
      <p className="mt-4 max-w-full truncate text-[16px] text-white">{arquivo}</p>
      <p className="mt-1 text-[14px] text-white/45">Convertendo. Isto leva alguns segundos.</p>
      <div className="mt-5 h-px w-40 animate-pulse bg-white/25" />
    </div>
  );
}

/** O fim da tarefa, com as duas coisas que se faz em seguida. */
function Concluido({
  conversao,
  aoConverterOutro,
}: {
  conversao: ConversaoPronta;
  aoConverterOutro: () => void;
}) {
  return (
    <div className="flex min-h-[188px] flex-col items-center justify-center px-6 py-12 text-center">
      <FileCheck2 className="h-7 w-7 text-white" strokeWidth={1.5} />
      <p className="mt-4 max-w-full truncate text-[16px] text-white">{conversao.nomeSugerido}</p>
      <p className="mt-1 text-[14px] text-white/45">
        Pronto. O arquivo desceu para a sua pasta de downloads.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => baixar(conversao)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          Baixar de novo
        </button>
        <button
          type="button"
          onClick={aoConverterOutro}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-5 py-2.5 text-[14px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Converter outro
        </button>
      </div>
    </div>
  );
}

export function Pagina({ aoSair }: { aoSair: () => void }) {
  const [estado, setEstado] = useState<Estado>({ nome: 'parado' });
  const [arrastando, setArrastando] = useState(false);

  const sairDaConta = () => {
    sair();
    aoSair();
  };

  const converter = async (arquivo: File) => {
    setEstado({ nome: 'convertendo', arquivo: arquivo.name });
    const resultado = await enviar(arquivo);
    if (resultado.ok) {
      baixar(resultado.conversao);
      setEstado({ nome: 'pronto', conversao: resultado.conversao });
      return;
    }
    if (resultado.erro === 'sem_sessao' || resultado.erro === 'sessao_invalida') {
      // Sessão caída não é erro do arquivo: a tela certa é o portão, e insistir
      // aqui só repetiria o mesmo 401 a cada tentativa.
      sairDaConta();
      return;
    }
    setEstado({ nome: 'erro', codigo: resultado.erro });
  };

  const receber = (arquivo: File | undefined) => {
    setArrastando(false);
    if (arquivo === undefined || estado.nome === 'convertendo') return;
    void converter(arquivo);
  };

  const soltar = (evento: React.DragEvent<HTMLLabelElement>) => {
    // Sem o `preventDefault`, o navegador ABRE o arquivo solto e a página some.
    evento.preventDefault();
    receber(evento.dataTransfer.files[0]);
  };

  const escolher = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    // O campo é zerado para que escolher O MESMO arquivo de novo continue
    // disparando `change` — sem isto, a segunda tentativa não acontece.
    evento.target.value = '';
    receber(arquivo);
  };

  return (
    <main className="min-h-screen bg-doxa-bg px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/50">
              <FileCheck2 className="h-3 w-3" strokeWidth={2} />
              Conversor
            </span>
            <h1 className="mt-4 font-serif text-[2.2rem] leading-none tracking-[-0.02em] text-white md:text-[2.6rem]">
              Conversor de contratos.
            </h1>
            <p className="mt-2 text-[15px] leading-snug text-white/45">
              PDF vira Word, Word vira PDF. O formato de saída sai do que você subir.
            </p>
          </div>

          <button
            type="button"
            onClick={sairDaConta}
            aria-label="Sair do conversor"
            className="shrink-0 rounded-full border border-white/[0.14] p-2.5 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-white/[0.1] bg-white/[0.03]">
          {estado.nome === 'convertendo' && <Trabalhando arquivo={estado.arquivo} />}

          {estado.nome === 'pronto' && (
            <Concluido
              conversao={estado.conversao}
              aoConverterOutro={() => setEstado({ nome: 'parado' })}
            />
          )}

          {(estado.nome === 'parado' || estado.nome === 'erro') && (
            <label
              onDragOver={(evento) => {
                evento.preventDefault();
                setArrastando(true);
              }}
              onDragLeave={() => setArrastando(false)}
              onDrop={soltar}
              className={`flex min-h-[188px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-14 text-center transition-colors ${
                arrastando ? 'border-white/40 bg-white/[0.06]' : 'border-white/[0.16] hover:bg-white/[0.04]'
              }`}
            >
              <Convite arrastando={arrastando} />
              <input
                type="file"
                accept={`${EXTENSAO_PDF},${EXTENSAO_DOCX}`}
                onChange={escolher}
                className="sr-only"
              />
            </label>
          )}
        </div>

        {/* Altura reservada: a frase entra e sai sem mexer no que está embaixo. */}
        <p
          role={estado.nome === 'erro' ? 'alert' : undefined}
          className="mt-3 min-h-[40px] text-[14px] leading-snug"
          style={{ color: '#E8938C' }}
        >
          {estado.nome === 'erro' ? MENSAGENS[estado.codigo] : ''}
        </p>
      </div>
    </main>
  );
}
