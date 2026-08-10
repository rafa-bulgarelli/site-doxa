import { useEffect, useState } from 'react';
import { useIdioma, type PorIdioma } from '../../idioma';

/**
 * ─── O RELÓGIO DO CABEÇALHO ──────────────────────────────────────────────────
 *
 * A hora de São Paulo e um ponto verde, ao lado do logo.
 *
 * Ele não é enfeite de espaço vazio, embora tenha nascido de um: o cabeçalho
 * ficou com dois elementos e um deserto entre eles depois que os botões saíram.
 * O que ele faz é dizer que existe alguém do outro lado. Um site de serviço
 * vendido por conversa vive disso — "estamos aqui, é esta hora aqui" é a coisa
 * mais barata de provar e a mais difícil de fingir.
 *
 * É também para onde foi o sinal verde que estava na pílula. Lá ele competia
 * com o menu e engordava a peça; aqui ele é a única coisa que se move num canto
 * que estava parado.
 *
 * ─── SOME NO CELULAR, E ISSO É O PROJETO ─────────────────────────────────────
 *
 * `hidden md:flex`. Num telefone o cabeçalho é logo e menu, e não há deserto
 * nenhum para ocupar — enfiar uma terceira coisa em 320 px de largura é
 * desfazer justamente a limpeza que o dono pediu.
 */

/** Onde a Doxa está. Fuso IANA, não deslocamento fixo: o horário de verão
 *  brasileiro está suspenso, mas quem decide isso é a base de fusos e não nós. */
const FUSO = 'America/Sao_Paulo';
const CIDADE = 'São Paulo';

const NO_AR: PorIdioma<string> = {
  pt: 'no ar',
  en: 'live',
  es: 'en vivo',
};

/**
 * A hora corrente, redesenhada uma vez por minuto.
 *
 * O relógio se acerta com o RELÓGIO, e não com um intervalo fixo: um
 * `setInterval(60000)` disparado às 14:32:47 marca 14:33 só às 14:33:47, quase
 * um minuto atrasado, e o erro nunca se corrige — ele fica. Aqui cada espera é
 * calculada até a virada seguinte, então o número troca junto com o minuto.
 *
 * Com a aba escondida o navegador estrangula os temporizadores e a hora
 * congela. Reagir ao `visibilitychange` é o que a traz de volta certa no
 * instante em que alguém olha, em vez de mostrar um minuto velho até o próximo
 * disparo.
 */
function useHora(idioma: string) {
  const formatar = () =>
    new Intl.DateTimeFormat(idioma, {
      timeZone: FUSO,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());

  const [hora, setHora] = useState(formatar);

  useEffect(() => {
    let relogio: ReturnType<typeof setTimeout>;

    const agendar = () => {
      setHora(formatar());
      const agora = new Date();
      const ateAViradar = 60_000 - (agora.getSeconds() * 1000 + agora.getMilliseconds());
      relogio = setTimeout(agendar, ateAViradar);
    };

    agendar();
    const aoVoltar = () => {
      if (!document.hidden) {
        clearTimeout(relogio);
        agendar();
      }
    };
    document.addEventListener('visibilitychange', aoVoltar);
    return () => {
      clearTimeout(relogio);
      document.removeEventListener('visibilitychange', aoVoltar);
    };
    // `idioma` decide o formato; `formatar` é recriado a cada renderização e
    // depender dele reagendaria o relógio sem motivo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idioma]);

  return hora;
}

export function Relogio() {
  const [idioma] = useIdioma();
  const hora = useHora(idioma);

  return (
    <div className="hidden items-center gap-4 md:flex">
      {/* O traço é o que faz o bloco pertencer ao logo em vez de flutuar ao lado
          dele. Sem ele, duas coisas soltas na esquerda leem como desalinho. */}
      <span aria-hidden className="h-8 w-px bg-white/[0.11]" />
      <div className="flex flex-col gap-px leading-none">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/35">
          {CIDADE}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/60">
          {/* `tabular-nums` porque os dígitos de largura variável fazem a linha
              inteira tremer quando o minuto vira de 1 para 2. */}
          <time className="tabular-nums">{hora}</time>
          <span aria-hidden className="text-white/20">
            ·
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-doxa-sinal" />
            {NO_AR[idioma]}
          </span>
        </span>
      </div>
    </div>
  );
}
