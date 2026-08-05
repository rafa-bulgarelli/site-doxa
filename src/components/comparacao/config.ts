/**
 * Conteúdo do dono da seção de comparação. Tudo que é número ou texto de
 * negócio mora aqui — o resto dos arquivos só sabe desenhar.
 */

export interface Item {
  /** Como o item aparece na ladainha, com o artigo. */
  nome: string;
  /** O nome do ícone no `lucide-react`, resolvido em `Ladainha.tsx`. */
  icone: string;
  /** O fundo da lâmina que segue o ponteiro. */
  cor: string;
  /**
   * PENDENTE-DONO: a foto da lâmina, quando existir.
   *
   * O dono pediu imagem seguindo o mouse. Não temos vinte e cinco fotos — as
   * únicas em `public/media/` são os reels dos clientes, que não têm nada a ver
   * com "uma câmera" ou "um roteirista". Enquanto elas não chegam, a lâmina é
   * ícone sobre cor, que é uma escolha e não um remendo: some o campo, entra a
   * `<img>` no mesmo lugar e nada mais muda.
   */
  imagem?: string;
}

/**
 * O inventário do jeito antigo, escrito como a conta de quem paga.
 *
 * Cada linha começa com o artigo — "um video maker", "uma câmera" — e é o dono
 * quem pediu assim. A diferença não é estilística: "Video maker" é uma categoria
 * de equipamento, "Um video maker" é uma contratação. A lista tem de doer no
 * bolso de quem lê, e o que dói é a unidade, não o inventário.
 *
 * PENDENTE-DONO: a lista é minha, montada a partir do que ele ditou e estendida
 * para o resto do que a conta inclui. Vale revisão item a item — cada linha é
 * uma afirmação sobre o custo de outra empresa, e uma que não se sustenta
 * contamina as outras vinte e quatro.
 *
 * As cores são a mesma família da seção: mesma faixa de luminosidade, croma
 * baixo. Cor no talo, vinte e cinco vezes, não teria hierarquia nenhuma.
 */
export const ITENS: readonly Item[] = [
  { nome: 'Um video maker.', icone: 'Video', cor: '#C25A3C' },
  { nome: 'Um roteirista.', icone: 'PenLine', cor: '#D8A13F' },
  { nome: 'Um editor de vídeo.', icone: 'Scissors', cor: '#5A8C63' },
  { nome: 'Um social media.', icone: 'AtSign', cor: '#43708F' },
  { nome: 'Um diretor de criação.', icone: 'Megaphone', cor: '#8E5F86' },
  { nome: 'Uma câmera.', icone: 'Camera', cor: '#B04B45' },
  { nome: 'Lentes.', icone: 'Aperture', cor: '#C7A98B' },
  { nome: 'Um tripé.', icone: 'Wrench', cor: '#5A8C63' },
  { nome: 'Um microfone de lapela.', icone: 'Mic', cor: '#43708F' },
  { nome: 'Um estabilizador.', icone: 'Move', cor: '#C25A3C' },
  { nome: 'Cartões de memória.', icone: 'HardDrive', cor: '#8E5F86' },
  { nome: 'Um estúdio.', icone: 'Building2', cor: '#D8A13F' },
  { nome: 'Iluminação.', icone: 'Lightbulb', cor: '#C7A98B' },
  { nome: 'Um cenário.', icone: 'Frame', cor: '#B04B45' },
  { nome: 'Horas de gravação.', icone: 'Timer', cor: '#43708F' },
  { nome: 'Uma ilha de edição.', icone: 'MonitorPlay', cor: '#5A8C63' },
  { nome: 'Licença de edição.', icone: 'KeyRound', cor: '#D8A13F' },
  { nome: 'Banco de trilhas.', icone: 'Music', cor: '#8E5F86' },
  { nome: 'Banco de imagens.', icone: 'ImageIcon', cor: '#C25A3C' },
  { nome: 'Legendagem.', icone: 'Subtitles', cor: '#C7A98B' },
  { nome: 'Uma agência.', icone: 'Users', cor: '#B04B45' },
  { nome: 'Um gestor de tráfego.', icone: 'Target', cor: '#43708F' },
  { nome: 'Verba de tráfego pago.', icone: 'Wallet', cor: '#5A8C63' },
  { nome: 'Um calendário editorial.', icone: 'CalendarDays', cor: '#D8A13F' },
  { nome: 'Relatórios.', icone: 'BarChart3', cor: '#8E5F86' },
];

/**
 * A última linha, e a única que não se compra.
 *
 * Fica fora da lista e em creme: as outras são fornecedores e contas, esta é a
 * pessoa que está lendo. É o item que nenhum dos vinte e cinco resolve.
 */
export const TEMPO: Item = { nome: 'E o seu tempo.', icone: 'Hourglass', cor: '#F4F1E8' };

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
