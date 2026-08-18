# SEO orgânico — Rodada de CORREÇÃO 1: achados transversais do QA §63 (track-seo-correcao-1)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-correcao-1 origin/feat/seo-organico`. Divergiu → **PARE e reporte**.
`pnpm install --frozen-lockfile`. Package manager **pnpm**.

Leia antes: `docs/seo/source-of-truth.md` (§3 as DUAS redações da garantia; §4 a
ressalva do R$ 8.000–10.500; §9 não publicável), `docs/seo/regua-de-copy.md`,
`.claude/tower/packs/track-seo-rodada-2-guias.md` seção "LIÇÕES DA FASE 1".

## A VISÃO DO DONO
Nenhuma página nova. Esta rodada fecha as inconsistências que o QA adversarial
transversal (§63) achou lendo as 47 páginas juntas: fato sem ressalva onde as irmãs
têm ressalva, generalização empírica que passou, destaque idêntico em três páginas,
FAQ repetida (FAQPage duplicado), garantia citada sem a letra prudente. Corrigir é
CORTAR ou HEDGEAR — nunca inventar fato novo. Se um item exigir fato sem fonte, corte a
frase e diga no report.

## CONTEXTO
- Só conteúdo (`src/seo/conteudo/**`). Motor NÃO se edita. Nenhum arquivo novo.
- Você é a ÚNICA track ativa em `src/seo/conteudo/**` — pode tocar qualquer diretório
  de conteúdo, mas SÓ nas linhas listadas abaixo (mais o mínimo para a frase fechar).
- Cada correção mantém o `atualizadoEm` do arquivo (é data de mudança de CONTEÚDO —
  mudou frase de fato → `'2026-08-18'`; troca de hedge/FAQ também conta).

## A TASK (arquivo:linha aproximada — confira, a base pode ter deslocado)
1. **`solucoes/producao-de-videos-com-ia.ts:~140`** — "Montar essa operação por dentro
   custa entre R$ 8.000 e R$ 10.500 por mês" SEM a ressalva do §4. Alinhar às irmãs:
   "na conta que a Doxa publica na própria landing — o inventário de UMA operação
   (produção, agência e tráfego somados), ilustração e não levantamento de mercado".
   Idem `:~130` "sessenta conteúdos em noventa dias" → acrescentar "conforme as
   condições e o prazo do contrato" (como `producao-de-conteudo-em-escala:~157`).
2. **`glossario/ugc.ts:~59`** — "o feed de vídeo curto **premia** … e **castiga** o que
   parece um anúncio" → família "a rede pune", banida. Reescrever como observação
   hedgeada ("tende a segurar mais…", "costuma perder atenção…").
3. **`dores/por-que-meus-videos-nao-tem-views.ts:~136`** — "A prova disso é fácil de ver
   nos seus próprios números: os vídeos institucionais quase sempre são os de pior
   desempenho" → sem "prova" e sem "quase sempre": "Confira nos seus números: os
   institucionais costumam ficar entre os de pior desempenho do perfil".
4. **"a maior parte do alcance/distribuição vai para quem não segue"** — em
   `dores/por-que-meus-videos-nao-tem-views.ts:~183`, `dores/como-aumentar-o-alcance-
   organico.ts:~189`, `hubs/marketing-organico.ts:~88` (e onde mais aparecer:
   `grep -rn "maior parte d[ao] \(alcance\|distribuição\)" src/seo/conteudo`). Estatística
   de plataforma sem fonte. Nas TRÊS: "no vídeo curto, uma parte relevante do alcance
   costuma vir de quem ainda não segue" (ou equivalente hedgeado, igual nas três).
5. **`hubs/marketing-no-tiktok.ts:~37`** — "quantas pessoas veem o seu próximo vídeo
   depende muito mais do vídeo do que do tamanho do seu perfil" → hedge ("depende
   menos do tamanho do perfil do que se imagina: a plataforma…").
6. **Destaque de ferramentas triplicado** — `hubs/ia-no-marketing.ts:~129`,
   `solucoes/producao-de-videos-com-ia.ts:~214`, `solucoes/marketing-com-ia.ts:~202`
   ("Ferramenta não é estratégia… cinco contas… descartar rápido"). UM dono =
   `hubs/ia-no-marketing`. Nas duas soluções: reduzir a uma frase diferente + link
   para o hub (`[…](/guias/ia-no-marketing)`).
7. **`plataformas/youtube-shorts-para-empresas.ts:~108-112`** — destaque doxa com "Um
   milhão de views. Ou seu dinheiro de volta." SOLTO, sem a letra prudente (§3b) em
   seguida. Emendar a redação do FAQ como as outras páginas fazem ("metas de performance
   definidas em contrato… caso a meta não seja alcançada, aplicam-se as condições de
   garantia previstas no contrato").
8. **FAQ repetida (FAQPage duplicado)** — regra: UMA página é dona de cada pergunta;
   nas outras, trocar por pergunta própria com resposta VERBATIM de `faq/config.ts`
   (DUVIDAS_PT) ou do source-of-truth — se não houver, REMOVER (3 FAQs > 4 com repetida;
   0 FAQ é aceitável em página que já tem 3+ H2 de conteúdo). Mapa (dono → remover de):
   - "Eu preciso gravar os vídeos ou vocês fazem tudo?" → dono `solucoes/producao-de-
     videos-com-ia` (página-modelo); remover de `plataformas/instagram-reels-para-
     empresas`, `solucoes/videos-curtos-para-empresas`, `solucoes/producao-de-conteudo-
     em-escala`, `solucoes/clone-de-ia-para-videos`.
   - "A Doxa consegue seguir a identidade e o tom de voz…" → dono `solucoes/marketing-
     com-ia`; remover de `producao-de-videos-com-ia`, `videos-curtos-para-empresas`.
   - "Quantos vídeos vocês produzem por mês?" → dono `producao-de-conteudo-em-escala`;
     remover de `producao-de-videos-com-ia`.
   - "Preciso investir em mídia além do valor pago…" → dono `conteudo-organico-para-
     empresas`; remover de `instagram-reels-para-empresas`.
   - "Eu consigo acompanhar quantas visualizações…" → dono `conteudo-organico-para-
     empresas`; remover de `instagram-reels-para-empresas`.
   - "Em quais redes sociais vocês publicam…" → dono `solucoes/videos-curtos-para-
     empresas`; remover de `plataformas/tiktok-para-empresas`.
   - "E se os primeiros vídeos não performarem bem?" → dono `producao-de-videos-com-ia`;
     remover de `producao-de-conteudo-em-escala`.
   Se a página-modelo `producao-de-videos-com-ia` ficar com FAQ demais (6), ela pode
   ceder "tom de voz" (já cede acima) e ficar com 4–5.
9. **`glossario/watch-time.ts:~44-50`** — exemplo sob "Um exemplo hipotético" mas sem a
   frase "números inventados para ilustrar" no corpo (as irmãs `retencao`/`alcance-
   organico` têm). Acrescentar.
10. **`guias/como-fazer-videos-curtos-que-prendem.ts:~231`** — legenda automática "erra
    em nome próprio, número e termo técnico" → hedge ("costuma errar…").
10b. **Generalizações de T3 achadas pela rodada 2** (mesma família): `guias/como-fazer-
    videos-curtos-que-prendem.ts:~87` "a única parte que todo mundo vê" → "a única parte
    que toda pessoa que abriu vê"/"que ninguém pula"; `:~137` "quase sempre chega
    depois" → "costuma chegar depois"; `guias/o-que-e-ugc.ts:~141` "Quase sempre o
    primeiro sentido" → "Na maior parte das vezes em que a sigla aparece em briefing,
    é o primeiro sentido" (ou "costuma ser").
10c. **`/guias/como-usar-ia-no-marketing` não vai existir** (rodada 2 decidiu: o eixo já
    tem 3 donos). Trocar as citações inline em `solucoes/marketing-com-ia.ts` e
    `solucoes/producao-de-videos-com-ia.ts` (`grep -rn "como-usar-ia-no-marketing"
    src/seo/conteudo`) por `/guias/o-que-e-uma-agencia-de-marketing-com-ia` (se a frase
    é sobre avaliar fornecedor) ou `/guias/ia-no-marketing` (se é sobre onde a IA entra).
    A rota some do contrato numa passada do gestor depois — você NÃO edita
    `rotas-planejadas.ts`.
11. Herdados dos collectors da FASE 1 sem dono (NIT, se sobrar tempo): `dores/por-que-
    meus-videos-nao-tem-views.ts:~105` "menos de uns doze, é provavelmente esta" — ok
    como está (já hedgeado); confira só.
12. **`palavrasChave` colidindo com a keyword-alvo de páginas mais novas** (collector R2-C):
    `solucoes/producao-de-videos-com-ia.ts:~57` `'clone de voz para vídeos'` e
    `solucoes/clone-de-ia-para-videos.ts:~50` `'clone de voz para vídeo'` → tirar (a
    dona é `/solucoes/clone-de-voz-para-videos`); `solucoes/marketing-com-ia.ts:~48`
    `'ia para redes sociais'` → tirar (dona: `/solucoes/conteudo-para-redes-sociais-
    com-ia`). Não é renderizado, mas o keyword-map diz que a específica fica com a
    keyword.
12b. `guias/como-fazer-videos-curtos-que-prendem.ts` `palavrasChave` tem `'roteiro de vídeo
    curto'` — a dona é `/guias/como-escrever-roteiro-de-video-curto` (rodada 2). Tirar.
13. **`/glossario/cta`** (rodada 2, se já mergeada quando você rodar): hub fica
    `videos-curtos` (decisão da sessão principal) — nada a fazer; só não "corrigir".

## SCOPE
- src/seo/conteudo/solucoes/**
- src/seo/conteudo/plataformas/**
- src/seo/conteudo/guias/**
- src/seo/conteudo/dores/**
- src/seo/conteudo/hubs/**
- src/seo/conteudo/glossario/**
- src/seo/conteudo/comparativos/**
(SÓ as linhas dos itens acima + o mínimo para a frase fechar. Nenhum arquivo novo.
Motor, docs, landing: NÃO.)

## DEPENDS ON
`feat/seo-organico` @ `c4cc777` (FASE 1 + rodada 2 mergeadas, PRs #48–#57, 66 rotas, 26/963) e NENHUMA outra track de conteúdo ativa — garantido pela sessão principal.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde (nº de testes IGUAL ao da base — você
  não cria nem remove página) · `pnpm build` ok (mesmo nº de rotas) · `pnpm seo:audit`
  sem ERRO
- `grep -rn "R\$ 8\.000" src/seo/conteudo | wc -l` = mesmo número de antes, e para CADA
  ocorrência a linha ou as 3 linhas seguintes contêm "ilustração|inventário|não é
  (um )?levantamento" — cole o `grep -A3`
- `grep -rniE "premia|castiga|a rede pune|quase sempre|quase todo|a maioria d|todo mundo|nenhuma plataforma|a prova disso|maior parte d[ao] (alcance|distribuição)" src/seo/conteudo` = vazio (ou cada sobra justificada)
- FAQ única: script que extrai todas as `pergunta:` de `src/seo/conteudo/**` e lista as
  que aparecem em 2+ arquivos → vazio (cole a saída)
- `grep -rn "Um milhão de views. Ou seu dinheiro de volta" src/seo/conteudo` → para cada
  ocorrência, as 5 linhas seguintes contêm "contrato" (cole `grep -A5`)
- `grep -c "Ferramenta não é estratégia" -r src/seo/conteudo` = 1
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- `git diff origin/feat/seo-organico...HEAD --stat | tail -1` — cole (é para o gate ver o tamanho)

## COMMIT + PUSH
Um commit por ITEM (1–10), mensagem em português → `git push -u origin
track-seo-correcao-1`. **NÃO mergeie.** Report: item a item o que mudou (antes → depois,
1 linha), o que NÃO conseguiu sem inventar (e cortou), saída COLADA do VERIFY, verdict
READY/NOT READY.
