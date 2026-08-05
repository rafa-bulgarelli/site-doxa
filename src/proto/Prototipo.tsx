import { useState } from 'react';
import { OpcaoConta } from './OpcaoConta';
import { OpcaoInterruptor } from './OpcaoInterruptor';
import { OpcaoPecas } from './OpcaoPecas';
import { TITULO } from './dados';

const OPCOES = [
  { chave: 'A', nome: 'Interruptor', Componente: OpcaoInterruptor },
  { chave: 'B', nome: 'Conta riscada', Componente: OpcaoConta },
  { chave: 'C', nome: 'Sete peças', Componente: OpcaoPecas },
] as const;

/**
 * A página de protótipo, servida em `/proto`.
 *
 * Existe dentro do app, e não como um HTML solto, por um motivo só: julgar
 * tipografia e cor fora do ambiente onde elas vivem é julgar outra coisa. Aqui
 * as três opções usam a Instrument Serif de verdade, os tokens de verdade e o
 * `MotionButton` de verdade.
 *
 * Descartável de propósito — a pasta inteira sai com um `rm -rf` e a única
 * amarra com o site é a condição de rota no `main.tsx`.
 */
export function Prototipo() {
  const [atual, setAtual] = useState(0);
  const { Componente, nome, chave } = OPCOES[atual];

  return (
    <main className="min-h-screen bg-doxa-bg pb-32">
      <div className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-10">
          <span className="text-[12px] uppercase tracking-[0.18em] text-white/40">
            Protótipo · seção de comparação
          </span>
          <div className="flex gap-1.5">
            {OPCOES.map((opcao, i) => (
              <button
                key={opcao.chave}
                type="button"
                onClick={() => setAtual(i)}
                className={`rounded-full px-4 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                  i === atual
                    ? 'bg-white text-black'
                    : 'border border-white/[0.14] text-white/60 hover:text-white'
                }`}
              >
                {opcao.chave} · {opcao.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daqui para baixo é a seção como ela entraria no site: mesmo respiro,
          mesma coluna e mesmo cabeçalho do HowItWorks. */}
      <section className="relative bg-doxa-bg px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
              {TITULO[0]}
              <br />
              {TITULO[1]}
            </h2>
            <p className="max-w-xl text-sm text-white/60 md:text-base">
              A Doxa substitui a equipe inteira de conteúdo. A comparação abaixo é a mesma lista
              nos dois lados.
            </p>
          </div>

          <div className="mt-12 md:mt-16">
            <Componente />
          </div>

          <p className="mt-16 text-center text-[12px] text-white/30">
            Opção {chave} — {nome}. Trocar no topo.
          </p>
        </div>
      </section>
    </main>
  );
}
