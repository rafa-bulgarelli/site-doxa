import type { Pagina } from '../../tipos';

/**
 * A página que a FASE 1 pulou por risco de ficar rasa. Ela só existe porque
 * tem um ângulo que nenhuma vizinha tem: um DOCUMENTO de uma página, com sete
 * campos, que a empresa preenche antes de contratar quem quer que seja. Não é
 * uma lista de táticas nem um "guia de planejamento" genérico.
 *
 * Também fecha dois links pendentes: `/guias/como-postar-todos-os-dias-sem-
 * equipe` e `/glossario/conteudo-evergreen` já apontam para cá.
 *
 * Fronteira com as vizinhas: `/guias/marketing-organico` (hub) é dono de "as
 * quatro coisas que sustentam um canal orgânico"; `/solucoes/conteudo-organico-
 * para-empresas` é dono dos "três compromissos que o canal cobra";
 * `/guias/como-produzir-60-videos-em-90-dias` é dona do PLANO DE PRODUÇÃO do
 * trimestre. Nenhum desses blocos é repetido aqui.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · onboarding com empresa, objetivos, público, posicionamento e referências,
 *    antes da estratégia → `docs/seo/source-of-truth.md` §2, fonte:
 *    `src/components/faq/config.ts:537-538`;
 *  · identidade, posicionamento, público, linguagem e restrições orientam a
 *    produção → §2, fonte: `src/components/faq/config.ts:485-486`;
 *  · público: empresas que querem transformar conteúdo num canal previsível e
 *    escalável de crescimento → §7, fonte:
 *    `src/components/faq/config.ts:249-250`;
 *  · empresa pequena cabe, desde que exista potencial para transformar
 *    conteúdo num canal relevante de crescimento → §7, fonte:
 *    `src/components/faq/config.ts:364-365`;
 *  · os primeiros conteúdos abaixo do esperado geram dados sobre audiência,
 *    temas, formatos, hooks e narrativas → §2, fonte:
 *    `src/components/faq/config.ts` (resposta `primeiros-videos`);
 *  · retorno em até 24 horas para marcar a auditoria estratégica → §2, fonte:
 *    `public/llms.txt:47-49`; `src/components/comparacao/config.ts:273,297`.
 *
 * Nenhum número de mercado, nenhuma promessa de prazo para resultado e nenhuma
 * página por indústria: o keyword-map descarta a última explicitamente.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'estrategia-de-conteudo-para-empresas',
  titulo: 'Estratégia de conteúdo: o documento de uma página',
  descricao:
    'Sete campos numa folha só, preenchidos antes de contratar qualquer fornecedor. O que cada um responde, como saber que a resposta é ruim e quando revisar.',
  h1: 'Estratégia de conteúdo para empresas',
  resumo:
    'Estratégia de conteúdo não é um calendário nem uma lista de formatos: é um documento de uma página que responde sete perguntas e cabe numa folha. Ele existe para uma coisa muito prática — ser entregue a quem for produzir, seja um fornecedor, um freelancer ou a pessoa do time. Abaixo, os sete campos, o que é uma resposta ruim em cada um e os dois jeitos mais comuns de errar o documento inteiro.',
  intencao: 'informacional',
  palavrasChave: [
    'estratégia de conteúdo',
    'estratégia de conteúdo para empresas',
    'planejamento de conteúdo',
    'plano de conteúdo redes sociais',
    'briefing de conteúdo',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/solucoes/conteudo-organico-para-empresas',
    '/guias/como-produzir-60-videos-em-90-dias',
    '/guias/como-medir-resultado-de-conteudo-organico',
    '/glossario/conteudo-evergreen',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Com o documento preenchido, a conversa com qualquer fornecedor fica curta. Se a sua empresa quiser fazer essa conversa com a Doxa, o time responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Para que serve uma folha só',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A prova de que uma estratégia de conteúdo existe não é a apresentação de quarenta slides: é conseguir entregar uma página a alguém que nunca ouviu falar da empresa e essa pessoa saber o que produzir na segunda-feira. Se o documento precisa de uma reunião para ser entendido, ele ainda não é uma estratégia — é uma anotação.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O formato de uma página tem uma segunda vantagem, menos óbvia: ele obriga a decidir. Campos longos escondem indecisão atrás de texto; uma linha por pergunta expõe imediatamente a que ninguém respondeu ainda.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os sete campos',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Campo', 'A pergunta', 'Como é uma resposta ruim'],
      linhas: [
        ['Objetivo', 'O que muda no negócio se isso der certo?', '"Aumentar o engajamento" — não é resultado de negócio'],
        ['Para quem', 'Quem é a pessoa, e o que ela já sabe?', '"Homens e mulheres de 25 a 55 anos"'],
        ['O que só nós sabemos', 'Que informação a empresa tem e ninguém mais?', '"Somos referência no mercado"'],
        ['A promessa', 'Quem seguir o perfil ganha o quê?', '"Conteúdo de qualidade e novidades da marca"'],
        ['Formato e ritmo', 'Quantas peças por semana, em que formato, onde?', '"Vamos postar sempre que possível"'],
        ['Critério de descarte', 'O que faz uma linha ser abandonada?', 'Campo em branco, que é o caso mais comum'],
        ['Quem decide', 'Quem aprova e quem responde a audiência?', '"O time" — ou seja, ninguém'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A coluna da direita é a mais útil do documento. Toda resposta ruim tem a mesma assinatura: ela poderia ter sido escrita por qualquer empresa de qualquer setor. Se a linha sobrevive a ser copiada para o documento de um concorrente sem soar estranha, ela ainda não diz nada.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O terceiro campo é o que sustenta os outros seis. O que a empresa sabe e ninguém mais — a objeção que o comercial ouve, o erro que o cliente comete antes de chegar, o critério pelo qual você recusa um pedido — é a única matéria-prima que nenhum fornecedor consegue trazer de fora.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O campo que quase ninguém preenche',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O critério de descarte é o sexto campo e o mais ignorado, e a ausência dele é o que faz operações de conteúdo continuarem publicando por hábito. Sem uma regra escrita, nada morre: o formato que não funciona sobrevive porque alguém gostou dele, e o mês seguinte repete os erros do anterior por inércia.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Uma regra serve desde que seja verificável e esteja escrita antes de doer. Por exemplo: "um formato que ficar abaixo da média do perfil em dez peças seguidas sai do plano". O número importa menos que o compromisso — e a decisão precisa estar tomada antes de existir um vídeo específico para defender.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Dois jeitos de errar o documento inteiro',
    },
    {
      tipo: 'lista',
      itens: [
        '**Confundir estratégia com calendário.** A lista do que sai em cada dia do mês é execução, e ela muda toda semana. A estratégia é o que decide o que entra nessa lista, e ela deve durar um trimestre inteiro sem ser reescrita.',
        '**Escrever para si mesmo.** Um documento cheio de referências internas — nomes de projeto, siglas, histórico — falha no único teste que importa: alguém de fora consegue produzir a partir dele? Se a resposta for não, o documento não existe para o propósito que ele tem.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando revisar, e o que nunca se revisa no meio',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A janela natural é o trimestre, porque é o tempo em que um volume razoável de peças gera dado suficiente para concluir algo. Nas primeiras semanas, o que aparece é ruído: os conteúdos que performam abaixo do esperado no começo são justamente os que geram os dados sobre audiência, temas, formatos e narrativas que orientam a revisão seguinte.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que não se mexe no meio do trimestre são os campos 2, 3 e 4 — para quem, o que só nós sabemos e a promessa. Trocar o público ou a promessa em cima da hora invalida todo o dado acumulado até ali, e a operação recomeça sem perceber que recomeçou. Formato e ritmo, por outro lado, podem e devem ser ajustados a qualquer momento.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Depois do documento vem o plano',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A folha responde o quê e para quem; ela não diz como produzir na quantidade que o campo cinco pediu. Essa é a parte seguinte, e ela tem página própria: a aritmética de um trimestre de produção, as fases e a fila estão em [como produzir 60 vídeos em 90 dias](/guias/como-produzir-60-videos-em-90-dias). O que medir depois de publicar está em [como medir resultado de conteúdo orgânico](/guias/como-medir-resultado-de-conteudo-organico).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'É a mesma ordem que uma operação contratada segue: na Doxa, o processo começa por um onboarding em que a empresa, os objetivos, o público, o posicionamento e as referências são levantados — identidade, linguagem e restrições passam a orientar a produção —, e só depois a estratégia é estruturada e a produção começa. Quem chega com a folha preenchida encurta essa etapa pela metade.',
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
          pergunta: 'Estratégia de conteúdo é a mesma coisa que calendário editorial?',
          resposta:
            'São documentos diferentes com vidas diferentes. O calendário lista o que sai em cada data e é reescrito toda semana; a estratégia decide o que pode entrar nessa lista e dura um trimestre. Empresas que só têm o calendário costumam produzir com constância e sem direção — publicam todo dia e não conseguem dizer o que estão tentando descobrir.',
        },
        {
          pergunta: 'Preciso da estratégia pronta antes de começar a publicar?',
          resposta:
            'Não, e esperar por ela costuma custar mais caro do que começar com ela pela metade. Os campos de objetivo, público e promessa dá para responder hoje; o critério de descarte só fica bom depois de ver as primeiras peças no ar. O que não funciona é chegar ao terceiro mês sem nenhum dos sete respondidos, porque aí não há como decidir nada com o que foi publicado.',
        },
        {
          pergunta: 'Quem deveria escrever esse documento?',
          resposta:
            'Alguém de dentro da empresa, sempre — o campo do que só a empresa sabe não se terceiriza. Um fornecedor pode conduzir a conversa, organizar o texto e apontar as respostas genéricas, e isso ajuda bastante; o que não funciona é receber o documento pronto e aprová-lo sem reconhecer nele o próprio negócio.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A folha em branco',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abra um documento, escreva os sete nomes de campo em sete linhas e preencha o que der em vinte minutos. Deixe em branco o que você não souber responder — as lacunas são a parte mais informativa do exercício, porque cada uma delas é uma decisão que a empresa vinha adiando e que alguém acabaria tomando no lugar dela.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: é um documento de uma página com sete
 *          campos, e não um calendário.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §7).
 * [x]  3. Nada da §9: sem preço, prazo prometido, fidelidade ou licenciamento.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: o DOCUMENTO. O hub /guias/marketing-organico é dono
 *          de "as quatro coisas que sustentam um canal"; /solucoes/conteudo-
 *          organico-para-empresas, dos "três compromissos"; /guias/como-
 *          produzir-60-videos-em-90-dias, do plano de produção. Foi escrita só
 *          porque esse ângulo não existia em nenhuma delas.
 * [x]  7. Incremental: a tabela campo × pergunta × resposta ruim, o critério de
 *          descarte e a regra de o que não se revisa no meio do trimestre.
 * [x]  8. title (49 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/marketing-organico; fecha os links pendentes de
 *          /guias/como-postar-todos-os-dias-sem-equipe e de
 *          /glossario/conteudo-evergreen.
 * [x] 10. Não é comparativo; diz que esperar a estratégia ficar pronta custa
 *          mais caro do que começar com ela pela metade.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "auditoria estratégica", "operação", "canal
 *          previsível".
 * [x] 14. Teste final (§45): sim — é a folha que eu pediria para preencher
 *          antes de aceitar qualquer trabalho de conteúdo.
 * ────────────────────────────────────────────────────────────────────────── */
