# Card 014 — Track A: o capítulo da voz reescrito, como seed v8 (task_014_conteudo_seed_v8)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-014-conteudo-seed-v8`,
branch **`track-014-conteudo-seed-v8`** (JÁ criada pelo `tower-track.sh` a partir da
base **`rafa-bulgarelli/gorgonian`** — NÃO é main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-014-conteudo-seed-v8` · `git status --porcelain`
vazio · `git merge-base --is-ancestor rafa-bulgarelli/gorgonian HEAD && echo base-ok` =
`base-ok` · `ls supabase/manual-seed-v7.sql` existe e `ls supabase/manual-seed-v8.sql`
NÃO existe · você está na worktree, não no repo principal. Divergiu → **PARE e
reporte** (não conserte por conta própria: na branch errada, outra track pode estar nela).

> **CONGELAMENTO DE DEPLOY (ordem do dono, 2026-08-19).** Este arquivo é ESCRITO no
> repo e NÃO é aplicado. Você não tem, não pede e não usa credencial do Supabase.
> Aplicar seed no SQL Editor muda o manual publicado = deploy = proibido até o dono
> mandar. Quem aplica, quando ele mandar, é a sessão principal.

## A VISÃO DO DONO (brief `.claude/tower/briefs/014-onboarding-voz-ditado-do-dono.md`)
O cliente que lê o capítulo "A sua voz" no onboarding sai sabendo fazer a captura na
plataforma sem travar. Quatro coisas, nas palavras dele:
- "falar natural, sem leitura. Aí, **proibido ler**: tem que deixar muito claro que é
  proibido para o cliente ler. Se não dá cagada".
- "nesse passo 3 de 3 … usar o **gravador da plataforma** e salvar os arquivos no
  celular/computador, para que o progresso não seja perdido. … grave pela plataforma
  os três minutinhos, pausa, grava de novo, pausa. Precisa sair da plataforma. Se ele
  não salvar os áudios, a plataforma deleta esses arquivos. Então ele salva … volta …
  faz todo o caminho de novo … faz o upload do arquivo dentro da plataforma e volta a
  gravar **até bater os 60 minutos mínimos**".
- "Se você começou a gravar pelo celular, continuará gravando pelo celular. Se você
  gravar pelo computador, você continua gravando pelo computador."
- passo NOVO: "usar o **mesmo equipamento** … durante todos os 60 minutos de áudio,
  para você não ter diferença entre o seu timbre … continue gravando 60 minutos no
  **mesmo lugar**, no mesmo quarto, no mesmo escritório, no mesmo computador, no mesmo
  celular, em um lugar silencioso".

## CONTEXTO (não perca tempo redescobrindo)
- **O texto do manual vive no Supabase, versionado.** O repo guarda os seeds
  (`supabase/manual-seed-v1..v7.sql`), aplicados à mão no SQL Editor; não há migration.
  Uma versão nova nasce SEMPRE pelo mesmo caminho (leia `manual-seed-v7.sql` inteiro —
  é o seu molde, linha por linha): `do $vN$ … if exists (numero = N) return … select
  origem (numero = N-1) … nova := manual_criar_rascunho(origem, null) … edições no
  rascunho … manual_publicar_versao(nova.id)`. Convite novo nasce na versão publicada;
  convite aberto fica preso à versão em que nasceu (v7 hoje).
- **O capítulo da voz na v7** (composição de v2 + v3 + v5; `slug = 'voz'`, seção
  `ordem 2`, descrição "A plataforma clona a sua voz a partir de uma gravação sua. Não
  precisa de estúdio — precisa de silêncio e naturalidade. Siga o roteiro e a duração
  que a plataforma pedir."):
  - `VZ-1` ordem 1 — "Grave num lugar silencioso" (v2). **Não muda.**
  - `VZ-2` ordem 2 — "Fale natural" (reescrita na v5): instrução fala de "celular
    sempre à mesma distância" e "nada de aplicativo de melhorar áudio"; o **exemplo
    diz "Leia como se explicasse para um cliente…"** — isto agora CONTRADIZ o dono.
  - `VZ-3` ordem 3 — "Use o gravador do seu celular — e grave aos poucos" (v3):
    "30 minutos e 2 horas", "gravador nativo do seu celular". Reescrita INTEIRA.
  - Não existe `VZ-4`. A ordem 4 está vaga.
- **Colunas e limites** (`supabase/manual.sql`): `codigo ~ '^[A-Z0-9]+(-[A-Z0-9]+)*$'`,
  `titulo` 2–200 chars, `instrucao` 2–4000, `porque`/`exemplo` ≤ 4000, `severidade in
  ('normal','critica')`, `obrigatoria boolean`, `ordem int >= 0`, `unique (secao_id,
  codigo)`. `manual_publicar_versao` recusa versão sem obrigatória (a garantia continua
  com as 8) e obrigatória em `termos`.
- **O contrato deste card (decidido pelo GESTOR — vale para as três tracks, NÃO
  reabra):**
  - `VZ-4` · `ordem 4` · `obrigatoria false` · `severidade 'normal'` · título EXATO:
    **`Mesmo equipamento, mesmo lugar — nos 60 minutos inteiros`**. É o ÚLTIMO passo
    do capítulo (fechamento), não vai entre VZ-1 e VZ-2: só faz sentido depois do
    ciclo "sair e voltar" do VZ-3, e acrescentar no fim não toca linha existente (o
    mesmo padrão do `ON-0` da v7).
  - `VZ-2` título EXATO: **`Fale natural — ler é proibido`**.
  - `VZ-3` título EXATO: **`Grave pelo gravador da plataforma — e baixe cada gravação`**.
  - Os títulos são fixos porque a track das cenas narra a regra por eles e a track dos
    prints cita o capítulo por eles. Instrução, porquê e exemplo são seus.
  - Os 7 prints "Como funciona na prática" entram pelo código (`src/manual/publico/
    prints.ts`, outra track) e caem no FIM do capítulo — o seed não os conhece.
- **A régua é 60 minutos mínimos** (ditada 2× pelo dono). A plataforma diz "mínimo 30
  min, ideal 1 h+" na tela — isso é assunto do `alt` dos prints (outra track). No seed,
  a voz é a NOSSA: 60.
- **A descrição da seção também muda** (decisão do GESTOR): "Siga o roteiro e a duração
  que a plataforma pedir" contradiz "ler é proibido". Reescreva a `descricao` da seção
  `voz` no rascunho (`update public.manual_secoes set descricao = … where versao_id =
  nova.id and slug = 'voz'`) sem "roteiro", com a promessa do capítulo e os 60 minutos.
- **Seeds e banco podem divergir** (aplicação manual). A sessão principal pode colar
  abaixo o que está publicado; se não colar, assuma os seeds — seus `update … where
  codigo = 'VZ-2'/'VZ-3'` sobrescrevem o texto inteiro, então o texto anterior não
  importa, e a vaga da `ordem 4` é conferida pelo próprio SQL (`raise exception` se
  ocupada).

### O QUE ESTÁ NO BANCO (v7 publicada — a sessão principal cola aqui antes de spawnar; opcional)
<!-- select r.codigo, r.ordem, r.titulo, r.instrucao, r.porque, r.exemplo
       from public.manual_regras r join public.manual_secoes s on s.id = r.secao_id
       join public.manual_versoes v on v.id = s.versao_id
      where v.numero = 7 and s.slug = 'voz' order by r.ordem;  -- leitura, via MCP -->
Lido via MCP em 2026-08-19 (v7 publicada em 2026-08-17 19:56 UTC) — **igual aos seeds**:
- `secao.descricao` (voz): "A plataforma clona a sua voz a partir de uma gravação sua. Não precisa de estúdio — precisa de silêncio e naturalidade. Siga o roteiro e a duração que a plataforma pedir."
- **VZ-1** (ordem 1) "Grave num lugar silencioso" · instrução "Nada de eco, música, rua, ventilador ou outras vozes no fundo." · porquê "O clone aprende com TUDO que estiver no áudio — ruído entra no aprendizado e suja a voz de todos os vídeos." · exemplo "Quarto fechado, longe da janela, ar-condicionado desligado. Um guarda-roupa aberto por perto mata o eco." — **não muda**.
- **VZ-2** (ordem 2) "Fale natural" · instrução "Voz de conversa, ritmo normal, celular sempre à mesma distância. Nada de aplicativo de \"melhorar áudio\": a gravação vai do gravador direto para a plataforma." · porquê "O clone reproduz o que ouve — gravação forçada vira voz forçada, e qualquer processamento apaga justamente o que ele precisa aprender." · exemplo "Leia como se explicasse para um cliente na sua frente: sem voz de locutor, sem pressa." ← **o exemplo manda LER; sai**.
- **VZ-3** (ordem 3) "Use o gravador do seu celular — e grave aos poucos" · instrução "O material todo fica entre 30 minutos e 2 horas de áudio — ninguém fala isso de uma vez. Abra o gravador nativo do seu celular, grave um trecho, pare, respire, grave de novo. Vários arquivos curtos servem perfeitamente." · porquê "Gravando em momentos diferentes, a sua voz chega com entonações e emoções variadas — e o clone aprende uma voz mais rica e natural. E para você é muito mais leve do que uma maratona." · exemplo "Grave 10 minutos hoje de manhã, mais 15 à tarde, mais um pouco amanhã. Junte os arquivos e envie todos — não precisa emendar nada." ← **reescreve inteiro** (gravador DA plataforma, baixar, sair/voltar/re-upload, 60 min).
- Não existe VZ-4 na v7 (vaga `ordem 4` livre).

### Armadilhas
- **SQL só — nenhum arquivo de código, nenhum teste, nenhum doc.** Se achar que algo
  no código precisa mudar por causa do texto, PARE e reporte (é de outra track).
- **Nada de `delete`.** A v8 só `update` (VZ-2, VZ-3, descrição da seção) e `insert`
  (VZ-4). A garantia, o onboarding, o clone e os termos saem do rascunho idênticos.
- **Aspas simples dobradas** dentro de literal SQL (`'não é "melhorar" áudio'` pode;
  apóstrofo vira `''`). Sem `$$` aninhado além do `$v8$` do bloco.
- **Acentos e travessão (—) em UTF-8 normal**, como os seeds anteriores.
- **"Ler" aparece como PROIBIÇÃO, nunca como instrução.** Varra o texto novo de VZ-2 e
  do exemplo: "Leia", "leia o roteiro", "lendo" só se for para dizer que não. A frase
  de VERIFICAÇÃO por voz (a plataforma pede para ler UMA frase curta no fim) é a única
  leitura permitida e é assunto da legenda do print 6 (outra track) — você pode citá-la
  no porquê do VZ-2 para o cliente não achar que a verificação quebra a regra
  ("a única leitura é a frase curta da verificação, no fim").
- **Cabe na tela do celular.** Cada campo é UM cartão (`CartaoDeLeitura`): título
  grande, instrução em 1–3 frases, porquê e exemplo atrás de "Por que isso importa".
  O ciclo do gravador precisa ser reproduzível SEM conhecimento prévio, mas em
  instrução curta + exemplo em passos numerados (ex.: "1. grave uns 3 minutos e pare.
  2. …"). Sem parede de texto.
- Estilo dos comentários: em PT, narrando o PORQUÊ (leia o cabeçalho da v7: "POR QUE
  UMA V8", "o que este arquivo NÃO faz").

## A TASK
1. Criar `supabase/manual-seed-v8.sql` no molde da v7 (cabeçalho "POR QUE UMA V8" com o
   ditado do dono resumido; bloco `do $v8$`; guarda `numero = 8`; origem `numero = 7`;
   `manual_criar_rascunho(origem, null)`; `select id into secao_voz … slug = 'voz'` com
   `raise exception` se nula; conferência de `ordem = 4` vaga com `raise exception`;
   as edições; `manual_publicar_versao(nova.id)`; bloco final "DEPOIS DE RODAR ISTO,
   confira" com os selects e os números esperados).
2. `update` VZ-2: título `Fale natural — ler é proibido`; instrução que abre com a
   proibição sem eufemismo ("Não leia. Nada de texto, roteiro ou anotação na frente…")
   e mantém o que já valia (voz de conversa, ritmo normal, microfone sempre à mesma
   distância — neutro quanto a celular/computador —, nenhum aplicativo de melhorar
   áudio); porquê (o clone reproduz o que ouve; leitura vira voz de leitura em todos
   os vídeos; processamento apaga o que ele precisa aprender); exemplo SEM "leia"
   (ex.: "Fale como se explicasse o seu negócio a um cliente na sua frente…").
3. `update` VZ-3: título `Grave pelo gravador da plataforma — e baixe cada gravação`;
   instrução com o ciclo completo: gravar pela aba "Grave-se" da plataforma uns 3
   minutos → pausar → gravar de novo; ao precisar sair, BAIXAR cada gravação no
   computador ou no celular (menu ⋮ → Baixar) porque a plataforma apaga o que não foi
   salvo; ao voltar, refazer o caminho (Minha Voz Profissional → Criar clone de voz),
   enviar as amostras baixadas em "Enviar amostras" e continuar gravando até os **60
   minutos mínimos**; quem começou no celular segue no celular, quem começou no
   computador segue no computador. Porquê: progresso perdido é hora de voz jogada
   fora; vários trechos curtos em momentos diferentes dão uma voz mais rica. Exemplo em
   passos numerados, reproduzível.
4. `insert` VZ-4 (`secao_voz`, `'VZ-4'`, `'Mesmo equipamento, mesmo lugar — nos 60
   minutos inteiros'`, instrução: o mesmo microfone/aparelho e o mesmo cômodo
   silencioso do primeiro ao último minuto, mesmo que grave em dias diferentes; porquê:
   aparelho ou lugar diferente muda o timbre, e o clone aprende uma voz que não é uma
   só; exemplo: "Gravou a primeira parte no escritório, pelo notebook? As outras
   também — mesma sala, mesmo notebook, mesma distância."; `'normal'`, `false`, `4`).
5. `update` da `descricao` da seção `voz` no rascunho: sem "roteiro"; com silêncio,
   naturalidade, o gravador da plataforma e os 60 minutos.
6. Bloco "DEPOIS DE RODAR ISTO" com: `select numero, status … order by numero` (v1..v7
   arquivadas · v8 publicada); o select das regras da voz na v8 (VZ-1 1 · VZ-2 2 ·
   VZ-3 3 · VZ-4 4, todas `false`, sem empate de ordem); a conta (8 aceites · 27 no
   total = 26 da v7 + VZ-4); e o que se vê na tela com convite novo (capítulo 2: "São
   11 passos curtos" — 4 passos + 7 prints —, Passo 4 de 4 com a cena nova, depois
   "Como funciona na prática · 1 de 7" … "7 de 7").

## SCOPE
- supabase/manual-seed-v8.sql

## DEPENDS ON
nada (base `rafa-bulgarelli/gorgonian`). As outras duas tracks (cenas, prints) rodam
em paralelo e não tocam este arquivo.

## VERIFY (pass/fail executável — cole a saída no report)
- `git diff --name-only rafa-bulgarelli/gorgonian...HEAD` = exatamente
  `supabase/manual-seed-v8.sql`
- `grep -c "numero = 8" supabase/manual-seed-v8.sql` ≥ 1 e
  `grep -c "numero = 7" supabase/manual-seed-v8.sql` ≥ 1 (guarda + origem)
- `grep -c "manual_criar_rascunho" supabase/manual-seed-v8.sql` = 1 e
  `grep -c "manual_publicar_versao" supabase/manual-seed-v8.sql` = 1
- `grep -c "^\s*delete" supabase/manual-seed-v8.sql` = 0
- `grep -c "'VZ-4'" supabase/manual-seed-v8.sql` ≥ 2 (o insert + o select de conferência)
- `grep -c "Mesmo equipamento, mesmo lugar — nos 60 minutos inteiros" supabase/manual-seed-v8.sql` ≥ 1
- `grep -c "Fale natural — ler é proibido" supabase/manual-seed-v8.sql` ≥ 1
- `grep -c "Grave pelo gravador da plataforma — e baixe cada gravação" supabase/manual-seed-v8.sql` ≥ 1
- `grep -ci "proibido" supabase/manual-seed-v8.sql` ≥ 2 (título + instrução)
- `grep -c "60 minutos" supabase/manual-seed-v8.sql` ≥ 3 (VZ-3, VZ-4, descrição)
- `grep -n "Leia como\|leia o roteiro\|Siga o roteiro" supabase/manual-seed-v8.sql` = vazio
- `grep -c "ordem = 4" supabase/manual-seed-v8.sql` ≥ 1 (a conferência da vaga)
- `grep -c "slug = 'voz'" supabase/manual-seed-v8.sql` ≥ 2 (seção + descrição)
- `awk '/^do \$v8\$/,/^\$v8\$;/' supabase/manual-seed-v8.sql | grep -c "begin\|end;"` ≥ 2
  (o bloco abre e fecha)
- `file supabase/manual-seed-v8.sql` contém `UTF-8`
- `pnpm typecheck` = 0 erros e `pnpm test` = 1033 passed (você não tocou código — a
  suíte é a prova de que o diff é só o SQL)
- Cole no report o texto final dos 4 cartões (título · instrução · porquê · exemplo) e
  a descrição nova — é a peça do gate de copy do dono.

## COMMIT + PUSH
`feat(manual #014): seed v8 — voz sem leitura, gravador da plataforma com baixar, e o
passo do mesmo equipamento` → `git push -u origin track-014-conteudo-seed-v8`.
**NÃO mergeie. NÃO aplique no Supabase.** Report: sumário + verdict READY/NOT READY +
VERIFY colado + os textos. Merge/aplicação/LIVE são do GESTOR, sob ordem do dono.
