/**
 * ─── O ESTADO DA ÁREA DA EQUIPE ──────────────────────────────────────────────
 *
 * A lista de convites e a de versões, carregadas juntas e recarregáveis por
 * qualquer tela. Os componentes recebem valores prontos e devolvem intenções.
 *
 * A separação paga na hora do teste: a derivação (filtrar, buscar, contar,
 * paginar) é função pura em `filtrar.ts`, e este arquivo só a costura ao React.
 */
import { useCallback, useEffect, useState } from 'react';
import { listarConvites, listarVersoes } from './dados';
import type { ConviteLinha, VersaoLinha } from '../tipos';

export type Carga = 'carregando' | 'pronto' | 'erro' | 'sessao';

/** Quantos convites por página. Doze cabe numa tela de trabalho sem rolar. */
export const POR_PAGINA = 12;

/** O que qualquer tela recebe para saber o estado do carregamento. */
export interface EstadoDoPainel {
  convites: ConviteLinha[];
  versoes: VersaoLinha[];
  /** A versão que os convites novos recebem. `null` enquanto nada foi publicado. */
  vigente: VersaoLinha | null;
  carga: Carga;
  erro: string | null;
  recarregar: () => Promise<void>;
}

/** A mensagem de um problema qualquer, sem `any` e sem adivinhação. */
export function mensagemDe(problema: unknown): string {
  return problema instanceof Error ? problema.message : 'Não deu para falar com o servidor.';
}

export function usarAdmin(): EstadoDoPainel {
  const [convites, setConvites] = useState<ConviteLinha[]>([]);
  const [versoes, setVersoes] = useState<VersaoLinha[]>([]);
  const [carga, setCarga] = useState<Carga>('carregando');
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarga('carregando');
    setErro(null);
    try {
      // As duas juntas: a lista de convites sem os números das versões mostra
      // "v?" em toda linha, e esperar uma depois da outra dobra a espera.
      const [listaDeConvites, listaDeVersoes] = await Promise.all([
        listarConvites(),
        listarVersoes(),
      ]);
      setConvites(listaDeConvites);
      setVersoes(listaDeVersoes);
      setCarga('pronto');
    } catch (problema) {
      // Sessão vencida não é erro de rede: uma manda pedir a senha de novo, a
      // outra manda tentar outra vez. Tratá-las igual faria o painel oferecer
      // "tentar de novo" para quem só precisa entrar.
      const mensagem = mensagemDe(problema);
      setCarga(mensagem === 'sessao' ? 'sessao' : 'erro');
      setErro(mensagem === 'sessao' ? null : mensagem);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return {
    convites,
    versoes,
    vigente: versoes.find((versao) => versao.status === 'publicada') ?? null,
    carga,
    erro,
    recarregar: carregar,
  };
}
