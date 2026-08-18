# SEO orgânico — Track CONTEÚDO A: soluções + plataformas (task_seo_conteudo_solucoes)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-conteudo-solucoes origin/feat/seo-organico` — e confirme que
`src/seo/tipos.ts`, `src/seo/conteudo/solucoes/producao-de-videos-com-ia.ts` e
`docs/seo/source-of-truth.md` EXISTEM. Divergiu → **PARE e reporte**.

Leia antes, nesta ordem: `docs/seo/source-of-truth.md` (é o limite do que você pode
afirmar), `docs/seo/regua-de-copy.md`, `docs/seo/keyword-map.md` (as linhas das
suas URLs), `src/seo/README.md`, `src/seo/tipos.ts` (o contrato — é lei), a página
do prelude (o exemplo de forma), e `.claude/tower/briefs/011-seo-missao-do-dono.md`
§18–22, §34–38, §45–47.

## A VISÃO DO DONO
As páginas que VENDEM: quem busca "produção de vídeos com IA para empresas",
"marketing com IA", "conteúdo orgânico para empresas", "TikTok para empresas" acha
uma página da Doxa que responde de verdade, mostra como funciona, o que muda em
relação ao jeito antigo, onde a Doxa entra e como falar com o time — sem inventar um
número, sem virar propaganda em cada parágrafo. Parece produto Doxa, não blog.

## CONTEXTO (não perca tempo redescobrindo)
- **Você só escreve conteúdo.** Cada página é UM arquivo
  `src/seo/conteudo/solucoes/<slug>.ts` ou `src/seo/conteudo/plataformas/<slug>.ts`
  exportando `export const pagina: Pagina = {…}` (anotação, não `as`). O motor
  (`src/seo/**` fora de `conteudo/`) é da track de fundação: NÃO edite layout, tipos,
  head, testes. Faltou um tipo de bloco ou um campo? Escreva com o que existe e
  registre a necessidade no report ("NECESSIDADE DE MOTOR: …"). Precisou de uma URL
  fora de `src/seo/rotas-planejadas.ts` para linkar? Não linke (vira texto) e
  registre no report.
- **URLs suas** (`docs/seo/keyword-map.md` tem intent/keywords/título provisório;
  `tipo: 'solucao'` em `solucoes/`, `tipo: 'plataforma'` em `plataformas/`):
  - `/solucoes/marketing-com-ia` — ATENÇÃO: a Doxa NÃO é agência (`llms.txt`); a
    página captura a intenção "agência de marketing com IA" explicando o que a Doxa
    é (plataforma + operação de conteúdo com garantia) e o que não é, sem se
    autodenominar agência.
  - `/solucoes/conteudo-organico-para-empresas`
  - `/solucoes/producao-de-conteudo-em-escala`
  - `/solucoes/videos-curtos-para-empresas` (diferencie de "em escala": aqui é o
    formato — vertical, curto, legendado; lá é o volume/recorrência)
  - `/solucoes/clone-de-ia-para-videos` (o produto real: uma foto e um áudio viram o
    clone que grava no lugar da pessoa — `HowItWorks.tsx`; ferramentas de
    `tools.ts` só como "ferramentas usadas")
  - `/plataformas/tiktok-para-empresas` · `/plataformas/instagram-reels-para-empresas`
    · `/plataformas/youtube-shorts-para-empresas` (só onde a intenção difere de
    verdade — §7–8; se duas ficarem iguais trocando o nome da rede, CONSOLIDE e
    registre)
  - Mínimo desta rodada: **as 5 soluções + 2 plataformas** com padrão. Sobrou fôlego
    → a terceira plataforma; nunca páginas rasas para "bater número".
- **Cada página:** `hubs` com ≥1 dos 5 (`/guias/ia-no-marketing` para IA/clone,
  `/guias/marketing-organico` para orgânico/escala, `/guias/marketing-no-tiktok` /
  `/guias/reels-no-instagram` / `/guias/videos-curtos` para plataformas e formato);
  `relacionadas` 3–6 URLs (planejadas valem); links inline `[texto](/rota)` no corpo
  quando ajudam quem lê (não "50 links"); `titulo` ≤ 65 chars, exclusivo, orientado à
  intenção (não `Keyword | DOXA`); `descricao` 120–160; `h1` ≠ `titulo`; `resumo`
  responde na primeira frase; 900–1500 palavras no `corpo`; estrutura sugerida (§18,
  não force todos): resposta direta → como funciona → o que muda em relação ao jeito
  antigo (`CUSTO_DE/CUSTO_ATE` e `ITENS` são fatos publicáveis, com a redação da
  comparação) → para quem é / não é → onde a Doxa entra (`destaque` variante `doxa`) →
  FAQ (4–6, SÓ perguntas cujas respostas estão no source of truth; senão não
  pergunte) → `cta`. `atualizadoEm: '2026-08-18'`.
- **Fatos:** SÓ os de `docs/seo/source-of-truth.md`. A garantia sai com a redação
  do FAQ do dono ("metas de performance definidas em contrato… condições previstas
  em contrato") ou com a do topo ("Um milhão de views. Ou seu dinheiro de volta.") —
  nunca uma terceira. Clientes: só Core, Magalu, Uninova, e só o que está escrito
  em `hero/cases.ts`. NÃO PUBLICÁVEL: preço/mensalidade, fidelidade, prazo do
  primeiro vídeo, formas de pagamento, direitos, "aparecer no vídeo", agência
  licenciada, ranking prometido.
- **Como conferir:** `pnpm test src/seo` roda as invariantes do motor sobre TODAS as
  páginas (unicidade, slug, links, tamanho, aberturas proibidas). `pnpm build` gera
  `dist/<sua-url>/index.html`; `pnpm preview --port 5299` e abra
  `http://localhost:5299/solucoes/<slug>/` (COM barra no preview local) para ler a
  página como leitor. Leia cada uma inteira antes de dar READY.
- Armadilhas: **pnpm** · sem `any`, sem `as`, `readonly` nos arrays como no exemplo ·
  aspas SIMPLES como o resto de `src/` (a convenção do repo vence o STYLE) · comentário só se explicar uma escolha editorial · nomes de arquivo =
  slug exato.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`.

## A TASK
1. Uma a uma, na ordem acima: ler as linhas do keyword-map, escrever o arquivo,
   `pnpm test src/seo`, `pnpm build`, ler no preview, aplicar o checklist da
   `regua-de-copy.md` e o teste do §45 ("publicaria se o Google não existisse?").
2. Antes de cada nova página: canibalização (§38) — o que esta responde que a
   anterior não responde? Escreva a resposta em uma linha no report.
3. Commit POR PÁGINA (`feat(seo): solução — <slug>`), para a noite não perder trabalho.

## SCOPE
- src/seo/conteudo/solucoes/** (arquivos NOVOS; a página do prelude
  `producao-de-videos-com-ia.ts` só se for para corrigir fato — registre)
- src/seo/conteudo/plataformas/**

(NADA fora desses dois diretórios. Motor, docs, landing, `package.json` são de outras
tracks. Precisou → PARE e reporte.)

## DEPENDS ON
`prelude-seo-motor` e `track-seo-docs` mergeados em `feat/seo-organico`. Roda em
PARALELO com `track-seo-fundacao`, `track-seo-conteudo-guias`, `track-seo-hubs-nav`.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde · `pnpm build` ok
- `ls src/seo/conteudo/solucoes/*.ts | wc -l` ≥ 6 (5 novas + a do prelude) e
  `ls src/seo/conteudo/plataformas/*.ts | wc -l` ≥ 2
- `for f in dist/solucoes/*/index.html dist/plataformas/*/index.html; do echo "$f $(grep -c '<h1' $f) $(grep -o '<title>[^<]*' $f)"; done` — cada linha com `1` e title próprio
- `for f in src/seo/conteudo/solucoes/*.ts src/seo/conteudo/plataformas/*.ts; do echo "$f $(grep -oE "texto: ['\"][^'\"]*" $f | wc -w)"; done` — cada arquivo ≥ 900 (aproximação de palavras; o teste do motor é o juiz)
- `grep -rniE "lorem|no mundo digital|em constante evolução|nos dias de hoje|revolucion" src/seo/conteudo/solucoes src/seo/conteudo/plataformas` = vazio
- `grep -rnE "R\\$ ?[0-9]" src/seo/conteudo/solucoes src/seo/conteudo/plataformas | grep -vE "8\\.000|10\\.500"` = vazio (nenhum valor em reais que não seja o da comparação)
- `grep -rniE "somos uma agência|nossa agência|a agência doxa" src/seo/conteudo/solucoes src/seo/conteudo/plataformas` = vazio
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/(solucoes|plataformas)/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio

## RESUMO DO BRIEF QUE VALE AQUI (`.claude/tower/briefs/011-seo-missao-do-dono.md`)
§0 cada página com intenção própria, valor real, motivo de existir · §2 não inventar ·
§18 base de qualidade (não forçar blocos) · §19 copy direta, começa respondendo · §22
metadata individual · §33 CTA por intenção, sem transformar parágrafo em propaganda ·
§34 prioridade máxima = intenção comercial · §38 canibalização · §45 o teste final ·
§46 proibições · §47 nunca dizer que a Doxa oferece o que não oferece.

## COMMIT + PUSH
Um commit por página → ao fim `git push -u origin track-seo-conteudo-solucoes`.
**NÃO mergeie.** Ao terminar: sumário com a tabela `URL | palavras | hubs | FAQ (n) |
canibalização (1 linha)` + NECESSIDADES DE MOTOR + verdict READY/NOT READY + saída
COLADA do VERIFY.
