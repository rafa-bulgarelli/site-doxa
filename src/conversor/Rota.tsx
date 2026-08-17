/**
 * ─── A ROTA DO CONVERSOR (esqueleto) ─────────────────────────────────────────
 *
 * O ponto de entrada de tudo que mora sob a `ROTA_BASE` do conversor. Hoje ele
 * é uma tela honesta de "em construção", e é de propósito: o `App` já carrega
 * este arquivo de forma preguiçosa, e ele precisa EXISTIR para o `lazy`
 * compilar enquanto a página de verdade é escrita noutra branch.
 *
 * A track da página REESCREVE este arquivo inteiro. Não construa nada em cima
 * do que está aqui — o que vale deste arquivo é o caminho e o `export default`.
 */

export function Rota() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-doxa-bg px-6">
      <p className="text-center text-sm uppercase tracking-[0.2em] text-white/60">
        Conversor — em construção
      </p>
    </main>
  );
}

export default Rota;
