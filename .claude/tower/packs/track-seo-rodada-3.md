# SEO orgânico — Rodada 3: as duas adjacências honestas que sobraram (track-seo-rodada-3)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-rodada-3 origin/feat/seo-organico`. Divergiu → **PARE e reporte**.
`pnpm install --frozen-lockfile`. Package manager **pnpm**.

Leia antes: `.claude/tower/packs/track-seo-rodada-2-guias.md` INTEIRO (a seção "LIÇÕES
DA FASE 1" é regra; some as lições dos collectors da rodada 2 abaixo), `docs/seo/
source-of-truth.md`, `docs/seo/regua-de-copy.md`, `docs/seo/keyword-map.md` (linhas
das duas URLs no backlog), `src/seo/README.md`, `src/seo/tipos.ts`, e as vizinhas:
`comparativos/agencia-vs-equipe-interna.ts`, `comparativos/freelancer-vs-agencia-de-
conteudo.ts`, `guias/o-que-e-uma-agencia-de-marketing-com-ia.ts`, `guias/marketing-de-
conteudo-para-b2b.ts`, `guias/como-usar-o-mesmo-video-nas-tres-redes.ts`, `hubs/
videos-curtos.ts`, `hubs/marketing-organico.ts`, `dores/como-produzir-conteudo-sem-
equipe.ts`.

## LIÇÕES DOS COLLECTORS DA RODADA 2 (além das da FASE 1)
- Dois executores copiaram BLOCOS de vizinhas mesmo com a regra escrita. Antes de
  escrever um parágrafo, pergunte "isto já está em outra página?" — se sim, UMA frase
  + link. O gate compara frases de ≥10 palavras contra o corpus.
- Cabeçalho do arquivo (rastro) que afirma "nenhum bloco repetido" e mente é pior que
  o bloco repetido. Escreva a fronteira real com as vizinhas.
- Não negue nem afirme declaração de plataforma sem fonte nomeada; fique no observável.
- Não invente quantificador sobre a Doxa ("encurta pela metade"); a Doxa entra UMA vez.
- Aritmética própria: se fizer, confira duas vezes e hedge ("cerca de").
- Contrato/direitos/preço: só a não-resposta publicada em DUVIDAS_PT, verbatim.

## A VISÃO DO DONO
Duas buscas adjacentes que o keyword-map manda capturar como EDITORIAL (§47), sem a
Doxa se dizer o que não é: "vídeo vertical no LinkedIn" (rede FORA da garantia — a
página diz isso com todas as letras) e "o que faz um social media" (a pergunta de quem
está decidindo contratar alguém — ponte para agência×interna e freelancer×agência).

## CONTEXTO
- Só 2 arquivos NOVOS: `src/seo/conteudo/guias/video-vertical-no-linkedin.ts` e
  `src/seo/conteudo/guias/o-que-faz-um-social-media.ts`. As rotas JÁ estão em
  `rotas-planejadas.ts`? CONFIRA (`grep`); se NÃO estiverem, PARE e reporte — quem
  adiciona é a sessão principal (contrato). Outra track (`track-seo-correcao-2`) edita
  arquivos EXISTENTES em paralelo — você não toca em nenhum existente.
- URLs:
  - `/guias/video-vertical-no-linkedin` — hub `videos-curtos`. Ângulo: o formato vertical
    numa rede de feed profissional; o que muda (contexto de leitura, som, legenda,
    duração), o que a Doxa NÃO faz (o LinkedIn está FORA das três redes da garantia —
    source-of-truth §2/§3; dizer com todas as letras) e o que dá para reaproveitar do
    mesmo arquivo (linka `como-usar-o-mesmo-video-nas-tres-redes`). Nenhuma estatística
    de LinkedIn. Se não achar 900 palavras HONESTAS, faça 700 e diga — página rasa é
    pior; se não achar ângulo, NÃO escreva e diga por quê.
  - `/guias/o-que-faz-um-social-media` — hub `marketing-organico`. Ângulo: o cargo por
    dentro (o que entra e o que não entra), como o trabalho muda com vídeo curto, quando
    faz sentido contratar a pessoa × terceirizar × produzir sem equipe (linka os dois
    comparativos e a dor `como-produzir-conteudo-sem-equipe`), e onde a Doxa entra UMA
    vez (produção de vídeo, não gestão de rede — §47). Sem salário, sem "a maioria".
- Forma: rastro de fatos no topo, checklist no fim, `atualizadoEm: '2026-08-18'`,
  title ≤65, description 120–160 única, H1 ≠ title, ≥1 hub, 3 FAQs únicas no corpus
  com resposta rastreável (ou menos), 1 destaque doxa + cta, sem negrito nos 40
  primeiros caracteres do 1º parágrafo, células de tabela distintas na mesma linha.
- Ferramentas: `pnpm preview --port 5431 --strictPort`; hash do bundle conferido;
  `node .claude/tower/bin/mobile-shot.mjs <url> 320`; scratch em subdir próprio.

## A TASK
1. Confirmar rotas no contrato (PARE se faltar). 2. Ler vizinhas. 3. Escrever as duas
(commit por página). 4. `pnpm test src/seo` · `pnpm build` · preview · régua + §45 + QA
adversarial §63 por página. 5. Canibalização em uma linha por página.

## SCOPE
- src/seo/conteudo/guias/video-vertical-no-linkedin.ts
- src/seo/conteudo/guias/o-que-faz-um-social-media.ts

## DEPENDS ON
`feat/seo-organico` @ `794f48f`+ e as duas rotas em `rotas-planejadas.ts` (contrato-4).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 · `pnpm test` verde · `pnpm build` ok (68 rotas se as duas) · `pnpm seo:audit` sem ERRO
- `for u in video-vertical-no-linkedin o-que-faz-um-social-media; do test -f dist/guias/$u/index.html && echo "ok $u" || echo "FALTA $u (justificar)"; done`
- `for u in …; do f=dist/guias/$u/index.html; [ -f $f ] && echo "$u $(grep -c '<h1' $f) $(grep -o '<title>[^<]*' $f)"; done` — `1` + title próprio
- palavras do CORPO pelo `pnpm seo:audit` (não pelo `<main>`) — dentro de 700–1400 com justificativa se < 900
- `grep -niE "lorem|no mundo digital|em constante evolução|nos dias de hoje|estudos mostram|revolucion|quase todo|quase sempre|a maioria d|todo mundo|nenhuma plataforma|a rede pune|premia|castiga|comprovad" src/seo/conteudo/guias/video-vertical-no-linkedin.ts src/seo/conteudo/guias/o-que-faz-um-social-media.ts` = vazio
- `grep -niE "1\.500|G4|Nat[aá]lia Beauty|Estados Unidos|parceir[ao]s? d|somos uma agência|nossa agência|a agência doxa|salário|R\\$" <os 2>` = vazio (parceria só na negação)
- frases ≥10 palavras suas que aparecem em outra página do corpus = 0 (script; cole)
- FAQ única: `grep -rhoE "pergunta: *'[^']+'" src/seo/conteudo | sort | uniq -d` = vazio
- `git diff --name-only origin/feat/seo-organico...HEAD` = exatamente os 2 arquivos
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- mobile 320: `scrollWidth == clientWidth` nas duas

## COMMIT + PUSH
Um commit por página → `git push -u origin track-seo-rodada-3`. **NÃO mergeie.** Report:
tabela `URL | title | palavras (audit) | hub | canibalização | §45`, 3 fatos frágeis,
saída do VERIFY, verdict.
