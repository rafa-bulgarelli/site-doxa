/**
 * Conteúdo do dono da seção comparativa. Tudo que é número ou texto de negócio
 * mora aqui — o resto dos arquivos só sabe desenhar.
 */

/**
 * As etapas do jeito antigo. O COMPRIMENTO é o argumento da seção: mexer na
 * quantidade muda a força do bloco, não só o texto.
 */
export const STEPS = [
  'Briefing',
  'Roteiro',
  'Aprovação',
  'Agenda',
  'Estúdio',
  'Filmmaker',
  'Captação',
  'Edição',
  'Publicação',
] as const;

/** Custo mensal do jeito antigo — produção, agência e tráfego somados. */
export const CUSTO_SEM = 'R$ 10.500';

/** Tempo até o primeiro vídeo pelo jeito antigo. */
export const PRAZO_SEM = '18 dias';

/*
 * A quebra do total entre produção / agência / tráfego pago é SUPOSIÇÃO — o
 * dono passou só o valor somado. Fica fora da tela até ele validar: número
 * inventado num comparativo destrói a credibilidade da seção inteira.
 *
 * export const LINHAS_CUSTO = [
 *   { label: 'Produção', valor: 'R$ 0.000' },
 *   { label: 'Agência', valor: 'R$ 0.000' },
 *   { label: 'Tráfego pago', valor: 'R$ 0.000' },
 * ];
 */

/**
 * Destino do CTA. Vazio de propósito enquanto o dono não define (Calendly,
 * WhatsApp ou formulário). Enquanto estiver vazio o botão não navega e a seção
 * mostra o aviso — melhor do que um `href="#"`, que parece pronto e não é.
 */
export const CONTATO_URL = '';
