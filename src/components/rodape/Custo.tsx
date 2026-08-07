import { CUSTO_UNIDADE, type Item } from '../comparacao/config';
import { Icone } from '../comparacao/icones';
import { estiloDoLugar, type Lugar } from './config';

interface CustoProps {
  item: Item;
  /** O custo mensal, ou `null` enquanto o dono não tiver dado o número. */
  custo: number | null;
  lugar: Lugar;
}

/**
 * Um cartão de custo: uma das contratações que a Doxa substitui.
 *
 * ─── POR QUE ELE TEM A FORMA DE UM REEL ──────────────────────────────────────
 *
 * Mesma proporção 9:16, mesmo canto de 12px, mesmo fio de branco a 14% das
 * molduras de vídeo. Não é economia de CSS: o ritmo do mosaico depende de todas
 * as peças medirem a mesma coisa — uma peça de outra altura desalinharia a
 * coluna inteira e a emenda do infinito apareceria. E há o argumento: o cartão
 * está no lugar de um vídeo, e ele diz exatamente isso ao ocupar a vaga de um.
 *
 * A cor do item pinta o alto da peça e o ícone, e é a mesma cor com que ele
 * aparece na ladainha da comparação. É o que liga as duas seções sem repetir
 * uma palavra: quem viu a lista lá reconhece o item aqui pela cor.
 *
 * ─── E O NÚMERO PODE NÃO EXISTIR ─────────────────────────────────────────────
 *
 * `custo` é `null` enquanto `CUSTO_POR_ITEM` não tiver a linha daquele item, e
 * o cartão então mostra só o nome. É deliberado, e a nota inteira está em
 * `comparacao/config.ts`: um preço inventado aqui é uma afirmação sobre o custo
 * de outra empresa, publicada no último objeto da página. Nome sem número é
 * verdade incompleta; número errado é a outra coisa.
 */
export function Custo({ item, custo, lugar }: CustoProps) {
  return (
    <div
      style={estiloDoLugar(lugar)}
      className="relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-xl border border-white/[0.14] bg-doxa-raised p-2.5 md:p-3"
    >
      {/* O clarão da cor do item, do alto para o meio. Fraco de propósito: o
          campo inteiro está atrás de um véu preto a 65%, e um fundo forte aqui
          faria o cartão saltar do mosaico em vez de pertencer a ele. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(120% 70% at 50% 0%, ${item.cor}2E, transparent 72%)` }}
      />

      <span className="relative" style={{ color: item.cor }}>
        <Icone nome={item.icone} className="h-6 w-6 md:h-7 md:w-7" />
      </span>

      <div className="relative">
        <p className="font-serif text-[14px] leading-[1.15] text-[#F4F1E8] md:text-[17px]">
          {item.nome}
        </p>
        {custo != null && (
          <p className="mt-1 font-ui text-[11px] leading-none tabular-nums text-white/55 md:text-[12px]">
            R$ {custo.toLocaleString('pt-BR')}
            {CUSTO_UNIDADE}
          </p>
        )}
      </div>
    </div>
  );
}
