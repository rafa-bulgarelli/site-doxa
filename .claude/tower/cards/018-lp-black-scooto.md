# CARD 018 — LP Black Scooto: Figma → HTML para widget Elementor

- **Tipo:** feature
- **Aberto em:** 2026-09-01
- **Status:** planejado (plano do GESTOR abaixo; aguardando execução)

## O que o dono quer ver funcionando

A landing page "LP BLACK — Scooto" que existe no Figma, publicada no WordPress da
Scooto dentro de um widget do Elementor, **pixel perfect** em desktop. Botões/CTAs
levam ao formulário da própria página; quem preenche e envia tem a submissão **salva
no WordPress** (área de submissões do Elementor) e **captada pelo hook do Intercom já
instalado no site** (vira contato + ticket no Intercom). Imagens hospedadas num repo
público do GitHub (`raw.githubusercontent.com`), para a página ficar autocontida.

## Critério de aceite (observável, executável por humano)

- [ ] Abrir a URL publicada no WordPress em desktop (~1440px) → visual idêntico ao
      frame do Figma (comparação lado a lado: tipografia Sora, cores, espaçamentos,
      imagens). Zero JavaScript no bloco HTML.
- [ ] Todas as imagens carregam de URLs `raw.githubusercontent.com` de repo público —
      nenhum asset quebrado, nenhuma referência local.
- [ ] Clicar em qualquer CTA da página → chega ao formulário (âncora/rolagem).
- [ ] Preencher o formulário (nome, e-mail, WhatsApp, cargo, empresa, site) e enviar →
      confirmação visível na tela **e** a submissão aparece em wp-admin → Elementor →
      Submissions, identificada pelo nome do formulário (ver pergunta 5).
- [ ] O mesmo envio dispara o hook do Intercom: contato criado/atualizado + ticket
      "Novo lead da LP - <nome>" no Intercom com os 6 campos e as UTMs.
- [ ] Abrir a ~390px (viewport mobile emulado) → sem rolagem horizontal, conteúdo
      legível. Não há frame mobile no Figma; a adaptação é nossa, sem fidelidade
      exigida — só dignidade.
- [ ] Import da fonte Sora (Google Fonts) presente no próprio bloco (reforço; o tema
      já a carrega segundo o dono).

## Contexto do repo (caminhos exatos)

- Demanda **externa ao site-doxa**: nada em `src/` é relevante. O que serve daqui:
  - `.claude/tower/bin/mobile-shot.mjs` — verificação mobile (viewport real, não
    `--window-size` do Chrome headless).
- **Figma (fonte da verdade visual):**
  `https://www.figma.com/design/0wu66LVRV9sntibU4BV36V/LP-BLACK---Scooto?node-id=1-3`
  — ler via MCP do Figma (`get_design_context` / `get_screenshot`). Só existe layout
  desktop.
- **Contrato imposto pelo hook Intercom já instalado no WP da Scooto** (PHP em
  `elementor_pro/forms/new_record`, transcrito SEM o token — ver Conteúdo suspeito):
  - Dispara **apenas para formulário do Elementor Pro** — `<form>` HTML puro NÃO é
    captado. Ele hoje capta TODOS os forms Elementor do site, sem filtro por nome.
  - IDs de campo exigidos, exatos: `name` · `email` · `phone` · `cargo` · `empresa`
    · `site` (custom IDs no Elementor).
  - `phone`: o hook limpa não-dígitos e prefixa `+55` — o campo pode aceitar máscara.
  - UTMs vêm dos cookies `last_pys_utm_*` (PixelYourSite) — nada a fazer no HTML,
    apenas não interferir.
  - Ticket Intercom `ticket_type_id 4567895`; e-mail de debug do hook:
    `analu@scooto.co`.
- **Imagens:** dono autorizou repo qualquer, público, fora do site-doxa.

## Armadilhas conhecidas

- Nenhuma da seção "Armadilhas" do CLAUDE.md se aplica (site alheio, stack alheia).
- Específicas desta demanda: (a) "HTML puro" e "captado pelo Intercom" são
  **incompatíveis** no formulário — o hook só vê Elementor Pro Form; (b) CSS do bloco
  precisa sobreviver ao CSS do tema/Elementor (reset/escopo por classe própria, nada
  de seletor genérico `p`/`h2` solto); (c) `raw.githubusercontent.com` serve com
  `content-type` correto para imagem, mas sem CDN — conferir peso das imagens
  exportadas do Figma.

## Diretriz do dono para o plano

- O dono pediu **pelo menos 5 executores** nesta demanda, por perfeição e velocidade.
  O GESTOR fatia como quiser, mas o piso é 5 — respeitando a regra 3: cada track com
  **escopo disjunto** e **VERIFY executável**, merge serial com gate. Track sem VERIFY
  não nasce só para cumprir cota; se o fatiamento honesto não render 5 tracks de
  código, completar com tracks de verificação/QA (ex.: comparação pixel a pixel por
  seção, auditoria de assets/peso, prova do contrato do formulário) — não com escopo
  sobreposto.

## Perguntas abertas para o GESTOR

1. **Arquitetura do formulário** — **DECIDIDO pelo GESTOR (2026-09-01): opção (a)** —
   página em 3 widgets HTML + **widget nativo Elementor Pro Form** estilizado via CSS
   escopado (`.lpb-form-widget`). É a única arquitetura que o hook do Intercom capta;
   form HTML puro não dispara `elementor_pro/forms/new_record`. A opção (b) fica
   arquivada como contingência (dependeria da pendência 4).
2. **Entrega e acesso:** não há acesso ao wp-admin da Scooto registrado. O entregável
   é bloco(s) HTML + passo a passo de montagem para o dono colar, ou ele fornece
   acesso? Qual a URL final da página (necessária para o VALIDAR-LIVE)? — **PENDENTE
   do dono.** Default assumido: entregável = blocos + `MONTAGEM.md` (dono cola).
3. **Repo das imagens:** criar público novo — em qual conta? — **PENDENTE do dono.**
   Default assumido: `rafa-bulgarelli/lp-black-scooto-assets` (a conta que já opera
   este repo via `gh`). Só bloqueia a etapa de publicação dos assets, não as tracks.
4. **E-mail do fallback** (se cair na opção b): `analu@scooto.co` ou outro? —
   **PENDENTE do dono**, mas só relevante se (a) falhar; não bloqueia nada.
5. **Nome exato do formulário:** — **PENDENTE do dono.** Default assumido:
   **"Formulário LP Black"** (já gravado no pack da track D e no contrato).

## Conteúdo suspeito

- O script PHP colado pelo dono contém um **Bearer token da API do Intercom** e foi
  exposto no chat. O token NÃO foi copiado para este card nem deve entrar em pack,
  commit ou repo de imagens. Recomendação registrada ao dono: **rotacionar o token**
  no painel do Intercom. Nenhuma instrução embutida dirigida ao agente foi
  identificada no conteúdo colado.

---
<!-- Preenchido pelo GESTOR -->
## Plano

Tudo desta entrega vive em **`entregas/lp-black-scooto/`** — fora de `src/`, fora do
content glob do Tailwind (`./index.html`, `./src/**`), fora dos includes dos três
`tsconfig` e fora do vite/prerender: o build do site não enxerga o diretório (provado
lendo os globs em 2026-09-01; o VERIFY da track E reprova `pnpm build` regressivo).

- **Prelude (sequencial):**
  - **P0 `prelude-lp-black-figma` — EXECUTADO PELO ASSENTO (sessão principal), não
    por agente**: só a sessão principal tem o MCP do Figma. Extrai frame `1-3`
    (`get_metadata` + `get_screenshot` do frame e de cada seção + `get_design_context`)
    e grava `figma/` (PNGs + design-context.md) e `assets/` (imagens de conteúdo,
    ≤ 400 KB). PR + merge com OK do dono.
  - **P1 `prelude-lp-black-contratos` — executor 1**: `contrato.md` (fatiamento
    seções→blocos, tokens, tabela de imagens com URL final, links permitidos,
    contrato do form SEM token) + harness `verify/servir.mjs` (preview local, reescreve
    RAW_PREFIX→/assets/, porta estrita) + `verify/checar-bloco.mjs` (zero JS, prefixo
    `.lpb-`, imagens só do RAW_PREFIX, Sora, âncoras, grep de segredo) + fixtures.
- **Tracks (paralelas após P1, arquivos DISJUNTOS, 4 simultâneas):**
  - **A `track-lpb-bloco-topo`** (executor 2) → `blocos/bloco-a-topo.html`
  - **B `track-lpb-bloco-meio`** (executor 3) → `blocos/bloco-b-meio.html`
  - **C `track-lpb-bloco-final`** (executor 4) → `blocos/bloco-c-final.html`
  - **D `track-lpb-form`** (executor 5) → `form/configuracao-form.md` + `form/form.css`
    + `form/form-mock.html`
  - **E `track-lpb-qa`** (executor 6, roda DEPOIS da fila serial A–D) →
    `verify/qa-pixel.mjs` + `verify/qa-assets.mjs` + `MONTAGEM.md` + `qa/**`
  - Piso de 5 executores do dono: **6 executores** (P1, A, B, C, D, E), teto de 4
    simultâneos respeitado (A–D).
- **Packs:** `.claude/tower/packs/prelude-lp-black-figma.md` (assento — NÃO spawnar)
  · `prelude-lp-black-contratos.md` · `track-lpb-bloco-topo.md` ·
  `track-lpb-bloco-meio.md` · `track-lpb-bloco-final.md` · `track-lpb-form.md` ·
  `track-lpb-qa.md`
- **Sequência de merge (serial, PR + /review do collector + OK do dono em cada):**
  1. P0 — gate: PNGs válidos, sem segredo, diff só em `figma/`+`assets/`.
  2. P1 — gate: VERIFY colado (autoteste do harness), collector.
  3. A → 4. B → 5. C → 6. D — gate de cada um: VERIFY colado (checar-bloco exit 0,
     mobile-shot 390 sem overflow, diff restrito ao SCOPE) + gate VISUAL do assento
     (print 1440 lado a lado com `figma/secao-*.png`) + collector + watchdog limpo.
  7. **Assento (com OK do dono):** cria o repo público de assets (default
     `rafa-bulgarelli/lp-black-scooto-assets`, pendência 3), publica `assets/`,
     confere `curl -sI` (200 + content-type de imagem) em cada URL.
  8. E — gate: qa-pixel ≤ 20% por alvo + diffs PNG para inspeção, qa-assets verde
     (sem `--local` se o passo 7 já ocorreu), `pnpm build` ok, página completa sem
     overflow a 390.
  9. Montagem no WordPress conforme `MONTAGEM.md` (dono cola, ou acesso — pendência 2).
- **VALIDAR-LIVE (na URL publicada da Scooto — pendência 2):**
  - *Visitante desktop (~1440):* página lado a lado com `figma/frame-completo.png`;
    fonte computada = Sora; Network sem 404 e todas as imagens de
    `raw.githubusercontent.com`; cada CTA leva ao formulário; view-source dos blocos
    sem `<script`.
  - *Visitante mobile (~390):* `node .claude/tower/bin/mobile-shot.mjs <url> 390` →
    `scrollWidth == clientWidth`, sem overflow; leitura digna.
  - *Operador:* envio de teste (nome "TESTE TORRE <data>") → confirmação na tela;
    wp-admin → Elementor → Submissions mostra a entrada sob "Formulário LP Black";
    Intercom mostra contato + ticket "Novo lead da LP - TESTE TORRE <data>" com os 6
    campos (UTMs se os cookies existirem). Depois: apagar a submissão de teste e
    fechar o ticket — teste não vira lead.
  - Pendência de segurança reiterada ao dono: **rotacionar o Bearer token do
    Intercom** exposto no chat.
