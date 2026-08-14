/**
 * ─── O PORTÃO DA ÁREA DO MANUAL ──────────────────────────────────────────────
 *
 * A tela de entrada de `/manual-doxa/admin`. A senha é a MESMA da Central de
 * leads — é a mesma conta do time, e quem valida é o Supabase, pela função
 * `entrar` importada de lá. Não existe segunda senha, nem segunda constante de
 * e-mail: duas verdades sobre quem é o time é como se tranca o time inteiro
 * fora (a armadilha do `CONTA_DO_TIME`, no CLAUDE.md).
 *
 * Como na Central, este componente NÃO é a segurança — é a porta. A segurança
 * está nas políticas do banco: sem sessão, o PostgREST devolve lista vazia para
 * quem apagar este componente do próprio navegador.
 */
import { useEffect, useRef, useState } from 'react';
import { BookLock } from 'lucide-react';
import { entrar } from '../../leads/deposito';
import { APAGADO } from './pecas';

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
    if (problema != null) {
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
          <BookLock className="h-3 w-3" strokeWidth={2} />
          Manual DOXA
        </span>

        <h1 className="mt-6 font-serif text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-white">
          Área do time.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/50">
          Convites, aceites e as versões do manual. A senha é a mesma da Central de leads.
        </p>

        <form onSubmit={(evento) => void tentar(evento)} className="mt-8">
          <label htmlFor="senha-manual" className="text-[13px] text-white/45">
            Senha
          </label>
          <input
            ref={campo}
            id="senha-manual"
            type="password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-[16px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/35"
            placeholder="••••••••"
          />

          {/* O erro tem altura reservada: sem isto o botão salta para baixo
              quando a senha erra, e o segundo clique cai no lugar errado. */}
          <p className="mt-2 min-h-[20px] text-[13px]" style={{ color: APAGADO }}>
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
