import { describe, expect, it } from 'vitest';
import { cabeca, tipoOg, urlAbsoluta } from './head';
import { DOMINIO, OG_IMAGEM } from './site';

describe('urlAbsoluta', () => {
  it('prefixa o domínio', () => {
    expect(urlAbsoluta('/solucoes/x')).toBe(`${DOMINIO}/solucoes/x`);
  });

  // A forma canônica é sem barra final; com `trailingSlash: false` no
  // `vercel.json`, a Vercel responde 308 na versão com barra. Canonical
  // apontando para a URL que redireciona é o caso clássico de canonical errado.
  it('remove a barra final', () => {
    expect(urlAbsoluta('/solucoes/x/')).toBe(`${DOMINIO}/solucoes/x`);
  });

  it('exige caminho interno', () => {
    expect(() => urlAbsoluta('solucoes/x')).toThrow(/começar com/);
  });
});

describe('tipoOg', () => {
  it('trata prateleira como website e texto como article', () => {
    expect(tipoOg('solucao')).toBe('website');
    expect(tipoOg('plataforma')).toBe('website');
    expect(tipoOg('hub')).toBe('website');
    expect(tipoOg('indice')).toBe('website');
    expect(tipoOg('guia')).toBe('article');
    expect(tipoOg('dor')).toBe('article');
    expect(tipoOg('comparativo')).toBe('article');
    expect(tipoOg('glossario')).toBe('article');
  });
});

describe('cabeca', () => {
  const feita = cabeca({
    url: '/solucoes/exemplo',
    titulo: 'Um título',
    descricao: 'Uma descrição.',
    tipo: 'solucao',
  });

  it('devolve title e canonical absoluto', () => {
    expect(feita.titulo).toBe('Um título');
    expect(feita.canonical).toBe(`${DOMINIO}/solucoes/exemplo`);
  });

  it('emite description, og e twitter uma vez cada', () => {
    const chaves = feita.metas.map((meta) => meta.chave);
    expect(chaves).toContain('description');
    expect(chaves).toContain('og:url');
    expect(chaves).toContain('og:site_name');
    expect(chaves).toContain('twitter:card');
    expect(new Set(chaves).size).toBe(chaves.length);
  });

  it('usa `property` para og e `name` para o resto', () => {
    for (const meta of feita.metas) {
      expect(meta.atributo).toBe(meta.chave.startsWith('og:') ? 'property' : 'name');
    }
  });

  it('og:url é igual ao canonical', () => {
    const ogUrl = feita.metas.find((meta) => meta.chave === 'og:url');
    expect(ogUrl?.conteudo).toBe(feita.canonical);
  });

  // Enquanto `OG_IMAGEM` for null a tag não sai: uma `og:image` apontando para
  // arquivo inexistente rende um cartão quebrado no WhatsApp, que é pior do que
  // o cartão sem imagem.
  it('só emite og:image quando existe imagem', () => {
    const temImagem = feita.metas.some((meta) => meta.chave === 'og:image');
    expect(temImagem).toBe(OG_IMAGEM != null);
  });
});
