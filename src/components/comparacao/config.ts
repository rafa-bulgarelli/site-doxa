/**
 * Conteúdo do dono da seção de comparação. Tudo que é número ou texto de
 * negócio mora aqui — o resto dos arquivos só sabe desenhar.
 */

export interface Grupo {
  nome: string;
  itens: readonly string[];
}

/**
 * O inventário do jeito antigo: tudo que uma empresa precisa juntar para
 * publicar vídeo com constância.
 *
 * PENDENTE-DONO: a lista é minha, montada a partir do que ele ditou (video
 * maker, roteirista, editor, estúdio, gravação, agência, tráfego) e estendida
 * para o resto do que a conta realmente inclui. Vale a revisão dele item a item
 * — cada linha aqui é uma afirmação sobre o custo de outra empresa, e uma linha
 * que não se sustenta contamina as outras vinte e quatro.
 *
 * A QUANTIDADE é o argumento. A seção não pede que ninguém leia os vinte e
 * cinco: pede que a pessoa veja que são vinte e cinco. Por isso o número é
 * contado do array e nunca escrito à mão — acrescentar uma linha muda o título
 * junto.
 */
export const INVENTARIO: readonly Grupo[] = [
  {
    nome: 'Equipe',
    itens: ['Video maker', 'Roteirista', 'Editor de vídeo', 'Social media', 'Diretor de criação'],
  },
  {
    nome: 'Equipamento',
    itens: [
      'Câmera',
      'Lentes',
      'Tripé',
      'Microfone de lapela',
      'Estabilizador',
      'Cartões de memória',
    ],
  },
  {
    nome: 'Estrutura',
    itens: ['Estúdio', 'Iluminação', 'Cenário', 'Horas de gravação', 'Ilha de edição'],
  },
  {
    nome: 'Software',
    itens: ['Licença de edição', 'Banco de trilhas', 'Banco de imagens', 'Legendagem'],
  },
  {
    nome: 'Marketing',
    itens: [
      'Agência',
      'Gestor de tráfego',
      'Verba de tráfego pago',
      'Calendário editorial',
      'Relatórios',
    ],
  },
];

/** Quantos itens o inventário tem, contados e nunca escritos à mão. */
export const TOTAL_ITENS = INVENTARIO.reduce((soma, grupo) => soma + grupo.itens.length, 0);

/**
 * A vigésima sexta linha, e a única que não se compra.
 *
 * Fica fora do `INVENTARIO` de propósito: as outras são fornecedores e contas, e
 * esta é a pessoa que está lendo. Ela fecha a lista porque é o item que nenhum
 * dos outros vinte e cinco resolve.
 */
export const TEMPO = 'E o seu tempo.';

/**
 * O custo do jeito antigo, resolvido pelo dono nesta rodada.
 *
 * Era a divergência mais cara do repositório — `semcom/config.ts` dizia
 * R$ 10.500 e esta seção dizia R$ 5.000 a 8.000. Os dois foram para a faixa
 * abaixo no mesmo commit. Se este número mudar de novo, os dois arquivos mudam
 * juntos: num comparativo o número é a coisa toda, e a página não pode dizer
 * dois valores para o mesmo custo.
 */
export const CUSTO = 'R$ 8.000 a 10.500';
export const CUSTO_UNIDADE = '/mês';

/**
 * A recorrência, dita duas vezes de propósito — no sufixo do número e aqui.
 *
 * Um custo mensal lido como se fosse único é a diferença entre a conta parecer
 * cara e parecer enorme. "Todo mês" é o que transforma um preço em uma sangria.
 */
export const RECORRENCIA = 'Todo mês. E de novo no mês seguinte.';

/**
 * As duas falas dos dois painéis.
 *
 * PENDENTE-DONO: reescrita minha da opção C do dono. "Quanto custa não ter
 * Doxa?" fazia a marca aparecer pelo negativo; assim a pergunta é sobre ELE. E
 * nenhuma das duas frases fala do produto: uma fala do custo dele, a outra do
 * desejo dele. A virada de preto para creme é que responde.
 */
export const PERGUNTA = ['Quanto custa', 'continuar assim?'];
export const CONVITE = 'Pronto para viralizar?';

/** O que se envia. É a única coisa que o cliente faz. */
export const ENVIO = 'Uma foto e um áudio. O resto é com a Doxa.';

/**
 * A garantia, copiada palavra por palavra do hero.
 *
 * Se a frase mudar, tem de mudar nos dois lugares no mesmo commit: duas versões
 * da mesma promessa leem como duas promessas, e uma delas vai parecer a letra
 * miúda da outra.
 */
export const GARANTIA = ['Um milhão de views.', 'Ou seu dinheiro de volta.'];

/** O que se ganha ao clicar, para o botão não ser um salto no escuro. */
export const CUSTO_DO_CLIQUE = 'Leva menos de um minuto.';
