/**
 * Testes de `auth.mjs` — a montagem e a assinatura do JWT.
 *
 * NENHUM teste aqui lê a chave real da service account. O par RSA é GERADO na
 * hora, em memória, com `generateKeyPairSync`: um teste que precisasse do
 * segredo do dono só rodaria na máquina dele, e um dia alguém "resolveria" isso
 * commitando uma fixture com uma chave dentro.
 */
import { describe, expect, it } from 'vitest';
import { generateKeyPairSync, verify } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';
import {
  ESCOPO_ESCRITA,
  ESCOPO_LEITURA,
  assinar,
  base64url,
  caminhoDaChave,
  lerChave,
  montarJwt,
} from './auth.mjs';

const EMAIL = 'torre-seo@doxa-506016.iam.gserviceaccount.com';
const AUDIENCIA = 'https://oauth2.googleapis.com/token';

/** @param {string} texto base64url */
function decodificar(texto) {
  return JSON.parse(Buffer.from(texto, 'base64url').toString('utf8'));
}

describe('base64url', () => {
  it('usa o alfabeto seguro para URL e tira o padding', () => {
    const saida = base64url(Buffer.from([0xfb, 0xff, 0xbf]));
    expect(saida).not.toMatch(/[+/=]/);
    expect(Buffer.from(saida, 'base64url')).toEqual(Buffer.from([0xfb, 0xff, 0xbf]));
  });
});

describe('montarJwt', () => {
  const agora = 1_760_000_000;

  it('assina RS256 no cabeçalho', () => {
    const { cabecalho } = montarJwt({ clientEmail: EMAIL, escopo: ESCOPO_LEITURA, audiencia: AUDIENCIA, agora });
    expect(decodificar(cabecalho)).toEqual({ alg: 'RS256', typ: 'JWT' });
  });

  it('põe iss/sub/scope/aud e exp = iat + 3600', () => {
    const { corpo } = montarJwt({ clientEmail: EMAIL, escopo: ESCOPO_LEITURA, audiencia: AUDIENCIA, agora });
    const claims = decodificar(corpo);
    expect(claims.iss).toBe(EMAIL);
    expect(claims.sub).toBe(EMAIL);
    expect(claims.scope).toBe(ESCOPO_LEITURA);
    expect(claims.aud).toBe(AUDIENCIA);
    expect(claims.iat).toBe(agora);
    expect(claims.exp).toBe(agora + 3600);
  });

  it('carrega o escopo de ESCRITA quando é ele que se pede', () => {
    const { corpo } = montarJwt({ clientEmail: EMAIL, escopo: ESCOPO_ESCRITA, audiencia: AUDIENCIA, agora });
    expect(decodificar(corpo).scope).toBe(ESCOPO_ESCRITA);
    // As duas URLs são diferentes de verdade — uma trocada pela outra daria 403
    // no PUT do sitemap, e o erro só apareceria em produção.
    expect(ESCOPO_ESCRITA).not.toBe(ESCOPO_LEITURA);
  });

  it('mensagem é `cabecalho.corpo`', () => {
    const jwt = montarJwt({ clientEmail: EMAIL, escopo: ESCOPO_LEITURA, audiencia: AUDIENCIA, agora });
    expect(jwt.mensagem).toBe(`${jwt.cabecalho}.${jwt.corpo}`);
  });

  it('recusa parâmetro faltando em vez de montar um JWT inválido', () => {
    expect(() => montarJwt({ clientEmail: EMAIL, escopo: ESCOPO_LEITURA, audiencia: '' })).toThrow(
      /montarJwt exige/,
    );
  });
});

describe('assinar', () => {
  it('produz assinatura RSA-SHA256 que `crypto.verify` aceita', () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const { mensagem } = montarJwt({
      clientEmail: EMAIL,
      escopo: ESCOPO_LEITURA,
      audiencia: AUDIENCIA,
      agora: 1_760_000_000,
    });

    const assinatura = assinar(mensagem, privateKey.export({ type: 'pkcs8', format: 'pem' }));

    expect(assinatura).not.toMatch(/[+/=]/);
    expect(
      verify('RSA-SHA256', Buffer.from(mensagem, 'utf8'), publicKey, Buffer.from(assinatura, 'base64url')),
    ).toBe(true);
  });

  it('recusa assinatura de outra mensagem', () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
    const assinatura = assinar('mensagem.original', pem);

    expect(
      verify('RSA-SHA256', Buffer.from('mensagem.adulterada', 'utf8'), publicKey, Buffer.from(assinatura, 'base64url')),
    ).toBe(false);
  });
});

describe('caminhoDaChave', () => {
  it('respeita GSC_KEY_PATH', () => {
    const anterior = process.env.GSC_KEY_PATH;
    process.env.GSC_KEY_PATH = '/tmp/uma-chave-de-mentira.json';
    try {
      expect(caminhoDaChave()).toBe('/tmp/uma-chave-de-mentira.json');
    } finally {
      if (anterior === undefined) {
        delete process.env.GSC_KEY_PATH;
      } else {
        process.env.GSC_KEY_PATH = anterior;
      }
    }
  });

  it('cai no default sob o home do usuário, com `homedir()` e não `~` literal', () => {
    const anterior = process.env.GSC_KEY_PATH;
    delete process.env.GSC_KEY_PATH;
    try {
      expect(caminhoDaChave()).toBe(join(homedir(), '.config', 'doxa', 'gsc-service-account.json'));
      expect(caminhoDaChave()).not.toContain('~');
    } finally {
      if (anterior !== undefined) {
        process.env.GSC_KEY_PATH = anterior;
      }
    }
  });
});

describe('lerChave', () => {
  it('erra citando o CAMINHO quando o arquivo não existe', () => {
    let capturado;
    try {
      lerChave('/nao/existe/gsc-service-account.json');
    } catch (erro) {
      capturado = erro;
    }
    expect(capturado).toBeInstanceOf(Error);
    expect(capturado.message).toContain('/nao/existe/gsc-service-account.json');
    // A mensagem orienta, e não vaza: nada de conteúdo de arquivo nela.
    expect(capturado.message).toContain('GSC_KEY_PATH');
  });
});
