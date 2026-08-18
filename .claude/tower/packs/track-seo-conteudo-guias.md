# SEO orgânico — Track CONTEÚDO B: guias + comparativos (task_seo_conteudo_guias)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-conteudo-guias origin/feat/seo-organico` — e confirme que
`src/seo/tipos.ts`, `src/seo/conteudo/solucoes/producao-de-videos-com-ia.ts` e
`docs/seo/source-of-truth.md` EXISTEM. Divergiu → **PARE e reporte**.

Leia antes, nesta ordem: `docs/seo/source-of-truth.md`, `docs/seo/regua-de-copy.md`,
`docs/seo/keyword-map.md` (as linhas das suas URLs), `src/seo/README.md`,
`src/seo/tipos.ts` (o contrato — é lei), a página do prelude (forma), e o brief
`.claude/tower/briefs/011-seo-missao-do-dono.md` §11–13, §18–22, §36–38, §45–47.

## A VISÃO DO DONO
A parte da biblioteca que ENSINA: guias que uma pessoa leria mesmo sem a Doxa
existir, e comparativos honestos o bastante para serem úteis — orgânico vs pago,
TikTok vs Instagram, IA vs produção tradicional, agência vs equipe interna — sem
concluir artificialmente que a Doxa é sempre a resposta. Profundidade, não texto
longo artificial. E as adjacências (avatar de IA, UGC) tratadas como o que são:
informação, com ponte legítima para o que a Doxa faz de verdade.

## CONTEXTO (não perca tempo redescobrindo)
- **Você só escreve conteúdo.** Um arquivo por página em `src/seo/conteudo/guias/
  <slug>.ts` (`tipo: 'guia'`) ou `src/seo/conteudo/comparativos/<slug>.ts` (`tipo:
  'comparativo'`), `export const pagina: Pagina = {…}`. Motor é da track de
  fundação — não edite; necessidade → report ("NECESSIDADE DE MOTOR: …"). URL fora de
  `src/seo/rotas-planejadas.ts` não se linka (vira texto) — registre.
- **Os hubs NÃO são seus** (`/guias/marketing-no-tiktok`, `/guias/reels-no-instagram`,
  `/guias/ia-no-marketing`, `/guias/marketing-organico`, `/guias/videos-curtos` são
  da track de hubs, em `conteudo/hubs/`). As dores (`por-que-meus-videos-…`,
  `como-postar-todos-os-dias-…`, `como-produzir-conteudo-…`, `como-aumentar-o-
  alcance-…`) também não — ficam em `conteudo/dores/`, da mesma track. Você linka
  para eles (planejados) e declara `hubs` — o hub lista você sozinho no build.
- **URLs suas:**
  - Guias (`guias/`): `/guias/como-viralizar-no-tiktok` ·
    `/guias/como-crescer-no-instagram-organicamente` ·
    `/guias/como-fazer-videos-curtos-que-prendem` (hook, retenção, watch time — linka
    os verbetes planejados do glossário) · `/guias/estrategia-de-conteudo-para-empresas`
    · `/guias/como-usar-ia-no-marketing` · `/guias/o-que-e-avatar-de-ia` (ADJACÊNCIA
    §47: explica o que é, como se usa no mercado, prós/limites; a ponte é o clone da
    Doxa, descrito como está em `HowItWorks.tsx` — nunca "a Doxa vende avatares") ·
    `/guias/o-que-e-ugc` (ADJACÊNCIA: a Doxa não faz UGC; explique, e a ponte é a
    comparação `ugc-vs-conteudo-de-marca`).
  - Comparativos (`comparativos/`): `/comparativos/organico-vs-pago` (a Doxa é
    orgânico — `llms.txt` "não é tráfego pago" — e o comparativo tem de dar razão ao
    pago onde ele ganha) · `/comparativos/tiktok-vs-instagram` ·
    `/comparativos/ia-vs-producao-tradicional-de-video` (a conta dos R$ 8.000–10.500
    e os 25 itens são fatos publicáveis, com a redação da comparação; o "tradicional"
    tem vantagens reais — diga quais) · `/comparativos/agencia-vs-equipe-interna`
    (a Doxa não é nenhum dos dois; a terceira via aparece no fim, uma vez) ·
    `/comparativos/ugc-vs-conteudo-de-marca`.
  - Mínimo desta rodada: **4 guias + 3 comparativos** com padrão. Sobrou fôlego → o
    resto da lista; nunca página rasa para "bater número".
- **Forma:** guia 1200–2000 palavras, comparativo 900–1500; `titulo` ≤ 65 chars,
  orientado à pergunta; `descricao` 120–160; `resumo` responde na primeira frase;
  títulos nível 2 claros (viram TOC); comparativos usam `tabela` (critério ×
  opção) e `destaque` `nota` para o veredito "depende de…"; guias usam `passos`,
  `lista`, `destaque`; FAQ 3–5 só com respostas que você sustenta com o source of
  truth OU com conhecimento geral verificável do assunto (mecanismos das
  plataformas, definições) — NUNCA fato sobre a Doxa que não esteja no source of
  truth; `hubs` ≥1; `relacionadas` 3–6; `atualizadoEm: '2026-08-18'`; onde a Doxa
  entra = UM `destaque` variante `doxa` perto do fim, não a cada seção (§33).
- **Sobre "conhecimento geral" (algoritmo, formatos, boas práticas):** pode, com
  cautela — sem números de terceiros ("70% dos usuários…") a menos que cite a fonte
  pública no texto; sem "estudos mostram" sem estudo. Mecanismo, não estatística.
- **Como conferir:** `pnpm test src/seo` · `pnpm build` · `pnpm preview --port 5299`
  e leia `http://localhost:5299/guias/<slug>/` (COM barra local). Cada página lida
  inteira antes do READY.
- Armadilhas: **pnpm** · sem `any`/`as` · aspas SIMPLES como o resto de `src/` (o STYLE fala em duplas para outro repo; aqui a convenção estabelecida vence) · nome de arquivo = slug.
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
1. Uma a uma: keyword-map → escrever → `pnpm test src/seo` → `pnpm build` → ler no
   preview → checklist da `regua-de-copy.md` + §45 + a pergunta do QA adversarial
   §63 ("se eu fosse o Google caçando página feita só para SEO, o que me deixaria
   desconfiado?").
2. Canibalização (§38) antes de cada página, uma linha no report.
3. Commit POR PÁGINA (`feat(seo): guia — <slug>` / `feat(seo): comparativo — <slug>`).

## SCOPE
- src/seo/conteudo/guias/**
- src/seo/conteudo/comparativos/**

(NADA fora desses dois diretórios. `conteudo/hubs`, `conteudo/dores`, `conteudo/
glossario` são da track de hubs; `conteudo/solucoes|plataformas` da track de
soluções; motor da fundação.)

## DEPENDS ON
`prelude-seo-motor` e `track-seo-docs` mergeados em `feat/seo-organico`. PARALELA a
`track-seo-fundacao`, `track-seo-conteudo-solucoes`, `track-seo-hubs-nav`.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde · `pnpm build` ok
- `ls src/seo/conteudo/guias/*.ts | wc -l` ≥ 4 · `ls src/seo/conteudo/comparativos/*.ts | wc -l` ≥ 3
- `for f in dist/guias/*/index.html dist/comparativos/*/index.html; do echo "$f $(grep -c '<h1' $f) $(grep -o '<title>[^<]*' $f)"; done` — cada linha `1` + title próprio (os hubs/dores de outra track podem ou não estar aí; ignore-os)
- `for f in dist/comparativos/*/index.html; do echo "$f $(grep -c '<table' $f)"; done` — cada comparativo ≥ 1 tabela
- `grep -rniE "lorem|no mundo digital|em constante evolução|nos dias de hoje|estudos mostram|revolucion" src/seo/conteudo/guias src/seo/conteudo/comparativos` = vazio
- `grep -rniE "a doxa (vende|oferece|faz) (avatar|ugc)|doxa é uma agência" src/seo/conteudo/guias src/seo/conteudo/comparativos` = vazio
- `grep -rnE "[0-9]{2}% d(os|as|e) " src/seo/conteudo/guias src/seo/conteudo/comparativos` = vazio (nenhuma estatística de terceiro sem fonte; se houver com fonte nomeada no mesmo texto, liste no report)
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/(guias|comparativos)/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio

## RESUMO DO BRIEF QUE VALE AQUI (`.claude/tower/briefs/011-seo-missao-do-dono.md`)
§11 comparativos imparciais o bastante para serem úteis · §12 guias com profundidade
> texto longo · §19 copy direta · §22 metadata individual · §33 CTA sem propaganda em
parágrafo · §36 formato que a SERP pede · §38 canibalização · §45 o teste final · §46
proibições · **§47 adjacências: nunca dizer que a Doxa oferece X; ponte legítima**.

## COMMIT + PUSH
Um commit por página → `git push -u origin track-seo-conteudo-guias`. **NÃO
mergeie.** Ao terminar: tabela `URL | palavras | hubs | tabela/FAQ | canibalização` +
NECESSIDADES DE MOTOR + verdict READY/NOT READY + saída COLADA do VERIFY.
