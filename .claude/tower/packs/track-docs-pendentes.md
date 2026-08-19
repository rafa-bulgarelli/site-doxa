# Docs — PENDENTES e §9.1 reconciliados com o FAQ publicado (track-docs-pendentes)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree · `git status --porcelain` vazio ·
`git fetch origin && git checkout -B track-docs-pendentes origin/main` · `pnpm install --frozen-lockfile`.
Leia antes: `src/components/faq/config.ts` INTEIRO (DUVIDAS_PT, as chaves `preco`,
`volume`, `direitos` e o array/comentário `PENDENTES` no fim), `docs/seo/source-of-truth.md`
§9 e §9.1, `docs/seo/regua-de-copy.md` (onde cita PENDENTES).

## A VISÃO DO DONO
Três perguntas que a landing JÁ responde publicamente com a não-resposta autorizada
("definido no contrato") — `preco`, `volume`, `direitos` — ainda constam como
"pendentes de resposta do dono" em dois lugares. As páginas SEO as usaram (correto,
é o que a landing diz). Os documentos têm de dizer a verdade.

## A TASK
1. `src/components/faq/config.ts`: no bloco `PENDENTES`, as entradas cuja pergunta
   corresponde às chaves publicadas `preco` ("Quanto custa?"/preço), `volume` ("Quantos
   vídeos por mês?") e `direitos` ("De quem são os direitos do vídeo?") — **confira por
   leitura**, não por palpite, quais são — saem do array (ou, se o array alimentar algo
   renderizado, ganham marcação de "publicada com não-resposta"; confira com `grep -rn
   PENDENTES src/` se é só documentação) e o comentário explica: a resposta publicada é
   a não-resposta contratual; a pergunta continua valendo como insumo do dono para uma
   resposta melhor, mas não está "sem resposta". NADA mais muda nesse arquivo (é a
   landing: diff mínimo, só o bloco PENDENTES).
2. `docs/seo/source-of-truth.md` §9.1: marcar as três como "publicada em DUVIDAS_PT
   com a não-resposta autorizada (`faq/config.ts:<linha>`) — pode ser usada em página
   SEO verbatim; resposta com valor continua pendente do dono". As outras 7 ficam
   como estão. §9 (não publicável) intocado.
3. `docs/seo/regua-de-copy.md` só se citar PENDENTES de um jeito que fique falso —
   confira; se não, não toque.

## SCOPE
- src/components/faq/config.ts
- docs/seo/source-of-truth.md
- docs/seo/regua-de-copy.md
(só o bloco PENDENTES no `config.ts`; DUVIDAS_PT/EN intocadas. Precisou → PARE e reporte.)

## DEPENDS ON
`origin/main` @ `5b8bd73`+.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 · `pnpm test` verde · `pnpm build` ok (68 rotas)
- `git diff origin/main...HEAD -- src/components/faq/config.ts` colado inteiro (só PENDENTES/comentário; nenhuma linha de `DUVIDAS_PT`/`DUVIDAS_EN` tocada: `git diff … | grep -cE "^[+-].*(chave|pergunta|resposta):"` = 0 fora do bloco PENDENTES — cole)
- `grep -n "preco\|volume\|direitos" docs/seo/source-of-truth.md | head` — as 3 aparecem em §9.1 marcadas como publicadas
- `git diff --name-only origin/main...HEAD | grep -vE '^(src/components/faq/config\.ts|docs/seo/source-of-truth\.md|docs/seo/regua-de-copy\.md)$'` = vazio

## COMMIT + PUSH
Um commit → `git push -u origin track-docs-pendentes`. **NÃO mergeie.** Report: diff do `config.ts` colado, o que mudou no §9.1, VERIFY, verdict.
