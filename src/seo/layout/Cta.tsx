import type { ReactElement } from 'react';
import { CTA_PADRAO, HREF_CTA } from '../site';
import type { Cta as DadosCta } from '../tipos';
import { Inline } from './Blocos';

/**
 * O fecho de toda página SEO.
 *
 * Um destino só, e é o formulário da landing (`/#forms`). O funil da Doxa
 * termina em conversa humana; inventar um segundo caminho aqui significaria
 * inventar um segundo processo, que não existe.
 *
 * A página pode escrever o próprio texto (`Pagina.cta`) porque um CTA de guia
 * e um CTA de página de solução falam com pessoas em pontos diferentes do funil
 * (§33). Sem o campo, entra o padrão — nunca uma página sem próximo passo.
 */
export function Cta({ dados }: { dados?: DadosCta }): ReactElement {
  const { texto, rotulo } = dados ?? CTA_PADRAO;
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-5 pt-16 md:px-10">
      <div className="rounded-2xl border border-white/20 bg-doxa-raised p-6 md:p-10">
        {/* Por `Inline`, como todo campo `texto` do contrato: `tipos.ts` promete
            `**negrito**` e `[rótulo](/rota)` em TODOS eles, e um que renderiza
            cru mostra os asteriscos na tela do fecho de toda página. */}
        <p className="max-w-2xl font-serif text-2xl leading-snug text-white md:text-3xl">
          <Inline texto={texto} />
        </p>
        <a
          href={HREF_CTA}
          className="mt-6 inline-flex items-center rounded-full bg-white px-7 py-3 text-[15px] font-bold text-black transition-colors hover:bg-white/85"
        >
          {rotulo}
        </a>
      </div>
    </section>
  );
}
