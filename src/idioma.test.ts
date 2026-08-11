import { describe, expect, it } from 'vitest';
import { numeroNoIdioma } from './idioma';

/**
 * O contrato: em inglês os separadores trocam de papel e NENHUM dígito muda.
 * "1.500" lido por um americano é um e meio — a troca é o que mantém o valor.
 */
describe('numeroNoIdioma', () => {
  it('troca os separadores para o inglês', () => {
    expect(numeroNoIdioma('1.500', 'en')).toBe('1,500');
    expect(numeroNoIdioma('3,4M', 'en')).toBe('3.4M');
    expect(numeroNoIdioma('+8,7k', 'en')).toBe('+8.7k');
    expect(numeroNoIdioma('1.043', 'en')).toBe('1,043');
    expect(numeroNoIdioma('+111k', 'en')).toBe('+111k');
  });

  it('não toca no português nem no espanhol', () => {
    expect(numeroNoIdioma('1.500', 'pt')).toBe('1.500');
    expect(numeroNoIdioma('3,4M', 'es')).toBe('3,4M');
  });
});
