/**
 * ─── A PRIMEIRA TELA ─────────────────────────────────────────────────────────
 *
 * O cliente abriu um link do WhatsApp no celular e ainda não sabe o que isto é.
 * Antes de qualquer regra ele precisa de três respostas: o que é este manual,
 * quanto tempo custa, e o que a DOXA vai guardar sobre ele.
 *
 * O aviso de privacidade fica AQUI, antes do primeiro campo — e diz o que o
 * banco realmente grava, inclusive IP e navegador (`manual_aceites.ip` e
 * `user_agent`). Avisar depois de coletar não é aviso, é notificação.
 */
import { Botao, Casca, Linha, Quadro, Titulo } from './pecas';
import { obrigatoriasDaVersao, secoesEmOrdem } from './maquina';
import { dataLonga } from './formato';
import type { ConviteAberto, Versao } from '../tipos';

export function Abertura({
  versao,
  convite,
  aoComecar,
}: {
  versao: Versao;
  convite: ConviteAberto;
  aoComecar: () => void;
}) {
  const secoes = secoesEmOrdem(versao).length;
  const regras = obrigatoriasDaVersao(versao).length;

  return (
    <Casca>
      <p className="text-[11px] uppercase tracking-[0.18em] text-doxa-muted">
        Versão {versao.numero} · {convite.empresa}
      </p>
      <div className="mt-3">
        <Titulo>{versao.titulo}</Titulo>
      </div>

      <div className="mt-6 space-y-4">
        <Linha>
          Este é o combinado entre a {convite.empresa} e a DOXA sobre como o trabalho acontece.
          Ele existe para que nada dependa de memória: o que a gente precisa de você, o que você
          pode esperar da gente, e o que acontece quando alguma dessas coisas falha.
        </Linha>
        <Linha>
          São {secoes} {secoes === 1 ? 'seção' : 'seções'} e {regras}{' '}
          {regras === 1 ? 'regra' : 'regras'} para ler e confirmar, uma a uma. Leva poucos
          minutos, e você pode fechar e voltar pelo mesmo link — o que já foi marcado fica
          guardado.
        </Linha>
        {convite.expira_em != null && (
          <Linha>Este convite fica disponível até {dataLonga(convite.expira_em)}.</Linha>
        )}
      </div>

      <div className="mt-6">
        <Quadro>
          <p className="text-[11px] uppercase tracking-[0.16em] text-doxa-muted">
            O que fica registrado
          </p>
          <p className="mt-2">
            Ao concluir, a DOXA guarda seu nome, e-mail, empresa, a data e a hora, o endereço de
            IP e o navegador usados, e a lista exata das regras que você confirmou. Esse registro
            serve para provar o que foi combinado, e fica arquivado com a gente. Você recebe uma
            cópia em PDF no fim.
          </p>
        </Quadro>
      </div>

      <div className="mt-8">
        <Botao onClick={aoComecar}>Começar a leitura</Botao>
      </div>
    </Casca>
  );
}
