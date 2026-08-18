import type { Pagina } from '../../tipos';

/**
 * A dor de entrada do cluster de formato: quem digita esta busca ainda não
 * quer contratar nada — quer saber o que está errado.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · "dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance
 *    do outro" → `RT-2` do manual do cliente, `docs/seo/source-of-truth.md` §8,
 *    fonte: `supabase/manual-seed-v1.sql:187-191`;
 *  · a janela de 24 horas de relógio entre publicações ("se um vídeo foi
 *    publicado segunda às 22h, o próximo só a partir das 22h de terça") →
 *    `RH-1`, §8, fonte: `supabase/manual-seed-v1.sql:205-207`;
 *  · engajamento artificial contamina resultado e pode gerar penalização das
 *    redes → §8, fonte:
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:531-543`;
 *  · "os primeiros conteúdos que performam abaixo do esperado fazem parte do
 *    processo: eles geram dados sobre audiência, temas, formatos, hooks e
 *    narrativas" → `docs/seo/source-of-truth.md` §2/§8 via FAQ, fonte:
 *    `src/components/faq/config.ts` (resposta `primeiros-videos`);
 *  · a Doxa não promete que um vídeo específico viralize → §1, fonte:
 *    `src/components/faq/config.ts:324-325`;
 *  · a referência de volume da operação, 60 conteúdos em 90 dias → §2, fonte:
 *    `supabase/manual-seed-v1.sql:179`.
 *
 * Nenhuma estatística de terceiro ("X% dos vídeos", "os primeiros 3 segundos
 * valem Y") entra aqui: não há fonte nomeada para isso no repositório.
 */
export const pagina: Pagina = {
  tipo: 'dor',
  slug: 'por-que-meus-videos-nao-tem-views',
  titulo: 'Por que os seus vídeos não têm views: as causas prováveis',
  descricao:
    'As causas mais comuns de um vídeo sem visualizações, na ordem em que vale investigar, com o teste que identifica cada uma e o que fazer depois.',
  h1: 'Por que os seus vídeos não têm views',
  resumo:
    'Na maioria dos casos são três coisas, nesta ordem: o vídeo não prende nos primeiros segundos, o volume é baixo demais para gerar dado, ou os vídeos competem entre si por serem publicados perto demais. Nenhuma delas é sorte. Abaixo, como identificar qual é a sua e o que fazer em cada caso.',
  intencao: 'informacional',
  palavrasChave: [
    'meu vídeo não tem views',
    'vídeo sem visualizações',
    'por que meu reels não aparece',
    'poucas views no tiktok',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/como-fazer-videos-curtos-que-prendem',
    '/glossario/retencao',
    '/glossario/hook',
    '/guias/como-aumentar-o-alcance-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o diagnóstico apontou volume e a sua empresa não tem quem produza nessa frequência, conte o que você precisa publicar. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como usar esta lista',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A ordem importa. As causas abaixo estão organizadas da mais frequente para a menos frequente, e as três primeiras explicam a maioria dos casos. Comece pela primeira, faça o teste indicado, e só siga adiante se ela estiver descartada — mexer em cinco coisas ao mesmo tempo garante que você não vai saber qual delas era.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Antes de tudo: um perfil novo ou um perfil que ficou meses parado começa devagar mesmo. Se você publicou três vídeos esta semana depois de um ano em silêncio, a causa provável é a número 2, e nenhuma das outras.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '1. O vídeo não passa dos primeiros segundos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É a causa número um, e de longe. A plataforma mostra o seu vídeo para um grupo pequeno de pessoas; se quase todas saem antes do quinto segundo, ela para de mostrar. Você não perdeu para o algoritmo, perdeu para o polegar.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** abra as métricas do vídeo e veja a [retenção](/glossario/retencao) nos primeiros segundos. Se a queda mais violenta da curva está no começo, é isto. **O que fazer:** reescrever só a abertura — o [hook](/glossario/hook) — e republicar o mesmo conteúdo em outra versão. Nada de vinheta, nada de logo, nada de apresentar a empresa: o assunto tem de estar declarado antes que a pessoa decida sair.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '2. O volume é baixo demais para gerar dado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quatro vídeos por mês não são uma estratégia de conteúdo: são quatro apostas. Nesse volume, um vídeo que vai bem parece sorte e um que vai mal parece castigo, porque não há amostra suficiente para distinguir uma coisa da outra. A plataforma também aprende pouco sobre quem é o seu público, e continua entregando para gente aleatória.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** conte quantos vídeos você publicou nos últimos trinta dias. Se foram menos de uns doze, é provavelmente esta. **O que fazer:** subir a frequência antes de refinar qualquer coisa. Como referência de ordem de grandeza, a operação da Doxa trabalha com sessenta conteúdos únicos em noventa dias, um por dia útil — não porque o número seja mágico, mas porque é a partir dessa faixa que dá para separar padrão de acaso.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '3. Os seus vídeos competem entre si',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Este é o erro que quase ninguém suspeita, e ele nasce de uma boa intenção: a semana ficou parada, então no sábado saem quatro vídeos de uma vez. O resultado é que os quatro disputam a mesma audiência ao mesmo tempo, e um atropela o alcance do outro. A regra que a Doxa aplica nos perfis dos clientes vai na mesma direção: no máximo um vídeo da operação por dia útil, com pelo menos 24 horas de relógio entre um e outro.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A janela é de relógio, não de calendário: se um vídeo foi publicado na segunda-feira às 22h, o próximo só a partir das 22h de terça. A ideia é deixar o vídeo anterior terminar a própria distribuição antes de o seguinte entrar na fila.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** olhe a data e a hora das suas últimas dez publicações. Se há dois ou mais vídeos no mesmo dia, é isto. **O que fazer:** espalhar. Publicar quatro vídeos em quatro dias entrega mais do que os mesmos quatro num sábado.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '4. O vídeo fala da sua empresa, não do problema de quem assiste',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Ninguém está rolando o feed procurando saber que a sua empresa completou doze anos. O vídeo que funciona começa por algo que a pessoa reconhece como dela — uma dúvida, um erro comum, um resultado inesperado — e só depois, se couber, chega à marca. Confira nos seus números: os institucionais costumam ficar entre os de pior desempenho do perfil.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** leia os seus dez últimos títulos e conte quantos começam falando de você. **O que fazer:** reescrever a primeira frase de cada um para começar pelo problema, mantendo o resto do vídeo igual.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '5. O arquivo denuncia que o vídeo veio de outro lugar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vídeo horizontal com barras pretas, corte de uma live, selo de outra rede no canto, legenda cortada pela interface: tudo isso é lido como conteúdo reaproveitado, e conteúdo reaproveitado costuma ser entregue com menos generosidade. Não é punição moral, é sinal de qualidade.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** abra o seu último vídeo no celular e veja se o texto encosta na interface ou some atrás dos botões. **O que fazer:** exportar vertical de verdade, com legenda embutida no arquivo e margem de segurança nas bordas.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '6. Você trocou de estratégia antes de terminar o teste',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Mudar de formato toda semana produz um perfil sem nenhuma série completa e sem nenhuma conclusão. É a versão de conteúdo do experimento em que se troca a variável a cada rodada: no fim há muito trabalho e nenhuma informação.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** você consegue nomear o formato que está testando agora e há quanto tempo? **O que fazer:** escolher um formato, rodar de dez a quinze vídeos nele, e só então decidir. Os primeiros conteúdos que performam abaixo do esperado não são desperdício: eles geram dado sobre audiência, temas, formatos, hooks e narrativas.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que provavelmente NÃO é a causa',
    },
    {
      tipo: 'lista',
      itens: [
        '**O algoritmo não está te punindo.** Não existe castigo pessoal; existe um vídeo que não segurou a amostra que recebeu.',
        '**Não é o horário da postagem.** Ele muda pouco quando a retenção é baixa, e não salva um vídeo que ninguém assiste até o fim.',
        '**Não é falta de seguidores.** No vídeo curto, uma parte relevante do alcance costuma vir de quem ainda não segue o perfil.',
        '**Comprar views, curtidas ou seguidores piora.** Além de contaminar o dado que você usaria para decidir, pode gerar penalização das próprias redes.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se o seu diagnóstico deu na causa 1 ou na 4, o conserto é de roteiro, e você consegue fazer sozinho a partir daqui. Se deu na causa 2 — volume —, o problema é de capacidade de produção, e é exatamente aí que a Doxa opera: a empresa produz e entrega os vídeos prontos para postar, e a marca publica no próprio perfil. O que a Doxa não faz, e diz em público, é prometer que um vídeo específico vai viralizar.',
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
          pergunta: 'Quantos vídeos preciso publicar para saber se está funcionando?',
          resposta:
            'O suficiente para separar padrão de acaso, o que costuma começar por volta de dez a quinze vídeos no mesmo formato. Abaixo disso, cada resultado ainda pode ser explicado por acaso, e qualquer conclusão que você tire será sobre ruído.',
        },
        {
          pergunta: 'Posso republicar um vídeo que não teve views?',
          resposta:
            'Pode, e costuma valer a pena quando o conteúdo era bom e a abertura era fraca. Republicar o mesmo arquivo raramente muda alguma coisa; republicar o mesmo conteúdo com outra abertura é um teste novo, com informação nova.',
        },
        {
          pergunta: 'Meu alcance caiu de repente. Fui punido?',
          resposta:
            'A explicação mais comum é bem menos dramática: mudança na frequência de publicação, dois vídeos publicados perto demais, ou uma série de vídeos com retenção baixa que reduziu a amostra inicial dos seguintes. Vale conferir essas três coisas antes de procurar punição.',
        },
        {
          pergunta: 'Vale a pena impulsionar um vídeo que não teve views?',
          resposta:
            'Impulsionar compra alcance, mas apaga a informação que você estava buscando: depois disso, você deixa de saber se aquele conteúdo se sustentava sozinho. Para diagnóstico, é melhor manter o vídeo orgânico e testar outra abertura.',
        },
      ],
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase entrega as três causas mais prováveis, antes de
 *          qualquer contexto. É a abertura aprovada na régua de copy.
 * [x]  2. Todo fato da Doxa tem entrada no source of truth (§1, §2, §8).
 * [x]  3. Nada da §9: sem preço, prazo do primeiro vídeo, fidelidade ou
 *          direitos do vídeo.
 * [x]  4. Termos proibidos ausentes; nenhuma promessa de viralizar.
 * [x]  5. A garantia não é citada; os 60 conteúdos entram como referência de
 *          VOLUME da operação, não como promessa.
 * [x]  6. Intenção própria: diagnóstico. O método de abertura é do guia
 *          `/guias/como-fazer-videos-curtos-que-prendem`; a definição é do
 *          verbete `/glossario/retencao`.
 * [x]  7. Incremental: um TESTE verificável por causa, e a janela de 24 h de
 *          relógio, que não aparece na SERP genérica.
 * [x]  8. Title, description e H1 exclusivos; H2 numerados em hierarquia real.
 * [x]  9. Pertence ao hub `/guias/videos-curtos`, recebe dele e envia links
 *          contextuais úteis.
 * [x] 10. Não é comparativo; ainda assim a seção "o que NÃO é a causa" desarma
 *          as explicações fáceis em vez de vender a solução.
 * [x] 11. CTA único no fim, condicionado ao resultado do diagnóstico.
 * [x] 12. Sem stuffing: "views" aparece onde a frase pede.
 * [x] 13. Vocabulário do dono: "pronto para postar", "operação", "viralizar".
 * [x] 14. Publicaria sem Google: sim — é literalmente o roteiro de perguntas
 *          que eu faria para alguém que me mostrasse o perfil parado.
 * ────────────────────────────────────────────────────────────────────────── */
