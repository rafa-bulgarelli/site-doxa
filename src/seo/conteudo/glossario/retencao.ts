import type { Pagina } from '../../tipos';

/**
 * Verbete: define retenção e ensina a LER a curva. O par é
 * `/glossario/watch-time`, que mede tempo absoluto; aqui a medida é
 * proporcional. As táticas ficam no guia de vídeos curtos.
 *
 * Sem fato da Doxa e sem estatística de terceiro.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'retencao',
  titulo: 'Retenção: o que a curva do seu vídeo está dizendo',
  descricao:
    'Retenção é a proporção de pessoas que continua assistindo em cada instante do vídeo. Como ler a curva e o que cada formato de queda costuma indicar.',
  h1: 'Retenção',
  resumo:
    'A métrica que mostra onde você perdeu gente, e não apenas quantas ficaram — o que faz dela a mais útil para consertar um vídeo.',
  intencao: 'informacional',
  palavrasChave: ['retenção de vídeo', 'taxa de retenção', 'curva de retenção'],
  hubs: ['/guias/videos-curtos'],
  relacionadas: ['/guias/videos-curtos', '/glossario/watch-time', '/glossario/hook'],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Retenção é a proporção de espectadores que continua assistindo em cada ponto do vídeo. Ela costuma ser exibida como uma curva que começa em 100% e desce: cada queda marca um instante em que um grupo de pessoas decidiu sair.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como ler a curva',
    },
    {
      tipo: 'lista',
      itens: [
        '**Queda violenta nos primeiros segundos:** o problema é a abertura. O assunto não ficou claro, ou não pareceu ser sobre quem estava assistindo. Trabalho de [hook](/glossario/hook).',
        '**Queda no meio, num ponto específico:** normalmente é uma transição, um trecho arrastado ou uma promessa que o vídeo não cumpriu. Vale assistir exatamente àquele segundo.',
        '**Descida suave e constante:** o vídeo é longo demais para o que tem a dizer. Cortar costuma resolver mais do que acrescentar.',
        '**Subida no fim ou acima de 100% em algum ponto:** parte das pessoas reassistiu. É o sinal mais forte que existe de que o conteúdo funcionou.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um exemplo hipotético',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Suponha um vídeo de 40 segundos que mantém 90% até o segundo 6 e cai para 45% no segundo 9 — números inventados para ilustrar a leitura, não a medição de ninguém. Não é problema de abertura: quem estava lá ficou até o sexto segundo. É problema do que acontece no nono — costuma ser uma frase de transição do tipo "mas antes de eu explicar, deixa eu me apresentar". Cortar a transição costuma recuperar a maior parte dessa queda.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que ela vale mais do que curtidas',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Curtida é uma ação opcional que uma minoria executa; ficar assistindo é o que toda pessoa que abriu o vídeo faz ou deixa de fazer. Por isso a retenção é o sinal mais denso disponível — e por isso ela costuma explicar, melhor que qualquer outra métrica, por que um vídeo foi entregue a muita gente e outro não.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A métrica vizinha é o [watch time](/glossario/watch-time), que mede tempo absoluto em vez de proporção. As duas juntas dizem quase tudo sobre um vídeo curto.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Nenhum fato sobre a Doxa nesta página.
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: a leitura da curva. Watch time tem verbete próprio.
 * [x]  7. Incremental: os quatro formatos de queda e o exemplo de 40 segundos.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário coerente.
 * [x] 14. Publicaria sem Google: sim — quase ninguém sabe ler a curva, e ela
 *          está de graça no painel de qualquer perfil.
 * ────────────────────────────────────────────────────────────────────────── */
