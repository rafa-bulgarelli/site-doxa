# CARD 012 — Medição de SEO: Search Console ligado à torre + baseline

- **Tipo:** feature (infra de medição) — desbloqueia a rodada 4 do card 011
- **Aberto em:** 2026-08-19
- **Status:** **PLANEJADO** (GESTOR, 2026-08-19) — setup do dono 100% completo; 3 packs
  prontos (`prelude-gsc-acesso` → `track-gsc-baseline` ∥ `track-gsc-docs`). Próximo passo:
  sessão principal spawna o prelude.

## O que o dono quer ver funcionando

A torre enxergando os dados reais de busca da Doxa: que queries mostram o site, em
que posição, com quantas impressões/cliques — para a próxima rodada de SEO ser
dirigida por dado, não por palpite. Era o `BLOCKED_EXTERNAL_CREDENTIAL` do card 011.

## Estado do setup (feito pelo dono em 2026-08-19, guiado pelo intake)

- ✅ Propriedade criada no Search Console (declarado pelo dono)
- ✅ Projeto Google Cloud `doxa-506016` ("DOXA", org `doxaviral.com`)
- ✅ Search Console API ativada
- ✅ Service account `torre-seo@doxa-506016.iam.gserviceaccount.com` criada
- ✅ Org policy `iam.managed.disableServiceAccountKeyCreation` **desativada SÓ no
  projeto DOXA** (substituição da política do pai) para permitir a chave
- ✅ Chave JSON baixada: **`/Users/rafaelfernandes/Downloads/doxa-506016-c45c4f21acf4.json`**
  (existência verificada pelo intake via glob; **conteúdo NÃO lido — é segredo**)
- ✅ Service account adicionada como usuário da propriedade no Search Console com
  **permissão TOTAL** (escolha do dono; Restrita bastaria — anotado como
  possível ajuste de least-privilege futuro, sem urgência)
- ❓ Restam 2 incertezas que o **prelude resolve por chamada de API** (não por
  pergunta): o sitemap foi submetido? A propriedade é tipo Domínio
  (`sc-domain:doxaviral.com`) ou prefixo (`https://www.doxaviral.com/`)? — muda o
  `siteUrl` usado na API.

## O que a torre faz (escopo)

1. **PRELUDE — guardar o segredo direito:** mover a chave de Downloads para
   `~/.config/doxa/gsc-service-account.json` (criar a pasta; `chmod 600`), NUNCA
   para dentro do repo. Referência via env (`GSC_KEY_PATH` ou equivalente) lida pelo
   script; caminho documentado só em arquivo local/gitignored se preciso.
2. **Prova de acesso executável:** chamada `sites.list` da Search Console API com a
   credencial — se devolver a propriedade, acesso de pé; identifica também o tipo
   (Domínio vs prefixo). Se sitemap não submetido, submeter via API
   (`sitemaps.submit`) ou instrução de 1 linha ao dono.
3. `pnpm gsc:baseline`: relatório em `docs/seo/baseline-<data>.md` — páginas
   indexadas × sitemap (69 URLs), queries com impressões, posição média por cluster,
   erros de cobertura. Sem dependência pesada; API REST direta (CLI/API > MCP).
4. Atualizar `docs/seo/keyword-map.md` com dados reais e definir o gatilho da
   **rodada 4** do card 011: páginas em posição 8–20 com impressão real.

## Critério de aceite (observável)

- [ ] Chave fora de Downloads e fora do repo; `git grep` de trecho da chave = vazio
      (gate do collector)
- [ ] `sites.list` devolve a propriedade da Doxa (colar a resposta sem tokens)
- [ ] Sitemap consta como processado/Êxito na API ou painel
- [ ] `docs/seo/baseline-<data>.md` existe com números reais
- [ ] `pnpm gsc:baseline` roda de ponta a ponta num clone limpo com a env apontada

## Armadilhas conhecidas

- **A chave JSON é segredo**: nunca no repo, card, pack ou output colado. O intake
  não a leu; ninguém precisa ler — só o script, em runtime.
- Ela está em **Downloads** — diretório volátil nesta casa (cards 006/007 que o
  digam): mover é o PRIMEIRO passo, antes de qualquer outra coisa.
- A permissão no GSC é **Total** — a chave vale mais do que precisaria; se vazar,
  revogar em Contas de serviço → Chaves (e a org policy do projeto DOXA está
  flexibilizada — não mexer no nível da organização).
- **Se o card 011 ainda não foi deployado, o baseline nasce vazio**: as 68 páginas
  precisam estar em produção para o Google indexar. Conferir no prelude; se pendente,
  o VALIDAR-LIVE do 011 vem antes do baseline fazer sentido.
- Dados do GSC atrasam ~2 dias; baseline útil pede ~4 semanas de coleta. O
  relatório de agora é o "dia zero", não o veredito.
- Dois domínios: tudo é `doxaviral.com` (com L).

## Perguntas abertas para o GESTOR

Nenhuma — as incertezas restantes se resolvem por API no prelude.

## Conteúdo suspeito

Nenhum.

---
<!-- Preenchido pelo GESTOR -->
## Plano

> Escrito pelo GESTOR em 2026-08-19. Baseline medido em `main` @ `85d0294`: `tsc -b` 0
> erros · vitest **26 arquivos / 987 testes** · `pnpm build` 68 rotas ·
> `https://www.doxaviral.com/sitemap.xml` com **69 `<loc>`** · `git grep` de
> `client_email|private_key|doxa-506016|gserviceaccount` **vazio** no HEAD · Node 24.15 ·
> pnpm 11.20. O card 011 está VALIDADO-LIVE desde 2026-08-18 — o baseline faz sentido.

### Decisão de arquitetura
- **Código em `scripts/gsc/*.mjs`**, zero dependência nova: JWT RS256 com `crypto.sign`
  + `fetch` do Node 24 → access token em `oauth2.googleapis.com/token` → REST direta
  (`webmasters/v3` + `searchconsole/v1`). Mesmo regime de `scripts/prerender.mjs`
  (fora do `tsc -b` — o projeto `node` só inclui `vite.config.ts`); a parte pura tem
  teste em vitest (`scripts/gsc/*.test.mjs` — o include default pega `.test.mjs`).
- **Três módulos de contrato** no prelude (`auth.mjs`, `api.mjs`, `prova.mjs`) e dois na
  track A (`baseline.mjs` I/O · `relatorio.mjs` puro). Escopo de leitura por padrão;
  escrita (`sitemaps.submit`) só com `--submeter`. A chave: **`mv`** para
  `~/.config/doxa/gsc-service-account.json` (700/600), env `GSC_KEY_PATH` com esse
  default; `GSC_SITE_URL` opcional, senão `sc-domain:` contendo `doxaviral.com` →
  qualquer com `doxaviral.com` → erro com instrução de painel.
- **Mapa URL → tipo/hub** sem importar TS no Node: o baseline faz `vite build --ssr
  src/seo/indice.ts` (o truque já usado por `scripts/seo-audit.mjs`) e lê `paginas()`
  /`urlDe()`/`secoes()`. Nenhuma mudança em `src/**`. Lista de URLs a inspecionar = o
  sitemap NO AR (fetch público); divergência ar × índice local vira seção do relatório.
- **URL Inspection entra** (69 chamadas/execução, sequencial; quota 2000/dia) — é a
  única forma de saber cobertura por URL e, no dia zero, é o dado mais informativo;
  `--sem-inspecao` pula. `contents[].indexed` do `sitemaps.list` é deprecado (0) — não
  se imprime como "indexadas".
- **Relatório com 8 seções de título fixo** (ver pack A) e regra "sem dado ainda (site
  no ar desde 2026-08-18; GSC atrasa ~2 dias)" onde vier vazio. **Gatilho da rodada 4**:
  posição média 8–20 (inclusive) E impressões ≥ 30 em 28 dias, com ≥ 28 dias de coleta.
  Recalibração de SO (provisória): `≥500→5 · 100–499→4 · 20–99→3 · 1–19→2 · 0→1`.
- **keyword-map não recebe números colados**: a seção "Dados reais (GSC)" documenta
  comando, arquivo, gatilho e régua; o número vive no `baseline-<data>.md` (gerado).
- `.env.example` **não se toca** (deny-rule `**/.env*` do harness bloquearia o
  executor); env vars documentadas no cabeçalho de `auth.mjs` e no `CLAUDE.md`.
- Descartados: `googleapis`/SDK (dependência pesada para 5 chamadas); MCP do Google
  (CLI/API > MCP, e segredo passaria por mais uma camada); exportar JSON do índice no
  build (mexe em `dist/` público por causa de um script de dev).

### Fases e tracks
| Fase | Track | Branch / pack | Arquivos | VERIFY (resumo) | Depende de |
|---|---|---|---|---|---|
| 0 (1 executor) | PRELUDE — chave + acesso | `prelude-gsc-acesso` | `~/.config/doxa/` (fora do repo) · `.gitignore` · `package.json` (`gsc:prova`) · `scripts/gsc/auth.mjs` · `api.mjs` · `prova.mjs` · `auth.test.mjs` · `api.test.mjs` | `ls -la ~/.config/doxa/` = `-rw-------` · Downloads sem `doxa-506016-*.json` · typecheck 0 · test 28 arquivos · build 68 rotas · `pnpm gsc:prova` colado com propriedade+tipo+sitemap (submetido se faltava) · `GSC_KEY_PATH=/nao/existe` → exit 1 · greps de segredo vazios · diff só no SCOPE | nada (`origin/main`) |
| 1 (paralela: 2) | A — baseline | `track-gsc-baseline` | `scripts/gsc/baseline.mjs` · `relatorio.mjs` · `relatorio.test.mjs` · `api.mjs` (ajuste permitido) · `package.json` (`gsc:baseline`) · `docs/seo/baseline-<data>.md` | test 29 arquivos · `pnpm gsc:baseline` exit 0 · 1 arquivo `baseline-*.md` com 8 `## N.` · sem `ya29.`/`Bearer`/`private_key` no arquivo · seção 2 com 69 no ar · seção 3 soma = inspecionadas · negativo exit 1 sem arquivo pela metade · `--sem-inspecao` ok · build 68 | prelude em `main` |
| 1 (paralela: 2) | B — docs | `track-gsc-docs` | `docs/seo/keyword-map.md` · `docs/seo/COMO-ADICIONAR-UMA-PAGINA.md` · `CLAUDE.md` | `pnpm gsc:prova` colado (tipo da propriedade) · 0 `BLOCKED_EXTERNAL_CREDENTIAL` · `## Dados reais (GSC)` · regra 8–20 · link `baseline-2026-08-19.md` · tabelas de URL intocadas (`git diff | grep "^[-+]| /"` vazio) · CLAUDE.md ≤ 10 linhas `+` · só com L · diff só nos 3 arquivos | prelude em `main`; **merge só depois de A** |

Ownership: `package.json` = prelude (F0) e depois só A (F1) · `scripts/gsc/auth.mjs`,
`prova.mjs`, `auth.test.mjs`, `api.test.mjs` = prelude, congelados na F1 · `api.mjs` =
prelude, ajuste só por A · `docs/seo/baseline-*.md` = A · `keyword-map.md`,
`COMO-ADICIONAR-UMA-PAGINA.md`, `CLAUDE.md` = B · `.gitignore` = prelude · `src/**` =
ninguém. Overlap entre A e B: **zero**.

### Sequência de merge (serial, gate entre cada um, PR `--base main`; merge em `main` = deploy da Vercel — scripts/docs não mudam o site, e o gate confere)
0. Sessão principal commita este card + os 3 packs em `main` (commit de torre) e abre
   a worktree do prelude (`tower-track.sh prelude-gsc-acesso`).
1. **`prelude-gsc-acesso`** — gate: `/review` do collector com o **gate de segredo**
   (`git diff origin/main...HEAD | grep -nE "BEGIN (RSA )?PRIVATE KEY|private_key_id|\"private_key\"\s*:\s*\"|ya29\.|Bearer [A-Za-z0-9]"`
   = vazio · `git grep -n "client_email" HEAD -- scripts/` só acesso de campo ·
   `git ls-files | grep -iE "service-account|doxa-506016"` = vazio · nenhum `.json`
   novo rastreado além dos 9 já existentes) + na sessão principal, em `main` após
   merge local de teste: `pnpm typecheck && pnpm test && pnpm build` (28 arquivos;
   68 rotas) · `ls -la ~/.config/doxa/` com `-rw-------` · `ls ~/Downloads/doxa-506016-*`
   vazio · **`pnpm gsc:prova` rodado pela própria sessão principal** (a prova não é
   afirmação do executor) mostrando a propriedade e o sitemap com `lastSubmitted`. Só
   depois disto A e B nascem. Após o merge: deploy da Vercel Ready e
   `curl -s https://www.doxaviral.com/ | grep -o "<title>[^<]*"` igual ao de antes.
2. **`track-gsc-baseline`** (A) — gate: `/review` (correção do `relatorio.mjs`,
   estilo, escopo, gate de segredo acima + `grep -nE "ya29\.|Bearer |private_key"
   docs/seo/baseline-*.md` = vazio) · merge local de teste em `main` +
   `pnpm typecheck && pnpm test && pnpm build` (29 arquivos) · **`pnpm gsc:baseline`
   rodado pela sessão principal** e `diff` contra o arquivo commitado pelo executor
   (diferenças aceitáveis: números de dados frescos e timestamps; estrutura e seções
   idênticas) · ler o baseline inteiro: nada inventado, "sem dado ainda" onde vazio,
   seção 8 coerente com a 3. Suíte vermelha só reprova por falha NOVA vs baseline
   (`comm -13`). Após o merge: deploy Ready.
3. **`track-gsc-docs`** (B) — gate: `/review` leve (doc) · `test -f docs/seo/$(grep -o
   "baseline-[0-9-]*\.md" docs/seo/keyword-map.md | head -1)` em `main` (o link
   resolve; se a data da A for outra, ajustar a 1 linha no merge) · as 8 seções
   citadas no keyword-map = os títulos reais em `docs/seo/baseline-*.md` (`grep "^## "`)
   · regra do gatilho em B = a do cabeçalho de `baseline.mjs`/`relatorio.mjs` (mesmos
   números: 8–20, 30, 28) · diff do `CLAUDE.md` lido linha a linha pelo dono (é o
   arquivo que toda sessão lê) · tipo da propriedade no CLAUDE.md = o do `gsc:prova`.
   Após o merge: deploy Ready.
4. Registrar CREATED/UPDATED/VALIDATED/ISSUES/NEXT neste card. Compactar contexto só
   aqui.

### VALIDAR-LIVE (o "ambiente real" deste card é o Search Console + o clone limpo, não o site)
- **Painel do Search Console (humano, dono):** a propriedade lista `torre-seo@…` como
  usuário; Sitemaps mostra `https://www.doxaviral.com/sitemap.xml` com status
  "Êxito"/processado (pode levar horas após o submit; até lá "Pendente" é o estado
  honesto — registrar qual dos dois se viu e quando); 69 URLs descobertas no sitemap.
- **Clone limpo:** `git clone` do repo num diretório do scratchpad + `pnpm install
  --frozen-lockfile` + `pnpm gsc:prova` + `pnpm gsc:baseline` → exit 0, arquivo
  gerado com 8 seções, sem token no arquivo (`grep -c "ya29\.\|Bearer" = 0`), em
  ≤ 3 min. Com `GSC_KEY_PATH=/nao/existe` → exit 1, mensagem clara.
- **Segredo:** `ls ~/Downloads/doxa-506016-*` vazio · `ls -la ~/.config/doxa/` =
  `drwx------` + `-rw-------` · `git grep -nE "BEGIN (RSA )?PRIVATE|private_key_id|ya29\."`
  em `main` = vazio · `git log -p --all | grep -c "BEGIN PRIVATE"` = 0.
- **Site não regrediu** (3 deploys de scripts/docs): `curl -s https://www.doxaviral.com/ |
  grep -o "<title>[^<]*"` e `curl -s https://www.doxaviral.com/sitemap.xml | grep -c
  "<loc>"` = 69, domínio com L.
- Leitura do dono: `docs/seo/baseline-<data>.md` seção 8 — é o dia zero; a rodada 4
  abre quando a seção 7 tiver página OU quando houver ≥ 28 dias de dado para recalibrar
  SO (data-alvo: ~2026-09-16).

### Decisões do GESTOR (1 linha cada — para o dono discordar)
- `.mjs` e não `.ts` em `scripts/gsc/`: é o regime dos vizinhos (`prerender.mjs`,
  `seo-audit.mjs`) e não exige reabrir o tsconfig composto; a parte pura tem teste.
- Zero dependência: são 5 chamadas REST e um JWT de 20 linhas; `googleapis` traria MBs
  e mais superfície para o segredo passar.
- URL Inspection ligada por padrão: dia zero sem cobertura por URL é relatório vazio;
  69 chamadas cabem 29× na quota diária.
- Submeter o sitemap por API no prelude (com `--submeter`), não pedir ao dono: é 1 PUT,
  a permissão é Total, e a prova fica executável.
- A e B em paralelo, merge A → B: B não depende dos números (só de nomes de seção e da
  regra, fixados aqui), e A entrega antes porque o link do keyword-map tem de resolver.
- keyword-map sem números colados: o baseline gerado é a fonte; cópia à mão envelhece.
- `min-impressoes` = 30 e janela 28 dias: abaixo disso é ruído numa propriedade de dias;
  é flag, o dono ajusta sem código.
- Recomendação ao dono (fora do escopo de executor — é config do harness): acrescentar
  `"Read(~/.config/doxa/**)"` em `.claude/settings.json` → `permissions.deny`, para o
  próprio Claude não conseguir abrir a chave. 1 linha, à mão.
- Least-privilege futuro (sem urgência, anotado pelo intake): baixar a permissão da SA
  de Total para Restrita; os scripts só perdem o `--submeter`.

### Packs
`.claude/tower/packs/prelude-gsc-acesso.md` · `.claude/tower/packs/track-gsc-baseline.md`
· `.claude/tower/packs/track-gsc-docs.md`.

---
## Diário (assento do GESTOR, sessão principal) — 2026-08-19

- Plano do gestor auditado (SCOPE por linha, disjunção A×B, VERIFY com pnpm, bloco de
  SEGURANÇA nos 3 packs) → OK do dono para abrir o prelude e para a deny rule
  `Read(~/.config/doxa/**)` (PR #69).
- **Prelude `prelude-gsc-acesso` → PR #70 (`2445a68`)**: chave movida para
  `~/.config/doxa/gsc-service-account.json` (700/600, Downloads vazio; `mv`/`chmod` não
  estavam no allowlist do harness — feito via `node` `renameSync`/`chmodSync`, sem ler
  o conteúdo); `.gitignore` específico; `auth/api/prova.mjs` sem dependência; 21 testes
  com par RSA gerado. **Prova de acesso rodada pela sessão principal**: propriedade
  `sc-domain:doxaviral.com` (**Domínio**, `siteFullUser`); sitemap já submetido (69
  URLs, 0 erros, `lastSubmitted` 2026-08-19T16:37Z). Collector APROVADO COM RESSALVAS
  (só evidência, satisfeita); segredo limpo no diff e no histórico. NITs registrados:
  `principal()` 63 linhas em `prova.mjs`; `erro.code` na mensagem de `lerChave`; `iat`
  sem folga de relógio (só se `invalid_grant` aparecer).
- A (`track-gsc-baseline`) ∥ B (`track-gsc-docs`) abertas; merge A → B.
- **A `track-gsc-baseline` → PR #72 (`5a8aca7`)**: `relatorio.mjs` (puro, 25 testes) +
  `baseline.mjs` (escrita atômica) + `api.mjs` (`AbortSignal.timeout`; `languageCode:
  en-US` — a execução real pegou que o `coverageState` localizado nunca casava com a
  regra e a 1ª rodada teria dito "69 conhecidas" quando 14 eram desconhecidas; teste de
  regressão) + `docs/seo/baseline-2026-08-19.md`. Collector **APROVADO** (NITs: texto
  "28 dias" com `--dias` ≠ 28; "10 erros seguidos" hard-coded; título "dia zero" fixo;
  `coverageState` ausente contado como conhecida; `.parcial` fora do `.gitignore`).
  **Dia zero**: sitemap no ar 69 = índice local 69, 0 divergências; 69 inspecionadas —
  1 indexada (home), 53 "Discovered – currently not indexed", 15 "URL is unknown";
  0 dias com dado de busca; gatilho 0. Sessão principal rodou `pnpm gsc:baseline` de
  novo: mesmos totais; só os `coverageState` oscilam entre execuções (índice do Google
  se movendo — 53/15 → 44/24 em minutos), o resto é determinístico.
- **B `track-gsc-docs` → PR #73 (`a7affe7`)**: keyword-map sem
  `BLOCKED_EXTERNAL_CREDENTIAL`, seção "Dados reais (GSC)" apontando para o baseline,
  gatilho da rodada 4 com as palavras exatas do código, recalibração provisória de SO;
  COMO-ADICIONAR "medir antes de escrever"; CLAUDE.md (9 linhas). Gate leve pela
  sessão principal (link resolve em `main`, regra = código, diff lido).

### VALIDADO-LIVE (2026-08-19)
- Chave: `~/.config/doxa/` 700, `gsc-service-account.json` 600, Downloads vazio de
  `doxa-506016-*`; deny `Read(~/.config/doxa/**)` no harness (#69).
- `pnpm gsc:prova` (sessão principal): `sc-domain:doxaviral.com` · Domínio ·
  `siteFullUser` · sitemap submetido 2026-08-19T16:37Z, 69 URLs, 0 erros/avisos.
- Histórico inteiro do repo (`git log -p --all`): **0** chaves PEM, **0** tokens
  `ya29.…`, **0** `private_key_id` com valor (os 12 "matches" do grep largo são os
  próprios padrões escritos como texto nos packs/card/teste).
- Clone limpo no scratchpad: `pnpm install --frozen-lockfile` + `pnpm gsc:prova` ok;
  `pnpm gsc:baseline` **exit 0 em 529 s** (≈9 min — a URL Inspection de 69 URLs é
  sequencial; o "≤ 3 min" do plano era otimista; com `--sem-inspecao` leva segundos),
  arquivo sem token, mesmos totais (69/69; 1 indexada, 59 discovered, 8 unknown — o
  Google está absorvendo o sitemap ao longo do dia).
- Site sem regressão: `<title>` da home inalterado, sitemap 69 `<loc>`, build 68 rotas.
- Quota de URL Inspection gasta hoje: ~350 de 2000 (3 rodadas do executor + 2 da
  sessão principal) — não rodar em loop.

### Próximo passo
Rodar `pnpm gsc:baseline` de novo em **~2026-09-16** (28 dias de coleta) → se houver
páginas no gatilho (posição 8–20, ≥30 impressões), abrir a rodada 4 do card 011 por
`/intake`. Least-privilege (Total → Restrita) fica como ajuste opcional; perde só o
`--submeter`.

