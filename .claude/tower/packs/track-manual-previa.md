# Manual v2 — Track PRÉVIA: o fluxo inteiro dentro do admin (task_manual_previa)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
**A worktree do harness NÃO nasce na base desta track.** Rode:
`git checkout -B track/manual-previa feat/manual-v2-ui` e confirme com
`git log --oneline -3` que o topo é `c7f6885` ou além (fluxo2 e cenas JÁ
mergeados). `git status --porcelain` vazio · worktree, não o repo principal.
Divergiu → PARE e reporte.

## A VISÃO DO DONO (nas palavras dele)
"Faz uma área no adm em que ele pode ver o fluxo inteiro sem precisar criar
um link de convite." A equipe abre `/manual-doxa/admin/previa` e ANDA pelo
manual como o cliente andaria — capítulos, cenas animadas, os 8 aceites,
termos, revisão — sem token, sem gravar nada, sem sujar auditoria.

## CONTEXTO (não perca tempo redescobrindo)
- **O fluxo do cliente acabou de ser reescrito** em `src/manual/publico/`:
  `Fluxo.tsx` orquestra; `Capitulo.tsx` (cena via `cenaDaSecao(slug)` +
  cartões + "Entendi →"), `Aceites.tsx` (item list), `Termos.tsx`,
  `Revisao.tsx`, `Conclusao.tsx`, `Abertura.tsx`, `Identificacao.tsx`;
  `maquina.ts` tem a lógica pura (`capitulosEmOrdem`, `termosDaVersao`,
  `feitioDo`, `obrigatoriasDaVersao`, `montarPedidoConcluir`, passos).
  LEIA `Fluxo.tsx` e `maquina.ts` inteiros antes de decidir o desenho.
- **O desenho pedido**: uma fachada `src/manual/publico/Previa.tsx` (ARQUIVO
  NOVO) que recebe `{ versao: Versao }` e roda o MESMO caminho visual com
  estado local e transporte nulo:
  - convite fictício ("Cliente Exemplo" / "Empresa Exemplo" /
    "cliente@exemplo.com"), identificação já preenchida ou pulada;
  - `progresso` NÃO chama a API (estado local só);
  - o passo final NÃO conclui: no lugar do botão de concluir, um selo claro
    de "Fim da prévia — nenhum aceite foi gravado" com botão de recomeçar;
  - uma faixa fixa discreta "PRÉVIA" visível o tempo todo (a equipe nunca
    pode confundir prévia com fluxo real).
  Se o `Fluxo.tsx` atual acoplar demais busca e telas, a fachada pode exigir
  exports novos ou uma extração LEVE em `src/manual/publico/` — permitido,
  desde que o comportamento do fluxo real não mude (os testes existentes
  continuam passando SEM edição que afrouxe asserção).
- **No admin** (`src/manual/admin/`): rota nova `['previa']` no `Painel.tsx`
  (vira `/manual-doxa/admin/previa`, já atrás do portão), entrada visível na
  navegação do painel ("Ver como o cliente vê"), e o carregamento da versão
  VIGENTE completa (versão + seções + regras, montadas no shape `Versao` de
  `tipos.ts`) via PostgREST com a sessão do time — `dados.ts` já tem leitores
  e o `VersaoEditor` já monta versão completa; REUSE o que existir. Estados de
  carregando/erro/sem-versão-publicada com mensagem útil.
- **Contrato** (`src/manual/tipos.ts`) é INTOCÁVEL. `Rota.tsx`, `config.ts`,
  `App.tsx`, `src/manual/cenas/**`, `tailwind.config.js`, `package.json`
  idem.
- Armadilhas do repo (CLAUDE.md): **pnpm, não npm** · `.focus(` só com
  `{ preventScroll: true }` e intenção pelo valor anterior em ref ·
  `tailwind.config.js` intocável · opacidade fora da escala de 5 só `[0.78]`.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Comentários em PT.
  Sem `any`, sem `@ts-ignore`, sem dependência nova.

## A TASK
1. `src/manual/publico/Previa.tsx` — a fachada descrita acima.
2. Admin: rota `['previa']`, entrada na navegação, loader da versão vigente
   no shape `Versao`, telas de carregando/erro/sem-versão.
3. Testes: montagem da `Versao` a partir das linhas (unidade), e telas por
   `renderToStaticMarkup` (padrão do repo): a prévia renderiza capítulo e
   item list com o conteúdo dado, mostra a faixa "PRÉVIA", e o final NÃO tem
   botão de concluir. Os testes EXISTENTES de publico continuam verdes sem
   afrouxar asserção.

## SCOPE
- src/manual/admin/** (rota, navegação, loader, testes)
- src/manual/publico/Previa.tsx (novo)
- src/manual/publico/** — SÓ exports/extrações leves sem mudança de
  comportamento, quando a fachada exigir (justifique cada um no report)

(NADA além disso. `cenas/**` só se importa.)

## DEPENDS ON
Fluxo2 e cenas mergeados — já estão na base `feat/manual-v2-ui`.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (221 da base continuam + os novos desta track)
- `pnpm build` ok
- `git diff feat/manual-v2-ui...HEAD --name-only` — só o SCOPE acima
- `git diff feat/manual-v2-ui...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-v2-ui...HEAD -- src/manual/publico/ | grep -nE '^-.*expect'` = vazio (nenhuma asserção existente removida/afrouxada)
- `git diff feat/manual-v2-ui...HEAD | grep -n "\.focus("` — cada ocorrência com `preventScroll`

## COMMIT + PUSH
`feat(manual): a previa no admin — o fluxo inteiro sem convite` (ajuste ao
que fez) → `git push -u origin track/manual-previa`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY +
branch + caminho da worktree.
