/**
 * A régua que separa 400 explicável de 500 misterioso. O caso que motivou o
 * arquivo: nome de UM caractere passava por `textoOpcional`, batia no
 * `check … between 2 and 160` do banco e voltava como `falhou` — este teste
 * garante que a recusa acontece aqui, com nome de campo na mensagem.
 */
import { describe, expect, it } from 'vitest';
import { ErroHttp } from './http';
import { textoOpcional } from './validar';

describe('textoOpcional', () => {
  it('ausente e vazio são a mesma coisa: undefined', () => {
    expect(textoOpcional(null, 'nome', 160)).toBeUndefined();
    expect(textoOpcional(undefined, 'nome', 160)).toBeUndefined();
    expect(textoOpcional('', 'nome', 160)).toBeUndefined();
    expect(textoOpcional('   ', 'nome', 160)).toBeUndefined();
  });

  it('presente segue a régua do banco: mínimo 2', () => {
    expect(() => textoOpcional('A', 'nome', 160)).toThrowError(ErroHttp);
    try {
      textoOpcional('A', 'nome', 160);
    } catch (erro) {
      expect((erro as ErroHttp).status).toBe(400);
    }
  });

  it('texto válido volta aparado', () => {
    expect(textoOpcional('  Fulano de Tal  ', 'nome', 160)).toBe('Fulano de Tal');
  });

  it('acima do teto recusa', () => {
    expect(() => textoOpcional('x'.repeat(161), 'nome', 160)).toThrowError(ErroHttp);
  });
});
