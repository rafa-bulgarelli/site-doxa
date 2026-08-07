import {
  Aperture,
  AtSign,
  BarChart3,
  Building2,
  CalendarDays,
  Camera,
  Circle,
  Frame,
  HardDrive,
  Hourglass,
  ImageIcon,
  KeyRound,
  Lightbulb,
  Megaphone,
  Mic,
  MonitorPlay,
  Move,
  Music,
  PenLine,
  Scissors,
  Subtitles,
  Target,
  Timer,
  Users,
  Video,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/**
 * Os ícones dos itens do jeito antigo, e SÓ eles.
 *
 * Nomeados um a um de propósito. A primeira versão fazia `import * as icones` e
 * resolvia pelo nome em tempo de execução: elegante de escrever e catastrófico
 * de entregar — o bundle saltou de 104 para 239 quilobytes comprimidos, porque
 * um namespace inteiro impede o tree-shaking e as mil e quinhentas ilustrações
 * da `lucide` foram junto. Vinte e sete importações explícitas custam vinte e
 * sete ícones.
 *
 * O catálogo mora AQUI, e não na `Ladainha` onde nasceu, porque agora tem dois
 * leitores: a ladainha da comparação e os cartões de custo do rodapé. Duas
 * cópias da mesma tabela é como um item ganha ícone numa seção e um círculo
 * genérico na outra.
 */
const CATALOGO: Record<string, LucideIcon> = {
  Aperture,
  AtSign,
  BarChart3,
  Building2,
  CalendarDays,
  Camera,
  Frame,
  HardDrive,
  Hourglass,
  ImageIcon,
  KeyRound,
  Lightbulb,
  Megaphone,
  Mic,
  MonitorPlay,
  Move,
  Music,
  PenLine,
  Scissors,
  Subtitles,
  Target,
  Timer,
  Users,
  Video,
  Wallet,
  Wrench,
};

/**
 * Resolve o ícone pelo nome do `config`, com um genérico se o nome não existir.
 *
 * O genérico é de propósito e não um `throw`: um nome errado no conteúdo tira o
 * desenho de UM item, e derrubar a seção inteira por causa disso seria trocar
 * um defeito pequeno por um grande.
 */
export function Icone({ nome, className }: { nome: string; className?: string }) {
  const Desenho = CATALOGO[nome] ?? Circle;
  return <Desenho className={className} strokeWidth={1.25} />;
}
