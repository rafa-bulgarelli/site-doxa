# keyword-map — Topic → Cluster → Intent → Page

> `BLOCKED_EXTERNAL_CREDENTIAL` — **sem Google Search Console, sem Google
> Analytics e sem ferramenta de volume de busca** neste ambiente, e sem acesso a
> SERP ao vivo durante a escrita deste mapa. Consequência assumida, conforme §49
> e §70 do brief: **nenhum número de volume aparece aqui.** "Search Opportunity"
> é qualitativa (alta / média / baixa) com a justificativa em uma linha, e
> "ranking" não é prometido em lugar nenhum — ranking é resultado posterior.
> Quando a credencial existir, a primeira tarefa é registrar o baseline
> (indexação, queries, impressões, cliques, CTR, posição, erros) e **recalibrar a
> coluna de prioridade** deste arquivo com dado real.
>
> **Contrato de conteúdo.** Nenhum fato entra numa página sem estar em
> [`docs/seo/source-of-truth.md`](./source-of-truth.md) com `fonte:`. Antes de
> publicar, o arquivo passa pela [`docs/seo/regua-de-copy.md`](./regua-de-copy.md).
>
> **Contrato de URL.** O motor de `src/seo/` congela prefixo e slug: URL =
> `PREFIXO[tipo] + '/' + slug`, com `solucao→/solucoes`, `plataforma→/plataformas`,
> `guia|dor|hub→/guias`, `comparativo→/comparativos`, `glossario→/glossario`.
> **Slug diferente do que está nesta tabela não vira página.** Hubs são um tipo
> fechado — hub novo é mudança de motor, não de conteúdo.

## Os 5 hubs (toda página pertence a ≥1)

| Hub | Cluster que ele governa |
|---|---|
| `/guias/marketing-no-tiktok` | TikTok: algoritmo, viralização, empresas, B2B |
| `/guias/reels-no-instagram` | Instagram: Reels, crescimento orgânico, formato |
| `/guias/ia-no-marketing` | IA, avatares, clones, produção sem gravação |
| `/guias/marketing-organico` | Alcance orgânico, orgânico × pago, estratégia |
| `/guias/videos-curtos` | Short-form: hook, retenção, watch time, formato |

## Tabela principal — primeira leva

Legenda: **tipo** = o `Tipo` do motor · **intent** = `informacional` (I) ·
`comercial` (C) · `transacional` (T) · `navegacional` (N) · **status** =
`existe` / `planejada` · **P** = prioridade.

| URL | tipo | cluster/hub | intent | keywords | título provisório | status | links from/to | P |
|---|---|---|---|---|---|---|---|---|
| /solucoes/producao-de-videos-com-ia | solucao | ia-no-marketing | C | produção de vídeos com ia, vídeo com inteligência artificial, criar vídeos com ia para empresas, vídeo com avatar de ia | Produção de vídeos com IA para empresas: como funciona na prática | existe | ← /guias/ia-no-marketing, /comparativos/ia-vs-producao-tradicional-de-video → /solucoes/clone-de-ia-para-videos, /guias/o-que-e-avatar-de-ia | P1 |
| /solucoes/marketing-com-ia | solucao | ia-no-marketing | C | marketing com ia, inteligência artificial no marketing, marketing digital com ia, ia para redes sociais | Marketing com IA: o que dá para automatizar e o que ainda é decisão humana | existe | ← /guias/ia-no-marketing, /guias/como-usar-ia-no-marketing → /solucoes/producao-de-videos-com-ia | P1 |
| /solucoes/conteudo-organico-para-empresas | solucao | marketing-organico | C | conteúdo orgânico para empresas, crescimento orgânico redes sociais, marketing orgânico para empresas | Conteúdo orgânico para empresas: o canal que não para quando a verba para | existe | ← /guias/marketing-organico, /comparativos/organico-vs-pago → /solucoes/producao-de-conteudo-em-escala | P1 |
| /solucoes/producao-de-conteudo-em-escala | solucao | videos-curtos | C | produção de conteúdo em escala, conteúdo em escala para empresas, produzir muito conteúdo, operação de conteúdo | Produção de conteúdo em escala: como sustentar volume sem montar um estúdio | existe | ← /guias/videos-curtos, /guias/como-produzir-conteudo-sem-equipe → /solucoes/videos-curtos-para-empresas | P1 |
| /solucoes/videos-curtos-para-empresas | solucao | videos-curtos | C | vídeos curtos para empresas, produção de vídeos curtos, vídeo vertical para empresa, short form para empresas | Vídeos curtos para empresas: formato, cadência e o que a sua marca precisa entregar | existe | ← /guias/videos-curtos → /plataformas/tiktok-para-empresas, /plataformas/instagram-reels-para-empresas | P1 |
| /solucoes/clone-de-ia-para-videos | solucao | ia-no-marketing | C | clone de ia, clone digital para vídeos, avatar de ia para empresa, clone de voz para vídeo | Clone de IA para vídeos: uma foto, um áudio e o que sai do outro lado | existe | ← /guias/o-que-e-avatar-de-ia, /glossario/avatar-de-ia → /solucoes/producao-de-videos-com-ia | P1 |
| /plataformas/tiktok-para-empresas | plataforma | marketing-no-tiktok | C | tiktok para empresas, marketing no tiktok para negócios, tiktok b2b, como usar tiktok na empresa | TikTok para empresas: o que muda quando o perfil é de marca | existe | ← /guias/marketing-no-tiktok → /guias/como-viralizar-no-tiktok, /glossario/algoritmo-do-tiktok | P1 |
| /plataformas/instagram-reels-para-empresas | plataforma | reels-no-instagram | C | reels para empresas, produção de reels, instagram para empresas, reels de marca | Reels para empresas: produção, cadência e o erro que trava o alcance | existe | ← /guias/reels-no-instagram → /guias/como-crescer-no-instagram-organicamente | P1 |
| /plataformas/youtube-shorts-para-empresas | plataforma | videos-curtos | C | youtube shorts para empresas, shorts para marca, youtube shorts empresa, vídeo curto no youtube | YouTube Shorts para empresas: a terceira rede que quase ninguém completa | existe | ← /guias/videos-curtos → /comparativos/tiktok-vs-instagram, /glossario/short-form | P2 |
| /guias/marketing-no-tiktok | hub | (hub) | I | marketing no tiktok, estratégia de tiktok, como fazer marketing no tiktok | Marketing no TikTok: o guia completo para quem posta em nome de uma marca | existe | → /plataformas/tiktok-para-empresas, /guias/como-viralizar-no-tiktok, /glossario/algoritmo-do-tiktok, /comparativos/tiktok-vs-instagram | P1 |
| /guias/reels-no-instagram | hub | (hub) | I | reels no instagram, como fazer reels, estratégia de reels | Reels no Instagram: guia de produção, formato e distribuição | existe | → /plataformas/instagram-reels-para-empresas, /guias/como-crescer-no-instagram-organicamente, /comparativos/tiktok-vs-instagram | P1 |
| /guias/ia-no-marketing | hub | (hub) | I | ia no marketing, inteligência artificial marketing, ia para conteúdo | IA no marketing: onde ela realmente entra na produção de conteúdo | existe | → /solucoes/marketing-com-ia, /solucoes/producao-de-videos-com-ia, /guias/como-usar-ia-no-marketing, /guias/o-que-e-avatar-de-ia | P1 |
| /guias/marketing-organico | hub | (hub) | I | marketing orgânico, crescimento orgânico, alcance orgânico redes sociais | Marketing orgânico: como crescer sem comprar cada visualização | existe | → /solucoes/conteudo-organico-para-empresas, /comparativos/organico-vs-pago, /guias/como-aumentar-o-alcance-organico, /glossario/alcance-organico | P1 |
| /guias/videos-curtos | hub | (hub) | I | vídeos curtos, short form, vídeo vertical, conteúdo em vídeo curto | Vídeos curtos: o guia do formato que domina as três redes | existe | → /solucoes/videos-curtos-para-empresas, /guias/como-fazer-videos-curtos-que-prendem, /glossario/short-form, /glossario/hook | P1 |
| /guias/como-viralizar-no-tiktok | guia | marketing-no-tiktok | I | como viralizar no tiktok, viralizar no tiktok, ganhar views no tiktok, vídeo viral tiktok | Como viralizar no TikTok: o que dá para controlar e o que não dá | existe | ← /guias/marketing-no-tiktok → /glossario/algoritmo-do-tiktok, /glossario/hook | P2 |
| /guias/como-crescer-no-instagram-organicamente | guia | reels-no-instagram | I | crescer no instagram organicamente, ganhar seguidores sem pagar, alcance orgânico instagram | Como crescer no Instagram organicamente sem impulsionar nada | existe | ← /guias/reels-no-instagram → /guias/como-aumentar-o-alcance-organico | P2 |
| /guias/como-fazer-videos-curtos-que-prendem | guia | videos-curtos | I | como fazer vídeo curto, prender atenção no vídeo, retenção de vídeo, primeiros segundos do vídeo | Como fazer vídeos curtos que prendem: hook, ritmo e os três primeiros segundos | existe | ← /guias/videos-curtos → /glossario/hook, /glossario/retencao, /glossario/watch-time | P2 |
| /guias/estrategia-de-conteudo-para-empresas | guia | marketing-organico | I | estratégia de conteúdo, planejamento de conteúdo para empresas, plano de conteúdo redes sociais | Estratégia de conteúdo para empresas: do objetivo comercial ao vídeo publicado | existe | ← /guias/marketing-organico → /solucoes/conteudo-organico-para-empresas | P2 |
| /guias/como-usar-ia-no-marketing | guia | ia-no-marketing | I | como usar ia no marketing, ia para criar conteúdo, ferramentas de ia para marketing | Como usar IA no marketing sem publicar conteúdo genérico | planejada | ← /guias/ia-no-marketing → /solucoes/marketing-com-ia | P2 |
| /guias/o-que-e-avatar-de-ia | guia | ia-no-marketing | I | o que é avatar de ia, avatar digital, apresentador de ia, avatar virtual para vídeo | O que é um avatar de IA e quando ele substitui a câmera | existe | ← /guias/ia-no-marketing → /glossario/avatar-de-ia, /solucoes/clone-de-ia-para-videos | P2 |
| /guias/o-que-e-ugc | guia | videos-curtos | I | o que é ugc, user generated content, ugc creator, conteúdo gerado pelo usuário | O que é UGC, o que não é, e por que a palavra virou duas coisas diferentes | existe | ← /guias/videos-curtos → /glossario/ugc, /comparativos/ugc-vs-conteudo-de-marca | P2 |
| /comparativos/organico-vs-pago | comparativo | marketing-organico | I | orgânico vs pago, tráfego pago ou orgânico, mídia paga vs orgânico | Orgânico ou pago: o que cada um compra, e por que a escolha não é eterna | existe | ← /guias/marketing-organico → /solucoes/conteudo-organico-para-empresas | P1 |
| /comparativos/tiktok-vs-instagram | comparativo | marketing-no-tiktok, reels-no-instagram | I | tiktok ou instagram, tiktok vs reels, qual rede escolher, diferença tiktok instagram | TikTok ou Instagram: onde a sua marca cresce mais rápido (e por quê) | existe | ← /guias/marketing-no-tiktok, /guias/reels-no-instagram → /plataformas/tiktok-para-empresas | P1 |
| /comparativos/ia-vs-producao-tradicional-de-video | comparativo | ia-no-marketing | I | ia ou produtora de vídeo, vídeo com ia vs gravação, produção tradicional de vídeo | Vídeo com IA ou produção tradicional: custo, prazo e o que cada um entrega | existe | ← /guias/ia-no-marketing → /solucoes/producao-de-videos-com-ia | P1 |
| /comparativos/agencia-vs-equipe-interna | comparativo | marketing-organico | C | agência ou equipe interna, montar time de conteúdo, terceirizar marketing, custo de equipe de conteúdo | Agência, equipe interna ou operação terceirizada: quem faz o quê, e a que custo | existe | ← /guias/marketing-organico → /solucoes/producao-de-conteudo-em-escala | P1 |
| /comparativos/ugc-vs-conteudo-de-marca | comparativo | videos-curtos | I | ugc ou conteúdo de marca, ugc vs branded content, vídeo de criador vs marca | UGC ou conteúdo de marca: quando cada formato converte melhor | existe | ← /guias/videos-curtos → /guias/o-que-e-ugc, /glossario/ugc | P2 |
| /guias/por-que-meus-videos-nao-tem-views | dor | videos-curtos | I | meu vídeo não tem views, vídeo sem visualizações, por que meu reels não aparece, poucas views | Por que os seus vídeos não têm views: as sete causas prováveis, em ordem | existe | ← /guias/videos-curtos → /glossario/retencao, /guias/como-fazer-videos-curtos-que-prendem | P1 |
| /guias/como-postar-todos-os-dias-sem-equipe | dor | marketing-organico | I | como postar todos os dias, postar todo dia nas redes, consistência de postagem, rotina de conteúdo | Como postar todos os dias sem virar refém do calendário | existe | ← /guias/marketing-organico → /guias/como-produzir-conteudo-sem-equipe | P2 |
| /guias/como-produzir-conteudo-sem-equipe | dor | videos-curtos | I | produzir conteúdo sem equipe, não tenho equipe de marketing, conteúdo sozinho, sem social media | Como produzir conteúdo sem equipe: o que dá para fazer com uma pessoa só | existe | ← /guias/videos-curtos → /solucoes/producao-de-conteudo-em-escala | P2 |
| /guias/como-aumentar-o-alcance-organico | dor | marketing-organico | I | aumentar alcance orgânico, alcance caiu, perdi alcance no instagram, mais alcance sem pagar | Como aumentar o alcance orgânico quando ele parou de crescer | existe | ← /guias/marketing-organico → /glossario/alcance-organico | P2 |
| /glossario/alcance-organico | glossario | marketing-organico | I | alcance orgânico, o que é alcance orgânico, alcance x impressões | Alcance orgânico | existe | ← /guias/marketing-organico → /guias/como-aumentar-o-alcance-organico | P3 |
| /glossario/conteudo-organico | glossario | marketing-organico | I | conteúdo orgânico, o que é conteúdo orgânico, post orgânico | Conteúdo orgânico | existe | ← /guias/marketing-organico → /solucoes/conteudo-organico-para-empresas | P3 |
| /glossario/hook | glossario | videos-curtos | I | hook, o que é hook em vídeo, gancho de vídeo, primeiros segundos | Hook | existe | ← /guias/videos-curtos → /guias/como-fazer-videos-curtos-que-prendem | P3 |
| /glossario/retencao | glossario | videos-curtos | I | retenção de vídeo, taxa de retenção, curva de retenção | Retenção | existe | ← /guias/videos-curtos → /glossario/watch-time | P3 |
| /glossario/watch-time | glossario | videos-curtos | I | watch time, tempo de exibição, tempo médio de visualização | Watch time | existe | ← /guias/videos-curtos → /glossario/retencao | P3 |
| /glossario/ugc | glossario | videos-curtos | I | ugc, user generated content, ugc creator significado | UGC | existe | ← /guias/videos-curtos → /guias/o-que-e-ugc | P3 |
| /glossario/short-form | glossario | videos-curtos | I | short form, vídeo short form, formato curto vertical | Short-form | existe | ← /guias/videos-curtos → /solucoes/videos-curtos-para-empresas | P3 |
| /glossario/avatar-de-ia | glossario | ia-no-marketing | I | avatar de ia, ai avatar, apresentador virtual | Avatar de IA | existe | ← /guias/ia-no-marketing → /guias/o-que-e-avatar-de-ia | P3 |
| /glossario/clone-de-voz | glossario | ia-no-marketing | I | clone de voz, voz sintética, clonagem de voz ia | Clone de voz | existe | ← /guias/ia-no-marketing → /solucoes/clone-de-ia-para-videos | P3 |
| /glossario/algoritmo-do-tiktok | glossario | marketing-no-tiktok | I | algoritmo do tiktok, como funciona o algoritmo tiktok, for you page | Algoritmo do TikTok | existe | ← /guias/marketing-no-tiktok → /guias/como-viralizar-no-tiktok | P3 |
| /glossario/conteudo-evergreen | glossario | marketing-organico | I | conteúdo evergreen, conteúdo perene, evergreen significado | Conteúdo evergreen | existe | ← /guias/marketing-organico → /guias/estrategia-de-conteudo-para-empresas | P3 |
| /solucoes | indice | (todos) | N | soluções doxa, serviços doxa | Soluções | planejada | → as 6 páginas de `/solucoes` | P2 |
| /plataformas | indice | (todos) | N | plataformas doxa, tiktok instagram youtube empresas | Plataformas | planejada | → as 3 páginas de `/plataformas` | P2 |
| /guias | indice | (todos) | N | guias de marketing orgânico, guias doxa | Guias | planejada | → os 5 hubs e os guias/dores | P2 |
| /comparativos | indice | (todos) | N | comparativos marketing, comparações de conteúdo | Comparativos | planejada | → as 5 páginas de `/comparativos` | P2 |
| /glossario | indice | (todos) | N | glossário de marketing de conteúdo, termos de redes sociais | Glossário | planejada | → os 11 verbetes | P2 |

**Nota de status.** `/solucoes/producao-de-videos-com-ia` é a página-piloto do
motor (`prelude-seo-motor`) e por isso entra como `existe`; ela nasce junto com
`src/seo/` e não estava na branch no momento em que este mapa foi escrito. Todas
as outras nascem `planejada` e só viram `existe` quando o arquivo de conteúdo
correspondente estiver commitado e a rota renderizando HTML no build.

## Canibalização

Cada par abaixo compete pela mesma cabeça de busca. A regra é a mesma em todos: a
página mais **específica** fica com a keyword, a mais **ampla** linka para ela na
primeira menção e não repete o mesmo H2.

| Par | Como diferenciar |
|---|---|
| `/guias/como-postar-todos-os-dias-sem-equipe` × `/guias/como-produzir-conteudo-sem-equipe` | A primeira é sobre **cadência** (rotina, calendário, o que fazer quando o dia aperta). A segunda é sobre **produção** (de onde sai o material). Nenhuma das duas repete o bloco de rotina da outra: a de cadência linka para a de produção quando a resposta for "não tem o que postar". |
| `/solucoes/videos-curtos-para-empresas` × `/solucoes/producao-de-conteudo-em-escala` | A primeira é sobre **formato** (vertical, curto, legendado, o que a marca entrega). A segunda é sobre **volume e operação** (60 conteúdos, cadência, quem faz). Título e H1 não podem trocar de lugar. |
| `/solucoes/marketing-com-ia` × `/guias/como-usar-ia-no-marketing` × `/guias/ia-no-marketing` (hub) | Hub = mapa do cluster, sem CTA forte. Guia = tutorial, informacional. Solução = comercial, responde "quem faz por mim". Se o guia começar a vender, ele vira duplicata da solução. |
| `/solucoes/conteudo-organico-para-empresas` × `/guias/marketing-organico` (hub) × `/glossario/conteudo-organico` | Verbete define em 150–250 palavras e manda para o hub. Hub explica o cluster. Solução fala de contratar. |
| `/guias/como-viralizar-no-tiktok` × `/guias/marketing-no-tiktok` (hub) × `/glossario/algoritmo-do-tiktok` | O verbete explica o mecanismo de distribuição; o guia dá o método; o hub organiza. "Algoritmo" é palavra do verbete, "viralizar" é do guia. |
| `/solucoes/clone-de-ia-para-videos` × `/guias/o-que-e-avatar-de-ia` × `/glossario/avatar-de-ia` × `/glossario/clone-de-voz` | "O que é" é editorial e neutro (§47), inclusive sobre usos que a Doxa não vende. A solução fala só do que a Doxa entrega. Os dois verbetes se dividem por **imagem** (avatar) e **voz** (clone de voz). |
| `/guias/como-aumentar-o-alcance-organico` × `/glossario/alcance-organico` | Verbete = definição + como se mede. Guia = diagnóstico e o que fazer. O verbete nunca abre lista de táticas. |
| `/guias/o-que-e-ugc` × `/glossario/ugc` × `/comparativos/ugc-vs-conteudo-de-marca` | Verbete define; guia explica os dois sentidos da sigla; comparativo decide entre formatos. |
| `/plataformas/instagram-reels-para-empresas` × `/guias/reels-no-instagram` × `/guias/como-crescer-no-instagram-organicamente` | Plataforma = comercial, foco em marca. Hub = mapa. Guia de crescimento = dor, foco em quem já posta e não cresce. |
| `/guias/videos-curtos` (hub) × `/glossario/short-form` × `/guias/como-fazer-videos-curtos-que-prendem` | O verbete é o termo em inglês e a definição; o hub é o mapa em português; o guia é execução. |
| `/comparativos/organico-vs-pago` × `/guias/marketing-organico` | O comparativo precisa ser **imparcial** (§37 do brief) e admitir onde pago ganha. O hub não repete a tabela do comparativo. |

## Backlog priorizado

Nota = **Commercial Intent × Relevance × Search Opportunity × Ability to Win**
(1–5 cada; produto máximo 625). "Search Opportunity" é estimativa qualitativa
convertida em número, e é a coluna que muda primeiro quando o Search Console
existir.

| URL | tipo | hub | CI | R | SO | AW | nota | por que entra |
|---|---|---|---|---|---|---|---|---|
| /solucoes/avatar-de-ia-para-empresas | solucao | ia-no-marketing | 5 | 5 | 4 | 4 | 400 | intenção comercial direta sobre o produto real (clone de imagem) |
| /solucoes/clone-de-voz-para-videos | solucao | ia-no-marketing | 5 | 5 | 3 | 4 | 300 | a metade "voz" do clone, hoje só coberta por verbete |
| /solucoes/conteudo-para-redes-sociais-com-ia | solucao | ia-no-marketing | 5 | 4 | 4 | 3 | 240 | cabeça de cluster ampla; disputa alta |
| /solucoes/conteudo-recorrente-para-empresas | solucao | marketing-organico | 5 | 4 | 3 | 4 | 240 | "conteúdo diário/recorrente" é o que a operação faz |
| /guias/como-produzir-60-videos-em-90-dias | guia | videos-curtos | 4 | 5 | 3 | 5 | 300 | é literalmente a metodologia, com fonte no manual |
| /guias/como-usar-o-mesmo-video-nas-tres-redes | guia | videos-curtos | 3 | 5 | 3 | 5 | 225 | regra `RT-1` vira conteúdo útil e raríssimo na SERP |
| /guias/como-fazer-hook-de-video-curto | guia | videos-curtos | 3 | 5 | 4 | 4 | 240 | complementa `/glossario/hook` com execução |
| /guias/como-escrever-roteiro-de-video-curto | guia | videos-curtos | 3 | 5 | 4 | 4 | 240 | roteiro é entregável citado no source of truth |
| /guias/como-viralizar-no-instagram | guia | reels-no-instagram | 3 | 4 | 5 | 3 | 180 | volume alto presumido, disputa altíssima |
| /guias/como-crescer-no-youtube-shorts | guia | videos-curtos | 3 | 5 | 3 | 4 | 180 | a terceira rede, sub-atendida no PT-BR |
| /guias/quantas-vezes-postar-por-dia-no-tiktok | guia | marketing-no-tiktok | 3 | 5 | 4 | 4 | 240 | pergunta que a regra de cadência responde melhor que a concorrência |
| /guias/melhor-horario-para-postar-no-instagram | guia | reels-no-instagram | 2 | 3 | 5 | 2 | 60 | tráfego alto e raso; entra tarde, se entrar |
| /guias/calendario-de-conteudo-para-redes-sociais | guia | marketing-organico | 3 | 4 | 4 | 3 | 144 | topo de funil clássico; exige ângulo próprio |
| /guias/como-medir-resultado-de-conteudo-organico | guia | marketing-organico | 4 | 5 | 3 | 4 | 240 | conecta com a promessa de views somadas |
| /guias/por-que-meu-instagram-parou-de-crescer | dor | reels-no-instagram | 3 | 5 | 4 | 4 | 240 | dor de alta frequência, par natural da dor de views |
| /guias/marketing-de-conteudo-para-b2b | guia | marketing-organico | 4 | 4 | 3 | 3 | 144 | o FAQ já afirma que a Doxa serve B2B |
| /guias/video-vertical-no-linkedin | guia | videos-curtos | 3 | 3 | 3 | 3 | 81 | adjacência: rede fora da garantia, tratada como guia |
| /guias/o-que-e-uma-agencia-de-marketing-com-ia | guia | ia-no-marketing | 4 | 4 | 4 | 4 | 256 | **adjacência §47**: captura a busca sem a Doxa se dizer agência |
| /guias/o-que-faz-um-social-media | guia | marketing-organico | 2 | 3 | 4 | 3 | 72 | adjacência editorial; ponte para agência-vs-equipe |
| /comparativos/heygen-vs-gravacao-com-camera | comparativo | ia-no-marketing | 4 | 5 | 3 | 4 | 240 | ferramenta real da stack, comparada com honestidade |
| /comparativos/freelancer-vs-agencia-de-conteudo | comparativo | marketing-organico | 4 | 4 | 3 | 4 | 192 | terceira via do comparativo de equipe |
| /comparativos/conteudo-organico-vs-influenciador | comparativo | marketing-organico | 4 | 4 | 3 | 4 | 192 | alternativa que o lead considera de verdade |
| /comparativos/reels-vs-tiktok-vs-shorts | comparativo | videos-curtos | 3 | 5 | 4 | 3 | 180 | só depois de `/comparativos/tiktok-vs-instagram`, para não canibalizar |
| /glossario/engajamento | glossario | marketing-organico | 2 | 4 | 4 | 4 | 128 | verbete-base do cluster de métricas |
| /glossario/impressoes | glossario | marketing-organico | 2 | 4 | 3 | 4 | 96 | fecha o par com alcance |
| /glossario/feed-recomendado | glossario | marketing-no-tiktok | 2 | 4 | 3 | 4 | 96 | explica "For You" sem depender do verbete de algoritmo |
| /glossario/roteiro-de-video-curto | glossario | videos-curtos | 2 | 5 | 3 | 4 | 120 | entregável citado no source of truth |
| /glossario/clone-digital | glossario | ia-no-marketing | 3 | 5 | 3 | 4 | 180 | termo que o dono usa; hoje sem verbete |
| /glossario/legenda-embutida | glossario | videos-curtos | 2 | 5 | 2 | 5 | 100 | "legendado" é palavra da entrega; verbete curto |
| /glossario/cta | glossario | marketing-organico | 2 | 3 | 4 | 3 | 72 | genérico demais para ser prioridade |

## Rodada 2 — CONCLUÍDA (2026-08-18, 02:20; PRs #55–#57)

Selecionadas do backlog pela nota, evitando canibalização com a FASE 1. Já estão em
`src/seo/rotas-planejadas.ts`. Puladas de propósito: `/solucoes/avatar-de-ia-para-empresas`
(colide com `clone-de-ia-para-videos` + guia + verbete), `/solucoes/conteudo-recorrente-
para-empresas` (colide com orgânico/escala), `/comparativos/heygen-vs-gravacao-com-camera`
(nome de ferramenta no title × `tools.ts`), `/comparativos/reels-vs-tiktok-vs-shorts`
(depois de `tiktok-vs-instagram` assentar).

| Track | URLs |
|---|---|
| `track-seo-rodada-2-guias` | como-produzir-60-videos-em-90-dias · como-usar-o-mesmo-video-nas-tres-redes · como-fazer-hook-de-video-curto · como-escrever-roteiro-de-video-curto · quantas-vezes-postar-por-dia-no-tiktok · como-medir-resultado-de-conteudo-organico · o-que-e-uma-agencia-de-marketing-com-ia · como-crescer-no-youtube-shorts · marketing-de-conteudo-para-b2b (+ estrategia-de-conteudo-para-empresas; **como-usar-ia-no-marketing NÃO escrita e retirada do contrato** — eixo com 3 donos) |
| `track-seo-rodada-2-comparativos-glossario` | freelancer-vs-agencia-de-conteudo · conteudo-organico-vs-influenciador · engajamento · impressoes · clone-digital · roteiro-de-video-curto · legenda-embutida · feed-recomendado · cta |
| `track-seo-rodada-2-dores-solucoes` | por-que-meu-instagram-parou-de-crescer · conteudo-para-redes-sociais-com-ia · clone-de-voz-para-videos |

## Rodada 3 — CONCLUÍDA (2026-08-18, 03:45; PR #63)

| Track | URLs | Por quê |
|---|---|---|
| `track-seo-rodada-3` | video-vertical-no-linkedin · o-que-faz-um-social-media | as duas adjacências §47 do backlog sem risco de canibalização. Puladas: `como-viralizar-no-instagram` (colide com `como-crescer-no-instagram-organicamente`), `calendario-de-conteudo` (4ª página de planejamento — estratégia/rotina/arco já existem), `melhor-horario-para-postar` (isca de SERP; a biblioteca já diz que horário pesa pouco), `reels-vs-tiktok-vs-shorts` (colide com `tiktok-vs-instagram` + `mesmo-video-nas-tres-redes`), `heygen-vs-gravacao` (ferramenta no title × tools.ts), `avatar-de-ia-para-empresas` e `conteudo-recorrente` (colidem). |

## Estado ao fim da noite (2026-08-18, ~04:00)

**63 páginas + 5 índices = 68 rotas** em `feat/seo-organico` (PRs #48–#63): soluções 8 ·
plataformas 3 · hubs 5 · guias 17 · dores 5 · comparativos 7 · glossário 18. Três
rodadas de correção transversal (1–3) com um dono por bloco, FAQ única no corpus, e a
família de generalização sem fonte varrida. **Backlog de páginas novas esgotado no
padrão de qualidade** — o que resta na tabela do backlog colide com página existente
ou é isca de SERP (motivos na seção da rodada 3 e no "Não fazer"). Próximas páginas só
com insumo novo do dono (respostas às PENDENTES do FAQ; casos com material; en-US
com motivo comercial) ou com dado do Search Console para reordenar a prioridade.

Sem GSC/GA (`BLOCKED_EXTERNAL_CREDENTIAL`), a coluna Search Opportunity continua
qualitativa. Primeira tarefa quando houver acesso: baseline (indexação, queries,
impressões, cliques, CTR, posição) e recalibrar esta tabela.


| Cogitado | Motivo |
|---|---|
| `/industrias/advocacia`, `/industrias/saude`, `/industrias/imoveis` e o resto da lista de nichos do formulário | **Descartado.** §14 e §46: página por vertical só com proposta realmente diferenciada, e não existe oferta diferenciada por nicho em lugar nenhum do repositório (`src/components/comparacao/config.ts:369-377` é lista de opções de formulário, não catálogo). Trocar a palavra do nicho no mesmo texto é doorway. |
| `/cidades/sao-paulo`, `/cidades/rio-de-janeiro` e páginas locais em geral | **Descartadas.** §14: sem operação local, sem intenção local e sem conteúdo exclusivo, é doorway page. Também não há endereço nem sede documentados no repositório (source of truth §9.2). |
| `/solucoes/agencia-de-marketing-com-ia` | **Descartada** como solução. A Doxa afirma publicamente que **não é agência** (`public/llms.txt:40-41`). A busca é capturada editorialmente em `/guias/o-que-e-uma-agencia-de-marketing-com-ia` e em `/comparativos/agencia-vs-equipe-interna` — §47. |
| `/solucoes/trafego-pago`, `/solucoes/gestao-de-anuncios` | **Descartadas.** A Doxa não vende tráfego pago (`public/llms.txt:42`) e impulsionar é proibido nos perfis da estratégia. A adjacência vive em `/comparativos/organico-vs-pago`. |
| `/solucoes/agencia-licenciada` / página de licenciamento | **Descartada por ora.** O programa não está documentado em lugar nenhum e a pergunta está em `PENDENTES` (`src/components/faq/config.ts:714`). Reabrir só com confirmação do dono. |
| `/solucoes/curso-de-marketing-com-ia`, `/solucoes/ferramenta-de-ia` | **Descartadas.** "Não vende curso, ferramenta nem assinatura de software" (`public/llms.txt:43`). |
| `/cases/magalu`, `/cases/core`, `/cases/uninova` | **Descartadas nesta leva.** Só há três casos, um deles sem números, e nenhum depoimento. Uma página de case por cliente com o material atual seria página fina. Reavaliar quando os arquivos que faltam chegarem (`src/components/proof/reels.ts:9-13`). |
| Variações de keyword da mesma intenção (`producao-de-videos-ia`, `videos-com-ia-para-empresas`, `criar-video-com-ia`) | **Descartadas.** §46: mesma intenção, mesma página. Vira seção ou FAQ dentro de `/solucoes/producao-de-videos-com-ia`. |
| Páginas em `en-US` espelhando o PT nesta leva | **Descartadas por ora.** §54: en-US só com hreflang e canonical revisados e motivo comercial. Duplicação automática antes disso é dívida. |
