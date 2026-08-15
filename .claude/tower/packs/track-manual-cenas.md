# Manual v2 — Track CENAS: as ilustrações animadas (task_manual_cenas)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
**A worktree do harness nasce em `main` — NÃO na base desta track.** Rode:
`git checkout -B track/manual-cenas feat/manual-v2-ui` e confirme com
`git log --oneline -2` que o topo é o prelude das cenas (`0d96400` ou além).
`git status --porcelain` vazio · `git rev-parse --show-toplevel` = a worktree,
não `~/orca/projects/site-doxa`. Divergiu → PARE e reporte.

## A VISÃO DO DONO
O manual novo explica ANTES de pedir. Cada capítulo abre com uma cena animada
que ensina fazendo: como responder o onboarding, como gravar a voz, que foto
serve para o clone, e a rotina que protege a garantia. "Precisa estar tudo
bem animado, com animações explicando como funciona" — e com a MESMA cara do
site: preto, serif, elegante. Nada de clipart, nada de dashboard SaaS.

## CONTEXTO (não perca tempo redescobrindo)
- **O contrato é `src/manual/cenas/contrato.tsx` — INTOCÁVEL.** Ele mapeia
  slug → cena e é o que o fluxo consome. Você substitui os QUATRO esqueletos:
  `CenaOnboarding.tsx`, `CenaVoz.tsx`, `CenaClone.tsx`, `CenaGarantia.tsx`
  (export default, componente SEM props, `aria-hidden` no raiz — cena é
  decorativa; o texto do capítulo é quem fala com leitor de tela).
- **O idioma visual é o do site.** ANTES de desenhar, leia 2–3 seções da
  landing (`src/components/` — ex.: Hero, HowItWorks, Ladainha) e absorva:
  fundo `doxa-bg`/`doxa-surface`, linhas `doxa-line`, texto branco e
  `doxa-muted`, títulos `font-serif` (Instrument Serif), motion suave com
  framer-motion. Tokens em `tailwind.config.js` (INTOCÁVEL — a paleta padrão
  do Tailwind continua disponível via `extend`, sem mexer em nada).
- **Cor**: base monocromática como o site. UMA família de acento é permitida
  onde tem função — na `CenaGarantia`, verde (`emerald-*`) para "assim
  protege" e vermelho (`red-*`/`rose-*`) para "assim quebra". Nas outras
  cenas, no máximo um acento discreto da mesma disciplina. Cor decorativa
  espalhada = finding no gate.
- **Técnica**: SVG inline + framer-motion (já instalado; NENHUMA dependência
  nova). Loop discreto (a cena conta a história e recomeça com pausa), e
  `useReducedMotion` do framer-motion para servir versão parada a quem pediu
  menos movimento. Responsivo: `width 100%`, altura fluida (~10rem–16rem),
  `viewBox` fixo. Sem texto pequeno dentro do SVG — palavra dentro da cena só
  se for GRANDE e essencial (ex.: "24h").
- **O que cada cena ensina** (o roteiro é seu, a lição é esta):
  - `CenaOnboarding` — uma pergunta aparece; a resposta de uma palavra fica
    fraca/apagada; a resposta com contexto preenche o campo e ganha o check.
    A lição: resposta completa vira roteiro bom.
  - `CenaVoz` — um celular gravando; onda de áudio suja (ícones de música/
    ruído por perto) vira onda limpa quando o ambiente silencia. A lição:
    silêncio + voz natural, sem filtro.
  - `CenaClone` — foto ruim (escura, óculos) recusada; foto boa (frontal,
    clara) aceita e "virando" o rosto do clone. A lição: foto nítida de
    frente, e o clone é uma aproximação.
  - `CenaGarantia` — a semana num calendário: um vídeo por dia útil subindo
    para TRÊS redes, o relógio de 24h entre eles, fim de semana livre; e o
    contraste — "impulsionar/editar/comprar" rachando o escudo da garantia
    (vermelho), a rotina certa mantendo o escudo inteiro (verde).
- Armadilhas do repo (CLAUDE.md):
  - **pnpm, não npm.** `pnpm typecheck` · `pnpm test` · `pnpm build`.
  - **`tailwind.config.js` é INTOCÁVEL** (sem hot-reload; e você não precisa
    de token novo). Opacidade fora da escala de 5 só como `bg-x/[0.78]`.
  - Nada de `ref` do pai lida em efeito de filho; nada de `.focus(` (cena não
    foca nada).
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Comentários em PT, na
  voz do repo. Sem `any`, sem `@ts-ignore`.

## A TASK
1. Substituir os 4 esqueletos por cenas de verdade. Peças compartilhadas
   (paleta da cena, timings, wrapper de loop) podem viver em arquivos novos
   dentro de `src/manual/cenas/` (ex.: `pecas.tsx`, `tempo.ts`).
2. Testes em `src/manual/cenas/cenas.test.tsx` (vitest, sem DOM — use
   `renderToStaticMarkup`, o padrão de `src/manual/publico/telas.test.tsx`):
   cada cena renderiza, tem `aria-hidden`, e não explode com reduced motion.

## SCOPE
- src/manual/cenas/** (os 4 Cena*.tsx + arquivos NOVOS aqui; `contrato.tsx` é INTOCÁVEL)

(NADA fora de `src/manual/cenas/`. `src/manual/publico/**` é de OUTRA track em
paralelo — não encoste nem para "ajustar a integração".)

## DEPENDS ON
Nada — o contrato e os esqueletos já estão na base `feat/manual-v2-ui`.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (os testes novos inclusos)
- `pnpm build` ok
- `git diff feat/manual-v2-ui...HEAD --name-only` — tudo dentro de `src/manual/cenas/`, sem `contrato.tsx`
- `git diff feat/manual-v2-ui...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-v2-ui...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): as cenas — o manual que explica fazendo` (ajuste ao que fez) →
`git push -u origin track/manual-cenas`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY +
branch + caminho da worktree.
