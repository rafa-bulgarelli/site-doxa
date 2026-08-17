/**
 * ─── O CONTRATO DO CONVERSOR ─────────────────────────────────────────────────
 *
 * A fronteira entre a página (`src/conversor/*`) e a função em `api/conversor`.
 * As duas pontas são escritas em paralelo, por gente diferente, e só se
 * encontram porque olham para os tipos daqui.
 *
 * A API é UMA rota e tem forma fixa, decidida antes de qualquer linha:
 *
 *   POST /api/conversor
 *   Authorization: Bearer <token da sessão Supabase>
 *   corpo: multipart/form-data, campo `arquivo` (ver `config.ts`)
 *
 *   sucesso → 200 com o BINÁRIO do documento convertido, `Content-Type` do
 *             formato de saída e `Content-Disposition: attachment; filename=…`
 *   erro    → JSON `{ erro: CodigoDeErro }`, no status listado em cada código
 *
 * Este arquivo compila também no projeto da API (`tsconfig.api.json`): nada de
 * DOM, nada de React.
 */

/**
 * O que este arquivo virou, e a única decisão que o servidor toma sozinho.
 *
 * Não é escolha do usuário — a direção sai do tipo do que ele subiu, porque a
 * pergunta "para qual formato?" só tem uma resposta possível e perguntá-la
 * seria um clique inventado.
 */
export type Direcao = 'pdf-para-docx' | 'docx-para-pdf';

/**
 * O motivo da recusa, num vocabulário fechado.
 *
 * Código, e não frase: o texto que a pessoa lê é da PÁGINA, que sabe o idioma e
 * o tom; o servidor manda o fato. O detalhe de verdade (resposta do provedor,
 * stack) fica no log, nunca na resposta — é o mesmo desenho do manual e da
 * Central.
 *
 *   sem_sessao            401 — veio sem `Authorization`
 *   sessao_invalida       401 — token expirado ou de outra conta
 *   tipo_nao_aceito       415 — não é PDF nem DOCX
 *   arquivo_grande        413 — passou de `TAMANHO_MAXIMO_BYTES`
 *   conversao_falhou      502 — o provedor respondeu, e respondeu que não deu
 *   conversao_demorou     504 — o provedor aceitou e não terminou a tempo
 *   provedor_indisponivel 502 — não foi possível falar com o provedor
 */
export type CodigoDeErro =
  | 'sem_sessao'
  | 'sessao_invalida'
  | 'tipo_nao_aceito'
  | 'arquivo_grande'
  | 'conversao_falhou'
  | 'conversao_demorou'
  | 'provedor_indisponivel';

/** O corpo de TODA resposta de erro da rota. Um campo, e só ele. */
export interface RespostaErro {
  erro: CodigoDeErro;
}
