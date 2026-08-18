import { describe, expect, it } from 'vitest';
import { linksDe, slugificar, tokens } from './inline';

describe('tokens', () => {
  it('devolve um único token de texto quando não há marcação', () => {
    expect(tokens('texto puro')).toEqual([{ tipo: 'texto', texto: 'texto puro' }]);
  });

  it('reconhece negrito no meio da frase', () => {
    expect(tokens('antes **meio** depois')).toEqual([
      { tipo: 'texto', texto: 'antes ' },
      { tipo: 'negrito', texto: 'meio' },
      { tipo: 'texto', texto: ' depois' },
    ]);
  });

  it('reconhece link interno e externo', () => {
    expect(tokens('veja [o guia](/guias/videos-curtos).')).toEqual([
      { tipo: 'texto', texto: 'veja ' },
      { tipo: 'link', href: '/guias/videos-curtos', texto: 'o guia' },
      { tipo: 'texto', texto: '.' },
    ]);
    expect(tokens('[fora](https://exemplo.com/x)')).toEqual([
      { tipo: 'link', href: 'https://exemplo.com/x', texto: 'fora' },
    ]);
  });

  it('aceita negrito e link no mesmo texto', () => {
    expect(tokens('**a** e [b](/guias)')).toEqual([
      { tipo: 'negrito', texto: 'a' },
      { tipo: 'texto', texto: ' e ' },
      { tipo: 'link', href: '/guias', texto: 'b' },
    ]);
  });

  // Negrito não fechado é sempre typo. Renderizar o asterisco esconderia o erro
  // numa página publicada; explodir aqui o mostra no build.
  it('explode com negrito não fechado', () => {
    expect(() => tokens('isto **não fecha')).toThrow(/Negrito não fechado/);
  });

  it('explode com href que não é interno nem https', () => {
    expect(() => tokens('[x](http://inseguro.com)')).toThrow(/Link inválido/);
    expect(() => tokens('[x](javascript:alert(1))')).toThrow(/Link inválido/);
  });

  it('não deixa HTML virar marcação — o texto sai literal', () => {
    expect(tokens('<script>alert(1)</script>')).toEqual([
      { tipo: 'texto', texto: '<script>alert(1)</script>' },
    ]);
  });
});

describe('linksDe', () => {
  it('lista todos os hrefs de um texto', () => {
    expect(linksDe('[a](/x) no meio [b](/y)')).toEqual(['/x', '/y']);
  });

  it('devolve lista vazia quando não há link', () => {
    expect(linksDe('**só negrito**')).toEqual([]);
  });
});

describe('slugificar', () => {
  it('remove acento, pontuação e caixa', () => {
    expect(slugificar('O que é produção de vídeos com IA')).toBe(
      'o-que-e-producao-de-videos-com-ia',
    );
  });

  it('não deixa hífen sobrando nas pontas', () => {
    expect(slugificar('— A garantia —')).toBe('a-garantia');
  });
});
