import type { Pagina } from '../../tipos';

/**
 * A dor de CRESCIMENTO DE PERFIL — o par natural de
 * `/guias/por-que-meus-videos-nao-tem-views`, que diagnostica a PEÇA. Aqui a
 * unidade é o perfil: descoberta, conversão em seguidor e sustentação da base.
 * Nenhuma das causas de lá se repete aqui (hook, volume, vídeos competindo,
 * conteúdo institucional, arquivo reaproveitado, troca de formato).
 *
 * O bloco "caiu de verdade ou você mudou a mistura de formatos?" tem um dono e
 * não é esta página: é `/guias/como-aumentar-o-alcance-organico`. Aqui ele
 * aparece em uma frase, dentro do aviso, com link.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · o entregável vertical, legendado, no formato do feed, e "quem publica é o
 *    cliente, no perfil dele" → `docs/seo/source-of-truth.md` §2 "Entregável",
 *    fonte: `src/components/HowItWorks.tsx:92`; `public/llms.txt:25-26`;
 *  · 60 conteúdos únicos em 90 dias, um por dia útil → §2 e §8, fonte:
 *    `supabase/manual-seed-v1.sql:179,183` (`RT-1`) e `:187-191` (`RT-2`).
 *    Citado como REFERÊNCIA DE VOLUME da operação e como condição de quem já é
 *    cliente — nunca como promessa de aquisição;
 *  · Instagram é uma das três redes em que a operação publica → §2
 *    "Plataformas", fonte: `supabase/manual-seed-v1.sql:84`;
 *    `src/components/Hero.tsx:21`;
 *  · a Doxa não promete que um vídeo específico viralize → §1, fonte:
 *    `src/components/faq/config.ts:324-325`;
 *  · retorno em até 24 horas depois do formulário → §2 "O funil", fonte:
 *    `src/components/comparacao/config.ts:297`; `public/llms.txt:47-49`.
 *
 * Nenhum número de plataforma entra aqui — nem porcentagem de alcance, nem
 * quantos seguidores "são normais": não há fonte nomeada para nada disso no
 * repositório, e o texto explica mecanismo em vez de citar pesquisa.
 */
export const pagina: Pagina = {
  tipo: 'dor',
  slug: 'por-que-meu-instagram-parou-de-crescer',
  titulo: 'Por que o seu Instagram parou de crescer: as três causas',
  descricao:
    'Perfil estagnado tem três explicações possíveis, e elas pedem correções opostas: descoberta, conversão em seguidor ou uma base que não assiste mais.',
  h1: 'Por que o seu Instagram parou de crescer',
  resumo:
    'Um perfil para de crescer por uma de três razões, e cada uma pede o contrário da outra: ou ele deixou de alcançar quem ainda não segue, ou alcança gente nova e não converte ninguém em seguidor, ou ganhou uma base que não assiste o que ele publica. As três aparecem no mesmo painel do Instagram, com um teste próprio. Abaixo, como descobrir qual é a sua antes de mudar qualquer coisa.',
  intencao: 'informacional',
  palavrasChave: [
    'meu instagram parou de crescer',
    'perfil parou de crescer',
    'não ganho mais seguidores',
    'instagram estagnado',
  ],
  hubs: ['/guias/reels-no-instagram'],
  relacionadas: [
    '/guias/reels-no-instagram',
    '/guias/como-crescer-no-instagram-organicamente',
    '/guias/como-aumentar-o-alcance-organico',
    '/guias/por-que-meus-videos-nao-tem-views',
    '/plataformas/instagram-reels-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o diagnóstico deu em descoberta e a sua empresa não sustenta a frequência de vídeo sozinha, conte quantos vídeos ela precisa publicar por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A conta que explica um perfil parado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Crescimento de perfil não é um número só: é o produto de três, e eles quase nunca são olhados juntos. Quantas contas que ainda não seguem o perfil foram alcançadas; quantas dessas viraram seguidor; e quantas das que já seguiam continuam assistindo ao que você publica. Quando o total estaciona, um desses três estacionou — e a correção de um costuma piorar o outro se o diagnóstico estiver trocado.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Descoberta:** dentro das contas alcançadas, a fatia de quem ainda não segue o perfil, comparada com a de três meses atrás.',
        '**Conversão:** os seguidores ganhos no período, lidos ao lado do alcance que os produziu. É o número que conta o que acontece depois do vídeo.',
        '**Sustentação:** o alcance médio por publicação ao longo do tempo. Se ele cai enquanto a base cresce, quem entrou não está assistindo.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Compare janelas de noventa dias, não semanas. Ganho de seguidor costuma vir em degraus — um único vídeo entrega boa parte do mês —, e a semana fraca depois de um pico parece estagnação sem ser. E se o que caiu foi o alcance, e não o número de seguidores, o diagnóstico é outro: ele está em [como aumentar o alcance orgânico](/guias/como-aumentar-o-alcance-organico), que também trata da pergunta "caiu de verdade ou eu mudei a mistura de formatos?".',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '1. O perfil parou de alcançar quem ainda não segue',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É a causa mais comum e a mais fácil de confundir com desinteresse do público. O perfil continua indo bem entre os seguidores — os comentários são dos mesmos nomes de sempre, o engajamento parece razoável — e simplesmente não aparece mais para gente nova. Sem contas novas entrando, não há de onde sair seguidor: o crescimento trava mesmo com o conteúdo funcionando para quem já está lá.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** abra o alcance dos últimos trinta dias e veja a fatia de contas que não seguem o perfil. Compare com a mesma fatia de três meses atrás. Se ela encolheu, é esta. **O que fazer:** o vídeo vertical é a superfície que o Instagram usa para mostrar conteúdo a quem não segue, e um perfil que passou a publicar mais foto e carrossel do que vídeo conversa quase só com a própria base. Formato, produção e cadência de Reels estão reunidos em [Reels no Instagram](/guias/reels-no-instagram).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '2. Ele alcança gente nova e ninguém segue',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Aqui a descoberta funciona e quem trava é o segundo passo. A pessoa assiste ao vídeo inteiro, gosta e vai embora sem seguir — porque assistir e seguir respondem a perguntas diferentes. Assistir responde "isso é interessante?". Seguir responde "vale a pena receber mais disto?", e essa segunda só tem resposta se o perfil deixar claro o que vem depois do vídeo que ela acabou de ver.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** pegue os cinco vídeos de maior alcance dos últimos três meses e veja quantos seguidores cada um trouxe. Alcance alto com ganho baixo, repetido nos cinco, é esta. **O que fazer:** duas correções que não custam produção nenhuma — dizer dentro do vídeo que aquele assunto tem continuação, e deixar o perfil responder em uma linha para quem ele serve. O método inteiro, com as métricas semanais, está em [como crescer no Instagram organicamente](/guias/como-crescer-no-instagram-organicamente).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: '3. A base cresceu e parou de assistir',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A terceira é a mais silenciosa, porque o número que se olha primeiro continua subindo. O perfil ganha seguidores e o alcance por publicação encolhe: sinal de que quem entrou não veio pelo assunto. Sorteio, "siga e ganhe", troca de seguidor entre perfis e o público atraído por um vídeo que não tem nada a ver com o negócio entregam número sem entregar audiência — e uma base que não assiste tende a reduzir a amostra inicial de cada vídeo novo, que é justamente o contrário do que se queria.',
    },
    {
      tipo: 'paragrafo',
      texto:
        '**O teste:** ponha lado a lado a curva de seguidores e a curva de alcance médio por publicação dos últimos seis meses. Se elas andam em direções opostas, é esta. **O que fazer:** parar de perseguir número e voltar ao assunto que a empresa consegue defender toda semana. Limpar a base à mão não devolve o alcance perdido, e o efeito some sozinho conforme a audiência certa vai chegando.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O erro de leitura que custa um mês',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um perfil parado costuma receber sempre a mesma receita, venha ela de onde vier: reescrever a bio, publicar mais vezes, procurar mais seguidores. Cada uma dessas três resolve uma das causas e não faz nada pelas outras duas — e é por isso que a tabela abaixo importa mais do que a lista de táticas.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['O que você vê no painel', 'Causa provável', 'O que não vai adiantar'],
      linhas: [
        [
          'A fatia de não seguidores encolheu',
          'Descoberta (causa 1)',
          'Mexer na bio: ela não muda o que a rede entrega.',
        ],
        [
          'Alcance alto, poucos seguidores novos',
          'Conversão (causa 2)',
          'Publicar mais vezes multiplica a visita que já não convertia.',
        ],
        [
          'Seguidores sobem, alcance por post cai',
          'Sustentação (causa 3)',
          'Correr atrás de seguidor acelera exatamente o problema.',
        ],
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
        'Das três causas, uma só é de capacidade: publicar vídeo com regularidade suficiente para o perfil voltar a ser mostrado a quem não segue. Conversão e escolha de assunto continuam sendo decisão de dentro da empresa — nenhum fornecedor decide o que a sua marca tem a dizer. A operação da Doxa trabalha nessa faixa: sessenta conteúdos únicos em noventa dias, um por dia útil, sendo o Instagram uma das três redes que recebem cada vídeo — e isso é condição de quem já é cliente, não uma promessa de aquisição.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'O que a Doxa assume é a produção: os vídeos chegam prontos para postar — verticais, legendados, no formato do feed — e quem publica é a empresa, no perfil dela. O que a Doxa não faz, e diz em público, é prometer que um vídeo específico vai viralizar.',
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
          pergunta: 'Perdi seguidores depois de um vídeo que foi bem. Isso é problema?',
          resposta:
            'Um vídeo que alcança muito além da audiência de sempre traz gente que não veio pelo assunto, e parte dela sai nos dias seguintes. O número que interessa é o saldo do mês, não o do dia: se ele continua positivo e o alcance por publicação não caiu, o perfil fez exatamente o que deveria fazer.',
        },
        {
          pergunta: 'Meu perfil pode ter chegado ao limite do assunto?',
          resposta:
            'Pode, e isso se distingue da causa 2 pelo lugar em que o funil trava. Na causa 2 chega gente nova e ela não segue; na saturação, o vídeo mantém o desempenho de sempre e cada vez menos gente nova aparece, porque o público interessado naquele tema específico já foi alcançado. A saída costuma ser ampliar o assunto para o problema vizinho ao seu, e não publicar mais do mesmo.',
        },
        {
          pergunta: 'Vale a pena começar um perfil novo do zero?',
          resposta:
            'Raramente, e por dois motivos. O histórico é o único dado que mostra qual formato funcionou, e ele não vai junto para o perfil novo. A causa da estagnação também viaja com quem publica: se era conversão ou assunto, ela reaparece no segundo perfil, agora sem base nenhuma. Trocar de perfil resolve outra coisa — mudança de nome, de marca ou de negócio —, não crescimento parado.',
        },
      ],
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase entrega as três causas, antes de qualquer contexto.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§1, §2, §8).
 * [x]  3. Nada da §9: sem preço, prazo do primeiro vídeo, fidelidade, direitos
 *          do vídeo, 1.500 clientes ou "parceiros".
 * [x]  4. Termos proibidos ausentes; nenhuma promessa de viralizar — a página
 *          diz o contrário com todas as letras.
 * [x]  5. A garantia não é citada. Os 60 conteúdos em 90 dias entram como
 *          referência de VOLUME da operação, não como promessa de aquisição.
 * [x]  6. Intenção própria: crescimento do PERFIL. A dor de views diagnostica a
 *          peça; a dor de alcance diagnostica a métrica de alcance e é dona do
 *          bloco "caiu ou mudou a mistura?", citado aqui em uma frase com link.
 * [x]  7. Incremental: a conta descoberta × conversão × sustentação, um teste
 *          verificável por causa e a tabela do erro de leitura.
 * [x]  8. Title, description e H1 exclusivos; H2 numerados em hierarquia real.
 * [x]  9. Pertence ao hub `/guias/reels-no-instagram`, que é citado INLINE no
 *          corpo (a auditoria o acusava de órfão), e envia links úteis.
 * [x] 10. Não é comparativo; ainda assim a tabela desmonta as três receitas
 *          prontas em vez de vender a solução.
 * [x] 11. CTA único no fim, condicionado ao resultado do diagnóstico.
 * [x] 12. Sem stuffing: "parou de crescer" aparece onde a frase pede.
 * [x] 13. Vocabulário do dono: "pronto para postar", "vertical, legendado, no
 *          formato do feed", "operação".
 * [x] 14. Publicaria sem Google: sim — é a sequência de perguntas que eu faria
 *          para alguém que abrisse o painel do perfil na minha frente.
 * ────────────────────────────────────────────────────────────────────────── */
