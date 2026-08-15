# Manual v3 — Track CENAS-VIDA: as animações que impressionam (task_cenas_vida)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
**A worktree do harness NÃO nasce na base desta track.** Rode:
`git checkout -B track/manual-cenas-vida feat/manual-v3-vida` e confirme com
`git log --oneline -2` que o topo é `ae30eca` ou além. `git status --porcelain`
vazio · worktree, não o repo principal. Divergiu → PARE e reporte.

## A VISÃO DO DONO (feedback literal, olhando a v2 no ar)
"Adicione cores nas animações de forma geral e deixe elas mais chamativas e
enfeitadas." · "A animação tá horrível. Deixa ela bem bonita, bem chamativa —
uma animação que o cliente olha e fala: CARAMBA, que negócio legal!" As cenas
da v2 (monocromáticas, contidas) NÃO passaram. O dono quer vida: cor,
gradiente, brilho, coreografia — mantendo a elegância do site, nunca clipart.

## CONTEXTO (não perca tempo redescobrindo)
- **A matéria-prima de cor JÁ EXISTE no site** — use-a como fio condutor:
  - `src/components/faq/cores.ts` — `CORES`, o arco quente→frio do efeito
    Siri. IMPORTE (import é permitido; editar não).
  - `src/index.css` a partir da ~linha 1352 — `.anel-siri` (anel cônico
    girando) e `.texto-aceso-siri` (letra acesa). LEIA para absorver a
    gramática; dentro de SVG você recria com `linearGradient`/
    `radialGradient`/`stroke` animado, não com essas classes.
  - Leia também `src/components/Faq.tsx` (~683-720) e
    `src/components/faq/CampoPergunta.tsx` (~460-475) para ver como o site
    usa o efeito com sobriedade.
- **O que você refaz/cria, tudo em `src/manual/cenas/`:**
  1. **As 4 cenas de capítulo** (`CenaOnboarding`, `CenaVoz`, `CenaClone`,
     `CenaGarantia`) — retrabalho profundo: gradientes nas formas, brilho
     (glow por camadas de stroke com opacidade, não filtros SVG pesados),
     partículas/faíscas discretas, coreografia mais rica, cor do arco Siri
     como assinatura. A história de cada uma continua a mesma (onboarding:
     resposta rasa vs completa; voz: ruído → onda limpa; clone: foto ruim vs
     boa → rosto; garantia: semana + 3 redes + escudo).
  2. **As 8 mini-cenas dos itens** (`itens/*.tsx`, esqueletos do prelude) —
     CADA UMA DIFERENTE, contando o próprio item, ~h-32/h-40, loop curto:
     - `Meta` (GA-1): contador subindo a 1M + 90 dias + 3 redes somando.
     - `Sessenta` (GA-2): um vídeo multiplicando para as três redes, 60.
     - `Relogio` (GA-3): relógio varrendo 24h entre dois vídeos; o segundo
       só destrava quando o ponteiro fecha a volta.
     - `Semana` (GA-4): seg–sex com um vídeo DOXA por dia; vídeo próprio
       tentando entrar na quarta e sendo barrado; sáb/dom abertos e livres.
     - `Intacto` (GA-5): arquivo baixado → publicado idêntico; tesoura/
       música/logo tentando tocar o vídeo e sendo recusadas.
     - `SemImpulso` (GA-6): botão "impulsionar" pulsando e sendo cortado;
       campanha pausando antes do primeiro vídeo.
     - `SemCompra` (GA-7): curtidas/seguidores falsos chovendo e se
       desmanchando; o contador real seguindo firme.
     - `PergunteAntes` (GA-8): balão de dúvida → mensagem para a equipe →
       visto; o caminho "fez sem perguntar" rachando o escudo.
  3. **`ExemplosDeFotos.tsx`** (esqueleto do prelude) — o quadro "que foto
     serve / que foto não serve" do capítulo do clone, O MAIS MASTIGADO
     POSSÍVEL: grade de retratos ILUSTRADOS (SVG, rosto estilizado) em dois
     grupos — FAZER (frontal, boa luz, sorrindo com dentes, fundo limpo) com
     selo verde; NÃO FAZER (escura, óculos escuros, filtro, longe/de lado,
     borrada) com selo vermelho e o motivo em UMA palavra ("escura",
     "óculos", "filtro", "longe"). Rótulos GRANDES (≥16px), responsivo em
     grade 2→4 colunas. Este componente NÃO é decorativo puro: os rótulos
     carregam significado — sem `aria-hidden` no texto; as ilustrações sim.
     Pronto para trocar por fotos reais depois (o dono vai mandar).
- **Regras de vida sem bagunça**: fundo continua escuro (`doxa-bg`/
  `doxa-surface`); a cor vem NAS FORMAS e na luz, não em fundos chapados;
  verde = certo e vermelho/rosa = quebra continuam sendo a gramática moral
  (o arco Siri é têmpera, não semáforo). `useReducedMotion` → quadro FINAL
  parado (padrão `tempo.ts`/`useRoteiro` que já existe — reuse e evolua).
- **`contrato.tsx` é INTOCÁVEL** (os nomes/exports têm que continuar
  batendo — typecheck prova).
- Armadilhas do repo: **pnpm** · `tailwind.config.js` INTOCÁVEL (paleta
  padrão + tokens bastam) · opacidade fora da escala de 5 só `[0.78]` ·
  nada de `.focus(` · classes NUNCA montadas por template string.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Comentários em PT.
  Sem `any`, sem `@ts-ignore`, sem dependência nova. Arquivos ≤800 linhas,
  funções ≤50.

## A TASK
1. Retrabalhar as 4 cenas + substituir os 8 esqueletos + `ExemplosDeFotos`.
2. Verificação VISUAL obrigatória: renderize cada cena/quadro por SSR nas
   fases-chave e OLHE (o padrão da track anterior — `qlmanage`/render de SVG).
   Cole no report o que conferiu.
3. Testes: atualizar `cenas.test.tsx` (as 4 + reduced motion) e cobrir as 8
   mini-cenas + ExemplosDeFotos (renderiza, grupos FAZER/NÃO FAZER presentes,
   rótulos legíveis).

## SCOPE
- src/manual/cenas/** (`contrato.tsx` é INTOCÁVEL)

(NADA fora de `src/manual/cenas/`. `src/manual/publico/**` é de OUTRA track
em paralelo.)

## DEPENDS ON
Prelude `ae30eca` (na base). O fluxo novo consome via contrato, em paralelo.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (novos inclusos)
- `pnpm build` ok
- `git diff feat/manual-v3-vida...HEAD --name-only` — só `src/manual/cenas/`, sem `contrato.tsx`
- `git diff feat/manual-v3-vida...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-v3-vida...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): cenas com vida — cor, brilho e uma historia por item` →
`git push -u origin track/manual-cenas-vida`. **NÃO mergeie.**
Report: sumário + verdict + VERIFY colado + o que você OLHOU na verificação
visual + branch + worktree.
