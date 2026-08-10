/**
 * ─── O ESTADO DA CENTRAL ─────────────────────────────────────────────────────
 *
 * Tudo que a página precisa saber, num lugar só: a lista, os estados de carga,
 * o filtro, a busca, a aba e a paginação. Os componentes recebem valores
 * prontos e devolvem intenções — nenhum deles calcula nada.
 *
 * A separação paga na hora do teste: a derivação (filtrar, buscar, contar,
 * paginar) é função pura em `filtrar.ts`, e este arquivo só a costura ao React.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { baixarCsv } from './csv';
import { listarLeads, marcarBaixados } from './deposito';
import { derivar, type Aba, type Ordem } from './filtrar';
import type { Lead } from './tipos';

export type Carga = 'carregando' | 'pronto' | 'erro' | 'sessao';

/** Quantos leads por página. Dez é o da referência, e cabe numa tela sem rolar. */
export const POR_PAGINA = 10;

export function usarLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carga, setCarga] = useState<Carga>('carregando');
  const [aba, setAba] = useState<Aba>('disponiveis');
  const [busca, setBusca] = useState('');
  const [origem, setOrigem] = useState('todas');
  const [ordem, setOrdem] = useState<Ordem>('recentes');
  const [mostrarCortados, setMostrarCortados] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [exportando, setExportando] = useState(false);

  const carregar = useCallback(async () => {
    setCarga('carregando');
    try {
      setLeads(await listarLeads());
      setCarga('pronto');
    } catch (erro) {
      // Sessão vencida não é erro de rede: uma manda pedir a senha de novo, a
      // outra manda tentar outra vez. Tratá-las igual faria o painel oferecer
      // "tentar de novo" para quem só precisa entrar.
      setCarga((erro as Error).message === 'sessao' ? 'sessao' : 'erro');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // Qualquer mexida no filtro volta para a primeira página: manter a página
  // sete depois de uma busca que devolve três resultados mostra uma tela vazia
  // que parece defeito.
  useEffect(() => {
    setPagina(1);
  }, [aba, busca, origem, ordem, mostrarCortados]);

  const visao = useMemo(
    () => derivar(leads, { aba, busca, origem, ordem, mostrarCortados, pagina, porPagina: POR_PAGINA }),
    [leads, aba, busca, origem, ordem, mostrarCortados, pagina],
  );

  /**
   * Exporta o que está FILTRADO, e marca como baixado o que saiu.
   *
   * O filtrado e não a página: quem buscou "advocacia" e exportou espera o
   * arquivo com os advogados todos, não com os dez primeiros. E não a base
   * inteira: exportar o que não está na tela é a forma mais fácil de vazar
   * lead sem perceber.
   *
   * A marcação é otimista na tela e confirmada no banco depois. Se o banco
   * recusar, a lista é recarregada e a verdade volta — o que não pode acontecer
   * é a pessoa ficar olhando um botão girando depois de o arquivo já ter caído
   * na pasta dela.
   */
  const exportar = useCallback(async () => {
    const alvo = visao.filtrados;
    if (alvo.length === 0) return;
    setExportando(true);
    baixarCsv(alvo);

    const novos = alvo.filter((l) => !l.baixado).map((l) => l.id);
    const agora = new Date().toISOString();
    setLeads((atuais) =>
      atuais.map((l) =>
        novos.includes(l.id) ? { ...l, baixado: true, baixado_em: agora } : l,
      ),
    );
    try {
      await marcarBaixados(novos);
    } catch {
      await carregar();
    } finally {
      setExportando(false);
    }
  }, [visao.filtrados, carregar]);

  return {
    carga,
    ...visao,
    aba,
    setAba,
    busca,
    setBusca,
    origem,
    setOrigem,
    ordem,
    setOrdem,
    mostrarCortados,
    setMostrarCortados,
    /* `pagina` NÃO volta daqui: quem manda é a de `derivar`, que já vem
       limitada ao número de páginas que existem. Devolvendo a do estado, ela
       venceria por vir depois no objeto — e a tela mostraria "Página 7 de 2"
       no instante entre um filtro novo e o efeito que devolve para a primeira. */
    setPagina,
    exportando,
    exportar,
    recarregar: carregar,
  };
}
