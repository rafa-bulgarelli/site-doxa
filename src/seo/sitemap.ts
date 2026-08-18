import { urlAbsoluta } from './head';
import { paginas, secoes, urlDe } from './indice';
import { DOMINIO } from './site';

/**
 * O `sitemap.xml`, agora GERADO.
 *
 * Ele era um arquivo à mão em `public/`, com uma URL só, e isso funcionava
 * enquanto o site tinha uma URL só. Com páginas nascendo de arquivos de
 * conteúdo, o arquivo à mão vira a lista que alguém esquece de atualizar — e
 * sitemap incompleto é o item 39 do brief. Aqui a lista É o índice.
 */

/** A home. Sempre a primeira entrada, e a única escrita à mão. */
export const HOME = {
  loc: `${DOMINIO}/`,
  /**
   * `lastmod` é a data da última mudança de CONTEÚDO da página, não do último
   * deploy. Mexer em CSS, corrigir um bug ou publicar de novo não muda esta
   * linha — o buscador aprende a ignorar sitemaps cujo lastmod muda a cada
   * push. A constante veio do `public/sitemap.xml` que este módulo substituiu.
   */
  lastmod: '2026-08-10',
  changefreq: 'weekly',
  priority: '1.0',
};

export interface Entrada {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/** A maior data de um conjunto — o `lastmod` de um índice é o do membro mais novo. */
function maisRecente(datas: readonly string[]): string {
  if (datas.length === 0) throw new Error('Índice de seção sem página: não deveria ser gerado.');
  return [...datas].sort()[datas.length - 1];
}

/**
 * Todas as entradas, na ordem em que aparecem no XML: home, índices, páginas.
 *
 * `priority` não é ranking — o Google ignora o campo há anos. Ele fica porque
 * o arquivo anterior o tinha e porque outros rastreadores ainda o leem; os
 * números dizem a hierarquia do site, e nada mais.
 */
export function entradas(): readonly Entrada[] {
  const indices: Entrada[] = secoes().map((secao) => ({
    loc: urlAbsoluta(secao.url),
    lastmod: maisRecente(secao.paginas.map((pagina) => pagina.atualizadoEm)),
    changefreq: 'weekly',
    priority: '0.7',
  }));
  const folhas: Entrada[] = paginas().map((pagina) => ({
    loc: urlAbsoluta(urlDe(pagina)),
    lastmod: pagina.atualizadoEm,
    changefreq: 'monthly',
    priority: '0.8',
  }));
  return [HOME, ...indices, ...folhas];
}

const COMENTARIO = `
  O QUE ENTRA AQUI, e o que não entra.

  As âncoras da landing (\`#forms\`, \`#faq\`) não entram: sitemap lista
  documentos, e um fragmento não é um documento.

  \`/leads\` também não entra, de propósito. É a Central do time, atrás de senha,
  e um sitemap é onde se diz ao buscador "isto eu QUERO que apareça" — a tela
  interna não é isso. O \`robots.txt\` não a bloqueia, então ela segue rastreável
  se alguém apontar um link para lá; se um dia isso incomodar, a correção é uma
  linha \`Disallow: /leads\` no robots, e não uma ausência aqui.

  \`lastmod\` é a data da última mudança de CONTEÚDO da página, não do último
  deploy. Mexer em CSS, corrigir um bug ou publicar de novo não muda estas
  linhas — o buscador aprende a ignorar sitemaps cujo lastmod muda a cada push.

  ESTE ARQUIVO É GERADO por \`src/seo/sitemap.ts\` no \`pnpm build\`. Editar o
  que sai em \`dist/\` não sobrevive ao próximo build.
`;

/** O XML final. Sem dependência: são cinco tags e um `map`. */
export function sitemapXml(): string {
  const urls = entradas()
    .map(
      (entrada) =>
        `  <url>\n    <loc>${entrada.loc}</loc>\n    <lastmod>${entrada.lastmod}</lastmod>\n` +
        `    <changefreq>${entrada.changefreq}</changefreq>\n` +
        `    <priority>${entrada.priority}</priority>\n  </url>`,
    )
    .join('\n');
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!--${COMENTARIO}-->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
}
