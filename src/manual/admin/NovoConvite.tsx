/**
 * ─── O CONVITE NOVO ──────────────────────────────────────────────────────────
 *
 * O formulário que o CX preenche e o LINK que sai dele.
 *
 * ─── POR QUE O LINK TEM UMA CAIXA SÓ PARA ELE ────────────────────────────────
 *
 * O token do convite existe UMA vez: na resposta que o criou. O banco guarda só
 * o hash — quem fechar esta caixa sem copiar não recupera o link nem sendo dono
 * do projeto; o caminho é regenerar, o que revoga o anterior. Por isso a caixa
 * é grande, o botão de copiar é o primário da tela e o endereço aparece por
 * extenso num campo selecionável: se a área de transferência falhar (e ela
 * falha fora de contexto seguro), a pessoa ainda consegue copiar à mão.
 */
import { useState } from 'react';
import { Link2, Send, X } from 'lucide-react';
import { criarConvite, registrarEvento } from './dados';
import { CONVITE_EM_BRANCO, pedidoDeCriacao, validarConvite } from './filtrar';
import { BOTAO_BORDA, BOTAO_PRIMARIO, BotaoCopiar, CampoTexto, Erro } from './pecas';
import { mensagemDe } from './usarAdmin';
import type { RascunhoDeConvite } from './filtrar';
import type { VersaoLinha } from '../tipos';

/** O link recém-criado, com o token dentro. Some quando a pessoa fecha. */
export function LinkRevelado({
  link,
  conviteId,
  aoFechar,
}: {
  link: string;
  conviteId: string;
  aoFechar: () => void;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.16] bg-white/[0.05] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/45">
            <Link2 className="h-3 w-3" strokeWidth={2} />
            Link do convite
          </span>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-white/60">
            Copie agora e mande pelo WhatsApp. Este endereço não volta a aparecer — o banco guarda
            só o hash dele.
          </p>
        </div>
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar o link"
          className="rounded-full border border-white/[0.14] p-2 text-white/50 transition-colors hover:text-white"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <input
        readOnly
        value={link}
        onFocus={(evento) => evento.currentTarget.select()}
        aria-label="Endereço do convite"
        className="mt-4 w-full rounded-xl border border-white/[0.12] bg-black/30 px-4 py-3 font-mono text-[13px] text-white outline-none"
      />

      <div className="mt-4">
        <BotaoCopiar
          texto={link}
          /* O "copiado" vira evento na linha do tempo do convite: quando o
             cliente disser que nunca recebeu, a data de quando o link saiu
             daqui é a única coisa que responde. Falhar em anotar não pode
             estragar a cópia, que é o que importa. */
          aoCopiar={() => void registrarEvento('link_copiado', conviteId).catch(() => undefined)}
        />
      </div>
    </section>
  );
}

export function NovoConvite({
  vigente,
  aoCriar,
  aoFechar,
}: {
  vigente: VersaoLinha | null;
  aoCriar: (link: string, conviteId: string) => void;
  aoFechar: () => void;
}) {
  const [rascunho, setRascunho] = useState<RascunhoDeConvite>(CONVITE_EM_BRANCO);
  const [problemas, setProblemas] = useState<Partial<Record<keyof RascunhoDeConvite, string>>>({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const mudar = (campo: keyof RascunhoDeConvite) => (valor: string) =>
    setRascunho((atual) => ({ ...atual, [campo]: valor }));

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (enviando) return;
    const encontrados = validarConvite(rascunho, Date.now());
    setProblemas(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    setErro(null);
    try {
      const criado = await criarConvite(pedidoDeCriacao(rascunho));
      setRascunho(CONVITE_EM_BRANCO);
      aoCriar(criado.link, criado.convite_id);
    } catch (problema) {
      setErro(mensagemDe(problema) === 'sessao' ? 'A sessão venceu. Entre de novo.' : mensagemDe(problema));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-[1.5rem] leading-tight text-white">Convite novo</h2>
          <p className="mt-1 text-[13px] text-white/45">
            {vigente == null
              ? 'Sem versão publicada não há o que aceitar — publique o manual antes.'
              : `O cliente vai aceitar a v${vigente.numero} — ${vigente.titulo}.`}
          </p>
        </div>
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar o formulário"
          className="rounded-full border border-white/[0.14] p-2 text-white/50 transition-colors hover:text-white"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <form onSubmit={(evento) => void enviar(evento)} className="mt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            rotulo="Empresa"
            valor={rascunho.empresa}
            aoMudar={mudar('empresa')}
            dica="Nome do cliente na nota"
            problema={problemas.empresa}
          />
          <CampoTexto
            rotulo="E-mail"
            tipo="email"
            valor={rascunho.email}
            aoMudar={mudar('email')}
            dica="para@onde.vai"
            problema={problemas.email}
          />
          <CampoTexto
            rotulo="Quem assina (opcional)"
            valor={rascunho.nomeCliente}
            aoMudar={mudar('nomeCliente')}
            dica="Em branco, o cliente informa"
            problema={problemas.nomeCliente}
          />
          <CampoTexto
            rotulo="Vence em (opcional)"
            tipo="date"
            valor={rascunho.expiraEm}
            aoMudar={mudar('expiraEm')}
            problema={problemas.expiraEm}
          />
        </div>

        <Erro mensagem={erro} />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="submit" disabled={enviando || vigente == null} className={BOTAO_PRIMARIO}>
            <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
            {enviando ? 'Criando…' : 'Criar e mostrar o link'}
          </button>
          <button type="button" onClick={aoFechar} className={BOTAO_BORDA}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
