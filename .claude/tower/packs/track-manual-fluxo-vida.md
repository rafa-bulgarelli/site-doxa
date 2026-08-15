# Manual v3 — Track FLUXO-VIDA: uma etapa por item, e tudo mais vivo (task_fluxo_vida)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
**A worktree do harness NÃO nasce na base desta track.** Rode:
`git checkout -B track/manual-fluxo-vida feat/manual-v3-vida` e confirme com
`git log --oneline -2` que o topo é `ae30eca` ou além. `git status --porcelain`
vazio · worktree, não o repo principal. Divergiu → PARE e reporte.

## A VISÃO DO DONO (feedback literal, olhando a v2 no ar)
1. "Uma etapa para CADA item da garantia, com uma animação diferente. Você
   deixa tudo na mesma página e o cara vai descer marcando tudo, não vai nem
   ler nada." — a item list única REPROVOU.
2. "Melhora a UI dessas caixinhas de aceite. Não tá nada bonito. Se baseia no
   nosso site. Utiliza serifa nos títulos. Traz cor. Pode usar os degradês e
   efeito Siri do FAQ/formulário." — vale para o fluxo INTEIRO, termos
   inclusos.
3. "Na parte do clone, uma próxima etapa de exemplos de fotos — o que fazer e
   o que não fazer, o mais mastigado possível."
4. "Tá muito cinza, sem vida" (revisão final e geral) — mais cor, mais
   animação, mais vivo. Sem virar circo: a régua é a landing.

## CONTEXTO (não perca tempo redescobrindo)
- **A base é o fluxo v2** em `src/manual/publico/` (Fluxo/Leitura/Capitulo/
  Aceites/Termos/Revisao/Conclusao/maquina/pecas) — leia `maquina.ts` e
  `Leitura.tsx` inteiros. A `Previa.tsx` do admin reusa `Leitura` — o que
  você mudar ali aparece na prévia DE GRAÇA; não quebre o contrato de props
  de `Leitura` sem atualizar `Previa` junto (está no seu escopo).
- **Conteúdo agora é v3** (`supabase/manual-seed-v3.sql`): voz ganhou VZ-3
  (gravador do celular) e GA-9 virou "Respire — o que você PODE fazer".
  Dirigido a dados como sempre.
- **A mudança estrutural — o capítulo `garantia` vira SEQUÊNCIA de etapas:**
  - Uma etapa por regra OBRIGATÓRIA, na ordem: mini-cena
    (`cenaDoItem(codigo)` de `../cenas/contrato` — prelude já exporta),
    "Item N de 8", título serif GRANDE, instrução, porquê a um toque, e a
    confirmação DAQUELA regra ("Li, entendi e concordo" — alvo ≥48px) que é
    o que libera "Próximo item". Voltar sempre.
  - Depois da última: o "Respire" (regras informativas do capítulo) como
    interlúdio POSITIVO — verde, acolhedor, celebrando — e então a revisão.
  - Retomada: primeiro item NÃO marcado (regras_marcadas já persiste no
    servidor; derive). Progresso entre capítulos continua como está.
  - Dirigido a dados: N etapas = N obrigatórias do capítulo, qualquer versão.
  - `montarPedidoConcluir`/gate global NÃO mudam de contrato — continuam
    exigindo todas as obrigatórias.
- **Clone ganha a etapa de fotos**: dentro do capítulo `clone`, uma
  sub-etapa (ou bloco de destaque pós-cartões — escolha e justifique) com
  `ExemplosDeFotos` (import de `../cenas/ExemplosDeFotos`, prelude já tem
  esqueleto) — título claro ("Que foto serve — e que foto não serve").
- **A vida visual — matéria-prima do site, importe/reuse, NÃO recrie:**
  - `.anel-siri` e `.texto-aceso-siri` são classes GLOBAIS de
    `src/index.css` (~1352+). Use `anel-siri` no cartão do item ativo e/ou
    no botão final de confirmar; `texto-aceso-siri` com MUITA parcimônia
    (um título-momento, ex.: "1 milhão" — veja como `Faq.tsx:683-720` usa).
    `index.css` é INTOCÁVEL — se as classes existentes não bastarem, PARE e
    reporte em vez de criar keyframe novo.
  - `src/components/faq/cores.ts` — `CORES` importável para degradês
    (ex.: barra de progresso com gradiente, fio de luz nos cartões).
  - Leia 2–3 seções da landing para o motion (entradas, véus, EASE).
  - Verde protege / vermelho quebra continuam a gramática. Cinza chapado em
    conteúdo importante = o que o dono reprovou.
- Armadilhas do repo (TODAS já morderam): **pnpm** · `.focus(` só com
  `{ preventScroll: true }` + intenção pelo valor anterior em ref · `ref` de
  pai em efeito de filho chega null (nó por `useState` + ref de callback) ·
  `tailwind.config.js` INTOCÁVEL · opacidade fora da escala de 5 só
  `[0.78]` · classe nunca montada por template string.
- **INTOCÁVEIS**: `tipos.ts`, `Rota.tsx`, `config.ts`, `App.tsx`,
  `src/manual/cenas/**` (import sim), `index.css`, `tailwind.config.js`,
  `package.json`, `src/manual/servidor/**`, `api/**`.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Comentários em PT.
  Sem `any`, sem `@ts-ignore`, sem dependência nova.

## A TASK
1. Etapas por item da garantia (novo(s) componente(s) em `publico/`,
   `Aceites.tsx` evolui ou dá lugar — sua arquitetura, escopo é o diretório).
2. Etapa/bloco de exemplos de fotos no clone.
3. Passada de vida no fluxo INTEIRO: capítulos, aceites, Respire, termos,
   revisão, conclusão — serifa, cor com propósito, degradês/Siri nos
   momentos-chave, animações de entrada. Fonte ≥17px no corpo, nada <14px.
4. `src/manual/admin/PreviaDoManual.tsx`/`Previa.tsx`: só o necessário para a
   prévia continuar funcionando com o fluxo novo (sem feature nova no admin).
5. Testes: etapas derivadas das obrigatórias (N por versão), gate por etapa,
   retomada no primeiro não-marcado, interlúdio presente, exemplos de foto no
   clone, termos na revisão — e os existentes atualizados SEM afrouxar
   asserção de segurança (prévia sem botão de concluir continua provada).

## SCOPE
- src/manual/publico/**
- src/manual/admin/Previa*.tsx e src/manual/admin/previa.test.tsx (SÓ para a
  prévia acompanhar o fluxo — nada de feature nova no admin)

## DEPENDS ON
Prelude `ae30eca` (cenaDoItem + ExemplosDeFotos esqueletos, na base). A track
cenas-vida roda em paralelo; integração real no merge serial (cenas → fluxo).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde
- `pnpm build` ok
- `git diff feat/manual-v3-vida...HEAD --name-only` — só o SCOPE acima
- `git diff feat/manual-v3-vida...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-v3-vida...HEAD | grep -n "\.focus("` — cada ocorrência com `preventScroll`
- `git diff feat/manual-v3-vida...HEAD -- src/manual/admin/previa.test.tsx | grep -nE '^-.*concluir'` — nenhuma asserção de segurança da prévia removida

## COMMIT + PUSH
`feat(manual): uma etapa por item — e o fluxo ganhou vida` →
`git push -u origin track/manual-fluxo-vida`. **NÃO mergeie.**
Report: sumário + verdict + VERIFY colado + branch + worktree.
