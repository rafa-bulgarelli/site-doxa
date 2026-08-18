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

### DEVE CORRIGIR
A. Contradições entre páginas
1. **Carry-over: "nada acumula" × "vídeo fraco reduz a amostra do próximo".** `plataformas/tiktok-para-empresas:~40,~78` ("cada vídeo recomeça a disputa do zero", "nada é acumulado de graça"), `hubs/marketing-no-tiktok:~73` ("não existe audiência acumulada… cada publicação recomeça a prova") × `dores/como-postar-todos-os-dias-sem-equipe:~152`, `dores/como-aumentar-o-alcance-organico:~184`, `dores/por-que-meus-videos-nao-tem-views:~218` (+ hedgeados `dores/por-que-meu-instagram-parou-de-crescer:~128`, `glossario/algoritmo-do-tiktok:~97`). → nos dois lados do TikTok trocar "recomeça do zero / nada é acumulado" por "um vídeo que foi bem não garante o próximo"; nos dores hedgear ("costuma reduzir") — mesma redação nas irmãs.
2. `solucoes/marketing-com-ia:~185` — "[agência, equipe interna ou operação terceirizada] compara os três **sem colocar a Doxa no meio**" — mas `comparativos/agencia-vs-equipe-interna:~176` diz "Existe um terceiro arranjo, e a Doxa é ele". → "compara os arranjos e diz onde cada um ganha".
3. `hubs/ia-no-marketing:~95` "**Toda** operação com IA que dá errado erra no mesmo lugar: automatiza… o que a marca pode dizer" × `solucoes/marketing-com-ia:~190` (H2) "O erro que aparece em **toda** operação de IA malfeita" = ferramenta como estratégia. → hedgear os dois ("um erro recorrente…"), cada um com o seu.
4. `solucoes/videos-curtos-para-empresas:~174` FAQ `reuso` "pode ser **adaptado** para diferentes plataformas e formatos" × `~118,~179` "publicar exatamente como entregue". → cortar a 2ª frase da resposta `reuso` (cortar, não inventar fronteira).

B. §14 — mesmo parágrafo/frase-âncora em 2+ páginas (dono → repete: uma frase + link)
5. **Custo marginal / "o décimo vídeo custa quase o mesmo que o primeiro"** — dono `solucoes/producao-de-conteudo-em-escala:~78` → repetido em `solucoes/producao-de-videos-com-ia:~89`, `hubs/ia-no-marketing:~69`, `dores/como-produzir-conteudo-sem-equipe:~153`, `comparativos/ia-vs-producao-tradicional-de-video:~116`.
6. **Bloco R$ 8.000–10.500 + inventário resumido** — dono `producao-de-conteudo-em-escala:~111-131` → `producao-de-videos-com-ia:~141-151` (mesma conta + lista em outra money page — a duplicata que `marketing-com-ia:~30-32` diz proibida), `hubs/marketing-organico:~124`, `dores/como-produzir-conteudo-sem-equipe:~148` (lista quase idêntica + mesma ressalva). → em `producao-de-videos-com-ia` e `dores/produzir` reduzir a uma linha + link; hub mantém uma frase.
7. **Zero impulsionamento reexplicado com a mesma razão** — dono `solucoes/conteudo-organico-para-empresas:~132-137` → `plataformas/instagram-reels:~106-111`, `plataformas/tiktok:~114`, `dores/como-aumentar-o-alcance:~129,~156`, `dores/por-que-meus-videos:~223`, `hubs/marketing-organico:~111` ("você deixa de saber se o conteúdo se sustentava sozinho" quase verbatim em 3); `dores/alcance:~156` ≈ `hubs/reels:~114`. → plataformas só com o ângulo próprio (botão do Instagram / dado no TikTok) + link; dores/hubs uma linha.
8. **Destaque duplicado** — `conteudo-organico:~124-127` "Fotos, carrosséis e stories seguem liberados…" ≈ `instagram-reels:~124-127`. → dono = plataforma (convivência); a solução linka.
9. **Lista "decisões de formato" triplicada nos hubs** — `hubs/videos-curtos:~83-90` (dono) ≈ `hubs/reels:~77-83` ≈ `hubs/marketing-no-tiktok:~83`. → hubs de rede: uma linha + link para `/guias/videos-curtos` (e `/glossario/legenda-embutida`).
10. **"O mesmo arquivo nas três redes"** — H2 igual em `solucoes/videos-curtos-para-empresas:~103` e `hubs/videos-curtos:~95`; ângulo inteiro de `plataformas/youtube-shorts:~73,~101`; `hubs/videos-curtos:~100` = `dores/como-aumentar-o-alcance:~108` **verbatim** ("multiplica a chance… sem multiplicar a produção"). Dono: `guias/como-usar-o-mesmo-video-nas-tres-redes`. Hub e dor: uma frase + link.
11. **RT-2 "dois vídeos no mesmo dia… um atropela o alcance do outro"** — 8 ocorrências: `producao-de-conteudo-em-escala:~157`, `conteudo-organico:~104`, `tiktok-para-empresas:~177`, `hubs/marketing-no-tiktok:~84,~98,~111,~117` (**4× na mesma página**), `dores/videos:~115`, `dores/alcance:~103`, `dores/postar:~111`. Dono: `conteudo-organico` (passo Cadência). Hub TikTok: só o destaque ~117; demais uma menção + link.
12. **RH-1 exemplo "segunda 22h → terça 22h"** — `conteudo-organico:~121`, `dores/videos:~121`, `dores/postar:~111`, `guias/como-viralizar-no-tiktok:~165`, `guias/quantas-vezes:~80`. Dono DECIDIDO pela sessão principal: `guias/como-viralizar-no-tiktok` (dono da cadência); `guias/quantas-vezes-postar-por-dia-no-tiktok` pode manter o exemplo (é a página do intervalo). Todos os outros linkam sem repetir o exemplo.
13. **"Baixou, publicou" com o porquê** — dono `solucoes/videos-curtos-para-empresas:~113-118` → `instagram-reels:~142` (header ~31-33 diz "não é reexplicada aqui", mas explica) e `hubs/videos-curtos:~121`. → plataforma e hub linkam; hub fica com a citação do manual só se for o único lugar dela.
14. `hubs/marketing-organico:~70` repete verbatim o resumo de `comparativos/organico-vs-pago:~41,~44`. → parafrasear ou só linkar.
15. **FAQ duplicada por RESPOSTA (pergunta trocada para escapar do `uniq -d`)** — `plataformas/tiktok:~160-162` = `conteudo-organico:~186-188` = `producao-de-videos-com-ia:~250-252` (`organico`); `tiktok:~165-167` = `conteudo-organico:~196-198` (`viralizar-garantido`); `tiktok:~170-172` = `marketing-com-ia:~241-243` (`pequenas`). Um dono por resposta: `organico` → conteudo-organico; `viralizar-garantido` → conteudo-organico; `pequenas` → marketing-com-ia; tiktok fica com "Preciso postar todo dia?" + 1 própria ou 0.
16. `plataformas/tiktok:~92` "Uma sequência de vídeos de produto, sem nada além do produto, é anúncio sem verba" = `solucoes/videos-curtos:~154` (idêntica). Um fica.
17. **Tese "Reels alcança quem não segue; o resto do perfil serve a quem já segue"** com o mesmo resumo em `instagram-reels:~46` e `hubs/reels:~33`, e 1º parágrafo de ambas repetindo (~78/~64). Hub é dono; plataforma abre pelo ângulo dela (convivência/botão) e linka.

C. §19/§33 — absolutos e generalizações
18. `plataformas/tiktok:~40,~72,~145` "quem decide o alcance… é o desempenho dele, não o tamanho do perfil", "é a rede em que alcançar desconhecidos é o comportamento padrão"; `hubs/marketing-no-tiktok:~68` "A distribuição **não parte** da lista de seguidores" (o resumo ~37 foi hedgeado; o 1º parágrafo repete a versão absoluta e repete o resumo). → hedge igual ao resumo.
19. `hubs/reels:~59,~64,~69` "concentra o alcance", "o segundo é o que mais entrega"; `dores/como-aumentar-o-alcance:~69` "o vídeo curto é o formato que mais entrega para quem não segue"; `dores/instagram-parou:~103` "o vídeo vertical é a superfície que o Instagram usa…"; `instagram-reels:~46,~78,~83`. → redação hedgeada das irmãs ("uma parte relevante do alcance costuma vir…").
20. `hubs/reels:~82` "a maior parte de quem assiste não vai abrir o perfil" → hedge.
21. `conteudo-organico:~116` (H2) "a regra que quase ninguém segue"; `dores/produzir:~43` "O que falta quase nunca é assunto" (+ ~181); `dores/postar:~61,~66` "derruba a maior parte das tentativas", "A rotina que falha é sempre a mesma"; `dores/videos:~38,~69,~85,~218` "Na maior parte dos casos", "explicam a maior parte dos casos", "causa número um, e de longe", "A explicação mais comum"; `hubs/marketing-no-tiktok:~122` "e nunca fez"; `hubs/ia-no-marketing:~95` "Toda operação". → hedge. (Nota: `docs/seo/regua-de-copy.md:~97` traz "Na maioria dos casos" como abertura-modelo — NÃO edite docs; a sessão principal alinha.)
22. `dores/como-aumentar-o-alcance:~179` FAQ "Publicar o mesmo conteúdo em redes diferentes **não é penalizado**" — política de plataforma afirmada (família "a rede pune" invertida). → "nada indica que…; o que costuma pesar é…".

D. `relacionadas` dos hubs listando membros (card duplo): `hubs/marketing-no-tiktok:~46-51` (4 de 5), `hubs/marketing-organico:~43-49` (5 de 5), `hubs/reels:~42-48` (3 de 5), `hubs/videos-curtos:~48-54` (5 de 5). → tirar os membros; deixar só não-membros úteis (como já feito em `ia-no-marketing`).

### NIT
- Rastro ≠ corpo: `hubs/videos-curtos:~28-29` nega "X segundos" mas resumo ~39 diz "antes do quinto segundo" (idem `dores/videos:~27-28` vs ~85); `instagram-reels:~31-33` "não é reexplicada" vs ~142; `youtube-shorts:~4-6` "não se repete" vs item 10.
- Precisão §2: `hubs/marketing-no-tiktok:~111` e `hubs/reels:~108` "redes em que a operação da Doxa publica" — quem publica é o cliente → "em que os vídeos da operação são publicados".
- Fonte §8: `conteudo-organico:~142` e `dores/alcance:~128` "viola as políticas das plataformas" — fonte diz "viola a metodologia e pode gerar penalização das redes"; alinhar.
- Intra-página (corpo e FAQ dizendo o mesmo): `producao-de-videos:~199 ↔ ~252`; `marketing-com-ia:~151 ↔ ~233` e `~176-179 ↔ ~228`; `videos-curtos:~118 ↔ ~179`; `clone-de-ia:~165 ↔ ~188`; `instagram-reels:~121 ↔ ~168`; `youtube-shorts:~101/~116 ↔ ~156-158/~168`; `tiktok:~114 ↔ ~162`; `dores/postar:~141 ↔ ~178`. → encurtar um dos dois.
- Negativas do §47 em 5 páginas (`producao-de-videos:~191-193`, `marketing-com-ia:~176-179+~228`, `conteudo-para-redes:~235`, `hubs/ia-no-marketing:~125`, `clone-de-voz:~201`) — dono `marketing-com-ia` (H2 ~166); nas outras, uma linha + link.
- Distinção clone × avatar × dublagem em `clone-de-ia:~100-105` e `clone-de-voz:~117-148` — uma linka a outra.
- Absolutos leves: `producao-de-videos:~176` "Nenhuma operação séria"; `marketing-com-ia:~74` "mais do que qualquer contratação"; `conteudo-organico:~80` "empresa nenhuma deveria"; `dores/alcance:~93,~108,~125`; `dores/instagram:~152`; `dores/produzir:~79`; `dores/videos:~75`; `hubs/reels:~80,~81,~93`, `hubs/videos-curtos:~70,~86`.
- `dores/produzir:~186` FAQ abre "Não para começar." → sujeito na primeira frase.
- `conteudo-para-redes:~64` `palavrasChave` 'automatizar redes sociais com ia' — intenção que a Doxa não serve → tirar.
- Fecho "conte os últimos 90 dias" repetido em `producao-de-conteudo-em-escala:~216` e `conteudo-organico:~220` → variar um.


## FATIA COMPARATIVOS/GLOSSÁRIO — collector C

### DEVE CORRIGIR
- **A. Resumo × 1º parágrafo repetindo a definição — nos 18 verbetes** (`PaginaArtigo` renderiza o `resumo` sob o H1): `alcance-organico` · `algoritmo-do-tiktok` · `avatar-de-ia` · `clone-de-voz` · `clone-digital` · `conteudo-evergreen` · `conteudo-organico` · `cta` · `engajamento` · `feed-recomendado` · `hook` · `impressoes` · `legenda-embutida` · `retencao` · `roteiro-de-video-curto` · `short-form` · `ugc` · `watch-time`. **Regra única:** o 1º parágrafo do corpo fica com a definição (régua item 1 + teste do primeiro parágrafo); o `resumo` vira só a segunda frase atual (o "por que/quando importa"), sem reabrir com "X é…". Redistribuição, não texto novo. Confira o teste do primeiro parágrafo (`pnpm test src/seo`).
- **B. `glossario/alcance-organico:~62`** — verbete diz que alcance conta pessoas (~41-46) e o destaque diz "é o que a Doxa contabiliza nas metas: **visualizações** orgânicas" (meta conta views, §8). → "O que a Doxa contabiliza nas metas são visualizações orgânicas — views, não alcance —, sem depender de compra de mídia."
- **C. Destaque Doxa triplicado**: `glossario/alcance-organico:~62` · `hubs/marketing-organico:~134` · `dores/como-aumentar-o-alcance-organico:~156` ("A Doxa opera exatamente neste canal…"). → dono = hub; verbete pelo item B; dor uma frase + link.
- **D. Imparcialidade — `comparativos/ia-vs-producao-tradicional-de-video:~88,~97,~121`**: faixa R$ 8.000–10.500 creditada à coluna tradicional mas soma "Distribuição: agência, gestor de tráfego, verba" (~97) — igual nos dois caminhos. → em ~88 e célula ~121: "faixa da operação completa, produção e distribuição — a parte de distribuição é igual nos dois caminhos" (redação de `agencia-vs-equipe-interna:~114`).
- **E. §10 — FAQs de comparativo abrindo com "Dá,"/"Não," solto**: `agencia-vs-equipe-interna:~194` · `conteudo-organico-vs-influenciador:~247` · `freelancer-vs-agencia:~239` e `~244` · `ia-vs-producao-tradicional:~202` · `organico-vs-pago:~204` · `ugc-vs-conteudo-de-marca:~160`. → primeira frase com sujeito. E 4 dessas perguntas são a mesma ("Dá para usar/fazer os dois…?" em freelancer:~242, ia-vs:~200, organico:~202, ugc-vs:~158) → diferenciar pelo eixo de cada página ou fundir com a nota de desempate.
- **F. `glossario/ugc:~69`** ≈ `guias/o-que-e-ugc:~113` ("aparência/estética caseira é escolha de linguagem; esconder o pagamento não é"). Verbete diz que sinalização é do guia (~74). → cortar o H2 "O que isso exige de quem contrata" (~62-70) para uma linha + link.
- **G.** (= fatia guias) `guias/o-que-e-ugc:~141` "primeiro sentido" → "segundo sentido".
- **H. `glossario/avatar-de-ia:~46-53,~66-76`** ("Dois tipos"; "Onde ele ainda não convence") repetem `guias/o-que-e-avatar-de-ia:~155-165` e `~139`. → dono = GUIA; verbete: "dois tipos" uma frase cada, "onde não convence" vira link; ajustar os dois rastros.
- **I. Links errados/faltando:** `glossario/hook:~71` (+ comentário ~4-6) manda "para escrever hooks na prática" a `/guias/como-fazer-videos-curtos-que-prendem`; o dono é `/guias/como-fazer-hook-de-video-curto`. → trocar link e `relacionadas` (~22-26). `glossario/clone-de-voz:~29-33` não lista `/solucoes/clone-de-voz-para-videos` (que linka o verbete 3×). → adicionar.
- **J. Estatística que uma página recusa e outra afirma**: `legenda-embutida` (~9-13, ~69) trata "consumo sem som" como situação, de propósito; `guias/como-escrever-roteiro:~98` e `guias/como-fazer-hook:~231` afirmam ("consumido com o som desligado numa parte considerável", "boa parte do feed é assistida sem som"). → forma situacional.

### NIT
- Absolutos (hedge de 1 palavra): `ia-vs:~73` "Quase toda comparação" → "Boa parte das comparações"; `~155` "O gargalo mais comum" → "costuma ser"; `~163` "gerar sai mais barato e mais previsível" → "costuma sair"; `~173` "Operação madura não escolhe" → "raramente escolhe". `organico-vs-pago:~231` "quase toda empresa saudável" → "boa parte das empresas"; `~183` "não produzem dado suficiente para nenhuma conclusão" → "dificilmente produzem". `tiktok-vs-instagram:~145` "que quase ninguém completa" → "que costuma ficar de fora"; `~90` "Consegue alcance desde os primeiros vídeos" → "Pode ter alcance…"; `~94` "produção caseira é a norma" → "é comum"; `~123` "de um jeito que nenhuma outra rede compensa" → cortar; `~73` "conta pouco" → "costuma contar pouco"; `~169` "sinal costumeiramente lido como reciclado" → "que a outra rede pode tratar como reciclado". `freelancer-vs-agencia:~88` "Um editor excelente não escreve roteiro…" → "raramente"; `~173` tirar "sempre"; `~180` "entrega isso melhor e mais barato" → "costuma entregar". `agencia-vs-equipe-interna:~189` "o erro mais comum" → "um erro comum"; `~165` "a divisão mais estável que se vê" → "uma divisão que costuma ser estável". `ugc-vs:~100` "acredita mais" → "tende a acreditar"; `~141` "rende mais no longo prazo" → "tende a render mais"; `~165` "rende menos" → "costuma render". `conteudo-organico-vs-influenciador:~193` "nunca fecham"/"nenhuma campanha entrega" → "não fecham no mesmo período"/"campanha não entrega"; `~184` lead "**Ninguém muda de nicho no meio do caminho.**" contradiz o corpo → "**O seu nicho só muda quando você decide.**". `glossario/hook:~42` "a variável com maior efeito" → "costuma ser"; `retencao:~41` "o sinal mais forte que existe" → "um dos sinais mais fortes"; `algoritmo-do-tiktok:~86` "o mais valioso" → "o mais raro"; `alcance-organico:~46` "sempre um número maior" → "nunca é menor"; `conteudo-organico:~64` "quase ninguém antecipa" → "pouca gente"; `legenda-embutida:~69` "não comunica nada ali" → "comunica pouco"; `short-form:~36` "porque as três plataformas o adotaram quase ao mesmo tempo" → cortar o "porque"; `~47` "pesa mais" → "costuma pesar"; `ugc:~38` H2 "o mais usado hoje" → "o mais comum em briefing"; `roteiro-de-video-curto:~81` "é gravado várias vezes" → "costuma ser". `alcance-organico:~56` "As três redes… mostram esse recorte" → "as redes costumam mostrar". `algoritmo-do-tiktok:~55,~77-86` sinais como fato antes da ressalva ~107 → subir a nota ou H2 "Os sinais que costumam pesar".
- §14 moldes: "retenção é o sinal mais denso porque todo espectador o produz" em `retencao:~62` (dono), `algoritmo-do-tiktok:~82`, `engajamento:~94` → só link; inventário dos 25 itens + faixa + 18 dias em `agencia-vs-equipe-interna:~109-119` E `ia-vs:~88-103` → um lista, o outro cita + link (freelancer declara agencia dono); "aluguel × obra/patrimônio" em `influenciador:~101,~259` e `organico-vs-pago:~231` → variar; "zero impulsionamento" em `organico-vs-pago:~149` (dono: `solucoes/conteudo-organico:~132-137`) e "impulsionar apaga a leitura" em `glossario/conteudo-organico:~64` + `organico-vs-pago:~144,~214` → uma frase + link; `clone-de-voz:~78` e `avatar-de-ia:~86` frase idêntica "roda sobre ferramentas de mercado…" + H2 idêntico → variar; `clone-digital:~94` × `solucoes/clone-de-voz-para-videos:~225` → na solução, uma frase + link; `roteiro-de-video-curto:~55-61` ≈ tabela do guia → encurtar + link.
- Lógica/português: `impressoes:~62` "frequência próxima de 1 significa que se espalhou para gente nova" → "quase ninguém viu duas vezes"; `watch-time:~17` resumo diz que o total "responde se prendeu muita gente ou pouca por muito tempo" — o total sozinho não distingue → alinhar ao ~55; `agencia-vs-equipe-interna:~44` "costuma ser decidida" → "feita"; `hook:~20` `palavrasChave` 'primeiros segundos' → tirar.


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
