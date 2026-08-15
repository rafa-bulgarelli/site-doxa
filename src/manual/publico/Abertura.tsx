/**
 * ─── A PRIMEIRA TELA ─────────────────────────────────────────────────────────
 *
 * O cliente abriu um link do WhatsApp no celular e ainda não sabe o que isto é.
 * Três respostas, e nada além: o que é este manual, quanto custa de tempo, e o
 * que a DOXA vai guardar sobre ele.
 *
 * A contagem de capítulos e de itens sai dos DADOS, não de um número escrito à
 * mão: se o manual mudar de tamanho, a promessa da abertura muda junto — texto
 * que promete "4 capítulos" e entrega 6 é a primeira quebra de confiança do
 * fluxo.
 *
 * O aviso de privacidade fica AQUI, antes do primeiro campo, e diz o que o
 * banco realmente grava, inclusive IP e navegador (`manual_aceites.ip` e
 * `user_agent`). Avisar depois de coletar não é aviso, é notificação.
 */
import { Botao, Casca, Entrada, Linha, Quadro, Rotulo, Titulo } from './pecas';
import { capitulosEmOrdem, obrigatoriasDaVersao } from './maquina';
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
  const capitulos = capitulosEmOrdem(versao).length;
  const itens = obrigatoriasDaVersao(versao).length;

  return (
    <Casca>
      <Entrada>
        <Rotulo>
          Versão {versao.numero} · {convite.empresa}
        </Rotulo>
        <div className="mt-4">
          <Titulo>{versao.titulo}</Titulo>
        </div>
      </Entrada>

      <Entrada atraso={0.1}>
        <div className="mt-7 space-y-5">
          <Linha>
            Este é o combinado entre a {convite.empresa} e a DOXA: como o trabalho acontece, o que
            a gente precisa de você e o que protege a sua garantia.
          </Linha>
          <Linha>
            São {capitulos} {capitulos === 1 ? 'capítulo curto' : 'capítulos curtos'} para entender
            a plataforma e {itens} {itens === 1 ? 'item' : 'itens'} para confirmar no fim. Leva
            poucos minutos, e você pode fechar e voltar pelo mesmo link.
          </Linha>
          {convite.expira_em != null && (
            <Linha>Este convite fica disponível até {dataLonga(convite.expira_em)}.</Linha>
          )}
        </div>
      </Entrada>

      <Entrada atraso={0.2}>
        <div className="mt-8">
          <Quadro>
            <Rotulo>O que fica registrado</Rotulo>
            <p className="mt-3">
              Ao concluir, a DOXA guarda seu nome, e-mail, empresa, a data e a hora, o IP e o
              navegador usados, e a lista exata do que você confirmou. Você recebe uma cópia em PDF
              no fim.
            </p>
          </Quadro>
        </div>

        <div className="mt-10">
          <Botao onClick={aoComecar}>Começar →</Botao>
        </div>
      </Entrada>
    </Casca>
  );
}
