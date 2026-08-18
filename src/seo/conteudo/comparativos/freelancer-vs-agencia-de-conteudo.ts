import type { Pagina } from '../../tipos';

/**
 * A "terceira via" do comparativo de estrutura. `/comparativos/agencia-vs-equipe-interna`
 * já decide entre TER O TIME DENTRO ou contratar uma estrutura fora; aqui a
 * pergunta é outra e vem depois: decidido terceirizar, contrata-se UMA PESSOA
 * ou uma ESTRUTURA? Por isso a tabela desta página não repete nenhum critério
 * daquela — lá os eixos são conhecimento do negócio, aprendizado e custo fixo;
 * aqui são coordenação, cobertura, escopo e o que acontece quando o volume
 * dobra.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · a Doxa não é agência — não há equipe de gravação, estúdio nem calendário
 *    editorial do lado do cliente → fonte: `docs/seo/source-of-truth.md` §1
 *    (`public/llms.txt:40-41`);
 *  · a Doxa não vende curso, ferramenta nem assinatura de software → fonte: §1
 *    (`public/llms.txt:43`);
 *  · o entregável é o arquivo do vídeo pronto para postar — vertical,
 *    legendado, no formato do feed — e quem publica é o cliente, no perfil dele
 *    → fonte: §2 (`src/components/HowItWorks.tsx:92`; `public/llms.txt:25-26`);
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → fonte: §2
 *    (`supabase/manual-seed-v2.sql:168`);
 *  · retorno em até 24 horas para marcar a auditoria estratégica → fonte: §2
 *    (`src/components/comparacao/config.ts:273,297`; `public/llms.txt:47-49`).
 *
 * O que NÃO está aqui de propósito: valor de hora de freelancer, fee de
 * agência, faixa salarial, preço da Doxa e a quebra suposta do custo mensal
 * (§9 do source of truth). Também não entram os R$ 8.000–10.500 nem os 18 dias:
 * esses números são do inventário do "jeito antigo", já explicados em
 * `/comparativos/agencia-vs-equipe-interna`, e repetir o bloco aqui seria
 * duplicar o dono dele — esta página linka em vez de repetir.
 */
export const pagina: Pagina = {
  tipo: 'comparativo',
  slug: 'freelancer-vs-agencia-de-conteudo',
  titulo: 'Freelancer ou agência de conteúdo: quem entrega o quê',
  descricao:
    'Contratar um profissional por conta própria ou uma estrutura inteira: o que muda em escopo, coordenação, cobertura de imprevisto e quando o volume dobra.',
  h1: 'Freelancer ou agência de conteúdo',
  resumo:
    'Freelancer é uma pessoa executando uma habilidade; agência é uma estrutura coordenando várias. A conta que decide não é o valor da proposta, e sim quanto trabalho de coordenação sobra do seu lado depois de assinar — porque esse trabalho existe nos dois casos, e só num deles ele está incluído no preço.',
  intencao: 'comercial',
  palavrasChave: [
    'freelancer ou agência',
    'agência de conteúdo',
    'contratar freelancer de conteúdo',
    'terceirizar produção de vídeo',
    'freelancer de social media',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/comparativos/agencia-vs-equipe-interna',
    '/guias/como-produzir-conteudo-sem-equipe',
    '/solucoes/producao-de-conteudo-em-escala',
    '/guias/o-que-e-uma-agencia-de-marketing-com-ia',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o que falta é volume de vídeo publicado, e não mais um fornecedor para coordenar, conte quantos vídeos a sua empresa precisa por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A pergunta que vem antes da proposta',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Esta comparação só faz sentido depois de uma decisão anterior — a de não montar o time dentro de casa, que está em [agência ou equipe interna](/comparativos/agencia-vs-equipe-interna). Decidido terceirizar, a escolha real é entre contratar **uma pessoa** e contratar **uma estrutura**. E ela se responde com uma pergunta simples: quem vai coordenar o trabalho?',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Com um freelancer, a coordenação é sua. Você define a pauta, aprova o roteiro, cobra o prazo, revisa o corte, resolve o que fazer na semana em que ele viaja. Com uma agência, a coordenação está dentro do contrato — e você paga por ela, esteja ela boa ou ruim. Nenhuma das duas opções faz o trabalho de coordenação desaparecer; elas só mudam de quem ele é.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um freelancer costuma ser uma habilidade, não a operação',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vale desfazer uma confusão que aparece já no briefing: **"freelancer de conteúdo" raramente é um cargo só**. Publicar um vídeo curto exige pauta, roteiro, gravação, edição, legenda, capa, descrição e publicação. Um editor excelente não escreve roteiro; um roteirista excelente não edita; um social media organiza a publicação e não grava. Contratar "um freelancer" para a operação inteira costuma significar contratar a pessoa mais forte numa etapa e mais fraca em todas as outras.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Por isso a comparação honesta raramente é um freelancer contra uma agência: é **um conjunto de freelancers** contra uma agência — e coordenar três fornecedores vira, sozinho, um trabalho de meio período dentro da empresa.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A comparação, critério a critério',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Critério', 'Freelancer', 'Agência'],
      linhas: [
        [
          'Escopo coberto por um contrato',
          'Uma etapa, ou duas quando a pessoa acumula',
          'A cadeia inteira, do plano à peça entregue',
        ],
        [
          'Quem coordena as etapas',
          'Você, todo dia, entre um fornecedor e outro',
          'Um atendimento dentro da estrutura contratada',
        ],
        [
          'Como o preço se forma',
          'Por hora, por peça ou por pacote combinado direto',
          'Por escopo mensal, com a gestão embutida no valor',
        ],
        [
          'Quando o volume dobra',
          'Renegocia com a pessoa, ou procura mais uma',
          'Aciona o escopo maior, se a estrutura comportar',
        ],
        [
          'Cobertura em férias, doença e feriado',
          'Descoberta: se a pessoa para, a fila para',
          'Substituição interna, com perda de contexto',
        ],
        [
          'Padrão entre uma peça e outra',
          'Ligado ao gosto de quem executa naquele mês',
          'Documentado em processo, com revisão antes de entregar',
        ],
        [
          'Canal de resolução quando algo dá errado',
          'Conversa direta com quem fez, sem intermediário',
          'Passa por atendimento, e demora mais para chegar em quem fez',
        ],
        [
          'Arquivos, acessos e projeto editável',
          'Combinado caso a caso, e esquecido com frequência',
          'Previsto em contrato, e nem sempre a favor de quem contrata',
        ],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o freelancer ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Custo por peça.** Sem estrutura para sustentar, o valor cobrado tende a ficar perto do trabalho executado, não de uma tabela de escopo.',
        '**Acesso direto a quem executa.** O ajuste é dito para quem vai fazer, e não para alguém que vai repassar. Encurta a distância entre "não ficou bom" e a correção.',
        '**Escopo pequeno e bem definido.** Quatro vídeos por mês, um formato só, um assunto só: montar contrato de agência para isso é comprar coordenação que você não vai usar.',
        '**Especialidade rara.** Motion, sound design, um nicho técnico. Quem faz uma coisa muito bem costuma trabalhar por conta própria, e você contrata aquilo.',
        '**Reversibilidade.** Um teste de três meses com freelancer é fácil de encerrar; contrato de agência costuma ter aviso prévio e escopo mínimo.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a agência ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Continuidade.** Alguém adoece, alguém sai, alguém tira férias — e a entrega da semana continua acontecendo. Numa operação de conteúdo, essa é a diferença entre um perfil que publica e um que publicava.',
        '**Cadeia completa num contrato só.** Roteiro, gravação, edição, legenda e capa não precisam ser costurados por você a cada peça.',
        '**Processo escrito.** Padrão de abertura, de corte, de legenda e de capa documentados — o que faz a peça número quarenta parecer irmã da número três.',
        '**Alguém revisa antes de você.** Numa estrutura a peça passa por outra pessoa antes de chegar ao cliente, e parte dos erros morre ali. Com fornecedor único, o primeiro revisor é você.',
        '**Responsabilidade contratual.** Prazo, entregável e refação estão escritos, e há a quem cobrar quando não acontecem. Com uma pessoa só, a cobrança é sempre pessoal.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O critério de desempate é o volume combinado com a tolerância a falha. Poucas peças por mês e prazo folgado: um freelancer entrega isso melhor e mais barato. Publicação em rotina, com data que não pode escorregar, exige alguém que cubra o dia em que a pessoa não pode — e isso é estrutura, não pessoa. Entre os dois extremos há o arranjo mais comum: um freelancer fixo para o que é criativo e variável, e um fornecedor de volume para o que é repetitivo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os custos que não aparecem em nenhuma das duas propostas',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Do lado do freelancer, o custo escondido é o seu tempo. Selecionar, testar, escrever briefing, alinhar tom, revisar, pedir ajuste, lembrar do prazo, resolver o mês em que ele sumiu. Some as horas de quem faz isso na sua empresa e compare com a economia da proposta — a conta muda de sinal com frequência, e não aparece em planilha nenhuma porque ninguém emite nota por ela.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Do lado da agência, o custo escondido é a **distância**. O time que atende você atende outros, e nem sempre é o mesmo do mês passado. Quanto mais degraus entre quem decide e quem executa, mais informação se perde no caminho — e mais reuniões existem para recuperar o que se perdeu.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que negociar, seja qual for a escolha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Volume por mês, em peças publicáveis.** Não em horas, não em reuniões, não em "posts": peças prontas para publicar.',
        '**Prazo de refação.** Quantas rodadas de ajuste estão incluídas e em quanto tempo elas voltam.',
        '**Propriedade dos arquivos.** Bruto, projeto editável, capa e legenda são seus, e ficam com você no dia em que o contrato acabar.',
        '**Acessos.** Perfil, gerenciador, banco de arquivos e senhas em nome da empresa, nunca em nome do fornecedor.',
        '**Plano de saída.** O que acontece nos trinta dias seguintes ao fim do contrato. Sem isso, trocar de fornecedor significa parar de publicar.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'A Doxa não é nenhuma das duas. Não é agência — não há equipe de gravação, estúdio nem calendário editorial do lado do cliente — e também não é um freelancer que você coordena: o que chega é o arquivo do vídeo pronto para postar, vertical e legendado, cada peça única, com roteiro, voz, edição e capa. Quem publica no perfil continua sendo a empresa. Ela também não vende curso, ferramenta nem assinatura de software.',
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
          pergunta: 'Quantos freelancers são necessários para manter um perfil publicando toda semana?',
          resposta:
            'Depende de quanto uma pessoa acumula, e a resposta honesta é: na prática, mais de um. Pauta e roteiro são um trabalho; gravação é outro; edição, legenda e capa são outro; publicar e responder comentário é outro ainda. Um profissional muito completo cobre duas dessas frentes com qualidade — quem tenta cobrir as quatro costuma entregar bem uma e mediana as outras.',
        },
        {
          pergunta: 'Como avaliar um freelancer antes de fechar?',
          resposta:
            'Peça exemplos publicados, não portfólio montado — e os de um cliente com o mesmo problema que o seu, não o melhor de todos. Combine um piloto pago e curto, com prazo e entregável definidos, para ver como a pessoa reage a um ajuste. O que se testa não é talento: é previsibilidade.',
        },
        {
          pergunta: 'Agência pequena é a mesma coisa que um freelancer?',
          resposta:
            'Não, e a diferença que importa é a cobertura: uma agência de três pessoas ainda tem quem substitua quem faltou, e um freelancer não tem. O que costuma sumir na agência pequena é o processo escrito — o padrão vive na cabeça dos sócios. Vale perguntar quem executa de fato e o que acontece na semana em que essa pessoa não puder.',
        },
        {
          pergunta: 'Dá para usar os dois ao mesmo tempo?',
          resposta:
            'Dá, e é o arranjo que mais se vê quando o volume aperta: a estrutura cuida do que se repete toda semana, e o freelancer entra no que é pontual. A condição é uma só — deixar claro quem é dono do padrão. Dois fornecedores com liberdade editorial igual produzem um perfil com duas vozes.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Em uma frase',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Contrate um freelancer quando há tempo para coordenar e o volume é pequeno; contrate estrutura quando a data de publicação não pode depender da agenda de uma pessoa.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: uma pessoa executando uma habilidade
 *          contra uma estrutura coordenando várias, e a conta que decide.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§1 e §2):
 *          não é agência, não vende curso/ferramenta/assinatura, entrega o
 *          vídeo pronto para postar, cada vídeo é único, retorno em 24 horas.
 * [x]  3. Nada da §9: sem valor de hora, sem fee, sem salário, sem preço da
 *          Doxa, sem "agência licenciada".
 * [x]  4. Termos proibidos ausentes: a Doxa não se autodefine como agência —
 *          a página afirma o contrário, com a redação pública do `llms.txt`.
 * [x]  5. A garantia não é citada nesta página.
 * [x]  6. Intenção própria: DEPOIS de decidir terceirizar, pessoa ou estrutura.
 *          `agencia-vs-equipe-interna` decide antes: dentro ou fora.
 * [x]  7. Informação incremental: a tabela de oito critérios que aquela página
 *          não tem, os dois custos escondidos e a lista do que negociar.
 * [x]  8. title exclusivo (53 caracteres), description 120–160, H1 único,
 *          H2 em hierarquia real.
 * [x]  9. Hub de marketing orgânico; links para o comparativo anterior, a dor
 *          de produzir sem equipe, a solução de escala e a adjacência §47.
 * [x] 10. IMPARCIAL: cinco vantagens de cada lado, custo escondido dos dois, e
 *          a Doxa aparece UMA vez, no fim, dizendo que não é nenhuma das duas.
 * [x] 11. CTA único, no fecho, condicionado ao gargalo de produção.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "pronto para postar", "vertical", "legendado",
 *          "auditoria estratégica".
 * [x] 14. Teste final (§45): publicaria com o Google desligado — a lista do
 *          que negociar é o que falta em quase toda página deste assunto.
 * ────────────────────────────────────────────────────────────────────────── */
