import type { Pagina } from '../../tipos';

/**
 * "Legendado" é palavra da entrega da Doxa (`HowItWorks.tsx:92`), e não havia
 * verbete que explicasse o que ela significa tecnicamente. Este define a
 * legenda EMBUTIDA e a separa da legenda de sistema — distinção que muda
 * acessibilidade e reaproveitamento, e que quase nenhuma página do assunto faz.
 *
 * Cuidado deliberado: NÃO se afirma aqui que "boa parte do consumo é sem som".
 * Esse número não tem fonte no projeto e a régua de copy proíbe estatística de
 * terceiro sem fonte nomeada. O argumento é escrito como situação ("há
 * situações em que ligar o som não é opção"), que é verificável por qualquer
 * leitor.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · o vídeo entregue é vertical, legendado, no formato do feed →
 *    `docs/seo/source-of-truth.md` §2, fonte: `src/components/HowItWorks.tsx:92`;
 *    `public/llms.txt:25-26`;
 *  · "legendado" é complemento aceito porque já publicado → §10.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'legenda-embutida',
  titulo: 'Legenda embutida: o texto que fica gravado na imagem',
  descricao:
    'Legenda embutida é o texto queimado nos quadros do vídeo, que não se desliga. Como ela difere da legenda automática e o que cada uma resolve.',
  h1: 'Legenda embutida',
  resumo:
    'Diferente da legenda que a plataforma gera por cima, que o espectador pode ativar ou não.',
  intencao: 'informacional',
  palavrasChave: [
    'legenda embutida',
    'legenda queimada no vídeo',
    'vídeo legendado',
    'legenda automática ou embutida',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/glossario/short-form',
    '/glossario/retencao',
    '/solucoes/videos-curtos-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Legenda embutida é o texto gravado dentro dos quadros do vídeo, na exportação, e que por isso aparece sempre — em qualquer rede, sem depender de o espectador ativar nada. Ela também não pode ser desligada por quem assiste, e essa é a diferença que importa.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A outra legenda: a que a plataforma gera',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A legenda automática é uma camada separada, transcrita pela rede a partir do áudio e exibida por cima do vídeo. Ela liga e desliga, e costuma errar nome próprio, termo técnico e palavra estrangeira. As duas podem coexistir — e coexistem mal: dois blocos de texto no mesmo espaço da tela.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que a embutida é comum em vídeo vertical',
    },
    {
      tipo: 'lista',
      itens: [
        'Há muitas situações em que ligar o som não é opção: transporte, fila, sala de espera, escritório. Sem texto na tela, o vídeo comunica pouco ali.',
        'Ela sobrevive ao reaproveitamento: o mesmo arquivo publicado em outra rede continua legendado.',
        'O texto sincronizado dá ao olho o que acompanhar, e isso costuma ajudar a segurar quem assiste — assunto de [retenção](/glossario/retencao).',
        'O controle é de quem produz: fonte, posição, quebra de linha e destaque são decisões suas, não da transcrição automática.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Um ponto de acessibilidade que costuma passar batido: legenda embutida é imagem, e leitor de tela não lê imagem. Ela ajuda quem tem perda auditiva e assiste à tela, mas não substitui a legenda de sistema para quem usa tecnologia assistiva. Onde a rede permitir, vale ter as duas.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O erro de posição',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Posicionar a legenda onde a interface do aplicativo passa por cima. Cada rede reserva as bordas do vídeo para botões, nome do perfil e descrição, e a legenda encostada no rodapé some atrás disso. A margem segura fica no miolo da tela — confira num celular antes de repetir o formato em sessenta peças.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É por isso que "legendado" está na descrição do que a Doxa entrega: o arquivo chega vertical, legendado e no formato do feed, pronto para postar.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. O fato da Doxa tem entrada no source of truth (§2 e §10), com a
 *          redação publicada: "vertical, legendado, no formato do feed".
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: o termo técnico da entrega. `short-form` define o
 *          formato; `retenção` mede o efeito.
 * [x]  7. Incremental: a distinção embutida × automática, a ressalva de
 *          acessibilidade (leitor de tela não lê imagem) e a margem segura.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo do verbete.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "legendado", "vertical", "no formato do feed",
 *          "pronto para postar".
 * [x] 14. Publicaria sem Google: sim — a ressalva do leitor de tela e a da
 *          margem segura evitam refazer um lote inteiro de vídeos.
 * ────────────────────────────────────────────────────────────────────────── */
