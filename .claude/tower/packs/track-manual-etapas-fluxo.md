# Manual por etapas — Track A: uma coisa de cada vez, e o conteúdo que alimenta (task_manual_etapas_fluxo)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em MAIN).

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/manual-etapas-fluxo origin/feat/manual-etapas`
e confirme: `ls public/manual/prints/*.avif | wc -l` = **8** (4 `onboarding-*`, 4
`voz-*` — a série 12.2x do prelude). `git status --porcelain` vazio · worktree, não o
repo principal. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO
O manual consumido **uma coisa de cada vez**: clica "Entendi"/"Próximo" e o conteúdo
aparece por etapa — nunca uma parede de texto descendo. Nos capítulos 1–3: animação em
cima, texto embaixo, botão para começar, itens um por clique, **com os prints da
plataforma no meio**. Na garantia: **trava → destrava em pares** — a regra, depois a
parte boa, com "Li, concordo" em cada destrava. E a copy atual dos caps 1–2 "está
horrível": reescrever ON-1/ON-2, tirar "Envie cru".

## CONTEXTO (não perca tempo redescobrindo — diagnóstico do GESTOR)
- **O que JÁ existe e NÃO se refaz**: a garantia JÁ é por etapas
  (`src/manual/publico/maquina.ts` → `etapasDo`: intro → 8 itens → respiro), veio de
  veredito anterior do dono. A "parede" que ele viu são os capítulos SEM obrigatória
  (onboarding, voz, clone — seed v2/v4 só tem `obrigatoria=true` em GA-1..8): eles caem
  no feitio `leitura` = UMA tela com todos os cartões (`TelaDeLeitura` em
  `Capitulo.tsx`) e os prints no fim. **A prévia admin reusa `Leitura` → conserte o
  fluxo e a prévia espelha DE GRAÇA. Nenhuma feature nova no admin.**
- **A arquitetura, decidida pelo GESTOR:**
  1. `Etapa` ganha `{ tipo: 'cartao'; regra }` (um cartão por tela) e
     `{ tipo: 'print'; print }` (um print por tela). O tipo `'leitura'` **morre** —
     nenhuma versão renderiza mais parede. Derivação do capítulo sem obrigatória:
     intro → cartões um a um, com os prints ancorados entrando logo após o cartão
     âncora → prints sem âncora → (clone) `fotos`.
  2. **`src/manual/publico/prints.ts` (NOVO, dados puros, sem React)**: a série 12.2x
     inteira — `src`, `alt`, `legenda`, `largura`, `altura` (pixels REAIS via
     `sips -g pixelWidth -g pixelHeight`), slug e `apos?: string` (código da regra
     âncora). `maquina.ts` importa daqui para derivar as etapas; `Prints.tsx` vira o
     renderizador de UM print (`figure` + `figcaption`, `loading="lazy"`, alt nunca
     vazio — mantenha o padrão que já está lá). **OLHE cada AVIF (a tool Read
     renderiza imagem) antes de escrever alt/legenda.**
  3. **Pares trava→destrava, dirigidos a DADOS**: a informativa imediatamente seguinte
     a uma obrigatória (por `ordem`) é a **destrava** do par; informativas depois da
     última obrigatória continuam sendo o respiro (GA-9 fica onde está). Etapa nova
     `{ tipo: 'destrava'; regra: Regra; alivio: Regra }` — `regra` é a OBRIGATÓRIA do
     par. A `TelaDaDestrava` (em `Aceites.tsx`) mostra o par: **esquerda = não pode
     (a trava, resumida), direita = pode (o alívio)** — empilhado no celular — e o
     check "Li, concordo", que alterna `regra.id` (a obrigatória). Item COM destrava →
     `TelaDoItem` esconde a confirmação e não trava (`podeAvancarDaEtapa` deixa
     passar); item SEM destrava (v4 no ar, versões antigas) → comportamento de hoje,
     intacto. `etapaDeRetomada` continua caindo na primeira etapa `item` não marcada
     (a trava do par).
  4. **Contrato do aceite INTOCADO**: `montarPedidoConcluir`, `podeAvancarDa`,
     `impedimentosDoAceite` não mudam — cobram todas as obrigatórias, como sempre. As
     destravas são `obrigatoria=false` e o banco nem as vê no aceite:
     `manual_concluir` valida e snapshota SÓ `r.obrigatoria`
     (`supabase/manual.sql` ~542–562). Não toque `src/manual/servidor/**`.
  5. **`supabase/manual-seed-v5.sql` (NOVO)**: rascunho da v4 via
     `manual_criar_rascunho` (copie o esqueleto do `manual-seed-v4.sql`: guarda de
     idempotência por `numero = 5`, publica no fim). Conteúdo: reescreve ON-1, ON-2 e
     VZ-2 (copy abaixo); renumera as regras da garantia para ordens em dezenas
     (GA-n → n*10, GA-9 → 95) e insere 8 destravas informativas com código `GA-nP` na
     ordem n*10+5, `severidade 'normal'`, `obrigatoria false`. **NÃO aplique no
     banco** — o arquivo é o entregável; quem aplica é a sessão principal, depois do
     gate de copy do dono. Seeds v1–v4 já aplicados: não os edite.
- **Copy proposta pelo GESTOR (refine a seu critério; o DONO aprova antes do merge —
  não invente fato de contrato: destrava só afirma o que GA-9 e os exemplos já
  afirmam):**
  - ON-1 → título "Suas respostas viram os seus vídeos"; instrução: responda como se
    explicasse a empresa a um sócio novo — o que vende, para quem, por quê; porquê: a
    plataforma dá nota por resposta e diz o que faltou (é o que os prints mostram);
    exemplo mantém o das clínicas odontológicas.
  - ON-2 → título "Um canal, uma pessoa"; instrução: escolha quem do seu time fala
    com a DOXA — dúvida, aviso e problema passam por essa pessoa; exemplo: '"quem
    fala com a DOXA é a Ana", decidido no primeiro dia'.
  - VZ-2 → título "Fale natural" — **sem "envie cru" em lugar nenhum**; instrução:
    voz de conversa, ritmo normal, celular à mesma distância, sem aplicativo de
    "melhorar áudio" — a gravação vai do gravador direto para a plataforma.
  - Destravas (uma linha de direção cada; escreva instrução + porquê curtos):
    GA-1P "A meta é nossa, não sua" · GA-2P "Uns minutos por dia — baixar, publicar,
    seguir a vida" · GA-3P "Perdeu um dia? Publica no dia seguinte e segue" ·
    GA-4P "O perfil continua seu: stories, carrosséis e fotos todo dia; no fim de
    semana, vídeo seu" · GA-5P "Zero trabalho de edição — o vídeo chega pronto" ·
    GA-6P "Você não paga para alcançar: a conta do 1 milhão é orgânica" ·
    GA-7P "Engajamento de verdade pode e ajuda — o que não entra é comprar número" ·
    GA-8P "Perguntar nunca quebra a garantia — na dúvida, manda no grupo antes".
  - UI: intro dos capítulos de leitura ganha a promessa do caminho ("São N passos
    curtos — um por tela") e botão "Começar →"; cartao/print avançam com "Próximo →";
    o rótulo "Na plataforma, é assim" continua sendo o letreiro das telas de print.
- **Âncoras propostas dos prints** (é dado em `prints.ts`, ajuste se a narrativa pedir
  e justifique no report): onboarding — `onboarding-scan`, `onboarding-negocio`,
  `onboarding-autoridade` após ON-1; `onboarding-redes` após ON-2. voz — os 4 sem
  âncora, no fim, na ordem `voz-minha-voz` → `voz-clone-de-voz` → `voz-verificar` →
  `voz-pendente` ("como vai ser na prática").
- **Testes**: `telas.test.tsx` e `maquina.test.ts` usam fixtures e
  `renderToStaticMarkup` — SEM clique; prove montando o passo
  (`{ tipo:'capitulo', indice, etapa }`), como os testes atuais fazem. O describe
  "os prints reais da plataforma" muda de natureza (bloco no fim → uma etapa por
  print). `previa.test.tsx` (admin) está no seu escopo SÓ porque o teste "o capítulo
  de leitura sai inteiro" descreve a parede que você está matando — atualize-o para o
  mundo novo **sem afrouxar as asserções de segurança** (prévia sem botão de
  concluir continua provada). Testes novos que não podem faltar: N cartões + prints
  ancorados na posição certa; destrava trava até marcar e o check alterna o id da
  OBRIGATÓRIA; item com destrava não mostra confirmação; item sem destrava mantém;
  retomada cai na trava do primeiro par não marcado; `tipo 'leitura'` não existe mais.
- Armadilhas do repo (já morderam): **pnpm**, não npm · `.focus(` só com
  `{ preventScroll: true }` (o `Leitura.tsx` já paga — não mexa nele) ·
  `tailwind.config.js`/`index.css` INTOCÁVEIS · opacidade fora da escala de 5 só
  `[0.78]` · classe nunca montada por template string · StrictMode roda efeito 2×.
- **INTOCÁVEIS**: `src/manual/cenas/**` (track B está lá — importar pode, editar
  não), `src/manual/publico/pecas.tsx`, `Fluxo.tsx`, `Leitura.tsx`, `Abertura.tsx`,
  `Revisao.tsx`, `Termos.tsx`, `Conclusao.tsx`, `Estados.tsx`, `Identificacao.tsx`
  (precisou tocar → PARE e reporte), `src/manual/servidor/**`, `src/manual/admin/**`
  fora do `previa.test.tsx`, `tipos.ts`, `api/**`, `public/**`, `index.css`,
  `tailwind.config.js`, `package.json`, seeds v1–v4.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Comentários em PT. Sem `any`,
  sem `@ts-ignore`, sem dependência nova.

## A TASK
1. `prints.ts` novo com a série 12.2x (alt/legenda olhando cada imagem, dims via sips,
   âncoras) e `Prints.tsx` reescrito como renderizador de um print.
2. `maquina.ts`: etapas `cartao`/`print`/`destrava`, morte do tipo `leitura`, pares por
   dados, gate e retomada conforme CONTEXTO.
3. `Capitulo.tsx` + `Aceites.tsx`: telas novas (cartão, print, destrava com o layout
   não-pode/pode e o check), intro generalizada, rótulos de avanço.
4. `supabase/manual-seed-v5.sql` com a copy nova (ON-1, ON-2, VZ-2, 8 destravas).
5. Testes: `maquina.test.ts`, `telas.test.tsx`, `previa.test.tsx` conforme CONTEXTO.

## SCOPE
- src/manual/publico/maquina.ts
- src/manual/publico/maquina.test.ts
- src/manual/publico/prints.ts
- src/manual/publico/Prints.tsx
- src/manual/publico/Capitulo.tsx
- src/manual/publico/Aceites.tsx
- src/manual/publico/telas.test.tsx
- src/manual/admin/previa.test.tsx
- supabase/manual-seed-v5.sql

## DEPENDS ON
Prelude de assets commitado em `feat/manual-etapas` (o STEP 0 confirma os 8 prints).
A track B (`track/manual-cenas-reveal`) roda em paralelo em `cenas/` — integração no
merge serial, não aqui.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline (main hoje: **327/327**) e com os
  testes novos desta track inclusos
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-etapas...HEAD` = exatamente os 9 arquivos
  do SCOPE
- `git diff origin/feat/manual-etapas...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `grep -n "tipo: 'leitura'" src/manual/publico/maquina.ts` = vazio (a parede morreu
  de verdade, não foi escondida)
- `grep -c "/manual/prints/" src/manual/publico/prints.ts` = 8 (um caminho literal por
  print da série 12.2x)
- `grep -inE "envie cru" supabase/manual-seed-v5.sql` = vazio
- `grep -cE "'GA-[1-8]P'" supabase/manual-seed-v5.sql` = 8 (uma destrava por par)
- `grep -n "numero = 5" supabase/manual-seed-v5.sql` presente (idempotência)
- `git diff origin/feat/manual-etapas...HEAD | grep -n 'alt=""'` = vazio

## COMMIT + PUSH
`feat(manual): uma coisa de cada vez — etapas nos caps 1-3, prints 12.2x e pares
trava/destrava` → `git push -u origin track/manual-etapas-fluxo`. **NÃO mergeie. NÃO
aplique seed no banco.**
Report: sumário + verdict READY/NOT READY + saída colada do VERIFY + **tabela de copy
ANTES → DEPOIS** (ON-1, ON-2, VZ-2, as 8 destravas, os rótulos de UI) + mapa
print→âncora→legenda — é com isso que o dono decide o gate. Merge/deploy/LIVE são do
GESTOR.
