import type { Pagina } from '../../tipos';

/**
 * A página que captura a busca ampla do cluster de IA — inclusive "agência de
 * marketing com IA", sem que a Doxa se chame de agência (§47).
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · os três passos e a frase "pronto para postar" →
 *    `src/components/HowItWorks.tsx` (`STEPS_PT`), via source of truth §2;
 *  · "produz conteúdo vertical em escala para empresas e agências" e as quatro
 *    negativas ("não é agência", "não é tráfego pago", "não vende curso,
 *    ferramenta nem assinatura", "não há checkout") → `public/llms.txt`,
 *    source of truth §1;
 *  · "Um milhão de views. Ou seu dinheiro de volta." → `GARANTIA_PT` em
 *    `src/components/comparacao/config.ts`, a manchete da landing (§3a);
 *  · a letra da garantia → `src/components/faq/config.ts`, chave `garantia`,
 *    palavra por palavra (§3b, a redação prudente);
 *  · "tecnologia, inteligência artificial, processos próprios e operação
 *    especializada" → chave `escala` do mesmo arquivo;
 *  · as respostas do FAQ desta página → chaves `tom-de-voz`, `pequenas`, `b2b`
 *    e `escala`, palavra por palavra;
 *  · sessenta conteúdos em noventa dias, nas três redes → `supabase/manual-seed-v1.sql`
 *    (`RT-1`) e a linha de apoio do hero, com a ressalva do contrato (§3c);
 *  · as ferramentas → `src/components/tools.ts`, citadas como ferramentas
 *    USADAS: o arquivo proíbe implicar parceria ou endosso.
 *
 * O que NÃO está aqui: valor de mensalidade, prazo do primeiro vídeo,
 * fidelidade, direitos do vídeo e o programa de agência licenciada — as dez
 * perguntas de `PENDENTES` (§9.1). Nenhuma delas é sequer perguntada aqui.
 *
 * Esta página também NÃO usa a conta de R$ 8.000–10.500: ela é o argumento de
 * `/solucoes/producao-de-conteudo-em-escala`, e repetir o mesmo bloco em duas
 * páginas de solução é a duplicata que o §46 proíbe.
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'marketing-com-ia',
  titulo: 'Marketing com IA: o que automatizar e o que continua humano',
  descricao:
    'Onde a inteligência artificial entra de verdade no marketing de uma empresa, o que ela não decide, e como a Doxa opera a parte de vídeo dessa conta.',
  h1: 'Marketing com IA para empresas',
  resumo:
    'Marketing com IA é usar software para fazer a parte repetível do trabalho — gerar roteiro, locução, a imagem de quem fala e as variações de um mesmo conteúdo — enquanto estratégia, critério de marca e leitura de dados continuam sendo decisão de gente. A Doxa opera a fatia de vídeo dessa conta: uma foto e uma amostra de voz viram um clone que grava no seu lugar, e você recebe o vídeo pronto para postar.',
  intencao: 'comercial',
  palavrasChave: [
    'marketing com ia',
    'inteligência artificial no marketing',
    'marketing digital com ia',
    'ia para redes sociais',
    'agência de marketing com ia',
    'ia para conteúdo de empresa',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/solucoes/producao-de-videos-com-ia',
    '/solucoes/clone-de-ia-para-videos',
    '/guias/como-usar-ia-no-marketing',
    '/comparativos/agencia-vs-equipe-interna',
    '/comparativos/ia-vs-producao-tradicional-de-video',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Diga o que a sua empresa precisa publicar por mês e em quais redes. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que a IA faz sozinha e o que ela não faz',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O dinheiro que se perde com IA em marketing sai quase sempre do mesmo erro: tratar "IA" como um bloco só. Existem tarefas em que um modelo rende mais do que qualquer contratação, e tarefas em que ele é o pior conselheiro disponível. A régua é simples — **quanto mais a tarefa depende de repetir uma forma conhecida, mais a IA entrega; quanto mais ela depende de decidir o que a marca vai defender, menos**.',
    },
    {
      tipo: 'lista',
      itens: [
        'A IA entrega: variações de roteiro, locução, a imagem de quem fala, legenda, corte, capa e a versão do mesmo conteúdo para três redes.',
        'A IA não decide: o que a empresa pode prometer, qual é a oferta do trimestre, quando um assunto vira problema, e por que um vídeo com número bom foi um vídeo ruim para a marca.',
        'A IA não sabe: a objeção que o seu vendedor ouve todo dia. Isso não se extrai de um modelo — só de dentro da empresa.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As quatro camadas de uma operação de marketing com IA',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Matéria-prima',
          texto:
            'O que a empresa já sabe e ninguém mais tem: objeções de venda, perguntas que chegam todo dia, o diferencial real, as restrições do jurídico. É o único insumo que não dá para gerar — sem ele, o modelo escreve o texto médio da internet sobre o seu setor.',
        },
        {
          titulo: 'Produção',
          texto:
            'Roteiro, locução, imagem de quem fala, legenda e capa. É aqui que a conta muda de patamar: na operação tradicional, cada peça pede agenda, estúdio e uma diária; com IA, o caro é montar o processo uma vez.',
        },
        {
          titulo: 'Distribuição',
          texto:
            'Publicar com constância, nas redes onde o público está, sem atropelar o vídeo do dia anterior. A IA ajuda a versionar, mas cadência é disciplina operacional — e é onde a maioria trava no segundo mês.',
        },
        {
          titulo: 'Decisão',
          texto:
            'Ler o que aconteceu e escolher o próximo passo: o que repetir, o que descartar, que formato virou padrão. Nenhum modelo assume esse risco pela empresa, porque quem responde pelo resultado é a empresa.',
        },
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quase todo investimento em "marketing com IA" cai inteiro na camada de produção e não toca a primeira nem a última. O resultado é previsível: muito conteúdo, nenhuma opinião, e um perfil que publica todo dia sem que ninguém lembre de um único vídeo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa opera a camada de produção de vídeo e a estratégia de distribuição do que produz. O começo é o mesmo em toda operação, e só a primeira etapa pede o tempo do cliente:',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'A gente aprende o seu negócio',
          texto:
            'Uma reunião para preencher o que você faz, quem você quer atingir e o que espera dos vídeos.',
        },
        {
          titulo: 'Uma foto e um áudio viram o seu clone',
          texto:
            'Você manda uma foto e uma amostra da sua voz. A plataforma monta o clone que vai gravar os vídeos no seu lugar.',
        },
        {
          titulo: 'O vídeo pronto para postar',
          texto: 'Vertical, legendado, no formato do feed. Você recebe e publica no seu perfil.',
        },
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A escala não vem de um truque de prompt: vem de tecnologia, inteligência artificial, processos próprios e uma operação especializada em produção de conteúdo em escala, o que permite criar, testar e otimizar formatos muito mais rápido do que uma operação tradicional. Como o clone é montado está em [clone de IA para vídeos](/solucoes/clone-de-ia-para-videos); o passo a passo da produção, em [produção de vídeos com IA](/solucoes/producao-de-videos-com-ia).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto: 'Um milhão de views. Ou seu dinheiro de volta.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A letra dessa frase é esta: a Doxa trabalha com metas de performance definidas em contrato. A operação é estruturada para atingir o volume de visualizações acordado dentro do período estabelecido e, caso a meta não seja alcançada, aplicam-se as condições de garantia previstas no contrato. É por isso que a conversa começa por uma auditoria, e não por um orçamento.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A Doxa não é uma agência de marketing com IA',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quem digita "agência de marketing com IA" quase sempre quer uma coisa concreta: alguém que assuma o conteúdo. Vale dizer com todas as letras o que a Doxa é e o que ela não é, porque as duas respostas mudam a conversa antes de ela começar.',
    },
    {
      tipo: 'lista',
      itens: [
        'Não é uma agência: não há equipe de gravação, estúdio nem calendário editorial do lado do cliente.',
        'Não é tráfego pago: a garantia é de views orgânicas somadas, não de anúncios.',
        'Não vende curso, ferramenta nem assinatura de software.',
        'Não tem checkout: o funil termina em conversa humana, sem cobrança dentro do site.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que sobra é a descrição honesta: uma operação de produção de conteúdo vertical em escala para empresas e agências, com metas de performance definidas em contrato. Se o que a sua empresa procura é gestão de anúncios ou montar um time criativo dentro de casa, o caminho é outro — e [agência, equipe interna ou operação terceirizada](/comparativos/agencia-vs-equipe-interna) compara os três sem colocar a Doxa no meio.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O erro que aparece em toda operação de IA malfeita',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A pipeline da Doxa roda sobre ferramentas de mercado: HeyGen, ChatGPT, Claude, Meta e ElevenLabs. São ferramentas usadas, nada além disso — nenhuma é parceira da Doxa nem endossa o que está escrito aqui. E é por serem de mercado que elas não explicam resultado nenhum.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Ferramenta é commodity: as mesmas contas estão a um cartão de crédito de distância do seu concorrente. O que não é commodity é o volume de testes rodando ao mesmo tempo e a disposição de descartar rápido o que não funciona.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Para quem isso funciona — e para quem não funciona',
    },
    {
      tipo: 'lista',
      itens: [
        'Funciona para empresas que querem transformar conteúdo em um canal previsível e escalável de crescimento, e para marcas que precisam ganhar relevância e ocupar espaço de forma consistente.',
        'Funciona em empresa pequena, desde que exista potencial para transformar conteúdo em um canal relevante de crescimento.',
        'Não funciona como substituto de operação comercial: conteúdo gera demanda e audiência, não fecha venda no lugar do seu time.',
        'Não funciona para quem quer um vídeo por mês. Sem volume não há dado, e sem dado a operação vira palpite caro.',
      ],
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
          pergunta: 'A Doxa é uma agência de marketing com IA?',
          resposta:
            'A Doxa não é uma agência: não há equipe de gravação, estúdio nem calendário editorial do lado do cliente. O que ela opera é a produção de conteúdo vertical em escala para empresas e agências, com metas de performance definidas em contrato.',
        },
        {
          pergunta: 'Como vocês conseguem produzir tanto conteúdo para uma empresa?',
          resposta:
            'Usamos tecnologia, inteligência artificial, processos próprios e uma operação especializada em produção de conteúdo em escala. Isso permite criar, testar e otimizar diferentes formatos muito mais rápido do que uma operação tradicional de conteúdo.',
        },
        {
          pergunta: 'A Doxa consegue seguir a identidade e o tom de voz da minha marca?',
          resposta:
            'No início da operação, nosso time entende a identidade, o posicionamento, o público, a linguagem e as restrições da empresa. Essas informações passam a orientar a produção, para que o conteúdo mantenha consistência com a marca.',
        },
        {
          pergunta: 'Minha empresa é pequena. Isso faz sentido para mim?',
          resposta:
            'Empresas pequenas também podem trabalhar com a Doxa, desde que exista potencial para transformar conteúdo em um canal relevante de crescimento. O mais importante não é o tamanho da empresa, e sim os objetivos, o mercado, o produto e a capacidade de aproveitar a audiência gerada pela operação.',
        },
        {
          pergunta: 'Minha empresa é B2B. A Doxa funciona para mim?',
          resposta:
            'Empresas B2B também podem usar conteúdo para construir autoridade, gerar reconhecimento, educar o mercado e alcançar potenciais clientes. A estratégia, a linguagem e os formatos são adaptados ao público e ao processo comercial de cada negócio.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde começar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Antes de contratar qualquer coisa, responda três perguntas: o que a sua empresa sabe que ninguém mais sabe, quantos vídeos ela sustenta por mês e quem decide o que vai ao ar. São as camadas 1, 3 e 4 — e são elas que dizem se a IA vai economizar tempo ou só produzir volume. Com a Doxa, o primeiro passo é uma conversa: quem preenche o formulário é chamado em até 24 horas para marcar a auditoria estratégica.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase RESPONDE a busca. Sem aquecimento, sem "no mundo
 *          digital", sem "cada vez mais empresas", sem definir o óbvio antes.
 * [x]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md.
 *          Cliente, número, prazo, preço, garantia e depoimento: zero invenção.
 * [x]  3. Nada da §9 (NÃO PUBLICÁVEL) apareceu — nem parafraseado, nem
 *          "suavizado": preço, mensalidade, fidelidade, direitos do vídeo,
 *          agência licenciada, os 1.500 clientes, "parceiros".
 * [x]  4. Termos proibidos ausentes: "agência" como autodefinição, "parceiros"
 *          para as ferramentas, "assinatura", "curso", "tráfego pago" como
 *          serviço, "garantimos que vai viralizar".
 * [x]  5. Se cita a garantia, usa a redação prudente do FAQ; se usa os números
 *          do manual, vem com "conforme as condições e o prazo do contrato".
 * [x]  6. Motivo real de existir: responde a UMA intenção que nenhuma outra
 *          página do keyword-map já responde (conferir a seção Canibalização).
 * [x]  7. Informação incremental: pelo menos um bloco que a SERP não tem —
 *          mecanismo, número da metodologia, erro comum, exemplo concreto.
 * [x]  8. title exclusivo e orientado a intenção (nunca "Keyword | DOXA"),
 *          description exclusiva de 120–160 caracteres, H1 único, H2/H3 em
 *          hierarquia real.
 * [x]  9. Pertence a ≥1 hub, envia links contextuais e recebe do hub. Nenhum
 *          link decorativo: cada um é útil para quem lê, não para o crawler.
 * [x] 10. Comparativo é IMPARCIAL: admite onde a outra opção ganha. Não
 *          concluir artificialmente que a Doxa é sempre a resposta.
 * [x] 11. CTA por intenção — topo de funil: próximo conteúdo; meio:
 *          metodologia/prova; fundo: o formulário (#forms). Um só, no fim.
 * [x] 12. Sem keyword stuffing: a keyword-alvo aparece onde caberia se o
 *          Google não existisse. Sem sinônimo empilhado, sem lista de cidades.
 * [x] 13. Frases do dono usadas palavra por palavra quando existem ("pronto
 *          para postar", "views somadas", "clone"). Vocabulário do §10.
 * [x] 14. Teste final (§45): "eu publicaria isso se o Google não existisse?"
 *          Se não, reescrever — não ajustar.
 * ────────────────────────────────────────────────────────────────────────── */
