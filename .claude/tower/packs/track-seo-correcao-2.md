# SEO orgânico — Rodada de CORREÇÃO 2: ressalva do 60/90 e sobras dos collectors (track-seo-correcao-2)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-correcao-2 origin/feat/seo-organico`. Divergiu → **PARE e reporte**.
`pnpm install --frozen-lockfile`. Package manager **pnpm**.

Leia antes: `docs/seo/source-of-truth.md` §3 (a redação contratual do 60/90 e a
ressalva "conforme as condições e o prazo do contrato") e §8; `.claude/tower/packs/
track-seo-correcao-1.md` (mesmo espírito: CORTAR ou HEDGEAR, nunca inventar).

## A VISÃO DO DONO
Sobras dos collectors depois da correção-1. Uma classe nova: páginas que citam
"60 conteúdos / 90 dias / três redes" como operação da Doxa SEM a ressalva contratual
que o §3c exige — enquanto as irmãs têm. Consistência é o que o Google e o cliente leem.

## CONTEXTO
- Só conteúdo, só as linhas listadas. Motor/contrato/docs/landing: NÃO. Nenhum
  arquivo novo. Outra track (`track-seo-rodada-3`) cria DOIS arquivos novos em
  `guias/` em paralelo — você não toca em arquivo novo, ela não toca em existente.
- Regra do 60/90: onde o número é dito como **rotina/garantia da Doxa** ("a operação
  da Doxa trabalha com 60", "a meta é 60 em 90 nas três redes"), acrescentar "conforme
  as condições e o prazo do contrato" (ou "condição de quem já é cliente" + a
  ressalva) — igual a `producao-de-conteudo-em-escala:~157`. Onde 60 é só número de
  planejamento genérico (o guia `como-produzir-60-videos-em-90-dias` que faz a
  aritmética; "sessenta roteiros" como exemplo), NÃO mexer.

## A TASK (arquivo:linha aproximada — localize por grep da frase)
1. Ressalva do 60/90 (achado da correção-1): `guias/como-crescer-no-instagram-
   organicamente.ts:~176`, `hubs/videos-curtos.ts:~115`, `comparativos/tiktok-vs-
   instagram.ts:~156`, `dores/por-que-meu-instagram-parou-de-crescer.ts:~174`,
   `dores/como-postar-todos-os-dias-sem-equipe.ts:~141`, `dores/por-que-meus-videos-
   nao-tem-views.ts:~105` (esta: se for só o teste dos 30 dias, deixe). Depois:
   `grep -rnE "(60|sessenta) (conteúdos|vídeos|peças)" src/seo/conteudo` e confira uma
   a uma as que falam da DOXA — cole a lista com decisão por linha.
2. NITs do collector da correção-1: `dores/como-produzir-conteudo-sem-equipe.ts:~124`
   dois-pontos duplo ("…caro: no feed, o que decide não é a produção: é o que
   prende") → "…caro: no feed, o que decide não é a produção, e sim o que prende";
   `solucoes/conteudo-para-redes-sociais-com-ia.ts:~166` "o formato que mais entrega
   para quem ainda não segue" → mesma redação hedgeada das irmãs ("é o que mais
   entrega"/"uma parte relevante do alcance costuma vir…"); `glossario/algoritmo-do-
   tiktok.ts:~82` "quase todo espectador o produz" e `glossario/retencao.ts:~62`
   "praticamente todo mundo" — o executor anterior trocou por universal ("qualquer
   espectador", "toda pessoa que abriu") — definicional, ok; só confira que não virou
   claim; `hubs/ia-no-marketing.ts:~47` `relacionadas` lista página que o hub já lista
   como membro (link duplicado) — tirar de `relacionadas` (idem `guias/o-que-e-avatar-
   de-ia.ts` se for o caso); `glossario/roteiro-de-video-curto.ts:~27` `palavrasChave`
   'roteiro de vídeo curto' — a dona é o guia; trocar por 'roteiro para vídeo curto'
   ou tirar; `plataformas/instagram-reels-para-empresas.ts` checklist do fim diz "sem
   direitos do vídeo" e a página agora tem a FAQ `direitos` publicada — corrigir o
   comentário (é a não-resposta autorizada, mesma situação de `preco`).
3. NITs do collector R2-A que ficaram: `guias/como-fazer-videos-curtos-que-prendem.ts`
   `palavrasChave` — se ainda tiver 'primeiros segundos do vídeo' duplicado com o guia
   de hook, o dono é `prendem` (keyword-map:57): então tirar do guia de HOOK, não
   daqui — confira `guias/como-fazer-hook-de-video-curto.ts` e ajuste lá.
4. Varredura final (report, não edição): `grep -rniE "único|única|ninguém|sempre|nunca|
   todo mundo|toda empresa|qualquer empresa" src/seo/conteudo | grep -v "^\S*:\s*\*"`
   — liste as 10 mais fortes que ainda são afirmação absoluta sem fonte, com sugestão
   de hedge, para a próxima rodada. NÃO edite essas (fora do escopo desta) — a menos
   que estejam nos arquivos que você já está tocando.

## SCOPE
- src/seo/conteudo/guias/como-crescer-no-instagram-organicamente.ts
- src/seo/conteudo/guias/como-fazer-hook-de-video-curto.ts
- src/seo/conteudo/guias/como-fazer-videos-curtos-que-prendem.ts
- src/seo/conteudo/guias/o-que-e-avatar-de-ia.ts
- src/seo/conteudo/hubs/videos-curtos.ts
- src/seo/conteudo/hubs/ia-no-marketing.ts
- src/seo/conteudo/comparativos/tiktok-vs-instagram.ts
- src/seo/conteudo/dores/por-que-meu-instagram-parou-de-crescer.ts
- src/seo/conteudo/dores/como-postar-todos-os-dias-sem-equipe.ts
- src/seo/conteudo/dores/por-que-meus-videos-nao-tem-views.ts
- src/seo/conteudo/dores/como-produzir-conteudo-sem-equipe.ts
- src/seo/conteudo/solucoes/conteudo-para-redes-sociais-com-ia.ts
- src/seo/conteudo/glossario/algoritmo-do-tiktok.ts
- src/seo/conteudo/glossario/retencao.ts
- src/seo/conteudo/glossario/roteiro-de-video-curto.ts
- src/seo/conteudo/plataformas/instagram-reels-para-empresas.ts
(+ qualquer arquivo EXISTENTE que o grep do item 1 acusar como "fala da Doxa sem
ressalva" — liste no report. Nenhum arquivo novo. Motor/contrato/docs: NÃO.)

## DEPENDS ON
`feat/seo-organico` @ `794f48f`+ (correção-1 #58 e contrato-3 #59 mergeados).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 · `pnpm test` verde (mesmo nº da base: 963) · `pnpm build` ok
  (66 rotas) · `pnpm seo:audit` sem ERRO (0 avisos, ou os que você explicar)
- `grep -rnE "(60|sessenta) (conteúdos|vídeos|peças)" src/seo/conteudo` — cole com a
  decisão por linha (Doxa+ressalva / genérico / comentário)
- `grep -rn "não é a produção: é" src/seo/conteudo` = vazio
- FAQ única: `grep -rhoE "pergunta: *'[^']+'" src/seo/conteudo | sort | uniq -d` = vazio
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- `git diff origin/feat/seo-organico...HEAD --stat | tail -1` — cole

## COMMIT + PUSH
Um commit por item → `git push -u origin track-seo-correcao-2`. **NÃO mergeie.** Report:
item a item (antes → depois), a lista do item 4, saída do VERIFY, verdict.
