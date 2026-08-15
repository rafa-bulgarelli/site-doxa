/**
 * ─── DEPOIS DO ACEITE ────────────────────────────────────────────────────────
 *
 * A rota `/manual-doxa/concluido`. Duas versões da mesma tela:
 *
 *  · com o comprovante na memória do módulo — quem acabou de concluir vê o
 *    registro, a data, a versão e o botão de baixar;
 *  · sem ele — quem recarregou a página ou chegou pelo histórico. A memória
 *    morre no reload de propósito (`memoria.ts` explica), então a tela vira
 *    uma confirmação genérica que manda reabrir o link do convite. Não é beco:
 *    abrir um convite concluído devolve o aceite e o download de novo.
 *
 * O que NÃO se faz aqui é fingir que o aceite não existiu. O tom das duas é o
 * mesmo: está feito.
 */
import { BaixarPdf, Casca, Linha, Quadro, Rotulo, Titulo } from './pecas';
import { dataEHora } from './formato';
import type { Comprovante } from './memoria';

export function Conclusao({
  comprovante,
  pdfUrl,
  pedindoPdf,
  erroDoPdf,
  aoPedirPdf,
}: {
  comprovante?: Comprovante;
  pdfUrl?: string;
  pedindoPdf: boolean;
  erroDoPdf?: string;
  aoPedirPdf: () => void;
}) {
  if (comprovante == null) {
    return (
      <Casca>
        <Titulo>Manual concluído</Titulo>
        <div className="mt-5 space-y-4">
          <Linha>
            Se você concluiu o manual nesta sessão, o registro já está com a DOXA e o documento
            fica arquivado conosco.
          </Linha>
          <Linha>
            Para ver o comprovante e baixar o PDF de novo, reabra o link do convite que você
            recebeu — ele continua funcionando depois de concluído, e mostra o seu registro.
          </Linha>
        </div>
      </Casca>
    );
  }

  return (
    <Casca>
      <Rotulo>Concluído</Rotulo>
      <div className="mt-4">
        <Titulo>Pronto, {primeiroNome(comprovante.nome)}. Está registrado.</Titulo>
      </div>

      <div className="mt-5 space-y-4">
        <Linha>
          Você confirmou o manual da DOXA em nome da {comprovante.empresa}. A partir de agora
          este é o combinado que vale entre nós.
        </Linha>
      </div>

      <div className="mt-6 rounded-2xl border border-doxa-line bg-doxa-surface p-5">
        <Item rotulo="Registro" valor={comprovante.aceite_id} monoespacado />
        <Item rotulo="Data e hora" valor={dataEHora(comprovante.aceito_em)} />
        <Item rotulo="Versão do manual" valor={`Versão ${comprovante.versao_numero}`} />
      </div>

      <div className="mt-7">
        <BaixarPdf
          url={pdfUrl ?? comprovante.pdf_url ?? undefined}
          pedindo={pedindoPdf}
          erro={erroDoPdf}
          aoPedir={aoPedirPdf}
        />
      </div>

      <div className="mt-6">
        <Quadro>
          A DOXA mantém este documento arquivado. Você pode voltar pelo link do convite sempre
          que precisar de uma cópia — o link do PDF vale por alguns minutos e é gerado de novo a
          cada pedido.
        </Quadro>
      </div>
    </Casca>
  );
}

function Item({
  rotulo,
  valor,
  monoespacado = false,
}: {
  rotulo: string;
  valor: string;
  monoespacado?: boolean;
}) {
  return (
    <div className="border-t border-doxa-line py-4 first:border-t-0 first:pt-0">
      <Rotulo>{rotulo}</Rotulo>
      <p className={`mt-1.5 break-all text-[17px] text-white ${monoespacado ? 'font-mono' : ''}`}>
        {valor}
      </p>
    </div>
  );
}

/** O primeiro nome, para falar com a pessoa e não com o cadastro dela. */
function primeiroNome(nome: string): string {
  const pedaco = nome.trim().split(/\s+/)[0];
  return pedaco.length > 0 ? pedaco : nome;
}
