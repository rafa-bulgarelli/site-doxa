/**
 * ─── A ROTA `/admin` ─────────────────────────────────────────────────────────
 *
 * O portão e o painel, e a decisão de qual dos dois mostrar. Único ponto de
 * entrada da rota: o `App` carrega ELE, de forma preguiçosa, e nada do painel
 * entra no pacote de quem só veio ver a landing.
 *
 * A decisão é do MESMO depósito da Central — uma senha, uma sessão, todas as
 * ferramentas. Quem entrou em `/leads`, no manual ou no conversor abre esta
 * página já dentro, e quem sai daqui sai de todas, porque o que se apaga é a
 * sessão e não uma permissão de página.
 *
 * `sessaoAtiva()` é lido uma vez, no primeiro desenho, e depois só muda por
 * ação: entrar pelo portão ou sair pelo botão. Não há relógio vigiando a
 * expiração — quem tem o token vencido descobre na ferramenta que ele abrir, que
 * é onde existe um servidor para dizer isso.
 */
import { useState } from 'react';
import { sessaoAtiva, temBanco } from '../leads/deposito';
import { Painel } from './Painel';
import { Portao } from './Portao';

export function Rota() {
  const [dentro, setDentro] = useState(() => sessaoAtiva());

  /*
   * Sem Supabase configurado não existe conta do time, e portanto não existe
   * painel. Dizer isso é melhor do que mostrar uma porta que nunca abre: a
   * Central tem modo simulado porque o formulário da landing precisa dele, mas
   * aqui um login de mentira só ensinaria a confiar numa tela que não é a de
   * produção. É o mesmo recado da área do manual, e de propósito.
   */
  if (!temBanco) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-doxa-bg px-5 py-16">
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-[1.8rem] leading-tight text-white">
            Sem banco conectado.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/50">
            O painel entra com a conta do time no Supabase. Configure
            `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` neste ambiente para entrar.
          </p>
        </div>
      </main>
    );
  }

  return dentro ? (
    <Painel aoSair={() => setDentro(false)} />
  ) : (
    <Portao aoEntrar={() => setDentro(true)} />
  );
}

export default Rota;
