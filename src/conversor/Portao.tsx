/**
 * ─── O PORTÃO DO CONVERSOR ───────────────────────────────────────────────────
 *
 * A tela de entrada de `/conversor`, no mesmo desenho da porta da Central e com
 * a MESMA senha: é uma conta só, a do time, e quem já entrou num lugar entra no
 * outro sem digitar de novo (`entrar` grava a sessão no depósito, e o conversor
 * lê o token de lá).
 *
 * É uma CÓPIA do desenho, e não um `import` do portão da Central — de propósito.
 * Os textos de lá falam de leads e de dados de pessoas que preencheram um
 * formulário, o que aqui seria mentira; e um componente compartilhado entre dois
 * módulos vira, na primeira divergência, um `if` de qual página está chamando.
 * O que precisa ser um só é a SESSÃO, e essa está no depósito.
 *
 * Como na Central, este componente não é a segurança: quem recusa o pedido sem
 * `Authorization` válido é a função em `api/conversor`. Ele é a porta — sem ela,
 * quem abrisse o link veria uma tela de upload que responderia com erro.
 */
import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { entrar } from '../leads/deposito';

export function Portao({ aoEntrar }: { aoEntrar: () => void }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [tentando, setTentando] = useState(false);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sem rolagem: a rota é `lazy`, então este portão monta DEPOIS do primeiro
    // desenho, e um foco que rola faria a página descer sozinha na cara de quem
    // acabou de abrir o link. Ver a armadilha do foco na montagem, no CLAUDE.md.
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
          Conversor
        </span>

        <h1 className="mt-6 font-serif text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-white">
          Conversor de contratos.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/50">
          PDF vira Word, Word vira PDF. Os documentos que passam por aqui são de clientes — a
          senha é a mesma do time.
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

          {/* Altura reservada, como na Central: sem isto o botão salta para
              baixo quando a senha erra, e o segundo clique cai no lugar errado. */}
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
