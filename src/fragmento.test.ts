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

  // O segundo alvo honrado: o link "Perguntas" do rodapé de toda página SEO
  // aponta para `/#faq`, e o `App.tsx` agora espera as seções acima do FAQ
  // montarem antes de rolar até ele.
  it('mantém `#faq` numa navegação nova', () => {
    expect(deveManterFragmento('navigate', '#faq')).toBe(true);
  });

  // A mesma régua do `#forms` vale para ele: chegar é uma coisa, recarregar
  // dentro da seção é outra.
  it('apaga `#faq` no reload', () => {
    expect(deveManterFragmento('reload', '#faq')).toBe(false);
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
   * A lista de honrados é curta de propósito: só entra o fragmento para o qual
   * o `App.tsx` tem o seguro que espera a seção `lazy` montar e rola até ela.
   * `#pedido` é o exemplo vivo — ele EXISTE no documento (é o handle de medida
   * do cartão do formulário), e mesmo assim não passa daqui, porque ninguém o
   * honra na montagem. Preservado, ele dependeria de o navegador reencontrar a
   * âncora antes do `load`, que é uma corrida com a rede: numa visita salta,
   * na outra não. Melhor o defeito determinístico (abre no topo).
   */
  it('apaga qualquer âncora que a landing não saiba honrar', () => {
    expect(deveManterFragmento('navigate', '#pedido')).toBe(false);
    expect(deveManterFragmento('navigate', '#qualquer-coisa')).toBe(false);
  });

  // `prerender` é uma página que o navegador abriu adiantado e depois ativou —
  // do ponto de vista de quem clicou, é uma navegação nova. Vale para os dois
  // alvos honrados, e não só para o primeiro.
  it('trata prerender como navegação nova', () => {
    expect(deveManterFragmento('prerender', '#forms')).toBe(true);
    expect(deveManterFragmento('prerender', '#faq')).toBe(true);
  });
});
