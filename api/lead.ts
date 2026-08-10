/**
 * ─── A ÚNICA PORTA DE ESCRITA ────────────────────────────────────────────────
 *
 * `POST /api/lead`. Recebe o lead do formulário, julga se veio de gente, e só
 * então grava no Supabase.
 *
 * ─── POR QUE ELE EXISTE ──────────────────────────────────────────────────────
 *
 * Até aqui o formulário gravava DIRETO no banco com a chave pública — a mesma
 * que vai compilada dentro do JavaScript que qualquer visitante baixa. Um robô
 * não precisava do formulário: copiava a chave e enchia a tabela com um `curl`.
 * Eu fiz exatamente isso três vezes para testar as políticas.
 *
 * Um captcha no navegador não conserta isso: ele tranca a porta e deixa a
 * janela aberta. O que conserta é a escrita passar a acontecer SÓ aqui, e o
 * `INSERT` anônimo ser revogado no banco — aí não existe mais janela.
 *
 * ─── AS QUATRO CAMADAS, DA MAIS BARATA PARA A MAIS CARA ──────────────────────
 *
 *  1. Forma do dado     — o que não parece um lead nem chega a ser julgado.
 *  2. Armadilha e tempo — dois testes locais, sem rede. Pegam o robô comum.
 *  3. Limite por IP     — uma consulta. Pega a rajada de quem passou nos dois.
 *  4. Turnstile         — uma chamada à Cloudflare. Só para o que sobrou.
 *
 * A ordem é a economia: a camada cara só roda para quem passou nas baratas.
 *
 * ─── O ESTADO DE HOJE ────────────────────────────────────────────────────────
 *
 * Sem `TURNSTILE_SECRET`, a camada 4 é PULADA e o endpoint funciona com as três
 * primeiras. Sem `SUPABASE_SERVICE_ROLE`, ele grava com a chave pública, que é
 * o que já acontecia — e continua valendo enquanto o `INSERT` anônimo existir.
 * Nenhuma das duas ausências quebra o formulário; as duas juntas são o que
 * falta para fechar a porta de vez.
 */

export const config = { runtime: 'edge' };

import {
  JANELA_MINUTOS,
  LIMITE_POR_IP,
  LIMITE_POR_IP_SEM_TOKEN,
  TEMPO_MINIMO_SEM_TOKEN,
  julgarSemRede,
  type ProvaDeHumano,
} from '../src/leads/antibot';
import type { LeadNovo } from '../src/leads/tipos';

const URL_BASE = process.env.VITE_SUPABASE_URL;
const CHAVE_PUBLICA = process.env.VITE_SUPABASE_ANON_KEY;
const CHAVE_SERVIDOR = process.env.SUPABASE_SERVICE_ROLE;
const TURNSTILE = process.env.TURNSTILE_SECRET;

/** A chave com que o endpoint grava. A de servidor quando existe. */
const CHAVE_DE_ESCRITA = CHAVE_SERVIDOR ?? CHAVE_PUBLICA;

const recusa = (status: number, motivo: string) => {
  // O motivo NUNCA volta para quem chamou: dizer "armadilha" a um robô é
  // ensiná-lo a não cair nela da próxima vez. Ele fica no log, para nós.
  console.warn('lead recusado:', motivo);
  return new Response(JSON.stringify({ erro: 'recusado' }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
};

/**
 * O IP, em hash.
 *
 * O IP cru é dado pessoal e não tem por que existir no nosso banco. O que o
 * limite precisa é só de um identificador ESTÁVEL e não reversível — SHA-256 do
 * IP com um tempero do servidor resolve. Sem o tempero, um hash de IP é
 * trivialmente quebrável (são quatro bilhões de possibilidades).
 */
async function impressaoDoIp(pedido: Request): Promise<string | null> {
  const bruto =
    pedido.headers.get('x-real-ip') ??
    pedido.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null;
  if (bruto == null) return null;
  const tempero = CHAVE_DE_ESCRITA ?? 'doxa';
  const bytes = new TextEncoder().encode(`${tempero}:${bruto}`);
  const digerido = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digerido).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** O que precisa existir, e com que cara, para isto ser um lead. */
function pareceLead(corpo: unknown): corpo is LeadNovo {
  if (typeof corpo !== 'object' || corpo === null) return false;
  const l = corpo as Record<string, unknown>;
  const texto = (v: unknown, max: number) =>
    v == null || (typeof v === 'string' && v.length <= max);
  return (
    typeof l.nome === 'string' &&
    l.nome.trim().length >= 2 &&
    l.nome.length <= 120 &&
    typeof l.whatsapp === 'string' &&
    l.whatsapp.replace(/\D/g, '').length >= 10 &&
    l.whatsapp.length <= 20 &&
    (l.caminho === 'empresa' || l.caminho === 'agencia') &&
    typeof l.desqualificado === 'boolean' &&
    texto(l.email, 160) &&
    texto(l.arroba, 80) &&
    texto(l.investimento, 60) &&
    texto(l.segmento, 200) &&
    texto(l.objetivo, 200) &&
    texto(l.faturamento, 60) &&
    texto(l.origem, 60) &&
    (l.trava == null || (Array.isArray(l.trava) && l.trava.length <= 12))
  );
}

/**
 * Quantos envios este IP já fez na janela. Falhar aqui não barra ninguém.
 *
 * ─── ESTA CAMADA DEPENDE DA CHAVE DE SERVIDOR, e isso não é detalhe ──────────
 *
 * Contar exige LER, e a chave pública não pode ler — é o desenho inteiro da
 * segurança do banco. Com ela, a consulta é feita, o Postgres devolve zero por
 * política, e o limite conclui que ninguém enviou nada: a camada fica de pé
 * fingindo que funciona, que é pior do que não existir.
 *
 * Descoberto no ar, numa rajada de quatro envios seguidos que passaram todos.
 * Agora a camada declara quando está dormindo, em vez de mentir.
 */
async function passouDoLimite(impressao: string, limite: number): Promise<boolean> {
  if (!CHAVE_SERVIDOR) {
    console.warn('limite por IP dormindo: sem SUPABASE_SERVICE_ROLE não há como contar');
    return false;
  }
  try {
    const desde = new Date(Date.now() - JANELA_MINUTOS * 60_000).toISOString();
    const resposta = await fetch(
      `${URL_BASE}/rest/v1/leads?select=id&ip_hash=eq.${impressao}&criado_em=gte.${desde}`,
      {
        headers: {
          apikey: CHAVE_SERVIDOR,
          Authorization: `Bearer ${CHAVE_SERVIDOR}`,
          // `count=exact` com faixa vazia devolve só o total, sem trazer linha.
          Prefer: 'count=exact',
          Range: '0-0',
        },
      },
    );
    if (!resposta.ok) {
      /* Conferir o `ok` é o que faltava, e a ausência dele foi o que me custou
         meia hora: uma consulta recusada não tem `content-range`, o total virava
         zero, e o limite concluía que ninguém tinha enviado nada. Falha de
         contagem continua deixando passar — mas agora ela GRITA no log em vez de
         se disfarçar de "não há rajada". */
      console.error('limite por IP: consulta recusada', resposta.status, await resposta.text());
      return false;
    }
    const faixa = resposta.headers.get('content-range');
    const total = Number(faixa?.split('/')[1] ?? 0);
    return Number.isFinite(total) && total >= limite;
  } catch {
    /* Sem a coluna `ip_hash`, ou sem permissão de leitura, esta conta não
       acontece — e a resposta certa é DEIXAR PASSAR. Um limite que barra
       porque falhou é um formulário quebrado, e as outras camadas continuam
       de pé. */
    return false;
  }
}

/**
 * Pergunta à Cloudflare se o token é de gente.
 *
 * Três respostas, e a do meio é a que importa:
 *   'ok'      — token válido, ou a camada está desligada
 *   'ausente' — não veio token: julgado pela régua dura, não recusado
 *   'falso'   — veio um token e ele NÃO vale. Aí é recusa: token inválido não
 *               acontece por acaso, é alguém tentando forjar ou reusar.
 */
async function turnstileJulga(
  token: string | null,
  ip: string | null,
): Promise<'ok' | 'ausente' | 'falso'> {
  if (!TURNSTILE) return 'ok';
  if (!token) return 'ausente';
  try {
    const corpo = new FormData();
    corpo.append('secret', TURNSTILE);
    corpo.append('response', token);
    if (ip) corpo.append('remoteip', ip);
    const resposta = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: corpo,
    });
    const dados = (await resposta.json()) as { success?: boolean };
    return dados.success === true ? 'ok' : 'falso';
  } catch {
    // A Cloudflare fora do ar não pode derrubar o formulário. As outras camadas
    // continuam valendo, e um lead a mais é melhor do que um lead a menos — a
    // decisão oposta transformaria um problema deles num nosso.
    return 'ok';
  }
}

export default async function handler(pedido: Request): Promise<Response> {
  if (pedido.method !== 'POST') return recusa(405, 'metodo');
  if (!URL_BASE || !CHAVE_DE_ESCRITA) return recusa(503, 'sem banco configurado');

  let corpo: { lead?: unknown; prova?: ProvaDeHumano };
  try {
    corpo = (await pedido.json()) as typeof corpo;
  } catch {
    return recusa(400, 'json invalido');
  }

  const prova = corpo.prova;
  if (prova == null || typeof prova !== 'object') return recusa(400, 'sem prova');

  // 1 e 2 — forma e as duas checagens locais.
  if (!pareceLead(corpo.lead)) return recusa(400, 'nao parece lead');
  const local = julgarSemRede(prova);
  if (!local.ok) return recusa(429, local.motivo);

  const ipCru =
    pedido.headers.get('x-real-ip') ??
    pedido.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null;
  const impressao = await impressaoDoIp(pedido);

  // 4 antes da 3, porque o veredito do captcha decide a régua da 3.
  const captcha = await turnstileJulga(prova.token ?? null, ipCru);
  if (captcha === 'falso') return recusa(403, 'turnstile recusou o token');

  /*
   * Sem token, a régua endurece em vez de fechar — ver `TEMPO_MINIMO_SEM_TOKEN`.
   * Quem chega aqui sem token costuma ser gente com bloqueador de anúncio, e
   * mandar essa pessoa embora custa mais do que engolir um spam.
   */
  const semToken = captcha === 'ausente';
  if (semToken && prova.levou < TEMPO_MINIMO_SEM_TOKEN) {
    return recusa(429, 'sem token e rapido demais');
  }

  // 3 — a rajada, com o limite que o veredito do captcha determinou.
  const limite = semToken ? LIMITE_POR_IP_SEM_TOKEN : LIMITE_POR_IP;
  if (impressao && (await passouDoLimite(impressao, limite))) return recusa(429, 'limite por ip');

  /**
   * Insere, e sobrevive a um banco que ainda não tem as colunas mais novas.
   *
   * O endpoint NÃO pode depender de uma migração para funcionar: se ele subir
   * antes de o `alter table` ser rodado — e essa é exatamente a ordem segura,
   * porque o contrário derruba o formulário —, o PostgREST recusa a linha
   * INTEIRA por causa de uma coluna que ele não conhece.
   *
   * Então tenta com tudo, e vai tirando a coluna que o banco citar, uma por vez,
   * até a linha entrar. O lead nunca se perde por causa de uma migração
   * atrasada: o que se perde é o campo, e só até o `alter table` rodar.
   *
   * A lista é só das colunas DISPENSÁVEIS. Nome e WhatsApp não estão aqui — se
   * o banco recusar um deles, é defeito de verdade e tem de aparecer como erro,
   * não virar um lead pela metade gravado em silêncio.
   */
  const DISPENSAVEIS = ['ip_hash', 'objetivo'] as const;
  const inserir = (corpoDoLead: unknown) =>
    fetch(`${URL_BASE}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: CHAVE_DE_ESCRITA,
        Authorization: `Bearer ${CHAVE_DE_ESCRITA}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(corpoDoLead),
    });

  const lead = corpo.lead as LeadNovo;
  const paraGravar: Record<string, unknown> = { ...lead, ip_hash: impressao };
  let resposta = await inserir(paraGravar);

  while (!resposta.ok) {
    /* O corpo do erro do PostgREST cita nome de coluna e constraint — mapa do
       banco para quem estiver sondando. Nunca volta para quem chamou. */
    const texto = await resposta.text();
    const culpada = DISPENSAVEIS.find((c) => c in paraGravar && texto.includes(c));
    if (culpada == null) {
      console.error('falha ao gravar lead', resposta.status, texto);
      return recusa(502, 'banco recusou');
    }
    console.warn(`sem a coluna ${culpada} — rode o alter table de supabase/schema.sql`);
    delete paraGravar[culpada];
    // Termina sempre: cada volta apaga uma chave de uma lista finita.
    resposta = await inserir(paraGravar);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
}
