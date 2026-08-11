import { useEffect, useState } from 'react';
import { usarNaTela } from '../../hooks/usarNaTela';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { REELS } from '../proof/reels';
import { numeroNoIdioma, useIdioma, type PorIdioma } from '../../idioma';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Quanto cada cliente fica em cena, em milissegundos. */
const TURNO = 3400;

/**
 * Os clientes que têm número para mostrar.
 *
 * Filtrado, e não escrito à mão: a parede de prova é a mesma fonte, e um perfil
 * sem views declaradas entra nela como cartaz e sairia daqui como uma linha
 * vazia. Quando os arquivos que faltam chegarem em `reels.ts`, esta faixa cresce
 * sozinha e ninguém precisa lembrar dela.
 */
const COM_NUMERO = REELS.filter((reel) => reel.views != null);

/**
 * O perfil, sempre com arroba e com o selo quando ele existe.
 *
 * O dono pediu a arroba em todos, e um dos registros de `reels.ts` guarda o nome
 * comercial em vez do usuário ("Magalu"). Prefixar aqui é o conserto de exibição
 * — inventar o usuário de um perfil real seria mandar quem clica para um lugar
 * que talvez não exista.
 *
 * O selo é o mesmo que a parede de prova mostra, e vem do mesmo campo: é uma
 * afirmação sobre a conta de outra pessoa, e só aparece onde o dado diz que a
 * plataforma a concedeu.
 *
 * Azul, e é o mesmo `#3897f0` da parede de prova — a única cor que a página
 * inteira aceita fora dos assets, porque não é decoração nossa: é a marca de uma
 * plataforma, e um selo de verificado em cinza não é um selo de verificado. O
 * check por dentro sai em papel, e não em preto como lá: aqui o selo está sobre
 * creme, e é assim que o feed o desenha.
 */
function Perfil({ handle, verificado }: { handle: string; verificado: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-[#0B0B0B]">
      {handle.startsWith('@') ? handle : `@${handle.toLowerCase()}`}
      {verificado && (
        <BadgeCheck
          className="h-4 w-4 shrink-0 fill-[#3897f0] text-[#F4F1E8]"
          strokeWidth={2}
        />
      )}
    </span>
  );
}

/**
 * A prova, embaixo do argumento: quem já publicou e o que aquilo fez.
 *
 * PENDENTE-DONO: o dono pediu "depoimento de cliente" aqui. Depoimento é frase
 * atribuída a uma pessoa, e o repositório não tem nenhuma — inventar uma seria
 * escrever na boca de um cliente real. O que existe são os posts e os números
 * deles, que é a mesma prova sem a parte fabricada: se os depoimentos chegarem,
 * eles entram neste lugar e o desenho não muda.
 *
 * Um por vez, alternando. É a rima com o rotador do hero, e serve à mesma coisa
 * que ele: um movimento pequeno num bloco de texto parado, para o olho ter onde
 * pousar depois de terminar a leitura — e é justo aqui que ele termina, ao lado
 * do fio que sai para o formulário.
 */
const TEXTO_PROVA_ROTATIVA: PorIdioma<{ jaPublicados: string; deViews: string }> = {
  pt: { jaPublicados: 'Já publicados', deViews: 'de views' },
  en: { jaPublicados: 'Already published', deViews: 'views' },
  es: { jaPublicados: 'Já publicados', deViews: 'de views' },
};

export function ProvaRotativa() {
  const [idioma] = useIdioma();
  const textoProva = TEXTO_PROVA_ROTATIVA[idioma];

  const parado = useReducedMotion() === true;
  const [indice, setIndice] = useState(0);
  const [caixa, setCaixa] = useState<HTMLDivElement | null>(null);
  const naTela = usarNaTela(caixa);

  /* Fora da tela o turno não corre. A faixa fica no cliente em que estava e
     recomeça a contar quando volta a ser vista — trocar de cliente para uma
     tela que ninguém está olhando é trabalho que só aparece na conta da CPU. */
  useEffect(() => {
    if (parado || !naTela || COM_NUMERO.length < 2) return;
    const relogio = window.setInterval(() => {
      setIndice((atual) => (atual + 1) % COM_NUMERO.length);
    }, TURNO);
    return () => window.clearInterval(relogio);
  }, [parado, naTela]);

  if (COM_NUMERO.length === 0) return null;

  const atual = COM_NUMERO[indice];

  return (
    <div ref={setCaixa} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {/* Caixa normal, a pedido do dono: em versalete o rótulo grita mais alto
          que o dado que ele apresenta, e é o dado que interessa. */}
      <span className="text-[12px] font-medium tracking-[0.06em] text-black/60">{textoProva.jaPublicados}</span>

      {/* Parado, a faixa não vira uma lista: ela mostra o primeiro e fica. Quem
          pediu menos movimento pediu menos movimento, não menos informação — e a
          lista inteira já está na parede de prova, uma seção acima. */}
      {parado ? (
        <span className="text-[15px] text-black/75">
          <Perfil handle={atual.handle} verificado={atual.verified} /> · {numeroNoIdioma(atual.views ?? '', idioma)} {textoProva.deViews}
        </span>
      ) : (
        // `mode="wait"`: os dois cruzando no mesmo lugar viram um borrão de duas
        // arrobas, e a linha é curta demais para o olho separar.
        <AnimatePresence mode="wait">
          <motion.span
            key={atual.handle}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="text-[15px] text-black/75"
          >
            <Perfil handle={atual.handle} verificado={atual.verified} /> · {numeroNoIdioma(atual.views ?? '', idioma)} {textoProva.deViews}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}
