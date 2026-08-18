import type { Pagina } from '../../tipos';

/**
 * ADJACÊNCIA §47: o LinkedIn NÃO é uma das três redes da garantia, e a página
 * diz isso com todas as letras em vez de deixar a dúvida no ar. A marca aparece
 * em DOIS lugares, e só: o destaque `doxa` — que diz o que a meta cobre e o que
 * ela não cobre — e o `cta`. Dentro do destaque o nome é dito UMA vez; a
 * segunda oração fala em "a operação", que é vocabulário do dono (§10). O FAQ é deliberadamente sem marca: a pergunta
 * sobre a conta das views é respondida como conselho de leitura, sem repetir a
 * redação do contrato, porque repetir ali seria uma terceira menção e um
 * segundo enunciado da garantia na mesma página.
 *
 * Fronteira real com as vizinhas (medida, não afirmada):
 *  · `/guias/como-usar-o-mesmo-video-nas-tres-redes` é DONA da exportação:
 *    área segura, marca-d’água, capa, arquivo mestre e a leitura de três
 *    números não comparáveis. Aqui isso vira UMA frase com link, e o assunto
 *    próprio é o ENTORNO da peça (texto do post, público identificado, escolha
 *    de perfil) — nada disso existe naquela página;
 *  · `/guias/marketing-de-conteudo-para-b2b` é dona da decisão de ASSUNTO para
 *    comprador corporativo e já tem a FAQ "Devo publicar só no LinkedIn,
 *    então?". Esta página não repete a resposta nem faz FAQ equivalente: manda
 *    para lá e fica no formato;
 *  · `/guias/como-medir-resultado-de-conteudo-organico` é dona das métricas;
 *    aqui só entra o que é específico da rede fora da meta.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · as três redes em que a meta de views somadas é contada — Instagram,
 *    TikTok e YouTube Shorts → `docs/seo/source-of-truth.md` §2 e §3(c), fonte:
 *    `supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21`. O §2
 *    registra o cuidado de copy explícito: página nunca diz que a garantia
 *    cobre rede fora das três — daí a negação escrita;
 *  · "views somadas" e a ressalva "conforme as condições e o prazo do
 *    contrato" → §3(c), fonte: `supabase/manual-seed-v1.sql:84`;
 *  · o entregável é o arquivo pronto para postar, vertical e legendado, e quem
 *    publica é o cliente → §2, fonte: `src/components/HowItWorks.tsx:92`;
 *    `public/llms.txt:25-26`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * O que foi DEIXADO DE FORA de propósito:
 *  · a redação mais ampla do FAQ ("a estratégia pode envolver TikTok,
 *    Instagram, YouTube e outras redes relevantes",
 *    `src/components/faq/config.ts:392-393`). Ela é verdadeira e publicável,
 *    mas numa página cujo título é o nome de uma rede fora da garantia ela
 *    seria lida como oferta — que é exatamente o erro que a §47 evita;
 *  · qualquer estatística de LinkedIn: alcance, duração ideal, preferência por
 *    formato, comportamento de algoritmo. Não há fonte nomeada para nenhuma no
 *    repositório, e declaração de plataforma sem fonte não entra nem para
 *    afirmar nem para negar. O que a página diz sobre a rede é o que se observa
 *    abrindo o aplicativo — corte do texto com "ver mais", posts que chegam por
 *    comentário de quem está na rede, perfil e página como lugares distintos —
 *    e está escrito como observação, não como regra da plataforma.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'video-vertical-no-linkedin',
  titulo: 'Vídeo vertical no LinkedIn: o que muda fora do arquivo',
  descricao:
    'O mesmo arquivo vertical entra no LinkedIn sem nova edição. O que muda é o entorno: a primeira linha do post, o público identificado e a conta das views.',
  h1: 'Vídeo vertical no LinkedIn',
  resumo:
    'O arquivo é o mesmo. O vídeo vertical que você publica no TikTok, no Reels e no Shorts entra no feed profissional sem nenhuma edição nova — e o que precisa ser refeito é o que fica em volta dele: a primeira linha do texto do post, o que a peça pode dizer para uma audiência que assiste com nome e cargo à mostra, e o que fazer com um número que não se soma ao das outras redes.',
  intencao: 'informacional',
  palavrasChave: [
    'vídeo vertical no linkedin',
    'publicar vídeo no linkedin',
    'vídeo curto no linkedin',
    'reaproveitar vídeo no linkedin',
    'formato de vídeo para linkedin',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/como-usar-o-mesmo-video-nas-tres-redes',
    '/guias/marketing-de-conteudo-para-b2b',
    '/glossario/legenda-embutida',
    '/guias/como-medir-resultado-de-conteudo-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o gargalo não é onde publicar e sim ter peça suficiente para publicar, diga quantos vídeos por mês a sua operação precisa: a Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O arquivo é o mesmo; o entorno não',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um vídeo vertical exportado com cuidado sobe para o feed profissional sem nova edição: mesma proporção, mesma legenda gravada na imagem, mesmo áudio. Se a peça já sai do editor limpa — sem selo de outra plataforma e sem texto encostado nas bordas —, ela está pronta para mais um lugar, e o custo de publicar ali é o tempo de subir o arquivo. As regras de exportação que garantem isso estão em [como usar o mesmo vídeo nas três redes](/guias/como-usar-o-mesmo-video-nas-tres-redes) e valem inteiras aqui.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que não viaja junto com o arquivo é o entorno. Ali o vídeo chega acompanhado do seu texto, do seu cargo e do nome da sua empresa, e é esse conjunto que decide se alguém para de rolar. Três coisas mudam de verdade, e nenhuma delas está dentro do vídeo: a primeira linha do post, o que a peça pode dizer, e o que você faz com o número que aparece depois.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A primeira linha do post faz o trabalho da capa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O feed corta o texto do post depois de poucas linhas e esconde o resto atrás de um "ver mais". Isso é o que se observa abrindo o aplicativo, e tem uma consequência prática: a frase que sobra visível é a única parte do texto que não depende de um clique. Ela ocupa, ali, o lugar que a capa ocupa nas redes de recomendação — se ela não segura, o vídeo abaixo não chega a ser aberto.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Diga para quem é, logo no começo.** "Se você faz orçamento de obra" segura mais gente certa do que "hoje eu queria falar sobre orçamentos".',
        '**Adiante o conteúdo, não anuncie o vídeo.** "Assista ao vídeo abaixo" gasta a única linha garantida com uma instrução que ninguém pediu.',
        '**Uma frase, não um parágrafo.** O corte acontece cedo, e frase longa é frase interrompida no meio da ideia.',
        '**Reescreva a primeira linha, não o vídeo.** O arquivo sobe idêntico; o que muda é onde o corte do "ver mais" cai.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quem assiste tem nome, cargo e empresa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A diferença que mais mexe na edição não é técnica. Num feed profissional quem assiste está identificado, e você também. Dá para escrever falando com um cargo específico — quem cuida de compras, quem responde pelo faturamento, quem vai apresentar aquilo para o chefe — porque a pessoa se reconhece na descrição. Em troca, o mesmo post é visto pelo seu cliente, pelo seu concorrente e por alguém que talvez venha a trabalhar com você, ao mesmo tempo.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Isso funciona como filtro editorial antes de funcionar como estratégia. Peça que responde uma objeção de compra viaja bem nesse contexto; peça que depende de uma piada interna da audiência de consumo final soa deslocada ao lado de um post sobre contratação. Quando o comprador é outra empresa, a decisão de assunto está em [marketing de conteúdo para B2B](/guias/marketing-de-conteudo-para-b2b) — o recorte desta página é o formato.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Som, tela pequena e o meio do expediente',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O consumo ali costuma acontecer em horário de trabalho, com frequência numa aba do navegador ao lado de outras janelas, onde o vídeo vertical ocupa uma coluna estreita e não a tela inteira. Daí saem duas consequências diretas. A [legenda embutida](/glossario/legenda-embutida) deixa de ser só um cuidado de acessibilidade e passa a ser condição para o vídeo ser entendido. E o texto que você põe na imagem precisa continuar legível em tamanho reduzido — o que costuma significar menos palavras por quadro, e não fonte maior.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quais das suas peças servem, e quais não',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Reaproveitar não é publicar tudo em todo lugar. Antes de subir uma peça que já foi para as outras redes, passe por quatro perguntas:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Ela se sustenta sem contexto de perfil?** Quem chega ali não acompanha a sua sequência e não entende um "como eu falei ontem".',
        '**Ela fala de trabalho?** Bastidor de processo, decisão de negócio, erro que custou caro e resposta a objeção são assunto de expediente.',
        '**Ela envelhece bem?** No feed aparecem também posts que alguém da rede comentou, o que dá sobrevida à peça depois do dia da publicação — e peça amarrada a uma data perde essa sobrevida.',
        '**Você assinaria essa peça numa reunião?** É o mesmo lugar onde está o seu histórico profissional. Se a resposta for não, o problema não é a rede.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que não passa nesse filtro continua valendo nas outras redes: não existe obrigação de paridade entre o feed profissional e as outras três. Publicar menos ali, com escolha, custa menos do que publicar tudo e acostumar quem te segue a passar direto.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Página da empresa ou perfil de gente',
    },
    {
      tipo: 'paragrafo',
      texto:
        'São dois lugares distintos, e escolher entre eles não é uma decisão administrativa. Um perfil pessoal carrega um rosto e uma trajetória; uma página carrega a marca. A régua que evita um erro comum é decidir quem é o dono da peça antes de subir e não repetir o mesmo arquivo nos dois no mesmo dia — não porque isso seja proibido, mas porque você perde a única leitura que interessava, que é saber qual dos dois lugares levou aquele assunto adiante.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Se a escolha for o perfil de uma pessoa, vale lembrar que ele sai da empresa junto com ela. Construir o hábito da audiência em cima de alguém que pode ir embora é uma decisão legítima — desde que tomada de olhos abertos, e não por ser o caminho mais fácil no primeiro mês.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A conta das views não é a mesma',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Cada rede conta visualização do seu jeito, e um total somado entre plataformas diferentes só significa alguma coisa se estiver combinado antes quais redes entram na soma. O cuidado vale ainda mais quando existe meta contratada com alguém: antes de comemorar um resultado, confira em quais redes essa meta é contada. Como ler cada número sem se enganar é assunto de [como medir resultado de conteúdo orgânico](/guias/como-medir-resultado-de-conteudo-organico).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'No caso da Doxa, a conta é explícita, e vale dizer com todas as letras: a meta de views somadas cobre três redes — Instagram, TikTok e YouTube Shorts. Ela vale conforme as condições e o prazo do contrato, e o LinkedIn não é uma dessas redes: o que render ali fica fora da soma. A peça que sai da operação é o arquivo pronto para postar, vertical e legendado; nos próprios perfis, quem publica é a empresa — levar essa mesma peça para o feed profissional é decisão dela.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Perguntas frequentes',
    },
    {
      tipo: 'faq',
      itens: [
        {
          pergunta: 'O vídeo do TikTok serve para o LinkedIn sem editar?',
          resposta:
            'Serve, com uma condição: o arquivo tem de sair do editor, e não do botão de baixar da outra rede — o porquê disso, com o resto das regras de exportação, vive em [como usar o mesmo vídeo nas três redes](/guias/como-usar-o-mesmo-video-nas-tres-redes). Partindo do arquivo limpo, nada dentro do vídeo precisa mudar; o que muda é o texto que vai em volta dele.',
        },
        {
          pergunta: 'O número daqui entra na mesma conta das outras redes?',
          resposta:
            'Isso depende do que estiver combinado por escrito com quem produz os vídeos, e é o que vale conferir antes de somar: quais redes compõem a conta. Enquanto essa lista não estiver clara, trate o número do feed profissional como leitura separada — ele ajuda a decidir o que publicar ali, e não substitui olhar cada uma das outras redes por si.',
        },
        {
          pergunta: 'Publico na página da empresa ou no meu perfil?',
          resposta:
            'Escolha um dos dois para ser o dono do assunto e sustente a escolha por algumas semanas antes de mexer. Usar os dois ao mesmo tempo não é proibido, mas impede a leitura: você deixa de saber de onde veio a resposta. Quando a pessoa que aparece nos vídeos é a mesma que assina o perfil, começar por ele costuma exigir menos explicação de quem vê.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O primeiro mês, sem produzir nada a mais',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Separe quatro peças já publicadas que passem no filtro acima e suba uma por semana, reescrevendo apenas a primeira linha do post. No fim do mês, olhe menos o número e mais quem apareceu: um comentário de alguém que decide compra vale mais, ali, do que mil visualizações de gente que nunca vai comprar de você. Se em quatro semanas ninguém desse tipo apareceu, o que precisa mudar é o assunto — não a rede.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o arquivo é o mesmo, o entorno é que muda.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §3(c)):
 *          três redes da meta, views somadas, arquivo pronto para postar, quem
 *          publica, retorno em até 24 horas.
 * [x]  3. Nada da §9: sem preço, sem prazo do primeiro vídeo, sem direitos do
 *          vídeo, sem fidelidade.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. Os números do contrato (três redes, views somadas) aparecem com
 *          "conforme as condições e o prazo do contrato".
 * [x]  6. Intenção própria: o FORMATO numa rede fora das três. A exportação é
 *          de /guias/como-usar-o-mesmo-video-nas-tres-redes (uma frase + link);
 *          o assunto B2B é de /guias/marketing-de-conteudo-para-b2b (uma frase
 *          + link, e a FAQ de lá não é repetida); as métricas são de
 *          /guias/como-medir-resultado-de-conteudo-organico.
 * [x]  7. Incremental: a primeira linha do post no lugar da capa, o filtro de
 *          quatro perguntas e a escolha entre página e perfil.
 * [x]  8. title (54 caracteres), description (153) e H1 exclusivos; H2 em
 *          hierarquia real.
 * [x]  9. Hub /guias/videos-curtos; cinco links contextuais, nenhum decorativo
 *          (dois deles para a página dona da exportação, que é onde a dúvida
 *          do arquivo aparece duas vezes).
 * [x] 10. Não é comparativo, e mesmo assim não conclui a favor da Doxa: diz que
 *          publicar ali pode fazer sentido e que o número não entra na meta.
 * [x] 11. CTA único, no fecho, pelo campo `cta`.
 * [x] 12. Sem stuffing: "LinkedIn" aparece onde a frase pedia.
 * [x] 13. Vocabulário do dono: "views somadas", "pronto para postar",
 *          "vertical", "legendado".
 * [x] 14. Teste final (§45): sim — é o que eu diria a quem já produz vídeo e
 *          está prestes a subir a peça errada no lugar errado.
 * ────────────────────────────────────────────────────────────────────────── */
