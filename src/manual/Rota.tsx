/**
 * ─── A ROTA DO MANUAL ────────────────────────────────────────────────────────
 *
 * O único ponto de entrada de tudo que mora sob a ROTA_BASE — o `App` carrega
 * ELE, de forma preguiçosa, e nada do manual entra no pacote de quem veio ver
 * a landing.
 *
 * Aqui dentro existe navegação DE VERDADE (convite → concluído; lista → detalhe
 * na área da equipe), e é por isso que este roteador é maior que o `switch` do
 * `App`: ele empurra história (`pushState`) e escuta o botão de voltar
 * (`popstate`). Continua não sendo o react-router, e de propósito — o que se
 * usa dele aqui são estas vinte linhas, e o resto do site não navega.
 *
 * A divisão em DOIS pedaços preguiçosos é a mesma lógica do `App`: quem abre o
 * link de convite no celular não baixa um byte do painel da equipe, e quem abre
 * o painel não baixa o fluxo do cliente.
 */
import { Suspense, lazy, useEffect, useState } from 'react';
import { ROTA_BASE } from './config';

const Fluxo = lazy(() => import('./publico/Fluxo'));
const Painel = lazy(() => import('./admin/Painel'));

function caminhoAtual(): string {
  return window.location.pathname.replace(/\/+$/, '');
}

/** O vão preto de sempre: rolar mais rápido que a rede encontra fundo, não salto. */
function Vao() {
  return <div className="min-h-screen bg-doxa-bg" aria-hidden />;
}

export function Rota() {
  const [caminho, setCaminho] = useState(caminhoAtual);

  useEffect(() => {
    const aoNavegarDoNavegador = () => setCaminho(caminhoAtual());
    window.addEventListener('popstate', aoNavegarDoNavegador);
    return () => window.removeEventListener('popstate', aoNavegarDoNavegador);
  }, []);

  const navegar = (destino: string) => {
    window.history.pushState(null, '', destino);
    setCaminho(destino.replace(/\/+$/, ''));
  };

  // `/manual-doxa/convite/abc` → ['convite', 'abc']. O que vier fora da base é
  // impossível (o App só chega aqui pela base), mas o slice não quebra com nada.
  const segmentos = caminho
    .slice(ROTA_BASE.length)
    .split('/')
    .filter((pedaco) => pedaco.length > 0);

  if (segmentos[0] === 'admin') {
    return (
      <Suspense fallback={<Vao />}>
        <Painel segmentos={segmentos.slice(1)} navegar={navegar} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Vao />}>
      <Fluxo segmentos={segmentos} navegar={navegar} />
    </Suspense>
  );
}

export default Rota;
