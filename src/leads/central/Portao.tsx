/**
 * ─── O PORTÃO ────────────────────────────────────────────────────────────────
 *
 * A tela de entrada da Central. Ela é a única coisa que existe em `/leads` para
 * quem não entrou.
 *
 * ─── O QUE ELE PROTEGE, E O QUE NÃO ──────────────────────────────────────────
 *
 * Este componente NÃO é a segurança — ele é a porta. A segurança está no banco:
 * a chave pública não tem permissão de leitura, então mesmo quem apagasse este
 * componente do JavaScript no próprio navegador continuaria recebendo uma lista
 * vazia do servidor. É a diferença entre esconder o conteúdo e não entregá-lo.
 *
 * Esconder a tela ainda importa por outra razão: sem o portão, quem abrisse o
 * link veria uma tela de erro em vez de um pedido de senha, e concluiria que o
 * painel está quebrado.
 */
import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { entrar } from '../deposito';

export function Portao({ aoEntrar }: { aoEntrar: () => void }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [tentando, setTentando] = useState(false);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sem rolagem: o portão é a tela inteira e o foco no campo não pode
    // arrastar a página. Ver a armadilha do `focus()` no CLAUDE.md.
    campo.current?.focus({ preventScroll: true });
  }, []);

  const tentar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (tentando || senha.length === 0) return;
    setTentando(true);
    setErro(null);
    const problema = await entrar(senha);
    setTentando(false);
    if (problema) {
      setErro(problema);
      setSenha('');
      campo.current?.focus({ preventScroll: true });
      return;
    }
    aoEntrar();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-doxa-bg px-5 py-16">
      <div className="w-full max-w-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/50">
          <Lock className="h-3 w-3" strokeWidth={2} />
          Central de leads
        </span>

        <h1 className="mt-6 font-serif text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-white">
          Área do time.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/50">
          Os dados aqui dentro são de pessoas que confiaram no formulário. A senha é do time.
        </p>

        <form onSubmit={tentar} className="mt-8">
          <label htmlFor="senha" className="text-[13px] text-white/45">
            Senha
          </label>
          <input
            ref={campo}
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-[16px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/35"
            placeholder="••••••••"
          />

          {/* O erro tem altura reservada: sem isto o botão salta para baixo
              quando a senha erra, e o segundo clique cai no lugar errado. */}
          <p className="mt-2 min-h-[20px] text-[13px]" style={{ color: '#E8938C' }}>
            {erro}
          </p>

          <button
            type="submit"
            disabled={tentando || senha.length === 0}
            className="mt-2 w-full rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-black transition-opacity disabled:opacity-40"
          >
            {tentando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
