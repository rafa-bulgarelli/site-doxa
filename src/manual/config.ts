/**
 * ─── ONDE O MANUAL MORA ──────────────────────────────────────────────────────
 *
 * A rota-base do manual interativo, num lugar só. Tudo que monta caminho — o
 * roteador, os links que a API devolve, o botão de voltar — parte daqui, e é o
 * que faz da mudança de endereço uma linha em vez de uma caça ao grep.
 *
 * O valor é o combinado com o dono; o `vercel.json` já reescreve qualquer
 * caminho sem extensão para o `index.html`, então nenhum ajuste de deploy
 * acompanha uma troca aqui.
 */
export const ROTA_BASE = '/manual-doxa';

/** O bucket privado dos PDFs de aceite. Criado em `supabase/manual.sql`. */
export const BUCKET_PDFS = 'manual-pdfs';
