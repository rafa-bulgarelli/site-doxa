# SEO orgânico — Rodada de CORREÇÃO 3: QA transversal 2 (track-seo-correcao-3)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-correcao-3 origin/feat/seo-organico`. `pnpm install --frozen-lockfile`.

Leia antes: `docs/seo/source-of-truth.md` (§3, §8, §9, §10 vocabulário), `docs/seo/
regua-de-copy.md`, `.claude/tower/packs/track-seo-correcao-1.md` e `-2.md` (mesmo
espírito: CORTAR, HEDGEAR, LINKAR — nunca inventar; um dono por bloco; a Doxa uma vez).

## A VISÃO DO DONO
Terceira passada transversal, feita por 3 collectors lendo as 63 páginas em fatias com a
lente §63. Achados abaixo, agrupados por fatia, do jeito que vieram (arquivo:linha
aproximada — localize por grep da frase). Ordem de prioridade: (1) contradições/erros
de fato, (2) §14 mesma ideia em duas páginas (dono → repete: uma frase + link),
(3) §33/§10, (4) NITs. Você é a ÚNICA track em `src/seo/conteudo/**`; pode tocar
qualquer arquivo de conteúdo. Motor/contrato/docs/landing: NÃO. Nenhum arquivo novo.
Cada correção mantém `atualizadoEm: '2026-08-18'`.

Depois de cada bloco de edições, rode `pnpm test src/seo` (FAQ única, links, trecho) e o
script de shingles (frases ≥10 palavras repetidas no corpus — o das rodadas anteriores
está em `/tmp/claude-501/-Users-rafaelfernandes-orca-projects-site-doxa/3d8c43a4-450b-40d7-a509-c438ec9b2133/scratchpad/rodada3/shingles.mjs`; se não existir, escreva um: normaliza, janelas de 10 palavras, conta em quantos arquivos cada janela aparece).

## FATIA GUIAS (15 páginas) — collector A

### DEVE CORRIGIR
Contradições / erro de fato
- `guias/o-que-e-ugc.ts:~141` — "'Vamos usar UGC no anúncio.' … é o **primeiro** sentido: peça encomendada" — a página define primeiro = espontâneo (~66) e segundo = criador (~81); peça encomendada é o SEGUNDO. → "é o segundo sentido: peça encomendada…".
- `guias/o-que-e-ugc.ts:~205` — "nenhum dos dois substitui o conteúdo que a sua empresa precisa publicar no próprio perfil" contradiz ~91/~98/~138 (UGC de criador vai ao ar nos canais da marca). → "e nenhum dos dois resolve a constância: campanha tem fim, o perfil não".
- `guias/como-crescer-no-youtube-shorts.ts:~183` "canal recém-aberto e canal antigo entram nessa fila em pé de igualdade" × `guias/como-viralizar-no-tiktok.ts:~112` "base grande ajuda no começo da distribuição" × `hubs/marketing-no-tiktok.ts:~68` "decide pouco" — mesmo mecanismo com três graus. → Shorts: "entram na mesma fila; o que costuma separá-los é o acervo de títulos". Alinhar os três ao mesmo grau ("o tamanho do perfil pesa pouco; não é passaporte nem teto").
- "separar padrão de acaso" com número diferente: `guias/como-produzir-60-videos-em-90-dias.ts:~194` e `guias/quantas-vezes-postar-por-dia-no-tiktok.ts:~156` (~60) × `dores/por-que-meus-videos-nao-tem-views.ts:~208` (10–15 no mesmo formato) × `guias/como-crescer-no-youtube-shorts.ts:~129` (30 peças). → nas duas guias: "faixa em que cabem dez a quinze peças por formato — o que separa padrão de acaso"; Shorts: hedge ("costuma ser ruído"); nenhum número apresentado como limiar de plataforma.

§14 — mesma ideia em duas páginas (dono → repete)
- `guias/como-medir-resultado-de-conteudo-organico.ts:~156` (dono) → `guias/como-usar-o-mesmo-video-nas-tres-redes.ts:~166` quase verbatim ("soma dimensiona a operação; número separado diz em que rede o assunto pegou"). → cortar o item ~166 (já linka medir em ~160/~174).
- `guias/como-viralizar-no-tiktok.ts:~231-233` FAQ "repito o formato ou mudo de assunto?" (dono) → `guias/como-produzir-60-videos-em-90-dias.ts:~164` repete o raciocínio. → 60-videos: uma frase + link para a FAQ.
- `guias/como-usar-o-mesmo-video-nas-tres-redes.ts:~130,~193` (dona do arquivo) → `guias/como-crescer-no-youtube-shorts.ts:~141` repete "arquivo baixado vem com selo, nome de outro perfil, qualidade menor". → Shorts:~141 vira "…está em [mesmo vídeo nas três redes]".
- Exemplo "segunda às 22h → terça às 22h": dono `guias/como-viralizar-no-tiktok.ts:~165`; ok em `quantas-vezes:~80`; repetido em `dores/por-que-meus-videos-nao-tem-views.ts:~121`, `dores/como-postar-todos-os-dias-sem-equipe.ts:~111`, `solucoes/conteudo-organico-para-empresas.ts:~121`. → nas 3: cortar o exemplo, manter "24 h de relógio" + link.

§33 / regra herdada §10
- `guias/como-viralizar-no-tiktok.ts:~159` + `~223` — "Doxa" 2× no corpo fora do destaque+cta. → ~223: tirar "é a leitura que a Doxa aplica na rotina de quem contrata, e que" → "e é o que sustenta o intervalo de 24 horas".
- `guias/como-crescer-no-youtube-shorts.ts:~183` — resposta abre "Nenhum." solto. → "Nenhum inscrito é necessário: o feed de Shorts é de recomendação…".
- `guias/estrategia-de-conteudo-para-empresas.ts:~190` — resposta abre "Não, e esperar…". → "A estratégia não precisa estar pronta para começar, e esperar por ela…".

### NIT (faça os que couberem; priorize N-1, N-2, N-3, N-4, N-5, N-6, N-7, N-10, N-11, N-13)
- N-1 `relacionadas` lista o PRÓPRIO hub, que a migalha já linka (link duplo): `como-crescer-no-youtube-shorts:~50`, `como-escrever-roteiro:~51`, `como-medir:~54`, `como-produzir-60:~53`, `como-usar-o-mesmo-video:~52`, `estrategia:~59`, `marketing-b2b:~55`, `o-que-e-uma-agencia:~56`, `quantas-vezes:~54`. → tirar o hub de `relacionadas` nas 9. (Idem o padrão "relacionadas × membros" nos 5 hubs — `hubs/{marketing-organico,videos-curtos,marketing-no-tiktok,reels-no-instagram}.ts`: tirar de `relacionadas` o que já é membro; `ia-no-marketing` já foi feito.)
- N-2 Frase-fonte "primeiros conteúdos abaixo do esperado geram dados sobre audiência, temas, formatos, hooks…" em 8 páginas (`prendem:~196`, `hook:~197`, `60-videos:~97`, `viralizar:~199`, `estrategia:~151`, `solucoes/producao-de-conteudo-em-escala:~99`, `solucoes/producao-de-videos-com-ia:~257` = FAQ dona, `dores/nao-tem-views:~171`). → verbatim só na FAQ dona; nas outras, paráfrase curta ("os primeiros vídeos são dado, não veredito") ou link.
- N-3 "um atropela o alcance do outro" (RT-2 verbatim) em `viralizar:~159` (dono), `quantas:~43,~125`, `60-videos:~137`, `mesmo-video:~150`, `dores/como-aumentar-o-alcance:~103`, `hubs/marketing-no-tiktok:~117`, `glossario/algoritmo-do-tiktok:~100`. → variar a redação fora de viralizar/quantas.
- N-4 "horário move pouco perto da abertura e da regularidade": dono `dores/como-postar-todos-os-dias-sem-equipe:~188`; `quantas:~185` ok; `crescer-instagram:~216` (sem link → link), `glossario/algoritmo-do-tiktok:~99`, `dores/como-aumentar-o-alcance:~126`, `dores/nao-tem-views:~182` → variar redação.
- N-5 `crescer-instagram:~159-165` "O que olhar toda semana" × `como-medir:~83-114` (dona). → Instagram: 2 linhas + link `/guias/como-medir-resultado-de-conteudo-organico`.
- N-6 `prendem:~233-235` FAQ "O mesmo vídeo pode ir para TikTok, Reels e Shorts?" é a intenção de `como-usar-o-mesmo-video` e não linka. → link na resposta.
- N-7 Cadência em uma linha sem link: `crescer-no-shorts:~142`, `prendem:~184`. → "+ [como viralizar no TikTok]".
- N-8 Pares menores → variar ou linkar: `viralizar:~199` × `agencia:~164` "sorte com nome melhor"; `viralizar:~228` × `quantas:~123` × `dores/como-aumentar-o-alcance:~184` "Apagar não devolve o alcance"; `roteiro:~113` × `mesmo-video:~114` "que ninguém faz"; `60-videos:~216` × `estrategia:~114` "única … que ninguém traz de fora"; `b2b:~137` × `prendem:~225` "locução impessoal sobre imagem parada"; `b2b:~122` × `dores/nao-tem-views:~136` "institucional entre os de pior desempenho"; `b2b:~147` × `medir:~166,~199` "nenhum painel liga venda ao vídeo".
- N-9 Absolutos sem fonte (hedge): `crescer-instagram:~76,~151,~216`; `viralizar:~94` "Nenhuma operação séria promete" → "Não dá para prometer…", `~104`, `~137,~149`, `~182`; `roteiro:~113,~118,~40,~129,~204`; `prendem:~121,~225`; `shorts:~93,~154`; `medir:~95,~166,~199,~172`; `avatar:~42,~134`; `hook:~226`; `ugc:~76`. (+ os 10 do report da correção-2: `prendem:~86` "única parte que ninguém pula"; `conteudo-organico:~116` H2 "que quase ninguém segue"; `viralizar:~149,~137` "quase ninguém usa/corrige"; `organico-vs-pago:~231` "quase toda empresa", `~80` "a única regra"; `o-que-e-uma-agencia:~77` "Não existe categoria registrada, certificação…" → "não há certificação reconhecida que restrinja o nome" ou cortar; `medir:~75` "sempre"; `glossario/engajamento:~82` "mais rara… única"; `shorts:~93` "único"; `glossario/feed-recomendado:~65`.)
- N-10 Português: `mesmo-video:~203` "custa nada" → "não custa nada"; `mesmo-video:~198` vírgula entre sujeito e verbo; `quantas:~175` resposta sem sujeito → "Stories e carrosséis não competem…".
- N-11 `prendem:~230` "gerar automático e revisar" × `mesmo-video:~94` "não a legenda automática da plataforma" — ambíguo. → prendem: "gerar a legenda automática no editor (embutida no arquivo) e revisar…".
- N-12 §9: `avatar:~207-209` FAQ "Preciso aparecer…" — resposta dentro da FAQ `gravar` (431-432), mas "imagens de produto, cenas do ambiente" embeleza o verbatim ("imagens, vídeos, áudios ou participações") → voltar ao verbatim.
- N-13 `marketing-b2b:~183-185` FAQ "Devo publicar só no LinkedIn?" — agora existe dona (`guias/video-vertical-no-linkedin.ts`); acrescentar link.

## FATIA SOLUÇÕES/PLATAFORMAS/HUBS/DORES — collector B
<!-- colar quando chegar -->

## FATIA COMPARATIVOS/GLOSSÁRIO — collector C
<!-- colar quando chegar -->

## SCOPE
- src/seo/conteudo/solucoes/**
- src/seo/conteudo/plataformas/**
- src/seo/conteudo/guias/**
- src/seo/conteudo/dores/**
- src/seo/conteudo/hubs/**
- src/seo/conteudo/glossario/**
- src/seo/conteudo/comparativos/**
(SÓ arquivos existentes; nenhum novo. Motor/contrato/docs/landing: NÃO.)

## DEPENDS ON
`feat/seo-organico` @ `6db5e8e`+ (tudo mergeado até #63) e nenhuma outra track de conteúdo ativa.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 · `pnpm test` verde (mesmo nº da base: 987) · `pnpm build` ok (68 rotas) · `pnpm seo:audit` sem ERRO (avisos listados)
- shingles ≥10 palavras repetidas no corpus: número ANTES e DEPOIS (cole as janelas que sobraram, se sobrarem, com justificativa — vocabulário obrigatório do contrato/entregável é aceitável se for a redação verbatim do source-of-truth)
- FAQ única: `grep -rhoE "pergunta: *'[^']+'" src/seo/conteudo | sort | uniq -d` = vazio
- `grep -rn "Doxa" src/seo/conteudo/guias/como-viralizar-no-tiktok.ts | grep -v "^\S*:\s*\*" | wc -l` — cole (esperado: destaque + cta + a atribuição da cadência; nada mais)
- `grep -rniE "quase ninguém|quase todo|quase sempre|a maioria d|todo mundo|nenhuma operação séria|única regra|única parte" src/seo/conteudo | grep -v "^\S*:\s*\*"` — cole (o que sobrar, justificado)
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio
- `git diff origin/feat/seo-organico...HEAD --stat | tail -1` — cole

## COMMIT + PUSH
Um commit por FATIA×SEVERIDADE (ex.: "guias — contradições", "guias — §14", "guias — NITs", …) → `git push -u origin track-seo-correcao-3`. **NÃO mergeie.** Report: por fatia, o que mudou (1 linha por item), o que NÃO fez (e por quê), saída do VERIFY, verdict READY/NOT READY.
