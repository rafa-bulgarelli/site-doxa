import { describe, expect, it } from 'vitest';
import { deveManterFragmento, tipoDeNavegacao } from './fragmento';

describe('tipoDeNavegacao', () => {
  it('lê o `type` da primeira entrada', () => {
    expect(tipoDeNavegacao([{ entryType: 'navigation', type: 'navigate' }])).toBe('navigate');
  });

  it('devolve undefined quando não há entrada', () => {
    expect(tipoDeNavegacao([])).toBeUndefined();
  });

  // Uma `PerformanceEntry` genérica não tem `type`. O navegador antigo entrega
  // uma dessas, e ela não pode virar a string "undefined" nem derrubar o boot.
  it('devolve undefined quando a entrada não tem `type` de string', () => {
    expect(tipoDeNavegacao([{ entryType: 'navigation' }])).toBeUndefined();
    expect(tipoDeNavegacao([{ entryType: 'navigation', type: 3 }])).toBeUndefined();
  });
});

describe('deveManterFragmento', () => {
  // O reload é o caso que originou a limpeza: quem recarregou com `#forms` na
  // barra estava trabalhando no formulário, não pedindo para voltar a ele.
  it('apaga no reload', () => {
    expect(deveManterFragmento('reload', '#forms')).toBe(false);
  });

  it('apaga no voltar/avançar', () => {
    expect(deveManterFragmento('back_forward', '#faq')).toBe(false);
    expect(deveManterFragmento('back_forward', '#forms')).toBe(false);
  });

  // O caso que esta função existe para permitir: o botão "Falar com a Doxa" de
  // uma página de conteúdo, ou o link colado no WhatsApp.
  it('mantém numa navegação nova', () => {
    expect(deveManterFragmento('navigate', '#forms')).toBe(true);
  });

  it('apaga quando o navegador não sabe dizer', () => {
    expect(deveManterFragmento(undefined, '#forms')).toBe(false);
  });

  it('não tem o que manter sem fragmento', () => {
    expect(deveManterFragmento('navigate', '')).toBe(false);
  });

  /**
   * A âncora que NINGUÉM honra não sobrevive.
   *
   * `#faq` chega aqui de verdade — é o link "Perguntas" do rodapé de toda
   * página SEO. Só que o seguro de montagem do `App.tsx` existe para `#forms` e
   * para mais nada, e o FAQ da landing é `lazy`: preservado, o fragmento
   * dependeria de o navegador reencontrar a âncora antes do `load`, o que é uma
   * corrida com a rede. Melhor o defeito determinístico (abre no topo) do que o
   * que muda a cada visita.
   */
  it('apaga qualquer âncora que a landing não saiba honrar', () => {
    expect(deveManterFragmento('navigate', '#faq')).toBe(false);
    expect(deveManterFragmento('navigate', '#pedido')).toBe(false);
    expect(deveManterFragmento('navigate', '#qualquer-coisa')).toBe(false);
  });

  // `prerender` é uma página que o navegador abriu adiantado e depois ativou —
  // do ponto de vista de quem clicou, é uma navegação nova.
  it('trata prerender como navegação nova', () => {
    expect(deveManterFragmento('prerender', '#forms')).toBe(true);
  });
});
