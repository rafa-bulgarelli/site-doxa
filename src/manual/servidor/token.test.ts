/**
 * ─── OS TESTES DO TOKEN ──────────────────────────────────────────────────────
 *
 * O token é a única credencial do cliente. O que estes testes protegem não é o
 * formato bonito: é a distância entre "adivinhável" e "impossível", e a regra
 * de que o token cru NUNCA vira a chave de busca no banco.
 */
import { describe, expect, it } from 'vitest';
import { sha256Hex } from './hash';
import { gerarToken, hashDoToken, pareceToken } from './token';

describe('gerarToken', () => {
  it('sai em base64url, com os 43 caracteres de 32 bytes', () => {
    const token = gerarToken();
    expect(token).toHaveLength(43);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('não traz caractere que a URL precise escapar', () => {
    const juntos = Array.from({ length: 200 }, () => gerarToken()).join('');
    expect(juntos).not.toMatch(/[+/=]/);
  });

  it('não repete — mil sorteios, mil tokens', () => {
    const sorteados = new Set(Array.from({ length: 1000 }, () => gerarToken()));
    expect(sorteados.size).toBe(1000);
  });

  it('usa o alfabeto inteiro, e não um pedaço dele', () => {
    // Um base64url quebrado costuma travar num naco do alfabeto (só as letras,
    // ou nada de '-' e '_'). Vinte mil caracteres cobrem os 64 com folga.
    const letras = new Set(Array.from({ length: 500 }, () => gerarToken()).join(''));
    expect(letras.size).toBe(64);
  });
});

describe('hashDoToken', () => {
  it('é o SHA-256 hex de 64 — o tamanho que a coluna exige', async () => {
    const hash = await hashDoToken(gerarToken());
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('é o mesmo hash para o mesmo token, e outro para outro', async () => {
    const token = gerarToken();
    expect(await hashDoToken(token)).toBe(await hashDoToken(token));
    expect(await hashDoToken(token)).not.toBe(await hashDoToken(gerarToken()));
  });

  it('bate com o SHA-256 conhecido — nada de sal escondido no caminho', async () => {
    // Se alguém um dia acrescentar um tempero aqui, o convite emitido antes da
    // mudança para de abrir. Este teste é o alarme.
    expect(await hashDoToken('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(await hashDoToken('abc')).toBe(await sha256Hex('abc'));
  });
});

describe('pareceToken', () => {
  it('aceita o que este módulo gera', () => {
    expect(pareceToken(gerarToken())).toBe(true);
  });

  it('recusa o que nem chega perto', () => {
    expect(pareceToken('')).toBe(false);
    expect(pareceToken('curto')).toBe(false);
    expect(pareceToken(null)).toBe(false);
    expect(pareceToken(42)).toBe(false);
    expect(pareceToken({ token: gerarToken() })).toBe(false);
  });

  it('recusa o que traria pontuação para dentro de um filtro do PostgREST', () => {
    expect(pareceToken(`${gerarToken()},or=(id.eq.1)`)).toBe(false);
    expect(pareceToken(`${gerarToken()}.`)).toBe(false);
    expect(pareceToken('a'.repeat(400))).toBe(false);
  });
});
