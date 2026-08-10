/**
 * ─── A PORTA DE VERDADE ──────────────────────────────────────────────────────
 *
 * A implementação da porta contra o Supabase, por `fetch` puro contra a API
 * REST (PostgREST) e a de autenticação.
 *
 * SEM SDK, e é decisão: `@supabase/supabase-js` custa cerca de 30 kB gzip e
 * entraria no pacote da LANDING, não só no do painel — o formulário do site
 * também grava. O que se usa dele aqui são quatro chamadas HTTP; escrever as
 * quatro custa cinquenta linhas e zero byte para quem só quer ler a página.
 *
 * ─── A REGRA DE SEGURANÇA QUE ORGANIZA ISTO ──────────────────────────────────
 *
 * A chave anônima é PÚBLICA — ela é compilada dentro do JavaScript que qualquer
 * visitante baixa, e num site estático não existe onde escondê-la. Então ela
 * não pode poder LER. O desenho mora nas políticas do banco
 * (`supabase/schema.sql`), e é este:
 *
 *   INSERT  →  anônimo      (o formulário grava)
 *   SELECT  →  autenticado  (a Central lê)
 *   UPDATE  →  autenticado  (marcar como baixado)
 *
 * Sem isso, "senha do time" seria teatro: bastaria abrir o bundle, copiar a
 * chave e baixar a base inteira de nomes e telefones.
 */
import type { Lead, LeadNovo } from '../tipos';
import type { PortaDeLeads } from './porta';

/**
 * A conta única do time.
 *
 * O dono pediu SENHA ÚNICA. Por baixo é um usuário de verdade no Supabase —
 * é o que permite ao banco distinguir "anônimo" de "time" sem servidor nosso. O
 * e-mail é fixo e público; o segredo é a senha, e ela nunca entra neste repo.
 */
export const CONTA_DO_TIME = 'equipe@doxavira.com';

const SESSAO = 'doxa.leads.sessao';

interface Sessao {
  token: string;
  expira_em: number;
}

function guardarSessao(token: string, segundos: number) {
  const sessao: Sessao = { token, expira_em: Date.now() + segundos * 1000 };
  try {
    localStorage.setItem(SESSAO, JSON.stringify(sessao));
  } catch {
    /* Sem localStorage a sessão dura o que durar a aba. Melhor que não entrar. */
  }
}

export function tokenGuardado(): string | null {
  try {
    const bruto = localStorage.getItem(SESSAO);
    if (!bruto) return null;
    const sessao = JSON.parse(bruto) as Sessao;
    // Expirado é o mesmo que ausente: devolver um token vencido faria a Central
    // pedir a lista, tomar 401 e mostrar uma tela vazia sem dizer por quê.
    return sessao.expira_em > Date.now() ? sessao.token : null;
  } catch {
    return null;
  }
}

export function portaSupabase(url: string, chave: string): PortaDeLeads {
  const cabecalho = (token?: string) => ({
    apikey: chave,
    Authorization: `Bearer ${token ?? chave}`,
    'Content-Type': 'application/json',
  });

  return {
    modo: 'supabase',

    async entrar(senha) {
      try {
        const resposta = await fetch(`${url}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: { apikey: chave, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: CONTA_DO_TIME, password: senha }),
        });
        if (!resposta.ok) return 'Senha incorreta.';
        const dados = (await resposta.json()) as { access_token: string; expires_in: number };
        guardarSessao(dados.access_token, dados.expires_in);
        return null;
      } catch {
        return 'Não deu para falar com o servidor.';
      }
    },

    sessaoAtiva: () => tokenGuardado() !== null,

    sair() {
      localStorage.removeItem(SESSAO);
    },

    /**
     * A gravação NÃO fala com o Supabase — fala com `/api/lead`.
     *
     * É a mudança que fecha o buraco: a chave pública está dentro do bundle, e
     * enquanto ela pudesse inserir, qualquer um enchia a tabela com um `curl`
     * sem nunca abrir a página. Agora quem grava é o endpoint, que julga a
     * prova antes e usa uma chave que o navegador nunca vê.
     *
     * O caminho é relativo de propósito: a mesma origem do site, sem CORS e sem
     * um domínio a mais para configurar.
     */
    async gravar(lead: LeadNovo, prova) {
      const resposta = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, prova }),
      });
      if (!resposta.ok) throw new Error('rede');
    },

    async listar() {
      const token = tokenGuardado();
      if (!token) throw new Error('sessao');
      const resposta = await fetch(`${url}/rest/v1/leads?select=*&order=criado_em.desc`, {
        headers: cabecalho(token),
      });
      if (!resposta.ok) throw new Error(resposta.status === 401 ? 'sessao' : 'rede');
      return (await resposta.json()) as Lead[];
    },

    async marcarBaixados(ids) {
      if (ids.length === 0) return;
      const token = tokenGuardado();
      if (!token) throw new Error('sessao');
      const lista = ids.map((id) => `"${id}"`).join(',');
      const resposta = await fetch(`${url}/rest/v1/leads?id=in.(${lista})`, {
        method: 'PATCH',
        headers: { ...cabecalho(token), Prefer: 'return=minimal' },
        body: JSON.stringify({ baixado: true, baixado_em: new Date().toISOString() }),
      });
      if (!resposta.ok) throw new Error(resposta.status === 401 ? 'sessao' : 'rede');
    },
  };
}
