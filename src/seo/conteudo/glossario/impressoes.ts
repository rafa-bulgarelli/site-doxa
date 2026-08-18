import type { Pagina } from '../../tipos';

/**
 * O par de `/glossario/alcance-organico`. Aquele verbete é escrito do lado de
 * QUEM VIU (pessoas) e já tem o bloco "alcance não é o mesmo que impressões";
 * este é escrito do lado da EXIBIÇÃO e não repete aquele bloco: ele resolve a
 * confusão vizinha, que é impressão contra visualização em vídeo, e apresenta
 * a frequência (impressões por pessoa), que é a leitura útil do número.
 *
 * Sem fato da Doxa e sem estatística de terceiro: é definição de métrica.
 * Nenhum número de referência ("uma boa frequência é X") aparece aqui — não há
 * fonte para isso no projeto.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'impressoes',
  titulo: 'Impressões: o que a métrica conta e o que ela não prova',
  descricao:
    'Impressões contam quantas vezes um conteúdo apareceu na tela, repetições incluídas. Como elas diferem de visualizações e o que a frequência revela.',
  h1: 'Impressões',
  resumo:
    'Impressões é o número de vezes que um conteúdo apareceu na tela de alguém, contando as repetições da mesma pessoa. Costuma ser o maior número do painel e o que menos diz sozinho — porque ele mede exibição, não interesse.',
  intencao: 'informacional',
  palavrasChave: [
    'impressões',
    'o que são impressões',
    'impressões ou visualizações',
    'frequência de impressões',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/glossario/alcance-organico',
    '/glossario/engajamento',
    '/glossario/watch-time',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Impressões é a contagem de quantas vezes um conteúdo foi exibido na tela de alguém — inclusive quando foi a mesma pessoa, várias vezes, no mesmo dia. A palavra que faz o trabalho na definição é **vezes**: impressão conta aparições, e não gente.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Impressão não é visualização',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Em vídeo, a confusão cara é esta. Impressão é o vídeo ter aparecido; visualização é ele ter começado a rodar e cumprido o critério de tempo que aquela plataforma usa para contar uma reprodução. O mesmo vídeo pode acumular muitas impressões e poucas visualizações, e isso tem um nome concreto: a capa e os primeiros instantes não convenceram ninguém a parar. É um diagnóstico mais útil do que o total de impressões jamais será.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A leitura que o número permite: frequência',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Dividir impressões por [alcance](/glossario/alcance-organico) dá a frequência: quantas vezes, em média, cada pessoa viu aquilo. Uma frequência próxima de 1 significa que o conteúdo se espalhou para gente nova. Uma frequência alta significa que ele circulou repetidamente entre as mesmas pessoas — o que pode ser bom, quando a intenção é fixar uma mensagem, e ruim quando a intenção era crescer.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que o número engana em relatório',
    },
    {
      tipo: 'lista',
      itens: [
        'Costuma ser o maior número disponível, e por isso o mais tentador de pôr no slide.',
        'Ele sobe quando o mesmo público vê mais vezes, sem que ninguém novo tenha sido alcançado.',
        'Ele não distingue quem parou para assistir de quem passou o dedo — essa distinção é do [watch time](/glossario/watch-time).',
        'Cada plataforma define exibição do seu jeito, então somar impressões de redes diferentes produz um total que não corresponde a nada.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A pergunta que transforma impressões em informação é sempre a mesma: quantas pessoas isso representa, e quantas vezes cada uma? Sem o alcance ao lado, o número sozinho não sustenta nenhuma decisão.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A métrica que conta pessoas, e não exibições, está em [alcance orgânico](/glossario/alcance-organico); a que conta as ações de quem viu está em [engajamento](/glossario/engajamento).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Nenhum fato sobre a Doxa nesta página.
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: a EXIBIÇÃO. O verbete de alcance conta pessoas e
 *          já é dono do bloco "alcance × impressões"; aqui o par comparado é
 *          impressão × visualização, e a leitura nova é a frequência.
 * [x]  7. Incremental: frequência como divisão, e o diagnóstico de muitas
 *          impressões com poucas visualizações.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-organico` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo do verbete.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário coerente com o do repositório.
 * [x] 14. Publicaria sem Google: sim — a conta da frequência está de graça no
 *          painel de qualquer perfil e quase ninguém a faz.
 * ────────────────────────────────────────────────────────────────────────── */
