# Manual v2 — Track FLUXO2: o redesign do caminho do cliente (task_manual_fluxo2)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
**A worktree do harness nasce em `main` — NÃO na base desta track.** Rode:
`git checkout -B track/manual-fluxo2 feat/manual-v2-ui` e confirme com
`git log --oneline -2` que o topo tem o prelude das cenas.
`git status --porcelain` vazio · worktree, não o repo principal.
Divergiu → PARE e reporte.

## A VISÃO DO DONO (nas palavras dele)
"Tá com muito texto, 30 coisinhas pra dar aceite — ninguém vai ler essa
porra." O fluxo novo é: capítulos que EXPLICAM a plataforma (onboarding, voz,
clone) sem pedir caixa nenhuma, a ROTINA DE POSTAGEM claríssima como item
list de 8 aceites, e o detalhe contratual virando Termos de Uso — um "ler os
termos completos" antes do "Li e concordo". Fonte GRANDE, sem letra miúda,
bonito, simples, animado, com a MESMA cara do site.

## CONTEXTO (não perca tempo redescobrindo)
- **O que já existe e CONTINUA VALENDO por baixo**: `src/manual/publico/` tem
  o fluxo v1 completo — `maquina.ts` (gate por regras `obrigatoria`, retomada
  por `ordem`, montagem dos pedidos), `api.ts` (POST único, token no corpo),
  `memoria.ts`, `formato.ts` e as telas. A API, o contrato
  (`src/manual/tipos.ts`, INTOCÁVEL) e o banco não mudam NADA. Isto é um
  redesign de apresentação + a lógica nova de capítulos; a máquina você pode
  evoluir, os tipos não.
- **O conteúdo agora é a v2** (`supabase/manual-seed-v2.sql` — leia para ver
  o formato): 5 seções com slugs-contrato `onboarding`, `voz`, `clone`,
  `garantia`, `termos`. Regras `obrigatoria=false` são conteúdo explicativo;
  as 8 `obrigatoria=true` (todas na seção `garantia`) são os aceites.
- **Regras de apresentação:**
  - Capítulos navegáveis = toda seção EXCETO slug `termos`, na ordem do banco.
  - Cada capítulo abre com a cena animada: `cenaDaSecao(slug)` de
    `../cenas/contrato` (import permitido; editar `src/manual/cenas/**` NÃO —
    é de outra track em paralelo). Slug sem cena → capítulo sem ilustração,
    sem buraco. Os esqueletos atuais renderizam um bloco vazio — integre
    contra o contrato e pronto.
  - Capítulo SEM regra obrigatória: cartões explicativos (título grande,
    instrução, porquê/exemplo em revelação progressiva) e um único botão
    "Entendi →". NENHUM checkbox.
  - Capítulo `garantia`: a item list. 8 itens com checkbox GRANDE (alvo de
    toque ≥48px), título forte, o porquê a um toque de distância. O item
    informativo GA-9 ("o que NÃO quebra") aparece como nota de alívio, sem
    caixa. Acento de cor funcional é permitido AQUI (verde protege /
    vermelho quebra — paleta padrão do Tailwind, `tailwind.config.js`
    INTOCÁVEL).
  - Seção `termos`: NUNCA vira capítulo. Na revisão final, um botão "Ler os
    termos completos" abre um painel/rolagem com o documento — as regras da
    seção `termos` (título + instrução, tipografia de documento legível,
    corpo ≥16px). A declaração final e o checkbox "Confirmo que li e
    concordo" continuam obrigatórios como hoje.
  - Revisão final ENXUTA: nome/empresa/e-mail, os 8 itens confirmados num
    resumo compacto, o botão dos termos, a declaração, o aceite.
- **Tipografia e tom**: corpo ≥17px (`text-[17px]`/`text-lg`), títulos
  `font-serif` grandes como a landing, `doxa-muted` só para metadado (nunca
  para conteúdo que precisa ser lido), NADA abaixo de 14px. Pouco texto por
  tela — o texto longo mora nos termos.
- **Motion**: leia 2–3 seções da landing (`src/components/`) e reproduza o
  padrão (framer-motion, entradas suaves, transição entre capítulos), com
  `useReducedMotion` respeitado.
- **Compatibilidade para trás**: o fluxo é dirigido a dados. Uma versão SEM
  os slugs novos (a v1, se algum dia voltar) renderiza como capítulos
  genéricos sem cena, com os checkboxes que ela declarar. Nenhum
  comportamento pode DEPENDER de slug — slug só escolhe cena e aparta os
  `termos`.
- **Progresso e conclusão**: como hoje — `progresso` na troca de capítulo,
  `regras_marcadas` só das obrigatórias, conclusão pela API. A seção `termos`
  não entra na conta de progresso navegável.
- Armadilhas do repo (CLAUDE.md — TODAS já morderam):
  - **pnpm, não npm.**
  - **`.focus(` na montagem rola a página** — `{ preventScroll: true }` e
    intenção guardada pelo valor ANTERIOR num ref (StrictMode roda 2×).
  - **`ref` de pai lida em efeito de filho chega `null`** — nó por `useState`
    + ref de callback.
  - **`tailwind.config.js` INTOCÁVEL**; opacidade fora da escala de 5 só
    `bg-x/[0.78]`.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Comentários em PT.
  Sem `any`, sem `@ts-ignore`. Sem dependência nova.

## A TASK
1. Reestruturar `src/manual/publico/**`: capítulos (cena + cartões + Entendi),
   item list da garantia, revisão com termos, conclusão. Reaproveite máquina/
   api/formato/memoria no que servirem; o que mudar, mude com teste junto.
2. Testes atualizados: gate continua por obrigatórias; capítulos excluem
   `termos`; retomada; pedidos; telas por `renderToStaticMarkup` (padrão já
   existente em `telas.test.tsx`) — incluindo "capítulo informativo não
   renderiza checkbox" e "termos aparecem na revisão".

## SCOPE
- src/manual/publico/** (reestruturar à vontade DENTRO daqui)

(NADA fora de `src/manual/publico/`. `src/manual/cenas/**` é de outra track —
importe `contrato`, jamais edite. `Rota.tsx`, `tipos.ts`, `config.ts`,
`App.tsx`, `tailwind.config.js`, `package.json` INTOCÁVEIS.)

## DEPENDS ON
Prelude das cenas (já na base). A track das cenas roda em paralelo — os
esqueletos compilam; a integração real chega no merge serial (cenas → fluxo).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (testes NOVOS/atualizados desta track inclusos)
- `pnpm build` ok
- `git diff feat/manual-v2-ui...HEAD --name-only` — tudo dentro de `src/manual/publico/`
- `git diff feat/manual-v2-ui...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-v2-ui...HEAD | grep -n "\.focus("` — cada ocorrência com `preventScroll`
- `grep -rn "assinatura eletrônica" src/manual/publico/ --include="*.tsx" --include="*.ts"` — só em teste que garante a AUSÊNCIA, se houver

## COMMIT + PUSH
`feat(manual): o fluxo v2 — capitulos que explicam, oito aceites e os termos`
(ajuste ao que fez) → `git push -u origin track/manual-fluxo2`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY +
branch + caminho da worktree.
