/**
 * ─── OS TERMOS DE USO ────────────────────────────────────────────────────────
 *
 * O detalhe contratual inteiro, num documento só, atrás de um botão na revisão
 * final. Foi a troca que o dono pediu: o caminho explica e cobra oito itens, e
 * a letra do contrato mora aqui — em vez de virar mais trinta caixas de aceite
 * que ninguém lê.
 *
 * Isto NÃO é "esconder o contrato". A declaração final diz, no texto da própria
 * versão, que estes termos fazem parte do que está sendo aceito; o PDF os
 * imprime por inteiro; e o hash do conteúdo cobre tudo. O que mudou foi a
 * leitura, não a prova.
 *
 * Por isso a tipografia daqui é a de documento, não a de interface: corpo de
 * 17px, linha larga, e o texto em branco de verdade — `doxa-muted` num
 * parágrafo contratual seria exatamente a letra miúda que o dono mandou tirar.
 */
import { Fio, Rotulo } from './pecas';
import { regrasEmOrdem } from './maquina';
import type { Secao } from '../tipos';

/**
 * O documento aberto.
 *
 * A rolagem é da PÁGINA, não de uma caixa interna: caixa com rolagem própria no
 * celular rouba o gesto do polegar e é onde as pessoas desistem de ler.
 */
export function DocumentoDeTermos({ secao }: { secao: Secao }) {
  return (
    <article className="rounded-3xl border border-doxa-line bg-doxa-surface p-6 sm:p-8">
      <Fio />
      <div className="mt-4">
        <Rotulo>{secao.titulo}</Rotulo>
      </div>
      <p className="mt-3 text-[17px] leading-[1.7] text-white/65">{secao.descricao}</p>
      <div className="mt-7 space-y-7">
        {regrasEmOrdem(secao).map((regra, indice) => (
          <section key={regra.id}>
            {/* Serifa também no documento: ele é a letra do contrato, mas
                continua sendo o mesmo manual — tipografia de sistema aqui
                dentro faria a última tela parecer de outro site. */}
            <h3 className="font-serif text-[22px] leading-[1.25] text-white sm:text-[24px]">
              {indice + 1}. {regra.titulo}
            </h3>
            <p className="mt-3 whitespace-pre-line text-[17px] leading-[1.75] text-white/80">
              {regra.instrucao}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
