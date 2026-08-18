# SEO orgânico — Rodada de conteúdo 2: comparativos + glossário (track-seo-rodada-2-comparativos-glossario)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-rodada-2-comparativos-glossario origin/feat/seo-organico`. Divergiu → **PARE e reporte**.

Leia antes: `docs/seo/source-of-truth.md`, `docs/seo/regua-de-copy.md`,
`docs/seo/keyword-map.md` (linhas das suas URLs), `src/seo/README.md`,
`src/seo/tipos.ts`, duas páginas já publicadas do mesmo tipo (forma), e o brief
`.claude/tower/briefs/011-seo-missao-do-dono.md` §18–22, §38, §45–47.

## A VISÃO DO DONO
Os comparativos da FASE 1 cobrem orgânico×pago, IA×tradicional, agência×interno, TikTok×Instagram, UGC×marca. Faltam as duas alternativas que o lead considera de verdade (freelancer e influenciador). E o glossário tem 11 verbetes; faltam os de métrica base (engajamento, impressões), o "clone digital" (termo que o dono usa), roteiro, legenda embutida, feed recomendado e CTA — verbetes curtos que fecham o cluster e recebem link das páginas que já os citam.

## CONTEXTO
- Só conteúdo: um arquivo por página em `src/seo/conteudo/<dir>/<slug>.ts`,
  `export const pagina: Pagina = {…}`. Motor NÃO se edita (necessidade → report).
- **URLs desta rodada** (todas já em `src/seo/rotas-planejadas.ts` OU listadas aqui —
  se não estiverem lá, quem adiciona é o GESTOR na feature branch ANTES do spawn,
  porque o arquivo é do motor):
  - `/comparativos/freelancer-vs-agencia-de-conteudo` — a "terceira via" do comparativo agência×interno; tabela de 7–8 critérios com conteúdo em cada célula; onde cada um ganha; a Doxa entra UMA vez, no fim, dizendo que não é nenhuma das duas (llms.txt:40-43); NÃO repetir a tabela de `agencia-vs-equipe-interna`
  - `/comparativos/conteudo-organico-vs-influenciador` — alternativa real do lead; sem estatística de influenciador; a Doxa não intermedeia criadores; NÃO repetir `ugc-vs-conteudo-de-marca` (leia antes; ângulo: influenciador = audiência alugada × conteúdo próprio = audiência construída)
  - `/glossario/engajamento` — verbete-base de métricas; o que conta e o que não conta; sem "taxa ideal"
  - `/glossario/impressoes` — fecha o par com `alcance-organico` (leia-o; não repita)
  - `/glossario/clone-digital` — o termo do dono (source-of-truth: foto + amostra de voz → clone que grava); diferença para avatar genérico (o verbete `avatar-de-ia` já existe — linke, não repita); consentimento
  - `/glossario/roteiro-de-video-curto` — entregável citado no source-of-truth; verbete define, o guia `como-escrever-roteiro-de-video-curto` (rodada paralela) executa — não escreva o guia aqui
  - `/glossario/legenda-embutida` — "legendado" é palavra da entrega; acessibilidade + som desligado + retenção (não "boa parte do consumo é sem som")
  - `/glossario/feed-recomendado` — explica "For You"/recomendação sem depender do verbete `algoritmo-do-tiktok` (leia-o; ângulo: o que é a superfície, não como decide)
  - `/glossario/cta` — o que é, onde entra num vídeo curto, o CTA que a régua da Doxa usa (hero + fecho); curto
- Mínimo: 8 (2 comparativos + 6 verbetes; `cta` é opcional se ficar raso) páginas com padrão. Nunca página rasa para bater número.
- Fatos: só `docs/seo/source-of-truth.md`. NÃO PUBLICÁVEL: preço, fidelidade, prazo do
  primeiro vídeo, formas de pagamento, ranking prometido. Adjacências §47 nunca em
  `/solucoes/`. Estatística de terceiro só com fonte nomeada no texto.
- Conferir: `pnpm test src/seo` · `pnpm build` · `pnpm preview --port 5299` e ler
  `http://localhost:5299/<url>/` (COM barra local). `pnpm seo:audit` antes do READY.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Aspas simples (convenção do repo), sem `any`/`as`.

## LIÇÕES DA FASE 1 (valem como regra nesta rodada)
- **Fatos**: só `docs/seo/source-of-truth.md` com `fonte:`. Os collectors da FASE 1
  reprovaram exatamente isto: (a) opção de formulário virada em estatística ("as
  empresas declaram sempre as mesmas cinco"); (b) generalizações empíricas sem fonte
  ("a maioria", "quase todo", "a rede pune", "nenhuma plataforma…", "estudos mostram",
  "times que fizeram a mudança costumam…") — reescreva como raciocínio ou hedge
  ("costuma", "é comum ver"); (c) claim de mercado colado à ressalva que o nega;
  (d) exemplo com números inventados sem estar rotulado NA PÁGINA — se usar, "Suponha
  que…" + H2 "Um exemplo hipotético" + "números inventados para ilustrar", e NUNCA ao
  lado de uma nota da Doxa; (e) fato mal atribuído (R$ 8.000–10.500 é "produção,
  agência e tráfego somados"; 18 dias é o que a landing APONTA, não mede; regras
  RT-1/RT-2/RH-1/AL-1 são "condição de quem já é cliente"). Chegou a "1.500 clientes /
  G4 / Natália Beauty / EUA / parceiros"? NÃO publique (source-of-truth §9/§11).
- **§47**: a Doxa NÃO é agência, NÃO vende tráfego pago, avatar/clone avulso, UGC,
  curso, ferramenta. Ferramentas (HeyGen, ElevenLabs…) são "usadas", nunca parceiras.
- **Doxa entra UMA vez**: um `destaque` variante doxa perto do fim + o `cta`. Não a
  cada seção (§33). O FAQ da Doxa (`faq/config.ts` DUVIDAS_PT) só verbatim; nada de
  PENDENTES; sem preço. Se não houver 4 perguntas com fonte, faça 3 — não invente.
- **Canibalização**: leia as vizinhas ANTES de escrever (a lista de páginas existentes
  está em `src/seo/conteudo/**`). Um bloco (cadência, "baixou publicou", zero
  impulsionamento, custo marginal) tem UM dono; as outras resumem em uma frase e
  linkam. FAQ repetida entre páginas = FAQPage duplicado — pergunta própria ou nada.
- **Forma**: rastro de fatos no topo do arquivo (comentário, `fonte:` por fato,
  batendo com o corpo) + checklist da régua no fim; `atualizadoEm: '2026-08-18'`;
  title ≤65, description 120–160 única, H1 ≠ title; primeiro parágrafo responde;
  sem negrito nos 40 primeiros caracteres do primeiro parágrafo (limitação do teste);
  células de tabela na mesma linha nunca com texto idêntico (limitação do layout).
- **Ferramentas**: `pnpm preview --port <porta livre> --strictPort` (5299 pode estar
  ocupada por outra track — porta ocupada não dá erro, dá site errado; confira o hash
  do bundle servido contra `dist/index.html` antes de medir); scratch em subdiretório
  próprio do scratchpad; mobile por `node .claude/tower/bin/mobile-shot.mjs <url> 320`.
- Links inline para a landing (`/`, `/#forms`, `/#faq`) agora resolvem — mas o `cta`
  da página já leva ao formulário; use inline só se a frase pedir.

## A TASK
1. Por página: keyword-map → escrever → `pnpm test src/seo` → `pnpm build` → ler no
   preview → checklist da `regua-de-copy.md` + §45 + QA adversarial §63.
2. Canibalização (§38): uma linha por página no report.
3. Commit POR PÁGINA.

**Vizinhas que você PRECISA ler antes**: `comparativos/agencia-vs-equipe-interna.ts`, `comparativos/ugc-vs-conteudo-de-marca.ts`, `glossario/{alcance-organico,algoritmo-do-tiktok,avatar-de-ia,clone-de-voz,hook,retencao,watch-time,ugc}.ts`, `solucoes/clone-de-ia-para-videos.ts`. Hubs: comparativos → `marketing-organico`; métricas → `marketing-organico`; clone-digital → `ia-no-marketing`; roteiro/legenda/cta → `videos-curtos`; feed-recomendado → `marketing-no-tiktok`.

## SCOPE
- src/seo/conteudo/comparativos/**
- src/seo/conteudo/glossario/**

## DEPENDS ON
`feat/seo-organico` com FASE 1 inteira mergeada (#48–#53) e as rotas desta rodada já em `src/seo/rotas-planejadas.ts` (PR do contrato-2).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde · `pnpm build` ok · `pnpm seo:audit` sem ERRO (avisos listados no report)
- `for f in dist/comparativos/freelancer-vs-agencia-de-conteudo/index.html dist/comparativos/conteudo-organico-vs-influenciador/index.html dist/glossario/engajamento/index.html dist/glossario/impressoes/index.html dist/glossario/clone-digital/index.html dist/glossario/roteiro-de-video-curto/index.html dist/glossario/legenda-embutida/index.html dist/glossario/feed-recomendado/index.html dist/glossario/cta/index.html; do test -f $f && echo "ok $f" || echo "FALTA $f"; done` = todos ok (as que você decidiu NÃO escrever por ficarem rasas: FALTA é aceitável SE justificado no report, página por página)
- `for f in dist/comparativos/freelancer-vs-agencia-de-conteudo/index.html dist/comparativos/conteudo-organico-vs-influenciador/index.html dist/glossario/engajamento/index.html dist/glossario/impressoes/index.html dist/glossario/clone-digital/index.html dist/glossario/roteiro-de-video-curto/index.html dist/glossario/legenda-embutida/index.html dist/glossario/feed-recomendado/index.html dist/glossario/cta/index.html; do [ -f $f ] && echo "$f $(grep -c '<h1' $f) $(grep -o '<title>[^<]*' $f)"; done` — `1` + title próprio
- palavras no `<main>` de cada página dentro da faixa do tipo (guia/dor 900–1400 · comparativo 1000–1500 · solução 900–1400 · verbete 150–400) — meça no HTML gerado (o grep de `texto:` NÃO mede strings multilinha)
- `grep -rniE "lorem|no mundo digital|em constante evolução|nos dias de hoje|estudos mostram|revolucion|quase todo|quase sempre|a maioria d|todo mundo|nenhuma plataforma|a rede pune|comprovad" src/seo/conteudo/{comparativos,glossario}` = vazio (ou cada ocorrência justificada)
- `grep -rniE "1\.500|G4|Nat[aá]lia Beauty|Estados Unidos|parceir[ao]s? d|somos uma agência|nossa agência|a agência doxa" src/seo/conteudo/{comparativos,glossario}` = vazio (parceria só na negação)
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/(comparativos|glossario)/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- mobile: `node .claude/tower/bin/mobile-shot.mjs http://localhost:<porta>/<uma rota sua>/ 320` → `scrollWidth == clientWidth`

## COMMIT + PUSH
Um commit por página → `git push -u origin track-seo-rodada-2-comparativos-glossario`. **NÃO
mergeie.** Ao terminar: tabela `URL | palavras | hubs | canibalização` + NECESSIDADES
DE MOTOR + verdict READY/NOT READY + saída COLADA do VERIFY.
