/**
 * ─── A ROTA `/conversor` ─────────────────────────────────────────────────────
 *
 * O portão e a ferramenta, e a decisão de qual dos dois mostrar. Este é o único
 * ponto de entrada da rota: o `App` carrega ELE, de forma preguiçosa, e nada do
 * conversor entra no pacote de quem só veio ver a landing.
 *
 * A decisão é do MESMO depósito da Central — uma senha, uma sessão, duas
 * ferramentas. Quem entrou lá abre esta página já dentro, e quem sai daqui sai
 * das duas, porque o que se apaga é a sessão, não uma permissão de página.
 *
 * `sessaoAtiva()` é lido uma vez, no primeiro desenho, e depois só muda por
 * ação: entrar pelo portão, sair pelo botão, ou o 401 que a página recebe do
 * servidor quando o token venceu no meio do caminho. Não há relógio vigiando a
 * expiração — derrubar a tela sozinha, no meio de uma conversão, seria pior do
 * que descobrir na resposta.
 */
import { useState } from 'react';
import { sessaoAtiva } from '../leads/deposito';
import { Pagina } from './Pagina';
import { Portao } from './Portao';

export function Rota() {
  const [dentro, setDentro] = useState(() => sessaoAtiva());

  return dentro ? (
    <Pagina aoSair={() => setDentro(false)} />
  ) : (
    <Portao aoEntrar={() => setDentro(true)} />
  );
}

export default Rota;
