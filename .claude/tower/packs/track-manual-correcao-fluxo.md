# Correção do manual — Track A: o fluxo volta ao simples e a copy conta o fato certo (task_manual_correcao_fluxo)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em MAIN).

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/manual-correcao-fluxo origin/feat/manual-correcao`
e confirme: `ls public/manual/prints/*-v2.avif | wc -l` = **8** e
`ls public/manual/prints/*.avif | wc -l` = **8** (os antigos 1400px foram deletados no
prelude; só existem os `-v2`, 960px). `git status --porcelain` vazio · worktree, não o
repo principal. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO (card 008 — rodada de CORREÇÃO sobre o 007)
Os prints da plataforma carregando de verdade; as legendas contando a regra CERTA
(resposta abaixo de 8 trava; o geral precisa de 75); a voz na ordem real (enviar →
verificar → treinar → pronta); e o capítulo 4 ENXUTO — cada passo é só o cartão da
regra + "Li, concordo" + botões. **Este card REVERTE o par trava/destrava do 007.**
O comprovante de aceite continua IDÊNTICO.

## CONTEXTO (não perca tempo redescobrindo — diagnóstico do GESTOR)

### Bug A — por que os prints não carregavam (já resolvido no prelude; você só religa)
Os 8 AVIFs de 1400px eram **grid AVIF** (o `sips` do macOS tila a imagem em 6 itens
`av01` + item `grid` acima de ~960px de largura), e grid AVIF não decodifica no
navegador do dono — 200 OK, `content-type` certo, moldura vazia. As fotos de
450–600px da MESMA pipeline são single-item e carregam. O prelude re-encodou os 8 a
**960px single-item** com NOMES NOVOS (`<slug>-v2.avif` — cache-bust determinístico
nas duas camadas Cloudflare+Vercel). Seu trabalho: apontar `prints.ts` para eles.
- Todos os novos têm `largura: 960`; a **altura é a REAL de cada arquivo** — confira
  com `sips -g pixelWidth -g pixelHeight public/manual/prints/*-v2.avif`, não estime.
- `slug` e `apos` NÃO mudam — só `src`, `largura`, `altura`.

### B1 — a régua da nota (decisão do dono, NÃO reabra)
**"Cada resposta precisa de nota mínima 8/10, e o score geral precisa de 75/100."**
Resposta fraca TRAVA. Corrija em `prints.ts`:
- `onboarding-autoridade.legenda` — hoje diz "Resposta fraca não trava ninguém …
  deixa seguir assim mesmo" → **fato errado**, reescreva: resposta abaixo de 8 trava;
  a análise diz exatamente o que falta para subir a nota.
- `onboarding-scan.legenda` — "de 75 pontos para cima já dá para seguir" fica
  INCOMPLETA sozinha: 75 é a régua do GERAL; complete com a régua por resposta.
- Varra as outras legendas do arquivo: nenhuma pode afirmar que dá para seguir com
  resposta fraca. (O banco/seed v5 está limpo — já conferido; é só o `prints.ts`.)
- **ARMADILHA (custou revisão no 007):** os `alt` DESCREVEM o que o print mostra, e
  o print da plataforma diz "a partir de 75 pontos" / mostra nota fraca — o alt é
  factual e FICA (descreve a tela); é a LEGENDA (nossa voz) que carrega a régua.
  Não "corrija" o print nem minta no alt.

### B2 — a ordem da voz (decisão do dono, NÃO reabra)
Sequência real: **enviar amostras → verificação por voz → treinamento → pronta.**
Em `prints.ts`, no array `voz`:
1. Nova ordem: `voz-minha-voz` → `voz-clone-de-voz` → **`voz-pendente`** →
   `voz-verificar`. O pendente é o ESTADO logo depois do envio ("Verificação
   pendente", botão "Concluir verificação"); o verificar é a AÇÃO que resolve o
   pendente e libera o treinamento. O dono: "o print de verificação pendente aparece
   depois do envio".
2. `voz-minha-voz.legenda` hoje conta 3 etapas SEM a verificação → reescreva com as
   4, na ordem da régua acima.
3. `voz-verificar.legenda` hoje abre com "Antes de treinar…" → reescreva: a
   verificação vem DEPOIS do envio das amostras, e só depois dela o treinamento
   começa e a voz é liberada.
4. `voz-pendente.legenda` ajustada à nova posição (é o que você vê logo após enviar).

### C — a REVERSÃO do par trava/destrava (arquitetura decidida pelo GESTOR)
1. **`maquina.ts`**: o tipo de etapa `destrava` MORRE, e com ele `destravaDe`, o
   campo `comDestrava` do tipo `item` e o caso `destrava` de `podeAvancarDaEtapa`.
   Item obrigatório SEMPRE trava na tela dele (`marcadas.includes(regra.id)`), como
   na v4. `etapaDeRetomada` continua caindo no primeiro `item` não marcado.
2. **Informativa ENSANDUICHADA não renderiza.** Os convites fixam a versão
   (`publico.ts:129` monta a versão do convite) — cliente com convite da v5 vai ver
   os dados da v5 (com GA-1P..8P) para sempre. Regra nova de derivação em capítulo
   COM obrigatórias: o respiro é a série FINAL de informativas (as de `ordem` maior
   que a última obrigatória — GA-9 continua sendo o interlúdio); informativa no MEIO
   (as GA-nP da v5) **não vira etapa nenhuma**. Sem isso, as 8 "Pode" da v5
   empilhariam no respiro = a parede que o dono reprovou. Capítulo SEM obrigatória
   (cartões) não muda: toda regra vira cartão.
3. **`Aceites.tsx`**: `TelaDaDestrava` e `MetadeDoPar` morrem. `ConfirmacaoDoItem`
   perde a prop `texto` (só a destrava a usava). **Enxugamento do TelaDoItem**
   (decisão do dono: "só o cartão da regra + Li, concordo + botões"): removem-se
   `PorQueProtege` (a revelação "Por que isso protege você" + "Na prática") e
   `AvisoCritico`. FICAM: `MiniCena` (ilustração — o dono elogiou as cenas),
   `Posicao`/trilha (orientação "Item n de 8", não é texto do passo), `Fio`, título,
   instrução e a confirmação. `Interludio`/`NotaDeAlivio` (o Respire do GA-9) ficam
   como estão — o dono não os flagrou.
4. **`Capitulo.tsx`**: caso `destrava` sai do `switch` de `CorpoDaEtapa` e de
   `rotuloDoAvanco` ("Ver o que isso libera →" morre; item volta a "Próximo item →"
   / "Continuar →"). `CartaoDeLeitura` (caps 1–3, "Por que isso importa") fica
   INTACTO — o enxugamento é só do cap. 4.
5. **Contrato do aceite INTOCADO**: `montarPedidoConcluir`, `podeAvancarDa`,
   `impedimentosDoAceite`, `marcadasCanonicas` não mudam. Não toque
   `src/manual/servidor/**` — o comprovante tem que sair byte a byte igual.

### Seed v6 — os dados acompanham a tela (`supabase/manual-seed-v6.sql`, NOVO)
Copie o esqueleto do `manual-seed-v5.sql`: guarda de idempotência por `numero = 6`,
`nova := manual_criar_rascunho(v5, null)`, e o corpo é **SÓ deletar as 8 informativas
`GA-1P`..`GA-8P`** da seção garantia do rascunho, e publicar no fim. Nenhum INSERT em
`manual_regras`, nenhuma mudança de texto ou ordem nas obrigatórias (as ordens em
dezenas da v5 FICAM — mexer nelas é risco sem ganho). **NÃO aplique no banco** — o
arquivo é o entregável; quem aplica é a sessão principal, na integração. Seeds v1–v5
já aplicados: não os edite.

### Testes
`maquina.test.ts` e `telas.test.tsx` têm describes inteiros do par trava→destrava
(fixtures `GARANTIA_V5`/`GARANTIA_COM_PAR` com `g1p`/`ga1p`) — eles descrevem o mundo
que você está matando; reescreva-os para o mundo novo. Testes que não podem faltar:
- informativa ensanduichada (fixture tipo v5) NÃO vira etapa; o respiro só tem a
  série final (GA-9); a contagem de telas da garantia-v5 bate com a da v4;
- item obrigatório trava até marcar, SEMPRE — não existe mais `comDestrava`;
- retomada cai no primeiro item não marcado, com fixture v5;
- prints: nomes `-v2`, `width="960"`, a NOVA ordem da voz (pendente antes de
  verificar), alt nunca vazio (adapte os describes existentes — a estrutura deles é
  boa, os dados é que mudaram);
- tela do item NÃO contém "Por que isso protege você" nem "Este item, descumprido"
  (o assert de `AvisoCritico` na linha ~348 de telas.test.tsx inverte de sentido);
- `previa.test.tsx` (admin) está no escopo SÓ se quebrar — pode precisar de ajuste de
  índice de etapa; não afrouxe as asserções de segurança (prévia sem botão de
  concluir continua provada). Se não precisar, não toque.
Fixtures e `renderToStaticMarkup`, SEM clique — como os testes atuais fazem.

### Armadilhas do repo (já morderam)
**pnpm**, não npm · `.focus(` só com `{ preventScroll: true }` · `tailwind.config.js`
e `index.css` INTOCÁVEIS · opacidade fora da escala de 5 só `[0.78]` · classe nunca
montada por template string · StrictMode roda efeito 2× · caminho de asset sempre
literal, nunca template.

### INTOCÁVEIS
`src/manual/cenas/**` (track B está lá — importar pode, editar não), `pecas.tsx`,
`Fluxo.tsx`, `Leitura.tsx`, `Abertura.tsx`, `Revisao.tsx`, `Termos.tsx`,
`Conclusao.tsx`, `Estados.tsx`, `Identificacao.tsx`, `Previa.tsx`, `formato.ts`,
`memoria.ts`, `api.ts`, `src/manual/servidor/**`, `src/manual/admin/**` fora do
`previa.test.tsx`, `tipos.ts`, `api/**`, `public/**` (o prelude já cuidou dos
arquivos), `index.css`, `tailwind.config.js`, `package.json`, seeds v1–v5,
`manual.sql`, `schema.sql`. Precisou tocar → **PARE e reporte.**

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT. Sem `any`, sem `@ts-ignore`, sem
dependência nova. Atualize os comentários de bloco dos arquivos que mexer — eles
narram decisões, e um comentário contando o par trava/destrava em cima do código que
o removeu é mentira documentada.

## A TASK
1. `prints.ts`: `src` → `-v2.avif`, `largura: 960`, alturas reais via sips; legendas
   B1; ordem e legendas B2.
2. `maquina.ts`: morte do tipo `destrava` e de `comDestrava`; informativa
   ensanduichada some; respiro = série final.
3. `Aceites.tsx` + `Capitulo.tsx`: telas sem par, item enxuto com a caixa de volta.
4. `supabase/manual-seed-v6.sql`: rascunho da v5 sem as GA-nP, publica, guarda n=6.
5. Testes: `maquina.test.ts`, `telas.test.tsx` (e `previa.test.tsx` só se quebrar).

## SCOPE
- src/manual/publico/maquina.ts
- src/manual/publico/maquina.test.ts
- src/manual/publico/Aceites.tsx
- src/manual/publico/Capitulo.tsx
- src/manual/publico/prints.ts
- src/manual/publico/telas.test.tsx
- src/manual/admin/previa.test.tsx
- supabase/manual-seed-v6.sql

## DEPENDS ON
Prelude de assets commitado em `feat/manual-correcao` (o STEP 0 confirma os 8 `-v2`).
A track B (`track/manual-correcao-cenas`) roda em paralelo em `cenas/` — integração
no merge serial, não aqui.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline do main (**358/358**), testes novos
  desta track inclusos
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-correcao...HEAD` — TODO arquivo listado
  pertence ao SCOPE, e estão presentes: maquina.ts, maquina.test.ts, Aceites.tsx,
  Capitulo.tsx, prints.ts, telas.test.tsx, supabase/manual-seed-v6.sql
- `grep -rin "destrava" src/manual/publico/ src/manual/admin/` = vazio (a reversão
  morreu de verdade — código, testes e comentários)
- `grep -rn "O que muda para você\|Ver o que isso libera" src/manual/` = vazio
- `grep -c '\-v2\.avif' src/manual/publico/prints.ts` = 8 ·
  `grep -c 'largura: 960' src/manual/publico/prints.ts` = 8
- `for p in $(grep -oE '/manual/prints/[a-z0-9-]+\.avif' src/manual/publico/prints.ts); do test -f "public$p" || echo "FALTA $p"; done` = vazio
- `grep -n "não trava\|deixa seguir\|Antes de treinar" src/manual/publico/prints.ts` = vazio
- `grep -n 'width="1400"' src/manual/publico/telas.test.tsx` = vazio
- `grep -n "numero = 6" supabase/manual-seed-v6.sql` presente ·
  `grep -cE "'GA-[1-8]P'" supabase/manual-seed-v6.sql` = 8 (o delete nomeia os 8) ·
  `grep -in "insert into public.manual_regras" supabase/manual-seed-v6.sql` = vazio
- `git diff origin/feat/manual-correcao...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio

## COMMIT + PUSH
`fix(manual): reversão do par trava/destrava, prints 960 single-item e a régua certa
nas legendas` → `git push -u origin track/manual-correcao-fluxo`. **NÃO mergeie. NÃO
aplique seed no banco.**
Report: sumário + verdict READY/NOT READY + saída colada do VERIFY + **tabela de copy
ANTES → DEPOIS** (as 8 legendas, a ordem da voz, e a lista do que SAIU da tela do
item — mini-cena e trilha ficaram, revelação e aviso saíram) — é com isso que o dono
decide o gate. Merge/deploy/seed/LIVE são do GESTOR.
