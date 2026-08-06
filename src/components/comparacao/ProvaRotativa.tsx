import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { REELS } from '../proof/reels';

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
 */
function Perfil({ handle, verificado }: { handle: string; verificado: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-[#0B0B0B]">
      {handle.startsWith('@') ? handle : `@${handle.toLowerCase()}`}
      {verificado && <BadgeCheck className="h-4 w-4 shrink-0 text-black/45" strokeWidth={2} />}
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
export function ProvaRotativa() {
  const parado = useReducedMotion() === true;
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (parado || COM_NUMERO.length < 2) return;
    const relogio = window.setInterval(() => {
      setIndice((atual) => (atual + 1) % COM_NUMERO.length);
    }, TURNO);
    return () => window.clearInterval(relogio);
  }, [parado]);

  if (COM_NUMERO.length === 0) return null;

  const atual = COM_NUMERO[indice];

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {/* Caixa normal, a pedido do dono: em versalete o rótulo grita mais alto
          que o dado que ele apresenta, e é o dado que interessa. */}
      <span className="text-[12px] tracking-[0.06em] text-black/35">Já publicados</span>

      {/* Parado, a faixa não vira uma lista: ela mostra o primeiro e fica. Quem
          pediu menos movimento pediu menos movimento, não menos informação — e a
          lista inteira já está na parede de prova, uma seção acima. */}
      {parado ? (
        <span className="text-[15px] text-black/60">
          <Perfil handle={atual.handle} verificado={atual.verified} /> · {atual.views} de views
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
            className="text-[15px] text-black/60"
          >
            <Perfil handle={atual.handle} verificado={atual.verified} /> · {atual.views} de views
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}
