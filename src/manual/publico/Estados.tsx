/**
 * ─── QUANDO O LINK NÃO ABRE O MANUAL ─────────────────────────────────────────
 *
 * Uma tela por motivo. É a regra do dono e ela tem custo de suporte medido:
 * "não deu" sem explicação vira ligação para o CX, e o CX não consegue nem
 * saber de qual dos quatro casos se trata pelo relato do cliente.
 *
 * Cada tela diz TRÊS coisas, sempre na mesma ordem: o que aconteceu · se tem
 * conserto · o que fazer agora. Nenhuma delas culpa o cliente, e nenhuma manda
 * "entrar em contato" sem dizer com quem — quem enviou o link é a pessoa que
 * resolve.
 */
import type { ReactNode } from 'react';
import { BaixarPdf, Botao, Casca, Linha, Quadro, Titulo } from './pecas';
import { dataEHora } from './formato';
import type { AceiteResumo } from '../tipos';

/** O vão preto enquanto a API responde. Sem spinner: o fluxo abre em um pulo. */
export function Carregando() {
  return (
    <Casca>
      <p className="text-[15px] text-white/45" role="status">
        Abrindo seu manual…
      </p>
    </Casca>
  );
}

function Recado({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Casca>
      <Titulo>{titulo}</Titulo>
      <div className="mt-5 space-y-4">{children}</div>
    </Casca>
  );
}

/** Token que não existe — link truncado no WhatsApp, colado pela metade, digitado. */
export function LinkInvalido() {
  return (
    <Recado titulo="Este link não é válido">
      <Linha>
        O endereço que você abriu não corresponde a nenhum convite. Na maioria das vezes é um
        link que veio quebrado na mensagem — copiar só um pedaço já é o bastante.
      </Linha>
      <Linha>
        Abra a conversa em que você recebeu o convite e toque no link inteiro. Se ele continuar
        sem abrir, peça um novo para o seu contato na DOXA.
      </Linha>
    </Recado>
  );
}

export function LinkExpirado() {
  return (
    <Recado titulo="Este convite expirou">
      <Linha>
        Convites do manual têm prazo. O seu passou da data, e por segurança ele não abre mais o
        conteúdo.
      </Linha>
      <Linha>
        Nada se perdeu: peça um convite novo ao seu contato na DOXA e você recomeça do ponto em
        que parou.
      </Linha>
    </Recado>
  );
}

export function LinkRevogado() {
  return (
    <Recado titulo="Este convite foi cancelado">
      <Linha>
        A DOXA cancelou este convite. Isso costuma acontecer quando um link é enviado de novo —
        o antigo deixa de valer no mesmo instante em que o novo é criado.
      </Linha>
      <Linha>
        Procure na sua conversa a mensagem mais recente com o link do manual. Se não houver
        outra, peça ao seu contato na DOXA.
      </Linha>
    </Recado>
  );
}

/**
 * Falha que tem conserto: a rede caiu, o servidor tropeçou.
 *
 * O botão de tentar de novo é o ponto da tela — sem ele o cliente recarrega a
 * página, e recarregar num fluxo com progresso salvo assusta ("perdi tudo?").
 */
export function FalhaComVolta({
  mensagem,
  aoTentarDeNovo,
}: {
  mensagem: string;
  aoTentarDeNovo: () => void;
}) {
  return (
    <Recado titulo="Não conseguimos carregar agora">
      <Linha>{mensagem}</Linha>
      <Linha>Seu progresso está guardado. Tentar de novo não recomeça nada.</Linha>
      <div className="pt-2">
        <Botao onClick={aoTentarDeNovo}>Tentar de novo</Botao>
      </div>
    </Recado>
  );
}

/** Falha sem conserto pelo cliente: o pedido é que está errado, não a rede. */
export function Indisponivel({ mensagem }: { mensagem: string }) {
  return (
    <Recado titulo="Não foi possível abrir o manual">
      <Linha>{mensagem}</Linha>
      <Linha>Peça um link novo para o seu contato na DOXA.</Linha>
    </Recado>
  );
}

/**
 * O convite já concluído.
 *
 * Não é erro e não pode parecer erro: esta pessoa fez tudo certo e voltou para
 * buscar o comprovante. A tela confirma o aceite e entrega o download.
 */
export function JaConcluido({
  aceite,
  pdfUrl,
  aoBaixar,
  baixando,
  erro,
}: {
  aceite: AceiteResumo;
  pdfUrl?: string;
  aoBaixar: () => void;
  baixando: boolean;
  erro?: string;
}) {
  return (
    <Recado titulo="Você já concluiu este manual">
      <Linha>
        Seu aceite foi registrado em {dataEHora(aceite.aceito_em)}, sobre a versão{' '}
        {aceite.versao_numero} do manual. A DOXA mantém o documento arquivado.
      </Linha>
      <Quadro>
        <p className="text-[11px] uppercase tracking-[0.16em] text-doxa-muted">Registro</p>
        <p className="mt-1 break-all font-mono text-[13px] text-white/80">{aceite.aceite_id}</p>
      </Quadro>
      <div className="pt-2">
        <BaixarPdf url={pdfUrl} pedindo={baixando} erro={erro} aoPedir={aoBaixar} />
      </div>
    </Recado>
  );
}
