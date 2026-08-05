/**
 * Conteúdo do dono da seção de comparação. Tudo que é número ou texto de
 * negócio mora aqui — o resto dos arquivos só sabe desenhar.
 */

/**
 * O inventário do jeito antigo, escrito como a conta de quem paga.
 *
 * Cada linha começa com o artigo — "um video maker", "uma câmera" — e é o dono
 * quem pediu assim. A diferença não é estilística: "Video maker" é uma
 * categoria de equipamento, "Um video maker" é uma contratação. A lista tem de
 * doer no bolso de quem lê, e o que dói é a unidade, não o inventário.
 *
 * PENDENTE-DONO: a lista é minha, montada a partir do que ele ditou (video
 * maker, roteirista, editor, estúdio, gravação, agência, tráfego) e estendida
 * para o resto do que a conta inclui. Vale revisão item a item — cada linha é
 * uma afirmação sobre o custo de outra empresa, e uma que não se sustenta
 * contamina as outras vinte e quatro.
 *
 * A QUANTIDADE é o argumento, e é ela que a página mostra. O dono pediu para
 * vincular os itens aos valores; enquanto ele não passar a quebra por item ou
 * por grupo, o vínculo é feito pelo total, que fica no alto, ao lado da
 * pergunta. Preço por item aqui seria inventado, e o próprio repositório já tem
 * a regra escrita: número inventado num comparativo destrói a seção inteira.
 */
export const ITENS: readonly string[] = [
  'Um video maker.',
  'Um roteirista.',
  'Um editor de vídeo.',
  'Um social media.',
  'Um diretor de criação.',
  'Uma câmera.',
  'Lentes.',
  'Um tripé.',
  'Um microfone de lapela.',
  'Um estabilizador.',
  'Cartões de memória.',
  'Um estúdio.',
  'Iluminação.',
  'Um cenário.',
  'Horas de gravação.',
  'Uma ilha de edição.',
  'Licença de edição.',
  'Banco de trilhas.',
  'Banco de imagens.',
  'Legendagem.',
  'Uma agência.',
  'Um gestor de tráfego.',
  'Verba de tráfego pago.',
  'Um calendário editorial.',
  'Relatórios.',
];

/**
 * A última linha, e a única que não se compra.
 *
 * Fica fora da lista e em creme: as outras são fornecedores e contas, esta é a
 * pessoa que está lendo. É o item que nenhum dos vinte e cinco resolve.
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
