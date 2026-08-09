/**
 * ─── A ROTA `/leads` ─────────────────────────────────────────────────────────
 *
 * O portão e a Central, e a decisão de qual dos dois mostrar.
 *
 * Este arquivo é o único ponto de entrada da rota — o `App` carrega ELE, de
 * forma preguiçosa, e nada da Central entra no pacote de quem só veio ver a
 * landing.
 *
 * O aviso de MODO SIMULADO fica aqui e não dentro da Central porque é uma
 * verdade sobre o ambiente, não sobre a lista: enquanto não houver banco, quem
 * abrir a página precisa saber, na primeira olhada, que aqueles nomes não são
 * de gente de verdade. Sem isso, alguém liga para um lead inventado.
 */
import { useState } from 'react';
import { sessaoAtiva, temBanco } from './deposito';
import { Central } from './Central';
import { Portao } from './central/Portao';

export function Rota() {
  const [dentro, setDentro] = useState(() => sessaoAtiva());

  return (
    <>
      {!temBanco && (
        <div className="sticky top-0 z-40 border-b border-white/[0.1] bg-[#2a2a12] px-4 py-2 text-center text-[12px] text-white/75">
          Modo simulado — nenhum banco conectado. Os leads abaixo são inventados para conferir a
          tela. Senha: <code className="text-white">doxa</code>
        </div>
      )}
      {dentro ? <Central aoSair={() => setDentro(false)} /> : <Portao aoEntrar={() => setDentro(true)} />}
    </>
  );
}

export default Rota;
