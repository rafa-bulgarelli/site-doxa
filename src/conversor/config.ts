/**
 * ─── OS NÚMEROS E OS NOMES DO CONVERSOR ──────────────────────────────────────
 *
 * O que a página, a função em `api/` e o provedor precisam concordar palavra por
 * palavra: o endereço da rota, o teto do arquivo, os dois MIME que existem e o
 * nome do campo do formulário. Um valor destes escrito duas vezes é um defeito
 * que só aparece em produção — a página manda `arquivo`, o servidor procura
 * `file`, e o erro que chega ao usuário é "tipo não aceito".
 *
 * Este arquivo compila TAMBÉM no projeto da API (`tsconfig.api.json`), que roda
 * na borda da Vercel: nada de DOM, nada de React, nada de `import` de peça de
 * navegador aqui dentro.
 */

/**
 * Onde o conversor mora.
 *
 * O `vercel.json` já reescreve qualquer caminho sem extensão para o
 * `index.html`, então trocar este valor não pede ajuste de deploy — só o
 * `switch` do `App`, que lê daqui.
 */
export const ROTA_BASE = '/conversor';

/**
 * O teto do arquivo, validado nas DUAS pontas.
 *
 * O fluxo passa pela função serverless (o arquivo sobe para nós e nós subimos
 * para o provedor), e o corpo de uma função da Vercel tem limite próprio — 4 MB
 * é o número que cabe com folga nos dois lados. O contrato de teste do dono tem
 * 29 KB; um contrato grande, com imagens, raramente passa de 2 MB.
 *
 * A página checa antes de subir para não gastar o upload de quem já vai ser
 * recusado; o servidor checa de novo porque a checagem do navegador é uma
 * gentileza, não uma garantia.
 */
export const TAMANHO_MAXIMO_BYTES = 4 * 1024 * 1024;

/** O MIME que o navegador manda num PDF. */
export const MIME_PDF = 'application/pdf';

/**
 * O MIME do `.docx` — o do Office moderno, não o do `.doc` antigo
 * (`application/msword`), que é outro formato e o provedor recusa.
 */
export const MIME_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** O campo do `multipart/form-data`. A página escreve, o servidor procura. */
export const CAMPO_ARQUIVO = 'arquivo';

export const EXTENSAO_PDF = '.pdf';
export const EXTENSAO_DOCX = '.docx';

/**
 * O que o seletor de arquivo oferece e o que o servidor aceita.
 *
 * A extensão é conferida ALÉM do MIME porque o navegador nem sempre acerta o
 * tipo — em algumas máquinas um `.docx` chega como
 * `application/octet-stream`, e recusá-lo por causa disso seria negar um
 * arquivo perfeitamente válido.
 */
export const EXTENSOES_ACEITAS: readonly string[] = [EXTENSAO_PDF, EXTENSAO_DOCX];
