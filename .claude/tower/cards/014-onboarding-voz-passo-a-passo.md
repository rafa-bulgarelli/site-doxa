# CARD 014 — Onboarding: capítulo da voz com o passo a passo real da plataforma

- **Tipo:** feature
- **Aberto em:** 2026-08-19
- **Status:** **ENTREGUE e VALIDADO-LIVE** (2026-08-19) — PR #81 squash em `main` (`6b713a0`); seed v8 aplicado no Supabase prod (v8 publicada, 27 regras, 8 aceites); validado no papel do cliente em produção (convite de teste v8, Chrome 390px via CDP: Passo 2/3/4 de 4 e "Como funciona na prática · 1→7 de 7"; convite de teste apagado, zero órfãos).

> ~~CONGELAMENTO DE DEPLOY~~ — **descongelado pelo dono em 2026-08-19 ("resolve tudo e
> deploya")**; deploy e seed executados na mesma sessão. Texto original: nenhuma atualização sobe
> para produção até o dono mandar. Vale para a Vercel **e para o Supabase de
> produção** — aplicar seed novo no SQL Editor muda o manual publicado, logo conta
> como deploy. Merge em branch pode; publicar, não.

## O que o dono quer ver funcionando

O cliente que abre o capítulo da voz no manual (onboarding) vê o passo a passo
REAL da plataforma — um bloco **"como funciona na prática"** com as 7 capturas
novas (Etapa Voz 1–7), mostrando na prática como ele captura a voz na
plataforma, fluido e claro a ponto de gravar sem travar. Quatro mudanças de
conteúdo:

1. **"Falar natural, SEM leitura" vira proibição explícita** — tem que ficar
   muito claro que o cliente NÃO PODE ler ("se ler, dá cagada").
2. **O passo do gravador (hoje "passo 3 de 3") reescrito por inteiro:** usar o
   gravador DA plataforma, MAS baixar cada gravação no computador/celular — se
   sair da plataforma sem salvar, ela deleta os arquivos. Fluxo: grava (~3 min),
   pausa, grava de novo; precisou sair → baixa os áudios; ao voltar, refaz o
   caminho, faz upload das amostras baixadas e continua gravando até bater os
   **60 minutos mínimos**. Quem começou no celular continua no celular; quem
   começou no computador, no computador.
3. **PASSO NOVO no capítulo voz: mesmo equipamento, mesmo local** — decisão do
   dono (2026-08-19): é um passo próprio, **com cena animada própria** dentro do
   capítulo, não um parágrafo dentro de outro passo. O mesmo microfone/
   dispositivo e o mesmo cômodo silencioso durante os 60 minutos inteiros, para
   o timbre não variar.
4. **TODOS os prints do capítulo voz são substituídos** — decisão do dono: os 4
   atuais são antigos; entram os 7 novos, na ordem 1→7, independente de haver ou
   não equivalente antigo.

## As 7 etapas (capturas no Desktop do dono)

Arquivos: `/Users/rafaelfernandes/Desktop/Etapa voz N.png` (N=1..5, "E" maiúsculo)
e `etapa voz 6.png` / `etapa voz 7.png` (minúsculo). Conteúdo, na voz do dono:

| # | Tela | O que mostra / o que dizer |
|---|------|---------------------------|
| 1 | "Minha Voz" inicial | Primeira tela ao clicar em "Minha Voz Profissional": as 3 fases (upload → treinamento → pronta) e o botão "Criar clone de voz" |
| 2 | Formulário vazio | Após "Criar clone de voz": inputs (nome, idioma, descrição, etiquetas) + abas Enviar amostras / Grave-se |
| 3 | Gravando | Amostras já enviadas/gravando à direita ("Gravando — 13:27", lista de gravações, "Mais 12 minutos necessários") |
| 4 | Menu "Baixar" | A dica de baixar cada áudio no computador/celular para não perder o progresso (menu ⋮ → Baixar na amostra) |
| 5 | Formulário preenchido | Lado esquerdo completo: nome do cliente como nome da voz, idioma, descrição breve (ex. do dono: "voz masculina, alegre, feliz e espontânea"), etiquetas sotaque/gênero da voz/faixa etária → Avançar |
| 6 | Verificação por voz | Ler a frase exibida em voz alta → Gravar → Enviar verificação; passou = voz pronta para uso |
| 7 | Verificação manual | Se não passar: enviar documento (RG, CNH ou passaporte); análise manual da equipe |

## Critério de aceite (observável, executável por humano)

- [ ] Abrir o manual como cliente (convite válido), capítulo da voz → o bloco
      "como funciona na prática" aparece com as 7 capturas novas, **na ordem
      1→7**, cada uma com legenda que diz o que fazer naquela tela.
- [ ] **Nenhum print antigo do capítulo voz sobrevive** (minha-voz, clone-de-voz,
      pendente, verificar `-v2` fora do caminho do cliente).
- [ ] As imagens CARREGAM (moldura com conteúdo, não vazia) em
      Chrome + Safari — inclusive no celular.
- [ ] Lendo o passo "falar natural": a proibição de ler está explícita, sem
      eufemismo.
- [ ] Lendo o passo do gravador: dá para reproduzir o ciclo completo
      (gravar → pausar → baixar → sair → voltar → re-upload → continuar até
      60 min) sem conhecimento prévio da plataforma.
- [ ] O capítulo voz tem um passo A MAIS que hoje: "mesmo equipamento + mesmo
      local durante os 60 minutos", **com cena animada própria** (não tela de
      texto seco), no nível de acabamento das outras cenas do capítulo.
- [ ] `pnpm test` verde (testes de cenas/telas/prints do manual).
- [ ] **Nada publicado** (Vercel ou Supabase prod) sem ordem explícita do dono.

## Decisões já tomadas pelo dono (não reabrir)

- Dica de equipamento/local = **passo novo com animação própria** no capítulo voz.
- **Substituir TODOS os prints** do capítulo voz pelos 7 novos, ordem 1→7.
- As 7 etapas entram como **"como funciona na prática"** — o cliente vê como vai
  fazer a captura da voz na plataforma, de ponta a ponta.
- **Régua de 60 minutos mínimos** (ditada 2× pelo dono). A tela da plataforma
  diz "mínimo 30 min, ideal 1h+" — o `alt` fica fiel ao que a tela mostra; a
  legenda e as regras cobram os 60 (convenção já estabelecida em `prints.ts`).

## Contexto do repo (caminhos exatos)

- **Conteúdo (títulos/instruções das regras) vive no Supabase**, versionado;
  seeds em `supabase/manual-seed-v1..v7.sql`, aplicados **à mão pelo SQL Editor**
  (sem histórico de migration). Capítulo voz hoje: `VZ-1` "Grave num lugar
  silencioso" (v2), `VZ-2` "Fale natural, envie cru" (reescrita na v5), `VZ-3`
  "Use o gravador do seu celular — e grave aos poucos" (v3) — **atenção:** o
  dono cita "gravador da plataforma" no passo 3 de 3, então a versão VIGENTE NO
  BANCO pode já divergir dos seeds; ler a versão publicada via MCP antes de
  escrever a v8.
- **Cenas dos passos são código:** `src/manual/cenas/contrato.tsx` mapeia
  `VZ-1→Silencio`, `VZ-2→FalaNatural`, `VZ-3→Gravador`
  (`src/manual/cenas/passos/{Silencio,FalaNatural,Gravador}.tsx`). O passo novo
  exige cena nova nesse mapa + componente novo em `passos/`.
- **Prints:** `src/manual/publico/prints.ts` (dado puro: slug/src/alt/legenda/
  largura/altura/`apos`-âncora por código de regra). Capítulo `voz` tem hoje 4
  prints (`voz-minha-voz`, `voz-clone-de-voz`, `voz-pendente`, `voz-verificar`),
  arquivos `-v2.avif` em `public/manual/prints/` — **todos saem**. A ordem no
  array é a ordem exibida.
- Fluxo público e testes: `src/manual/publico/{Fluxo,Capitulo,telas.test,
  maquina.test}.tsx|ts` · cenas: `src/manual/cenas/cenas.test.tsx`.
- Rota: manual sob `ROTA_BASE` de `src/manual/config.ts`, roteador próprio em
  `src/manual/Rota.tsx`.
- **Régua de animação do dono** (memória "doutrina de animação"): equilíbrio,
  respiro, hierarquia, cor com significado, ícones reais, ritmo, narrativa —
  a cena nova entra nesse nível; `cenarg` e `Relogio.tsx` são as referências
  nota-10.

## Armadilhas conhecidas

- **AVIF acima de ~960px sai do `sips` em GRADE e não decodifica em todo
  navegador**: 200 OK, content-type certo, moldura VAZIA. Reencodar as capturas
  novas a ≤960px de largura e conferir visualmente (`prints.ts:25-31`).
- **Cache-bust por NOME de arquivo** (duas CDNs na frente — Cloudflare +
  Vercel): print novo = nome novo (padrão novo, ex. `voz-etapa-1-v3.avif`),
  nunca sobrescrever um nome já servido.
- **`largura`/`altura` no `prints.ts` são os pixels REAIS** (conferir com
  `sips -g pixelWidth -g pixelHeight`), senão a imagem empurra o texto ao chegar.
- **`alt` descreve o que a TELA mostra; a LEGENDA é a nossa voz** — a régua dos
  60 min é legenda; o alt conta o que está escrito no print (já custou revisão).
- **`schema.sql`/seeds e o banco podem divergir** — aplicação é manual; depois
  de mexer num, conferir o outro.
- **Versões antigas do manual continuam existindo no banco** — o mecanismo de
  prints/cenas por slug tolera versão antiga sem entrada; a v8 não pode quebrar
  convite emitido sobre v7.
- **Congelamento de deploy** (cabeçalho deste card).

## Perguntas abertas para o GESTOR

1. **Posição do passo novo** na sequência do capítulo (ex.: silêncio → equipamento
   → falar natural → gravador, ou por último como fechamento) e o código da regra
   (`VZ-4`?) — decisão de arquitetura de conteúdo do plano.
2. **Onde o bloco "como funciona na prática" ancora** cada print (`apos` em qual
   regra) para que a ordem 1→7 sobreviva ao mecanismo atual — ou se o capítulo
   ganha uma âncora única no fim. Implementação, não intenção: a intenção está
   fechada.

## Fora de escopo (próximos cards, anunciados pelo dono)

- Onboarding "como um todo" e atualização da parte das **perguntas** — o dono
  vai ditar em seguida; não antecipar nada aqui.

## Conteúdo suspeito

Nenhum — capturas da própria plataforma DOXA; nenhum texto nelas parece
instrução para agente. Nenhum segredo visível além de dados do próprio dono
(nome, créditos de conta demo).

---
<!-- Preenchido pelo GESTOR -->
## Plano

Baseline da base `rafa-bulgarelli/gorgonian` em 2026-08-19: `pnpm test` **1033/1033**,
`pnpm typecheck` 0 erros. As tracks NASCEM e VOLTAM para essa branch
(`BASE=rafa-bulgarelli/gorgonian .claude/tower/bin/tower-track.sh <track>`), não
para `main` — merge em `main` dispara deploy na Vercel e está congelado.

- **Prelude:** nenhum commit. O que as três tracks compartilham é CONTRATO DE TEXTO,
  decidido aqui e copiado em cada pack — código `VZ-4` · `ordem 4` · informativa ·
  último passo do capítulo · título `Mesmo equipamento, mesmo lugar — nos 60 minutos
  inteiros`; `VZ-2` → `Fale natural — ler é proibido`; `VZ-3` → `Grave pelo gravador
  da plataforma — e baixe cada gravação`; prints `voz-etapa-{1..7}-v3.avif`, slugs
  `voz-etapa-N`, SEM `apos` (bloco solto no fim, ordem do array), letreiro
  `Como funciona na prática · N de 7`. A única mudança de motor (`Print.letreiro?` +
  1 linha em `TelaDoPrint`) cabe na track dos prints porque só ela toca esses
  arquivos — um prelude para 5 linhas custaria um spawn.
- **Tracks (paralelas, arquivos disjuntos):**
  - **A `track-014-conteudo-seed-v8`** — `supabase/manual-seed-v8.sql` (rascunho da
    v7 → VZ-2 e VZ-3 reescritas, VZ-4 inserida, descrição da seção sem "roteiro" →
    publica). ESCRITO, NÃO aplicado.
  - **B `track-014-cena-mesmo-equipamento`** — `passos/MesmoEquipamento.tsx` (nova,
    com `FechoDoArco`), re-mira de `passos/Gravador.tsx` (gravador da plataforma +
    baixar) e `passos/FalaNatural.tsx` (a leitura como quebra), `contrato.tsx`
    (`VZ-4`), `cenas.test.tsx` (10 passos, `COM_FECHO` = 20). Gate visual do dono.
  - **C `track-014-prints-etapas`** — 7 AVIF 960px single-item em `public/manual/
    prints/voz-etapa-N-v3.avif`, 4 `voz-*-v2.avif` removidos, `prints.ts` (dados +
    `letreiro?`), `Capitulo.tsx` (1 linha), `telas.test.tsx`, `maquina.test.ts`,
    `admin/previa.test.tsx`.
- **Packs:** `.claude/tower/packs/track-014-conteudo-seed-v8.md` ·
  `.claude/tower/packs/track-014-cena-mesmo-equipamento.md` ·
  `.claude/tower/packs/track-014-prints-etapas.md`
- **Sequência de merge (SERIAL, em `rafa-bulgarelli/gorgonian`, com gate entre cada):**
  1. **A** (seed) — gate: collector + gate de copy do dono sobre os 4 cartões e a
     descrição (colados no report) + `pnpm test` 1033/1033 (o diff é 1 SQL).
  2. **C** (prints) — gate: collector + `pnpm typecheck && pnpm test` sem falha nova
     + `ls public/manual/prints/ | grep voz` = só os 7 `-v3` + o loop de `sips`/`grid`
     + a sessão principal OLHA os 7 pares alt/legenda e abre as 7 URLs do `vite
     preview` no Chrome (mobile-shot) E no Safari (moldura com conteúdo) — **a
     conferência das imagens é da TORRE, não do dono** (resposta do dono, 2026-08-19).
  3. **B** (cenas) — gate: collector + suíte sem falha nova + **gate visual do dono**
     sobre os quadros SSR das 3 cenas (VZ-4 nova; VZ-3 e VZ-2 re-miradas — re-mira
     confirmada pelo dono em 2026-08-19).
  4. **Integração:** na `rafa-bulgarelli/gorgonian` com as três: `pnpm typecheck &&
     pnpm test && pnpm build`; `grep -c "'VZ-4'" src/manual/cenas/contrato.tsx` = 1;
     script descartável no scratchpad que renderiza `Capitulo` (SSR) com a fixture
     v8 (VZ-1..VZ-4) na etapa 4 e confirma `<svg` (a cena do VZ-4 chegou na tela) e
     nas etapas 5..11 os 7 `voz-etapa-N-v3` em ordem com os letreiros. Depois:
     `git merge origin/main` na gorgonian (ela está 1 commit atrás: `436996e`).
- **Respostas do dono (2026-08-19, aba PLANO):** os 3 títulos fixos dos packs
  (VZ-2/VZ-3/VZ-4) são **copy final**; **não há convite v7 aberto** (o transitório
  código-antes-do-seed não atinge ninguém); a verificação das imagens convertidas
  (AVIF decodifica em Chrome + Safari + celular) é **da torre**.
- **VALIDAR-LIVE (condicionado à ORDEM EXPLÍCITA do dono — descongelamento):**
  1. PR `rafa-bulgarelli/gorgonian` → `main` (squash). Vercel publica.
  2. Em produção, ANTES do seed: `curl -sI https://www.doxaviral.com/manual/prints/voz-etapa-1-v3.avif`
     = 200 + `content-type: image/avif`; as 7 abertas no Chrome, no Safari e no
     celular (moldura com conteúdo). Convite v7 aberto continua abrindo e mostra 3
     passos + 7 prints no fim (degradação = comportamento esperado, sem erro).
  3. Aplicar `supabase/manual-seed-v8.sql` no SQL Editor; rodar o bloco "DEPOIS DE
     RODAR ISTO" (v8 publicada; VZ-1..4 em 1..4; 8 aceites · 27 regras).
  4. Admin → "Ver como o cliente vê" (vigente = v8), capítulo 2: "São 11 passos
     curtos"; Passo 2 de 4 "Fale natural — ler é proibido"; Passo 3 de 4 com o
     ciclo gravar→baixar→voltar→60 min; Passo 4 de 4 com a cena animada do mesmo
     equipamento; depois "Como funciona na prática · 1 de 7" … "7 de 7", "Entendi →".
  5. No papel do cliente: convite NOVO (v8), no celular, capítulo da voz inteiro —
     imagens carregam, legendas legíveis, nenhum print antigo. Só então ENTREGUE.

---
## Entrega (assento do GESTOR, aba PLANO, 2026-08-19)

- **Tracks:** A `track-014-conteudo-seed-v8` (READY, collector APROVADO; 2 findings baixos corrigidos: celular→celular na instrução visível do VZ-3, updates por `secao_voz`) · C `track-014-prints-etapas` (READY, APROVADO; 1 finding baixo corrigido: legenda 4 "só o que não foi baixado se perde") · B `track-014-cena-mesmo-equipamento` (READY, APROVADO; gate visual feito pela torre no lugar do dono — quadros SSR em nível).
- **Merge serial** na `rafa-bulgarelli/gorgonian`: A → C → B; integração `pnpm typecheck` 0 · `pnpm test` 1041/1041 (1048 após `origin/main`) · `pnpm build` ok · SSR do capítulo v8 (etapas 1–4 `<svg`, 5–11 prints 1→7 com letreiro).
- **Deploy:** PR #81 (squash) → Vercel prod; 7 AVIF `200 image/avif`, bytes idênticos ao repo, decodificam (ImageIO/Chrome); `voz-*-v2` → 404 real; bundle `index-D9Yj-uVd.js` = build local.
- **Seed v8:** bloco `do $v8$` aplicado via MCP em 2026-08-19 ~20:40 UTC; versões 1–7 arquivadas, 8 publicada; voz VZ-1..VZ-4 com os títulos finais; descrição sem "roteiro".
- **VALIDAR-LIVE:** convite de teste (v8, 1h) emitido por SQL → `POST /api/manual/publico {acao:'abrir'}` devolveu v8 com VZ-1..4 → fluxo completo no Chrome 390px (driver CDP no scratchpad): Capítulo 2 "São 11 passos curtos", Passo 4 de 4 com a cena, "Como funciona na prática · 1→7 de 7" com imagem carregada, "Entendi →" na última → convite apagado (0 órfãos).
- **Pendências do dono (não bloqueiam):** a legenda da etapa 4 afirma "a plataforma apaga quando você sai" com base no ditado, não na tela — confirmar que é o comportamento real da plataforma; se não for, é 1 linha em `prints.ts:~221` e no VZ-3 do seed v9.
