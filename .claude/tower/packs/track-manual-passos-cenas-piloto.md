# Manual por passos — Track B fase 1: DUAS cenas-piloto para o gate de estilo (task_manual_passos_cenas_piloto)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em MAIN).

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/manual-passos-cenas origin/feat/manual-passos`
e confirme: `ls src/manual/cenas/passos/*.tsx | wc -l` = **9** (os esqueletos do
prelude). `git status --porcelain` vazio · worktree, não o repo principal.
Divergiu → **PARE e reporte.**

## A VISÃO DO DONO (card 009 — e o histórico que importa)
Cada passo do manual com uma animação que "faça sentido com o contexto do passo e
não seja só animação bonita". O dono JÁ reprovou animação por ser "colorida demais"
e por "não fazer nada" — por isso esta fase produz SÓ DUAS cenas: ele olha, aprova o
ESTILO, e só então as outras sete são produzidas (fase 2, outro pack). O seu report
é a peça do gate.

## CONTEXTO (não perca tempo redescobrindo)
- **A gramática visual aprovada**: `src/manual/cenas/CenaClone.tsx` é a referência
  de paleta que passou com o dono — contida, monocromática na base, com o veredito
  em verde (certo) / vermelho-rosa (quebra) quando a história pede. Leia-a ANTES de
  desenhar. Arco narrativo curto: começo → transformação → fim, terminando num
  quadro final que se sustenta parado — NUNCA loop decorativo.
- **A maquinaria já existe — reuse, não reinvente**:
  - `src/manual/cenas/itens/comuns.tsx` — `MiniPalco` (viewBox `0 0 480 150`,
    `h-32 sm:h-40`): é O palco das mini-cenas de etapa. Use-o. `Cartao` (vídeo com
    play) se servir.
  - `src/manual/cenas/pecas.tsx` — `Palco`, `Painel`, `Legenda`, `Marca`, `TINTA`,
    `TRACO`.
  - `src/manual/cenas/luz.tsx` — `Brilho`, `Faiscas`, `TracoDeLuz`, `useTintas`,
    `CERTO`.
  - `src/manual/cenas/tempo.ts` — `useRoteiro(FASES, FASE_FINAL)`, `tempo`, `EASE`:
    é ele que dá o arco por fases E o `prefers-reduced-motion` (quadro FINAL parado,
    nunca tela vazia).
  - Estrutura de referência: `src/manual/cenas/itens/Relogio.tsx` — fases, cadeado,
    veredito. Siga esse desenho de código.
- **As duas cenas-piloto** (uma frase é o que a cena tem que comunicar SEM texto ao
  redor — é o critério do gate):
  1. **`passos/Redes.tsx`** (código ON-0, o passo novo que abre o cap. 1) —
     *"Os três links entram certos logo no começo — conferidos letra por letra."*
     Arco: três campos de link (Instagram/TikTok/YouTube) → um link entra com um
     caractere errado e acende a quebra (vermelho) → corrigido → os três conferidos
     em verde. A conferência é a história; o erro corrigido é o que "faz alguma
     coisa".
  2. **`passos/Silencio.tsx`** (código VZ-1, "Grave num lugar silencioso") —
     *"Sem ruído no fundo, o clone aprende só a sua voz."*
     Arco: onda de voz com ruído serrilhado por cima (quebra) → o ruído morre →
     onda limpa e regular, confirmada em verde.
- Os esqueletos do prelude são um `<svg>` vazio com um comentário `Esqueleto` —
  substitua os DOIS arquivos por inteiro. `contrato.tsx` já mapeia ON-0 → Redes e
  VZ-1 → Silencio: você NÃO toca o contrato.
- Texto DENTRO da cena: só via `Legenda` e pouquíssimo — a cena é decorativa
  (`aria-hidden` vem do `Palco`), o conteúdo mora no cartão abaixo.
- Se precisar de peça compartilhada específica de passos, crie
  `src/manual/cenas/passos/comuns.tsx` — nunca edite `itens/comuns.tsx`.
- Ids de gradiente/filtro: únicos por instância (padrão `useId`/`cena*-arco` que as
  cenas atuais usam — `cenas.test.tsx:122` prova; imite).

### Armadilhas do repo (já morderam)
**pnpm**, não npm · nenhuma dependência nova (framer-motion já está no projeto — e
o custo no celular se controla com poucas camadas, não com filtros SVG pesados) ·
`tailwind.config.js`/`index.css` INTOCÁVEIS · opacidade fora da escala de 5 só
`[0.78]` · nada de `.focus(` · classes NUNCA montadas por template string ·
`cenas.test.tsx` NÃO é seu (fase 2) — se um teste existente quebrar com a sua
mudança, algo está errado na mudança, não no teste.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT — cada cena abre com o bloco
narrando o item e o arco, como `Relogio.tsx` faz. Sem `any`, sem `@ts-ignore`.
Arquivos ≤800 linhas, funções ≤50.

## A TASK
1. Substituir `passos/Redes.tsx` e `passos/Silencio.tsx` pelos desenhos reais.
2. **Verificação VISUAL obrigatória**: renderize cada cena por SSR nas fases-chave
   (primeira, a da quebra, a final) e OLHE — o padrão das tracks anteriores
   (`renderToStaticMarkup` num script + `qlmanage`/render do SVG). Salve os quadros
   em arquivos (ex.: `/tmp/…` da sessão) e liste os caminhos no report: o dono
   decide o gate olhando para eles.
3. NADA além das duas cenas: a fase 2 só nasce depois do gate.

## SCOPE
- src/manual/cenas/passos/Redes.tsx
- src/manual/cenas/passos/Silencio.tsx
- src/manual/cenas/passos/comuns.tsx (SÓ se precisar de peça compartilhada)

(`contrato.tsx`, `itens/**`, `cenas.test.tsx`, `Cena*.tsx`: INTOCÁVEIS. A track de
fluxo está em `src/manual/publico/**` em paralelo — importar dela pode, editar não.)

## DEPENDS ON
Prelude em `feat/manual-passos` (esqueletos + `cenaDoPasso` — STEP 0 confirma).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline do main (**360/360**)
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-passos...HEAD` — só arquivos do SCOPE,
  com Redes.tsx e Silencio.tsx presentes
- `grep -rn "Esqueleto" src/manual/cenas/passos/Redes.tsx src/manual/cenas/passos/Silencio.tsx` = vazio
- `git diff origin/feat/manual-passos...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-passos...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): cenas-piloto dos passos — redes e silencio, para o gate de estilo` →
`git push -u origin track/manual-passos-cenas`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + para CADA cena: a frase
que ela comunica, o arco fase a fase, e os caminhos dos quadros renderizados que
você OLHOU. Este report vai direto ao dono — o gate de estilo é dele, não seu.
