/**
 * Testes de `api.mjs` — só a parte PURA: codificação do `siteUrl` e a escolha
 * da propriedade. Nada aqui toca a rede nem a chave.
 *
 * `escolherPropriedade` é onde um engano custa caro e silencioso: escolher a
 * propriedade errada não dá erro, dá NÚMERO ERRADO num relatório de SEO. Daí
 * cobrir os quatro ramos.
 */
import { describe, expect, it } from 'vitest';
import {
  DOMINIO_DA_DOXA,
  SITEMAP_DA_DOXA,
  codificarSiteUrl,
  escolherPropriedade,
} from './api.mjs';

describe('codificarSiteUrl', () => {
  it('escapa os dois pontos da propriedade de Domínio', () => {
    expect(codificarSiteUrl('sc-domain:doxaviral.com')).toBe('sc-domain%3Adoxaviral.com');
  });

  it('escapa as barras do prefixo de URL — senão viram segmentos de caminho e a API dá 404', () => {
    expect(codificarSiteUrl('https://www.doxaviral.com/')).toBe(
      'https%3A%2F%2Fwww.doxaviral.com%2F',
    );
  });
});

describe('escolherPropriedade', () => {
  const dominio = { siteUrl: 'sc-domain:doxaviral.com', permissionLevel: 'siteOwner' };
  const prefixo = { siteUrl: 'https://www.doxaviral.com/', permissionLevel: 'siteFullUser' };
  const alheia = { siteUrl: 'sc-domain:outrocliente.com.br', permissionLevel: 'siteFullUser' };

  it('obedece a preferida quando ela está na lista', () => {
    expect(escolherPropriedade([dominio, prefixo], 'https://www.doxaviral.com/')).toBe(
      'https://www.doxaviral.com/',
    );
  });

  it('erra alto quando a preferida NÃO está na lista, listando o que veio', () => {
    expect(() => escolherPropriedade([dominio], 'https://www.doxaviral.com/')).toThrow(
      /GSC_SITE_URL=https:\/\/www\.doxaviral\.com\/.*sc-domain:doxaviral\.com/s,
    );
  });

  it('sem preferida, prefere a de Domínio — ela cobre www e não-www, http e https', () => {
    expect(escolherPropriedade([prefixo, alheia, dominio])).toBe('sc-domain:doxaviral.com');
  });

  it('sem propriedade de Domínio, aceita o prefixo da Doxa', () => {
    expect(escolherPropriedade([alheia, prefixo])).toBe('https://www.doxaviral.com/');
  });

  it('nenhuma da Doxa → erro com os siteUrl e o e-mail a conferir no painel', () => {
    let capturado;
    try {
      escolherPropriedade([alheia]);
    } catch (erro) {
      capturado = erro;
    }
    expect(capturado).toBeInstanceOf(Error);
    expect(capturado.message).toContain('sc-domain:outrocliente.com.br');
    expect(capturado.message).toContain('torre-seo@doxa-506016.iam.gserviceaccount.com');
  });

  it('lista vazia → erro dizendo "(nenhuma)", não um undefined silencioso', () => {
    expect(() => escolherPropriedade([])).toThrow(/\(nenhuma\)/);
  });

  it('não confunde doxavira.com (sem L) com o nosso domínio', () => {
    // Os dois domínios existem e só um é o site. Um `includes` frouxo aceitaria
    // o errado; a asserção fixa o comportamento antes que alguém o afrouxe.
    expect(() => escolherPropriedade([{ siteUrl: 'sc-domain:doxavira.com' }])).toThrow();
  });
});

describe('constantes', () => {
  it('o sitemap e o domínio são os do site com L', () => {
    expect(DOMINIO_DA_DOXA).toBe('doxaviral.com');
    expect(SITEMAP_DA_DOXA).toBe('https://www.doxaviral.com/sitemap.xml');
  });
});
