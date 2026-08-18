# SEO orgânico — Track CONTEÚDO C: hubs, dores, glossário + a porta na landing (task_seo_hubs_nav)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-hubs-nav origin/feat/seo-organico` — e confirme que `src/seo/tipos.ts`,
`src/seo/conteudo/solucoes/producao-de-videos-com-ia.ts` e
`docs/seo/source-of-truth.md` EXISTEM. Divergiu → **PARE e reporte**.

Leia antes: `docs/seo/source-of-truth.md`, `docs/seo/regua-de-copy.md`,
`docs/seo/keyword-map.md`, `src/seo/README.md`, `src/seo/tipos.ts` (o contrato),
`src/seo/site.ts` (`HUBS`: os títulos/descrições curtas que o motor já conhece), a
página do prelude, `src/components/rodape/config.ts` (só a parte `ATALHOS`, linhas
~200–224) e o brief `.claude/tower/briefs/011-seo-missao-do-dono.md` §13, §15–17,
§18–22, §45–47, §55–56.

## A VISÃO DO DONO
Os HUBS: cinco páginas-pilar (TikTok, Reels, IA no marketing, marketing orgânico,
vídeos curtos) que apresentam o assunto e linkam para tudo do cluster — e o cluster
linka de volta. As DORES: quem digita "por que meus vídeos não têm views" acha
resposta antes de achar a Doxa. O GLOSSÁRIO: verbetes curtos que respondem a
pergunta e conectam aos relacionados. E uma porta na landing — um link "Guias" no
rodapé — para a biblioteca não ser órfã do site.

## CONTEXTO (não perca tempo redescobrindo)
- **Você só escreve conteúdo + UMA linha de dados na landing.** Arquivos:
  `src/seo/conteudo/hubs/<slug>.ts` (`tipo: 'hub'`, e a URL resultante
  `/guias/<slug>` TEM de ser uma das cinco do union `Hub` em `tipos.ts` — o teste
  cobra), `src/seo/conteudo/dores/<slug>.ts` (`tipo: 'dor'`, URL `/guias/<slug>`),
  `src/seo/conteudo/glossario/<slug>.ts` (`tipo: 'glossario'`). Motor é da track de
  fundação — não edite; necessidade → report ("NECESSIDADE DE MOTOR: …").
- **Como o hub funciona no motor:** `PaginaHub.tsx` renderiza h1 + resumo + o `corpo`
  (curto: 400–800 palavras — o mapa do assunto, não um guia) + a lista automática
  dos membros = toda página cujo `hubs` inclui a URL do hub, agrupada por tipo. Você
  NÃO lista membros à mão; você escreve o corpo e, nas `relacionadas`, aponta os 3–5
  membros mais importantes (planejados valem) para que apareçam também como texto
  contextual. Um hub com `hubs: []` (é o único tipo que pode).
- **URLs suas:**
  - Hubs (os cinco, todos): `/guias/marketing-no-tiktok` · `/guias/reels-no-instagram`
    · `/guias/ia-no-marketing` · `/guias/marketing-organico` · `/guias/videos-curtos`.
  - Dores (`dores/`): `/guias/por-que-meus-videos-nao-tem-views` ·
    `/guias/como-postar-todos-os-dias-sem-equipe` ·
    `/guias/como-produzir-conteudo-sem-equipe` (as duas são vizinhas — §38: a
    primeira é RITMO/consistência, a segunda é CAPACIDADE/quem faz; se não
    conseguir separar de verdade, escreva UMA e registre a consolidação) ·
    `/guias/como-aumentar-o-alcance-organico`. Dor = 800–1300 palavras, começa pela
    resposta (as causas), depois o que fazer, depois onde a Doxa entra (uma vez).
  - Glossário (`glossario/`): `alcance-organico` `conteudo-organico` `hook` `retencao`
    `watch-time` `ugc` `short-form` `avatar-de-ia` `clone-de-voz` `algoritmo-do-tiktok`
    `conteudo-evergreen`. Verbete = 150–400 palavras: definição na primeira frase,
    por que importa, exemplo, relacionados (`relacionadas` com 2–4 verbetes/guias).
    `avatar-de-ia` e `clone-de-voz` são adjacências §47: definição, uso no mercado, e
    a ponte é o clone da Doxa como está em `HowItWorks.tsx` — nunca "a Doxa vende".
  - Mínimo desta rodada: **5 hubs + 3 dores + 8 verbetes** com padrão.
- **A porta na landing:** em `src/components/rodape/config.ts`, acrescente a
  `ATALHOS_PT` o item `{ rotulo: 'Guias', destino: '/guias' }` e a `ATALHOS_EN`
  `{ rotulo: 'Guides', destino: '/guias' }` — SÓ isso, mais nada no arquivo, com um
  comentário curto no padrão da casa (o rodapé só listava âncoras que existem; agora
  existe uma página). ATENÇÃO: o rodapé é apertado no celular (`whitespace-nowrap`,
  `text-[min(3.1vw,13px)]`, `Rodape.tsx` linhas 425–459). Prova obrigatória de que
  cabe em 320px: `pnpm build && (pnpm preview --port 5299 &)` e
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new
  --window-size=320,900 --screenshot=<scratchpad>/rodape-320.png
  http://localhost:5299/` + role até o rodapé via `--virtual-time-budget` ou meça com
  `--dump-dom`; se não couber, NÃO force: reporte e deixe o link fora (a track é
  READY sem ele; a fundação/FASE 2 resolve com o dono).
- **Fatos:** SÓ `docs/seo/source-of-truth.md` para qualquer afirmação sobre a Doxa.
  Conhecimento geral do assunto (mecanismos das plataformas, definições) pode, sem
  estatística de terceiro sem fonte nomeada. NÃO PUBLICÁVEL: preço, fidelidade,
  prazo do primeiro vídeo, formas de pagamento, ranking prometido.
- **Como conferir:** `pnpm test src/seo` · `pnpm build` · `pnpm preview --port 5299`
  e leia `http://localhost:5299/guias/<slug>/` e `/glossario/<slug>/` (COM barra
  local). O hub deve listar as páginas que existirem no seu branch (a do prelude
  aparece em `/guias/ia-no-marketing`).
- Armadilhas: **pnpm** · sem `any`/`as` · aspas SIMPLES como o resto de `src/` (a convenção do repo vence o STYLE) · nome de arquivo = slug ·
  `rodape/config.ts` é da landing: uma linha por idioma, nada além.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`.

**AVISO DA SESSÃO PRINCIPAL (pós-prelude, PR #49):** o motor de hoje NÃO resolve link
inline para a landing (`/`, `/#forms`, `/#faq` viram `desconhecida` e o render lança).
A track de fundação (T1) está corrigindo em paralelo. Até lá: **não escreva link
inline para a landing** — o CTA da página (hero + fecho, via `cta`) já leva ao
formulário. Também NÃO registre nada em `rotas-planejadas.ts` (é contrato; slug fora
da lista = PARE e reporte). O hash de `dist/assets/index-*.js` muda por cascata de CSS
e NÃO é critério de nada. Rastro de fatos no topo de cada arquivo (`fonte:` por fato,
apontando `docs/seo/source-of-truth.md`) e o checklist da régua no fim, como comentário.

## A TASK
1. Os cinco hubs primeiro (são o esqueleto que as outras tracks apontam), depois
   dores, depois glossário. Por página: keyword-map → escrever → `pnpm test src/seo`
   → `pnpm build` → ler no preview → checklist `regua-de-copy.md` + §45.
2. `rodape/config.ts`: as duas linhas + a prova de 320px.
3. Commit POR PÁGINA (`feat(seo): hub — <slug>` / `dor — …` / `glossário — …`) e um
   commit para o rodapé (`feat(seo): a porta da biblioteca no rodapé`).

## SCOPE
- src/seo/conteudo/hubs/**
- src/seo/conteudo/dores/**
- src/seo/conteudo/glossario/**
- src/components/rodape/config.ts

(NADA fora disso. `Rodape.tsx` NÃO; motor NÃO; outros diretórios de conteúdo NÃO.)

## DEPENDS ON
`prelude-seo-motor` e `track-seo-docs` mergeados em `feat/seo-organico`. PARALELA a
`track-seo-fundacao`, `track-seo-conteudo-solucoes`, `track-seo-conteudo-guias`.

**Medidor de mobile (use no VERIFY, não confie em `--window-size=390`):**
`(pnpm preview --port 5299 >/dev/null 2>&1 &); sleep 2; node .claude/tower/bin/mobile-shot.mjs http://localhost:5299/<rota>/ 320 <print.png>` — imprime `scrollWidth`/`clientWidth` (têm de ser iguais) e os elementos que passam da borda (só a tabela dentro de `overflow-x-auto` é aceitável). Print vai para o scratchpad e é descrito no report.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde · `pnpm build` ok
- `ls src/seo/conteudo/hubs/*.ts | wc -l` = 5 · `ls src/seo/conteudo/dores/*.ts | wc -l` ≥ 3 · `ls src/seo/conteudo/glossario/*.ts | wc -l` ≥ 8
- `for u in marketing-no-tiktok reels-no-instagram ia-no-marketing marketing-organico videos-curtos; do test -f dist/guias/$u/index.html && echo "ok $u"; done` = 5 ok
- `grep -c 'href="/solucoes/producao-de-videos-com-ia"' dist/guias/ia-no-marketing/index.html` ≥ 1 (o hub lista o membro que existe)
- `for f in dist/glossario/*/index.html; do echo "$f $(grep -c '<h1' $f)"; done` — cada linha `1`
- `grep -c "destino: '/guias'" src/components/rodape/config.ts` = 2 (ou 0, se você reportou que não coube — diga qual)
- `git diff origin/feat/seo-organico...HEAD -- src/components/rodape/config.ts | grep -c '^[+-][^+-]'` ≤ 12
- `grep -rniE "lorem|no mundo digital|em constante evolução|nos dias de hoje|estudos mostram" src/seo/conteudo/hubs src/seo/conteudo/dores src/seo/conteudo/glossario` = vazio
- `grep -rniE "a doxa (vende|oferece) (avatar|clone de voz|ugc)|doxa é uma agência" src/seo/conteudo/hubs src/seo/conteudo/dores src/seo/conteudo/glossario` = vazio
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/(hubs|dores|glossario)/|^src/components/rodape/config\.ts$'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- Print do rodapé a 320px salvo no scratchpad e descrito no report (sem overflow horizontal).

## RESUMO DO BRIEF QUE VALE AQUI (`.claude/tower/briefs/011-seo-missao-do-dono.md`)
§13 glossário: cada verbete responde e conecta · §16–17 hub linka o cluster e o
cluster linka de volta; sem 50 links no footer, links para humanos · §19 copy direta
· §38 canibalização · §45 o teste final · §46 proibições · §47 adjacências · §55–56
navegação: entrada "Guias" sem sobrecarregar; home não vira índice de SEO.

## COMMIT + PUSH
Um commit por página → `git push -u origin track-seo-hubs-nav`. **NÃO mergeie.**
Ao terminar: tabela `URL | tipo | palavras | membros listados (hubs)` + o veredito do
rodapé a 320px + NECESSIDADES DE MOTOR + verdict READY/NOT READY + saída COLADA do
VERIFY.
