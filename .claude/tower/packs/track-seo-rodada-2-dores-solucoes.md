# SEO orgânico — Rodada de conteúdo 2: dores + soluções (track-seo-rodada-2-dores-solucoes)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-rodada-2-dores-solucoes origin/feat/seo-organico`. Divergiu → **PARE e reporte**.

Leia antes: `docs/seo/source-of-truth.md`, `docs/seo/regua-de-copy.md`,
`docs/seo/keyword-map.md` (linhas das suas URLs), `src/seo/README.md`,
`src/seo/tipos.ts`, duas páginas já publicadas do mesmo tipo (forma), e o brief
`.claude/tower/briefs/011-seo-missao-do-dono.md` §18–22, §38, §45–47.

## A VISÃO DO DONO
A dor "por que meu Instagram parou de crescer" é o par natural da dor de views (alta frequência, hub de Reels ainda com poucos membros). Nas soluções, duas cabeças de busca comerciais que o keyword-map prioriza e que NÃO colidem com as 6 existentes: "conteúdo para redes sociais com IA" (a busca ampla, cabeça de cluster) e "clone de voz para vídeos" (a metade voz do clone — hoje só verbete). Pulamos de propósito `avatar-de-ia-para-empresas` (colide com `clone-de-ia-para-videos` + guia + verbete) e `conteudo-recorrente` (colide com orgânico/escala).

## CONTEXTO
- Só conteúdo: um arquivo por página em `src/seo/conteudo/<dir>/<slug>.ts`,
  `export const pagina: Pagina = {…}`. Motor NÃO se edita (necessidade → report).
- **URLs desta rodada** (todas já em `src/seo/rotas-planejadas.ts` OU listadas aqui —
  se não estiverem lá, quem adiciona é o GESTOR na feature branch ANTES do spawn,
  porque o arquivo é do motor):
  - `/guias/por-que-meu-instagram-parou-de-crescer` (arquivo em `dores/`) — começa pelo sintoma; diagnóstico por causa com TESTE verificável (como `por-que-meus-videos-nao-tem-views` faz — leia-a e NÃO repita as causas de views; aqui é crescimento de perfil: seguidores × alcance de não-seguidores × mistura de formatos); dono do bloco "caiu ou mudou a mistura?" é `como-aumentar-o-alcance-organico` — linke; a Doxa entra uma vez no fim; hub `reels-no-instagram` — e linke o hub INLINE no corpo (`[…](/guias/reels-no-instagram)`): o `seo:audit` acusa esse hub como órfão (só o índice aponta para ele)
  - `/solucoes/conteudo-para-redes-sociais-com-ia` — cabeça de cluster ampla e comercial: o que a IA produz para redes (roteiro, locução, imagem de quem fala, legenda, capa), o que continua humano, para quem serve e para quem não; NÃO repetir `marketing-com-ia` (camadas do marketing) nem `producao-de-videos-com-ia` (o processo em 3 passos) — leia as duas; ângulo: a pergunta "dá para deixar as redes com a IA?" respondida com honestidade (o que dá, o que não dá); hub `ia-no-marketing`
  - `/solucoes/clone-de-voz-para-videos` — a metade voz: amostra → locução sintética que grava os vídeos; consentimento e uso; diferença para dublagem/TTS genérico; o que o clone de voz NÃO resolve; a Doxa NÃO vende clone de voz avulso (é parte da entrega — §47, dizer com todas as letras); linka `glossario/clone-de-voz` (define) e `solucoes/clone-de-ia-para-videos` (imagem+voz) sem repetir; hub `ia-no-marketing`
- Mínimo: 3 páginas com padrão. Nunca página rasa para bater número.
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

**Vizinhas que você PRECISA ler antes**: `dores/por-que-meus-videos-nao-tem-views.ts`, `dores/como-aumentar-o-alcance-organico.ts`, `guias/como-crescer-no-instagram-organicamente.ts`, `hubs/reels-no-instagram.ts`, `solucoes/{marketing-com-ia,producao-de-videos-com-ia,clone-de-ia-para-videos,producao-de-conteudo-em-escala}.ts`, `glossario/clone-de-voz.ts`, `glossario/avatar-de-ia.ts`. Se qualquer uma das três não tiver ângulo próprio depois da leitura, NÃO escreva e diga por quê.

## SCOPE
- src/seo/conteudo/dores/**
- src/seo/conteudo/solucoes/**

## DEPENDS ON
`feat/seo-organico` com FASE 1 inteira mergeada (#48–#53) e as rotas desta rodada já em `src/seo/rotas-planejadas.ts` (PR do contrato-2).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde · `pnpm build` ok · `pnpm seo:audit` sem ERRO (avisos listados no report)
- `for f in dist/guias/por-que-meu-instagram-parou-de-crescer/index.html dist/solucoes/conteudo-para-redes-sociais-com-ia/index.html dist/solucoes/clone-de-voz-para-videos/index.html; do test -f $f && echo "ok $f" || echo "FALTA $f"; done` = todos ok (as que você decidiu NÃO escrever por ficarem rasas: FALTA é aceitável SE justificado no report, página por página)
- `for f in dist/guias/por-que-meu-instagram-parou-de-crescer/index.html dist/solucoes/conteudo-para-redes-sociais-com-ia/index.html dist/solucoes/clone-de-voz-para-videos/index.html; do [ -f $f ] && echo "$f $(grep -c '<h1' $f) $(grep -o '<title>[^<]*' $f)"; done` — `1` + title próprio
- palavras no `<main>` de cada página dentro da faixa do tipo (guia/dor 900–1400 · comparativo 1000–1500 · solução 900–1400 · verbete 150–400) — meça no HTML gerado (o grep de `texto:` NÃO mede strings multilinha)
- `grep -rniE "lorem|no mundo digital|em constante evolução|nos dias de hoje|estudos mostram|revolucion|quase todo|quase sempre|a maioria d|todo mundo|nenhuma plataforma|a rede pune|comprovad" src/seo/conteudo/{dores,solucoes}` = vazio (ou cada ocorrência justificada)
- `grep -rniE "1\.500|G4|Nat[aá]lia Beauty|Estados Unidos|parceir[ao]s? d|somos uma agência|nossa agência|a agência doxa" src/seo/conteudo/{dores,solucoes}` = vazio (parceria só na negação)
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/(dores|solucoes)/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- mobile: `node .claude/tower/bin/mobile-shot.mjs http://localhost:<porta>/<uma rota sua>/ 320` → `scrollWidth == clientWidth`

## COMMIT + PUSH
Um commit por página → `git push -u origin track-seo-rodada-2-dores-solucoes`. **NÃO
mergeie.** Ao terminar: tabela `URL | palavras | hubs | canibalização` + NECESSIDADES
DE MOTOR + verdict READY/NOT READY + saída COLADA do VERIFY.
