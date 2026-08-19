# Card 014 — Track C: "Como funciona na prática" — as 7 capturas da voz no lugar das 4 antigas (task_014_prints_etapas)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-014-prints-etapas`,
branch **`track-014-prints-etapas`** (JÁ criada pelo `tower-track.sh` a partir da base
**`rafa-bulgarelli/gorgonian`** — NÃO é main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-014-prints-etapas` · `git status --porcelain`
vazio · `git merge-base --is-ancestor rafa-bulgarelli/gorgonian HEAD && echo base-ok` =
`base-ok` · `ls public/manual/prints/*.avif | wc -l` = **8** (4 onboarding + 4 voz,
todos `-v2`) · as 7 capturas existem: `ls "/Users/rafaelfernandes/Desktop/Etapa voz
"{1,2,3,4,5}.png "/Users/rafaelfernandes/Desktop/etapa voz "{6,7}.png` (repare: 1–5
com **E** maiúsculo, 6–7 minúsculo) · você está na worktree, não no repo principal.
Divergiu → **PARE e reporte.**

> **CONGELAMENTO DE DEPLOY (ordem do dono).** Nada sobe para Vercel nem Supabase.
> Você commita e dá push na branch; só isso. Preview de branch da Vercel é automático
> e fica atrás de SSO — não conta como produção, e você não precisa dele.

## A VISÃO DO DONO (brief `.claude/tower/briefs/014-onboarding-voz-ditado-do-dono.md`)
"Eu tirei algumas capturas de tela … Etapa Voz 1, Etapa Voz 2 … para que fique tudo
redondo." · "Precisa alterar **todos** os prints, porque os prints que estão lá agora
são prints antigos … seguindo a mesma ordem: 1, 2, 3, 4, 5, 6, 7. Essas sete etapas
elas entram como **funciona na prática**, mostrando para o cliente como é na prática
que ele vai fazer toda a captura da voz dele na plataforma." · A régua é **60 minutos
mínimos** (ditada 2×). · "Etapa Voz 4: uma dica para o cliente … baixar esses áudios
dentro do computador dele, para que ele não perca os arquivos" · "Etapa 6 … ler essa
frase para fazer a verificação. Quando ele passar, a voz está pronta para uso" · "Caso
ele não passe … verificação manual, que é enviar um documento … RG, CNH, passaporte."

## CONTEXTO (não perca tempo redescobrindo)
- **Dado puro:** `src/manual/publico/prints.ts` — `Record<slug do capítulo, Print[]>`;
  `Print = { slug, src, alt, legenda, largura, altura, apos? }`. Quem transforma print
  em TELA é `etapasDo` em `maquina.ts`: print com `apos` entra depois do cartão daquele
  código; **print SEM `apos` é "solto" e cai no FIM do capítulo, na ordem do array**
  (`maquina.test.ts` "print sem âncora vai para o fim do capítulo, na ordem em que está
  no dado"). Cada print é UMA tela (`TelaDoPrint` em `Capitulo.tsx`: `<h2>` letreiro +
  `<figure><img …><figcaption>`).
- **Decisão do GESTOR — a âncora:** os 7 prints da voz NÃO levam `apos`. São o bloco
  "Como funciona na prática" no fim do capítulo, ordem 1→7 = ordem do array. Com o
  passo novo `VZ-4` sendo o último do capítulo na v8 (seed de outra track), o bloco
  entra logo depois dele; num convite preso à v7 (VZ-1..3) entra depois do VZ-3 — os
  dois mundos funcionam sem caso especial. Ancorar em `VZ-4` daria o mesmo lugar na v8
  e nada na v7, e mentiria sobre a relação (os prints provam o fluxo da plataforma,
  não uma regra).
- **Decisão do GESTOR — o letreiro (a única linha de motor desta track):** `Print` ganha
  `letreiro?: string` ("o `<h2>` desta tela; sem ele, o padrão"); `TelaDoPrint` escreve
  `print.letreiro ?? 'Na plataforma, é assim'`. Os 7 da voz usam
  `letreiro: 'Como funciona na prática · N de 7'` (N = 1..7, literal no dado — é o que
  o teste confere). Os 4 do onboarding ficam como estão (sem `letreiro`).
- **Os arquivos:** 7 PNG Retina de **3456×1990** (a 6 é 3456×1988) → AVIF **960px de
  largura**, single-item, com NOME NOVO:
  `public/manual/prints/voz-etapa-{1..7}-v3.avif`. Os 4 antigos
  (`voz-minha-voz-v2`, `voz-clone-de-voz-v2`, `voz-pendente-v2`, `voz-verificar-v2`)
  são REMOVIDOS (`git rm`). Os 4 do onboarding não se tocam.
- **A receita de encode (testada pelo GESTOR nesta máquina, 2026-08-19 — é a mesma dos
  `-v2`):**
  ```
  sips -Z 960 -s format avif "/Users/rafaelfernandes/Desktop/Etapa voz 1.png" --out public/manual/prints/voz-etapa-1-v3.avif
  ```
  Resultado esperado: 960×552 (a 6 talvez 960×552 também — LEIA, não estime), ~17 KB,
  `grep -c -a grid <arquivo>` = **0** e `grep -o -a av01 <arquivo> | wc -l` = **1**
  (single-item). Acima de ~960px o `sips` tila em GRADE (6× `av01` + item `grid`), e
  grade AVIF **não decodifica em todo navegador: 200 OK, content-type certo, moldura
  VAZIA** — foi o bug do card 008. Não "melhore" para 1200px.
- **`largura`/`altura` no `prints.ts` são os pixels REAIS** do AVIF gerado (`sips -g
  pixelWidth -g pixelHeight`), nunca da PNG de origem; sem eles certos a imagem empurra
  o texto ao chegar.
- **Cache-bust é por NOME.** Duas CDNs na frente (Cloudflare + Vercel): nunca
  sobrescreva um nome já servido. `-v3` é o padrão novo desta rodada.
- **`alt` = o que a TELA mostra; `legenda` = a NOSSA voz.** Já custou revisão: o alt
  conta o que está escrito no print (inclusive "pelo menos 30 minutos de áudio (ideal:
  1 hora ou mais)", "32 minutos fornecidos", "Use um microfone profissional"); a
  legenda cobra os **60 minutos** e diz o que FAZER naquela tela. Abra cada PNG com a
  tool Read ANTES de escrever o alt.
- **Testes que hoje contam 4 prints da voz — são SEUS e mudam:**
  - `src/manual/publico/telas.test.tsx`: fixture `LEITURA` (voz, só VZ-1) → "1 cartão +
    4 prints = 5 telas" vira **1 + 7 = 8** ("São 8 passos curtos — um por tela."); "a
    última tela do capítulo informativo fecha no Entendi" (etapa 5 → **8**); "a série
    da voz fecha o capítulo na ordem real" (4 slugs → os 7 `voz-etapa-N-v3`, 1→7);
    "todo print carrega alt de verdade, é `-v2` e reserva o próprio espaço" (8 → **11**
    tags; o regex `-v2\.avif` passa a aceitar `-v[23]\.avif`, `width="960"` fica);
    novo: a tela de print da voz traz "Como funciona na prática · 1 de 7" … "· 7 de 7"
    e a do onboarding continua "Na plataforma, é assim"; novo: fixture `VOZ_V8` (VZ-1..
    VZ-4, códigos reais, `VZ-4` = "Mesmo equipamento, mesmo lugar — nos 60 minutos
    inteiros", todas informativas) → intro promete **11** passos, etapa 4 = "Passo 4 de
    4" com o título do VZ-4, etapas 5..11 = os 7 prints em ordem, etapa 11 = "Entendi
    →". NÃO afirme `<svg` na tela do VZ-4 (a cena é de outra track; aqui só o cartão).
  - `src/manual/publico/maquina.test.ts`: "print sem âncora vai para o fim do capítulo"
    → 7 `print` após o `cartao`, slugs `voz-etapa-1`..`voz-etapa-7`; acrescente o caso
    v8 (4 cartões + 7 prints, os prints DEPOIS do último cartão).
  - `src/manual/admin/previa.test.tsx` "a prévia mostra os prints reais da plataforma,
    um por tela" (etapa 2 da voz): o letreiro agora é "Como funciona na prática · 1 de
    7" — ajuste a asserção (continua 1 `<img>` por tela).
- **Onde cada coisa aparece na tela** (`Capitulo.tsx`): intro ("São N passos curtos") →
  cartões "Passo X de Y" (Y = só cartões) → as telas de print → botão "Entendi →" na
  última. A contagem N inclui os prints — com 4 passos + 7 prints, "São 11 passos
  curtos". É decisão do dono ter as 7; não "economize" tela.

### AS 7 TELAS (o que cada PNG mostra — confira olhando; o alt é FIEL a isto)
| N | Arquivo de origem | O que a tela mostra (para o alt) | O que a legenda manda fazer (nossa voz, 60 min) |
|---|---|---|---|
| 1 | `Etapa voz 1.png` | "Minha Voz" — três etapas em linha (Upload das gravações de voz · Voz em treinamento · Voz pronta para uso), aviso "Você ainda não tem uma voz profissional…", botões "Dicas para obter os melhores resultados" e "Criar clone de voz"; menu lateral com "Minha Voz Profissional" selecionado | No menu, "Minha Voz Profissional" → "Criar clone de voz". É por aqui que se entra — e é por aqui que se VOLTA toda vez que sair. |
| 2 | `Etapa voz 2.png` | "Clone de Voz Profissional": à esquerda Nome da voz (ex. "Voz do João"), Idioma (Português), Descrição, Etiqueta/Valor (Sotaque); à direita a esfera rosa e as abas "Enviar amostras" / "Grave-se", "Escolher arquivos", e a dica "Apenas .mp3 ou .webm … pelo menos 30 minutos de áudio (ideal: 1 hora ou mais), com fala natural e sem vícios de linguagem. Não precisa decorar nada…"; "Voltar" e "Avançar" (apagado) | O formulário pode esperar: primeiro a aba "Grave-se". A plataforma fala em 30 minutos no mínimo; a DOXA pede **60** — é o que dá uma voz que não falha. |
| 3 | `Etapa voz 3.png` | A aba "Grave-se" gravando: mostrador circular (Bom 30 min · Melhor 1 h · Melhor ainda 2 h), "Mais 12 minutos necessários", três dicas da plataforma (microfone profissional; lugar silencioso; pausas — várias amostras), "Gravando — 13:27" com "Parar", e "Suas amostras 17.1 MB": gravação 1.webm 04:14 (envio de arquivo), Gravação 1 05:22, Gravação 2 08:58, cada uma com tocar/baixar/apagar | Grave uns 3 minutos, pare, grave de novo. Mesmo aparelho, mesmo lugar (celular no celular, computador no computador). Cada trecho vira uma amostra na lista — e o total vai até **60 minutos**. |
| 4 | `Etapa voz 4.png` | A mesma tela depois de "Parar": player "0:00 / 13:29", menu ⋮ aberto com "Baixar" e "Velocidade da reprodução", botões "Adicionar gravação" e "Regravar"; a lista de amostras com o ícone de baixar em cada uma | Antes de sair da plataforma: ⋮ → **Baixar** em cada gravação (ou o ícone de baixar na lista). O que não foi baixado, a plataforma apaga quando você sai. Ao voltar: "Enviar amostras" com os arquivos baixados, e continue gravando. |
| 5 | `Etapa voz 5.png` | O formulário preenchido: Nome da voz "Rafael Fernandes", Português, Descrição "Uma voz masculina, alegre, feliz e espontânea.", etiquetas Sotaque=Brasileiro, Gênero da voz=Masculina, Faixa etária=Jovem; à direita "32 minutos fornecidos — Continue adicionando gravações para um clone melhor", botão "Gravar", quatro amostras (… Gravação 3 13:29) 29.5 MB; "Avançar" aceso | Com os **60 minutos** na lista, preencha o lado esquerdo: seu nome como nome da voz, o idioma, uma descrição curta da sua voz e as três etiquetas (sotaque, gênero da voz, faixa etária) → "Avançar". (O alt diz 32 minutos — é o que a tela mostra; a legenda cobra 60.) |
| 6 | `etapa voz 6.png` | "Verifique sua voz": o texto de consentimento, a instrução "grave-se lendo em voz alta o texto da imagem abaixo. Leia cada linha uma única vez, em ambiente silencioso…", a frase "A coragem não é a ausência de medo, mas simplesmente seguir em frente com dignidade, apesar desse medo.", botões "Gravar" e "Enviar verificação", link "Não consigo completar a verificação por voz" | A ÚNICA leitura de todo o processo: leia a frase em voz alta, "Gravar" → "Enviar verificação". Passou = a voz entra em treinamento e fica pronta para uso. |
| 7 | `etapa voz 7.png` | A mesma tela com o aviso "Você atingiu o limite de tentativas de verificação … nova tentativa só após 24 horas … Liberação em: 20/08/2026, 12:02:02" e, abaixo, "Envie documentos que comprovem a titularidade da voz (ex.: documento de identidade). A análise é feita manualmente pela equipe e pode levar alguns dias.", "Escolher arquivos", "Contexto adicional para o revisor (opcional)", "Solicitar verificação manual" | Não passou na verificação por voz? Peça a manual: envie um documento com foto (RG, CNH ou passaporte) e "Solicitar verificação manual". A equipe analisa em alguns dias — e você pode fechar a janela; o progresso fica salvo. |

Os slugs: `voz-etapa-1` … `voz-etapa-7`. Os `src`: `/manual/prints/voz-etapa-N-v3.avif`.
O comentário do array `voz` em `prints.ts` narra a decisão (bloco no fim, sem âncora,
1→7, letreiro) — substitua o comentário antigo ("A ORDEM aqui é a ordem REAL…").

### Armadilhas do repo
**pnpm**, não npm · `tailwind.config.js`/`index.css` INTOCÁVEIS · `noUnusedLocals`
reprova sobra · o `<img>` já tem `loading="lazy"`, `decoding="async"`, `width`/`height`
— não mude a tag, só o dado e o letreiro · **não altere o `Print` além de `letreiro?`**
(a máquina importa o tipo) · `maquina.ts` NÃO se toca (o mecanismo de soltos já faz o
que você precisa) · nada de `.focus(` · `src/manual/cenas/**` e `supabase/**` são de
outras tracks.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT. Sem `any`, sem `@ts-ignore`.

## A TASK
1. Encodar os 7 AVIF (receita acima) em `public/manual/prints/voz-etapa-{1..7}-v3.avif`;
   conferir dimensões, `grid` = 0, `av01` = 1 em cada; `git rm` os 4 `voz-*-v2.avif`.
2. `prints.ts`: `letreiro?: string` na interface (doc no estilo das outras); o array
   `voz` com os 7 (slug, src, alt fiel, legenda na nossa voz com 60 min onde couber,
   `largura: 960`, `altura` real, `letreiro: 'Como funciona na prática · N de 7'`, SEM
   `apos`); comentário do bloco atualizado.
3. `Capitulo.tsx`: `TelaDoPrint` usa `print.letreiro ?? 'Na plataforma, é assim'`
   (comentário de 2 linhas dizendo por quê — o bloco da voz tem nome próprio, dado
   pelo dono).
4. Testes: `telas.test.tsx`, `maquina.test.ts`, `previa.test.tsx` como descrito no
   CONTEXTO (contagens, ordem 1→7, letreiros, fixture VOZ_V8, regex `-v[23]`).
5. **Prova de decodificação (sem banco):** `pnpm build && pnpm preview --strictPort
   --port 5210` e, no Chrome, abra `http://localhost:5210/manual/prints/voz-etapa-N-v3.avif`
   para N=1..7 — imagem com conteúdo (não moldura vazia); tire um print com
   `node .claude/tower/bin/mobile-shot.mjs http://localhost:5210/manual/prints/voz-etapa-1-v3.avif 390 <scratchpad>/etapa-1-chrome.png`
   e OLHE. Safari você não consegue automatizar: liste as 7 URLs no report para a
   sessão principal abrir (`open -a Safari <url>`). Confira também que o `dist/` NÃO
   contém `voz-*-v2.avif` (`ls dist/manual/prints/`).

## SCOPE
- public/manual/prints/voz-etapa-1-v3.avif
- public/manual/prints/voz-etapa-2-v3.avif
- public/manual/prints/voz-etapa-3-v3.avif
- public/manual/prints/voz-etapa-4-v3.avif
- public/manual/prints/voz-etapa-5-v3.avif
- public/manual/prints/voz-etapa-6-v3.avif
- public/manual/prints/voz-etapa-7-v3.avif
- public/manual/prints/voz-minha-voz-v2.avif (remoção)
- public/manual/prints/voz-clone-de-voz-v2.avif (remoção)
- public/manual/prints/voz-pendente-v2.avif (remoção)
- public/manual/prints/voz-verificar-v2.avif (remoção)
- src/manual/publico/prints.ts
- src/manual/publico/Capitulo.tsx
- src/manual/publico/telas.test.tsx
- src/manual/publico/maquina.test.ts
- src/manual/admin/previa.test.tsx

## DEPENDS ON
nada (base `rafa-bulgarelli/gorgonian`). Tracks A (seed v8) e B (cenas) rodam em
paralelo em arquivos disjuntos — a cena do VZ-4 NÃO é sua e você não a afirma em teste.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test src/manual/publico/telas.test.tsx src/manual/publico/maquina.test.ts src/manual/admin/previa.test.tsx` verde
- `pnpm test` verde — sem falha NOVA vs baseline da base (**1033/1033**); novos inclusos
- `pnpm build` ok
- `git diff --name-only rafa-bulgarelli/gorgonian...HEAD | sort` = exatamente os 16
  caminhos do SCOPE (7 novos, 4 removidos, 5 fontes)
- `ls public/manual/prints/ | grep voz` = exatamente `voz-etapa-1-v3.avif` …
  `voz-etapa-7-v3.avif` (7 linhas, nenhum `-v2`)
- `ls public/manual/prints/*.avif | wc -l` = 11 (4 onboarding + 7 voz)
- ```
  for n in 1 2 3 4 5 6 7; do f=public/manual/prints/voz-etapa-$n-v3.avif; echo "$n $(sips -g pixelWidth -g pixelHeight $f | awk '/pixel/{printf $2" "}')grid=$(grep -c -a grid $f) av01=$(grep -o -a av01 $f | wc -l | tr -d ' ')"; done
  ```
  = sete linhas `N 960 <altura> grid=0 av01=1`, largura 960 em todas
- `grep -oE "voz-etapa-[1-7]-v3\.avif|altura: [0-9]+" src/manual/publico/prints.ts | paste - -`
  = 7 pares, e cada altura IGUAL à do `sips` da linha acima
- `grep -c "letreiro: 'Como funciona na prática · [1-7] de 7'" src/manual/publico/prints.ts` = 7
- `grep -c "apos: '" src/manual/publico/prints.ts` = 4 (só os 4 do onboarding — nenhum
  `apos` nos 7 da voz; se precisar ver o bloco: `awk '/^  voz: \[/,/^  \],/' src/manual/publico/prints.ts | grep -c "apos:"` = 0)
- `grep -c "letreiro" src/manual/publico/Capitulo.tsx` ≥ 1 e
  `grep -c "Na plataforma, é assim" src/manual/publico/Capitulo.tsx` = 1
- `grep -n "v2.avif" src/manual/publico/prints.ts | grep voz` = vazio
- `grep -c "60 minutos" src/manual/publico/prints.ts` ≥ 3 (legendas 2, 3, 5 no mínimo)
- `grep -n 'alt=""' src/manual/publico/Capitulo.tsx` = vazio
- `git diff rafa-bulgarelli/gorgonian...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff rafa-bulgarelli/gorgonian...HEAD | grep -n "\.focus("` = vazio
- `ls dist/manual/prints/ | grep -c "voz-.*-v2"` = 0 depois do build
- Print do Chrome (mobile-shot) da etapa 1 salvo e OLHADO; as 7 URLs listadas no report
  para o check no Safari.

## COMMIT + PUSH
`feat(manual #014): "Como funciona na prática" — as 7 etapas da voz em -v3, os 4 prints
antigos fora, letreiro por print` → `git push -u origin track-014-prints-etapas`.
**NÃO mergeie.** Report: sumário + verdict READY/NOT READY + VERIFY colado + os 7 pares
alt/legenda (é a peça do gate de copy do dono) + caminho do print do Chrome + as 7 URLs
para o Safari. Merge/deploy/LIVE são do GESTOR.
