# SEO orgânico — Rodada de conteúdo 2: guias (track-seo-rodada-2-guias)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-rodada-2-guias origin/feat/seo-organico`. Divergiu → **PARE e reporte**.

Leia antes: `docs/seo/source-of-truth.md`, `docs/seo/regua-de-copy.md`,
`docs/seo/keyword-map.md` (linhas das suas URLs), `src/seo/README.md`,
`src/seo/tipos.ts`, duas páginas já publicadas do mesmo tipo (forma), e o brief
`.claude/tower/briefs/011-seo-missao-do-dono.md` §18–22, §38, §45–47.

## A VISÃO DO DONO
A FASE 1 deixou o cluster de vídeos curtos com hub + 2 guias e o de orgânico com hub + comparativos, mas as buscas de EXECUÇÃO (como produzir 60 em 90 dias, hook, roteiro, mesmo vídeo nas três redes, quantas vezes postar, como medir) — que são as que a metodologia da Doxa responde melhor que a SERP, com fonte no manual — ainda não têm página. Esta rodada escreve os guias de execução + a adjacência §47 "o que é uma agência de marketing com IA" + B2B (o FAQ afirma que a Doxa serve B2B) + Shorts.

## CONTEXTO
- Só conteúdo: um arquivo por página em `src/seo/conteudo/<dir>/<slug>.ts`,
  `export const pagina: Pagina = {…}`. Motor NÃO se edita (necessidade → report).
- **URLs desta rodada** (todas já em `src/seo/rotas-planejadas.ts` OU listadas aqui —
  se não estiverem lá, quem adiciona é o GESTOR na feature branch ANTES do spawn,
  porque o arquivo é do motor):
  - `/guias/como-produzir-60-videos-em-90-dias` — a metodologia (RT-1/RT-2, dias úteis, três redes, "baixou publicou") como passo a passo para quem vai fazer por conta; dono do bloco "rotina de 90 dias" — `como-postar-todos-os-dias-sem-equipe` é rotina semanal, esta é o arco inteiro
  - `/guias/como-usar-o-mesmo-video-nas-tres-redes` — RT-1 vira guia: mesmo arquivo, área segura, sem marca-d'água de outra rede, views somadas; NÃO repetir `youtube-shorts-para-empresas` (comercial) nem `tiktok-vs-instagram`
  - `/guias/como-fazer-hook-de-video-curto` — execução (o verbete `hook` define; `como-fazer-videos-curtos-que-prendem` é a peça inteira) — este é SÓ os primeiros 2–3 segundos, com pares fraco×forte
  - `/guias/como-escrever-roteiro-de-video-curto` — roteiro é entregável citado no source-of-truth; estrutura, duração por leitura, o que a IA gera e o que continua humano
  - `/guias/quantas-vezes-postar-por-dia-no-tiktok` — a pergunta que RT-2/RH-1 respondem (dono do bloco de cadência é `como-viralizar-no-tiktok` — aqui responda a pergunta e linke, não repita o bloco)
  - `/guias/como-medir-resultado-de-conteudo-organico` — métricas (alcance, retenção, watch time, não-seguidores) e "views somadas nas três redes"; linka verbetes, não os repete
  - `/guias/o-que-e-uma-agencia-de-marketing-com-ia` — **§47**: captura a busca sem a Doxa se dizer agência; o que é, o que faz, como avaliar; a Doxa entra uma vez dizendo o que NÃO é (llms.txt:40-43); ponte para `agencia-vs-equipe-interna`
  - `/guias/como-crescer-no-youtube-shorts` — a terceira rede, sub-atendida; sem números de audiência; diferencia de `youtube-shorts-para-empresas` (comercial)
  - `/guias/marketing-de-conteudo-para-b2b` — só o que o FAQ sustenta (a Doxa serve B2B; funil mais longo é raciocínio, não estatística); sem página por indústria
  - `/guias/como-usar-ia-no-marketing` e `/guias/estrategia-de-conteudo-para-empresas` — JÁ planejadas; T3 pulou por risco de página rasa/canibalização com hub `ia-no-marketing`, `marketing-com-ia` e `marketing-organico`. Escreva SÓ se achar um ângulo próprio (ex.: "como usar" = decisão por camada com checklist; "estratégia" = o documento de uma página que a empresa deveria ter antes de contratar qualquer um). Se não achar, NÃO escreva e diga por quê no report — página rasa é pior que link em texto.
- Mínimo: 8 (das 11 listadas; as 2 já planejadas são opcionais com justificativa) páginas com padrão. Nunca página rasa para bater número.
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

**Vizinhas que você PRECISA ler antes** (para não repetir): `guias/como-viralizar-no-tiktok.ts` (dono da cadência), `guias/como-fazer-videos-curtos-que-prendem.ts` (dono da peça/"preciso aparecer"), `dores/como-postar-todos-os-dias-sem-equipe.ts` (rotina semanal), `hubs/videos-curtos.ts`, `hubs/marketing-organico.ts`, `hubs/ia-no-marketing.ts`, `solucoes/marketing-com-ia.ts`, `plataformas/youtube-shorts-para-empresas.ts`, `comparativos/agencia-vs-equipe-interna.ts`, `glossario/{hook,retencao,watch-time,alcance-organico}.ts`. Hubs: guias de execução → `videos-curtos` ou `marketing-no-tiktok`; medir/B2B → `marketing-organico`; agência-com-IA → `ia-no-marketing`; Shorts → `videos-curtos`.

## SCOPE
- src/seo/conteudo/guias/**

## DEPENDS ON
`feat/seo-organico` com FASE 1 inteira mergeada (#48–#53) e as rotas desta rodada já em `src/seo/rotas-planejadas.ts` (PR do contrato-2).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde · `pnpm build` ok · `pnpm seo:audit` sem ERRO (avisos listados no report)
- `for f in dist/guias/como-produzir-60-videos-em-90-dias/index.html dist/guias/como-usar-o-mesmo-video-nas-tres-redes/index.html dist/guias/como-fazer-hook-de-video-curto/index.html dist/guias/como-escrever-roteiro-de-video-curto/index.html dist/guias/quantas-vezes-postar-por-dia-no-tiktok/index.html dist/guias/como-medir-resultado-de-conteudo-organico/index.html dist/guias/o-que-e-uma-agencia-de-marketing-com-ia/index.html dist/guias/como-crescer-no-youtube-shorts/index.html dist/guias/marketing-de-conteudo-para-b2b/index.html dist/guias/como-usar-ia-no-marketing/index.html dist/guias/estrategia-de-conteudo-para-empresas/index.html; do test -f $f && echo "ok $f" || echo "FALTA $f"; done` = todos ok (as que você decidiu NÃO escrever por ficarem rasas: FALTA é aceitável SE justificado no report, página por página)
- `for f in dist/guias/como-produzir-60-videos-em-90-dias/index.html dist/guias/como-usar-o-mesmo-video-nas-tres-redes/index.html dist/guias/como-fazer-hook-de-video-curto/index.html dist/guias/como-escrever-roteiro-de-video-curto/index.html dist/guias/quantas-vezes-postar-por-dia-no-tiktok/index.html dist/guias/como-medir-resultado-de-conteudo-organico/index.html dist/guias/o-que-e-uma-agencia-de-marketing-com-ia/index.html dist/guias/como-crescer-no-youtube-shorts/index.html dist/guias/marketing-de-conteudo-para-b2b/index.html dist/guias/como-usar-ia-no-marketing/index.html dist/guias/estrategia-de-conteudo-para-empresas/index.html; do [ -f $f ] && echo "$f $(grep -c '<h1' $f) $(grep -o '<title>[^<]*' $f)"; done` — `1` + title próprio
- palavras no `<main>` de cada página dentro da faixa do tipo (guia/dor 900–1400 · comparativo 1000–1500 · solução 900–1400 · verbete 150–400) — meça no HTML gerado (o grep de `texto:` NÃO mede strings multilinha)
- `grep -rniE "lorem|no mundo digital|em constante evolução|nos dias de hoje|estudos mostram|revolucion|quase todo|quase sempre|a maioria d|todo mundo|nenhuma plataforma|a rede pune|comprovad" src/seo/conteudo/{guias}` = vazio (ou cada ocorrência justificada)
- `grep -rniE "1\.500|G4|Nat[aá]lia Beauty|Estados Unidos|parceir[ao]s? d|somos uma agência|nossa agência|a agência doxa" src/seo/conteudo/{guias}` = vazio (parceria só na negação)
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/(guias)/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- mobile: `node .claude/tower/bin/mobile-shot.mjs http://localhost:<porta>/<uma rota sua>/ 320` → `scrollWidth == clientWidth`

## COMMIT + PUSH
Um commit por página → `git push -u origin track-seo-rodada-2-guias`. **NÃO
mergeie.** Ao terminar: tabela `URL | palavras | hubs | canibalização` + NECESSIDADES
DE MOTOR + verdict READY/NOT READY + saída COLADA do VERIFY.
